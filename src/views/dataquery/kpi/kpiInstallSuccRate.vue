<template>

  <!--    <basic-container>-->
  <el-row>
    <el-col :span="12"><h3 style="margin-top: 10px;margin-left: 22px">{{rowLabel.meterInstallSuccessRate}}</h3></el-col>
    <el-col :span="12"><h3 style="margin-top: 10px;margin-left: 22px">{{rowLabel.total}}</h3></el-col>


    <el-col :span="5" >
      <!--          v-bind:class缩写成:class,表达式的结果类型除了字符串之外，还可以是对象或数组,如<div v-bind:class="[classA, classB]">,还可以是可以用三元表达式-->
      <!--          下面的2都为true,则这2个class都生效-->
      <div :class="{ratebox: true,common:true}">
        <!--            name绑定的"ring",说明在下面的methods里面肯定用到了这个属性,然后插入进来,果不其然看接下来的注释-->
        <!--            let rings =document.getElementsByName("ring")-->
        <div name="ring"></div>
        <span>{{rowLabel.installRate}}</span>
      </div>
    </el-col>
    <el-col :span="2">
      <div :class="{ratebox: true,common:true}">
        <div ref="liquidDay4g" ></div>
        <span>{{rowLabel.fourMeter}}</span>
        <!--            Meter 4 g-->
      </div>
    </el-col>
    <el-col :span="2">
      <div :class="{ratebox: true,common:true}">
        <div ref="liquidDay2m"></div>
        <span>{{rowLabel.twoModeMeter}}</span>
        <!--            Two-mode Meter-->
      </div>
    </el-col>
    <el-col :span="2">
      <div :class="{ratebox: true,common:true}">
        <div ref="liquidDayNb"></div>
        <span>{{rowLabel.nbmeter}}</span>
        <!--            NB Meter-->
      </div>
    </el-col>
    <el-col :span="1"></el-col>

    <el-col :span="5">
      <div :class="{ratebox: true,common:true}">
        <div name="ring" id="ringTotal"></div>
        <span>{{rowLabel.installRate}}</span>
      </div>
    </el-col>
    <el-col :span="2">
      <div :class="{ratebox: true,common:true}">
        <div ref="liquidTotal4g"></div>
        <span>{{rowLabel.fourMeter}}</span>
        <!--            Meter 4 g-->
      </div>
    </el-col>
    <el-col :span="2">
      <div :class="{ratebox: true,common:true}">
        <div ref="liquidTotal2m"></div>
        <span>{{rowLabel.twoModeMeter}}</span>
        <!--            Two-mode Meter-->
      </div>
    </el-col>
    <el-col :span="2">
      <div :class="{ratebox: true,common:true}">
        <div ref="liquidTotalNb"></div>
        <span>{{rowLabel.nbmeter}}</span>
        <!--            NB Meter-->
      </div>
    </el-col>
    <el-col :span="1"></el-col>
  </el-row>

  <!--    </basic-container>-->

</template>

<script>

    import echarts from 'echarts'
    import 'echarts-liquidfill/src/liquidFill.js'
    import {queryKpiToInstallSucessRate} from '@/api/dataQuery/kpiQuery'
    import '@/common/font/font.css'

    export default {
        data() {
            return {
                rowLabel:{
                    meterInstallSuccessRate: this.$t('kpiInstallSuccRate.meterInstallSuccessRate'),
                    total:this.$t('kpiInstallSuccRate.total'),
                    installRate:this.$t('kpiInstallSuccRate.installRate'),
                    fourMeter:this.$t('kpiInstallSuccRate.fourMeter'),
                    twoModeMeter: this.$t('kpiInstallSuccRate.twoModeMeter'),
                    nbmeter: this.$t('kpiInstallSuccRate.nbmeter'),
                    installMeter: this.$t('kpiInstallSuccRate.installMeter'),
                },

                huangZhuangData: [[
                    {
                        value: 112,
                        name: this.$t('kpiInstallSuccRate.unregister'),
                        itemStyle: {
                            color: '#FFC527',
                        },
                    },
                    {
                        value: 1122,
                        name: this.$t('kpiInstallSuccRate.register'),
                        itemStyle: {color: '#FD5B5B'}
                    },

                ], [
                    {
                        value: 113,
                        name: this.$t('kpiInstallSuccRate.unregister'),
                        itemStyle: {color: '#FFC527'}
                    },
                    {
                        value: 1133,
                        name: this.$t('kpiInstallSuccRate.register'),
                        itemStyle: {color: '#FD5B5B'}
                    },
                ]],
                shuidiData: {
                    liquidDay4g: 0.3,
                    liquidDay2m: 0.3,
                    liquidDayNb: 0.3,
                    liquidTotal: 0.3,
                    liquidTotal4g: 0.3565,
                    liquidTotal2m: 0.3475,
                    liquidTotalNb: 0.3
                },
                tooltip: {
                    trigger: 'none'
                },
                chartExtend: {
                    legend: {
                        show: false
                    }
                },
                liquidColor: {
                    liquidDay4g: '#FC5D5D',
                    liquidDay2m: '#4FC48A',
                    liquidDayNb: '#FDC52B',
                    liquidTotal: '#1890ff',
                    liquidTotal4g: '#FC5D5D',
                    liquidTotal2m: '#4FC48A',
                    liquidTotalNb: '#FDC52B'
                }
            }
        },
        created() {
            this.getData()
        },
        mounted() {
            this.getTotalRingData()
            this.getliquid4gData()


        },
        methods: {
            getTotalRingData() {
                let rings = document.getElementsByName("ring")
                for (let i = 0; i < rings.length; i++) {
                    let ringChart = echarts.init(rings[i])
                    ringChart.setOption({
                        series: [
                            {
                                name: this.$t('kpiInstallSuccRate.installMeter'),/*虽然上面定义了this.rowLabel.installRate,但是不能直接引入,因为还没有加载完呢*/
                                type: 'pie',
                                radius: ['30%', '60%'],
                                //饼状图位置，第一个参数是左右，第二个是上下。
                                center: ['50%','55%'],
                                silent: false, //取消鼠标选中??
                                label: {
                                    normal: {
                                        show: true,
                                        formatter: (data) => {
                                            let res = '{a|' + data.name + '}\n{b|' + data.value + '}\n\n';
                                            return res;
                                        },
                                        fontFamily:'PMZDB',
                                        //展示的字体与饼状图的距离
                                        padding: [0, -10],
                                        rich: {
                                            a: {
                                                color: '#999',
                                                //lineHeight: 20,//设置最后一行空数据高度，为了能让延长线与hr线对接起来
                                                align: 'left'
                                            },
                                            b: {
                                                color: 'auto',
                                                //设置最后一行空数据高度，为了能让延长线与hr线对接起来
                                                align: 'right'
                                            },
                                            hr: {//设置hr是为了让中间线能够自适应长度
                                                borderColor: 'auto',//hr的颜色为auto时候会主动显示颜色的
                                                width: '100%',
                                                borderWidth: 0.5,
                                                height: 0.5,
                                            }
                                        }
                                    }
                                },
                                data: this.huangZhuangData[i]
                            }

                        ],
                        //鼠标移入显示
                        tooltip: {
                            trigger: 'item',
                            formatter: '{a} <br/>{b} : {c} ({d}%)',
                        },

                    })
                }

            },
            getliquid4gData() {
                const liquid = this.$refs

                for (let key in liquid) {
                    let liquid4gChart = echarts.init(liquid[key])
                    liquid4gChart.setOption({
                        series: [{
                            type: 'liquidFill',
                            radius: '60%',
                            waveAnimation: true,
                            left: '50%',
                            top: '50%',
                            data: [{
                                value: this.shuidiData[key],
                                direction: 'left',
                                itemStyle: {
                                    normal: {
                                        color: this.liquidColor[key],
                                    }
                                }
                            }],
                            outline: {
                                // show: true , //是否显示轮廓 布尔值
                                borderDistance: 1, // 外部轮廓与图表的距离 数字
                                itemStyle: {
                                    borderColor: this.liquidColor[key], // 边框的颜色
                                    borderWidth: 3 // 边框的宽度
                                    // shadowBlur: 5 , //外部轮廓的阴影范围 一旦设置了内外都有阴影
                                    // shadowColor: '#000' //外部轮廓的阴影颜色
                                }
                            },
                            //容器内部颜色透明度
                            itemStyle: {
                                opacity: 0.9, // 波浪的透明度
                                shadowBlur: 0 // 波浪的阴影范围
                            },

                            //容器内字体样式
                            label: {
                                show: true,
                                color: this.liquidColor[key],
                                insideColor: '#fff',
                                fontSize: 20,
                                fontWeight: 400,
                                align: 'center',
                                baseline: 'middle',
                                position: 'inside',
                                fontFamily: 'PMZDB'
                            },
                            //容器背景颜色
                            backgroundStyle:{
                                color:"#F5F7FB"
                            }
                        }]
                    })
                }

            },
            getData() {
                queryKpiToInstallSucessRate().then(res => {
                    // console.log("返回结果");
                    // console.log(res);
                    let yeRate = res.data.data.yesSucRate;
                    let totalRate = res.data.data.totalSucRate;
                    this.huangZhuangData = [[
                        {
                            value: yeRate.TOTALINSTALL,
                            name: '未注册',
                            itemStyle: {color: '#FFC527'}
                        },
                        {
                            value: yeRate.TOTALREGISTER,
                            name: '已注册',
                            itemStyle: {color: '#FD5B5B'}
                        },
                    ], [
                        {
                            value: totalRate.TOTALINSTALL,
                            name: '未注册',
                            itemStyle: {color: '#FFC527'}
                        },
                        {
                            value: totalRate.TOTALREGISTER,
                            name: '已注册',
                            itemStyle: {color: '#FD5B5B'}
                        },

                    ]];
                    this.shuidiData = {
                        liquidDay4g: yeRate.FOURGSUCCRATE,
                        liquidDay2m: yeRate.TWOMSUCCRATE,
                        liquidDayNb: yeRate.NBSUCCRATE,

                        liquidTotal4g: totalRate.FOURGSUCCRATE,
                        liquidTotal2m: totalRate.TWOMSUCCRATE,
                        liquidTotalNb: totalRate.NBSUCCRATE
                    }
                })
            },
        },
        watch: {
            huangZhuangData: {
                handler(newVal, oldVal) {
                    //if存在的意义???
                    if (newVal != oldVal) {
                        this.getTotalRingData();
                    }

                }
            },
            shuidiData: {
                handler(newVal, oldVal) {
                    //if存在的意义???
                    if (newVal != oldVal) {
                        this.getliquid4gData();
                    }

                }
            }

        }

    }
</script>

<style scoped lang="scss">
  .common {
    //padding: 10px;
    // background: #fff;
    box-sizing: border-box;

    h3 {
      font-size: 38px;
      color: #333;
      padding: 0;
      margin: 0;
    }
  }

  .ratebox {
    //position: relative;
    height: 200px;

    div {
      //position: absolute;
      //left: 40%;
      // top: 30%;
      // transform: translate(-50%, -50%);
      width: 100%;
      height: 150px;
      // background-color: #0aa;
    }

    span {
      display: block;
      // position: relative;
      width: 100%;
      text-align: center;
      //top:60%;
    }
  }
</style>
