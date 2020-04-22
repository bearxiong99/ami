<template>
  <basic-container :bg="'#fff'">
    <div class="routerbox home" ref="home">
      <div class="cont contT" ref="cont">
        <div class="tablebox">
          <component :is="currentView" v-if="hackReset"></component>
        </div>
      </div>
    </div>
  </basic-container>
</template>

<script>
// import tree from '../../common/tree';
import city from "./city";
import lines from "./lines";
import transformer from "./transformer";
import town from "./town";
import dcu from "./dcu";
import emeter from "./emeter";
import {mapGetters} from "vuex";

// import meters from './meters';
export default {
  components: { city, lines, transformer, dcu, emeter, town },
  data() {
    return {
      hackReset: true,
    };
  },
  computed: {
    ...mapGetters(['level', 'treeNode']),
    currentView () {
        if (this.treeNode) {
          if (this.treeNode.deviceType === 'tmnl') {
            this.reload()
            return 'emeter';
          } else if (this.treeNode.deviceType === 'meter') {
            this.reload()
            return
          }
        }
        if (this.level === 1 ) {
            this.reload();
            return 'city';
        } else if (this.level === 2) {
            this.reload();
            return 'town';
        } else if (this.level === 3) {
            this.reload();
            return 'lines';
        } else if (this.level === 4) {
            this.reload();
            return 'transformer';
        } else if (this.level === 5) {
            this.reload();
            return 'dcu';
        } else if (this.level === 6) {
            this.reload();
            return 'emeter';
        }  else {
            this.reload();
            // return 'city';
        }
    }
  },
  // watch: {
  //   "$store.state.common.treeNode": function(treeNode) {
  //     this.devNo=treeNode.deviceNo;
  //   }
  // },
  mounted() {},
  methods: {
    reload() {
      this.hackReset = false;
      this.$nextTick(() => {
        this.hackReset = true;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.home {
  .cont {
    width: 100%;
    box-sizing: border-box;
    background: #fff;
    .forms {
      padding: 0.32rem 0.36rem;
      background: #fafafa;
      border: 1px solid #eeeeee;
    }
  }
}
.contT {
  h1 {
    height: 50px;
    line-height: 50px;
    border-bottom: 2px solid #eeeeee;
    margin-bottom: 20px;
    padding-left: 10px;
    font-size: 20px;
  }
}
</style>
