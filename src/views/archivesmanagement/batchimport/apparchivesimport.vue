<template>
  <basic-container>
    <el-tabs v-model="active" type="card">
      <el-tab-pane name="dcu" :label="$t('global.wfmsDCU')">
        <div class="filter-box">
          <div class="manufacture">
            <span>{{$t('archives.collectionNo')}}</span>
            <el-input :maxlength="30" v-model="dcuParams.collectionNo" style="width:150px;margin-right:10px" @change="searchVal1"></el-input>
            <span>{{$t('archives.mruNo')}}</span>
            <el-input :maxlength="30" v-model="dcuParams.mruNo" style="width:150px;margin-right:10px" @change="searchVal1"></el-input>
            <span>{{$t('archives.officeNo')}}</span>
            <el-input :maxlength="30" v-model="dcuParams.officeNo" style="width:150px;margin-right:10px" @change="searchVal1"></el-input>
            <span>{{$t('archives.officeName')}}</span>
            <el-input :maxlength="30" v-model="dcuParams.officeName" style="width:150px;margin-right:10px" @change="searchVal1"></el-input>
            <el-button type="primary" @click="getDCU">{{$t('global.search')}}</el-button>
          </div>
        </div>
        <div class="archives-info">
          <div class="head">
            {{$t('global.app')}}
            <div class="operate">
              <span @click="importBtn">
                <img src="img/import.png" alt="">
                {{$t('key.import')}}
              </span>
            </div>
          </div>
          <el-table :data="dcuTableData" border="" style="width: 100%" height="55vh" v-loading="load1" :header-cell-style="{background:'#F2F2F2',color:'rgb(51,51,51)'}">
            <el-table-column :label="$t('key.no')" width="50">
              <template
                slot-scope="scope"
              >{{ dcuParams.size * (dcuParams.current - 1) + scope.$index + 1 }}</template>
            </el-table-column>
            <el-table-column prop="collectionNo" :label="$t('archives.collectionNo')" width="120"></el-table-column>
            <el-table-column prop="mruNo" :label="$t('archives.mruNo')"></el-table-column>
            <el-table-column prop="officeNo" :label="$t('archives.officeNo')"></el-table-column>
            <el-table-column prop="officeName" :label="$t('archives.officeName')"></el-table-column>
            <el-table-column prop="mfrSn" :label="$t('archives.mfrSn')" width="120"></el-table-column>
            <el-table-column prop="equipNo" :label="$t('archives.equipNo')"></el-table-column>
            <el-table-column prop="gpsLatitude" :label="$t('archives.latitude')"></el-table-column>
            <el-table-column prop="gpsLongitude" :label="$t('archives.longitude')"></el-table-column>
            <el-table-column prop="reqNo" :label="$t('archives.reqNo')"></el-table-column>
            <el-table-column prop="replDate" :label="$t('archives.replDate')"></el-table-column>
            <el-table-column prop="instDcuNo" :label="$t('archives.instDcuNo')" width="120"></el-table-column>
            <el-table-column prop="instDcuMfrCode" :label="$t('archives.instDcuMfrCode')" width="200"></el-table-column>
            <el-table-column prop="instDcuModel" :label="$t('archives.instDcuModel')" width="150"></el-table-column>
            <el-table-column prop="workerId" :label="$t('archives.workerId')"></el-table-column>
            <el-table-column prop="firstTime" :label="$t('archives.firstTime')" width="150"></el-table-column>
            <el-table-column prop="updateTime" :label="$t('archives.updateTime')" width="150"></el-table-column>
          </el-table>
          <pagination
            class="pageCom"
            :total="dcuTotal"
            :page.sync="dcuParams.current"
            :limit.sync="dcuParams.size"
            @pagination="getDCU"
          />
        </div>
      </el-tab-pane>
      <el-tab-pane name="meter" :label="$t('global.wfmsMeter')">
        <div class="filter-box">
          <div class="manufacture">
            <span>{{$t('archives.premiseNo')}}</span>
            <el-input :maxlength="30" v-model="meterParams.premiseNo" style="width:150px;margin-right:10px" @change="searchVal2"></el-input>
            <span>{{$t('archives.equipNo')}}</span>
            <el-input :maxlength="30" v-model="meterParams.equipNo" style="width:150px;margin-right:10px" @change="searchVal2"></el-input>
            <el-button type="primary" @click="getMeter">{{$t('global.search')}}</el-button>
          </div>
        </div>
        <div class="archives-info">
          <div class="head">
            {{$t('global.app')}}
            <div class="operate">
              <span @click="importBtn">
                <img src="img/import.png" alt="">
                {{$t('key.import')}}
              </span>
            </div>
          </div>
          <el-table :data="meterTableData" border="" style="width: 100%" height="55vh" v-loading="load2" :header-cell-style="{background:'#F2F2F2',color:'rgb(51,51,51)'}">
            <el-table-column :label="$t('key.no')" width="50">
              <template
                slot-scope="scope"
              >{{ meterParams.size * (meterParams.current - 1) + scope.$index + 1 }}</template>
            </el-table-column>
            <el-table-column prop="premiseNo" :label="$t('archives.premiseNo')" width="100"></el-table-column>
            <el-table-column prop="mfrSn" :label="$t('archives.mfrSn')" width="100"></el-table-column>
            <el-table-column prop="equipNo" :label="$t('archives.equipNo')"></el-table-column>
            <el-table-column prop="gpsLatitude" :label="$t('archives.latitude')"></el-table-column>
            <el-table-column prop="gpsLongitude" :label="$t('archives.longitude')"></el-table-column>
            <el-table-column prop="instBreakerCap" :label="$t('archives.instBreakerCap')" width="140"></el-table-column>
            <el-table-column prop="disConnStatus" :label="$t('archives.disConnStatus')" width="120"></el-table-column>
            <el-table-column prop="reqNo" :label="$t('archives.reqNo')"></el-table-column>
            <el-table-column prop="replDate" :label="$t('archives.replDate')"></el-table-column>
            <el-table-column prop="instMeterNo" :label="$t('archives.instMeterNo')" width="120"></el-table-column>
            <el-table-column prop="instMeterType" :label="$t('archives.instMeterType')" width="140"></el-table-column>
            <el-table-column prop="instMfrCode" :label="$t('archives.instMfrCode')" width="170"></el-table-column>
            <el-table-column prop="instMetModel" :label="$t('archives.instMetModel')" width="150"></el-table-column>
            <el-table-column prop="instMultiFactor" :label="$t('archives.instMultiFactor')" width="140"></el-table-column>
            <el-table-column prop="multiFactor" :label="$t('archives.multiFactor')" width="120"></el-table-column>
            <el-table-column prop="workerId" :label="$t('archives.workerId')"></el-table-column>
            <el-table-column prop="firstTime" :label="$t('archives.firstTime')" width="150"></el-table-column>
            <el-table-column prop="updateTime" :label="$t('archives.updateTime')" width="150"></el-table-column>
          </el-table>
          <pagination
            class="pageCom"
            :total="meterTotal"
            :page.sync="meterParams.current"
            :limit.sync="meterParams.size"
            @pagination="getMeter"
          />
        </div>
      </el-tab-pane>
    </el-tabs>

    <el-dialog
      :title="$t('key.import')"
      :visible.sync="dialogShow"
      width="40%"
      @open="dialogClose"
    >
      <!-- 导入 -->
      <div class="upload" v-if="step === 1">
        <el-upload
          action="#"
          accept=".xlsx,.xls,.txt"
          :limit="1"
          :on-exceed="onExceed"
          :on-remove="onRemove"
          :http-request="uploadFile"
          :key="uploadKey"
          ref="upload"
        >
          <el-button size="small" type="primary">Upload</el-button>
          <div slot="tip" class="el-upload__tip">Please select an import file (xls, xlsx, txt format)</div>
        </el-upload>
      </div>
      <!-- 进度 -->
      <div class="progress" v-else>
        <h3 v-if="importing === 1">{{$t('key.importing') + timeStr}}</h3>
        <h3 v-else-if="importing === 2">{{$t('key.importSuccess')}}</h3>
        <h3 v-else-if="importing === 0">{{$t('key.importFail')}}</h3>
        <el-progress :percentage="percentage" :color="progressColor"></el-progress>
        <span v-if="errorMessage" style="color:#c00">{{errorMessage}}</span>
      </div>
      <!-- 导入按钮 -->
      <span slot="footer" class="dialog-footer" v-if="step === 1">
        <el-button size="small" @click="dialogShow = false">{{$t('global.cancel')}}</el-button>
        <el-button
          type="primary"
          size="small"
          @click="importFile"
          :disabled="files.length === 0"
        >{{$t('key.import')}}</el-button>
      </span>
      <!-- 确定按钮 -->
      <span slot="footer" class="dialog-footer" v-else>
        <el-button type="primary" size="small" @click="dialogShow = false">{{$t('global.yes')}}</el-button>
      </span>
    </el-dialog>
  </basic-container>
</template>
<script>
import { wfmsDCUPage, wfmsMeterPage } from "@/api/archives"
import Pagination from "@/components/Pagination"
import axios from "axios"
export default {
  components: { Pagination },
  data() {
    return {
      active: 'dcu',
      dcuTableData: [],
      meterTableData: [],
      dialogShow: false,
      // 已上传文件列表
      files: [],
      step: 1,
      // 上传组件的key
      uploadKey: 0,
      // 进度条
      percentage: 0,
      dcuParams: {
        collectionNo: '',
        size: 20,
        current: 1,
        descs: 'FIRST_TIME'
      },
      dcuTotal: 0,
      meterParams: {
        premiseNo: '',
        size: 20,
        current: 1
      },
      meterTotal: 0,
      load1: false,
      load2: false,
      // 导入计时
      time: 0,
      // 导入状态 0失败 1正在 2成功
      importing: 1,
      // 导入记时器
      timeInterval: '',
      errorMessage: '',
      progressColor: this.colorName,
      tableHeight: window.innerHeight - 480
    }
  },
  methods: {
    getDCU() {
      this.load1 = true
      wfmsDCUPage(this.dcuParams).then(res => {
        if (res.data.success) {
          this.dcuTableData = res.data.data.records
          this.dcuTotal = res.data.data.total
        } else {
          this.$message({
            message: this.$t("global.searchFail"),
            type: "error"
          })
        }
        this.load1 = false
      }).catch(() => {
        this.load1 = false
      })
    },
    getMeter() {
      this.load2 = true
      wfmsMeterPage(this.meterParams).then(res => {
        if (res.data.success) {
          this.meterTableData = res.data.data.records
          this.meterTotal = res.data.data.total
        } else {
          this.$message({
            message: this.$t("global.searchFail"),
            type: "error"
          })
        }
        this.load2 = false
      }).catch(() => {
        this.load2 = false
      })
    },
    importBtn() {
      this.dialogShow = true
      //更新upload组件
      ++this.uploadKey
    },
    // 关闭模态框后的回调
    dialogClose() {
      // 模态框步骤改回第一步
      this.step = 1
      // 清空文件列表
      this.files = []
      // 进度条归零
      this.percentage = 0
      // 计时清零
      this.time = 0
      // 清除导入计时器
      clearInterval(this.timeInterval)
      // 重置导入计时器
      this.timeInterval = ""
      // 导入状态改为正在导入
      this.importing = 1
      // 清空错误信息
      this.errorMessage = ""
      this.progressColor = this.colorName
    },
    // 自定义上传
    uploadFile(data) {
      let acceptArr = ['xls', 'xlsx', 'txt']
      let format = data.file.name.split('.').pop()
      if (!acceptArr.includes(format)) {
        this.$refs.upload.clearFiles()
        this.$message({
            message: this.$t('key.wrongInput'),
            type: 'error'
        })
        return
      }
      if (data.file.size > 10485760) {
        this.$refs.upload.clearFiles()
        this.$message({
            message: this.$t('key.size'),
            type: 'error'
        })
        return
      }
      this.files.push(data.file)
    },
    // 导入进度
    importProgress() {
      let interval = setInterval(() => {
        this.percentage += 10
        if (this.percentage >= 100) {
          this.percentage = 100
          // 停止进度
          clearInterval(interval)
          // 清除导入计时器
          clearInterval(this.timeInterval)
          // 重置导入计时器
          this.timeInterval = ""
          // 计时清零
          this.time = 0
          // 导入状态改为成功
          this.importing = 2
          this.$message({
            message: this.$t("global.operatorSuccess"),
            type: "success"
          })
          if (this.active === 'dcu') {
            this.getDCU()
          } else {
            this.getMeter()
          }
        }
      }, 100)
    },
    // 模态框导入按钮
    importFile() {
      // 步骤改为第二部
      this.step = 2
      // 导入状态改为正在导入
      this.importing = 1
      // 导入计时
      this.timeInterval = setInterval(() => {
        this.time += 1000
      }, 1000)
      let obj = new FormData()
      obj.append("multipartFile", this.files[0])
      axios({
        method: "post",
        url: "/api/ami-devices/wfms" + this.active + "/uploadExcel",
        data: obj,
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        timeout: 240000
      })
        .then(res => {
          if (res.data.success) {
            // 开始进度
            this.importProgress()
          }
        })
        .catch(err => {
            // 清除导入计时器
            clearInterval(this.timeInterval)
            // 重置导入计时器
            this.timeInterval = ""
            // 计时清零
            this.time = 0
            // 错误信息
            this.errorMessage = err.msg || err.message
            // 进度条结束
            this.progressColor = "#c00"
            this.percentage = 100
            // 导入状态改为失败
            this.importing = 0
        })
    },
    onExceed() {
      this.$message({
        type: "error",
        message: this.$t("key.onlyOne")
      })
    },
    onRemove(files) {
      this.files = []
      // 步骤改回第一步
      this.step = 1
    },
    searchVal1 (val) {
      this.dcuParams.current = 1
    },
    searchVal2 (val) {
      this.meterParams.current = 1
    }
  },
  mounted() {
    // this.getDCU()
    // this.getMeter()
  },
  computed: {
    timeStr() {
      return (
        "(" +
        (new Date(this.time).getMinutes() + "").padStart(2, "0") +
        ":" +
        (new Date(this.time).getSeconds() + "").padStart(2, "0") +
        ")..."
      )
    }
  }
}
</script>
<style lang='scss' scoped>
.filter-box {
  padding-bottom: 10px;
  .manufacture {
    display: inline-block;
    margin-right: 20px;
    line-height: 100%;
    span {
      margin-right: 10px;
    }
  }
  & > .el-input {
    display: inline-block;
    width: 150px;
    margin-right: 10px;
  }
}
.archives-info {
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
  .pageCom {
    margin-top: -1px;
  }
}
.el-tabs {
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