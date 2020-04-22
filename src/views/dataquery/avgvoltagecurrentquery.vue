<template>
  <basic-container>
    <!-- 查询栏 -->
    <queryBar @onSubmit="onSubmit" :format="format" :type="type"/>
    <div>
      <!--导出按钮-->
      <export-btn :style="{float: 'left', marginBottom:'5px'}" :exportData="exportData" @getExportData="getExportData"/>
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
      <!-- 下方表格 -->
      <el-table
        v-loading="listLoading"
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
          prop="meterName"
          fixed
          :label="rowLabel.meterName"
          width="160"
          align="center"
          :show-overflow-tooltip="true"
          :render-header="renderHeader"
        >
        </el-table-column>
        <el-table-column
          prop="dataTime"
          fixed
          :label="rowLabel.dataTime"
          width="150"
          align="center"
          :show-overflow-tooltip="true"
          :render-header="renderHeader"
        >
        </el-table-column>
        <el-table-column
          prop="avgVoltageL1L2"
          :label="rowLabel.avgVoltageL1L2"
          width="160"
          align="center"
          :show-overflow-tooltip="true"
          :render-header="renderHeader"
        >
        </el-table-column>
        <el-table-column
          prop="insVoltageThdL1"
          :label="rowLabel.insVoltageThdL1"
          width="170"
          align="center"
          :show-overflow-tooltip="true"
          :render-header="renderHeader"
        >
        </el-table-column>
        <el-table-column
          prop="avgVoltageThdL1"
          :label="rowLabel.avgVoltageThdL1"
          width="170"
          align="center"
          :show-overflow-tooltip="true"
          :render-header="renderHeader"
        >
        </el-table-column>
        <el-table-column
          prop="avgCurrentL1"
          :label="rowLabel.avgCurrentL1"
          width="160"
          align="center"
          :show-overflow-tooltip="true"
          :render-header="renderHeader"
        >
        </el-table-column>
        <el-table-column
          prop="avgCurrentThdL1"
          :label="rowLabel.avgCurrentThdL1"
          width="175"
          align="center"
          :show-overflow-tooltip="true"
          :render-header="renderHeader"
        >
        </el-table-column>
        <el-table-column
          prop="avgVoltageL2L3"
          :label="rowLabel.avgVoltageL2L3"
          width="175"
          align="center"
          :show-overflow-tooltip="true"
          :render-header="renderHeader"
        >
        </el-table-column>
        <el-table-column
          prop="insVoltageThdL2"
          :label="rowLabel.insVoltageThdL2"
          width="170"
          align="center"
          :show-overflow-tooltip="true"
          :render-header="renderHeader"
        >
        </el-table-column>
        <el-table-column
          prop="avgVoltageThdL2"
          :label="rowLabel.avgVoltageThdL2"
          width="170"
          align="center"
          :show-overflow-tooltip="true"
          :render-header="renderHeader"
        >
        </el-table-column>
        <el-table-column
          prop="avgCurrentL2"
          :label="rowLabel.avgCurrentL2"
          width="175"
          align="center"
          :show-overflow-tooltip="true"
          :render-header="renderHeader"
        >
        </el-table-column>
        <el-table-column
          prop="avgCurrentThdL2"
          :label="rowLabel.avgCurrentThdL2"
          width="115"
          align="center"
          :show-overflow-tooltip="true"
          :render-header="renderHeader"
        >
        </el-table-column>
        <el-table-column
          prop="avgVoltageL3L1"
          :label="rowLabel.avgVoltageL3L1"
          width="175"
          align="center"
          :show-overflow-tooltip="true"
          :render-header="renderHeader"
        >
        </el-table-column>
        <el-table-column
          prop="insVoltageThdL3"
          :label="rowLabel.insVoltageThdL3"
          width="175"
          align="center"
          :show-overflow-tooltip="true"
          :render-header="renderHeader"
        >
        </el-table-column>
        <el-table-column
          prop="avgVoltageThdL3"
          :label="rowLabel.avgVoltageThdL3"
          width="175"
          align="center"
          :show-overflow-tooltip="true"
          :render-header="renderHeader"
        >
        </el-table-column>
        <el-table-column
          prop="avgCurrentL3"
          :label="rowLabel.avgCurrentL3"
          width="160"
          align="center"
          :show-overflow-tooltip="true"
          :render-header="renderHeader"
        >
        </el-table-column>
        <el-table-column
          prop="avgCurrentThdL3"
          :label="rowLabel.avgCurrentThdL3"
          width="175"
          align="center"
          :show-overflow-tooltip="true"
          :render-header="renderHeader"
        >
        </el-table-column>
      </el-table>
      <pagination v-show="total>=0" :total="total" :page.sync="query.page" :limit.sync="query.limit" @pagination="getList" style="margin-top: 5px" />
    </div>
  </basic-container>
</template>

<script>
  import { queryDetail, orgType, filterData } from '@/api/dataQuery/avgVoltageCurrentQuery'
  import ExportBtn from "@/components/export-btn/export-btn";
  import Pagination from '@/components/Pagination'
  import QueryBar from './queryBar'
  export default {
    name: "avgvoltagecurrentquery",
    components: {
      ExportBtn,
      Pagination,
      QueryBar
    },
    data() {
      return {
        format: "yyyy-MM-dd HH:mm",
        type: "datetime",
        listLoading: false,
        list:null,
        tableHeight:window.innerHeight - 360,
        total: 0,
        tableData: [],
        rowLabel: {
          index: this.$t('avgVoltageCurrentQuery.no'),
          meterName: this.$t('meterevent.metername'),
          dataTime: this.$t('avgVoltageCurrentQuery.dataTime'),
          avgVoltageL1L2: this.$t('avgVoltageCurrentQuery.AVGVoltageL1L2'),
          insVoltageThdL1: this.$t('avgVoltageCurrentQuery.INSVoltageTHDL1'),
          avgVoltageThdL1: this.$t('avgVoltageCurrentQuery.AVGVoltageTHDL1'),
          avgCurrentL1: this.$t('avgVoltageCurrentQuery.AVGCurrentL1'),
          avgCurrentThdL1: this.$t('avgVoltageCurrentQuery.AVGCurrentTHDL1'),
          avgVoltageL2L3: this.$t('avgVoltageCurrentQuery.AVGVoltageL2L3'),
          insVoltageThdL2: this.$t('avgVoltageCurrentQuery.INSVoltageTHDL2'),
          avgVoltageThdL2: this.$t('avgVoltageCurrentQuery.AVGVoltageTHDL2'),
          avgCurrentL2: this.$t('avgVoltageCurrentQuery.AVGCurrentL2'),
          avgCurrentThdL2: this.$t('avgVoltageCurrentQuery.AVGCurrentTHDL2'),
          avgVoltageL3L1: this.$t('avgVoltageCurrentQuery.AVGVoltageL3L1'),
          insVoltageThdL3: this.$t('avgVoltageCurrentQuery.INSVoltageTHDL3'),
          avgVoltageThdL3: this.$t('avgVoltageCurrentQuery.AVGVoltageTHDL3'),
          avgCurrentL3: this.$t('avgVoltageCurrentQuery.AVGCurrentL3'),
          avgCurrentThdL3: this.$t('avgVoltageCurrentQuery.AVGCurrentTHDL3'),
        },
        dialogVisible: false,
        query:{
          page: 1,
          limit: 20
        },
        inputMeterName: this.$t('avgVoltageCurrentQuery.inputMeterName'),
        filterValue: [],
        options: [],
        params: {
          objectNo: "",
          objectName: "",
          objectType: "",
          startDate: "",
          endDate: ""
        },
        exportData: {},
        objectName: ""
      }
    },
    computed: {},
    created() {
      this.getList();
    },
    methods: {
      onSubmit(data) {
        this.params = data;
        if (this.params.objectNo !== "" || this.params.objectType !== "") {
          if (this.params.objectType === "mru") {
            let params = {
              orgId: this.params.objectNo
            };
            orgType(params).then(res => {
              if (res.data.data === "05") {
                this.listLoading = true;
                this.getList();
                this.getFilterData();
              }else {
                this.$alert(this.$t('avgVoltageCurrentQuery.error'), this.$t('avgVoltageCurrentQuery.tip'), {
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
          this.$alert(this.$t('avgVoltageCurrentQuery.error'), this.$t('avgVoltageCurrentQuery.tip'), {
            confirmButtonText: this.$t('global.confirm')
          });
        }
      },
      getList() {
        this.getParams();
        queryDetail(this.params).then(res => {
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
      },
      // 所有电表的id,名称
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
      getParams() {
        let type;
        if (this.params.objectType === "NB Meter" || this.params.objectType === "4G Meter" || this.params.objectType === "DCU" || this.params.objectType === "tmnl") {
          type = "tmnl"
        }else if (this.params.objectType === "mru"){
          type = "mru";
        }else {
          type = "meter"
        }
        this.params = {
          objectNo: this.params.objectNo,
          objectType: type,
          startDate: this.params.startDate,
          endDate: this.params.endDate,
          page: this.query.page,
          limit: this.query.limit,
        };
      },
      renderHeader(h, { column, $index }) {
        let label = column.label;
        if (label === this.$t('avgVoltageCurrentQuery.dataTime')){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "Current date/time\n0-0:1.0.0.255"
              }
            }
          },label)
        }else if (label === this.$t('avgVoltageCurrentQuery.status')) {
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "Status Information\n0.0.96.5.0.255"
              }
            }
          },label)
        }else if (label === this.$t('avgVoltageCurrentQuery.AVGVoltageL1L2')) {
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "Average voltage L1-L2\n1-0:32.128.0.255"
              }
            }
          },label)
        }else if (label === this.$t('avgVoltageCurrentQuery.INSVoltageTHDL1')) {
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "Instantaneous voltage THD L1\n1-0:32.7.124.255"
              }
            }
          },label)
        }else if (label === this.$t('avgVoltageCurrentQuery.AVGVoltageTHDL1')) {
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "L1 Phase average voltage THD\n1-63:32.24.124.255"
              }
            }
          },label)
        }else if (label === this.$t('avgVoltageCurrentQuery.AVGCurrentL1')) {
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "Average current L1\n1-0:31.5.0.255"
              }
            }
          },label)
        }else if (label === this.$t('avgVoltageCurrentQuery.AVGCurrentTHDL1')) {
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "L1 Phase average current THD\n1-63:31.24.124.255"
              }
            }
          },label)
        }else if (label === this.$t('avgVoltageCurrentQuery.AVGVoltageL2L3')) {
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "Average voltage L2-L3\n1-0:52.128.0.255"
              }
            }
          },label)
        }else if (label === this.$t('avgVoltageCurrentQuery.INSVoltageTHDL2')) {
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "Instantaneous voltage THD L3\n1-0:52.7.124.255"
              }
            }
          },label)
        }else if (label === this.$t('avgVoltageCurrentQuery.AVGVoltageTHDL2')) {
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "L2 Phase average voltage THD\n1-63:52.24.124.255"
              }
            }
          },label)
        }else if (label === this.$t('avgVoltageCurrentQuery.AVGCurrentL2')) {
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "Average current L2\n1-0:51.5.0.255"
              }
            }
          },label)
        }else if (label === this.$t('avgVoltageCurrentQuery.AVGCurrentTHDL2')) {
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "L2 Phase average current THD\n1-63:51.24.124.255"
              }
            }
          },label)
        }else if (label === this.$t('avgVoltageCurrentQuery.AVGVoltageL3L1')) {
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "Average voltage L3-L1\n1-0:72.128.0.255"
              }
            }
          },label)
        }else if (label === this.$t('avgVoltageCurrentQuery.INSVoltageTHDL3')) {
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "Instantaneous voltage THD L3\n1-0:72.7.124.255"
              }
            }
          },label)
        }else if (label === this.$t('avgVoltageCurrentQuery.AVGVoltageTHDL3')) {
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "L3 Phase average voltage THD\n1-63:72.24.124.255"
              }
            }
          },label)
        }else if (label === this.$t('avgVoltageCurrentQuery.AVGCurrentL3')) {
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "Average current L3\n1-0:71.5.0.255"
              }
            }
          },label)
        }else if (label === this.$t('avgVoltageCurrentQuery.AVGCurrentTHDL3')) {
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "L3 Phase average current THD\n1-63:71.24.124.255"
              }
            }
          },label)
        }else {
          return label;
        }


      },
      getIndex($index) {
        //表格序号
        return (this.query.page - 1) * this.query.limit + $index + 1
      },
      filterBtn() {
        if (this.filterValue.length !== 0) {
          this.getParams();
          this.listLoading = true;
          this.params.objectNo = "";
          for (let i = 0; i < this.filterValue.length; i++) {
            if (i === this.filterValue.length - 1) {
              this.params.objectNo = this.params.objectNo + this.filterValue[i]
            }else {
              this.params.objectNo = this.params.objectNo + this.filterValue[i] + ','
            }
          }
          this.params.objectType = "meter";
          queryDetail(this.params).then(res => {
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
          this.$alert(this.$t('avgVoltageCurrentQuery.filterTip'), this.$t('avgVoltageCurrentQuery.tip'), {
            confirmButtonText: this.$t('global.confirm')
          });
        }
      },
      getExportData() {
        let columns = {...this.rowLabel};
        delete columns["index"];
        this.getParams();
        this.exportData = {
          url: "/api/ami-dataquery/avgVolCurve/queryDetail",
          params: this.params,
          columns: columns,
          fileName: "avgvolcur-" + this.params.objectType + "-" + this.objectName, // avgvolcur- + 对象类型- +对象名称命名
          sheetName: this.$t('avgVoltageCurrentQuery.sheetName'),
        };
      }
    },
    mounted() {},
    watch: {
      '$store.state.common.treeNode': function (data) {
        this.tableData = [];
        this.options = [];
        this.filterValue = [];
        this.total = 0;
        this.objectName = data.deviceName;
      }
    }
  };
</script>

<style scoped>
</style>
