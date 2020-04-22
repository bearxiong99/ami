<template>
  <basic-container>
      <el-tabs v-model="active" type="card">
        <el-tab-pane :label="$t('change.changeDCU')" name="Change DCU" >
          {{$t('change.controlMode')}}
          <el-select v-model="changeDCUParams.mode" style="width:150px;margin:0 10px;">
            <el-option label="All" :value="1"></el-option>
          </el-select>
          {{$t('change.deviceName')}}
          <el-input :maxlength="30" v-model="changeDCUParams.deviceName" style="width:150px;margin:0 10px;"></el-input>
          <el-button type="primary">{{$t('global.search')}}</el-button>

          <div class="content">
            <div class="head">
              {{$t('upgrade.dcuInfo')}}
              <div class="operate">
                <span @click="changeDCU">
                  <img src="" alt="">
                  {{$t('change.changeDCU')}}
                </span>
              </div>
            </div>
            <el-table
              :data="tableData"
              border
              style="width: 100%"
              @selection-change="selectionChange"
              height="55vh"
              :header-cell-style="{background:'#F2F2F2',color:'rgb(51,51,51)'}">
              <el-table-column type="selection" width="55"></el-table-column>
              <el-table-column :label="$t('change.no')" width="100">
                <template slot-scope="scope">{{ changeDCUParams.size * (changeDCUParams.current - 1) + scope.$index + 1 }}</template>
              </el-table-column>
              <el-table-column :label="$t('change.deviceName')">
              </el-table-column>
              <el-table-column :label="$t('change.onlineStatus')">
                <template slot-scope="scope">
                  <div class="circle" :style="{'background-color': scope.row.onlineStatus ? colorName : '#a5a5a5'}"></div>
                </template>
              </el-table-column>
              <el-table-column :label="$t('change.terminalType')">
              </el-table-column>
              <el-table-column :label="$t('change.manufacturer')">
              </el-table-column>
            </el-table>
            <div class="page">
              <el-pagination
                background
                @size-change="sizeChange"
                @current-change="currentChange"
                :page-sizes="[20, 40, 60, 200]"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
              </el-pagination>
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane :label="$t('change.history')" name="History">
          <!-- {{$t('change.worksheetId')}}
          <el-input :maxlength="30" v-model="historyParams.worksheetId" style="width:150px;margin-right:20px;"></el-input> -->
          {{$t('upgrade.oldTmnl')}}
          <el-input :maxlength="30" v-model="historyParams.newName" style="width:150px;margin-right:20px;"></el-input>
          {{$t('upgrade.newTmnl')}}
          <el-input :maxlength="30" v-model="historyParams.oldName" style="width:150px;margin-right:20px;"></el-input>
          {{$t('auto.from')}}
          <el-date-picker v-model="historyParams.time1" type="date" size="small" style="width:160px;" :clearable="false" :editable="false"></el-date-picker>
          {{$t('auto.to')}}
          <el-date-picker v-model="historyParams.time2" type="date" size="small" style="width:160px;" :clearable="false" :editable="false"></el-date-picker>
          <el-button type="primary" size="small" style="margin-left:20px" @click="searchHistory">{{$t('auto.search')}}</el-button>
          <div class="content">
            <div class="head">
              {{$t('change.changeDCUHistory')}}
            </div>
            <el-table
              :data="historyTableData"
              border
              style="width: 100%"
              height="55vh"
              :header-cell-style="{background:'#F2F2F2',color:'rgb(51,51,51)'}">
              <el-table-column type="selection" width="55"></el-table-column>
              <el-table-column :label="$t('change.no')" width="100">
                <template slot-scope="scope">{{ historyParams.size * (historyParams.current - 1) + scope.$index + 1 }}</template>
              </el-table-column>
              <!-- <el-table-column
                prop="worksheetId"
                :label="$t('change.worksheetId')">
              </el-table-column> -->
              <el-table-column
                prop="assetNoOld"
                :label="$t('change.oldDeivceName')">
              </el-table-column>
              <el-table-column
                prop="assetNoNew"
                :label="$t('change.newDeivceName')">
              </el-table-column>
              <el-table-column
                prop="updateTime"
                :label="$t('change.changeTime')">
              </el-table-column>
              <el-table-column
                prop="createDate"
                :label="$t('change.createTime')">
              </el-table-column>
              <el-table-column
                prop="startTime"
                :label="$t('change.oldStopDate')">
              </el-table-column>
              <el-table-column
                prop="endTime"
                :label="$t('change.newStartDate')">
              </el-table-column>
              <el-table-column
                prop="recType"
                :label="$t('change.recType')">
                <template slot-scope="scope">
                  {{recordFormat(scope.row.recType)}}
                </template>
              </el-table-column>
              <el-table-column
                prop="isValid"
                :label="$t('collection.isValid')">
                <template slot-scope="scope">
                  {{validFormat(scope.row.isValid)}}
                </template>
              </el-table-column>
            </el-table>
            <div class="page">
              <el-pagination
                background
                @size-change="sizeChange"
                @current-change="currentChange"
                :page-sizes="[20, 40, 60, 200]"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
              </el-pagination>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>

      <el-dialog
      :title="$t('change.changeDCU')"
      :visible.sync="dialogVisible"
      width="35%">
        <el-tabs v-model="subActive" type="card">
          <el-tab-pane :label="$t('change.changeDCU')" name="Change DCU" >
            <div class="original-info">
              <h4>{{$t('change.originalDCUInfo')}}</h4>
              <ul>
                <li>
                  {{$t('change.deviceName') + ':' + selectDCU.deviceName}}
                </li>
                <li>
                  {{$t('change.terminalType') + ':' + selectDCU.terminalType}}
                </li>
                <li>
                  {{$t('change.manufacturer') + ':' + selectDCU.manufacturer}}
                </li>
              </ul>
            </div>
            <div class="new-info">
              <h4>{{$t('change.newDCUInfo')}}</h4>
              <el-form :model="newInfoForm" label-position="left" label-width="auto" ref="newInfoRef">
                <el-form-item :label="$t('change.deviceName')" prop="deviceName">
                  <el-input :maxlength="30" v-model="newInfoForm.deviceName" style="width:200px"></el-input>
                </el-form-item>
                <el-form-item :label="$t('change.terminalType')" prop="terminalType">
                  <el-select v-model="newInfoForm.terminalType" style="width:200px">
                    <el-option label="L3Meter_SXE_G3" :value="1"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item :label="$t('change.manufacturer')" prop="manufacturer">
                  <el-select v-model="newInfoForm.manufacturer" style="width:200px">
                    <el-option label="L3Meter_SXE_G3" :value="1"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item :label="$t('change.worksheetId')" prop="worksheetId">
                  <el-input :maxlength="30" v-model="newInfoForm.worksheetId" style="width:200px"></el-input>
                </el-form-item>
                <el-form-item :label="$t('change.note')" prop="notice">
                  <el-input :maxlength="30" v-model="newInfoForm.note" style="width:200px"></el-input>
                </el-form-item>
              </el-form>
            </div>
          </el-tab-pane>

          <el-tab-pane :label="$t('change.meterList')" name="Meter list" >
            <div class="meter-list">
              <el-table
              :data="meterTable"
              border
              style="width: 100%"
              height="100"
              :header-cell-style="{background:'#F2F2F2',color:'rgb(51,51,51)'}">
                <el-table-column :label="$t('change.no')" width="100">
                  <template slot-scope="scope">{{ scope.$index + 1 }}</template>
                </el-table-column>
                <el-table-column
                  :label="$t('change.deviceName')"
                  prop="deviceName"></el-table-column>
                <el-table-column
                  label="其他"></el-table-column>
                <el-table-column
                  label="其他"></el-table-column>
              </el-table>
            </div>
          </el-tab-pane>
        </el-tabs>

        <span slot="footer" class="dialog-footer" v-if="subActive === 'Change DCU'">
          <el-button @click="newInfoReset">{{$t('change.reset')}}</el-button>
          <el-button type="primary" @click="next">{{$t('change.confirmMeter')}}</el-button>
        </span>

        <span slot="footer" class="dialog-footer" v-if="subActive === 'Meter list'">
          <el-button @click="reset">{{$t('change.reset')}}</el-button>
          <el-button type="primary" @click="next">{{$t('change.submit')}}</el-button>
        </span>
      </el-dialog>
  </basic-container>
</template>
<script>
import {mapGetters} from 'vuex'
import { meterChangedPage } from '@/api/firmwareUpgrade'
export default {
  data () {
    return {
      active: 'Change DCU',
      subActive: 'Change DCU',
      changeDCUParams: {
        mode: 1,
        deviceName: '',
        current: 1,
        size: 20
      },
      total: 0,
      manufacturer: '1',
      tableData: [],
      selectDCU: [],
      dialogVisible: false,
      newInfoForm: {
        deviceName: '',
        terminalType: '',
        manufacturer: '',
        worksheetId: '',
        note: '',
      },
      timeParams: {
        date: '',
        time: ''
      },
      meterTable: [],
      newTable: [],
      historyParams: {
        // worksheetId: '',
        oldName: '',
        newName: '',
        time1: this.calcDate(new Date()),
        time2: new Date(),
        size: 20,
        current: 1
      },
      historyTableData: [],
      factoryList: [],
      tmnlTypeList: [],
    };
  },
  created () {
    this.searchHistory()
  },
  methods:{
    calcDate (date) {
      return new Date(date.setTime(date.getTime() - 3600 * 1000 * 24 * 7))
    },
    timeFormat (date) {
      return date.getFullYear() + '-' + (date.getMonth() + 1 + '').padStart(2, '0') + '-' + (date.getDate() + '').padStart(2, '0')
    },
    searchHistory () {
      let str = ''
      let obj = {
        size: this.historyParams.size,
        current: this.historyParams.current,
        startDate: this.timeFormat(this.historyParams.time1),
        endDate: this.timeFormat(this.historyParams.time2),
        tmnlAssetNoNew: this.historyParams.newName,
        tmnlAssetNoNew: this.historyParams.oldName,
      }
      Object.keys(obj).forEach(ele => {
        str += (ele + '=' + obj[ele] + '&')
      })
      str = str.substr(0, str.length - 1)
      meterChangedPage(str).then(res => {
        this.historyTableData = res.data.data.records
      })
    },
    sizeChange () {},
    currentChange () {},
    selectionChange (val) {
      this.selectDCU = val
    },
    changeDCU () {
      if (this.selectDCU.length === 0) {
        this.$notify({
          title: this.$t("global.warn"),
          message: this.$t("global.warndele"),
          type: "warning"
        })
        return
      }
      this.dialogVisible = true
    },
    newInfoReset () {
      this.$refs.newInfoRef.resetFields()
    },
    next () {
      this.subActive = 'Meter list'
    },
    reset () {

    },
    recordFormat (val) {
      if (val == '01') {
        return this.$t('change.manual')
      } else if (val == '02') {
        return this.$t('change.interface')
      }
    },
    validFormat (val) {
      if (val == 0) {
        return this.$t('collection.invalid')
      } else if (val == 1) {
        return this.$t('collection.valid')
      }
    },
  },
  computed: {
    ...mapGetters(['colorName'])
  },
}
</script>
<style lang='scss' scoped>
  .content {
    margin-top: 10px;
      .head {
        height: 40px;
        padding-left: 20px;
        border: 1px solid #ddd;
        border-bottom: 0;
        line-height: 40px;
        .operate {
          float: right;
          display: flex;
          align-items: center;
          & > span {
            display: inline-block;
            height: 20px;
            padding: 0 20px;
            margin-top: 10px;
            line-height: 20px;
            text-align: center;
            border-left: 1px solid #ddd;
            cursor: pointer;
            img {
              vertical-align: middle;
              padding-bottom: 4px;
            }
          }
          .checkbox {
            width: 400px;
            span {
              margin-left: 30px;
            }
          }
        }
      }
      .page {
        width: 100%;
        height: 50px;
        padding-top: 10px;
        border: 1px solid #ddd;
        border-top: 0;
        background-color: #fafafa;
        box-sizing: border-box;
        .el-pagination {
          margin: 0 15px;
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
  /deep/ .el-tabs__header {
    padding: 5px 0 0 10px;
    background-color: #C6DEDD;
    .el-tabs__nav {
      background-color: #C6DEDD;
      border: 0;
      .el-tabs__item {
        border: 0;
        color: #018B7E;
      }
      .el-tabs__item.is-active {
        background-color: #fff;
      }
    }
  }
}
.el-dialog {
  ul {
    display: flex;
    flex-wrap: wrap;
    padding: 0;
    li {
      margin: 0 20px 0 15px;
    }
  }
  .head {
    height: 40px;
    margin-top: 20px;
    padding-left: 20px;
    border: 1px solid #ddd;
    border-bottom: 0;
    line-height: 40px;
    font-weight: 700;
  }
}
  .el-form-item {
    /deep/ .el-form-item__label {
      padding-right: 30px;
      text-align: right;
    }
  }
</style>