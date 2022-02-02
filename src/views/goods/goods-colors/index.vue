<template>
  <div class="app-container">
    <!-- 搜索框 -->
    <div style="margin-top: 15px">
      <el-input
        placeholder="请输入要添加的颜色"
        v-model="input"
        class="input-with-select colorAddInput"
      >
      </el-input>
      <el-button type="primary" style="margin-left: 10px" @click="addColor"
        >添加</el-button
      >
    </div>
    <!-- 表格 -->
    <el-table :data="data" style="width: 100%" border>
      <el-table-column prop="date" label="序号" width="60" align="center">
        <template slot-scope="scope">{{ scope.$index + 1 }}</template>
      </el-table-column>
      <el-table-column prop="title" label="颜色" align="center">
        <template slot-scope="scope">{{ scope.row.color }}</template>
      </el-table-column>

      <el-table-column prop="title" label="服装数量" align="center">
        <template slot-scope="scope">{{ scope.row.goodsCount }}</template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="150">
        <template slot-scope="scope">
          <!-- 编辑按钮 -->
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
              @click="editColor(scope.row)"
            ></el-button>
          </el-tooltip>

          <!-- 删除按钮 -->
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
              @click="deleteColor(scope.row)"
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 编辑颜色 -->
    <el-dialog title="编辑颜色" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="颜色名称">
          <el-input v-model="form.color"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmEditColor">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  findAllColors,
  addNewColor,
  deleteColorById,
  findColorById,
  updateColor,
} from "@/api/color";
export default {
  data() {
    return {
      listLoading: false,
      input: "",
      data: [],
      dialogFormVisible: false,
      // 回填表单
      form: {
        id: "",
        color: "",
      },
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      this.listLoading = true;
      findAllColors().then((res) => {
        this.listLoading = false;
        this.data = res.data.rows;
        console.log(res.data);
      });
    },
    // 添加颜色分类
    addColor() {
      if (this.input) {
        addNewColor({ color: this.input }).then(() => {
          this.fetchData();
          this.$message.success("添加分类成功");
        });
      } else {
        this.$message.error("分类名称不能为空");
      }
    },
    // 编辑颜色分类
    editColor({ id }) {
      // 1. 回填到表单    2. 打开 dialog
      findColorById(id).then((res) => {
        this.form.id = res.data.id;
        this.form.color = res.data.color;
        this.dialogFormVisible = true;
      });
    },
    // 确认编辑颜色分类
    confirmEditColor() {
      updateColor(this.form.id, { color: this.form.color }).then(() => {
        this.fetchData();
        this.$message.success("更新颜色成功");
        this.dialogFormVisible = false;
      });
    },
    // 删除颜色
    deleteColor({ id }) {
      for (let i = 0; i < this.data.length; i++) {
        if (this.data[i].id === id) {
          if (this.data[i].goodsCount === 0) {
            this.$confirm("确认删除此颜色？", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning",
            }).then(() => {
              deleteColorById(id).then(() => {
                this.fetchData();
                this.$message.success("删除成功");
              });
            });
          } else {
            this.$message.warning(
              "该颜色下有服装存在，不允许删除，如果要删除改颜色，请先删除对应服装"
            );
          }
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.colorAddInput {
  width: 400px;
  margin-bottom: 20px;
}
</style>
