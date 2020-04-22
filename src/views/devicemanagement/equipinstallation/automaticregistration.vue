<template>
  <basic-container>
    <el-tabs v-model="active" type="card">
      <el-tab-pane :label="$t('auto.registration')" name="1">
        <!-- 查询终端和电表S -->
        <div class="filter-box">
          <div class="first-floor">
            <span style="margin-left:0">{{$t('change.manufacturer')}}</span>
            <el-select v-model="terminalForm.factoryCode" size="small" @change="search">
              <el-option :label="$t('global.all')" :value="''"></el-option>
              <el-option :label="ele.typeName" :value="ele.typeCode" v-for="(ele, i) in tmnlFactoryList" :key="i"></el-option>
            </el-select>
            <span>{{$t('auto.registeredStatus')}}</span>
            <el-select v-model="terminalForm.procState" placeholder="" size="small" @change="search">
              <el-option :label="$t('auto.registered')" :value="1"></el-option>
              <el-option :label="$t('auto.unregistered')" :value="0"></el-option>
              <el-option :label="$t('auto.noKey')" :value="2"></el-option>
            </el-select>
            <span>{{$t('auto.confirmStatus')}}</span>
            <el-select v-model="terminalForm.isim" placeholder="" size="small" @change="search">
              <el-option :label="$t('auto.handled')" value="1"></el-option>
              <el-option :label="$t('auto.pending')" value="0"></el-option>
            </el-select>
          </div>
          <div class="second-floor">
            <span>{{$t('auto.deviceType')}}</span>
            <el-select v-model="terminalForm.deviceType" placeholder="" size="small" @change="search">
              <el-option :label="$t('auto.dcu')" :value="1"></el-option>
              <el-option :label="$t('auto.nb')" :value="2"></el-option>
              <el-option :label="$t('auto.gm')" :value="3"></el-option>
              <el-option :label="$t('auto.nbShort')" :value="4"></el-option>
              <el-option :label="$t('auto.gmShort')" :value="5"></el-option>
            </el-select>
            <span>{{$t('auto.deviceName')}}</span>
            <el-input :maxlength="30" v-model="terminalForm.tmnlAssetNo" style="width:180px;"></el-input>
            {{$t('auto.from')}}
            <el-date-picker v-model="time1" type="date" size="small" style="width:160px;" :clearable="false" :editable="false"></el-date-picker>
            {{$t('auto.to')}}
            <el-date-picker v-model="time2" type="date" size="small" style="width:160px;" :clearable="false" :editable="false"></el-date-picker>
            <el-button type="primary" size="small" @click="search">{{$t('auto.search')}}</el-button>
          </div>
        </div>
        <!-- 查询终端和电表E -->
        <div class="content">
          <div class="terminal">
            <div class="head">
              {{ tmnlStr }}
              <div class="operate">
                <span @click="register">
                  <img src="img/Register.png" alt="">
                  {{$t('auto.handle')}}
                </span>
                <span @click="refresh1">
                  <img src="img/Refresh.png" alt="">
                  {{$t('auto.refresh')}}
                </span>
              </div>
            </div>
            <!-- 终端表格S -->
            <el-table
              :data="terminalTableData"
              border
              style="width: 100%"
              :height="terminalForm.deviceType === 1 ? tableHeight1 : tableHeight2"
              @selection-change="terminalSelectionChange"
              v-loading="load1"
              :header-cell-style="{background:'#F2F2F2',color:'rgb(51,51,51)'}">
              <el-table-column
                type="selection"
                width="50">
              </el-table-column>
              <el-table-column :label="$t('auto.index')" width="100">
                <template slot-scope="scope">{{ terminalForm.size * (terminalForm.current - 1) + scope.$index + 1 }}</template>
              </el-table-column>
              <el-table-column
                prop="tmnlAssetNo"
                :label="$t('auto.deviceName')">
              </el-table-column>
              <el-table-column
                prop="deviceType"
                :label="$t('auto.deviceType')"
                :formatter="deviceFormat">
              </el-table-column>
              <el-table-column
                prop="ipAddr"
                :label="$t('auto.ip')">
              </el-table-column>
              <!-- <el-table-column
                :label="$t('auto.onlineStatus')">
                <template slot-scope="scope">
                  <div class="circle" :style="{'background-color': scope.row.onlineStatus ? colorName : '#a5a5a5'}" v-if="scope.row.onlineStatus">
                  </div>
                </template>
              </el-table-column> -->
              <el-table-column
                prop="recvTime"
                :label="$t('auto.registrationTime')">
              </el-table-column>
              <el-table-column
                prop="procState"
                :label="$t('auto.registeredStatus')"
                :formatter="formatter2">
              </el-table-column>
              <el-table-column
                prop="procTime"
                :label="$t('auto.confirmTime')">
              </el-table-column>
              <el-table-column
                :label="$t('auto.confirmStatus')"
                :formatter="formatter1">
              </el-table-column>
            </el-table>
            <!-- 终端表格E -->
            <pagination
              :total="terminalTotal"
              :page.sync="terminalForm.current"
              :limit.sync="terminalForm.size"
              @pagination="search"
              style="margin-top:-1px"
            />
          </div>
          <div class="meter"  v-if="terminalForm.deviceType === 1">
            <div class="head">
              {{$t('auto.mri')}}
              <div class="operate">
                <div class="checkbox">
                  <el-checkbox v-model="issued" @change="issuedFilter" style="margin-right:20px">{{$t('auto.issued')}}</el-checkbox>
                  <el-checkbox v-model="notIssued" @change="issuedFilter" style="margin-right:20px">{{$t('auto.notIssued')}}</el-checkbox>
                  <span @click="issueWhitelist">
                    <img src="img/Issuewhitelist.png" alt="">
                    {{$t('auto.issueWhitelist')}}
                  </span>
                </div>
                <span @click="refresh2">
                  <img src="img/Refresh.png" alt="">
                  {{$t('auto.refresh')}}
                </span>
                <span @click="exportExcel">
                  <img src="img/export.png" alt />
                  {{$t('global.export')}}
                </span>
                <!-- <span @click="transfer">
                  <img src="img/Transfer.png" alt="">
                  {{$t('auto.transfer')}}
                </span> -->
              </div>
            </div>
            <!-- 电表表格S -->
            <el-table
              :data="meterTableData"
              border
              style="width: 100%"
              :height="tableHeight1"
              @selection-change="meterSelectionChange"
              v-loading="load2"
              :header-cell-style="{background:'#F2F2F2',color:'rgb(51,51,51)'}">
              <el-table-column
                type="selection"
                width="50">
              </el-table-column>
              <el-table-column :label="$t('auto.index')" width="100">
                <template slot-scope="scope">{{ meterForm.size * (meterForm.current - 1) + scope.$index + 1 }}</template>
              </el-table-column>
              <el-table-column
                prop="metLogicDevName"
                :label="$t('auto.deviceName')">
              </el-table-column>
              <el-table-column
                prop="tmnlAssetNo"
                :label="$t('auto.dcuName')">
              </el-table-column>
              <el-table-column
                prop="metType"
                :label="$t('auto.meterType')"
                :formatter="meterFormat">
              </el-table-column>
              <el-table-column
                prop="metCommAddr"
                :label="$t('meterevent.meterno')">
              </el-table-column>
              <el-table-column
                prop="recvTime"
                :label="$t('auto.registeredTime')">
              </el-table-column>
              <!-- <el-table-column
                prop="plcStstus"
                :label="$t('auto.registeredStatus')"
                :formatter="formatter4">
              </el-table-column> -->
              <el-table-column
                prop="procTime"
                :label="$t('auto.validatedTime')">
              </el-table-column>
              <el-table-column
                :label="$t('auto.validatedStatus')"
                :formatter="formatter3">
              </el-table-column>
            </el-table>
            <!-- 电表表格E -->
            <pagination
              :total="meterTotal"
              :page.sync="meterForm.current"
              :limit.sync="meterForm.size"
              @pagination="searchMeter"
              style="margin-top:-1px"
            />
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane :label="$t('auto.whitelist')" name="2">
        <whitelist></whitelist>
      </el-tab-pane>
      <el-tab-pane :label="$t('auto.meterChangeList')" name="3">
        <history></history>
      </el-tab-pane>
    </el-tabs>

    <el-dialog
      :title="$t('auto.chooseLocation')"
      :visible.sync="moveVisible"
      width="30%"
      :before-close="handleClose"
      @close="dialogClose"
      @open="dialogOpen"
      top="1vh"
    >
      <!-- <el-tabs v-model="activeTree" @tab-click="handleClick">
        <el-tab-pane :label="$t('tree.org')" name="org"> -->
          <!-- <org :show-tmnl="true" @node-click="click" :key="refreshKey" /> -->
            <org
            :show-refresh-text="false"
            show-search
            @node-click="nodeClick"
            :key="refreshKey" />
        <!-- </el-tab-pane>
        <el-tab-pane :label="$t('tree.search')" name="search"> -->
          <!-- <search @row-click="click"/> -->

          <!-- <el-form :model="form" label-width="auto">
            <el-form-item :label="$t('auto.areaType') + ':'">
              <el-select v-model="form.type" placeholder="" style="width:200px">
                <el-option label="类型一" value="1"></el-option>
                <el-option label="类型二" value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('auto.areaName') + ':'">
              <el-input :maxlength="30" v-model="form.name" style="width:200px"></el-input>
            </el-form-item>
            <el-button type="primary">{{$t('auto.search')}}</el-button>
          </el-form>
          <el-table :data="searchData" style="width: 100%" @selection-change="searchSelectionChange" :header-cell-style="{background:'#F2F2F2',color:'rgb(51,51,51)'}">
            <el-table-column
              type="selection">
            </el-table-column>
            <el-table-column
              :label="$t('auto.areaType')"
              prop="type">
            </el-table-column>
            <el-table-column
              :label="$t('auto.areaName')"
              prop="name">
            </el-table-column>
          </el-table>
          <div class="searchPage">
            <el-pagination
              background
              @size-change="searchSizeChange"
              @current-change="searchCurrentChange"
              :page-sizes="[20, 40, 60, 200]"
              layout="total, sizes, prev, pager, next, jumper"
              :total="3">
            </el-pagination>
          </div> -->
        <!-- </el-tab-pane>
      </el-tabs> -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose" size="small">{{$t('global.cancel')}}</el-button>
        <el-button type="primary" @click="confirm" size="small">{{$t('auto.confirm')}}</el-button>
      </span>
    </el-dialog>
    <export-btn :dialogVisible="dialogVisible" :exportData="exportData"  @changeDialog="changeDialog" />
  </basic-container>
</template>
<script>
import {mapGetters} from 'vuex'
import Org from '@/page/index/components/org'
import Search from '@/page/index/components/search'
import Pagination from '@/components/Pagination'
import {getEtmnl, etmnlRegister, getMeter, meterRegister, addWhitelist, getViewList} from '@/api/autoRegister'
import whitelist from './registration/whitelist'
import history from './registration/history'
import exportBtn from "@/components/exportjs"
export default {
  components: {
    Org,
    Search,
    Pagination,
    whitelist,
    history,
    exportBtn
  },
  data () {
    return {
      active: '1',
      time1: this.calcDate(new Date()),
      time2: new Date(),
      terminalForm: {
        deviceType: 1,
        isim: '0',
        procState: 0,
        tmnlAssetNo: '',
        current: 1,
        size: 10,
        factoryCode: ''
      },
      meterForm: {
        procStat: null,
        current: 1,
        size: 10
      },
      terminalTableData: [],
      terminalTotal: 0,
      meterTotal: 0,
      meterTableData: [],
      selectList1: [],
      selectList2: [],
      moveVisible: false,
      activeTree: 'org',
      form: {
        type: '',
        name: ''
      },
      searchData: [
        {
          type: '类型一',
          name: '名称一',
        },
        {
          type: '类型二',
          name: '名称二',
        },
        {
          type: '类型三',
          name: '名称三',
        },
      ],
      verified: false,
      unverified: false,
      issued: true,
      notIssued: true,
      registerType: 1,
      refreshKey: 0,
      load1: false,
      load2: false,
      tmnlTypeList:[],
      meterTypeList:[],
      tmnlFactoryList:[],
      meterFactoryList:[],
      // tableHeight1: window.innerHeight - 710,
      // tableHeight2: window.innerHeight - 390,
      tableHeight1: '25vh',
      tableHeight2: '60vh',
      dialogVisible: false,
      exportData:{}
    };
  },
  methods:{
    calcDate (date) {
      return new Date(date.setTime(date.getTime() - 3600 * 1000 * 24 * 7))
    },
    formatTime (date) {
      return date.getFullYear() + '-' + (date.getMonth() + 1 + '').padStart(2, '0') + '-' + (date.getDate() + '').padStart(2, '0')
    },
    // 查询终端
    search () {
      if (this.time1.getTime() > this.time2.getTime()) {
        this.$message({
            type: "error",
            message: this.$t('auto.timeBug')
        })
        return
      }
      let obj = {
        recvTimeFrom: this.formatTime(this.time1) + ' 00:00:00',
        recvTimeTo: this.formatTime(this.time2) + ' 23:59:59',
        ...this.terminalForm
      }
      this.load1 = true
      getEtmnl(obj).then(res => {
        if (res.data.success) {
          this.terminalTableData = res.data.data.records
          this.terminalTotal = res.data.data.total
        } else {
          this.$message({
            type: "error",
            message: this.$t('global.searchFail')
          })
        }
        this.load1 = false
      }).catch(() => {
        this.load1 = false
      })
    },
    // 终端自动注册按钮
    register () {
      if (this.selectList1.length !== 0) {
        // if (this.selectList1.length > 1) {
        //   this.$notify({
        //     title: this.$t('global.warn'),
        //     message: this.$t('role.onlyOne'),
        //     type: 'warning'
        //   })
        //   return
        // }
        if (this.selectList1[0].procState == 2) {
          this.$message({
            message: this.$t('auto.noKey'),
            type: 'error'
          })
          return
        }
        this.registerType = 1
        this.moveVisible = true
      } else {
          this.$notify({
            title: this.$t('auto.warn'),
            message: this.$t('auto.warnTerminal'),
            type: 'warning'
          })
      }
    },
    // 电表自动注册按钮
    transfer () {
      if (this.selectList2.length !== 0) {
        this.registerType = 2
        this.moveVisible = true
      } else {
        this.$notify({
            title: this.$t('auto.warn'),
            message: this.$t('auto.warnMeter'),
            type: 'warning'
        })
      }
    },
    // 刷新终端列表
    refresh1 () {
      this.search()
    },
    // 刷新电表列表
    refresh2 () {
      this.searchMeter()
    },
    // 选择终端
    terminalSelectionChange (val) {
      this.selectList1 = val
      if (this.selectList1.length > 0) {
        this.searchMeter()
      } else {
        this.meterTableData = []
      }
    },
    // 选择电表
    meterSelectionChange (val) {
      this.selectList2 = val
    },
    // 查询电表
    searchMeter () {
      let obj = {
          tmnlAssetNos: this.selectList1.map(item => item.tmnlAssetNo),
          ...this.meterForm
      }
      this.load2 = true
      getMeter(obj).then(res => {
        if (res.data.success) {
          this.meterTableData = res.data.data.records
          this.meterTotal = res.data.data.total
        } else {
          this.$message({
            type: "error",
            message: this.$t('global.searchFail')
          })
        }
        this.load2 = false
      }).catch(() => {
        this.load2 = false
      })
    },
    handleClose () {
      this.moveVisible = false;
    },
    // 点击树节点
    nodeClick (val) {
      console.log(val, 'node')
      this.$store.commit("SET_TREE_NODE", val)
    },
    // handleClick(tab) {
    //   this.activeTree = tab.name;
    // },
    // 注册终端
    registerTerminal () {
        if (this.level !== 5) {
          this.$notify({
              title: this.$t('auto.warn'),
              message: this.$t('auto.selectZone'),
              type: 'warning'
          })
          return
        }
        let obj = {
          tmnlAssetNos: this.selectList1.map(item => item.tmnlAssetNo),
          orgNo: this.treeNode.deviceNo
        }
        etmnlRegister(obj).then(res => {
          if (res.data.success) {
            this.$message({
              type: "success",
              message: this.$t('auto.registerSuccess')
            })
            this.handleClose()
            this.search()
          } else {
            this.$message({
              type: "error",
              message: this.$t('auto.operateFail')
            })
          }
        })
    },
    // 注册电表
    registerMeter () {
        if (this.level !== 6) {
          this.$notify({
              title: this.$t('auto.warn'),
              message: this.$t('auto.selectTerminal'),
              type: 'warning'
          })
          return
        }
        let obj = {
          metLogicDevNames: this.selectList2.map(item => item.metLogicDevName),
          tmnlAssetNo: this.treeNode.deviceNo
        }
        meterRegister(obj).then(res => {
          if (res.data.success) {
            this.$message({
              type: "success",
              message: this.$t('auto.transferSuccess')
            })
            this.moveVisible = false
            this.searchMeter()
          } else {
            this.$message({
              type: "error",
              message: this.$t('auto.operateFail')
            })
          }
        })
    },
    // 下发白名单
    issueWhitelist () {
      if (this.selectList2.length < 1) {
        this.$notify({
          title: this.$t('auto.warn'),
          message: this.$t('auto.warnMeter'),
          type: 'warning'
        })
        return
      }
      this.$confirm(this.$t("areaManage.confirmTip"), this.$t("areaManage.reminder"), {
          confirmButtonText: this.$t('global.confirm'),
          cancelButtonText: this.$t('global.cancel'),
          type: "warning"
      }).then(() => {
          let metLogicDevNames = this.selectList2.map(item => item.metLogicDevName)
          addWhitelist({metLogicDevNames}).then(res => {
            if (res.data.success) {
              this.$message({
                type: "success",
                message: this.$t('auto.whitelistSuccess')
              })
              this.searchMeter()
            } else {
              this.$message({
                type: "error",
                message: this.$t('auto.operateFail')
              })
              this.searchMeter()
            }
          })
        });
    },
    // 对话框确认
    confirm () {
      if (this.registerType === 1) {
        this.registerTerminal()
      } else {
        this.registerMeter()
      }
    },
    changeDialog(val){
      this.dialogVisible = val
    },
    exportExcel () {
      let obj = {
        tmnlAssetNos: this.selectList1.map(item => item.tmnlAssetNo),
        ...this.meterForm
      }
      this.dialogVisible = true
      let columns = {
        metLogicDevName:this.$t('auto.deviceName'),
        tmnlAssetNo:this.$t('auto.dcuName'),
        metType:this.$t('auto.meterType'),
        metCommAddr:this.$t('meterevent.meterno'),
        recvTime:this.$t('auto.registeredTime'),
        procTime:this.$t('auto.validatedTime'),
        procStat:this.$t('auto.validatedStatus'),
      }
      this.exportData = {
        url: '/api/ami-devices/emetregister/upload',
        params: obj,
        columns: columns,
        fileName: this.$t('auto.mri'),
        sheetName: this.$t('auto.mri'),
      }
    },
// 1、注册信息处理状态说明
// E_TMNL_REGISTER：
// PROC_STATE 0-未注册；1-已注册，已建档；2-无秘钥，未建档。
// E_MET_REGISTER：
// Plc_STAT 0-未处理；1-已处理，白名单下发成功；2-白名单下发失败；3-无秘钥

    // 处理状态
    formatter1 (row) {
      if (row.isim == 1) {
        return this.$t('auto.handled')
      } else if (row.isim == 0) {
        return this.$t('auto.pending')
      } else {
        return row.isim
      }
    },
    // 注册状态
    formatter2 (row) {
      if (row.procState == 1) {
        return this.$t('auto.registered')
      } else if (row.procState == 0) {
        return this.$t('auto.unregistered')
      } else if (row.procState == 2) {
        return this.$t('auto.noKey')
      } else {
        return row.procState
      }
    },
    // 下发白名单
    formatter3 (row) {
      if (row.procStat == 1) {
        return this.$t('auto.validated')
      } else if (row.procStat == 0) {
        return this.$t('auto.unvalidated')
      } else if (row.procStat == 2) {
        return this.$t('auto.validFail')
      } else if (row.procStat == 3) {
        return this.$t('auto.noKey')
      } else {
        return row.procStat
      }
      // return row.procStat === 1 ? this.$t('auto.validated') : this.$t('auto.unvalidated')
    },
    // 电表类型
    meterFormat (row) {
      let obj = this.meterTypeList.find(ele => Number(ele.typeCode) === Number(row.metType))
      if (obj) {
        return obj.typeName
      } else {
        return row.metType
      }
    },
    // 终端类型
    deviceFormat (row) {
      // let obj = this.tmnlTypeList.find(ele => Number(ele.typeCode) === Number(row.deviceType))
      // if (obj) {
      //   return obj.typeName
      // } else {
      //   return row.deviceType
      // }
      if (row.deviceType == 1) {
        return this.$t('auto.dcu')
      } else if (row.deviceType == 2) {
        return this.$t('auto.nb')
      } else if (row.deviceType == 3) {
        return this.$t('auto.gm')
      } else if (row.deviceType == 4) {
        return this.$t('auto.nbShort')
      } else if (row.deviceType == 5) {
        return this.$t('auto.gmShort')
      }
    },
    // 白名单复选框
    issuedFilter () {
      if (this.issued) {
        if (this.notIssued) {
          this.meterForm.procStat = null
        } else {
          this.meterForm.procStat = 1
        }
      } else {
        if (this.notIssued) {
          this.meterForm.procStat = 0
        } else {
          this.meterTableData = []
          return
        }
      }
      this.searchMeter()
    },
    dialogClose () {
      ++this.refreshKey
    },
    dialogOpen () {
      this.$store.commit("SET_LEVEL", 0)
    },
    getView() {
      getViewList({
        viewType: 'meterType'
      }).then(res => {
        this.meterTypeList = res.data.data.list
      })
      getViewList({
        viewType: 'tmnlType'
      }).then(res => {
        this.tmnlTypeList = res.data.data.list
      })
      getViewList({
        viewType: 'TMNLFactoryType'
      }).then(res => {
        this.tmnlFactoryList = res.data.data.list
      })
      getViewList({
        viewType: 'meterFactoryType'
      }).then(res => {
        this.meterFactoryList = res.data.data.list
      })
    },
  },
  computed: {
    tmnlStr () {
      switch (this.terminalForm.deviceType) {
        case 1:
          return this.$t('auto.dcuRegisterInfo')
          break;
        case 2:
          return this.$t('auto.gmRegisterInfo')
          break;
        case 3:
          return this.$t('auto.nbRegisterInfo')
          break;
        default:
          break;
      }
    },
    ...mapGetters(['colorName', 'themeName', 'level', 'treeNode'])
  },
  watch: {
    treeNode (treeNode) {
      // console.log('treeNode', treeNode)
    },
  },
  mounted() {
    this.getView()
    this.search()
  }
}
</script>
<style lang='scss' scoped>
.filter-box {
  // display: flex;
  // align-items: center;
  padding-bottom: 10px;
  .first-floor {
    margin-bottom: 10px;
  }
  span {
    display: inline-block;
    min-width: 100px;
    padding: 0 5px 0 20px;
    box-sizing: border-box;
  }
  .el-input {
    width: 150px;
    margin-right: 10px;
    /deep/ .el-input__inner {
      height: 32px;
    }
  }
}
  .content {
    .terminal, .meter {
      border: 1px solid #ddd;
      box-sizing: border-box;
      .head {
        height: 40px;
        padding-left: 20px;
        // border: 1px solid #ddd;
        border-bottom: 0;
        line-height: 40px;
        .operate {
          float: right;
          display: flex;
          & > span {
            display: block;
            height: 20px;
            padding: 0 20px;
            margin-top: 10px;
            border-left: 1px solid #ddd;
            line-height: 20px;
            cursor: pointer;
            img {
              vertical-align: middle;
            }
          }
          .checkbox {
            height: 20px;
            border-left: 1px solid #ddd;
            padding: 0 20px;
            margin-top: 10px;
            line-height: 20px;
            span {
              cursor: pointer;
            }
            img {
              vertical-align: middle;
            }
          }
        }
      }
      .page {
        height: 50px;
        border-top: 1px solid #ddd;
        background-color: #fafafa;
        .el-pagination {
          margin: 10px 0 0 15px;
        }
      }
    }
  }
  .circle {
    width: 20px;
    height: 20px;
    padding-top: 2px;
    background-color: #87D182;
    border-radius: 50%;
    box-sizing: border-box;
    &::after {
      content: '';
      display: block;
      width: 12px;
      height: 12px;
      margin: 0 auto;
      border: 2px solid #fff;
      border-radius: 50%;
    }
  }
.el-tabs {
  // padding-bottom: 30px;
  /deep/ .el-tabs__header {
    padding: 5px 0 0 10px;
    background-color: #c6dedd;
    .el-tabs__nav {
      background-color: #c6dedd;
      border: 0;
      .el-tabs__item {
        border: 0;
        color: #018b7e;
      }
      .el-tabs__item.is-active {
        background-color: #fff;
      }
    }
  }
}
</style>