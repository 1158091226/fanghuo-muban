<!--
 * @Author: xiao xiao xiao lin
 * @Date: 2024-09-03 14:30:43
 * @LastEditors: linguoxie2 171742691@qq.com
 * @LastEditTime: 2024-09-05 14:53:43
 * @FilePath: \vue\src\components\MapLayer\mapCompare.vue
 * @Description:
-->
<template>
  <div class="map-compare">
    <div class="compare-box compare1-box">
      <div class="compare-select">
        <el-select v-model="compareSelectValue1" class="mr-10">
          <el-option
            :label="item.name"
            :value="item.type"
            v-for="(item, index) in compareObject.mapTypeList"
            :key="index"
          ></el-option>
        </el-select>
        <!-- <el-date-picker
          v-model="compareYearValue1"
          type="year"
          placeholder="选择年"
          :clearable="false"
          style="width: 96px"
        ></el-date-picker> -->
      </div>
      <map-layer
        :id="mapId1"
        ref="itemMapLayer1"
        :imageSelect="false"
        style="height: 100%"
      ></map-layer>
    </div>
    <div class="compare-box compare2-box">
      <div class="compare-select">
        <el-select v-model="compareSelectValue2" class="mr-10">
          <el-option
            :label="item.name"
            :value="item.type"
            v-for="(item, index) in compareObject.mapTypeList"
            :key="index"
          ></el-option>
        </el-select>
        <!-- <el-date-picker
          v-model="compareYearValue2"
          type="year"
          placeholder="选择年"
          :clearable="false"
          style="width: 96px"
        ></el-date-picker> -->
      </div>
      <map-layer
        v-if="copyMap"
        :id="mapId2"
        ref="itemMapLayer2"
        :imageSelect="false"
        :copy-map="copyMap"
        :map-control="false"
        style="height: 100%"
      ></map-layer>
    </div>
  </div>
</template>
<script>
import { defineAsyncComponent } from "vue";
import DrawMapLayer from "@/components/DrawMapLayer";
import { deepClone } from "@/utils";

export default {
  name: "MapCompare",
  mixins: [DrawMapLayer],
  props: {
    compareObject: {
      type: Object,
      default: () => {
        return {};
      },
    },
    mapCompareQuery: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  components: {
    MapLayer: defineAsyncComponent(() => {
      return import("@/components/MapLayer");
    }),
  },
  data() {
    return {
      copyMap: null,
      selectIndex: 0,
      mapId1: "map1",
      mapId2: "map2",
      compareSelectValue1: "",
      compareSelectValue2: "",
      mapName1: "itemMapLayer1",
      mapName2: "itemMapLayer2",
      mapTypeList1: deepClone(this.compareObject.mapTypeList),
      mapTypeList2: deepClone(this.compareObject.mapTypeList),
      methodsObj: {},
    };
  },
  watch: {
    compareSelectValue1(newValue, oldValue) {
      this.mapQuery.mapName = this.mapName1;
      this.mapTypeList = this.mapTypeList1;
      if (oldValue) {
        let obj = this.findObject(this.mapTypeList, oldValue, false);
        this.changeMap(oldValue, false);
      }
      let objnew = this.findObject(this.mapTypeList, newValue, true);
      this.getMapType(objnew);
    },
    compareSelectValue2(newValue, oldValue) {
      this.mapQuery.mapName = this.mapName2;
      this.mapTypeList = this.mapTypeList2;
      if (oldValue) {
        let obj = this.findObject(this.mapTypeList, oldValue, false);
        this.changeMap(oldValue, false);
      }
      let objnew = this.findObject(this.mapTypeList, newValue, true);
      this.getMapType(objnew);
    },
  },
  mounted() {
    this.mapTypeList1.forEach((item) => {
      item.isChange = true;
    });
    this.mapTypeList2.forEach((item) => {
      item.isChange = true;
    });
    this.$nextTick(() => {
      this.mapQuery = Object.assign({}, this.mapQuery, this.mapCompareQuery);
      setTimeout(() => {
        this.initMap1();
      }, 40);
    });
  },
  methods: {
    async initMap1() {
      // 初始化地图
      this.mapQuery.mapName = this.mapName1;
      this.compareSelectValue1 = this.mapTypeList1[this.selectIndex].type;
      this.mapTypeList = this.mapTypeList1;
      let obj = this.findObject(
        this.mapTypeList,
        this.compareSelectValue1,
        true
      );
      this.getMapType(obj);
      await this.showSimplifyBoundary();
      this.copyMap = this.$refs[this.mapName1];
      this.$nextTick(() => {
        setTimeout(() => {
          this.initMap2();
        }, 40);
      });
    },
    async initMap2() {
      this.mapQuery.mapName = this.mapName2;
      await this.showSimplifyBoundary();
      this.compareSelectValue2 = this.mapTypeList2[this.selectIndex + 1].type;
      this.mapTypeList = this.mapTypeList2;
      let obj = this.findObject(
        this.mapTypeList,
        this.compareSelectValue2,
        true
      );
      this.getMapType(obj);
    },
    findObject(arr, type, active) {
      let result = {};
      for (let i = 0; i < arr.length; i++) {
        const element = arr[i];
        if (element.type == type) {
          result = element;
          if (active != undefined) {
            result.active = active;
          }
          break;
        }
      }
      return result;
    },
  },
};
</script>
<style lang="scss" scoped>
.map-compare {
  width: 100%;
  height: 100%;
}
.compare-box {
  height: 50%;
}
.compare-select {
  position: absolute;
  z-index: 8;
  left: 10px;
}
.compare1-box {
  position: relative;
  .compare-select {
    bottom: 10px;
  }
}
.compare2-box {
  position: relative;
  .compare-select {
    top: 10px;
  }
}
</style>
