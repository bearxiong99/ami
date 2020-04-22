<template>
  <basic-container>
    <div>
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item :label="formLabel.objectName">
          <el-input :maxlength="30" v-model="formInline.objectName" :placeholder="formLabel.objectName" readonly></el-input>
        </el-form-item>
        <el-form-item :label="formLabel.objectType">
          <el-input :maxlength="30" v-model="formInline.objectType" :placeholder="formLabel.objectType" readonly></el-input>
        </el-form-item>
        <el-form-item :label="formLabel.calender">
          <el-date-picker
            v-model="formInline.startDate"
            type="datetime"
            :format="format"
            :clearable="clearAble">
          </el-date-picker>
        </el-form-item>
        <el-form-item :label="formLabel.to">
          <el-date-picker
            v-model="formInline.endDate"
            type="datetime"
            :format="format"
            :clearable="clearAble">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit" icon="el-icon-search">{{formLabel.search}}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="toolbar">
      <export-btn :exportData="exportData" @getExportData="getExportData" />
    </div>
    <!--筛选框 -->
    <div :style="{float: 'right'}">
      <span>{{this.$t('eobQuery.filter')}}</span>
      <el-select
        v-model="filterValue"
        filterable
        multiple
        collapse-tags
        style="margin:0 20px 0 20px;width: 230px"
        :placeholder="inputMeterName">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-button type="primary" icon="el-icon-search" @click="filterBtn"></el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      :height="tableHeight"
      highlight-current-row
      style="width: 100%;"
      stripe
      size="medium"
    >
      <el-table-column fixed
        type="index"
        width="80" :label="rowLabel.no" :render-header="renderHeader">
        <template slot-scope="scope">
          <span v-text="getIndex(scope.$index)"> </span>
        </template>
      </el-table-column>
      <el-table-column :label="rowLabel.meterId" prop="id" sortable="custom" align="center" width="100"  v-if="show">
        <template slot-scope="scope">
          <span>{{ scope.row.meterId }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="rowLabel.meterName"  fixed width="160px" align="center" :render-header="renderHeader">
        <template slot-scope="scope">
          <span>{{ scope.row.meterName }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="rowLabel.date" fixed width="150px" align="center" :render-header="renderHeader">
        <template slot-scope="scope">
          <span>{{ scope.row.date }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="rowLabel.status" width="120" align="center" :render-header="renderHeader">
        <template slot-scope="scope">
          <span class="status-style">{{ scope.row.status }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="rowLabel.importActivePower" width="190" align="center" :render-header="renderHeader">
        <template slot-scope="scope">
          <span>{{ scope.row.importActivePower }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="rowLabel.importReactivePower" align="center" width="190" :render-header="renderHeader">
        <template slot-scope="scope">
          <span>{{ scope.row.importReactivePower }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="rowLabel.importApparentPower" align="center" width="190" :render-header="renderHeader">
        <template slot-scope="scope">
          <span>{{ scope.row.importApparentPower }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="rowLabel.reactivePowerImport" align="center" width="200" :render-header="renderHeader">
        <template slot-scope="scope">
          <span>{{ scope.row.reactivePowerImport }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="rowLabel.exportActivePower" align="center" width="190" :render-header="renderHeader">
        <template slot-scope="scope">
          <span>{{ scope.row.exportActivePower }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="rowLabel.exportReactivePower" align="center" width="190" :render-header="renderHeader">
        <template slot-scope="scope">
          <span>{{ scope.row.exportReactivePower }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="rowLabel.exportApparentPower" align="center" min-width="190" :render-header="renderHeader">
        <template slot-scope="scope">
          <span>{{ scope.row.exportApparentPower }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="rowLabel.reactivePowerExport" align="center" min-width="200" :render-header="renderHeader">
        <template slot-scope="scope">
          <span>{{ scope.row.reactivePowerExport }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="rowLabel.importPowerFactor" align="center" width="170" :render-header="renderHeader">
        <template slot-scope="scope">
          <span>{{ scope.row.importPowerFactor }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="rowLabel.exportPowerFactor" align="center" width="170" :render-header="renderHeader">
        <template slot-scope="scope">
          <span>{{ scope.row.exportPowerFactor }}</span>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>=0" :total="total" :page.sync="query.page" :limit.sync="query.limit" @pagination="pagination" style="margin-top: 5px" />
  </basic-container>
</template>

<script>
  import { fetchList, filterData } from '@/api/dataQuery/loadProfileQuery'
  import { orgType } from '@/api/dataQuery/avgVoltageCurrentQuery'
  import ExportBtn from "@/components/export-btn/export-btn";
  import Pagination from '@/components/Pagination'
  export default {
    components: { Pagination,ExportBtn },
    data() {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
      return {
        flag: true, // 用于控制过滤还是查询
        show:false,
        listLoading: false,
        list:null,
        tableHeight:window.innerHeight - 370,
        total: 0,
        format: "yyyy-MM-dd HH:mm",
        clearAble: false,
        formInline: {
          objectName: '',
          objectType: '',
          startDate: new Date(start.getFullYear(), start.getMonth(), start.getDate(), 0, 0),
          endDate: new Date(end.getFullYear(), end.getMonth(), end.getDate(), 0, 0)
        },
        query:{
          page: 1,
          limit: 20
        },
        formLabel:{
          objectName:this.$t('loadProfileQuery.objectName'),
          objectType:this.$t('loadProfileQuery.objectType'),
          calender:this.$t('payset.calender'),
          to:this.$t('loadProfileQuery.to'),
          startDate:this.$t('global.startDate'),
          endDate:this.$t('global.endDate'),
          search:this.$t('auto.search'),
          exportDialog:this.$t('loadProfileQuery.export')
        },
        rowLabel:{
          no:this.$t('loadProfileQuery.no'),
          meterId:this.$t('common.meterid'),
          meterName:this.$t('meterevent.metername'),
          date:this.$t('loadProfileQuery.dateTime'),
          status:this.$t('sitemanage.status'),
          importActivePower:this.$t('loadProfileQuery.importActivePower'),
          importReactivePower:this.$t('loadProfileQuery.importReactivePower'),
          importApparentPower:this.$t('loadProfileQuery.importApparentPower'),
          reactivePowerImport:this.$t('loadProfileQuery.reactivePowerImport'),
          exportActivePower:this.$t('loadProfileQuery.exportActivePower'),
          exportReactivePower:this.$t('loadProfileQuery.exportReactivePower'),
          exportApparentPower:this.$t('loadProfileQuery.exportApparentPower'),
          reactivePowerExport:this.$t('loadProfileQuery.reactivePowerExport'),
          importPowerFactor:this.$t('loadProfileQuery.importPowerFactor'),
          exportPowerFactor:this.$t('loadProfileQuery.exportPowerFactor'),
        },
        row:'',
        remoteParameters:{
          objectNo:'',
          objectType:'',
          startDate:'',
          endDate:'',
          page:'',
          limit:'',
        },
        inputMeterName: this.$t('avgVoltageCurrentQuery.inputMeterName'),
        filterValue: [],
        options: [],
        filterData: [],
        exportData: {},
      }
    },
    created() {
      //默认加载表格
      this.getList()
    },
    mounted(){
      // window.onresize = ()=>{
      //   this.tableHeight=window.innerHeight - 360
      // }
    },
    methods: {
      onSubmit() {
        if (this.remoteParameters.objectNo !== "" || this.remoteParameters.objectType !== "") {
          if (this.formInline.objectType === "mru") {
            let params = {
              orgId: this.remoteParameters.objectNo
            };
            orgType(params).then(res => {
              if (res.data.data === "05") {
                this.listLoading = true;
                this.getList();
                this.getFilterData()
              }else {
                this.$alert(this.$t('loadProfileQuery.error'), this.$t('loadProfileQuery.tip'), {
                  confirmButtonText: this.$t('global.confirm')
                });
              }
            }).catch((error) => {
              console.log(error)
            })
          }else {
            this.listLoading = true;
            this.getList();
            this.getFilterData()
          }
        }else {
          this.$alert(this.$t('loadProfileQuery.error'), this.$t('loadProfileQuery.tip'), {
            confirmButtonText: this.$t('global.confirm')
          });
        }
      },
      getList() {
        this.flag = true;
        this.getRemoteParameters();
        fetchList(this.remoteParameters).then(response => {
          if(response.data.data.totalCount!=0){
            this.list = response.data.data.list;
            this.total = response.data.data.totalCount;
          }else{
            this.list = [];
            this.total = 0;
          }
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 1000)
        })
      },
      exportDialog() {
        console.log("导出");

      },
      getRemoteParameters(){
        let startDate = this.formInline.startDate;
        let endDate = this.formInline.endDate;
        this.remoteParameters.startDate=startDate.getFullYear()+"-"+this.isAddZero(startDate.getMonth()+1)
                                          +"-"+this.isAddZero(startDate.getDate())+" "+this.isAddZero(startDate.getHours())+":"+this.isAddZero(startDate.getMinutes());
        this.remoteParameters.endDate=endDate.getFullYear()+"-"+this.isAddZero(endDate.getMonth()+1)
                                          +"-"+this.isAddZero(endDate.getDate())+" "+this.isAddZero(endDate.getHours())+":"+this.isAddZero(endDate.getMinutes());
        this.remoteParameters.page=this.query.page;
        this.remoteParameters.limit=this.query.limit;
      },
      getIndex($index) {
        //表格序号
        return (this.query.page - 1) * this.query.limit + $index + 1
      },
      isAddZero(time){
        if(time<10){
          return "0"+time;
        }else {
          return time;
        }
      },
      // 所有电表的id,名称
      getFilterData() {
        this.getRemoteParameters();
        filterData(this.remoteParameters).then(res => {
          let meterArr = res.data.data;
          this.options = [];
          for (let i = 0; i < meterArr.length; i++) {
            this.options.push({
              value: meterArr[i].METERID,
              label: meterArr[i].METERNAME
            })
          }
        }).catch((error) => {
          console.log(error)
        })
      },
      filterBtn() {
        if (this.filterValue !== "") {
          this.flag = false;
          this.getRemoteParameters();
          let params = {...this.remoteParameters};
          this.listLoading = true;
          params.objectNo = "";
          for (let i = 0; i < this.filterValue.length; i++) {
            if (i === this.filterValue.length - 1) {
              params.objectNo = params.objectNo + this.filterValue[i]
            }else {
              params.objectNo = params.objectNo + this.filterValue[i] + ','
            }
          }
          params.objectType = "meter";
          fetchList(params).then(res => {
            if(res.data.data.totalCount !== 0) {
              this.list = res.data.data.list;
              this.total = res.data.data.totalCount;
            }else{
              this.list = [];
              this.total = 0;
            }
            setTimeout(() => {
              this.listLoading = false
            }, 1.5 * 1000);
          }).catch((error) => {
            console.log(error)
          })
        }else {
          this.$alert(this.$t('loadProfileQuery.filterTip'), this.$t('loadProfileQuery.tip'), {
            confirmButtonText: this.$t('global.confirm')
          });
        }
      },
      getExportData() {
        let columns = {...this.rowLabel};
        delete columns["no"];
        delete columns["meterId"];
        this.exportData = {
          url: "/api/ami-dataquery/loadProfile/queryLoadProfileWithPage",
          params: this.remoteParameters,
          columns: columns,
          fileName: "loadprofile-" + this.formInline.objectType + "-" + this.formInline.objectName, // loadprofile- + 对象类型- +对象名称-命名
          sheetName: this.$t('loadProfileQuery.sheetName'),
        };
      },
      renderHeader(h, { column, $index }) {
        let label = column.label;
        if (label === this.$t('loadProfileQuery.dateTime')){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "Current date/time\n0-0:1.0.0.255"
              }
            }
          },label)
        }else if (label === this.$t('sitemanage.status')) {
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "Status Information\n0.0.96.5.0.255"
              }
            }
          },label)
        }else if (label === this.$t('loadProfileQuery.importActivePower')) {
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "∑Li Import active power (QI+QIV)\n1-0:1.4.0.255"
              }
            }
          },label)
        }else if (label === this.$t('loadProfileQuery.importReactivePower')) {
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "∑Li Import reactive power (QI+QII)\n1-0:3.4.0.255"
              }
            }
          },label)
        }else if (label === this.$t('loadProfileQuery.importApparentPower')) {
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "∑Li Import apparent power (QI+QIV)\n1-0:9.4.0.255"
              }
            }
          },label)
        }else if (label === this.$t('loadProfileQuery.reactivePowerImport')) {
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "∑Li Reactive power (import)[Total]\n1-0:5.4.0.255"
              }
            }
          },label)
        }else if (label === this.$t('loadProfileQuery.exportActivePower')) {
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "∑Li Export active power (QII+QIII) [Total]\n1-0:2.4.0.255"
              }
            }
          },label)
        }else if (label === this.$t('loadProfileQuery.exportReactivePower')) {
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "∑Li Export reactive power (QIII+QIV) [Total]\n1-0:4.4.0.255"
              }
            }
          },label)
        }else if (label === this.$t('loadProfileQuery.exportApparentPower')) {
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "∑Li Export apparent power (QII+QIII) [Total]\n1-0:10.4.0.255"
              }
            }
          },label)
        }else if (label === this.$t('loadProfileQuery.reactivePowerExport')) {
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "∑Li Reactive power (Export)[Total]\n1-0:8.4.0.255"
              }
            }
          },label)
        }else if (label === this.$t('loadProfileQuery.importPowerFactor')) {
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "Current Import Average Power Factor\n1-0:4.0.0.255"
              }
            }
          },label)
        }else if (label === this.$t('loadProfileQuery.exportPowerFactor')) {
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "Current Export Average Power Factor\n1-0:84.4.0.255"
              }
            }
          },label)
        }else {
          return  h('div',label)
        }
      },
      pagination() {
        this.flag ? this.getList() : this.filterBtn();
      }
    },
    mounted() {},
    watch: {
      '$store.state.common.treeNode': function (data) {
        this.$route.name === 'loadProfileQuery';
        this.list = [];
        this.options = [];
        this.filterValue = [];
        this.total = 0;
        this.formInline.objectName=data.deviceName;
        if(data.deviceType === 'org') {
          this.formInline.objectType = "mru";
          this.remoteParameters.objectType = "mru";
        }else if(data.deviceType === 'meter'){
          this.formInline.objectType = "Meter";
          this.remoteParameters.objectType=data.deviceType;
        }else {
          if(data.deviceModel === "NBonline" || data.deviceModel === "NBoffline") {
            this.formInline.objectType = "NB Meter";
          }else if (data.deviceModel === "fourGonline" || data.deviceModel === "fourGoffline") {
            this.formInline.objectType = "4G Meter";
          }else {
            this.formInline.objectType = "DCU";
          }
          this.remoteParameters.objectType=data.deviceType;
        }
        this.remoteParameters.objectNo=data.deviceNo;
      }
    }
  }
</script>


<style scoped="scss">
  .toolbar{
    padding: 2px;
    margin-top:5px;
    margin-bottom: 5px;
    padding-left: 0px;
    display: inline-block;
  }
  .status-style {
    white-space:nowrap;
    overflow: hidden;
  }
</style>
