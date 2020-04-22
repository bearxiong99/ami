<template>
  <basic-container>
    <!-- 查询栏 -->
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item :label="formLabel.objectName">
        <el-input :maxlength="30" v-model="formInline.objectName" :placeholder="formLabel.objectName" readonly></el-input>
      </el-form-item>
      <el-form-item :label="formLabel.calender">
        <el-date-picker
          v-model="formInline.date"
          type="date"
          :format="format">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit" icon="el-icon-search">{{formLabel.search}}</el-button>
      </el-form-item>
    </el-form>

    <div>
      <!--导出按钮-->
      <export-btn :style="{float: 'left', marginBottom:'5px'}" :exportData="exportData" @getExportData="getExportData"/>
      <!-- 下方表格 -->
      <el-table
        :data="tableData"
        v-loading="listLoading"
        style="width: 100%"
        border
        fit
        :height="tableHeight"
        highlight-current-row
        stripe
        size="medium"
      >
        <el-table-column
          fixed
          type="index"
          align="center"
          width="70"
          :label="rowLabel.index">
          <template slot-scope="scope">
            <span v-text="getIndex(scope.$index)"> </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="terminalAddr"
          fixed
          :label="rowLabel.terminalAddr"
          minWidth="115"
          align="center"
          :show-overflow-tooltip="true"
        >
        </el-table-column>
        <el-table-column
          prop="tmnlCode"
          fixed
          :label="rowLabel.tmnlCode"
          minWidth="115"
          align="center"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            <span>{{scope.row.tmnlCode === "1" ? up : down}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="commTime"
          :label="rowLabel.commTime"
          minWidth="115"
          align="center"
          :show-overflow-tooltip="true"
        >
        </el-table-column>
        <el-table-column
          prop="message"
          :label="rowLabel.message"
          minWidth="115"
          align="center"
          :show-overflow-tooltip="false"
        >
          <template slot-scope="scope">
            <span class="message-style" @click="messageShow(scope.row.message)">{{scope.row.message}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="fromAddr"
          :label="rowLabel.fromAddr"
          minWidth="115"
          align="center"
          :show-overflow-tooltip="true"
        >
        </el-table-column>
        <el-table-column
          prop="toAddr"
          :label="rowLabel.toAddr"
          minWidth="115"
          align="center"
          :show-overflow-tooltip="true"
        >
        </el-table-column>
        <el-table-column
          prop="sn"
          :label="rowLabel.sn"
          minWidth="115"
          align="center"
          :show-overflow-tooltip="true"
          v-if="snShow"
        >
        </el-table-column>
      </el-table>
      <pagination v-show="total>=0" :total="total" :page.sync="query.page" :limit.sync="query.limit" @pagination="getList" style="margin-top: 5px" />
      <el-dialog
        :title="rowLabel.message"
        :visible.sync="dialogVisible"
        width="30%"
        :before-close="handleClose">
        <el-input
          type="textarea"
          :rows="5"
          placeholder="请输入内容"
          v-model="textarea"
        >
        </el-input>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="dialogVisible = false">{{this.$t('global.confirm')}}</el-button>
        </span>
      </el-dialog>
    </div>
  </basic-container>
</template>

<script>
import ExportBtn from "@/components/export-btn/export-btn";
import Pagination from '@/components/Pagination'
import { queryDetail } from '@/api/dataQuery/messageQuery'
export default {
  name: "messagequery",
  components: {
    ExportBtn,
    Pagination
  },
  data() {
    const date = new Date();
    return {
      formInline: {
        objectNo: '',
        objectName: '',
        objectType: '',
        date:new Date(date.getFullYear(), date.getMonth(), date.getDate())
      },
      formLabel:{
        objectName:this.$t('messageQuery.objectName'),
        calender:this.$t('payset.calender'),
        to:this.$t('messageQuery.to'),
        startDate:this.$t('global.startDate'),
        endDate:this.$t('global.endDate'),
        search:this.$t('auto.search'),
        exportDialog:this.$t('messageQuery.export')
      },
      format: "yyyy-MM-dd",
      // 导出按钮弹出框
      dialogVisible: false,
      exportData: {},
      // 表格
      listLoading: false,
      filterData: [],
      tableHeight:window.innerHeight - 360,
      total: 0,
      tableData: [],
      rowLabel: {
        index: this.$t('messageQuery.no'),
        terminalAddr: this.$t('messageQuery.terminalAddr'),
        tmnlCode: this.$t('messageQuery.tmnlCode'),
        fromAddr: this.$t('messageQuery.fromAddr'),
        toAddr: this.$t('messageQuery.toAddr'),
        commTime: this.$t('messageQuery.commTime'),
        message: this.$t('messageQuery.message'),
        sn: this.$t('messageQuery.sn'),
      },
      query:{
        page: 1,
        limit: 20
      },
      params: {},
      snShow: false,
      up: this.$t('messageQuery.up'),
      down: this.$t('messageQuery.down'),
      textarea: ""
    }
  },
  computed: {},
  created() {
    this.getList();
  },
  methods: {
    onSubmit() {
      if (this.formInline.objectType === "NB Meter" || this.formInline.objectType === "4G Meter" || this.formInline.objectType === "DCU") {
        this.listLoading = true;
        this.getList();
      }else {
        this.$alert(this.$t('messageQuery.error'), this.$t('messageQuery.tip'), {
          confirmButtonText: this.$t('global.confirm')
        });
      }
    },
    getParams() {
      let date = this.formInline.date;
      date = date.getFullYear() + "-" + this.isAddZero(date.getMonth() + 1)
        + "-" + this.isAddZero(date.getDate());
      this.params = {
        objectNo: this.formInline.objectNo,
        dateTime: date,
        page: this.query.page,
        limit: this.query.limit,
      };
    },
    getList() {
      this.getParams();
      queryDetail(this.params).then(res => {
        if(res.data.data.totalCount !== 0) {
          this.tableData = res.data.data.list;
          this.total = res.data.data.totalCount;
        }else{
          this.tableData = null;
          this.total = 0;
        }
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000);
      }).catch((error) => {
        console.log(error)
      })
    },
    getIndex($index) {
      //表格序号
      return (this.query.page - 1) * this.query.limit + $index + 1
    },
    isAddZero(time){
      if(time < 10){
        return "0" + time;
      }else {
        return time;
      }
    },
    getExportData() {
      let columns = {...this.rowLabel};
      delete columns["index"];
      this.getParams();
      this.exportData = {
        url: "/api/ami-dataquery/messageQuery/queryDetail",
        params: this.params,
        columns: columns,
        fileName: "messageQuery-" + this.formInline.objectType + "-" + this.formInline.objectName + "-"
        + this.params.date, // messageQuery- + 对象类型- +对象名称- + 日期命名
        sheetName: this.$t('messageQuery.sheetName'),
      };
    },
    handleClose() {
      this.dialogVisible = false;
    },
    messageShow(val) {
      this.dialogVisible = true;
      this.textarea = val;
    }
  },
  mounted() {
  },
  watch: {
    '$store.state.common.treeNode': function (data) {
      this.tableData = [];
      this.total = 0;
      this.formInline.objectName = data.deviceName;
      if(data.deviceType === 'org') {
        this.formInline.objectType = "mru";
      }else if(data.deviceType === 'meter'){
        this.formInline.objectType = "Meter";
      }else{
        if(data.deviceModel === "NBonline" || data.deviceModel === "NBoffline") {
          this.formInline.objectType = "NB Meter";
        }else if (data.deviceModel === "fourGonline" || data.deviceModel === "fourGoffline") {
          this.formInline.objectType = "4G Meter";
        }else {
          this.formInline.objectType = "DCU";
        }
      }
      this.formInline.objectNo = data.deviceNo;
    }
  }
}
</script>

<style scoped>
  .message-style {
    white-space:nowrap;
    overflow: hidden;
    color: #2d8cf0;
    cursor: pointer;
  }
  .message-style:hover {
    color: #0d3af0;
  }
</style>
