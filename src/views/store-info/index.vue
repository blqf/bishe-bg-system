<template>
  <div class="app-container">
    <div class="block">商店名称</div>
    <div style="margin-bottom: 15px; width: 500px">
      <el-input v-model="form.storeName" disabled></el-input>
    </div>
    <div class="block">商店海报</div>
    <div style="margin-bottom: 15px">
      <el-image
        style="height: 200px"
        :src="serverUrl + form.storeImgUrl"
      ></el-image>
    </div>
    <div class="block">商店介绍</div>
    <div style="margin-bottom: 15px; width: 500px">
      <el-input v-model="form.storeDescription" disabled></el-input>
    </div>
    <el-button type="primary" @click="openEditPanel">进入编辑模式</el-button>

    <!-- 弹出层 -->
    <el-dialog
      title="请编辑信息"
      :visible.sync="dialogFormVisible"
      width="50%"
      top="5vh"
      fullscreen
    >
      <el-form :model="form">
        <el-form-item label="商店名称">
          <el-input v-model="updateForm.store_name"></el-input>
        </el-form-item>
        <el-form-item label="商店海报">
          <Upload
            uploadTitle=""
            v-model="updateForm.store_img_url"
            @input="handleUploadImage"
            :containerStyle="{ marginTop: '40px' }"
          />
        </el-form-item>
        <el-form-item label="商店介绍">
          <el-input v-model="updateForm.store_description"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmEditSetting">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { findStoreInfo, updateStoreInfo } from "@/api/store-info";
import Upload from "@/components/Upload.vue";
import { server_URL } from "@/url-config";
export default {
  components: {
    Upload,
  },
  data() {
    return {
      form: {
        storeName: "",
        storeDescription: "",
        storeImgUrl: "",
      },
      updateForm: {
        store_name: "",
        store_description: "",
        store_img_url: "",
      },
      dialogFormVisible: false,
      serverUrl: server_URL,
    };
  },

  methods: {
    fetchData() {
      findStoreInfo().then(({ data }) => {
        const info = data.rows[0];
        console.log(info.store_img_url);
        this.form.storeName = info.store_name;
        this.form.storeDescription = info.store_description;
        this.form.storeImgUrl = info.store_img_url;
        this.updateForm.store_name = info.store_name;
        this.updateForm.store_description = info.store_description;
        this.updateForm.store_img_url = info.store_img_url;
      });
    },
    handleUploadImage(data) {
      this.updateForm.store_img_url = data.url;
    },
    openEditPanel() {
      this.dialogFormVisible = true;
    },
    confirmEditSetting() {
      updateStoreInfo(this.updateForm).then((res) => {
        console.log(res);
        this.dialogFormVisible = false;
        if (res.code === 0) {
          this.fetchData();
          this.$message.success("修改成功！");
        } else {
          this.$message.error("修改失败！");
        }
      });
    },
  },
  created() {
    this.fetchData(); // 获取数据
  },
};
</script>

<style scoped>
.block {
  margin: 15px 0;
  font-size: 20px;
  font-weight: 100;
}
.block2 {
  margin: 15px 0;
  font-size: 14px;
  font-weight: 100;
}
</style>
