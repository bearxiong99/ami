<template>
<!--    <div style="background-color: #fff;">-->
      <!--左侧成功率数值展示 -->
      <el-row>
        <el-col :span="15">
        <div :class="{devdis: true, common: true, opacity: themeName === 'theme-star' ? true : false}">
          <h3 style="margin-top: -15px;margin-left: 22px">{{rowLabel.readingMeterSuccessRate}}</h3>
<!--          Success rate of meter reading-->
          <ul class="devbox">
            <li>
              <div class="icon-day">Day</div>
              <div class="icon-info">
                <p style="font-family: PMZDB">{{this.percentData.day.kpiQuotient}}</p>
                <span>{{rowLabel.yesterdaySuccessRate}}</span>
<!--                <span>Yesterday's success rate</span>-->
              </div>
            </li>
            <li>
              <div class="icon-week">Week</div>
              <div class="icon-info">
                <p style="font-family: PMZDB">{{this.percentData.week.kpiQuotient}}</p>
                <span>{{rowLabel.lastWeekSuccessRate}}</span>
<!--                <span>Last week success rate</span>-->
              </div>
            </li>
            <li>
              <div class="icon-month">Month</div>
              <div class="icon-info">
                <p style="font-family: PMZDB">{{this.percentData.month.kpiQuotient}}</p>
                <span>{{rowLabel.lastMonthSuccessRate}}</span>
<!--                <span>Last month success rate</span>-->
              </div>
            </li>
          </ul>
          <ul class="devbox">
            <li>
            <div class="total-icon">
              <span style="padding: 20px 20px;font-size: 20px">{{rowLabel.yesterdayReadMeter}}</span>
<!--              <span>The total number of meter reading yesterday</span>-->
<!--              style="padding: 20px 20px;font-size: 20px"-->
              <span style="color: #FF5C64;font-weight: bold;font-size: 20px;padding: 10px 10px;font-family: PMZDB">10000</span>
            </div>
          </li>
            <li>
              <div class="total-icon">
                <span style="padding: 20px 20px;font-size: 20px">{{rowLabel.totalReadMeter}}</span>
<!--                <span>Success meter reading</span>-->
                <span style="color: #FF5C64;font-weight: bold;font-size: 20px;padding: 10px 10px;font-family: PMZDB">20002</span>

              </div>
            </li>
          </ul>
        </div>
        </el-col>
      <!--右侧折线图展示 -->
     <el-col :span="9">
       <div :class="{devdis: true, common: true, opacity: themeName === 'theme-star' ? true : false}">
         <div class="change">
              <span
                v-for="(item,index) in spanList"
                :key="index"
                v-on:click="addClass(index)"
                :style="{background: current === index ? colorName : '#fff', color: current === index ? '#fff' : '#000'}"
              >{{$t(item.name)}}</span>
         </div>

         <ve-line
           :data="chartDataD"
           ref="chartime2"
           :extend="chartExtend"
           width="auto"
           :legend-visible="false"
           height="220px"
           v-if="current==0"
           :colors="[colorName]"
         ></ve-line>
         <ve-line
           :data="chartDataW"
           ref="chartime3"
           :extend="chartExtend"
           width="auto"
           :legend-visible="false"
           height="220px"
           :colors="[colorName]"
           v-else-if ="current==1"
         ></ve-line>
         <ve-line
           :data="chartDataM"
           ref="chartime"
           :extend="chartExtend"
           width="auto"
           :legend-visible="false"
           height="220px"
           v-else
           :colors="[colorName]"
         ></ve-line>
       </div>
        </el-col>
      </el-row>
<!--    </div>-->
</template>

<script>
  import {mapGetters} from "vuex"
  import { queryKpiToReadSuccRate,queryKpiToReadSuccRateList } from '@/api/dataQuery/kpiQuery'
  import '@/common/font/font.css'
    export default {
        name: "kpiReadSuccRate",

      computed: {
        ...mapGetters(['colorName', 'themeName'])
      },
        data(){
          return{
              rowLabel:{
                  readingMeterSuccessRate: this.$t('kpiReadSuccRate.readingMeterSuccessRate'),
                  yesterdaySuccessRate:this.$t('kpiReadSuccRate.yesterdaySuccessRate'),
                  lastWeekSuccessRate:this.$t('kpiReadSuccRate.lastWeekSuccessRate'),
                  lastMonthSuccessRate:this.$t('kpiReadSuccRate.lastMonthSuccessRate'),
                  yesterdayReadMeter: this.$t('kpiReadSuccRate.yesterdayReadMeter'),
                  totalReadMeter: this.$t('kpiReadSuccRate.totalReadMeter'),
                  day: this.$t('kpiReadSuccRate.day'),
                  week: this.$t('kpiReadSuccRate.week'),
                  month: this.$t('kpiReadSuccRate.month'),
              },
              percentData:{
                  day:{
                      kpiQuotient: "33%"
                  },
                  week:{
                      kpiQuotient: "33%"
                  },
                  month:{
                      kpiQuotient: "33%"
                  }
              },
            current: 0,
            spanList: [
              {
                name: this.$t('kpiReadSuccRate.day')
              },
              {
                name: this.$t('kpiReadSuccRate.week')
              },
              {
                name: this.$t('kpiReadSuccRate.month')
              }
            ],
            chartDataD: {
              columns: ['kpiDate', 'kpiQuotient'],
              rows: [
                {
                  kpiDate: '03.30',
                  kpiQuotient: 0
                },
                {
                  kpiDate: '03.31',
                  kpiQuotient: 10.00
                },
                {
                  kpiDate: '04.01',
                  kpiQuotient: 50.00
                },
                {
                  kpiDate: '04.02',
                  kpiQuotient: 40.21
                },
                {
                  kpiDate: '04.03',
                  kpiQuotient: 24.99
                },
                {
                  kpiDate: '04.04',
                  kpiQuotient: 60.23
                },
                {
                  kpiDate: '04.05',
                  kpiQuotient: 90.66
                }

              ]
            },
            chartDataW: {
              columns: ['kpiDate', 'kpiQuotient'],
              rows: [
                {
                  kpiDate: '03.30',
                  kpiQuotient: 95.00
                },
                {
                  kpiDate: '03.31',
                  kpiQuotient: 10.00
                },
                {
                  kpiDate: '04.01',
                  kpiQuotient: 60.00
                },
                {
                  kpiDate: '04.02',
                  kpiQuotient: 30.21
                },
                {
                  kpiDate: '04.03',
                  kpiQuotient: 74.99
                },
                {
                  kpiDate: '04.04',
                  kpiQuotient: 70.23
                },
                {
                  kpiDate: '04.05',
                  kpiQuotient: 20.66
                }

              ]
            },
            chartDataM: {
              columns: ['kpiDate', 'kpiQuotient'],
              rows: [
                {
                  kpiDate: '03.30',
                  kpiQuotient: 0
                },
                {
                  kpiDate: '03.31',
                  kpiQuotient: 10.00
                },
                {
                  kpiDate: '04.01',
                  kpiQuotient: 50.00
                },
                {
                  kpiDate: '04.02',
                  kpiQuotient: 40.21
                },
                {
                  kpiDate: '04.03',
                  kpiQuotient: 24.99
                },
                {
                  kpiDate: '04.04',
                  kpiQuotient: 60.23
                },
                {
                  kpiDate: '04.05',
                  kpiQuotient: 90.66
                }

              ]
            },
            chartExtend:{
              tooltip:{
                formatter:(data,index)=>{
                  return 'Success Rate '+data[0].value[1]+'%';
                }
              },
              yAxis:{
                  show: true
              },
              series: {
                areaStyle:{
                  color: '#c6ecf0'
                },

              }
            },

          }
        },
        created(){
            this.getData()
        },
      mounted(){
          window.addEventListener("resize",this.resizeTheChart)
      },
      methods:{
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
        },
          getData(){
              queryKpiToReadSuccRate().then(res => {
                  // console.log("返回结果");
                  // console.log(res);
                   this.percentData =res.data.data;
              }),
                  queryKpiToReadSuccRateList().then(res => {
                  // this.chartDataD.rows =res.data.data.day;
                  // this.chartDataW.rows =res.data.data.week;
                  // this.chartDataM.rows =res.data.data.month;
                   // this.percentData =res.data.data;
                      console.log(res)
              })
          },
      }
    }
</script>

<style scoped lang="scss">
  .common {
   //padding: 10px;
    //background: #fff;
    box-sizing: border-box;
    h3 {
      font-size: 18px;
      color: #333;
      padding: 0;
      margin: 0;
    }
  }
  .devdis {
    height: 185px;
  .change {
    width: 300px;
    margin-top: -20px;
    margin-left: 50%;
    height: 31px;
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
        span {
          color: #666666;
          font-size: 12px;
        }
      }
    }
    li:nth-child(4) {
      border-right: none;
    }
  }
  .total-icon{
    margin-left: 15px;
    background: #F5F7FB;
    border: 1px solid #99d9d1;
    border-radius:25px;
  }
  .icon-day{
    width: 64px;
    height: 64px;
    border-radius:50px;
    background-color: #4bc284;//#ED4646 #1E99E0
    color: #FFFFFF;
    font-size: 20px;
    line-height: 64px;
  }
  .icon-week{
    width: 64px;
    height: 64px;
    border-radius:50px;
    background-color: #ED4646;
    color: #FFFFFF;
    font-size: 20px;
    line-height: 64px;
  }
  .icon-month{
    width: 64px;
    height: 64px;
    border-radius:50px;
    background-color: #1E99E0;
    color: #FFFFFF;
    font-size: 20px;
    line-height: 64px;
  }
</style>
