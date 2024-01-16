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
      type: Array,
      default: function() {
        return [];
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
      // console.log(this.data);
      const legendData = [];
      this.data.forEach(v => {
        legendData.push(v.name);
      });
      this.chart.setOption({
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },

        // 图例
        legend: {
          textStyle: {
            color: '#fff'
          },
          orient: 'vertical',
          top: 25,
          right: '20%',
          data: legendData
        },

        series: [
          {
            color: ['#409EFF', '#67C23A', '#E6A23C', '#F56C6C'],

            name: '访问来源',
            type: 'pie',
            radius: ['30%', '70%'], /* 大小/空心 */
            center: ['30%', '50%'], /* 位置 */
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center'
            },

            // 中间显示当前标题
            emphasis: {
              label: {
                show: false,
                fontSize: '30',
                fontWeight: 'bold'
              }
            },

            labelLine: {
              show: false
            },
            /* data: [
              { value: 335, name: '直接访问' },
              { value: 310, name: '邮件营销' },
              { value: 234, name: '联盟广告' },
              { value: 135, name: '视频广告' }
            ] */
            data: this.data
          }
        ]
      });
    }
  }
};
</script>
