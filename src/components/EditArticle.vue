<template>
  <div>
    <!-- 服装名称 -->
    <div class="block">名称</div>
    <div style="margin-bottom: 15px">
      <el-input v-model="form.name" placeholder="请输入服装名称"></el-input>
    </div>

    <!-- 服装价格 -->
    <div class="block">价格</div>
    <div style="margin-bottom: 15px">
      <el-input
        v-model="form.price"
        placeholder="请输入服装价格"
        type="number"
      ></el-input>
    </div>

    <!-- 服装描述 -->
    <div class="block">描述</div>
    <el-input type="textarea" v-model="form.description" :rows="6"></el-input>

    <!-- 服装头图 -->
    <Upload
      uploadTitle="图片"
      v-model="form.imgUrl"
      @input="handleUploadImage"
    />

    <!-- 尺寸 -->
    <div class="block">尺寸</div>
    <el-select
      v-model="form.sizeId"
      slot="prepend"
      placeholder="请选择服装尺寸"
      @change="change"
    >
      <el-option
        v-for="item in sizes"
        :key="item.id"
        :label="item.size"
        :value="item.id"
      ></el-option>
    </el-select>

    <!-- 颜色 -->
    <div class="block">颜色</div>
    <el-select
      v-model="form.colorId"
      slot="prepend"
      placeholder="请选择服装颜色"
      @change="change"
    >
      <el-option
        v-for="item in colors"
        :key="item.id"
        :label="item.color"
        :value="item.id"
      ></el-option>
    </el-select>

    <!-- 服装库存 -->
    <div class="block">库存</div>
    <div style="margin-bottom: 15px">
      <el-input
        v-model="form.stock"
        placeholder="请输入服装库存量"
        type="number"
      ></el-input>
    </div>

    <div>
      <!-- 发布按钮 -->
      <el-button
        type="primary"
        style="margin-top: 15px"
        @click="addArticleHandle"
        >{{ btnContent }}</el-button
      >
    </div>
  </div>
</template>

<script>
import Upload from "@/components/Upload.vue";
import { findAllSize } from "@/api/size";
import { findAllColors } from "@/api/color";
import { addNewGoods, updateGoods, findGoodsById } from "@/api/goods";

export default {
  props: ["mode"],
  components: {
    Upload,
  },
  data() {
    return {
      id: "",
      form: {
        name: "", // 服装名称
        price: "", // 服装价格
        description: "", // 服装的描述
        imgUrl: "", // 图片地址
        stock: "", // 库存
        sizeId: 1,
        colorId: 1,
      },
      sizes: [], // 存放服装尺码列表
      colors: [], // 存放服装颜色列表
      imageUrl: "", // 图片在服务器上面的地址
      btnContent: "确认添加",
    };
  },
  methods: {
    addArticleHandle() {
      let obj = {
        goods_name: this.form.name,
        goods_img_url: this.form.imgUrl,
        goods_description: this.form.description,
        goods_price: this.form.price,
        goods_stock: this.form.stock,
        colorId: this.form.colorId,
        sizeId: this.form.sizeId,
      };

      // 对象组装好以后，就提交给服务器
      if (
        obj.goods_name &&
        obj.goods_description &&
        obj.goods_price &&
        obj.goods_stock &&
        obj.colorId &&
        obj.sizeId &&
        obj.goods_img_url
      ) {
        if (this.mode === "add") {
          // 说明是要新增
          addNewGoods(obj).then(() => {
            this.$router.push("/goods"); // 跳转到服装列表
          });
        } else {
          // 说明是要编辑
          updateGoods(this.id, obj).then(() => {
            this.$router.push("/goods"); // 跳转到服装列表
            this.$message.success("修改成功");
          });
        }
      } else {
        this.$message.info("请完善必填内容");
      }
    },
    change() {
      this.$forceUpdate();
    },
    handleUploadImage(data) {
      console.log("修改路径");
      this.form.imgUrl = data.url;
    },
  },
  created() {
    // 一进来的时候，就需要拿取的数据
    findAllSize().then(({ data }) => {
      this.sizes = data.rows;
    });
    findAllColors().then(({ data }) => {
      this.colors = data.rows;
    });
    if (this.mode === "edit") {
      // 一进来的时候，就拿到传递过来的 id，根据这个 id 获取到这服装的内容，回填到表单
      this.id = this.$route.params.id;
      findGoodsById(this.id).then((data) => {
        // 接下来，将这个内容回填至表单
        this.form.name = data.goods_name;
        this.form.imgUrl = data.goods_img_url;
        this.form.description = data.goods_description;
        this.form.price = data.goods_price;
        this.form.stock = data.goods_stock;
        this.form.sizeId = data.sizeId;
        this.form.colorId = data.colorId;
      });
      this.btnContent = "确认修改";
    }
  },
};
</script>

<style lang="scss" scoped>
.block {
  margin: 15px 0;
  font-weight: 100;
}
</style>
