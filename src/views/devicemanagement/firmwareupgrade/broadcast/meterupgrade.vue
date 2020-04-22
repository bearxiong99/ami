<template>
  <div class="cont updataproce" ref="cont">
    <el-form :inline="true" :model="formDevice" label-position="left" ref="dcuform">
      <el-form-item :label="$t('areaManage.tmnlAssetNo')" prop="assetNo">
        <el-input v-model="formDevice.assetNo" size="small" style="width: 150px"></el-input>
      </el-form-item>
      <el-form-item :label="$t('change.manufacturer')">
        <el-select v-model="formDevice.factoryId" size="small" style="width: 150px">
          <el-option :label="$t('global.all')" :value="''"></el-option>
          <el-option :label="ele.typeName" :value="ele.typeCode" v-for="(ele, i) in factoryList" :key="i"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('upgrade.upgradestatus')">
        <el-select v-model="formDevice.taskStatus" size="small" style="width: 150px">
          <el-option :label="$t('global.all')" :value="''"></el-option>
          <el-option label="Waiting" :value="0"></el-option>
          <el-option label="Success" :value="1"></el-option>
          <el-option label="Failure" :value="2"></el-option>
          <el-option label="Transfer" :value="3"></el-option>
          <el-option label="Verify" :value="4"></el-option>
          <el-option label="Activated" :value="5"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item  prop="starttime" :label="$t('global.from')">
      <el-date-picker
        v-model="formDevice.starttime"
        type="date"
        size="small"
        :clearable="false"
        :editable="false"
        style="width: 150px">
      </el-date-picker>
      </el-form-item>
      <el-form-item prop="endtime" :label="$t('global.to')">
        <el-date-picker
          v-model="formDevice.endtime"
          type="date"
          size="small"
          :clearable="false"
          :editable="false"
          style="width: 150px">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search" size="small">{{$t('global.search')}}</el-button>
      </el-form-item>
    </el-form>
    <div class="uptop">
      <div>{{$t('upgrade.upprocedureinfor')}}</div>
    </div>
    <el-table
      :data="upData.listitem"
      border
      :header-cell-style="{background:'#F2F2F2',color:'rgb(51,51,51)'}"
      height="53vh"
      v-loading="loading"
    >
      <el-table-column type="selection"></el-table-column>
      <el-table-column :label="$t('global.id')" width="80">
        <template slot-scope="scope">{{ upData.pageSize * (upData.pageNum - 1) + scope.$index + 1 }}</template>
      </el-table-column>
      <!-- <el-table-column prop="disc" :label="$t('areaManage.name')" ></el-table-column> -->
      <el-table-column prop="tmnlAddr" :label="$t('areaManage.tmnlAssetNo')" ></el-table-column>
      <el-table-column prop="meterSn" :label="$t('areaManage.meterAssetNo')" ></el-table-column>
      <el-table-column prop="eventTime" :label="$t('meterevent.eventtime')" ></el-table-column>
      <el-table-column prop="fileVersion" :label="$t('upgrade.version')"></el-table-column>
      <el-table-column prop="errorCode" :label="$t('upgraderesult.error')"></el-table-column>
      <el-table-column prop="taskStatus" :label="$t('upgrade.upgradestatus')">
        <template slot-scope="scope">{{ changeStatus(scope.row.taskStatus) }}</template>
      </el-table-column>
    </el-table>
    <pagination
      :total="upData.total"
      :page.sync="upData.pageNum"
      :limit.sync="upData.pageSize"
      @pagination="search"
      style="margin-top:-1px"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { format } from 'date-fns'
import { queryBroadCastTask } from '@/api/firmwareUpgrade'
import { getViewList } from '@/api/autoRegister'
import Pagination from '@/components/Pagination'
export default {
  components: {
    Pagination
  },
  data () {
    return {
      upData: {
        pageSize: 20,
        pageNum: 1,
        listitem: [],
        total: 0
      },
      formDevice: {
        starttime:this.calcDate(new Date()),
        endtime:new Date(),
        assetNo: '',
        factoryId: '',
        taskStatus: ''
      },
      selectUpData: '',
      loading: false,
      tableHeight: window.innerHeight - 480,
      factoryList: [],
    };
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
    this.getView()
    this.search()
  },
  methods: {
    calcDate (date) {
      return new Date(date.setTime(date.getTime() - 3600 * 1000 * 24 * 7))
    },
    getData () {
      this.loading = true
      let obj = {
        opttype: 2,
        bgTime: this.timeFormat(this.formDevice.starttime) + ' 00:00:00',
        endTime: this.timeFormat(this.formDevice.endtime) + ' 23:59:59',
        pageNum: this.upData.pageNum,
        pageSize: this.upData.pageSize,
        factoryId: this.formDevice.factoryId,
        assetNo: this.formDevice.assetNo,
        taskStatus: this.formDevice.taskStatus
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
      queryBroadCastTask(obj).then(res => {
        this.upData.listitem = res.data.data.listitem
        this.upData.total = res.data.data.total
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    timeFormat (date) {
      return date.getFullYear() + '-' + (date.getMonth() + 1 + '').padStart(2, '0') + '-' + (date.getDate() + '').padStart(2, '0')
    },
    search () {
      if (this.broadcastActiveName !== '2') return
      if (this.formDevice.starttime.getTime() > this.formDevice.endtime.getTime()) {
        this.$message({
            type: "error",
            message: this.$t('auto.timeBug')
        })
        return
      }
      this.getData()
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
        return 'Waiting';
        break;
      case 1:
        return 'Success';
        break;
      case 2:
        return 'Failure';
        break;
      case 3:
        return 'Transfer';
        break;
      case 4:
        return 'Verify';
        break;
      case 5:
        return 'Activated';
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
.updataproce {
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
