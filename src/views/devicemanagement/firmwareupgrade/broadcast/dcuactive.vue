<template>
  <div class="cont" ref="cont">
    <el-form :inline="true" :model="formDevice" label-position="left">
      <el-form-item :label="$t('areaManage.tmnlAssetNo')" prop="assetNo">
          <el-input v-model="formDevice.assetNo" size="small" style="width: 150px"></el-input>
      </el-form-item>
      <el-form-item :label="$t('change.manufacturer')">
        <el-select v-model="formDevice.factoryId" size="small" style="width:150px;">
          <el-option :label="$t('global.all')" :value="''"></el-option>
          <el-option :label="ele.typeName" :value="ele.typeCode" v-for="(ele, i) in factoryList" :key="i"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('meterevent.eventdisc')">
        <el-select
          v-model="formDevice.typeValue"
          placeholder=""
          size="small"
          style="width: 150px"
        >
          <el-option :label="$t('home.total')" value="0"></el-option>
          <el-option label="Upgrade G3 Route Module" value="S1BE11" ></el-option>
          <el-option label="Upgrade G3 Meter Module" value="S1BF11" ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('global.from')">
      <el-date-picker
        v-model="formDevice.starttime"
        type="date"
        size="small"
        :clearable="false"
        :editable="false"
        style="width:150px;">
      </el-date-picker>
      </el-form-item>
      <el-form-item :label="$t('global.to')">
        <el-date-picker
          v-model="formDevice.endtime"
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
    <div class="uptop">
      <div>{{$t('global.deviceinfo')}}</div>
    </div>
    <el-table
      :data="dcuactiveData.listitem"
      border
      :header-cell-style="{background:'#F2F2F2',color:'rgb(51,51,51)'}"
      height="53vh"
      v-loading="loading"
    >
      <el-table-column type="selection"></el-table-column>
      <el-table-column :label="$t('global.id')" width="80">
        <template slot-scope="scope">{{ dcuactiveData.pageSize*(dcuactiveData.pageNum-1)+scope.$index+1 }}</template>
      </el-table-column>
      <el-table-column prop="terminalId" :label="$t('meterevent.dcuname')"></el-table-column>
      <el-table-column prop="commAddr" :label="$t('meterevent.dcuno')"></el-table-column>
      <el-table-column prop="colTime" :label="$t('meterevent.eventtime')">
      </el-table-column>
      <el-table-column prop="recTime" :label="$t('meterevent.reporttime')">
      </el-table-column>
      <el-table-column prop="eventName" :label="$t('meterevent.eventdisc')">
      </el-table-column>
    </el-table>
    <pagination
      :total="dcuactiveData.total"
      :page.sync="dcuactiveData.pageNum"
      :limit.sync="dcuactiveData.pageSize"
      @pagination="search"
      style="margin-top:-1px"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { queryDcuEventData } from '@/api/firmwareUpgrade'
import { getViewList } from '@/api/autoRegister'
import Pagination from '@/components/Pagination'
export default {
  components: {
    Pagination
  },
  data () {
    return {
      dcuactiveData: {
        pageSize: 20,
        pageNum: 1,
        listitem: [],
        total: 0
      },
      dcutitle: '',
      formDevice:{
        starttime: this.calcDate(new Date()),
        endtime: new Date(),
        typeValue: '0',
        assetNo: '',
        factoryId: ''
      },
      selectDCU: '',
      loading: false,
      factoryList: [],
    }
  },
  computed: {
    ...mapGetters(['treeNode', 'level', 'broadcastActiveName', 'colorName'])
  },
  watch: {
    treeNode (data) {
      this.search()
    },
  },
  mounted () {
    this.getView()
    this.search()
  },
  methods: {
    calcDate (date) {
      return new Date(date.setTime(date.getTime() - 3600 * 1000 * 24 * 7))
    },
    // getData () {
    //     this.loading = true
    //     let obj = {
    //       opttype: 3,
    //       orgNo: this.treeNode.deviceNo,
    //       bgTime: this.timeFormat(this.formDevice.starttime) + ' 00:00:00',
    //       endTime: this.timeFormat(this.formDevice.endtime) + ' 23:59:59',
    //       tmnlAssetNo: this.formDevice.typeValue,
    //       pageNum: this.dcuactiveData.pageNum,
    //       pageSize: this.dcuactiveData.pageSize,
    //     }
    //     queryBroadCastTask(obj).then(res => {
    //       if (res.data.success) {
    //         this.dcuactiveData.listitem = res.data.data.listitem
    //         this.dcuactiveData.total = res.data.data.total
    //       }
    //       this.loading = false
    //     }).catch(() => {
    //       this.loading = false
    //     })
    // },
    getDCUData () {
        this.loading = true
        let obj = {
          // orgNo: this.treeNode.deviceNo,
          startTime: this.timeFormat(this.formDevice.starttime) + ' 00:00:00',
          endTime: this.timeFormat(this.formDevice.endtime) + ' 23:59:59',
          pageSize: this.dcuactiveData.pageSize,
          startRow: this.dcuactiveData.pageNum,
          eventCodes: this.formDevice.typeValue == 0 ? ["S1BE11", "S1BF11"] : [this.formDevice.typeValue],
          factoryId: this.formDevice.factoryId,
          assetNo: this.formDevice.assetNo,
        }
        if (this.treeNode.deviceType === 'org') {
          if (this.treeNode.deviceNo) {
            obj.orgNo = this.treeNode.deviceNo
          } else {
            obj.orgNo = this.treeNode.deviceName
          }
        } else if (this.treeNode.deviceType === 'tmnl') {
          if (this.treeNode.deviceNo) {
            obj.tmnlAssetNo = this.treeNode.deviceNo
          } else {
            obj.tmnlAssetNo = this.treeNode.deviceName
          }
        } else if (this.treeNode.deviceType === 'meter') {
          if (this.treeNode.deviceNo) {
            obj.tmnlAssetNo = this.treeNode.deviceNo
          } else {
            obj.tmnlAssetNo = this.treeNode.deviceName
          }
        }
        queryDcuEventData(obj).then(res => {
          if (res.data.success) {
            this.dcuactiveData.listitem = res.data.data.list
            this.dcuactiveData.total = res.data.data.count
          }
          this.loading = false
        }).catch(() => {
          this.loading = false
        })
    },
    timeFormat (date) {
      return date.getFullYear() + '-' + (date.getMonth() + 1 + '').padStart(2, '0') + '-' + (date.getDate() + '').padStart(2, '0')
    },
    search () {
      if (this.broadcastActiveName !== '3') return
      if (!this.treeNode) {
        this.$notify({
            title: this.$t('global.warn'),
            message: this.$t('global.warntree'),
            type: 'warning'
        })
        return
      }
      if (this.formDevice.starttime.getTime() > this.formDevice.endtime.getTime()) {
        this.$message({
            type: "error",
            message: this.$t('auto.timeBug')
        })
        return
      }
      this.getDCUData()
    },
    getView() {
      getViewList({
        viewType: 'TMNLFactoryType'
      }).then(res => {
        this.factoryList = res.data.data.list
      })
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
