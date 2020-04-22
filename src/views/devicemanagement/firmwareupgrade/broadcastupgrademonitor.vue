<template>
  <basic-container>
    <div class="routerbox remote">
      <el-tabs v-model="activeName" @tab-click="handleClick" style="width:100%;" type="border-card">
        <el-tab-pane :label="$t('upgrade.upgradetask')" name="1">
          <div class="cont" ref="cont">
            <el-form :inline="true" :model="formDevice" label-position="left">
              <el-form-item :label="$t('areaManage.tmnlAssetNo')" prop="assetNo">
                <el-input v-model="formDevice.assetNo" size="small" style="width: 150px"></el-input>
              </el-form-item>
              <el-form-item :label="$t('change.manufacturer')">
                <el-select v-model="formDevice.factoryId" size="small" style="width: 150px">
                  <el-option :label="$t('global.all')" :value="''"></el-option>
                  <el-option :label="ele.typeName" :value="ele.typeCode" v-for="(ele, i) in factoryList" :key="i"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('upgraderesult.curretstage')">
                <el-select v-model="formDevice.currStep" size="small" style="width: 150px">
                  <el-option :label="$t('global.all')" :value="''"></el-option>
                  <el-option :label="$t('upgrade.initialization')" :value="1"></el-option>
                  <el-option :label="$t('upgraderesult.broadcast')" :value="2"></el-option>
                  <el-option :label="$t('upgraderesult.outcalu')" :value="3"></el-option>
                  <el-option :label="$t('upgraderesult.broadsup')" :value="4"></el-option>
                  <el-option :label="$t('upgraderesult.unbroadsup')" :value="5"></el-option>
                  <el-option :label="$t('upgraderesult.activation')" :value="6"></el-option>
                  <el-option :label="$t('upgraderesult.complete')" :value="7"></el-option>
                  <el-option :label="$t('accountmanage.abnormal')" :value="8"></el-option>
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
              <div>{{$t('global.deviceinfo')}}</div>
            </div>
            <el-table
              :data="dcuData.listitem"
              border
              :header-cell-style="{background:'#F2F2F2',color:'rgb(51,51,51)'}"
              height="53vh"
              @selection-change="dcuDataSelect"
              v-loading="loading"
            >
              <el-table-column type="selection"></el-table-column>
              <el-table-column :label="$t('global.id')" width="80">
                <template slot-scope="scope">{{ dcuData.pageSize * (dcuData.pageNum - 1) + scope.$index + 1 }}</template>
              </el-table-column>
              <!-- <el-table-column prop="disc" :label="$t('upgrade.devtype')" width="160"></el-table-column> -->
              <!-- <el-table-column prop="tmnlAddr" :label="$t('areaManage.name')" width="160"></el-table-column> -->
              <el-table-column prop="tmnlAddr" :label="$t('areaManage.tmnlAssetNo')" ></el-table-column>
              <!-- <el-table-column prop="assetNo" :label="$t('areaManage.meterAssetNo')" ></el-table-column> -->
              <el-table-column prop="eventTime" :label="$t('meterevent.eventtime')" ></el-table-column>
              <el-table-column prop="fileVersion" :label="$t('upgrade.version')"></el-table-column>
              <el-table-column prop="retrySeq" :label="$t('upgraderesult.retrySeq')"></el-table-column>
              <el-table-column prop="currStep" :label="$t('upgraderesult.curretstage')">
                <template slot-scope="scope">{{ changeStep(scope.row.currStep) }}</template>
              </el-table-column>
              <el-table-column prop="successNum" :label="$t('upgraderesult.metersucess')"></el-table-column>
              <el-table-column prop="totalNum" :label="$t('upgraderesult.metertotal')"></el-table-column>
            </el-table>
            <pagination
              :total="dcuData.total"
              :page.sync="dcuData.pageNum"
              :limit.sync="dcuData.pageSize"
              @pagination="search"
              style="margin-top:-1px"
            />
          </div>
        </el-tab-pane>
        <el-tab-pane :label="$t('upgrade.meterupgrade')" name="2" :calc="calcDate">
          <meterupgrade></meterupgrade>
        </el-tab-pane>
        <el-tab-pane :label="$t('upgrade.dcumodule')" name="3">
          <dcuactive></dcuactive>
        </el-tab-pane>
        <el-tab-pane :label="$t('upgrade.meterEventSearch')" name="4">
          <meteractive></meteractive>
        </el-tab-pane>
      </el-tabs>
    </div>
  </basic-container>
</template>

<script>
import { mapGetters } from 'vuex'
import meterupgrade from './broadcast/meterupgrade'
import dcuactive from './broadcast/dcuactive'
import meteractive from './broadcast/meteractive'
import { queryBroadCastTask } from '@/api/firmwareUpgrade'
import { getViewList } from '@/api/autoRegister'
import Pagination from '@/components/Pagination'
export default {
  components: {
    meterupgrade,
    dcuactive,
    meteractive,
    Pagination
  },
  data () {
    return {
      dcuData: {
        pageSize: 20,
        pageNum: 1,
        listitem: [],
        total: 0
      },
      activeName: '1',
      formDevice: {
        starttime: this.calcDate(new Date()),
        endtime: new Date(),
        assetNo: '',
        factoryId: '',
        currStep: ''
      },
      selectDCUData: '',
      factoryList: [],
      loading: false,
      tableHeight: window.innerHeight - 480
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
          opttype: 1,
          bgTime: this.timeFormat(this.formDevice.starttime) + ' 00:00:00',
          endTime: this.timeFormat(this.formDevice.endtime) + ' 23:59:59',
          pageNum: this.dcuData.pageNum,
          pageSize: this.dcuData.pageSize,
          factoryId: this.formDevice.factoryId,
          assetNo: this.formDevice.assetNo,
          currStep: this.formDevice.currStep
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
          if (res.data.success) {
            this.dcuData.listitem = res.data.data.listitem
            this.dcuData.total = res.data.data.total
          }
          this.loading = false
        }).catch(() => {
          this.loading = false
        })
    },
    timeFormat (date) {
      return date.getFullYear() + '-' + (date.getMonth() + 1 + '').padStart(2, '0') + '-' + (date.getDate() + '').padStart(2, '0')
    },
    handleClick (tab) {
      if (this.treeNode) {
          this.activeName = tab.name
      } else {
          this.$notify({
              title: this.$t('global.warn'),
              message: this.$t('global.warntree'),
              type: 'warning'
          })
      }
      this.$store.commit('SET_BROADCAST_ACTIVE', tab.name)
    },
    search () {
      if (this.broadcastActiveName !== '1') return
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
      this.getData()
    },
    dcuDataSelect (val) {
      this.selectDCUData = val;
    },
    dcuCurrentChange (val) {
      this.dcuData.pageNum = val;
      this.getData();
    },
    dcuSizeChange (val) {
      this.dcuData.pageSize = val;
      this.getData();
    },
    getView() {
      getViewList({
        viewType: 'TMNLFactoryType'
      }).then(res => {
        this.factoryList = res.data.data.list
      })
    },
    changeStep(val){
      if(val==1){
        return this.$t('upgrade.initialization');
      }else if(val==2){
        return this.$t('upgraderesult.broadcast');
      }else if(val==3){
        return this.$t('upgraderesult.outcalu');
      }else if(val==4){
        return this.$t('upgraderesult.broadsup');
      }else if(val==5){
        return this.$t('upgraderesult.unbroadsup');
      }else if(val==6){
        return this.$t('upgraderesult.activation');
      }else if(val==7){
        return this.$t('upgraderesult.complete');
      }else if(val==8){
        return this.$t('accountmanage.abnormal');
      }
    }
  }
};
</script>

<style  lang="scss" scoped>
.remote {
  display: flex;
  background: #fff;
  width: 100%;
  box-sizing: border-box;
  .cont {
    width: 100%;
    box-sizing: border-box;
  }
  .pre {
    font-weight: bold;
  }
  .other {
    margin-top: 20px;
    span {
      display: inline-block;
      width: 2rem;
    }
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
  .topadd {
    display: flex;
    .address {
      height: 32px;
      line-height: 32px;
      padding: 0 10px;
      border: 1px solid #1eb99e;
      background: #e0fffb;
      color: #1eb99e;
      border-radius: 5px;
    }
    .imgs {
      vertical-align: middle;
      margin-right: 5px;
    }
  }
  .upload {
    display: flex;
    align-items: center;
    margin-top: 10px;
    span {
      display: inline-block;
      padding-left: 20px;
      margin-right: 10px;
      line-height: 20px;
      height: 20px;
      border-left: 3px solid rgb(0, 153, 255);
    }
    .upload-demo {
      margin: 0 10px;
    }
  }
  .formbox {
    border-top: 1px solid #eee;
    border-bottom: 1px solid #eee;
    padding: 10px 0;
    margin-bottom: 10px;
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