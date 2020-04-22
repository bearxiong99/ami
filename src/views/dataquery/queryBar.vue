<template>
  <div>
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item :label="formLabel.objectName">
        <el-input :maxlength="30" v-model="formInline.objectName" :placeholder="formLabel.objectName" readonly></el-input>
      </el-form-item>
      <el-form-item :label="formLabel.objectType">
        <el-input :maxlength="30" v-model="formInline.objectType" :placeholder="formLabel.objectType" readonly></el-input>
      </el-form-item>
      <el-form-item :label="formLabel.calender">
        <el-date-picker
          v-model="formInline.startDate"
          :type="type"
          :format="format"
          :clearable="clearAble">
        </el-date-picker>
      </el-form-item>
      <el-form-item :label="formLabel.to">
        <el-date-picker
          v-model="formInline.endDate"
          :type="type"
          :format="format"
          :clearable="clearAble">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit" icon="el-icon-search">{{formLabel.search}}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  export default {
    name: "queryBar",
    props: {
      'format': String,
      'type': String,

    },
    data() {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
      return {
        clearAble: false,
        formInline: {
          objectNo: '',
          objectName: '',
          objectType: '',
          startDate: new Date(start.getFullYear(), start.getMonth(), start.getDate(), 0, 0),
          endDate: new Date(end.getFullYear(), end.getMonth(), end.getDate(), 0, 0)
        },
        formLabel:{
          objectName:this.$t('avgVoltageCurrentQuery.objectName'),
          objectType:this.$t('avgVoltageCurrentQuery.objectType'),
          calender:this.$t('payset.calender'),
          to:this.$t('avgVoltageCurrentQuery.to'),
          startDate:this.$t('global.startDate'),
          endDate:this.$t('global.endDate'),
          search:this.$t('auto.search'),
          exportDialog:this.$t('avgVoltageCurrentQuery.export')
        },
      }
    },
    created() {
      // this.onSubmit();
    },
    methods: {
      onSubmit() {
        let startDate = this.formInline.startDate;
        let endDate = this.formInline.endDate;
        if (this.format === 'yyyy-MM-dd') {
          startDate = startDate.getFullYear() + "-" + this.isAddZero(startDate.getMonth() + 1)
            + "-" + this.isAddZero(startDate.getDate());
          endDate = endDate.getFullYear() + "-" + this.isAddZero(endDate.getMonth()+1)
            + "-" + this.isAddZero(endDate.getDate());
        }else if(this.format === 'yyyy-MM') {
          startDate = startDate.getFullYear() + "-" + this.isAddZero(startDate.getMonth() + 1);
          endDate = endDate.getFullYear() + "-" + this.isAddZero(endDate.getMonth()+1);
        } else {
          startDate=startDate.getFullYear() + "-" + this.isAddZero(startDate.getMonth() + 1)
            + "-" + this.isAddZero(startDate.getDate()) + " " + this.isAddZero(startDate.getHours()) + ":" + this.isAddZero(startDate.getMinutes());
          endDate = endDate.getFullYear() + "-" + this.isAddZero(endDate.getMonth()+1)
            + "-" + this.isAddZero(endDate.getDate()) + " " + this.isAddZero(endDate.getHours()) + ":" + this.isAddZero(endDate.getMinutes());
        }
        let objectNo = this.formInline.objectNo;
        let objectName = this.formInline.objectName;
        let objectType = this.formInline.objectType;
        this.$emit("onSubmit", {objectNo, objectName, objectType, startDate, endDate})
      },
      isAddZero(time){
        if(time < 10){
          return "0" + time;
        }else {
          return time;
        }
      },
    },
    watch: {
      '$store.state.common.treeNode': function (data) {
        this.formInline.objectName = data.deviceName;
        if(data.deviceType === 'org') {
          this.formInline.objectType = "mru";
        }else if(data.deviceType === 'meter'){
          this.formInline.objectType = "Meter";
        }else{
          if(data.deviceModel === "NBonline" || data.deviceModel === "NBoffline") {
            this.formInline.objectType = "NB Meter";
          }else if (data.deviceModel === "fourGonline" || data.deviceModel === "fourGoffline") {
            this.formInline.objectType = "4G Meter";
          }else {
            this.formInline.objectType = "DCU";
          }
        }
        this.formInline.objectNo = data.deviceNo;
      }
    }
  }
</script>

<style scoped>

</style>
