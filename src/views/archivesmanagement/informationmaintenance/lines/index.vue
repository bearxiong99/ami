<template>
  <div class="lines">
    <div class="uptop">
      <div>{{$t('areaManage.office')}}</div>
      <div class="right">
        <span @click="operate(false)" style="cursor:pointer">
          <img src="img/edit.png" alt />
          {{$t('global.edit')}}
        </span>
        <!-- <span @click="operate(true)" style="cursor:pointer">
          <img src="img/New.png" alt />
          {{$t('global.add')}}
        </span> -->
        <!-- <span @click="dele" style="cursor:pointer">
          <img src="img/stop.png" alt />
          {{$t('global.delete')}}
        </span> -->
        <!-- <span @click="exportExcel" style="cursor:pointer">
          <img src="img/export.png" alt />
          {{$t('global.export')}}
        </span> -->
      </div>
    </div>

        <el-table
          ref="multipleTable"
          :data="basicdata"
          style="width: 100%;"
          @selection-change="basicSelectionChange"
          border
          :header-cell-style="{background:'#F2F2F2',color:'rgb(51,51,51)'}"
          v-loading="loading"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="sortNo" label="No.">
          </el-table-column>
          <el-table-column prop="orgName" :label="$t('areaManage.name')"></el-table-column>
          <!-- <el-table-column prop="powersupplyid1" :label="$t('areaManage.powersupply1')">
            <template slot-scope="scope">{{ showCont(scope.row.powersupplyid1) }}</template>
          </el-table-column>
          <el-table-column prop="powersupplyid2" :label="$t('areaManage.powersupply2')">
            <template slot-scope="scope">{{ showCont(scope.row.powersupplyid2) }}</template>
          </el-table-column> -->
          <!-- <el-table-column prop="gpsLongitude" :label="$t('areaManage.longitude')"></el-table-column>
          <el-table-column prop="gpsLatitude" :label="$t('areaManage.latitude')"></el-table-column> -->
        </el-table>

    <div class="forms">
      <el-pagination
        background
        @size-change="sizeChange"
        @current-change="currentChange"
        :page-sizes="[20, 40, 60, 200]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
      <!-- <div class="btns" style="text-align:right;">
        <el-button type="primary" size="small" icon="el-icon-plus" @click="add">{{$t('global.add')}}</el-button>
        <el-button
          type="info"
          size="small"
          icon="el-icon-edit"
          @click="edit"
        >{{$t('global.edit')}}</el-button>
        <el-button
          type="danger"
          size="small"
          icon="el-icon-delete"
          @click="dele"
        >{{$t('global.delete')}}</el-button>
        <el-button
          size="small"
          icon="el-icon-upload2"
          @click="exportExcel"
        >{{$t('global.export')}}</el-button>
      </div> -->
    </div>
    <exports
      :dialogVisible="exportVisible"
      @changeDialog="changeDialog"
    ></exports>

    <el-dialog :title="flag ? $t('global.add') : $t('global.edit')" :visible.sync="dialogShow" width="40%" :before-close="dialogClose">
        <div class="cityright">
          <el-form
            :model="formLine"
            label-width="auto"
            :rules="lineRules"
            ref="formLine"
            label-position="left"
          >
            <el-form-item :label="$t('areaManage.name')" prop="disc">
              <el-input v-model="formLine.disc" size="small" :maxlength="100" style="width:100%;"></el-input>
            </el-form-item>
            <!-- <el-form-item :label="$t('areaManage.powersupply1')" prop="powersupplyid1">
              <el-select v-model="formLine.powersupplyid1" placeholder='2' size="small" disabled style="width:100%;">
                <el-option
                  v-for="item in powerList"
                  :key="item.code"
                  :label="item.disc"
                  :value="item.code"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('areaManage.powersupply2')" prop="powersupplyid2">
              <el-select v-model="formLine.powersupplyid2" placeholder size="small" style="width:100%;">
                <el-option
                  v-for="item in powerList"
                  :key="item.code"
                  :label="item.disc"
                  :value="item.code"
                ></el-option>
              </el-select>
            </el-form-item> -->
            <!-- <el-form-item :label="$t('areaManage.voltage')" prop="voltageclassid">
              <el-select v-model="formLine.voltageclassid" placeholder size="small" style="width:100%;">
                <el-option
                  v-for="item in voltageList"
                  :key="item.code"
                  :label="changeClass(item.disc)"
                  :value="item.code"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('areaManage.linetype')" prop="type">
              <el-select v-model="formLine.type" placeholder size="small" style="width:100%;">
                <el-option
                  v-for="item in lineList"
                  :key="item.code"
                  :label="changeClass(item.disc)"
                  :value="item.code"
                ></el-option>
              </el-select>
            </el-form-item> -->
            <!-- <el-form-item :label="$t('areaManage.longitude')" prop="longitude">
              <el-input v-model="formLine.longitude" size="small" :maxlength="100"></el-input>
            </el-form-item>
            <el-form-item :label="$t('areaManage.latitude')" prop="dimension">
              <el-input v-model="formLine.dimension" size="small" :maxlength="100"></el-input>
            </el-form-item> -->
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="dialogClose">{{$t('global.cancel')}}</el-button>
          <el-button type="primary" @click="confirm">{{$t('global.confirm')}}</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
// import {queryDevice,childs} from '@/api/system/tree';
import {addInsrt, updateById, deleteById, getByCondition} from '@/api/archives';
import { mapGetters } from 'vuex';
import { export_json_to_excel } from '@/util/Export2Excel';
import Exports from '@/components/exportjs'
export default {
  components: {Exports},
  data() {
    return {
      basicdata: [],
      formLine: {
        disc: "",
        powersupplyid1: 2,
        powersupplyid2: 2,
        voltageclassid: 5,
        type: 2,
        longitude: "",
        dimension: ""
      },
      selectLineData: [],
      lineRules: {
        disc: [
          {
            required: true,
            message: this.$t("global.pleasename"),
            trigger: "blur"
          }
        ]
      },
      powerList: [],
      voltageList: [],
      lineList: [],
      loading: false,
      exportVisible:false,
      total: 0,
      pageParams: {
        current: 1,
        size: 20
      },
      flag: true,
      dialogShow: false
    };
  },
  computed: {
    ...mapGetters(['treeNode'])
  },
  watch: {
    treeNode:function () {
      this.getArchiveListByObject();
    }
  },
  mounted() {
    // this.getList();
    this.getArchiveListByObject();
  },
  methods: {
    basicSelectionChange(val) {
      this.selectLineData = val
    },
    getArchiveListByObject() {
      this.loading = true;
      let obj = {
        pOrgNo: this.treeNode.deviceNo,
        ...this.pageParams
      }
      getByCondition(obj).then(res => {
          this.basicdata = res.data.data.records
          this.total = res.data.data.total
          this.loading = false;
      })
      // childs(this.treeNode.deviceNo).then(res=>{
      //   this.basicdata = res.data.data;
      //   this.loading = false;
      // })
    },

    // getList() {
    //   let accountid = localStorage.getItem("accountid");
    //   this.$request("getComboDataByParam", {
    //     params: {
    //       comboId: 10000,
    //       accountid: accountid
    //     }
    //   }).then(res => {
    //     this.powerList = res.data.listitem;
    //   });
    //   this.$request("getComboDataByParam", {
    //     params: {
    //       comboId: 1,
    //       accountid: accountid
    //     }
    //   }).then(res => {
    //     this.voltageList = res.data.listitem;
    //   });
    //   this.$request("getComboDataByParam", {
    //     params: {
    //       comboId: 2,
    //       accountid: accountid
    //     }
    //   }).then(res => {
    //     this.lineList = res.data.listitem;
    //   });
    // },
    changeClass(val) {
      return this.$t(val);
    },
    showCont(val) {
      for (let i in this.powerList) {
        if (this.powerList[i].code == val) {
          return this.powerList[i].disc;
        }
      }
    },
    operate (val) {
      if (!val) {
        if (this.selectLineData.length === 0) {
          this.$notify({
            title: this.$t("global.warn"),
            message: this.$t("global.warncont"),
            type: "warning"
          })
          return
        } else if (this.selectLineData.length > 1) {
          this.$notify({
            title: this.$t("global.warn"),
            message: this.$t("role.onlyOne"),
            type: "warning"
          })
          return
        } else {
          this.formLine.disc = this.selectLineData[0].orgName
        }
      }
      this.flag = val
      this.dialogShow = true
    },
    confirm () {
      if (this.flag) {
        this.add()
      } else {
        this.edit()
      }
    },
    add() {
      // let data = JSON.parse(localStorage.getItem("nodeData"));
      this.$refs["formLine"].validate(valid => {
        if (valid) {
          addInsrt({
            orgName:this.formLine.disc,
            // orgType:1,
            pOrgNo:this.treeNode.deviceNo
          }).then(res=>{
            if (res.data.success) {
              this.$message({
                  message: this.$t('global.addSuccess'),
                  type: 'success'
              });
              this.getArchiveListByObject();
              this.dialogClose()
            }else{
              this.$message({
                  message: this.$t('global.operaError'),
                  type: 'error'
              });
            }
          })
          // this.$request("addArchiveObject", {
          //   ownerId: data.objid,
          //   ownerType: data.objtype,
          //   subType: JSON.parse(localStorage.getItem("subtype")),
          //   treeType: 1,
          //   obj: this.formLine
          // }).then(res => {
          //   if (res.data.success == 1) {
          //     this.$message({
          //       message: this.$t("global.addSuccess"),
          //       type: "success"
          //     });
          //     this.getArchiveListByObject();
          //     this.$refs["formLine"].resetFields();
          //     addTree.$emit("addTree", data);
          //   }
          // });
        }
      });
    },
    dele() {
      // let data = JSON.parse(localStorage.getItem("nodeData"));
      if (this.selectLineData.length != 0) {
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
              deleteById({
                orgNo: this.selectLineData[0].orgNo
              }).then(res=>{
                if (res.data.success) {
                  this.$message({
                      message: this.$t('global.deleteSuccess'),
                      type: 'success'
                  });
                  this.getArchiveListByObject();
                }else{
                  this.$message({
                      message: this.$t('global.operaError'),
                      type: 'error'
                  });
                }
              })
            // this.$request("deleteAllArchive", {
            //   ownerId: data.objid,
            //   ownerType: data.objtype,
            //   subType: JSON.parse(localStorage.getItem("subtype")),
            //   treeType: 1,
            //   obj: this.selectLineData
            // }).then(res => {
            //   if (res.data.success == 1) {
            //     this.$message({
            //       message: this.$t("global.deleteSuccess"),
            //       type: "success"
            //     });
            //     this.getArchiveListByObject();
            //     this.$refs["formLine"].resetFields();
            //     addTree.$emit("addTree", data);
            //   }
            // });
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
      // let data = JSON.parse(localStorage.getItem("nodeData"));
        this.$refs["formLine"].validate(valid => {
          if (valid) {
            updateById({
              orgName:this.formLine.disc,
              orgNo:this.selectLineData[0].orgNo
            }).then(res=>{
              if (res.data.success) {
                this.$message({
                    message: this.$t('global.editSuccess'),
                    type: 'success'
                });
                this.getArchiveListByObject();
                this.dialogClose()
              }else{
                this.$message({
                    message: this.$t('global.editError'),
                    type: 'error'
                });
              }
            })
          }
        });
        // this.$request("updateArchiveObject", {
        //   ownerId: data.objid,
        //   ownerType: data.objtype,
        //   subType: JSON.parse(localStorage.getItem("subtype")),
        //   treeType: 1,
        //   obj: this.formLine
        // }).then(res => {
        //   if (res.data.success) {
        //     this.$message({
        //       message: this.$t("global.editSuccess"),
        //       type: "success"
        //     });
        //     this.getArchiveListByObject();
        //     this.$refs["formLine"].resetFields();
        //     addTree.$emit("addTree", data);
        //   }
        // });
    },
    exportExcel() {
      require.ensure([], () => {
        // 设置Excel的表格第一行的标题
        const tHeader = [
          this.$t("areaManage.name"),
          this.$t("areaManage.powersupply1"),
          this.$t("areaManage.powersupply2"),
          this.$t("areaManage.longitude"),
          this.$t("areaManage.latitude")
        ];
        //  'date', 'struct1', 'struct2'对象的属性
        const filterVal = [
          "disc",
          "powersupplyid1",
          "powersupplyid2",
          "longitude",
          "dimension"
        ];
        // 数据集
        let list;
        if (this.selectLineData.length > 0) {
          list = JSON.parse(JSON.stringify(this.selectLineData));
        } else {
          list = JSON.parse(JSON.stringify(this.basicdata));
        }
        for (let i = 0; i < list.length; i++) {
          list[i].powersupplyid1 = this.showCont(list[i].powersupplyid1);
          list[i].powersupplyid2 = this.showCont(list[i].powersupplyid2);
        }
        const data = this.formatJson(filterVal, list);
        // excel名称可自定义
        const excelName = "lines";
        export_json_to_excel(tHeader, data, excelName);
      });
    },
    // 格式化json
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    },
    changeDialog(val){
      this.exportVisible = val;
    },
    sizeChange (val) {
      this.pageParams.size = val
      this.getArchiveListByObject()
    },
    currentChange (val) {
      this.pageParams.current = val
      this.getArchiveListByObject()
    },
    dialogClose () {
      this.$refs.formLine.resetFields()
      this.dialogShow = false
    }
  }
};
</script>

<style scoped lang="scss">
.forms {
  height: 50px;
  padding: 8px 20px 0;
  background: #fafafa;
  border: 1px solid #eeeeee;
  box-sizing: border-box;
}
.lines {
  h1 {
    height: 50px;
    line-height: 50px;
    border-bottom: 2px solid #eeeeee;
    margin-bottom: 20px;
    padding-left: 10px;
    font-size: 20px;
  }
  .uptop {
    display: flex;
    justify-content: space-between;
    padding: 10px;
    border: 1px solid #dddddd;
    background: #eeeeee;
    span {
      display: flex;
      align-items: center;
      border-left: 1px solid #dddddd;
      padding-right: 10px;
    }
    img {
      margin-right: 10px;
      margin-left: 20px;
    }
    .right {
      display: flex;
    }
  }
  .cityright{
    width: 50%;
    margin: 0 auto;
  }
}
</style>
