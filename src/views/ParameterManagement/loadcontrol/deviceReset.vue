<template>
  <basic-container>
    <div class="paramters">
      <el-tabs v-model="active1" type="card">
        <el-tab-pane :label="$t('rtuparam.dcuList')" name="1">
          <div class="uni-cast">
            <div class="content">
              <div class="head">
                {{$t('rtuparam.dcuList')}}
                <div class="operate">
                  <!-- 搜索条件组件 -->
                  <searchForm @searchFun="searchDevice" :isType="1"></searchForm>
                  <span @click="readFun">
                    <img src="img/read.png" alt />
                    {{$t('meterbtn.reset')}}
                  </span>
                  <!-- <span @click="writeFun" v-show="active1!='3'">
                    <img src="img/write.png" alt />
                    {{$t('global.write')}}
                  </span> -->
                  <span @click="checkResult">
                    <img src="img/Checkresult.png" alt />
                    {{$t('global.checkResult')}}
                  </span>
                </div>
              </div>
              <!-- 集中器表格 -->
              <dcuTable :basicdata="basicdata" :loading="loading" @selectDCU="selectFun" :height="tableHeight" :pageNum='query'></dcuTable>
              <pagination
                :total="total"
                :page.sync="query.page"
                :limit.sync="query.limit"
                @pagination="getData"
              />
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane name="2" :label="$t('rtuparam.nbList')">
          <div class="uni-cast">
            <div class="content">
              <div class="head">
                {{$t('rtuparam.nbList')}}
                <div class="operate">
                  <!-- 搜索条件组件 -->
                  <searchForm @searchFun="searchDevice" :isType="1"></searchForm>
                  <span @click="readFun">
                    <img src="img/read.png" alt />
                    {{$t('meterbtn.reset')}}
                  </span>
                  <!-- <span @click="writeFun" v-show="active1!='3'">
                    <img src="img/write.png" alt />
                    {{$t('global.write')}}
                  </span> -->
                  <span @click="checkResult">
                    <img src="img/Checkresult.png" alt />
                    {{$t('global.checkResult')}}
                  </span>
                </div>
              </div>
              <!-- 集中器表格 -->
              <dcuTable :basicdata="basicdataT" :loading="loading" @selectDCU="selectFun" :height="tableHeight" :pageNum='querynb'></dcuTable>
              <pagination
                :total="totalT"
                :page.sync="querynb.page"
                :limit.sync="querynb.limit"
                @pagination="getData"
              />
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    
    <el-dialog :title="$t('global.checkResult')" :visible.sync="checkResultVisible" width="60%" :before-close="handleClose"> 
      <!--  查询结果表格 -->
        <div class="content">
          <div class="head">
            Read result
            <div class="operate">
              <!-- 进度条组件 -->
              <progressCom :num='proNum'></progressCom>
              <div class="formname">
                <span>Logic Device Name</span>
                <el-select
                  v-model="searchForm.name"
                  size="small"
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
        v-loading="loadingT"
        border
        :header-cell-style="{background:'#F2F2F2',color:'rgb(51,51,51)'}"
        height='600'
      >
        <el-table-column :label="$t('global.id')" width="80">
          <template slot-scope="scope">{{ scope.$index+1 }}</template>
        </el-table-column>
        <el-table-column prop="deviceName" :label="$t('clock.deviceName')"></el-table-column>
        <el-table-column prop="optype" :label="$t('upgrade.operType')">
          <template slot-scope="scope">{{ changeOpt(scope.row.optype) }}</template>
        </el-table-column>
        <el-table-column prop="errorCode" :label="$t('clock.status')"></el-table-column>
        <el-table-column prop="recTime" :label="$t('global.dataresponse')" width="180"></el-table-column>
      </el-table>
    </el-dialog>
  </basic-container>
</template>
<script>
import { mapGetters } from "vuex";
import { readTask, checkResult,setParam } from "@/api/clock";
import { getDevice, getViewList } from "@/api/autoRegister";
import Pagination from "@/components/Pagination";
import dcuTable from '@/components/dcuTable';
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
  components: { Pagination,dcuTable,searchForm,progressCom },
  name:'b',
  data() {
    return {
      active1: "1",
      tableData:[],
      basicdata:[],
      basicdataT:[],
      factoryList:[],
      searchForm:{
        name:[],
      },
      total:0,
      totalT:0,
      query:{
        page: 1,
        limit: 20
      },
      querynb:{
        page: 1,
        limit: 20
      },
      queryT: {
        page: 1,
        limit: 9999
      },
      selectTableData:[],
      selectTableDataT:[],
      checkResultVisible: false,
      searchValue:{
        factoryCode:-1,
        serachValue:""
      },
      dcuParamA:[],
      loading:false,
      loadingT:false,
      isMultiple:0,  //0 是单个参数  1是多个参数
      resultTableData: [],
      tableHeight:window.innerHeight - 370,
      isTimer:'', //定时器名称
      isDirect:0,  //0 4g从dcu读  1 meter从dcu读  2meter从meter读
      proNum:0,
      options:[], //过滤参数
    };
  },
  computed: {
    ...mapGetters(["colorName", "themeName", "treeNode"])
  },
  watch: {
    treeNode: function() {
      this.searchValue={
        factoryCode: -1,  //厂家类型
        serachValue:"" //电表或者集中器逻辑设备名
      }
      this.searchValue.serachValue=this.treeNode.terminalAddr
        this.getData();
        this.getDataT();
    }
  },
  mounted(){
    this.getView();
    window.onresize = () => {
      this.tableHeight = window.innerHeight - 370;
    };
  },
  methods: {
    getData() {
      this.loading = true;
      this.loading = true;
      let param={}
      if (
        this.treeNode.deviceType === "tmnl"
      ) {
        param = {
          isAllTmnal: 1, //查集中器是1 查电表是0
          pageNum: this.query.page,
          pageSize: this.query.limit,
          type:5, 
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
      } else {
        param = {
          isAllTmnal: 1, //查集中器是1 查电表是0
          orgNo: this.treeNode.deviceNo,
          pageNum: this.query.page,
          pageSize: this.query.limit,
          type:5, 
          ...this.searchValue
        };
      }
      getDevice(param).then(res => {
        if(res.data.data.total!=0){
          this.basicdata = res.data.data.list;
        }else{
          this.basicdata = []
        }
        this.total=res.data.data.total;
        this.loading = false;
      });
      
    },
    getDataT(){
      this.loading = true;
      let param = {};
      if (
        this.treeNode.deviceType === "tmnl"
      ) {
        param = {
          isAllTmnal: 1, //查集中器是1 查电表是0
          pageNum: this.query.page,
          pageSize: this.query.limit,
          deviceType:-1, //-1查4g/nb  0是载波表
          terminalAddr: this.treeNode.deviceName,
          ...this.searchValue
        };
      } else if(this.treeNode.deviceType === "group"){
        param={
          isAllTmnal: 1,
          groupId:this.treeNode.id,
          pageNum: this.query.page,
          pageSize: this.query.limit,
          deviceType:-1,
          ...this.searchValue
        }
      } else {
        param = {
          isAllTmnal: 1, //查集中器是1 查电表是0
          orgNo: this.treeNode.deviceNo,
          pageNum: this.query.page,
          pageSize: this.query.limit,
          deviceType:-1, //-1查4g/nb  0是载波表
          ...this.searchValue
        };
      }
      getDevice(param).then(res => {
        if(res.data.data.total!=0){
          this.basicdataT = res.data.data.list; 
        }else{
          this.basicdataT = []
        }
        this.totalT=res.data.data.total;
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
    selectFun(val){
      if(this.active1=='1'){
        this.selectTableData = val;
      }else{
        this.selectTableDataT = val;
      }
    },
    // 精确查找
    searchDevice(val){
      this.searchValue=val;
      this.getData();
    },
    search(){
      this.query.pageNum = 1;
      this.getData()
    },
    readFun(){
      if(this.active1=="1"){
        this.read();
      }else if(this.active1=="2"){
        this.readT()
      }
    },
    // 集中器远程自动复位
    read() {
      if (this.selectTableData.length != 0) {
        let taskItems = [];
        this.selectTableData.forEach(item => {
          taskItems.push({
            attriFlag: 1,
            attriId: 134,
            classId: 1,
            meterAsset: item.cisAssetNo,
            obis: '0.0.96.50.0.255',
            optType: 2,
            pointId: item.attachMeterFlag,
            terminalAddr: item.cisAssetNo,
            tmnlAssetNo: item.cisAssetNo
          })
        })
        this.send(taskItems)
      }else {
          this.$notify({
            title: this.$t("global.warn"),
            message: this.$t("global.itemread"),
            type: "warning"
          });
        }
    },
    // 4g、nb远程自动复位
    readT() {
      if (this.selectTableDataT.length != 0) {
        let taskItems = [];
        this.selectTableDataT.forEach(item => {
          taskItems.push({
            attriFlag: 1,
            attriId: 1,
            classId: 9,
            meterAsset: item.cisAssetNo,
            obis: '0.0.96.50.25.255',
            optType: 2,
            pointId: item.attachMeterFlag,
            terminalAddr: item.cisAssetNo,
            tmnlAssetNo: item.cisAssetNo
          })
        })
        this.send(taskItems);
      }else {
        this.$notify({
          title: this.$t("global.warn"),
          message: this.$t("global.itemread"),
          type: "warning"
        });
      }
    },
    send(val){
      this.searchForm.name=[];
      this.resultTableData=[];
      this.proNum=0;
      readTask(val).then(res => {
        this.loading = false;
        this.taskItem = [];
        if (res.data.success) {
          res.data.data.forEach(item => {
            this.taskItem.push({
              name: item.meterAsset,
              taskId: item.taskId,
              optType: item.optType,
            });
          });
          if(this.active1=="1"){
            this.dcuParamA=this.taskItem;
          }else if(this.active1=="2"){
            this.dcuParamB=this.taskItem;
          }
          this.$message({
            message: this.$t("global.operatorSuccess"),
            type: "success"
          });
          this.checkResult();
        }
      });
    },
    checkResult() {
      if(this.dcuParamA.length!=0||this.dcuParamB.length!=0){
        this.checkResultVisible = true;
        // this.loadingT = true;
        this.startTime();
        let a=0;
        let arr = [];
        if(this.active1=="1"){
          this.dcuParamA.forEach(item => {
          arr.push(item.taskId);
          });
        }else if(this.active1=="2"){
          this.dcuParamB.forEach(item => {
            arr.push(item.taskId);
          });
        }
        checkResult({
          taskIds: arr,
          pageNum: this.queryT.page,
          pageSize: this.queryT.limit
        }).then(res => {
          this.tableData = [];
          res.data.data.items.forEach(item => {
            let param = {
              value:''
            };
            let value=[]
            if(item.taskStauts!=-1){
              a++;
            }
            if(this.active1=="1"){
              this.dcuParamA.forEach(itemT => {
                if (itemT.taskId == item.taskId) {
                  param.deviceName = itemT.name;
                  param.errorCode = item.errorCode;
                  param.recTime=item.recTime
                  param.optype={
                    optType: itemT.optType,
                  }
                }
              });
              
            }else if(this.active1=="2"){
              this.dcuParamB.forEach(itemT => {
                if (itemT.taskId == item.taskId) {
                  param.deviceName = itemT.name;
                  param.errorCode = item.errorCode;
                  param.recTime=item.recTime
                  param.optype={
                    optType: itemT.optType,
                  }
                }
              });
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
    changeOpt(val){
      if (val.optType == 1) {
        return this.$t('global.read')
      } else {
        return this.$t('global.write')
      }
    },
    changeClass(val){
      return this.$t(val);
    }
  }
};
</script>
<style lang='scss' scoped>
.paramters {
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
  .third-floor {
    display: flex;
    margin-top: 25px;
    .reset,
    .signal,
    .others {
      flex: 1;
      position: relative;
      height: 140px;
      padding: 20px;
      margin-right: 20px;
      border: 1px solid #ddd;
      .checkbox {
        position: absolute;
        top: -12px;
        left: 20px;
        padding: 0 5px;
        background-color: #fff;
        box-sizing: border-box;
      }
      ul {
        padding: 0;
        li {
          margin-bottom: 10px;
          span {
            display: inline-block;
            width: 140px;
            color: #666666;
          }
        }
      }
    }
    .others {
      margin-right: 0;
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
          height: 20px;
          padding: 0 20px;
          // margin-top: 10px;
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
          width: 400px;
          span {
            margin-left: 30px;
          }
        }
      }
    }
    .page {
      position: absolute;
      bottom: 0;
      width: 100%;
      height: 50px;
      border-top: 1px solid #ddd;
      background-color: #fafafa;
      .el-pagination {
        margin: 10px 0 0 15px;
      }
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