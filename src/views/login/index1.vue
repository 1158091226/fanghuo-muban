<!-- 登入 -->
<template>
  <div class="login">
    <div class="login-right-content">
      <div class="project-title">保护区科研管理</div>
      <div class="login-input-box">
        <div class="box-item">
          <div class="text1">登陆</div>
          <div class="text2">
            欢迎使用保护区科研管理平台，本平台仅支持账号密码登录
          </div>
          <el-form
            ref="loginForm"
            :model="loginForm"
            :rules="loginRules"
            class="loginForm"
          >
            <el-form-item prop="username">
              <el-input
                v-model="loginForm.username"
                placeholder="请输入账号"
                style="margin-top: 40px"
                class="input"
              >
                <svg-icon slot="prefix" icon-class="user" />
                <img
                  slot="suffix"
                  style="
                    width: 16px;
                    height: 16px;
                    cursor: pointer;
                    position: relative;
                    top: 2px;
                  "
                  src="~@/static/templateImages/close-circle-filled.png"
                  alt=""
                  @click="closeUserName"
                />
              </el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input
                v-model="loginForm.password"
                placeholder="请输入密码"
                :type="passwordType"
                style="margin-top: 20px"
                class="input"
                @keyup.enter.native="handleLogin"
              >
                <svg-icon slot="prefix" icon-class="password" />
                <!-- <svg-icon
                  slot="suffix"
                  style="cursor: pointer"
                  :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"
                  @click="showPwd"
                /> -->
                <img
                  v-if="passwordType === 'password'"
                  slot="suffix"
                  style="width: 16px; height: 12px; cursor: pointer"
                  src="~@/static/templateImages/eye-close.png"
                  alt=""
                  @click="showPwd"
                />
                <img
                  v-else
                  slot="suffix"
                  style="width: 16px; height: 12px; cursor: pointer"
                  src="~@/static/templateImages/eye-open.png"
                  alt=""
                  @click="showPwd"
                />
              </el-input>
            </el-form-item>

            <el-form-item v-if="isCode" :prop="isCode ? 'code' : ''">
              <div class="code-box">
                <el-input
                  v-model="loginForm.code"
                  placeholder="请输入验证码"
                  style="flex: 1"
                  @keyup.enter.native="handleLogin"
                />
                <div class="code-img">
                  <img :src="imgBaseText" alt="" @click="codeimgClick" />
                </div>
              </div>
            </el-form-item>
          </el-form>
          <el-button
            :loading="loading"
            type="primary"
            style="width: 100%; margin-top: 20px; height: 48px"
            @click.native.prevent="handleLogin"
          >
            确认
          </el-button>
          <div class="forgot-password">忘记密码</div>
        </div>
        <div class="foot-text">中绿数科（厦门）有限公司</div>
      </div>
    </div>
  </div>
</template>

<script>
import { validUsername } from "@/utils/validate";
import { captchaImage, captchaEnable } from "@/api/auth";
export default {
  data() {
    const validateUsername = (rule, value, callback) => {
      console.log(`output->value`, value);
      if (!validUsername(value)) {
        callback(new Error("请输入正确的用户名"));
      } else {
        callback();
      }
    };
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error("您输入的密码有误，请重新输入"));
      } else {
        callback();
      }
    };
    const validateVerify = (rule, value, callback) => {
      if (value.length <= 0) {
        callback(new Error("验证码不能为空"));
      } else {
        callback();
      }
    };
    return {
      loginForm: {
        username: "",
        password: "",
        code: "",
        uuid: "",
      },
      isCode: true, // 判断是否需要使用验证码
      loading: false,
      passwordType: "password",
      loginRules: {
        username: [
          { required: true, trigger: "blur", validator: validateUsername },
        ],
        password: [
          { required: true, trigger: "blur", validator: validatePassword },
        ],
        code: [{ required: true, trigger: "blur", validator: validateVerify }],
      },
      imgBaseText: "",
    };
  },

  // components: {},

  watch: {
    $route: {
      handler: function (route) {
        const query = route.query;
        if (query) {
          this.redirect = query.redirect;
          this.otherQuery = this.getOtherQuery(query);
        }
      },
      immediate: true,
    },
  },

  // computed: {},
  beforeCreate() {
    captchaEnable().then((res) => {
      this.isCode = res.data;
    });
  },

  async created() {
    if (this.isCode) {
      await captchaImage().then((res) => {
        if (res.data) {
          this.imgBaseText = "data:image/jpg;base64," + res.data.img;
          this.loginForm.uuid = res.data.uuid;
        }
      });
    }
  },

  mounted() {},

  methods: {
    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
      this.$nextTick(() => {
        this.$refs.password.focus();
      });
    },
    closeUserName() {
      this.loginForm.username = "";
    },
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          this.loginForm.code = this.isCode ? this.loginForm.code : "";
          this.$store
            .dispatch("user/login", this.loginForm)
            .then(() => {
              this.$router.push({
                path: this.redirect || "/fireproofResource/oneMap",
                // path: this.redirect || '/',
                query: this.otherQuery,
              });
              this.loading = false;
            })
            .catch(() => {
              this.loading = false;
              this.loginForm.code = "";
              this.requertCodeImg();
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== "redirect") {
          acc[cur] = query[cur];
        }
        return acc;
      }, {});
    },

    requertCodeImg() {
      captchaImage().then((res) => {
        this.imgBaseText = "data:image/jpg;base64," + res.data.img;
        this.loginForm.uuid = res.data.uuid;
      });
    },

    codeimgClick() {
      this.requertCodeImg();
    },
  },
};
</script>

<style lang="scss" scoped>
.login {
  width: 100%;
  height: 100%;
  overflow: hidden;
  // background-image: url("~@/static/login-back-img.jpg");
  background-color: #666;
  background-position: center center;
  background-size: 100% 100%;
  display: flex;
  // flex-direction: row-reverse;
  justify-content: center;
  .login-right-content {
    width: 36.7%;
    height: 100%;
    overflow: hidden;
    //background-image: url("~@/static/login-right-img.png");
    background-position: center center;
    background-size: 100% 100%;
    padding: 28px 24px;
    position: relative;
    .project-title {
      font-size: 28px;
      color: rgba(255, 255, 255, 0.9);
      letter-spacing: 0;
      line-height: 36px;
      font-weight: 600;
      text-align: center;
    }
    .login-input-box {
      width: 100%;
      margin-top: 24.4%;
      text-align: center;
      display: flex;
      justify-content: center;
      .box-item {
        width: 440px;
        // border: 1px solid #000;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        .text1 {
          font-size: 48px;
          color: rgba(255, 255, 255, 0.9);
          letter-spacing: 0;
          line-height: 56px;
          font-weight: 600;
        }
        .text2 {
          font-size: 16px;
          color: rgba(255, 255, 255, 0.9);
          line-height: 24px;
          font-weight: 400;
          margin-top: 10px;
          text-align: left;
        }
        .loginForm {
          width: 100%;
          .input {
            width: 100%;
          }
          .code-box {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-top: 20px;
            .code-img {
              width: 120px;
              height: 48px;
              background: rgba(255, 255, 255, 0.55);
              border-radius: 4px;
              margin-left: 10px;
            }
          }
          //修改输入框的删除按钮
          ::v-deep .el-input__suffix {
            .el-input__suffix-inner {
              // border-color: none;
              .el-icon-circle-close:before {
                content: "\e79d" !important;
                font-size: 16px;
                color: rgba(0, 0, 0, 0.4);
                position: relative;
                top: -4px;
              }
            }
          }
        }

        .forgot-password {
          width: 100%;
          text-align: right;
          font-size: 14px;
          margin-top: 4px;
          color: rgba(255, 255, 255, 0.6);
          font-weight: 400;
          cursor: pointer;
          height: 22px;
        }
      }
    }
    .foot-text {
      width: 100%;
      position: absolute;
      bottom: 40px;
      font-size: 12px;
      color: rgba(255, 255, 255, 0.9);
      letter-spacing: 0;
      text-align: center;
      line-height: 20px;
      font-weight: 400;
    }
  }
}
</style>

<style scoped>
.loginForm >>> .el-input__inner {
  height: 48px !important;
  line-height: 48px !important;
}
.loginForm >>> .el-input__prefix {
  top: 6px;
  left: 13px;
}

.loginForm >>> .el-input--prefix .el-input__inner {
  padding-left: 42px;
}

.loginForm >>> .el-input__suffix {
  top: 6px;
  right: 10px;
}
</style>
