<template>
  <!-- 当前图片预览与循环预览有进行src判断 -->
  <div class="app-container">
    <!-- 数据表格 -->
    <el-table
      :data="data"
      style="width: 100%"
      border
      v-loading="isFetchingData"
    >
      <el-table-column prop="date" label="序号" width="60" align="center">
        <template slot-scope="scope">{{
          scope.$index + (currentPage - 1) * pageSize + 1
        }}</template>
      </el-table-column>

      <el-table-column prop="title" label="服装名称" width="150" align="center">
        <template slot-scope="scope">
          <el-popover
            placement="top-start"
            title="服装预览图"
            width="230"
            trigger="hover"
          >
            <el-image
              style="width: 200px"
              :src="
                scope.row.goods_img_url.includes('http://') ||
                scope.row.goods_img_url.includes('https://')
                  ? scope.row.goods_img_url
                  : server_URL + scope.row.goods_img_url
              "
              fit="contain"
              :preview-src-list="srcList"
            ></el-image>
            <span slot="reference">{{ scope.row.goods_name }}</span>
          </el-popover>
        </template>
      </el-table-column>

      <el-table-column prop="title" label="商品描述" width="250" align="center">
        <template slot-scope="scope">{{
          scope.row.goods_description
        }}</template>
      </el-table-column>

      <el-table-column prop="title" label="库存" width="150" align="center">
        <template slot-scope="scope">{{ scope.row.goods_stock }}</template>
      </el-table-column>

      <el-table-column prop="title" label="价格" align="center">
        <template slot-scope="scope">{{ scope.row.goods_price }}</template>
      </el-table-column>

      <el-table-column prop="title" label="颜色" align="center">
        <template slot-scope="scope">{{ scope.row.color }}</template>
      </el-table-column>

      <el-table-column prop="title" label="尺寸" align="center">
        <template slot-scope="scope">{{ scope.row.size }}</template>
      </el-table-column>

      <el-table-column label="操作" width="130" align="center">
        <template slot-scope="scope">
          <el-tooltip
            class="item"
            effect="dark"
            content="编辑"
            placement="top"
            :hide-after="2000"
          >
            <el-button
              type="primary"
              icon="el-icon-edit"
              circle
              size="mini"
              @click="editBlogHandle(scope.row)"
            ></el-button>
          </el-tooltip>

          <el-tooltip
            class="item"
            effect="dark"
            content="删除"
            placement="top"
            :hide-after="2000"
          >
            <el-button
              type="danger"
              icon="el-icon-delete"
              circle
              size="mini"
              @click="deleteGoods(scope.row)"
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页组件 -->
    <el-pagination
      style="margin-top: 30px"
      background
      :page-size="pageSize"
      :page-sizes="[5, 10, 20]"
      layout="prev, pager, next, total, ->, sizes, jumper"
      :total="count"
      :current-page.sync="pagerCurrentPage"
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      @prev-click="prevClickHandle"
      @next-click="nextClickHandle"
    >
    </el-pagination>
  </div>
</template>

<script>
import { deleteGoodsById, findGoodsList } from "@/api/goods";
import { server_URL } from "@/url-config";

export default {
  data() {
    return {
      data: [], // 存储数据详情
      srcList: [], // 预览图链接数组
      pageSize: 10, // 每一页显示的条数
      currentPage: 1, // 当前页码，默认进来是第一页
      totalPage: 0, // 总页数
      count: 0, // 数据总条数
      pagerCurrentPage: 1, // 分页栏当前页码
      isFetchingData: false,
      server_URL: server_URL,
    };
  },

  methods: {
    fetchData() {
      this.isFetchingData = true;
      findGoodsList(this.pageSize, this.currentPage).then((data) => {
        this.data = data.rows;
        for (var i of data.rows) {
          if (
            i.goods_img_url.includes("http://") ||
            i.goods_img_url.includes("https://")
          ) {
            this.srcList.push(i.goods_img_url);
          } else {
            this.srcList.push(server_URL + i.goods_img_url);
          }
        }
        this.count = data.count;
        this.totalPage = Math.ceil(data.count / this.pageSize);
        // 下面的 if 会在删除文 章的时候可能会触发，例如最后一页只有一条数据
        // 删除之后，总页码数就会减一，当前页码数就大于了总页码数，所以要做处理
        if (this.currentPage > this.totalPage) {
          this.currentPage = this.totalPage;
          this.fetchData();
        }
        this.isFetchingData = false;
      });
    },
    // 跳转到具体的商品
    // goToTitleHandle(goodsDetail) {
    //   window.open(`/article/${goodsDetail.id}`);
    // },
    // 删除商品
    deleteGoods(blogInfo) {
      this.$confirm(
        "删除该商品会将该商品下面的评论一并删除，是否继续?",
        "是否删除此商品",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).then(() => {
        deleteGoodsById(blogInfo.id).then((resp) => {
          this.fetchData();
          this.$message({
            type: "success",
            message: "删除成功!",
          });
        });
      });
    },

    // 编辑商品
    editBlogHandle(blogInfo) {
      this.$router.push(`/goods/goods-edit/${blogInfo.id}`);
    },
    // 分页相关事件
    sizeChangeHandle(pagerNum) {
      this.pageSize = parseInt(pagerNum);
      this.currentPage = 1;
      this.pagerCurrentPage = 1;
      this.fetchData();
    },
    currentChangeHandle(pageNum) {
      this.currentPage = parseInt(pageNum);
      this.fetchData();
    },
    prevClickHandle() {
      this.currentPage -= 1;
    },
    nextClickHandle() {
      this.currentPage += 1;
    },
  },
  created() {
    this.fetchData();
  },
};
</script>

<style lang="scss" scoped></style>
