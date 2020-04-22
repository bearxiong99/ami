<template>
  <basic-container>
      <el-tabs v-model="active" type="card">
        <el-tab-pane :label="$t('change.changeDCU')" name="Change DCU" >
          {{$t('change.manufacturer')}}
          <el-select v-model="changeDCUParams.factoryCode" size="small">
            <el-option :label="$t('global.all')" :value="''"></el-option>
            <el-option :label="ele.typeName" :value="ele.typeCode" v-for="(ele, i) in tmnlFactoryList" :key="i"></el-option>
          </el-select>
          {{$t('change.deviceName')}}
          <el-input :maxlength="30" v-model="changeDCUParams.deviceName" style="width:150px;margin:0 10px;"></el-input>
          <el-button type="primary" @click="search">{{$t('global.search')}}</el-button>

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
              highlight-current-row
              @current-change="pickRow"
              height="55vh"
              :loading="loading"
              :header-cell-style="{background:'#F2F2F2',color:'rgb(51,51,51)'}">
              <el-table-column :label="$t('change.no')" width="50">
                <template slot-scope="scope">{{ changeDCUParams.size * (changeDCUParams.current - 1) + scope.$index + 1 }}</template>
              </el-table-column>
              <el-table-column :label="$t('change.deviceName')" prop="tmnlAssetNo">
              </el-table-column>
              <el-table-column :label="$t('change.onlineStatus')">
                <template slot-scope="scope">
                  <div class="circle" :style="{'background-color': scope.row.isOnline ? colorName : '#a5a5a5'}"></div>
                </template>
              </el-table-column>
              <el-table-column :label="$t('change.terminalType')">
                <template slot-scope="scope">
                  {{typeFormat(scope.row.terminalTypeCode)}}
                </template>
              </el-table-column>
              <el-table-column :label="$t('change.manufacturer')">
                <template slot-scope="scope">
                  {{factoryFormat(scope.row.factoryCode)}}
                </template>
              </el-table-column>
              <el-table-column prop="runDate" :label="$t('areaManage.runDate')"></el-table-column>
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
                prop="tmnlAssetNoOld"
                :label="$t('change.oldDeivceName')">
              </el-table-column>
              <el-table-column
                prop="tmnlAssetNoNew"
                :label="$t('change.newDeivceName')">
              </el-table-column>
              <el-table-column
                prop="terminalTypeCodeOld"
                :label="$t('change.oldTerminalType')">
                <template slot-scope="scope">
                  {{typeFormat(scope.row.terminalTypeCodeOld)}}
                </template>
              </el-table-column>
              <el-table-column
                prop="terminalTypeCodeNew"
                :label="$t('change.newTerminalType')">
                <template slot-scope="scope">
                  {{typeFormat(scope.row.terminalTypeCodeNew)}}
                </template>
              </el-table-column>
              <el-table-column
                prop="factoryCodeOld"
                :label="$t('change.oldManufacturer')">
                <template slot-scope="scope">
                  {{factoryFormat(scope.row.factoryCodeOld)}}
                </template>
              </el-table-column>
              <el-table-column
                prop="factoryCodeNew"
                :label="$t('change.newManufacturer')">
                <template slot-scope="scope">
                  {{factoryFormat(scope.row.factoryCodeNew)}}
                </template>
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
      width="35%"
      @closed="close">
        <el-tabs v-model="subActive" type="card">
          <el-tab-pane :label="$t('change.changeDCU')" name="Change DCU" >
            <div class="original-info">
              <h4>{{$t('change.originalDCUInfo')}}</h4>
              <ul>
                <li>
                  {{$t('change.deviceName') + ': ' + selectDCU.tmnlAssetNo}}
                </li>
                <li>
                  {{$t('change.terminalType') + ': ' + typeFormat(selectDCU.terminalTypeCode)}}
                </li>
                <li>
                  {{$t('change.manufacturer') + ': ' + factoryFormat(selectDCU.factoryCode)}}
                </li>
              </ul>
            </div>
            <div class="new-info">
              <h4>{{$t('change.newDCUInfo')}}</h4>
              <el-form :model="newInfoForm" label-position="left" label-width="auto" ref="newInfoRef" :rules="changeRules">
                <el-form-item :label="$t('change.deviceName')" prop="deviceName">
                  <!-- <el-input :maxlength="30" v-model="newInfoForm.deviceName" style="width:200px"></el-input> -->
                  <!-- <el-autocomplete
                    v-model="newInfoForm.deviceName"
                    :fetch-suggestions="searchNewDCU"
                    :trigger-on-focus="false"
                    style="width:200px"
                  ></el-autocomplete> -->
                  <el-select v-model="newInfoForm.deviceName" filterable @change="changeNewDCU" style="width:200px">
                    <el-option
                      v-for="item in dcus"
                      :key="item.tmnlAssetNo"
                      :label="item.tmnlAssetNo"
                      :value="item.tmnlAssetNo">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item :label="$t('change.terminalType')" prop="terminalType">
                  <el-select v-model="newInfoForm.terminalType" size="small" style="width:200px">
                    <el-option :label="ele.typeName" :value="ele.typeCode" v-for="(ele, i) in tmnlTypeList" :key="i"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item :label="$t('change.manufacturer')" prop="manufacturer">
                  <el-select v-model="newInfoForm.factoryCode" size="small" style="width:200px">
                    <el-option :label="ele.typeName" :value="ele.typeCode" v-for="(ele, i) in tmnlFactoryList" :key="i"></el-option>
                  </el-select>
                </el-form-item>
                <!-- <el-form-item :label="$t('change.worksheetId')" prop="worksheetId">
                  <el-input :maxlength="30" v-model="newInfoForm.worksheetId" style="width:200px"></el-input>
                </el-form-item>
                <el-form-item :label="$t('change.note')" prop="notice">
                  <el-input :maxlength="30" v-model="newInfoForm.note" style="width:200px"></el-input>
                </el-form-item> -->
              </el-form>
            </div>
          </el-tab-pane>

          <el-tab-pane :label="$t('change.meterList')" name="Meter list" >
            <div class="meter-list">
              <el-table
              :data="meterTable"
              border
              style="width: 100%"
              :header-cell-style="{background:'#F2F2F2',color:'rgb(51,51,51)'}">
                <el-table-column :label="$t('change.no')" width="100">
                  <template slot-scope="scope">{{ scope.$index + 1 }}</template>
                </el-table-column>
                <el-table-column
                  :label="$t('change.deviceName')"
                  prop="deviceName"></el-table-column>
                <el-table-column :label="$t('global.meterType')">
                  <template slot-scope="scope">
                    {{meterTypeFormat(scope.row.meterTypeCode)}}
                  </template>
                </el-table-column>
                <el-table-column :label="$t('change.manufacturer')">
                  <template slot-scope="scope">
                    {{meterFactoryFormat(scope.row.factoryCode)}}
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-tab-pane>
        </el-tabs>

        <span slot="footer" class="dialog-footer" v-if="subActive === 'Change DCU'">
          <el-button @click="newInfoReset">{{$t('change.reset')}}</el-button>
          <el-button type="primary" @click="next">{{$t('change.confirmMeter')}}</el-button>
        </span>

        <span slot="footer" class="dialog-footer" v-if="subActive === 'Meter list'">
          <el-button @click="close">{{$t('global.cancel')}}</el-button>
          <el-button type="primary" @click="change">{{$t('change.submit')}}</el-button>
        </span>
      </el-dialog>
  </basic-container>
</template>
<script>
import { mapGetters } from 'vuex'
import { tmnlChangedPage, changeDCU } from '@/api/firmwareUpgrade'
import { getViewList, getDevice } from "@/api/autoRegister";
export default {
  data () {
    return {
      active: 'Change DCU',
      subActive: 'Change DCU',
      changeDCUParams: {
        factoryCode: '',
        deviceName: '',
        current: 1,
        size: 20
      },
      total: 0,
      manufacturer: '1',
      tableData: [],
      selectDCU: {},
      dialogVisible: false,
      newInfoForm: {
        deviceName: '',
        terminalType: '',
        factoryCode: '',
        // worksheetId: '',
        // note: '',
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
      tmnlFactoryList: [],
      tmnlTypeList: [],
      meterFactoryType: [],
      meterTypeList: [],
      loading: false,
      changeRules: {
        deviceName: [
          {
            required: true,
            message: this.$t('change.enterTmnl'),
            trigger: 'blur'
          },
        ],
      },
      dcus: []
    };
  },
  created () {
    this.getView()
    this.search()
    this.searchHistory()
  },
  methods:{
    calcDate (date) {
      return new Date(date.setTime(date.getTime() - 3600 * 1000 * 24 * 7))
    },
    timeFormat (date) {
      return date.getFullYear() + '-' + (date.getMonth() + 1 + '').padStart(2, '0') + '-' + (date.getDate() + '').padStart(2, '0')
    },
    search () {
      this.loading = true;
      let param = {};
      if (
        this.treeNode.deviceType === "meter" ||
        this.treeNode.deviceType === "tmnl"
      ) {
        param = {
          isAllTmnal: 1, //查集中器是1 查电表是0
          pageNum: this.changeDCUParams.current,
          pageSize: this.changeDCUParams.size,
          type: 5,
          terminalAddr: this.treeNode.deviceName,
          factoryCode: this.changeDCUParams.factoryCode,
          serachValue: this.changeDCUParams.deviceName,
        };
      } else {
        param = {
          isAllTmnal: 1, //查集中器是1 查电表是0
          orgNo: this.treeNode.deviceNo,
          pageNum: this.changeDCUParams.current,
          pageSize: this.changeDCUParams.size,
          type: 5,
          factoryCode: this.changeDCUParams.factoryCode,
          serachValue: this.changeDCUParams.deviceName,
        };
      }
      getDevice(param).then(res => {
        if (res.data.data.total != 0) {
          this.tableData = res.data.data.list;
        } else {
          this.tableData = [];
        }
        this.total = res.data.data.total;
        this.loading = false;
      })
      .catch(err => {
        this.loading = false;
      });
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
      tmnlChangedPage(str).then(res => {
        this.historyTableData = res.data.data.records
      })
    },
    sizeChange () {},
    currentChange () {},
    pickRow (row) {
      this.selectDCU = row
    },
    changeDCU () {
      if (!this.selectDCU) {
        this.$notify({
          title: this.$t("global.warn"),
          message: this.$t("global.warncont"),
          type: "warning"
        })
        return
      }
      this.dialogVisible = true
      this.getMeter()
      this.getAllDCU()
    },
    newInfoReset () {
      this.$refs.newInfoRef.resetFields()
    },
    next () {
      this.$refs.newInfoRef.validate(valid => {
        if (!valid) return
        this.subActive = 'Meter list'
      })
    },
    // createFilter (str) {
    //   return (obj) => {
    //     return (obj.value.toLowerCase().indexOf(str.toLowerCase()) === 0);
    //   };
    // },
    // searchNewDCU (str, cb) {
    //   let result = str ? this.dcuList.filter(this.createFilter(str)) : this.dcuList;
    //   cb(result);
    // },
    change () {
      let obj = {
        isValid: 1,
        recType: '01',
        tmnlAssetNoOld: this.selectDCU.tmnlAssetNo,
        tmnlAssetNoNew: this.newInfoForm.deviceName,
      }
      changeDCU(obj).then(res => {
        console.log(res, 'res')
      })
    },
    getMeter () {
      let param = {
          isAllTmnal: 0, //查集中器是1 查电表是0
          pageNum: 1,
          pageSize: 999,
          terminalAddr: this.selectDCU.tmnlAssetNo,
          type: -1
        };
      getDevice(param).then(res => {
        if (res.data.data.total != 0) {
          this.meterTable = res.data.data.list;
        } else {
          this.meterTable = [];
        }
        this.total = res.data.data.total;
      })
    },
    getView() {
      getViewList({
        viewType: "TMNLFactoryType"
      }).then(res => {
        this.tmnlFactoryList = res.data.data.list;
      });
      getViewList({
        viewType: "tmnlType"
      }).then(res => {
        this.tmnlTypeList = res.data.data.list;
      });
      getViewList({
        viewType: "meterFactoryType"
      }).then(res => {
        this.meterFactoryList = res.data.data.list
      })
      getViewList({
        viewType: "meterType"
      }).then(res => {
        this.meterTypeList = res.data.data.list
      })
    },
    typeFormat (val) {
      let obj = this.tmnlTypeList.find(ele => ele.typeCode == val)
      if (obj) {
        return obj.typeName
      } else {
        return val
      }
    },
    factoryFormat (val) {
      let obj = this.tmnlFactoryList.find(ele => ele.typeCode == val)
      if (obj) {
        return obj.typeName
      } else {
        return val
      }
    },
    meterTypeFormat (val) {
      let obj = this.meterTypeList.find(ele => ele.typeCode == val)
      if (obj) {
        return obj.typeName
      } else {
        return val
      }
    },
    meterFactoryFormat (val) {
      let obj = this.meterFactoryList.find(ele => ele.typeCode == val)
      if (obj) {
        return obj.typeName
      } else {
        return val
      }
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
    close () {
      this.dialogVisible = false
      this.subActive = 'Change DCU'
    },
    getAllDCU () {
      getDevice({
        isAllTmnal: 1,
        orgNo: '01',
        pageNum: 1,
        pageSize: 999,
        type: 5,
        factoryCode: '',
        serachValue: '',
      }).then(res => {
        if (res.data.data.total != 0) {
          this.dcus = res.data.data.list;
          let index = this.dcus.findIndex(ele => ele.tmnlAssetNo === this.selectDCU.tmnlAssetNo)
          this.dcus.splice(index, 1)
        } else {
          this.dcus = [];
        }
      })
    },
    changeNewDCU () {
      let obj = this.dcus.find(ele => ele.tmnlAssetNo === this.newInfoForm.deviceName)
      this.newInfoForm.terminalType = obj.terminalTypeCode
      this.newInfoForm.factoryCode = obj.factoryCode
    }
  },
  computed: {
    dcuList () {
      if (this.tableData.length) {
        return this.tableData.map(ele => ({value: ele.tmnlAssetNo}))
      } else {
        return []
      }
    },
    ...mapGetters(['colorName', 'treeNode'])
  },
  watch: {
    treeNode () {
      this.search()
    }
  }
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