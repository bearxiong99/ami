<template>
  <div class="login-container"
       @keyup.enter.native="handleLogin">
    <top-color v-show="false"></top-color>
    <!-- <img src="/img/bg/logoname.png" alt="" style="display:block;margin:0 auto 100px;"> -->
    <!-- <img src="/img/bg/logo3.png" alt="" style="width:10%;height:87px;position:absolute;left:6.25%;top:10%">
    <img src="/img/bg/logo2.png" alt="" style="width:13%;height:78px;position:absolute;left:20%;top:10%"> -->
    <img src="/img/bg/sec1.png" alt="" style="width:53.5%;height:78px;position:absolute;left:6.25%;top:10%">
    <h1>Advanced Metering Infrastructure System</h1>
    <div class="login-weaper animated bounceInDown" >
      <!--<div class="login-left">-->
      <!--<div class="login-time">-->
      <!--{{time}}-->
      <!--</div>-->
      <!--<img class="img"-->
      <!--src="/img/logo.png"-->
      <!--alt="">-->
      <!--<p class="title">{{ $t('login.info') }}</p>-->
      <!--</div>-->
      <div class="login-border">
        <div class="login-main">
          <h4 class="login-title">
            {{ $t('login.title') }}
            <!-- {{ $t('login.info') }} -->
            <!-- <top-lang></top-lang> -->
          </h4>
          <userLogin></userLogin>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import userLogin from "./userlogin";
  import {mapGetters} from "vuex";
  import {dateFormat} from "@/util/date";
  import {validatenull} from "@/util/validate";
  import topLang from "@/page/index/top/top-lang";
  import topColor from "@/page/index/top/top-color";

  export default {
    name: "login",
    components: {
      userLogin,
      topLang,
      topColor
    },
    data() {
      return {
        time: "",
        activeName: "user"
      };
    },
    watch: {
      $route() {
        const params = this.$route.query;
        this.socialForm.state = params.state;
        this.socialForm.code = params.code;
        if (!validatenull(this.socialForm.state)) {
          const loading = this.$loading({
            lock: true,
            text: `${
              this.socialForm.state === "WX" ? this.$t('login.wechat') : "QQ"
              } ${this.$t('login.wait')}`,
            spinner: "el-icon-loading"
          });
          setTimeout(() => {
            loading.close();
          }, 2000);
        }
      }
    },
    created() {
      this.getTime();
      setInterval(() => {
        this.getTime();
      }, 1000);
    },
    mounted() {
    },
    computed: {
      ...mapGetters(["website"])
    },
    props: [],
    methods: {
      getTime() {
        this.time = dateFormat(new Date());
      }
    }
  };
</script>

<style lang="scss">
  @import "@/styles/login.scss";
</style>
