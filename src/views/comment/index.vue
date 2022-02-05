<template>
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

      <el-table-column prop="title" label="对应顾客" width="150" align="center">
        <template slot-scope="scope">{{ scope.row.user_name }}</template>
      </el-table-column>

      <el-table-column prop="title" label="对应商品" width="150" align="center">
        <template slot-scope="scope">{{ scope.row.goods_name }}</template>
      </el-table-column>

      <el-table-column prop="title" label="评论内容" align="center">
        <template slot-scope="scope">
          <el-popover
            placement="top-start"
            width="300"
            trigger="hover"
            :content="scope.row.comment_content"
          >
            <span slot="reference" class="comment_content">{{
              scope.row.comment_content
            }}</span>
          </el-popover>
        </template>
      </el-table-column>

      <el-table-column prop="title" label="评论时间" width="250" align="center">
        <template slot-scope="scope">{{
          dayjs(scope.row.comment_date_time).format("YYYY-MM-DD HH:mm:ss")
        }}</template>
      </el-table-column>

      <el-table-column prop="title" label="评论星级" width="150" align="center">
        <template slot-scope="scope">{{
          scope.row.comment_level + "颗星"
        }}</template>
      </el-table-column>

      <el-table-column label="操作" width="130" align="center">
        <template slot-scope="scope">
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
              @click="deleteComment(scope.row)"
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
import { findCommentList, deleteCommentById } from "@/api/comment";

export default {
  data() {
    return {
      data: [], // 存储数据详情
      pageSize: 10, // 每一页显示的条数
      currentPage: 1, // 当前页码，默认进来是第一页
      totalPage: 0, // 总页数
      count: 0, // 数据总条数
      pagerCurrentPage: 1, // 分页栏当前页码
      isFetchingData: false,
    };
  },

  methods: {
    fetchData() {
      this.isFetchingData = true;
      findCommentList(this.pageSize, this.currentPage).then((data) => {
        console.log(data.rows);
        this.data = data.rows;
        this.count = data.count;
        this.totalPage = Math.ceil(data.count / this.pageSize);
        // 下面的 if 在删除的时候可能会触发，例如最后一页只有一条数据
        // 删除之后，总页码数就会减一，当前页码数就大于了总页码数，所以要做处理
        if (this.currentPage > this.totalPage) {
          this.currentPage = this.totalPage;
          this.fetchData();
        }
        this.isFetchingData = false;
      });
    },

    // 删除顾客
    deleteComment(customerInfo) {
      this.$confirm("确认删除该评论吗", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        deleteCommentById(customerInfo.id).then((resp) => {
          this.fetchData();
          this.$message({
            type: "success",
            message: "删除成功!",
          });
        });
      });
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

<style lang="scss" scoped>
.app-container {
  .comment_content {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
}
</style>
