<template>
  <basic-container>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form :model="form" label-position="left" label-width="120px">
          <el-form-item :label="$t('group.groupType')">
            <el-select v-model="form.queryType" :placeholder="$t('group.searchType')" style="width: 100%;">
              <el-option :label="$t('group.dcu')" value="tmnl"></el-option>
              <el-option :label="$t('group.meter')" value="meter"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('group.groupName')">
            <el-input :maxlength="30" v-model="form.groupName" :label="$t('group.groupName')"></el-input>
          </el-form-item>
          <div style="text-align: right">
            <el-button type="primary" @click="query">{{$t('group.search')}}</el-button>
          </div>
        </el-form>

        <el-table :data="list" border stripe @row-click="click">
          <el-table-column prop="groupName" :label="$t('group.groupName')"></el-table-column>
        </el-table>

        <el-pagination
          small
          background
          @current-change="handleCurrentChange"
          :current-page="form.page"
          :page-size="form.limit"
          layout="prev, pager, next"
          :total="total">
        </el-pagination>
      </el-col>
      <el-col :span="12">

      </el-col>
    </el-row>
  </basic-container>
</template>

<script>
  import {queryDevice} from '@/api/system/tree'
  export default {
    name: "group",
    data() {
      return {
        form: {
          queryType: 'tmnl',
          groupName: '',
          page: 1,
          limit: 10,
        },
        list: [],
        total: 0,
        visible: false
      }
    },
    methods: {
      nodeClick(data) {
        this.form.orgNo = data.deviceNo
        this.form.orgName = data.deviceName
        this.visible = false
      },
      query() {
        if (this.form.orgNo !== null && this.form.orgNo !== '') {
          queryDevice(this.form).then(res => {
            this.list = res.data.data.list
            this.total = res.data.data.totalCount
          });
        } else {
          this.$message({
            message: this.$t('group.selectArea'),
            type: "error"
          });
        }
      },
      handleCurrentChange(val) {
        this.form.page = val
        this.query()
      },
      click(row, column, event) {
        this.$emit('row-click', row, column, event)
      }
    },
    watch: {
      '$store.state.common.treeNode': function (data) {
        console.log('aaaaaaaaaaaaaaaaaaaaaa', data)
      }
    }
  }
</script>

<style scoped>

</style>
