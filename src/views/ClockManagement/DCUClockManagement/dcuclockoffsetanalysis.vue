<template>
  <basic-container>
      <el-form :inline="true" :model="params" label-position="left">
        <!-- <el-form-item :label="$t('clock.deviceName')">
          <el-input v-model="params.deviceName"></el-input>
        </el-form-item> -->
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
      <div class="uptop">
        <div>{{$t('clock.dcuHistory')}}</div>
      </div>
      <el-table :data="tableData" border style="width: 100%" height="60vh" :header-cell-style="{background:'#F2F2F2',color:'rgb(51,51,51)'}" v-loading="loading">
        <el-table-column :label="$t('change.no')" width="50">
          <template
            slot-scope="scope"
          >{{ params.size * (params.current - 1) + scope.$index + 1 }}</template>
        </el-table-column>
        <el-table-column :label="$t('clock.deviceName')" prop="tmnlAssetNo"></el-table-column>
        <el-table-column :label="$t('clock.syncTime')" prop="synTime"></el-table-column>
        <el-table-column :label="$t('clock.hostTimeBefore')" prop="hostTimeBefore"></el-table-column>
        <el-table-column :label="$t('clock.tmnlTimeBefore')" prop="tmnlTimeBefore"></el-table-column>
        <el-table-column :label="$t('clock.hostTimeAfter')" prop="hostTimeAfter"></el-table-column>
        <el-table-column :label="$t('clock.tmnlTimeAfter')" prop="tmnlTimeAfter"></el-table-column>
        <el-table-column :label="$t('clock.isAuto')" prop="isAuto" :formatter="autoFormat"></el-table-column>
        <el-table-column :label="$t('clock.userID')" prop="userName"></el-table-column>
        <el-table-column :label="$t('clock.result')" prop="resultCode" :formatter="resultFormat"></el-table-column>
      </el-table>
      <pagination
        :page.sync="params.current"
        :limit.sync="params.size"
        :total="total"
        @pagination="search"
        style="margin-top:-1px"
      ></pagination>
  </basic-container>
</template>
<script>
import Pagination from '@/components/Pagination'
import {getTmnl} from '@/api/clock'
import { mapGetters } from 'vuex'
export default {
  components: {
    Pagination
  },
  mounted () {
    this.search()
  },
  computed: {
    ...mapGetters(['treeNode'])
  },
  data () {
    return {
      params: {
        deviceName: '',
        time1: this.calcDate(new Date()),
        time2: new Date(),
        size: 20,
        current: 1
      },
      total: 0,
      tableData: [],
      tableHeight: window.innerHeight - 430,
      loading: false
    }
  },
  watch: {
    '$store.state.common.treeNode': function (data) {
      this.search()
    },
  },
  methods:{
    calcDate (date) {
      return new Date(date.setTime(date.getTime() - 3600 * 1000 * 24 * 7))
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
    autoFormat(row) {
      return row.isAuto == 0 ? this.$t('clock.auto') : this.$t('clock.noAuto')
    },
    resultFormat (row) {
      return row.resultCode === '01' ? this.$t('global.success') : this.$t('global.failure')
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
      if (this.params.time1.getTime() > this.params.time2.getTime()) {
        this.$message({
          type: 'error',
          message: this.$t('auto.timeBug')
        })
        return
      }
      this.loading = true
      let obj = {
        // terminalId: this.params.deviceName,
        startRow: this.params.current,
        pageSize: this.params.size,
        startTime: this.timeFormat(this.params.time1) + ' 00:00:00',
        endTime: this.timeFormat(this.params.time2) + ' 23:59:59',
      }
      if (this.treeNode.deviceType === 'org') {
        obj.orgNo = this.treeNode.deviceNo
      } else if (this.treeNode.deviceType === 'tmnl') {
        obj.tmnlAssetNo = this.treeNode.deviceNo
      } else if (this.treeNode.deviceType === 'meter') {
        this.tableData = []
        this.total = 0
        this.loading = false
        return
      }
      getTmnl(obj).then(res => {
        console.log(res, 'res')
        if (res.data.success) {
          if (res.data.data.count > 0) {
            this.tableData = res.data.data.list
            this.total = res.data.data.count
          } else {
            this.tableData = []
            this.total = res.data.data.count
          }
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
    }
  }
}
</script>
<style lang='scss' scoped>
.uptop {
  padding: 10px;
  margin-bottom: -1px;
  border: 1px solid #dddddd;
}
.el-form-item {
  /deep/ .el-form-item__label-wrap {
    margin-left: 0!important;
  }
}

</style>