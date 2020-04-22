<template>
  <div class="cont" ref="cont">
      <el-form :inline="true" :model="formMeter" label-position="left">
        <el-form-item :label="$t('areaManage.meterAssetNo')">
          <el-input v-model="formMeter.commAddr" size="small" style="width: 150px"></el-input>
        </el-form-item>
        <el-form-item :label="$t('meterevent.eventdisc')">
          <el-select
            v-model="formMeter.typeValue"
            placeholder=""
            size="small"
          >
            <el-option :label="$t('home.total')" value="0"></el-option>
            <el-option label="Upgrade ugrade successfully" value="S19E11" ></el-option>
            <el-option label="Upgrade ugrade failed" value="S19F11" ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('global.from')">
        <el-date-picker
          v-model="formMeter.starttime"
          type="date"
          size="small"
          :clearable="false"
          :editable="false"
          style="width:150px;">
        </el-date-picker>
        </el-form-item>
        <el-form-item :label="$t('global.to')">
          <el-date-picker
            v-model="formMeter.endtime"
            type="date"
            size="small"
            :clearable="false"
            :editable="false"
            style="width:150px;">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search" size="small">{{$t('global.search')}}</el-button>
        </el-form-item>
      </el-form>
      <el-table
      :data="meterTableData"
      border
      height="53vh"
      v-loading="loading"
      :header-cell-style="{background:'#F2F2F2',color:'rgb(51,51,51)'}">
        <el-table-column :label="$t('global.id')" width="80">
          <template slot-scope="scope">{{ meterPage.pageSize*(meterPage.pageNum-1)+scope.$index+1 }}</template>
        </el-table-column>
        <el-table-column :label="$t('areaManage.tmnlAssetNo')" prop="terminalAddr"></el-table-column>
        <el-table-column :label="$t('auto.meteraddress')" prop="commAddr"></el-table-column>
        <el-table-column :label="$t('upgrade.eventName')">
          <template slot-scope="scope">
            {{eventNameFormat(scope.row.eventCode)}}
          </template>
        </el-table-column>
        <!-- <el-table-column :label="$t('upgrade.datatime')" prop="dataTime"></el-table-column> -->
        <el-table-column :label="$t('upgrade.colTime')" prop="colTime"></el-table-column>
        <el-table-column :label="$t('upgrade.recTime')" prop="recTime"></el-table-column>
        <el-table-column :label="$t('upgrade.operator')" prop="operatorAccount"></el-table-column>
      </el-table>
      <pagination
        :total="meterPage.total"
        :page.sync="meterPage.pageNum"
        :limit.sync="meterPage.pageSize"
        @pagination="searchMeter"
        style="margin-top:-1px"
      />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { queryMetEventData } from '@/api/firmwareUpgrade'
import { getViewList } from '@/api/autoRegister'
import Pagination from '@/components/Pagination'
export default {
  components: {
    Pagination
  },
  data () {
    return {
      formMeter: {
        starttime: this.calcDate(new Date()),
        endtime: new Date(),
        typeValue: '0',
        commAddr: ''
      },
      meterPage: {
        total: 0,
        pageNum: 1,
        pageSize: 20,
      },
      meterTableData: [],
      loading: false,
      factoryList: [],
    }
  },
  computed: {
    ...mapGetters(['treeNode', 'level', 'broadcastActiveName'])
  },
  watch: {
    treeNode (data) {
      this.search()
    },
  },
  mounted () {
    this.search()
  },
  methods: {
    calcDate (date) {
      return new Date(date.setTime(date.getTime() - 3600 * 1000 * 24 * 7))
    },
    search () {
      if (this.broadcastActiveName !== '4') return
      if (!this.treeNode) {
        this.$notify({
            title: this.$t('global.warn'),
            message: this.$t('global.warntree'),
            type: 'warning'
        })
        return
      }
      if (this.formMeter.starttime.getTime() > this.formMeter.endtime.getTime()) {
        this.$message({
            type: "error",
            message: this.$t('auto.timeBug')
        })
        return
      }
      this.searchMeter()
    },
    searchMeter () {
      this.loading = true
      let obj = {
        startTime: this.timeFormat(this.formMeter.starttime) + ' 00:00:00',
        endTime: this.timeFormat(this.formMeter.endtime) + ' 23:59:59',
        pageSize: this.meterPage.pageSize,
        startRow: this.meterPage.pageNum,
        eventCodes: this.formMeter.typeValue == 0 ? ["S19E11", "S19F11"] : [this.formMeter.typeValue],
        commAddr: this.formMeter.commAddr
      }
      if (this.treeNode.deviceType === 'org') {
        if (this.treeNode.deviceNo) {
          obj.orgNo = this.treeNode.deviceNo
        } else {
          obj.orgNo = this.treeNode.deviceName
        }
      } else if (this.treeNode.deviceType === 'tmnl') {
        if (this.treeNode.deviceNo) {
          obj.terminalAddr = this.treeNode.deviceNo
        } else {
          obj.terminalAddr = this.treeNode.deviceName
        }
      } else if (this.treeNode.deviceType === 'meter') {
        if (this.treeNode.deviceNo) {
          obj.meterId = this.treeNode.deviceNo
        } else {
          obj.meterId = this.treeNode.deviceName
        }
      }
      queryMetEventData(obj).then(res => {
        if (res.data.success) {
          if (res.data.data.total) {
            this.meterTableData = res.data.data.records
            this.meterPage.total = res.data.data.total
          } else {
            this.meterTableData = []
          }
        }
        this.loading = false
      })
      .catch (err => {
        this.loading = false
      })
    },
    timeFormat (date) {
      return date.getFullYear() + '-' + (date.getMonth() + 1 + '').padStart(2, '0') + '-' + (date.getDate() + '').padStart(2, '0')
    },
    eventNameFormat (val) {
      if (val === 'S19E11') {
        return 'Upgrade ugrade successfully'
      } else if (val === 'S19F11') {
        return 'Upgrade ugrade failed'
      } else {
        return val
      }
    },
    changeStatus (val) {
      switch (val) {
      case 0:
        return 'Progress';
        break;
      case 1:
        return 'Route Success';
        break;
      case 2:
        return 'Meter Success';
        break;
      case 3:
        return 'Meter Finish';
        break;
      case 4:
        return 'File Error';
        break;
      case 5:
        return 'Router Error';
        break;
      case 6:
        return 'Meter Error';
        break;
      case 7:
        return 'Meter Offline';
        break;
      }
    },
    getView() {
      getViewList({
        viewType: 'TMNLFactoryType'
      }).then(res => {
        this.factoryList = res.data.data.list
      })
    },
  }
};
</script>

<style scoped lang="scss">
.cont {
  width: 100%;
  box-sizing: border-box;
}
.uptop {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  border: 1px solid #dddddd;
  span {
    display: flex;
    align-items: center;
    border-left: 1px solid #dddddd;
    padding-right: 15px;
  }
  img {
    margin-right: 10px;
    margin-left: 20px;
  }
  .right {
    display: flex;
  }
}
.el-form {
  display: flex;
  .el-form--inline {
    /deep/ .el-form-item {
      display: block;
    }
  }
}
</style>
