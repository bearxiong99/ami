<template>
  <div class="export-btn">
    <el-button type="primary" @click="getExportData">{{exportDialog}}</el-button>
    <el-dialog
      :title="chooseExportFormat"
      :visible.sync="dialogVisible"
      width="37%"
      :before-close="handleClose">
      <div class="export-format">
        <ul>
          <li>
            <img src="./images/csv.svg"/><br/>
            <el-radio v-model="radio" label="1">csv</el-radio>
          </li>
          <li>
            <img src="./images/xlsx.svg"/><br/>
            <el-radio v-model="radio" label="2">xls</el-radio>
          </li>
          <li>
            <img src="./images/docx.svg"/><br/>
            <el-radio v-model="radio" label="3">docx</el-radio>
          </li>
          <li>
            <img src="./images/pdf.svg"/><br/>
            <el-radio v-model="radio" label="4">pdf</el-radio>
          </li>
          <li>
            <img src="./images/xml.svg"/><br/>
            <el-radio v-model="radio" label="5">xml</el-radio>
          </li>
        </ul>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">{{$t('global.cancel')}}</el-button>
        <el-button type="primary" @click="exportCurrent">{{$t('exportBtn.exportCurrent')}}</el-button>
        <el-button type="primary" @click="exportAll">{{$t('exportBtn.exportAll')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {exportAll, exportCurrent} from '@/api/system/exportTable'
  export default {
    name: "export-btn",
    props: {
      exportData: {
        type: Object
      },
    },

    data() {
      return {
        exportDialog: this.$t('exportBtn.export'),
        chooseExportFormat: this.$t('exportBtn.chooseExportFormat'),
        dialogVisible: false,
        radio: '1',
        data: {}
      }
    },
    methods: {
      getExportData() {
        this.dialogVisible = true;
        this.$emit("getExportData");
      },
      // 导出全部
      exportAll() {
        this.dialogVisible = false;
        this.getParams();
        exportAll(this.data).then(res => {
          let url = window.URL.createObjectURL(new Blob([res.data]));
          let link = document.createElement('a');
          link.style.display = 'none';
          link.href = url;
          link.download = res.fileName;
          document.body.appendChild(link);
          link.click();

          URL.revokeObjectURL(link.href);
          document.body.removeChild(link)
        })
      },
      // 导出当前页
      exportCurrent() {
        this.dialogVisible = false;
        this.getParams();
        exportCurrent(this.data).then(res => {
          let url = window.URL.createObjectURL(new Blob([res.data]));
          let link = document.createElement('a');
          link.style.display = 'none';
          link.href = url;
          link.download = res.fileName;
          document.body.appendChild(link);
          link.click();

          URL.revokeObjectURL(link.href);
          document.body.removeChild(link)
        })
      },
      // 取消
      cancel() {
        this.dialogVisible = false;
      },
      // ×
      handleClose() {
        this.dialogVisible = false;
      },
      getParams() {
        let columns = [];
        for (let key in this.exportData.columns) {
          columns.push({
            key: key,
            name: this.exportData.columns[key],
            rule: ""
          })
        }
        let protocol = location.protocol;
        let domain = window.location.host;
        this.data = {
          url: `${protocol}//${domain}` + this.exportData.url,
          params: this.exportData.params, // 查询表格的参数
          columns: columns, // 导出列(列的key，列的name，列的数据转换规则)
          fileType: this.radio, // 导出表格文件类型 1.csv 2.xls 3.doc 4.pdf 5.xml
          fileName: this.exportData.fileName, // 文件名
          sheetName: this.exportData.sheetName,// 导出excel的sheet名称/表格名称
        };
      }
    },
  }
</script>

<style>
  .export-format li {
    float: left;
    margin-right: 35px;
    text-align: center;
  }
  .export-format li img {
    width: 70px;
  }
  .export-btn .el-dialog__body {
    height: 110px;
    border: 1px solid #EBEEF5;
  }
</style>
