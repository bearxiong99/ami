<template>
  <div class="searchcss">
    <span @click="seachfromFun">
      <img src="img/query.png" alt />
      {{$t('global.specificquery')}}
    </span>
    <el-dialog
      :title="this.$t('global.specificquery')"
      :visible.sync="dialogVisible"
      width="40%"
      :before-close="handleClose">
      <el-form
        :model="searchForm"
        ref="form"
        label-width="200px"
        label-position="left"
        style="width:400px;margin-left:100px;"
        v-if="isType===0"
      >
        <el-form-item :label="$t('remote.deviceName')">
          <el-input :maxlength="30" v-model="searchForm.serachValue"></el-input>
        </el-form-item>
        <el-form-item :label="$t('change.manufacturer')">
          <el-select v-model="searchForm.factoryCode" style="width:100%">
            <el-option :label="$t('auto.all')" :value="-1"></el-option>
            <el-option
              v-for="item in factoryList"
              :key="item.value"
              :label="item.typeName"
              :value="item.typeCode"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('auto.meterType')">
          <el-select v-model="searchForm.type" style="width:100%">
            <el-option :label="$t('auto.all')" :value="-1"></el-option>
            <el-option
              v-for="item in meterTypeList"
              :key="item.value"
              :label="item.typeName"
              :value="item.typeCode"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item :label="$t('auto.commtype')">
          <el-input :maxlength="30" v-model="searchForm.name"></el-input>
        </el-form-item> -->
      </el-form>

      
      <el-form
        :model="searchDCUForm"
        ref="form"
        label-width="200px"
        label-position="left"
        style="width:400px;margin-left:100px;"
        v-else
      >
        <el-form-item :label="$t('remote.deviceName')">
          <el-input :maxlength="30" v-model="searchDCUForm.serachValue"></el-input>
        </el-form-item>
        <el-form-item :label="$t('change.manufacturer')">
          <el-select v-model="searchDCUForm.factoryCode" style="width:100%">
            <el-option :label="$t('auto.all')" :value="-1"></el-option>
            <el-option
              v-for="item in factoryList"
              :key="item.value"
              :label="item.typeName"
              :value="item.typeCode"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <p slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible=false">{{$t('global.cancel')}}</el-button>
        <el-button type="primary" @click="confirm">{{$t('global.confirm')}}</el-button>
      </p>
    </el-dialog>
  </div>
</template>

<script>
import {  getViewList } from "@/api/autoRegister";
import { mapGetters } from "vuex";
export default {
  props:{
    isType:{
      type:Number,
      default:0   //0是电表查询 1是集中器查询
    }
  },
  data() {
    return {
      searchForm:{
        factoryCode:-1,
        type:-1,
        serachValue:''
      },
      searchDCUForm:{
        serachValue:'',
        factoryCode:-1,
      },
      dialogVisible:false,
      factoryList:[],
      meterTypeList:[],
    };
  },
  watch: {
    treeNode: function() {
      if(this.isType==0){
        this.searchForm=this.$options.data().searchForm;
      }else{
        this.searchDCUForm=this.$options.data().searchDCUForm;
      }
    }
  },
  computed: {
    ...mapGetters(["treeNode"])
  },
  created() {

  },
  mounted() {
    this.getView();
  },
  methods: {
    getView() {
      getViewList({
        viewType: "meterType"
      }).then(res => {
        this.meterTypeList = res.data.data.list;
      })
      getViewList({
        viewType: "meterFactoryType"
      }).then(res => {
        this.factoryList = res.data.data.list;
      });
    },
    seachfromFun(){
      this.dialogVisible=true;
    },
    confirm(){
      this.dialogVisible=false;
      if(this.isType==0){
        this.$emit('searchFun',this.searchForm)
      }else{
        this.$emit('searchFun',this.searchDCUForm)
      }
    },
    handleClose(){
      this.dialogVisible=false;
    }
  },
};
</script>

<style scoped lang="scss">
.searchcss{
  span{
    display: inline-block;
    height: 20px;
    line-height: 20px;;
    box-sizing: border-box;
    padding: 0 20px;
    cursor: pointer;
    border-left: 1px solid #ddd;
    img{
      vertical-align: middle;
    }
  }
}
</style>
