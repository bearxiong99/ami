<template>
  <basic-container>
    <div class="second-floor">
      <div class="content">
        <div class="table">
          <div class="table-head">
            {{$t('route.dcuTaskConfig')}}
          </div>
          <div style="border:1px solid #ddd;">
            <el-form :model="dcuParams" label-position="left" label-width="200px" style="width:500px;margin:30px;">
              <el-form-item :label="$t('taskconfig.configtype')">
                <el-select v-model="dcuParams.eventCode" style="width:100%;" @change="obischange">
                  <el-option :label="ele.eventName" :value="ele.eventOBIS" v-for="(ele, i) in nameArr1" :key="i"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('taskconfig.effect')">
                <el-date-picker
                  style="width:100%"
                  v-model="dcuParams.basicTime"
                  :clearable="false"
                  type="datetime"
                  placeholder="">
                </el-date-picker>
              </el-form-item>
              <el-form-item :label="$t('systemparam.cycleinterval')">
                <el-input v-model="dcuParams.periodValue" style="width:50%"></el-input>
                <el-select v-model="dcuParams.periodType"  style="width:50%">
                  <el-option :label="$t('systemparam.minute')" :value="0"  ></el-option>
                  <el-option :label="$t('systemparam.hour')" :value="1"  ></el-option>
                  <el-option :label="$t('systemparam.day')" :value="2"  ></el-option>
                  <el-option :label="$t('systemparam.month')" :value="3"  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('taskconfig.isitenabled')">
                <el-radio-group v-model="dcuParams.benable">
                  <el-radio :label="1">Yes</el-radio>
                  <el-radio :label="2">No</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item :label="$t('taskconfig.slipcycle')">
                <el-input v-model="dcuParams.maxPeriod" style="width:50%;" :maxlength="10"></el-input>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
      <div class="content">
        <div class="table">
          <div class="table-head">
            {{$t('rtuparam.dcuList')}}
            <div class="right-box">
              <searchForm @searchFun="searchDevice" :isType="1"></searchForm>
              <span @click="read">
                <img src="img/read.png" alt />
                {{$t('global.read')}}
              </span>
              <span @click="write">
                <img src="img/write.png" alt />
                {{$t('global.write')}}
              </span>
              <span @click="checkResult">
                <img src="img/Checkresult.png" alt />
                {{$t('global.checkResult')}}
              </span>
            </div>
            <!-- <div style="float:right;margin-right:20px;">
              <progressTemp :propData="propData"></progressTemp>
            </div>-->
          </div>
          <!-- 集中器表格 -->
          <dcuTable
            :basicdata="basicdata"
            :loading="loading"
            @selectDCU="selectFun"
            :height="tableHeight"
            :pageNum="query"
          ></dcuTable>

          <pagination
            :page.sync="query.page"
            :limit.sync="query.limit"
            :total="total"
            @pagination="getData"
          ></pagination>
        </div>
      </div>

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
          <el-table-column prop="optype" :label="$t('upgrade.operType')">
            <template slot-scope="scope">{{ changeOpt(scope.row.optype) }}</template>
          </el-table-column>
          <el-table-column prop="errorCode" :label="$t('clock.status')"></el-table-column>
          <el-table-column prop="recTime" :label="$t('global.dataresponse')" width="180"></el-table-column>
          <el-table-column prop="value" :label="$t('systemparam.val')">
            <template slot-scope="scope">
              <div style="white-space:pre-wrap;word-wrap:break-word;">{{ scope.row.value }}</div>
            </template>
          </el-table-column>
        </el-table>
        <!-- <pagination
          :page.sync="queryT.page"
          :limit.sync="queryT.limit"
          :total="totalT"
          @pagination="checkResult"
        ></pagination>-->
      </el-dialog>
    </div>
  </basic-container>
</template>
<script>
import { mapGetters } from "vuex";
import { readTask,checkResult,setDCUConfig } from "@/api/clock";
import { getDevice, getViewList } from "@/api/autoRegister";
import { format } from "date-fns";
import Pagination from "@/components/Pagination";
import dcuTable from "@/components/dcuTable";
import searchForm from "@/components/searchForm";
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
  components: { Pagination, searchForm, dcuTable, progressCom },
  data() {
    return {
      tableData: [],
      basicdata: [],
      nameArr1:[
        {
          eventName:'Load Profile',
          eventOBIS:'0.0.96.52.11.255'
        },
        {
          eventName:'Energy Profile',
          eventOBIS:'0.0.96.52.2.255'
        },
        {
          eventName:'Monthly Billing Profile',
          eventOBIS:'0.0.96.52.3.255'
        },
        {
          eventName:'Event Profile',
          eventOBIS:'0.0.96.52.4.255'
        },
        {
          eventName:'Average Voltages and Currents Profile',
          eventOBIS:'0.0.96.52.6.255'
        },
        // {
        //   eventName:'Instantaneous Values Profile  Capture',
        //   eventOBIS:'0.0.96.52.5.255'
        // },
      ],
      total: 0,
      query: {
        page: 1,
        limit: 20
      },
      dcuParams:{
        eventCode:'0.0.96.52.11.255',
        basicTime:new Date(),
        periodValue:0,
        periodType:0,
        benable:1,
        maxPeriod:1,
      },
      checkResultVisible: false,
      resultTableData: [],
      selectTableData: [],
      taskItem: [],
      options: [],
      searchValue: {
        factoryCode: -1,
        serachValue: ""
      },
      searchForm: {
        name: []
      },
      loading: false,
      loadingT: false,
      queryT: {
        page: 1,
        limit: 9999
      },
      tableHeight: window.innerHeight - 630,
      isTimer: "", //定时器名称
      successNum: 0, //查询结果返回状态的累计数量
      proNum: 0, //进度
      paramValue: {},
      isFun:0  //0表示读  1表示写
    };
  },
  computed: {
    ...mapGetters(["treeNode", "colorName"])
  },
  watch: {
    treeNode: function() {
      this.searchValue = {
        factoryCode: -1, //厂家类型
        serachValue: "" //电表或者集中器逻辑设备名
      };
      if(!this.isNull(this.treeNode)){
        this.getData();
      }
    }
  },
  mounted() {
    window.onresize = () => {
      this.tableHeight = window.innerHeight - 630;
    };
  },
  methods: {
    isNull(arg1){
      return !arg1 && arg1!==0 && typeof arg1!=="boolean"?true:false;
    },
    formatTime(date) {
      return (
        date.getFullYear() +
        "-" +
        (date.getMonth() + 1 + "").padStart(2, "0") +
        "-" +
        (date.getDate() + "").padStart(2, "0") +
        " " +
        (date.getHours() + "").padStart(2, "0") +
        ":" +
        (date.getMinutes() + "").padStart(2, "0") +
        ":" +
        (date.getSeconds() + "").padStart(2, "0")
      );
    },
    // 选择数据
    selectFun(val) {
      this.selectTableData = val;
    },
    getData() {
      this.loading = true;
      let param = {
        isAllTmnal: 1, //查集中器是1 查电表是0
        pageNum: this.query.page,
        pageSize: this.query.limit,
        type: 5,
        ...this.searchValue
      };
      if (
        this.treeNode.deviceType === "meter" ||
        this.treeNode.deviceType === "tmnl"
      ) {
        param.terminalAddr=this.treeNode.deviceName;
      } else if(this.treeNode.deviceType === "group"){
        param.groupId=this.treeNode.id;
      } else {
        param.orgNo=this.treeNode.deviceNo;
      }
      getDevice(param).then(res => {
        if (res.data.data.total != 0) {
          this.basicdata = res.data.data.list;
        } else {
          this.basicdata = [];
        }
        this.total = res.data.data.total;
        this.loading = false;
      });
    },
    obischange(val){
      if(val==="0.0.96.52.11.255"){
        this.dcuParams.timeType=0;
      }else if(val==='0.0.96.52.2.255'){
        this.dcuParams.timeType=1;
      }else if(val==='0.0.96.52.3.255'){
        this.dcuParams.timeType=2;
      }else if(val==='0.0.96.52.4.255'){
        this.dcuParams.timeType=3;
      }
    },
    // 读任务配置
    read() {
      if (this.selectTableData.length != 0) {
        this.loading = true;
        this.isFun=0;
        let taskItems = [];
        this.selectTableData.forEach(item => {
            taskItems.push({
              attriFlag: 0,
              attriId: 2,
              classId: 7,
              meterAsset: item.cisAssetNo,
              obis: this.dcuParams.eventCode,
              optType: 1,
              pointId: item.attachMeterFlag,
              terminalAddr: item.cisAssetNo,
              tmnlAssetNo: item.cisAssetNo
            });
        });
        this.send(taskItems);
      } else {
        this.$notify({
          title: this.$t("global.warn"),
          message: this.$t("global.itemread"),
          type: "warning"
        });
      }
    },
    // 写任务配置
    write() {
      if (this.selectTableData.length != 0) {
        let taskItems = [];
        this.isFun=1;
        this.loading = true;
        this.selectTableData.forEach(item => {
          taskItems.push({
            attriFlag: 0,
            attriId: 2,
            classId: 7,
            meterAsset: item.cisAssetNo,
            obis: this.dcuParams.eventCode,
            pointId: item.attachMeterFlag,
            optType: 2,
            profileConfig: {
              basicTime:this.timeFormat(this.dcuParams.basicTime),
              benable:this.dcuParams.benable,
              maxPeriod:this.dcuParams.maxPeriod,
              periodType:this.dcuParams.periodType,
              periodValue:this.dcuParams.periodValue
            },
            terminalAddr: item.cisAssetNo,
            tmnlAssetNo: item.cisAssetNo
          });
        });
        this.send(taskItems);
      } else {
        this.$notify({
          title: this.$t("global.warn"),
          message: this.$t("global.warncont"),
          type: "warning"
        });
      }
    },

    send(val) {
      this.searchForm.name = [];
      this.resultTableData = [];
      this.proNum = 0;
      let sendName=this.isFun===0?readTask:setDCUConfig;
      sendName(val).then(res => {
        this.loading = false;
        this.taskItem = [];
        if (res.data.success) {
          res.data.data.forEach((item, index) => {
            this.taskItem.push({
              name: item.meterAsset,
              taskId: item.taskId,
              optType: item.optType,
            });
          });
          // sessionStorage.setItem("dcudata", JSON.stringify(this.taskItem));
          this.$message({
            message: this.$t("global.operatorSuccess"),
            type: "success"
          });
          this.checkResult();
          // }
        }
      });
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
          if (res.data.data.items.length != 0) {
            res.data.data.items.forEach(item => {
              if (item.taskStauts != -1) {
                a++;
              }
              let param = {
                value:''
              };
              let value=[];
              if ("responseCodeItems" in item.responseDbDataItem) {
                value=item.responseDbDataItem.responseCodeItems
              }
              this.taskItem.forEach(itemT => {
                if (itemT.taskId == item.taskId) {
                  param.deviceName = itemT.name;
                  param.errorCode = item.errorCode;
                  param.recTime = item.recTime;
                  param.optype = {
                    optType: itemT.optType,
                  };
                  value.forEach((item)=>{
                    if(item.code=='S0A6B003'){
                      param.value+=(`${item.codeLabel}:${this.changePeriodType(item.value)},\n `)
                    }else if(item.code=='S0A6B001'){
                      param.value+=(`${item.codeLabel}:${this.changeCode(item.value)},\n `)
                    }else{
                      param.value+=(`${item.codeLabel}:${item.value},\n `)
                    }
                  })
                }
              });
              this.tableData.push(param);
            });
          }
          if (a == this.tableData.length) {
            clearInterval(this.isTimer);
          }
          this.successNum = a;
          if (this.tableData.length != 0) {
            this.proNum = Math.round(
              (this.successNum / this.tableData.length).toFixed(2) * 100
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
    // 导出
    // exportFun() {},
    // 精确查找
    searchDevice(val) {
      this.searchValue = val;
      this.getData();
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
    resultFormat(row) {
      return row.resultCode === "01"
        ? this.$t("global.success")
        : this.$t("global.failure");
    },
    // 转化操作类型
    changeOpt(val){
      if (val.optType == 1) {
        return this.$t('global.read')
      } else {
        return this.$t('global.write')
      }
    },
    // 转化时间类型
    changePeriodType(val){
      if (val == 0) {
        return this.$t('systemparam.minute')
      } else if(val == 1){
        return this.$t('systemparam.hour')
      } else if(val == 2){
        return this.$t('systemparam.dat')
      } else if(val == 3){
        return this.$t('systemparam.month')
      }
    },
   
    changeCode(val){
      return val==0?this.$t('menu.yes'):this.$t('menu.no');
    },
    // 格式化时间
    timeFormat(date) {
      return (
        date.getFullYear() +
        "-" +
        (date.getMonth() + 1 + "").padStart(2, "0") +
        "-" +
        (date.getDate() + "").padStart(2, "0") +
        " " +
        (date.getHours() + "").padStart(2, "0") +
        ":" +
        (date.getMinutes() + "").padStart(2, "0") +
        ":" +
        (date.getSeconds() + "").padStart(2, "0")
      )
    },
  }
};
</script>
<style lang='scss' scoped>
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