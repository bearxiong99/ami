<template>
  <div>
    <div class="filter-box">
      <span style="margin-left:0">{{$t('change.manufacturer')}}</span>
      <el-select v-model="params1.factoryCode" size="small">
        <el-option :label="$t('global.all')" :value="''"></el-option>
        <el-option
          :label="ele.typeName"
          :value="ele.typeCode"
          v-for="(ele, i) in tmnlFactoryList"
          :key="i"
        ></el-option>
      </el-select>
      <span>{{$t('auto.dcuDevi')}}</span>
      <el-input :maxlength="30" v-model="params1.tmnlAssetNo"></el-input>
      <el-button type="primary" size="small" @click="search1">{{$t('auto.search')}}</el-button>
    </div>
    <div class="content">
      <div class="table">
        <div class="table-head">
          {{$t('rtuparam.dcuList')}}
          <div class="right-box">
            <span @click="read">
              <img src="img/read.png" alt />
              {{$t('global.read')}}
            </span>
            <span @click="clearall">
              <img src="img/Remove.png" alt />
              {{$t('meterbtn.clearall')}}
            </span>
          </div>
        </div>
        <el-table
          :data="dcuData"
          border
          height="26vh"
          v-loading="load1"
          :header-cell-style="{background:'#F2F2F2',color:'rgb(51,51,51)'}"
          highlight-current-row
          @current-change="selectFun"
        >
          <!-- <el-table-column type="selection" width="50"></el-table-column> -->
          <el-table-column :label="$t('key.no')" width="50">
            <template
              slot-scope="scope"
            >{{ params1.size * (params1.current - 1) + scope.$index + 1 }}</template>
          </el-table-column>
          <el-table-column :label="$t('auto.dcuDevi')" prop="tmnlAssetNo"></el-table-column>
          <el-table-column :label="$t('auto.ip')" prop="ipAddr"></el-table-column>
          <el-table-column :label="$t('auto.registrationTime')" prop="recvTime"></el-table-column>
          <el-table-column prop="factoryCode" :label="$t('change.manufacturer')">
            <template slot-scope="scope">{{ changeFactory(scope.row.factoryCode)}}</template>
          </el-table-column>
        </el-table>
        <!-- 分页组件-->
        <pagination
          :total="total1"
          :page.sync="params1.current"
          :limit.sync="params1.size"
          @pagination="search1"
          style="margin-top:-1px"
        />
      </div>
    </div>
    <div class="content">
      <div class="table">
        <div class="table-head">
          {{$t('change.meterinfo')}}
          <div class="right-box">
            <span @click="refresh">
              <img src="img/Refresh.png" alt />
              {{$t('auto.refresh')}}
            </span>
            <span @click="clearSingle">
              <img src="img/Remove.png" alt />
              {{$t('meterbtn.clear')}}
            </span>
          </div>
        </div>
        <!-- 电表表格S -->
        <el-table
          :data="meterData"
          border
          height="26vh"
          v-loading="load2"
          :header-cell-style="{background:'#F2F2F2',color:'rgb(51,51,51)'}"
          @selection-change="selectionChange"
        >
          <el-table-column type="selection" width="50"></el-table-column>
          <el-table-column :label="$t('key.no')" width="50">
            <template
              slot-scope="scope"
            >{{ params1.size * (params1.current - 1) + scope.$index + 1 }}</template>
          </el-table-column>
          <!-- <el-table-column prop="tmnlAssetNo" :label="$t('auto.deviceName')"></el-table-column> -->
          <el-table-column prop="metLogicDevName" :label="$t('areaManage.meterCommad')"></el-table-column>
          <el-table-column prop="metType" :label="$t('auto.meterType')" :formatter="meterFormat"></el-table-column>
          <el-table-column prop="tmnlAssetNo" :label="$t('auto.dcuName')"></el-table-column>
          <el-table-column prop="recvTime" :label="$t('auto.registeredTime')"></el-table-column>
          <el-table-column prop="factoryCode" :label="$t('change.manufacturer')">
            <template slot-scope="scope">{{ changeFactory(scope.row.factoryCode)}}</template>
          </el-table-column>
          <!-- <el-table-column prop="currentCode" :label="$t('key.currentSpecs')"></el-table-column> -->
        </el-table>
        <!-- 分页组件 -->
        <pagination
          :total="total2"
          :page.sync="params2.current"
          :limit.sync="params2.size"
          @pagination="search2"
          style="margin-top:-1px"
        />
      </div>
    </div>
      <!-- 操作反馈 -->
      <el-dialog
        :title="$t('global.checkResult')"
        :visible.sync="checkResultVisible"
        width="60%"
        :before-close="handleClose"
      >
        <!--  查询结果表格 -->
        <div class="content">
          <div class="table">
            <div class="table-head">
              {{$t('rtuparam.dcuList')}}
              <div class="right-box">
                <!-- 进度条组件 -->
                <progressCom :num="proNum"></progressCom>
                <div class="formname">
                  <span>Logic Device Name</span>
                  <el-select
                    v-model="searchForm.name"
                    size="mini"
                    filterable
                    multiple
                    collapse-tags
                    style="margin:0 20px 0 20px;width: 230px;line-height:28px;"
                  >
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                  <el-button type="primary" icon="el-icon-search" @click="filterBtn"></el-button>
                </div>
                <!-- <span @click="exportFun">
                  <img src="img/export.png" alt />
                  {{$t('avgVoltageCurrentQuery.export')}}
                </span>-->
              </div>
            </div>
          </div>
        </div>
        <el-table
          :data="resultTableData"
          v-loading="loadingT"
          border
          :header-cell-style="{background:'#F2F2F2',color:'rgb(51,51,51)'}"
          height="600"
        >
          <el-table-column :label="$t('global.id')" width="80">
            <template slot-scope="scope">{{ queryT.limit * (queryT.page - 1) + scope.$index + 1 }}</template>
          </el-table-column>
          <el-table-column prop="deviceName" :label="$t('clock.deviceName')"></el-table-column>
          <!-- <el-table-column prop="optype" :label="$t('upgrade.operType')">
            <template slot-scope="scope">{{ changeOpt(scope.row.optype) }}</template>
          </el-table-column> -->
          <el-table-column prop="errorCode" :label="$t('clock.status')"></el-table-column>
          <el-table-column prop="recTime" :label="$t('global.dataresponse')" width="180"></el-table-column>
          <el-table-column prop="dataName" :label="$t('global.dataname')" width="200"></el-table-column>
          <el-table-column prop="value" :label="$t('systemparam.val')">
            <!-- <template slot-scope="scope">{{ formatTimes(scope.row.value) }}</template> -->
          </el-table-column>
        </el-table>
      </el-dialog>
    </div>
</template>
<script>
import Pagination from "@/components/Pagination";
import { getViewList, getWhiteDCU, getDCUtoMeter } from "@/api/autoRegister";
import { createDelDevParamMeter,readTask,checkResult } from "@/api/clock";
import progressCom from "@/components/progress";
Array.prototype.push_unique = function() {
  for (let i = 0; i < arguments.length; i++) {
    let ele = arguments[i];
    if (this.indexOf(ele) === -1) {
      this.push(ele);
    }
  }
};
export default {
  components: {
    Pagination,
    progressCom
  },
  data() {
    return {
      tmnlTypeList: [],
      meterTypeList: [],
      tmnlFactoryList: [],
      meterFactoryList: [],
      resultTableData:[],
      tableData:[],
      dcuData: [],
      selectTableData: null,
      selectMeter:[],
      total1: 0,
      params1: {
        factoryCode: "",
        tmnlAssetNo: "",
        current: 1,
        size: 20
      },
      load1: false,
      meterData: [],
      total2: 0,
      params2: {
        current: 1,
        size: 20
      },
      queryT:{
        page: 1,
        limit: 9999
      },
      load2: false,
      loadingT:false,
      checkResultVisible:false,
      searchForm: {
        name: []
      },
      taskItem:[],
      isTimer: "", //定时器名称
      successNum: 0, //查询结果返回状态的累计数量
      proNum: 0, //进度
      paramValue: {},
      options:[]
    };
  },
  created() {
    this.getView();
  },
  methods: {
    // 查找集中器
    search1() {
      this.load1=true;
      getWhiteDCU({
        tmnlAssetNo: this.params1.tmnlAssetNo,
        current: this.params1.current,
        factoryCode: this.params1.factoryCode,
        size: this.params1.size
      }).then(res => {
        if(res.data.data.total!=0){
          this.dcuData = res.data.data.records;
        } else{
          this.dcuData = [];
        }
        this.total1 = res.data.data.total;
      });
      this.load1=false;
    },
    // 查找集中器下面的电表
    search2() {
      if(this.selectTableData!=null){
        this.load2=true;
        getDCUtoMeter({
          tmnlAssetNo: this.selectTableData.tmnlAssetNo,
          current: this.params2.current,
          factoryCode: this.params1.factoryCode,
          size: this.params2.size
        }).then(res => {
          if (res.data.data.total != 0) {
            this.meterData = res.data.data.records;
          }else{
            this.meterData = [];
          }
          this.total2 = res.data.data.total;
          this.load2=false;
        });
      } else{
        this.meterData = [];
        this.total2 = 0;
      }
    },
    selectFun(val) {
      this.selectTableData = val;
      this.search2();
    },
    refresh(){
      this.params2={
        current:1,
        size:20
      }
      this.search2();
    },
    getView() {
      getViewList({
        viewType: "meterType"
      }).then(res => {
        this.meterTypeList = res.data.data.list;
      });
      getViewList({
        viewType: "tmnlType"
      }).then(res => {
        this.tmnlTypeList = res.data.data.list;
      });
      getViewList({
        viewType: "TMNLFactoryType"
      }).then(res => {
        this.tmnlFactoryList = res.data.data.list;
      });
      getViewList({
        viewType: "meterFactoryType"
      }).then(res => {
        this.meterFactoryList = res.data.data.list;
      });
    },

    // 集中器清除所有白名单
    clearall() {
      if (this.selectTableData != null) {
        this.$confirm(
          this.$t("areaManage.confirmTip"),
          this.$t("areaManage.reminder"),
          {
            confirmButtonText: this.$t("global.yes"),
            cancelButtonText: this.$t("global.cancel"),
            type: "warning"
          }
      ).then(() => {
        let taskItem=[];
        taskItem=[{
          attriFlag: 1,
          attriId: 136,
          classId: 1,
          meterAsset: this.selectTableData.tmnlAssetNo,
          obis: "0.0.96.54.1.255",
          pointId: 0,
          optType: 2,
          terminalAddr: this.selectTableData.tmnlAssetNo,
          tmnlAssetNo: this.selectTableData.tmnlAssetNo
        }]
        readTask(taskItem).then(res => {
          this.taskItem = [];
          if(res.data.success){
            this.$message({
              message: this.$t("global.operatorSuccess"),
              type: "success"
            });
            res.data.data.forEach((item, index) => {
              this.taskItem.push({
                name: item.meterAsset,
                taskId: item.taskId,
                optType: item.optType,
              });
            });
            this.checkResult();
          }else{
            this.$message({
              message: this.$t('global.operaError'),
              type: 'error'
            })
          }
        });
        }).catch(() => {});
      } else {
        this.$notify({
          title: this.$t("global.warn"),
          message: this.$t("global.warncont"),
          type: "warning"
        });
      }
    },
    selectionChange(val){
      this.selectMeter=val;
    },
    // 单个电表删除白名单
    clearSingle() {
      if (this.selectMeter.length != 0) {
        this.$confirm(
          this.$t("areaManage.confirmTip"),
          this.$t("areaManage.reminder"),
          {
            confirmButtonText: this.$t("global.yes"),
            cancelButtonText: this.$t("global.cancel"),
            type: "warning"
          }
        ).then(() => {
          let taskItem=[];
          let addressList=[];
          this.selectMeter.forEach(item=>{
            addressList.push(item.metLogicDevName)
          })
          taskItem=[{
            attriFlag: 1,
            attriId: 135,
            classId: 1,
            meterAsset: this.selectMeter[0].tmnlAssetNo,
            obis: "0.0.96.54.1.255",
            pointId: 0,
            addressList:addressList,
            terminalAddr: this.selectMeter[0].tmnlAssetNo,
            tmnlAssetNo: this.selectMeter[0].tmnlAssetNo
          }]
          createDelDevParamMeter(taskItem).then(res => {
            this.taskItem = [];
            if(res.data.success){
              this.$message({
                message: this.$t("global.operatorSuccess"),
                type: "success"
              });
              res.data.data.forEach((item, index) => {
                this.taskItem.push({
                  name: item.meterAsset,
                  taskId: item.taskId,
                  optType: item.optType,
                });
              });
              this.checkResult();
            }else{
              this.$message({
                message: this.$t('global.operaError'),
                type: 'error'
              })
            }
          });
        }).catch(() => {});
      } else {
        this.$notify({
          title: this.$t("global.warn"),
          message: this.$t("global.warncont"),
          type: "warning"
        });
      }
    },
    read(){
      if (this.selectTableData != null) {
        let taskItem=[];
        taskItem=[{
          attriFlag: 0,
          attriId: 2,
          classId: 1,
          meterAsset: this.selectTableData.tmnlAssetNo,
          obis: "0.0.96.54.1.255",
          pointId: 0,
          optType: 1,
          terminalAddr: this.selectTableData.tmnlAssetNo,
          tmnlAssetNo: this.selectTableData.tmnlAssetNo
        }]
        readTask(taskItem).then(res => {
          this.taskItem = [];
          if(res.data.success){
            this.$message({
              message: this.$t("global.operatorSuccess"),
              type: "success"
            });
            res.data.data.forEach((item, index) => {
              this.taskItem.push({
                name: item.meterAsset,
                taskId: item.taskId,
                optType: item.optType,
              });
            });
            this.checkResult();
          }else{
            this.$message({
              message: this.$t('global.operaError'),
              type: 'error'
            })
          }
        });
      }else {
        this.$notify({
          title: this.$t("global.warn"),
          message: this.$t("global.warncont"),
          type: "warning"
        });
      }
    },
    checkResult() {
      if (this.taskItem.length === 0) {
        this.$message({
          message: this.$t("global.readdata"),
          type: "warning"
        });
      } else {
        this.checkResultVisible = true;
        // this.loadingT = true;
        this.startTime();
        let arr = [];
        let a = 0;

        this.taskItem.forEach(item => {
          arr.push(item.taskId);
        });
        this.paramValue = {
          taskIds: arr,
          pageNum: this.queryT.page,
          pageSize: this.queryT.limit
        };
        checkResult(this.paramValue).then(res => {
          this.tableData = [];
          this.totalT = res.data.data.count;
          if (res.data.data.items.length != 0) {
            res.data.data.items.forEach(item => {
              if (item.taskStauts != -1) {
                a++;
              }
              let param = {};
              this.taskItem.forEach(itemT => {
                if (itemT.taskId == item.taskId) {
                  param.deviceName = itemT.name;
                  param.errorCode = item.errorCode;
                  param.recTime = item.recTime;
                  param.optype = {
                    optType: itemT.optType,
                  };
                }
              });
              if ("responseCodeItems" in item.responseDbDataItem) {
                item.responseDbDataItem.responseCodeItems.forEach(itemT=>{
                  this.tableData.push({
                    dataName:itemT.codeLabel,
                    value:itemT.value,
                    ...param
                  })
                });
              }
            });
          }
          if (a == this.taskItem.length) {
            clearInterval(this.isTimer);
          }
          this.successNum = a;
          if (this.tableData.length != 0) {
            this.proNum = Math.round(
              (this.successNum / this.taskItem.length).toFixed(2) * 100
            );
          } else {
            this.proNum = 0;
          }
          this.filterBtn();
          this.allMeterName();
          // this.loadingT = false;
        });
      }
    },
    // 过滤按钮
    filterBtn() {
      let newList = [];
      if (this.searchForm.name.length === 0) {
        this.resultTableData = this.tableData;
      } else {
        for (let i = 0; i < this.searchForm.name.length; i++) {
          let arr = this.tableData.filter(item => {
            if (item.deviceName.includes(this.searchForm.name[i])) {
              return item;
            }
          });
          for (let j = 0; j < arr.length; j++) {
            newList.push(arr[j]);
          }
        }
        this.resultTableData = newList;
      }
    },

    allMeterName() {
      // 取出所有的电表
      let meterIdArr = [];
      this.options = [];
      for (let i = 0; i < this.tableData.length; i++) {
        meterIdArr.push_unique(this.tableData[i].deviceName);
      }
      for (let i = 0; i < meterIdArr.length; i++) {
        this.options.push({
          value: meterIdArr[i],
          label: meterIdArr[i]
        });
      }
    },
     // 定时器
    startTime() {
      this.isTimer = setTimeout(this.checkResult, 1000);
    },
    // 关闭弹框和定时器
    handleClose() {
      this.checkResultVisible = false;
      clearInterval(this.isTimer);
    },
    // 电表类型
    meterFormat (row) {
      let obj = this.meterTypeList.find(ele => Number(ele.typeCode) === Number(row.metType))
      if (obj) {
        return obj.typeName
      } else {
        return row.metType
      }
    },
    changeFactory(val) {
      for (let i in this.tmnlFactoryList) {
        if (val == this.tmnlFactoryList[i].typeCode) {
          return this.tmnlFactoryList[i].typeName;
        }
      }
    }
  }
};
</script>
<style lang='scss' scoped>
.filter-box {
  display: flex;
  align-items: center;
  padding-bottom: 10px;
  span {
    padding: 0 5px 0 20px;
  }
  .el-input {
    width: 150px;
    margin-right: 10px;
    /deep/ .el-input__inner {
      height: 32px;
    }
  }
}
.content {
  .head {
    height: 40px;
    padding: 5px 10px 0;
    background-color: #c6dedd;
    box-sizing: border-box;
    h3 {
      display: inline-block;
      height: 35px;
      padding: 0 20px;
      margin: 0;
      background-color: #fff;
      text-align: center;
      line-height: 35px;
      font-size: 14px;
      font-weight: normal;
    }
  }
  .table {
    position: relative;
    .table-head {
      height: 40px;
      padding-left: 20px;
      border: 1px solid #ddd;
      // border-bottom: 0;
      line-height: 40px;
      .right-box {
        float: right;
        display: flex;
        align-items: center;
        height: 40px;
        margin-right: 20px;
      }
      .formname {
        display: flex;
        align-items: center;
        height: 40px;
        > span {
          display: inline-block;
          width: 130px;
          border-left: 1px solid #ddd;
          height: 20px;
          line-height: 20px;
          padding: 0 0 0 20px;
        }
      }
      span {
        display: inline-block;
        padding: 0 20px;
        height: 20px;
        // margin-top: 10px;
        line-height: 20px;
        text-align: center;
        border-left: 1px solid #ddd;
        cursor: pointer;
        img {
          vertical-align: middle;
          margin-right: 8px;
        }
      }
    }
  }
}
</style>