<template>
  <basic-container>
    <div>
      <el-tabs v-model="active1" type="card">
        <el-tab-pane :label="$t('clock.clockSync')" name="clockSync">
          <div class="form">
            <div class="time-mode">
              <el-checkbox
                v-model="checked"
                style="width:100px;line-height:32px;padding-right:20px"
              >{{$t('clock.timeMode')}}</el-checkbox>
              <el-select v-model="timeMode" placeholder size="small" style="width:200px;">
                <el-option :label="$t('clock.systemTime')" :value="0"></el-option>
                <el-option :label="$t('clock.customTime')" :value="1"></el-option>
              </el-select>
              <span>{{$t('clock.clock')}}</span>
              <el-date-picker
                v-model="customTime"
                type="datetime"
                size="small"
                v-if="timeMode === 1"
                style="width:200px;"
              ></el-date-picker>
              <el-input
                :maxlength="30"
                size="small"
                v-model="systemTime"
                style="width:200px;"
                v-else
              ></el-input>
            </div>
            <div class="time-zone">
              <el-checkbox
                v-model="checkedT"
                style="width:100px;;padding-right:20px"
              >{{$t('clock.timeZone')}}</el-checkbox>
              <el-select v-model="num" size="small" style="width:200px;" placeholder>
                <el-option
                  v-for="item in timeList"
                  :key="item.code"
                  :label="item.disc"
                  :value="item.code"
                ></el-option>
              </el-select>
            </div>
          </div>
          <div class="content" style="padding: 0 10px;">
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
        </el-tab-pane>
        <el-tab-pane :label="$t('clock.dcuHistory')" name="clockSyncdata">
          <el-form :inline="true" :model="params" label-position="left">
            <!-- <el-form-item :label="$t('clock.deviceName')">
              <el-input v-model="params.deviceName"></el-input>
            </el-form-item>-->
            <el-form-item :label="$t('global.from')">
              <el-date-picker
                v-model="params.time1"
                type="date"
                size="small"
                :clearable="false"
                :editable="false"
              ></el-date-picker>
            </el-form-item>
            <el-form-item :label="$t('global.to')">
              <el-date-picker
                v-model="params.time2"
                type="date"
                size="small"
                :clearable="false"
                :editable="false"
              ></el-date-picker>
            </el-form-item>
            <el-form-item :label="$t('clock.timeType')">
              <el-select v-model="params.isAuto" placeholder="">
                <el-option :label="$t('global.all')" value=""></el-option>
                <el-option :label="$t('clock.auto')" value="0"></el-option>
                <el-option :label="$t('clock.noAuto')" value="1"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="searchHis" size="small">{{$t('global.search')}}</el-button>
            </el-form-item>
          </el-form>
          <div class="uptop">
            <div>{{$t('clock.dcuHistory')}}</div>
          </div>
          <el-table
            :data="hisData"
            border
            style="width: 100%"
            :height="tableHeight1"
            :header-cell-style="{background:'#F2F2F2',color:'rgb(51,51,51)'}"
            v-loading="loadingT"
          >
            <el-table-column :label="$t('change.no')" width="50">
              <template
                slot-scope="scope"
              >{{ params.size * (params.current - 1) + scope.$index + 1 }}</template>
            </el-table-column>
            <el-table-column :label="$t('clock.deviceName')" prop="tmnlAssetNo"></el-table-column>
            <el-table-column :label="$t('clock.syncTime')" prop="synTime"></el-table-column>
            <el-table-column :label="$t('clock.hostTimeBefore')" prop="hostTimeBefore"></el-table-column>
            <el-table-column :label="$t('clock.tmnlTimeBefore')" prop="tmnlTimeBefore"></el-table-column>
            <el-table-column :label="$t('clock.hostTimeAfter')" prop="hostTimeAfter"></el-table-column>
            <el-table-column :label="$t('clock.tmnlTimeAfter')" prop="tmnlTimeAfter"></el-table-column>
            <el-table-column :label="$t('clock.isAuto')" prop="isAuto" :formatter="autoFormat"></el-table-column>
            <el-table-column :label="$t('clock.userID')" prop="userName"></el-table-column>
            <el-table-column
              :label="$t('clock.result')"
              prop="resultCode"
              :formatter="resultFormat"
            ></el-table-column>
          </el-table>
          <pagination
            :page.sync="params.current"
            :limit.sync="params.size"
            :total="histotal"
            @pagination="searchHis"
            style="margin-top:-1px"
          ></pagination>
        </el-tab-pane>
      </el-tabs>

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
            <template slot-scope="scope">{{ formatTimes(scope.row.value) }}</template>
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
import { readTask, checkResult, createClockSyn,getTmnl } from "@/api/clock";
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
      active1: "clockSync",
      active2: "Uni-cast",
      timeMode: 0,
      customTime: "",
      systemTime: "",
      num: "-180",
      timeList: [
        {
          code: "660",
          disc: "(UTC-11)"
        },
        {
          code: "600",
          disc: "(UTC-10)"
        },
        {
          code: "540",
          disc: "(UTC-09)"
        },
        {
          code: "480",
          disc: "(UTC-08)"
        },
        {
          code: "420",
          disc: "(UTC-07)"
        },
        {
          code: "360",
          disc: "(UTC-06)"
        },
        {
          code: "300",
          disc: "(UTC-05)"
        },
        {
          code: "240",
          disc: "(UTC-04)"
        },
        {
          code: "180",
          disc: "(UTC-03)"
        },
        {
          code: "120",
          disc: "(UTC-02)"
        },
        {
          code: "60",
          disc: "(UTC-01)"
        },
        {
          code: "0",
          disc: "(UTC+0)"
        },
        {
          code: "-60",
          disc: "(UTC+01)"
        },
        {
          code: "-120",
          disc: "(UTC+02)"
        },
        {
          code: "-180",
          disc: "(UTC+03)"
        },
        {
          code: "-240",
          disc: "(UTC+04)"
        },
        {
          code: "-300",
          disc: "(UTC+05)"
        },
        {
          code: "-360",
          disc: "(UTC+06)"
        },
        {
          code: "-420",
          disc: "(UTC+07)"
        },
        {
          code: "-480",
          disc: "(UTC+08)"
        },
        {
          code: "-540",
          disc: "(UTC+09)"
        },
        {
          code: "-600",
          disc: "(UTC+10)"
        },
        {
          code: "-660",
          disc: "(UTC+11)"
        },
        {
          code: "-720",
          disc: "(UTC+12)"
        }
      ],
      tableData: [],
      basicdata: [],
      hisData:[],
      total: 0,
      query: {
        page: 1,
        limit: 20
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
      checked: false,
      checkedT: false,
      dialogVisible: false,
      viewList: [],
      factoryList: [],
      totalT: 0,
      queryT: {
        page: 1,
        limit: 9999
      },
      tableHeight: window.innerHeight - 470,
      isTimer: "", //定时器名称
      successNum: 0, //查询结果返回状态的累计数量
      proNum: 0, //进度
      paramValue: {},
      timezero: 0,
      params: {
        deviceName: "",
        time1: this.calcDate(new Date()),
        time2: new Date(),
        size: 20,
        current: 1,
        isAuto:'',
      },
      tableHeight1: window.innerHeight - 420,
      histotal: 0
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
    this.customTime = this.formatTime(new Date());
    // 定时任务开始
    setInterval(this.getNowTime, 1000);
    this.getView();
    window.onresize = () => {
      this.tableHeight = window.innerHeight - 470;
      this.tableHeight1 = window.innerHeight - 420;
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
    // 获取当前时间
    getNowTime() {
      this.systemTime = this.formatTime(new Date());
    },
    // 选择数据
    selectFun(val) {
      this.selectTableData = val;
    },
    getData() {
      this.loading = true;
      let param = {};
      if (
        this.treeNode.deviceType === "meter" ||
        this.treeNode.deviceType === "tmnl"
      ) {
        param = {
          isAllTmnal: 1, //查集中器是1 查电表是0
          pageNum: this.query.page,
          pageSize: this.query.limit,
          type: 5,
          terminalAddr: this.treeNode.deviceName,
          ...this.searchValue
        };
      } else if(this.treeNode.deviceType === "group"){
        param={
          isAllTmnal: 1,
          groupId:this.treeNode.id,
          pageNum: this.query.page,
          pageSize: this.query.limit,
          type:5,
          ...this.searchValue
        }
      }else {
        param = {
          isAllTmnal: 1, //查集中器是1 查电表是0
          orgNo: this.treeNode.deviceNo,
          pageNum: this.query.page,
          type: 5,
          pageSize: this.query.limit,
          ...this.searchValue
        };
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
      for (let i in this.factoryList) {
        if (val == this.factoryList[i].typeCode) {
          return this.factoryList[i].typeName;
        }
      }
    },
    // 读时钟
    read() {
      if (this.selectTableData.length != 0) {
        if (this.checked || this.checkedT) {
          this.loading = true;
          let taskItems = [];
          this.selectTableData.forEach(item => {
            if (this.checked) {
              taskItems.push({
                attriFlag: 0,
                attriId: 2,
                classId: 8,
                meterAsset: item.cisAssetNo,
                obis: "0.0.1.0.0.255",
                optType: 1,
                pointId: item.attachMeterFlag,
                terminalAddr: item.cisAssetNo,
                tmnlAssetNo: item.cisAssetNo
              });
            }
            if (this.checkedT) {
              taskItems.push({
                attriFlag: 0,
                attriId: 3,
                classId: 8,
                meterAsset: item.cisAssetNo,
                obis: "0.0.1.0.0.255",
                optType: 1,
                pointId: item.attachMeterFlag,
                terminalAddr: item.cisAssetNo,
                tmnlAssetNo: item.cisAssetNo
              });
            }
          });
          this.send(taskItems);
        } else {
          this.$notify({
            title: this.$t("global.warn"),
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
    // 写时钟
    write() {
      if (this.selectTableData.length != 0) {
        let taskItems = [];
        this.loading = true;
        if (this.checked || this.checkedT) {
          if (this.checked) {
            this.selectTableData.forEach(item => {
              if (this.checked) {
                let obj = {
                  tmnlId: item.terminalId,
                  meterAsset: item.cisAssetNo,
                  pointId: item.attachMeterFlag,
                  terminalAddr: item.cisAssetNo,
                  tmnlAssetNo: item.cisAssetNo
                };
                if (this.timeMode == 1) {
                  obj.paramValue = this.formatTime(this.customTime);
                } else {
                  obj.paramValue = this.systemTime;
                }
                taskItems.push(obj);
              }
            });
            createClockSyn(taskItems).then(res => {
              if (res.data.data.returnStatus == 1) {
                this.$message({
                  message: this.$t("global.operatorSuccess"),
                  type: "success"
                });
              } else {
                this.$message({
                  message: this.$t("global.operaError"),
                  type: "error"
                });
              }
              this.loading = false;
            });
          }
          taskItems = [];
          if (this.checkedT) {
            this.selectTableData.forEach(item => {
              if (this.checkedT) {
                taskItems.push({
                  attriFlag: 0,
                  attriId: 3,
                  classId: 8,
                  meterAsset: item.cisAssetNo,
                  obis: "0.0.1.0.0.255",
                  pointId: item.attachMeterFlag,
                  optType: 2,
                  paramValue: this.num,
                  terminalAddr: item.cisAssetNo,
                  tmnlAssetNo: item.cisAssetNo
                });
              }
            });
            this.send(taskItems);
          }
        } else {
          this.$notify({
            title: this.$t("global.warn"),
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
              name: item.meterAsset,
              taskId: item.taskId,
              optType: item.optType,
              attriId: item.attriId
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
                    attriId: itemT.attriId
                  };
                }
              });
              if ("responseCodeItems" in item.responseDbDataItem) {
                item.responseDbDataItem.responseCodeItems.forEach(
                  (itemF, index) => {
                    param.value = itemF.value;
                  }
                );
              }
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
    exportFun() {},
    // 精确查找
    searchDevice(val) {
      this.searchValue = val;
      this.getData();
    },
    // 查询结果内的搜索
    search() {
      this.checkResult();
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
    calcDate(date) {
      return new Date(date.setTime(date.getTime() - 3600 * 1000 * 24 * 7));
    },
    autoFormat(row) {
      return row.isAuto == 0 ? this.$t("clock.auto") : this.$t("clock.noAuto");
    },
    resultFormat(row) {
      return row.resultCode === "01"
        ? this.$t("global.success")
        : this.$t("global.failure");
    },
    // 格式化时间
    timeFormat(val) {
      let date = new Date(val)
      return (
        date.getFullYear() +
        '-' +
        (date.getMonth() + 1 + '').padStart(2, '0') +
        '-' +
        (date.getDate() + '').padStart(2, '0')
      )
    },
    searchHis() {
      if (!this.treeNode) {
        this.$notify({
          title: this.$t("global.warn"),
          message: this.$t("global.warntree"),
          type: "warning"
        });
        return;
      }
      if (this.params.time1.getTime() > this.params.time2.getTime()) {
        this.$message({
          type: "error",
          message: this.$t("auto.timeBug")
        });
        return;
      }
      this.loadingT = true;
      let obj = {
        // terminalId: this.params.deviceName,
        startRow: this.params.current,
        pageSize: this.params.size,
        startTime: this.timeFormat(this.params.time1) + " 00:00:00",
        endTime: this.timeFormat(this.params.time2) + " 23:59:59",
        isAuto: this.params.isAuto
      };
      if (this.treeNode.deviceType === "org") {
        obj.orgNo = this.treeNode.deviceNo;
      } else if (this.treeNode.deviceType === "tmnl") {
        obj.tmnlAssetNo = this.treeNode.deviceNo;
      } else if (this.treeNode.deviceType === "meter") {
        this.tableData = [];
        this.total = 0;
        this.loadingT = false;
        return;
      }
      getTmnl(obj)
        .then(res => {
          if (res.data.success) {
            if (res.data.data.count > 0) {
              this.hisData = res.data.data.list
              this.histotal = res.data.data.count
            } else {
              this.hisData = []
              this.histotal = res.data.data.count
            }
          } else {
            this.$message({
              message: this.$t("global.searchFail"),
              type: "error"
            });
          }
          this.loadingT = false;
        })
        .catch(() => {
          this.loadingT = false;
        });
    },
    formatTimes(val) {
      if (!isNaN(val)) {
        for (let i in this.timeList) {
          if (this.timeList[i].code == val) {
            return this.timeList[i].disc;
          }
        }
      } else {
        return val;
      }
    },
    changecode(val) {
      for (let i in this.viewList) {
        if (this.viewList[i].typeCode == val) {
          return this.viewList[i].typeName;
        }
      }
    },
    changeOpt(val) {
      if (val.optType == 1) {
        if (val.attriId == 2) {
          return this.$t("global.readtime");
        } else if (val.attriId == 3) {
          return this.$t("global.readzone");
        }
      } else {
        if (val.attriId == 2) {
          return this.$t("global.writetime");
        } else if (val.attriId == 3) {
          return this.$t("global.writezone");
        }
      }
    },
    calcDate(date) {
      return new Date(date.setTime(date.getTime() - 3600 * 1000 * 24 * 7));
    },
    formatTimeFrom(date) {
      return (
        date.getFullYear() +
        "-" +
        (date.getMonth() + 1 + "").padStart(2, "0") +
        "-" +
        (date.getDate() + "").padStart(2, "0") +
        " 00:00:00"
      );
    },
    formatTimeTo(date) {
      return (
        date.getFullYear() +
        "-" +
        (date.getMonth() + 1 + "").padStart(2, "0") +
        "-" +
        (date.getDate() + "").padStart(2, "0") +
        " 23:59:59"
      );
    }
  }
};
</script>
<style lang='scss' scoped>
.el-tabs {
  /deep/ .el-tabs__header {
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
  /deep/ #pane-clockSync {
    padding: 0 !important;
  }
}
.form {
  padding: 0 20px 10px;
  .time-mode,
  .clock,
  .time-zone {
    display: flex;
    margin-bottom: 10px;
    span {
      display: inline-block;
      line-height: 32px;
      padding-right: 20px;
      margin-left: 30px;
    }
  }
}
.uptop {
  padding: 10px;
  margin-bottom: -1px;
  border: 1px solid #dddddd;
}
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
.filter-box {
  padding-bottom: 10px;
  & > .el-input {
    width: 150px;
    margin-right: 10px;
  }
}
.history-content {
  width: 100%;
  .head {
    height: 40px;
    padding-left: 20px;
    border: 1px solid #ddd;
    border-bottom: 0;
    line-height: 40px;
  }
}
</style>