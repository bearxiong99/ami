<template>
  <basic-container>
    <el-tabs v-model="active" type="card">
      <el-tab-pane :label="$t('alarm.dcuAlarm')" name="dcu">
        <el-form :inline="true" :model="dcuParams" label-position="left">
          <el-form-item :label="$t('alarm.alarmName')">
            <el-select v-model="dcuParams.eventCode" size="small" multiple collapse-tags style="width:220px;">
              <el-option :label="ele.eventName" :value="ele.eventNo" v-for="(ele, i) in nameArr1" :key="i"></el-option>
            </el-select>
          </el-form-item>
        <el-form-item :label="$t('clock.deviceName')">
          <el-input v-model="dcuParams.deviceName"></el-input>
        </el-form-item>
        <el-form-item :label="$t('change.manufacturer')">
          <el-select v-model="dcuParams.factoryCode" size="small" style="width:100%">
            <el-option :label="$t('global.all')" :value="''"></el-option>
            <el-option :label="ele.typeName" :value="ele.typeCode" v-for="(ele, i) in tmnlFactoryList" :key="i"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('alarm.dealStatus')">
            <el-select v-model="dcuParams.alarmStatus" size="small" collapse-tags>
              <el-option :label="$t('alarm.unConfirmed')" value="01"  ></el-option>
              <el-option :label="$t('alarm.confirmed')" value="02"  ></el-option>
            </el-select>
        </el-form-item>
          <el-form-item :label="$t('global.from')">
            <el-date-picker
              v-model="dcuTime.time1"
              type="date"
              size="small"
              :clearable="false"
              :editable="false"
              style="width:150px">
            </el-date-picker>
          </el-form-item>
          <el-form-item :label="$t('global.to')">
            <el-date-picker
              v-model="dcuTime.time2"
              type="date"
              size="small"
              :clearable="false"
              :editable="false"
              style="width:150px">
            </el-date-picker>
          </el-form-item>
          <!-- <el-form-item :label="$t('alarm.dealStatus')">
            <el-select v-model="dcuParams.status" size="small">
            </el-select>
          </el-form-item> -->
          <el-form-item>
            <el-button type="primary" @click="searchDCU" size="small">{{$t('global.search')}}</el-button>
          </el-form-item>
        </el-form>
        <div class="uptop">
          <div>{{$t('alarm.alarmHistory')}}</div>
          <div class="right">
            <span @click="exportExcel1"
            style="cursor:pointer">
              <img src="img/export.png" alt />
              {{$t('global.export')}}
            </span>
            <!-- <span @click="deal1"
            style="cursor:pointer">
              <img src="img/edit.png" alt />
              {{$t('alarm.dealNow')}}
            </span> -->
          </div>
        </div>
        <el-table
          :data="tableData1"
          border
          :header-cell-style="{background:'#F2F2F2',color:'rgb(51,51,51)'}"
          :height="tableHeight"
          v-loading="loading1"
        >
          <el-table-column :label="$t('change.no')" width="50">
            <template
              slot-scope="scope"
            >{{ dcuParams.size * (dcuParams.current - 1) + scope.$index + 1 }}</template>
          </el-table-column>
          <el-table-column :label="$t('auto.deviceName')" prop="terminalAddr">
          </el-table-column>
          <el-table-column :label="$t('change.manufacturer')" prop="factoryCode" :formatter="tmnlFactoryFormat">
          </el-table-column>
          <el-table-column :label="$t('areaManage.terminaltype')" prop="terminalTypeCode" :formatter="tmnlTypeFormat">
          </el-table-column>
          <el-table-column :label="$t('alarm.name')" prop="eventName">
          </el-table-column>
          <el-table-column :label="$t('alarm.time')" prop="dataTime">
          </el-table-column>
          <el-table-column :label="$t('alarm.reportTime')" prop="recTime">
          </el-table-column>
          <el-table-column :label="$t('alarm.alarmOperator')" prop="operatorAccount">
          </el-table-column>
          <el-table-column :label="$t('alarm.processStatus')" prop="alarmStatus">
            <template slot-scope="scope"> {{changeAlarmStatus(scope.row.alarmStatus)}}</template>
          </el-table-column>
          <!-- <el-table-column :label="$t('alarm.processTime')" prop="processTime">
          </el-table-column>
          <el-table-column :label="$t('alarm.processResult')" prop="processResult">
          </el-table-column> -->
        </el-table>
        <pagination
          :total="total1"
          :page.sync="dcuParams.current"
          :limit.sync="dcuParams.size"
          @pagination="searchDCU"
          style="margin-top:-1px"
        />
      </el-tab-pane>
      <el-tab-pane :label="$t('alarm.meterAlarm')" name="meter">
        <el-form :inline="true" :model="meterParams" label-position="left">
          <el-form-item :label="$t('alarm.alarmName')">
            <el-select v-model="meterParams.eventCode" size="small" multiple collapse-tags>
              <el-option :label="ele.eventName" :value="ele.eventNo" v-for="(ele, i) in nameArr2" :key="i"></el-option>
            </el-select>
          </el-form-item>
        <el-form-item :label="$t('clock.deviceName')">
          <el-input v-model="meterParams.deviceName"></el-input>
        </el-form-item>
        <el-form-item :label="$t('change.manufacturer')">
          <el-select v-model="meterParams.factoryCode" size="small" style="width:100%">
            <el-option :label="$t('global.all')" :value="''"></el-option>
            <el-option :label="ele.typeName" :value="ele.typeCode" v-for="(ele, i) in meterFactoryList" :key="i"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('alarm.dealStatus')">
            <el-select v-model="meterParams.alarmStatus" size="small" collapse-tags>
              <el-option :label="$t('alarm.unConfirmed')" value="01"  ></el-option>
              <el-option :label="$t('alarm.confirmed')" value="02"  ></el-option>
            </el-select>
        </el-form-item>
          <el-form-item :label="$t('global.from')">
            <el-date-picker
              v-model="meterTime.time1"
              type="date"
              size="small"
              :clearable="false"
              :editable="false"
              style="width:150px">
            </el-date-picker>
          </el-form-item>
          <el-form-item :label="$t('global.to')">
            <el-date-picker
              v-model="meterTime.time2"
              type="date"
              size="small"
              :clearable="false"
              :editable="false"
              style="width:150px">
            </el-date-picker>
          </el-form-item>
          <!-- <el-form-item :label="$t('alarm.dealStatus')">
            <el-select v-model="meterParams.status" size="small">
            </el-select>
          </el-form-item> -->
          <el-form-item>
            <el-button type="primary" @click="searchMeter" size="small">{{$t('global.search')}}</el-button>
          </el-form-item>
        </el-form>
        <div class="uptop">
          <div>{{$t('alarm.alarmHistory')}}</div>
          <div class="right">
            <span @click="exportExcel2"
            style="cursor:pointer">
              <img src="img/export.png" alt />
              {{$t('global.export')}}
            </span>
            <!-- <span @click="deal2"
            style="cursor:pointer">
              <img src="img/edit.png" alt />
              {{$t('alarm.dealNow')}}
            </span> -->
          </div>
        </div>
        <el-table
          :data="tableData2"
          border
          :header-cell-style="{background:'#F2F2F2',color:'rgb(51,51,51)'}"
          :height="tableHeight"
          v-loading="loading2"
        >
          <el-table-column :label="$t('change.no')" width="50">
            <template
              slot-scope="scope"
            >{{ meterParams.size * (meterParams.current - 1) + scope.$index + 1 }}</template>
          </el-table-column>
          <el-table-column :label="$t('auto.deviceName')" prop="commAddr">
          </el-table-column>
          <el-table-column :label="$t('change.manufacturer')" prop="factoryCode" :formatter="meterFactoryFormat">
          </el-table-column>
          <el-table-column :label="$t('global.meterType')" prop="meterTypeCode" :formatter="meterTypeFormat">
          </el-table-column>
          <el-table-column :label="$t('alarm.name')" prop="eventName">
          </el-table-column>
          <el-table-column :label="$t('alarm.time')" prop="dataTime">
          </el-table-column>
          <el-table-column :label="$t('alarm.reportTime')" prop="recTime">
          </el-table-column>
          <el-table-column :label="$t('alarm.alarmOperator')" prop="operatorAccount">
          </el-table-column>
          <el-table-column :label="$t('alarm.processStatus')" prop="alarmStatus">
            <template slot-scope="scope"> {{changeAlarmStatus(scope.row.alarmStatus)}}</template>
          </el-table-column>
        
          <!-- <el-table-column :label="$t('alarm.processTime')" prop="processTime">
          </el-table-column>
         
          <el-table-column :label="$t('alarm.processResult')" prop="processResult">
          </el-table-column> -->
        </el-table>
        <pagination
          :total="total2"
          :page.sync="meterParams.current"
          :limit.sync="meterParams.size"
          @pagination="searchMeter"
          style="margin-top:-1px"
        />
      </el-tab-pane>
    </el-tabs>
    <export-btn :dialogVisible="dialogVisible" :exportData="exportData"  @changeDialog="changeDialog" />
    <!-- <el-dialog
      :title="$t('global.tip')"
      :visible.sync="dialogShow"
      width="36%"
      :before-close="dialogClose">
      <el-form ref="form" :model="dialogForm" label-width="150px">
        <el-form-item :label="$t('meterevent.dealstatus')">
          <el-radio-group v-model="dialogForm.dealstatus">
            <el-radio label="2">{{$t('meterevent.unsolved')}}</el-radio>
            <el-radio label="1">{{$t('meterevent.processed')}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('meterevent.dealtime')">
          <el-date-picker
            v-model="dialogForm.time"
            type="datetime"
            size="small"
            :clearable="false"
            :editable="false">
          </el-date-picker>
        </el-form-item>
        <el-form-item :label="$t('meterevent.eventnote')">
          <el-input type="text" v-model="dialogForm.eventnote" disabled :maxlength="20"></el-input>
        </el-form-item>
        <el-form-item :label="$t('meterevent.dealresult')">
          <el-input type="textarea" rows="5" v-model="dialogForm.dealresult"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogShow = false" size="small">{{$t('global.cancel')}}</el-button>
        <el-button type="primary" @click="confirm" size="small">{{$t('global.yes')}}</el-button>
      </span>
    </el-dialog> -->
  </basic-container>
</template>

<script>
import Pagination from "@/components/Pagination"
import { getAlarmNames, getDCU, getMeter } from "@/api/alarm"
import { getViewList } from "@/api/autoRegister"
import exportBtn from "@/components/exportjs"
export default {
  components: {
    Pagination,
    exportBtn
  },
  data() {
    return {
      active: 'dcu',
      dcuParams: {
        // status: '',
        size: 20,
        current: 1,
        eventCode: [],
        deviceName: '',
        alarmStatus:'',
        factoryCode: ''
      },
      dcuTime: {
        time1: this.calcDate(new Date()),
        time2: new Date(),
      },
      meterTime: {
        time1: this.calcDate(new Date()),
        time2: new Date(),
      },
      meterParams: {
        alarmStatus:'',
        size: 20,
        current: 1,
        eventCode: [],
        deviceName: '',
        factoryCode: ''
      },
      total1: 0,
      total2: 0,
      tableData1: [],
      tableData2: [],
      tableHeight: window.innerHeight * 0.50,
      loading1: false,
      loading2: false,
      dialogShow: false,
      dialogForm: {
        dealstatus: '',
        time: new Date(),
        eventnote: JSON.parse(localStorage.getItem('saber-userInfo')).content.userName,
        dealresult: '',
      },
      nameArr1: [],
      nameArr2: [],
      tmnlFactoryList:[],
      meterFactoryList:[],
      tmnlTypeList:[],
      meterTypeList:[],
      dialogVisible: false,
      exportData:{}
    };
  },
  computed: {
    dcuStartTime () {
      return this.timeFormat(this.dcuTime.time1)
    },
    dcuEndTime () {
      return this.timeFormat(this.dcuTime.time2)
    },
    meterStartTime () {
      return this.timeFormat(this.meterTime.time1)
    },
    meterEndTime () {
      return this.timeFormat(this.meterTime.time2)
    },
  },
  mounted() {
    this.getView()
    this.getDCUName()
    this.getMeterName()
  },
  watch: {},
  methods: {
    calcDate (date) {
      return new Date(date.setTime(date.getTime() - 3600 * 1000 * 24 * 7))
    },
    changeAlarmStatus(code){
      if(code ==='01'){
        return this.$t('alarm.unConfirmed');
      }else if(code ==='02'){
        return this.$t('alarm.confirmed');
      }
    },
    getView() {
      getViewList({
        viewType: "TMNLFactoryType"
      }).then(res => {
        this.tmnlFactoryList = res.data.data.list
      })
      getViewList({
        viewType: "meterFactoryType"
      }).then(res => {
        this.meterFactoryList = res.data.data.list
      })
      getViewList({
        viewType: "tmnlType"
      }).then(res => {
        this.tmnlTypeList = res.data.data.list
      })
      getViewList({
        viewType: "meterType"
      }).then(res => {
        this.meterTypeList = res.data.data.list
      })
    },
    tmnlFactoryFormat (row) {
      let obj = this.tmnlFactoryList.find(ele => ele.typeCode === row.factoryCode)
      if (obj) {
        return obj.typeName
      } else {
        return row.factoryCode
      }
    },
    meterFactoryFormat (row) {
      let obj = this.meterFactoryList.find(ele => ele.typeCode === row.factoryCode)
      if (obj) {
        return obj.typeName
      } else {
        return row.factoryCode
      }
    },
    tmnlTypeFormat (row) {
      let obj = this.tmnlTypeList.find(ele => ele.typeCode === row.terminalTypeCode)
      if (obj) {
        return obj.typeName
      } else {
        return row.terminalTypeCode
      }
    },
    meterTypeFormat (row) {
      let obj = this.meterTypeList.find(ele => ele.typeCode === row.meterTypeCode)
      if (obj) {
        return obj.typeName
      } else {
        return row.meterTypeCode
      }
    },
    // changeFactory(val) {
    //   for(let i in this.tmnlFactoryList){
    //     if(Number(val)==Number(this.tmnlFactoryList[i].typeCode)){
    //       return  this.viewList[i].typeName
    //     }
    //   }
    // },
    // changeMeter(val){
    //   for(let i in this.meterFactoryList){
    //     if(Number(val)==Number(this.meterFactoryList[i].typeCode)){
    //       return  this.meterTypeList[i].typeName
    //     }
    //   }
    // },
    getDCUName () {
      getAlarmNames({
        eventType: 2
      }).then(res => {
        this.nameArr1 = res.data.data
      })
    },
    getMeterName () {
      getAlarmNames({
        eventType: 4
      }).then(res => {
        this.nameArr2 = res.data.data
      })
    },
    timeFormat(date) {
      return date.getFullYear() + '-' + (date.getMonth() + 1 + '').padStart(2, '0') + '-' + (date.getDate() + '').padStart(2, '0')
    },
    searchDCU () {
      if(this.dcuTime.time1.getTime() > this.dcuTime.time2.getTime()) {
        this.$message({
          type: "error",
          message: this.$t('auto.timeBug')
        })
        return
      }
      this.loading1 = true
      let obj = {
        startDateTime: this.dcuStartTime,
        endDateTime: this.dcuEndTime,
        current: this.dcuParams.current,
        size: this.dcuParams.size,
        terminalAddr: this.dcuParams.deviceName,
        alarmStatus:this.dcuParams.alarmStatus,
        factoryCode:this.dcuParams.factoryCode,
      }
      let str = ''
      Object.keys(obj).forEach(ele => {
        str += (ele + '=' + obj[ele] + '&')
      })
      if (this.dcuParams.eventCode.length > 0) {
        this.dcuParams.eventCode.forEach((ele, i) => {
          str += ('eventCodes=' + this.dcuParams.eventCode[i] + '&')
        })
      }
      str = str.substr(0, str.length - 1)
      console.log(str, 'str')
      getDCU(str).then(res => {
        if (res.data.success) {
          console.log(res);
          this.tableData1 = res.data.data.records
          this.total1 = res.data.data.total
        } else {
          this.$message({
            message: this.$t("global.searchFail"),
            type: "error"
          })
        }
        this.loading1 = false
      }).catch(() => {
        this.loading1 = false
      })
    },
    searchMeter () {
      if(this.meterTime.time1.getTime() > this.meterTime.time2.getTime()) {
        this.$message({
          type: "error",
          message: this.$t('auto.timeBug')
        })
        return
      }
      this.loading2 = true
      let obj = {
        startDateTime: this.meterStartTime,
        endDateTime: this.meterEndTime,
        current: this.meterParams.current,
        size: this.meterParams.size,
        alarmStatus:this.meterParams.alarmStatus,
        commAddr:this.meterParams.deviceName,
        factoryCode:this.meterParams.factoryCode,
      }
      let str = ''
      Object.keys(obj).forEach(ele => {
        str += (ele + '=' + obj[ele] + '&')
      })
      if (this.meterParams.eventCode.length > 0) {
        this.meterParams.eventCode.forEach((ele, i) => {
          str += ('eventCodes=' + this.meterParams.eventCode[i] + '&')
        })
      }
      str = str.substr(0, str.length - 1)
      getMeter(str).then(res => {
        if (res.data.success) {
          console.log(res.data.data);
          this.tableData2 = res.data.data.records
          this.total2 = res.data.data.total
        } else {
          this.$message({
            message: this.$t("global.searchFail"),
            type: "error"
          })
        }
        this.loading2 = false
      }).catch(() => {
        this.loading2 = false
      })
    },
    exportExcel1 () {
      let obj = {
        alarmStatus: this.dcuParams.alarmStatus,
        terminalAddr: this.dcuParams.deviceName,
        endDateTime: this.dcuEndTime,
        eventCodes: this.dcuParams.eventCode,
        limit: this.dcuParams.size,
        page: this.dcuParams.current,
        startDateTime: this.dcuStartTime,
        factoryCode: this.dcuParams.factoryCode
      }
      this.dialogVisible = true
      let columns = {
        terminalAddr:this.$t('auto.deviceName'),
        factoryCode:this.$t('change.manufacturer'),
        terminalTypeCode:this.$t('areaManage.terminaltype'),
        eventName:this.$t('alarm.name'),
        dataTime:this.$t('alarm.time'),
        recTime:this.$t('alarm.reportTime'),
        operatorAccount:this.$t('alarm.alarmOperator'),
        alarmStatus:this.$t('alarm.processStatus'),
      }
      this.exportData = {
        url: '/api/ami-monitor/emptmnlalarm/queryTmnlAlarm',
        params: obj,
        columns: columns,
        fileName: this.$t('alarm.dcuAlarm'),
        sheetName: this.$t('alarm.dcuAlarm'),
      }
    },
    exportExcel2 () {
      let obj = {
        alarmStatus: this.meterParams.alarmStatus,
        commAddr: this.meterParams.deviceName,
        endDateTime: this.meterEndTime,
        eventCodes: this.meterParams.eventCode,
        limit: this.meterParams.size,
        page: this.meterParams.current,
        startDateTime: this.meterStartTime,
        factoryCode: this.meterParams.factoryCode
      }
      this.dialogVisible = true
      let columns = {
        commAddr:this.$t('auto.deviceName'),
        factoryCode:this.$t('change.manufacturer'),
        meterTypeCode:this.$t('global.meterType'),
        eventName:this.$t('alarm.name'),
        dataTime:this.$t('alarm.time'),
        recTime:this.$t('alarm.reportTime'),
        operatorAccount:this.$t('alarm.alarmOperator'),
        alarmStatus:this.$t('alarm.processStatus'),
      }
      this.exportData = {
        url: '/api/ami-monitor/empmetalarm/queryMeterAlarm',
        params: obj,
        columns: columns,
        fileName: this.$t('alarm.meterAlarm'),
        sheetName: this.$t('alarm.meterAlarm'),
      }
    },
    changeDialog(val){
      this.dialogVisible = val
    },
    deal1 () {
      this.dialogShow = true
    },
    deal2 () {
      this.dialogShow = true
    },
    dialogClose () {
      this.$refs.form.resetFields()
      this.dialogShow = false
    },
    confirm () {

    },
  }
};
</script>

<style scoped lang="scss">
.uptop {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  border: 1px solid #dddddd;
  background: #eeeeee;
  span {
    display: flex;
    align-items: center;
    padding: 0 20px;
    border-left: 1px solid #dddddd;
  }
  img {
    margin-right: 10px;
    // margin-left: 20px;
  }
  .right {
    display: flex;
  }
}
.el-tabs {
  padding-bottom: 30px;
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
.el-form-item {
  /deep/ .el-form-item__label-wrap {
    margin-left: 0!important;
  }
}
</style>
