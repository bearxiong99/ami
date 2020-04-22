<template>
  <!-- <el-dropdown trigger="click"
               @command="handleSetLanguage">
    <i class="icon-zhongyingwen"></i>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item :disabled="language==='zh'"
                        command="zh">中文
      </el-dropdown-item>
      <el-dropdown-item :disabled="language==='en'"
                        command="en">English
      </el-dropdown-item>
      <el-dropdown-item :disabled="language==='ar'"
                        command="ar">عربى
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown> -->
  <el-select v-model="languages" style="width: 100%;" @change='handleSetLanguage'>
    <el-option label="English" value="en"></el-option>
    <el-option label="中文" value="zh"></el-option>
    <el-option label="عربى" value="ar"></el-option>
  </el-select>
</template>

<script>
  import {mapGetters} from "vuex";

  export default {
    name: "top-lang",
    data() {
      return {
        languages:''
      };
    },
    created() {
    },
    mounted() {
      this.languages=this.language
    },
    computed: {
      ...mapGetters(["language", "tag"])
    },
    props: [],
    methods: {
      handleSetLanguage(lang) {
        this.$i18n.locale = lang;
        this.$store.commit("SET_LANGUAGE", lang);
        let tag = this.tag;
        let title = this.$router.$avueRouter.generateTitle(
          tag.label,
          (tag.meta || {}).i18n
        );
        //根据当前的标签也获取label的值动态设置浏览器标题
        this.$router.$avueRouter.setTitle(title);
      }
    }
  };
</script>

<style lang="scss" scoped>
</style>
