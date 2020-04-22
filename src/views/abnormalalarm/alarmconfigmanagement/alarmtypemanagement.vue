<template>
  <basic-container>
    <el-form :inline="true" :model="alarmParams" label-position="left">
      <el-form-item :label="$t('alarm.eventType')" style="margin-right:20px">
        <el-select v-model="alarmParams.eventType" size="small">
          <el-option :value="0" :label="$t('global.all')"></el-option>
          <el-option :value="ele.value" :label="ele.label" v-for="ele in eventTypes" :key="ele.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('alarm.alarmName')" style="margin-right:10px">
        <el-select v-model="alarmParams.eventName" size="small">
          <el-option :value="null" :label="$t('global.all')"></el-option>
          <el-option :label="ele.eventName" :value="ele.eventName" v-for="(ele, i) in nameArr" :key="i"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search" size="small">{{$t('global.search')}}</el-button>
      </el-form-item>
    </el-form>
    <div class="uptop">
      <div>{{$t('alarm.info')}}</div>
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
      :height="tableHeight"
      @selection-change="alarmSelect"
      v-loading="loading"
    >
      <el-table-column type="selection"></el-table-column>
      <!-- <el-table-column :label="$t('alarm.id')" prop="eventNo">
      </el-table-column> -->
      <el-table-column :label="$t('alarm.name')" prop="eventName">
      </el-table-column>
      <el-table-column :label="$t('alarm.protocol')" prop="protocolNo">
      </el-table-column>
      <el-table-column :label="$t('alarm.eventType')" prop="eventType" :formatter="typeFormat">
      </el-table-column>
    </el-table>
    <pagination
      :total="total"
      :page.sync="alarmParams.current"
      :limit.sync="alarmParams.size"
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
        style="width:50%;margin:0 auto;"
        :rules="editRules"
        ref="editRef"
      >
        <el-form-item :label="$t('alarm.id')" prop="eventNo">
          <el-input :maxlength="30" v-model="editForm.eventNo"></el-input>
        </el-form-item>
        <el-form-item :label="$t('alarm.name')" prop="eventName">
          <el-input :maxlength="30" v-model="editForm.eventName"></el-input>
        </el-form-item>
        <el-form-item :label="$t('alarm.eventType')" prop="eventType">
          <el-select v-model="editForm.eventType" style="width: 100%;" size="small">
            <el-option :value="ele.value" :label="ele.label" v-for="ele in eventTypes" :key="ele.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('alarm.protocol')" prop="protocolNo">
          <el-input :maxlength="30" v-model="editForm.protocolNo"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align:right;">
        <el-button @click="dialogClose" size="small">{{$t('global.cancel')}}</el-button>
        <el-button type="primary" @click="editAlarm" size="small">{{$t('auto.confirm')}}</el-button>
      </div>
    </el-dialog>
  </basic-container>
</template>

<script>
import Pagination from '@/components/Pagination'
import { getType, add, update, del, getAlarmNames } from "@/api/alarm"
export default {
  components: {
    Pagination
  },
  data() {
    return {
      alarmParams: {
        eventType: 0,
        eventName: '',
        // eventNo: '',
        size: 20,
        current: 1
      },
      editForm: {
        eventNo: '',
        eventName: '',
        eventType: 1,
        protocolNo: '',
      },
      tableData: [],
      total: 0,
      dialogShow: false,
      selectAlarms: [],
      loading: false,
      editRules: {
        eventNo: [
          {
            required: true,
            message: this.$t('alarm.enterID'),
            trigger: 'blur'
          },
        ],
        eventName: [
          {
            required: true,
            message: this.$t('alarm.enterName'),
            trigger: 'blur'
          },
        ],
        eventType: [
          {
            required: true,
            message: this.$t('alarm.selectType'),
            trigger: 'blur'
          },
        ],
        protocolNo: [
          {
            required: true,
            message: this.$t('alarm.enterProtocol'),
            trigger: 'blur'
          },
        ]
      },
      tableHeight: window.innerHeight * 0.6,
      eventTypes: [
        // {value: 0, label: this.$t('global.all')},
        {value: 1, label: this.$t('alarm.tmnlEvent')},
        {value: 2, label: this.$t('alarm.tmnlAlarm')},
        {value: 3, label: this.$t('alarm.meterEvent')},
        {value: 4, label: this.$t('alarm.meterAlarm')},
      ],
      flag: true,
      nameArr: []
    }
  },
  mounted () {
    this.getName()
    this.search()
  },
  methods: {
    alarmSelect (val) {
      this.selectAlarms = val
    },
    dialogClose () {
      // this.$refs.editRef.resetFields()
      this.dialogShow = false
    },
    search () {
      this.loading = true
      getType({
        eventType: this.alarmParams.eventType === 0 ? null : this.alarmParams.eventType,
        current: this.alarmParams.current,
        size: this.alarmParams.size,
        // eventNo: this.alarmParams.eventNo.trim().length > 0 ? this.alarmParams.eventNo.trim() : null,
        eventName: this.alarmParams.eventName ? this.alarmParams.eventName : null,
      }).then(res => {
        console.log(res, 'res')
        if (res.data.success) {
          this.tableData = res.data.data.records
          this.total = res.data.data.total
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
    add () {
      this.dialogShow = true
      this.editForm.eventNo = ''
      this.editForm.eventName = ''
      this.editForm.eventType = 1
      this.editForm.protocolNo = ''
      this.flag = true
    },
    edit () {
      if (this.selectAlarms.length === 0) {
        this.$notify({
          title: this.$t('global.warn'),
          message: this.$t('global.warncont'),
          type: 'warning'
        })
        return
      } else if (this.selectAlarms.length > 1) {
        this.$notify({
          title: this.$t('global.warn'),
          message: this.$t('role.onlyOne'),
          type: 'warning'
        })
        return
      }
      this.editForm.eventNo = this.selectAlarms[0].eventNo
      this.editForm.eventName = this.selectAlarms[0].eventName
      this.editForm.eventType = this.selectAlarms[0].eventType
      this.editForm.protocolNo = this.selectAlarms[0].protocolNo
      this.dialogShow = true
      this.flag = false
    },
    del () {
      if (this.selectAlarms.length === 0) {
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
        let str = 'protocolNos=' + this.selectAlarms.map(ele => ele.protocolNo).join(',')
        del(str).then(res => {
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
    editAlarm () {
      this.$refs.editRef.validate(valid => {
        if (!valid) return
        if (this.flag) {
          add(this.editForm).then(res => {
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
          update(this.editForm).then(res => {
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
    typeFormat (row) {
      return this.eventTypes.find(ele => ele.value === row.eventType).label
    },
    searchVal (val) {
      this.alarmParams.current = 1
    },
    getName () {
      getAlarmNames({
        eventType: 2
      }).then(res => {
        this.nameArr = res.data.data
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
