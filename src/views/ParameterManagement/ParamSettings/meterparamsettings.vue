<template>
  <basic-container>
    <div class="second-floor">
      <div class="content">
        <div class="table">
          <div class="table-head">{{$t('rtuparam.meterParam')}}</div>
          <div style="padding:0 20px 20px;border:1px solid #ddd;">
            <div class="master">
              <div class="checkbox">
                <el-checkbox v-model="allcheck" @change="allCheck">{{$t('menu.meterparameters')}}</el-checkbox>
              </div>

              <el-row :gutter="10" style="margin-top:20px;">
                <el-col :span="12">
                  <el-checkbox
                    v-model="formInline.user1.checked"
                    style="width:360px;word-wrap:break-word"
                  >{{'LCD time-to-return to default screen(s)'}}</el-checkbox>
                  <el-input v-model="formInline.user1.value" :maxlength="20" style="width:200px"></el-input>
                </el-col>

                <el-col :span="12">
                  <el-checkbox
                    v-model="formInline.user2.checked"
                    style="width:360px;"
                  >{{'LCD auto scroll time(s)'}}</el-checkbox>
                  <el-input v-model="formInline.user2.value" :maxlength="20" style="width:200px"></el-input>
                </el-col>
              </el-row>

              <el-row :gutter="10" style="margin-top:20px;">
                <el-col :span="12">
                  <el-checkbox
                    v-model="formInline.user3.checked"
                    style="width:360px;margin-right:0;"
                  >{{'Enable LCD backlight'}}</el-checkbox>
                  <el-select v-model="formInline.user3.value" placeholder style="width:200px">
                    <el-option :label="$t('global.true')" value="1"></el-option>
                    <el-option :label="$t('global.false')" value="0"></el-option>
                  </el-select>
                </el-col>
                <el-col :span="12">
                  <el-checkbox
                    v-model="formInline.user4.checked"
                    style="width:360px;"
                  >{{'Start-stop time setting of LCD night off'}}</el-checkbox>
                  <!-- <el-input v-model="formInline.user4.value" :maxlength="20" style="width:200px"></el-input> -->
                  <el-time-select
                    v-model="formInline.user4.value1"
                    :picker-options="{
                      start: '00:00',
                      step: '01:00',
                      end: '23:00'
                    }"
                    :clearable="false"
                    placeholder=""
                    style="width:100px">
                  </el-time-select>
                  <el-time-select
                    v-model="formInline.user4.value2"
                    :picker-options="{
                      start: '00:00',
                      step: '01:00',
                      end: '23:00',
                    }"
                    :clearable="false"
                    placeholder=""
                    style="width:100px">
                  </el-time-select>
                </el-col>
              </el-row>

              <el-row :gutter="10" style="margin-top:20px;">
                <el-col :span="12">
                  <el-checkbox
                    v-model="formInline.user7.checked"
                    style="width:360px;"
                  >{{'Magnetic Interference Detection Time'}}</el-checkbox>
                  <el-input v-model="formInline.user7.value" :maxlength="20" style="width:200px"></el-input>
                </el-col>
                <el-col :span="12">
                  <el-checkbox
                    v-model="formInline.user8.checked"
                    style="width:360px"
                  >{{'Normal voltage`(V)'}}</el-checkbox>
                  <el-input v-model="formInline.user8.value" :maxlength="20" style="width:200px"></el-input>
                </el-col>
              </el-row>

              <el-row :gutter="10" style="margin-top:20px;">
                <!-- <el-col :span="12">
                  <el-checkbox
                    v-model="formInline.user5.checked"
                    style="width:360px;"
                  >{{'Release times of current over limit setting'}}</el-checkbox>
                </el-col> -->
                <el-col :span="12">
                  <el-checkbox
                    v-model="formInline.user6.checked"
                    style="width:360px"
                  >{{'Average Voltages and Currents Profile Interval(min)'}}</el-checkbox>
                  <el-input v-model="formInline.user6.value" :maxlength="20" style="width:200px"></el-input>
                </el-col>
              </el-row>
            </div>
          </div>
        </div>
      </div>
      <div class="content">
        <div class="table">
          <div class="table-head">
            {{$t('clock.meterList')}}
            <div class="right-box">
              <searchForm @searchFun="searchDevice" :isType="0"></searchForm>
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
           <!-- 表格组件 -->
          <meterTable :basicdata="basicdata" :loading="loading" @selectMeter="selectFun" :height='tableHeight' :pageNum='query'></meterTable>

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
              {{$t('clock.meterList')}}
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
          <el-table-column prop="tmnlAssetNo" :label="$t('global.ownerterminal')" width="180"></el-table-column>
          <el-table-column prop="deviceName" :label="$t('clock.deviceName')"></el-table-column>
          <el-table-column prop="optype" :label="$t('upgrade.operType')">
            <template slot-scope="scope">{{ changeOpt(scope.row.optype) }}</template>
          </el-table-column>
          <el-table-column prop="errorCode" :label="$t('clock.status')"></el-table-column>
          <el-table-column prop="recTime" :label="$t('global.dataresponse')" width="180"></el-table-column>
          <el-table-column prop="dataName" :label="$t('global.dataname')" width="200"></el-table-column>
          <el-table-column prop="value" :label="$t('systemparam.val')">
            <!-- <template slot-scope="scope">{{ formatTimes(scope.row.value) }}</template> -->
          </el-table-column>
        </el-table>
      </el-dialog>
    </div>
  </basic-container>
</template>
<script>
import { mapGetters } from "vuex";
import { readTask, checkResult, createClockSyn, getTmnl } from "@/api/clock";
import { getDevice, getViewList } from "@/api/autoRegister";
import Pagination from "@/components/Pagination";
import meterTable from '@/components/meterTable';
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
  components: { Pagination, searchForm, meterTable, progressCom },
  data() {
    return {
      tableData: [],
      basicdata: [],
      total: 0,
      query: {
        page: 1,
        limit: 20
      },
      dcuParams: {
        eventCode: "0.0.96.52.11.255"
      },
      formInline: {
        user1: {
          checked: false,
          value: "",
          obis: "0.1.94.96.22.255",
          attriId:2,
          classId:1,
        },
        user2: {
          checked: false,
          value: "",
          obis: "0.1.94.96.23.255",
          attriId:2,
          classId:1,
        },
        user3: {
          checked: false,
          value: "",
          obis: "0.1.94.96.24.255",
          attriId:2,
          classId:1,
        },
        user4: {
          checked: false,
          value: "",
          value1:"00:00",
          value2:'00:00',
          obis: "0.96.94.96.25.255",
          attriId:2,
          classId:1,
        },
        user5: {
          checked: false,
          value: "",
          obis: "0.96.94.96.11.255",
          attriId:2,
          classId:1,
        },
        user6: {
          checked: false,
          value: "",
          obis: "1.96.128.0.12.255",
          attriId:2,
          classId:3,
        },
        user7: {
          checked: false,
          value: "",
          obis: "1.96.128.0.3.255",
          attriId:2,
          classId:3,
        },
        user8: {
          checked: false,
          value: "",
          obis: "1.0.0.6.0.255",
          attriId:2,
          classId:3,
        }
      },
      checkResultVisible: false,
      allcheck: false,
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
      tableHeight: window.innerHeight - 670,
      isTimer: "", //定时器名称
      successNum: 0, //查询结果返回状态的累计数量
      proNum: 0, //进度
      paramValue: {}
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
      this.tableHeight = window.innerHeight - 670;
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
    allCheck(val){
      if(val){
        for(let i in this.formInline){
          this.formInline[i].checked=true;
        }
      }else{
        for(let i in this.formInline){
          this.formInline[i].checked=false;
        }
      }
    },
    // 选择数据
    selectFun(val) {
      this.selectTableData = val;
    },
    getData() {
      this.loading = true;
      let param = {
        isAllTmnal: 0, //查集中器是1 查电表是0
        pageNum: this.query.page,
        pageSize: this.query.limit,
        ...this.searchValue
      };
      if (this.treeNode.deviceType==='tmnl') {
        param.terminalAddr=this.treeNode.deviceName;
      } else if(this.treeNode.deviceType==='meter'){
        param.meterAddr=this.treeNode.deviceName;
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
    // 读任务配置
    read() {
      if (this.selectTableData.length != 0) {
        if (
          this.formInline.user1.checked ||
          this.formInline.user2.checked ||
          this.formInline.user3.checked ||
          this.formInline.user4.checked ||
          this.formInline.user5.checked ||
          this.formInline.user6.checked ||
          this.formInline.user7.checked ||
          this.formInline.user8.checked
        ) {

          this.loading = true;
          let taskItems = [];
          this.selectTableData.forEach(item => {
            for(let i in this.formInline){
              if(this.formInline[i].checked){
                taskItems.push({
                  attriFlag: 0,
                  attriId: this.formInline[i].attriId,
                  classId: this.formInline[i].classId,
                  meterAsset: item.commAddr1,
                  obis: this.formInline[i].obis,
                  optType: 1,
                  pointId: item.mpSn,
                  terminalAddr: item.terminalAddr,
                  tmnlAssetNo: item.etmnlassetNo
                });
              }
            }    
          }); 
        this.send(taskItems);
        }else {
          this.$message({
            message: this.$t("global.itemread"),
            type: "warning"
          });
        }
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
        if (
            this.formInline.user1.checked ||
            this.formInline.user2.checked ||
            this.formInline.user3.checked ||
            this.formInline.user4.checked ||
            this.formInline.user5.checked ||
            this.formInline.user6.checked ||
            this.formInline.user7.checked ||
            this.formInline.user8.checked
          ) {
          let taskItems = [];
          this.loading = true;
          this.selectTableData.forEach(item => {
            for(let i in this.formInline){
              if(this.formInline[i].checked){
                if(i=='user4'){
                  this.formInline[i].value=this.formInline[i].value1.substring(0,2)+this.formInline[i].value2.substring(0,2)
                }
                taskItems.push({
                  attriFlag: 0,
                  attriId: this.formInline[i].attriId,
                  classId: this.formInline[i].classId,
                  meterAsset: item.commAddr1,
                  obis: this.formInline[i].obis,
                  pointId: item.mpSn,
                  optType: 2,
                  paramValue: this.formInline[i].value,
                  terminalAddr: item.terminalAddr,
                  tmnlAssetNo: item.etmnlassetNo
                });
              }
            }
          });
        this.send(taskItems);
        } else {
          this.$message({
            message: this.$t("global.itemread"),
            type: "warning"
          });
        }
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
      readTask(val).then(res => {
        this.loading = false;
        this.taskItem = [];
        if (res.data.success) {
          res.data.data.forEach((item, index) => {
            this.taskItem.push({
              tmnlAssetNo:item.tmnlAssetNo,
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
                value: ""
              };
              let value = [];
              if ("responseCodeItems" in item.responseDbDataItem) {
                value = item.responseDbDataItem.responseCodeItems;
              }
              this.taskItem.forEach(itemT => {
                if (itemT.taskId == item.taskId) {
                  param.tmnlAssetNo=itemT.tmnlAssetNo;
                  param.deviceName = itemT.name;
                  param.errorCode = item.errorCode;
                  param.recTime = item.recTime;
                  param.optype = {
                    optType: itemT.optType,
                  };
                  value.forEach(item => {
                    param.value = item.value;
                    param.dataName = item.codeLabel;
                  });
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
    changeOpt(val){
      if (val.optType == 1) {
        return this.$t('global.read')
      } else {
        return this.$t('global.write')
      }
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
.master,
.secondary {
  position: relative;
  margin-top: 30px;
  padding: 20px;
  border: 1px solid #ddd;
  box-sizing: border-box;
  .checkbox {
    position: absolute;
    top: -12px;
    left: 20px;
    padding: 0 5px;
    background-color: #fff;
    box-sizing: border-box;
  }
  span {
    display: inline-block;
    width: 164px;
    color: #666666;
  }
}
</style>