<template>
  <div class="basic-container">
    <el-card :body-style="{background: bg}">
      <slot></slot>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: "basicContainer",
    props: ['bg']
  };
</script>

<style lang="scss">
  .basic-container {
    padding: 10px 6px;
    border-radius: 10px;
    box-sizing: border-box;
    .el-card {
      width: 100%;
    }
    &:first-child {
      padding-top: 0;
    }
  }
</style>
