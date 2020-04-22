<template>
  <div class="emeter">
    <!-- <h1>Meter</h1>
    <el-table
      ref="multipleTable"
      :data="basicdata"
      style="width: 100%;margin-top:10px;"
      @selection-change="emeterSelectionChange"
      border
      :header-cell-style="{background:'#F2F2F2',color:'rgb(51,51,51)'}"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="id" label="ID" width="55">
        <template slot-scope="scope">{{ scope.row.id }}</template>
      </el-table-column>
      <el-table-column prop="disc" label="Name"></el-table-column>
      <el-table-column prop="status" label="Status"></el-table-column>
      <el-table-column prop="tagno" label="Tag No"></el-table-column>
      <el-table-column prop="meterno" label="Meter No"></el-table-column>
      <el-table-column prop="type" label="Type"></el-table-column>
      <el-table-column prop="metertypeid" label="Meter Model"></el-table-column>
      <el-table-column prop="ruleid" label="Rule"></el-table-column>
    </el-table>
    <div class="forms">
      <el-form
        :model="formMeter"
        label-width="2.2rem"
        label-position="left"
        :rules="meterRules"
      >
        <el-form-item label="Name:" prop="name">
          <el-input :maxlength="30" v-model="formMeter.disc" style="width:4.5rem;" size="small"></el-input>
        </el-form-item>
        <el-form-item label="Status:" prop="stauts">
          <el-select v-model="formMeter.stauts" style="width:3.5rem;" size="small" placeholder>
            <el-option label="Disable(removed)" value="1"></el-option>
            <el-option label="Opration" value="2"></el-option>
            <el-option label="Storage is not installed" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Tag No:">
          <el-input :maxlength="30" v-model="formMeter.tagno" style="width:3.5rem;" size="small"></el-input>
        </el-form-item>
        <el-form-item label="Meter No:" prop="meterno">
          <el-input :maxlength="30" v-model="formMeter.meterno" style="width:3.5rem;" size="small"></el-input>
        </el-form-item>
        <el-form-item label="Type:">
          <el-select v-model="formMeter.type" style="width:3.5rem;" size="small" placeholder>
            <el-option
              v-for="item in meterTypeList"
              :key="item.code"
              :label="changeClass(item.disc)"
              :value="item.code"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="CT:" prop="ct">
          <el-select v-model="formMeter.ct" style="width:3.5rem;" size="small" placeholder>
            <el-option
              v-for="item in ctList"
              :key="item.code"
              :label="item.disc"
              :value="item.code"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="PT:" prop="pt">
          <el-select v-model="formMeter.pt" style="width:3.5rem;" size="small" placeholder>
            <el-option
              v-for="item in ptList"
              :key="item.code"
              :label="item.disc"
              :value="item.code"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Meter Model:" prop="metermodel">
          <el-select v-model="formMeter.metermodel" style="width:3.5rem;" size="small" placeholder>
            <el-option
              v-for="item in metermoList"
              :key="item.code"
              :label="item.disc"
              :value="item.code"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Communication Address:" prop="commaddress">
          <el-input :maxlength="30" v-model="formMeter.commaddress" style="width:2.5rem;" size="small"></el-input>
        </el-form-item>
        <el-form-item label="App Type:" prop="apptype">
          <el-select v-model="formMeter.apptype" style="width:2.5rem;" size="small" placeholder>
            <el-option
              v-for="item in appTypeList"
              :key="item.code"
              :label="item.disc"
              :value="item.code"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Rule:" prop="rule">
          <el-select v-model="formMeter.rule" style="width:2.5rem;" size="small" placeholder>
            <el-option
              v-for="item in ruleList"
              :key="item.code"
              :label="item.disc"
              :value="item.code"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Key User:" prop="keyuser">
          <el-select v-model="formMeter.keyuser" style="width:2.5rem;" size="small" placeholder>
            <el-option
              v-for="item in userList"
              :key="item.code"
              :label="item.disc"
              :value="item.code"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="LLS Password:" prop="llspass">
          <el-input :maxlength="30" v-model="formMeter.llspass" style="width:2.5rem;" size="small"></el-input>
        </el-form-item>
      </el-form>
      <div class="btns" style="margin-top:20px;text-align:right;">
        <el-button type="success" size="small" icon="el-icon-plus" @click="add">New</el-button>
        <el-button type="success" size="small" icon="el-icon-edit">Apply</el-button>
        <el-button type="success" size="small" icon="el-icon-delete">Detele</el-button>
        <el-button type="success" size="small" icon="el-icon-upload2">Export</el-button>
      </div>
    </div> -->
  </div>
</template>

<script>
export default {
    // components: {},
    // data() {
    //   return {
    //     basicdata: [],
    //     formMeter:{
    //       name:"",
    //       status:"",
    //       tagno:"",
    //       meterno:"",
    //       type:"",
    //       ct:"",
    //       pt:"",
    //       metermodel:"",
    //       commaddress:"",
    //       apptype:"",
    //       rule:"",
    //       keyuser:"",
    //       llspass:""
    //     },
    //     meterRules:{
    //       name:[
    //         { required: true, message: '输入名称', trigger: 'blur' },
    //       ],
    //       status:[
    //         { required: true, message: '输入名称', trigger: 'blur' },
    //       ],
    //       meterno:[
    //         { required: true, message: '输入名称', trigger: 'blur' },
    //       ],
    //       ct:[
    //         { required: true, message: '输入名称', trigger: 'blur' },
    //       ],
    //       pt:[
    //         { required: true, message: '输入名称', trigger: 'blur' },
    //       ],
    //       metermodel:[
    //         { required: true, message: '输入名称', trigger: 'blur' },
    //       ],
    //       commaddress:[
    //         { required: true, message: '输入名称', trigger: 'blur' },
    //       ],
    //       apptype:[
    //         { required: true, message: '输入名称', trigger: 'blur' },
    //       ],
    //       rule:[
    //         { required: true, message: '输入名称', trigger: 'blur' },
    //       ],
    //       keyuser:[
    //         { required: true, message: '输入名称', trigger: 'blur' },
    //       ],
    //       llspass:[
    //         { required: true, message: '输入名称', trigger: 'blur' },
    //       ],
    //     },
    //     protocolList: [],
    //     timeList: [],
    //     channeiList: [],
    //     tempList: [],
    //     typeList: [],
    //     statusList: [],
    //     factoryList: [],
    //     readList: [],
    //     meterTypeList:[],
    //     ctList:[],
    //     ptList:[],
    //     metermoList:[],
    //     appTypeList:[],
    //     ruleList:[],
    //     userList:[]
    //   };
    // },
    // computed: {},
    // created() {},
    // mounted() {
    //   this.getList();
    // },
    // methods: {
    //   emeterSelectionChange(val) {
    //     if(val.length>0){
    //       this.formMeter=val[0];
    //     }
    //   },
    //   add() {},
    //   getList() {
    //     let accountid = localStorage.getItem("accountid");
    //     this.$request("getComboDataByParam", {
    //       params: {
    //         comboId: 5
    //       }
    //     }).then(res => {
    //       this.protocolList = res.data.listitem;
    //     });
    //     this.$request("getComboDataByParam", {
    //       params: {
    //         comboId: 10020
    //       }
    //     }).then(res => {
    //       this.timeList = res.data.listitem;
    //     });
    //     this.$request("getComboDataByParam", {
    //       params: {
    //         comboId: 10003
    //       }
    //     }).then(res => {
    //       this.channeiList = res.data.listitem;
    //     });
    //     this.$request("getComboDataByParam", {
    //       params: {
    //         comboId: 10021
    //       }
    //     }).then(res => {
    //       this.tempList = res.data.listitem;
    //     });
    //     this.$request("getComboDataByParam", {
    //       params: {
    //         comboId: 17
    //       }
    //     }).then(res => {
    //       this.typeList = res.data.listitem;
    //     });
    //     this.$request("getComboDataByParam", {
    //       params: {
    //         comboId: 10004
    //       }
    //     }).then(res => {
    //       this.factoryList = res.data.listitem;
    //     });
    //     this.$request("getComboDataByParam", {
    //       params: {
    //         comboId: 3
    //       }
    //     }).then(res => {
    //       this.statusList = res.data.listitem;
    //     });
    //     this.$request("getComboDataByParam", {
    //       params: {
    //         comboId: 10002
    //       }
    //     }).then(res => {
    //       this.readList = res.data.listitem;
    //     });
    //   },
    //   changeClass(val) {
    //     return this.$t(val);
    //   },
    //   showStatusCont(val) {
    //     for (let i in this.statusList) {
    //       if (this.statusList[i].code == val) {
    //         return this.$t(this.statusList[i].disc);
    //       }
    //     }
    //   },
    //   showProCont(val) {
    //     for (let i in this.powprotocolListerList) {
    //       if (this.protocolList[i].code == val) {
    //         return this.protocolList[i].disc;
    //       }
    //     }
    //   },
    //   showTimeCont(val) {
    //     for (let i in this.timeList) {
    //       if (this.timeList[i].code == val) {
    //         return this.timeList[i].disc;
    //       }
    //     }
    //   },
    //   showFacCont(val) {
    //     for (let i in this.factoryList) {
    //       if (this.factoryList[i].code == val) {
    //         return this.factoryList[i].disc;
    //       }
    //     }
    //   }
    // }
};
</script>

<style scoped lang="scss">
// .forms {
//   padding: 0.32rem 0.36rem;
//   // background: #fafafa;
//   // border: 1px solid #eeeeee;
//   padding-left: 3rem;
// }
// .el-input {
//   width: 3.5rem !important;
// }
// .el-select {
//   width: 3.5rem !important;
// }
// .emeter{
//   h1 {
//     height: 0.625rem;
//     line-height: 0.625rem;
//     border-bottom: 2px solid #eeeeee;
//     margin-bottom: 20px;
//   }
// }
</style>
