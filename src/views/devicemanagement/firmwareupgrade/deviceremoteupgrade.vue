<template>
  <basic-container>
    <div class="routerbox remote">
      <el-tabs v-model="activeName" @tab-click="handleClick" style="width:100%;" type="border-card">
        <el-tab-pane :label="$t('upgrade.firmsetting')" name="first">
          <div class="cont" ref="cont">
            <el-form :inline="true" :model="formDevice" label-position="left">
              <el-form-item :label="$t('upgrade.devtype')">
                <el-select v-model="formDevice.devtype" style="width: 100%;" size="small">
                  <el-option :label="$t('upgrade.dcu')" :value="1"></el-option>
                  <el-option :label="$t('upgrade.nbg')" :value="2"></el-option>
                  <!-- <el-option :label="$t('upgrade.meter')" :value="3"></el-option> -->
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('change.manufacturer')">
                <el-select v-model="formDevice.factoryId" size="small" style="width:100%">
                  <el-option :label="$t('global.all')" :value="''"></el-option>
                  <el-option :label="ele.typeName" :value="ele.typeCode" v-for="(ele, i) in tmnlFactoryList" :key="i"></el-option>
                </el-select>
              </el-form-item>
              <!-- <el-form-item :label="$t('Logic device name')" label-width="150px">
                <el-input :maxlength="30" v-model="formDevice.name" size="small"></el-input>
              </el-form-item>
              <el-form-item :label="$t('change.manufacturer')">
                <el-input :maxlength="30" v-model="formDevice.name" size="small"></el-input>
              </el-form-item>-->
              <el-form-item>
                <el-button type="primary" @click="search" size="small">{{$t('global.search')}}</el-button>
              </el-form-item>
            </el-form>
            <div class="uptop">
              <div>{{$t('global.deviceinfo')}}</div>
              <span @click="batch" style="cursor:pointer">
                <img src="img/Firmwareupgrade.png" alt />
                {{$t('upgrade.firmupgrade')}}
              </span>
            </div>
            <el-table
              :data="dcuData.listitem"
              border
              :header-cell-style="{background:'#F2F2F2',color:'rgb(51,51,51)'}"
              height="53vh"
              @selection-change="dcuDataSelect"
              v-loading="load">
              <el-table-column type="selection" width="80"></el-table-column>
              <el-table-column :label="$t('global.id')" width="80">
                <template slot-scope="scope">{{ dcuData.pageSize * (dcuData.pageNum - 1) + scope.$index + 1 }}</template>
              </el-table-column>
              <!-- <el-table-column prop="terminalId" :label="$t('areaManage.name')"></el-table-column> -->
              <!-- <el-table-column prop="meterId" :label="$t('areaManage.name')" v-else></el-table-column> -->
              <el-table-column prop="tmnlAssetNo" :label="$t('areaManage.tmnlAssetNo')"></el-table-column>
              <el-table-column prop="terminalAddr" :label="$t('areaManage.terminalAddr')"></el-table-column>
              <!-- <el-table-column prop="comm_addr1" :label="$t('areaManage.commadd')" v-else></el-table-column> -->
              <el-table-column prop="factoryCode" :label="$t('change.manufacturer')" :formatter="tmnlFactoryFormat">
              </el-table-column>
              <el-table-column prop="tmnlVer" :label="$t('upgrade.lastupversion')">
                <template slot-scope="scope">
                  <span :title="scope.row.tmnlVer">{{scope.row.tmnlVer}}</span>
                </template>
              </el-table-column>
              <!-- <el-table-column prop="fileName" :label="$t('upgrade.lastupfile')" width="160"></el-table-column> -->
              <el-table-column prop="recvTime" :label="$t('upgrade.lastuptime')"></el-table-column>
            </el-table>
            <el-pagination
              style="text-align:left;margin-top:20px;"
              background
              @size-change="dcuSizeChange"
              @current-change="dcuCurrentChange"
              :page-sizes="[20, 40, 60, 200]"
              layout="total, sizes, prev, pager, next, jumper"
              :total="dcuData.total"
            ></el-pagination>
          </div>
        </el-tab-pane>
        <el-tab-pane :label="$t('upgrade.upmonitoring')" name="second">
          <monting></monting>
        </el-tab-pane>
        <el-tab-pane :label="$t('upgrade.dcuactive')" name="third">
          <dcuactive></dcuactive>
        </el-tab-pane>
        <el-tab-pane :label="$t('upgrade.meteractive')" name="fourth">
          <meteractive></meteractive>
        </el-tab-pane>
      </el-tabs>

      <el-dialog :title="uptitle" :visible.sync="setDialog" width="60%" :before-close="settingClose">
<!-- 固件升级第一步S -->
        <div v-show="step === 0">
          <el-form
            :model="formSetting"
            ref="setref"
            label-width="auto"
            label-position="left"
            style="margin:0 auto;width:50%;"
            :rules="setrules">
            <el-form-item :label="$t('upgrade.devtype')" prop="language">
              <el-select v-model="formSetting.language" style="width: 100%;" size="small">
                <el-option :label="$t('upgrade.dcu')" :value="1" v-if="formDevice.devtype === 1"></el-option>
                <el-option :label="$t('upgrade.nbg')" :value="2" v-if="formDevice.devtype === 2"></el-option>
                <el-option :label="$t('upgrade.meter')" :value="3" v-if="formDevice.devtype === 1"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('upgrade.activemode')" size="small" prop="activateMode">
              <el-select v-model="formSetting.activateMode" style="width: 100%;" :disabled="disabled">
                <el-option :label="$t('upgrade.activateimmediately')" value="FFFF-FF-FF FF:FF:FF"></el-option>
                <el-option :label="$t('upgrade.activateondemand')" value="0000-00-00 00:00:00"></el-option>
                <!-- <el-option :label="$t('upgrade.activatebyschedule')" :value="3"></el-option> -->
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('upgrade.activetime')" v-if="formSetting.activateMode !== 'FFFF-FF-FF FF:FF:FF'" prop="activateTime">
              <el-date-picker
                v-model="formSetting.activateTime"
                type="datetime"
                :placeholder="$t('global.seltime')"
                size="small"
                value-format="yyyy-MM-dd HH:mm:ss"
                style="width: 100%;"
                :clearable="false"
                :editable="false"
              ></el-date-picker>
            </el-form-item>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer" style="text-align:right;" v-show="step === 0">
            <el-button @click="setDialog = false" size="small">{{$t('global.cancel')}}</el-button>
            <el-button type="primary" @click="stepChange" size="small">{{$t('global.next')}}</el-button>
        </span>
<!-- 固件升级第一步E -->

      <div v-show="formSetting.language === 3 && step === 1">
        <el-form
          :model="formMeter"
          label-width="auto"
          label-position="left"
          style="width:100%;margin:0 auto;"
          :inline="true"
          ref="formeter"
          :rules="meterfuls"
        >
          <el-form-item :label="$t('upgrade.tyraround')+'(1~10)'" size="small" prop="retryTimes">
            <el-input v-model="formMeter.retryTimes"  placeholder="" :maxlength="2"></el-input>
          </el-form-item>
          <el-form-item :label="$t('upgrade.rearound')+'(1~10)'" size="small" prop="resendRounds" >
            <el-input v-model="formMeter.resendRounds" placeholder="" :maxlength="2"></el-input>
          </el-form-item>
          <el-form-item :label="$t('upgrade.activearound')+'(1~10)'" size="small" prop="activeRounds" >
            <el-input v-model="formMeter.activeRounds" placeholder="" :maxlength="2"></el-input>
          </el-form-item>
          <!-- <el-form-item :label="$t('upgrade.whetherbroad')" size="small" prop="activateMode" >
            <el-input :maxlength="30" v-model="formMeter.times" placeholder=""></el-input>
          </el-form-item> -->
          <el-form-item :label="$t('upgrade.lostpack')+'(1~200)'" size="small" prop="losePackIndicate" >
            <el-input v-model="formMeter.losePackIndicate" placeholder="" :maxlength="3"></el-input>
          </el-form-item>
          <el-form-item :label="$t('upgrade.activeatt')+'(1~10)'" size="small" prop="startupgradeRetry" >
            <el-input v-model="formMeter.startupgradeRetry" placeholder="" :maxlength="2"></el-input>
          </el-form-item>
          <el-form-item :label="$t('upgrade.optallmeter')"  prop="meterAll" >
            <el-radio disabled v-model="formMeter.meterAll" :label="1">{{$t('global.true')}}</el-radio>
            <el-radio disabled v-model="formMeter.meterAll" :label="2">{{$t('global.false')}}</el-radio>
            <!-- <el-input :maxlength="30" v-model="formMeter.meterAll" placeholder="" size="small"></el-input> -->
          </el-form-item>
          <el-form-item :label="$t('systemparam.starttime')" size="small" prop="startTime" style="width:100%">
            <el-date-picker
              v-model="formMeter.startTime"
              type="datetime"
              placeholder
              style="width: 100%;"
              size="small"
              value-format="yyyy-MM-dd HH:mm:ss"
              :clearable="false"
              :editable="false"
            ></el-date-picker>
          </el-form-item>
          <el-form-item :label="$t('upgrade.endtime')" size="small" prop="endTime" style="width:100%">
            <el-date-picker
              v-model="formMeter.endTime"
              type="datetime"
              placeholder
              style="width: 100%;"
              size="small"
              value-format="yyyy-MM-dd HH:mm:ss"
              :clearable="false"
              :editable="false"
            ></el-date-picker>
          </el-form-item>
          <el-form-item :label="$t('upgrade.activetime')" size="small" prop="activeTime" style="width:100%">
            <el-date-picker
              v-model="formMeter.activeTime"
              type="datetime"
              placeholder
              style="width: 100%;"
              size="small"
              value-format="yyyy-MM-dd HH:mm:ss"
              :clearable="false"
              :editable="false"
            ></el-date-picker>
          </el-form-item>
        </el-form>

        <!-- 搜索电表 -->
        <el-form
          :model="formSearchme"
          label-width="auto"
          label-position="left"
          style="width:100%;border-top:1px solid #eee;padding-top:10px;"
          :inline="true"
        >
          <el-form-item :label="$t('equivar.metermpdel')" prop="meterTypeId" >
            <el-select v-model="formSearchme.meterTypeId" size="small">
              <el-option label="WC" value="01"></el-option>
              <el-option label="CT" value="02"></el-option>
              <el-option label="CTVT" value="03"></el-option>
              <el-option label="TMU" value="04"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('change.manufacturer')"  prop="facId" >
            <el-select v-model="formSearchme.facId" size="small">
              <el-option :label="ele.typeName" :value="ele.typeCode" v-for="(ele, i) in meterFactoryList" :key="i"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('upgrade.meterSpli')"  prop="meterSiteId" >
            <el-select v-model="formSearchme.meterSiteId" size="small">
              <el-option label="100A" :value="1"></el-option>
              <el-option label="160A" :value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="">
            <el-button type="primary" @click="searchMeter" size="small">{{$t('global.search')}}</el-button>
          </el-form-item>
        </el-form>
        <!-- 获取集中器所有下电表 -->
        <el-table
          :data="meterData.listitem"
          border
          :header-cell-style="{background:'#F2F2F2',color:'rgb(51,51,51)'}"
          height="30vh"
        >
          <!-- <el-table-column type="selection" ></el-table-column> -->
          <el-table-column :label="$t('global.id')" >
            <template slot-scope="scope">{{ meterData.pageSize * (meterData.pageNum - 1) + scope.$index + 1 }}</template>
          </el-table-column>
          <!-- <el-table-column prop="disc" :label="$t('upgrade.devtype')" width="160"></el-table-column> -->
          <el-table-column prop="meterId" :label="$t('meterevent.metername')" ></el-table-column>
          <el-table-column prop="commAddr1" :label="$t('meterevent.meterno')" ></el-table-column>
          <!-- <el-table-column prop="factory" :label="$t('timesych.factory')" >
          </el-table-column> -->
        </el-table>
        <el-pagination
          style="text-align:left;margin-top:20px;"
          background
          @size-change="meterSizeChange"
          @current-change="meterCurrentChange"
          :page-sizes="[20, 40, 60, 200]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="meterData.total"
        ></el-pagination>
        <div slot="footer" class="dialog-footer" style="text-align:right;">
          <el-button @click="step=0" size="small">{{$t('global.previous')}}</el-button>
          <el-button type="primary" @click="stepChangeT" size="small">{{$t('global.next')}}</el-button>
        </div>
      </div>

<!-- 固件升级第二步S -->
        <div v-show="step === 2">
          {{$t('upgrade.imagename')}}
          <el-input :maxlength="30" v-model="upfileData.fileName" style="width:150px;"></el-input>
          <el-button @click="getFileList" type="primary" style="margin-left:10px;">{{$t('global.search')}}</el-button>
          <div class="uptop" style="margin-top:30px;">
            <div>{{$t('upgrade.chooseupgradefile')}}</div>
            <div class="right">
              <span @click="defile" style="cursor:pointer">
                <img src="img/Delete.png" alt />
                {{$t('upgrade.defirm')}}
              </span>
              <span @click="addfile" style="cursor:pointer">
                <img src="img/New.png" alt />
                {{$t('upgrade.newfirm')}}
              </span>
            </div>
          </div>
          <!-- 升级文件表格 -->
          <el-table
            :data="upfileData.listitem"
            border
            :header-cell-style="{background:'#F2F2F2',color:'rgb(51,51,51)'}"
            height="40vh"
            @selection-change="upfileSelect"
            v-loading="loadT">
            <el-table-column type="selection"></el-table-column>
            <el-table-column :label="$t('global.id')" width="80">
              <template slot-scope="scope">{{ upfileData.pageSize * (upfileData.pageNum - 1) + scope.$index + 1 }}</template>
            </el-table-column>
            <el-table-column prop="fileName" :label="$t('upgrade.imagename')">
              <template slot-scope="scope">
                <span :title="scope.row.fileName">{{scope.row.fileName}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="fileType" :label="$t('upgrade.devtype')" :formatter="tmnlTypeFormat">
              <!-- <template slot-scope="scope">{{ changeDevType(scope.row.fileType) }}</template> -->
            </el-table-column>
            <el-table-column prop="partType" :label="$t('upgrade.parttype')" width="150">
              <template slot-scope="scope">{{ changeParttype(scope.row.partType) }}</template>
            </el-table-column>
            <el-table-column prop="fileVersion" :label="$t('upgrade.version')" width="120">
              <template slot-scope="scope">
                <span :title="scope.row.fileVersion">{{scope.row.fileVersion}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="fileSize" :label="$t('upgrade.imagesize')" :formatter="fileSizeFormat" width="120"></el-table-column>
            <el-table-column prop="fileFactory" :label="$t('change.manufacturer')" width="120" :formatter="factoryFormat">
            </el-table-column>
            <el-table-column prop="splitFlag" :label="$t('upgrade.split')" width="120" :formatter="splitFormat"></el-table-column>
            <el-table-column prop="remark" :label="$t('upgrade.remark')"></el-table-column>
            <!-- <el-table-column prop="remark" :label="$t('upgrade.others')"></el-table-column> -->
          </el-table>
          <el-pagination
            style="text-align:left;margin-top:20px;"
            background
            @size-change="upfileSizeChange"
            @current-change="upfileCurrentChange"
            :page-sizes="[20, 40, 60, 200]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="upfileData.total"
          ></el-pagination>
          <div slot="footer" class="dialog-footer" style="text-align:right;">
            <el-button @click="previous" size="small">{{$t('global.previous')}}</el-button>
            <el-button type="primary" @click="confirm" size="small">{{$t('auto.confirm')}}</el-button>
          </div>
        </div>
<!-- 固件升级第二步E -->
      </el-dialog>

<!-- 新增升级文件S -->
      <el-dialog
        :title="uptitle"
        :visible.sync="upfileDialog"
        width="46%"
        :before-close="upfileClose">
        <el-form
          :model="formFile"
          label-width="auto"
          label-position="left"
          style="width:50%;margin:0 auto;"
          ref="resetformFile"
          :rules="formFileRules"
        >
          <el-form-item :label="$t('upgrade.devtype')" prop="fileType">
            <el-select v-model="formFile.fileType" style="width: 100%;" size="small" :disabled="fileTypeDisabled">
              <el-option :label="$t('upgrade.dcu')" :value="1"></el-option>
              <el-option :label="$t('upgrade.nbg')" :value="2"></el-option>
              <el-option :label="$t('upgrade.meter')" :value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('upgrade.parttype')" prop="partType1" v-if="formFile.fileType === 1">
            <el-select
              v-model="formFile.partType1"
              size="small"
              style="width:100%"
            >
              <el-option label="DCU Upgrade" :value="4"></el-option>
              <el-option label="DCU Route Module Upgrade" :value="1"></el-option>
              <el-option label="DCU 4G Module Upgrade" :value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('upgrade.parttype')" prop="partType2" v-if="formFile.fileType === 2">
            <el-select
              v-model="formFile.partType2"
              size="small"
              style="width:100%"
            >
              <el-option label="3P WC Meter Upgrade" :value="5"></el-option>
              <el-option label="3P CT Meter Upgrade" :value="6"></el-option>
              <el-option label="3P CTVT Meter Upgrade" :value="7"></el-option>
              <el-option label="4G/NB Meter Module Upgrade" :value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('upgrade.parttype')" prop="partType3" v-if="formFile.fileType === 3">
            <el-select
              v-model="formFile.partType3"
              size="small"
              style="width:100%"
            >
              <el-option label="Hybrid Meter Broadcast Upgrade" :value="3"></el-option>
              <el-option label="Hybrid Meter Module Broadcast Upgrade" :value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('upgrade.blocksize')" prop="blockType">
            <el-select v-model="formFile.blockType" size="small" style="width:100%" :disabled="blockTypeDisabled">
              <el-option label="32" :value="1"></el-option>
              <el-option label="64" :value="2"></el-option>
              <el-option label="128" :value="3"></el-option>
              <el-option label="192" :value="4"></el-option>
              <el-option label="256" :value="5"></el-option>
              <el-option label="512" :value="6"></el-option>
              <el-option label="768" :value="7"></el-option>
              <el-option label="1024" :value="8"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('change.manufacturer')" prop="fileFactory">
            <el-select v-model="formFile.fileFactory" size="small" style="width:100%">
              <el-option :label="ele.typeName" :value="ele.typeCode" v-for="(ele, i) in tmnlFactoryList" :key="i"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('upgrade.upgradefile')" prop="fileName">
            <el-input :maxlength="30" v-model="formFile.fileName" size="small"></el-input>
            <el-button
              type="primary"
              @click.prevent="liulan"
              size="small"
              style="width:100%;"
            >{{$t('upgrade.browse')}}</el-button>
            <input
              type="file"
              id="fileInput"
              value="上传"
              ref="filElem"
              style="display:none;"
              @change="getfile"
            />
          </el-form-item>
          <!-- <el-form-item :label="$t('upgrade.firmtype')" prop="fti">
            <el-input :maxlength="30" v-model="formFile.fti" size="small"></el-input>
          </el-form-item>
          <el-form-item :label="$t('upgrade.firmserial')" prop="fsn">
            <el-input :maxlength="30" v-model="formFile.fsn" size="small"></el-input>
          </el-form-item> -->
          <el-form-item :label="$t('upgrade.remark')" prop="remark">
            <el-input :maxlength="30" type="textarea" v-model="formFile.remark" size="small"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer" style="text-align:right;">
          <el-button @click="upfileDialog = false" size="small">{{$t('global.cancel')}}</el-button>
          <el-button type="primary" @click="fileSave" size="small" :loading="uploadLoading">{{$t('global.save')}}</el-button>
        </div>
      </el-dialog>
<!-- 新增升级文件E -->
    </div>
  </basic-container>
</template>

<script>
import monting from './remote/monting';
import dcuactive from './remote/dcuactive';
import meteractive from './remote/meteractive';
import { queryDcuUpgradeInfo, queryMeterUpgradeInfo, queryUpgradeFile, saveDevUpgradeInfo, delUpgradeFile, queryMeterDetail } from '@/api/firmwareUpgrade';
import { getViewList } from '@/api/autoRegister'
import { mapGetters } from 'vuex';
import axios from 'axios'
export default {
    components: {
        monting,
        dcuactive,
        meteractive
    },
    data () {
        return {
            activeName: 'first',
            dcuData: {
                pageSize: 20,
                pageNum: 1,
                listitem: [],
                total: 0
            },
            meterData: {
              pageSize: 20,
              pageNum: 1,
              listitem: [],
              total: 0
            },
            meterList: {
                pageSize: 20,
                pageNum: 1,
                listitem: [],
                total: 0
            },
            uptitle: '',
            // 固件升级模态框
            setDialog: false,
            // 上传升级文件模态框
            upfileDialog: false,
            // 设备筛选
            formDevice: {
                devtype: 1,
                factoryId: ''
            },
            formFile: {
                fileType: 1,
                fileFactory: '',
                fileName: '',
                blockType: 6,
                fti: 0,
                fsn: 0,
                remark: '',
                partType1: '',
                partType2: '',
                partType3: '',
            },
            // 固件升级第一步
            formSetting: {
                language: 1,
                activateMode: 'FFFF-FF-FF FF:FF:FF',
                activateTime: null
            },
            formMeter: {
              retryTimes:1,
              resendRounds:3,
              activeRounds:3,
              broadcastEnable: 1,
              losePackIndicate:5,
              startupgradeRetry:3,
              meterAll: 1,
              startTime: '',
              endTime: '',
              activeTime: '',
            },
            step: 0,
            upfileData: {
                pageSize: 20,
                pageNum: 1,
                listitem: [],
                total: 0,
                fileName: ''
            },
            selectUpfile: '',
            selectDCUData: '',
            filelist: null,
            median: 4,
            stepList: [
                {
                    code: 0,
                    disc: this.$t('upgrade.initialization')
                },
                {
                    code: 1,
                    disc: this.$t('upgrade.getiamge')
                },
                {
                    code: 2,
                    disc: this.$t('upgrade.notice')
                },
                {
                    code: 3,
                    disc: this.$t('upgrade.imageblock')
                },
                {
                    code: 4,
                    disc: this.$t('upgrade.check')
                },
                {
                    code: 5,
                    disc: this.$t('upgrade.verify')
                },
                {
                    code: 6,
                    disc: this.$t('upgrade.checkactive')
                },
                {
                    code: 7,
                    disc: this.$t('upgrade.activeimage')
                }
            ],
            dcutypeList: [
                {
                    code: 1,
                    disc: this.$t('upgrade.dcu')
                },
                {
                    code: 3,
                    disc: this.$t('upgrade.nbg')
                },
                {
                    code: 10,
                    disc: this.$t('upgrade.meter')
                }
            ],
            devtype: 4,
            setrules:{
              language: [
                { required: true, message: this.$t('remote.emptyContent'), trigger: 'blur' }
              ],
              activateMode: [
                { required: true, message: this.$t('remote.emptyContent'), trigger: 'change' }
              ],
              activateTime: [
                { required: true, message: this.$t('remote.emptyContent'), trigger: 'change' }
              ],
            },
            meterfuls:{
              retryTimes: [
                { required: true, message: this.$t('remote.emptyContent'), trigger: 'blur' }
              ],
              resendRounds: [
                { required: true, message: this.$t('remote.emptyContent'), trigger: 'blur' }
              ],
              activeRounds: [
                { required: true, message: this.$t('remote.emptyContent'), trigger: 'blur' }
              ],
              losePackIndicate: [
                { required: true, message: this.$t('remote.emptyContent'), trigger: 'blur' }
              ],
              startupgradeRetry: [
                { required: true, message: this.$t('remote.emptyContent'), trigger: 'blur' }
              ],
              activeTime: [
                { required: true, message: this.$t('global.seltime'), trigger: 'change' }
              ],
              startTime: [
                { required: true, message: this.$t('global.seltime'), trigger: 'change' }
              ],
              endTime: [
                { required: true, message: this.$t('global.seltime'), trigger: 'change' }
              ]
            },
            // factoryList:[],
            load: false,
            loadT:false,
            fileTypeDisabled: true,
            blockTypeDisabled: true,
            searchFile: '',
            formSearchme: {
              facId: '1',
              meterTypeId: '01',
              meterSiteId: 1
            },
            formFileRules: {
              partType1: [
                { required: true, message: this.$t('remote.emptyContent'), trigger: 'blur' }
              ],
              partType2: [
                { required: true, message: this.$t('remote.emptyContent'), trigger: 'blur' }
              ],
              partType3: [
                { required: true, message: this.$t('remote.emptyContent'), trigger: 'blur' }
              ],
              fileFactory: [
                { required: true, message: this.$t('remote.emptyContent'), trigger: 'blur' }
              ],
              fileName: [
                { required: true, message: this.$t('remote.emptyContent'), trigger: 'blur' }
              ]
            },
            tableHeight: window.innerHeight - 480,
            tmnlFactoryList: [],
            meterFactoryList: [],
            tmnlTypeList: [],
            disabled: false,
            uploadLoading: false
        };
    },
    computed: {
      ...mapGetters(['treeNode', 'level', 'upgradeActiveName'])
    },
    watch: {
      '$store.state.common.treeNode': function (data) {
        this.getData()
      },
      'formMeter.retryTimes':function(val){
        if(val>10){
          this.formMeter.retryTimes=10;
        }
      },
      'formMeter.resendRounds':function(val){
        if(val>10){
          this.formMeter.resendRounds=10;
        }
      },
      'formMeter.activeRounds':function(val){
        if(val>10){
          this.formMeter.activeRounds=10;
        }
      },
      'formMeter.losePackIndicate':function(val){
        if(val>200){
          this.formMeter.losePackIndicate=200;
        }
      },
      'formMeter.startupgradeRetry':function(val){
        if(val>10){
          this.formMeter.startupgradeRetry=10;
        }
      },
      'formMeter.startTime':function(val){
        if (val) {
          this.formMeter.endTime = new Date(new Date(val).getTime() + 8 * 3600 * 1000)
          this.formMeter.activeTime = new Date(new Date(val).getTime() + 9 * 3600 * 1000)
        }
      },
      'formSetting.language': function (val) {
        if (val === 3) {
          this.formSetting.activateMode = 'FFFF-FF-FF FF:FF:FF'
          this.disabled = true
        } else {
          this.disabled = false
        }
      },
    },
    mounted () {
        this.getData()
    },
    created () {
      this.getView()
    },
    methods: {
        timeFormat(val) {
          let date = new Date(val)
          return (
            date.getFullYear() +
            "-" +
            (date.getMonth() + 1 + "").padStart(2, "0") +
            "-" +
            (date.getDate() + "").padStart(2, "0") +
            " " +
            (date.getHours() + "").padStart(2, "0") +
            ":" +
            (date.getMinutes() + "").padStart(2, "0") +
            ":" +
            (date.getSeconds() + "").padStart(2, "0")
          )
        },
        handleClick (tab) {
            if (this.treeNode) {
                this.activeName = tab.name
            } else {
                this.$notify({
                    title: this.$t('global.warn'),
                    message: this.$t('global.warntree'),
                    type: 'warning'
                })
            }
            this.$store.commit('SET_UPGRADE_ACTIVE', tab.name)
        },
        getDCUData () {
          let obj = {
            // orgNo: this.treeNode.deviceNo,
            deviceTypes: this.formDevice.devtype === 1 ? '05' : ['10', '11'],
            pageNum: this.dcuData.pageNum,
            pageSize: this.dcuData.pageSize,
            factoryId: this.formDevice.factoryId
          }
          console.log(this.treeNode.deviceNo, 'no')
          if (this.treeNode.deviceType === 'org') {
            if (this.treeNode.deviceNo) {
              obj.orgNo = this.treeNode.deviceNo
            } else {
              obj.orgNo = this.treeNode.deviceName
            }
          } else if (this.treeNode.deviceType === 'tmnl') {
            if (this.treeNode.deviceNo) {
              obj.tmnlAssetNo = this.treeNode.deviceNo
            } else {
              obj.tmnlAssetNo = this.treeNode.deviceName
            }
          } else if (this.treeNode.deviceType === 'meter') {
            // this.dcuData.listitem = []
            // this.dcuData.total = 0
            // return
            if (this.treeNode.deviceNo) {
              obj.tmnlAssetNo = this.treeNode.deviceNo
            } else {
              obj.tmnlAssetNo = this.treeNode.deviceName
            }
          }
          this.load = true
          console.log(obj, 'obj')
          queryDcuUpgradeInfo(obj).then(res => {
            this.dcuData.listitem = res.data.data.listitem;
            this.dcuData.total = res.data.data.total;
            this.load = false
          })
        },
        getMeterData () {
          if (this.level !== 6) {
            this.$notify({
                title: this.$t('global.warn'),
                message: this.$t('global.seldcunode'),
                type: 'warning'
            })
            return
          }
          let obj = {
            assetNo: this.treeNode.deviceNo,
            pageNum: this.dcuData.pageNum,
            pageSize: this.dcuData.pageSize
          }
          this.load = true
          queryMeterUpgradeInfo(obj).then(res => {
            console.log(res, '查找电表')
            if (res.data.success) {
              this.dcuData.listitem = res.data.data.listitem;
              this.dcuData.total = res.data.data.total;
            } else {
              this.$message({
                message: this.$t('global.searchFail'),
                type: "error"
              })
            }
            this.load = false
          })
        },
        // 查询设备
        getData () {
          if (this.upgradeActiveName !== 'first') return
          if (!this.treeNode) {
            this.$notify({
                title: this.$t('global.warn'),
                message: this.$t('global.warntree'),
                type: 'warning'
            })
            return
          }
          // if () {
            this.getDCUData()
          // } else {
          //   this.getMeterData()
          // }
        },
        // 查找集中器电表
        searchMeter () {
          queryMeterDetail({
            // objId: this.selectDCUData[0].tmnlAssetNo,
            // meterSiteId: this.formSearchme.meterSiteId,
            // factoryId: Number(this.formSearchme.facId),
            // meterTypeId: this.formSearchme.meterTypeId,
            // pageNum: this.meterData.pageNum,
            // pageSize: this.meterData.pageSize,
            assetNos: this.selectDCUData.map(ele => ele.tmnlAssetNo),
            factoryId: this.formSearchme.facId,
            // meterSiteId: this.formSearchme.meterSiteId,
            meterTypeCode: this.formSearchme.meterTypeId
          }).then(res => {
            this.meterData.listitem = res.data.data.listitem
            this.meterData.total = res.data.data.total
          })
        },
        // 设备查询
        search () {
          this.getData()
        },
        // 选择设备
        dcuDataSelect (val) {
          this.selectDCUData = val
        },
        // 固件升级
        batch () {
            if (this.selectDCUData.length != 0) {
                this.setDialog = true
                this.step = 0
                this.uptitle = this.$t('upgrade.firmsetting')
                this.formSetting.language = this.formDevice.devtype
            } else {
                this.$notify({
                    title: this.$t('global.warn'),
                    message: this.$t('global.warncont'),
                    type: 'warning'
                });
            }
        },
        liulan () {
            this.$refs.filElem.dispatchEvent(new MouseEvent('click'))
        },
        // input上传文件
        getfile () {
            this.formFile.fileName = this.$refs.filElem.files[0].name
            this.filelist = this.$refs.filElem.files[0]
        },
        settingClose () {
            this.$refs.setref.resetFields()
            this.setDialog = false
        },
        upfileClose () {
          if (this.$refs.resetformFile) {
            this.$refs.resetformFile.resetFields()
          }
            this.upfileDialog = false
        },
        changeStep (val) {
            for (let i in this.stepList) {
                if (val == this.stepList[i].code) {
                    return this.stepList[i].disc
                }
            }
        },
        dcuCurrentChange (val) {
          this.dcuData.pageNum = val
          this.getData()
        },
        dcuSizeChange (val) {
          this.dcuData.pageSize = val
          this.getData()
        },
        upfileSizeChange(val){
          this.upfileData.pageSize = val
          this.getFileList()
        },
        upfileCurrentChange(val){
          this.upfileData.pageNum = val
          this.getFileList()
        },
        // 固件升级下一步
        stepChange () {
          this.$refs['setref'].validate((valid) => {
            if (!valid) return
            if (this.formSetting.language === 1) {
              this.formFile.fileType = 1
              this.formFile.partType1 = 4
              this.step = 2
              this.getFileList()
            } else if (this.formSetting.language === 2) {
              this.formFile.fileType = 2
              this.formFile.partType2 = 5
              this.step = 2
              this.getFileList()
            } else if (this.formSetting.language == 3) {
              this.formFile.fileType = 3
              this.formFile.partType3 = 3
              this.step = 1
            }
          })
        },
        stepChangeT () {
          this.$refs['formeter'].validate((valid) => {
            if (valid) {
              this.step = 2
              this.formFile.fileType = 3
              this.partType3 = 3
              this.getFileList()
            }
          })
        },
        // 查询升级文件
        getFileList () {
          let obj = {
              pageNum: this.upfileData.pageNum,
              pageSize: this.upfileData.pageSize,
              fileType: this.formSetting.language,
              fileName: this.upfileData.fileName
            }
            queryUpgradeFile(obj).then(res => {
              console.log(res, '升级文件列表')
              if (res.data.success) {
                this.upfileData.listitem = res.data.data.listitem
                this.upfileData.total = res.data.data.total
              } else {
                this.$message({
                  message: this.$t('global.searchFail'),
                  type: "error"
                })
              }
            })
        },
        // 新增升级文件
        addfile () {
            this.upfileDialog = true
            this.formFile.fileType = this.formSetting.language
            if (this.formSetting.language === 1) {
              this.formFile.partType1 = 4
            } else if (this.formSetting.language == 2) {
              this.formFile.partType2 = 5
            } else if (this.formSetting.language == 3) {
              this.formFile.partType3 = 3
            }
            // this.formFile.fileFactory = this.factoryCodeChange(this.selectDCUData[0].factoryCode)
        },
        factoryCodeChange (val) {
            switch (val) {
              case 1:
                return 'Sanxing'
                break;
              case 2:
                return 'Huali'
                break;
              case 3:
                return 'Kaifa'
                break;
              case 4:
                return 'Huali'
                break;
            }
        },
        // 选择升级文件
        upfileSelect (val) {
            this.selectUpfile = val
        },
        // 上传升级文件
        fileSave () {
          this.uploadLoading = true
          this.$refs.resetformFile.validate((valid) => {
            if (!valid) return
            let user = JSON.parse(localStorage.getItem('saber-userInfo')).content.userName
            let formData = new FormData()
            formData.append('file', this.filelist)
            formData.set('fileType', this.formFile.fileType)
            formData.set('fileName', this.formFile.fileName)
            formData.set('blockType', this.formFile.blockType)
            formData.set('fileFactory', this.formFile.fileFactory)
            formData.set('fileOper', user)
            let partType = ''
            if (this.formFile.fileType === 1) {
              partType = this.formFile.partType1
            } else if (this.formFile.fileType === 2) {
              partType = this.formFile.partType2
            } else if (this.formFile.fileType === 3) {
              partType = this.formFile.partType3
            }
            formData.set('partType', partType)
            formData.set('remark', this.formFile.remark)
            formData.set('fti', this.formFile.fti)
            formData.set('fsn', this.formFile.fsn)
            // uploadUpgradeFile(formData).then(res => {
            //   console.log(res, '上传升级文件')
            // })
            axios({
              method: 'post',
              url: '/api/ami-devices/deviceRegister/uploadUpgradeFile',
              data: formData,
              headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).then(res => {
              console.log(res, '上传升级文件')
              if (res.data.success) {
                this.$message({
                  message: this.$t('global.addSuccess'),
                  type: 'success'
                })
                this.uploadLoading = false
                this.upfileDialog = false
                this.getFileList()
              }
            })
            .catch(err => {
              if (err.msg.startsWith('Duplicate')) {
                this.$message({
                  message: this.$t('upgrade.sameFile'),
                  type: 'error'
                })
                this.uploadLoading = false
              }
            })
          })
        },
        // 删除升级文件
        defile () {
            if (this.selectUpfile.length <= 0) {
                this.$notify({
                    title: this.$t('global.warn'),
                    message: this.$t('global.warncont'),
                    type: 'warning'
                });
            } else {
              this.$confirm(
                this.$t("areaManage.deleteTip"),
                this.$t("areaManage.reminder"),
                {
                  confirmButtonText: this.$t("global.yes"),
                  cancelButtonText: this.$t("global.cancel"),
                  type: "warning"
                }
              ).then(() => {
                delUpgradeFile({
                  upgradeids: this.selectUpfile.map(ele => ele.id)
                }).then(res => {
                  if (res.data.success) {
                    if (res.data.data.returnMsg) {
                      this.$message({
                        message: res.data.data.returnMsg.split(':')[1],
                        type: 'error'
                      })
                      this.getFileList()
                      return
                    }
                    this.$message({
                      message: this.$t('global.operatorSuccess'),
                      type: 'success'
                    })
                    this.getFileList()
                  } else {
                    this.$message({
                      message: this.$t('global.operaError'),
                      type: 'error'
                    })
                  }
                })
              })
            }
        },
        // 升级确定
        confirm () {
          if (this.selectUpfile.length < 1) {
              this.$notify({
                  title: this.$t('global.warn'),
                  message: this.$t('global.warncont'),
                  type: 'warning'
              })
              return
          }
          if (this.selectUpfile[0].splitFlag != 1) {
            this.$message({
              message: this.$t('upgrade.waiting'),
              type: 'error'
            })
            this.getFileList()
            return
          }
          let obj = {}
          let tmnlNos = this.selectDCUData.map(ele => ele.tmnlAssetNo)
          if (this.formSetting.language == 3) {
            obj = {
              fileId: this.selectUpfile[0].id,
              tmnlNos,
              activateTime: this.formSetting.activateTime,
              activateMode: this.formSetting.activateMode,
              fatoryId: Number(this.formSearchme.facId),
              meterType: this.formSearchme.meterTypeId,
              currSpec: this.formSearchme.meterSiteId,
              retryTimes: this.formMeter.retryTimes,
              resendRounds: this.formMeter.resendRounds,
              activeRounds: this.formMeter.activeRounds,
              broadcastEnable: this.formMeter.broadcastEnable,
              losePackIndicate: this.formMeter.losePackIndicate,
              startupgradeRetry: this.formMeter.startupgradeRetry,
              activeTime: this.timeFormat(this.formMeter.activeTime),
              startTime: this.timeFormat(this.formMeter.startTime),
              endTime: this.timeFormat(this.formMeter.endTime),
              meterAll: this.formMeter.meterAll
            };
          } else {
            obj = {
              fileId: this.selectUpfile[0].id,
              tmnlNos,
              activateTime: this.formSetting.activateTime,
              activateMode: this.formSetting.activateMode == 3 ? this.formSetting.activateTime : this.formSetting.activateMode
            }
          }
          if (this.formSetting.activateMode === 'FFFF-FF-FF FF:FF:FF') {
            delete obj.activateTime
          }
          console.log(obj, 'obj')
          saveDevUpgradeInfo(obj).then(res => {
            console.log(res, '新建升级任务')
            if (res.data.data.returnMsg) {
              this.$message({
                  message: res.data.data.returnMsg,
                  type: 'error'
              })
              return
            }
            if (res.data.success) {
                this.$message({
                    message: this.$t('global.operatorSuccess'),
                    type: 'success'
                })
                this.upfileDialog = false
                this.setDialog = false
                this.getData()
            } else {
                this.$message({
                    message: this.$t('global.operaError'),
                    type: 'error'
                })
            }
          })
        },
        changeParttype (val) {
            if (this.formFile.fileType === 1) {
              if (val == 4) {
                return 'DCU Upgrade'
              } else if (val == 1) {
                return 'DCU Route Module Upgrade'
              } else if (val == 2) {
                return 'DCU 4G Module Upgrade'
              }
            } else if (this.formFile.fileType === 2) {
              if (val == 5) {
                return '3P WC Meter Upgrade'
              } else if (val == 6) {
                return '3P CT Meter Upgrade'
              } else if (val == 7) {
                return '3P CTVT Meter Upgrade'
              } else if (val == 2) {
                return '4G/NB Meter Module Upgrade'
              }
            } else if (this.formFile.fileType === 3) {
              if (val == 3) {
                return 'Hybrid Meter Broadcast Upgrade'
              } else if (val == 1) {
                return 'Hybrid Meter Module Broadcast Upgrade'
              }
            }
            // switch (val) {
            //   case 1:
            //       return 'PRIME parts';
            //       break;
            //   case 2:
            //       return 'Communication Module(Non-PRIME) ';
            //       break;
            //   case 3:
            //       return 'Meter parts';
            //       break;
            //   case 4:
            //       return 'Data Concentrator';
            //       break;
            //   case 5:
            //       return '3P Direct connection meter';
            //       break;
            //   case 6:
            //       return '3P CT meter';
            //       break;
            //   case 7:
            //       return '3P CT/PT meter';
            //       break;
            //   default: return;
            // }
        },
        // changeFactory (val) {
        //     for (let i in this.factoryList) {
        //         if (this.factoryList[i].factoryid == val) {
        //             return this.factoryList[i].disc;
        //         }
        //     }
        // },
        changeDevType(val){
          if (val.fileType === 1) {
            return this.$t('upgrade.dcu')
          } else if (val.fileType === 2) {
            return this.$t('upgrade.nbmeter')
          } else if (val.fileType === 3) {
            return this.$t('upgrade.meter')
          }
        },
        fileSizeFormat (row) {
          return (row.fileSize / 1024).toFixed(0)
        },
        // 上一步
        previous () {
          if (this.formSetting.language === 3) {
            this.step = 1
          } else {
            this.step = 0
          }
        },
        meterCurrentChange () {

        },
        meterSizeChange () {

        },
        getView() {
          getViewList({
            viewType: 'TMNLFactoryType'
          }).then(res => {
            this.tmnlFactoryList = res.data.data.list
          })
          getViewList({
            viewType: 'meterFactoryType'
          }).then(res => {
            this.meterFactoryList = res.data.data.list
          })
          getViewList({
            viewType: 'tmnlType'
          }).then(res => {
            this.tmnlTypeList = res.data.data.list
          })
        },
        tmnlFactoryFormat (row) {
          let obj = this.tmnlFactoryList.find(ele => Number(ele.typeCode) === Number(row.factoryCode))
          if (obj) {
            return obj.typeName
          } else {
            return row.factoryCode
          }
        },
        factoryFormat (row) {
          let obj = this.tmnlFactoryList.find(ele => Number(ele.typeCode) === Number(row.fileFactory))
          if (obj) {
            return obj.typeName
          } else {
            return row.fileFactory
          }
        },
        tmnlTypeFormat (row) {
          if (row.fileType === 1) {
            return this.$t('upgrade.tmnl')
          } else if (row.fileType === 2) {
            return this.$t('upgrade.nbg')
          } else if (row.fileType === 3) {
            return this.$t('upgrade.plcrf')
          }
        },
        splitFormat (row) {
          return row.splitFlag == 1 ? this.$t('upgrade.split1') : this.$t('upgrade.split2')
        },
    }
};
</script>

<style  lang="scss" scoped>
.remote {
  display: flex;
  background: #fff;
  width: 100%;
  box-sizing: border-box;
  .cont {
    width: 100%;
    box-sizing: border-box;
  }
  .pre {
    font-weight: bold;
  }
  .other {
    margin-top: 20px;
    span {
      display: inline-block;
      width: 2.8rem;
    }
  }
  .uptop {
    display: flex;
    justify-content: space-between;
    padding: 10px;
    border: 1px solid #dddddd;
    span {
      display: flex;
      align-items: center;
      border-left: 1px solid #dddddd;
    }
    img {
      margin-right: 10px;
      margin-left: 20px;
    }
    .right {
      display: flex;
      span {
        padding: 0 5px;
      }
    }
  }
  .topadd {
    display: flex;
    .address {
      height: 32px;
      line-height: 32px;
      padding: 0 10px;
      border: 1px solid #1eb99e;
      background: #e0fffb;
      color: #1eb99e;
      border-radius: 5px;
    }
    .imgs {
      vertical-align: middle;
      margin-right: 5px;
    }
  }
  .upload {
    display: flex;
    align-items: center;
    margin-top: 10px;
    span {
      display: inline-block;
      padding-left: 20px;
      margin-right: 10px;
      line-height: 20px;
      height: 20px;
      border-left: 3px solid rgb(0, 153, 255);
    }
    .upload-demo {
      margin: 0 10px;
    }
  }
  .formbox {
    border-top: 1px solid #eee;
    border-bottom: 1px solid #eee;
    padding: 10px 0;
    margin-bottom: 10px;
  }
  // .el-form-item {
  //   /deep/ .el-form-item__label {
  //     padding-right: 30px;
  //     text-align: right;
  //   }
  // }
  .el-table {
    /deep/ .cell {
      word-break: keep-all!important;
    }
  }
}
</style>