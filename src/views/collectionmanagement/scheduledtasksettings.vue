<template>
  <basic-container>
    <el-form :inline="true" :model="params" label-position="left">
      <el-form-item :label="$t('remote.deviceName')">
        <el-input :maxlength="30" v-model="params.tmnlAssetNo" style="width:150px"></el-input>
      </el-form-item>
      <el-form-item :label="$t('change.manufacturer')" style="margin-right:10px">
        <el-select v-model="params.factoryCode" size="small">
          <el-option :value="''" :label="$t('global.all')"></el-option>
          <el-option :value="ele.typeCode" :label="ele.typeName" v-for="(ele, i) in tmnlFactoryList" :key="i"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('collection.taskProp')" style="margin-right:10px">
        <el-select v-model="params.taskProperty" size="small">
          <el-option value="01" :label="$t('collection.prop1')"></el-option>
          <el-option value="02" :label="$t('collection.prop2')"></el-option>
          <el-option value="03" :label="$t('collection.prop3')"></el-option>
          <el-option value="04" :label="$t('collection.prop4')"></el-option>
          <el-option value="05" :label="$t('collection.prop5')"></el-option>
          <el-option value="06" :label="$t('collection.prop6')"></el-option>
          <el-option value="07" :label="$t('collection.prop7')"></el-option>
          <el-option value="08" :label="$t('collection.prop8')"></el-option>
          <el-option value="09" :label="$t('collection.prop9')"></el-option>
          <el-option value="99" :label="$t('upgrade.others')"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('collection.isValid')" style="margin-right:30px">
        <el-select v-model="params.isValid" size="small">
          <el-option value="1" :label="$t('collection.valid')"></el-option>
          <el-option value="0" :label="$t('collection.invalid')"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('collection.successTimeF')">
        <el-date-picker
          v-model="params.successTimeFrom"
          type="date"
          size="small"
          :clearable="false"
          :editable="false"
          style="width:150px">
        </el-date-picker>
      </el-form-item>
      <el-form-item :label="$t('global.to')">
        <el-date-picker
          v-model="params.successTimeTo"
          type="date"
          size="small"
          :clearable="false"
          :editable="false"
          style="width:150px">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search" size="small">{{$t('global.search')}}</el-button>
      </el-form-item>
    </el-form>

    <div class="uptop">
      <span>{{$t('clock.taskList')}}</span>
      <div class="right">
        <span @click="upgrade(false)">
          <img src="img/stop.png" alt />
          {{$t('upgrade.stop')}}
        </span>
        <span @click="upgrade(true)">
          <img src="img/Reupgrade.png" alt />
          {{$t('collection.start')}}
        </span>
      </div>
    </div>
    <el-table
      :data="tableData"
      border
      :header-cell-style="{background:'#F2F2F2',color:'rgb(51,51,51)'}"
      height="60vh"
      @selection-change="select"
      v-loading="loading">
      <el-table-column type="selection">
      </el-table-column>
      <el-table-column :label="$t('global.id')" width="50">
        <template slot-scope="scope">
          {{(params.current - 1) * params.size + scope.$index + 1}}
        </template>
      </el-table-column>
      <el-table-column :label="$t('clock.taskNo')" prop="taskNo"></el-table-column>
      <el-table-column :label="$t('collection.taskProp')" prop="taskProperty">
        <template slot-scope="scope">
        {{
          [
            {val: '01', label: $t('collection.prop1')},
            {val: '02', label: $t('collection.prop2')},
            {val: '03', label: $t('collection.prop3')},
            {val: '04', label: $t('collection.prop4')},
            {val: '05', label: $t('collection.prop5')},
            {val: '06', label: $t('collection.prop6')},
            {val: '07', label: $t('collection.prop7')},
            {val: '08', label: $t('collection.prop8')},
            {val: '09', label: $t('collection.prop9')},
            {val: '99', label: $t('upgrade.others')},
          ].find(ele => ele.val == scope.row.taskProperty).label
        }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('areaManage.tmnlAssetNo')" prop="tmnlAssetNo"></el-table-column>
      <el-table-column :label="$t('change.manufacturer')" prop="factoryCode" :formatter="factoryFormat"></el-table-column>
      <el-table-column :label="$t('collection.isValid')" prop="isValid" :formatter="validFormat"></el-table-column>
      <el-table-column :label="$t('collection.disableDate')" prop="disableDate"></el-table-column>
      <el-table-column :label="$t('collection.enableDate')" prop="enableDate"></el-table-column>
      <!-- <el-table-column label="重发次数" prop="resendCount"></el-table-column> -->
      <el-table-column :label="$t('collection.sendTime')" prop="sendTime"></el-table-column>
      <el-table-column :label="$t('collection.successTime')" prop="successTime"></el-table-column>
      <el-table-column :label="$t('collection.successTimeFrom')" prop="successTimeFrom"></el-table-column>
      <el-table-column :label="$t('collection.successTimeTo')" prop="successTimeTo"></el-table-column>
    </el-table>
    <pagination
      :total="total"
      :page.sync="params.current"
      :limit.sync="params.size"
      @pagination="search"
      style="margin-top:-1px"
    />
  </basic-container>
</template>
<script>
import Pagination from '@/components/Pagination'
import { getViewList } from "@/api/autoRegister"
import { getTask, upgrade } from '@/api/collection'
export default {
  components: {
    Pagination
  },
  data () {
    return {
      params: {
        tmnlAssetNo: '',
        factoryCode: '',
        current: 1,
        size: 20,
        taskProperty: '01',
        isValid: '1',
        successTimeFrom: this.calcDate(new Date()),
        successTimeTo: new Date(),
      },
      total: 0,
      tableData: [],
      loading: false,
      tmnlFactoryList: [],
      taskProps: [
        {val: '01', label: this.$t('collection.prop1')},
        {val: '02', label: this.$t('collection.prop2')},
        {val: '03', label: this.$t('collection.prop3')},
        {val: '04', label: this.$t('collection.prop4')},
        {val: '05', label: this.$t('collection.prop5')},
        {val: '06', label: this.$t('collection.prop6')},
        {val: '07', label: this.$t('collection.prop7')},
        {val: '08', label: this.$t('collection.prop8')},
        {val: '09', label: this.$t('collection.prop9')},
        {val: '99', label: this.$t('upgrade.others')},
      ],
      selectArr: []
    }
  },
  created () {
    this.getView()
    this.search()
  },
  methods:{
    calcDate (date) {
      return new Date(date.setTime(date.getTime() - 3600 * 1000 * 24 * 7))
    },
    formatTime(val) {
      let date = new Date(val)
      return date.getFullYear() + '-' + (date.getMonth() + 1 + '').padStart(2, '0') + '-' + (date.getDate() + '').padStart(2, '0')
    },
    select (val) {
      this.selectArr = val
    },
    search () {
      this.loading = true
      let obj = {
        tmnlAssetNo: this.params.tmnlAssetNo,
        factoryCode: this.params.factoryCode,
        taskProperty: this.params.taskProperty,
        isValid: this.params.isValid,
        successTimeFrom: this.formatTime(this.params.successTimeFrom) + ' 00:00:00',
        successTimeTo: this.formatTime(this.params.successTimeTo) + ' 23:59:59',
        current: this.params.current,
        size: this.params.size,
      }
      getTask(obj).then(res => {
        if (res.data.success) {
          this.tableData = res.data.data.records
          this.total = res.data.data.total
        } else {
          this.$message({
            message: this.$t("global.searchFail"),
            type: "error"
          })
        }
        this.loading = false
      }).catch(() => {
        this.$message({
          message: this.$t("global.searchFail"),
          type: "error"
        })
        this.loading = false
      })
    },
    upgrade (val) {
      if (this.selectArr.length < 1) {
        this.$notify({
          title: this.$t('global.warn'),
          message: this.$t('global.warncont'),
          type: 'warning'
        })
        return
      }
      this.$confirm(
        this.$t("areaManage.confirmTip"),
        this.$t("areaManage.reminder"),
        {
          confirmButtonText: this.$t("global.yes"),
          cancelButtonText: this.$t("global.cancel"),
          type: "warning"
        }
      ).then(() => {
        let arr = []
        if (val) {
          arr = this.selectArr.map(ele => ({
            tmnlAssetNo: ele.tmnlAssetNo,
            taskNo: ele.taskNo,
            isValid: 1,
          }))
        } else {
          arr = this.selectArr.map(ele => ({
            tmnlAssetNo: ele.tmnlAssetNo,
            taskNo: ele.taskNo,
            isValid: 0,
          }))
        }
        upgrade(arr).then(res => {
          if (res.data.success) {
            this.$message({
              message: this.$t("global.operatorSuccess"),
              type: "success"
            })
          }
          this.search()
        })
        .catch(err => {
          this.$message({
            message: this.$t("global.operaError"),
            type: "error"
          })
        })
      })
    },
    taskPropFormat (row) {
      let obj = this.taskProps.find(ele => ele.val === row.taskProperty)
      if (obj) {
        return obj.label
      } else {
        return row.taskProperty
      }
    },
    factoryFormat (row) {
      let obj = this.tmnlFactoryList.find(ele => ele.typeCode === row.factoryCode)
      if (obj) {
        return obj.typeName
      } else {
        return row.factoryCode
      }
    },
    validFormat (row) {
      if (row.isValid == '0') {
        return this.$t('collection.invalid')
      } else if (row.isValid == '1') {
        return this.$t('collection.valid')
      } else {
        return row.isValid
      }
    },
    getView() {
      getViewList({
        viewType: "TMNLFactoryType"
      }).then(res => {
        this.tmnlFactoryList = res.data.data.list
      })
    },
  }
}
</script>
<style lang='scss' scoped>
.uptop {
  padding: 10px;
  border: 1px solid #dddddd;
  .right {
    float: right;
    span {
      padding: 0 20px;
      border-left: 1px solid #dddddd;
      cursor:pointer
    }
  }
  img {
    margin-right: 10px;
    // margin-left: 20px;
  }
  .right {
    display: flex;
  }
}
.el-date-editor {
  width: 100%!important;
}
</style>