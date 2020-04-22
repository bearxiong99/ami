<template>
  <div>
    <basic-container>
      测试页

      <el-button @click="test(1)">下载CSV</el-button>
      <el-button @click="test(2)">下载XLS</el-button>
      <el-button @click="test(3)">下载DOC</el-button>
      <el-button @click="test(4)">下载PDF</el-button>
      <el-button @click="test(5)">下载XML</el-button>
    </basic-container>
  </div>
</template>

<script>
  import {exportAll} from '@/api/system/exportTable'

  export default {
    name: "wel",
    data() {
      return {};
    },
    computed: {},
    created() {
    },
    methods: {
      test(dd) {
        let protocol = location.protocol
        let domain = window.location.host;
        let data = {
          "url": `${protocol}//${domain}/api/ami-system/org/queryDevice`,
          "params": {
            "orgNo": "01",
            "orgName": "Saudi Arabia",
            "queryType": "tmnl"
          },
          "columns": [
            {
              "key": "deviceType",
              "name": "设备类型",
              "rule": ""
            }, {
              "key": "deviceNo",
              "name": "设备编号",
              "rule": ""
            }, {
              "key": "deviceName",
              "name": "设备名称",
              "rule": ""
            }, {
              "key": "isOnline",
              "name": "是否在线",
              "rule": ""
            }, {
              "key": "orgNo",
              "name": "供电区域编号",
              "rule": ""
            }, {
              "key": "orgName",
              "name": "供电区域名称",
              "rule": ""
            }, {
              "key": "tmnlAddr",
              "name": "终端地址",
              "rule": ""
            }
          ],
          "fileType": dd,
          "fileName": "测试",
          "sheetName": "表格名称"
        }

        exportAll(data).then(res => {
          console.log(res)

          let url = window.URL.createObjectURL(new Blob([res.data]))
          let link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          link.download = res.fileName
          document.body.appendChild(link)
          link.click()

          URL.revokeObjectURL(link.href)
          document.body.removeChild(link)
        })
      }
    }
  };
</script>

<style scoped="scoped" lang="scss">
</style>
