<template>
  <div>
    <div :id="id" style="width:90%;height: 500px;"></div>
  </div>
</template>

<script>
import echarts from 'echarts'
export default {
  name: 'EchartsComponent',
  props: {
    chartData: {
      type: Array,
      default: () => []
    },
    id: {
      type: String
    },
    offsetStart: {
      type: String
    },
    offsetEnd: {
      type: String,
      default: '#FFF'
    },
    lineColor: {
      type: String
    },
    itemColor: {
      type: String
    },
    itemBorderColor: {
      type: String,
      default: '#FFF'
    },
    titleText: {
      type: String
    }

  },
  data () {
    return {
      count: 1
    }
  },
  methods: {
    initMap () {
      const myChart = this.$echarts.init(document.getElementById(this.id))
      myChart.setOption({
        tooltip: {
          trigger: 'axis'
        },
        title: {
          text: this.titleText,
          textStyle: {
            color: '#404040',
            fontSize: 16,
            fontWeight: 300,
            fontFamily: 'Source Han Sans CN'
          }
        },
        grid: {
          left: '2%',
          right: '2%',
          bottom: '5%',
          top: '23%',
          containLabel: true
        },
        dataZoom: [{
          type: 'inside',
          start: 0,
          end: this.chartData.length > 10 ? 100 : 100
        }],
        xAxis: {
          axisLine: {
            show: false,
            lineStyle: {
              color: '#397cbc'
            }
          },
          splitLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          // 轴线上的字
          axisLabel: {
            show: true,
            textStyle: {
              color: '#cecece',
              fontSize: '14'
            }
          },
          data: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
        },
        yAxis: [{
          type: 'value',
          splitNumber: 4,
          axisTick: {
            show: false
          },
          // 轴线上的字
          axisLabel: {
            // show: false,
            textStyle: {
              fontSize: '12',
              color: '#cecece'
            }
          },
          axisLine: {
            show: false,
            lineStyle: {
              color: '#397cbc'
            }
          }

        }],
        series: [{
          name: '距离上次来临间隔天数',
          type: 'line',
          smooth: true, // 是否平滑曲线显示
          symbol: 'circle', // 数据点样式设置
          symbolSize: 5,
          markLine: {
            symbol: 'none',
            label: {
              normal: {
                color: '#fff',
                backgroundColor: '#1e4dac',
                fontSize: 16,
                padding: 4,
                borderRadius: 4,
                // show: true,
                // position: 'start',
                distance: 4
              }
            },
            lineStyle: {
              type: 'solid',
              color: '#1e4dac',
              width: 1
            },
            data: [{
              yAxis: 27
            }]
          },
          itemStyle: {
            color: this.itemColor,
            borderColor: this.itemBorderColor,
            borderWidth: 1
          },
          lineStyle: {
            normal: {
              width: 3,
              color: {
                type: 'linear',

                colorStops: [{
                  offset: 0,
                  color: this.lineColor // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: this.lineColor // 100% 处的颜色
                }
                ],
                globalCoord: false // 缺省为 false
              },
              shadowColor: 'rgba(249,165,137, 0.5)',
              shadowBlur: 30,
              shadowOffsetY: 5
            }
          },
          areaStyle: {
            // 区域填充样式
            normal: {
              color: new echarts.graphic.LinearGradient(
                0,
                0,
                0,
                1,
                [{
                  offset: 0,
                  color: this.offsetStart
                },
                {
                  offset: 0.8,
                  color: this.offsetEnd
                }
                ],
                false
              ),
              shadowColor: 'rgba(58,182,224, 0.1)',
              shadowBlur: 6
            }
          },
          data: this.chartData
        }]
      })
    }
  },
  computed: {},
  mounted: function () {
    setTimeout(() => {
      this.initMap()
    }, 1100)
  },
  created () {
    setTimeout(() => {
      this.loading = !this.loading
    }, 1000)
  }
}
</script>

<style scoped>

</style>
