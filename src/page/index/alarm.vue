<template>
  <div id="alarm">
    <div class="btn" @click="getAlarm" :style="{right: flag ? '400px' : '0'}" @mousedown="move">
      <el-badge :value="count"
                :max="99"
                style="margin:15px 0 0 5px">
        <i class="el-icon-message-solid bell"></i>
      </el-badge>
    </div>

    <div class="list" :style="{right: flag ? '0' : '-400px', 'box-shadow': flag ? '-3px 0 10px #999' : 'none'}">
      <el-tabs v-model="active">
        <el-tab-pane :label="$t('global.meter')" name="meter">
          <div class="alarm-list">
            <div class="operate">
              {{$t('alarm.list')}}
              <span @click="confirmAll2">{{$t('alarm.confirmAll')}}</span>
            </div>
            <ul>
              <li v-for="(ele, i) in list2" :key="i">
                <img src="img/alarm.png" alt="" class="icon">
                <div class="head">
                  {{ele.eventName}}
                </div>
                <div class="info">
                  {{$t('remote.deviceName') + ': ' + ele.commAddr}}
                  <br />
                  {{$t('auto.deviceType') + ': ' + $t('global.meter')}}
                  <br />
                  {{$t('metercure.datatime') + ': ' + ele.dataTime}}
                  <br />
                  {{$t('meterevent.reporttime') + ': ' + ele.recTime}}
                </div>
                <div class="operate">
                  <span @click="confirm2(ele)">{{$t('global.confirm')}}</span>
                </div>
              </li>
            </ul>
            <div class="page" :style="{right: flag ? '0' : '-400px'}">
              <el-pagination
                background
                layout="prev, pager, next"
                :total="total2"
                :pager-count="5"
                @current-change="changeSize2">
              </el-pagination>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane :label="$t('global.dcu')" name="dcu">
          <div class="alarm-list">
            <div class="operate">
              {{$t('alarm.list')}}
              <span @click="confirmAll1">{{$t('alarm.confirmAll')}}</span>
            </div>
            <ul>
              <li v-for="(ele, i) in list1" :key="i">
                <img src="img/alarm.png" alt="" class="icon">
                <div class="head">
                  {{ele.eventName}}
                </div>
                <div class="info">
                  {{$t('remote.deviceName') + ':  ' + ele.terminalAddr}}
                  <br />
                  {{$t('auto.deviceType') + ':  ' + $t('global.dcu')}}
                  <br />
                  {{$t('metercure.datatime') + ':  ' + ele.dataTime}}
                  <br />
                  {{$t('meterevent.reporttime') + ':  ' + ele.recTime}}
                </div>
                <div class="operate">
                  <span @click="confirm1(ele)">{{$t('global.confirm')}}</span>
                </div>
              </li>
            </ul>
            <div class="page" :style="{right: flag ? '0' : '-400px'}">
              <el-pagination
                background
                layout="prev, pager, next"
                :total="total1"
                :pager-count="5"
                @current-change="changeSize1">
              </el-pagination>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="bg" @click.stop="hide" v-show="flag"></div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { count, getDCU, getMeter, updateTmnl, updateMeter, updateTmnlList, updateMeterList } from '@/api/alarm'
export default {
  props: ['flag'],
  data () {
    return {
      count: 0,
      // flag: false,
      active: 'meter',
      list1: [],
      page1: {
        current: 1,
        size: 10
      },
      total1: 0,
      list2: [],
      page2: {
        current: 1,
        size: 10
      },
      total2: 0,
      isDrag: false
    }
  },
  created () {
    this.getCount()
  },
  methods:{
    getCount () {
      count('alarmStatus=01').then(res => {
        this.count = res.data.data
      })
    },
    getAlarm () {
      if (this.isDrag) return
      if (this.flag) {
        // this.flag = false
        this.$emit('alarm-click', false)
      } else {
        this.getDCU()
        this.getMeter()
        this.getCount()
        // this.flag = true
        this.$emit('alarm-click', true)
      }
    },
    getDCU () {
      let str = ''
      let obj = {
        size: this.page1.size,
        current: this.page1.current,
        alarmStatus: '01'
      }
      Object.keys(obj).forEach(ele => {
        str += (ele + '=' + obj[ele] + '&')
      })
      str = str.substr(0, str.length - 1)
      getDCU(str).then(res => {
        this.total1 = res.data.data.total
        this.list1 = res.data.data.records
      })
    },
    getMeter () {
      let str = ''
      let obj = {
        size: this.page2.size,
        current: this.page2.current,
        alarmStatus: '01'
      }
      Object.keys(obj).forEach(ele => {
        str += (ele + '=' + obj[ele] + '&')
      })
      str = str.substr(0, str.length - 1)
      getMeter(str).then(res => {
        this.total2 = res.data.data.total
        this.list2 = res.data.data.records
      })
    },
    changeSize1 (val) {
      this.page1.current = val
      this.getDCU()
    },
    changeSize2 (val) {
      this.page2.current = val
      this.getMeter()
    },
    confirm1 (ele) {
      let obj = {
        alarmStatus: '02',
        dataTime: ele.dataTime,
        eventCode: ele.eventCode,
        id: ele.id,
      }
      updateTmnl(obj).then(res => {
        this.getDCU()
        this.getCount()
      })
    },
    confirm2 (ele) {
      let obj = {
        alarmStatus: '02',
        dataTime: ele.dataTime,
        eventCode: ele.eventCode,
        id: ele.id,
      }
      updateMeter(obj).then(res => {
        this.getMeter()
        this.getCount()
      })
    },
    confirmAll1 () {
      if (this.list1.length < 1) {
        return
      }
      this.$confirm(this.$t('logs.confirmAll'), this.$t('logs.tip'), {
        confirmButtonText: this.$t('global.confirm'),
        cancelButtonText: this.$t('global.cancel'),
        type: "warning"
      })
      .then(() => {
        updateTmnlList({
          alarmStatus: '02'
        }).then(res => {
          this.page1.current = 1
          this.getDCU()
          this.getCount()
          this.$message({
            type: "success",
            message: this.$t('logs.clearSuccess')
          })
        })
      })
      .catch(() => {})
    },
    confirmAll2 () {
      if (this.list2.length < 1) {
        return
      }
      this.$confirm(this.$t('logs.confirmAll'), this.$t('logs.tip'), {
        confirmButtonText: this.$t('global.confirm'),
        cancelButtonText: this.$t('global.cancel'),
        type: "warning"
      })
      .then(() => {
        updateMeterList({
          alarmStatus: '02'
        }).then(res => {
          this.page2.current = 1
          this.getMeter()
          this.getCount()
          this.$message({
            type: "success",
            message: this.$t('logs.clearSuccess')
          })
        })
      })
      .catch(() => {})
    },
    hide () {
      this.$emit('alarm-click', false)
    },
    move (e) {
      let firstTime = new Date().getTime()
      this.isDrag = true
      let btn = document.querySelector('.btn')
      let mToBtnY = e.clientY - btn.offsetTop
      document.onmousemove = e => {
        let top = e.clientY - mToBtnY
        if (top < 0) {
          btn.style.top = '0px'
        } else if (top > (window.innerHeight - 60)) {
          btn.style.top = window.innerHeight - 60 + 'px'
        } else {
          btn.style.top = top + 'px'
        }
      }
      document.onmouseup = () => {
        document.onmousemove = null
        document.onmouseup = null
        let lastTime = new Date().getTime()
        if ((lastTime - firstTime) < 300) {
          this.isDrag = false
        }
      }
    }
  }
}
</script>
<style lang='scss' scoped>
#alarm {
  .btn {
    position: fixed;
    // right: 0;
    top: 50vh;
    width: 60px;
    height: 60px;
    background-color: #1A96FF;
    cursor: pointer;
    border-radius: 10px 0 0 10px;
    z-index: 9999;
    transition: right 0.5s;
    /deep/ .el-badge__content {
      user-select:none;
    }
  }
  .bell {
    height: 30px;
    width: 30px;
    color:#fff;
    font-size:30px;
  }
  .list {
    position: fixed;
    right: 0;
    top: 0;
    bottom: 0;
    width: 400px;
    background-color: #fff;
    z-index: 9999;
  }
}
.el-tabs {
  padding-bottom: 30px;
  /deep/ .el-tabs__header {
    display: flex;
    justify-content: center;
    padding: 5px 0 0 10px;
    margin-bottom: 0;
    .el-tabs__nav-wrap {
      &::after {
        height: 0;
      }
    }
    .el-tabs__nav {
      border: 0;
      /deep/ .el-tabs__active-bar {
        width: 0;
      }
      .el-tabs__active-bar {
        // width: 50px!important;
      }
      .el-tabs__item {
        border: 0;
        color: #000;
      }
      .el-tabs__item.is-active {
        background-color: #fff;
        color: #018b7e;
      }
    }
  }
}
.list {
  transition: all 0.5s;
  .operate {
    height: 50px;
    line-height: 28px;
    padding: 11px 20px;
    background-color: #FAFAFA;
    font-size: 16px;
    box-sizing: border-box;
    span {
      float: right;
      height: 28px;
      width: 91px;
      margin-right: 30px;
      line-height: 28px;
      text-align: center;
      font-size: 14px;
      background-color: #FAAD14;
      color: #fff;
      cursor: pointer;
    }
  }
  .alarm-list {
    ul {
      height: calc(100vh - 140px);
      padding: 0;
      margin: 0;
      overflow-y: auto;
      li {
        position: relative;
        padding: 0;
        margin: 0;
        border-bottom: 1px solid #ddd;
        .icon {
          position: absolute;
          left: 30px;
          top: 15px;
        }
        .head {
          display: flex;
          align-items: center;
          height: 50px;
          padding-left: 73px;
          font-size: 16px;
          color: #000;
          font-weight: 700;
        }
        .info {
          padding-left: 73px;
          color: #666;
        }
        .operate {
          background-color:#fff;
          span {
            margin-right: 10px;
          }
        }
      }
    }
    .page {
      position: fixed;
      // right: 0;
      bottom: 0;
      width: 400px;
      height: 50px;
      border-top: 1px solid #ddd;
      background-color: #FAFAFA;
      transition: all 0.5s;
      .el-pagination {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%,-50%);
      }
    }
  }
}
.bg {
  position: fixed;;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  z-index: 0;
}
</style>