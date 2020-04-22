<template>
  <basic-container>
    <el-tabs v-model="active" type="card" @tab-click="paramClick">
      <el-tab-pane :label="$t('current.parameter')" name="0">
        <div class="content">
          <div class="terminal">
            <div class="head">
              {{$t('global.datainfo')}}
            </div>
            <el-table
              :data="paramData1"
              border
              :height="tableHeight1"
              v-loading="loading"
              :header-cell-style="{background:'#F2F2F2',color:'rgb(51,51,51)'}"
              highlight-current-row
              @selection-change="selectParam"
              >
              <el-table-column type="selection" width="50"></el-table-column>
              <el-table-column :label="$t('key.no')" width="50">
                <template slot-scope="scope">{{scope.$index + 1 }}</template>
              </el-table-column>
              <el-table-column prop="classId" label="CLASSID" width="100"></el-table-column>
              <el-table-column prop="obis" label="OBIS" width="160"></el-table-column>
              <el-table-column prop="profile" :label="$t('current.profile')" width="100"></el-table-column>
              <el-table-column prop="descript" :label="$t('systemparam.description')" ></el-table-column>
            </el-table>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane :label="$t('current.instantaneous')" name="1">
        <div class="content">
          <div class="terminal">
            <div class="head">
              {{$t('global.datainfo')}}
            </div>
            <el-table
              :data="paramData2"
              border
              :height="tableHeight1"
              v-loading="loading"
              :header-cell-style="{background:'#F2F2F2',color:'rgb(51,51,51)'}"
              highlight-current-row
              @selection-change="selectParam"
              >
              <el-table-column type="selection" width="50"></el-table-column>
              <el-table-column :label="$t('key.no')" width="50">
                <template slot-scope="scope">{{scope.$index + 1 }}</template>
              </el-table-column>
              <el-table-column prop="classId" label="CLASSID" width="100"></el-table-column>
              <el-table-column prop="obis" label="OBIS" width="160"></el-table-column>
              <el-table-column prop="profile" :label="$t('current.profile')" width="100"></el-table-column>
              <el-table-column prop="descript" :label="$t('systemparam.description')" ></el-table-column>
            </el-table>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane :label="$t('current.energy')" name="3">
        <div class="content">
          <div class="terminal">
            <div class="head">
              {{$t('global.datainfo')}}
            </div>
            <el-table
              :data="paramData3"
              border
              :height="tableHeight1"
              v-loading="loading"
              :header-cell-style="{background:'#F2F2F2',color:'rgb(51,51,51)'}"
              highlight-current-row
              @selection-change="selectParam"
              >
              <el-table-column type="selection" width="50"></el-table-column>
              <el-table-column :label="$t('key.no')" width="50">
                <template slot-scope="scope">{{ scope.$index + 1 }}</template>
              </el-table-column>
              <el-table-column prop="classId" label="CLASSID" width="100"></el-table-column>
              <el-table-column prop="obis" label="OBIS" width="160"></el-table-column>
              <el-table-column prop="profile" :label="$t('current.profile')" width="100"></el-table-column>
              <el-table-column prop="descript" :label="$t('systemparam.description')" ></el-table-column>
            </el-table>
           
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane :label="$t('current.demand')" name="6">
        <div class="content">
          <div class="terminal">
            <div class="head">
              {{$t('global.datainfo')}}
            </div>
            <el-table
              :data="paramData4"
              border
              :height="tableHeight1"
              v-loading="loading"
              :header-cell-style="{background:'#F2F2F2',color:'rgb(51,51,51)'}"
              highlight-current-row
              @selection-change="selectParam"
              >
              <el-table-column type="selection" width="50"></el-table-column>
              <el-table-column :label="$t('key.no')" width="50">
                <template slot-scope="scope">{{ scope.$index + 1 }}</template>
              </el-table-column>
              <el-table-column prop="classId" label="CLASSID" width="100"></el-table-column>
              <el-table-column prop="obis" label="OBIS" width="160"></el-table-column>
              <el-table-column prop="profile" :label="$t('current.profile')" width="100"></el-table-column>
              <el-table-column prop="descript" :label="$t('systemparam.description')" ></el-table-column>
            </el-table>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
    <div class="content">
      <div class="head">
        {{$t('loadcurve.meterlist')}}
        <div class="operate">
          <!-- 搜索组件 -->
          <searchForm @searchFun="searchDevice" :isType="0"></searchForm>
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
      <!-- 表格组件 -->
      <meterTable :basicdata="meterlistData" :loading="loadingT" @selectMeter="selectFun" :height='tableHeight2' :pageNum='query'></meterTable>
      <!-- 分页组件 -->
      <pagination
        :page.sync="query.page" 
        :limit.sync="query.limit"
        :total="total"
        @pagination="getData"
      > 
      </pagination>
    </div>

    <el-dialog
        :title="$t('global.checkResult')"
        :visible.sync="checkResultVisible"
        width="60%"
        :before-close="handleClose"
      >
        <!--  查询结果表格 -->
        <div class="content">
          <div class="head">
              {{$t('loadcurve.meterlist')}}
              <div class="operate">
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
          <el-table-column prop="errorCode" :label="$t('clock.status')"></el-table-column>
          <el-table-column prop="recTime" :label="$t('global.dataresponse')" width="180"></el-table-column>
          <el-table-column prop="dataName" :label="$t('global.dataname')" width="180"></el-table-column>
          <el-table-column prop="value" :label="$t('systemparam.val')">
            <!-- <template slot-scope="scope">{{ formatTimes(scope.row.value) }}</template> -->
          </el-table-column>
        </el-table>
      </el-dialog>
  </basic-container>
</template>
<script>
import {mapGetters} from 'vuex'
import { getDevice,getViewList } from "@/api/autoRegister";
import Pagination from '@/components/Pagination'
import meterTable from '@/components/meterTable';
import dcuTable from "@/components/dcuTable";
import searchForm from "@/components/searchForm";
import progressCom from "@/components/progress";
import { readTask, checkResult,readRealTask,getList,readRealCallTask } from "@/api/clock";
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
    meterTable,
    searchForm,
    progressCom
  },
  data () {
    return {
      active: '0',
      paramData1:[],
      paramData2:[],
      paramData3:[],
      paramData4:[],
      meterlistData:[],
      tableData:[],
      selectParam1:[],
      selectParam2:[],
      selectParam3:[],
      selectParam4:[],
      taskItem1:[],
      taskItem2:[],
      taskItem3:[],
      taskItem4:[],
      resultTableData:[],
      selectTableData:[],
      taskItem:[],
      options:[],
      total:0,
      proNum:0,
      query:{
        page: 1,
        limit: 20
      },
      queryT:{
        page: 1,
        limit: 9999
      },
      searchValue:{
        factoryCode: -1,  //厂家类型
        type:-1, //电表类型或者集中器类型
        serachValue:"" //电表或者集中器逻辑设备名
      },
      loading: false,
      loadingT:false,
      checkResultVisible:false,
      tableHeight2: window.innerHeight - 650,
      tableHeight1: '240',
      searchForm: {
        name: []
      },
      isTimer:'', //定时器名称
    };
  },
  watch: {
    treeNode (treeNode) {
      this.searchValue={
        factoryCode: -1,  //厂家类型
        type:-1, //电表类型或者集中器类型
        serachValue:"" //电表或者集中器逻辑设备名
      }
      if(!this.isNull(this.treeNode)){
        this.getData();
      }
    },
  },
  mounted() {
    this.getOBIS();
    window.onresize = ()=>{
      this.tableHeight2=window.innerHeight - 650;
    }
  },
  methods:{
    isNull(arg1){
      return !arg1 && arg1!==0 && typeof arg1!=="boolean"?true:false;
    },
    formatTime (date) {
      return date.getFullYear() + '-' + (date.getMonth() + 1 + '').padStart(2, '0') + '-' + (date.getDate() + '').padStart(2, '0');
    },
    getOBIS(){
      this.loading=true;
      getList({
        dataType:0,
        pageNum:1,
        pageSize:999
      }).then(res=>{
        this.paramData1=res.data.data.list;
        this.loading=false;
      });
      getList({
        dataType:1,
        pageNum:1,
        pageSize:999
      }).then(res=>{
        this.paramData2=res.data.data.list;
        this.loading=false;
      })
      getList({
        dataType:3,
        pageNum:1,
        pageSize:999
      }).then(res=>{
        this.paramData3=res.data.data.list;
        this.loading=false;
      })
      getList({
        dataType:6,
        pageNum:1,
        pageSize:999
      }).then(res=>{
        this.paramData4=res.data.data.list;
        this.loading=false;
      })
    },
    // 获取数据
    getData() {
      this.loadingT = true;
      let param={
        isAllTmnal: 0, //查集中器是1 查电表是0
        pageNum: this.query.page,
        pageSize: this.query.limit,
        ...this.searchValue
      } 
      if (this.treeNode.deviceType==='tmnl') {
        param.terminalAddr=this.treeNode.deviceName
      } else if(this.treeNode.deviceType==='meter'){
        param.meterAddr=this.treeNode.deviceName;
      } else if(this.treeNode.deviceType === "group"){
        param.groupId=this.treeNode.id;
      } else {
        param.orgNo=this.treeNode.deviceNo;
      }
      getDevice(param).then(res => {
        if(res.data.data.total!=0){
          this.meterlistData = res.data.data.list;
        }else{
          this.meterlistData=[]
        }
        this.total=res.data.data.total;
        this.loadingT = false;
      });
    },
    paramClick(val){
      // this.getOBIS();
    },
    // 选中的数据
    selectParam(val){
      if(this.active=='0'){
        this.selectParam1 = val;
      }else if(this.active=='1'){
        this.selectParam2=val;
      }else if(this.active=='3'){
        this.selectParam3=val;
      }else if(this.active=='6'){
        this.selectParam4=val;
      }
    },

    // 选择电表的数据
    selectFun(val) {
      this.selectTableData = val;
    },

    // 读取操作
    read () {
      if(this.selectTableData.length!=0){
        this.loading=true;
        let taskItems = [];
        if(this.active=='0'){
          this.selectTableData.forEach((item) => {
            this.selectParam1.forEach(itemT=>{
              taskItems.push({
                code:itemT.code,
                meterAsset: item.commAddr1,
                // dataType:1,
                optType:1,
                pointId: item.mpSn,
                terminalAddr: item.terminalAddr,
                tmnlAssetNo: item.etmnlassetNo
              });
            })
          });
          this.send(taskItems);
        }else if(this.active=='1'){
          this.selectTableData.forEach((item) => {
            this.selectParam2.forEach(itemT=>{
              taskItems.push({
                code:itemT.code,
                meterAsset: item.commAddr1,
                pointId: item.mpSn,
                // dataType:2,
                optType:1,
                terminalAddr: item.terminalAddr,
                tmnlAssetNo: item.etmnlassetNo
              });
            })
          });
          this.sendT(taskItems);
        }else if(this.active=='3'){
          this.selectTableData.forEach((item) => {
            this.selectParam3.forEach(itemT=>{
              taskItems.push({
                code:itemT.code,
                meterAsset: item.commAddr1,
                pointId: item.mpSn,
                // dataType:2,
                optType:1,
                terminalAddr: item.terminalAddr,
                tmnlAssetNo: item.etmnlassetNo
              });
            })
          });
          this.sendT(taskItems);
        }else if(this.active=='6'){
          this.selectTableData.forEach((item) => {
            this.selectParam4.forEach(itemT=>{
              taskItems.push({
                code:itemT.code,
                meterAsset: item.commAddr1,
                pointId: item.mpSn,
                // dataType:2,
                terminalAddr: item.terminalAddr,
                tmnlAssetNo: item.etmnlassetNo
              });
            })
          });
          this.sendT(taskItems);
        }
        
      }else{
        this.$notify({
          title: this.$t("global.warn"),
          message: this.$t("global.warncont"),
          type: "warning"
        });
      }
    },
    // 发送信息
    send(val) {
      this.searchForm.name=[];
      this.resultTableData=[];
      this.proNum=0;
      readTask(val).then(res => {
        this.taskItem=[];
        this.loading=false;
        if (res.data.success) {
          res.data.data.forEach((item,index) => {
            this.taskItem.push({
              tmnlAssetNo:item.tmnlAssetNo,
              name:item.meterAsset,
              taskId:item.taskId
            });
          });
          if(this.active=="0"){
            this.taskItem1=this.taskItem;
            this.checkResult1();
          }
          this.$message({
            message: this.$t("global.operatorSuccess"),
            type: "success"
          });
        }
      });
    },
    // 发送信息
    sendT(val) {
      this.searchForm.name=[];
      this.resultTableData=[];
      this.proNum=0;
      readRealCallTask(val).then(res => {
        this.taskItem=[];
        this.loading=false;
        if (res.data.success) {
          res.data.data.forEach((item,index) => {
            this.taskItem.push({
              tmnlAssetNo:item.tmnlAssetNo,
              name:item.meterAsset,
              taskId:item.taskId
            });
          });
          if(this.active=="1"){
            this.taskItem2=this.taskItem;
            this.checkResult2();
          }else if(this.active=="3"){
            this.taskItem3=this.taskItem;
            this.checkResult3();
          }else if(this.active=="6"){
            this.taskItem4=this.taskItem;
            this.checkResult4();
          }
          this.$message({
            message: this.$t("global.operatorSuccess"),
            type: "success"
          });
        }
      });
    },
    checkResult(){
      if(this.active=="0"){
        this.checkResult1();
      }else if(this.active=="1"){
        this.checkResult2();
      }else if(this.active=="3"){
        this.checkResult3();
      }else if(this.active=="6"){
        this.checkResult4();
      }
    },
     // 查询结果操作
    checkResult1() {
        if(this.taskItem1.length==0){
          this.$message({
            message: this.$t("global.readdata"),
            type: 'warning'
          });
          return 
        }
        this.checkResultVisible = true;
        this.startTime1();
        let a=0;
        let arr = [];
        this.taskItem.forEach(item=>{
          arr.push(item.taskId)
        })
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
            let param={
              value:''
            };
            let value=[]
            if ("responseCodeItems" in item.responseDbDataItem) {
              value=item.responseDbDataItem.responseCodeItems
            }
              this.taskItem1.forEach(itemT=>{
                if(itemT.taskId===item.taskId){
                  param.tmnlAssetNo=itemT.tmnlAssetNo,
                  param.deviceName=itemT.name;
                  param.errorCode=item.errorCode;
                  param.recTime=item.recTime;
                  value.forEach((item)=>{
                    param.value=item.value;
                    param.dataName=item.codeLabel;
                  })
                }
              })
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
      // }
    },
     // 查询结果操作
    checkResult2() {
        if(this.taskItem2.length==0){
          this.$message({
            message: this.$t("global.readdata"),
            type: 'warning'
          });
          return 
        }
        this.checkResultVisible = true;
        this.startTime2();
        let a=0;
        let arr = [];
        this.taskItem.forEach(item=>{
          arr.push(item.taskId)
        })
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
            let param={
              value:''
            };
            let value=[]
            if ("responseCodeItems" in item.responseDbDataItem) {
              value=item.responseDbDataItem.responseCodeItems
            }
              this.taskItem2.forEach(itemT=>{
                if(itemT.taskId===item.taskId){
                  param.tmnlAssetNo=itemT.tmnlAssetNo,
                  param.deviceName=itemT.name;
                  param.errorCode=item.errorCode;
                  param.recTime=item.recTime;
                  value.forEach((item)=>{
                    param.value=item.value;
                    param.dataName=item.codeLabel;
                  })
                }
              })
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
      // }
    },
     // 查询结果操作
    checkResult3() {
        if(this.taskItem3.length==0){
          this.$message({
            message: this.$t("global.readdata"),
            type: 'warning'
          });
          return 
        }
        this.checkResultVisible = true;
        this.startTime3();
        let a=0;
        let arr = [];
        this.taskItem.forEach(item=>{
          arr.push(item.taskId)
        })
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
            let param={
              value:''
            };
            let value=[]
            if ("responseCodeItems" in item.responseDbDataItem) {
              value=item.responseDbDataItem.responseCodeItems
            }
              this.taskItem3.forEach(itemT=>{
                if(itemT.taskId===item.taskId){
                  param.tmnlAssetNo=itemT.tmnlAssetNo;
                  param.deviceName=itemT.name;
                  param.errorCode=item.errorCode;
                  param.recTime=item.recTime;
                  value.forEach((item)=>{
                    param.value=item.value;
                    param.dataName=item.codeLabel;
                  })
                }
                
              })
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
      // }
    },
     // 查询结果操作
    checkResult4() {
        if(this.taskItem4.length==0){
          this.$message({
            message: this.$t("global.readdata"),
            type: 'warning'
          });
          return 
        }
        this.checkResultVisible = true;
        this.startTime4();
        let a=0;
        let arr = [];
        this.taskItem.forEach(item=>{
          arr.push(item.taskId)
        })
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
            let param={
              value:''
            };
            let value=[]
            if ("responseCodeItems" in item.responseDbDataItem) {
              value=item.responseDbDataItem.responseCodeItems
            }
              this.taskItem4.forEach(itemT=>{
                if(itemT.taskId===item.taskId){
                  param.tmnlAssetNo=itemT.tmnlAssetNo;
                  param.deviceName=itemT.name;
                  param.errorCode=item.errorCode;
                  param.recTime=item.recTime;
                  value.forEach((item)=>{
                    param.value=item.value;
                    param.dataName=item.codeLabel;
                  })
                }
              })
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
      // }
    },
    // 精准查找操作
    searchDevice(val){
      this.searchValue=val;
      this.getData();
    },

    // 定时器
    startTime1(){
      this.isTimer=setTimeout(this.checkResult1, 1000);
    },
    // 定时器
    startTime2(){
      this.isTimer=setTimeout(this.checkResult2, 1000);
    },
    // 定时器
    startTime3(){
      this.isTimer=setTimeout(this.checkResult3, 1000);
    },
    // 定时器
    startTime4(){
      this.isTimer=setTimeout(this.checkResult4, 1000);
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
  },
  computed: {
    ...mapGetters(['colorName', 'themeName', 'level', 'treeNode'])
  },
  
  
}
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
  position: relative;
  border: 1px solid #ddd;
  box-sizing: border-box;
  .head {
    height: 40px;
    padding-left: 20px;
    // border: 1px solid #ddd;
    border-bottom: 0;
    line-height: 40px;
    .operate {
      float: right;
      display: flex;
      align-items: center;
      // height: 40px;
      flex-wrap: wrap;
      margin-right: 20px;
      .right-box {
        float: right;
        display: flex;
        align-items: center;
        height: 40px;
        margin-right: 20px;
      }
      .formname{
        display: flex;
        align-items: center;
        height: 40px;
        >span{
          display: inline-block;
          width: 130px;
          border-left: 1px solid #ddd;
          height: 20px;
          line-height: 20px;
          padding: 0 0 0 20px;
        }
      }
      & > span {
        display: inline-block;
        // width: 120px;
        padding: 0 20px;
        height: 20px;
        line-height: 20px;
        text-align: center;
        border-left: 1px solid #ddd;
        cursor: pointer;
        img {
          vertical-align: middle;
          padding-bottom: 4px;
        }
      }
      .checkbox {
        width: 350px;
        span {
          margin-left: 30px;
        }
      }
    }
  }
}
.circle {
  width: 20px;
  height: 20px;
  padding-top: 2px;
  background-color: #87D182;
  border-radius: 50%;
  box-sizing: border-box;
  &::after {
    content: '';
    display: block;
    width: 12px;
    height: 12px;
    margin: 0 auto;
    border: 2px solid #fff;
    border-radius: 50%;
  }
}
.el-tabs {
  // padding-bottom: 30px;
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