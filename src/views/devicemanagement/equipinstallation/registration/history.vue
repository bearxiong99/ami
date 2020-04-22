<template>
  <div>
    <div class="filter-box">
      <span>{{$t('auto.dcuDevi')}}</span>
      <el-input :maxlength="30" v-model="params1.tmnlAssetNo"></el-input>
      <span style="margin-left:0">{{$t('global.meterFactory')}}</span>
      <el-select v-model="params1.factoryCode" size="small">
        <el-option :label="$t('global.all')" :value="-1"></el-option>
        <el-option :label="ele.typeName" :value="ele.typeCode" v-for="(ele, i) in tmnlFactoryList" :key="i"></el-option>
      </el-select>
     
      <!-- <span>{{$t('auto.confirmStatus')}}</span>
      <el-select v-model="params1.deviceType" placeholder="" size="small" >
        <el-option :label="$t('auto.dcu')" :value="0"></el-option>
        <el-option :label="$t('auto.gm')" :value="1"></el-option>
        <el-option :label="$t('auto.nb')" :value="2"></el-option>
        <el-option :label="$t('auto.shortConnect')" :value="3"></el-option>
        <el-option :label="$t('auto.longConnect')" :value="4"></el-option>
      </el-select> -->
      <span>{{$t('auto.from')}}</span>
      <el-date-picker v-model="params1.time1" type="date" size="small" style="width:160px;" :clearable="false" :editable="false"></el-date-picker>
      <span style="padding-left:0">{{$t('auto.to')}}</span>
      <el-date-picker v-model="params1.time2" type="date" size="small" style="width:160px;" :clearable="false" :editable="false"></el-date-picker>
      <el-button type="primary" size="small" @click="search1">{{$t('auto.search')}}</el-button>
    </div>
    <div class="content">
      <div class="terminal">
        <div class="head">
          {{$t('auto.meterChangeList')}}
        </div>
        <el-table
          :data="meterHistoryData"
          border
          height="26vh"
          v-loading="load1"
          :header-cell-style="{background:'#F2F2F2',color:'rgb(51,51,51)'}"
          highlight-current-row
          @current-change="selectFun"
          >
          <!-- <el-table-column type="selection" width="50"></el-table-column> -->
          <el-table-column :label="$t('key.no')" width="50">
            <template slot-scope="scope">{{ params1.size * (params1.current - 1) + scope.$index + 1 }}</template>
          </el-table-column>
          <el-table-column :label="$t('auto.dcuDevi')" prop="tmnlAssetNo"></el-table-column>
          <el-table-column :label="$t('areaManage.meterCommad')" prop="metCommAddr"></el-table-column>
          <el-table-column prop="factoryCode" :label="$t('global.meterFactory')">
            <template slot-scope="scope">{{ changeFactory(scope.row.factoryCode)}}</template>
          </el-table-column>
          <el-table-column :label="$t('meterevent.dealstatus')" prop="procStat">
            <template slot-scope="scope">{{ changeStatus(scope.row.procStat) }}</template>
          </el-table-column>
          <el-table-column :label="$t('auto.deleteWhite')" prop="downTimes"></el-table-column>
          <el-table-column :label="$t('auto.dealcomtime')" prop="procTime"></el-table-column>
          <el-table-column :label="$t('auto.recordcomtime')" prop="recvTime"></el-table-column>
          <el-table-column :label="$t('auto.oldtermaladdress')" prop="preTmnlAssetNo"></el-table-column>
        </el-table>
        <!-- 终端表格E -->
        <pagination
          :total="total1"
          :page.sync="params1.current"
          :limit.sync="params1.size"
          @pagination="search1"
          style="margin-top:-1px"
        />
      </div>
      <div class="meter">
        <div class="head">
          {{$t('auto.meterChangeDetail')}}
        </div>
        <!-- 电表表格S -->
        <el-table
          :data="meterDetailData"
          border
          height="26vh"
          v-loading="load2"
          :header-cell-style="{background:'#F2F2F2',color:'rgb(51,51,51)'}">
          <el-table-column :label="$t('key.no')" width="50">
            <template slot-scope="scope">{{ params1.size * (params1.current - 1) + scope.$index + 1 }}</template>
          </el-table-column>
          <!-- <el-table-column :label="$t('key.deviceName')" prop="tmnlAssetNo"></el-table-column> -->
          <el-table-column :label="$t('areaManage.meterCommad')" prop="metCommAddr"></el-table-column>
          <el-table-column :label="$t('meterevent.dealstatus')" prop="procStat">
            <template slot-scope="scope">{{ changeStatus(scope.row.procStat) }}</template>
          </el-table-column>
          <el-table-column :label="$t('auto.deleteWhite')" prop="downTimes"></el-table-column>
          <el-table-column :label="$t('auto.dealcomtime')" prop="procTime"></el-table-column>
          <el-table-column :label="$t('auto.recordcomtime')" prop="recvTime"></el-table-column>
          <el-table-column :label="$t('auto.oldtermaladdress')" prop="preTmnlAssetNo"></el-table-column>
          <el-table-column :label="$t('auto.archiveDate')" prop="archiveTime"></el-table-column>
        </el-table>
        <!-- 电表表格E -->
        <pagination
          :total="total2"
          :page.sync="params2.current"
          :limit.sync="params2.size"
          @pagination="search2"
          style="margin-top:-1px"
        />
      </div>
    </div>
  </div>
</template>
<script>
import Pagination from '@/components/Pagination'
import { getViewList,meterChangeHistory,meterChangeDetail} from '@/api/autoRegister'
export default {
  components: {
    Pagination,
  },
  data () {
    return {
      tmnlTypeList:[],
      meterTypeList:[],
      tmnlFactoryList:[],
      meterFactoryList:[],
      meterHistoryData: [],
      meterDetailData:[],
      selectData:null,
      total1: 0,
      params1: {
        factoryCode: -1,
        tmnlAssetNo: '',
        current: 1,
        size: 20,
        time1: this.calcDate(new Date()),
        time2: new Date(),
      },
      load1: false,
      total2: 0,
      params2: {
        factoryCode: '',
        tmnlAssetNo: '',
        current: 1,
        size: 20
      },
      load2: false,
    };
  },
  created () {
    this.getView()
  },
  watch: {
    '$store.state.common.treeNode': function (data) {
       if(data.deviceType === 'tmnl') {
         this.params1.tmnlAssetNo=data.deviceName;
         this.search1();
       }
    }
  },
  methods:{
    calcDate (date) {
      return new Date(date.setTime(date.getTime() - 3600 * 1000 * 24 * 7))
    },
    formatTime (date) {
      return date.getFullYear() + '-' + (date.getMonth() + 1 + '').padStart(2, '0') + '-' + (date.getDate() + '').padStart(2, '0')
    },
    // 历史查询
    search1 () {
      if(this.params1.time1.getTime() > this.params1.time2.getTime()) {
        this.$message({
          type: "error",
          message: this.$t('auto.timeBug')
        })
        return
      }
      this.meterHistoryData=[];
      this.load1=true;
      meterChangeHistory({
        beginAt:this.formatTime(this.params1.time1)+' 00:00:00',
        endAt:this.formatTime(this.params1.time2)+' 23:59:59',
        terminalAddr:this.params1.tmnlAssetNo,
        type:-1, 
        pageNum:this.params1.current,
        factoryCode:this.params1.factoryCode,
        pageSize:this.params1.size,
      }).then(res=>{
        if(res.data.data.total!=0){
          this.meterHistoryData=res.data.data.list; 
        }
        this.total1=res.data.data.total;
        this.load1=false;
      })
    },
    // 查询详情
    search2 () {
      if(this.dcuTime.time1.getTime() > this.dcuTime.time2.getTime()) {
        this.$message({
          type: "error",
          message: this.$t('auto.timeBug')
        })
        return
      }
      if(this.selectData!=null){
        this.meterDetailData=[]
        this.load2=true;
        meterChangeDetail({
          beginAt:this.formatTime(this.params1.time1)+' 00:00:00',
          endAt:this.formatTime(this.params1.time2)+' 23:59:59',
          meterAddr:this.selectData.metCommAddr,
          type:-1, 
          pageNum:this.params2.current,
          factoryCode:this.params1.factoryCode,
          pageSize:this.params2.size,
        }).then(res=>{
          if(res.data.data.total!=0){
            this.meterDetailData=res.data.data.list; 
          }
          this.total2=res.data.data.total;
          this.load2=false;
        })
      }else{
        this.meterDetailData = [];
        this.total2 = 0;
      }
    },
    selectFun(val){
      this.selectData=val;
      this.search2();
    },
    getView() {
      // getViewList({
      //   viewType: 'meterType'
      // }).then(res => {
      //   this.meterTypeList = res.data.data.list
      // })
      // getViewList({
      //   viewType: 'tmnlType'
      // }).then(res => {
      //   this.tmnlTypeList = res.data.data.list
      // })
      getViewList({
        viewType: 'TMNLFactoryType'
      }).then(res => {
        this.tmnlFactoryList = res.data.data.list
      })
      getViewList({
        viewType: 'meterFactoryType'
      }).then(res => {
        this.meterFactoryList = res.data.data.list
      })
    },
    changeStatus(val){
      if(val==0){
        return this.$t('meterevent.untreated')
      }else if (val==1){
        return this.$t('auto.issuedSuccess')
      }else if (val==2){
        return this.$t('auto.issuedFail')
      }else if (val==3){
        return this.$t('auto.fileSuccess')
      }else if (val==4){
        return this.$t('auto.fileFail')
      }
    },
    changeFactory(val) {
      for (let i in this.meterFactoryList) {
        if (val == this.meterFactoryList[i].typeCode) {
          return this.meterFactoryList[i].typeName;
        }
      }
    }
  }
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
    .terminal, .meter {
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
          & > span {
            display: inline-block;
            // width: 120px;
            height: 20px;
            padding: 0 20px;
            margin-top: 10px;
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
      .page {
        height: 50px;
        border-top: 1px solid #ddd;
        background-color: #fafafa;
        .el-pagination {
          margin: 10px 0 0 15px;
        }
      }
    }
  }
</style>