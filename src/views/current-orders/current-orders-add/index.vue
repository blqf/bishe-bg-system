<template>
  <div class="app-container">
    <!-- 顾客姓名 -->
    <div class="block">顾客姓名（这里暂时只允许旧顾客下单）</div>
    <el-select
      v-model="form.user_id"
      slot="prepend"
      placeholder="请选择旧顾客姓名"
      @change="change"
    >
      <el-option
        v-for="item in customers"
        :key="item.id"
        :label="item.user_name"
        :value="item.user_buy_num"
      ></el-option>
    </el-select>

    <!-- 电话 -->
    <div class="block">手机号</div>
    <div style="margin-bottom: 15px">
      <el-input v-model="form.user_phone" placeholder="请输入手机号"></el-input>
    </div>

    <!-- 地址 -->
    <div class="block">地址</div>
    <div style="margin-bottom: 15px">
      <el-input
        v-model="form.user_address"
        placeholder="请输入手机号"
      ></el-input>
    </div>

    <!-- 商品id -->
    {{ form.goods }}
    <div class="block">下单衣服</div>
    <el-select
      v-model="form.goodId"
      slot="prepend"
      placeholder="请选择衣服"
      @change="change"
    >
      <el-option
        v-for="item in goods"
        :key="item.id"
        :label="item.goods_name"
        :value="item.id"
        :disabled="!item.goods_stock"
      ></el-option>
    </el-select>

    <!-- 顾客性别 -->
    <div class="block">顾客性别</div>
    <el-select
      v-model="form.user_sex"
      slot="prepend"
      placeholder="请选择性别"
      @change="change"
    >
      <el-option
        v-for="(item, index) in ['女', '男']"
        :key="index"
        :label="item"
        :value="index"
      ></el-option>
    </el-select>

    <!-- 顾客年龄 -->
    <div class="block">顾客年龄</div>
    <div style="margin-bottom: 15px">
      <el-input
        v-model="form.user_birthday"
        placeholder="请输入年龄"
        type="number"
      ></el-input>
    </div>

    <div>
      <!-- 下单按钮 -->
      <el-button
        type="primary"
        style="margin-top: 15px"
        @click="handleAddOrder"
        >{{ btnContent }}</el-button
      >
    </div>
  </div>
</template>

<script>
import { findGoodsList } from "@/api/goods";
import { findCustomerList } from "@/api/finishOrder";
import { addCurrentOrder } from "@/api/currentOrder";
import dayjs from "dayjs";

export default {
  props: ["mode"],
  data() {
    return {
      id: "",
      form: {
        user_name: "",
        user_address: "",
        user_phone: "",
        goodId: "",
        user_id: "",
        user_sex: 1,
        user_birthday: "",
      },
      goods: [],
      customers: [],
      imageUrl: "",
      btnContent: "确认下单",
    };
  },
  methods: {
    handleAddOrder() {
      let obj = {
        user_name: this.form.user_name,
        user_address: this.form.user_address,
        user_phone: this.form.user_phone,
        goodId: this.form.goodId,
        user_id: this.form.user_id,
        user_sex: this.form.user_sex,
        user_birthday: this.form.user_birthday,
      };

      // 对象组装好以后，就提交给服务器
      if (
        obj.user_name &&
        obj.user_address &&
        obj.user_phone &&
        obj.goodId &&
        obj.user_id &&
        obj.user_sex &&
        obj.user_birthday
      ) {
        const reg = /^1[0-9]{10}$/;
        if (!reg.test(obj.user_phone)) {
          this.$message.info("手机号必须为11位，且以1开头");
          return;
        }
        obj.user_birthday = dayjs()
          .subtract(+obj.user_birthday, "year")
          .valueOf();
        addCurrentOrder(obj).then(() => {
          this.$router.push("/current-orders"); // 跳转到订单列表
        });
      } else {
        this.$message.info("请完善必填内容");
      }
    },
    change() {
      this.$forceUpdate();
    },
    handleUploadImage(data) {
      this.form.imgUrl = data.url;
    },
  },
  created() {
    // 一进来的时候，就需要拿取的数据
    findCustomerList().then((resp) => {
      console.log(resp.rows);
      this.customers = resp.rows;
    });
    findGoodsList().then((resp) => {
      console.log(resp);
      this.goods = resp.rows;
    });
  },
};
</script>

<style lang="scss" scoped>
.block {
  margin: 15px 0;
  font-weight: 100;
}
</style>
