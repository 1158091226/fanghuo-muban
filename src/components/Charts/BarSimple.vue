<template>
  <div :id="id" :class="className" :style="{height:height,width:width}" :data="data" />
</template>

<script>
import echarts from '@/utils/charts';
import resize from './mixins/resize';
require('echarts/theme/macarons'); // echarts theme

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    id: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '200px'
    },
    height: {
      type: String,
      default: '200px'
    },
    data: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  data() {
    return {
      chart: null
    };
  },
  watch: {
    data: {
      handler(newVal, oldVal) {
        this.initChart();
      }
      // deep: true //对象内部属性的监听，关键。
    }
  },
  mounted() {
    this.initChart();
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    initChart() {
      this.chart = echarts.init(document.getElementById(this.id));

      /* const xAxisData = [];
      const data = [];
      const data2 = [];
      for (let i = 0; i < 50; i++) {
        xAxisData.push(i);
        data.push((Math.sin(i / 5) * (i / 5 - 10) + i / 6) * 5);
        data2.push((Math.sin(i / 5) * (i / 5 + 10) + i / 6) * 3);
      } */
      this.chart.setOption({
        title: {
          text: `单位：${this.data.unit ? this.data.unit : ''}`,
          left: '10%',
          top: '20',
          textStyle: {
            color: '#999',
            fontSize: '12',
            fontWeight: 'normal'
          }
        },
        grid: {
          // top: '0',
          // bottom: '0',
          // left: '0',
          // right: '0',
        },
        color: ['#409EFF'],

        textStyle: {
          color: '#999'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        xAxis: {
          type: 'category',
          axisLine: {
            lineStyle: {
              color: '#999'
            }
          },
          data: this.data.dataX
        },
        yAxis: {
          type: 'value',
          axisLine: {
            lineStyle: {
              color: '#999'
            }
          },
          splitLine: { // 网格线
            lineStyle: {
              color: '#ddd',
              type: 'dashed' // 设置网格线类型 dotted：虚线 solid:实线
            }
          }
        },
        series: [{
          data: this.data.dataY,
          type: 'bar',
          barWidth: '30px'
        }]
      });
    }
  }
};
</script>
