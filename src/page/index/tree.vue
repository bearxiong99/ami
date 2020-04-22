<template>
  <div class="tree" ref="tree">
    <i class="el-icon-s-unfold place" style="font-size:24px;" @click="change" ref="icon"></i>
    <transition name="fade">
      <el-tabs v-show="show" v-model="activeName" @tab-click="handleClick">
        <el-tab-pane :label="$t('tree.org')" name="org">
          <org :show-tmnl="true" @node-click="click" />
        </el-tab-pane>

        <el-tab-pane :label="$t('tree.search')" name="search">
          <search @row-click="click" />
        </el-tab-pane>

        <el-tab-pane :label="$t('tree.group')" name="group">
          <group />
        </el-tab-pane>
      </el-tabs>
    </transition>
  </div>
</template>

<script>
// import {addTree} from './connact';
import Org from "./components/org";
import Search from "./components/search";
import Group from "./components/group";

let treeArr = [
  "/notice",
  "/archives",
  "/manualdcuclocksetting",
  "/instantaneousacquisition",
  "/dcuparamsettings",
  "/deviceremoteupgrade",
  "/broadcastupgrademonitor",
  "/meterremoteconnect",
  "/manualmeterclocksetting",
  "/loadprofileacquisition",
  '/maximumdemandacquisition',
  '/cumulativedemandacquisition',
  '/avgvoltagecurrentacquisition',
  '/DCUParamSettings',
  '/ManualDCUClockSetting',
  '/touacquisition',
  '/datacollectionmonitoring',
  '/eobacquisition',
  '/loadprofilequery',
  '/touquery',
  '/eobquery',
  '/avgvoltagecurrentquery',
  '/metereventquery',
  '/messagequery',
  '/dcuclockoffsetanalysis',
  '/meterclockoffsetanalysis',
  '/currentAcquisition',
  '/4gnbParamsettings',
  '/deviceReset',
  '/dcuTaskConfig',
  '/dcureplacement',
  '/loadtresholdconfig',
  '/eventPushFilter',
  '/meterparamsettings',
  '/meterdownLoadmode'
];

export default {
  components: {
    Org,
    Search,
    Group
  },
  data() {
    return {
      activeName: "org",
      show: false
    };
  },
  computed: {},
  watch: {
    $route(to,from) {
      // console.log(to, "to");
      let bol = treeArr.some(item => to.path.endsWith(item));
      treeArr.forEach(item=>{
        if(to.path.endsWith(item)){
          to.meta.keepAlive = true;
        }if(from.path.endsWith(item)){
          from.meta.keepAlive = true;
        }
      })
      if (bol) {
        this.$refs.tree.classList.add("treeActive");
        this.$refs.icon.classList.add("el-icon-s-fold");
        this.$refs.icon.classList.remove("el-icon-s-unfold");
        this.show = true;
      } else {
        this.$refs.tree.classList.remove("treeActive");
        this.$refs.icon.classList.remove("el-icon-s-fold");
        this.$refs.icon.classList.add("el-icon-s-unfold");
        this.show = false;
      }
    }
  },
  mounted() {
    if (sessionStorage.getItem("treetype") == 1) {
      this.$refs.tree.classList.add("treeActive");
      this.$refs.icon.classList.add("el-icon-s-fold");
      this.$refs.icon.classList.remove("el-icon-s-unfold");
      this.show = true;
    } else {
      this.$refs.tree.classList.remove("treeActive");
      this.$refs.icon.classList.remove("el-icon-s-fold");
      this.$refs.icon.classList.add("el-icon-s-unfold");
      this.show = false;
    }
  },
  methods: {
    // 标签切换
    handleClick(tab) {
      this.activeName = tab.name;
    },
    // icon点击
    change() {
      if (this.show) {
        this.$refs.tree.classList.remove("treeActive");
        this.$refs.icon.classList.remove("el-icon-s-fold");
        this.$refs.icon.classList.add("el-icon-s-unfold");
      } else {
        this.$refs.tree.classList.add("treeActive");
        this.$refs.icon.classList.add("el-icon-s-fold");
        this.$refs.icon.classList.remove("el-icon-s-unfold");
      }
      this.show = !this.show;
    },
    click(data) {
      // todo
      this.$store.commit("SET_TREE_NODE", data);
      this.$emit("click", data);
    }
  }
};
</script>

<style scoped lang="scss">
.tree {
  background: #fff;
  padding: 0 20px;
  position: relative;
  box-sizing: border-box;
  border: 1px solid #eeeeee;
  height: calc(100vh - 120px);
  .place {
    position: absolute;
    top: 10px;
    right: 10px;
    cursor: pointer;
    z-index: 33;
  }
  transition: width 0.5s;
  .treecont {
    line-height: 100%;
    img {
      vertical-align: middle;
    }
  }
}

.treeActive {
  min-width: 350px;
  height: calc(100vh - 120px);
}

.shuttle {
  display: flex;
  justify-content: space-around;
  // align-items: center;
  .box {
    border: 1px solid #ebeff2;
    width: 320px;
    h1 {
      text-align: center;
      height: 32px;
      line-height: 32px;
      background: #f5f8fb;
    }
  }
}
</style>
