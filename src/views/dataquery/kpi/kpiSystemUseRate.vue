<template>
      <el-row :gutter="20" >
        <el-col :span="10" >
          <div class="leftbox" >
          <div class="devbox">
          <h3>{{rowLabel.systemAvaillability}}</h3>
            <!-- System availlability-->
          <div class="spanbox">
             <p class="p1"><span style="font-family: PMZDB">{{parseInt(this.sys_avalibity_Data.kpiDividend/24)}}</span>{{rowLabel.day}}<span style="font-family: PMZDB">{{this.sys_avalibity_Data.kpiDividend%24}}</span>{{rowLabel.hour}}</p>
             <p class="p2">{{rowLabel.systemRunTimeOn}}</p>
<!--             <p class="p2">Digital display system has run time</p>-->

          </div>
          <div class="spanbox">
            <p class="p1"><span style="font-family: PMZDB">{{parseInt(this.sys_avalibity_Data.kpiDivisor/24)}}</span>{{rowLabel.day}}<span style="font-family: PMZDB">{{this.sys_avalibity_Data.kpiDivisor%24}}</span>{{rowLabel.hour}}</p>
            <p class="p2">{{rowLabel.systemRunTimeTotal}}</p>
<!--            <p class="p2"> Unscheduled downtime</p>-->
          </div>
          </div>
          <div class="ratebox">
          <div id="ring"></div>
              <span >{{rowLabel.systemAvaillability}}</span>
            </div>
          </div>
        </el-col>

        <el-col :span="14" >
          <div class="barbox" >
             <div id="bar"></div>
          </div>
        </el-col>
      </el-row>
</template>

<script>
  import echarts from "echarts"
  import { queryKpiToSystemUserRate } from '@/api/dataQuery/kpiQuery'
  import '@/common/font/font.css'

    export default {
        name: "kpiSystemUseRate",
        data() {
            return {
                rowLabel:{
                    systemAvaillability: this.$t('kpiSystemUseRate.systemAvaillability'),
                    systemRunTimeOn:this.$t('kpiSystemUseRate.systemRunTimeOn'),
                    systemRunTimeTotal:this.$t('kpiSystemUseRate.systemRunTimeTotal'),
                    defectResolution:this.$t('kpiSystemUseRate.defectResolution'),
                    day:this.$t('kpiSystemUseRate.day'),
                    hour:this.$t('kpiSystemUseRate.hour'),
                    defectotal:this.$t('kpiSystemUseRate.defectotal'),
                    hasSolutionDefect:this.$t('kpiSystemUseRate.hasSolutionDefect'),
                },
                sys_avalibity_Data: {
                    kpiDividend: 24,
                    kpiDivisor: 48,
                    kpiQuotient: 88
                },
                ringData: [{
                    name: 'rate',
                    value: 97.32

                }],
                barData: [{
                    name: '1',
                    data1: 10,
                    data2: 20,
                    data3: 50.00
                }, {
                    name: '2',
                    data1: 40,
                    data2: 60,
                    data3: 30.00
                }],
            }
        },
        created() {
            this.getData()
        },
        mounted() {
            this.getRingData()
            this.getBarData()
        },
        methods: {
            getRingData() {
                let ringCharts = echarts.init(document.getElementById("ring"));
                ringCharts.setOption({
                    series: [{
                        type: 'pie',
                        radius: ['70%', '80%'],
                        silent: true,
                        // hoverAnimation: false,
                        itemStyle: {
                            normal: {
                                label: {show: false},
                                labelLine: {show: false}
                            }
                        },
                        data: [
                            {
                                name: this.ringData[0].name,
                                value: this.sys_avalibity_Data.kpiQuotient,
                            }, {
                                name: 'invisible',
                                value: 100 - this.sys_avalibity_Data.kpiQuotient,
                                itemStyle: {
                                    normal: {
                                        color: 'rgba(0,0,0,0)',
                                        // label: {show: false},
                                        // labelLine: {show: false}
                                    }
                                },
                            }
                        ],
                        label: {
                            normal: {
                                show: true,
                                position: 'center',
                                formatter: '{c}%',
                                fontSize:55,/*"pie"中的字体大小*/
                                fontFamily: 'PMZDB'

                            }
                        }
                    }],
                    color: ['#1EB99E'],
                });
            },
            getBarData() {
                let barCharts = echarts.init(document.getElementById("bar"));
                barCharts.setOption({
                    title: {
                        text: this.rowLabel.defectResolution,
                        x: 'left',
                        y: 'top',
                    },
                    //定义鼠标移入显示的数据(又叫鼠标悬停)
                    tooltip:{
                        trigger: 'item',
                    },
                    xAxis: {
                        type: 'category',
                        data: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
                    },
                    yAxis: [{
                        type: 'value',
                        min: 0,
                        max: 100,
                        interval: 20,
                        axisLabel: {
                            formatter: '{value}%'
                        }
                    }, {
                        type: 'value',
                        show: false

                    }],
                    legend: {
                        show: true,
                        orient: 'horizontal',
                        x: 'right',
                        y: 'top',
                        padding: [5, 30],
                        data: [this.$t('kpiSystemUseRate.defectotal'), this.$t('kpiSystemUseRate.hasSolutionDefect')],
                    },
                    grid: {
                        left: 50,
                        right: 50
                    },
                    series: [{
                        type: 'bar',
                        name: this.$t('kpiSystemUseRate.defectotal'),
                        stack: 'sum',
                        barWidth: '10%',
                        yAxisIndex: 1,
                        itemStyle: {
                            color: '#51B5E9'
                        },
                        data: this.barData.map(ele => ele.data1),
                    }, {
                        type: 'bar',
                        name: this.$t('kpiSystemUseRate.hasSolutionDefect'),
                        stack: 'sum',
                        yAxisIndex: 1,
                        itemStyle: {
                            color: '#FD5B5B'
                        },
                        data: this.barData.map(ele => ele.data2),
                    }, {
                        type: 'line',
                        yAxisIndex: 0,
                        itemStyle: {
                            color: '#51B5E9'
                        },
                        areaStyle: {
                            color: '#c6ecf0'
                        },
                        data: this.barData.map(ele => ele.data3),
                    }]
                })

            },
            getData() {
                queryKpiToSystemUserRate().then(res => {
                    console.log("返回结果");
                    console.log(res);
                    // sys_avalibity_Data:{
                    //     kpiDividend:33,
                    //         kpiDivisor:88,
                    //         kpiQuotient:1
                    // },
                    this.sys_avalibity_Data = res.data.data;
                })
            },
        },
        watch: {
            sys_avalibity_Data: {
                handler(newVal, oldVal) {
                    //if存在的意义???
                    if (newVal != oldVal) {
                        this.getRingData();
                    }

                }
            },
        },
    }
</script>

<style scoped lang="scss">
  .devbox {
    //padding: 30px;
    width: 50%;

    h3 {
      font-size: 18px;
      color: #333;
      padding: 0;
      margin: 0;
    }
    .spanbox {
      padding-left: 5px;
    }
    .p1 {
      font-size: 22px;
      color: #333;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      height: 50px;
      span {
        display: block;
        background-color: #333;
        color: #FFFFFF;
        font-size: 36px;
        border-radius: 15px;
        text-align: center;
        width: 50px;
        height: 50px;
      }
    }
    .p2 {
      font-size: 12px;
      color: #999;
      padding: 5px;
    }
  }
  .leftbox{
    display: flex;
    justify-content: space-between;
    background-color: #fff;
    height:260px;
    border-radius: 10px;
    padding:10px 22px;
  }
  .ratebox {
    //padding: 30px;
    width: 50%;
    div {

      width: 100%;
      height: 80%;

      // background-color: #0aa;
    }
    span {
      display: block;
      width: 100%;
      text-align: center;
    }
  }
  .barbox {
    width:100%;
    height:260px;
    background-color: #fff;
    border-radius: 10px;
    padding:10px 0px;
    div{
      height:100%;
    }
  }
</style>
