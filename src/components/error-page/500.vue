<template>
  <div class="error-page">
    <div class="img"
         style=" background-image: url('/img/bg/500.svg');"></div>
    <div class="content">
      <h1>500</h1>
      <div class="desc">{{$t('error.serverError')}}</div>
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
    name: "error-500"
  };
</script>
<style lang="scss" scoped>
  @import "./style.scss";
</style>
