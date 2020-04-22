<template>
  <div class="pro">
    <span>{{propData.current}}/{{propData.total}}</span>
    <el-progress :text-inside="true" :stroke-width="18" :percentage="percentage" style="width:200px;margin-top:8px;"></el-progress>
  </div>
</template>

<script>
export default {
  props:{
    tage:{
      type: Number,
      default: 0
    },
    propData:{
      type: Object,
    }
  },
  components: {

  },
  data() {
    return {
    };
  },
  computed: {
    percentage(){
      return parseInt(this.propData.current/this.propData.total)*100 || 0
    }
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
.pro{
  width: 250px;
  padding-left: 60px;
  position: relative;
  height: 40px;
  line-height: 40px;
  border-top: 1px solid transparent;
  span{
    position: absolute;
    left: 0;
  }
}

</style>
