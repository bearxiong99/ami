<template>
  <basic-container>
    <div class="second-floor">
      <div class="content">
        <div class="table">
          <div class="table-head">{{$t('route.eventPushFilter')}}</div>
          <div style="padding:0 20px 20px;height:250px;overflow:scroll;border:1px solid #ddd;">
            <el-row :gutter="20">
              <el-col :span="24">
                <div class="master">
                  <div class="checkbox">
                    <el-checkbox
                      v-model="formInline.user1.checked"
                      @change="changeAll()"
                    >{{'Error Resister 1'}}</el-checkbox>
                  </div>
                  <div>
                    <el-checkbox v-model="formInline.user1.checkedT[4]" label="Password changed"></el-checkbox>
                    <el-checkbox
                      v-model="formInline.user1.checkedT[3]"
                      label="Meter initialization"
                    ></el-checkbox>
                    <el-checkbox
                      v-model="formInline.user1.checkedT[2]"
                      label="Low/Failure Storage Device"
                    ></el-checkbox>
                    <el-checkbox v-model="formInline.user1.checkedT[1]" label="Memory error"></el-checkbox>
                    <el-checkbox
                      v-model="formInline.user1.checkedT[0]"
                      label="Clock initialization"
                    ></el-checkbox>
                  </div>
                </div>
              </el-col>

              <el-col :span="24">
                <div class="master">
                  <div class="checkbox">
                    <el-checkbox
                      v-model="formInline.user2.checked"
                      @change="changeAll()"
                    >{{'Error Resister 2'}}</el-checkbox>
                  </div>
                  <div>
                    <el-checkbox v-model="formInline.user2.checkedT[6]" label="Current Missing(L3)"></el-checkbox>
                    <el-checkbox v-model="formInline.user2.checkedT[5]" label="Current Missing(L2)"></el-checkbox>
                    <el-checkbox v-model="formInline.user2.checkedT[4]" label="Current Missing(L1)"></el-checkbox>
                    <el-checkbox
                      v-model="formInline.user2.checkedT[3]"
                      label="Missing neutral line connection"
                    ></el-checkbox>
                    <el-checkbox v-model="formInline.user2.checkedT[2]" label="Voltage cut(L3)"></el-checkbox>
                    <el-checkbox v-model="formInline.user2.checkedT[1]" label="Voltage cut(L2)"></el-checkbox>
                    <el-checkbox v-model="formInline.user2.checkedT[0]" label="Voltage cut(L1)"></el-checkbox>
                  </div>
                </div>
              </el-col>

              <el-col :span="24">
                <div class="master">
                  <div class="checkbox">
                    <el-checkbox
                      v-model="formInline.user3.checked"
                      @change="changeAll()"
                    >{{'Error Resister 3'}}</el-checkbox>
                  </div>
                  <div>
                    <el-checkbox v-model="formInline.user3.checkedT[7]" label="Top cover open"></el-checkbox>
                    <el-checkbox v-model="formInline.user3.checkedT[6]" label="Terminal cover open"></el-checkbox>
                    <el-checkbox
                      v-model="formInline.user3.checkedT[5]"
                      label="Phase and neutral wire swapped(L3)"
                    ></el-checkbox>
                    <el-checkbox
                      v-model="formInline.user3.checkedT[4]"
                      label="Phase and neutral wire swapped(L2)"
                    ></el-checkbox>
                    <el-checkbox
                      v-model="formInline.user3.checkedT[3]"
                      label="Phase and neutral wire swapped(L1)"
                    ></el-checkbox>
                    <el-checkbox v-model="formInline.user3.checkedT[2]" label="Reverse current(L3)"></el-checkbox>
                    <el-checkbox v-model="formInline.user3.checkedT[1]" label="Reverse current(L2)"></el-checkbox>
                    <el-checkbox v-model="formInline.user3.checkedT[0]" label="Reverse current(L1)"></el-checkbox>
                  </div>
                </div>
              </el-col>

              <el-col :span="24">
                <div class="master">
                  <div class="checkbox">
                    <el-checkbox
                      v-model="formInline.user4.checked"
                      @change="changeAll()"
                    >{{'Error Resister 4'}}</el-checkbox>
                  </div>
                  <div>
                    <el-checkbox
                      v-model="formInline.user4.checkedT[6]"
                      label="∑Li PF under limit threshold"
                    ></el-checkbox>
                    <el-checkbox v-model="formInline.user4.checkedT[5]" label="Low voltage (L3)"></el-checkbox>
                    <el-checkbox v-model="formInline.user4.checkedT[4]" label="Low voltage (L2)"></el-checkbox>
                    <el-checkbox v-model="formInline.user4.checkedT[3]" label="Low voltage (L1)"></el-checkbox>
                    <el-checkbox v-model="formInline.user4.checkedT[2]" label="Over current (L3)"></el-checkbox>
                    <el-checkbox v-model="formInline.user4.checkedT[1]" label="Over current (L2)"></el-checkbox>
                    <el-checkbox v-model="formInline.user4.checkedT[0]" label="Over current (L1)"></el-checkbox>
                  </div>
                </div>
              </el-col>

              <el-col :span="24">
                <div class="master">
                  <div class="checkbox">
                    <el-checkbox
                      v-model="formInline.user5.checked"
                      @change="changeAll()"
                    >{{'Error Resister 5'}}</el-checkbox>
                  </div>
                  <div>
                    <el-checkbox
                      v-model="formInline.user5.checkedT[7]"
                      label="Wrong password tried (3 times)"
                    ></el-checkbox>
                    <el-checkbox
                      v-model="formInline.user5.checkedT[6]"
                      label="Magnetic interference detected"
                    ></el-checkbox>
                    <el-checkbox
                      v-model="formInline.user5.checkedT[5]"
                      label="Phase-neutral bypassing(L3-N)"
                    ></el-checkbox>
                    <el-checkbox
                      v-model="formInline.user5.checkedT[4]"
                      label="Phase-neutral bypassing(L2-N)"
                    ></el-checkbox>
                    <el-checkbox
                      v-model="formInline.user5.checkedT[3]"
                      label="Phase-neutral bypassing(L1-N)"
                    ></el-checkbox>
                    <el-checkbox
                      v-model="formInline.user5.checkedT[2]"
                      label="Phase sequence reversal(L1-L2)"
                    ></el-checkbox>
                    <el-checkbox
                      v-model="formInline.user5.checkedT[1]"
                      label="Phase sequence reversal(L1-L3)"
                    ></el-checkbox>
                    <el-checkbox
                      v-model="formInline.user5.checkedT[0]"
                      label="Phase sequence reversal(L2-L3)"
                    ></el-checkbox>
                  </div>
                </div>
              </el-col>

              <el-col :span="24">
                <div class="master">
                  <div class="checkbox">
                    <el-checkbox
                      v-model="formInline.user6.checked"
                      @change="changeAll()"
                    >{{'Error Resister 6'}}</el-checkbox>
                  </div>
                  <div>
                    <el-checkbox
                      v-model="formInline.user6.checkedT[6]"
                      label="Harmonics Limit (current)"
                    ></el-checkbox>
                    <el-checkbox v-model="formInline.user6.checkedT[5]" label="Swell limit"></el-checkbox>
                    <el-checkbox v-model="formInline.user6.checkedT[4]" label="Sag limit"></el-checkbox>
                    <el-checkbox
                      v-model="formInline.user6.checkedT[3]"
                      label="Harmonics Limit(voltage)"
                    ></el-checkbox>
                    <el-checkbox v-model="formInline.user6.checkedT[2]" label="Maximum current"></el-checkbox>
                    <el-checkbox v-model="formInline.user6.checkedT[1]" label="Output relay state"></el-checkbox>
                  </div>
                </div>
              </el-col>

              <el-col :span="24">
                <div class="master">
                  <div class="checkbox">
                    <el-checkbox
                      v-model="formInline.user7.checked"
                      @change="changeAll()"
                    >{{'Error Resister 7'}}</el-checkbox>
                  </div>
                  <div>
                    <el-checkbox v-model="formInline.user7.checkedT[2]" label="CT Bypass L3"></el-checkbox>
                    <el-checkbox v-model="formInline.user7.checkedT[1]" label="CT Bypass L2"></el-checkbox>
                    <el-checkbox v-model="formInline.user7.checkedT[0]" label="CT Bypass L1"></el-checkbox>
                  </div>
                </div>
              </el-col>
            </el-row>
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
          <meterTable
            :basicdata="basicdata"
            :loading="loading"
            @selectMeter="selectFun"
            :height="tableHeight"
            :pageNum="query"
          ></meterTable>

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
import { readTask, checkResult, createClockSyn, getTmnl } from "@/api/clock";
import { getDevice, getViewList } from "@/api/autoRegister";
import { format } from "date-fns";
import Pagination from "@/components/Pagination";
import meterTable from "@/components/meterTable";
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
      sagCheckAll: false,
      swellCheckAll: false,
      temCheckAll: false,
      powerCheckAll: false,
      formInline: {
        user1: {
          checked: false,
          checkedT: [false, false, false, false, false],
          obis: "0.0.97.98.11.255"
        },
        user2: {
          checked: false,
          checkedT: [false, false, false, false, false, false, false],
          obis: "0.0.97.98.12.255"
        },
        user3: {
          checked: false,
          checkedT: [false, false, false, false, false, false, false, false],
          obis: "0.0.97.98.13.255"
        },
        user4: {
          checked: false,
          checkedT: [false, false, false, false, false, false, false],
          obis: "0.0.97.98.14.255"
        },
        user5: {
          checked: false,
          checkedT: [false, false, false, false, false, false, false, false],
          obis: "0.0.97.98.15.255"
        },
        user6: {
          checked: false,
          checkedT: [false, false, false, false, false, false, false],
          obis: "0.0.97.98.16.255"
        },
        user7: {
          checked: false,
          checkedT: [false, false, false],
          obis: "0.0.97.98.17.255"
        }
      },
      checkResultVisible: false,
      allcheck: false,
      resultTableData: [],
      selectTableData: [],
      taskItem: [],
      options: [],
      searchValue: {
        factoryCode: -1, //厂家类型
        type: -1, //电表类型或者集中器类型
        serachValue: "" //电表或者集中器逻辑设备名
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
      tableHeight: window.innerHeight - 624,
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
        type: -1, //电表类型或者集中器类型
        serachValue: "" //电表或者集中器逻辑设备名
      };
      if (!this.isNull(this.treeNode)) {
        this.getData();
      }
    }
  },
  mounted() {
    window.onresize = () => {
      this.tableHeight = window.innerHeight - 624;
    };
  },
  methods: {
    isNull(arg1) {
      return !arg1 && arg1 !== 0 && typeof arg1 !== "boolean" ? true : false;
    },
    // 全选
    changeAll() {
      // for (let i in this.formInline) {
      //   if (this.formInline[i].checked) {
      //     for (let j in this.formInline[i].checkedT) {
      //       this.formInline[i].checkedT[j] = true;
      //     }
      //   } else {
      //     for (let j in this.formInline[i].checkedT) {
      //       this.formInline[i].checkedT[j] = false;
      //     }
      //   }
      // }
    },
    // 选择数据
    selectFun(val) {
      this.selectTableData = val;
    },

    getData() {
      this.loading = true;
      let param = {};
      if (this.treeNode.deviceType === "tmnl") {
        param = {
          isAllTmnal: 0, //查集中器是1 查电表是0
          pageNum: this.query.page,
          pageSize: this.query.limit,
          terminalAddr: this.treeNode.deviceName,
          ...this.searchValue
          // commMode:'',
        };
      } else if (this.treeNode.deviceType === "meter") {
        param = {
          isAllTmnal: 0, //查集中器是1 查电表是0
          pageNum: this.query.page,
          pageSize: this.query.limit,
          meterAddr: this.treeNode.deviceName,
          ...this.searchValue
        };
      } else if (this.treeNode.deviceType === "group") {
        param = {
          isAllTmnal: 0,
          groupId: this.treeNode.id,
          pageNum: this.query.page,
          pageSize: this.query.limit,
          ...this.searchValue
        };
      } else {
        param = {
          isAllTmnal: 0, //查集中器是1 查电表是0
          pageNum: this.query.page,
          pageSize: this.query.limit,
          orgNo: this.treeNode.deviceNo,
          ...this.searchValue
          // commMode:'',
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

    // 读事件过滤
    read() {
      if (this.selectTableData.length != 0) {
        if (
          this.formInline.user1.checked ||
          this.formInline.user2.checked ||
          this.formInline.user3.checked ||
          this.formInline.user4.checked ||
          this.formInline.user5.checked ||
          this.formInline.user6.checked ||
          this.formInline.user7.checked
        ) {
        let taskItems = [];
        this.selectTableData.forEach(item => {
          this.loading = true;
          for (let i in this.formInline) {
            if (this.formInline[i].checked) {
              taskItems.push({
                attriFlag: 0,
                attriId: 2,
                classId: 1,
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
      } else {
          this.$message({
            title: this.$t("global.warn"),
            message: this.$t("global.itemread"),
            type: "warning"
          });
        }
      } else {
        this.$message({
          title: this.$t("global.warn"),
          message: this.$t("global.itemread"),
          type: "warning"
        });
      }
    },

    // 写事件过滤
    write() {
      if (this.selectTableData.length != 0) {
        if (
          this.formInline.user1.checked ||
          this.formInline.user2.checked ||
          this.formInline.user3.checked ||
          this.formInline.user4.checked ||
          this.formInline.user5.checked ||
          this.formInline.user6.checked ||
          this.formInline.user7.checked
        ) {
          this.loading = true;
          let taskItems = [];
          this.selectTableData.forEach(item => { 
            for (let i in this.formInline) {
              if (this.formInline[i].checked) {
                let data = "";
                for (let j = 7; j >= 0; j--) {
                  if (this.formInline[i].checkedT[j] == true) {
                    data += "1";
                  } else {
                    data += "0";
                  }
                }
                this.formInline[i].data = data;
                taskItems.push({
                  attriFlag: 0,
                  attriId: 2,
                  classId: 1,
                  meterAsset: item.commAddr1,
                  obis: this.formInline[i].obis,
                  optType: 2,
                  paramValue: this.formInline[i].data,
                  pointId: item.mpSn,
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
        this.$message({
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
              optType: item.optType
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
                    optType: itemT.optType
                  };
                  value.forEach(item => {
                    item.value=item.value.split(",");
                    item.value.forEach(itemT=>{
                      param.value +=itemT+',\n';
                    }) 
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
    changeOpt(val) {
      if (val.optType == 1) {
        return this.$t("global.read");
      } else {
        return this.$t("global.write");
      }
    },
    // 格式化时间
    timeFormat(val) {
      let date = new Date(val);
      return (
        date.getFullYear() +
        "-" +
        (date.getMonth() + 1 + "").padStart(2, "0") +
        "-" +
        (date.getDate() + "").padStart(2, "0")
      );
    }
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
  padding: 25px;
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
  .childbox {
    margin-bottom: 20px;
  }
}
</style>