<template>
  <div class="menu-wrapper">
    <template v-for="(item, index) in menu">
      <el-menu-item v-if="validatenull(item[childrenKey]) && vaildRoles(item)"
                    :index="item[pathKey]"
                    @click="open(item)"
                    :key="item[labelKey]"
                    :class="{'is-active':vaildAvtive(item)}">
        <i :class="item[iconKey]"></i>
        <span slot="title"
              :alt="item[pathKey]">{{generateTitle(item)}}</span>
      </el-menu-item>
      <el-submenu v-else-if="!validatenull(item[childrenKey])&&vaildRoles(item)"
                  :index="item[pathKey]"
                  :key="item[labelKey]"
                  :class="'submenu' + index">
        <template slot="title">
          <i :class="item[iconKey]"></i>
          <span slot="title"
                :class="{'el-menu--display':collapse && first}">{{generateTitle(item)}}</span>
        </template>
        <template v-for="(child,cindex) in item[childrenKey]">
          <el-menu-item :index="child[pathKey],cindex"
                        @click="open(child)"
                        :class="{'is-active':vaildAvtive(child)}"
                        v-if="validatenull(child[childrenKey])"
                        :key="child[labelKey]">
            <i :class="child[iconKey]"></i>
            <span slot="title">{{generateTitle(child)}}</span>
          </el-menu-item>
          <el-submenu v-else
                        :index="child[pathKey]"
                        :key="cindex"
                        class="item-submenu"
                        @mouseover.native="submenuOpen">
              <template slot="title">
                <i :class="child.source" style="margin-right:5px;color:#fff"></i>
                <span slot="title">{{generateTitle(child)}}</span>
              </template>
              <template v-for="subChild in child.children">
                <el-menu-item :index="subChild.path"
                              :key="subChild.id"
                              @click="open(subChild)">
                    <i :class="subChild.source"></i>
                    <span slot="title">{{generateTitle(subChild)}}</span>
                </el-menu-item>
              </template>
          </el-submenu>
        </template>
      </el-submenu>
    </template>
  </div>
</template>
<script>
  import {mapGetters} from "vuex";
  import {validatenull} from "@/util/validate";
  import config from "./config.js";

  export default {
    name: "sidebarItem",
    data() {
      return {
        config: config
      };
    },
    props: {
      menu: {
        type: Array
      },
      screen: {
        type: Number
      },
      first: {
        type: Boolean,
        default: false
      },
      props: {
        type: Object,
        default: () => {
          return {};
        }
      },
      collapse: {
        type: Boolean
      }
    },
    created() {
    },
    mounted() {
    },
    computed: {
      ...mapGetters(["roles"]),
      labelKey() {
        return this.props.label || this.config.propsDefault.label;
      },
      pathKey() {
        return this.props.path || this.config.propsDefault.path;
      },
      iconKey() {
        return this.props.icon || this.config.propsDefault.icon;
      },
      childrenKey() {
        return this.props.children || this.config.propsDefault.children;
      },
      nowTagValue() {
        return this.$router.$avueRouter.getValue(this.$route);
      }
    },
    methods: {
      generateTitle(item) {
        return this.$router.$avueRouter.generateTitle(
          item[this.labelKey],
          (item.meta || {}).i18n
        );
      },
      vaildAvtive(item) {
        const groupFlag = (item["group"] || []).some(ele =>
          this.$route.path.includes(ele)
        );
        return this.nowTagValue === item[this.pathKey] || groupFlag;
      },
      vaildRoles(item) {
        item.meta = item.meta || {};
        return item.meta.roles ? item.meta.roles.includes(this.roles) : true;
      },
      validatenull(val) {
        return validatenull(val);
      },
      open(item) {
        if (this.screen <= 1) this.$store.commit("SET_COLLAPSE");
        this.$router.$avueRouter.group = item.group;
        this.$router.$avueRouter.meta = item.meta;
        this.$router.push({
          path: this.$router.$avueRouter.getPath({
            name: item[this.labelKey],
            src: item[this.pathKey],
            i18n: (item.meta || {}).i18n
          }),
          query: item.query
        });
      },
      submenuOpen() {
        // let arrL = []
        // let arrR = []
        // let arr = []
        
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
          // arrL.push(l)
          // console.log(l, '一级菜单项' + i + '的left')
          let r = dom.getBoundingClientRect().right
          // arrR.push(r)
          // console.log(l, '一级菜单项' + i + '的right')
          if ((w - r) < 300) {
            for (let j = 0; j < doms.length; j++) {
              let left = parseFloat(doms[j].style.left)
              if (Math.abs(left - l) < 100) {
                doms[j].classList.add('left-start')
                // console.log(left, '向左菜单的left')
                // arr.push(left)
              }
            }
          }
        }
        // console.log(arrL, arrR, new Set(arr))
      },
    }
  };
</script>

