<template>
  <basic-container>
    <avue-crud :option="option"
               :table-loading="loading"
               :data="data"
               ref="crud"
               v-model="form"
               :permission="permissionList"
               :page="page"
               @row-del="rowDel"
               @row-update="rowUpdate"
               @row-save="rowSave"
               :before-open="beforeOpen"
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
                   v-if="permission.code_delete"
                   plain
                   @click="handleDelete">{{$t('route.delete')}}
        </el-button>
        <el-button type="primary"
                   size="small"
                   plain
                   icon="el-icon-refresh"
                   @click="handleBuild">{{$t('code.generation')}}
        </el-button>
      </template>
      <template slot-scope="scope" slot="menu">
        <el-button type="text"
                   size="small"
                   icon="el-icon-document-copy"
                   v-if="permission.code_edit"
                   plain
                   class="none-border"
                   @click.stop="handleCopy(scope.row)">{{$t('code.copy')}}
        </el-button>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
  import {getList, getCode, build, remove, add, update, copy} from "@/api/tool/code";
  import {mapGetters} from "vuex";

  export default {
    data() {
      return {
        form: {},
        selectionList: [],
        loading: true,
        query: {},
        page: {
          pageSize: 10,
          currentPage: 1,
          total: 0
        },
        option: {
          dialogWidth: 400,
          dialogHeight: 500,
          tip: false,
          border: true,
          index: true,
          selection: true,
          labelWidth: 120,
          viewBtn: true,
          column: [
            {
              label: this.$t('code.datasourceId'),
              prop: "datasourceId",
              search: true,
              span: 24,
              type: "select",
              dicUrl: "/api/ami-develop/datasource/select",
              props: {
                label: "name",
                value: "id"
              },
              rules: [{
                required: true,
                message: this.$t('code.enterDatasourceId'),
                trigger: "blur"
              }]
            },
            {
              label: this.$t('code.codeName'),
              prop: "codeName",
              search: true,
              rules: [{
                required: true,
                message: this.$t('code.enterCodeName'),
                trigger: "blur"
              }]
            },
            {
              label: this.$t('code.serviceName'),
              prop: "serviceName",
              search: true,
              rules: [{
                required: true,
                message: this.$t('code.enterServiceName'),
                trigger: "blur"
              }]
            },
            {
              label: this.$t('code.tableName'),
              prop: "tableName",
              rules: [{
                required: true,
                message: this.$t('code.enterTableName'),
                trigger: "blur"
              }]
            },
            {
              label: this.$t('code.tablePrefix'),
              prop: "tablePrefix",
              hide: true,
              rules: [{
                required: true,
                message: this.$t('code.enterTablePrefix'),
                trigger: "blur"
              }]
            },
            {
              label: this.$t('code.pkName'),
              prop: "pkName",
              hide: true,
              rules: [{
                required: true,
                message: this.$t('code.enterPkName'),
                trigger: "blur"
              }]
            },
            {
              label: this.$t('code.packageName'),
              prop: "packageName",
              overHidden: true,
              rules: [{
                required: true,
                message: this.$t('code.enterPackageName'),
                trigger: "blur"
              }]
            },
            {
              label: this.$t('code.baseMode'),
              prop: "baseMode",
              type: 'radio',
              dicUrl: "/api/ami-system/dict/dictionary?code=yes_no",
              props: {
                label: "dictValue",
                value: "dictKey"
              },
              hide: true,
              rules: [{
                required: true,
                message: this.$t('code.enterBaseMode'),
                trigger: "blur"
              }]
            },
            {
              label: this.$t('code.wrapMode'),
              prop: "wrapMode",
              type: 'radio',
              dicUrl: "/api/ami-system/dict/dictionary?code=yes_no",
              props: {
                label: "dictValue",
                value: "dictKey"
              },
              hide: true,
              rules: [{
                required: true,
                message: this.$t('code.enterWrapMode'),
                trigger: "blur"
              }]
            },
            {
              label: this.$t('code.apiPath'),
              prop: "apiPath",
              span: 24,
              hide: true,
              rules: [{
                required: true,
                message: this.$t('code.enterApiPath'),
                trigger: "blur"
              }]
            },
            {
              label: this.$t('code.webPath'),
              prop: "webPath",
              span: 24,
              hide: true,
              rules: [{
                required: true,
                message: this.$t('code.enterWebPath'),
                trigger: "blur"
              }]
            }
          ]
        },
        data: []
      };
    },
    computed: {
      ...mapGetters(["permission"]),
      permissionList() {
        return {
          addBtn: this.vaildData(this.permission.code_add, false),
          viewBtn: this.vaildData(this.permission.code_view, false),
          delBtn: this.vaildData(this.permission.code_delete, false),
          editBtn: this.vaildData(this.permission.code_edit, false)
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
            message: this.$t('code.success')
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
            message: this.$t('code.success')
          });
        }, error => {
          done();
          console.log(error);
        });
      },
      rowDel(row) {
        this.$confirm(this.$t('code.confirmDelete'), {
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
              message: this.$t('code.success')
            });
          });
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
      handleDelete() {
        if (this.selectionList.length === 0) {
          this.$message.warning(this.$t('code.leastOne'));
          return;
        }
        this.$confirm(this.$t('code.confirmDelete'), {
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
              message: this.$t('code.success')
            });
            this.$refs.crud.toggleSelection();
          });
      },
      handleBuild() {
        if (this.selectionList.length === 0) {
          this.$message.warning(this.$t('code.leastOne'));
          return;
        }
        this.$confirm(this.$t('code.generationCode'), {
          title: this.$t('code.generationConfirm'),
          confirmButtonText: this.$t('global.confirm'),
          cancelButtonText: this.$t('global.cancel'),
          type: "warning"
        })
          .then(() => {
            return build(this.ids);
          })
          .then(() => {
            this.onLoad(this.page);
            this.$message({
              type: "success",
              message: this.$t('code.success')
            });
            this.$refs.crud.toggleSelection();
          });
      },
      handleCopy(row) {
        copy(row.id).then(() => {
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: this.$t('code.copySuccess')
          });
        });
      },
      beforeOpen(done, type) {
        if (["edit", "view"].includes(type)) {
          getCode(this.form.id).then(res => {
            this.form = res.data.data;
          });
        }
        done();
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
  .none-border {
    border: 0;
    background-color: transparent !important;
  }
</style>
