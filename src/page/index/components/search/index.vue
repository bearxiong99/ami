<template>
  <div>
    <el-form :model="form" label-position="left" label-width="130px">
      <el-form-item :label="$t('tree.org')">
        <el-input :maxlength="30" v-model="form.orgName" :placeholder="$t('tree.org')" disabled>
          <el-popover slot="append" width="300" trigger="manual" v-model="visible">
            <org
              style="height: 50vh; overflow-y: auto"
              :show-refresh-text="false"
              show-search
              @node-click="nodeClick"
            />
            <el-button slot="reference" icon="el-icon-search" @click="visible = !visible"></el-button>
          </el-popover>
        </el-input>
      </el-form-item>
      <el-form-item :label="$t('change.manufacturer')">
        <el-select v-model="form.factoryCode" style="width:100%">
          <el-option :label="$t('auto.all')" :value="-1"></el-option>
          <el-option
            v-for="item in factoryList"
            :key="item.value"
            :label="item.typeName"
            :value="item.typeCode"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('tree.searchType')">
        <el-select
          v-model="form.queryType"
          :placeholder="$t('tree.searchType')"
          @change="change"
          style="width:100%"
        >
          <el-option :label="$t('tree.dcu')" value="5"></el-option>
          <el-option label="NB Meter" value="11"></el-option>
          <el-option label="4G Meter" value="10"></el-option>
          <el-option label="Hybrid Meter" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="DCU/NB/4G Meter">
        <el-input :maxlength="30" v-model="form.tmnlAddr" placeholder="Logic Device Name"></el-input>
      </el-form-item>
      <el-form-item label="Hybrid Meter" v-if="form.queryType === '1'">
        <el-input :maxlength="30" v-model="form.serachValue2" placeholder="Meter Logic Device Name"></el-input>
      </el-form-item>
      <div style="text-align: right">
        <el-button
          :style="{color: colorName, 'border-color': colorName}"
          class="search"
          @click="query"
          icon="el-icon-search"
        >{{$t('tree.search')}}</el-button>
      </div>
    </el-form>

    <el-table
      :data="list"
      border
      style="width: 100%"
      :stripe="true"
      :header-cell-style="{background: '#f5f5f5'}"
      @row-click="click"
      :height="tableHeight"
      ref="table"
    >
      <el-table-column v-if="showSelection" type="selection" width="40"></el-table-column>
      <el-table-column prop="orgName" :label="$t('tree.org')"></el-table-column>
      <el-table-column prop="terminalAddr" :label="$t('tree.dcu')"></el-table-column>
      <el-table-column prop="deviceName" v-if="form.queryType === '1'" :label="$t('tree.meter')"></el-table-column>
    </el-table>

    <el-pagination
      small
      background
      @current-change="handleCurrentChange"
      :current-page="form.page"
      :page-size="form.limit"
      layout="prev, pager, next"
      :total="total"
    ></el-pagination>
  </div>
</template>

<script>
import Org from "../org";
import { queryDevice } from "@/api/system/tree";
import { getViewList } from "@/api/autoRegister";
import { mapGetters } from "vuex";
import { getDevice } from "@/api/autoRegister";
export default {
  name: "index",
  components: { Org },
  props: {
    showSelection: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters(["colorName"])
  },
  data() {
    return {
      form: {
        orgNo: "",
        orgName: "",
        queryType: "5",
        tmnlAddr: "",
        meterId: "",
        page: 1,
        limit: 20,
        factoryCode: -1
      },
      list: [],
      factoryList: [],
      total: 0,
      visible: false,
      tableHeight: 50
    };
  },
  mounted() {
    this.$nextTick(function() {
      this.tableHeight =
        window.innerHeight - 500;
      // 监听窗口大小变化
      let self = this;
      window.onresize = function() {
        self.tableHeight =
          window.innerHeight - 500;
      };
    });
    this.getView();
  },
  methods: {
    getView() {
      getViewList({
        viewType: "meterFactoryType"
      }).then(res => {
        this.factoryList = res.data.data.list;
      });
    },
    change() {
      this.list = [];
      this.total = 0;
      this.form.page = 1;
    },
    nodeClick(data) {
      this.form.orgNo = data.deviceNo;
      this.form.orgName = data.deviceName;
      this.visible = false;
    },
    query() {
      if (this.form.orgNo !== null && this.form.orgNo !== "") {
        let param = {};
        if (
          this.form.queryType === "5" ||
          this.form.queryType === "11" ||
          this.form.queryType === "10"
        ) {
          param = {
            isAllTmnal: 1, //查集中器是1 查电表是0
            orgNo: this.form.orgNo,
            pageNum: this.form.page,
            pageSize: this.form.limit,
            type: this.form.queryType,
            factoryCode: this.form.factoryCode,
            serachValue: this.form.tmnlAddr
          };
        } else {
          param = {
            isAllTmnal: 0, //查集中器是1 查电表是0
            orgNo: this.form.orgNo,
            pageNum: this.form.page,
            pageSize: this.form.limit,
            deviceType:0,
            factoryCode: this.form.factoryCode,
            serachValue2: this.form.tmnlAddr,
            serachValue: this.form.serachValue2
          };
        }
        getDevice(param).then(res => {
          if (res.data.data.total != 0) {
            this.list = res.data.data.list;
          } else {
            this.list = [];
          }
          this.total = res.data.data.total;
        });
      } else {
        this.$message({
          message: this.$t("tree.selectOrg"),
          type: "error"
        });
      }
    },
    handleCurrentChange(val) {
      this.form.page = val;
      this.query();
    },
    click(row, column, event) {
      // console.log(row, "row");
      this.$emit("row-click", row, column, event);
    }
  }
};
</script>

<style scoped>
.search {
  width: 100%;
  margin-bottom: 20px;
  border: 1px solid #fff;
  font-size: 16px;
}
.el-form-item {
  margin-bottom: 15px;
}
</style>
