<template>
  <basic-container>
    <div>
      <!-- <el-tabs v-model="active2" type="card">
        <el-tab-pane label="Uni-cast" name="Uni-cast" style="padding: 0 10px;" > -->
          <el-form :inline="true" :model="loadForm" label-width="60px" label-position="left" :rules="dcurules" ref="dcuform">
              <el-form-item prop="timeStart" :label="$t('auto.from')">
                <el-date-picker
                  v-model="loadForm.timeStart"
                  type="month"
                  size="small"
                  style="width:140px;"
                  :clearable="false"
                  :editable="false"
                ></el-date-picker>
              </el-form-item>
              <el-form-item prop="timeEnd" :label="$t('global.to')">
                <el-date-picker
                  v-model="loadForm.timeEnd"
                  type="month"
                  size="small"
                  style="width:140px;"
                  :clearable="false"
                  :editable="false"
                ></el-date-picker>
              </el-form-item>
            </el-form>
          <div class="content">
            <div class="head">
              Meter Information
              <div class="operate">
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
            <!-- <template> -->
              <el-table-column
                :key="item.index"
                :prop="item.datavalue"
                :label="item.descript"
                width="200"
                v-for="(item,index) in columnList"
                :render-header="renderHeader"
              >
                <template slot-scope="scope">
                  <div >{{changeValT(scope.row['data'+index])}}</div>
                </template>
              </el-table-column>
            <!-- </template> -->
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
import meterTable from '@/components/meterTable';
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
      active2: "Uni-cast",
      controlMode: "1",
      tableData:[],
      basicdata: [],
      selectTableData:[],
      resultTableData:[],
      columnList: [],
      obisArr:[],
      total: 0,
      query: {
        page: 1,
        limit: 20
      },
      searchValue:{
        factoryCode: -1,  //厂家类型
        type:-1, //电表类型或者集中器类型
        serachValue:"" //电表或者集中器逻辑设备名
      },
      loadForm:{
        timeStart: new Date(),
        timeEnd: new Date(this.formatTimeF(new Date())),
      },
      dcurules:{
        timeStart: [{ type: 'date',required: true, message: this.$t('global.selectdate'), trigger: 'change' }],
        timeEnd: [{ type: 'date',required: true, message: this.$t('global.selectdate'), trigger: 'change' }],
      },
      checkResultVisible:false,
      searchForm:{
        name:[]
      },
      loading:false,
      loadingT:false,
      taskItem:[],
      totalT: 0,
      queryT: {
        page: 1,
        limit: 9999
      },
      tableHeight:window.innerHeight - 360,
      dialogVisible:false,
      successNum:0,  //查询结果返回状态的累计数量
      isTimer:'', //定时器名称
      proNum:0,  //进度
      paramValue:{},
      rate:{},
      options:[], //过滤参数
      cumData:[],
    };
  },
  mounted () {
    this.getcolumnList();
    window.onresize = ()=>{
      this.tableHeight=window.innerHeight - 360
    }
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
    formatTimeT(val) {
      let date = new Date(val)
      return date.getFullYear() + '-' + (date.getMonth() + 1 + '').padStart(2, '0')
    },
    formatTimeF(val) {
      let date = new Date(val)
      return date.getFullYear() + '-' + (date.getMonth() + 2 + '').padStart(2, '0')
    },
    selectFun(val) {
      this.selectTableData = val;
    },
    read () {
      if(this.selectTableData.length!=0){
        if(this.loadForm.timeStart.getTime()>this.loadForm.timeEnd.getTime()){
          this.$message({
            type: "error",
            message: this.$t('auto.timeBug')
          })
        }else{
          if(this.loadForm.timeStart.getMonth()+ 2 >=this.loadForm.timeEnd.getMonth()){
            this.loading=true;
            let taskItems = [];
            this.selectTableData.forEach(item => {
              taskItems.push({
                attriId: 2,
                classId: 7,
                meterAsset: item.commAddr1,
                obis: "1.0.98.1.4.255",
                pointId: item.mpSn,
                terminalAddr: item.terminalAddr,
                tmnlAssetNo: item.etmnlassetNo,
                startTime:this.formatTimeT(this.loadForm.timeStart)+'-01 00:00:00',
                endTime:this.formatTimeT(this.loadForm.timeEnd)+'-01 00:00:00'
              });
            });
            this.send(taskItems);
          }else{
            this.$message({
              type: "error",
              message: this.$t('auto.twomonth')
            })
            
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
          // sessionStorage.setItem("cumData", JSON.stringify(this.taskItem));
          this.$message({
            message: this.$t("global.operatorSuccess"),
            type: "success"
          });
          this.checkResult();
        }
      });
    },
    checkResult () {
      if(this.taskItem.length===0){
        this.$message({
          message: this.$t("global.readdata"),
          type: 'warning'
        });
      }else{
        this.checkResultVisible = true;
        this.startTime();
        // this.loadingT=true;
        let arr = []
        let a=0;
        this.taskItem.forEach(item=>{
          arr.push(item.taskId)
        })
        if(this.taskItem.length!=0){
          checkResult({
            taskIds:arr,
            pageNum:this.queryT.page,
            pageSize:this.queryT.limit,
          }).then(res => {
            this.tableData = [];
            this.totalT=res.data.data.count;
            res.data.data.items.forEach(item=> { 
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
                }
              })
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
        }
      }
    },
    changeValT(val){
      if(JSON.stringify(val) == "{}"){
        return '-'
      }else{
        return val
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
    // 精准查找操作
    searchDevice(val){
      this.searchValue=val;
      this.getData();
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
      for (let i = 0; i <= 32; i++) {
        columns['data' + i]=this.$t('cumulative.data' + i)
      }
      this.exportData = {
        url: "/api/ami-communicate/taskCore/checkTaskResultList",
        params: this.paramValue,
        columns: columns,
        fileName: "cumulativequistion", // avgvolcur- + 对象类型- +对象名称命名
        sheetName: "cumulativequistion"
      };
    },
    changeDialog(val){
      this.dialogVisible = val;
    },
    renderHeader(h, { column, $index }){
      let label = column.label;
      let ua = navigator.userAgent.toLocaleLowerCase();
      for(let i=0;i<this.obisArr.length;i++){
        if (label === this.$t('cumulativeT.data'+i)){
          return h('p',{
            on: {
              mouseenter: (e) => {
                if (ua.match(/firefox/) != null) {
                  e.target.title=`${this.$t('cumulative.data'+i)}\n${this.obisArr[i]}`;
                }else if (ua.match(/chrome/) != null){
                  e.path[0].title = `${this.$t('cumulative.data'+i)}\n${this.obisArr[i]}`
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
        '1-0:1.2.0.255',
        '1-0:2.2.0.255',
        '1-0:3.2.0.255',
        '1-0:4.2.0.255',
        '1-0:5.2.0.255',
        '1-0:8.2.0.255',
        '1-0:9.2.0.255',
        '1-0:10.2.0.255',
        '1-0:1.2.1.255',
        '1-0:2.2.1.255',
        '1-0:3.2.1.255',
        '1-0:4.2.1.255',
        '1-0:5.2.1.255',
        '1-0:8.2.1.255',
        '1-0:9.2.1.255',
        '1-0:10.2.1.255',
        '1-0:1.2.2.255',
        '1-0:2.2.2.255',
        '1-0:3.2.2.255',
        '1-0:4.2.2.255',
        '1-0:5.2.2.255',
        '1-0:8.2.2.255',
        '1-0:9.2.2.255',
        '1-0:10.2.2.255',
        '1-0:1.2.3.255',
        '1-0:2.2.3.255',
        '1-0:3.2.3.255',
        '1-0:4.2.3.255',
        '1-0:5.2.3.255',
        '1-0:8.2.3.255',
        '1-0:9.2.3.255',
        '1-0:10.2.3.255'

      ];
      for (let i = 0; i < 33; i++) {
        this.columnList.push({
          datavalue: 'data' + i,
          descript: this.$t('cumulativeT.data' + i),
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
@import '@/styles/common.scss';

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