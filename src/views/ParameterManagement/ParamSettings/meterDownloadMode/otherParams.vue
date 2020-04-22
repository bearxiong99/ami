<template>
  <div>
    <div class="select">
      <el-checkbox :indeterminate="isIndeterminate" v-model="checkedAll" @change="checkAll" class="all">{{$t('global.selectall')}}</el-checkbox>
      <el-checkbox-group v-model="checked" @change="check" class="group">
        <el-checkbox :label="1">
          <span>EOB single action schedule/execution_time</span>
          <el-date-picker
            v-model="date"
            type="date"
            style="width:200px;margin-right:20px">
          </el-date-picker>
          <el-time-picker
            v-model="time"
            style="width:200px">
          </el-time-picker>
        </el-checkbox>
        <el-checkbox :label="2">
          <span>Load profile interval(min)</span>
          <el-input v-model="interval" style="width:200px"></el-input>
        </el-checkbox>
      </el-checkbox-group>
    </div>


    <div class="content">
      <div class="table">
        <div class="table-head">
          {{$t('clock.meterList')}}
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
            <span @click="activeNow" style="cursor:pointer">
              <img src="img/Immediateactivate.png" alt />
              {{$t('upgrade.immediateactivate')}}
            </span>
            <span @click="activeDialog" style="cursor:pointer">
              <img src="img/Scheduleactivate.png" alt />
              {{$t('upgrade.scheduleactivate')}}
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
        <el-table-column prop="deviceName" :label="$t('clock.deviceName')"></el-table-column>
        <el-table-column prop="optype" :label="$t('upgrade.operType')">
          <template slot-scope="scope">{{ changeOpt(scope.row.optype) }}</template>
        </el-table-column>
        <el-table-column prop="errorCode" :label="$t('clock.status')"></el-table-column>
        <el-table-column prop="recTime" :label="$t('global.dataresponse')" width="180"></el-table-column>
        <el-table-column prop="value" :label="$t('systemparam.val')">
          <!-- <template slot-scope="scope">{{ formatTimes(scope.row.value) }}</template> -->
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { readTask, checkResult } from "@/api/clock";
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
  components:{Pagination,meterTable,searchForm,progressCom},
  data () {
    return {
      checked: [],
      basicdata:[],
      selectTableData:[],
      resultTableData:[],
      tableData:[],
      checkedAll: false,
      isIndeterminate: false,
      date: new Date(),
      time: new Date(),
      interval: '',
      checkResultVisible:false,
      loading:false,
      loadingT:false,
      params:{
        value1:1,
        value2:1,
        value3:'',
      },
      query:{
        page: 1,
        limit: 20
      },
      queryT:{
        page: 1,
        limit: 9999
      },
      total:0,
      searchForm:{
        name:[]
      },
      searchValue:{
        factoryCode: -1,  //厂家类型
        type:-1, //电表类型或者集中器类型
        serachValue:"" //电表或者集中器逻辑设备名
      },
      tableHeight:window.innerHeight - 610,
      successNum:0,  //查询结果返回状态的累计数量
      isTimer:'', //定时器名称
      proNum:0, //进度
      paramValue:{},
      rate:{},
      options:[], //过滤参数
    };
  },
  computed: {
    ...mapGetters(["treeNode", "colorName"])
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
  mounted(){
    window.onresize = ()=>{
      this.tableHeight=window.innerHeight - 610;
    }
  },
  methods:{
    isNull(arg1){
      return !arg1 && arg1!==0 && typeof arg1!=="boolean"?true:false;
    },
    checkAll(val) {
      this.checked = val ? [1, 2] : [];
      this.isIndeterminate = false;
    },
    check(val) {
      let length = val.length;
      this.checkedAll = length === 2;
      this.isIndeterminate = length > 0 && length < 2;
    },
    getData(){
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
    //选择数据
    selectFun(val) {
      this.selectTableData = val;
    },
    read () {
      if(this.selectTableData.length!=0){
        if(this.checked.length!=0){
          this.loading=true;
          let taskItems = [];
          let arr=[];
          this.checked.forEach((item)=>{
            arr.push(this.obisList[item-1])
          })
          this.selectTableData.forEach(item => {
            arr.forEach(itemT=>{
              taskItems.push({
                attriFlag: 0,
                attriId: 2,
                classId: 1,
                meterAsset: item.commAddr1,
                obis: itemT,
                pointId: item.mpSn,
                terminalAddr: item.terminalAddr,
                tmnlAssetNo: item.etmnlassetNo,
              });
            })
          });
          console.log(taskItems)
          // this.send(taskItems);
        }else{
          this.$notify({
            title: this.$t("global.warn"),
            message: this.$t("global.itemread"),
            type: "warning"
          });
        }
      }else{
        this.$notify({
          title: this.$t("global.warn"),
          message: this.$t("global.warncont"),
          type: "warning"
        });
      }
    },
    write(){
      if(this.selectTableData.length!=0){
        this.loading=true;
        let taskItems = [];
        let arr=[];
        this.checked.forEach((item)=>{
          arr.push(this.obisList[item-1])
        })
        this.selectTableData.forEach(item => {
          arr.forEach(itemT=>{
            taskItems.push({
              attriFlag: 0,
              attriId: 2,
              classId: 1,
              meterAsset: item.commAddr1,
              obis: itemT,
              pointId: item.mpSn,
              terminalAddr: item.terminalAddr,
              tmnlAssetNo: item.etmnlassetNo,
            });
          })
        });
        this.send(taskItems);
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
      readTask(val).then(res => {
        this.taskItem=[]
        this.loading=false;
        if (res.data.success) {
          res.data.data.forEach((item,index) => {
            this.taskItem.push({
              name:item.meterAsset,
              taskId:item.taskId
            });
          });
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
            this.taskItem.forEach(itemT=>{
              if(itemT.taskId==item.taskId){
                param.deviceName=itemT.name
                param.errorCode=item.errorCode,
                param.recTime=item.recTime
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
    },
    activeNow(){},
    activeDialog(){},
    // 精准查找操作
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
    // 精准查找操作
    searchDevice(val){
      this.searchValue=val;
      this.getData();
    },
    changeOpt(val){
      if (val.optType == 1) {
        return this.$t('global.read')
      } else {
        return this.$t('global.write')
      }
    },
  }
}
</script>
<style lang='scss' scoped>
.select {
  position: relative;
  margin-top: 20px;
  padding: 20px 25px 0;
  border: 1px solid #ddd;
  box-sizing: border-box;
  height: 220px;
  .all {
    position: absolute;
    top: -12px;
    left: 20px;
    padding: 0 5px;
    background-color: #fff;
    box-sizing: border-box;
  }
  .group {
    display: flex;
    flex-direction: column;
    .el-checkbox {
      margin-bottom: 20px;
      span {
        display: inline-block;
        width: 300px;
      }
    }
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
</style>