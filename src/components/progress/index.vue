<template>
  <div class="progess">
    <span :class="{text:num==100}" style="padding-right:10px;">{{$t('sitemanage.waitrecv')}}</span>
    <el-progress :text-inside="true" :stroke-width="18" :percentage="num" style="width:200px;line-height:40px;"></el-progress>
    <!-- <span>{{rate.success}}/{{rate.total}}</span> -->
  </div>
</template>

<script>
export default {
  props:['num'],
  components: {

  },
  data() {
    return {
      
    };
  },
  computed: {

  },
  created() {

  },
  mounted() {

  },
  methods: {

  },
};
</script>

<style scoped lang="scss">
.progess{
  width: 380px;
  display: flex;
  span{
    display: inline-block;
    margin-left:10px;
  }
}
.text{
  opacity: 0;
}
</style>
