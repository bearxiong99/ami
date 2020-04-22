<template>
  <div class="error-page">
    <div class="img"
         style=" background-image: url('/img/bg/404.svg');"></div>
    <div class="content">
      <h1>404</h1>
      <div class="desc">{{$t('error.noPage')}}</div>
      <div class="actions">
        <router-link :to="{path:'/'}">
          <el-button type="primary">{{$t('error.returnHome')}}</el-button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "error-404"
  };
</script>
<style lang="scss" scoped>
  @import "./style.scss";
</style>
