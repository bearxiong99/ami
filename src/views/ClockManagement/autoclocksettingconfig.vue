<template>
  <basic-container>
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
      v-loading="loading"
      @row-click="rowClick"
      :row-class-name="tableRowClassName">
      <!-- <el-table-column width="50">
        <template slot-scope="scope">
          <el-radio v-model="radioVal" :label="scope.$index" @change="dataSelect"></el-radio>
        </template>
      </el-table-column> -->
      <el-table-column :label="$t('global.id')" width="80">
        <template slot-scope="scope">
          {{scope.$index + 1}}
        </template>
      </el-table-column>
      <el-table-column :label="$t('clock.temName')" prop="tmplateName">
      </el-table-column>
      <el-table-column :label="$t('clock.syn')" prop="synInterval">
      </el-table-column>
      <el-table-column :label="$t('clock.max')" prop="maxLimit">
      </el-table-column>
      <el-table-column :label="$t('clock.min')" prop="minLimit">
      </el-table-column>
      <el-table-column :label="$t('clock.inuseTime')" prop="inuseTime">
      </el-table-column>
    </el-table>

    <el-dialog
      :title="flag ? $t('global.add') : $t('global.edit')"
      :visible.sync="dialogShow"
      width="40%"
      :before-close="dialogClose">
      <el-form
        :model="editForm"
        label-width="auto"
        label-position="left"
        style="width:70%;margin:0 auto;"
        :rules="editRules"
        ref="editRef"
        size="medium"
      >
        <el-form-item :label="$t('clock.temName')" prop="tmplateName">
          <el-input :maxlength="30" v-model="editForm.tmplateName"></el-input>
        </el-form-item>
        <el-form-item :label="$t('clock.syn')" prop="synInterval">
          <el-input :maxlength="30" v-model.number="editForm.synInterval"></el-input>
        </el-form-item>
        <el-form-item :label="$t('clock.max')" prop="maxLimit">
          <el-input :maxlength="30" v-model.number="editForm.maxLimit"></el-input>
        </el-form-item>
        <el-form-item :label="$t('clock.min')" prop="minLimit">
          <el-input :maxlength="30" v-model.number="editForm.minLimit"></el-input>
        </el-form-item>
        <el-form-item :label="$t('clock.inuseTime')" prop="inuseTime">
          <el-date-picker
            v-model="editForm.inuseTime"
            type="datetime"
            :clearable="false"
            :editable="false">
          </el-date-picker>
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
import {getTem, save, del, update} from '@/api/clock'
export default {
  components: {
    Pagination
  },
  mounted () {
    this.search()
  },
  watch: {
    'editForm.synInterval': function (val) {
      if (val > 9999) {
        this.editForm.synInterval = 9999
      } else if (val < 0) {
        this.editForm.synInterval = 0
      }
    },
    'editForm.maxLimit': function (val) {
      if (val > 999) {
        this.editForm.maxLimit = 999
      } else if (val < 0) {
        this.editForm.maxLimit = 0
      }
    },
    'editForm.minLimit': function (val) {
      if (val > 99) {
        this.editForm.minLimit = 99
      } else if (val < 0) {
        this.editForm.minLimit = 0
      }
    },
  },
  data () {
    return {
      tableData: [],
      selectArr: [],
      loading: false,
      dialogShow: false,
      editForm: {
        tmplateId: '',
        tmplateName: '',
        synInterval: '',
        maxLimit: '',
        minLimit: '',
        inuseTime: new Date(),
      },
      editRules: {
        tmplateName: [
          {
            required: true,
            message: this.$t('remote.emptyContent'),
            trigger: 'blur'
          },
        ],
        synInterval: [
          {
            type: 'number',
            required: true,
            message: this.$t('global.plsNum'),
            trigger: 'blur'
          },
        ],
        maxLimit: [
          {
            type: 'number',
            required: true,
            message: this.$t('global.plsNum'),
            trigger: 'blur'
          },
        ],
        minLimit: [
          {
            type: 'number',
            required: true,
            message: this.$t('global.plsNum'),
            trigger: 'blur'
          },
        ],
        inuseTime: [
          {
            type: 'date',
            required: true,
            message: this.$t('global.plsDate'),
            trigger: 'blur'
          },
        ],
      },
      flag: true,
      // radioVal: '',
      index: -1
    }
  },
  methods:{
    // dataSelect (i) {
    //   this.selectArr = [this.tableData[i]]
    // },
    add () {
      this.dialogShow = true
      this.editForm.tmplateName = ''
      this.editForm.synInterval = ''
      this.editForm.maxLimit = ''
      this.editForm.minLimit = ''
      this.editForm.inuseTime = new Date()
      this.flag = true
    },
    rowClick (row) {
      this.index = this.tableData.findIndex(ele => ele.tmplateId === row.tmplateId)
      this.selectArr = [row]
    },
    tableRowClassName ({row, rowIndex}) {
      if (rowIndex === this.index) {
        return 'high-light'
      }
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
      this.editForm.tmplateId = this.selectArr[0].tmplateId
      this.editForm.tmplateName = this.selectArr[0].tmplateName
      this.editForm.synInterval = this.selectArr[0].synInterval
      this.editForm.maxLimit = this.selectArr[0].maxLimit
      this.editForm.minLimit = this.selectArr[0].minLimit
      this.editForm.inuseTime = new Date(this.selectArr[0].inuseTime)
      // this.editForm = this.selectArr[0]
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
        del({
          tmplateId: this.selectArr[0].tmplateId
        }).then(res => {
          if (res.data.success) {
            this.$message({
              type: 'success',
              message: this.$t('role.success')
            })
            this.search()
            // this.radioVal = 0
          } else {
            this.$message({
              type: 'error',
              message: this.$t('auto.operateFail')
            })
          }
          this.index = -1
          this.selectArr = []
        })
      })
    },
    search () {
      this.loading = true
      getTem().then(res => {
        if (res.data.success) {
          this.tableData = res.data.data
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
          let sameName = this.tableData.some(ele => ele.tmplateName.trim() === this.editForm.tmplateName.trim())
          if (sameName) {
            this.$message({
              type: 'error',
              message: this.$t('global.sameName')
            })
            return
          }
          save({
            tmplateName: this.editForm.tmplateName,
            synInterval: this.editForm.synInterval,
            maxLimit: this.editForm.maxLimit,
            minLimit: this.editForm.minLimit,
            inuseTime: this.timeFormat(this.editForm.inuseTime)
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
        } else {
          let arr = JSON.parse(JSON.stringify(this.tableData))
          let index = arr.findIndex(ele => ele.tmplateId === this.editForm.tmplateId)
          arr.splice(index, 1)
          let sameName = arr.some(ele => ele.tmplateName.trim() === this.editForm.tmplateName.trim())
          if (sameName) {
            this.$message({
              type: 'error',
              message: this.$t('global.sameName')
            })
            return
          }
          update({
            tmplateId: this.editForm.tmplateId,
            tmplateName: this.editForm.tmplateName,
            synInterval: this.editForm.synInterval,
            maxLimit: this.editForm.maxLimit,
            minLimit: this.editForm.minLimit,
            inuseTime: this.timeFormat(this.editForm.inuseTime)
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
      // this.$refs.editRef.resetFields()
      this.index = -1
      this.selectArr = []
      this.dialogShow = false
    },
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
.el-table {
  /deep/ .el-radio__input {
    padding-left: 8px;
  }
  /deep/ .el-radio__label {
    color: transparent;
  }
  /deep/ .el-radio__input.is-checked+.el-radio__label {
    color: transparent;
  }
  /deep/ .high-light {
    background: #f0f9eb;
  }
}
</style>