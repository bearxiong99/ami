<template>
    <div class="emeter">
      <el-table
        ref="multipleTable"
        :data="basicdata"
        style="width: 100%;height:300px;"
        @selection-change="basicSelectionChange"
        border
        :header-cell-style="{background:'#F2F2F2',color:'rgb(51,51,51)'}"
        v-loading="loading"
        :height="height"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="id" :label="$t('global.id')" width="55">
          <template slot-scope="scope">{{ pageNum.limit * (pageNum.page - 1) + scope.$index + 1 }}</template>
        </el-table-column>
        <!-- <el-table-column prop="terminalId" :label="$t('areaManage.terminalId')"></el-table-column> -->
        <el-table-column prop="tmnlAssetNo" :label="$t('areaManage.tmnlAssetNo')"></el-table-column>
        <!-- <el-table-column prop="terminalAddr" :label="$t('areaManage.terminalAddr')"></el-table-column> -->
        <el-table-column prop="factoryCode" :label="$t('change.manufacturer')">
          <template slot-scope="scope">{{ changeFactory(scope.row.factoryCode)}}</template>
        </el-table-column>
        <el-table-column prop="terminalTypeCode" :label="$t('areaManage.terminaltype')">
          <template slot-scope="scope">{{ changecode(scope.row.terminalTypeCode) }}</template>
        </el-table-column>
        <el-table-column prop="runDate" :label="$t('areaManage.runDate')"></el-table-column>
        <el-table-column prop="isOnline" :label="$t('equivar.status')">
          <template slot-scope="scope">
            <div
              class="circle"
              :style="{'background-color': scope.row.isOnline ? colorName : '#a5a5a5'}"
            ></div>
          </template>
        </el-table-column>
        <el-table-column prop="gpsLongitude" :label="$t('areaManage.longitude')"></el-table-column>
        <el-table-column prop="gpsLatitude" :label="$t('areaManage.latitude')"></el-table-column>

        <!-- 经度纬度终端类型增加 -->
      </el-table>
  </div>
</template>

<script>
import { getViewList } from "@/api/autoRegister";
import { mapGetters } from 'vuex'
export default {
  props:['basicdata','loading','height','pageNum'],
  components: {
  },
  computed:{
    ...mapGetters(["colorName"])
  },
  data() {
    return {
      viewList:[],
      factoryList:[]
    };
  },
  mounted() {
    this.getView();
  },
  methods: {
    basicSelectionChange(val) {
      this.$emit('selectDCU',val)
    },
    getView() {
      getViewList({
        viewType: "tmnlType"
      }).then(res => {
        this.viewList = res.data.data.list;
      });
      getViewList({
        viewType: "meterFactoryType"
      }).then(res => {
        this.factoryList = res.data.data.list;
      });
    },
    changeFactory(val) {
      for(let i in this.factoryList){
        if(Number(val)==Number(this.factoryList[i].typeCode)){
          return  this.factoryList[i].typeName
        }
      }
    },
    changecode(val) {
      for (let i in this.viewList) {
        if (this.viewList[i].typeCode == val) {
          return this.viewList[i].typeName;
        }
      }
    },
  },
};
</script>

<style scoped lang="scss">
.circle {
  width: 20px;
  height: 20px;
  padding-top: 2px;
  background-color: #87d182;
  border-radius: 50%;
  box-sizing: border-box;
  &::after {
    content: "";
    display: block;
    width: 12px;
    height: 12px;
    margin: 0 auto;
    border: 2px solid #fff;
    border-radius: 50%;
  }
}
</style>
