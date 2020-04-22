<template>
  <div class="town">
    <div class="uptop">
      <div>{{$t('areaManage.depart')}}</div>
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
        <!-- <el-table-column prop="code" :label="$t('areaManage.code')"></el-table-column> -->
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
    </div>
    <exports
      :dialogVisible="exportVisible"
      @changeDialog="changeDialog"
    ></exports>
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

      <el-dialog :title="flag ? $t('global.add') : $t('global.edit')" :visible.sync="dialogShow" width="40%" :before-close="dialogClose">
        <div class="cityright">
          <el-form
            :model="formTown"
            label-width="auto"
            :rules="cityRules"
            ref="formTown"
            label-position="left"
          >
            <el-form-item :label="$t('areaManage.name')" prop="disc">
              <el-input v-model="formTown.disc" size="small" :maxlength="100"></el-input>
            </el-form-item>
            <!-- <el-form-item :label="$t('areaManage.code')" prop="code">
              <el-input :maxlength="30" v-model="formTown.code" size="small" :maxlength="100"></el-input>
            </el-form-item> -->
            <!-- <el-form-item :label="$t('areaManage.longitude')" prop="longitude">
              <el-input v-model="formTown.longitude" size="small" :maxlength="20"></el-input>
            </el-form-item>
            <el-form-item :label="$t('areaManage.latitude')" prop="dimension">
              <el-input v-model="formTown.dimension" size="small" :maxlength="20"></el-input>
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
  // props:['basicdata'],
  data() {
    return {
      basicdata: [],
      formTown: {
        name: "",
        code: "",
        longitude: "",
        dimension: ""
      },
      selectCityData: [],
      cityRules: {
        disc: [
          {
            required: true,
            message: this.$t("global.pleasename"),
            trigger: "blur"
          }
        ]
      },
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
    this.getArchiveListByObject();
  },
  methods: {
    basicSelectionChange(val) {
        this.selectCityData = val
    },
    getArchiveListByObject() {
      // this.loading = true;
      // childs(this.treeNode.deviceNo).then(res=>{
      //   this.basicdata = res.data.data;
      //   this.loading = false;
      // })
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
    },
    operate (val) {
      if (!val) {
        if (this.selectCityData.length === 0) {
          this.$notify({
            title: this.$t("global.warn"),
            message: this.$t("global.warncont"),
            type: "warning"
          })
          return
        } else if (this.selectCityData.length > 1) {
          this.$notify({
            title: this.$t("global.warn"),
            message: this.$t("role.onlyOne"),
            type: "warning"
          })
          return
        } else {
          this.formTown.disc = this.selectCityData[0].orgName
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
      this.$refs["formTown"].validate(valid => {
        if (valid) {
          addInsrt({
            orgName:this.formTown.disc,
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
          //   obj: this.formTown
          // }).then(res => {
          //   if (res.data.success == 1) {
          //     this.$message({
          //       message: this.$t("global.addSuccess"),
          //       type: "success"
          //     });
          //     this.getArchiveListByObject();
          //     this.$refs["formTown"].resetFields();
          //     addTree.$emit("addTree", data);
          //   }
          // });
        }
      });
    },
    dele() {
      // let data = JSON.parse(localStorage.getItem("nodeData"));
      if (this.selectCityData.length != 0) {
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
                orgNo: this.selectCityData[0].orgNo
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
            //   obj: this.selectCityData
            // }).then(res => {
            //   if (res.data.success == 1) {
            //     this.$message({
            //       message: this.$t("global.deleteSuccess"),
            //       type: "success"
            //     });
            //     this.getArchiveListByObject();
            //     this.$refs["formTown"].resetFields();
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
        this.$refs["formTown"].validate(valid => {
          if (valid) {
            updateById({
              orgName:this.formTown.disc,
              orgNo:this.selectCityData[0].orgNo
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
        //   obj: this.formTown
        // }).then(res => {
        //   if (res.data.success) {
        //     this.$message({
        //       message: this.$t("global.editSuccess"),
        //       type: "success"
        //     });
        //     this.getArchiveListByObject();
        //     this.$refs["formTown"].resetFields();
        //     addTree.$emit("addTree", data);
        //   }
        // });
    },
    exportExcel() {
      require.ensure([], () => {
        // 设置Excel的表格第一行的标题
        const tHeader = [
          this.$t("areaManage.name"),
          this.$t("areaManage.code"),
          this.$t("areaManage.longitude"),
          this.$t("areaManage.latitude")
        ];
        //  'date', 'struct1', 'struct2'对象的属性
        const filterVal = ["disc", "code", "longitude", "dimension"];
        // 数据集
        let list;
        if (this.selectCityData.length > 0) {
          list = JSON.parse(JSON.stringify(this.selectCityData));
        } else {
          list = JSON.parse(JSON.stringify(this.basicdata));
        }
        const data = this.formatJson(filterVal, list);
        // excel名称可自定义
        const excelName = "town";
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
      this.$refs.formTown.resetFields()
      this.dialogShow = false
    }
  }
};
</script>

<style scoped lang="scss">
.forms {
  padding: 20px;
  background: #fafafa;
  border: 1px solid #eeeeee;
}
.town {
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
