<template>
  <div class="emeter">
    <el-form
      :inline="true"
      :model="formMeterSearch"
      label-position="left"
    >
      <el-form-item :label="$t('remote.deviceName')" prop="disc">
        <el-input v-model="formMeterSearch.disc" size="small" :maxlength="100"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">{{$t('group.search')}}</el-button>
      </el-form-item>
    </el-form>
    <div class="uptop">
      <div>{{$t('tree.emeter')}}</div>
      <div class="right">
        <!-- <span @click="edit" style="cursor:pointer">
          <img src="img/edit.png" alt />
          {{$t('global.edit')}}
        </span>-->
        <!-- <span @click="add" style="cursor:pointer">
          <img src="img/New.png" alt />
          {{$t('global.add')}}
        </span>-->
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
    <!-- 表格组件 -->
    <meterTable :basicdata="basicdata" :loading="loading" :height="tableHeight" :pageNum='query' @selectMeter="selectFun"></meterTable>
    <pagination
      :total="total"
      :page.sync="query.page"
      :limit.sync="query.limit"
      @pagination="getData"
    />
    <!-- <div class="forms">
      <div class="btns" style="margin-top:20px;text-align:right;">
        <el-button type="primary" size="small" icon="el-icon-plus" @click="add">{{$t('global.add')}}</el-button>
        <el-button type="info" size="small" icon="el-icon-edit" @click="edit">{{$t('global.edit')}}</el-button>
        <el-button type="danger" size="small" icon="el-icon-delete" @click="dele">{{$t('global.delete')}}</el-button>
        <el-button size="small" icon="el-icon-upload2" @click="exportExcel">{{$t('global.export')}}</el-button>
      </div>
    </div>-->
  </div>
</template>

<script>
import { queryDevice, childMeters } from "@/api/system/tree";
import { mapGetters } from "vuex";
import { export_json_to_excel } from "@/util/Export2Excel";
import { getDevice,getViewList } from "@/api/autoRegister";
import { dcuOpt } from "@/api/archives";
import exportBtn from "@/components/exportjs";
import Pagination from "@/components/Pagination";
import meterTable from '@/components/meterTable'
export default {
  components: {Pagination,meterTable,exportBtn},
  data() {
    return {
      basicdata: [],
      query: {
        page: 1,
        limit: 20
      },
      total: 0,
      formMeter: {},
      formMeterSearch: {},
      selecMeterData: [],
      loading: false,
      tableHeight :window.innerHeight - 362,
      paramValue:{},
      exportData:{},
      dialogVisible:false,
      selectMeterData:[]
    };
  },
  computed: {
    ...mapGetters(["treeNode"])
  },
  watch: {
    treeNode: function(data) {
      this.getData();
    }
  },
  mounted() {
    this.getData();
    window.onresize = () => {
      this.tableHeight = window.innerHeight - 362;
    };
  },
  methods: {
    getData() {
      this.loading = true;
      this.paramValue={
        isAllTmnal: 0, //查集中器是1 查电表是0
        pageNum: this.query.page,
        pageSize: this.query.limit,
        terminalAddr: this.treeNode.deviceName,
        type: -1
      }
      getDevice(this.paramValue).then(res => {
        if(res.data.data.total!=0){
          this.basicdata = res.data.data.list;
          this.total=res.data.data.total;
        }else{
          this.basicdata = []
        }
        this.loading = false;
      });
    },
    // 查找设备
    search() {
      this.loading = true;
      this.paramValue={
        isAllTmnal: 0, //查集中器是1 查电表是0
        terminalAddr: this.treeNode.deviceName,
        pageNum: this.query.page,
        pageSize: this.query.limit,
        type: -1,
        serachValue: this.formMeterSearch.disc,
      }
      getDevice(this.paramValue).then(res => {
        if(res.data.data.total!=0){
          this.basicdata = res.data.data.list;
        }else{
          this.basicdata = []
        }
        this.loading = false;
      });
    },
    
    // 选择数据
    selectFun(val){
      this.selectMeterData = val;
    },
    dele() {
      if (this.selectMeterData.length != 0) {
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
              items: this.selectMeterData,
              optType: 3
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

    // 导出
    exportFun(){
      this.dialogVisible=true;
      let columns = {
        assetNo:this.$t('remote.deviceName'),
        commAddr1:this.$t('areaManage.commadd'),
        factoryCode:this.$t('change.manufacturer'),
        meterTypeCode:this.$t('auto.meterType'),
        commMode:this.$t('auto.commtype'),
        gpsLongitude:this.$t('areaManage.longitude'),
        gpsLatitude:this.$t('areaManage.latitude'),
      };
      this.exportData = {
        url: "/api/ami-dataquery/getDeviceList",
        params: this.paramValue,
        columns: columns,
        fileName: "Meter", // avgvolcur- + 对象类型- +对象名称命名
        sheetName: "Meter"
      };
    },
    changeDialog(val){
      this.dialogVisible = val;
    },
    // 格式化json
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    }
  }
};
</script>

<style scoped lang="scss">
.forms {
  padding: 20px;
  background: #fafafa;
  border: 1px solid #eeeeee;
}
.emeter {
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
