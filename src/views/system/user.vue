<template>
  <basic-container>
    <avue-crud :option="option"
               :data="data"
               ref="crud"
               v-model="form"
               :permission="permissionList"
               @row-del="rowDel"
               @row-update="rowUpdate"
               @row-save="rowSave"
               :before-open="beforeOpen"
               :page="page"
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
                   v-if="permission.user_delete"
                   @click="handleDelete">{{$t('route.delete')}}
        </el-button>
        <el-button type="primary"
                   size="small"
                   plain
                   v-if="permission.user_reset"
                   icon="el-icon-refresh"
                   @click="handleReset">{{$t('route.pwdReset')}}
        </el-button>
      </template>
      <template slot-scope="{row}"
                slot="roleId">
        <el-tag>{{row.roleName}}</el-tag>
      </template>
      <template slot-scope="{row}"
                slot="deptId">
        <el-tag>{{row.deptName}}</el-tag>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
  import {
    getList,
    getUser,
    remove,
    update,
    add,
    resetPassword
  } from "@/api/system/user";
  import {getDeptTree} from "@/api/system/dept";
  import {getRoleTree} from "@/api/system/role";
  import {mapGetters} from "vuex";
  import website from '@/config/website';
  import {getList as getParmaList} from "@/api/system/param";
  export default {
    data() {
      const validatePass = (rule, value, callback) => {
        let reg=new RegExp("^(?=.*[A-Za-z])(?=.*\\d)(?=.*[$@$!%*#?&])[A-Za-z\\d$@$!%*#?&]{"+this.option.column[3].minlength+",40}$"); 
        if (value === '') {
          callback(new Error(this.$t('user.password2')));
        } else if (!reg.test(value)) {
          callback(new Error(this.$t('global.passformat')+this.option.column[3].minlength+this.$t('global.passformatT')));
        } else {
          callback();
        }
      };
      const validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error(this.$t('user.password3')));
        } else if (value !== this.form.password) {
          callback(new Error(this.$t('user.password4')));
        } else {
          callback();
        }
      };
      return {
        form: {},
        selectionList: [],
        query: {},
        realPass:0,
        page: {
          pageSize: 10,
          currentPage: 1,
          total: 0
        },
        init: {
          roleTree: [],
          deptTree: [],
        },
        option: {
          tip: false,
          border: true,
          index: true,
          selection: true,
          viewBtn: true,
          dialogHeight: 450,
          labelWidth:180,
          column: [
            {
              label: this.$t('user.account'),
              prop: "account",
              search: true,
              rules: [{
                required: true,
                message: this.$t('user.enterAccount'),
                trigger: "blur"
              },{
                message: this.$t('global.nameLength'),
                trigger: "blur",
                min: 5,
                max: 40
              }],
              span: website.tenantMode ? 12 : 24,
            },
            {
              label: this.$t('user.tenantId'),
              prop: "tenantId",
              type: "tree",
              dicUrl: "/api/ami-system/tenant/select",
              props: {
                label: "tenantName",
                value: "tenantId"
              },
              hide: !website.tenantMode,
              addDisplay: website.tenantMode,
              editDisplay: website.tenantMode,
              viewDisplay: website.tenantMode,
              search: website.tenantMode,
              rules: [{
                required: true,
                message: this.$t('user.enterTenantId'),
                trigger: "click"
              }]
            },
            {
              label: this.$t('user.password'),
              prop: 'password',
              hide: true,
              minlength: null,
              editDisplay: false,
              viewDisplay: false,
              rules: [{
                required: true,
                validator: validatePass,
                trigger: 'blur',
              }]
            },
            {
              label: this.$t('user.password2'),
              prop: 'password2',
              hide: true,
              editDisplay: false,
              minlength: null,
              viewDisplay: false,
              rules: [{
                required: true,
                validator: validatePass2,
                trigger: 'blur',
              }]
            },
            {
              label: this.$t('user.name'),
              prop: "name",
              search: true,
              rules: [{
                required: true,
                message: this.$t('user.enterName'),
                trigger: "blur"
              },{
                message: this.$t('global.nameLength'),
                trigger: "blur",
                min: 5,
                max: 40
              }]
            },
            {
              label: this.$t('user.realName'),
              prop: "realName",
              rules: [{
                required: true,
                message: this.$t('user.enterRealName'),
                trigger: "blur",
              },{
                message: this.$t('global.nameLength'),
                trigger: "blur",
                min: 5,
                max: 40
              }]
            },
            {
              label: this.$t('user.roleId'),
              prop: "roleId",
              multiple: true,
              type: "tree",
              dicData: [],
              props: {
                label: "title"
              },
              slot: true,
              rules: [{
                required: true,
                message: this.$t('user.pickRoleId'),
                trigger: "click"
              }]
            },
            {
              label: this.$t('user.deptId'),
              prop: "deptId",
              type: "tree",
              multiple: true,
              dicData: [],
              props: {
                label: "title"
              },
              slot: true,
              rules: [{
                required: true,
                message: this.$t('user.pickDeptId'),
                trigger: "click"
              }]
            },
            {
              label: this.$t('user.phone'),
              prop: "phone",
              overHidden: true
            },
            {
              label: this.$t('user.email'),
              prop: "email",
              hide: true,
              overHidden: true
            },
            {
              label: this.$t('user.sex'),
              prop: "sex",
              type: "select",
              dicData: [
                {
                  label: this.$t('user.male'),
                  value: 1
                },
                {
                  label: this.$t('user.female'),
                  value: 2
                },
                {
                  label: this.$t('user.unknown'),
                  value: 3
                }
              ],
              hide: true
            },
            {
              label: this.$t('user.date'),
              type: "date",
              prop: "birthday",
              format: "yyyy-MM-dd hh:mm:ss",
              valueFormat: "yyyy-MM-dd hh:mm:ss",
              hide: true
            },
            {
              label: this.$t('user.statusName'),
              prop: "statusName",
              hide: true,
              display: false
            }
          ]
        },
        data: []
      };
    },
    watch: {
      'form.tenantId'() {
        if (this.form.tenantId !== '') {
          getDeptTree(this.form.tenantId).then(res => {
            const index = this.$refs.crud.findColumnIndex("deptId");
            this.option.column[index].dicData = res.data.data;
          });
          getRoleTree(this.form.tenantId).then(res => {
            const index = this.$refs.crud.findColumnIndex("roleId");
            this.option.column[index].dicData = res.data.data;
          });
        }
      }
    },
    computed: {
      ...mapGetters(["permission"]),
      permissionList() {
        return {
          addBtn: this.vaildData(this.permission.user_add, false),
          viewBtn: this.vaildData(this.permission.user_view, false),
          delBtn: this.vaildData(this.permission.user_delete, false),
          editBtn: this.vaildData(this.permission.user_edit, false)
        };
      },
      ids() {
        let ids = [];
        this.selectionList.forEach(ele => {
          ids.push(ele.id);
        });
        return ids.join(",");
      },
    },
    methods: {
      rowSave(row, loading, done) {
        row.deptId = row.deptId.join(",");
        row.roleId = row.roleId.join(",");
        add(row).then(() => {
          loading();
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: this.$t('param.success')
          });
        }, error => {
          done();
          console.log(error);
        });
      },
      rowUpdate(row, index, loading, done) {
        row.deptId = row.deptId.join(",");
        row.roleId = row.roleId.join(",");
        update(row).then(() => {
          loading();
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: this.$t('param.success')
          });
        }, error => {
          done();
          console.log(error);
        });
      },
      rowDel(row) {
        this.$confirm(this.$t('param.confirmDelete'), {
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
              message: this.$t('global.operatorSuccess')
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
      handleDelete() {
        if (this.selectionList.length === 0) {
          this.$message.warning(this.$t('role.leastOne'));
          return;
        }
        this.$confirm(this.$t('role.confirmDelete'), {
          confirmButtonText: this.$t('global.confirm'),
          cancelButtonText: this.$t('cancelText'),
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
      handleReset() {
        if (this.selectionList.length === 0) {
          this.$message.warning(this.$t('param.leastOne'));
          return;
        }
        this.$confirm(`${this.$t('global.resetpass')}${this.realPass}?`, {
          confirmButtonText: this.$t('global.confirm'),
          cancelButtonText: this.$t('cancelText'),
          type: "warning"
        })
          .then(() => {
            return resetPassword(this.ids);
          })
          .then(() => {
            this.$message({
              type: "success",
              message: this.$t('global.operatorSuccess')
            });
            this.$refs.crud.toggleSelection();
          });
      },
      beforeOpen(done, type) {
        if (["edit", "view"].includes(type)) {
          getUser(this.form.id).then(res => {
            this.form = res.data.data;
            this.form.deptId = this.form.deptId.split(",");
            this.form.deptId.forEach((ele, index) => {
              this.form.deptId[index] = Number(ele);
            });
            this.form.roleId = this.form.roleId.split(",");
            this.form.roleId.forEach((ele, index) => {
              this.form.roleId[index] = Number(ele);
            });
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
          const data = res.data.data;
          this.page.total = data.total;
          this.data = data.records;
        });
        getDeptTree(this.form.tenantId).then(res => {
          const index = this.$refs.crud.findColumnIndex("deptId");
          this.option.column[index].dicData = res.data.data;
        });
        getRoleTree(this.form.tenantId).then(res => {
          const index = this.$refs.crud.findColumnIndex("roleId");
          this.option.column[index].dicData = res.data.data;
        });
        getParmaList(1,20,{paramKey:'password.minlength'}).then(res=>{
          this.option.column[3].minlength = Number(res.data.data.records[0].paramValue)
          this.option.column[2].minlength = Number(res.data.data.records[0].paramValue)
        })
        getParmaList(1,20,{paramKey:'account.initPassword'}).then(res=>{
          this.realPass=res.data.data.records[0].paramValue;
        })
      }
    }
  };
</script>

<style>
</style>
