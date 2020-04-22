<template>
  <basic-container :bg="'#F4F6FB'" id="home">
    <div class="amihome">

      <!-- 设备数 -->
      <div :class="{devnum: true, common: true, opacity: themeName === 'theme-star' ? true : false}">
        <h3>{{$t('home.devnum')}}</h3>
        <ul class="devbox">
          <li>
            <img src="img/home/total.png" alt="">
            <div class="icon-info">
              <h4>{{$t('home.totaldev')}}</h4>
              <p>{{deviceNum.totalDevice}}</p>
            </div>
          </li>
          <li>
            <img src="img/home/dcu.png" alt="">
            <div class="icon-info">
              <h4>{{$t('upgrade.dcu')}}</h4>
              <p>{{deviceNum.dcuNum}}</p>
            </div>
          </li>
          <li>
            <img src="img/home/4gnb.png" alt="">
            <div class="icon-info">
              <h4>{{$t('home.gmeter')}}</h4>
              <p>{{deviceNum.Nb4Gnum}}</p>
            </div>
          </li>
          <li>
            <img src="img/home/dm.png" alt="">
            <div class="icon-info">
              <h4>{{$t('home.dualmeter')}}</h4>
              <p>{{deviceNum.plcRfnum}}</p>
            </div>
          </li>
        </ul>
        <ul class="devbox">
          <li>
            <img src="img/home/idcu.png" alt="">
            <div class="icon-info">
              <h4>{{$t('home.intoday')}}</h4>
              <p>{{deviceNum.todayInstallDcu}}</p>
            </div>
          </li>
          <li>
            <img src="img/home/idcu.png" alt="">
            <div class="icon-info">
              <h4>{{$t('home.inyes')}}</h4>
              <p>{{deviceNum.installYesterdayDcu}}</p>
            </div>
          </li>
          <li>
            <img src="img/home/im.png" alt="">
            <div class="icon-info">
              <h4>{{$t('home.inmetertoday')}}</h4>
              <p>{{deviceNum.installTodayMeter}}</p>
            </div>
          </li>
          <li>
            <img src="img/home/im.png" alt="">
            <div class="icon-info">
              <h4>{{$t('home.inmeteryes')}}</h4>
              <p>{{deviceNum.installYesterdayMeter}}</p>
            </div>
          </li>
        </ul>
      </div>

      <!-- 设备在线率和分布 -->
      <el-row :gutter="20" style="margin:20px 0 10px;">
        <el-col :span="9">
          <div :class="{ratebox: true, common: true, opacity: themeName === 'theme-star' ? true : false}">
            <h3>{{$t('home.devrate')}}</h3>
            <div id="ring"></div>
          </div>
        </el-col>
        <el-col :span="15">
          <div :class="{devdis: true, common: true, opacity: themeName === 'theme-star' ? true : false}" style="overflow:hidden;">
            <h3>{{$t('home.devdis')}}</h3>
            <div class="change">
              <span
                v-for="(item,index) in spanList"
                :key="index"
                v-on:click="addClass(index)"
                :style="{background: current === index ? colorName : '#fff', color: current === index ? '#fff' : '#000'}"
              >{{$t(item.name)}}</span>
            </div>
            <ve-histogram
              :data="chartData"
              ref="chartime2"
              :extend="chartExtend"
              width="auto"
              :legend-visible="false"
              height="350px"
              v-if="current==0"
              :colors="[colorName]"
            ></ve-histogram>
            <ve-histogram
              :data="chartDataT"
              ref="chartime3"
              :extend="chartExtend"
              width="auto"
              :legend-visible="false"
              height="350px"
              :colors="[colorName]"
              v-else
            ></ve-histogram>
          </div>
        </el-col>
      </el-row>

      <!-- 读取成功率曲线 -->
      <div :class="{linebox: true, common: true, opacity: themeName === 'theme-star' ? true : false}" style="overflow:hidden;">
        <h3>{{$t('home.successrate')}}</h3>
        <div id="line"></div>
      </div>
    </div>
  </basic-container>
</template>

<script>
import echarts from 'echarts'
import {mapGetters} from "vuex"
import {homePage} from '@/api/user'
const formatTime = (val) => {
  return val.getFullYear() + '-' + (val.getMonth() + 1) + '-' + val.getDate()
}
// let lineRows = new Array(30).fill(undefined).map((item, index) => ({
//   'datestr': formatTime(new Date(new Date().getTime() - (30 - index) * 24 * 60 * 60 * 1000)),
//   'readSuccessRate': Math.random() * 100
// }))

export default {
    components: {},
    computed: {
      ...mapGetters(['colorName', 'themeName'])
    },
    data () {
        return {
            chartData: {
                columns: ['area', 'data'],
                rows: []
            },
            chartDataT: {
                columns: ['area', 'data'],
                rows: []
            },
            lineData: {
                columns: ['datestr', 'readSuccessRate'],
                rows: []
            },
            chartExtend: {
                barWidth: 15,
                series: {
                    center: ['50%', '60%'],
                },
                grid: {
                    bottom: 30,
                    top: 20
                },
            },
            chartExtends: {
                grid: {
                    bottom: 0
                },
                xAxis: [
                  {
                    boundaryGap: false,
                  }
                ],
            },
            chartSettings: {
                stack: { 电量: ['电量'] },
                area: true,
                xAxisType: 'time'
            },
            spanList: [
                {
                    name: 'upgrade.dcu'
                },
                {
                    name: 'upgrade.meter'
                }
            ],
            current: 0,
            deviceNum: {
              // total: 927,
              // dcunum: 15,
              // gprsnum: 115,
              // plcnum: 797
            },
            deviceInlineRate: {
              All: 0.92,
              DCU: 0.86,
              '4G/NB Meter': 0.97
            },
            ringChart: '',
            lineChart: '',
        };
    },
    created () {
    },
    mounted () {
      this.getRingData()
      this.getData()
      
      document.querySelector('#home').addEventListener('resize', this.resizeTheChart)
    },
    methods: {
        addClass (index) {
            this.current = index
        },
        resizeTheChart () {
            if (this.$refs.chanrtime) {
                this.$refs.chanrtime.resize()
            }
            if (this.$refs.chanrtime2) {
                this.$refs.chanrtime2.resize()
            }
            if (this.$refs.chanrtime3) {
                this.$refs.chanrtime3.resize()
            }
            this.ringChart.resize()
            this.lineChart.resize()
        },
        getData () {
          homePage().then(res => {
            this.deviceNum=res.data.data.deviceNum
            this.lineData.rows = res.data.data.readMeterRateList;
            for(let i in res.data.data.regionDeviceNum){
              this.chartData.rows.push({
                area:i,
                data:res.data.data.regionDeviceNum[i][1].meternum
              })
              this.chartDataT.rows.push({
                area:i,
                data:res.data.data.regionDeviceNum[i][0].meternum
              })
            }
            this.getLineData()
          })
        },
        getRingData () {
          let ringData = Object.keys(this.deviceInlineRate).map(ele => ({
            name: ele,
            value: this.deviceInlineRate[ele]
          }))
          let series = ringData.map((ele, i) => ({
            type: 'pie',
            radius: [85 - i * 30, 100 - i * 30],
            // hoverAnimation: false,
            itemStyle: {
              normal: {
                  label: {show: false},
                  labelLine: {show: false}
              }
            },
            left: 'center',
            top: 'center',
            data: [
              {
                name: ringData[i].name,
                value: ringData[i].value
              }, {
                name: 'invisible',
                value: 1 - ringData[i].value,
                itemStyle: {
                  normal : {
                      color: 'rgba(0,0,0,0)',
                      // label: {show: false},
                      // labelLine: {show: false}
                  },
                  emphasis : {
                      color: 'rgba(0,0,0,0)'
                  }
                },
              }
            ]
          }))
          this.ringChart = echarts.init(document.getElementById('ring'))
          this.ringChart.setOption({
            series,
            // color: ['#139089', '#14EBA6', '#1A96FF'],
            color: [this.colorName, '#14EBA6', '#1A96FF'],
            legend: {
              data: ringData.map(ele => ele.name),
              top: '80%',
              itemGap: 100,
              formatter: name => {
                let val = ringData[ringData.findIndex(ele => ele.name === name)].value
                let a = '{a|' + name + '}'
                let b = '{b|' + val * 100 + '%}'
                return [a, b].join('\n')
              },
              textStyle: {
                lineHeight: 30,
                rich: {
                  a: {
                    fontSize: 16,
                    color: '#999',
                  },
                  b: {
                    fontSize: 20,
                    color: '#333'
                  }
                }
              },
              icon: 'circle'
            }
          })
        },
        getLineData () {
          this.lineChart = echarts.init(document.getElementById('line'))
          this.lineChart.setOption({
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: this.lineData.rows.map(ele => ele.datestr)
            },
            yAxis: {
                type: 'value',
                axisLabel: {
                  formatter: '{value}%'
                }
            },
            grid: {
              left: 50,
              right: 50
            },
            series: [
              {
                type: 'line',
                data: this.lineData.rows.map(ele => ele.readSuccessRate),
                smooth:true,
                areaStyle: {
                  normal: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                      { offset: 0, color: this.colorName },
                      { offset: 1, color: '#fff' }
                    ])
                  }
                },
                itemStyle: {
                  normal: {
                    color: this.colorName,
                    lineStyle: {
                      color: this.colorName
                    }
                  }
                }
              }
            ]
          })
        }
    }
};
</script>

<style scoped lang="scss">
// .amihome {
  // border:  1px solid red;
  // height: calc(100vh - 300px);
  // overflow-x: hidden;
  // overflow-y: auto;
  // .content {
    // height: 650px;
  // }
// }
.common {
  padding: 30px;
  background: #fff;
  box-sizing: border-box;
  h3 {
    font-size: 18px;
    color: #333;
    padding: 0;
    margin: 0;
  }
}
.devnum {
  .devbox {
    display: flex;
    justify-content: space-between;
    text-align: center;
    // border-bottom: 2px dashed #eeeeee;
    padding: 0;
    margin-top: 30px;
    span {
      color: #666666;
      font-size: 12px;
    }
    li {
      flex: 1;
      display: flex;
      padding: 0 12px;
      // border-right: 2px dashed #eeeeee;
      img {
        width: 64px;
        height: 64px;
      }
      .icon-info {
        margin-left: 15px;
        h4 {
          padding: 0;
          margin: 0;
          font-weight: 400;
          font-size: 18px
        }
        p {
          height: 46px;
          padding: 0;
          margin: 0;
          color: #333;
          line-height: 46px;
          font-size: 30px;
          text-align: left;
        }
      }
    }
    li:nth-child(4) {
      border-right: none;
    }
  }
}
.ratebox {
  position: relative;
  height: 500px;
  #ring {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 500px;
    height: 500px;
    // background-color: #0aa;
  }
}
.devdis {
  height: 500px;
  .change {
    width: 200px;
    margin: 12px auto 30px;
    height: 32px;
    border-radius: 16px;
    border: 1px solid #eee;
    font-size: 0;
    span {
      line-height: 32px;
      text-align: center;
      width: 100px;
      font-size: 14px;
      display: inline-block;
      border-radius: 16px;
    }
  }
}
.linebox {
  height: 400px;
  h3 {
    margin-bottom: 30px;
  }
  #line {
    width: 100%;
    height: 300px;
  }
}
.opacity {
  background: rgba(255,255,255,0.8)
}


</style>


