<template>
  <basic-container>
    <!-- 查询栏 -->
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item :label="formLabel.objectName">
        <el-input v-model="formInline.objectName" :placeholder="formLabel.objectName" readonly></el-input>
      </el-form-item>
      <el-form-item :label="formLabel.objectType">
        <el-input v-model="formInline.objectType" :placeholder="formLabel.objectType" readonly></el-input>
      </el-form-item>
      <el-form-item :label="formLabel.calender">
        <el-date-picker
          v-model="formInline.startDate"
          :format="format"
          :clearable="clearAble">
        </el-date-picker>
      </el-form-item>
      <el-form-item :label="formLabel.to">
        <el-date-picker
          v-model="formInline.endDate"
          :format="format"
          :clearable="clearAble">
        </el-date-picker>
      </el-form-item>
      <el-form-item :label="this.$t('meterEventQuery.eventName')">
        <el-select v-model="eventValue" @change="queryLogData">
          <el-option
            v-for="item in eventOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit" icon="el-icon-search">{{formLabel.search}}</el-button>
      </el-form-item>
    </el-form>
    <div>
      <!--导出按钮-->
      <export-btn :style="{float: 'left', marginBottom:'5px'}" :exportData="exportData" @getExportData="getExportData"/>
      <!--筛选框 -->
      <div :style="{float: 'right'}">
        <span>{{this.$t('meterEventQuery.filter')}}</span>
        <el-select
          v-model="filterValue"
          filterable
          multiple
          collapse-tags
          style="margin:0 20px 0 20px;"
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
      <!-- 下方表格 -->
      <el-table
        :data="tableData"
        style="width: 100%"
        border
        fit
        :height="tableHeight"
        highlight-current-row
        stripe
        size="medium"
      >
        <el-table-column
          fixed
          type="index"
          align="center"
          width="70"
          :label="rowLabel.index">
          <template slot-scope="scope">
            <span v-text="getIndex(scope.$index)"> </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="METERNAME"
          fixed
          :label="rowLabel.meterName"
          minWidth="160"
          align="center"
          :show-overflow-tooltip="true"
        >
        </el-table-column>
        <el-table-column
          prop="DATETIME"
          fixed
          :label="rowLabel.dateTime"
          minWidth="160"
          align="center"
          :show-overflow-tooltip="true"
        >
        </el-table-column>
        <el-table-column
          v-for="item in itemName"
          :prop="item.DATAN"
          :label="item.itemName"
          minWidth="200"
          align="center"
          :show-overflow-tooltip="true"
        >
        </el-table-column>
      </el-table>
      <pagination v-show="total>=0" :total="total" :page.sync="query.page" :limit.sync="query.limit" @pagination="pagination" style="margin-top: 5px" />
    </div>
  </basic-container>
</template>

<script>
  import ExportBtn from "@/components/export-btn/export-btn";
  import Pagination from '@/components/Pagination'
  import QueryBar from './queryBar'
  import { orgType } from '@/api/dataQuery/avgVoltageCurrentQuery'
  import { queryTypeData, queryLogData, queryContentData, filterData } from '@/api/dataQuery/meterEventQuery'
  export default {
    name: "eobquery",
    components: {
      ExportBtn,
      Pagination,
      QueryBar
    },
    data() {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
      return {
        formInline: {
          objectNo: '',
          objectName: '',
          objectType: '',
          startDate: new Date(start.getFullYear(), start.getMonth(), start.getDate(), 0, 0),
          endDate: new Date(end.getFullYear(), end.getMonth(), end.getDate(), 0, 0)
        },
        formLabel:{
          objectName:this.$t('meterEventQuery.objectName'),
          objectType:this.$t('meterEventQuery.objectType'),
          calender:this.$t('payset.calender'),
          to:this.$t('meterEventQuery.to'),
          startDate:this.$t('global.startDate'),
          endDate:this.$t('global.endDate'),
          search:this.$t('auto.search'),
          exportDialog:this.$t('meterEventQuery.export')
        },
        format: "yyyy-MM-dd",
        flag: true,
        clearAble: false,
        params: {},
        eventType: "3",
        eventOptions: [],
        eventValue: "",
        // 导出按钮弹出框
        dialogVisible: false,
        exportData: {},
        // 过滤框
        inputMeterName: this.$t('meterEventQuery.inputMeterName'),
        filterValue: [],
        options: [],
        // 表格
        filterData: [],
        tableHeight:window.innerHeight - 360,
        total: 0,
        tableData: [],
        rowLabel: {
          index: this.$t('meterEventQuery.no'),
          meterName: this.$t('meterevent.metername'),
          dateTime: this.$t('meterEventQuery.dataTime'),
        },
        itemName: [],
        query:{
          page: 1,
          limit: 20
        },
      }
    },
    computed: {},
    created() {
    },
    methods: {
      onSubmit() {
        if (this.formInline.objectNo !== "" || this.formInline.objectType !== "") {
          if (this.formInline.objectType === "mru") {
            let params = {
              orgId: this.formInline.objectNo
            };
            orgType(params).then(res => {
              if (res.data.data === "05") {
                this.listLoading = true;
                this.getList();
                this.getFilterData();
              }else {
                this.$alert(this.$t('meterEventQuery.error'), this.$t('meterEventQuery.tip'), {
                  confirmButtonText: this.$t('global.confirm')
                });
              }
            }).catch((error) => {
              console.log(error)
            })
          }else {
            this.listLoading = true;
            this.getList();
            this.getFilterData();
          }
        }else {
          this.$alert(this.$t('meterEventQuery.error'), this.$t('meterEventQuery.tip'), {
            confirmButtonText: this.$t('global.confirm')
          });
        }
      },
      getParams() {
        let startDate = this.formInline.startDate;
        let endDate = this.formInline.endDate;

        startDate = startDate.getFullYear() + "-" + this.isAddZero(startDate.getMonth() + 1)
          + "-" + this.isAddZero(startDate.getDate());
        endDate = endDate.getFullYear() + "-" + this.isAddZero(endDate.getMonth()+1)
          + "-" + this.isAddZero(endDate.getDate());
        let type;
        if (this.formInline.objectType === "NB Meter" || this.formInline.objectType === "4G Meter" || this.formInline.objectType === "DCU"  || this.params.objectType === "tmnl") {
          type = "tmnl"
        }else if (this.formInline.objectType === "mru"){
          type = "mru";
        }else {
          type = "meter"
        }
        this.params = {
          objectNo: this.formInline.objectNo,
          objectType: type,
          eventNo: this.eventValue,
          startDate: startDate,
          endDate: endDate,
          page: this.query.page,
          limit: this.query.limit,
        };
      },
      getList() {
        this.flag = true;
        this.getParams();
        queryContentData(this.params).then(res => {
          if(res.data.data.totalCount !== 0) {
            this.tableData = res.data.data.list;
            this.total = res.data.data.totalCount;
          }else{
            this.tableData = [];
            this.total = 0;
          }
        }).catch((error) => {
          console.log(error)
        })
      },
      queryTypeData() {
        let eventType = {
          type: this.eventType
        };
        queryTypeData(eventType).then(res => {
          let result = res.data.data;
          this.eventOptions = [];
          for (let i = 0; i < result.length; i++) {
            this.eventOptions.push({
              value: result[i].EVENT_NO,
              label: result[i].EVENT_NAME,
            })
          }
          this.eventValue = this.eventOptions[0].value;
          this.queryLogData();
        }).catch((error) => {
            console.log(error)
        })
      },
      queryLogData() {
        let eventNo = {
          eventNo: this.eventValue,
        };
        queryLogData(eventNo).then(res => {
          let result = res.data.data;
          this.itemName = [];
          for (let i = 0; i < result.length; i++) {
            this.itemName.push({
              DATAN: "DATA" + result[i].DATAN,
              itemName: result[i].ITEM_NAME
            });
          }
        }).catch((error) => {
          console.log(error)
        })
      },
      renderHeader(h, { column, $index }) {
        let label = column.label;
        if ($index === 2){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "Current date/time\n0-0:1.0.0.255"
              }
            }
          },label)
        }else if ($index === 3){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "Status Information\n0-0:96.5.0.255"
              }
            }
          },label)
        }else {
          return h('div',label);
        }
      },
      getIndex($index) {
        //表格序号
        return (this.query.page - 1) * this.query.limit + $index + 1
      },
      isAddZero(time){
        if(time < 10){
          return "0" + time;
        }else {
          return time;
        }
      },
      filterBtn() {
        if (this.filterValue.length !== 0) {
          this.getParams();
          this.flag = false;
          let params = {...this.params};
          this.listLoading = true;
          params.objectNo = "";
          for (let i = 0; i < this.filterValue.length; i++) {
            if (i === this.filterValue.length - 1) {
              params.objectNo = params.objectNo + this.filterValue[i]
            }else {
              params.objectNo = params.objectNo + this.filterValue[i] + ','
            }
          }
          this.params.objectType = "meter";
          queryContentData(params).then(res => {
            if(res.data.data.totalCount !== 0) {
              this.tableData = res.data.data.list;
              this.total = res.data.data.totalCount;
            }else{
              this.tableData = [];
              this.total = 0;
            }
            setTimeout(() => {
              this.listLoading = false
            }, 1.5 * 1000);
          }).catch((error) => {
            console.log(error)
          })
        }else {
          this.$alert(this.$t('meterEventQuery.filterTip'), this.$t('meterEventQuery.tip'), {
            confirmButtonText: this.$t('global.confirm')
          });
        }
      },
      getFilterData() {
        this.getParams();
        filterData(this.params).then(res => {
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
      getExportData() {
        let columns = {
          METERNAME: this.$t('meterevent.metername'),
        };
        for (let i = 0; i < this.itemName.length; i++) {
          columns[this.itemName[i].DATAN] = this.itemName[i].itemName;
        }
        this.getParams();
        this.exportData = {
          url: "/api/ami-dataquery/meterEventQuery/queryContentData",
          params: this.params,
          columns: columns,
          fileName: "meterEventQuery-" + this.params.objectType + "-" + this.formInline.objectName + "-"
          + this.eventValue + "-" + this.params.startDate + "-" + this.params.endDate,
          // meterEventQuery- + 对象类型- +对象名称- + 实践编码- + 开始时间- + 结束时间命名
          sheetName: this.$t('meterEventQuery.sheetName'),
        };
      },
      pagination() {
        this.flag ? this.getList() : this.filterBtn();
      }
    },
    mounted() {
      this.queryTypeData();
    },
    watch: {
      '$store.state.common.treeNode': function (data) {
        this.tableData = [];
        this.options = [];
        this.filterValue = [];
        this.total = 0;
        this.formInline.objectName = data.deviceName;
        if(data.deviceType === 'org') {
          this.formInline.objectType = "mru";
        }else if(data.deviceType === 'meter'){
          this.formInline.objectType = "Meter";
        }else{
          if(data.deviceModel === "NBonline" || data.deviceModel === "NBoffline") {
            this.formInline.objectType = "NB Meter";
          }else if (data.deviceModel === "fourGonline" || data.deviceModel === "fourGoffline") {
            this.formInline.objectType = "4G Meter";
          }else {
            this.formInline.objectType = "DCU";
          }
        }
        this.formInline.objectNo = data.deviceNo;
      }
    }
  }
</script>

<style scoped>
</style>

