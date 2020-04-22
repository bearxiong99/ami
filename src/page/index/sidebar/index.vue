<template>
  <div class="avue-sidebar" :style="{background: colorName1}">
    <logo></logo>
    <el-scrollbar style="height:100%">
      <div v-if="validatenull(menu)"
           class="avue-sidebar--tip">{{$t('menuTip')}}
      </div>
      <el-menu :default-active="nowTagValue"
               mode="horizontal"
               :background-color="colorName1"
               text-color="#fff"
               active-text-color="#fff">
        <sidebar-item :menu="menu"
                      :screen="screen"
                      first
                      :props="website.menu.props"
                      :collapse="keyCollapse"></sidebar-item>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
  import {mapGetters} from "vuex";
  import logo from "../logo";
  import sidebarItem from "./sidebarItem";

  export default {
    name: "sidebar",
    components: {sidebarItem, logo},
    data() {
      return {};
    },
    created() {
      this.$store.dispatch("GetMenu").then(data => {
        if (data.length === 0) return;
        this.$router.$avueRouter.formatRoutes(data, true);
      });
    },
    computed: {
      ...mapGetters(["website", "menu", "tag", "keyCollapse", "screen", 'colorName', 'colorName1']),
      nowTagValue: function () {
        return this.$router.$avueRouter.getValue(this.$route);
      }
    },
    mounted() {
    },
    methods: {
      menuOpen() {
        let w = document.body.clientWidth
        // console.log(w, '窗口宽度')
        let doms = document.querySelectorAll('body>.el-menu--horizontal')
        // console.log(doms, '展开过的菜单')
        for (let i = 0; i < doms.length; i++) {
          doms[i].classList.remove('left-start')
        }
        for (let i = 0; i < this.menu.length; i++) {
          let dom = document.querySelector('.submenu' + i)
          // console.log(dom, '每个一级菜单项')
          let l = dom.getBoundingClientRect().left
          // console.log(l, '一级菜单项left')
          let r = dom.getBoundingClientRect().right
          // console.log(l, '一级菜单项right')
          if ((w - r) < 250) {
            for (let j = 0; j < doms.length; j++) {
              let left = doms[j].style.left
              if (left.includes(l)) {
                doms[j].classList.add('left-start')
              }
            }
          }
        }
      },
    }
  };
</script>
<style lang="scss" scoped>
</style>

