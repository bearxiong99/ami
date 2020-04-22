<template>
  <basic-container>
    <!-- 查询栏 -->
    <queryBar @onSubmit="onSubmit" :format="format" :type="type"/>

    <div>
      <!--导出按钮-->
      <export-btn :style="{float: 'left', marginBottom:'5px'}" :exportData="exportData" @getExportData="getExportData"/>
      <!--筛选框 -->
      <div :style="{float: 'right'}">
        <span>{{this.$t('touQuery.filter')}}</span>
        <el-select
          v-model="filterValue"
          filterable
          multiple
          collapse-tags
          style="margin:0 20px 0 20px;width: 260px"
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
          width="170"
          align="center"
          :show-overflow-tooltip="true"
          :render-header="renderHeader"
        >
        </el-table-column>
        <el-table-column
          prop="status"
          :label="rowLabel.status"
          width="115"
          align="center"
          :show-overflow-tooltip="true"
          :render-header="renderHeader"
        >
        </el-table-column>
        <el-table-column
          prop="importActiveEnergy"
          :label="rowLabel.importActiveEnergy"
          width="115"
          align="center"
          :show-overflow-tooltip="true"
          :render-header="renderHeader"
        >
        </el-table-column>
        <el-table-column
          prop="exportActiveEnergy"
          :label="rowLabel.exportActiveEnergy"
          width="115"
          align="center"
          :show-overflow-tooltip="true"
          :render-header="renderHeader"
        >
        </el-table-column>
        <el-table-column
          prop="importReactiveEnergy"
          :label="rowLabel.importReactiveEnergy"
          width="115"
          align="center"
          :show-overflow-tooltip="true"
          :render-header="renderHeader"
        >
        </el-table-column>
        <el-table-column
          prop="exportReactiveEnergy"
          :label="rowLabel.exportReactiveEnergy"
          width="115"
          align="center"
          :show-overflow-tooltip="true"
          :render-header="renderHeader"
        >
        </el-table-column>
        <el-table-column
          prop="reactiveEnergyQI"
          :label="rowLabel.reactiveEnergyQI"
          width="140"
          align="center"
          :show-overflow-tooltip="true"
          :render-header="renderHeader"
        >
        </el-table-column>
        <el-table-column
          prop="reactiveEnergyQII"
          :label="rowLabel.reactiveEnergyQII"
          width="140"
          align="center"
          :show-overflow-tooltip="true"
          :render-header="renderHeader"
        >
        </el-table-column>
        <el-table-column
          prop="reactiveEnergyQIII"
          :label="rowLabel.reactiveEnergyQIII"
          width="150"
          align="center"
          :show-overflow-tooltip="true"
          :render-header="renderHeader"
        >
        </el-table-column>
        <el-table-column
          prop="reactiveEnergyQIV"
          :label="rowLabel.reactiveEnergyQIV"
          width="150"
          align="center"
          :show-overflow-tooltip="true"
          :render-header="renderHeader"
        >
        </el-table-column>
        <el-table-column
          prop="importApparentEnergy"
          :label="rowLabel.importApparentEnergy"
          width="150"
          align="center"
          :show-overflow-tooltip="true"
          :render-header="renderHeader"
        >
        </el-table-column>
        <el-table-column
          prop="exportApparentEnergy"
          :label="rowLabel.exportApparentEnergy"
          width="150"
          align="center"
          :show-overflow-tooltip="true"
          :render-header="renderHeader"
        >
        </el-table-column>
        <el-table-column
          prop="activeEnergy"
          :label="rowLabel.activeEnergy"
          width="150"
          align="center"
          :show-overflow-tooltip="true"
          :render-header="renderHeader"
        >
        </el-table-column>
        <el-table-column
          prop="importPowerFactor"
          :label="rowLabel.importPowerFactor"
          width="180"
          align="center"
          :show-overflow-tooltip="true"
          :render-header="renderHeader"
        >
        </el-table-column>
        <el-table-column
          prop="importActiveEnergyT1"
          :label="rowLabel.importActiveEnergyT1"
          width="180"
          align="center"
          :show-overflow-tooltip="true"
          :render-header="renderHeader"
        >
        </el-table-column>
        <el-table-column
          prop="exportActiveEnergyT1"
          :label="rowLabel.exportActiveEnergyT1"
          width="180"
          align="center"
          :show-overflow-tooltip="true"
          :render-header="renderHeader"
        >
        </el-table-column>
        <el-table-column
          prop="importReactiveEnergyT1"
          :label="rowLabel.importReactiveEnergyT1"
          width="180"
          align="center"
          :show-overflow-tooltip="true"
          :render-header="renderHeader"
        >
        </el-table-column>
        <el-table-column
          prop="exportReactiveEnergyT1"
          :label="rowLabel.exportReactiveEnergyT1"
          width="180"
          align="center"
          :show-overflow-tooltip="true"
          :render-header="renderHeader"
        >
        </el-table-column>
        <el-table-column
          prop="reactiveEnergyQIT1"
          :label="rowLabel.reactiveEnergyQIT1"
          width="170"
          align="center"
          :show-overflow-tooltip="true"
          :render-header="renderHeader"
        >
        </el-table-column>
        <el-table-column
          prop="reactiveEnergyQIVT1"
          :label="rowLabel.reactiveEnergyQIVT1"
          width="190"
          align="center"
          :show-overflow-tooltip="true"
          :render-header="renderHeader"
        >
        </el-table-column>
        <el-table-column
          prop="importApparentEnergyT1"
          :label="rowLabel.importApparentEnergyT1"
          width="180"
          align="center"
          :show-overflow-tooltip="true"
          :render-header="renderHeader"
        >
        </el-table-column>
        <el-table-column
          prop="exportApparentEnergyT1"
          :label="rowLabel.exportApparentEnergyT1"
          width="180"
          align="center"
          :show-overflow-tooltip="true"
          :render-header="renderHeader"
        >
        </el-table-column>
        <el-table-column
          prop="importPowerFactorT1"
          :label="rowLabel.importPowerFactorT1"
          width="180"
          align="center"
          :show-overflow-tooltip="true"
          :render-header="renderHeader"
        >
        </el-table-column>
        <el-table-column
          prop="importActiveEnergyT2"
          :label="rowLabel.importActiveEnergyT2"
          width="180"
          align="center"
          :show-overflow-tooltip="true"
          :render-header="renderHeader"
        >
        </el-table-column>
        <el-table-column
          prop="exportActiveEnergyT2"
          :label="rowLabel.exportActiveEnergyT2"
          width="180"
          align="center"
          :show-overflow-tooltip="true"
          :render-header="renderHeader"
        >
        </el-table-column>
        <el-table-column
          prop="importReactiveEnergyT2"
          :label="rowLabel.importReactiveEnergyT2"
          width="180"
          align="center"
          :show-overflow-tooltip="true"
          :render-header="renderHeader"
        >
        </el-table-column>
        <el-table-column
          prop="exportReactiveEnergyT2"
          :label="rowLabel.exportReactiveEnergyT2"
          width="180"
          align="center"
          :show-overflow-tooltip="true"
          :render-header="renderHeader"
        >
        </el-table-column>
        <el-table-column
          prop="reactiveEnergyQIT2"
          :label="rowLabel.reactiveEnergyQIT2"
          width="180"
          align="center"
          :show-overflow-tooltip="true"
          :render-header="renderHeader"
        >
        </el-table-column>
        <el-table-column
          prop="reactiveEnergyQIVT2"
          :label="rowLabel.reactiveEnergyQIVT2"
          width="180"
          align="center"
          :show-overflow-tooltip="true"
          :render-header="renderHeader"
        >
        </el-table-column>
        <el-table-column
          prop="importApparentEnergyT2"
          :label="rowLabel.importApparentEnergyT2"
          width="180"
          align="center"
          :show-overflow-tooltip="true"
          :render-header="renderHeader"
        >
        </el-table-column>
        <el-table-column
          prop="exportApparentEnergyT2"
          :label="rowLabel.exportApparentEnergyT2"
          width="180"
          align="center"
          :show-overflow-tooltip="true"
          :render-header="renderHeader"
        >
        </el-table-column>
        <el-table-column
          prop="importPowerFactorT2"
          :label="rowLabel.importPowerFactorT2"
          width="180"
          align="center"
          :show-overflow-tooltip="true"
          :render-header="renderHeader"
        >
        </el-table-column>
        <el-table-column
          prop="importActiveEnergyT3"
          :label="rowLabel.importActiveEnergyT3"
          width="180"
          align="center"
          :show-overflow-tooltip="true"
          :render-header="renderHeader"
        >
        </el-table-column>
        <el-table-column
          prop="exportActiveEnergyT3"
          :label="rowLabel.exportActiveEnergyT3"
          width="180"
          align="center"
          :show-overflow-tooltip="true"
          :render-header="renderHeader"
        >
        </el-table-column>
        <el-table-column
          prop="importReactiveEnergyT3"
          :label="rowLabel.importReactiveEnergyT3"
          width="180"
          align="center"
          :show-overflow-tooltip="true"
          :render-header="renderHeader"
        >
        </el-table-column>
        <el-table-column
          prop="exportReactiveEnergyT3"
          :label="rowLabel.exportReactiveEnergyT3"
          width="180"
          align="center"
          :show-overflow-tooltip="true"
          :render-header="renderHeader"
        >
        </el-table-column>
        <el-table-column
          prop="reactiveEnergyQIT3"
          :label="rowLabel.reactiveEnergyQIT3"
          width="180"
          align="center"
          :show-overflow-tooltip="true"
          :render-header="renderHeader"
        >
        </el-table-column>
        <el-table-column
          prop="reactiveEnergyQIVT3"
          :label="rowLabel.reactiveEnergyQIVT3"
          width="180"
          align="center"
          :show-overflow-tooltip="true"
          :render-header="renderHeader"
        >
        </el-table-column>
        <el-table-column
          prop="importApparentEnergyT3"
          :label="rowLabel.importApparentEnergyT3"
          width="180"
          align="center"
          :show-overflow-tooltip="true"
          :render-header="renderHeader"
        >
        </el-table-column>
        <el-table-column
          prop="exportApparentEnergyT3"
          :label="rowLabel.exportApparentEnergyT3"
          width="180"
          align="center"
          :show-overflow-tooltip="true"
          :render-header="renderHeader"
        >
        </el-table-column>
        <el-table-column
          prop="importPowerFactorT3"
          :label="rowLabel.importPowerFactorT3"
          width="180"
          align="center"
          :show-overflow-tooltip="true"
          :render-header="renderHeader"
        >
        </el-table-column>
        <el-table-column
          prop="l1ImportActiveEnery"
          :label="rowLabel.l1ImportActiveEnergy"
          width="180"
          align="center"
          :show-overflow-tooltip="true"
          :render-header="renderHeader"
        >
        </el-table-column>
        <el-table-column
          prop="l1ExportActiveEnergy"
          :label="rowLabel.l1ExportActiveEnergy"
          width="180"
          align="center"
          :show-overflow-tooltip="true"
          :render-header="renderHeader"
        >
        </el-table-column>
        <el-table-column
          prop="l1ImportReactiveEnergy"
          :label="rowLabel.l1ImportReactiveEnergy"
          width="180"
          align="center"
          :show-overflow-tooltip="true"
          :render-header="renderHeader"
        >
        </el-table-column>
        <el-table-column
          prop="l1ExportReactiveEnergy"
          :label="rowLabel.l1ExportReactiveEnergy"
          width="180"
          align="center"
          :show-overflow-tooltip="true"
          :render-header="renderHeader"
        >
        </el-table-column>
        <el-table-column
          prop="l1ReactiveEnergyQI"
          :label="rowLabel.l1ReactiveEnergyQI"
          width="180"
          align="center"
          :show-overflow-tooltip="true"
          :render-header="renderHeader"
        >
        </el-table-column>
        <el-table-column
          prop="l1ReactiveEnergyQII"
          :label="rowLabel.l1ReactiveEnergyQII"
          width="180"
          align="center"
          :show-overflow-tooltip="true"
          :render-header="renderHeader"
        >
        </el-table-column>
        <el-table-column
          prop="l1ReactiveEnergyQIII"
          :label="rowLabel.l1ReactiveEnergyQIII"
          width="180"
          align="center"
          :show-overflow-tooltip="true"
          :render-header="renderHeader"
        >
        </el-table-column>
        <el-table-column
          prop="l1ReactiveEnergyQIV"
          :label="rowLabel.l1ReactiveEnergyQIV"
          width="180"
          align="center"
          :show-overflow-tooltip="true"
          :render-header="renderHeader"
        >
        </el-table-column>
        <el-table-column
          prop="l1ImportApparentEnergy"
          :label="rowLabel.l1ImportApparentEnergy"
          width="180"
          align="center"
          :show-overflow-tooltip="true"
          :render-header="renderHeader"
        >
        </el-table-column>
        <el-table-column
          prop="l1ExportApparentEnergy"
          :label="rowLabel.l1ExportApparentEnergy"
          width="180"
          align="center"
          :show-overflow-tooltip="true"
          :render-header="renderHeader"
        >
        </el-table-column>
        <el-table-column
          prop="l2ImportActiveEnergy"
          :label="rowLabel.l2ImportActiveEnergy"
          width="180"
          align="center"
          :show-overflow-tooltip="true"
          :render-header="renderHeader"
        >
        </el-table-column>
        <el-table-column
          prop="l2ExportActiveEnergy"
          :label="rowLabel.l2ExportActiveEnergy"
          width="180"
          align="center"
          :show-overflow-tooltip="true"
          :render-header="renderHeader"
        >
        </el-table-column>
        <el-table-column
          prop="l2ImportReactiveEnergy"
          :label="rowLabel.l2ImportReactiveEnergy"
          width="180"
          align="center"
          :show-overflow-tooltip="true"
          :render-header="renderHeader"
        >
        </el-table-column>
        <el-table-column
          prop="l2ExportReactiveEnergy"
          :label="rowLabel.l2ExportReactiveEnergy"
          width="180"
          align="center"
          :show-overflow-tooltip="true"
          :render-header="renderHeader"
        >
        </el-table-column>
        <el-table-column
          prop="l2ReactiveEnergyQI"
          :label="rowLabel.l2ReactiveEnergyQI"
          width="180"
          align="center"
          :show-overflow-tooltip="true"
          :render-header="renderHeader"
        >
        </el-table-column>
        <el-table-column
          prop="l2ReactiveEnergyQII"
          :label="rowLabel.l2ReactiveEnergyQII"
          width="180"
          align="center"
          :show-overflow-tooltip="true"
          :render-header="renderHeader"
        >
        </el-table-column>
        <el-table-column
          prop="l2ReactiveEnergyQIII"
          :label="rowLabel.l2ReactiveEnergyQIII"
          width="180"
          align="center"
          :show-overflow-tooltip="true"
          :render-header="renderHeader"
        >
        </el-table-column>
        <el-table-column
          prop="l2ReactiveEnergyQIV"
          :label="rowLabel.l2ReactiveEnergyQIV"
          width="180"
          align="center"
          :show-overflow-tooltip="true"
          :render-header="renderHeader"
        >
        </el-table-column>
        <el-table-column
          prop="l2ImportApparentEnergy"
          :label="rowLabel.l2ImportApparentEnergy"
          width="180"
          align="center"
          :show-overflow-tooltip="true"
          :render-header="renderHeader"
        >
        </el-table-column>
        <el-table-column
          prop="l2ExportApparentEnergy"
          :label="rowLabel.l2ExportApparentEnergy"
          width="180"
          align="center"
          :show-overflow-tooltip="true"
          :render-header="renderHeader"
        >
        </el-table-column>
        <el-table-column
          prop="l3ImportActiveEnergy"
          :label="rowLabel.l3ImportActiveEnergy"
          width="180"
          align="center"
          :show-overflow-tooltip="true"
          :render-header="renderHeader"
        >
        </el-table-column>
        <el-table-column
          prop="l3ExportActiveEnergy"
          :label="rowLabel.l3ExportActiveEnergy"
          width="180"
          align="center"
          :show-overflow-tooltip="true"
          :render-header="renderHeader"
        >
        </el-table-column>
        <el-table-column
          prop="l3ImportReactiveEnergy"
          :label="rowLabel.l3ImportReactiveEnergy"
          width="180"
          align="center"
          :show-overflow-tooltip="true"
          :render-header="renderHeader"
        >
        </el-table-column>
        <el-table-column
          prop="l3ExportReactiveEnergy"
          :label="rowLabel.l3ExportReactiveEnergy"
          width="180"
          align="center"
          :show-overflow-tooltip="true"
          :render-header="renderHeader"
        >
        </el-table-column>
        <el-table-column
          prop="l3ReactiveEnergyQI"
          :label="rowLabel.l3ReactiveEnergyQI"
          width="180"
          align="center"
          :show-overflow-tooltip="true"
          :render-header="renderHeader"
        >
        </el-table-column>
        <el-table-column
          prop="l3ReactiveEnergyQII"
          :label="rowLabel.l3ReactiveEnergyQII"
          width="180"
          align="center"
          :show-overflow-tooltip="true"
          :render-header="renderHeader"
        >
        </el-table-column>
        <el-table-column
          prop="l3ReactiveEnergyQIII"
          :label="rowLabel.l3ReactiveEnergyQIII"
          width="180"
          align="center"
          :show-overflow-tooltip="true"
          :render-header="renderHeader"
        >
        </el-table-column>
        <el-table-column
          prop="l3ReactiveEnergyQIV"
          :label="rowLabel.l3ReactiveEnergyQIV"
          width="180"
          align="center"
          :show-overflow-tooltip="true"
          :render-header="renderHeader"
        >
        </el-table-column>
        <el-table-column
          prop="l3ImportApparentEnergy"
          :label="rowLabel.l3ImportApparentEnergy"
          width="180"
          align="center"
          :show-overflow-tooltip="true"
          :render-header="renderHeader"
        >
        </el-table-column>
        <el-table-column
          prop="l3ExportApparentEnergy"
          :label="rowLabel.l3ExportApparentEnergy"
          width="180"
          align="center"
          :show-overflow-tooltip="true"
          :render-header="renderHeader"
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
  import { queryDetail, filterData } from '@/api/dataQuery/touQuery'
  export default {
    name: "touquery",
    components: {
      ExportBtn,
      Pagination,
      QueryBar
    },
    data() {
      return {
        flag: true, // 用于控制过滤还是查询
        format: "yyyy-MM-dd",
        type: "date",
        params: {
          objectNo: "",
          objectName: "",
          objectType: "",
          startDate: "",
          endDate: ""
        },
        // 导出按钮弹出框
        dialogVisible: false,
        exportData: {},
        // 过滤框
        inputMeterName: this.$t('touQuery.inputMeterName'),
        filterValue: [],
        options: [],
        // 表格
        listLoading: false,
        filterData: [],
        tableHeight:window.innerHeight - 360,
        total: 0,
        tableData: [],
        rowLabel: {
          index: this.$t('touQuery.no'),
          meterName: this.$t('meterevent.metername'),
          dataTime: this.$t('touQuery.dataTime'),
          status: this.$t('touQuery.status'),
          importActiveEnergy: this.$t('touQuery.importActiveEnergy'),
          exportActiveEnergy: this.$t('touQuery.exportActiveEnergy'),
          importReactiveEnergy: this.$t('touQuery.importReactiveEnergy'),
          exportReactiveEnergy: this.$t('touQuery.exportReactiveEnergy'),
          reactiveEnergyQI: this.$t('touQuery.reactiveEnergyQI'),
          reactiveEnergyQII: this.$t('touQuery.reactiveEnergyQII'),
          reactiveEnergyQIII: this.$t('touQuery.reactiveEnergyQIII'),
          reactiveEnergyQIV: this.$t('touQuery.reactiveEnergyQIV'),
          importApparentEnergy: this.$t('touQuery.importApparentEnergy'),
          exportApparentEnergy: this.$t('touQuery.exportApparentEnergy'),
          activeEnergy: this.$t('touQuery.activeEnergy'),
          importPowerFactor: this.$t('touQuery.importPowerFactor'),
          importActiveEnergyT1: this.$t('touQuery.importActiveEnergyT1'),
          exportActiveEnergyT1: this.$t('touQuery.exportActiveEnergyT1'),
          importReactiveEnergyT1: this.$t('touQuery.importReactiveEnergyT1'),
          exportReactiveEnergyT1: this.$t('touQuery.exportReactiveEnergyT1'),
          reactiveEnergyQIT1: this.$t('touQuery.reactiveEnergyQIT1'),
          reactiveEnergyQIVT1: this.$t('touQuery.reactiveEnergyQIVT1'),
          importApparentEnergyT1: this.$t('touQuery.importApparentEnergyT1'),
          exportApparentEnergyT1: this.$t('touQuery.exportApparentEnergyT1'),
          importPowerFactorT1: this.$t('touQuery.importPowerFactorT1'),
          importActiveEnergyT2: this.$t('touQuery.importActiveEnergyT2'),
          exportActiveEnergyT2: this.$t('touQuery.exportActiveEnergyT2'),
          importReactiveEnergyT2: this.$t('touQuery.importReactiveEnergyT2'),
          exportReactiveEnergyT2: this.$t('touQuery.exportReactiveEnergyT2'),
          reactiveEnergyQIT2: this.$t('touQuery.reactiveEnergyQIT2'),
          reactiveEnergyQIVT2: this.$t('touQuery.reactiveEnergyQIVT2'),
          importApparentEnergyT2: this.$t('touQuery.importApparentEnergyT2'),
          exportApparentEnergyT2: this.$t('touQuery.exportApparentEnergyT2'),
          importPowerFactorT2: this.$t('touQuery.importPowerFactorT2'),
          importActiveEnergyT3: this.$t('touQuery.importActiveEnergyT3'),
          exportActiveEnergyT3: this.$t('touQuery.exportActiveEnergyT3'),
          importReactiveEnergyT3: this.$t('touQuery.importReactiveEnergyT3'),
          exportReactiveEnergyT3: this.$t('touQuery.exportReactiveEnergyT3'),
          reactiveEnergyQIT3: this.$t('touQuery.reactiveEnergyQIT3'),
          reactiveEnergyQIVT3: this.$t('touQuery.reactiveEnergyQIVT3'),
          importApparentEnergyT3: this.$t('touQuery.importApparentEnergyT3'),
          exportApparentEnergyT3: this.$t('touQuery.exportApparentEnergyT3'),
          importPowerFactorT3: this.$t('touQuery.importPowerFactorT3'),
          // 电表为CT and CTVT增加以下列
          l1ImportActiveEnergy: this.$t('touQuery.l1ImportActiveEnergy'),
          l1ExportActiveEnergy: this.$t('touQuery.l1ExportActiveEnergy'),
          l1ImportReactiveEnergy: this.$t('touQuery.l1ImportReactiveEnergy'),
          l1ExportReactiveEnergy: this.$t('touQuery.l1ExportReactiveEnergy'),
          l1ReactiveEnergyQI: this.$t('touQuery.l1ReactiveEnergyQI'),
          l1ReactiveEnergyQII: this.$t('touQuery.l1ReactiveEnergyQII'),
          l1ReactiveEnergyQIII: this.$t('touQuery.l1ReactiveEnergyQIII'),
          l1ReactiveEnergyQIV: this.$t('touQuery.l1ReactiveEnergyQIV'),
          l1ImportApparentEnergy: this.$t('touQuery.l1ImportApparentEnergy'),
          l1ExportApparentEnergy: this.$t('touQuery.l1ExportApparentEnergy'),
          l2ImportActiveEnergy: this.$t('touQuery.l2ImportActiveEnergy'),
          l2ExportActiveEnergy: this.$t('touQuery.l2ExportActiveEnergy'),
          l2ImportReactiveEnergy: this.$t('touQuery.l2ImportReactiveEnergy'),
          l2ExportReactiveEnergy: this.$t('touQuery.l2ExportReactiveEnergy'),
          l2ReactiveEnergyQI: this.$t('touQuery.l2ReactiveEnergyQI'),
          l2ReactiveEnergyQII: this.$t('touQuery.l2ReactiveEnergyQII'),
          l2ReactiveEnergyQIII: this.$t('touQuery.l2ReactiveEnergyQIII'),
          l2ReactiveEnergyQIV: this.$t('touQuery.l2ReactiveEnergyQIV'),
          l2ImportApparentEnergy: this.$t('touQuery.l2ImportApparentEnergy'),
          l2ExportApparentEnergy: this.$t('touQuery.l2ExportApparentEnergy'),
          l3ImportActiveEnergy: this.$t('touQuery.l3ImportActiveEnergy'),
          l3ExportActiveEnergy: this.$t('touQuery.l3ExportActiveEnergy'),
          l3ImportReactiveEnergy: this.$t('touQuery.l3ImportReactiveEnergy'),
          l3ExportReactiveEnergy: this.$t('touQuery.l3ExportReactiveEnergy'),
          l3ReactiveEnergyQI: this.$t('touQuery.l3ReactiveEnergyQI'),
          l3ReactiveEnergyQII: this.$t('touQuery.l3ReactiveEnergyQII'),
          l3ReactiveEnergyQIII: this.$t('touQuery.l3ReactiveEnergyQIII'),
          l3ReactiveEnergyQIV: this.$t('touQuery.l3ReactiveEnergyQIV'),
          l3ImportApparentEnergy: this.$t('touQuery.l3ImportApparentEnergy'),
          l3ExportApparentEnergy: this.$t('touQuery.l3ExportApparentEnergy'),
        },
        query:{
          page: 1,
          limit: 20
        },
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
                this.$alert(this.$t('touQuery.error'), this.$t('touQuery.tip'), {
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
          this.$alert(this.$t('touQuery.error'), this.$t('touQuery.tip'), {
            confirmButtonText: this.$t('global.confirm')
          });
        }
      },
      getList() {
        this.flag = true;
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
        }else if ($index === 4){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Import active energy (QI+QIV) [Total]\n1-0:1.8.0.255"
              }
            }
          },label)
        }else if ($index === 5){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Export active energy (QII+QIII) [Total]\n1-0:2.8.0.255"
              }
            }
          },label)
        }else if ($index === 6){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Import reactive energy (QI+QII) [Total]\n1-0:3.8.0.255"
              }
            }
          },label)
        }else if ($index === 7){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Export reactive energy (QIII+QIV) [Total]\n1-0:4.8.0.255"
              }
            }
          },label)
        }else if ($index === 8){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Reactive energy (QI) [Total]\n1-0:5.8.0.255"
              }
            }
          },label)
        }else if ($index === 9){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Reactive energy (QII) [Total]\n1-0:6.8.0.255"
              }
            }
          },label)
        }else if ($index === 10){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Reactive energy (QIII) [Total]\n1-0:7.8.0.255"
              }
            }
          },label)
        }else if ($index === 11){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Reactive energy (QIV) [Total]\n1-0:8.8.0.255"
              }
            }
          },label)
        }else if ($index === 12){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Import apparent energy (QI+QIV) [Total]\n1-0:9.8.0.255"
              }
            }
          },label)
        }else if ($index === 13){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "Export apparent energy (QII+QIII) [Total]\n1-0:10.8.0.255"
              }
            }
          },label)
        }else if ($index === 14){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Active energy (abs(QI+QIV)+(abs(QII+QIII)) [Total]\n1-0:15.8.0.255"
              }
            }
          },label)
        }else if ($index === 15){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Average import power factor [Total]\n1-0:13.0.0.255"
              }
            }
          },label)
        }else if ($index === 16){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Import active energy (QI+QIV) [Tariff 1]\n1-0:1.8.1.255"
              }
            }
          },label)
        }else if ($index === 17){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Export active energy (QII+QIII) [Tariff 1]\n1-0:2.8.1.255"
              }
            }
          },label)
        }else if ($index === 18){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Import reactive energy (QI+QII) [Tariff 1]\n1-0:3.8.1.255"
              }
            }
          },label)
        }else if ($index === 19){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Export reactive energy (QIII+QIV) [Tariff 1]\n1-0:4.8.1.255"
              }
            }
          },label)
        }else if ($index === 20){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Reactive energy (QI) [Tariff 1]\n1-0:5.8.1.255"
              }
            }
          },label)
        }else if ($index === 21){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Reactive energy (QIV) [Tariff 1]\n1-0:8.8.1.255"
              }
            }
          },label)
        }else if ($index === 22){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Import apparent energy (QI+QIV) [Tariff 1]\n1-0:9.8.1.255"
              }
            }
          },label)
        }else if ($index === 23){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "Export apparent energy (QII+QIII) [Tariff 1]\n1-0:10.8.1.255"
              }
            }
          },label)
        }else if ($index === 24){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Average import power factor [Tariff 1]\n1-0:13.0.1.255"
              }
            }
          },label)
        }else if ($index === 25){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Import active energy (QI+QIV) [Tariff 2]\n1-0:1.8.2.255"
              }
            }
          },label)
        }else if ($index === 26){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Export active energy (QII+QIII) [Tariff 2]\n1-0:2.8.2.255"
              }
            }
          },label)
        }else if ($index === 27){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Import reactive energy (QI+QII) [Tariff 2]\n1-0:3.8.2.255"
              }
            }
          },label)
        }else if ($index === 28){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Export reactive energy (QIII+QIV) [Tariff 2]\n1-0:4.8.2.255"
              }
            }
          },label)
        }else if ($index === 29){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Reactive energy (QI) [Tariff 2]\n1-0:5.8.2.255"
              }
            }
          },label)
        }else if ($index === 30){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Reactive energy (QIV) [Tariff2]\n1-0:8.8.2.255"
              }
            }
          },label)
        }else if ($index === 31){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Import apparent energy (QI+QIV) [Tariff 2]\n1-0:9.8.2.255"
              }
            }
          },label)
        }else if ($index === 32){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "Export apparent energy (QII+QIII) [Tariff 2]\n1-0:10.8.2.255"
              }
            }
          },label)
        }else if ($index === 33){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Average import power factor [Tariff 2]\n1-0:13.0.2.255"
              }
            }
          },label)
        }else if ($index === 34){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Import active energy (QI+QIV) [Tariff 3]\n1-0:1.8.3.255"
              }
            }
          },label)
        }else if ($index === 35){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Export active energy (QII+QIII) [Tariff 3]\n1-0:2.8.3.255"
              }
            }
          },label)
        }else if ($index === 36){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Import reactive energy (QI+QII) [Tariff 3]\n1-0:3.8.3.255"
              }
            }
          },label)
        }else if ($index === 37){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Export reactive energy (QIII+QIV) [Tariff 3]\n1-0:4.8.3.255"
              }
            }
          },label)
        }else if ($index === 38){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Reactive energy (QI) [Tariff 3]\n1-0:5.8.3.255"
              }
            }
          },label)
        }else if ($index === 39){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Reactive energy (QIV) [Tariff3]\n1-0:8.8.3.255"
              }
            }
          },label)
        }else if ($index === 40){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Import apparent energy (QI+QIV) [Tariff 3]\n1-0:9.8.3.255"
              }
            }
          },label)
        }else if ($index === 41){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "Export apparent energy (QII+QIII) [Tariff 3]\n1-0:10.8.3.255"
              }
            }
          },label)
        }else if ($index === 42){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Average import power factor [Tariff 3]\n1-0:13.0.3.255"
              }
            }
          },label)
        }else if ($index === 43){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "L1 Import active energy (QI+QIV) [Total]\n1-0:21.8.0.255"
              }
            }
          },label)
        }else if ($index === 44){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "L1 Export active energy (QII+QIII) [Total]\n1-0:22.8.0.255"
              }
            }
          },label)
        }else if ($index === 45){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "L1 Import reactive energy (QI+QII) [Total]\n1-0:23.8.0.255"
              }
            }
          },label)
        }else if ($index === 46){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "L1 Export reactive energy (QIII+QIV) [Total]\n1-0:24.8.0.255"
              }
            }
          },label)
        }else if ($index === 47){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "L1 Reactive energy (QI) [Total]\n1-0:25.8.0.255"
              }
            }
          },label)
        }else if ($index === 48){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "L1 Reactive energy (QII) [Total]\n1-0:26.8.0.255"
              }
            }
          },label)
        }else if ($index === 49){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "L1 Reactive energy (QIII) [Total]\n1-0:27.8.0.255"
              }
            }
          },label)
        }else if ($index === 50){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Reactive energy (QIV) [Total]\n1-0:28.8.0.255"
              }
            }
          },label)
        }else if ($index === 51){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "L1 Import apparent energy (QI+QIV) [Total]\n1-0:29.8.0.255"
              }
            }
          },label)
        }else if ($index === 52){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "Export apparent energy (QII+QIII) [Total]\n1-0:30.8.0.255"
              }
            }
          },label)
        }else if ($index === 53){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "L2 Import active energy (QI+QIV) [Total]\n1-0:41.8.0.255"
              }
            }
          },label)
        }else if ($index === 54){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "L2 Export active energy (QII+QIII) [Total]\n1-0:42.8.0.255"
              }
            }
          },label)
        }else if ($index === 55){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "L2 Import reactive energy (QI+QII) [Total]\n1-0:43.8.0.255"
              }
            }
          },label)
        }else if ($index === 56){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "L2 Export reactive energy (QIII+QIV) [Total]\n1-0:44.8.0.255"
              }
            }
          },label)
        }else if ($index === 57){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "L2 Reactive energy (QI) [Total]\n1-0:45.8.0.255"
              }
            }
          },label)
        }else if ($index === 58){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "L2 Reactive energy (QII) [Total]\n1-0:46.8.0.255"
              }
            }
          },label)
        }else if ($index === 59){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "L2 Reactive energy (QIII) [Total]\n1-0:47.8.0.255"
              }
            }
          },label)
        }else if ($index === 60){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "L2 Reactive energy (QIV) [Total]\n1-0:48.8.0.255"
              }
            }
          },label)
        }else if ($index === 61){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "L2 Import apparent energy (QI+QIV) [Total]\n1-0:49.8.0.255"
              }
            }
          },label)
        }else if ($index === 62){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "Export apparent energy (QII+QIII) [Total]\n1-0:50.8.0.255"
              }
            }
          },label)
        }else if ($index === 63){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "L3 Import active energy (QI+QIV) [Total]\n1-0:61.8.0.255"
              }
            }
          },label)
        }else if ($index === 64){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "L3 Export active energy (QII+QIII) [Total]\n1-0:62.8.0.255"
              }
            }
          },label)
        }else if ($index === 65){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "L3 Import reactive energy (QI+QII) [Total]\n1-0:63.8.0.255"
              }
            }
          },label)
        }else if ($index === 66){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "L3 Export reactive energy (QIII+QIV) [Total]\n1-0:64.8.0.255"
              }
            }
          },label)
        }else if ($index === 67){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "L3 Reactive energy (QI) [Total]\n1-0:65.8.0.255"
              }
            }
          },label)
        }else if ($index === 68){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "L3 Reactive energy (QII) [Total]\n1-0:66.8.0.255"
              }
            }
          },label)
        }else if ($index === 69){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "L3 Reactive energy (QIII) [Total]\n1-0:67.8.0.255"
              }
            }
          },label)
        }else if ($index === 70){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "L3 Reactive energy (QIV) [Total]\n1-0:68.8.0.255"
              }
            }
          },label)
        }else if ($index === 71){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "L3 Import apparent energy (QI+QIV) [Total]\n1-0:69.8.0.255"
              }
            }
          },label)
        }else if ($index === 72){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "L3 Export apparent energy (QII+QIII) [Total]\n1-0:70.8.0.255"
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
      filterBtn() {
        if (this.filterValue.length !== 0) {
          this.flag = false;
          this.getParams();
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
          params.objectType = "meter";
          queryDetail(params).then(res => {
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
        this.getParams();
        let columns = {...this.rowLabel};
        delete columns["index"];
        this.exportData = {
          url: "/api/ami-dataquery/dailyFreeCurve/queryDetail",
          params: this.params,
          columns: columns,
          fileName: "energyprofile-" + this.params.objectType + "-" + this.objectName + "-"
          + this.params.startDate + "-" + this.params.endDate, // energyprofile- + 对象类型- +对象名称- + 开始时间- + 结束时间命名
          sheetName: this.$t('touQuery.sheetName'),
        };
      },
      pagination() {
        this.flag ? this.getList() : this.filterBtn();
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

<style lang="scss">
  .el-table {
    .el-table__fixed {
      height: auto !important;
      bottom: 20px;
    }
  }
</style>

