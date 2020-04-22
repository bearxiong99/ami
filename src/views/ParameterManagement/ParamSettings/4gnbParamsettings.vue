<template>
  <basic-container>
    <div class="paramters">
      <el-tabs v-model="active1" type="card">
        <el-tab-pane name="1" :label="$t('rtuparam.nbParam')">
          <!-- <div class="master">
            <div class="checkbox">
              <el-checkbox v-model="formThreshold[7].check">Quality Of Service</el-checkbox>
            </div>
            <el-row :gutter="20">
              <el-col :span="6">
                <span>Precedence</span>
                <el-input v-model="formThreshold[7].paramGPRS.precedenceDef" style="width: 150px"></el-input>
              </el-col>
              <el-col :span="6">
                <span>Delay</span>
                <el-input v-model="formThreshold[7].paramGPRS.delayDef" style="width: 150px"></el-input>
              </el-col>
              <el-col :span="6">
                <span>Reliability</span>
                <el-input v-model="formThreshold[7].paramGPRS.reliabilityDef" style="width: 150px"></el-input>
              </el-col>
              <el-col :span="6">
                <span>Peak Throughput</span>
                <el-input v-model="formThreshold[7].paramGPRS.peakDef" style="width: 150px"></el-input>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="6">
                <span>Mean Throughput</span>
                <el-input v-model="formThreshold[7].paramGPRS.meanDef" style="width: 150px"></el-input>
              </el-col>
              <el-col :span="6">
                <span>Precedence-requested</span>
                <el-input v-model="formThreshold[7].paramGPRS.precedenceReq" style="width: 150px"></el-input>
              </el-col>
              <el-col :span="6">
                <span>Delay-requested</span>
                <el-input v-model="formThreshold[7].paramGPRS.delayReq" style="width: 150px"></el-input>
              </el-col>
              <el-col :span="6">
                <span>Reliability-requested</span>
                <el-input v-model="formThreshold[7].paramGPRS.reliabilityReq" style="width: 150px"></el-input>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="6">
                <span>Peak throughput-requested</span>
                <el-input v-model="formThreshold[7].paramGPRS.peakReq" style="width: 150px"></el-input>
              </el-col>
              <el-col :span="6">
                <span>Mean throughput-requested</span>
                <el-input v-model="formThreshold[7].paramGPRS.meanReq" style="width: 150px"></el-input>
              </el-col>
            </el-row>
          </div> -->
          <div class="third-floor">
            <div class="reset">
              <div class="checkbox">
                <el-checkbox v-model="formThreshold[0].check">GPRS keep alive time interval</el-checkbox>
              </div>
              <ul>
                <li>
                  <span>{{$t('rtuparam.autoReset')}}</span>
                  <el-select v-model="formThreshold[0].paramAlivePer.benable" style="width: 150px">
                    <el-option label="YES" value="1"></el-option>
                    <el-option label="No" value="0"></el-option>
                  </el-select>
                </li>
                <li>
                  <span>{{$t('rtuparam.resetinter')}}</span>
                  <el-input v-model="formThreshold[0].paramAlivePer.idealTime" style="width: 150px"></el-input>
                </li>
                <li>
                  <span>{{$t('rtuparam.resettime')}}</span>
                  <el-input v-model="formThreshold[0].paramAlivePer.retryNum" style="width: 150px"></el-input>
                </li>
              </ul>
            </div>
            <div class="signal">
              <div class="checkbox">
                <el-checkbox v-model="formThreshold[1].check">APN info</el-checkbox>
              </div>
              <ul>
                <li>
                  <span>username</span>
                  <el-input v-model="formThreshold[1].paramApn.password" style="width: 150px"></el-input>
                </li>
                <li>
                  <span>userpass</span>
                  <el-input v-model="formThreshold[1].paramApn.userName" style="width: 150px"></el-input>
                </li>
              </ul>
            </div>
            <div class="signal">
              <div class="checkbox">
                <el-checkbox v-model="formThreshold[4].check">Auto connect destination_list</el-checkbox>
              </div>
              <ul>
                <!-- <li>
                  <span>Num</span>
                  <el-input v-model="formThreshold[4].paramaAddrAPort[0]" style="width: 150px"></el-input>
                </li> -->
                <li>
                  <span>Address</span>
                  <el-input v-model="formThreshold[4].paramValueList[0]" style="width: 150px"></el-input>
                </li>
              </ul>
            </div>
          </div>
          <div class="third-floor">
            <div class="signal" style="height:auto;">
              <ul style="margin:0;" class="single">
                <li>
                  <el-checkbox v-model="formThreshold[2].check">Auto connect repetitions</el-checkbox>
                  <el-input style="width: 130px" v-model="formThreshold[2].data.data"></el-input>
                </li>
                <li>
                  <el-checkbox v-model="formThreshold[3].check">Reconnect interval</el-checkbox>
                  <el-input style="width: 130px" v-model="formThreshold[3].data.data"></el-input>
                </li>
                <!-- <li>
                  <el-checkbox v-model="formThreshold[4].check">Auto connect destination_list</el-checkbox>
                  <el-input style="width: 130px" v-model="formThreshold[4].data.data"></el-input>
                </li> -->
                <li>
                  <el-checkbox v-model="formThreshold[5].check">PIN code</el-checkbox>
                  <el-input style="width: 130px" v-model="formThreshold[5].data.data"></el-input>
                </li>
                <li>
                  <el-checkbox v-model="formThreshold[6].check" style="width: 230px">4G/NB ModuleSMI-iccid</el-checkbox>
                </li>
                <li>
                  <el-checkbox v-model="formThreshold[8].check">APN</el-checkbox>
                  <el-input style="width: 130px" v-model="formThreshold[8].data.data"></el-input>
                </li>
              </ul>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="content">
        <div class="head">
          {{$t('rtuparam.nbList')}}
          <div class="operate">
            <!-- 搜索条件组件 -->
            <searchForm @searchFun="searchDevice" :isType="1"></searchForm>
            <span @click="readFun">
              <img src="img/read.png" alt />
              {{$t('global.read')}}
            </span>
            <span @click="writeFun">
              <img src="img/write.png" alt />
              {{$t('global.write')}}
            </span>
            <span @click="checkResult">
              <img src="img/Checkresult.png" alt />
              {{$t('global.checkResult')}}
            </span>
          </div>
        </div>
        <dcuTable :basicdata="basicdata" :loading="loading" @selectDCU="selectFun" :height="tableHeight" :pageNum='query'></dcuTable>
        <pagination
          :total="total"
          :page.sync="query.page"
          :limit.sync="query.limit"
          @pagination="getData"
        />
    </div>
    <el-dialog :title="$t('global.checkResult')" :visible.sync="checkResultVisible" width="60%" :before-close="handleClose">
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
        height='500'
      >
        <el-table-column :label="$t('global.id')" width="80">
          <template slot-scope="scope">{{ scope.$index+1 }}</template>
        </el-table-column>
        <el-table-column prop="tmnlAssetNo" :label="$t('global.ownerterminal')" width="180"></el-table-column>
        <el-table-column prop="deviceName" :label="$t('clock.deviceName')"></el-table-column>
        <el-table-column prop="optype" :label="$t('upgrade.operType')">
          <template slot-scope="scope">{{ changeOpt(scope.row.optype) }}</template>
        </el-table-column>
        <el-table-column prop="errorCode" :label="$t('clock.status')"></el-table-column>
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
      ></pagination> -->
    </el-dialog>
  </basic-container>
</template>
<script>
import { mapGetters } from "vuex";
import { readTask, checkResult,setParam } from "@/api/clock";
import { getDevice, getViewList } from "@/api/autoRegister";
import Pagination from "@/components/Pagination";
import searchForm from "@/components/searchForm";
import dcuTable from '@/components/dcuTable';
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
  data() {
    return {
      active1: "1",
      formGPRS:[
        {
          check:false,
          obis:'0.0.25.4.128.255',
          paramGPRS:{
            precedenceDef: "",
            maindelayDefPort: "",
            mainIp: "",
            mainPort: "",
            backupIp: "",
            backupPort: "",
            apn: "",
            apnUserName: "",
            apnPassWord: "",
            apnNumber: "",
            retryNo: "",
            retryInt: "",
            heartInt: ""
          }
        },
      ],
      formThreshold:[
        {
          classId:1,
          attriId:2,
          obis:'0.0.94.98.19.255',
          check:false,
          paramAlivePer:{
            benable: "",
            idealTime: "",
            retryNum: ""
          }
        },
        {
          classId:44,
          attriId:5,
          obis:'0.0.25.3.0.255',
          check:false,
          paramApn:{
            password: "",
            userName: "",
          }
        },
        {
          classId:29,
          attriId:3,
          obis:'0.0.2.1.0.255',
          check:false,
          data:{
            data: "",
          }
        },
        {
          classId:29,
          attriId:4,
          obis:'0.0.2.1.0.255',
          check:false,
          data:{
            data: "",
          }
        },
        {
          classId:29,
          attriId:6,
          obis:'0.0.2.1.0.255',
          check:false,
          paramValueList:['']
        },
        {
          classId:45,
          attriId:3,
          obis:'0.0.25.4.0.255',
          check:false,
          data:{
            data: "",
          }
        },
        {
          classId:1,
          attriId:1,
          obis:'0.0.96.99.0.255',
          check:false,
          data:{
            data: "",
          }
        },
        {
          classId:45,
          attriId:4,
          obis:'0.0.25.4.0.255',
          check:false,
          paramGPRS:{
            precedenceDef: "",
            delayDef: "",
            reliabilityDef: "",
            peakDef: "",
            meanDef: "",
            precedenceReq: "",
            delayReq: "",
            reliabilityReq: "",
            peakReq: "",
            meanReq: "",
          }
        },
         {
          classId:45,
          attriId:2,
          obis:'0.0.25.4.0.255',
          check:false,
          data:{
            data: "",
          }
        },
      ],
      basicdata:[],
      paramData1:[],
      searchForm:{
        name:[],
      },
      searchValue:{
        factoryCode:-1,
        serachValue:""
      },
      total:0,
      totalT:0,
      query:{
        page: 1,
        limit: 20
      },
      queryT: {
        page: 1,
        limit: 20
      },
      selectTableData:[],
      checkResultVisible: false,
      loading:false,
      loadingT:false,
      isMultiple:0,  //0 是单个参数  1是多个参数
      proNum:0,
      resultTableData: [],
      options:[],
      tableHeight:window.innerHeight - 620,
      isTimer:'',
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
      if(!this.isNull(this.treeNode)){
        this.getData();
      }
    }
  },
  mounted(){
    window.onresize = () => {
      this.tableHeight = window.innerHeight - 620;
    };
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
          isAllTmnal: 1, //查集中器是1
          terminalAddr: this.treeNode.deviceName,
          pageNum: this.query.page,
          pageSize: this.query.limit,
          deviceType:-1,
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
          isAllTmnal: 1, //查集中器是1
          orgNo: this.treeNode.deviceNo,
          pageNum: this.query.page,
          pageSize: this.query.limit,
          deviceType:-1,
          ...this.searchValue
        };
      }
      getDevice(param).then(res => {
        if(res.data.data.total!=0){
          this.basicdata = res.data.data.list;
          this.total=res.data.data.total;
        }else{
          this.basicdata = []
        }
        this.loading = false;
      });
    },

    selectFun(val){
      this.selectTableData = val;
    },

    readFun(){
      if(this.active1=="1"){
        this.read();
      }
    },
    // 读去参数
    read() {
      if (this.selectTableData.length != 0) {
        this.loading=true;
        let taskItems = [];
        this.selectTableData.forEach(item => {
          this.formThreshold.forEach(itemT=>{
            if(itemT.check){
              taskItems.push({
                attriFlag: 0, //0 读写  1 action
                attriId: itemT.attriId,
                classId: itemT.classId,
                meterAsset: item.cisAssetNo,
                obis: itemT.obis,
                optType: 1,  //1读取  2写入
                pointId: item.attachMeterFlag,
                terminalAddr: item.cisAssetNo,
                tmnlAssetNo: item.cisAssetNo
              })
            }
          })
        })
        if(taskItems.length!=0){
          this.send(taskItems);
        }else{
          this.$notify({
            title: this.$t("global.warn"),
            message: this.$t("global.itemread"),
            type: "warning"
          });
        }
      }else {
          this.$notify({
            title: this.$t("global.warn"),
            message: this.$t("global.itemread"),
            type: "warning"
          });
        }
    },
    writeFun(){
      if(this.active1=="1"){
        this.write();
      }
    },
    write() {
      if (this.selectTableData.length != 0) {
        this.loading=true;
        let taskItems = [];
        this.selectTableData.forEach(item => {
          this.formThreshold.forEach(itemT=>{
            if(itemT.check){
              let keys = Object.keys(itemT);
              let formParam={
                attriFlag: 0,
                attriId: itemT.attriId,
                classId: itemT.classId,
                meterAsset: item.cisAssetNo,
                obis: itemT.obis,
                optType: 2,
                pointId: item.attachMeterFlag,
                terminalAddr: item.cisAssetNo,
                tmnlAssetNo: item.cisAssetNo,
              }
              //根据参数值个数是单个还是多个，调取不同的接口
              if(keys[4]==='data'){
                formParam.paramValue=itemT[keys[4]].data;
                this.isMultiple=0;
              }else{
                formParam[keys[4]]=itemT[keys[4]];
                this.isMultiple=1;
              }
              taskItems.push(formParam)
            }
          })
        })
        if(taskItems.length!=0){
          if(this.isMultiple===0){
            this.send(taskItems)
          }else{
            this.writeSend(taskItems);
          }
        }else{
          this.$notify({
            title: this.$t("global.warn"),
            message: this.$t("global.itemread"),
            type: "warning"
          });
        }
        
      }else {
          this.$notify({
            title: this.$t("global.warn"),
            message: this.$t("global.itemread"),
            type: "warning"
          });
        }
    },
    writeT() {
      if (this.selectTableData.length != 0) {
        this.loading=true;
        let taskItems = [];
        this.selectTableData.forEach(item => {
          this.formThreshold.forEach(itemT=>{
            if(itemT.check){
              let keys = Object.keys(itemT);
              let formParam={}
                formParam={
                  attriFlag: 0,
                  attriId: 2,
                  classId: 1,
                  meterAsset: item.cisAssetNo,
                  obis: itemT.obis,
                  optType: 2,
                  pointId: item.attachMeterFlag,
                  terminalAddr: item.cisAssetNo,
                  tmnlAssetNo: item.cisAssetNo,
                }
              //根据参数值个数是单个还是多个，调取不同的接口
              if(Object.keys(itemT[keys[2]]).length===1){
                formParam.paramValue=itemT[keys[2]].data;
                this.isMultiple=0;
              }else{
                formParam[keys[2]]=itemT[keys[2]];
                this.isMultiple=1;
              }
              taskItems.push(formParam)
            }
          })
        })
        if(taskItems.length!=0){
          if(this.isMultiple===0){
            this.send(taskItems)
          }else{
            this.writeSend(taskItems);
          }
        }else{
          this.$notify({
            title: this.$t("global.warn"),
            message: this.$t("global.itemread"),
            type: "warning"
          });
        }
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
      readTask(val).then(res => {
        this.loading = false;
        this.taskItem = [];
        if (res.data.success) {
          res.data.data.forEach(item => {
            this.taskItem.push({
              tmnlAssetNo:item.tmnlAssetNo,
              name: item.meterAsset,
              taskId: item.taskId,
              optType: item.optType,
            });
          });
          this.paramData1=this.taskItem;
          this.$message({
            message: this.$t("global.operatorSuccess"),
            type: "success"
          });
          this.checkResult();
        }
      });
    },
    writeSend(val){
      setParam(val).then(res => {
        this.loading = false;
        this.taskItem = [];
        if (res.data.success) {
          res.data.data.forEach(item => {
            this.taskItem.push({
              tmnlAssetNo:item.tmnlAssetNo,
              name: item.meterAsset,
              taskId: item.taskId,
              optType: item.optType,
            });
          });
          this.paramData1=this.taskItem;
          this.$message({
            message: this.$t("global.operatorSuccess"),
            type: "success"
          });
          this.checkResult();
        }
      });
    },
    checkResult() {
      this.checkResultVisible = true;
      // this.loadingT = true;
      this.startTime();
      let a=0;
      let arr = [];
      if(this.active1=="1"){
        this.paramData1.forEach(item => {
         arr.push(item.taskId);
        });
      }
      checkResult({
        taskIds: arr,
        pageNum: this.queryT.page,
        pageSize: this.queryT.limit
      }).then(res => {
        this.tableData = [];
        this.totalT = res.data.data.count;
        res.data.data.items.forEach(item => {
          let param = {
            value:''
          };
          let value=[]
          if(item.taskStauts!=-1){
            a++;
          }
          if ("responseCodeItems" in item.responseDbDataItem) {
            value=item.responseDbDataItem.responseCodeItems
          }
          if(this.active1=="1"){
            this.paramData1.forEach(itemT => {
              if (itemT.taskId == item.taskId) {
                param.tmnlAssetNo=itemT.tmnlAssetNo;
                param.deviceName = itemT.name;
                param.errorCode = item.errorCode;
                param.optype={
                  optType: itemT.optType,
                }
                value.forEach((item)=>{
                  param.value+=(`${item.codeLabel}:${item.value}, \n `)
                })
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
    },
    // 精确查找
    searchDevice(val){
      this.searchValue=val;
      this.getData();
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
.el-row {
  margin-bottom: 5px;
}
.paramters {
  .el-tab-pane {
    overflow-y: auto;
    height: 250px;
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
      width: 136px;
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
      .single{
        display: flex;
        flex-wrap: wrap;
        li{
          margin-right: 30px;
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