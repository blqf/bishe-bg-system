<template>
  <div :style="containerStyle">
    <!-- 上传组件标题 -->
    <div class="block">{{ uploadTitle }}</div>
    <!-- 上传控件 -->
    <el-upload
      class="avatar-uploader"
      :action="'/api/upload/' + type"
      :show-file-list="false"
      :on-success="handleAvatarSuccess"
      :headers="headers"
      name="img"
      accept="image/png,image/jpeg"
    >
      <img v-if="value" :src="imageUrl" class="avatar" />
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
  </div>
</template>

<script>
import { getToken } from "@/utils/auth";
import { server_URL } from "@/url-config";
export default {
  props: ["uploadTitle", "value", "containerStyle", 'type'],
  computed: {
    imageUrl() {
      if (this.value) {
        if (this.value.includes("http://") || this.value.includes("https://")) {
          return this.value;
        } else {
          console.log(server_URL + this.value);
          return server_URL + this.value;
        }
      }
    },
    headers() {
      return {
        authorization: getToken(), // 从本地获取 token，添加到 header 里面
      };
    },
  },
  methods: {
    handleAvatarSuccess(res) {
      console.log(res, "res");
      if (!res.code && res.data) {
        // 说明上传成功，服务器给我们返回了图片上传后的服务器地址
        this.$emit("input", res.data);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.block {
  margin: 15px 0;
  font-weight: 100;
}
.avatar-uploader .el-upload {
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
  object-fit: cover;
}
</style>
