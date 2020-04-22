<template>
  <avue-crud :data="logsList"
             :option="option">
    <template slot="menuLeft">
      <el-button type="primary"
                 size="small"
                 icon="el-icon-upload"
                 @click="send">{{$t('logs.upload')}}
      </el-button>
      <el-button type="danger"
                 size="small"
                 icon="el-icon-delete"
                 @click="clear">{{$t('logs.clear')}}
      </el-button>
    </template>
    <template slot-scope="scope"
              slot="type">
      <el-tag type="danger"
              size="small">{{scope.label}}
      </el-tag>
    </template>
    <template slot-scope="props"
              slot="expand">
      <pre class="code">
        {{props.row.stack}}
      </pre>
    </template>
  </avue-crud>
</template>

<script>
  import {mapGetters} from "vuex";

  export default {
    name: "errLogs",
    data() {
      return {
        option: {
          menu: false,
          addBtn: false,
          page: false,
          border: true,
          expand: true,
          refreshBtn: false,
          headerAlign: "center",
          column: [
            {
              label: this.$t('logs.type'),
              prop: "type",
              width: 80,
              align: "center",
              solt: true,
              dicData: [
                {
                  label: "bug",
                  value: "error"
                }
              ]
            },
            {
              label: this.$t('logs.url'),
              width: 200,
              prop: "url",
              overHidden: true
            },
            {
              label: this.$t('logs.message'),
              prop: "message",
              overHidden: true
            },
            {
              label: this.$t('logs.stack'),
              prop: "stack",
              hide: true
            },
            {
              label: this.$t('logs.time'),
              align: "center",
              prop: "time",
              width: 200
            }
          ]
        }
      };
    },
    created() {
    },
    mounted() {
    },
    computed: {
      ...mapGetters(["logsList"])
    },
    props: [],
    methods: {
      send() {
        this.$confirm(this.$t('logs.confirmUpload'), this.$t('logs.tip'), {
          confirmButtonText: this.$t('global.confirm'),
          cancelButtonText: this.$t('global.cancel'),
          type: "warning"
        })
          .then(() => {
            this.$store.dispatch("SendLogs").then(() => {
              this.$parent.$parent.box = false;
              this.$message({
                type: "success",
                message: this.$t('logs.sendSuccess')
              });
            });
          })
          .catch(() => {
          });
      },
      clear() {
        this.$confirm(this.$t('logs.confirmClear'), this.$t('logs.tip'), {
          confirmButtonText: this.$t('global.confirm'),
          cancelButtonText: this.$t('global.cancel'),
          type: "warning"
        })
          .then(() => {
            this.$store.commit("CLEAR_LOGS");
            console.log(this);
            this.$parent.$parent.box = false;
            this.$message({
              type: "success",
              message: this.$t('logs.clearSuccess')
            });
          })
          .catch(() => {
          });
      }
    }
  };
</script>

<style lang="scss" scoped>
  .code {
    font-size: 12px;
    display: block;
    font-family: monospace;
    white-space: pre;
    margin: 1em 0px;
  }
</style>
