<!--  -->
<template>
  <div>
    <!-- 地图 -->
    <map-layer
      :id="mapId"
      ref="mapLayer"
      :height="mapHeight"
      :show-note-layer="false"
      :image-fetch="false"
      :layer-indexs="2"
      :is-custom="true"
      :map-control="false"
      :map-info="false"
      :is-show-tool="true"
    />
  </div>
</template>

<script>
import MapLayer from '@/components/MapLayer';
import DrawMapLayer from '@/components/DrawMapLayer';
export default {
  components: {
    MapLayer
  },
  mixins: [DrawMapLayer],
  data() {
    return {
      mapId: 'mapLayer',
      mapHeight: document.body.clientHeight - 130 + 'px' // 计算地图组件高度
    };
  }

  // components: {},

  // watch: {},

  // computed: {},

  // created(){},

  // mounted(){},

  // methods: {},
};
</script>

<style lang="less" scoped></style>
