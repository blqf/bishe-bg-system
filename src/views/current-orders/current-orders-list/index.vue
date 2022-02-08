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
          <span slot="reference">{{ scope.row.goodsName }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="title" label="顾客姓名" width="150" align="center">
        <template slot-scope="scope">{{ scope.row.user_name }}</template>
      </el-table-column>

      <el-table-column prop="title" label="顾客电话" width="150" align="center">
        <template slot-scope="scope">{{ scope.row.user_phone }}</template>
      </el-table-column>

      <el-table-column prop="title" label="邮寄地址" align="center">
        <template slot-scope="scope">{{ scope.row.user_address }}</template>
      </el-table-column>

      <el-table-column label="操作" width="130" align="center">
        <template slot-scope="scope">
          <el-tooltip
            class="item"
            effect="dark"
            content="完成"
            placement="top"
            :hide-after="2000"
          >
            <el-button
              type="success"
              icon="el-icon-check"
              circle
              size="mini"
              @click="finishCurrentOrder(scope.row)"
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
              @click="deleteCurrentOrder(scope.row)"
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
import {
  findCurrentOrderList,
  deleteCurrentOrderById,
  finishCurrentOrderById,
} from "@/api/currentOrder";
import { server_URL } from "@/url-config";
import dayjs from "dayjs";

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
      server_URL: server_URL,
    };
  },

  methods: {
    fetchData() {
      this.isFetchingData = true;
      findCurrentOrderList(this.pageSize, this.currentPage).then((data) => {
        console.log(data);
        this.data = data.rows;
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
    // 删除服装
    deleteCurrentOrder(blogInfo) {
      this.$confirm("确认删除该订单？", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        deleteCurrentOrderById(blogInfo.id).then(() => {
          this.fetchData();
          this.$message({
            type: "success",
            message: "删除成功!",
          });
        });
      });
    },

    // 完成订单
    finishCurrentOrder(order) {
      this.$confirm("确认完成该订单？", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        const { id, user_id, goodId, user_name, user_sex, user_birthday } =
          order;
        finishCurrentOrderById(id, {
          user_id,
          goodId,
          user_name,
          user_sex,
          user_birthday: dayjs(user_birthday).valueOf(),
          sale_time: dayjs(new Date()).valueOf(),
        }).then((resp) => {
          if (resp.code === 0) {
            this.fetchData();
            this.$message({
              type: "success",
              message: "操作成功",
            });
          }
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
