<template>
  <div>
    <el-dialog
      title="Choose export format"
      :visible.sync="dialogVisible"
      width="40%"
      :before-close="eventClose">
      <div class="box">
        <div class="item">
          <img src="img/CSV.png" alt="">
          <el-radio v-model="radio" label="1">csv</el-radio>
        </div>
        <div>
          <img src="img/xlsx.png" alt="">
          <el-radio v-model="radio" label="2">xlsx</el-radio>
        </div>
        <div>
          <img src="img/docx.png" alt="">
          <el-radio v-model="radio" label="3">csv</el-radio>
        </div>
        <div>
          <img src="img/pdf.png" alt="">
          <el-radio v-model="radio" label="4">pdf</el-radio>
        </div>
        <div>
          <img src="img/XML.png" alt="">
          <el-radio v-model="radio" label="5">xml</el-radio>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <!-- <el-button @click="eventClose">{{$t('global.cancel')}}</el-button>
        <el-button type="primary" @click="confim">{{$t('global.confirm')}}</el-button> -->
        <el-button @click="eventClose">{{$t('global.cancel')}}</el-button>
        <el-button type="primary" @click="exportCurrent">{{$t('global.exportcurrent')}}</el-button>
        <el-button type="primary" @click="exportAll">{{$t('global.exportall')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {exportAll, exportCurrent} from '@/api/system/exportTable'
export default {
  props: {
    exportData: {
      type: Object
    },
    dialogVisible:{
      type:Boolean
    }
  },
  components: {
    
  },
  data() {
    return {
      radio:'1'
    };
  },
  mounted() {

  },
  methods: {
    eventClose(){
      this.$emit('changeDialog', false);
    },
    confim(){
      this.$emit('exports',this.radio)
    },
    // 导出全部
    exportAll() {
      this.$emit('changeDialog', false);
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
      this.$emit('changeDialog', false);
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
};
</script>

<style scoped lang="scss">
.box{
  display: flex;
  justify-content: space-around;
  img{
    display: block;
    margin-bottom: 10px;
  }
}
</style>
