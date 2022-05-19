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

      <el-table-column prop="title" label="顾客姓名" align="center">
        <template slot-scope="scope">
          {{ scope.row.user_name }}
        </template>
      </el-table-column>

      <el-table-column prop="title" label="性别" width="250" align="center">
        <template slot-scope="scope">{{
          scope.row.user_sex ? "男" : "女"
        }}</template>
      </el-table-column>

      <el-table-column prop="title" label="年龄" width="150" align="center">
        <template slot-scope="scope">{{
          dayjs().diff(dayjs(scope.row.user_birthday), "y") + "岁"
        }}</template>
      </el-table-column>

      <el-table-column prop="title" label="购买次数" width="150" align="center">
        <template slot-scope="scope">{{ scope.row.buy_count }}</template>
      </el-table-column>

      <el-table-column prop="title" label="评论次数" width="150" align="center">
        <template slot-scope="scope">{{ scope.row.comment_count }}</template>
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
              @click="deleteCustomer(scope.row)"
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
import { findCustomerList, deleteCustomerById } from "@/api/finishOrder";

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
      findCustomerList(this.pageSize, this.currentPage).then((data) => {
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
    deleteCustomer(customerInfo) {
      this.$confirm("删除该顾客会将其评论与购买记录一并删除，确认删除吗", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteCustomerById(customerInfo.id).then((resp) => {
            console.log(resp);
            if (resp.code === 0) {
              this.fetchData();
              this.$message({
                type: "success",
                message: "删除成功",
              });
            } else {
              this.$message({
                type: "error",
                message: "删除失败，请重试",
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "error",
            message: "删除失败，请重试",
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

<style lang="scss" scoped></style>
