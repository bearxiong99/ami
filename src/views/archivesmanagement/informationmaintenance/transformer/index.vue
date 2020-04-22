<template>
  <div class="trans">
    <div class="uptop">
      <div>{{$t('areaManage.mru')}}</div>
      <div class="right">
        <span @click="operate(false)" style="cursor:pointer">
          <img src="img/edit.png" alt />
          {{$t('global.edit')}}
        </span>
        <span @click="operate(true)" style="cursor:pointer">
          <img src="img/New.png" alt />
          {{$t('global.add')}}
        </span>
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
          <!-- <el-table-column prop="lineid1" :label="$t('areaManage.line1')">
            <template slot-scope="scope">{{ showCont(scope.row.lineid1) }}</template>
          </el-table-column>
          <el-table-column prop="lineid2" :label="$t('areaManage.line2')">
            <template slot-scope="scope">{{ showCont(scope.row.lineid2) }}</template>
          </el-table-column>
          <el-table-column prop="capability" :label="$t('areaManage.capablitity')"></el-table-column>
          <el-table-column prop="hh" :label="$t('areaManage.transcode')"></el-table-column> -->
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
            :model="formTrans"
            label-width="auto"
            :rules="transRules"
            ref="formTrans"
            label-position="left"
          >
            <el-form-item :label="$t('areaManage.name')" prop="disc">
              <el-input v-model="formTrans.disc" size="small" :maxlength="100"></el-input>
            </el-form-item>
            <!-- <el-form-item :label="$t('areaManage.line1')" prop="lineid1">
              <el-select v-model="formTrans.lineid1" placeholder size="small" disabled style="width:100%;">
                <el-option
                  v-for="item in lineList"
                  :key="item.code"
                  :label="item.disc"
                  :value="item.code"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('areaManage.line2')" prop="lineid2">
              <el-select v-model="formTrans.lineid2" placeholder size="small" style="width:100%;">
                <el-option
                  v-for="item in lineList"
                  :key="item.code"
                  :label="item.disc"
                  :value="item.code"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('areaManage.capablitity')" prop="capability">
              <el-input :maxlength="30" v-model="formTrans.capability" size="small" :maxlength="20"></el-input>
            </el-form-item>
            <el-form-item :label="$t('areaManage.transcode')" prop="hh">
              <el-input :maxlength="30" v-model="formTrans.hh" size="small" :maxlength="20"></el-input>
            </el-form-item> -->
            <!-- <el-form-item :label="$t('areaManage.longitude')" prop="longitude">
              <el-input v-model="formTrans.longitude" size="small" :maxlength="20"></el-input>
            </el-form-item>
            <el-form-item :label="$t('areaManage.latitude')" prop="dimension">
              <el-input v-model="formTrans.dimension" size="small" :maxlength="20"></el-input>
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
export default {
  components: {},
  data() {
    return {
      basicdata: [],
      formTrans: {
        disc: "",
        lineid1: 2,
        lineid2: 2,
        hh: "",
        capability: null,
        longitude: "",
        latitude: ""
      },
      transRules: {
        disc: [
          {
            required: true,
            message: this.$t("global.pleasename"),
            trigger: "blur"
          }
        ],
        lineid1: [
          {
            required: true,
            message: this.$t("global.pleaseline"),
            trigger: "change"
          }
        ],
        lineid2: [
          {
            required: true,
            message: this.$t("global.pleaseline"),
            trigger: "change"
          }
        ]
      },
      lineList: [],
      selectTransData: [],
      counts: 0,
      loading: false,
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
  created() {},
  mounted() {
    // this.getList();
    this.getArchiveListByObject();
  },
  methods: {
    basicSelectionChange(val) {
      this.selectTransData = val
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
    // getList () {
    //     let accountid = localStorage.getItem('accountid');
    //     this.$request('getComboDataByParam', {
    //         params: {
    //             comboId: 10001,
    //             accountid: accountid
    //         }
    //     }).then(res => {
    //         this.lineList = res.data.listitem;
    //     });
    // },
    showCont(val) {
      for (let i in this.lineList) {
        if (this.lineList[i].code == val) {
          return this.lineList[i].disc;
        }
      }
    },
    operate (val) {
      if (!val) {
        if (this.selectTransData.length === 0) {
          this.$notify({
            title: this.$t("global.warn"),
            message: this.$t("global.warncont"),
            type: "warning"
          })
          return
        } else if (this.selectTransData.length > 1) {
          this.$notify({
            title: this.$t("global.warn"),
            message: this.$t("role.onlyOne"),
            type: "warning"
          })
          return
        } else {
          this.formTrans.disc = this.selectTransData[0].orgName
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
      this.$refs["formTrans"].validate(valid => {
        if (valid) {
          addInsrt({
            orgName:this.formTrans.disc,
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
          //   obj: this.formTrans
          // }).then(res => {
          //   if (res.data.success == 1) {
          //     this.$message({
          //       message: this.$t("global.addSuccess"),
          //       type: "success"
          //     });
          //     addTree.$emit("changeTree", data);
          //     this.getArchiveListByObject();
          //     this.$refs["formTrans"].resetFields();
          //     addTree.$emit("addTree", data);
          //   }
          // });
        }
      });
    },
    dele() {
      // let data = JSON.parse(localStorage.getItem("nodeData"));
      if (this.selectTransData.length != 0) {
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
                orgNo: this.selectTransData[0].orgNo
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
            //   obj: this.selectTransData
            // }).then(res => {
            //   if (res.data.success == 1) {
            //     this.$message({
            //       message: this.$t("global.deleteSuccess"),
            //       type: "success"
            //     });
            //     this.getArchiveListByObject();
            //     this.$refs["formTrans"].resetFields();
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
        this.$refs["formTrans"].validate(valid => {
          if (valid) {
            updateById({
              orgName:this.formTrans.disc,
              orgNo:this.selectTransData[0].orgNo
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
        //   obj: this.formTrans
        // }).then(res => {
        //   if (res.data.success) {
        //     this.$message({
        //       message: this.$t("global.editSuccess"),
        //       type: "success"
        //     });
        //     this.getArchiveListByObject();
        //     this.$refs["formTrans"].resetFields();
        //     addTree.$emit("addTree", data);
        //   }
        // });
    },
    exportExcel() {
      require.ensure([], () => {
        // 设置Excel的表格第一行的标题
        const tHeader = [
          this.$t("areaManage.name"),
          this.$t("areaManage.line1"),
          this.$t("areaManage.line2"),
          this.$t("areaManage.capablitity"),
          this.$t("areaManage.transcode"),
          this.$t("areaManage.longitude"),
          this.$t("areaManage.latitude")
        ];
        //  'date', 'struct1', 'struct2'对象的属性
        const filterVal = [
          "disc",
          "lineid1",
          "lineid2",
          "capability",
          "hh",
          "longitude",
          "dimension"
        ];
        // 数据集
        let list;
        if (this.selectTransData.length > 0) {
          list = JSON.parse(JSON.stringify(this.selectTransData));
        } else {
          list = JSON.parse(JSON.stringify(this.basicdata));
        }
        for (let i = 0; i < list.length; i++) {
          list[i].lineid1 = this.showCont(list[i].lineid1);
          list[i].lineid2 = this.showCont(list[i].lineid2);
        }
        const data = this.formatJson(filterVal, list);
        // excel名称可自定义
        const excelName = "area";
        export_json_to_excel(tHeader, data, excelName);
      });
    },
    // 格式化json
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
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
      this.$refs.formTrans.resetFields()
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
.trans {
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