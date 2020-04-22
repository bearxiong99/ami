<template>
  <basic-container>
    <div class="filter-box">
      <span style="margin-left:0">{{$t('tree.groupType')}}</span>
      <el-select v-model="params1.groupType" size="small">
        <el-option
          :label="ele.typeName"
          :value="ele.typeCode"
          v-for="(ele, i) in groupList"
          :key="i"
        ></el-option>
      </el-select>
      <span>{{$t('tree.groupName')}}</span>
      <el-input :maxlength="30" v-model="params1.groupName"></el-input>
      <el-button type="primary" size="small" @click="search">{{$t('auto.search')}}</el-button>
    </div>
    <div class="content">
      <div class="terminal">
        <div class="head">
          {{$t('group.grouplist')}}
          <div class="operate">
            <span @click="add">
              <img src="img/New.png" alt />
              {{$t('areaManage.newBuild')}}
            </span>
            <span @click="del">
              <img src="img/Delete.png" alt />
              {{$t('global.delete')}}
            </span>
            <span @click="edit">
              <img src="img/edit.png" alt />
              {{$t('global.edit')}}
            </span>
          </div>
        </div>
        <el-table
          :data="dcuData"
          border
          :height="tableHeight"
          v-loading="load1"
          :header-cell-style="{background:'#F2F2F2',color:'rgb(51,51,51)'}"
          highlight-current-row
          @current-change="selectFun"
        >
          <!-- <el-table-column type="selection" width="50"></el-table-column> -->
          <el-table-column :label="$t('key.no')" width="50">
            <template
              slot-scope="scope"
            >{{ params1.limit * (params1.page - 1) + scope.$index + 1 }}</template>
          </el-table-column>
          <el-table-column :label="$t('tree.groupName')" prop="groupName"></el-table-column>
          <el-table-column :label="$t('tree.groupType')" prop="groupType" :formatter="formGroup"></el-table-column>
          <el-table-column :label="$t('group.groupdevice')" prop="recvTime">
            <template slot-scope="scope">
              <el-button type="text" @click="deviceShow(scope.row)">view</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <pagination
          :total="total1"
          :page.sync="params1.page"
          :limit.sync="params1.limit"
          @pagination="search"
          style="margin-top:-1px"
        />
      </div>

      <!-- 增改弹框 -->
      <el-dialog
        :title="titleName"
        :visible.sync="checkResultVisible"
        width="46%"
        :before-close="handleClose"
      >
        <el-form :inline="true" :model="params2" label-position="left" :rules="groupRule" ref="formGroup">
          <el-form-item :label="$t('tree.groupType')" style="margin-right:10px">
            <el-select v-model="params2.groupType" size="small" :disabled="optType==2">
              <el-option
                :label="ele.typeName"
                :value="ele.typeCode"
                v-for="(ele, i) in groupList"
                :key="i"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('tree.groupName')" prop="groupName">
            <el-input :maxlength="30" v-model="params2.groupName"></el-input>
          </el-form-item>
        </el-form>

        <!-- 穿梭框 -->
        <el-transfer
          style="text-align: left; display: inline-block"
          v-model="listValue"
          :data="meterData"
          :titles="[this.$t('upgrade.devlist'), 'Group Meter List']"
        >
          <span slot-scope="{ option }"><span :class="['tree-ico',option.deviceModel]"></span>{{ option.label }}</span>
        </el-transfer>

        <el-popover
          placement="bottom-start"
          width="400"
          trigger="click" 
          class="imgbtn"
          v-model="visible">
          <el-form
            :model="searchForm"
            ref="form"
            label-width="200px"
            label-position="left"
            style="width:340px;margin-left:20px;"
            v-if="params2.groupType===2"
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
            <el-form-item :label="$t('auto.commtype')">
              <el-select v-model="searchForm.deviceType" style="width:100%">
                <el-option label="4G Meter" :value="1"></el-option>
                <el-option label="NB Meter" :value="2"></el-option>
                <el-option label="Hybrid Meter" :value="0"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <el-form
            :model="searchDCUForm"
            ref="form"
            label-width="200px"
            label-position="left"
            style="width:340px;margin-left:20px;"
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
          <div style="text-align:right;"><el-button type="primary" @click="searchMeter" >{{$t('global.search')}}</el-button></div>
          <el-button slot="reference"><img src="img/query.png" alt=""></el-button>
        </el-popover>
        <span slot="footer" class="dialog-footer">
          <el-button @click="handleClose">{{$t('global.cancel')}}</el-button>
          <el-button type="primary" @click="save">{{$t('global.save')}}</el-button>
        </span>
      </el-dialog>

      <!-- 查询详细设备 -->
      <el-dialog
        :title="$t('group.groupdevice')"
        :visible.sync="deviceVisible"
        width="46%"
        :before-close="handleCloseT"
        >
        <el-table :data="deviceList" border style="width: 100%" :stripe="true" :header-cell-style="{background:'#f5f5f5'}">
          <!-- <el-table-column type="selection" width="55"></el-table-column> -->
          <el-table-column :label="$t('key.no')" width="50">
            <template
              slot-scope="scope"
            >{{ params2.limit * (params2.page - 1) + scope.$index + 1 }}</template>
          </el-table-column>
          <el-table-column :label="$t('tree.ownermru')" prop="orgName"></el-table-column>
          <el-table-column :label="$t('remote.deviceName')" prop="deviceName"></el-table-column>
          <el-table-column :label="$t('areaManage.commadd')" prop="commAddr1" v-if="params1.groupType==2"></el-table-column>
          <el-table-column :label="$t('areaManage.commadd')" prop="terminalAddr" v-else></el-table-column>
        </el-table>
        <pagination
          :total="total2"
          :page.sync="params2.page"
          :limit.sync="params2.limit"
          @pagination="getDeviceDetail"
          style="margin-top:-1px"
        />
      </el-dialog>
    </div>
  </basic-container>
</template>
<script>
import Pagination from "@/components/Pagination";
import { getViewList,getDevice } from "@/api/autoRegister";
import { queryGroups,queryDevice,optGroups,verifyGroupName } from "@/api/system/group";

export default {
  components: {
    Pagination,
  },
  data() {
    return {
      deviceList: [],
      meterTypeList: [],
      dcuData: [],
      factoryList:[],
      meterList:[],
      groupList: [
        {
          typeName:'DCU Group',
          typeCode:1
        },
        {
          typeName:'Meter Group',
          typeCode:2
        },
      ],
      selectTableData: null,
      titleName:this.$t('group.addgroup'),
      total1: 0,
      total2: 0,
      params1: {
        groupName: '',
        groupType: 1,
        page: 1,
        limit: 20
      },
      params2:{
        groupName: "",
        groupType: 1,
        page: 1,
        limit: 20
      },
      searchForm:{
        factoryCode:-1,
        type:-1,
        serachValue:'',
        deviceType:1,
      },
      searchDCUForm:{
        serachValue:'',
        factoryCode:-1,
      },
      load1: false,
      load2: false,
      loading:false,
      checkResultVisible: false,
      deviceVisible:false,
      visible:false,
      tableHeight: window.innerHeight - 350,
      meterData: [],
      listValue: [],
      optType:0,
      groupRule:{
        groupName: [
          {
            required: true,
            message: this.$t("global.pleasename"),
            trigger: "blur"
          }
        ]
      }
    };
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
    // 查找群组
    search() {
      this.load1 = true;
      queryGroups({
        ...this.params1
      }).then(res => {
        if (res.data.data.totalCount != 0) {
          this.dcuData = res.data.data.list;
        } else {
          this.dcuData = [];
        }
        this.total1 = res.data.data.totalCount;
      });
      this.load1 = false;
    },
    // 选中组数据
    selectFun(val) {
      this.selectTableData=val;
    },
    add() {
      this.checkResultVisible = true;
      this.titleName=this.$t('group.addgroup');
      this.params2.groupName='';
      this.listValue=[];
      this.meterData=[];
      this.optType=1;
    },
    del() {
      if (this.selectTableData != null) {
        this.$confirm(
          this.$t("areaManage.deleteTip"),
          this.$t("areaManage.reminder"),
          {
            confirmButtonText: this.$t("global.yes"),
            cancelButtonText: this.$t("global.cancel"),
            type: "warning"
          }
        )
          .then(() => {
            optGroups({
              group:{
                id:this.selectTableData.id
              },
              optType:3
            }).then(res=>{
              if (res.data.success) {
                this.$message({
                  message: this.$t("global.operatorSuccess"),
                  type: "success"
                });
                this.search();
              } else {
                this.$message({
                  message: this.$t("global.operaError"),
                  type: "error"
                });
              }
            })
        })
        .catch(() => {});
      } else {
        this.$notify({
          title: this.$t("global.warn"),
          message: this.$t("global.warndele"),
          type: "warning"
        });
      }
    },
    edit() {
      if (this.selectTableData != null) {
        this.checkResultVisible = true;
        this.params2.groupName=this.selectTableData.groupName;
        this.params2.groupType=this.selectTableData.groupType;
        this.params2.id=this.selectTableData.id;
        this.titleName=this.$t('group.editgroup');
        this.optType=2;
        this.getDeviceDetail()
      }else{
        this.$notify({
          title: this.$t("global.warn"),
          message: this.$t("global.warncont"),
          type: "warning"
        });
      }
    },
    // 搜索全部的电表
    searchMeter(){
      this.loading=true;
      this.meterData=[];
      this.visible=false;
      let param = {};
      if(this.params2.groupType==1){
        param = {
          isAllTmnal: 1, //1查集中器是 0查电表
          pageNum: 1,
          pageSize: 9999,
          orgNo: '01',
          type:5,
          ...this.searchDCUForm
        };
      }else{
        param = {
          isAllTmnal: 0, //1查集中器是 0查电表
          pageNum: 1,
          pageSize: 9999,
          deviceType:0, //-1查4g/nb  0是载波表
          orgNo: '01',
          ...this.searchForm
        };
      }
      getDevice(param).then(res => {
        if(res.data.data.total!=0){
          if(this.params2.groupType==1){
            res.data.data.list.forEach(item => {
              this.meterData.push({
                key:item.terminalAddr,
                label:item.tmnlAssetNo,
                deviceModel:item.deviceModel
              })
            });
          }else{
            res.data.data.list.forEach(item => {
              this.meterData.push({
                key:item.assetNo,
                label:item.assetNo,
                deviceModel:item.deviceModel
              })
            });
          }
        }else{
          this.meterData=[];
        }
        this.loading = false;
        
      });
    },
    save(){
      this.$refs["formGroup"].validate(valid => {
        if (valid) {
          // 校验组名是否重复
          if(this.optType==1){
            verifyGroupName(this.params2.groupName,-1).then(res=>{
              if(res.data.data==false){
                this.operationGroup();
              }else{
                this.$message({
                  message: this.$t("group.groupRepeat"),
                  type: "warning"
                });
              }
            })
          }else{
            verifyGroupName(this.params2.groupName,this.params2.id).then(res=>{
              if(res.data.data==false){
                this.operationGroup();
              }else{
                this.$message({
                  message: this.$t("group.groupRepeat"),
                  type: "warning"
                });
              }
            })
          }
        }
      })
    },
    operationGroup(){
      let param={}
      if(this.optType==1){
        param={
          deviceNos:this.listValue.toString(),
          group:{
            groupType:this.params2.groupType,
            groupName:this.params2.groupName,
          },
          optType:this.optType
        }
      }else{
         param={
          deviceNos:this.listValue.toString(),
          group:{
            groupType:this.params2.groupType,
            groupName:this.params2.groupName,
            id:this.params2.id
          },
          optType:this.optType
        }
      }
      optGroups(param).then(res=>{
        if (res.data.success) {
          this.$message({
            message: this.$t("global.operatorSuccess"),
            type: "success"
          });
          this.search()
        } else {
          this.$message({
            message: this.$t("global.operaError"),
            type: "error"
          });
        }
        this.checkResultVisible=false;
      })
    },
    handleClose() {
      this.checkResultVisible = false;
    },
    // 设备详情弹框
    deviceShow(val){
      this.deviceVisible=true;
      this.params2.groupName=val.groupName;
      this.params2.id=val.id;
      this.params2.groupType=val.groupType;
      this.getDeviceDetail()
    },
    // 获取设备详情信息
    getDeviceDetail(){
      this.load2 = true;
      this.listValue=[];
      this.meterData=[];
      let param={};
      if(this.params2.groupType==1){
        param = {
          isAllTmnal: 1, //1查集中器是 0查电表
          pageNum: this.params2.page,
          pageSize: this.params2.limit,
          groupId:this.params2.id
        };
      }else{
        param = {
          isAllTmnal: 0, //1查集中器是 0查电表
          pageNum: this.params2.page,
          pageSize: this.params2.limit,
          groupId:this.params2.id
        };
      }
      getDevice(param).then(res => {
        if (res.data.data.total != 0) {
          this.deviceList = res.data.data.list;
          res.data.data.list.forEach(item=>{
            if(this.params2.groupType==1){
              this.listValue.push(item.terminalAddr)
              this.meterData.push({
                key:item.terminalAddr,
                label:item.terminalAddr,
                deviceModel:item.deviceModel
              })
            }else{
              this.listValue.push(item.commAddr1)
              this.meterData.push({
                key:item.commAddr1,
                label:item.commAddr1,
                deviceModel:item.deviceModel
              })
            }
          })
        } else {
          this.deviceList = [];
          this.listValue=[];
        }
        this.total2 = res.data.data.total;
      });
      this.load2 = false;
    },
    handleCloseT(){
      this.deviceVisible=false;
    },
    // 电表类型
    formGroup(row) {
      return row.groupType===1?'DCU Group':'Meter Group'
    },
    changeFactory(val) {
      for (let i in this.groupList) {
        if (val == this.groupList[i].typeCode) {
          return this.groupList[i].typeName;
        }
      }
    }
  }
};
</script>
<style lang='scss' scoped>
.filter-box {
  display: flex;
  align-items: center;
  padding-bottom: 10px;
  span {
    padding: 0 5px 0 20px;
  }
  .el-input {
    width: 150px;
    margin-right: 10px;
    /deep/ .el-input__inner {
      height: 32px;
    }
  }
}
.content {
  .terminal,
  .meter {
    border: 1px solid #ddd;
    box-sizing: border-box;
    .head {
      height: 40px;
      padding-left: 20px;
      // border: 1px solid #ddd;
      border-bottom: 0;
      line-height: 40px;
      .operate {
        float: right;
        & > span {
          display: inline-block;
          // width: 120px;
          height: 20px;
          padding: 0 20px;
          margin-top: 10px;
          line-height: 20px;
          text-align: center;
          border-left: 1px solid #ddd;
          cursor: pointer;
          img {
            vertical-align: middle;
            padding-bottom: 4px;
          }
        }
        .checkbox {
          width: 350px;
          span {
            margin-left: 30px;
          }
        }
      }
    }
    .page {
      height: 50px;
      border-top: 1px solid #ddd;
      background-color: #fafafa;
      .el-pagination {
        margin: 10px 0 0 15px;
      }
    }
  }
}
.tree-ico {
    width: 16px;
    height: 16px;
    display: inline-block;
    margin-right: 10px;
    vertical-align: middle;
  }
.online {
    background: url("/img/tree/online.png") top center no-repeat;
  }

  .outline {
    background: url("/img/tree/outline.png") top center no-repeat;
  }

  .meter {
    background: url("/img/tree/meter.png") top center no-repeat;
  }

  .meterOffline{
    background: url("/img/tree/meterOffline.png") top center no-repeat;
  }

  .saudiArabia{
    background: url("/img/tree/saudiArabia.png") top center no-repeat;
  }

  .org {
    background: url("/img/tree/org.png") top center no-repeat;
  }

  .department{
    background: url("/img/tree/department.png") top center no-repeat;
  }

  .office{
    background: url("/img/tree/office.png") top center no-repeat;
  }

  .mru{
    background: url("/img/tree/mru.png") top center no-repeat;
  }

  .DCUonline{
    background: url("/img/tree/DCUonline.png") top center no-repeat;
  }

  .DCUoffline{
    background: url("/img/tree/DCUoffline.png") top center no-repeat;
  }

  .fourGoffline{
    background: url("/img/tree/fourGoffline.png") top center no-repeat;
  }


  .fourGonline{
    background: url("/img/tree/fourGonline.png") top center no-repeat;
  }

  .NBoffline{
    background: url("/img/tree/NBoffline.png") top center no-repeat;
  }


  .NBonline{
    background: url("/img/tree/NBonline.png") top center no-repeat;
  }
/deep/ .el-transfer-panel {
  width: 300px;
  .el-transfer-panel__body{
    height: 400px;
  }
  .el-transfer-panel__list{
    height: 400px;
  }
}
.imgbtn{
  position: absolute;
  top: 138px;
  left: 260px;
}
</style>