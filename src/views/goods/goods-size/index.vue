<template>
  <div class="app-container">
    <!-- 搜索框 -->
    <div style="margin-top: 15px">
      <el-input
        placeholder="请输入要添加的尺码"
        v-model="input"
        class="input-with-select sizeAddInput"
      >
      </el-input>
      <el-button type="primary" style="margin-left: 10px" @click="addSize"
        >添加</el-button
      >
    </div>
    <!-- 表格 -->
    <el-table :data="data" style="width: 100%" border>
      <el-table-column prop="date" label="序号" width="60" align="center">
        <template slot-scope="scope">{{ scope.$index + 1 }}</template>
      </el-table-column>
      <el-table-column prop="title" label="尺码" align="center">
        <template slot-scope="scope">{{ scope.row.size }}</template>
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
              @click="editSize(scope.row)"
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
              @click="deleteSize(scope.row)"
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 编辑尺码 -->
    <el-dialog title="编辑尺码" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="尺码名称">
          <el-input v-model="form.size"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmEditSize">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  findAllSize,
  addNewSize,
  deleteSizeById,
  findSizeById,
  updateSize,
} from "@/api/size";
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
        size: "",
      },
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      this.listLoading = true;
      findAllSize().then((res) => {
        this.listLoading = false;
        this.data = res.data.rows;
        console.log(res.data);
      });
    },
    // 添加尺码分类
    addSize() {
      if (this.input) {
        addNewSize({ size: this.input }).then(() => {
          this.fetchData();
          this.$message.success("添加分类成功");
        });
      } else {
        this.$message.error("分类名称不能为空");
      }
    },
    // 编辑尺码分类
    editSize({ id }) {
      // 1. 回填到表单    2. 打开 dialog
      findSizeById(id).then((res) => {
        this.form.id = res.data.id;
        this.form.size = res.data.size;
        this.dialogFormVisible = true;
      });
    },
    // 确认编辑尺码分类
    confirmEditSize() {
      updateSize(this.form.id, { size: this.form.size }).then(() => {
        this.fetchData();
        this.$message.success("更新尺码成功");
        this.dialogFormVisible = false;
      });
    },
    // 删除尺码
    deleteSize({ id }) {
      for (let i = 0; i < this.data.length; i++) {
        if (this.data[i].id === id) {
          if (this.data[i].goodsCount === 0) {
            this.$confirm("确认删除此尺码？", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning",
            }).then(() => {
              deleteSizeById(id).then(() => {
                this.fetchData();
                this.$message.success("删除成功");
              });
            });
          } else {
            this.$message.warning(
              "该尺码下有服装存在，不允许删除，如果要删除改尺码，请先删除对应服装"
            );
          }
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.sizeAddInput {
  width: 400px;
  margin-bottom: 20px;
}
</style>
