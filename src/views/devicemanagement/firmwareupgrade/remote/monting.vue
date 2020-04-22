<template>
  <div class="cont updataproce" ref="cont">
    <el-form :inline="true" :model="formDevice" label-position="left">
      <el-form-item :label="$t('upgrade.devtype')">
        <el-select v-model="formDevice.deviceType" style="width: 100%;" size="small" @change="search">
          <el-option :label="$t('upgrade.dcu')" :value="1"></el-option>
          <el-option :label="$t('upgrade.nbg')" :value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('change.manufacturer')">
        <el-select v-model="formDevice.factoryId" size="small" style="width:100%">
          <el-option :label="$t('global.all')" :value="''"></el-option>
          <el-option :label="ele.typeName" :value="ele.typeCode" v-for="(ele, i) in tmnlFactoryList" :key="i"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('upgrade.upgradestatus')">
        <el-select v-model="formDevice.taskStatus" size="small" style="width:100%">
          <el-option :label="$t('global.all')" :value="''"></el-option>
          <el-option label="Waiting to upgrade..." :value="1"></el-option>
          <el-option label="Initiating" :value="2"></el-option>
          <el-option label="Initiated" :value="3"></el-option>
          <el-option label="Sending" :value="4"></el-option>
          <el-option label="Ready for activating" :value="5"></el-option>
          <el-option label="Activate immediate" :value="6"></el-option>
          <el-option label="Activated" :value="8"></el-option>
          <el-option label="Failed" :value="9"></el-option>
          <el-option label="Stopped" :value="10"></el-option>
          <el-option label="Sending missing blocks" :value="13"></el-option>
          <el-option label="Verification" :value="14"></el-option>
          <el-option label="Success" :value="17"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('upgrade.taskBgTime')">
        <el-date-picker
          v-model="formDevice.bgTime"
          type="date"
          size="small"
          :clearable="false"
          :editable="false"
          style="width:150px">
        </el-date-picker>
      </el-form-item>
      <el-form-item :label="$t('global.to')">
        <el-date-picker
          v-model="formDevice.endTime"
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
      <div>{{$t('upgrade.upprocedureinfor')}}</div>
      <div class="right">
        <span @click="search" style="cursor:pointer">
          <img src="img/Refresh.png" alt />
          {{$t('upgrade.refresh')}}
        </span>
        <span @click="reUprade(1)" style="cursor:pointer">
          <img src="img/Reupgrade.png" alt />
          {{$t('upgrade.reupgrade')}}
        </span>
        <span @click="reUprade(2)" style="cursor:pointer">
          <img src="img/stop.png" alt />
          {{$t('upgrade.stop')}}
        </span>
        <span @click="delList()" style="cursor:pointer">
          <img src="img/Remove.png" alt />
          {{$t('upgrade.remove')}}
        </span>
      </div>
    </div>
    <el-table
      :data="upData.listitem"
      border
      :header-cell-style="{background:'#F2F2F2',color:'rgb(51,51,51)'}"
      height="53vh"
      @selection-change="upDataSelect"
      v-loading="loading"
    >
      <el-table-column type="selection"></el-table-column>
      <el-table-column :label="$t('global.id')" width="80">
        <template slot-scope="scope">{{ upData.pageSize * (upData.pageNum - 1) + scope.$index + 1 }}</template>
      </el-table-column>
      <el-table-column prop="fileName" :label="$t('areaManage.fileName')" width="160">
        <template slot-scope="scope">
          <span :title="scope.row.fileName">{{scope.row.fileName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="partType" :label="$t('upgrade.parttype')" width="130">
        <template slot-scope="scope">{{changeParttype(scope.row.partType, scope.row.fileType)}}</template>
      </el-table-column>
      <el-table-column prop="tmnlAssetNo" :label="$t('areaManage.tmnlAssetNo')" width="130"></el-table-column>
      <el-table-column prop="taskStatus" :label="$t('upgrade.upgradestatus')" width="150">
        <template slot-scope="scope">{{changeStatus(scope.row.taskStatus)}}</template>
      </el-table-column>
      <el-table-column prop="errCode" :label="$t('upgrade.codeinfo')">
        <template slot-scope="scope">{{changeCode(scope.row.errCode)}}</template>
      </el-table-column>
      <el-table-column prop="blockNum" :label="$t('upgrade.totalclock')"></el-table-column>
      <el-table-column prop="blockNo" :label="$t('upgrade.upnum')"></el-table-column>
      <!-- <el-table-column prop="stepNo" :label="$t('upgrade.upprocedureinfor')"></el-table-column> -->
      <el-table-column prop="creatTime" :label="$t('upgrade.createtime')" width="130">
        <!-- <template slot-scope="scope">{{formatTimeT(scope.row.creatTime)}}</template> -->
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
      :total="upData.total"
    ></el-pagination>
  </div>
</template>

<script>
import { queryDcuUpgradeProcessInfo, queryMeterUpgradeProcessInfo, optUpgradeProcessInfo, delUpgradeProcessInfo } from '@/api/firmwareUpgrade'
import { getViewList } from '@/api/autoRegister'
import { mapGetters } from 'vuex'
export default {
  components: {},
  data() {
    return {
      upData: {
        pageSize: 20,
        pageNum: 1,
        listitem: [],
        total: 0
      },
      formDevice: {
        deviceType: 1,
        factoryId: '',
        bgTime: this.calcDate(new Date()),
        endTime: new Date(),
        taskStatus: ''
      },
      selectUpData: "",
      loading: false,
      tableHeight: window.innerHeight - 480,
      tmnlFactoryList: [],
    };
  },
  created () {
    this.getView()
  },
  mounted() {
  },
  computed: {
    ...mapGetters(['treeNode', 'level', 'upgradeActiveName'])
  },
  watch: {
    '$store.state.common.treeNode': function (data) {
      this.search()
    }
  },
  methods: {
    calcDate (date) {
      return new Date(date.setTime(date.getTime() - 3600 * 1000 * 24 * 7))
    },
    timeFormat(date) {
      return date.getFullYear() + '-' + (date.getMonth() + 1 + '').padStart(2, '0') + '-' + (date.getDate() + '').padStart(2, '0')
    },
    getDCUData() {
      if (this.upgradeActiveName !== 'second') return
      this.loading = true
      let obj = {
        deviceTypes: this.formDevice.deviceType === 1 ? '05' : ['10', '11'],
        // orgNo: this.treeNode.deviceNo,
        pageNum: this.upData.pageNum,
        pageSize: this.upData.pageSize,
        factoryId: this.formDevice.factoryId,
        fileTypes: this.formDevice.deviceType === 1 ? [1, 3] : [2],
        taskStatus: this.formDevice.taskStatus,
        bgTime: this.timeFormat(this.formDevice.bgTime) + ' 00:00:00',
        endTime: this.timeFormat(this.formDevice.endTime) + ' 23:59:59',
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
      queryDcuUpgradeProcessInfo(obj).then(res => {
        if (res.data.success) {
          this.upData.listitem = res.data.data.listitem
          this.upData.total = res.data.data.total
        } else {
          this.$message({
            message: this.$t("global.operaError"),
            type: "error"
          })
        }
        this.loading = false
      })
    },
    getMeterData() {
      this.loading = true
      queryMeterUpgradeProcessInfo({
        assetNo: this.treeNode.deviceNo,
        pageNum: this.upData.pageNum,
        pageSize: this.upData.pageSize
      }).then(res => {
        console.log(res, 'meter')
        if (res.data.success) {
          this.upData.listitem = res.data.data.listitem
          this.upData.total = res.data.data.total
        } else {
          this.$message({
            message: this.$t("global.operaError"),
            type: "error"
          })
        }
        this.loading = false
      })
    },
    delList() {
      if (this.selectUpData.length != 0) {
        this.$confirm(
          this.$t("areaManage.deleteTip"),
          this.$t("areaManage.reminder"),
          {
            confirmButtonText: this.$t("global.yes"),
            cancelButtonText: this.$t("global.cancel"),
            type: "warning"
          }
        )
          .then(() => {
            delUpgradeProcessInfo({
              upgradeids: this.selectUpData.map(ele => ele.id)
            }).then(res => {
              if (res.data.success) {
                this.$message({
                  message: this.$t("global.deleteSuccess"),
                  type: "success"
                })
                this.search()
              } else {
                this.$message({
                  message: this.$t("global.operaError"),
                  type: "error"
                })
              }
            });
          })
          .catch(() => {});
      } else {
        this.$notify({
          title: this.$t("global.warn"),
          message: this.$t("global.warncont"),
          type: "warning"
        });
      }
    },
    search() {
      if (!this.treeNode) {
        this.$notify({
            title: this.$t('global.warn'),
            message: this.$t('global.warntree'),
            type: 'warning'
        })
        return
      }
      // if (this.formDevice.deviceType == 1 || this.formDevice.deviceType == 2) {
        this.getDCUData()
      // } else if (this.formDevice.deviceType == 3) {
      //   this.getMeterData()
      // }
    },
    reUprade(val) {
      if (this.selectUpData.length != 0) {
        this.$confirm(
          this.$t('areaManage.confirmTip'),
          this.$t('areaManage.reminder'),
          {
              confirmButtonText: this.$t('global.yes'),
              cancelButtonText: this.$t('global.cancel'),
              type: 'warning'
          }
        ).then(() => {
          optUpgradeProcessInfo({
            upgradeids: this.selectUpData.map(ele => ele.id),
            opttype: val
          }).then(res => {
            if (res.data.success) {
              this.$message({
                message: this.$t("global.operatorSuccess"),
                type: "success"
              })
              this.search()
            } else {
              this.$message({
                message: this.$t("global.operaError"),
                type: "error"
              })
            }
          })
        }).catch(() => {})
      } else {
        this.$notify({
          title: this.$t("global.warn"),
          message: this.$t("global.warncont"),
          type: "warning"
        });
      }
    },
    upDataSelect(val) {
      this.selectUpData = val;
    },
    handleSizeChange(val) {
      this.upData.pageSize = val;
      // if (this.formDevice.deviceType == 1 || this.formDevice.deviceType == 2) {
        this.getDCUData();
      // } else if (this.formDevice.deviceType == 3) {
      //   this.getMeterData();
      // }
    },
    handleCurrentChange(val) {
      this.upData.pageNum = val;
      // if (this.formDevice.deviceType == 1 || this.formDevice.deviceType == 2) {
        this.getDCUData();
      // } else if (this.formDevice.deviceType == 3) {
      //   this.getMeterData();
      // }
    },
    // formatTimeT(val) {
    //   return format(val, "YYYY-MM-DD HH:mm:ss");
    // },
    getView() {
      getViewList({
        viewType: 'TMNLFactoryType'
      }).then(res => {
        this.tmnlFactoryList = res.data.data.list
      })
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
    },
    changeParttype(val, fileType) {
      if (fileType === 1) {
        if (val == 4) {
          return 'DCU Upgrade'
        } else if (val == 1) {
          return 'DCU Route Module Upgrade'
        } else if (val == 2) {
          return 'DCU 4G Module Upgrade'
        }
      } else if (fileType === 2) {
        if (val == 5) {
          return '3P WC Meter Upgrade'
        } else if (val == 6) {
          return '3P CT Meter Upgrade'
        } else if (val == 7) {
          return '3P CTVT Meter Upgrade'
        } else if (val == 2) {
          return '4G/NB Meter Module Upgrade'
        }
      } else if (fileType === 3) {
        if (val == 3) {
          return 'Hybrid Meter Broadcast Upgrade'
        } else if (val == 1) {
          return 'Hybrid Meter Module Broadcast Upgrade'
        }
      } else {
        return val
      }
    },
    changeCode(val) {
      switch (val) {
        case 1:
          return "Device archives error";
          break;
        case 2:
          return "Image File error";
          break;
        case 3:
          return "Server is off line";
          break;
        case 4:
          return "Server is busy";
          break;
        case 5:
          return "Server support the transfer of block size error";
          break;
        case 6:
          return "Transferred blocks status error";
          break;
        case 7:
          return "Image first not transferred block number error";
          break;
        case 8:
          return "Image transfer disabled";
          break;
        case 9:
          return "Image to activate info error";
          break;
        case 10:
          return "Image transfer initiate failed";
          break;
        case 11:
          return "Image block transfer failed";
          break;
        case 12:
          return "Image verification failed";
          break;
        case 13:
          return "Image verification Is not Completed ";
          break;
        case 14:
          return "Image activation failed ";
          break;
        case 15:
          return "Upgrade failed 1 time, retrying ...";
          break;
        case 16:
          return "Upgrade failed 2 time, retrying ...";
          break;
        case 17:
          return "Upgrade failed 3 times, task terminated";
          break;
        case 18:
          return "Image transfer status is failed";
          break;
        case 19:
          return "Activation is not completed";
          break;
        case 20:
          return "PLC meter task is null";
          break;
        case 21:
          return "PLC meter list is null";
          break;
        case 22:
          return "Set PLC meter task error";
          break;
        case 23:
          return "Set PLC meter list error";
          break;
        case 24:
          return "Start PLC meter task error";
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
.updataproce {
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
}
  .el-form-item {
    /deep/ .el-form-item__label {
      padding-right: 30px;
      text-align: right;
    }
  }
</style>
