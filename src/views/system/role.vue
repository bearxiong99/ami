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
                   v-if="permission.role_delete"
                   plain
                   @click="handleDelete">{{$t('route.delete')}}
        </el-button>
        <el-button size="small"
                   icon="el-icon-delete"
                   @click="handleRole"
                   plain>{{$t('role.rightSetting')}}
        </el-button>
      </template>
    </avue-crud>
    <el-dialog :title="$t('role.roleConfig')"
               :visible.sync="box"
               width="30%">
      <el-tabs>
        <el-tab-pane :label="$t('global.accessper')">
          <el-tree :data="list"
                   show-checkbox
                   node-key="id"
                   ref="tree"
                   :default-checked-keys="defaultObj"
                   :props="props">
                   <span slot-scope="{ node }">
                     <span>{{ $t('route.'+node.label) }}</span>
                   </span>
          </el-tree>
        </el-tab-pane>
        <el-tab-pane :label="$t('global.orgper')">
          <org style="height: 50vh; overflow-y: auto"
               ref="orgTree"
               show-checkbox
               show-search
               isLoadAll
               isGetAll
               @check="changeCheck"/>
        </el-tab-pane>
      </el-tabs>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="box = false">{{$t('global.cancel')}}</el-button>
        <el-button type="primary"
                   @click="submit">{{$t('global.confirm')}}</el-button>
      </span>
    </el-dialog>
  </basic-container>
</template>

<script>
  import {
    add,
    getList,
    getRole,
    getRoleTree,
    grant,
    grantTree,
    remove,
    roleOrgTreeKeys,
    update
  } from "@/api/system/role";
  import {mapGetters} from "vuex";
  import website from '@/config/website';
  import Org from '@/page/index/components/org'

  export default {
    components: {Org},
    data() {
      return {
        form: {},
        box: false,
        props: {
          label: "title",
          value: "key"
        },
        list: [],
        defaultObj: [],
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
          dialogWidth: 300,
          dialogHeight: 400,
          labelWidth:150,
          column: [
            {
              label: this.$t('role.roleName'),
              prop: "roleName",
              search: true,
              span: 24,
              rules: [
                {
                  required: true,
                  message: this.$t('role.enterRoleName'),
                  trigger: "blur"
                }
              ]
            },
            {
              label: this.$t('role.tenantId'),
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
                message: this.$t('role.enterTenantId'),
                trigger: "click"
              }]
            },
            {
              label: this.$t('role.roleAlias'),
              prop: "roleAlias",
              search: true,
              span: 24,
              rules: [
                {
                  required: true,
                  message: this.$t('role.enterRoleAlias'),
                  trigger: "blur"
                }
              ]
            },
            {
              label: this.$t('role.parentId'),
              prop: "parentId",
              dicData: [],
              type: "tree",
              hide: true,
              span: 24,
              props: {
                label: "title"
              },
              rules: [
                {
                  required: false,
                  message: this.$t('role.enterParentId'),
                  trigger: "click"
                }
              ]
            },
            {
              label: this.$t('role.sort'),
              prop: "sort",
              type: "number",
              span: 24,
              rules: [
                {
                  required: true,
                  message: this.$t('role.enterSort'),
                  trigger: "blur"
                }
              ]
            }
          ]
        },
        data: [],
        defaultCheckedKeys: [],
        checkedKeys: [],
      };
    },
    computed: {
      ...mapGetters(["permission"]),
      permissionList() {
        return {
          addBtn: this.vaildData(this.permission.role_add, false),
          viewBtn: this.vaildData(this.permission.role_view, false),
          delBtn: this.vaildData(this.permission.role_delete, false),
          editBtn: this.vaildData(this.permission.role_edit, false)
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
      submit() {
        const menuLIst = this.$refs.tree.getCheckedKeys().join(",");
        let orgNos = this.checkedKeys === [] ? this.defaultCheckedKeys.join(",") : this.checkedKeys.join(",")
        grant(this.ids, menuLIst, orgNos).then(() => {
          this.box = false;
          this.$message({
            type: "success",
            message: this.$t('role.success')
          });
          this.onLoad(this.page);
        });
      },
      rowSave(row, loading, done) {
        add(row).then(() => {
          loading();
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: this.$t('role.success')
          });
        }, error => {
          done();
          console.log(error);
        });
      },
      rowUpdate(row, index, loading, done) {
        update(row).then(() => {
          this.onLoad(this.page);
          loading();
          this.$message({
            type: "success",
            message: this.$t('role.success')
          });
        }, error => {
          done();
          console.log(error);
        });
      },
      rowDel(row) {
        this.$confirm(this.$t('role.confirmDelete'), {
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
              message: this.$t('role.success')
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
      handleRole() {
        this.checkedKeys = []
        if (this.selectionList.length !== 1) {
          this.$message.warning(this.$t('role.onlyOne'));
          return;
        }
        this.defaultObj = [];
        grantTree()
          .then(res => {
            this.list = res.data.data;
            return getRole(this.ids);
          })
          .then(res => {
            this.defaultObj = res.data.data;
            return roleOrgTreeKeys(this.ids);
          })
          .then(res => {
            this.box = true;
            this.defaultCheckedKeys = res.data.data
            this.$nextTick(() => {
              this.$refs.orgTree.setChecked(this.defaultCheckedKeys);
              this.checkedKeys=this.defaultCheckedKeys;
            })
          });
      },
      handleDelete() {
        if (this.selectionList.length === 0) {
          this.$message.warning(this.$t('role.leastOne'));
          return;
        }
        this.$confirm(this.$t('role.confirmDelete'), {
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
              message: this.$t('role.success')
            });
            this.$refs.crud.toggleSelection();
          });
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
          getRoleTree().then(res => {
            const data = res.data.data;
            const index = this.$refs.crud.findColumnIndex("parentId");
            this.option.column[index].dicData = data;
          });
        });
      },
      changeCheck(node, data) {
        this.checkedKeys = data.checkedKeys
      }
    }
  };
</script>

<style>
</style>
