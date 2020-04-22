<template>
  <div class="cont" ref="cont">
    <el-form :inline="true" :model="formMeterActive" label-position="left">
      <el-form-item :label="$t('areaManage.tmnlAssetNo')">
        <el-input :maxlength="30" v-model="formMeterActive.value" size="small"></el-input>
      </el-form-item>
      <el-form-item :label="$t('change.manufacturer')">
        <el-select v-model="formMeterActive.factoryId" size="small" style="width:100%">
          <el-option :label="$t('global.all')" :value="''"></el-option>
          <el-option :label="ele.typeName" :value="ele.typeCode" v-for="(ele, i) in tmnlFactoryList" :key="i"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('upgrade.upgradestatus')" style="margin-right:30px">
        <el-select v-model="formMeterActive.status" style="width: 100%;" size="small">
          <el-option :label="$t('auto.all')" :value="''"></el-option>
          <!-- <el-option :label="$t('upgrade.readyforactive')" value="2"></el-option>
          <el-option :label="$t('upgrade.activated')" value="3"></el-option>
          <el-option :label="$t('upgrade.failed')" value="4"></el-option>
          <el-option :label="$t('upgrade.stopped')" value="5"></el-option>-->
          <el-option label="Waiting to upgrade..." :value="1"></el-option>
          <el-option label="Initiating" :value="2"></el-option>
          <el-option label="Initiated" :value="3"></el-option>
          <el-option label="Sending" :value="4"></el-option>
          <el-option label="Ready for activating" :value="5"></el-option>
          <el-option label="Activate immediate" :value="6"></el-option>
          <!-- <el-option label="Activate by schedule" :value="7"></el-option> -->
          <el-option label="Activated" :value="8"></el-option>
          <el-option label="Failed" :value="9"></el-option>
          <el-option label="Stopped" :value="10"></el-option>
          <!-- <el-option label="Completeness check" :value="11"></el-option>
          <el-option label="Sent" :value="12"></el-option> -->
          <el-option label="Sending missing blocks" :value="13"></el-option>
          <el-option label="Verification" :value="14"></el-option>
          <!-- <el-option label="Suspend" :value="15"></el-option>
          <el-option label="Resume" :value="16"></el-option> -->
          <el-option label="Success" :value="17"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('upgrade.taskBgTime')">
        <el-date-picker
          v-model="formMeterActive.bgTime"
          type="date"
          size="small"
          :clearable="false"
          :editable="false"
          style="width:150px">
        </el-date-picker>
      </el-form-item>
      <el-form-item :label="$t('global.to')">
        <el-date-picker
          v-model="formMeterActive.endTime"
          type="date"
          size="small"
          :clearable="false"
          :editable="false"
          style="width:150px">
        </el-date-picker>
      </el-form-item>
      <!-- <el-form-item :label="$t('upgrade.devtype')">
        <el-select v-model="formMeterActive.type" style="width: 100%;" size="small">
          <el-option :label="$t('upgrade.nbg')" :value="7"></el-option>
          <el-option :label="$t('upgrade.meter')" :value="3"></el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item>
        <el-button type="primary" @click="search" size="small">{{$t('global.search')}}</el-button>
      </el-form-item>
    </el-form>
    <div class="uptop">
      <div>{{$t('global.deviceinfo')}}</div>
      <div class="right">
        <span @click="activeNow" style="cursor:pointer">
          <img src="img/Immediateactivate.png" alt />
          {{$t('upgrade.immediateactivate')}}
        </span>
        <span @click="activeDialog" style="cursor:pointer">
          <img src="img/Scheduleactivate.png" alt />
          {{$t('upgrade.scheduleactivate')}}
        </span>
        <!-- <span @click="batch" style="cursor:pointer"><img src="../../../../../static/images/Remove.png" alt=""> {{$t('upgrade.removeactivated')}}</span> -->
      </div>
    </div>
    <el-table
      :data="meteractiveData.listitem"
      border
      :header-cell-style="{background:'#F2F2F2',color:'rgb(51,51,51)'}"
      height="53vh"
      @selection-change="dcuActiveSelect"
      v-loading="loading"
    >
      <el-table-column type="selection"></el-table-column>
      <el-table-column :label="$t('global.id')" width="80">
        <template slot-scope="scope">{{ meteractiveData.pageSize * (meteractiveData.pageNum - 1) + scope.$index + 1 }}</template>
      </el-table-column>
      <el-table-column prop="fileName" :label="$t('areaManage.fileName')">
        <template slot-scope="scope">
          <span :title="scope.row.fileName">{{scope.row.fileName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="partType" :label="$t('upgrade.parttype')">
        <template slot-scope="scope">{{changeParttype(scope.row.partType)}}</template>
      </el-table-column>
      <el-table-column prop="tmnlAssetNo" :label="$t('areaManage.tmnlAssetNo')"></el-table-column>
      <el-table-column prop="taskStatus" :label="$t('upgrade.upgradestatus')">
        <template slot-scope="scope">{{changeStatus(scope.row.taskStatus)}}</template>
      </el-table-column>
      <el-table-column prop="blockNum" :label="$t('upgrade.totalclock')"></el-table-column>
      <el-table-column prop="blockNo" :label="$t('upgrade.upnum')"></el-table-column>
      <el-table-column prop="stepNo" :label="$t('upgrade.upprocedureinfor')"></el-table-column>
      <el-table-column prop="creatTime" :label="$t('upgrade.createtime')">
        <template slot-scope="scope">{{formatTimeT(scope.row.creatTime)}}</template>
      </el-table-column>
      <el-table-column prop="lastTime" :label="$t('upgrade.lastTime')" width="130">
      </el-table-column>
    </el-table>
    <el-pagination
      style="text-align:left;margin-top:20px;"
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :page-sizes="[20, 40, 60, 200]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="meteractiveData.total"
    ></el-pagination>

    <el-dialog
      :title="dcutitle"
      :visible.sync="dcuactiveDialog"
      width="40%"
      :before-close="dcuactiveClose"
    >
      <el-form
        :model="formMeter"
        label-width="auto"
        label-position="left"
        style="width:60%;margin:0 auto;"
        :rules="timeRules"
        ref="formMeter"
      >
        <el-form-item :label="$t('upgrade.activetime')" prop="activateTime">
          <el-date-picker
            v-model="formMeter.activateTime"
            type="datetime"
            placeholder
            size="small"
            value-format="yyyy-MM-dd HH:mm:ss"
            :clearable="false"
            :editable="false"
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align:right;">
        <el-button @click="dcuactiveDialog = false" size="small">{{$t('global.cancel')}}</el-button>
        <el-button type="primary" @click="timeActive" size="small">{{$t('auto.confirm')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { updateUpgradeProcessInfo, queryDcuUpgradeActiveInfo } from '@/api/firmwareUpgrade'
import { getViewList } from '@/api/autoRegister'
import { mapGetters } from 'vuex'
export default {
  components: {},
  data() {
    return {
      meteractiveData: {
        pageSize: 20,
        pageNum: 1,
        listitem: [],
        total: 0
      },
      formMeterActive: {
        value:'',
        status: '',
        meterType: 1,
        factoryId: '',
        bgTime: this.calcDate(new Date()),
        endTime: new Date(),
      },
      formMeter: {
        activateTime: ''
      },
      dcutitle: "",
      dcuactiveDialog: false,
      selectDCU: "",
      loading: false,
      timeRules: {
        activateTime: [
          {
            required: true,
            message: this.$t("upgrade.selectTime"),
            trigger: "blur"
          }
        ]
      },
      tableHeight: window.innerHeight - 480,
      tmnlFactoryList: [],
    };
  },
  computed: {
    ...mapGetters(['treeNode', 'level', 'upgradeActiveName'])
  },
  watch: {
    '$store.state.common.treeNode': function (data) {
      this.getMeterData()
    }
  },
  created () {
    this.getView()
  },
  mounted() {

  },
  methods: {
    calcDate (date) {
      return new Date(date.setTime(date.getTime() - 3600 * 1000 * 24 * 7))
    },
    timeFormat(date) {
      return date.getFullYear() + '-' + (date.getMonth() + 1 + '').padStart(2, '0') + '-' + (date.getDate() + '').padStart(2, '0')
    },
    getView() {
      getViewList({
        viewType: 'TMNLFactoryType'
      }).then(res => {
        this.tmnlFactoryList = res.data.data.list
      })
    },
    getMeterData() {
      if (this.upgradeActiveName !== 'fourth') return
      // if (this.level !== 6) {
      //   this.$notify({
      //       title: this.$t('global.warn'),
      //       message: this.$t('global.seldcunode'),
      //       type: 'warning'
      //   })
      //   return
      // }
      this.loading = true
      let obj = {
        deviceTypes: ['10', '11'],
        fileType: 2,
        pageNum: this.meteractiveData.pageNum,
        pageSize: this.meteractiveData.pageSize,
        tmnlAssetNo: this.formMeterActive.value,
        taskStatus: this.formMeterActive.status,
        // orgNo: this.treeNode.deviceNo,
        factoryId: this.formMeterActive.factoryId,
        bgTime: this.timeFormat(this.formMeterActive.bgTime) + ' 00:00:00',
        endTime: this.timeFormat(this.formMeterActive.endTime) + ' 23:59:59',
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
      queryDcuUpgradeActiveInfo(obj).then(res => {
        if (res.data.success) {
          this.meteractiveData.listitem = res.data.data.listitem
          this.meteractiveData.total = res.data.data.total
        } else {
          this.$message({
            message: this.$t("global.operaError"),
            type: "error"
          })
        }
        this.loading = false
      })
    },
    search() {
      this.getMeterData()
    },
    dcuActiveSelect(val) {
      this.selectDCU = val
    },
    handleSizeChange(val) {
      this.meteractiveData.pageSize = val
      this.getMeterData()
    },
    handleCurrentChange(val) {
      this.meteractiveData.pageNum = val
      this.getMeterData()
    },
    activeNow() {
      if (this.selectDCU.length != 0) {
        this.$confirm(
          this.$t("areaManage.confirmTip"),
          this.$t("areaManage.reminder"),
          {
            confirmButtonText: this.$t("global.yes"),
            cancelButtonText: this.$t("global.cancel"),
            type: "warning"
          }
        )
          .then(() => {
            updateUpgradeProcessInfo({
              activateMode: 'FFFF-FF-FF FF:FF:FF',
              id: this.selectDCU[0].id
            }).then(res => {
              if (res.data.success) {
                this.$message({
                  message: this.$t("global.operatorSuccess"),
                  type: "success"
                })
                this.getMeterData()
              } else {
                this.$message({
                  message: this.$t("global.operaError"),
                  type: "error"
                })
              }
            })
          })
          .catch(() => {})
      } else {
        this.$notify({
          title: this.$t("global.warn"),
          message: this.$t("global.warncont"),
          type: "warning"
        });
      }
    },
    activeDialog() {
      if (this.selectDCU.length === 0) {
        this.$notify({
          title: this.$t("global.warn"),
          message: this.$t("global.warncont"),
          type: "warning"
        })
        return
      }
      if (this.selectDCU[0].taskStatus !== 5) {
        this.$notify({
          title: this.$t("global.warn"),
          message: this.$t("remote.noUpgrade"),
          type: "warning"
        })
        return
      }
      this.dcuactiveDialog = true
    },
    timeActive () {
      this.$refs['formMeter'].validate(valid => {
        if (!valid) return
        let obj = {
          activateMode: this.formMeter.activateTime,
          activateTime: this.formMeter.activateTime,
          id: this.selectDCU[0].id
        }
        updateUpgradeProcessInfo(obj).then(res => {
          if (res.data.success) {
            this.$message({
              message: this.$t("global.deleteSuccess"),
              type: "success"
            })
            this.dcuactiveDialog = false
            this.getDCUdata()
          } else {
            this.$message({
              message: this.$t("global.operaError"),
              type: "error"
            });
          }
        })
      })
    },
    dcuactiveClose() {
      this.formMeter.activateTime = ''
      this.dcuactiveDialog = false
    },
    formatTimeT(val) {
      let date = new Date(val)
      return date.getFullYear() + '-' + (date.getMonth() + 1 + '').padStart(2, '0') + '-' + (date.getDate() + '').padStart(2, '0') + ' ' + (date.getHours() + '').padStart(2, '0') + ':' + (date.getMinutes() + '').padStart(2, '0') + ':' + (date.getSeconds() + '').padStart(2, '0')
    },
    changeParttype(val) {
      if (val == 5) {
        return '3P WC Meter Upgrade'
      } else if (val == 6) {
        return '3P CT Meter Upgrade'
      } else if (val == 7) {
        return '3P CTVT Meter Upgrade'
      } else if (val == 2) {
        return '4G/NB Meter Module Upgrade'
      }
      // switch (val) {
      //   case 1:
      //     return "PRIME parts";
      //     break;
      //   case 2:
      //     return "Communication Module(Non-PRIME) ";
      //     break;
      //   case 3:
      //     return "Meter parts";
      //     break;
      //   case 4:
      //     return "Data Concentrator";
      //     break;
      //   case 5:
      //     return "3P Direct connection meter";
      //     break;
      //   case 6:
      //     return "3P CT meter";
      //     break;
      //   case 7:
      //     return "3P CT/PT meter";
      //     break;
      // }
    },
    changeStatus(val) {
      switch (val) {
        case 1:
          return "Waiting to upgrade...";
          break;
        case 2:
          return "Initiating";
          break;
        case 3:
          return "Initiated";
          break;
        case 4:
          return "Sending";
          break;
        case 5:
          return "Ready for activating";
          break;
        case 6:
          return "Activate immediate";
          break;
        case 7:
          return "Activate by schedule";
          break;
        case 8:
          return "Activated";
          break;
        case 9:
          return "Failed";
          break;
        case 10:
          return 'Stopped';
          break;
        case 11:
          return 'Completeness check';
          break;
        case 12:
          return 'Sent';
          break;
        case 13:
          return 'Sending missing blocks';
          break;
        case 14:
          return 'Verification';
          break;
        case 15:
          return 'Suspend';
          break;
        case 16:
          return 'Resume';
          break;
        case 17:
          return 'Success';
          break;
      }
    }
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
    padding: 0 20px;
    border-left: 1px solid #dddddd;
  }
  img {
    margin-right: 10px;
    // margin-left: 20px;
  }
  .right {
    display: flex;
  }
}
  .el-form-item {
    /deep/ .el-form-item__label {
      padding-right: 30px;
      text-align: right;
    }
  }
</style>
