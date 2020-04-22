<template>
  <basic-container>
    <el-tabs v-model="active1" type="card">
      <el-tab-pane :label="$t('monitoring.readSuccRate')" name="1">
        <el-form :inline="true" :model="params" label-position="left">
          <el-form-item :label="$t('global.tmnlFactory')">
            <el-select v-model="params.tmnlFactoryCode" size="small">
              <el-option :label="$t('global.all')" :value="''"></el-option>
              <el-option :label="ele.typeName" :value="ele.typeCode" v-for="(ele, i) in tmnlFactoryList" :key="i"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('global.meterFactory')">
            <el-select v-model="params.metFactoryCode" size="small">
              <el-option :label="$t('global.all')" :value="''"></el-option>
              <el-option :label="ele.typeName" :value="ele.typeCode" v-for="(ele, i) in meterFactoryList" :key="i"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('global.from')">
            <el-date-picker
              v-model="params.time1"
              type="date"
              size="small"
              :clearable="false"
              :editable="false">
            </el-date-picker>
          </el-form-item>
          <el-form-item :label="$t('global.to')">
            <el-date-picker
              v-model="params.time2"
              type="date"
              size="small"
              :clearable="false"
              :editable="false">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="search" size="small">{{$t('global.search')}}</el-button>
          </el-form-item>
        </el-form>
        <!-- <div class="chart">
          <h3>{{$t('monitoring.successRate')}}</h3>
          <div id="bar"></div>
        </div> -->
        <div class="head">
          {{$t('monitoring.readSuccRate')}}
        </div>
        <el-table :data="tableData" border style="width: 100%" :height="tableHeight" :header-cell-style="{background:'#F2F2F2',color:'rgb(51,51,51)'}" v-loading="loading">
          <el-table-column :label="$t('change.no')">
            <template slot-scope="scope">{{ params.size * (params.current - 1) + scope.$index + 1 }}</template>
          </el-table-column>
          <el-table-column :label="$t('monitoring.orgName')" prop="orgName"></el-table-column>
          <el-table-column :label="$t('global.orgType')" prop="orgType" :formatter="orgTypeFormatter"></el-table-column>
          <el-table-column :label="$t('global.statDate')" prop="statDate"></el-table-column>
          <el-table-column :label="$t('global.tmnlFactory')" prop="tmnlFactoryCode" :formatter="tmnlFactoryFormat"></el-table-column>
          <el-table-column :label="$t('global.tmnlType')" prop="tmnlTypeCode" :formatter="tmnlTypeFormat"></el-table-column>
          <el-table-column :label="$t('global.meterFactory')" prop="metFactoryCode" :formatter="meterFactoryFormat"></el-table-column>
          <el-table-column :label="$t('global.meterType')" prop="metTypeCode" :formatter="meterTypeFormat"></el-table-column>
          <el-table-column :label="$t('monitoring.instMeterCnt')" prop="instMeterCnt"></el-table-column>
          <el-table-column :label="$t('monitoring.readCnt')" prop="readCnt"></el-table-column>
          <el-table-column :label="$t('monitoring.readSuccCnt')" prop="readSuccCnt"></el-table-column>
          <el-table-column :label="$t('monitoring.successRate') + '(%)'" prop="readSuccRate">
            <template slot-scope="scope">
              {{Number(scope.row.readSuccRate) * 100}}
            </template>
          </el-table-column>
        </el-table>
        <pagination
          :page.sync="params.current"
          :limit.sync="params.size"
          :total="total"
          @pagination="search"
          style="margin-top:-1px"
        ></pagination>
      </el-tab-pane>

      <!-- 失败列表 -->
      <el-tab-pane :label="$t('readrate.readerrorlist')" name="2">
        <el-form :inline="true" :model="form" label-position="left">
          <el-form-item :label="$t('areaManage.terminalAddr')">
            <el-input v-model="form.serachValue2" placeholder=""></el-input>
          </el-form-item>
          <el-form-item :label="$t('global.meterFactory')">
            <el-select v-model="form.factoryCode" size="small" style="width:100px;">
              <el-option :label="$t('global.all')" :value="-1"></el-option>
              <el-option :label="ele.typeName" :value="ele.typeCode" v-for="(ele, i) in meterFactoryList" :key="i"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('auto.commtype')">
            <el-select v-model="form.commMode" size="small" style="width:100px;">
              <el-option :label="$t('global.all')" :value="-1"></el-option>
              <el-option :label="ele.typeName" :value="ele.typeCode" v-for="(ele, i) in commModeList" :key="i"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('global.from')">
            <el-date-picker
              v-model="form.month"
              type="date"
              size="small"
              style="width:160px;"
              :clearable="false"
              :editable="false">
            </el-date-picker>
          </el-form-item>
          <el-form-item :label="$t('global.to')">
            <el-date-picker
              v-model="form.monthT"
              type="date"
              size="small"
              style="width:160px;"
              :clearable="false"
              :editable="false">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="searchT" size="small">{{$t('global.search')}}</el-button>
          </el-form-item>
        </el-form>
        <el-table
          :data="meterData"
          :header-cell-style="{background:'#F2F2F2',color:'rgb(51,51,51)'}"
          border
          :height="tableHeightT"
          v-loading='loading'
        >
          <el-table-column type="selection" width="55">
          </el-table-column>
          <el-table-column :label="$t('global.id')" width="80">
            <template slot-scope="scope">{{ query.limit*(query.page-1)+scope.$index+1 }}</template>
          </el-table-column>
          <el-table-column prop="orgName" :label="$t('tree.ownermru')"></el-table-column>
          <el-table-column prop="terminalAddr" :label="$t('sitemanage.dcuaddress')"></el-table-column>
          <el-table-column prop="commAddr" :label="$t('auto.meteraddress')"></el-table-column>
          <el-table-column prop="meterFacoryCode" :label="$t('global.meterFactory')" :formatter="meterFactFormat"></el-table-column>
          <el-table-column prop="commMode" :label="$t('auto.commtype')" :formatter="commModeFormat"></el-table-column>
          <el-table-column prop="dataTime" :label="$t('readrate.datatime')"></el-table-column>
          <el-table-column prop="markTime" :label="$t('readrate.marktime')"></el-table-column>
          <el-table-column prop="readFailFlag" :label="$t('readrate.readflag')">
            <template slot-scope="scope">{{ changeflag(scope.row.readFailFlag) }}</template>
          </el-table-column>
        </el-table>
        <pagination
          :page.sync="query.page"
          :limit.sync="query.limit"
          :total="totalT"
          @pagination="searchT"
          style="margin-top:-1px"
        ></pagination>
      </el-tab-pane>
    </el-tabs>
  </basic-container>
</template>
<script>
// import echarts from 'echarts'
import { mapGetters } from 'vuex'
import { getRate } from '@/api/monitoring'
import { getViewList } from '@/api/autoRegister'
import { readMeterFailList } from "@/api/clock";
import Pagination from '@/components/Pagination'
export default {
  components: {
    Pagination
  },
  data () {
    return {
      params: {
        current: 1,
        size: 20,
        time1: this.calcDate(new Date()),
        time2: new Date(),
        tmnlFactoryCode: '',
        metFactoryCode: '',
      },
      tableData: [],
      total: 0,
      loading: false,
      chart: '',
      tmnlFactoryList: [],
      meterFactoryList: [],
      tmnlTypeList: [],
      meterTypeList: [],
      commModeList:[],
      active1:'1',
      meterData: [],
      form: {
        month: this.calcDate(new Date()),
        monthT: new Date(),
        factoryCode:-1,
        commMode:-1,
      },
      selectList: [],
      handleVisible: false,
      totalT:0,
      query: {
        page: 1,
        limit: 20,
      },
      tableHeight:window.innerHeight - 420,
      tableHeightT:window.innerHeight - 380
    };
  },
  mounted () {
    window.onresize = () => {
      // this.chart.resize()
      this.tableHeight = window.innerHeight - 420;
      this.tableHeightT = window.innerHeight - 380;
    }
  },
  created () {
    this.search()
    this.getView()
  },
  computed: {
    ...mapGetters(['colorName', 'treeNode', 'level'])
  },
  watch: {
    treeNode (val) {
      this.search();
      if(!this.isNull(this.treeNode)){
        this.searchT();
      }
    }
  },
  methods:{
    calcDate (date) {
      return new Date(date.setTime(date.getTime() - 3600 * 1000 * 24 * 7))
    },
    isNull(arg1){
      return !arg1 && arg1!==0 && typeof arg1!=="boolean"?true:false;
    },
    timeFormat(val) {
      let date = new Date(val)
      return (
        date.getFullYear() +
        '-' +
        (date.getMonth() + 1 + '').padStart(2, '0') +
        '-' +
        (date.getDate() + '').padStart(2, '0')
      )
    },
    search () {
      if (!this.treeNode) {
        this.$notify({
            title: this.$t('global.warn'),
            message: this.$t('global.warntree'),
            type: 'warning'
        })
        return
      }
      if (this.level > 5) {
        this.tableData = []
        // this.drawBars()
        return
      }
      this.loading = true
      let obj = {
        current: this.params.current,
        size: this.params.size,
        // statDate: this.timeFormat(this.params.date),
        // orgType: this.treeNode.deviceType,
        // orgType: '',
        orgNo: this.treeNode.deviceNo,
        startTime: this.timeFormat(this.params.time1),
        endTime: this.timeFormat(this.params.time2),
        tmnlFactoryCode: this.params.tmnlFactoryCode,
        metFactoryCode: this.params.metFactoryCode,
      }
      let str = ''
      Object.keys(obj).forEach(ele => {
        str += (ele + '=' + obj[ele] + '&')
      })
      str = str.substr(0, str.length - 1)
      getRate(str).then(({data: res}) => {
        if (res.success) {
          this.tableData = res.data.records
          this.total = res.data.total
          // this.drawBars()
        } else {
          this.$message({
            message: this.$t('global.searchFail'),
            type: 'error'
          })
        }
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // drawBars () {
    //   this.chart = echarts.init(document.getElementById('bar'))
    //   this.chart.setOption({
    //     color: [this.colorName],
    //     xAxis: {
    //       type: 'category',
    //       data: this.tableData.map(ele => ele.orgName)
    //     },
    //     yAxis: {
    //       type: 'value',
    //       axisLabel: {
    //         formatter: '{value}%'
    //       }
    //     },
    //     grid: {
    //       left: 80,
    //       right: 20,
    //       top: 50,
    //       bottom: 50,
    //     },
    //     series: [
    //       {
    //         type: 'bar',
    //         data: this.tableData.map(ele => ele.readSuccRate),
    //         barWidth: 20
    //       }
    //     ]
    //   })
    // }
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
      getViewList({
        viewType: "meterCommModel"
      }).then(res => {
        this.commModeList = res.data.data.list
      })
    },
    tmnlFactoryFormat (row) {
      let obj = this.tmnlFactoryList.find(ele => Number(ele.typeCode) === Number(row.tmnlFactoryCode))
      if (obj) {
        return obj.typeName
      } else {
        return row.tmnlFactoryCode
      }
    },
    meterFactoryFormat (row) {
      let obj = this.meterFactoryList.find(ele => Number(ele.typeCode) === Number(row.metFactoryCode))
      if (obj) {
        return obj.typeName
      } else {
        return row.metFactoryCode
      }
    },
    tmnlTypeFormat (row) {
      let obj = this.tmnlTypeList.find(ele => Number(ele.typeCode) === Number(row.tmnlTypeCode))
      if (obj) {
        return obj.typeName
      } else {
        return row.tmnlTypeCode
      }
    },
    meterTypeFormat (row) {
      let obj = this.meterTypeList.find(ele => Number(ele.typeCode) === Number(row.metTypeCode))
      if (obj) {
        return obj.typeName
      } else {
        return row.metTypeCode
      }
    },
    orgTypeFormatter (row) {
      // 01 Country, 02 Region, 03 Department, 04 Office, 05 MRU
      if (row.orgType === '01') {
        return this.$t('global.country')
      } else if (row.orgType === '02') {
        return this.$t('global.region')
      } else if (row.orgType === '03') {
        return this.$t('privile.depart')
      } else if (row.orgType === '04') {
        return this.$t('global.office')
      } else if (row.orgType === '05') {
        return this.$t('areaManage.mru')
      }
    },

    commModeFormat(row){
      let obj = this.commModeList.find(ele => Number(ele.typeCode) === Number(row.commMode))
      if (obj) {
        return obj.typeName
      } else {
        return row.commMode
      }
    },
    meterFactFormat(row){
      let obj = this.meterFactoryList.find(ele => Number(ele.typeCode) === Number(row.meterFacoryCode))
      if (obj) {
        return obj.typeName
      } else {
        return row.meterFacoryCode
      }
    },
    searchT () {
      this.loading = true;
      let param = {
        pageNum: this.query.page,
        pageSize: this.query.limit,
        beginAt:this.timeFormat(this.form.month)+' 00:00:00',
        endAt:this.timeFormat(this.form.monthT)+' 23:59:59',
        factoryCode:this.form.factoryCode,
        commMode:this.form.commMode,
        serachValue2:this.form.serachValue2
      };
      if (this.treeNode.deviceType === "tmnl") {
        param.terminalAddr=this.treeNode.deviceName
      } else if (this.treeNode.deviceType === "meter") {
        param.meterAddr=this.treeNode.deviceName
      } else if (this.treeNode.deviceType === "group") {
        param.groupId=this.treeNode.id
      } else {
        param.orgNo=this.treeNode.deviceNo
      }
      readMeterFailList(param).then(res=>{
        if(res.data.data.total!=0){
          this.meterData=res.data.data.list;
        }else{
          this.meterData=[]
        }
        this.totalT=res.data.data.total;
        this.loading=false;
      })
    },

    changeflag (val) {
      if (val == 0) {
        return this.$t('readrate.acpfail');
      } else {
        return this.$t('readrate.readfail');
      }
    }
  }
}
</script>
<style lang='scss' scoped>
  #bar {
    width: 99%;
    height: 300px;
  }
  .head {
    height: 40px;
    line-height: 40px;
    padding: 0 20px;
    border: 1px solid #ddd;
    border-bottom: 0;
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