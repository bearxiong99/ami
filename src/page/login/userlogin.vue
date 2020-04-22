<template>
  <el-form class="login-form"
           status-icon
           :rules="loginRules"
           ref="loginForm"
           :model="loginForm"
           label-width="0">
    <el-form-item v-if="tenantMode" prop="tenantId">
      <el-input :maxlength="30" size="small"
                @keyup.enter.native="handleLogin"
                v-model="loginForm.tenantId"
                auto-complete="off"
                :placeholder="$t('login.tenantId')">
        <i slot="prefix"
           class="icon-quanxian"></i>
      </el-input>
    </el-form-item>
    <el-form-item prop="username">
      <el-input :maxlength="30" size="small"
                @keyup.enter.native="handleLogin"
                v-model="loginForm.username"
                auto-complete="off"
                :placeholder="$t('login.username')">
        <i slot="prefix"
           class="icon-yonghu"></i>
      </el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input :maxlength="30" size="small"
                @keyup.enter.native="handleLogin"
                :type="passwordType"
                v-model="loginForm.password"
                auto-complete="off"
                :placeholder="$t('login.password')">
        <i class="el-icon-view el-input__icon"
           slot="suffix"
           @click="showPassword"></i>
        <i slot="prefix"
           class="icon-mima"></i>
      </el-input>
    </el-form-item>
    <el-form-item prop="captcha">
      <el-row>
        <el-col :span="12">
          <el-input :maxlength="30" size="small"
                    @keyup.enter.native="handleLogin"
                    v-model="loginForm.captcha"
                    auto-complete="off"
                    :placeholder="$t('login.captcha')">
            <i slot="prefix"
               class="icon-yanzhengma"></i>
          </el-input>
        </el-col>
        <el-col :span="12">
          <img class="captcha" :src="captchaPath" @click="getCaptcha()" alt="click me" style="height: 5vh;">
        </el-col>
      </el-row>
    </el-form-item>
    <el-form-item>
      <top-lang></top-lang>
    </el-form-item>
    <el-form-item>
      <el-button type="primary"
                 size="small"
                 @click.native.prevent="handleLogin"
                 class="login-submit"
                 style="height:6vh;font-size:20px;">{{$t('login.submit')}}
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  import {mapGetters} from "vuex";
  import website from '@/config/website';
  import {getUUID, encrypt} from '@/util/util'
  import {getCaptchaPath} from '@/api/user'
  import topLang from "@/page/index/top/top-lang";
  export default {
    name: "userlogin",
    components:{
      topLang
    },  
    data() {
      const validatePwd = (rule, value, callback) => {
        let reg = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{6,40}$/
        if (value === '') {
          callback(new Error(this.$t('user.password2')));
        } else if (!reg.test(value)) {
          callback(new Error(this.$t('global.passformat')));
        } else {
          callback();
        }
      };
      return {
        tenantMode: website.tenantMode,
        loginForm: {
          uuid: '',
          tenantId: "000000",
          username: "admin",
          password: "@qwer1234",
          captcha: '',
          type: "account"
        },
        loginRules: {
          tenantId: [
            {required: false, message: this.$t('login.enterTenantId'), trigger: "blur"}
          ],
          username: [
            {required: true, message: this.$t('login.enterUsername'), trigger: "blur"}
          ],
          password: [
            {required: true, message: this.$t('global.enterPassword'), trigger: "blur"},
            {min: 1, message: this.$t('login.enterLength'), trigger: "blur"},
            {validator: validatePwd, trigger: "blur"},
          ],
          captcha: [
            {required: true, message: this.$t('login.enterCaptcha'), trigger: "blur"}
          ]
        },
        passwordType: "password",
        captchaPath: '',
      };
    },
    created() {
      this.getCaptcha()
    },
    mounted() {
    },
    computed: {
      ...mapGetters(["tagWel"])
    },
    props: [],
    methods: {
      getCaptcha() {
        this.loginForm.uuid = getUUID()
        this.loginForm.captcha = ''
        this.captchaPath = getCaptchaPath(this.loginForm.uuid)
      },
      showPassword() {
        this.passwordType == ""
          ? (this.passwordType = "password")
          : (this.passwordType = "");
      },
      handleLogin() {
        this.$refs.loginForm.validate(valid => {
          if (valid) {
            const loading = this.$loading({
              lock: true,
              text: this.$t('login.wait'),
              spinner: "el-icon-loading"
            });
            // todo
            let _loginForm = this.loginForm
            let form = {
              tenantId: _loginForm.tenantId,
              username: encrypt(_loginForm.username),
              password: encrypt(_loginForm.password),
              type: _loginForm.type,
              uuid: _loginForm.uuid,
              captcha: _loginForm.captcha
            }

            this.$store.dispatch("LoginByUsername", form).then(() => {
              console.log(3333,this.tagWel.value)
              this.$router.push({path: this.tagWel.value});
              loading.close();
            }).catch((error) => {
              if(error.code==2){
                this.$message({
                  message: this.$t('global.userontexist'),
                  type: 'error'
                });
              }else if(error.code==3){
                this.$message({
                  message: this.$t('global.vercode'),
                  type: 'error'
                });
              }else if(error.code==4){
                this.$message({
                  message: this.$t('global.userwrong'),
                  type: 'error'
                });
              }else if(error.code==5){
                this.$message({
                  message: this.$t('global.passtime'),
                  type: 'error'
                });
              }else if(error.code==6){
                this.$message({
                  message: this.$t('global.acclock'),
                  type: 'error'
                });
              }else if(error.code==7){
                this.$message({
                  message: this.$t('global.accstop'),
                  type: 'error'
                });
              }else if(error.code==8){
                this.$message({
                  message: this.$t('global.accabnomal'),
                  type: 'error'
                });
              }
              this.getCaptcha()
              loading.close()
            });
          }
        });
      }
    }
  };
</script>

<style lang="scss">
.login-form {
  .captcha {
    width: 90%;
    // height: 41px;
    float: right;
    cursor: pointer;
  }
  .el-form-item {
    margin-bottom: 3vh!important;
  }
  .el-form-item .el-input__inner {
    height: 5vh!important;
    font-size: 16px;
  }
  .el-input__prefix i {
    margin-top: 11px!important;
  }
}
</style>
