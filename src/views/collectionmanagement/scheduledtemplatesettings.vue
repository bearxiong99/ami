<template>
  <basic-container>
    <el-form :inline="true" :model="params" label-position="left">
      <el-form-item :label="$t('global.tmnlType')" style="margin-right:10px">
        <el-select v-model="params.type" style="width: 100%;" size="small">
          <el-option :value="''" :label="$t('global.all')"></el-option>
          <el-option :value="ele.typeCode" :label="ele.typeName" v-for="(ele, i) in tmnlTypeList" :key="i"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search" size="small">{{$t('global.search')}}</el-button>
      </el-form-item>
    </el-form>

    <div class="uptop">
      <div>{{$t('clock.temList')}}</div>
      <div class="right">
        <span @click="add"
        style="cursor:pointer">
          <img src="img/New.png" alt />
          {{$t('areaManage.newBuild')}}
        </span>
        <span @click="del" style="cursor:pointer">
          <img src="img/Delete.png" alt />
          {{$t('global.delete')}}
        </span>
        <span @click="edit" style="cursor:pointer">
          <img src="img/edit.png" alt />
          {{$t('global.edit')}}
        </span>
      </div>
    </div>
    <el-table
      :data="tableData"
      border
      :header-cell-style="{background:'#F2F2F2',color:'rgb(51,51,51)'}"
      height="60vh"
      @selection-change="dataSelect"
      v-loading="loading">
      <el-table-column type="selection"></el-table-column>
      <el-table-column :label="$t('clock.temName')" prop="templateName">
      </el-table-column>
      <el-table-column :label="$t('clock.dataType')" prop="dataType" :formatter="dataTypeFormat">
      </el-table-column>
      <el-table-column :label="$t('clock.taskNo')" prop="taskNo">
      </el-table-column>
      <el-table-column :label="$t('clock.reportCycleUnit')" prop="reportCycleUnit" :formatter="unitFormat">
      </el-table-column>
      <el-table-column :label="$t('clock.reportCycle')" prop="reportCycle">
      </el-table-column>
      <el-table-column :label="$t('clock.refTime')" prop="referenceTime">
      </el-table-column>
      <el-table-column :label="$t('clock.isCancel')" prop="isCancel" :formatter="cancelFormat">
      </el-table-column>
      <el-table-column :label="$t('clock.cancelDate')" prop="cancelDate">
      </el-table-column>
      <el-table-column :label="$t('clock.tmnlType')" prop="terminalTypeCode" :formatter="tmnlTypeFormat">
      </el-table-column>
    </el-table>
    <pagination
      :total="total"
      :page.sync="params.current"
      :limit.sync="params.size"
      @pagination="search"
      style="margin-top:-1px"
    />

    <el-dialog
      :title="flag ? $t('global.add') : $t('global.edit')"
      :visible.sync="dialogShow"
      width="40%"
      :before-close="dialogClose">
      <el-form
        :model="editForm"
        label-width="auto"
        label-position="left"
        style="width:80%;margin:0 auto;"
        :rules="editRules"
        ref="editRef"
        size="medium"
      >
        <el-form-item :label="$t('clock.temName')" prop="templateName">
          <el-input :maxlength="30" v-model="editForm.templateName"></el-input>
        </el-form-item>
        <el-form-item :label="$t('clock.taskNo')" prop="taskNo">
          <el-input :maxlength="30" v-model="editForm.taskNo"></el-input>
        </el-form-item>
        <el-form-item :label="$t('clock.reportCycleUnit')" prop="reportCycleUnit">
          <el-select v-model="editForm.reportCycleUnit" style="width: 100%;" size="small">
            <el-option :label="$t('systemparam.minute')" value="0"></el-option>
            <el-option :label="$t('systemparam.day')" value="2"></el-option>
            <el-option :label="$t('systemparam.month')" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('clock.reportCycle')" prop="reportCycle">
          <el-input :maxlength="30" v-model="editForm.reportCycle"></el-input>
        </el-form-item>
        <el-form-item :label="$t('clock.refTime')" prop="referenceTime">
          <el-date-picker
            v-model="editForm.referenceTime"
            type="datetime"
            :clearable="false"
            :editable="false">
          </el-date-picker>
        </el-form-item>
        <!-- <el-form-item label="terminal Rycle" prop="tmnlR">
          <el-input :maxlength="30" v-model="editForm.tmnlR"></el-input>
        </el-form-item> -->
        <!-- <el-form-item label="isShare" prop="isShare">
          <el-select v-model="editForm.isShare" style="width: 100%;" size="small">
            <el-option label="No" :value="0"></el-option>
            <el-option label="Yes" :value="1"></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item :label="$t('clock.isCancel')" prop="isCancel">
          <el-select v-model="editForm.isCancel" style="width: 100%;" size="small">
            <el-option :label="$t('global.true')" :value="0"></el-option>
            <el-option :label="$t('global.false')" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="Cancel Date" prop="cancelDate">
          <el-date-picker
            v-model="editForm.cancelDate"
            type="date">
          </el-date-picker>
        </el-form-item> -->
        <el-form-item :label="$t('clock.tmnlType')" prop="terminalTypeCode">
          <el-select v-model="editForm.terminalTypeCode" style="width: 100%;" size="small" :disabled="!flag">
            <el-option :value="ele.typeCode" :label="ele.typeName" v-for="(ele, i) in tmnlTypeList" :key="i"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('clock.dataType')" prop="dataType">
          <el-select v-model="editForm.dataType" style="width: 100%;" size="small" :disabled="!flag">
            <!-- <el-option label="实时数据" :value="1"></el-option> -->
            <el-option :label="$t('collection.historicalData')" :value="2"></el-option>
            <el-option :label="$t('collection.eventData')" :value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Data" prop="protocolNos">
          <el-select v-model="editForm.protocolNos" style="width: 100%;" size="small" multiple collapse-tags :disabled="!flag">
            <el-option v-if="editForm.terminalTypeCode === '05'" label="Average Voltages and Currents Profile-DC Reading" value="S0DEA"></el-option>
            <el-option v-if="editForm.terminalTypeCode === '05'" label="Load profile-DC Reading" value="S0DEB"></el-option>
            <el-option v-if="editForm.terminalTypeCode === '05'" label="Energy Profile-DC Reading" value="S0DEC"></el-option>
            <el-option v-if="editForm.terminalTypeCode === '05'" label="Monthly Billing Profil-DC Reading" value="S0DED"></el-option>
            <el-option v-if="editForm.terminalTypeCode === '05'" label="Maximum demand profile-DC Reading" value="S0DEE"></el-option>
            <el-option v-if="editForm.terminalTypeCode === '05'" label="Cumulative maximum demand profile-DC Reading" value="S0DEF"></el-option>
            <el-option v-if="editForm.terminalTypeCode === '10' || editForm.terminalTypeCode === '11'" label="Average Voltages and Currents Profile-Meter Reading" value="S0DEA"></el-option>
            <el-option v-if="editForm.terminalTypeCode === '10' || editForm.terminalTypeCode === '11'" label="Load profile-Meter Reading" value="S0DEB"></el-option>
            <el-option v-if="editForm.terminalTypeCode === '10' || editForm.terminalTypeCode === '11'" label="Energy Profile-Meter Reading" value="S0DEC"></el-option>
            <el-option v-if="editForm.terminalTypeCode === '10' || editForm.terminalTypeCode === '11'" label="Monthly Billing Profil-Meter Reading" value="S0DED"></el-option>
            <el-option v-if="editForm.terminalTypeCode === '10' || editForm.terminalTypeCode === '11'" label="Maximum demand profile-Meter Reading" value="S0DEE"></el-option>
            <el-option v-if="editForm.terminalTypeCode === '10' || editForm.terminalTypeCode === '11'" label="Cumulative maximum demand profile-Meter Reading" value="S0DEF"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align:right;">
        <el-button @click="dialogClose" size="small">{{$t('global.cancel')}}</el-button>
        <el-button type="primary" @click="confirm" size="small">{{$t('global.save')}}</el-button>
      </div>
    </el-dialog>
  </basic-container>
</template>
<script>
import Pagination from '@/components/Pagination'
import { getViewList } from "@/api/autoRegister"
import {getTem, del, save, update} from '@/api/collection'
export default {
  components: {
    Pagination
  },
  data () {
    return {
      params: {
        type: '',
        current: 1,
        size: 20
      },
      total: 0,
      tableData: [],
      tableHeight: window.innerHeight - 400,
      selectArr: [],
      loading: false,
      dialogShow: false,
      editForm: {
        templateName: '',
        dataType: '',
        taskNo: '',
        reportCycleUnit: '0',
        reportCycle: '',
        referenceTime: '',
        // tmnlR: '',
        // isShare: 0,
        isCancel: 0,
        // cancelDate: 0,
        terminalTypeCode: '',
        protocolNos: [],
      },
      editRules: {
        templateName: [
          {
            required: true,
            message: this.$t('remote.emptyContent'),
            trigger: 'blur'
          },
        ],
        dataType: [
          {
            required: true,
            message: this.$t('remote.emptyContent'),
            trigger: 'blur'
          },
        ],
        taskNo: [
          {
            required: true,
            message: this.$t('remote.emptyContent'),
            trigger: 'blur'
          },
        ],
        reportCycleUnit: [
          {
            required: true,
            message: this.$t('remote.emptyContent'),
            trigger: 'blur'
          },
        ],
        reportCycle: [
          {
            required: true,
            message: this.$t('remote.emptyContent'),
            trigger: 'blur'
          },
        ],
        // refTime: [
        //   {
        //     required: true,
        //     type: 'date',
        //     message: this.$t('remote.emptyContent'),
        //     trigger: 'blur'
        //   },
        // ],
        // isShare: [
        //   {
        //     required: true,
        //     message: this.$t('remote.emptyContent'),
        //     trigger: 'blur'
        //   },
        // ],
        isCancel: [
          {
            required: true,
            message: this.$t('remote.emptyContent'),
            trigger: 'blur'
          },
        ],
        // cancelDate: [
        //   {
        //     required: true,
        //     message: this.$t('remote.emptyContent'),
        //     trigger: 'blur'
        //   },
        // ],
        terminalTypeCode: [
          {
            required: true,
            message: this.$t('remote.emptyContent'),
            trigger: 'blur'
          },
        ],
        protocolNos: [
          {
            required: true,
            message: this.$t('remote.emptyContent'),
            trigger: 'blur'
          },
        ],
      },
      flag: true,
      tmnlTypeList: [],
    }
  },
  mounted () {
    this.getView()
    this.search()
  },
  methods:{
    timeFormat(val) {
      let date = new Date(val)
      return (
        date.getFullYear() +
        "-" +
        (date.getMonth() + 1 + "").padStart(2, "0") +
        "-" +
        (date.getDate() + "").padStart(2, "0") +
        " " +
        (date.getHours() + "").padStart(2, "0") +
        ":" +
        (date.getMinutes() + "").padStart(2, "0") +
        ":" +
        (date.getSeconds() + "").padStart(2, "0")
      )
    },
    dataSelect (val) {
      this.selectArr = val
    },
    add () {
      this.dialogShow = true
      this.editForm.templateName = ''
      this.editForm.dataType = ''
      this.editForm.taskNo = ''
      this.editForm.reportCycleUnit = '0'
      this.editForm.reportCycle = ''
      this.editForm.referenceTime = ''
      this.editForm.isCancel = 0
      this.editForm.terminalTypeCode = ''
      this.editForm.protocolNos = []
      this.flag = true
    },
    edit () {
      if (this.selectArr.length === 0) {
        this.$notify({
          title: this.$t('global.warn'),
          message: this.$t('global.warncont'),
          type: 'warning'
        })
        return
      } else if (this.selectArr.length > 1) {
        this.$notify({
          title: this.$t('global.warn'),
          message: this.$t('role.onlyOne'),
          type: 'warning'
        })
        return
      }
      this.editForm.templateName = this.selectArr[0].templateName
      this.editForm.dataType = this.selectArr[0].dataType
      this.editForm.taskNo = this.selectArr[0].taskNo
      this.editForm.reportCycleUnit = this.selectArr[0].reportCycleUnit
      this.editForm.reportCycle = this.selectArr[0].reportCycle
      this.editForm.referenceTime = new Date(this.selectArr[0].referenceTime)
      this.editForm.isCancel = this.selectArr[0].isCancel
      this.editForm.terminalTypeCode = this.selectArr[0].terminalTypeCode
      this.editForm.protocolNos = this.selectArr[0].protocolNos
      this.dialogShow = true
      this.flag = false
    },
    del () {
      if (this.selectArr.length === 0) {
        this.$notify({
          title: this.$t('global.warn'),
          message: this.$t('global.warncont'),
          type: 'warning'
        })
        return
      }
      this.$confirm(
          this.$t("areaManage.deleteTip"),
          this.$t("areaManage.reminder"),
          {
            confirmButtonText: this.$t("global.yes"),
            cancelButtonText: this.$t("global.cancel"),
            type: "warning"
          }
      ).then(() => {
        let arr = this.selectArr.map(ele => ({templateId: ele.templateId, protocolNo: ele.protocolNo}))
        console.log(arr, 'arr')
        del(arr).then(res => {
          if (res.data.success) {
            this.$message({
              type: 'success',
              message: this.$t('role.success')
            })
            this.search()
          } else {
            this.$message({
              type: 'error',
              message: this.$t('auto.operateFail')
            })
          }
        })
      })
    },
    search () {
      this.loading = true
      getTem({
        terminalTypeCode: this.params.type,
        startRow: this.params.current,
        pageSize: this.params.size,
      }).then(res => {
        if (res.data.success) {
          this.tableData = res.data.data.list
          this.total = res.data.data.count
        } else {
          this.$message({
            message: this.$t("global.searchFail"),
            type: "error"
          })
        }
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    confirm () {
      this.$refs.editRef.validate(valid => {
        if (!valid) return
        if (this.flag) {
          this.editForm.referenceTime = this.timeFormat(this.editForm.referenceTime)
          save(this.editForm).then(res => {
            if (res.data.success) {
              this.$message({
                type: 'success',
                message: this.$t('role.success')
              })
              this.dialogClose()
              this.search()
            } else {
              this.$message({
                type: 'error',
                message: this.$t('auto.operateFail')
              })
            }
          })
        } else {
          this.editForm.referenceTime = this.timeFormat(this.editForm.referenceTime)
          update({
            templateId: this.selectArr[0].templateId,
            ...this.editForm
          }).then(res => {
            if (res.data.success) {
              this.$message({
                type: 'success',
                message: this.$t('role.success')
              })
              this.dialogClose()
              this.search()
            } else {
              this.$message({
                type: 'error',
                message: this.$t('auto.operateFail')
              })
            }
          })
        }
      })
    },
    dialogClose () {
      // this.$refs['editRef'].resetFields()
      this.dialogShow = false
    },
    tmnlTypeFormat (row) {
      let obj = this.tmnlTypeList.find(ele => ele.typeCode === row.terminalTypeCode)
      if (obj) {
        return obj.typeName
      } else {
        return row.terminalTypeCode
      }
    },
    getView() {
      getViewList({
        viewType: 'tmnlType'
      }).then(res => {
        this.tmnlTypeList = res.data.data.list
      });
    },
    cancelFormat (row) {
      if (row.isCancel == 1) {
        return this.$t('global.true')
      } else if (row.isCancel == 0) {
        return this.$t('global.false')
      } else {
        return row.isCancel
      }
    },
    dataTypeFormat (row) {
      if (row.dataType == 2) {
        return this.$t('collection.historicalData')
      } else if (row.dataType == 3) {
        return this.$t('collection.eventData')
      } else {
        return row.dataType
      }
    },
    unitFormat (row) {
      if (row.reportCycleUnit == 0) {
        return this.$t('systemparam.minute')
      } else if (row.reportCycleUnit == 2) {
        return this.$t('systemparam.day')
      } else if (row.reportCycleUnit == 3) {
        return this.$t('systemparam.month')
      } else {
        return row.reportCycleUnit
      }
    },
  }
}
</script>
<style lang='scss' scoped>
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
.el-date-editor {
  width: 100%!important;
}
</style>