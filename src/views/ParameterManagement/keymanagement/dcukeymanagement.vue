<template>
  <basic-container>
    <div class="filter-box">
        <span>{{$t('remote.deviceName')}}</span>
        <el-input v-model="keyParams.terminalAddr" style="width:150px"></el-input>
        <span style="margin-left:20px">{{$t('key.manufacture')}}</span>
        <el-select v-model="keyParams.factoryCode" placeholder="" size="small">
          <el-option :label="$t('global.all')" :value="''"></el-option>
          <el-option :label="ele.typeName" :value="ele.typeCode" v-for="(ele, i) in factoryList" :key="i"></el-option>
        </el-select>
        <el-button type="primary" @click="getKey" size="small" style="margin-left:10px">{{$t('global.search')}}</el-button>
    </div>
    <div class="key-information">
      <div class="head">
        {{$t('key.dcuKeyInfo')}}
        <div class="operate">
          <span @click="del">
            <img src="img/Delete.png" alt />
            {{$t('global.delete')}}
          </span>
          <span @click="importKey">
            <img src="img/import.png" alt="">
            {{$t('key.import')}}
          </span>
        </div>
      </div>
      <el-table
        :data="tableData"
        border
        style="width: 100%"
        height="60vh"
        @selection-change="select"
        :header-cell-style="{background:'#F2F2F2',color:'rgb(51,51,51)'}">
        <el-table-column type="selection"></el-table-column>
        <el-table-column :label="$t('key.no')" width="50">
          <template slot-scope="scope">{{ keyParams.size * (keyParams.current - 1) + scope.$index + 1 }}</template>
        </el-table-column>
        <el-table-column
          prop="terminalAddr"
          :label="$t('key.deviceName')"
          width="130">
        </el-table-column>
        <!-- <el-table-column
          prop="encFlag"
          :label="$t('key.securityMode')">
        </el-table-column> -->
        <el-table-column
          prop="securityPolicy"
          :label="$t('key.securityPolicy')">
        </el-table-column>
        <el-table-column
          prop="authenMechanismId"
          :label="$t('key.AuthMechnism')"
          width="120">
        </el-table-column>
        <el-table-column
          prop="securitySuite"
          :label="$t('key.securitySuite')">
        </el-table-column>
        <el-table-column
          prop="commPassword"
          label="LSK">
        </el-table-column>
        <el-table-column
          prop="ak"
          label="AK">
        </el-table-column>
        <el-table-column
          prop="ekU"
          label="EK">
        </el-table-column>
        <el-table-column
          prop="ekB"
          label="BK">
        </el-table-column>
        <el-table-column
          prop="mk"
          label="MK">
        </el-table-column>
        <el-table-column
          prop="factoryCode"
          :label="$t('key.factoryCode')"
          :formatter="factoryFormat">
        </el-table-column>
      </el-table>
      <pagination
        class="pageCom"
        :total="total"
        :page.sync="keyParams.current"
        :limit.sync="keyParams.size"
        @pagination="getKey" />

      <el-dialog :title="$t('key.import')" :visible.sync="dialogShow" width="40%" @open="dialogClose">
        <!-- 导入 -->
        <div class="upload" v-if="step === 1">
          <el-upload
            action="#"
            accept=".xlsx,.xls"
            :limit="1"
            :on-exceed="onExceed"
            :on-remove="onRemove"
            :http-request="uploadFile"
            :key="uploadKey"
            ref="upload">
            <el-button size="small" type="primary">Upload</el-button>
            <div slot="tip" class="el-upload__tip">Please select an import file (xls format)</div>
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
          <el-button type="primary" size="small" @click="importFile" :disabled="files.length === 0">{{$t('key.import')}}</el-button>
        </span>

        <!-- 确定按钮 -->
        <span slot="footer" class="dialog-footer" v-else>
          <el-button type="primary" size="small" @click="dialogShow = false">{{$t('global.yes')}}</el-button>
        </span>
      </el-dialog>
    </div>
  </basic-container>
</template>
<script>
import {mapGetters} from 'vuex'
import { getViewList } from '@/api/autoRegister'
import {queryMeterKey, queryTerminalKey, delTmnlKey} from '@/api/keyManagement'
import Pagination from "@/components/Pagination"
import axios from 'axios'
export default {
  components: { Pagination },
  data () {
    return {
      tableData: [],
      dialogShow: false,
      // 已上传文件列表
      files: [],
      step: 1,
      // 上传组件的key
      uploadKey: 0,
      // 进度条
      percentage: 0,
      keyParams: {
        factoryCode: '',
        size: 20,
        current: 1,
        terminalAddr: ''
      },
      total: 0,
      load: false,
      // 导入计时
      time: 0,
      // 导入状态 0失败 1正在 2成功
      importing: 1,
      tableHeight:window.innerHeight - 420,
      // 导入记时器
      timeInterval: '',
      errorMessage: '',
      progressColor: this.colorName,
      factoryList: [],
      selectKeys: []
    };
  },
  watch: {
    files (val) {
      // console.log(val, 'files监视器')
    }
  },
  methods:{
    select (val) {
      this.selectKeys = val
    },
    getKey () {
      // let params = '?'
      // Object.keys(this.keyParams).forEach(ele => {
      //    let p = ele + '=' + this.keyParams[ele] + '&'
      //    params += p
      // })
      // params = params.slice(0, params.length - 1)
      // console.log(params, 'params')

      this.load = true
      queryTerminalKey({
        factoryCode: this.keyParams.factoryCode ? (this.keyParams.factoryCode + '').padStart(2, '0') : this.keyParams.factoryCode,
        current: this.keyParams.current,
        size: this.keyParams.size,
        terminalAddr: this.keyParams.terminalAddr,
      }).then(res => {
        if (res.data.success) {
          this.tableData = res.data.data.records
          this.total = res.data.data.total
        } else {
          this.$message({
            message: this.$t('global.searchFail'),
            type: "error"
          })
        }
        this.load = false
      })
    },
    importKey () {
      this.dialogShow = true
    },
    // 关闭模态框后的回调
    dialogClose () {
      // 模态框步骤改回第一步
      this.step = 1
      // 清空文件列表
      this.files = []
      //更新upload组件
      ++this.uploadKey
      // 进度条归零
      this.percentage = 0
      // 清除导入计时器
      clearInterval(this.timeInterval)
      // 重置导入计时器
      this.timeInterval = ''
      // 计时清零
      this.time = 0
      // 导入状态改为正在导入
      this.importing = 1
      // 清空错误信息
      this.errorMessage = ''
      this.progressColor = this.colorName
    },
    // 自定义上传
    uploadFile (data) {
      let acceptArr = ['xls', 'xlsx']
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
      // console.log(this.files, 'files')
    },
    // 导入进度
    importProgress () {
      let interval = setInterval(() => {
        this.percentage += 10
        if (this.percentage >= 100) {
          this.percentage = 100
          // 停止进度
          clearInterval(interval)
          // 清除导入计时器
          clearInterval(this.timeInterval)
          // 重置导入计时器
          this.timeInterval = ''
          // 计时清零
          this.time = 0
          // 导入状态改为成功
          this.importing = 2
          this.$message({
              message: this.$t('global.operatorSuccess'),
              type: 'success'
          })
          this.getKey()
        }
      }, 100)
    },
    // 模态框导入按钮
    importFile () {
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
      // uploadExcel(obj).then(res => {
      //   console.log(res, '导入excel')
      // })
      axios({
        method: 'post',
        url: '/api/ami-system/tmnlcipherpara/uploadExcel',
        // url: '/api/ami-devices/sapmeter/uploadExcel',
        // url: '/api/ami-devices/wfmsdcu/uploadExcel',
        // url: '/api/ami-devices/wfmsmeter/uploadExcel',
        data: obj,
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
      })
      .then(res => {
        console.log(res, '导入excel')
        if (res.data.success) {
          // 开始进度
          this.importProgress()
        }
      })
      .catch(err => {
        console.log(err, 'error')
        // 清除导入计时器
        clearInterval(this.timeInterval)
        // 重置导入计时器
        this.timeInterval = ''
        // 计时清零
        this.time = 0
        // 错误信息
        this.errorMessage = err.msg
        // 进度条结束
        this.progressColor = '#c00'
        this.percentage = 100
        // 导入状态改为失败
        this.importing = 0
      })
    },
    onExceed () {
      this.$message({
        type: 'error',
        message: this.$t('key.onlyOne')
      })
    },
    onRemove (files) {
      console.log(files, 'remove')
      this.files = []
      // 步骤改回第一步
      this.step = 1
    },
    factoryFormat (row) {
      let obj = this.factoryList.find(ele => Number(ele.typeCode) === Number(row.factoryCode))
      if (obj) {
        return obj.typeName
      } else {
        return row.factoryCode
      }
    },
    getView() {
      getViewList({
        viewType: "TMNLFactoryType"
      }).then(res => {
        this.factoryList = res.data.data.list
      })
    },
    del () {
      if (this.selectKeys.length === 0) {
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
        let str = ''
        this.selectKeys.forEach(ele => {
          str += ('&tmnlAssetNos=' + ele.tmnlAssetNo)
        })
        str = str.substr(1, str.length - 1)
        delTmnlKey(str).then(res => {
          if (res.data.success) {
            this.$message({
              message: this.$t('global.deleteSuccess'),
              type: "success"
            })
            this.getKey()
          } else {
            this.$message({
              message: this.$t('global.operaError'),
              type: "error"
            })
          }
        })
      })
    }
  },
  mounted () {
    // this.getKey()
    this.getView()
  },
  computed: {
    timeStr () {
      return '(' +  (new Date(this.time).getMinutes() + '').padStart(2, '0') + ':' + (new Date(this.time).getSeconds() + '').padStart(2, '0') + ')...'
    },
    ...mapGetters(["colorName"])
  }
}
</script>
<style lang='scss' scoped>
  .filter-box {
    padding-bottom: 10px;
    span {
      margin-right: 10px;
    }
  }
  .key-information {
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
        }
      }
      .pageCom {
        margin-top: -1px;
      }
  }
</style>