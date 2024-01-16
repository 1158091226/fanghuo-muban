<!-- 预览图斑 -->
<template>
  <div style="width: 100%; height: 100%">
    <map-layer
      :id="itemMapId"
      ref="itemMapLayer"
      style="width: 100%; height: 100%"
      :image-fetch="false"
    />
  </div>
</template>

<script>
import MapLayer from '@/components/MapLayer';
import DrawMapLayer from '@/components/DrawMapLayer';
import { getSimplifyBoundary1 } from '@/api/firprotOneMap/map';
export default {
  components: {
    MapLayer
  },
  mixins: [DrawMapLayer],
  props: {
    previewData: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      itemMapId: 'item_map',
      itemMapHeight: '600px',
      getSimplifyBoundary1Obj: {}
    };
  },

  // components: {},

  // watch: {},

  // computed: {},

  // created(){},

  mounted() {
    this.showSimplifyBoundary1();
    this.$nextTick(() => {
      setTimeout(() => {
        console.log(`output->this.previewData`, this.previewData);
        // 定义新分割后空间数组
        const polygonArr = [];

        // 循环加入到数组中
        // res.data.forEach((v) => {
        //
        // });
        polygonArr.push({
          coords: this.previewData,
          id: Math.random()
        });
        // 定义分割后图层参数
        const obj = {};
        obj.name = this.itemMapId + '_layer_2';
        obj.coordField = 'coords';
        obj.coordsArr = polygonArr;
        obj.fit = true;

        // 定义点击事件
        obj.vectorEventFun = function(coordinate, feature) {};

        // 添加分割后的图层
        this.$refs['itemMapLayer'].addCoordinateLayer(obj);
      }, 1000);
    });
  },

  methods: {
    // 绘制区划
    showSimplifyBoundary1() {
      this.mapQuery.type = 0;
      this.mapQuery.tolerance = this.$tolerance(this.mapQuery.areaCode);
      const areaObj = {};
      areaObj.areaCode = this.mapQuery.areaCode;
      areaObj.areaName = this.mapQuery.areaName;
      // 请求接口获取界限边界数据
      // 这里是在添加区划图层
      getSimplifyBoundary1(this.mapQuery).then((res) => {
        this.getSimplifyBoundary1Obj = {
          name: 'area_layer',
          coordField: 'boundaryLine',
          textField: 'areaName',
          coordsArr: res.data,
          coordsStyle: this.mapAreaQuery.coordsStyle || {
            fill: {
              color: 'rgba(255, 255, 0, 0)'
            },
            stroke: {
              width: 2,
              color: '#00ffff'
            },
            text: {
              fill: {
                color: '#ffffff'
              },
              font: '16px Microsoft YaHei',
              stroke: {
                width: 1
              }
            }
          },
          position: 998,
          fit: true,
          vectorEventFun: (coordinate, feature) => {
            return;
          }
        };
        // 添加图层进去
        this.$refs['itemMapLayer'].addCoordinateLayer(
          this.getSimplifyBoundary1Obj
        );
      });
    }
  }
};
</script>

<style lang="less" scoped></style>
