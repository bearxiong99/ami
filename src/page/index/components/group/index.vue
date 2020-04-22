<template>
  <div>
    <el-form :model="form" label-position="left" label-width="70px">
      <!-- <el-form-item :label="$t('tree.groupType')">
        <el-select v-model="form.groupType" :placeholder="$t('tree.groupType')">
          <el-option :label="$t('tree.dcuGroup')" value="tmnl"></el-option>
          <el-option :label="$t('tree.meterGroup')" value="meter"></el-option>
        </el-select>
      </el-form-item>-->

      <el-form-item :label="$t('tree.type')">
        <el-radio-group v-model="form.groupType" @change="getGroup">
          <el-radio label="1">{{$t('tree.dcuGroup')}}</el-radio>
          <el-radio label="2">{{$t('tree.meterGroup')}}</el-radio>
        </el-radio-group>
      </el-form-item>

      <!-- <el-form-item :label="$t('tree.groupName')">
        <el-autocomplete
          v-model="form.groupNo"
          :fetch-suggestions="querySearchAsync"
          :placeholder="$t('tree.enterContent')"
          @select="handleSelect"
          clearable
        ></el-autocomplete>
      </el-form-item>-->

      <el-form-item :label="$t('tree.name')">
        <el-select
          v-model="form.groupName"
          filterable
          multiple
          style="width:95%"
          @change="changeName"
          placeholder=""
        >
          <el-option
            v-for="item in allGroupName"
            :key="item.id"
            :label="item.groupName"
            :value="item.groupName"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>

    <el-table
      ref="table"
      :data="userList"
      border
      style="width: 100%"
      :stripe="true"
      :header-cell-style="{background:'#f5f5f5'}"
      :height="tableHeight"
      highlight-current-row
      @current-change="handleChange"
    >
      <!-- <el-table-column type="selection" width="55"></el-table-column> -->
      <el-table-column :label="$t('key.no')" width="50">
        <template slot-scope="scope">{{ page.limit * (page.page - 1) + scope.$index + 1 }}</template>
      </el-table-column>
      <el-table-column :label="$t('tree.groupName')" prop="groupName"></el-table-column>
    </el-table>

    <el-pagination
      small
      background
      @current-change="handleCurrentChange"
      :current-page="page.page"
      :page-size="page.limit"
      layout="prev, pager, next"
      :total="total"
    ></el-pagination>
  </div>
</template>

<script>
import { getAllGroups, queryDevice, queryGroups } from "@/api/system/group";
export default {
  name: "index",
  data() {
    return {
      restaurants: [],
      form: {
        groupType: "1",
        groupName: ""
      },
      page: {
        limit: 10,
        page: 1
      },
      userList: [],
      total: 1,
      currentPage: 1,
      allGroupName: [],
      deviceForm: {},
      itemdata: {},
      tableHeight: 50
    };
  },
  mounted() {
    this.restaurants = this.loadAll();
    this.$nextTick(function() {
      this.tableHeight =
        window.innerHeight - 320;
      // 监听窗口大小变化
      let self = this;
      window.onresize = function() {
        self.tableHeight =
          window.innerHeight - 320;
      };
    });
  },
  methods: {
    loadAll() {
      this.getGroup();
    },
    querySearchAsync(queryString, cb) {
      var restaurants = this.restaurants;
      var results = queryString
        ? restaurants.filter(this.createStateFilter(queryString))
        : restaurants;

      cb(results);
    },
    createStateFilter(queryString) {
      return state => {
        return (
          state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        );
      };
    },
    handleSelect(item) {
      console.log(item);
    },
    handleCurrentChange() {
      this.page.page = val;
      this.getGroup();
    },
    changeName() {
      let newList = [];
      if (this.form.groupName.length === 0) {
        this.userList = this.allGroupName;
      } else {
        for (let i = 0; i < this.form.groupName.length; i++) {
          let arr = this.allGroupName.filter(item => {
            if (item.groupName.includes(this.form.groupName[i])) {
              return item;
            }
          });
          for (let j = 0; j < arr.length; j++) {
            newList.push(arr[j]);
          }
        }
        this.userList = newList;
      }
    },
    getGroup() {
      queryGroups({
        groupName: this.form.groupName.toString(),
        groupType: this.form.groupType,
        limit: this.page.limit,
        page: this.page.page
      }).then(res => {
        if (res.data.data.totalCount != 0) {
          this.userList = res.data.data.list;
          this.allGroupName = res.data.data.list;
        } else {
          this.userList = [];
        }
        this.total = res.data.data.totalCount;
      });
      // this.load1 = false;
    },
    handleChange(val){
      this.$store.commit("SET_TREE_NODE", val);
    }
    // queryAllGroupName(){
    //   this.form.groupNo='';
    //   this.userList=[];
    //   getAllGroups(this.form.groupType ==='tmnl'?1:2).then(res => {
    //     this.allGroupName = res.data.data;
    //   });
    // },
    // queryDeviceList(val){
    //   this.allGroupName.forEach(item => {
    //     if(item.groupName===val){
    //       this.itemdata=item;
    //     }
    //   });
    //   let queryCondition = {
    //       "groupName":this.itemdata.groupName,
    //       "groupType":this.itemdata.groupType,
    //       "limit":this.page.limit,
    //       "page":this.page.page
    //   };
    //   queryDevice(queryCondition).then(res =>{
    //     this.userList = res.data.data.list;
    //     this.total = res.data.data.totalCount;
    //   });

    // }
  }
};
</script>

<style scoped>
</style>
