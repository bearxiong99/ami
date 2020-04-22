<template>
  <div>
    <el-row :gutter="22">
      <el-col :span="18" v-if="showSearch">
        <el-input
          clearable
          :placeholder="$t('tree.enterKeyword')"
          v-model="filterText"
          :maxlength="30">
        </el-input>
      </el-col>
      <el-col :span="showSearch ? 6 : 24">
        <el-button v-if="showRefreshText" @click="refresh" :style="{color: colorName, 'border-color': colorName}"
                   class="refresh" icon="el-icon-refresh" :disabled="disabled">{{$t('tree.refresh')}}
        </el-button>
        <el-button v-else @click="refresh" type="text">
          <i class="el-icon-refresh" style="font-size: 18px " :disabled="disabled"></i>
        </el-button>
      </el-col>
    </el-row>
    <div :style="{'height':tableHeight+'px'}" style="overflow-y:auto;" ref="boxheight">
      <el-tree
        ref="tree"
        :props="props"
        :load="loadNode"
        :expand-on-click-node="false"
        :highlight-current="true"
        node-key="deviceNo"
        :default-expanded-keys="defaultExpandedKeys"
        :show-checkbox="showCheckbox"
        :filter-node-method="filterNode"
        lazy
        @check="changeCheck"
        @node-click="nodeClick">
          <span slot-scope="{ node, data }">
            <span
              :class="['tree-ico', data.deviceModel]"></span>
            <span>{{ node.label }}</span>
          </span>
      </el-tree>
    </div>
  </div>
</template>

<script>
  import {childMeters, childs, getchildOrgs, getDefaultExpand, getSelfOrgs, getTopOrg} from '@/api/system/tree'
  import {mapGetters} from 'vuex';

  export default {
    name: "org",
    props: {
      // 是否显示终端 + 电表
      showTmnl: {
        type: Boolean,
        default: false
      },
      showCheckbox: {
        type: Boolean,
        default: false
      },
      showRefreshText: {
        type: Boolean,
        default: true
      },
      showSearch: {
        type: Boolean,
        default: false
      },
      isLoadAll: {
        type: Boolean,
        default: false
      },
      isGetAll: {
        type: Boolean,
        default: false
      },
    },
    data() {
      return {
        filterText: '',
        props: {
          label: 'deviceName'
        },
        node: [],
        resolve: [],
        defaultExpandedKeys: [],
        hasLoadAll: false,
        tableHeight:window.innerHeight - 230,
        disabled: false
      }
    },
    mounted() {
      if (this.isLoadAll) {
        this.loadAll(() => {
        })
      }
      window.onresize = () => {
        this.tableHeight = window.innerHeight - 230 ;
      };
    },
    computed: {
      ...mapGetters(['treeNode', 'colorName'])
    },
    watch: {
      filterText(val) {
        this.loadAll(() => {
          this.$refs.tree.filter(val);
        })
      },
      treeNode: function (data) {
        // console.log(data)
        /**
         data: {
          deviceType: "tmnl", // org 供电区域 tmnl 终端 meter 电表
          deviceNo: "HLY1111111100002",// org时 orgNo tmnl 终端地址 meter 电表id
          deviceName: "HLY1111111100002"// org时 orgName tmnl 终端地址 meter 电表id
        }**/
      },
    },
    methods: {
      // 过滤
      filterNode(value, data) {
        console.log(value, data)
        if (!value) return true;
        return data.deviceName.indexOf(value) !== -1;
      },
      // 懒加载tree node
      loadNode(node, resolve) {
        if (node.level === 0) {
          this.disabled = true
          this.node = node
          this.resolve = resolve
          let getData = this.isGetAll ? getTopOrg : getSelfOrgs
          getData().then(res => {
            this.disabled = false
            return resolve(res.data.data);
          });
        }
        if (node.level > 0) {
          let deviceType = node.data.deviceType
          let deviceNo = node.data.deviceNo
          let device={
              'tmnlAddr':node.data.deviceNo,
               'isOnline':node.data.isOnline
          }
          switch (deviceType) {
            case "org":
              let getData = this.showTmnl ? childs : getchildOrgs
              getData(deviceNo).then(res => {
                return resolve(res.data.data);
              });
              break
            case "tmnl":
              childMeters(device).then(res => {
                return resolve(res.data.data);
              });
              break
          }
          return resolve([]);
        }
      },
      // tree点击
      nodeClick(node, data) {
        this.$store.commit("SET_LEVEL", data.level);
        this.$emit('node-click', node)
      },
      // 刷新
      refresh() {
        this.node.childNodes = []
        this.defaultExpandedKeys = []
        this.hasLoadAll = false
        this.loadNode(this.node, this.resolve)
      },
      // 加载全部数据
      loadAll(fun) {
        if (!this.hasLoadAll) {
          getDefaultExpand().then(res => {
            this.defaultExpandedKeys = res.data.data
            this.hasLoadAll = true
            fun()
          });
        } else {
          fun()
        }
      },
      // checkBox点击事件
      changeCheck(node, data) {
        this.$emit('check', node, data)
      },
      setChecked(checkedKeys) {
        // this.$refs.tree.setCheckedKeys(checkedKeys);
      }
    }
  }
</script>

<style scoped lang="scss">
  .tree-ico {
    width: 16px;
    height: 16px;
    display: inline-block;
    margin-right: 10px;
  }

  .online {
    background: url("/img/tree/online.png") top center no-repeat;
  }

  .outline {
    background: url("/img/tree/outline.png") top center no-repeat;
  }

  .meter {
    background: url("/img/tree/meter.png") top center no-repeat;
  }

  .meterOffline{
    background: url("/img/tree/meterOffline.png") top center no-repeat;
  }

  .saudiArabia{
    background: url("/img/tree/saudiArabia.png") top center no-repeat;
  }

  .org {
    background: url("/img/tree/org.png") top center no-repeat;
  }

  .department{
    background: url("/img/tree/department.png") top center no-repeat;
  }

  .office{
    background: url("/img/tree/office.png") top center no-repeat;
  }

  .mru{
    background: url("/img/tree/mru.png") top center no-repeat;
  }

  .DCUonline{
    background: url("/img/tree/DCUonline.png") top center no-repeat;
  }

  .DCUoffline{
    background: url("/img/tree/DCUoffline.png") top center no-repeat;
  }

  .fourGoffline{
    background: url("/img/tree/fourGoffline.png") top center no-repeat;
  }


  .fourGonline{
    background: url("/img/tree/fourGonline.png") top center no-repeat;
  }

  .NBoffline{
    background: url("/img/tree/NBoffline.png") top center no-repeat;
  }


  .NBonline{
    background: url("/img/tree/NBonline.png") top center no-repeat;
  }


  .refresh {
    width: 100%;
    border: 1px solid #fff;
    font-size: 16px;
  }
</style>
