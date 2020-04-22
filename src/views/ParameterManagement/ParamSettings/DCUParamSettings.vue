<template>
  <basic-container>
    <div class="paramters">
      <el-tabs v-model="active1" type="card">
        <el-tab-pane
          :label="$t('rtuparam.dcuParameters')"
          name="1"
          >
          <!-- <el-checkbox v-model="all">{{$t('rtuparam.selectAll')}}</el-checkbox> -->
          <div class="master">
            <div class="checkbox">
              <el-checkbox v-model="formGPRS[0].check">{{$t('rtuparam.master')}}</el-checkbox>
            </div>
            <el-row :gutter="20">
              <!-- <el-col :span="6">
                <span>{{$t('rtuparam.workMode')}}</span>
                <el-select v-model="masterParameters.workMode" style="width: 150px">
                  <el-option :label="$t('rtuparam.alwaysOnline')" value="1"></el-option>
                </el-select>
              </el-col> -->
              <!-- <el-col :span="6">
                <span>{{$t('rtuparam.flagMode')}}</span>
                <el-select
                  v-model="masterParameters.flagMode"
                  multiple
                  placeholder
                  style="width: 150px"
                >
                  <el-option label="SMS" value="1"></el-option>
                </el-select>
              </el-col> -->
              <el-col :span="6">
                <span>{{$t('rtuparam.ip')}}</span>
                <el-input v-model="formGPRS[0].paramGPRS.mainIp" style="width: 150px"></el-input>
              </el-col>
              <el-col :span="6">
                <span>{{$t('rtuparam.port')}}</span>
                <el-input v-model="formGPRS[0].paramGPRS.mainPort" style="width: 150px"></el-input>
              </el-col>
              <el-col :span="6">
                <span>{{$t('rtuparam.sIp')}}</span>
                <el-input v-model="formGPRS[0].paramGPRS.backupIp" style="width: 150px"></el-input>
              </el-col>
              <el-col :span="6">
                <span>{{$t('rtuparam.port')}}</span>
                <el-input v-model="formGPRS[0].paramGPRS.backupPort" style="width: 150px"></el-input>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              
              <el-col :span="6">
                <span>{{$t('rtuparam.apn')}}</span>
                <el-input v-model="formGPRS[0].paramGPRS.apn" style="width: 150px"></el-input>
              </el-col>
              <el-col :span="6">
                <span>{{$t('rtuparam.apnuser')}}</span>
                <el-input v-model="formGPRS[0].paramGPRS.apnUserName" style="width: 150px"></el-input>
              </el-col>
              <el-col :span="6">
                <span>{{$t('rtuparam.apnpass')}}</span>
                <el-input v-model="formGPRS[0].paramGPRS.apnPassWord" style="width: 150px"></el-input>
              </el-col>
              <el-col :span="6">
                <span>{{$t('rtuparam.apnnum')}}</span>
                <el-input v-model="formGPRS[0].paramGPRS.apnNumber" style="width: 150px"></el-input>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              
              <el-col :span="6">
                <span>{{$t('rtuparam.retime')}}</span>
                <el-input v-model="formGPRS[0].paramGPRS.retryNo" style="width: 150px"></el-input>
              </el-col>
              <el-col :span="6">
                <span>{{$t('rtuparam.reinterval')}}</span>
                <el-input v-model="formGPRS[0].paramGPRS.retryInt" style="width: 150px"></el-input>
              </el-col>
              <el-col :span="6">
                <span>{{$t('rtuparam.heartinterval')}}</span>
                <el-input v-model="formGPRS[0].paramGPRS.heartInt" style="width: 150px"></el-input>
              </el-col>
            </el-row>
          </div>
          <div class="secondary">
            <div class="checkbox">
              <el-checkbox v-model="formGPRS[1].check">{{$t('rtuparam.secondary')}}</el-checkbox>
            </div>
            <el-row :gutter="20">
              <!-- <el-col :span="6">
                <span>{{$t('rtuparam.workMode')}}</span>
                <el-select v-model="secondaryParameters.workMode" style="width: 150px">
                  <el-option :label="$t('rtuparam.alwaysOnline')" value="1"></el-option>
                </el-select>
              </el-col> -->
              <!-- <el-col :span="6">
                <span>{{$t('rtuparam.flagMode')}}</span>
                <el-select
                  v-model="secondaryParameters.flagMode"
                  multiple
                  placeholder
                  style="width: 150px"
                >
                  <el-option label="SMS" value="1"></el-option>
                </el-select>
              </el-col> -->
              <el-col :span="6">
                <span>{{$t('rtuparam.ip')}}</span>
                <el-input v-model="formGPRS[1].paramGPRS.mainIp" style="width: 150px"></el-input>
              </el-col>
              <el-col :span="6">
                <span>Port</span>
                <el-input v-model="formGPRS[1].paramGPRS.mainPort" style="width: 150px"></el-input>
              </el-col>
              <el-col :span="6">
                <span>{{$t('rtuparam.sIp')}}</span>
                <el-input v-model="formGPRS[1].paramGPRS.backupIp" style="width: 150px"></el-input>
              </el-col>
              <el-col :span="6">
                <span>Port</span>
                <el-input v-model="formGPRS[1].paramGPRS.backupPort" style="width: 150px"></el-input>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              
              <el-col :span="6">
                <span>{{$t('rtuparam.apn')}}</span>
                <el-input v-model="formGPRS[1].paramGPRS.apn" style="width: 150px"></el-input>
              </el-col>
              <el-col :span="6">
                <span>{{$t('rtuparam.apnuser')}}</span>
                <el-input v-model="formGPRS[1].paramGPRS.apnUserName" style="width: 150px"></el-input>
              </el-col>
              <el-col :span="6">
                <span>{{$t('rtuparam.apnpass')}}</span>
                <el-input v-model="formGPRS[1].paramGPRS.apnPassWord	" style="width: 150px"></el-input>
              </el-col>
              <el-col :span="6">
                <span>{{$t('rtuparam.apnnum')}}</span>
                <el-input v-model="formGPRS[1].paramGPRS.apnNumber" style="width: 150px"></el-input>
              </el-col>
            </el-row>
            <el-row :gutter="20"> 
              <el-col :span="6">
                <span>{{$t('rtuparam.retime')}}</span>
                <el-input v-model="formGPRS[1].paramGPRS.retryNo" style="width: 150px"></el-input>
              </el-col>
              <el-col :span="6">
                <span>{{$t('rtuparam.reinterval')}}</span>
                <el-input v-model="formGPRS[1].paramGPRS.retryInt" style="width: 150px"></el-input>
              </el-col>
              <el-col :span="6">
                <span>{{$t('rtuparam.heartinterval')}}</span>
                <el-input v-model="formGPRS[1].paramGPRS.heartInt" style="width: 150px"></el-input>
              </el-col>
            </el-row>
          </div>
          
        </el-tab-pane>
        <el-tab-pane name="2" :label="$t('rtuparam.thsetting')">
          <div class="third-floor">
            <div class="reset">
              <div class="checkbox">
                <el-checkbox v-model="formThreshold[0].check">{{$t('rtuparam.dcuAutoResetTime')}}</el-checkbox>
              </div>
              <ul>
                <li>
                  <span>{{$t('rtuparam.autoReset')}}</span>
                  <el-select v-model="formThreshold[0].paramAutoReset.benabel" placeholder="" style="width: 150px">
                    <el-option label="YES" value="1"></el-option>
                    <el-option label="No" value="0"></el-option>
                  </el-select>
                </li>
                <li>
                  <span>{{$t('rtuparam.resetinter')}}</span>
                  <el-input v-model="formThreshold[0].paramAutoReset.intervalTime" style="width: 150px"></el-input>
                </li>
                <li>
                  <span>{{$t('rtuparam.resettime')}}</span>
                  <el-time-picker
                    v-model="formThreshold[0].paramAutoReset.autoTime"
                    placeholder
                    style="width:150px;"
                    value-format="HH:mm:ss"
                  ></el-time-picker>
                </li>
              </ul>
            </div>
            <div class="signal">
              <div class="checkbox">
                <el-checkbox v-model="formThreshold[1].check">{{$t('rtuparam.network')}}</el-checkbox>
              </div>
              <ul>
                <li>
                  <span>{{$t('rtuparam.signal')}}</span>
                  <el-input v-model="formThreshold[1].paramSignal.signalValue" style="width: 150px"></el-input>
                </li>
                <li>
                  <span>{{$t('rtuparam.lastminute')}}</span>
                  <el-input v-model="formThreshold[1].paramSignal.keepMinute" style="width: 150px"></el-input>
                </li>
              </ul>
            </div>
          </div>
          <div class="third-floor">
            <div class="signal">
              <ul>
                <li>
                  <el-checkbox v-model="formThreshold[2].check" >{{$t('rtuparam.overthreshold')}}</el-checkbox>
                  <el-input style="width: 130px" v-model="formThreshold[2].data.data"></el-input>
                </li>
                <li>
                  <el-checkbox v-model="formThreshold[3].check" >{{$t('rtuparam.pclnode')}}</el-checkbox>
                  <el-input style="width: 130px" v-model="formThreshold[3].data.data"></el-input>
                </li>
              </ul>
            </div>
            <div class="signal">
              <div class="checkbox">
                <el-checkbox v-model="formThreshold[4].check">{{$t('rtuparam.pclrouter')}}</el-checkbox>
              </div>
              <ul>
                <li>
                  <span style="width:200px;">{{$t('rtuparam.commquality')}}</span>
                  <el-input style="width: 130px" v-model="formThreshold[4].paramPlcMod.commQuality"></el-input>
                </li>
                <li>
                  <span style="width:200px;">{{$t('rtuparam.repoarinterval')}}</span>
                  <el-input style="width: 130px" v-model="formThreshold[4].paramPlcMod.reportInt"></el-input>
                </li>
              </ul>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane name="3" label="Others">
          <div class="third-floor">
            <div class="reset">
              <div class="checkbox">
                <span>Version Number</span>
              </div>
              <ul class="ohtercss">
                <li >
                  <el-checkbox v-model="formOthers[0].check" style="width: 230px">{{$t('rtuparam.dcuhard')}}</el-checkbox>
                </li>
                <li>
                  <el-checkbox v-model="formOthers[1].check" style="width: 230px">{{$t('rtuparam.dcusoft')}}</el-checkbox>
                </li>
                <li>
                  <el-checkbox v-model="formOthers[2].check" style="width: 230px">4G/NB ModuleSMI-iccid</el-checkbox>
                </li>
              </ul>
            </div>
          </div>
          
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="uni-cast">
      <!-- <el-tabs v-model="active2" type="card">
        <el-tab-pane :label="$t('rtuparam.uniCast')" name="Uni-cast" style="padding: 0 10px"> -->
          <div class="content">
            <div class="head">
              {{$t('rtuparam.dcuList')}}
              <div class="operate">
                <!-- 搜索条件组件 -->
                <searchForm @searchFun="searchDevice" :isType="1"></searchForm>
                <span @click="readFun">
                  <img src="img/read.png" alt />
                  {{$t('global.read')}}
                </span>
                <span @click="writeFun" v-show="active1!='3'">
                  <img src="img/write.png" alt />
                  {{$t('global.write')}}
                </span>
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
        <!-- </el-tab-pane>
      </el-tabs> -->
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
      active2: "Uni-cast",
      formGPRS:[
        {
          check:false,
          obis:'0.0.25.4.128.255',
          paramGPRS:{
            workType: "1",
            workSign: "0",
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
        {
          check:false,
          obis:'0.0.25.4.129.255',
          paramGPRS:{
            workType: "1",
            workSign: "0",
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
        }
      ],
      formThreshold:[
        {
          check:false,
          obis:'0.0.96.50.1.255',
          paramAutoReset:{
            benabel: "",
            intervalTime: "",
            autoTime: ""
          }
        },
        {
          obis:'0.0.96.50.2.255',
          check:false,
          paramSignal:{
            signalValue: "",
            keepMinute: "",
          }
        },
        {
          obis:'1.0.96.57.20.255',
          check:false,
          data:{
            data: "",
          }
        },
        {
          obis:'1.0.96.50.3.255',
          check:false,
          data:{
            data: "",
          }
        },
        {
          obis:'1.0.96.50.4.255',
          check:false,
          paramPlcMod:{
            commQuality: "",
            reportInt: "",
          }
        },

      ],
      formOthers:[
        {
          obis:'0.0.96.1.8.255',
          check:false,
        },
        {
          obis:'0.0.96.1.9.255',
          check:false,
        },
        {
          obis:'0.0.96.99.0.255',
          check:false,
        },
      ],
      tableData:[],
      basicdata:[],
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
      queryT: {
        page: 1,
        limit: 9999
      },
      selectTableData:[],
      checkResultVisible: false,
      searchValue:{
        factoryCode:-1,
        serachValue:""
      },
      loading:false,
      loadingT:false,
      isMultiple:0,  //0 是单个参数  1是多个参数
      resultTableData: [],
      tableHeight:window.innerHeight - 620,
      isTimer:'', //定时器名称
      isDirect:0,  //0 4g从dcu读  1 meter从dcu读  2meter从meter读
      proNum:0,
      options:[], //过滤参数
      dcuParamA:[],
      dcuParamB:[],
      dcuParamC:[],
      codeList:{
        'S0A16001':'rtuparam.autoreset',
        'S0A16002':'rtuparam.resetinter',
        'S0A16003':'rtuparam.resettime',
        'S0A17001':'rtuparam.signal',
        'S0A17002':'rtuparam.lastminute',
        'S22011':'rtuparam.dcuhard',
        'S0AFB001':'rtuparam.dcusoft',
        'S0A2A001':'rtuparam.sim1',
        'S0A2A002':'rtuparam.sim2',
        'S0A14003':'rtuparam.ip',
        'S0A14004':'rtuparam.port',
        'S0A14005':'rtuparam.sIp',
        'S0A14006':'rtuparam.port',
        'S0A1400E':'rtuparam.apn',
        'S0A1400F':'rtuparam.apnuser',
        'S0A14010':'rtuparam.apnpass',
        'S0A14011':'rtuparam.apnnum',
        'S0A14012':'rtuparam.retime',
        'S0A14013':'rtuparam.reinterval',
        'S0A14014':'rtuparam.heartinterval', 
        'S0A15003':'rtuparam.ip',
        'S0A15004':'rtuparam.port',
        'S0A15005':'rtuparam.sIp',
        'S0A15006':'rtuparam.port',
        'S0A1500E':'rtuparam.apn',
        'S0A1500F':'rtuparam.apnuser',
        'S0A15010':'rtuparam.apnpass',
        'S0A15011':'rtuparam.apnnum',
        'S0A15012':'rtuparam.retime',
        'S0A15013':'rtuparam.reinterval',
        'S0A15014':'rtuparam.heartinterval', 
        'S0A18001':'rtuparam.overthreshold',
        'S0A19001':'rtuparam.pclnode',
        'S0A29001':'rtuparam.commquality',
        'S0A29002':'rtuparam.repoarinterval',
      }
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
    this.getView();
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
        if(res.data.data.total!=0){
          this.basicdata = res.data.data.list;
          this.total=res.data.data.total;
        }else{
          this.basicdata = []
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
    selectFun(val){
      this.selectTableData = val;
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
      }else if(this.active1=="3"){
        this.readF();
      }
    },
    // 读gprs参数
    read() {
      if (this.selectTableData.length != 0) {
        let taskItems = [];
        this.selectTableData.forEach(item => {
          this.formGPRS.forEach(itemT=>{
            if(itemT.check){
              taskItems.push({
                attriFlag: 0,
                attriId: 2,
                classId: 1,
                meterAsset: item.cisAssetNo,
                obis: itemT.obis,
                optType: 1,
                pointId: item.attachMeterFlag,
                terminalAddr: item.cisAssetNo,
                tmnlAssetNo: item.cisAssetNo
              })
            }
          })
        })
        if(taskItems.length!=0){
          this.loading=true;
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
    // 读阈值相关
    readT() {
      if (this.selectTableData.length != 0) {
        let taskItems = [];
        this.selectTableData.forEach(item => {
          this.formThreshold.forEach(itemT=>{
            if(itemT.check){
              if(itemT.obis=='1.0.96.57.20.255'){
                taskItems.push({
                  attriFlag: 0,
                  attriId: 2,
                  classId: 3,
                  meterAsset: item.cisAssetNo,
                  obis: itemT.obis,
                  optType: 1,
                  pointId: item.attachMeterFlag,
                  terminalAddr: item.cisAssetNo,
                  tmnlAssetNo: item.cisAssetNo
                })
              }else{
                taskItems.push({
                  attriFlag: 0,
                  attriId: 2,
                  classId: 1,
                  meterAsset: item.cisAssetNo,
                  obis: itemT.obis,
                  optType: 1,
                  pointId: item.attachMeterFlag,
                  terminalAddr: item.cisAssetNo,
                  tmnlAssetNo: item.cisAssetNo
                })
              }
            }
          })
        })
        if(taskItems.length!=0){
          this.loading=true;
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
    // 读版本号
    readF(){
      if (this.selectTableData.length != 0) {
        
        let taskItems = [];
        this.selectTableData.forEach(item => {
          this.formOthers.forEach(itemT=>{
            if(itemT.check){
              taskItems.push({
                attriFlag: 0,
                attriId: 2,
                classId: 1,
                meterAsset: item.cisAssetNo,
                obis: itemT.obis,
                optType: 1,
                pointId: item.attachMeterFlag,
                terminalAddr: item.cisAssetNo,
                tmnlAssetNo: item.cisAssetNo
              })
            }
          })
        })
        if(taskItems.length!=0){
          this.loading=true;
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
      }else if(this.active1=="2"){
        this.writeT()
      }
    },
    write() {
      if (this.selectTableData.length != 0) {
        this.loading=true;
        let taskItems = [];
        this.selectTableData.forEach(item => {
          this.formGPRS.forEach(itemT=>{
            let keys = Object.keys(itemT);
            let formParam={
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
            formParam[keys[2]]=itemT[keys[2]]
            if(itemT.check){
              taskItems.push(formParam)
            }
          })
        })
        if(taskItems.length!=0){
          this.writeSend(taskItems);
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
              if(itemT.obis==='1.0.96.57.20.255'){
                formParam={
                  attriFlag: 0,
                  attriId: 2,
                  classId: 3,
                  meterAsset: item.cisAssetNo,
                  obis: itemT.obis,
                  optType: 2,
                  pointId: item.attachMeterFlag,
                  terminalAddr: item.cisAssetNo,
                  tmnlAssetNo: item.cisAssetNo,
                }
              }else{
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
              }
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
            // sessionStorage.setItem("gprsData", JSON.stringify(this.taskItem));
            this.dcuParamA=this.taskItem;
          }else if(this.active1=="2"){
            this.dcuParamB=this.taskItem;
            // sessionStorage.setItem("thresholdData", JSON.stringify(this.taskItem));
          }else if(this.active1=="3"){
            this.dcuParamC=this.taskItem;
            // sessionStorage.setItem("othersData", JSON.stringify(this.taskItem));
          }
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
              name: item.meterAsset,
              taskId: item.taskId,
              optType: item.optType,
            });
          });
          if(this.active1=="1"){
            this.dcuParamA=this.taskItem;
            // sessionStorage.setItem("gprsData", JSON.stringify(this.taskItem));
          }else if(this.active1=="2"){
            this.dcuParamB=this.taskItem;
            // sessionStorage.setItem("thresholdData", JSON.stringify(this.taskItem));
          }else if(this.active1=="3"){
            this.dcuParamC=this.taskItem;
            // sessionStorage.setItem("othersData", JSON.stringify(this.taskItem));
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
      if(this.dcuParamA.length!=0||this.dcuParamB.length!=0||this.dcuParamC.length!=0){
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
        }else if(this.active1=="3"){
          this.dcuParamC.forEach(item => {
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
              this.dcuParamA.forEach(itemT => {
                if (itemT.taskId == item.taskId) {
                  param.deviceName = itemT.name;
                  param.errorCode = item.errorCode;
                  param.recTime=item.recTime
                  param.optype={
                    optType: itemT.optType,
                  }
                  for(let i in this.codeList){
                    value.forEach((item)=>{
                      if(item.code==i){
                          param.value+=(`${this.$t(this.codeList[i])}:${item.value}, \n `)
                      }
                    })
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
                  for(let i in this.codeList){
                    value.forEach((item)=>{
                       if(item.code==i){
                          param.value+=(`${this.$t(this.codeList[i])}:${item.value}, \n `)
                      }
                    })
                  }
                }
                
              });
              
            }else if(this.active1=="3"){
              this.dcuParamC.forEach(itemT => {
                if (itemT.taskId == item.taskId) {
                  param.deviceName = itemT.name;
                  param.errorCode = item.errorCode;
                  param.recTime=item.recTime
                  param.optype={
                    optType: itemT.optType,
                  }
                  for(let i in this.codeList){
                    value.forEach((item)=>{
                      if(item.code==i){
                          param.value+=(`${this.$t(this.codeList[i])}:${item.value}, \n `)
                      }
                    })
                  }
                }
              });
            }
            this.tableData.push(param);
            // this.loadingT = false;
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
        flex-wrap: wrap;
        // height: 40px;
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