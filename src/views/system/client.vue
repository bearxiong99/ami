<template>
  <basic-container>
    <avue-crud :option="option"
               :data="data"
               :page="page"
               @row-del="rowDel"
               v-model="form"
               :permission="permissionList"
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
                   plain
                   v-if="permission.client_delete"
                   @click="handleDelete">{{$t('route.delete')}}
        </el-button>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
  import {getList, getDetail, add, update, remove} from "@/api/system/client";
  import {mapGetters} from "vuex";

  export default {
    data() {
      return {
        form: {},
        query: {},
        page: {
          pageSize: 10,
          currentPage: 1,
          total: 0
        },
        selectionList: [],
        option: {
          tip: false,
          border: true,
          index: true,
          viewBtn: true,
          selection: true,
          column: [
            {
              label: this.$t('client.clientId'),
              prop: "clientId",
              search: true,
              rules: [{
                required: true,
                message: this.$t('client.enterClientId'),
                trigger: "blur"
              }]
            },
            {
              label: this.$t('client.clientSecret'),
              prop: "clientSecret",
              search: true,
              rules: [{
                required: true,
                message: this.$t('client.enterClientSecret'),
                trigger: "blur"
              }]
            },
            {
              label: this.$t('client.authorizedGrantTypes'),
              prop: "authorizedGrantTypes",
              valueDefault: "refresh_token,password,authorization_code",
              rules: [{
                required: true,
                message: this.$t('client.enterAuthorizedGrantTypes'),
                trigger: "blur"
              }]
            },
            {
              label: this.$t('client.scope'),
              prop: "scope",
              valueDefault: "all",
              rules: [{
                required: true,
                message: this.$t('client.enterScope'),
                trigger: "blur"
              }]
            },
            {
              label: this.$t('client.accessTokenValidity'),
              prop: "accessTokenValidity",
              type: "number",
              valueDefault: 3600,
              rules: [{
                required: true,
                message: this.$t('client.enterAccessTokenValidity'),
                trigger: "blur"
              }]
            },
            {
              label: this.$t('client.refreshTokenValidity'),
              prop: "refreshTokenValidity",
              type: "number",
              valueDefault: 604800,
              hide: true,
              rules: [{
                required: true,
                message: this.$t('client.enterRefreshTokenValidity'),
                trigger: "blur"
              }]
            },
            {
              label: this.$t('client.webServerRedirectUri'),
              prop: "webServerRedirectUri",
              hide: true,
              rules: [{
                required: true,
                message: this.$t('client.enterWebServerRedirectUri'),
                trigger: "blur"
              }]
            },
            {
              label: this.$t('client.resourceIds'),
              prop: "resourceIds",
              hide: true,
              rules: [{
                message: this.$t('client.enterResourceIds'),
                trigger: "blur"
              }]
            },
            {
              label: this.$t('client.authorities'),
              prop: "authorities",
              hide: true,
              rules: [{
                message: this.$t('client.enterAuthorities'),
                trigger: "blur"
              }]
            },
            {
              label: this.$t('client.autoapprove'),
              prop: "autoapprove",
              hide: true,
              rules: [{
                message: this.$t('client.enterAutoapprove'),
                trigger: "blur"
              }]
            },
            {
              label: this.$t('client.additionalInformation'),
              hide: true,
              prop: "additionalInformation",
              span: 24,
              rules: [{
                message: this.$t('client.enterAdditionalInformation'),
                trigger: "blur"
              }]
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
          addBtn: this.vaildData(this.permission.client_add),
          viewBtn: this.vaildData(this.permission.client_view),
          delBtn: this.vaildData(this.permission.client_delete),
          editBtn: this.vaildData(this.permission.client_edit)
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
            message: this.$t('client.success')
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
            message: this.$t('client.success')
          });
        }, error => {
          done();
          console.log(error);
        });
      },
      rowDel(row) {
        this.$confirm(this.$t('client.confirmDelete'), {
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
              message: this.$t('client.success')
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
          this.$message.warning(this.$t('client.leastOne'));
          return;
        }
        this.$confirm(this.$t('client.confirmDelete'), {
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
              message: this.$t('client.success')
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
      }
    }
  };
</script>

<style>
</style>
