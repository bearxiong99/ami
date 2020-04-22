<template>
  <basic-container>
    <avue-crud :option="option"
               :table-loading="loading"
               :data="data"
               :page="page"
               :permission="permissionList"
               :before-open="beforeOpen"
               v-model="form"
               ref="crud"
               @row-update="rowUpdate"
               @row-save="rowSave"
               @row-del="rowDel"
               @search-change="searchChange"
               @search-reset="searchReset"
               @selection-change="selectionChange"
               @current-change="currentChange"
               @size-change="sizeChange"
               @on-load="onLoad">
      <template slot="menuLeft">
        <el-button type="danger"
                   size="small"
                   icon="el-icon-delete"
                   plain
                   v-if="permission.datasource_delete"
                   @click="handleDelete">{{$t('route.delete')}}
        </el-button>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
  import {getList, getDetail, add, update, remove} from "@/api/tool/datasource";
  import {mapGetters} from "vuex";

  export default {
    data() {
      return {
        form: {},
        query: {},
        loading: true,
        page: {
          pageSize: 10,
          currentPage: 1,
          total: 0
        },
        selectionList: [],
        option: {
          dialogWidth: 400,
          dialogHeight: 330,
          tip: false,
          border: true,
          index: true,
          viewBtn: true,
          selection: true,
          column: [
            {
              label: this.$t('datasource.name'),
              prop: "name",
              width: 120,
              rules: [{
                required: true,
                message: this.$t('datasource.enterName'),
                trigger: "blur"
              }]
            },
            {
              label: this.$t('datasource.driverClass'),
              prop: "driverClass",
              type: 'select',
              dicData: [
                {
                  label: 'com.mysql.cj.jdbc.Driver',
                  value: 'com.mysql.cj.jdbc.Driver',
                }, {
                  label: 'org.postgresql.Driver',
                  value: 'org.postgresql.Driver',
                }, {
                  label: 'oracle.jdbc.OracleDriver',
                  value: 'oracle.jdbc.OracleDriver',
                }
              ],
              width: 200,
              rules: [{
                required: true,
                message: this.$t('datasource.enterDriverClass'),
                trigger: "blur"
              }]
            },
            {
              label: this.$t('datasource.username'),
              prop: "username",
              width: 120,
              rules: [{
                required: true,
                message: this.$t('datasource.enterUsername'),
                trigger: "blur"
              }]
            },
            {
              label: this.$t('datasource.password'),
              prop: "password",
              hide: true,
              rules: [{
                required: true,
                message: this.$t('global.enterPassword'),
                trigger: "blur"
              }]
            },
            {
              label: this.$t('datasource.url'),
              prop: "url",
              span: 24,
              rules: [{
                required: true,
                message: this.$t('datasource.enterUrl'),
                trigger: "blur"
              }]
            },
            {
              label: this.$t('datasource.remark'),
              prop: "remark",
              span: 24,
              minRows: 3,
              hide: true,
              type: "textarea"
            },
          ]
        },
        data: []
      };
    },
    computed: {
      ...mapGetters(["permission"]),
      permissionList() {
        return {
          addBtn: this.vaildData(this.permission.datasource_add, false),
          viewBtn: this.vaildData(this.permission.datasource_view, false),
          delBtn: this.vaildData(this.permission.datasource_delete, false),
          editBtn: this.vaildData(this.permission.datasource_edit, false)
        };
      },
      ids() {
        let ids = [];
        this.selectionList.forEach(ele => {
          ids.push(ele.id);
        });
        return ids.join(",");
      }
    },
    methods: {
      rowSave(row, loading, done) {
        add(row).then(() => {
          loading();
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: this.$t('datasource.success')
          });
        }, error => {
          done();
          console.log(error);
        });
      },
      rowUpdate(row, index, loading, done) {
        update(row).then(() => {
          loading();
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: this.$t('datasource.success')
          });
        }, error => {
          done();
          console.log(error);
        });
      },
      rowDel(row) {
        this.$confirm(this.$t('datasource.confirmDelete'), {
          confirmButtonText: this.$t('global.confirm'),
          cancelButtonText: this.$t('global.cancel'),
          type: "warning"
        })
          .then(() => {
            return remove(row.id);
          })
          .then(() => {
            this.onLoad(this.page);
            this.$message({
              type: "success",
              message: this.$t('datasource.success')
            });
          });
      },
      handleDelete() {
        if (this.selectionList.length === 0) {
          this.$message.warning(this.$t('datasource.leastOne'));
          return;
        }
        this.$confirm(this.$t('datasource.confirmDelete'), {
          confirmButtonText: this.$t('global.confirm'),
          cancelButtonText: this.$t('global.cancel'),
          type: "warning"
        })
          .then(() => {
            return remove(this.ids);
          })
          .then(() => {
            this.onLoad(this.page);
            this.$message({
              type: "success",
              message: this.$t('datasource.success')
            });
            this.$refs.crud.toggleSelection();
          });
      },
      beforeOpen(done, type) {
        if (["edit", "view"].includes(type)) {
          getDetail(this.form.id).then(res => {
            this.form = res.data.data;
          });
        }
        done();
      },
      searchReset() {
        this.query = {};
        this.onLoad(this.page);
      },
      searchChange(params) {
        this.query = params;
        this.onLoad(this.page, params);
      },
      selectionChange(list) {
        this.selectionList = list;
      },
      selectionClear() {
        this.selectionList = [];
        this.$refs.crud.toggleSelection();
      },
      currentChange(currentPage) {
        this.page.currentPage = currentPage;
      },
      sizeChange(pageSize) {
        this.page.pageSize = pageSize;
      },
      onLoad(page, params = {}) {
        this.loading = true;
        getList(page.currentPage, page.pageSize, Object.assign(params, this.query)).then(res => {
          const data = res.data.data;
          this.page.total = data.total;
          this.data = data.records;
          this.loading = false;
          this.selectionClear();
        });
      }
    }
  };
</script>

<style>
</style>
