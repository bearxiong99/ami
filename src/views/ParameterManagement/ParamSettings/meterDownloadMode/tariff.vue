<template>
  <div>
    <div class="uptop">
      {{$t('param.tariffTem')}}
      <div class="right">
        <span @click="copy"
        style="cursor:pointer">
          <img src="img/New.png" alt />
          {{$t('code.copy')}}
        </span>
        <span @click="importBtn"
        style="cursor:pointer">
          <img src="img/import.png" alt />
          {{$t('global.import')}}
        </span>
        <span @click="exportBtn"
        style="cursor:pointer">
          <img src="img/export.png" alt />
          {{$t('global.export')}}
        </span>
        <span @click="add"
        style="cursor:pointer">
          <img src="img/New.png" alt />
          {{$t('areaManage.newBuild')}}
        </span>
        <span @click="del" style="cursor:pointer">
          <img src="img/Delete.png" alt />
          {{$t('global.delete')}}
        </span>
        <span @click="edit" style="cursor:pointer">
          <img src="img/edit.png" alt />
          {{$t('global.edit')}}
        </span>
      </div>
    </div>
    <el-table
      :data="temData"
      border
      :header-cell-style="{background:'#F2F2F2',color:'rgb(51,51,51)'}"
      height="220"
      >
      <el-table-column type="selection"></el-table-column>
      <el-table-column :label="$t('global.id')">
        <template slot-scope="scope">{{ scope.$index + 1 }}</template>
      </el-table-column>
      <el-table-column :label="$t('clock.temName')">
      </el-table-column>
      <el-table-column :label="$t('param.temDetail')">
        <template slot-scope="scope">
          <span class="view" style="color:#1890FF">{{$t('route.notice_view')}}</span>
          <div style="diaplay:none;">{{scope}}</div>
        </template>
      </el-table-column>
    </el-table>

    <!-- 新增模板 -->
    <el-dialog
      :title="$t('param.addEdit')"
      :visible.sync="dialogShow"
      width="60%">
      <el-form :inline="true" :model="formTem" label-position="left">
        <el-form-item :label="$t('clock.temName')">
          <el-input v-model="formTem.temName" size="small" style="width: 150px"></el-input>
        </el-form-item>
        <el-form-item :label="$t('payset.calendarName')">
          <el-input v-model="formTem.temName" size="small" style="width: 150px"></el-input>
        </el-form-item>
      </el-form>
      <el-tabs v-model="active">
        <!-- 天添加 -->
        <el-tab-pane :label="$t('payset.day')" name="1">
          <el-tabs v-model="dayActive" type="card">
            <el-tab-pane label="Day0" name="0">
              <div class="content">
                <div class="table">
                  <div class="table-head">
                    {{'Day0 tariff'}}
                    <div class="right-box">
                      <span @click="dayDele">
                        <img src="img/delete.png" alt />
                        {{$t('route.delete')}}
                      </span>
                    </div>
                  </div>
                  <el-table
                    :data="dayData"
                    border
                    :header-cell-style="{background:'#F2F2F2',color:'rgb(51,51,51)'}"
                    height="420"
                    @selection-change="daySelect"
                    >
                    <el-table-column type="selection"></el-table-column>
                    <el-table-column :label="$t('global.time')" prop="commondata">
                    </el-table-column>
                    <el-table-column :label="$t('global.tariff')" prop="dayid" >
                      <template slot-scope="scope">{{ changeOption(scope.row.dayid)}}</template>
                    </el-table-column>
                  </el-table>
                  <div class="table-foot">
                    <span>{{$t('global.time')}}</span>
                    <el-time-select
                      v-model="dayForm.commondata"
                      :picker-options="{
                        start: '00:00',
                        step: '00:30',
                        end: '23:30',
                      }"
                    ></el-time-select>
                    <span>{{$t('global.tariff')}}:</span>
                    <el-select v-model="dayForm.dayid" placeholder >
                      <el-option label="T1" value="1"></el-option>
                      <el-option label="T2" value="2"></el-option>
                      <el-option label="T3" value="3"></el-option>
                      <el-option label="T4" value="4"></el-option>
                      <el-option label="T5" value="5"></el-option>
                      <el-option label="T6" value="6"></el-option>
                      <el-option label="T7" value="7"></el-option>
                      <el-option label="T8" value="8"></el-option>
                    </el-select>
                    <el-button type="primary" @click="dayAdd" style="float:right;">{{$t('global.add')}}</el-button>
                  </div>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="Day1" name="1">
              <div class="content">
                <div class="table">
                  <div class="table-head">
                    {{'Day1 tariff'}}
                    <div class="right-box">
                      <span @click="dayDele">
                        <img src="img/delete.png" alt />
                        {{$t('route.delete')}}
                      </span>
                    </div>
                  </div>
                  <el-table
                    :data="dayData"
                    border
                    :header-cell-style="{background:'#F2F2F2',color:'rgb(51,51,51)'}"
                    height="420"
                    @selection-change="daySelect"
                    >
                    <el-table-column type="selection"></el-table-column>
                    <el-table-column :label="$t('global.time')" prop="commondata">
                    </el-table-column>
                    <el-table-column :label="$t('global.tariff')" prop="dayid" >
                      <template slot-scope="scope">{{ changeOption(scope.row.dayid)}}</template>
                    </el-table-column>
                  </el-table>
                  <div class="table-foot">
                    <span>{{$t('global.time')}}</span>
                    <el-time-select
                      v-model="dayForm.commondata"
                      :picker-options="{
                        start: '00:00',
                        step: '00:30',
                        end: '23:30',
                      }"
                    ></el-time-select>
                    <span>{{$t('global.tariff')}}:</span>
                    <el-select v-model="dayForm.dayid" placeholder >
                      <el-option label="T1" value="1"></el-option>
                      <el-option label="T2" value="2"></el-option>
                      <el-option label="T3" value="3"></el-option>
                      <el-option label="T4" value="4"></el-option>
                      <el-option label="T5" value="5"></el-option>
                      <el-option label="T6" value="6"></el-option>
                      <el-option label="T7" value="7"></el-option>
                      <el-option label="T8" value="8"></el-option>
                    </el-select>
                    <el-button type="primary" @click="dayAdd" style="float:right;">{{$t('global.add')}}</el-button>
                  </div>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="Day2" name="2">
              <div class="content">
                <div class="table">
                  <div class="table-head">
                    {{'Day2 tariff'}}
                    <div class="right-box">
                      <span @click="dayDele">
                        <img src="img/delete.png" alt />
                        {{$t('route.delete')}}
                      </span>
                    </div>
                  </div>
                  <el-table
                    :data="dayData"
                    border
                    :header-cell-style="{background:'#F2F2F2',color:'rgb(51,51,51)'}"
                    height="420"
                    @selection-change="daySelect"
                    >
                    <el-table-column type="selection"></el-table-column>
                    <el-table-column :label="$t('global.time')" prop="commondata">
                    </el-table-column>
                    <el-table-column :label="$t('global.tariff')" prop="dayid" >
                      <template slot-scope="scope">{{ changeOption(scope.row.dayid)}}</template>
                    </el-table-column>
                  </el-table>
                  <div class="table-foot">
                    <span>{{$t('global.time')}}</span>
                    <el-time-select
                      v-model="dayForm.commondata"
                      :picker-options="{
                        start: '00:00',
                        step: '00:30',
                        end: '23:30',
                      }"
                    ></el-time-select>
                    <span>{{$t('global.tariff')}}:</span>
                    <el-select v-model="dayForm.dayid" placeholder >
                      <el-option label="T1" value="1"></el-option>
                      <el-option label="T2" value="2"></el-option>
                      <el-option label="T3" value="3"></el-option>
                      <el-option label="T4" value="4"></el-option>
                      <el-option label="T5" value="5"></el-option>
                      <el-option label="T6" value="6"></el-option>
                      <el-option label="T7" value="7"></el-option>
                      <el-option label="T8" value="8"></el-option>
                    </el-select>
                    <el-button type="primary" @click="dayAdd" style="float:right;">{{$t('global.add')}}</el-button>
                  </div>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="Day3" name="3">
              <div class="content">
                <div class="table">
                  <div class="table-head">
                    {{'Day3 tariff'}}
                    <div class="right-box">
                      <span @click="dayDele">
                        <img src="img/delete.png" alt />
                        {{$t('route.delete')}}
                      </span>
                    </div>
                  </div>
                  <el-table
                    :data="dayData"
                    border
                    :header-cell-style="{background:'#F2F2F2',color:'rgb(51,51,51)'}"
                    height="420"
                    @selection-change="daySelect"
                    >
                    <el-table-column type="selection"></el-table-column>
                    <el-table-column :label="$t('global.time')" prop="commondata">
                    </el-table-column>
                    <el-table-column :label="$t('global.tariff')" prop="dayid" >
                      <template slot-scope="scope">{{ changeOption(scope.row.dayid)}}</template>
                    </el-table-column>
                  </el-table>
                  <div class="table-foot">
                    <span>{{$t('global.time')}}</span>
                    <el-time-select
                      v-model="dayForm.commondata"
                      :picker-options="{
                        start: '00:00',
                        step: '00:30',
                        end: '23:30',
                      }"
                    ></el-time-select>
                    <span>{{$t('global.tariff')}}:</span>
                    <el-select v-model="dayForm.dayid" placeholder >
                      <el-option label="T1" value="1"></el-option>
                      <el-option label="T2" value="2"></el-option>
                      <el-option label="T3" value="3"></el-option>
                      <el-option label="T4" value="4"></el-option>
                      <el-option label="T5" value="5"></el-option>
                      <el-option label="T6" value="6"></el-option>
                      <el-option label="T7" value="7"></el-option>
                      <el-option label="T8" value="8"></el-option>
                    </el-select>
                    <el-button type="primary" @click="dayAdd" style="float:right;">{{$t('global.add')}}</el-button>
                  </div>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="Day4" name="4">
              <div class="content">
                <div class="table">
                  <div class="table-head">
                    {{'Day4 tariff'}}
                    <div class="right-box">
                      <span @click="dayDele">
                        <img src="img/delete.png" alt />
                        {{$t('route.delete')}}
                      </span>
                    </div>
                  </div>
                  <el-table
                    :data="dayData"
                    border
                    :header-cell-style="{background:'#F2F2F2',color:'rgb(51,51,51)'}"
                    height="420"
                    @selection-change="daySelect"
                    >
                    <el-table-column type="selection"></el-table-column>
                    <el-table-column :label="$t('global.time')" prop="commondata">
                    </el-table-column>
                    <el-table-column :label="$t('global.tariff')" prop="dayid" >
                      <template slot-scope="scope">{{ changeOption(scope.row.dayid)}}</template>
                    </el-table-column>
                  </el-table>
                  <div class="table-foot">
                    <span>{{$t('global.time')}}</span>
                    <el-time-select
                      v-model="dayForm.commondata"
                      :picker-options="{
                        start: '00:00',
                        step: '00:30',
                        end: '23:30',
                      }"
                    ></el-time-select>
                    <span>{{$t('global.tariff')}}:</span>
                    <el-select v-model="dayForm.dayid" placeholder >
                      <el-option label="T1" value="1"></el-option>
                      <el-option label="T2" value="2"></el-option>
                      <el-option label="T3" value="3"></el-option>
                      <el-option label="T4" value="4"></el-option>
                      <el-option label="T5" value="5"></el-option>
                      <el-option label="T6" value="6"></el-option>
                      <el-option label="T7" value="7"></el-option>
                      <el-option label="T8" value="8"></el-option>
                    </el-select>
                    <el-button type="primary" @click="dayAdd" style="float:right;">{{$t('global.add')}}</el-button>
                  </div>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="Day5" name="5">
              <div class="content">
                <div class="table">
                  <div class="table-head">
                    {{'Day5 tariff'}}
                    <div class="right-box">
                      <span @click="dayDele">
                        <img src="img/delete.png" alt />
                        {{$t('route.delete')}}
                      </span>
                    </div>
                  </div>
                  <el-table
                    :data="dayData"
                    border
                    :header-cell-style="{background:'#F2F2F2',color:'rgb(51,51,51)'}"
                    height="420"
                    @selection-change="daySelect"
                    >
                    <el-table-column type="selection"></el-table-column>
                    <el-table-column :label="$t('global.time')" prop="commondata">
                    </el-table-column>
                    <el-table-column :label="$t('global.tariff')" prop="dayid" >
                      <template slot-scope="scope">{{ changeOption(scope.row.dayid)}}</template>
                    </el-table-column>
                  </el-table>
                  <div class="table-foot">
                    <span>{{$t('global.time')}}</span>
                    <el-time-select
                      v-model="dayForm.commondata"
                      :picker-options="{
                        start: '00:00',
                        step: '00:30',
                        end: '23:30',
                      }"
                    ></el-time-select>
                    <span>{{$t('global.tariff')}}:</span>
                    <el-select v-model="dayForm.dayid" placeholder >
                      <el-option label="T1" value="1"></el-option>
                      <el-option label="T2" value="2"></el-option>
                      <el-option label="T3" value="3"></el-option>
                      <el-option label="T4" value="4"></el-option>
                      <el-option label="T5" value="5"></el-option>
                      <el-option label="T6" value="6"></el-option>
                      <el-option label="T7" value="7"></el-option>
                      <el-option label="T8" value="8"></el-option>
                    </el-select>
                    <el-button type="primary" @click="dayAdd" style="float:right;">{{$t('global.add')}}</el-button>
                  </div>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="Day6" name="6">
              <div class="content">
                <div class="table">
                  <div class="table-head">
                    {{'Day6 tariff'}}
                    <div class="right-box">
                      <span @click="dayDele">
                        <img src="img/delete.png" alt />
                        {{$t('route.delete')}}
                      </span>
                    </div>
                  </div>
                  <el-table
                    :data="dayData"
                    border
                    :header-cell-style="{background:'#F2F2F2',color:'rgb(51,51,51)'}"
                    height="420"
                    @selection-change="daySelect"
                    >
                    <el-table-column type="selection"></el-table-column>
                    <el-table-column :label="$t('global.time')" prop="commondata">
                    </el-table-column>
                    <el-table-column :label="$t('global.tariff')" prop="dayid" >
                      <template slot-scope="scope">{{ changeOption(scope.row.dayid)}}</template>
                    </el-table-column>
                  </el-table>
                  <div class="table-foot">
                    <span>{{$t('global.time')}}</span>
                    <el-time-select
                      v-model="dayForm.commondata"
                      :picker-options="{
                        start: '00:00',
                        step: '00:30',
                        end: '23:30',
                      }"
                    ></el-time-select>
                    <span>{{$t('global.tariff')}}:</span>
                    <el-select v-model="dayForm.dayid" placeholder >
                      <el-option label="T1" value="1"></el-option>
                      <el-option label="T2" value="2"></el-option>
                      <el-option label="T3" value="3"></el-option>
                      <el-option label="T4" value="4"></el-option>
                      <el-option label="T5" value="5"></el-option>
                      <el-option label="T6" value="6"></el-option>
                      <el-option label="T7" value="7"></el-option>
                      <el-option label="T8" value="8"></el-option>
                    </el-select>
                    <el-button type="primary" @click="dayAdd" style="float:right;">{{$t('global.add')}}</el-button>
                  </div>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="Day7" name="7">
              <div class="content">
                <div class="table">
                  <div class="table-head">
                    {{'Day7 tariff'}}
                    <div class="right-box">
                      <span @click="dayDele">
                        <img src="img/delete.png" alt />
                        {{$t('route.delete')}}
                      </span>
                    </div>
                  </div>
                  <el-table
                    :data="dayData"
                    border
                    :header-cell-style="{background:'#F2F2F2',color:'rgb(51,51,51)'}"
                    height="420"
                    @selection-change="daySelect"
                    >
                    <el-table-column type="selection"></el-table-column>
                    <el-table-column :label="$t('global.time')" prop="commondata">
                    </el-table-column>
                    <el-table-column :label="$t('global.tariff')" prop="dayid" >
                      <template slot-scope="scope">{{ changeOption(scope.row.dayid)}}</template>
                    </el-table-column>
                  </el-table>
                  <div class="table-foot">
                    <span>{{$t('global.time')}}</span>
                    <el-time-select
                      v-model="dayForm.commondata"
                      :picker-options="{
                        start: '00:00',
                        step: '00:30',
                        end: '23:30',
                      }"
                    ></el-time-select>
                    <span>{{$t('global.tariff')}}:</span>
                    <el-select v-model="dayForm.dayid" placeholder >
                      <el-option label="T1" value="1"></el-option>
                      <el-option label="T2" value="2"></el-option>
                      <el-option label="T3" value="3"></el-option>
                      <el-option label="T4" value="4"></el-option>
                      <el-option label="T5" value="5"></el-option>
                      <el-option label="T6" value="6"></el-option>
                      <el-option label="T7" value="7"></el-option>
                      <el-option label="T8" value="8"></el-option>
                    </el-select>
                    <el-button type="primary" @click="dayAdd" style="float:right;">{{$t('global.add')}}</el-button>
                  </div>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-tab-pane>

        <!-- 周添加 -->
        <el-tab-pane :label="$t('payset.week')" name="2">
          <div class="content">
            <div class="table">
              <div class="table-head">
                {{$t('payset.weektariff')}}
                <div class="right-box">
                  <span @click="weekDele">
                    <img src="img/delete.png" alt />
                    {{$t('route.delete')}}
                  </span>
                </div>
              </div>
              <el-table
                :data="weekData"
                border
                :header-cell-style="{background:'#F2F2F2',color:'rgb(51,51,51)'}"
                height="420"
                @selection-change="weekSelect"
                >
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop="name" :label="$t('payset.weekname')">
                  <!-- <template slot-scope="scope">{{ scope.row.name='0'+scope.$index}}</template> -->
                </el-table-column>
                <el-table-column prop="mon" :label="$t('payset.monday')">
                  <template slot-scope="scope">{{ changeOption(scope.row.mon)}}</template>
                </el-table-column>
                <el-table-column prop="tue" :label="$t('payset.tuesday')">
                  <template slot-scope="scope">{{ changeOption(scope.row.tue)}}</template>
                </el-table-column>
                <el-table-column prop="wed" :label="$t('payset.wednesday')">
                  <template slot-scope="scope">{{ changeOption(scope.row.wed)}}</template>
                </el-table-column>
                <el-table-column prop="tuh" :label="$t('payset.thursday')">
                  <template slot-scope="scope">{{ changeOption(scope.row.tuh)}}</template>
                </el-table-column>
                <el-table-column prop="fri" :label="$t('payset.friday')">
                  <template slot-scope="scope">{{ changeOption(scope.row.fri)}}</template>
                </el-table-column>
                <el-table-column prop="sta" :label="$t('payset.saturday')">
                  <template slot-scope="scope">{{ changeOption(scope.row.sta)}}</template>
                </el-table-column>
                <el-table-column prop="sun" :label="$t('payset.sunday')">
                  <template slot-scope="scope">{{ changeOption(scope.row.sun)}}</template>
                </el-table-column>
              </el-table>
              <div class="table-foot">
                <div class="box">
                  <span>{{$t('payset.monday')}}：</span>
                  <el-select v-model="weekForm.mon" placeholder size="small">
                    <el-option
                      v-for="item in dayOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </div>
                <div class="box">
                  <span>{{$t('payset.tuesday')}}：</span>
                  <el-select v-model="weekForm.tue" placeholder size="small">
                    <el-option
                      v-for="item in dayOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </div>
                <div class="box">
                  <span>{{$t('payset.wednesday')}}：</span>
                  <el-select v-model="weekForm.wed" placeholder size="small">
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </div>
                <div class="box">
                  <span>{{$t('payset.thursday')}}：</span>
                  <el-select v-model="weekForm.tuh" placeholder size="small">
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </div>
                <div class="box">
                  <span>{{$t('payset.friday')}}：</span>
                  <el-select v-model="weekForm.fri" placeholder size="small">
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </div>
                <div class="box">
                  <span>{{$t('payset.saturday')}}：</span>
                  <el-select v-model="weekForm.sta" placeholder size="small">
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </div>
                <div class="box">
                  <span>{{$t('payset.sunday')}}：</span>
                  <el-select v-model="weekForm.sun" placeholder size="small">
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </div>
                <el-button type="primary" @click="weekAdd" style="float:right;">{{$t('global.add')}}</el-button>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
      <el-tab-pane :label="$t('payset.season')" name="3">
        
      </el-tab-pane>
      <div slot="footer" class="dialog-footer" style="text-align:right;">
        <el-button @click="dialogShow = false" >{{$t('global.cancel')}}</el-button>
        <el-button type="primary" >{{$t('global.save')}}</el-button>
      </div>
    </el-dialog>

    <!-- 电表数据 -->
    <div class="content">
      <div class="table">
        <div class="table-head">
          {{$t('clock.meterList')}}
          <div class="right-box">
            <searchForm @searchFun="searchDevice" :isType="1"></searchForm>
            <span @click="activeNow" style="cursor:pointer">
              <img src="img/Immediateactivate.png" alt />
              {{$t('upgrade.immediateactivate')}}
            </span>
            <span @click="activeDialog" style="cursor:pointer">
              <img src="img/Scheduleactivate.png" alt />
              {{$t('upgrade.scheduleactivate')}}
            </span>
            <span @click="read">
              <img src="img/read.png" alt />
              {{$t('global.read')}}
            </span>
            <span @click="write">
              <img src="img/write.png" alt />
              {{$t('global.write')}}
            </span>
            <span @click="checkResult">
              <img src="img/Checkresult.png" alt />
              {{$t('global.checkResult')}}
            </span>
          </div>
        </div>
          <!-- 表格组件 -->
        <meterTable :basicdata="basicdata" :loading="loading" @selectMeter="selectFun" :height='tableHeight' :pageNum='query'></meterTable>

        <pagination
          :page.sync="query.page"
          :limit.sync="query.limit"
          :total="total"
          @pagination="getData"
        ></pagination>
      </div>
    </div>

    <!-- 查询结果 -->
    <el-dialog
      :title="$t('global.checkResult')"
      :visible.sync="checkResultVisible"
      width="60%"
      :before-close="handleClose"
    >
      <!--  查询结果表格 -->
      <div class="content">
        <div class="table">
          <div class="table-head">
            {{$t('clock.meterList')}}
            <div class="right-box">
              <!-- 进度条组件 -->
              <progressCom :num="proNum"></progressCom>
              <div class="formname">
                <span>Logic Device Name</span>
                <el-select
                  v-model="searchForm.name"
                  size="mini"
                  filterable
                  multiple
                  collapse-tags
                  style="margin:0 20px 0 20px;width: 230px;line-height:28px;"
                >
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
                <el-button type="primary" icon="el-icon-search" @click="filterBtn"></el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <el-table
        :data="resultTableData"
        v-loading="loadingT"
        border
        :header-cell-style="{background:'#F2F2F2',color:'rgb(51,51,51)'}"
        height="600"
      >
        <el-table-column :label="$t('global.id')" width="80">
          <template slot-scope="scope">{{ queryT.limit * (queryT.page - 1) + scope.$index + 1 }}</template>
        </el-table-column>
        <el-table-column prop="deviceName" :label="$t('clock.deviceName')"></el-table-column>
        <el-table-column prop="optype" :label="$t('upgrade.operType')">
          <template slot-scope="scope">{{ changeOpt(scope.row.optype) }}</template>
        </el-table-column>
        <el-table-column prop="errorCode" :label="$t('clock.status')"></el-table-column>
        <el-table-column prop="recTime" :label="$t('global.dataresponse')" width="180"></el-table-column>
        <el-table-column prop="value" :label="$t('systemparam.val')">
          <!-- <template slot-scope="scope">{{ formatTimes(scope.row.value) }}</template> -->
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { readTask, checkResult } from "@/api/clock";
import { getDevice, getViewList } from "@/api/autoRegister";
import Pagination from "@/components/Pagination";
import meterTable from '@/components/meterTable';
import searchForm from "@/components/searchForm";
import progressCom from "@/components/progress";
Array.prototype.push_unique = function() {
  for (let i = 0; i < arguments.length; i++) {
    let ele = arguments[i];
    if (this.indexOf(ele) === -1) {
      this.push(ele);
    }
  }
};
export default {
  components:{Pagination,meterTable,searchForm,progressCom},
  data () {
    return {
      temData: [],
      dayData:[],
      weekData:[],
      specialData:[],
      basicdata:[],
      selectTableData:[],
      resultTableData:[],
      tableData:[], 
      taskItem:[],
      daySelectData:[],
      weekSelectData:[],
      dayOptions: [
        {
          label: 'Day0',
          value: '0'
        },
        {
          label: 'Day1',
          value: '1'
        },
        {
          label: 'Day2',
          value: '2'
        },
        {
          label: 'Day3',
          value: '3'
        },
        {
          label: 'Day4',
          value: '4'
        },
        {
          label: 'Day5',
          value: '5'
        },
        {
          label: 'Day6',
          value: '6'
        },
        {
          label: 'Day7',
          value: '7'
        }
      ],
      dayForm:{
        dayid: '0'
      },
      weekForm: {
        mon: '0',
        tue: '0',
        wed: '0',
        tuh: '0',
        fri: '0',
        sta: '0',
        sun: '0'
      },
      dialogShow: false,
      formTem: {
        temName: ''
      },
      active: '1',
      dayActive:'1',
      checkResultVisible:false,
      loading:false,
      loadingT:false,
      params:{
        value1:1,
        value2:1,
        value3:'',
      },
      query:{
        page: 1,
        limit: 20
      },
      queryT:{
        page: 1,
        limit: 9999
      },
      total:0,
      searchForm:{
        name:[]
      },
      searchValue:{
        factoryCode: -1,  //厂家类型
        type:-1, //电表类型或者集中器类型
        serachValue:"" //电表或者集中器逻辑设备名
      },
      tableHeight:window.innerHeight - 630,
      successNum:0,  //查询结果返回状态的累计数量
      isTimer:'', //定时器名称
      proNum:0, //进度
      paramValue:{},
      rate:{},
      options:[], //过滤参数
    };
  },
  methods:{
    isNull(arg1){
      return !arg1 && arg1!==0 && typeof arg1!=="boolean"?true:false;
    },
    copy () {

    },
    importBtn () {

    },
    exportBtn () {

    },
    add () {
      this.dialogShow = true;
    },
    del () {

    },
    edit () {

    },
    // 公共日期添加
    dayAdd(){
      if (this.holiForm.commondata) {
        this.commonData.push({
          commondata:this.holiForm.commondata,
          dayid:this.holiForm.dayid
        })
      }else{
        this.$notify({
          title: this.$t('global.warn'),
          message: this.$t('global.warncont'),
          type: 'warning'
        });
      }
    },
    daySelect(val){
      this.daySelectData=val;
    },
    // 公共日期删除
    dayDele(){
      let current = this.daySelectData;
      let data=this.commonData.filter((item)=>{
        return current.indexOf(item) === -1;
      });
      this.commonData = data;
    },
    // 周添加
    weekAdd(){
      if (this.holiFormT.commondata) {
        this.specialData.push({
          commondata:this.holiFormT.commondata,
          dayid:this.holiFormT.dayid
        })
      }else{
        this.$notify({
          title: this.$t('global.warn'),
          message: this.$t('global.warncont'),
          type: 'warning'
        });
      }
    },
    weekSelect(val){
      this.weekSelectData=val;
    },
    // 周删除
    weekDele(){
      let current = this.specialSelectData;
      let data=this.specialData.filter((item)=>{
        return current.indexOf(item) === -1;
      });
      this.specialData = data;
    },
    getData(){
      this.loading = true;
      let param = {};
      if (this.treeNode.deviceType === "tmnl") {
        param = {
          isAllTmnal: 0, //查集中器是1 查电表是0
          pageNum: this.query.page,
          pageSize: this.query.limit,
          terminalAddr: this.treeNode.deviceName,
          ...this.searchValue
          // commMode:'',
        };
      } else if (this.treeNode.deviceType === "meter") {
        param = {
          isAllTmnal: 0, //查集中器是1 查电表是0
          pageNum: this.query.page,
          pageSize: this.query.limit,
          meterAddr: this.treeNode.deviceName,
          ...this.searchValue
        };
      } else if (this.treeNode.deviceType === "group") {
        param = {
          isAllTmnal: 0,
          groupId: this.treeNode.id,
          pageNum: this.query.page,
          pageSize: this.query.limit,
          ...this.searchValue
        };
      } else {
        param = {
          isAllTmnal: 0, //查集中器是1 查电表是0
          pageNum: this.query.page,
          pageSize: this.query.limit,
          orgNo: this.treeNode.deviceNo,
          ...this.searchValue
          // commMode:'',
        };
      }
      getDevice(param).then(res => {
        if (res.data.data.total != 0) {
          this.basicdata = res.data.data.list;
        } else {
          this.basicdata = [];
        }
        this.total = res.data.data.total;
        this.loading = false;
      });
    },
    //选择数据
    selectFun(val) {
      this.selectTableData = val;
    },
    read () {
      if(this.selectTableData.length!=0){
        if(this.checked.length!=0){
          this.loading=true;
          let taskItems = [];
          let arr=[];
          this.checked.forEach((item)=>{
            arr.push(this.obisList[item-1])
          })
          this.selectTableData.forEach(item => {
            arr.forEach(itemT=>{
              taskItems.push({
                attriFlag: 0,
                attriId: 2,
                classId: 1,
                meterAsset: item.commAddr1,
                obis: itemT,
                pointId: item.mpSn,
                terminalAddr: item.terminalAddr,
                tmnlAssetNo: item.etmnlassetNo,
              });
            })
          });
          console.log(taskItems)
          // this.send(taskItems);
        }else{
          this.$notify({
            title: this.$t("global.warn"),
            message: this.$t("global.itemread"),
            type: "warning"
          });
        }
      }else{
        this.$notify({
          title: this.$t("global.warn"),
          message: this.$t("global.warncont"),
          type: "warning"
        });
      }
    },
    write(){
      if(this.selectTableData.length!=0){
        this.loading=true;
        let taskItems = [];
        let arr=[];
        this.checked.forEach((item)=>{
          arr.push(this.obisList[item-1])
        })
        this.selectTableData.forEach(item => {
          arr.forEach(itemT=>{
            taskItems.push({
              attriFlag: 0,
              attriId: 2,
              classId: 1,
              meterAsset: item.commAddr1,
              obis: itemT,
              pointId: item.mpSn,
              terminalAddr: item.terminalAddr,
              tmnlAssetNo: item.etmnlassetNo,
            });
          })
        });
        this.send(taskItems);
      }else{
        this.$notify({
          title: this.$t("global.warn"),
          message: this.$t("global.warncont"),
          type: "warning"
        });
      }
    },
    send(val) {
      this.searchForm.name=[];
      this.resultTableData=[];
      this.proNum=0;
      readTask(val).then(res => {
        this.taskItem=[]
        this.loading=false;
        if (res.data.success) {
          res.data.data.forEach((item,index) => {
            this.taskItem.push({
              name:item.meterAsset,
              taskId:item.taskId
            });
          });
          this.$message({
            message: this.$t("global.operatorSuccess"),
            type: "success"
          });
          this.checkResult();
        }
      });
    },
    checkResult () {
      if(this.taskItem.length===0){
        this.$message({
          message: this.$t("global.readdata"),
          type: 'warning'
        });
      }else{
        this.checkResultVisible = true;
        this.startTime();
        // this.loadingT=true;
        let arr = []
        let a=0;
        this.taskItem.forEach(item=>{
          arr.push(item.taskId)
        })
        this.paramValue={
          taskIds:arr,
          pageNum:this.queryT.page,
          pageSize:this.queryT.limit,

        }
        checkResult(this.paramValue).then(res => {
          this.tableData = [];
          this.totalT=res.data.data.count;
          res.data.data.items.forEach(item=> {
            if(item.taskStauts!=-1){
              a++;
            }
            let param={}
            this.taskItem.forEach(itemT=>{
              if(itemT.taskId==item.taskId){
                param.deviceName=itemT.name
                param.errorCode=item.errorCode,
                param.recTime=item.recTime
              }
            })
            if('responseCodeItems' in item.responseDbDataItem){
              item.responseDbDataItem.responseCodeItems.forEach((itemF,index)=>{
                param['data'+index]=itemF.value
              }) 
            }
            this.tableData.push(param);
          });
          if(a==this.tableData.length){
            clearInterval(this.isTimer);
          }
          this.successNum=a;
          this.proNum=Math.round((this.successNum/this.tableData.length).toFixed(2)*100);
          this.rate={
            success:this.successNum,
            total:this.totalT
          }
          this.filterBtn();
          this.allMeterName();
          // this.loadingT=false;
        });
      }
    },
    activeNow(){},
    activeDialog(){},
    // 精准查找操作
    searchDevice(val){
      this.searchValue=val;
      this.getData();
    },
    // 定时器
    startTime(){
      this.isTimer=setTimeout(this.checkResult, 1000);
    },
    // 关闭弹框和定时器
    handleClose() {
      this.checkResultVisible=false;
      clearInterval(this.isTimer);
    },
    // 过滤按钮
    filterBtn() {
      let newList = [];
      if (this.searchForm.name.length === 0) {
        this.resultTableData = this.tableData;
      }else {
        for (let i = 0; i < this.searchForm.name.length; i++) {
          let arr = this.tableData.filter(item => {
            if (item.deviceName.includes(this.searchForm.name[i])) {
              return item;
            }
          });
          for (let j = 0; j < arr.length; j++) {
            newList.push(arr[j]);
          }
        }
        this.resultTableData = newList;
      }
    },

    allMeterName() {
      // 取出所有的电表
      let meterIdArr = [];
       this.options=[];
      for (let i = 0; i < this.tableData.length; i++) {
        meterIdArr.push_unique(this.tableData[i].deviceName)
      }
      for (let i = 0; i < meterIdArr.length; i++) {
        this.options.push({
          value: meterIdArr[i],
          label: meterIdArr[i]
        })
      }
    },
    // 精准查找操作
    searchDevice(val){
      this.searchValue=val;
      this.getData();
    },
    changeOpt(val){
      if (val.optType == 1) {
        return this.$t('global.read')
      } else {
        return this.$t('global.write')
      }
    },
    changeOption (val) {
      for (let i in this.dayOptions) {
        if (this.dayOptions[i].value == val) {
          return this.dayOptions[i].label;
        }
      }
    },
  }
}
</script>
<style lang='scss' scoped>
.uptop {
  padding: 10px;
  border: 1px solid #dddddd;
  .right {
    float: right;
    span {
      padding: 0 20px;
      border-left: 1px solid #dddddd;
      cursor:pointer;
    }
    img {
      vertical-align: middle;
      margin-right: 8px;
    }
  }
}
.view {
  text-decoration: underline;
  font-size: 14px;
  cursor: pointer;
}
.el-transfer {
  /deep/ .el-transfer-panel {
    width: 40%;
  }
  /deep/ .el-transfer__buttons {
    display: flex;
    flex-direction: column;
    justify-content: center;
    .el-button {
      border-radius: 0!important;
    }
  }
}
.content {
  .head {
    height: 40px;
    padding: 5px 10px 0;
    background-color: #c6dedd;
    box-sizing: border-box;
    h3 {
      display: inline-block;
      height: 35px;
      padding: 0 20px;
      margin: 0;
      background-color: #fff;
      text-align: center;
      line-height: 35px;
      font-size: 14px;
      font-weight: normal;
    }
  }
  .table {
    position: relative;
    .table-head {
      height: 40px;
      padding-left: 20px;
      border: 1px solid #ddd;
      // border-bottom: 0;
      line-height: 40px;
      .right-box {
        float: right;
        display: flex;
        align-items: center;
        height: 40px;
        margin-right: 20px;
      }
      .formname {
        display: flex;
        align-items: center;
        height: 40px;
        > span {
          display: inline-block;
          width: 130px;
          border-left: 1px solid #ddd;
          height: 20px;
          line-height: 20px;
          padding: 0 0 0 20px;
        }
      }
      span {
        display: inline-block;
        padding: 0 20px;
        height: 20px;
        // margin-top: 10px;
        line-height: 20px;
        text-align: center;
        border-left: 1px solid #ddd;
        cursor: pointer;
        img {
          vertical-align: middle;
          margin-right: 8px;
        }
      }
    }
    .table-foot{
      width: 100%;
      // display: inline-block;
      box-sizing: border-box;
      border:1px solid #ddd;
      padding: 10px;
      line-height: 100%;
      span {
        display: inline-block;
        width: 90px;
        margin-right: 10px;
      }
      .box{
        margin: 0 10px 20px 0;
        display: inline-block;
      }
    }
  }
}
</style>