<template>
  <basic-container>
    <div class="filter-box">
      <div class="manufacture">
        <!-- <span>{{$t('key.manufacture')}}</span>
        <el-select v-model="sapParams.factoryCode" placeholder="" size="small" @change="factoryChange">
          <el-option :label="$t('global.all')" :value="''"></el-option>
          <el-option :label="$t('meterbtn.sanxing')" :value="'01'"></el-option>
          <el-option :label="$t('meterbtn.huali')" :value="'02'"></el-option>
          <el-option :label="$t('meterbtn.kaifa')" :value="'03'"></el-option>
          <el-option :label="$t('meterbtn.linyang')" :value="'04'"></el-option>
        </el-select> -->
        <span>{{$t('archives.premiseNo')}}</span>
        <el-input :maxlength="30" v-model="sapParams.premiseNo" style="width:150px;margin-right:10px" @change="searchVal"></el-input>
        <span>{{$t('archives.mruNo')}}</span>
        <el-input :maxlength="30" v-model="sapParams.mruNo" style="width:150px;margin-right:10px" @change="searchVal"></el-input>
        <span>{{$t('archives.officeNo')}}</span>
        <el-input :maxlength="30" v-model="sapParams.officeNo" style="width:150px;margin-right:10px" @change="searchVal"></el-input>
        <span>{{$t('archives.officeName')}}</span>
        <el-input :maxlength="30" v-model="sapParams.officeName" style="width:150px;margin-right:10px" @change="searchVal"></el-input>
        <el-button type="primary" @click="getSap">{{$t('global.search')}}</el-button>
      </div>
    </div>
    <div class="key-information">
      <div class="head">
        {{$t('global.sap')}}
        <div class="operate">
          <span @click="importBtn">
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
        v-loading="loading"
        :header-cell-style="{background:'#F2F2F2',color:'rgb(51,51,51)'}">
        <el-table-column :label="$t('key.no')" width="50">
          <template slot-scope="scope">{{ sapParams.size * (sapParams.current - 1) + scope.$index + 1 }}</template>
        </el-table-column>
        <el-table-column
          prop="premiseNo"
          :label="$t('archives.premiseNo')">
        </el-table-column>
        <el-table-column
          prop="mruNo"
          :label="$t('archives.mruNo')">
        </el-table-column>
        <el-table-column
          prop="officeNo"
          :label="$t('archives.officeNo')">
        </el-table-column>
        <el-table-column
          prop="officeName"
          :label="$t('archives.officeName')">
        </el-table-column>
        <el-table-column
          prop="ccneFlag"
          :label="$t('archives.ccneFlag')">
        </el-table-column>
        <el-table-column
          prop="serviceClass"
          :label="$t('archives.serviceClass')">
        </el-table-column>
        <el-table-column
          prop="gpsLatitude"
          :label="$t('archives.latitude')">
        </el-table-column>
        <el-table-column
          prop="gpsLongitude"
          :label="$t('archives.longitude')">
        </el-table-column>
        <el-table-column
          prop="connType"
          :label="$t('archives.connType')">
        </el-table-column>
      </el-table>
      <pagination
        class="pageCom"
        :total="total"
        :page.sync="sapParams.current"
        :limit.sync="sapParams.size"
        @pagination="getSap" />

      <el-dialog :title="$t('key.import')" :visible.sync="listShow" width="60%">
      <div class="head">
        File List
        <div class="operate">
          <span>
            <img src="img/Refresh.png" alt="">
            {{$t('auto.refresh')}}
          </span>
          <span @click="upload">
            <img src="img/New.png" alt="">
            {{$t('upgrade.upload')}}
          </span>
        </div>
      </div>
      <el-table
        :data="fileTable"
        border
        style="width: 100%"
        :header-cell-style="{background:'#F2F2F2',color:'rgb(51,51,51)'}">
        <el-table-column prop="uid" label="File ID">
        </el-table-column>
        <el-table-column prop="name" label="File Name">
        </el-table-column>
        <el-table-column label="Operation">
          <template slot-scope="scope">
            <div class="file-operate">
              <span>Import</span>
              <span>Delete</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="Update Time">
          <template slot-scope="scope">
            {{timeFormat(scope.row.lastModifiedDate)}}
          </template>
        </el-table-column>
        <el-table-column label="Is Auto">
        </el-table-column>
        <el-table-column width="60">
          <template slot-scope="scope">
            <div class="file-icon">
              <img :src="iconFormat(scope.row.status)" alt="">
            </div>
          </template>
        </el-table-column>
        <el-table-column label="Import Status">
          <template slot-scope="scope">
            <span :class="'status' + scope.row.status">
              {{statusFormat(scope.row.status)}}
            </span>
          </template>
        </el-table-column>
      </el-table>

        <span slot="footer" class="dialog-footer">
          <el-button type="primary" size="small" @click="listShow = false">{{$t('global.yes')}}</el-button>
        </span>
      </el-dialog>

      <el-dialog :title="$t('key.import')" :visible.sync="dialogShow" width="40%">
        <!-- 导入 -->
        <div class="upload" v-if="step === 1">
          <el-upload
            action="#"
            accept=".xlsx,.xls,txt"
            multiple
            :on-remove="onRemove"
            :on-change="onChange"
            :http-request="uploadFile"
            :key="uploadKey"
            ref="upload">
            <el-button size="small" type="primary">Upload</el-button>
            <div slot="tip" class="el-upload__tip">Please select an import file (xls, xlsx, txt format)</div>
          </el-upload>
          <p style="color:#0c0">{{successStr}}</p>
          <p style="color:#c00">{{failStr}}</p>
        </div>
        <!-- 确定按钮 -->
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" size="small" @click="confirmFiles" v-if="uploadFlag">{{$t('upgrade.upload')}}</el-button>
          <el-button type="primary" size="small" @click="dialogShow = false" v-else>{{$t('global.yes')}}</el-button>
        </span>
      </el-dialog>
    </div>
  </basic-container>
</template>
<script>
import {sapPage, getFileList} from '@/api/archives'
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
      sapParams: {
        premiseNo: '',
        mruNo: '',
        officeNo: '',
        officeName: '',
        size: 20,
        current: 1,
        descs: 'FIRST_TIME'
      },
      fileParams: {
        size: 20,
        current: 1
      },
      total: 0,
      // 导入计时
      time: 0,
      // 导入状态 0失败 1正在 2成功
      importing: 1,
      tableHeight:window.innerHeight - 420,
      // 导入记时器
      timeInterval: '',
      errorMessage: '',
      progressColor: this.colorName,
      loading: false,
      listShow: false,
      fileTable: [],
      successStr: '',
      failStr: '',
      uploadFlag: true,
    };
  },
  watch: {
    files (files) {
      console.log(files, 'files-watch')
    },
    fileTable (files) {
      console.log(files, 'table-watch')
    },
  },
  methods:{
    timeFormat(val) {
      if (!val) return ''
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
    getSap () {
      this.loading = true
      sapPage(this.sapParams).then(res => {
        if (res.data.success) {
          this.tableData = res.data.data.records
          this.total = res.data.data.total
        } else {
          this.$message({
            message: this.$t('global.searchFail'),
            type: "error"
          })
        }
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    importBtn () {
      this.listShow = true
    },
    upload () {
      this.dialogShow = true
      //更新upload组件
      ++this.uploadKey
      this.files = []
      this.uploadFlag = true
      this.successStr = ''
      this.failStr = ''
    },
    // 自定义上传
    uploadFile (data) {
      console.log(data, 'data')
      let acceptArr = ['xls', 'xlsx', 'txt']
      let format = data.file.name.split('.').pop()
      if (!acceptArr.includes(format)) {
        this.$message({
            message: this.$t('key.wrongInput'),
            type: 'error'
        })
        return
      }
      let bool = this.files.some(ele => ele.name === data.file.name)
      if (bool) {
        return
      }
      this.files.push(data.file)
    },
    onChange (file, fileList) {
      console.log(file, 'change')
      console.log(fileList, 'change-list')
    },
    onRemove (file) {
      console.log(file, 'del')
      // this.files = []
      let i = this.files.findIndex(ele => ele.uid === file.uid)
      this.files.splice(i, 1)
    },
    // 导入确定
    confirmFiles () {
      // for (let i = 0; i < this.files.length; i++) {
      //   let bool = this.fileTable.some(ele => ele.name === this.files[i].name)
      //   if (bool) {
      //     this.files.splice(i, 1)
      //     continue
      //   }
      //   this.$set(this.files[i], 'status', 0)
      //   this.fileTable.unshift(this.files[i])
      // }
      let files = this.files.sort((a, b) => Number(a.size) - Number(b.size))
      let successArr = []
      let errArr = []
      console.log(files, 'files')
      files.forEach((ele, i) => {
        let formData = new FormData()
        formData.append('multipartFile', ele)
        axios({
          method: "post",
          url: "/api/ami-devices/sapmeter/uploadFile",
          data: formData,
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        })
        .then(res => {
          successArr.push(ele.name)
          console.log(successArr, 'successArr')
          if (i >= files.length - 1) {
            if (successArr.length > 0) {
              this.successStr = successArr.join(' , ') + ' ' + this.$t('archives.uploadSuccess')
            }
            if (errArr.length > 0) {
              this.failStr = errArr.join(' , ') + ' ' + this.$t('archives.uploadErr')
            }
            this.uploadFlag = false
          }
        })
        .catch(err => {
          errArr.push(ele.name)
          if (i >= files.length - 1) {
            if (successArr.length > 0) {
              this.successStr = successArr.join(' , ') + ' ' + this.$t('archives.uploadSuccess')
            }
            if (errArr.length > 0) {
              this.failStr = errArr.join(' , ') + ' ' + this.$t('archives.uploadErr')
            }
            this.uploadFlag = false
          }
        })
      })
    },
    searchFile () {
      getFileList(this.fileParams).then(res => {
        console.log(res, 'filetable')
      })
    },
    statusFormat (val) {
      if (val === 0) {
        return 'File Initialization'
      } else if (val === 1) {
        return 'Importing'
      } else if (val === 2) {
        return 'Success'
      } else if (val === -1) {
        return 'Failure'
      }
    },
    iconFormat (val) {
      if (val === 0) {
        return 'img/initialization.png'
      } else if (val === 1) {
        return 'img/importing.png'
      } else if (val === 2) {
        return 'img/success.png'
      } else if (val === -1) {
        return 'img/failure.png'
      }
    },
    searchVal (val) {
      this.sapParams.current = 1
    },
  },
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
  .file-operate, .file-icon {
    display:flex;
    justify-content:space-around;
    span {
      color: #1890FF;
      cursor: pointer;
    }
  }
  .status0 {
    color: #666;
  }
  .status1 {
    color: #1890FF;
  }
  .status2 {
    color: #67C23A;
  }
  .status-1 {
    color: #F56C6C;
    text-decoration: underline;
    cursor: pointer;
  }
</style>