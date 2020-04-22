<template>
  <basic-container>
    <div>
      <!-- <el-tabs v-model="active1" type="card">
        <el-tab-pane label="Uni-cast" name="Uni-cast" style="padding: 0 10px;"> -->
          <el-form :inline="true" :model="loadForm" label-width="60px" label-position="left" :rules="dcurules" ref="dcuform">
            <el-form-item prop="timeStart" :label="$t('auto.from')">
              <el-date-picker
                v-model="loadForm.timeStart"
                type="date"
                size="small"
                style="width:140px;"
                :clearable="false"
                :editable="false"
              ></el-date-picker>
            </el-form-item>
            <el-form-item prop="timeRange">
              <el-time-select
                size="small"
                style="width:100px"
                v-model="loadForm.timeRange"
                :picker-options="{
                  start: '00:00',
                  step: '00:15',
                  end: '23:45'
                }"
                :clearable="false"
                :editable="false"
              ></el-time-select>
            </el-form-item>
            <el-form-item prop="timeEnd" :label="$t('global.to')">
              <el-date-picker
                v-model="loadForm.timeEnd"
                type="date"
                size="small"
                style="width:140px;"
                :clearable="false"
                :editable="false"
              ></el-date-picker>
            </el-form-item>
            <el-form-item prop="timeRangeT">
              <el-time-select
              size="small"
              style="width:100px"
              v-model="loadForm.timeRangeT"
              :picker-options="{
                start: '00:00',
                step: '00:15',
                end: '23:45'
                
              }"
              :clearable="false"
              :editable="false"
            ></el-time-select>
            </el-form-item>
          </el-form>
          <el-tabs v-model="active2" type="card" @tab-click="meterClick">
            <!-- 4g/nbmetr读取 -->
            <el-tab-pane label="4G/NB Meter" name="4g" style="padding: 0 10px;">
              <div class="content">
                <div class="head">
                  Meter Information
                  <div class="operate">
                    <searchForm @searchFun="searchDevice" :isType="0"></searchForm>
                    <span @click="read(0)">
                      <img src="img/read.png" alt />
                      {{$t('global.readmeter')}}
                    </span>
                    <span @click="checkResult">
                      <img src="img/Checkresult.png" alt="">
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
                > 
                </pagination>
              </div>
            </el-tab-pane>
            <!-- meter读取 -->
            <el-tab-pane label="Hybrid  Meter" name="meter" style="padding: 0 10px;">
              <div class="content">
                <div class="head">
                  Meter Information
                  <div class="operate">
                    <searchForm @searchFun="searchDevice" :isType="0"></searchForm>
                    <span @click="read(1)">
                      <img src="img/read.png" alt />
                      {{$t('global.readdcu')}}
                    </span>
                    <span @click="read(2)">
                      <img src="img/read.png" alt />
                      {{$t('global.readmeter')}}
                    </span>
                    <span @click="checkResult">
                      <img src="img/Checkresult.png" alt="">
                      {{$t('global.checkResult')}}
                    </span>
                  </div>
                </div>
                <!-- 表格组件 -->
                <meterTable :basicdata="basicdataT" :loading="loading" @selectMeter="selectFun" :height="tableHeight" :pageNum='queryF'></meterTable>
                <!-- 分页组件 -->
                <pagination
                  :page.sync="queryF.page" 
                  :limit.sync="queryF.limit"
                  :total="totalF"
                  @pagination="getDataT"
                > 
                </pagination>
              </div>
            </el-tab-pane>
          </el-tabs> 
          <!-- <div class="content">
            <div class="head">
              Meter Information
              <div class="operate">
                <searchForm @search="searchDevice"></searchForm>
                <span @click="read">
                  <img src="img/read.png" alt />
                  {{$t('global.read')}}
                </span>
                <span @click="checkResult">
                  <img src="img/Checkresult.png" alt="">
                  {{$t('global.checkResult')}}
                </span>
              </div>
            </div>
            <meterTable :basicdata="basicdata" :loading="loading" @selectMeter="selectFun" :height="tableHeight"></meterTable>
            <pagination
              :page.sync="query.page" 
              :limit.sync="query.limit"
              :total="total"
              @pagination="getData"
            > 
            </pagination>
          </div> -->
        <!-- </el-tab-pane>
        <el-tab-pane :label="$t('remote.mutiCast')" name="Muti-cast" style="padding: 0 20px"></el-tab-pane>
      </el-tabs> -->
      <el-dialog :title="$t('global.checkResult')" :visible.sync="checkResultVisible" width="60%" :before-close="handleClose">

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
              <!-- <span @click="exportFun">
                <img src="img/export.png" alt />
                {{$t('avgVoltageCurrentQuery.export')}}
              </span> -->
            </div>
          </div>
        </div>
        <el-table
          :data="resultTableData"
          border
          height="600"
          :header-cell-style="{background:'#FFFCFCFC',color:'rgb(51,51,51)'}"
          v-loading="loadingT"
        >
          <el-table-column :label="$t('global.id')" width="80">
            <template slot-scope="scope">{{ queryT.limit * (queryT.page - 1)+scope.$index+1 }}</template>
          </el-table-column>
          <el-table-column prop="tmnlAssetNo" :label="$t('global.ownerterminal')" width="180"></el-table-column>
          <el-table-column prop="deviceName" :label="$t('meterevent.metername')" width="180"></el-table-column>
          <el-table-column prop="errorCode" :label="$t('clock.status')" width="180"></el-table-column>
          <el-table-column prop="recTime" :label="$t('global.dataresponse')" width="180"></el-table-column>
          <el-table-column
            :key="item.index"
            :prop="item.datavalue"
            :label="item.descript"
            width="200"
            v-for="(item,index) in columnList"
            :render-header="renderHeader"
          >
              <!-- <el-table-column :prop="'data' + index" :label="item.obis" > -->
                <template slot-scope="scope">
                  <div v-if="index === 1 || index === 4 || index === 6 || index === 9||index === 11|| index === 14">{{changeVal(scope.row['data'+index])}}</div>
                  <div v-else>{{changeValT(scope.row['data'+index])}}</div>
                </template>
              <!-- </el-table-column> -->
          </el-table-column>

          <!-- <el-table-column prop="data0" :label="$t('average.data0')" width="100">
            <el-table-column prop="data0" label="0-0:1.0.0.255" width="100"></el-table-column>
          </el-table-column>

          <el-table-column prop="data1" :label="$t('average.data1')" width="100">
            <el-table-column prop="data1" label=" 1-0:32.128.0.255" width="100">
              <template slot-scope="scope">{{ changeVal(scope.row.data1) }}</template>
            </el-table-column>
          </el-table-column>

          <el-table-column prop="data2" :label="$t('average.data2')" width="120">
            <el-table-column prop="data2" label="1-0:32.7.124.255" width="120"></el-table-column>
          </el-table-column>

          <el-table-column prop="data3" :label="$t('average.data3')" width="120">
            <el-table-column prop="data3" label="1-63:32.24.124.255" width="120"></el-table-column>
          </el-table-column>

          <el-table-column prop="data4" :label="$t('average.data4')" width="120">
            <el-table-column prop="data4" label="1-0:31.5.0.255" width="120">
              <template slot-scope="scope">{{ changeVal(scope.row.data4) }}</template>
            </el-table-column>
          </el-table-column>

          <el-table-column prop="data5" :label="$t('average.data5')" width="120">
            <el-table-column prop="data5" label="1-63:31.24.124.255" width="120">
            </el-table-column>
          </el-table-column>

          <el-table-column prop="data6" :label="$t('average.data6')" width="120">
            <el-table-column prop="data6" label="1-0:52.128.0.255" width="120">
              <template slot-scope="scope">{{ changeVal(scope.row.data6) }}</template>
            </el-table-column>
          </el-table-column>

          <el-table-column prop="data7" :label="$t('average.data7')" width="120">
            <el-table-column prop="data7" label="1-0:52.7.124.255" width="120"></el-table-column>
          </el-table-column>

          <el-table-column prop="data8" :label="$t('average.data8')" width="120">
            <el-table-column prop="data8" label="1-63:52.24.124.255" width="120"></el-table-column>
          </el-table-column>

          <el-table-column prop="data9" :label="$t('average.data9')" width="120">
            <el-table-column prop="data9" label="1-0:51.5.0.255" width="120">
              <template slot-scope="scope">{{ changeVal(scope.row.data9) }}</template>
            </el-table-column>
          </el-table-column>

          <el-table-column prop="data10" :label="$t('average.data10')" width="120">
            <el-table-column prop="data10" label="1-63:51.24.124.255" width="120"></el-table-column>
          </el-table-column>

          <el-table-column prop="data11" :label="$t('average.data11')" width="120">
            <el-table-column prop="data11" label="1-0:72.128.0.255" width="120">
              <template slot-scope="scope">{{ changeVal(scope.row.data11) }}</template>
            </el-table-column>
          </el-table-column>

          <el-table-column prop="data12" :label="$t('average.data12')" width="120">
            <el-table-column prop="data12" label="1-0:72.7.124.255" width="120"></el-table-column>
          </el-table-column>

          <el-table-column prop="data13" :label="$t('average.data13')" width="120">
            <el-table-column prop="data13" label="1-63:72.24.124.255" width="120"></el-table-column>
          </el-table-column>

          <el-table-column prop="data14" :label="$t('average.data14')" width="120">
            <el-table-column prop="data14" label="1-0:71.5.0.255" width="120">
              <template slot-scope="scope">{{ changeVal(scope.row.data14) }}</template>
            </el-table-column>
          </el-table-column>

          <el-table-column prop="data15" :label="$t('average.data15')" width="120">
            <el-table-column prop="data15" label="1-63:71.24.124.255" width="120"></el-table-column>
          </el-table-column> -->

        </el-table>
        <!-- <pagination
          :page.sync="queryT.page" 
          :limit.sync="queryT.limit"
          :total="totalT"
          @pagination="checkResult"
        > 
        </pagination> -->
      </el-dialog>
      <!-- 导出组件 -->
      <export-btn :dialogVisible="dialogVisible" @changeDialog="changeDialog" />
    </div>
  </basic-container>
</template>
<script>
import { mapGetters } from "vuex";
import { getDevice } from '@/api/autoRegister'
import { readHisTask, checkResult } from "@/api/clock";
import Pagination from "@/components/Pagination";
import meterTable from '@/components/meterTable'
import exportBtn from "@/components/exportjs";
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
  components:{Pagination,meterTable,exportBtn,searchForm,progressCom},
  data() {
    return {
      active1: "Uni-cast",
      active2:'4g',
      controlMode: "1",
      tableData:[],
      basicdata: [],
      basicdataT: [],
      selectTableData:[],
      resultTableData:[],
      taskItem:[],
      columnList:[],
      obisArr:[],
      total: 0,
      query: {
        page: 1,
        limit: 20
      },
      totalF: 0,
      queryF: {
        page: 1,
        limit: 20
      },
      searchValue:{
        factoryCode: -1,  //厂家类型
        type:-1, //电表类型或者集中器类型
        serachValue:"" //电表或者集中器逻辑设备名
      },
      searchValueT:{
        factoryCode: -1,  //厂家类型
        type:-1, //电表类型或者集中器类型
        serachValue:"" //电表或者集中器逻辑设备名
      },
      loadForm:{
        timeRange: '00:00',
        timeRangeT: '00:00',
        timeStart: new Date(),
        timeEnd: new Date(),
      },
      dcurules:{
        timeStart: [{ type: 'date',required: true, message: this.$t('global.selectdate'), trigger: 'change' }],
        timeEnd: [{ type: 'date',required: true, message: this.$t('global.selectdate'), trigger: 'change' }],
        timeRange: [{ required: true, message: this.$t('global.seltime'), trigger: 'change' }],
        timeRangeT: [{required: true, message: this.$t('global.seltime'), trigger: 'change' }]
      },
      checkResultVisible:false,
      searchForm:{
        name:[]
      },
      loading:false,
      loadingT:false,
      dialogVisible:false,
      totalT: 0,
      queryT: {
        page: 1,
        limit: 9999
      },
      tableHeight:window.innerHeight - 420,
      isDirect:0,  //0 4g从dcu读  1 meter从dcu读  1 meter从meter读
      successNum:0,  //查询结果返回状态的累计数量
      isTimer:'', //定时器名称
      proNum:0,  //进度
      paramValue:{},
      rate:{},
      options:[], //过滤参数
      avgDataA:[],
      avgDataB:[]
    };
  },
  watch: {
    treeNode: function() {
      this.searchValue={
        factoryCode: -1,  //厂家类型
        type:-1, //电表类型或者集中器类型
        serachValue:"" //电表或者集中器逻辑设备名
      }
      this.searchValueT={
        factoryCode: -1,  //厂家类型
        type:-1, //电表类型或者集中器类型
        serachValue:"" //电表或者集中器逻辑设备名
      }
      if(!this.isNull(this.treeNode)){
        this.getData();
        this.getDataT();
      } 
    }
  },
  mounted () {
    this.getcolumnList();
    window.onresize = ()=>{
      this.tableHeight=window.innerHeight - 420
    }
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
          isAllTmnal: 0, //1查集中器是 0查电表
          pageNum: this.query.page,
          pageSize: this.query.limit,
          deviceType:-1, //-1查4g/nb  0是载波表
          terminalAddr: this.treeNode.deviceName,
          ...this.searchValue
        };
      } else if(this.treeNode.deviceType==='meter'){
        param = {
          isAllTmnal: 0, //1查集中器是 0查电表
          pageNum: this.query.page,
          pageSize: this.query.limit,
          deviceType:-1, //-1查4g/nb  0是载波表
          meterAddr: this.treeNode.deviceName,
          ...this.searchValue
        };
      } else if(this.treeNode.deviceType === "group"){
        param={
          isAllTmnal: 0,
          groupId:this.treeNode.id,
          pageNum: this.query.page,
          pageSize: this.query.limit,
          deviceType:-1,   //-1查4g/nb  0是载波表
          ...this.searchValue
        }
      } else {
        param = {
          isAllTmnal: 0, //1查集中器是 0查电表
          pageNum: this.query.page,
          pageSize: this.query.limit,
          deviceType:-1, //-1查4g/nb  0是载波表
          orgNo: this.treeNode.deviceNo,
          factoryCode:this.searchValue.factoryCode,
          ...this.searchValue
        };
      }
      getDevice(param).then(res => {
        if(res.data.data.total!=0){
          this.basicdata = res.data.data.list;
          this.total=res.data.data.total;
        }else{
          this.basicdata=[]
        }
        this.loading = false;
      });
    },
    getDataT() {
      this.loading = true;
      let param = {};
      if (this.treeNode.deviceType==='tmnl') {
        param = {
          isAllTmnal: 0, //查集中器是1 查电表是0
          pageNum: this.query.page,
          pageSize: this.query.limit,
          deviceType:0, //-1查4g/nb  0是载波表
          terminalAddr: this.treeNode.deviceName,
          ...this.searchValueT
        };
      } else if(this.treeNode.deviceType==='meter'){
        param = {
          isAllTmnal: 0, //查集中器是1 查电表是0
          pageNum: this.query.page,
          pageSize: this.query.limit,
          deviceType:0, //-1查4g/nb  0是载波表
          meterAddr: this.treeNode.deviceName,
          ...this.searchValueT
        };
      } else if(this.treeNode.deviceType === "group"){
        param={
          isAllTmnal: 0,
          groupId:this.treeNode.id,
          pageNum: this.query.page,
          pageSize: this.query.limit,
          deviceType:0,   //-1查4g/nb  0是载波表
          ...this.searchValue
        }
      } else {
        param = {
          isAllTmnal: 0, //查集中器是1 查电表是0
          pageNum: this.queryF.page,
          pageSize: this.queryF.limit,
          deviceType:0, //-1查4g/nb  0是载波表
          orgNo: this.treeNode.deviceNo,
          ...this.searchValueT
        };
      }
      getDevice(param).then(res => {
        if(res.data.data.total!=0){
          this.basicdataT = res.data.data.list;
        }else{
          this.basicdataT=[]
        }
        this.totalF=res.data.data.total;
        this.loading = false;
      });
    },
    // 4g meter标签页切换
    meterClick(val){
      if(val.name=="4g"){
        this.isDirect=0;
      }else{
        this.isDirect=1;
      }
      // if(this.treeNode){
      //   val.name==='4g'?this.getData():this.getDataT()
      // }
    },
    formatTimeT(val) {
      let date = new Date(val)
      return date.getFullYear() + '-' + (date.getMonth() + 1 + '').padStart(2, '0') + '-' + (date.getDate() + '').padStart(2, '0')
    },
    selectFun(val) {
      this.selectTableData = val;
    },
    read (val) {
      if(this.selectTableData.length!=0){
        if(this.loadForm.timeStart.getTime()>this.loadForm.timeEnd.getTime()){
          this.$message({
            type: "error",
            message: this.$t('auto.timeBug')
          })
        }else{
          if(Math.abs(this.loadForm.timeStart.getTime()-this.loadForm.timeEnd.getTime()) > 3*24*3600*1000){
              this.$message({
              type: "error",
              message: this.$t('auto.twomonth')
            })
          }else{
            if(val===0){
              this.read4gFromMeter();
            }else if(val===1){
              this.readFromDCU();
            }else if(val===2){
              this.readFromMeter();
            }
          }
        }
      }else{
        this.$notify({
          title: this.$t("global.warn"),
          message: this.$t("global.warncont"),
          type: "warning"
        });
      }
    },
    // 4g直读
    read4gFromMeter(){
      this.loading=true;
      this.isDirect=0;
      let taskItems = [];
      this.selectTableData.forEach(item => {
        taskItems.push({
          attriId: 2,
          classId: 7,
          meterAsset: item.commAddr1,
          obis: "1.96.99.13.0.255",
          pointId: item.mpSn,
          terminalAddr: item.terminalAddr,
          tmnlAssetNo: item.etmnlassetNo,
          startTime:this.formatTimeT(this.loadForm.timeStart)+' '+this.loadForm.timeRange+':00',
          endTime:this.formatTimeT(this.loadForm.timeEnd)+' '+this.loadForm.timeRangeT+':00'
        });
      });
      this.send(taskItems);
    },
    // 电表从集中器读
    readFromDCU(){
      this.loading=true;
      let taskItems = [];
      this.isDirect=1;
      this.selectTableData.forEach(item => {
        taskItems.push({
          attriId: 2,
          classId: 7,
          meterAsset: item.commAddr1,
          obis: "0.0.99.1.14.255",
          pointId: item.mpSn,
          terminalAddr: item.terminalAddr,
          tmnlAssetNo: item.etmnlassetNo,
          startTime:this.formatTimeT(this.loadForm.timeStart)+' '+this.loadForm.timeRange+':00',
          endTime:this.formatTimeT(this.loadForm.timeEnd)+' '+this.loadForm.timeRangeT+':00'
        });
      });
      this.send(taskItems);
    },
    // 电表从电表读
    readFromMeter(){
      this.loading=true;
      let taskItems = [];
      this.isDirect=1;
      this.selectTableData.forEach(item => {
        taskItems.push({
          attriId: 2,
          classId: 7,
          meterAsset: item.commAddr1,
          obis: "1.96.99.13.0.255",
          pointId: item.mpSn,
          terminalAddr: item.terminalAddr,
          tmnlAssetNo: item.etmnlassetNo,
          startTime:this.formatTimeT(this.loadForm.timeStart)+' '+this.loadForm.timeRange+':00',
          endTime:this.formatTimeT(this.loadForm.timeEnd)+' '+this.loadForm.timeRangeT+':00'
        });
      });
      this.send(taskItems);
    },
    send(val) {
      this.searchForm.name=[];
      this.resultTableData=[];
      this.proNum=0;
      readHisTask(val).then(res => {
        this.taskItem=[]
        this.loading=false;
        if (res.data.success) {
          res.data.data.forEach((item,index) => {
            this.taskItem.push({
              tmnlAssetNo:item.tmnlAssetNo,
              name:item.meterAsset,
              taskId:item.taskId
            });
          });
          if(this.isDirect===0){
            // sessionStorage.setItem("avgDataA", JSON.stringify(this.taskItem));
            this.avgDataA=this.taskItem;
          }else if(this.isDirect===1){
            this.avgDataB=this.taskItem;
            // sessionStorage.setItem("avgDataB", JSON.stringify(this.taskItem));
          }
          this.$message({
            message: this.$t("global.operatorSuccess"),
            type: "success"
          });
          this.checkResult();
        }
      });
    },
    // 查询结果接口
    checkResult () {
      if(this.avgDataA.length!=0||this.avgDataB.length!=0){
        this.checkResultVisible = true;
        this.startTime();
        // this.loadingT=true;
        let arr = []
        let a=0;
        if(this.isDirect===0){
          this.avgDataA.forEach(item=>{
            arr.push(item.taskId)
          })
        }else if(this.isDirect===1){
          this.avgDataB.forEach(item=>{
            arr.push(item.taskId)
          })
        }
        this.paramValue={
          taskIds:arr,
          pageNum:this.queryT.page,
          pageSize:this.queryT.limit,
        }
        checkResult(this.paramValue).then(res => {
          this.tableData = [];
          this.totalT=res.data.data.count;
          res.data.data.items.forEach(item=> { 
            if(item.taskStauts!=-1){
              a++;
            }
            let param={}
            if(this.isDirect===0){
              this.avgDataA.forEach(itemT=>{
                if(itemT.taskId==item.taskId){
                  param.tmnlAssetNo=itemT.tmnlAssetNo;
                  param.deviceName=itemT.name;
                  param.errorCode=item.errorCode;
                  param.recTime=item.recTime;
                }
              })
            }else if(this.isDirect===1){
              this.avgDataB.forEach(itemT=>{
                if(itemT.taskId==item.taskId){
                  param.tmnlAssetNo=itemT.tmnlAssetNo;
                  param.deviceName=itemT.name;
                  param.errorCode=item.errorCode;
                  param.recTime=item.recTime;
                }
              })
            }
            if('responseCodeItems' in item.responseDbDataItem){
              item.responseDbDataItem.responseCodeItems.forEach((itemF,index)=>{
                param['data'+index]=itemF.value
              }) 
            }
            this.tableData.push(param);
          });
          if(a==this.tableData.length){
            clearInterval(this.isTimer);
          }
          this.successNum=a;
          this.proNum=Math.round((this.successNum/this.tableData.length).toFixed(2)*100);
          this.rate={
            success:this.successNum,
            total:this.totalT
          }
          this.filterBtn();
          this.allMeterName();
          // this.loadingT=false;
        });
        
      }else{
        this.$message({
          message: this.$t("global.readdata"),
          type: 'warning'
        });
      }
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
    // 具体查找操作
    searchDevice(val){
      if(this.active2==='4g'){
        this.searchValue=val;
        this.getData();
      }else{
        this.searchValueT=val;
        this.getDataT();
      }
    },
    // 导出监听事件
    changeDialog(val){
      this.dialogVisible = val;
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
    // 导出
    exportFun(){
      this.dialogVisible=true;
      let columns = {
        deviceName:this.$t('meterevent.metername'),
        errorCode:this.$t('clock.status')
      };
      for (let i = 0; i <= 15; i++) {
        columns['data' + i]=this.$t('average.data' + i)
      }
      this.exportData = {
        url: "/api/ami-communicate/taskCore/checkTaskResultList",
        params: this.paramValue,
        columns: columns,
        fileName: "avgvoltagequistion", // avgvolcur- + 对象类型- +对象名称命名
        sheetName: "avgvoltagequistion"
      };
    },
    changeVal(val){
      if (isNaN(val)) {
        return val;
      } else {
        return (val).toFixed(3);
      }
    },
    changeValT(val){
      if(JSON.stringify(val) == "{}"){
        return '-'
      }else{
        return val
      }
    },
    renderHeader(h, { column, $index }){
      let label = column.label;
      let ua = navigator.userAgent.toLocaleLowerCase();
      for(let i=0;i<this.obisArr.length;i++){
        if (label === this.$t('averageT.data'+i)){
          return h('p',{
            on: {
              mouseenter: (e) => {
                if (ua.match(/firefox/) != null) {
                  e.target.title=`${this.$t('average.data'+i)}\n${this.obisArr[i]}`;
                }else if (ua.match(/chrome/) != null){
                  e.path[0].title = `${this.$t('average.data'+i)}\n${this.obisArr[i]}`;
                }
              }
            }
          },label)
        }
      }
    },
    getcolumnList () {
      this.obisArr = [
        '0-0:1.0.0.255',
        '1-0:32.128.0.255',
        '1-0:32.7.124.255',
        '1-63:32.24.124.255',
        '1-0:31.5.0.255',
        '1-63:31.24.124.255',
        '1-0:52.128.0.255',
        '1-0:52.7.124.255',
        '1-63:52.24.124.255',
        '1-0:51.5.0.255',
        '1-63:51.24.124.255',
        '1-0:72.128.0.255',
        '1-0:72.7.124.255',
        '1-63:72.24.124.255',
        '1-0:71.5.0.255',
        '1-63:71.24.124.255',
      ];
      for (let i = 0; i <= 15; i++) {
        this.columnList.push({
          datavalue: 'data' + i,
          descript: this.$t('averageT.data' + i),
          obis: this.obisArr[i]
        });
      }
    },
  },
  computed: {
    ...mapGetters(["colorName", "themeName","treeNode",'level'])
  }
};
</script>
<style lang='scss' scoped>
@import  '@/styles/common.scss';
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