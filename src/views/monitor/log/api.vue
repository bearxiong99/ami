<template>
  <basic-container>
    <avue-crud :option="option"
               :data="data"
               ref="crud"
               v-model="form"
               :permission="permissionList"
               :before-open="beforeOpen"
               :page="page"
               @search-change="searchChange"
               @search-reset="searchReset"
               @current-change="currentChange"
               @size-change="sizeChange"
               @on-load="onLoad">
    </avue-crud>
  </basic-container>
</template>

<script>
  import {getApiList, getApiLogs} from "@/api/logs";
  import {mapGetters} from "vuex";

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
          border: true,
          index: true,
          viewBtn: true,
          editBtn: false,
          addBtn: false,
          delBtn: false,
          menuWidth: 120,
          column: [
            {
              label: this.$t('api.serviceId'),
              prop: "serviceId",
              search: true
            },
            {
              label: this.$t('api.serverHost'),
              prop: "serverHost",
              search: true
            },
            {
              label: this.$t('api.serverIp'),
              prop: "serverIp"
            },
            {
              label: this.$t('api.env'),
              prop: "env"
            },
            {
              label: this.$t('api.title'),
              prop: "title"
            },
            {
              label: this.$t('api.method'),
              prop: "method"
            },
            {
              label: this.$t('api.requestUri'),
              prop: "requestUri"
            },
            {
              label: this.$t('api.createTime'),
              prop: "createTime"
            },
            {
              label: this.$t('api.userAgent'),
              prop: "userAgent",
              span: 24,
              hide: true
            },
            {
              label: this.$t('api.params'),
              prop: "params",
              type: "textarea",
              span: 24,
              minRows: 2,
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
          viewBtn: this.vaildData(this.permission.log_api_view, false)
        };
      }
    },
    methods: {
      searchReset() {
        this.query = {};
        this.onLoad(this.page);
      },
      searchChange(params) {
        this.query = params;
        this.onLoad(this.page, params);
      },
      beforeOpen(done, type) {
        if (["edit", "view"].includes(type)) {
          getApiLogs(this.form.strId).then(res => {
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
        getApiList(page.currentPage, page.pageSize, Object.assign(params, this.query)).then(res => {
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
