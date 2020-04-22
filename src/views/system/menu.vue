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
                   v-if="permission.menu_delete"
                   plain
                   @click="handleDelete">{{$t('route.delete')}}
        </el-button>
      </template>
      <template slot-scope="{row}"
                slot="source">
        <div style="text-align:center">
          <i :class="row.source"></i>
        </div>
      </template>
      <template slot-scope="{row}"
                slot="name">
          {{$t('route.'+row.name)}}
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
  import {add, getList, getMenu, remove, update} from "@/api/system/menu";
  import {mapGetters} from "vuex";
  import iconList from "@/config/iconList";

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
          dialogWidth: "60%",
          tree: true,
          border: true,
          index: true,
          selection: true,
          viewBtn: true,
          column: [
            {
              label: this.$t('menu.name'),
              prop: "name",
              search: true,
              slot: true,
              rules: [
                {
                  required: true,
                  message: this.$t('menu.enterName'),
                  trigger: "blur"
                }
              ]
            },
            {
              label: this.$t('menu.path'),
              prop: "path",
              rules: [
                {
                  required: true,
                  message: this.$t('menu.enterPath'),
                  trigger: "blur"
                }
              ]
            },
            {
              label: this.$t('menu.parentId'),
              prop: "parentId",
              type: "tree",
              dicUrl: "/api/ami-system/menu/tree",
              hide: true,
              props: {
                label: "title"
              },
              rules: [
                {
                  required: false,
                  message: this.$t('menu.enterParentId'),
                  trigger: "click"
                }
              ]
            },
            {
              label: this.$t('menu.source'),
              prop: "source",
              type: "icon-select",
              slot: true,
              iconList: iconList,
              rules: [
                {
                  required: true,
                  message: this.$t('menu.enterSource'),
                  trigger: "click"
                }
              ]
            },
            {
              label: this.$t('menu.code'),
              prop: "code",
              search: true,
              rules: [
                {
                  required: true,
                  message: this.$t('menu.enterCode'),
                  trigger: "blur"
                }
              ]
            },
            {
              label: this.$t('menu.category'),
              prop: "category",
              type: "radio",
              dicData: [
                {
                  label: this.$t('menu.menu1'),
                  value: 1
                },
                {
                  label: this.$t('menu.button'),
                  value: 2
                }
              ],
              hide: true,
              rules: [
                {
                  required: true,
                  message: this.$t('menu.enterCategory'),
                  trigger: "blur"
                }
              ]
            },
            {
              label: this.$t('menu.alias'),
              prop: "alias",
              rules: [
                {
                  required: true,
                  message: this.$t('menu.enterAlias'),
                  trigger: "blur"
                }
              ]
            },
            {
              label: this.$t('menu.action'),
              prop: "action",
              type: "radio",
              dicData: [
                {
                  label: this.$t('menu.tool'),
                  value: 0
                },
                {
                  label: this.$t('menu.operation'),
                  value: 1
                },
                {
                  label: this.$t('menu.toolOperation'),
                  value: 2
                }
              ],
              hide: true,
              rules: [
                {
                  required: true,
                  message: this.$t('menu.pickAction'),
                  trigger: "blur"
                }
              ]
            },
            {
              label: this.$t('menu.sort'),
              prop: "sort",
              type: "number",
              rules: [
                {
                  required: true,
                  message: this.$t('menu.enterSort'),
                  trigger: "blur"
                }
              ]
            },
            {
              label: this.$t('menu.isOpen'),
              prop: "isOpen",
              type: "radio",
              dicData: [
                {
                  label: this.$t('menu.no'),
                  value: 0
                },
                {
                  label: this.$t('menu.yes'),
                  value: 1
                },
              ],
              hide: true
            },
            {
              label: this.$t('menu.remark'),
              prop: "remark",
              type: "textarea",
              span: 24,
              minRows: 6,
              hide: true
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
          addBtn: this.vaildData(this.permission.menu_add, false),
          viewBtn: this.vaildData(this.permission.menu_view, false),
          delBtn: this.vaildData(this.permission.menu_delete, false),
          editBtn: this.vaildData(this.permission.menu_edit, false)
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
            message: "操作成功!"
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
            message: "操作成功!"
          });
        }, error => {
          done();
          console.log(error);
        });
      },
      rowDel(row) {
        this.$confirm("确定将选择数据删除?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            return remove(row.id);
          })
          .then(() => {
            this.onLoad(this.page);
            this.$message({
              type: "success",
              message: "操作成功!"
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
          this.$message.warning("请选择至少一条数据");
          return;
        }
        this.$confirm("确定将选择数据删除?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            return remove(this.ids);
          })
          .then(() => {
            this.onLoad(this.page);
            this.$message({
              type: "success",
              message: "操作成功!"
            });
            this.$refs.crud.toggleSelection();
          });
      },
      beforeOpen(done, type) {
        if (["edit", "view"].includes(type)) {
          getMenu(this.form.id).then(res => {
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
        });
      }
    }
  };
</script>

<style>
</style>
