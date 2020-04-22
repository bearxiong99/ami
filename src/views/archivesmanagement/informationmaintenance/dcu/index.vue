<template>
  <div class="dcu">
    <el-form :inline="true" :model="formDCUSearch" label-position="left">
      <el-form-item :label="$t('areaManage.terminaltype')" prop="disc" style="margin-right:30px">
        <el-select v-model="formDCUSearch.type" size="small" style="width:100%">
          <el-option :label="$t('auto.all')" :value="-1"></el-option>
          <el-option
            v-for="item in viewList"
            :key="item.typeCode"
            :label="item.typeName"
            :value="item.typeCode">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('areaManage.commadd')" prop="code">
        <el-input v-model="formDCUSearch.disc" size="small" :maxlength="100"></el-input>
      </el-form-item>
      <el-form-item prop="dimension">
        <el-button type="primary" @click="search">{{$t('group.search')}}</el-button>
      </el-form-item>
    </el-form>
    <div class="uptop">
      <div>{{$t('upgrade.dcu')}}</div>
      <div class="right">
        <!-- <span @click="edit" style="cursor:pointer">
          <img src="img/edit.png" alt />
          {{$t('global.edit')}}
        </span> -->
        <!-- <span @click="add" style="cursor:pointer">
          <img src="img/New.png" alt />
          {{$t('global.add')}}
        </span>-->
        <span @click="reload" style="cursor:pointer">
          <img src="img/Refresh.png" alt />
          {{$t('global.reload')}}
        </span>
        <span @click="dele" style="cursor:pointer">
          <img src="img/stop.png" alt />
          {{$t('global.delete')}}
        </span>
        <span @click="exportFun" style="cursor:pointer">
          <img src="img/export.png" alt />
          {{$t('global.export')}}
        </span>
        <!-- 导出组件 -->
        <export-btn :dialogVisible="dialogVisible" :exportData="exportData"  @changeDialog="changeDialog" />
      </div>
    </div>
    <el-row style="position:relative;">
      <dcuTable :basicdata="basicdata" :loading="loading" :height="tableHeight" :pageNum='query' @selectDCU="selectFun"></dcuTable>
      <pagination
        :total="total"
        :page.sync="query.page"
        :limit.sync="query.limit"
        @pagination="getData"
      />
      
    </el-row>
  </div>
</template>

<script>
import { queryDevice, childs } from "@/api/system/tree";
import { mapGetters } from "vuex";
import { export_json_to_excel } from "@/util/Export2Excel";
import { getDevice,getViewList } from "@/api/autoRegister";
import { reloadArchives } from "@/api/clock";
import { dcuOpt } from "@/api/archives";
import dcuTable from '@/components/dcuTable'
import Pagination from "@/components/Pagination";
import exportBtn from "@/components/exportjs";
export default {
  components: { Pagination,dcuTable,exportBtn },
  data() {
    return {
      basicdata: [],
      query: {
        page: 1,
        limit: 20
      },
      total: 0,
      formDCU: {},
      formDCUSearch: {
        type:-1
      },
      selectDCUData: [],
      loading: false,
      viewList:[],
      factoryList:[],
      tableHeight:window.innerHeight - 362,
      dialogVisible:false,
      paramValue:{},
      exportData:{}
    };
  },
  computed: {
    ...mapGetters(['treeNode','level'])
  },
  watch: {
    treeNode: function() {
      this.getData();
      this.getView();
    }
  },
  mounted() {
    this.getData();
    this.getView();
    window.onresize = () => {
      this.tableHeight = window.innerHeight - 362;
    };
  },
  methods: {
    getData() {
      this.loading = true;
      this.paramValue={
        isAllTmnal: 1, //查集中器是1 查电表是0
        orgNo: this.treeNode.deviceNo,
        pageNum: this.query.page,
        pageSize: this.query.limit,
        type: this.formDCUSearch.type 
      }
      getDevice(this.paramValue).then(res => {
        if(res.data.data.total!=0){
          this.basicdata = res.data.data.list;
          this.total=res.data.data.total;
        }else{
          this.basicdata = [];
          this.total=res.data.data.total;
        }
        this.loading = false;
      });
    },
    search() {
      this.loading = true;
      this.paramValue={
        isAllTmnal: 1, //查集中器是1 查电表是0
        orgNo: this.treeNode.deviceNo,
        pageNum: this.query.page,
        pageSize: this.query.limit,
        serachValue: this.formDCUSearch.disc,
        type: this.formDCUSearch.type
      }
      getDevice(this.paramValue).then(res => {
        if(res.data.data.total!=0){
          this.basicdata = res.data.data.list;
          this.total=res.data.data.total;
        }else{
          this.basicdata = [];
          this.total=res.data.data.total;
        }
        this.loading = false;
      });
    },
    getView() {
      getViewList({
        viewType: "tmnlType"
      }).then(res => {
        this.viewList = res.data.data.list;
      });
    },
    // 选择数据
    selectFun(val){
      this.selectDCUData = val;
    },
    dele() {
      if (this.selectDCUData.length != 0) {
        this.$confirm(
          this.$t("areaManage.deleteTip"),
          this.$t("areaManage.reminder"),
          {
            confirmButtonText: this.$t("global.yes"),
            cancelButtonText: this.$t("global.cancel"),
            type: "warning"
          }
        )
          .then(() => {
            dcuOpt({
              items: this.selectDCUData,
              optType: 3,
              orgNo: this.treeNode.deviceNo,
            }).then(res => {
              if (res.data.data.result == 1) {
                this.$message({
                  message: this.$t("global.deleteSuccess"),
                  type: "success"
                });
                this.getData();
              } else {
                this.$message({
                  message: this.$t("global.operaError"),
                  type: "error"
                });
              }
            });
          })
          .catch(() => {});
      } else {
        this.$notify({
          title: this.$t("global.warn"),
          message: this.$t("global.warndele"),
          type: "warning"
        });
      }
    },
    edit() {
      if (this.selectDCUData.length != 0) {
        let arr = [];
        arr.push(this.formDCU);
        dcuOpt({
          items: arr,
          optType: 2,
          orgNo: this.treeNode.deviceNo
        }).then(res => {
          if (res.data.data.result == 1) {
            this.$message({
              message: this.$t("global.editSuccess"),
              type: "success"
            });
            this.getData();
          } else {
            this.$message({
              message: this.$t("global.operaError"),
              type: "error"
            });
          }
        });
      } else {
        this.$notify({
          title: this.$t("global.warn"),
          message: this.$t("global.warncont"),
          type: "warning"
        });
      }
    },
    // 重载
    reload(){
      if (this.selectDCUData.length != 0) {
        this.$confirm(
          this.$t("areaManage.confirmTip"),
          this.$t("areaManage.reminder"),
          {
            confirmButtonText: this.$t("global.yes"),
            cancelButtonText: this.$t("global.cancel"),
            type: "warning"
          }
      ).then(() => {
        let arr = [];
        this.selectDCUData.forEach(item=>{
          arr.push({
            optType:2,
            terminalAddr:item.terminalAddr
          })
        })
        reloadArchives(arr).then(res=>{
          if(res.data.data.returnStatus){
            this.$message({
              message: this.$t("global.operatorSuccess"),
              type: "success"
            });
          }else{
            this.$message({
              message: this.$t("global.operaError"),
              type: "success"
            });
          }
        })
        })
      }else {
        this.$notify({
          title: this.$t("global.warn"),
          message: this.$t("global.warncont"),
          type: "warning"
        });
      }

    },
    // 导出
    exportFun(){
      this.dialogVisible=true;
      let columns = {
        tmnlAssetNo:this.$t('areaManage.tmnlAssetNo'),
        factoryCode:this.$t('change.manufacturer'),
        terminalTypeCode:this.$t('areaManage.terminaltype'),
        runDate:this.$t('areaManage.runDate'),
        isOnline:this.$t('equivar.status'),
        gpsLongitude:this.$t('areaManage.longitude'),
        gpsLatitude:this.$t('areaManage.latitude'),
      };
      this.exportData = {
        url: "/api/ami-dataquery/getDeviceList",
        params: this.paramValue,
        columns: columns,
        fileName: "DCU", // avgvolcur- + 对象类型- +对象名称命名
        sheetName: "DCU"
      };
    },
    changeDialog(val){
      this.dialogVisible = val;
    },
    confirmExport(){

    },
    // 格式化json
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    },
    changelanguage(val) {
      return this.$t(val);
    },
  }
};
</script>

<style scoped lang="scss">
.forms {
  padding: 20px;
  background: #fafafa;
  border: 1px solid #eeeeee;
}
.circle {
  width: 20px;
  height: 20px;
  padding-top: 2px;
  background-color: #87d182;
  border-radius: 50%;
  box-sizing: border-box;
  &::after {
    content: "";
    display: block;
    width: 12px;
    height: 12px;
    margin: 0 auto;
    border: 2px solid #fff;
    border-radius: 50%;
  }
}
.dcu {
  h1 {
    height: 50px;
    line-height: 50px;
    border-bottom: 2px solid #eeeeee;
    margin-bottom: 20px;
    padding-left: 10px;
    font-size: 20px;
  }
  .uptop {
    display: flex;
    justify-content: space-between;
    padding: 10px;
    border: 1px solid #dddddd;
    background: #eeeeee;
    span {
      display: flex;
      align-items: center;
      border-left: 1px solid #dddddd;
      padding-right: 10px;
    }
    img {
      margin-right: 10px;
      margin-left: 20px;
    }
    .right {
      display: flex;
    }
  }
  .cityright {
    padding: 20px 50px 20px 20px;
    background: #fbfbfb;
    min-height: 60vh;
    border: 1px solid rgba(220, 223, 230, 1);
  }
  .page {
    width: 100%;
    height: 45px;
    padding-left: 10px;
    border: 1px solid #ddd;
    box-sizing: border-box;
  }
}
</style>
