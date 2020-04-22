<template>
  <div style="background-color: #F4F6FB;overflow:hidden;height: 100%">
    <!-- 安装成功率 -->
    <div class="divbox" style="height: 235px">
      <installSuccRate/>
    </div>
    <div class="divbox">
       <readSuccRate/>
    </div>
    <div class="divbox" style="background-color: #F4F6FB;">
      <systemUseRate/>
    </div>
  </div>
</template>

<script>
  import installSuccRate from './kpiInstallSuccRate'
  import readSuccRate from './kpiReadSuccRate'
  import systemUseRate from './kpiSystemUseRate'
    export default {
        name: "index",
        components:{
          installSuccRate,
          readSuccRate,
          systemUseRate
        }
    }
</script>

<style scoped lang="scss">
.divbox{
  margin:10px auto;
  width:98%;
  background-color: #fff;
}
</style>
