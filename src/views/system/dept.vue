<template>
  <basic-container>
    <avue-crud :option="option"
               :data="data"
               ref="crud"
               v-model="form"
               :permission="permissionList"
               :before-open="beforeOpen"
               @row-del="rowDel"
               @row-update="rowUpdate"
               @row-save="rowSave"
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
                   v-if="permission.dept_delete"
                   plain
                   @click="handleDelete">{{$t('route.delete')}}
        </el-button>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
  import {add, getDept, getDeptTree, getList, remove, update} from "@/api/system/dept";
  import {mapGetters} from "vuex";
  import website from '@/config/website';

  export default {
    data() {
      return {
        form: {},
        selectionList: [],
        query: {},
        page: {
          pageSize: 10,
          currentPage: 1,
          total: 0
        },
        option: {
          tip: false,
          tree: true,
          border: true,
          index: true,
          selection: true,
          viewBtn: true,
          column: [
            {
              label: this.$t('dept.deptName'),
              prop: "deptName",
              search: true,
              rules: [{
                required: true,
                message: this.$t('dept.enterDeptName'),
                trigger: "blur"
              }]
            },
            {
              label: this.$t('dept.tenantId'),
              prop: "tenantId",
              type: "tree",
              dicUrl: "/api/ami-system/tenant/select",
              addDisplay: false,
              editDisplay: false,
              viewDisplay: website.tenantMode,
              span: 24,
              props: {
                label: "tenantName",
                value: "tenantId"
              },
              hide: !website.tenantMode,
              search: website.tenantMode,
              rules: [{
                required: true,
                message: this.$t('dept.enterTenantId'),
                trigger: "click"
              }]
            },
            {
              label: this.$t('dept.fullName'),
              prop: "fullName",
              search: true,
              rules: [{
                required: true,
                message: this.$t('dept.enterFullName'),
                trigger: "blur"
              }]
            },
            {
              label: this.$t('dept.parentId'),
              prop: "parentId",
              dicData: [],
              type: "tree",
              hide: true,
              props: {
                label: "title"
              },
              rules: [{
                required: false,
                message: this.$t('dept.enterParentId'),
                trigger: "click"
              }]
            },

            {
              label: this.$t('dept.sort'),
              prop: "sort",
              type: "number",
              rules: [{
                required: true,
                message: this.$t('dept.enterSort'),
                trigger: "blur"
              }]
            },

            {
              label: this.$t('dept.remark'),
              prop: "remark",
              span: 24,
              rules: [{
                required: false,
                message: this.$t('dept.enterRemark'),
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
          addBtn: this.vaildData(this.permission.dept_add, false),
          viewBtn: this.vaildData(this.permission.dept_view, false),
          delBtn: this.vaildData(this.permission.dept_delete, false),
          editBtn: this.vaildData(this.permission.dept_edit, false)
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
            message: this.$t('global.operatorSuccess')
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
            message: this.$t('global.operatorSuccess')
          });
        }, error => {
          done();
          console.log(error);
        });
      },
      rowDel(row) {
        this.$confirm(this.$t('role.confirmDelete'), {
          confirmButtonText: this.$t('global.confirm'),
          cancelButtonText: this.$t('cancelText'),
          type: "warning"
        })
          .then(() => {
            return remove(row.id);
          })
          .then(() => {
            this.onLoad(this.page);
            this.$message({
              type: "success",
              message: this.$t('global.operatorSuccess')
            });
          });
      },
      handleDelete() {
        if (this.selectionList.length === 0) {
          this.$message.warning(this.$t('param.leastOne'));
          return;
        }
        this.$confirm(this.$t('param.confirmDelete'), {
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
              message: this.$t('global.operatorSuccess')
            });
            this.$refs.crud.toggleSelection();
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
      beforeOpen(done, type) {
        if (["edit", "view"].includes(type)) {
          getDept(this.form.id).then(res => {
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
        getList(page.currentPage, page.pageSize, Object.assign(params, this.query)).then(res => {
          this.data = res.data.data;
          getDeptTree().then(res => {
            const data = res.data.data;
            const index = this.$refs.crud.findColumnIndex("parentId");
            this.option.column[index].dicData = data;
          });
        });
      }
    }
  };
</script>

<style>
</style>
