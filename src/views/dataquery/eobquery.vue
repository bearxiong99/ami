<template>
  <basic-container>
    <!-- 查询栏 -->
    <!--<queryBar @onSubmit="onSubmit" :format="format"/>-->
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
          type="month"
          :format="format"
          :clearable="clearAble">
        </el-date-picker>
      </el-form-item>
      <el-form-item :label="formLabel.to">
        <el-date-picker
          v-model="formInline.endDate"
          type="month"
          :format="format"
          :clearable="clearAble">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit" icon="el-icon-search">{{formLabel.search}}</el-button>
      </el-form-item>
    </el-form>
    <div>
      <!--导出按钮-->
      <export-btn :style="{float: 'left', marginBottom:'5px'}" v-if=false />
      <!--筛选框 -->
      <div :style="{float: 'right'}">
        <span>{{this.$t('eobQuery.filter')}}</span>
        <el-select
          v-model="filterValue"
          filterable
          multiple
          collapse-tags
          style="margin:0 20px 0 20px;width: 220px"
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
        <!-- Maximum Demand Profile 月最大需量-->
        <el-table-column :label="rowLabel.maximumDemandProfile" align="center" :render-header="renderHeader">
          <el-table-column
            prop="importActiveEnergy"
            :label="rowLabel.importActiveEnergy"
            width="140"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="captureTime1"
            :label="rowLabel.captureTime1"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="exportActiveEnergy"
            :label="rowLabel.exportActiveEnergy"
            width="140"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="captureTime2"
            :label="rowLabel.captureTime2"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="importReactiveEnergy"
            :label="rowLabel.importReactiveEnergy"
            width="140"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="captureTime3"
            :label="rowLabel.captureTime3"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="exportReactiveEnergy"
            :label="rowLabel.exportReactiveEnergy"
            width="140"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="captureTime4"
            :label="rowLabel.captureTime4"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="reactivePowerQI"
            :label="rowLabel.reactivePowerQI"
            width="140"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="captureTime5"
            :label="rowLabel.captureTime5"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="reactivePowerQIV"
            :label="rowLabel.reactivePowerQIV"
            width="140"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="captureTime6"
            :label="rowLabel.captureTime6"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="importApparentPowerQIV"
            :label="rowLabel.importApparentPowerQIV"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="captureTime7"
            :label="rowLabel.captureTime7"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="exportApparentPowerQIV"
            :label="rowLabel.exportApparentPowerQIV"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="captureTime8"
            :label="rowLabel.captureTime8"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="importActiveEnergyT1"
            :label="rowLabel.importActiveEnergyT1"
            width="160"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="captureTime10"
            :label="rowLabel.captureTime10"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="exportActiveEnergyT1"
            :label="rowLabel.exportActiveEnergyT1"
            width="160"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="captureTime11"
            :label="rowLabel.captureTime11"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="importReactiveEnergyT1"
            :label="rowLabel.importReactiveEnergyT1"
            width="160"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="captureTime12"
            :label="rowLabel.captureTime12"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="exportReactiveEnergyT1"
            :label="rowLabel.exportReactiveEnergyT1"
            width="160"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="captureTime13"
            :label="rowLabel.captureTime13"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="reactiveEnergyQIT1"
            :label="rowLabel.reactiveEnergyQIT1"
            width="160"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="captureTime14"
            :label="rowLabel.captureTime14"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="reactiveEnergyQIVT1"
            :label="rowLabel.reactiveEnergyQIVT1"
            width="160"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="captureTime15"
            :label="rowLabel.captureTime15"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="importApparentEnergyT1"
            :label="rowLabel.importApparentEnergyT1"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="captureTime16"
            :label="rowLabel.captureTime16"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="exportApparentEnergyT1"
            :label="rowLabel.exportApparentEnergyT1"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="captureTime17"
            :label="rowLabel.captureTime17"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="importActiveEnergyT2"
            :label="rowLabel.importActiveEnergyT2"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="captureTime18"
            :label="rowLabel.captureTime18"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="exportActiveEnergyT2"
            :label="rowLabel.exportActiveEnergyT2"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="captureTime19"
            :label="rowLabel.captureTime19"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="importReactiveEnergyT2"
            :label="rowLabel.importReactiveEnergyT2"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="captureTime20"
            :label="rowLabel.captureTime20"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="exportReactiveEnergyT2"
            :label="rowLabel.exportReactiveEnergyT2"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="captureTime21"
            :label="rowLabel.captureTime21"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="reactiveEnergyQIT2"
            :label="rowLabel.reactiveEnergyQIT2"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="captureTime22"
            :label="rowLabel.captureTime22"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="reactiveEnergyQIVT2"
            :label="rowLabel.reactiveEnergyQIVT2"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="captureTime23"
            :label="rowLabel.captureTime23"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="importApparentEnergyT2"
            :label="rowLabel.importApparentEnergyT2"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="captureTime24"
            :label="rowLabel.captureTime24"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="exportApparentEnergyT2"
            :label="rowLabel.exportApparentEnergyT2"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="captureTime25"
            :label="rowLabel.captureTime25"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="importActiveEnergyT3"
            :label="rowLabel.importActiveEnergyT3"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="captureTime26"
            :label="rowLabel.captureTime26"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="exportActiveEnergyT3"
            :label="rowLabel.exportActiveEnergyT3"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="captureTime27"
            :label="rowLabel.captureTime27"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="importReactiveEnergyT3"
            :label="rowLabel.importReactiveEnergyT3"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="captureTime28"
            :label="rowLabel.captureTime28"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="exportReactiveEnergyT3"
            :label="rowLabel.exportReactiveEnergyT3"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="captureTime29"
            :label="rowLabel.captureTime29"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="reactiveEnergyQIT3"
            :label="rowLabel.reactiveEnergyQIT3"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="captureTime30"
            :label="rowLabel.captureTime30"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="reactiveEnergyQIVT3"
            :label="rowLabel.reactiveEnergyQIVT3"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="captureTime31"
            :label="rowLabel.captureTime31"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="importApparentEnergyT3"
            :label="rowLabel.importApparentEnergyT3"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="captureTime32"
            :label="rowLabel.captureTime32"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="exportApparentEnergyT3"
            :label="rowLabel.exportApparentEnergyT3"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="captureTime33"
            :label="rowLabel.captureTime33"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
        </el-table-column>
        <!-- Cumulative Maximum Demand Profile 累计最大需量 -->
        <el-table-column :label="rowLabel.cumulativeMaximumDemandProfile" align="center">
          <el-table-column
            prop="importActiveEnergyB"
            :label="rowLabel.importActiveEnergyB"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="exportActiveEnergyB"
            :label="rowLabel.exportActiveEnergyB"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="importReactiveEnergyB"
            :label="rowLabel.importReactiveEnergyB"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="exportReactiveEnergyB"
            :label="rowLabel.exportReactiveEnergyB"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="reactivePowerQIB"
            :label="rowLabel.reactivePowerQIB"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="reactivePowerQIVB"
            :label="rowLabel.reactivePowerQIVB"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="importApparentPowerQIVB"
            :label="rowLabel.importApparentPowerQIVB"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="exportApparentPowerQIVB"
            :label="rowLabel.exportApparentPowerQIVB"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="importActiveEnergyT1B"
            :label="rowLabel.importActiveEnergyT1B"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="exportActiveEnergyT1B"
            :label="rowLabel.exportActiveEnergyT1B"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="importReactiveEnergyT1B"
            :label="rowLabel.importReactiveEnergyT1B"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="exportReactiveEnergyT1B"
            :label="rowLabel.exportReactiveEnergyT1B"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="reactiveEnergyQIT1B"
            :label="rowLabel.reactiveEnergyQIT1B"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="reactiveEnergyQIVT1B"
            :label="rowLabel.reactiveEnergyQIVT1B"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="importApparentEnergyT1B"
            :label="rowLabel.importApparentEnergyT1B"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="exportApparentEnergyT1B"
            :label="rowLabel.exportApparentEnergyT1B"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="importActiveEnergyT2B"
            :label="rowLabel.importActiveEnergyT2B"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="exportActiveEnergyT2B"
            :label="rowLabel.exportActiveEnergyT2B"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="importReactiveEnergyT2B"
            :label="rowLabel.importReactiveEnergyT2B"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="exportReactiveEnergyT2B"
            :label="rowLabel.exportReactiveEnergyT2B"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="reactiveEnergyQIT2B"
            :label="rowLabel.reactiveEnergyQIT2B"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="reactiveEnergyQIVT2B"
            :label="rowLabel.reactiveEnergyQIVT2B"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="importApparentEnergyT2B"
            :label="rowLabel.importApparentEnergyT2B"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="exportApparentEnergyT2B"
            :label="rowLabel.exportApparentEnergyT2B"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="importActiveEnergyT3B"
            :label="rowLabel.importActiveEnergyT3B"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="exportActiveEnergyT3B"
            :label="rowLabel.exportActiveEnergyT3B"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="importReactiveEnergyT3B"
            :label="rowLabel.importReactiveEnergyT3B"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="importApparentEnergyT1B"
            :label="rowLabel.exportReactiveEnergyT3B"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="reactiveEnergyQIT3B"
            :label="rowLabel.reactiveEnergyQIT3B"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="reactiveEnergyQIVT3B"
            :label="rowLabel.reactiveEnergyQIVT3B"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="importApparentEnergyT3B"
            :label="rowLabel.importApparentEnergyT3B"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="exportApparentEnergyT3B"
            :label="rowLabel.exportApparentEnergyT3B"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
        </el-table-column>
        <!-- Energy Profile 瞬时量-->
        <el-table-column :label="rowLabel.energyProfile" align="center">
          <el-table-column
            prop="importActiveEnergyC"
            :label="rowLabel.importActiveEnergyC"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="exportActiveEnergyC"
            :label="rowLabel.exportActiveEnergyC"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="importReactiveEnergyC"
            :label="rowLabel.importReactiveEnergyC"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="exportReactiveEnergyC"
            :label="rowLabel.exportReactiveEnergyC"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="reactivePowerQIC"
            :label="rowLabel.reactivePowerQIC"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="reactivePowerQII"
            :label="rowLabel.reactivePowerQII"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="reactivePowerQIII"
            :label="rowLabel.reactivePowerQIII"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="reactivePowerQIVC"
            :label="rowLabel.reactivePowerQIVC"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="importApparentEnergy"
            :label="rowLabel.importApparentEnergy"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="exportApparentEnergy"
            :label="rowLabel.exportApparentEnergy"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="activeEnergy"
            :label="rowLabel.activeEnergy"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="importPowerFactor"
            :label="rowLabel.importPowerFactor"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="importActiveEnergyT1C"
            :label="rowLabel.importActiveEnergyT1C"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="exportActiveEnergyT1C"
            :label="rowLabel.exportActiveEnergyT1C"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="importReactiveEnergyT1C"
            :label="rowLabel.importReactiveEnergyT1C"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="exportReactiveEnergyT1C"
            :label="rowLabel.exportReactiveEnergyT1C"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="reactiveEnergyQIT1C"
            :label="rowLabel.reactiveEnergyQIT1C"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="reactiveEnergyQIVT1C"
            :label="rowLabel.reactiveEnergyQIVT1C"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="importApparentEnergyT1C"
            :label="rowLabel.importApparentEnergyT1C"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="reactiveEnergyQIT1C"
            :label="rowLabel.reactiveEnergyQIT1C"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="reactiveEnergyQIVT1C"
            :label="rowLabel.reactiveEnergyQIVT1C"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="importApparentEnergyT1C"
            :label="rowLabel.importApparentEnergyT1C"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="exportApparentEnergyT1C"
            :label="rowLabel.exportApparentEnergyT1C"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="importPowerFactorT1"
            :label="rowLabel.importPowerFactorT1"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="importActiveEnergyT2C"
            :label="rowLabel.importActiveEnergyT2C"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="exportActiveEnergyT2C"
            :label="rowLabel.exportActiveEnergyT2C"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="importReactiveEnergyT2C"
            :label="rowLabel.importReactiveEnergyT2C"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="exportReactiveEnergyT2C"
            :label="rowLabel.exportReactiveEnergyT2C"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="reactiveEnergyQIT2C"
            :label="rowLabel.reactiveEnergyQIT2C"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="reactiveEnergyQIVT2C"
            :label="rowLabel.reactiveEnergyQIVT2C"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="importApparentEnergyT2C"
            :label="rowLabel.importApparentEnergyT2C"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="exportApparentEnergyT2C"
            :label="rowLabel.exportApparentEnergyT2C"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="importPowerFactorT2"
            :label="rowLabel.importPowerFactorT2"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="importActiveEnergyT3C"
            :label="rowLabel.importActiveEnergyT3C"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="exportActiveEnergyT3C"
            :label="rowLabel.exportActiveEnergyT3C"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="importReactiveEnergyT3C"
            :label="rowLabel.importReactiveEnergyT3C"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="exportReactiveEnergyT3C"
            :label="rowLabel.exportReactiveEnergyT3C"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="importActiveEnergyB"
            :label="rowLabel.reactiveEnergyQIT3C"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="importActiveEnergyB"
            :label="rowLabel.reactiveEnergyQIT3C"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="reactiveEnergyQIVT3C"
            :label="rowLabel.reactiveEnergyQIVT3C"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="importApparentEnergyT3C"
            :label="rowLabel.importApparentEnergyT3C"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="exportApparentEnergyT3C"
            :label="rowLabel.exportApparentEnergyT3C"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="importPowerFactorT3"
            :label="rowLabel.importPowerFactorT3"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="importPowerFactorT3"
            :label="rowLabel.importPowerFactorT3"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <!-- 电表为CT或CTVT类型 -->
          <el-table-column
            prop="l1ImportActiveEnergy"
            :label="rowLabel.l1ImportActiveEnergy"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="l1ExportActiveEnergy"
            :label="rowLabel.l1ExportActiveEnergy"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="l1ImportReactiveEnergy"
            :label="rowLabel.l1ImportReactiveEnergy"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="l1ExportReactiveEnergy"
            :label="rowLabel.l1ExportReactiveEnergy"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="l1ReactiveEnergyQI"
            :label="rowLabel.l1ReactiveEnergyQI"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="l1ReactiveEnergyQII"
            :label="rowLabel.l1ReactiveEnergyQII"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="l1ReactiveEnergyQIII"
            :label="rowLabel.l1ReactiveEnergyQIII"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="l1ReactiveEnergyQIV"
            :label="rowLabel.l1ReactiveEnergyQIV"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="l1ImportApparentEnergy"
            :label="rowLabel.l1ImportApparentEnergy"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="l1ExportApparentEnergy"
            :label="rowLabel.l1ExportApparentEnergy"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>

          <el-table-column
            prop="l2ImportActiveEnergy"
            :label="rowLabel.l2ImportActiveEnergy"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="l2ExportActiveEnergy"
            :label="rowLabel.l2ExportActiveEnergy"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="l2ImportReactiveEnergy"
            :label="rowLabel.l2ImportReactiveEnergy"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="l2ExportReactiveEnergy"
            :label="rowLabel.l2ExportReactiveEnergy"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="l2ReactiveEnergyQI"
            :label="rowLabel.l2ReactiveEnergyQI"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="l2ReactiveEnergyQII"
            :label="rowLabel.l2ReactiveEnergyQII"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="l2ReactiveEnergyQIII"
            :label="rowLabel.l2ReactiveEnergyQIII"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="l2ReactiveEnergyQIV"
            :label="rowLabel.l2ReactiveEnergyQIV"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="l2ImportApparentEnergy"
            :label="rowLabel.l2ImportApparentEnergy"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="l2ExportApparentEnergy"
            :label="rowLabel.l2ExportApparentEnergy"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>

          <el-table-column
            prop="l3ImportActiveEnergy"
            :label="rowLabel.l3ImportActiveEnergy"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="l3ExportActiveEnergy"
            :label="rowLabel.l3ExportActiveEnergy"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="l3ImportReactiveEnergy"
            :label="rowLabel.l3ImportReactiveEnergy"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="l3ExportReactiveEnergy"
            :label="rowLabel.l3ExportReactiveEnergy"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="l3ReactiveEnergyQI"
            :label="rowLabel.l3ReactiveEnergyQI"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="l3ReactiveEnergyQII"
            :label="rowLabel.l3ReactiveEnergyQII"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="l3ReactiveEnergyQIII"
            :label="rowLabel.l3ReactiveEnergyQIII"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="l3ReactiveEnergyQIV"
            :label="rowLabel.l3ReactiveEnergyQIV"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="l3ImportApparentEnergy"
            :label="rowLabel.l3ImportApparentEnergy"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="l3ExportApparentEnergy"
            :label="rowLabel.l3ExportApparentEnergy"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
        </el-table-column>
        <!-- Monthly Billing Profile -->
        <el-table-column :label="rowLabel.monthlyBillingProfile" align="center">
          <el-table-column
            prop="importActiveEnergyD"
            :label="rowLabel.importActiveEnergyD"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="importReactiveEnergyD"
            :label="rowLabel.importReactiveEnergyD"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="importApparentEnergyD"
            :label="rowLabel.importApparentEnergyD"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="exportActiveEnergyD"
            :label="rowLabel.exportActiveEnergyD"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="exportReactiveEnergyD"
            :label="rowLabel.exportReactiveEnergyD"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="exportApparentEnergyD"
            :label="rowLabel.exportApparentEnergyD"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="importPowerFactorD"
            :label="rowLabel.importPowerFactorD"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="importPowerFactorT1D"
            :label="rowLabel.importPowerFactorT1D"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="importPowerFactorT2D"
            :label="rowLabel.importPowerFactorT2D"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="importPowerFactorT3D"
            :label="rowLabel.importPowerFactorT3D"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="exportPowerFactor"
            :label="rowLabel.exportPowerFactor"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="exportPowerFactorT1"
            :label="rowLabel.exportPowerFactorT1"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="exportPowerFactorT2"
            :label="rowLabel.exportPowerFactorT2"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
          <el-table-column
            prop="exportPowerFactorT3"
            :label="rowLabel.exportPowerFactorT3"
            width="170"
            align="center"
            :show-overflow-tooltip="true"
            :render-header="renderHeader"
          >
          </el-table-column>
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
  import { queryDetail, filterData } from '@/api/dataQuery/eobQuery'
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
      start.setTime(start.getTime());
      end.setTime(end.getTime() + 3600 * 1000 * 24 * 31);
      return {
        flag: true, // 用于控制过滤还是查询
        format: "yyyy-MM",
        clearAble: false,
        // 导出按钮弹出框
        dialogVisible: false,
        // 过滤框
        inputMeterName: this.$t('eobQuery.inputMeterName'),
        filterValue: [],
        options: [],
        // 表格
        listLoading: false,
        tableHeight:window.innerHeight - 360,
        total: 0,
        tableData: [],
        rowLabel: {
          index: this.$t('eobQuery.no'),
          meterName: this.$t('meterevent.metername'),
          dataTime: this.$t('eobQuery.dataTime'),
          status: this.$t('eobQuery.status'),
          // Maximum Demand Profile类型
          maximumDemandProfile: this.$t('eobQuery.maximumDemandProfile'),
          importActiveEnergy: this.$t('eobQuery.importActiveEnergy'),
          captureTime1: this.$t('eobQuery.captureTime1'),
          exportActiveEnergy: this.$t('eobQuery.exportActiveEnergy'),
          captureTime2: this.$t('eobQuery.captureTime2'),
          importReactiveEnergy: this.$t('eobQuery.importReactiveEnergy'),
          captureTime3: this.$t('eobQuery.captureTime3'),
          exportReactiveEnergy: this.$t('eobQuery.exportReactiveEnergy'),
          captureTime4: this.$t('eobQuery.captureTime4'),
          reactivePowerQI: this.$t('eobQuery.reactivePowerQI'),
          captureTime5: this.$t('eobQuery.captureTime5'),
          reactivePowerQIV: this.$t('eobQuery.reactivePowerQIV'),
          captureTime6: this.$t('eobQuery.captureTime6'),
          importApparentPowerQIV: this.$t('eobQuery.importApparentPowerQIV'),
          captureTime7: this.$t('eobQuery.captureTime7'),
          exportApparentPowerQIV: this.$t('eobQuery.exportApparentPowerQIV'),
          captureTime8: this.$t('eobQuery.captureTime8'),
          importActiveEnergyT1: this.$t('eobQuery.importActiveEnergyT1'),
          captureTime10: this.$t('eobQuery.captureTime10'),
          exportActiveEnergyT1: this.$t('eobQuery.exportActiveEnergyT1'),
          captureTime11: this.$t('eobQuery.captureTime11'),
          importReactiveEnergyT1: this.$t('eobQuery.importReactiveEnergyT1'),
          captureTime12: this.$t('eobQuery.captureTime12'),
          exportReactiveEnergyT1: this.$t('eobQuery.exportReactiveEnergyT1'),
          captureTime13: this.$t('eobQuery.captureTime13'),
          reactiveEnergyQIT1: this.$t('eobQuery.reactiveEnergyQIT1'),
          captureTime14: this.$t('eobQuery.captureTime14'),
          reactiveEnergyQIVT1: this.$t('eobQuery.reactiveEnergyQIVT1'),
          captureTime15: this.$t('eobQuery.captureTime15'),
          importApparentEnergyT1: this.$t('eobQuery.importApparentEnergyT1'),
          captureTime16: this.$t('eobQuery.captureTime16'),
          exportApparentEnergyT1: this.$t('eobQuery.exportApparentEnergyT1'),
          captureTime17: this.$t('eobQuery.captureTime17'),
          importActiveEnergyT2: this.$t('eobQuery.importActiveEnergyT2'),
          captureTime18: this.$t('eobQuery.captureTime18'),
          exportActiveEnergyT2: this.$t('eobQuery.exportActiveEnergyT2'),
          captureTime19: this.$t('eobQuery.captureTime19'),
          importReactiveEnergyT2: this.$t('eobQuery.importReactiveEnergyT2'),
          captureTime20: this.$t('eobQuery.captureTime20'),
          exportReactiveEnergyT2: this.$t('eobQuery.exportReactiveEnergyT2'),
          captureTime21: this.$t('eobQuery.captureTime21'),
          reactiveEnergyQIT2: this.$t('eobQuery.reactiveEnergyQIT2'),
          captureTime22: this.$t('eobQuery.captureTime22'),
          reactiveEnergyQIVT2: this.$t('eobQuery.reactiveEnergyQIVT2'),
          captureTime23: this.$t('eobQuery.captureTime23'),
          importApparentEnergyT2: this.$t('eobQuery.importApparentEnergyT2'),
          captureTime24: this.$t('eobQuery.captureTime24'),
          exportApparentEnergyT2: this.$t('eobQuery.exportApparentEnergyT2'),
          captureTime25: this.$t('eobQuery.captureTime25'),
          importActiveEnergyT3: this.$t('eobQuery.importActiveEnergyT3'),
          captureTime26: this.$t('eobQuery.captureTime26'),
          exportActiveEnergyT3: this.$t('eobQuery.exportActiveEnergyT3'),
          captureTime27: this.$t('eobQuery.captureTime27'),
          importReactiveEnergyT3: this.$t('eobQuery.importReactiveEnergyT3'),
          captureTime28: this.$t('eobQuery.captureTime28'),
          exportReactiveEnergyT3: this.$t('eobQuery.exportReactiveEnergyT3'),
          captureTime29: this.$t('eobQuery.captureTime29'),
          reactiveEnergyQIT3: this.$t('eobQuery.reactiveEnergyQIT3'),
          captureTime30: this.$t('eobQuery.captureTime30'),
          reactiveEnergyQIVT3: this.$t('eobQuery.reactiveEnergyQIVT3'),
          captureTime31: this.$t('eobQuery.captureTime31'),
          importApparentEnergyT3: this.$t('eobQuery.importApparentEnergyT3'),
          captureTime32: this.$t('eobQuery.captureTime32'),
          exportApparentEnergyT3: this.$t('eobQuery.exportApparentEnergyT3'),
          captureTime33: this.$t('eobQuery.captureTime33'),

          // Cumulative Maximum Demand Profile类型
          cumulativeMaximumDemandProfile: this.$t('eobQuery.cumulativeMaximumDemandProfile'),
          importActiveEnergyB: this.$t('eobQuery.importActiveEnergyB'),
          exportActiveEnergyB: this.$t('eobQuery.exportActiveEnergyB'),
          importReactiveEnergyB: this.$t('eobQuery.importReactiveEnergyB'),
          exportReactiveEnergyB: this.$t('eobQuery.exportReactiveEnergyB'),
          reactivePowerQIB: this.$t('eobQuery.reactivePowerQIB'),
          reactivePowerQIVB: this.$t('eobQuery.reactivePowerQIVB'),
          importApparentPowerQIVB: this.$t('eobQuery.importApparentPowerQIVB'),
          exportApparentPowerQIVB: this.$t('eobQuery.exportApparentPowerQIVB'),
          importActiveEnergyT1B: this.$t('eobQuery.importActiveEnergyT1B'),
          exportActiveEnergyT1B: this.$t('eobQuery.exportActiveEnergyT1B'),
          importReactiveEnergyT1B: this.$t('eobQuery.importReactiveEnergyT1B'),
          exportReactiveEnergyT1B: this.$t('eobQuery.exportReactiveEnergyT1B'),
          reactiveEnergyQIT1B: this.$t('eobQuery.reactiveEnergyQIT1B'),
          reactiveEnergyQIVT1B: this.$t('eobQuery.reactiveEnergyQIVT1B'),
          importApparentEnergyT1B: this.$t('eobQuery.importApparentEnergyT1B'),
          exportApparentEnergyT1B: this.$t('eobQuery.exportApparentEnergyT1B'),
          importActiveEnergyT2B: this.$t('eobQuery.importActiveEnergyT2B'),
          exportActiveEnergyT2B: this.$t('eobQuery.exportActiveEnergyT2B'),
          importReactiveEnergyT2B: this.$t('eobQuery.importReactiveEnergyT2B'),
          exportReactiveEnergyT2B: this.$t('eobQuery.exportReactiveEnergyT2B'),
          reactiveEnergyQIT2B: this.$t('eobQuery.reactiveEnergyQIT2B'),
          reactiveEnergyQIVT2B: this.$t('eobQuery.reactiveEnergyQIVT2B'),
          importApparentEnergyT2B: this.$t('eobQuery.importApparentEnergyT2B'),
          exportApparentEnergyT2B: this.$t('eobQuery.exportApparentEnergyT2B'),
          importActiveEnergyT3B: this.$t('eobQuery.importActiveEnergyT3B'),
          exportActiveEnergyT3B: this.$t('eobQuery.exportActiveEnergyT3B'),
          importReactiveEnergyT3B: this.$t('eobQuery.importReactiveEnergyT3B'),
          exportReactiveEnergyT3B: this.$t('eobQuery.exportReactiveEnergyT3B'),
          reactiveEnergyQIT3B: this.$t('eobQuery.reactiveEnergyQIT3B'),
          reactiveEnergyQIVT3B: this.$t('eobQuery.reactiveEnergyQIVT3B'),
          importApparentEnergyT3B: this.$t('eobQuery.importApparentEnergyT3B'),
          exportApparentEnergyT3B: this.$t('eobQuery.exportApparentEnergyT3B'),

          // Energy Profile 类型
          energyProfile: this.$t('eobQuery.energyProfile'),
          importActiveEnergyC: this.$t('eobQuery.importActiveEnergyC'),
          exportActiveEnergyC: this.$t('eobQuery.exportActiveEnergyC'),
          importReactiveEnergyC: this.$t('eobQuery.importReactiveEnergyC'),
          exportReactiveEnergyC: this.$t('eobQuery.exportReactiveEnergyC'),
          reactivePowerQIC: this.$t('eobQuery.reactivePowerQIC'),
          reactivePowerQII: this.$t('eobQuery.reactivePowerQII'),
          reactivePowerQIII: this.$t('eobQuery.reactivePowerQIII'),
          reactivePowerQIVC: this.$t('eobQuery.reactivePowerQIVC'),
          importApparentEnergy: this.$t('eobQuery.importApparentEnergy'),
          exportApparentEnergy: this.$t('eobQuery.exportApparentEnergy'),
          activeEnergy: this.$t('eobQuery.activeEnergy'),
          importPowerFactor: this.$t('eobQuery.importPowerFactor'),
          importActiveEnergyT1C: this.$t('eobQuery.importActiveEnergyT1C'),
          exportActiveEnergyT1C: this.$t('eobQuery.exportActiveEnergyT1C'),
          importReactiveEnergyT1C: this.$t('eobQuery.importReactiveEnergyT1C'),
          exportReactiveEnergyT1C: this.$t('eobQuery.exportReactiveEnergyT1C'),
          reactiveEnergyQIT1C: this.$t('eobQuery.reactiveEnergyQIT1C'),
          reactiveEnergyQIVT1C: this.$t('eobQuery.reactiveEnergyQIVT1C'),
          importApparentEnergyT1C: this.$t('eobQuery.importApparentEnergyT1C'),
          exportApparentEnergyT1C: this.$t('eobQuery.exportApparentEnergyT1C'),
          importPowerFactorT1: this.$t('eobQuery.importPowerFactorT1'),
          importActiveEnergyT2C: this.$t('eobQuery.importActiveEnergyT2C'),
          exportActiveEnergyT2C: this.$t('eobQuery.exportActiveEnergyT2C'),
          importReactiveEnergyT2C: this.$t('eobQuery.importReactiveEnergyT2C'),
          exportReactiveEnergyT2C: this.$t('eobQuery.exportReactiveEnergyT2C'),
          reactiveEnergyQIT2C: this.$t('eobQuery.reactiveEnergyQIT2C'),
          reactiveEnergyQIVT2C: this.$t('eobQuery.reactiveEnergyQIVT2C'),
          importApparentEnergyT2C: this.$t('eobQuery.importApparentEnergyT2C'),
          exportApparentEnergyT2C: this.$t('eobQuery.exportApparentEnergyT2C'),
          importPowerFactorT2: this.$t('eobQuery.importPowerFactorT2'),
          importActiveEnergyT3C: this.$t('eobQuery.importActiveEnergyT3C'),
          exportActiveEnergyT3C: this.$t('eobQuery.exportActiveEnergyT3C'),
          importReactiveEnergyT3C: this.$t('eobQuery.importReactiveEnergyT3C'),
          exportReactiveEnergyT3C: this.$t('eobQuery.exportReactiveEnergyT3C'),
          reactiveEnergyQIT3C: this.$t('eobQuery.reactiveEnergyQIT3C'),
          reactiveEnergyQIVT3C: this.$t('eobQuery.reactiveEnergyQIVT3C'),
          importApparentEnergyT3C: this.$t('eobQuery.importApparentEnergyT3C'),
          exportApparentEnergyT3C: this.$t('eobQuery.exportApparentEnergyT3C'),
          importPowerFactorT3: this.$t('eobQuery.importPowerFactorT3'),
          // 电表为CT或CTVT类型,Energy profile增加以下字段
          l1ImportActiveEnergy: this.$t('eobQuery.l1ImportActiveEnergy'),
          l1ExportActiveEnergy: this.$t('eobQuery.l1ExportActiveEnergy'),
          l1ImportReactiveEnergy: this.$t('eobQuery.l1ImportReactiveEnergy'),
          l1ExportReactiveEnergy: this.$t('eobQuery.l1ExportReactiveEnergy'),
          l1ReactiveEnergyQI: this.$t('eobQuery.l1ReactiveEnergyQI'),
          l1ReactiveEnergyQII: this.$t('eobQuery.l1ReactiveEnergyQII'),
          l1ReactiveEnergyQIII: this.$t('eobQuery.l1ReactiveEnergyQIII'),
          l1ReactiveEnergyQIV: this.$t('eobQuery.l1ReactiveEnergyQIV'),
          l1ImportApparentEnergy: this.$t('eobQuery.l1ImportApparentEnergy'),
          l1ExportApparentEnergy: this.$t('eobQuery.l1ExportApparentEnergy'),

          l2ImportActiveEnergy: this.$t('eobQuery.l2ImportActiveEnergy'),
          l2ExportActiveEnergy: this.$t('eobQuery.l2ExportActiveEnergy'),
          l2ImportReactiveEnergy: this.$t('eobQuery.l2ImportReactiveEnergy'),
          l2ExportReactiveEnergy: this.$t('eobQuery.l2ExportReactiveEnergy'),
          l2ReactiveEnergyQI: this.$t('eobQuery.l2ReactiveEnergyQI'),
          l2ReactiveEnergyQII: this.$t('eobQuery.l2ReactiveEnergyQII'),
          l2ReactiveEnergyQIII: this.$t('eobQuery.l2ReactiveEnergyQIII'),
          l2ReactiveEnergyQIV: this.$t('eobQuery.l2ReactiveEnergyQIV'),
          l2ImportApparentEnergy: this.$t('eobQuery.l2ImportApparentEnergy'),
          l2ExportApparentEnergy: this.$t('eobQuery.l2ExportApparentEnergy'),

          l3ImportActiveEnergy: this.$t('eobQuery.l3ImportActiveEnergy'),
          l3ExportActiveEnergy: this.$t('eobQuery.l3ExportActiveEnergy'),
          l3ImportReactiveEnergy: this.$t('eobQuery.l3ImportReactiveEnergy'),
          l3ExportReactiveEnergy: this.$t('eobQuery.l3ExportReactiveEnergy'),
          l3ReactiveEnergyQI: this.$t('eobQuery.l3ReactiveEnergyQI'),
          l3ReactiveEnergyQII: this.$t('eobQuery.l3ReactiveEnergyQII'),
          l3ReactiveEnergyQIII: this.$t('eobQuery.l3ReactiveEnergyQIII'),
          l3ReactiveEnergyQIV: this.$t('eobQuery.l3ReactiveEnergyQIV'),
          l3ImportApparentEnergy: this.$t('eobQuery.l3ImportApparentEnergy'),
          l3ExportApparentEnergy: this.$t('eobQuery.l3ExportApparentEnergy'),

          // Monthly Billing Profile类型
          monthlyBillingProfile: this.$t('eobQuery.monthlyBillingProfile'),
          importActiveEnergyD: this.$t('eobQuery.importActiveEnergyD'),
          importReactiveEnergyD: this.$t('eobQuery.importReactiveEnergyD'),
          importApparentEnergyD: this.$t('eobQuery.importApparentEnergyD'),
          exportActiveEnergyD: this.$t('eobQuery.exportActiveEnergyD'),
          exportReactiveEnergyD: this.$t('eobQuery.exportReactiveEnergyD'),
          exportApparentEnergyD: this.$t('eobQuery.exportApparentEnergyD'),
          importPowerFactorD: this.$t('eobQuery.importPowerFactorD'),
          importPowerFactorT1D: this.$t('eobQuery.importPowerFactorT1D'),
          importPowerFactorT2D: this.$t('eobQuery.importPowerFactorT2D'),
          importPowerFactorT3D: this.$t('eobQuery.importPowerFactorT3D'),
          exportPowerFactor: this.$t('eobQuery.exportPowerFactor'),
          exportPowerFactorT1: this.$t('eobQuery.exportPowerFactorT1'),
          exportPowerFactorT2: this.$t('eobQuery.exportPowerFactorT2'),
          exportPowerFactorT3: this.$t('eobQuery.exportPowerFactorT3'),
        },
        query:{
          page: 1,
          limit: 20
        },
        formInline: {
          objectNo: '',
          objectName: '',
          objectType: '',
          startDate: new Date(start.getFullYear(), start.getMonth()),
          endDate: new Date(end.getFullYear(), end.getMonth())
        },
        formLabel:{
          objectName:this.$t('eobQuery.objectName'),
          objectType:this.$t('eobQuery.objectType'),
          calender:this.$t('payset.calender'),
          to:this.$t('eobQuery.to'),
          startDate:this.$t('global.startDate'),
          endDate:this.$t('global.endDate'),
          search:this.$t('auto.search'),
          exportDialog:this.$t('eobQuery.export')
        },
        params: {
          objectNo: "",
          objectName: "",
          objectType: "",
          startDate: "",
          endDate: ""
        },
      }
    },
    computed: {},
    created() {
      this.getList()
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
                this.$alert(this.$t('eobQuery.error'), this.$t('eobQuery.tip'), {
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
          this.$alert(this.$t('eobQuery.error'), this.$t('eobQuery.tip'), {
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
      getParams() {
        let type;
        if (this.formInline.objectType === "NB Meter" || this.formInline.objectType === "4G Meter" || this.formInline.objectType === "DCU" || this.params.objectType === "tmnl") {
          type = "tmnl"
        }else if (this.formInline.objectType === "mru"){
          type = "mru";
        }else {
          type = "meter"
        }
        this.params = {
          objectNo: this.formInline.objectNo,
          objectType: type,
          startDate: this.getFirstDateOfMonth(this.formInline.startDate),
          endDate: this.getFirstDateOfMonth(this.formInline.endDate),
          page: this.query.page,
          limit: this.query.limit,
        };
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
      renderHeader(h, { column, $index }) {
        let label = column.label;
        if (label === this.rowLabel.dataTime){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "Current date/time\n0-0:1.0.0.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.status){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "Status Information\n0-0:96.5.0.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.importActiveEnergy){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Import active power (QI+QIV) [Total]\n1-0:1.6.0.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.captureTime1){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Import active power (QI+QIV) [Total] Capture Time\n0-0:1.0.0.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.exportActiveEnergy){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Export active power (QII+QIII) [Total]\n1-0:2.6.0.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.captureTime2){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Export active power (QII+QIII) [Total] Capture Time\n0-0:1.0.0.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.importReactiveEnergy){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Import reactive power (QI+QII) [Total]\n1-0:3.6.0.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.captureTime3){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Import reactive power (QI+QII) [Total] Capture Time\n0-0:1.0.0.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.exportReactiveEnergy){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Export reactive power (QIII+QIV) [Total]\n1-0:4.6.0.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.captureTime4){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Export reactive power (QIII+QIV) [Total]Capture Time\n0-0:1.0.0.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.reactivePowerQI){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Reactive power (QI) [Total]\n1-0:5.6.0.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.captureTime5){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Reactive power (QI) [Total] Capture Time\n0-0:1.0.0.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.reactivePowerQIV){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Reactive power (QIV) [Total]\n1-0:8.6.0.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.captureTime6){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Reactive power (QIV) [Total] Capture Time\n0-0:1.0.0.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.importApparentPowerQIV){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Import apparent power (QI+QIV) [Total]\n1-0:9.6.0.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.captureTime7){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Import apparent power (QI+QIV) [Total] Capture Time\n0-0:1.0.0.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.exportApparentPowerQIV){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Export apparent power (QII+QIII) [Total]\n1-0:10.6.0.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.captureTime8){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Export apparent power (QII+QIII) [Total] Capture Time\n0-0:1.0.0.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.importActiveEnergyT1){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Import active energy (QI+QIV) [Tariff 1]\n1-0:1.6.1.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.captureTime10){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Import active energy (QI+QIV) [Tariff 1] Capture Time\n0-0:1.0.0.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.exportActiveEnergyT1){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Export active energy (QII+QIII) [Tariff1] \n1-0:2.6.1.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.captureTime11){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Export active energy (QII+QIII) [Tariff 1] Capture Time\n0-0:1.0.0.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.importReactiveEnergyT1){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Import reactive energy (QI+QII) [Tariff 1]\n1-0:3.6.1.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.captureTime12){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Import reactive energy (QI+QII) [Tariff 1] Capture Time\n0-0:1.0.0.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.exportReactiveEnergyT1){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Export reactive energy (QIII+QIV) [Tariff 1]\n1-0:4.6.1.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.captureTime13){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Export reactive energy (QIII+QIV) [Tariff 1] Capture Time\n0-0:1.0.0.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.reactiveEnergyQIT1){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Reactive energy (QI) [Tariff 1]\n1-0:5.6.1.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.captureTime14){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Reactive energy (QI) [Tariff 1] Capture Time\n0-0:1.0.0.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.reactiveEnergyQIVT1){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Reactive energy (QIV) [Tariff 1]\n1-0:8.6.1.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.captureTime15){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "Σi Reactive energy (QIV) [Tariff 1]Capture Time\n0-0:1.0.0.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.importApparentEnergyT1){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Import apparent energy (QI+QIV) [Tariff 1]\n1-0:9.6.1.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.captureTime16){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Import apparent energy (QI+QIV) [Tariff 1]Capture Time\n0-0:1.0.0.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.exportApparentEnergyT1){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Export apparent energy (QII+QIII) [Tariff 1]\n1-0:10.6.1.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.captureTime17){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Export apparent energy (QII+QIII) [Tariff 1] Capture Time\n0-0:1.0.0.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.importActiveEnergyT2){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Import active energy (QI+QIV) [Tariff 2]\n1-0:1.6.2.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.captureTime18){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Import active energy (QI+QIV) [Tariff 2] Capture Time\n0-0:1.0.0.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.exportActiveEnergyT2){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Export active energy (QII+QIII) [Tariff 2]\n1-0:2.6.2.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.captureTime19){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Export active energy (QII+QIII) [Tariff 2] Capture Time\n0-0:1.0.0.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.importReactiveEnergyT2){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Import reactive energy (QI+QII) [Tariff 2]\n1-0:3.6.2.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.captureTime20){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Import reactive energy (QI+QII) [Tariff 2] Capture Time\n0-0:1.0.0.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.exportReactiveEnergyT2){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Export reactive energy (QIII+QIV) [Tariff 2]\n1-0:4.6.2.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.captureTime21){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Export reactive energy (QIII+QIV) [Tariff 2] Capture Time\n0-0:1.0.0.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.reactiveEnergyQIT2){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Reactive energy (QI) [Tariff 2]\n1-0:5.6.2.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.captureTime22){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Reactive energy (QI) [Tariff2] Capture Time\n0-0:1.0.0.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.reactiveEnergyQIVT2){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Reactive energy (QIV) [Tariff 2]\n1-0:8.6.2.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.captureTime23){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "Σi Reactive energy (QIV) [Tariff 2]Capture Time\n0-0:1.0.0.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.importApparentEnergyT2){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Import apparent energy (QI+QIV) [Tariff 2]\n1-0:9.6.2.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.captureTime24){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Import apparent energy (QI+QIV) [Tariff 2]Capture Time\n0-0:1.0.0.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.exportApparentEnergyT2){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Export apparent energy (QII+QIII) [Tariff 2]\n1-0:10.6.2.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.captureTime25){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Export apparent energy (QII+QIII) [Tariff 2] Capture Time\n0-0:1.0.0.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.importActiveEnergyT3){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Import active energy (QI+QIV) [Tariff 3]\n1-0:1.6.3.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.captureTime26){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Import active energy (QI+QIV) [Tariff 3] Capture Time\n0-0:1.0.0.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.exportActiveEnergyT3){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Export active energy (QII+QIII) [Tariff 3]\n1-0:2.6.3.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.captureTime27){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Export active energy (QII+QIII) [Tariff 3] Capture Time\n0-0:1.0.0.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.importReactiveEnergyT3){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Import reactive energy (QI+QII) [Tariff 3]\n1-0:3.6.3.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.captureTime28){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Import reactive energy (QI+QII) [Tariff 3] Capture Time\n0-0:1.0.0.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.exportReactiveEnergyT3){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Export reactive energy (QIII+QIV) [Tariff 3]\n1-0:4.6.3.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.captureTime29){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Export reactive energy (QIII+QIV) [Tariff 3] Capture Time\n0-0:1.0.0.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.reactiveEnergyQIT3){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Reactive energy (QI) [Tariff 3]\n1-0:5.6.3.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.captureTime30){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Reactive energy (QI) [Tariff3] Capture Time\n0-0:1.0.0.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.reactiveEnergyQIVT3){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Reactive energy (QIV) [Tariff 3]\n1-0:8.6.3.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.captureTime31){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "Σi Reactive energy (QIV) [Tariff 3]Capture Time\n0-0:1.0.0.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.importApparentEnergyT3){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Import apparent energy (QI+QIV) [Tariff 3]\n1-0:9.6.3.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.captureTime32){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Import apparent energy (QI+QIV) [Tariff 3]Capture Time\n0-0:1.0.0.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.exportApparentEnergyT3){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Export apparent energy (QII+QIII) [Tariff 3]\n1-0:10.6.3.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.captureTime33){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Export apparent energy (QII+QIII) [Tariff 3] Capture Time\n0-0:1.0.0.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.importActiveEnergyB){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Import active power (QI+QIV) [Total]\n1-0:1.2.0.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.exportActiveEnergyB){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Export active power (QII+QIII) [Total]\n1-0:2.2.0.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.importReactiveEnergyB){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Import reactive power (QI+QII) [Total]\n1-0:3.2.0.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.exportReactiveEnergyB){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Export reactive power (QIII+QIV) [Total]\n1-0:4.2.0.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.reactivePowerQIB){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Reactive power (QI) [Total]\n1-0:5.2.0.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.reactivePowerQIVB){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Reactive power (QIV) [Total]\n1-0:8.2.0.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.importApparentPowerQIVB){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Import apparent power (QI+QIV) [Total]\n1-0:9.2.0.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.exportApparentPowerQIVB){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Export apparent power (QII+QIII) [Total]\n1-0:10.2.0.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.importActiveEnergyT1B){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Import active energy (QI+QIV) [Tariff 1]\n1-0:1.2.1.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.exportActiveEnergyT1B){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Export active energy (QII+QIII) [Tariff 1]\n1-0:2.2.1.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.importReactiveEnergyT1B){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Import reactive energy (QI+QII) [Tariff 1]\n1-0:3.2.1.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.exportReactiveEnergyT1B){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Export reactive energy (QIII+QIV) [Tariff 1]\n1-0:4.2.1.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.reactiveEnergyQIT1B){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Reactive energy (QI) [Tariff 1]\n1-0:5.2.1.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.reactiveEnergyQIVT1B){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Reactive energy (QIV) [Tariff 1]\n1-0:8.2.1.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.importApparentEnergyT1B){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Import apparent energy (QI+QIV) [Tariff 1]\n1-0:9.2.1.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.exportApparentEnergyT1B){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Export apparent energy (QII+QIII) [Tariff 1]\n1-0:10.2.1.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.importActiveEnergyT2B){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Import active energy (QI+QIV) [Tariff 2]\n1-0:1.2.2.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.exportActiveEnergyT2B){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Export active energy (QII+QIII) [Tariff 2]\n1-0:2.2.2.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.importReactiveEnergyT2B){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Import reactive energy (QI+QII) [Tariff 2]\n01-0:3.2.2.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.exportReactiveEnergyT2B){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Export reactive energy (QIII+QIV) [Tariff 2]\n1-0:4.2.2.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.reactiveEnergyQIT2B){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Reactive energy (QI) [Tariff 2]\n1-0:5.2.2.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.reactiveEnergyQIVT2B){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Reactive energy (QIV) [Tariff 2]\n1-0:8.2.2.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.importApparentEnergyT2B){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Import apparent energy (QI+QIV) [Tariff 2]\n1-0:9.2.2.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.exportApparentEnergyT2B){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Export apparent energy (QII+QIII) [Tariff 2]\n1-0:10.2.2.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.importActiveEnergyT3B){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Import active energy (QI+QIV) [Tariff 3]\n1-0:1.2.3.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.exportActiveEnergyT3B){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Export active energy (QII+QIII) [Tariff 3]\n1-0:2.2.3.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.importReactiveEnergyT3B){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Import reactive energy (QI+QII) [Tariff 3]\n1-0:3.2.3.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.exportReactiveEnergyT3B){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Export reactive energy (QIII+QIV) [Tariff 3]\n1-0:4.2.3.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.reactiveEnergyQIT3B){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Reactive energy (QI) [Tariff 3]\n1-0:5.2.3.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.reactiveEnergyQIVT3B){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Reactive energy (QIV) [Tariff 3]\n1-0:8.2.3.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.importApparentEnergyT3B){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Import apparent energy (QI+QIV) [Tariff 3]\n1-0:9.2.3.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.exportApparentEnergyT3B){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Export apparent energy (QII+QIII) [Tariff 3]\n1-0:10.2.3.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.importActiveEnergyC){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Import active energy (QI+QIV) [Total]\n1-0:1.8.0.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.exportActiveEnergyC){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Export active energy (QII+QIII) [Total]\n1-0:2.8.0.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.importReactiveEnergyC){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Import reactive energy (QI+QII) [Total]\n1-0:3.8.0.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.exportReactiveEnergyC){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Export reactive energy (QIII+QIV) [Total]\n1-0:4.8.0.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.reactivePowerQIC){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Reactive energy (QI) [Total]\n1-0:5.8.0.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.reactivePowerQII){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Reactive energy (QII) [Total]\n1-0:6.8.0.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.reactivePowerQIII){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Reactive energy (QIII) [Total]\n1-0:7.8.0.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.reactivePowerQIVC){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Reactive energy (QIV) [Total]\n1-0:8.8.0.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.importApparentEnergy){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Import apparent energy (QI+QIV) [Total]\n1-0:9.8.0.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.exportApparentEnergy){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "SExport apparent energy (QII+QIII) [Total]\n1-0:10.8.0.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.activeEnergy){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Active energy (abs(QI+QIV)+(abs(QII+QIII)) [Total]\n1-0:15.8.0.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.importPowerFactor){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Average import power factor [Total]\n1-0:13.0.0.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.importActiveEnergyT1C){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Import active energy (QI+QIV) [Tariff 1]\n1-0:1.8.1.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.exportActiveEnergyT1C){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Export active energy (QII+QIII) [Tariff 1]\n1-0:2.8.1.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.importReactiveEnergyT1C){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Import reactive energy (QI+QII) [Tariff 1]\n1-0:3.8.1.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.exportReactiveEnergyT1C){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Export reactive energy (QIII+QIV) [Tariff 1]\n1-0:4.8.1.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.reactiveEnergyQIT1C){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Reactive energy (QI) [Tariff 1]\n1-0:5.8.1.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.reactiveEnergyQIVT1C){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Reactive energy (QIV) [Tariff 1]\n1-0:8.8.1.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.importApparentEnergyT1C){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Import apparent energy (QI+QIV) [Tariff 1]\n1-0:9.8.1.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.exportApparentEnergyT1C){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "Export apparent energy (QII+QIII) [Tariff 1]\n1-0:10.8.1.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.importPowerFactorT1){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Average import power factor [Tariff 1]\n1-0:13.0.1.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.importActiveEnergyT2C){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Import active energy (QI+QIV) [Tariff 2]\n1-0:1.8.2.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.exportActiveEnergyT2C){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Export active energy (QII+QIII) [Tariff 2]\n1-0:2.8.2.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.importReactiveEnergyT2C){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Import reactive energy (QI+QII) [Tariff 2]\n1-0:3.8.2.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.exportReactiveEnergyT2C){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Export reactive energy (QIII+QIV) [Tariff 2]\n1-0:4.8.2.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.reactiveEnergyQIT2C){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Reactive energy (QI) [Tariff 2]\n1-0:5.8.2.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.reactiveEnergyQIVT2C){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Reactive energy (QIV) [Tariff2]\n1-0:8.8.2.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.importApparentEnergyT2C){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Import apparent energy (QI+QIV) [Tariff 2]\n1-0:9.8.2.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.exportApparentEnergyT2C){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "Export apparent energy (QII+QIII) [Tariff 2]\n1-0:10.8.2.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.importPowerFactorT2){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Average import power factor [Tariff 2]\n1-0:13.0.2.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.importActiveEnergyT3C){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Import active energy (QI+QIV) [Tariff 3]\n1-0:1.8.3.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.exportActiveEnergyT3C){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Export active energy (QII+QIII) [Tariff 3]\n1-0:2.8.3.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.importReactiveEnergyT3C){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Import reactive energy (QI+QII) [Tariff 3]\n1-0:3.8.3.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.exportReactiveEnergyT3C){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Export reactive energy (QIII+QIV) [Tariff 3]\n1-0:4.8.3.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.reactiveEnergyQIT3C){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Reactive energy (QI) [Tariff 3]n1-0:5.8.3.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.reactiveEnergyQIVT3C){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Reactive energy (QIV) [Tariff3]\n1-0:8.8.3.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.importApparentEnergyT3C){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Import apparent energy (QI+QIV) [Tariff 3]\n1-0:9.8.3.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.exportApparentEnergyT3C){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "Export apparent energy (QII+QIII) [Tariff 3]\n1-0:10.8.3.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.importPowerFactorT3){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Average import power factor [Tariff 3]\n1-0:13.0.3.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.l1ImportActiveEnergy){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "L1 Import active energy (QI+QIV)\n1-0:21.8.0.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.l1ExportActiveEnergy){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "L1 Export active energy (QII+QIII)\n1-0:22.8.0.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.l1ImportReactiveEnergy){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "L1 Import reactive energy (QI+QII)\n1-0:23.8.0.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.l1ExportReactiveEnergy){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "L1 Export reactive energy (QIII+QIV)\n1-0:24.8.0.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.l1ReactiveEnergyQI){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "L1 Reactive energy (QI)\n1-0:25.8.0.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.l1ReactiveEnergyQII){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "L1 Reactive energy (QII)\n1-0:26.8.0.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.l1ReactiveEnergyQIII){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "L1 Reactive energy (QIII) \n1-0:27.8.0.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.l1ReactiveEnergyQIV){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "L1 Reactive energy (QIV)\n1-0:28.8.0.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.l1ImportApparentEnergy){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "L1 Import apparent energy (QI+QIV)\n1-0:29.8.0.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.l1ExportApparentEnergy){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "Export apparent energy (QII+QIII)\n1-0:30.8.0.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.l2ImportActiveEnergy){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "L2 Import active energy (QI+QIV)\n1-0:41.8.0.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.l2ExportActiveEnergy){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "L2 Export active energy (QII+QIII)\n1-0:42.8.0.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.l2ImportReactiveEnergy){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "L2 Import reactive energy (QI+QII)\n1-0:43.8.0.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.l2ExportReactiveEnergy){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "L2 Export reactive energy (QIII+QIV)\n1-0:44.8.0.2555"
              }
            }
          },label)
        }else if (label === this.rowLabel.l2ReactiveEnergyQI){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "L2 Reactive energy (QI)\n1-0:45.8.0.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.l2ReactiveEnergyQII){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "L2 Reactive energy (QII)\n1-0:46.8.0.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.l2ReactiveEnergyQIII){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "L2 Reactive energy (QIII)\n1-0:47.8.0.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.l2ReactiveEnergyQIV){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "L2 Reactive energy (QIV)\n1-0:48.8.0.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.l2ImportApparentEnergy){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "L2 Import apparent energy (QI+QIV)\n01-0:49.8.0.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.l2ExportApparentEnergy){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "Export apparent energy (QII+QIII)\n1-0:50.8.0.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.l3ImportActiveEnergy){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "L3 Import active energy (QI+QIV)\n1-0:61.8.0.255”"
              }
            }
          },label)
        }else if (label === this.rowLabel.l3ExportActiveEnergy){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "L3 Export active energy (QII+QIII)\n1-0:62.8.0.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.l3ImportReactiveEnergy){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "L3 Import reactive energy (QI+QII)\n1-0:63.8.0.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.l3ExportReactiveEnergy){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "L3 Export reactive energy (QIII+QIV)\n1-0:64.8.0.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.l3ReactiveEnergyQI){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "“L3 Reactive energy (QI)\n1-0:65.8.0.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.l3ReactiveEnergyQII){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "“L3 Reactive energy (QII)\n1-0:66.8.0.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.l3ReactiveEnergyQIII){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "“L3 Reactive energy (QIII)\n1-0:67.8.0.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.l3ReactiveEnergyQIV){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "“L3 Reactive energy (QIV)\n1-0:68.8.0.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.l3ImportApparentEnergy){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "L3 Import apparent energy (QI+QIV)\n1-0:69.8.0.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.l3ExportApparentEnergy){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "Export apparent energy (QII+QIII)\n1-0:70.8.0.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.importActiveEnergyD){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Import active energy (QI+QIV)[current billing period]\n1-0:1.9.0.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.importReactiveEnergyD){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Import reactive energy (QI+QII)[current billing period]\n1-0:3.9.0.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.importApparentEnergyD){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Import apparent energy (QI+QIV)[current billing period]\n1-0:9.9.0.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.exportActiveEnergyD){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Export active energy (QI+QIV)[current billing period]\n1-0:2.9.0.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.exportReactiveEnergyD){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Export reactive energy (QI+QII)[current billing period]\n1-0:4.9.0.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.exportApparentEnergyD){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Export apparent energy (QI+QIV)[current billing period]\n1-0:10.9.0.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.importPowerFactorD){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Average import power factor(Current billing period average)\n1-0:13.0.0.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.importPowerFactorT1D){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Average import power factor(Current billing period average)[Tariff 1]\n1-0:13.0.1.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.importPowerFactorT2D){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Average import power factor(Current billing period average)[Tariff 2]\n1-0:13.0.2.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.importPowerFactorT3D){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Average import power factor(Current billing period average)[Tariff 3]\n1-0:13.0.3.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.exportPowerFactor){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Average export power factor(Current billing period average\n1-0:84.0.0.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.exportPowerFactorT1){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Average Export power factor(Current billing period average)[Tariff 1]\n1-0:84.0.1.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.exportPowerFactorT2){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Average Export power factor(Current billing period average)[Tariff 2]\n1-0:84.0.2.255"
              }
            }
          },label)
        }else if (label === this.rowLabel.exportPowerFactorT3){
          return h('div',{
            on: {
              mouseenter: (e) => {
                e.path[0].title = "ΣLi Average Export power factor(Current billing period average)[Tariff 3]\n1-0:84.0.3.255"
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
          this.$alert(this.$t('eobQuery.filterTip'), this.$t('eobQuery.tip'), {
            confirmButtonText: this.$t('global.confirm')
          });
        }
      },
      //获取给定的月份第一天日期
      getFirstDateOfMonth (d) {
        let date = new Date(d);
        date.setDate(1);
        let month = (date.getMonth() + 1);
        let day = date.getDate();
        if (month < 10) {
          month = '0' + month;
        }
        if (day < '10') {
          day = '0' + day;
        }
        return date.getFullYear() + '-' + month + '-' + day;
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
        this.filterValue = "";
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
