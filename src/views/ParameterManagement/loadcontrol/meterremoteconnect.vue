<template>
  <basic-container>
    <div class="first-tab">
      <el-tabs v-model="active1" type="card" @tab-click="handleClick">
        <el-tab-pane :label="$t('route.meterRemoteConnect')" name="Load Control" style="padding:0 10px;">
          <!-- <div style="margin-bottom:10px">
            <el-checkbox v-model="checked" style="width:120px;">{{$t('equit.outputstatus')}}</el-checkbox>
          </div>
          <div style="margin-bottom:10px">
            <el-checkbox v-model="checkedT" style="width:120px;">{{$t('equit.controlstatus')}}</el-checkbox>
          </div> -->
          <!-- <div style="margin-bottom:10px">
            <el-checkbox v-model="checkedF" style="width:120px;">{{$t('remote.controlMode')}}</el-checkbox>
            <el-select v-model="controlMode" style="width: 550px;margin-left:15px;">
              <el-option
                v-for="item in powerList"
                :key="item.code"
                :label="item.disc"
                :value="item.code"
              ></el-option>
            </el-select>
          </div> -->
          <div>
            <!-- <el-tabs v-model="active2" type="card">
              <el-tab-pane label="Uni-cast" name="Uni-cast" > -->
                <div class="content">
                  <div class="head">
                    {{$t('loadcurve.meterlist')}}
                    <div class="operate">
                      <searchForm @searchFun="searchDevice" :isType="0"></searchForm>
                      <span @click="openFun">
                        <img src="img/connect.png" alt />
                        {{$t('remote.connect')}}
                      </span>
                      <span @click="closeFun">
                        <img src="img/Disconnect.png" alt />
                        {{$t('remote.disconnect')}}
                      </span>
                      <!-- <span @click="write">
                        <img src="img/Issuewhitelist.png" alt />
                        {{$t('remote.whiteMode')}}
                      </span> -->
                      <span @click="read(1)">
                        <img src="img/read.png" alt />
                        {{$t('global.readoutstatus')}}
                      </span>
                      <span @click="read(2)">
                        <img src="img/read.png" alt />
                        {{$t('global.readcontrolstatus')}}
                      </span>
                      <span @click="checkResult">
                        <img src="img/Checkresult.png" alt />
                        {{$t('global.checkResult')}}
                      </span>
                    </div>
                  </div>
                  <!-- 表格组件 -->
                  <meterTable :basicdata="basicdata" :loading="loading" @selectMeter="selectFun" :height="tableHeight" :pageNum='query'></meterTable>

                  <!-- 分页组件 -->
                  <pagination
                    :page.sync="query.page"
                    :limit.sync="query.limit"
                    :total="total"
                    @pagination="getData"
                  ></pagination>
                </div>
              <!-- </el-tab-pane>
              <el-tab-pane :label="$t('remote.mutiCast')" name="Muti-cast" style="padding: 0 20px"></el-tab-pane>
            </el-tabs> -->

            <!-- 查询结果 -->
            <el-dialog
              :title="$t('global.checkResult')"
              :visible.sync="checkResultVisible"
              width="60%"
              :before-close="handleClose"
              height="600"
            >
              <!--  查询结果表格 -->
              <div class="content">
                <div class="head">
                  Read result
                  <div class="operate">
                    <!-- 进度条组件 -->
                    <progressCom :num='proNum' :rate='rate'></progressCom>
                    <div class="formname">
                      <span>Logic Device Name</span>
                      <el-select
                        v-model="searchForm.name"
                        filterable
                        multiple
                        collapse-tags
                        style="margin:0 20px 0 20px;width: 230px;line-height:28px;"
                        >
                        <el-option
                          v-for="item in options"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                      <el-button type="primary" icon="el-icon-search" @click="filterBtn"></el-button>
                    </div>
                  </div>
                </div>
              </div>

              <el-table :data="resultTableData" v-loading="loadingT" border>
                <el-table-column :label="$t('global.id')" width="80">
                  <template slot-scope="scope">{{ scope.$index+1 }}</template>
                </el-table-column>
                <el-table-column prop="tmnlAssetNo" :label="$t('global.ownerterminal')" width="180"></el-table-column>
                <el-table-column prop="deviceName" :label="$t('clock.deviceName')"></el-table-column>
                <el-table-column prop="optype" :label="$t('upgrade.operType')">
                  <template slot-scope="scope">{{ changeOpt(scope.row.optype) }}</template>
                </el-table-column>
                <el-table-column prop="errorCode" :label="$t('clock.status')"></el-table-column>
                <el-table-column prop="recTime" :label="$t('global.dataresponse')" width="180"></el-table-column>
                <el-table-column prop="value" :label="$t('systemparam.val')">
                  <template slot-scope="scope">{{ changeMode(scope.row) }}</template>
                </el-table-column>
              </el-table>
            </el-dialog>
          </div>
        </el-tab-pane>
        <!-- 事件查询 -->
        <el-tab-pane :label="$t('remote.eventQuery')" name="Event Query" style="padding: 0 20px">
          <div class="filter-box">
            <el-form :model="searchEvent" ref="form"  :inline="true" label-position="left" :rules="eventRule">
              <el-form-item :label="$t('clock.deviceName')">
                <el-input :maxlength="30" v-model="searchEvent.deviceName" size="small"></el-input>
              </el-form-item>
              <el-form-item :label="$t('systemparam.factory')">
                <el-select v-model="searchEvent.factory" size="small">
                  <el-option :label="$t('global.all')" :value="-1"></el-option>
                  <el-option
                    v-for="item in factoryList"
                    :key="item.typeCode"
                    :label="item.typeName"
                    :value="item.typeCode"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('auto.from')" prop="startDate">
                <el-date-picker v-model="searchEvent.startDate" type="date" size="small" style="width:160px;"></el-date-picker>
              </el-form-item>
              <el-form-item :label="$t('auto.to')" prop="endDate">
                <el-date-picker v-model="searchEvent.endDate" type="date" size="small" style="width:160px;"></el-date-picker>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="searchEventRecord">{{$t('global.search')}}</el-button>
              </el-form-item>
            </el-form>
          </div>

          <div class="history-content">
            <div class="head">{{$t('remote.eventinfo')}}</div>
            <el-table 
              :data="eventData" 
              border 
              style="width: 100%" 
              :height="tableHeightT"
              :header-cell-style="{background:'#F2F2F2',color:'rgb(51,51,51)'}"
              v-loading="loading"
            >
              <el-table-column :label="$t('change.no')" width="100">
                <template slot-scope="scope">
                  {{ eventQuery.limit * (eventQuery.page - 1) + scope.$index + 1 }}
                </template>
              </el-table-column>
              <el-table-column :label="$t('sitemanage.dcuaddress')" prop="terminalAddr"></el-table-column>
              <el-table-column :label="$t('auto.meteraddress')" prop="commAddr"></el-table-column>
              <el-table-column :label="$t('meterevent.eventtime')" prop="dataTime"></el-table-column>
              <el-table-column :label="$t('systemparam.collecttime')" prop="colTime"></el-table-column>
              <el-table-column :label="$t('remote.strTime')" prop="recTime"></el-table-column>
              <el-table-column :label="$t('meterevent.eventdisc')" prop="eventName"></el-table-column>
            </el-table>
            <pagination
              :page.sync="eventQuery.page"
              :limit.sync="eventQuery.limit"
              :total="totalT"
              @pagination="searchEventRecord"
            ></pagination>
          </div>
        </el-tab-pane>

        <!-- 操作记录查询 -->
        <el-tab-pane
          :label="$t('remote.operationLogQuery')"
          name="Operation Log Query"
          style="padding: 0 20px"
          >
          <div class="filter-box">
            <el-form :model="searchOpt" ref="form"  :inline="true" label-position="left" :rules="eventRule">
              <el-form-item :label="$t('clock.deviceName')">
                <el-input v-model="searchOpt.deviceName" size="small"></el-input>
              </el-form-item>
              <el-form-item :label="$t('systemparam.factory')">
                <el-select v-model="searchOpt.factory" size="small">
                  <el-option :label="$t('global.all')" :value="-1"></el-option>
                  <el-option
                    v-for="item in factoryList"
                    :key="item.typeCode"
                    :label="item.typeName"
                    :value="item.typeCode"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('auto.from')" prop="startDate">
                <el-date-picker v-model="searchOpt.startDate" type="date" size="small" style="width:160px;"></el-date-picker>
              </el-form-item>
              <el-form-item :label="$t('auto.to')" prop="endDate">
                <el-date-picker v-model="searchOpt.endDate" type="date" size="small" style="width:160px;"></el-date-picker>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="searchOptRecord">{{$t('global.search')}}</el-button>
              </el-form-item>
            </el-form>
          </div>

          <div class="history-content">
            <div class="head">{{$t('remote.eventinfo')}}</div>
            <el-table 
              :data="optData" 
              border 
              style="width: 100%" 
              :height="tableHeightF"
              :header-cell-style="{background:'#F2F2F2',color:'rgb(51,51,51)'}"
              v-loading='loading'
            >
              <el-table-column :label="$t('change.no')" width="100">
                <template slot-scope="scope">
                  {{ optQuery.limit * (optQuery.page - 1) + scope.$index + 1 }}
                </template>
              </el-table-column>
              <el-table-column :label="$t('sitemanage.dcuaddress')" prop="tmnlAssetNo"></el-table-column>
              <el-table-column :label="$t('auto.meteraddress')" prop="meterAssetNo"></el-table-column>
              <el-table-column :label="$t('clock.controlTime')" prop="ctrlTime"></el-table-column>
              <el-table-column :label="$t('clock.controlType')" prop="ctrlType">
                <template slot-scope="scope">{{ changeType(scope.row) }}</template>
              </el-table-column>
              <!-- <el-table-column :label="$t('remote.strTime')" prop="recTime"></el-table-column> -->
              <el-table-column :label="$t('upgrade.codeinfo')" prop="errorCode"></el-table-column>
              <el-table-column :label="$t('upgrade.operator')" prop="operationName"></el-table-column>
            </el-table>
            <pagination
              :page.sync="optQuery.page"
              :limit.sync="optQuery.limit"
              :total="totalF"
              @pagination="searchOptRecord"
            ></pagination>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </basic-container>
</template>
<script>
import { mapGetters } from "vuex";
import { getDevice,getViewList } from "@/api/autoRegister";
import { readTask, checkResult,getDeviceAlarm,getOperationInfo } from "@/api/clock";
import Pagination from "@/components/Pagination";
import meterTable from "@/components/meterTable";
import searchForm from "@/components/searchForm";
import progressCom from "@/components/progress";
Array.prototype.push_unique = function() {
  for(let i = 0; i < arguments.length; i++) {
    let ele = arguments[i];
    if (this.indexOf(ele) === -1) {
      this.push(ele);
    }
  }
};
export default {
  components: { meterTable, Pagination,searchForm,progressCom},
  name:'a',
  data() {
    return {
      active1: "Load Control",
      active2: "Uni-cast",
      controlMode: 0,
      tableData: [],
      basicdata: [],
      resultTableData: [],
      eventData:[],
      optData:[],
      taskItem: [],
      selectTableData: [],
      factoryList:[],
      powerList: [
        {
          disc:
            "Mode 0 None The disconnect control object is always in 'connected' state",
          code: 0
        },
        {
          disc: "Mode 1 manual(f),local(g)Reconnection;Remote(d),manual(e)",
          code: 1
        },
        {
          disc: "Mode 2 manual(f),local(g)Reconnection;Remote(a),manual(e)",
          code: 2
        },
        {
          disc: "Mode 3 manual(-),local(g)Reconnection;Remote(d),manual(e)",
          code: 3
        },
        {
          disc: "Mode 4 manual(-),local(g)Reconnection;Remote(a),manual(e)",
          code: 4
        },
        {
          disc:
            "Mode 5 manual(f),local(g)Reconnection;Remote(d),manual(e),local(h)",
          code: 5
        },
        {
          disc:
            "Mode 6 manual(-),local(g)Reconnection;Remote(d),manual(e),local(h)",
          code: 6
        }
      ],
      checkResultVisible: false,
      loading: false,
      loadingT: false,
      checked: false,
      checkedT: false,
      checkedF: false,
      radio: "1",
      threeMode: 0,
      total: 0,
      totalT: 0,
      totalF:0,
      eventToal:0,
      query: {
        page: 1,
        limit: 20
      },
      eventQuery:{
        page: 1,
        limit: 20
      },
      queryT: {
        page: 1,
        limit: 9999
      },
      optQuery:{
        page: 1,
        limit: 20
      },
      tableHeight: window.innerHeight - 370,
      tableHeightT: window.innerHeight - 420,
      tableHeightF: window.innerHeight - 420,
      searchEvent:{
        startDate:new Date(),
        endDate:new Date(),
        factory:-1,
      },
      searchOpt:{
        startDate:new Date(),
        endDate:new Date(),
        factory:-1,
      },
      searchValue:{
        factoryCode: -1,  //厂家类型
        type:-1, //电表类型或者集中器类型
        serachValue:"" //电表或者集中器逻辑设备名
      },
      eventRule:{
        startDate: [{ type: 'date',required: true, message: this.$t('global.selectdate'), trigger: 'change' }],
        endDate: [{ type: 'date',required: true, message: this.$t('global.selectdate'), trigger: 'change' }],
      },
      successNum:0,  //查询结果返回状态的累计数量
      isTimer:'', //定时器名称
      isDirect:0,  //0 4g从dcu读  1 meter从dcu读  2meter从meter读
      proNum:0,
      searchForm:{
        name:[]
      },
      paramValue:{},
      rate:{},
      options:[], //过滤参数
    };
  },
  watch: {
    treeNode: function() {
      this.searchValue={
        factoryCode: -1,  //厂家类型
        type:-1, //电表类型或者集中器类型
        serachValue:"" //电表或者集中器逻辑设备名
      }
      if(!this.isNull(this.treeNode)){
        this.getData();
      }
    }
  },
  mounted () {
    window.onresize = ()=>{
      this.tableHeight=window.innerHeight -  370;
      this.tableHeightT=window.innerHeight - 420;
      this.tableHeightF=window.innerHeight - 420;
    }
    this.getView()
  },
  methods: {
    isNull(arg1){
      return !arg1 && arg1!==0 && typeof arg1!=="boolean"?true:false;
    },
    getData() {
      this.loading = true;
      let param = {};
      if (this.treeNode.deviceType==='tmnl') {
        param = {
          isAllTmnal: 0, //查集中器是1 查电表是0
          pageNum: this.query.page,
          pageSize: this.query.limit,
          terminalAddr: this.treeNode.deviceName,
          ...this.searchValue
        };
      } else if(this.treeNode.deviceType==='meter'){
        param = {
          isAllTmnal: 0, //查集中器是1 查电表是0
          pageNum: this.query.page,
          pageSize: this.query.limit,
          meterAddr: this.treeNode.deviceName,
          ...this.searchValue
        };
      } else if(this.treeNode.deviceType === "group"){
        param={
          isAllTmnal: 0,
          groupId:this.treeNode.id,
          pageNum: this.query.page,
          pageSize: this.query.limit,
          ...this.searchValue
        }
      } else {
        param = {
          isAllTmnal: 0, //查集中器是1 查电表是0
          pageNum: this.query.page,
          pageSize: this.query.limit,
          orgNo: this.treeNode.deviceNo,
          ...this.searchValue
        };
      }
      getDevice(param).then(res => {
        if (res.data.data.total != 0) {
          this.basicdata = res.data.data.list;
          this.total = res.data.data.total;
        } else {
          this.basicdata = [];
        }
        this.loading = false;
      });
    },
    getView() {
      getViewList({
        viewType: "meterFactoryType"
      }).then(res => {
        this.factoryList = res.data.data.list;
      });
    },
    selectFun(val) {
      this.selectTableData = val;
    },
    // 合闸
    openFun() {
      this.$confirm(
          this.$t("areaManage.confirmTip"),
          this.$t("areaManage.reminder"),
          {
            confirmButtonText: this.$t("global.yes"),
            cancelButtonText: this.$t("global.cancel"),
            type: "warning"
          }
      ).then(() => {
        if (this.selectTableData.length != 0) {
          this.loading = true;
          let taskItems = [];
          this.selectTableData.forEach(item => {
            taskItems.push({
              attriFlag: 1, //0 读写  1 action
              attriId: 2,
              classId: 70,
              meterAsset: item.commAddr1,
              obis: "0.0.96.3.10.255",
              optType: 2,
              pointId: item.mpSn,
              terminalAddr: item.terminalAddr,
              tmnlAssetNo: item.etmnlassetNo
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
      }).catch(() => {});
    },
    // 拉闸
    closeFun() {
      this.$confirm(
          this.$t("areaManage.confirmTip"),
          this.$t("areaManage.reminder"),
          {
            confirmButtonText: this.$t("global.yes"),
            cancelButtonText: this.$t("global.cancel"),
            type: "warning"
          }
      ).then(() => {
        if (this.selectTableData.length != 0) {
          this.loading = true;
          let taskItems = [];
          this.selectTableData.forEach(item => {
            taskItems.push({
              attriFlag: 1, //0 读写  1 action
              attriId: 1,
              classId: 70,
              meterAsset: item.commAddr1,
              obis: "0.0.96.3.10.255",
              optType: 2,
              pointId: item.mpSn,
              terminalAddr: item.terminalAddr,
              tmnlAssetNo: item.etmnlassetNo
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
      }).catch(() => {});
    },
    // 读控制状态
    read(val) {
      if (this.selectTableData.length != 0) {
          this.loading = true;
          this.threeMode = 1;
          let taskItems = [];
          this.selectTableData.forEach(item => {
            if (val===1) {
              taskItems.push({
                attriFlag: 0, //0 读写  1 action
                attriId: 2,
                classId: 70,
                meterAsset: item.commAddr1,
                obis: "0.0.96.3.10.255",
                optType: 1,
                pointId: item.mpSn,
                terminalAddr: item.terminalAddr,
                tmnlAssetNo: item.etmnlassetNo
              });
            }
            if (val===2) {
              taskItems.push({
                attriFlag: 0, //0 读写  1 action
                attriId: 3,
                classId: 70,
                meterAsset: item.commAddr1,
                obis: "0.0.96.3.10.255",
                optType: 1,
                pointId: item.mpSn,
                terminalAddr: item.terminalAddr,
                tmnlAssetNo: item.etmnlassetNo
              });
            }
            if (this.checkedF) {
              taskItems.push({
                attriFlag: 0, //0 读写  1 action
                attriId: 4,
                classId: 70,
                meterAsset: item.commAddr1,
                obis: "0.0.96.3.10.255",
                optType: 1,
                pointId: item.mpSn,
                terminalAddr: item.terminalAddr,
                tmnlAssetNo: item.etmnlassetNo
              });
            }
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
    // 写入模式
    write() {
      if (this.selectTableData.length != 0) {
        if ((this, checkedF)) {
          this.loading = true;
          let taskItems = [];
          this.selectTableData.forEach(item => {
            taskItems.push({
              attriFlag: 0, //0 读写  1 action
              attriId: 4,
              classId: 70,
              meterAsset: item.commAddr1,
              obis: "0.0.96.3.10.255",
              optType: 2,
              pointId: item.mpSn,
              paramValue: this.controlMode,
              terminalAddr: item.terminalAddr,
              tmnlAssetNo: item.etmnlassetNo
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
      } else {
        this.$notify({
          title: this.$t("global.warn"),
          message: this.$t("global.warncont"),
          type: "warning"
        });
      }
    },
    send(val) {
      this.searchForm.name=[];
      this.resultTableData=[];
      this.proNum=0;
      readTask(val).then(res => {
        this.loading = false;
        this.taskItem = [];
        if (res.data.success) {
          res.data.data.forEach((item, index) => {
            this.taskItem.push({
              tmnlAssetNo:item.tmnlAssetNo,
              name: item.meterAsset,
              taskId: item.taskId,
              attriId: item.attriId,
              attriFlag: item.attriFlag
            });
          });
          // sessionStorage.setItem("connectData", JSON.stringify(this.taskItem));
          this.$message({
            message: this.$t("global.operatorSuccess"),
            type: "success"
          });
          this.checkResult();
        }
      });
    },
    checkResult() {
      if(this.taskItem.length===0){
        this.$message({
          message: this.$t("global.readdata"),
          type: 'warning'
        });
      }else{
        this.checkResultVisible = true;
        // this.loadingT = true;
        this.startTime();
        let a=0;
        let arr = [];
        this.taskItem.forEach(item => {
          arr.push(item.taskId);
        });
        this.paramValue={
          taskIds: arr,
          pageNum: this.queryT.page,
          pageSize: this.queryT.limit,
          // tmnlAddress:this.searchForm.name
        }
        checkResult(this.paramValue).then(res => {
          this.tableData = [];
          this.total = res.data.data.count;
          res.data.data.items.forEach(item => {
            if(item.taskStauts!=-1){
              a++;
            }
            let param={}
            this.taskItem.forEach(itemT=>{
              if(itemT.taskId==item.taskId){
                param.tmnlAssetNo=itemT.tmnlAssetNo;
                param.deviceName=itemT.name;
                param.errorCode=item.errorCode;
                param.recTime=item.recTime;
                param.optype={
                  attriId :itemT.attriId,
                  attriFlag: itemT.attriFlag
                }
              }
            })
            if('responseCodeItems' in item.responseDbDataItem){
              item.responseDbDataItem.responseCodeItems.forEach((itemF,index)=>{
                param.value=itemF.value
              }) 
            }
            this.tableData.push(param);
          });
          if(a==this.tableData.length){
            clearInterval(this.isTimer);
          }
          this.successNum=a;
          this.proNum=Math.round((this.successNum/this.tableData.length).toFixed(2)*100);
          this.filterBtn();
          this.allMeterName();
          // this.loadingT = false;
        });
      }
    },
    // 查询结果查找设备
    search(){
      this.checkResult();
    },
    // 定时器
    startTime(){
      this.isTimer=setTimeout(this.checkResult, 1000);
    },
    // 关闭弹框和定时器
    handleClose() {
      this.checkResultVisible=false;
      clearInterval(this.isTimer);
    },
    // 过滤按钮
    filterBtn() {
      let newList = [];
      if (this.searchForm.name.length === 0) {
        this.resultTableData = this.tableData;
      }else {
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
       this.options=[];
      for (let i = 0; i < this.tableData.length; i++) {
        meterIdArr.push_unique(this.tableData[i].deviceName)
      }
      for (let i = 0; i < meterIdArr.length; i++) {
        this.options.push({
          value: meterIdArr[i],
          label: meterIdArr[i]
        })
      }
    },
    searchEventRecord(){
      this.loading=true;
      let param = {};
      if (this.treeNode.deviceType==='meter'||this.treeNode.deviceType==='tmnl') {
        param = {
          isAllTmnal: 0, //查集中器是1 查电表是0
          pageNum: this.eventQuery.page,
          pageSize: this.eventQuery.limit,
          serachValue:this.searchEvent.deviceName,
          terminalAddr: this.treeNode.deviceName,
          beginAt:this.formatTimeT(this.searchEvent.startDate)+' 00:00:00',
          endAt:this.formatTimeT(this.searchEvent.endDate)+ '23:59:59',
          factoryCode:this.searchEvent.factory
        };
      } else {
        param = {
          isAllTmnal: 0, //查集中器是1 查电表是0
          pageNum: this.eventQuery.page,
          pageSize: this.eventQuery.limit,
          serachValue:this.searchEvent.deviceName,
          orgNo: this.treeNode.deviceNo,
          beginAt:this.formatTimeT(this.searchEvent.startDate)+' 00:00:00',
          endAt:this.formatTimeT(this.searchEvent.endDate)+' 23:59:59',
          factoryCode:this.searchEvent.factory
        };
      }
      getDeviceAlarm(param).then(res => {
        if(res.data.data.total!=0){
          this.eventData = res.data.data.list;
        }else{
          this.eventData=[];
        }
        this.totalT = res.data.data.total;
        this.loading = false;
      });
    },
    searchOptRecord(){
      let param = {};
      if (this.treeNode.deviceType==='meter'||this.treeNode.deviceType==='tmnl') {
        param = {
          isAllTmnal: 0, //查集中器是1 查电表是0
          pageNum: this.eventQuery.page,
          pageSize: this.eventQuery.limit,
          serachValue:this.searchOpt.deviceName,
          terminalAddr: this.treeNode.deviceName,
          beginAt:this.formatTimeT(this.searchOpt.startDate)+' 00:00:00',
          endAt:this.formatTimeT(this.searchOpt.endDate)+ '23:59:59',
          factoryCode:this.searchOpt.factory
        };
      } else {
        param = {
          isAllTmnal: 0, //查集中器是1 查电表是0
          pageNum: this.eventQuery.page,
          pageSize: this.eventQuery.limit,
          serachValue:this.searchOpt.deviceName,
          orgNo: this.treeNode.deviceNo,
          beginAt:this.formatTimeT(this.searchOpt.startDate)+' 00:00:00',
          endAt:this.formatTimeT(this.searchOpt.endDate)+' 23:59:59',
          factoryCode:this.searchOpt.factory
        };
      }
      this.loading = false;
      getOperationInfo(param).then(res => {
        if(res.data.data.total!=0){
          this.optData = res.data.data.list;
        }else{
          this.optData=[];
        }
        this.totalF = res.data.data.total;
      });
    },
    formatTimeT(val) {
      let date = new Date(val)
      return date.getFullYear() + '-' + (date.getMonth() + 1 + '').padStart(2, '0') + '-' + (date.getDate() + '').padStart(2, '0')
    },
    handleClick(val){
      // console.log(val.name)
      // if(name=='Event Query'){
      //   this.getView()
      // }
    },
    // 精准查找操作
    searchDevice(val){
      this.searchValue=val;
      this.getData();
    },
    changeStatus(val) {
      if (val == 0) {
        return this.$t("item.discon");
      } else if (val == 1) {
        return this.$t("item.connectd");
      } else if (val == 2) {
        return this.$t("item.Reconnectd");
      }
    },
    changeMode(val) {
      if (val.optype.attriId == 2) {
        if (val.value == 0) {
          return "Open";
        } else if (val.value == 1) {
          return "Closed";
        }
      }
      if (val.optype.attriId == 3) {
        return this.changeStatus(val.value);
      }
      if (val.optype.attriId == 4) {
        for (let i in this.powerList) {
          if (this.powerList[i].code == val.value) {
            return this.powerList[i].disc;
          }
        }
      }
    },
    changeOpt(val) {
      if (val.attriFlag == 0) {
        if (val.attriId == 2) {
          return this.$t("equit.outputstatus");
        } else if (val.attriId == 3) {
          return this.$t("equit.controlstatus");
        } else if (val.attriId == 4) {
          return this.$t("remote.controlMode");
        }
      } else if (val.attriFlag == 1) {
        if (val.attriId == 1) {
          return this.$t("remote.disconnect");
        } else if (val.attriId == 2) {
          return this.$t("remote.connect");
        }
      }
    },
    changeType(val){
      return val.ctrlType==0?this.$t('remote.connect'):this.$t('remote.disconnect')
    }
  },
  computed: {
    ...mapGetters(["colorName", "themeName", "treeNode", "level"])
  }
};
</script>
<style lang='scss' scoped>
@import '@/styles/common.scss';
.filter-box {
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
}
</style>