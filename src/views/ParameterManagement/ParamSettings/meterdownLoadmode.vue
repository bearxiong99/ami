<template>
  <basic-container class="container">
      <el-tabs v-model="active" type="card" id="active">
        <el-tab-pane :label="$t('sitemanage.threshold')" name="1">
          <threshold></threshold>
        </el-tab-pane>
        <el-tab-pane :label="$t('menu.equipmentcontrol')" name="2">
          <relay-control></relay-control>
        </el-tab-pane>
        <el-tab-pane :label="$t('global.mrp')" name="3">
          <meter-reading-params></meter-reading-params>
        </el-tab-pane>
        <el-tab-pane :label="$t('global.otherParams')" name="4">
          <other-params></other-params>
        </el-tab-pane>
        <el-tab-pane :label="$t('global.tariff')" name="5">
          <tariff></tariff>
        </el-tab-pane>
        <el-tab-pane :label="$t('global.specialDay')" name="6">
          <special-day></special-day>
        </el-tab-pane>
        <el-tab-pane :label="$t('global.displayList')" name="7">
          <display-list></display-list>
        </el-tab-pane>
      </el-tabs>
  </basic-container>
</template>
<script>
import threshold from './meterDownloadMode/threshold'
import relayControl from './meterDownloadMode/relayControl'
import meterReadingParams from './meterDownloadMode/meterReadingParams'
import otherParams from './meterDownloadMode/otherParams'
import tariff from './meterDownloadMode/tariff'
import displayList from './meterDownloadMode/displayList'
import specialDay from './meterDownloadMode/specialDay'
export default {
  components: {
    threshold,
    relayControl,
    meterReadingParams,
    otherParams,
    tariff,
    displayList,
    specialDay
  },
  data () {
    return {
      active: '1'
    };
  },
  watch: {
    treeNode: function() {
      
      console.log(333)
    }
  },
  methods:{
  
  }
}
</script>
<style lang='scss' scoped>
  #active {
    /deep/ &>.el-tabs__header {
      padding: 5px 0 0 10px;
      background-color: #c6dedd;
      .el-tabs__nav {
        background-color: #c6dedd;
        border: 0;
        .el-tabs__item {
          border: 0;
          color: #018b7e;
        }
        .el-tabs__item.is-active {
          background-color: #fff;
        }
      }
    }
  }

</style>