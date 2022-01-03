<template>
  <div class="app-container personal-center">
    <el-form
      :model="form"
      label-width="100px"
      style="width: 500px"
      class="form"
      :rules="rules"
      ref="form"
    >
      <!-- 旧密码 -->
      <el-form-item label="旧密码" required prop="oldLoginPwd">
        <el-input
          v-model.trim="form.oldLoginPwd"
          placeholder="请输入旧密码"
          prop="oldLoginPwd"
          type="password"
        ></el-input>
      </el-form-item>
      <!-- 新密码 -->
      <el-form-item label="新密码" required prop="newLoginPwd">
        <el-input
          v-model.trim="form.newLoginPwd"
          placeholder="请输入新密码"
          type="password"
        ></el-input>
      </el-form-item>
      <!-- 确认新密码 -->
      <el-form-item label="确认新密码" required prop="confirmNewLoginPwd">
        <el-input
          v-model.trim="form.confirmNewLoginPwd"
          placeholder="请再次输入新密码"
          type="password"
        ></el-input>
      </el-form-item>
    </el-form>
    <!-- 按钮区域 -->
    <div class="btn-wrapper">
      <el-button
        type="primary"
        @click="handleConfigChangeUserInfo"
        :loading="isChangePwdLoading"
      >
        确定
      </el-button>
    </div>
  </div>
</template>

<script>
import { changePassword } from "@/api/user";
import { Message } from "element-ui";
export default {
  data() {
    const validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入新密码"));
      } else if (value !== this.form.newLoginPwd) {
        callback(new Error("两次输入的密码不一致"));
      } else {
        callback();
      }
    };
    return {
      isChangePwdLoading: false,
      form: {
        oldLoginPwd: "", // 旧密码
        newLoginPwd: "", // 新密码
        confirmNewLoginPwd: "", // 确认新密码
      },
      rules: {
        oldLoginPwd: [
          { required: true, trigger: "blur", message: "请输入旧密码" },
        ],
        newLoginPwd: [
          { required: true, trigger: "blur", message: "请输入新密码" },
        ],
        confirmNewLoginPwd: [
          { required: true, trigger: "blur", message: "请再次输入新密码" },
          { validator: validatePass2, trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    async handleConfigChangeUserInfo() {
      if (
        !this.form.oldLoginPwd ||
        !this.form.newLoginPwd ||
        !this.form.confirmNewLoginPwd
      ) {
        try {
          await this.$refs.form.validate();
        } catch (err) {
          return;
        }
      }
      this.isChangePwdLoading = true;
      const resp = await changePassword({
        username: this.$store.getters.name,
        oldPassword: this.form.oldLoginPwd,
        newPassword: this.form.newLoginPwd,
      });
      if (resp.code === 1) {
        Message.error("旧密码错误");
      } else if (resp.code === 2) {
        Message.info("新旧密码相同，无需修改");
      } else if (resp.code === 3) {
        Message.error("该用户不存在");
      } else if (resp.code === 0) {
        Message.success("密码修改成功，请重新登录");
        this.$store.dispatch("user/resetToken");
        this.$router.push("/login");
      }
      this.isChangePwdLoading = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.personal-center {
  .form {
    margin: 0 auto;
  }
  .btn-wrapper {
    text-align: center;
  }
}
</style>
