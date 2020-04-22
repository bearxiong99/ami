<template>
  <basic-container>
    <el-tabs v-model="active" type="card">
      <el-tab-pane :label="$t('global.tmnlFactory')" name="tmnlFactory">
        <div class="uptop">
          <div>{{$t('global.tmnlFactoryList')}}</div>
        </div>
        <el-table
          :data="tmnlFactoryType"
          border
          :header-cell-style="{background:'#F2F2F2',color:'rgb(51,51,51)'}">
          <el-table-column :label="$t('key.no')">
              <template slot-scope="scope">{{ scope.$index + 1 }}</template>
          </el-table-column>
          <el-table-column :label="$t('global.tmnlFactory')" prop="typeName">
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane :label="$t('global.meterFactory')" name="meterFactory">
        <div class="uptop">
          <div>{{$t('global.meterFactoryList')}}</div>
        </div>
        <el-table
          :data="meterFactoryType"
          border
          :header-cell-style="{background:'#F2F2F2',color:'rgb(51,51,51)'}">
          <el-table-column :label="$t('key.no')">
              <template slot-scope="scope">{{ scope.$index + 1 }}</template>
          </el-table-column>
          <el-table-column :label="$t('global.meterFactory')" prop="typeName">
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane :label="$t('global.tmnlType')" name="tmnlType">
        <div class="uptop">
          <div>{{$t('global.tmnlTypeList')}}</div>
        </div>
        <el-table
          :data="tmnlTypeList"
          border
          :header-cell-style="{background:'#F2F2F2',color:'rgb(51,51,51)'}">
          <el-table-column :label="$t('key.no')">
              <template slot-scope="scope">{{ scope.$index + 1 }}</template>
          </el-table-column>
          <el-table-column :label="$t('global.tmnlType')" prop="typeName">
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane :label="$t('global.meterType')" name="meterType">
        <div class="uptop">
          <div>{{$t('global.meterTypeList')}}</div>
        </div>
        <el-table
          :data="meterTypeList"
          border
          :header-cell-style="{background:'#F2F2F2',color:'rgb(51,51,51)'}">
          <el-table-column :label="$t('key.no')">
              <template slot-scope="scope">{{ scope.$index + 1 }}</template>
          </el-table-column>
          <el-table-column :label="$t('global.meterType')" prop="typeName">
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </basic-container>
</template>

<script>
import { getViewList } from "@/api/autoRegister"
import Pagination from "@/components/Pagination"
export default {
  components: {
    Pagination
  },
  data() {
    return {
      active: 'tmnlFactory',
      tmnlFactoryType: [],
      meterFactoryType: [],
      tmnlTypeList: [],
      meterTypeList: [],
      tableHeight: window.innerHeight - 400,
    }
  },
  computed: {},
  mounted() {
    this.getView()
  },
  watch: {},
  methods: {
    getView() {
      getViewList({
        viewType: "TMNLFactoryType"
      }).then(res => {
        this.tmnlFactoryType = res.data.data.list
      })
      getViewList({
        viewType: "meterFactoryType"
      }).then(res => {
        this.meterFactoryType = res.data.data.list
      })
      getViewList({
        viewType: "tmnlType"
      }).then(res => {
        this.tmnlTypeList = res.data.data.list
      })
      getViewList({
        viewType: "meterType"
      }).then(res => {
        this.meterTypeList = res.data.data.list
      })
    },
  }
};
</script>

<style scoped lang="scss">
.uptop {
  padding: 10px;
  border: 1px solid #dddddd;
}
.el-tabs {
  padding-bottom: 30px;
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
