<template>
    <div class="emeter">
      <el-table
        ref="multipleTable"
        :data="basicdata"
        style="width: 100%;"
        @selection-change="emeterSelectionChange"
        border
        :header-cell-style="{background:'#F2F2F2',color:'rgb(51,51,51)'}"
        v-loading="loading"
        :height="height"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="id" :label="$t('global.id')" width="55">
          <template slot-scope="scope">{{ pageNum.limit * (pageNum.page - 1) + scope.$index + 1 }}</template>
        </el-table-column>
        <el-table-column prop="assetNo" :label="$t('remote.deviceName')"></el-table-column>
        <el-table-column prop="commAddr1" :label="$t('areaManage.commadd')"></el-table-column>
        <el-table-column prop="factoryCode" :label="$t('change.manufacturer')">
          <template slot-scope="scope">{{ changeFactory(scope.row.factoryCode) }}</template>
        </el-table-column>
        <el-table-column prop="meterTypeCode" :label="$t('auto.meterType')">
          <template slot-scope="scope">{{ changeMeter(scope.row.meterTypeCode) }}</template>
        </el-table-column>
        <el-table-column prop="commMode" :label="$t('auto.commtype')">
          <template slot-scope="scope">{{ changeMode(scope.row.commMode) }}</template>
        </el-table-column>
        <!-- <el-table-column prop="voltCode" :label="$t('auto.commtype')">
           <template slot-scope="scope">{{ changeMode(scope.row.commMode) }}</template>
        </el-table-column> -->
        <el-table-column prop="ratedCurrent" :label="$t('meterbtn.currentspecs')">
           <template slot-scope="scope">{{ changeCurrent(scope.row.ratedCurrent) }}</template>
        </el-table-column>
        <el-table-column prop="gpsLongitude" :label="$t('areaManage.longitude')"></el-table-column>
        <el-table-column prop="gpsLatitude" :label="$t('areaManage.latitude')"></el-table-column>
      </el-table>
  </div>
</template>

<script>
import { getViewList } from "@/api/autoRegister";
export default {
  props:['basicdata','loading','height','pageNum'],
  components: {

  },
  data() {
    return {
      viewList:[],
      meterTypeList:[],
      modeTypeList:[],
      currentList:[]
    };
  },
  computed: {

  },
  mounted() {
    this.getView();
  },
  methods: {
    emeterSelectionChange(val) {
      this.$emit('selectMeter',val)
    },
    getView() {
      getViewList({
        viewType: "meterFactoryType"
      }).then(res => {
        this.viewList = res.data.data.list;
      });
      getViewList({
        viewType: "meterType"
      }).then(res => {
        this.meterTypeList = res.data.data.list;
      })
      getViewList({
        viewType: "meterCommModel"
      }).then(res => {
        this.modeTypeList = res.data.data.list;
      })
      getViewList({
        viewType: "meterVmCorrent"
      }).then(res => {
        this.currentList = res.data.data.list;
      })
    },
    changeFactory(val) {
      for(let i in this.viewList){
        if(Number(val)==Number(this.viewList[i].typeCode)){
          return  this.viewList[i].typeName
        }
      }
    },
    changeMeter(val){
      for(let i in this.meterTypeList){
        if(Number(val)==Number(this.meterTypeList[i].typeCode)){
          return  this.meterTypeList[i].typeName
        }
      }
    },
    changeMode(val){
      for(let i in this.modeTypeList){
        if(Number(val)==Number(this.modeTypeList[i].typeCode)){
          return  this.modeTypeList[i].typeName
        }
      }
    },
    changeCurrent(val){
      for(let i in this.currentList){
        if(Number(val)==Number(this.currentList[i].typeCode)){
          return  this.currentList[i].typeName
        }
      }
    }
  },
};
</script>

<style scoped lang="scss">

</style>
