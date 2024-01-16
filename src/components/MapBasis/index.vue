<!-- 地图基础版本 -->
<template>
  <div ref="mapBasis" style="height: 100%" class="map-basis">
    <div :id="mapId" :ref="mapId" style="height: 100%; width: 100%" />

    <!-- 坐标采集框 -->
    <div v-if="isCoordinate" class="coordinate-collection">
      <div v-if="dataState == 'update'" class="title">坐标采集</div>
      <div v-else class="title">坐标</div>

      <div v-if="dataState == 'update'" class="btn-box">
        <div
          v-if="dratTypeArr.includes('Point')"
          class="btn-item"
          :class="[btnSelectIndex == 0 ? 'btn-item-click' : '']"
          @click="drawBtnClick(0)"
        >
          <img src="@/static/templateImages/point.png" alt="">
        </div>
        <div
          v-if="dratTypeArr.includes('LineString')"
          class="btn-item"
          :class="[btnSelectIndex == 1 ? 'btn-item-click' : '']"
          @click="drawBtnClick(1)"
        >
          <img src="@/static/templateImages/line.png" alt="">
        </div>
        <div
          v-if="dratTypeArr.includes('Polygon')"
          class="btn-item"
          :class="[btnSelectIndex == 2 ? 'btn-item-click' : '']"
          @click="drawBtnClick(2)"
        >
          <img src="@/static/templateImages/polygon.png" alt="">
        </div>
        <div
          class="btn-item"
          :class="[btnSelectIndex == 3 ? 'btn-item-click' : '']"
          @click="deletePointClick"
        >
          <img src="@/static/templateImages/map-delete.png" alt="">
        </div>
      </div>

      <el-form
        ref="positioningDialogForm"
        :model="positioningData"
        label-width="60px"
        label-position="left"
        class="coordinate-form"
      >
        <el-form-item label="经度" prop="longitude">
          <!-- v-if="dataState == 'update'" -->
          <el-input-number
            v-if="false"
            v-model.trim="positioningData.longitude"
            style="width: 100%"
            placeholder="请输入"
            :controls="false"
          />
          <div v-else>
            {{ handleCoordinateLength(positioningData.longitude) }}
          </div>
        </el-form-item>

        <el-form-item label="纬度" prop="latitude">
          <!-- v-if="dataState == 'update'" -->
          <el-input-number
            v-if="false"
            v-model.trim="positioningData.latitude"
            style="width: 100%"
            placeholder="请输入"
            :controls="false"
          />
          <div v-else>
            {{ handleCoordinateLength(positioningData.latitude) }}
          </div>
        </el-form-item>

        <el-form-item
          v-if="!dratTypeArr.includes('Point') && btnSelectIndex != 0"
          label="至东经"
          prop="longitudeEnd"
        >
          <!-- v-if="dataState == 'update'" -->
          <el-input-number
            v-if="false"
            v-model.trim="positioningData.longitudeEnd"
            style="width: 100%"
            placeholder="请输入"
            :controls="false"
          />
          <div v-else>
            {{ handleCoordinateLength(positioningData.longitudeEnd) }}
          </div>
        </el-form-item>

        <el-form-item
          v-if="!dratTypeArr.includes('Point') && btnSelectIndex != 0"
          label="至北纬"
          prop="latitudeEnd"
        >
          <!-- v-if="dataState == 'update'" -->
          <el-input-number
            v-if="false"
            v-model.trim="positioningData.latitudeEnd"
            style="width: 100%"
            placeholder="请输入"
            :controls="false"
          />
          <div v-else>
            {{ handleCoordinateLength(positioningData.latitudeEnd) }}
          </div>
        </el-form-item>
      </el-form>
    </div>

    <!-- 地形模式 -->
    <div v-if="isTerrain || isFullScreen" class="terrain-box">
      <div v-show="terrainSmallSelect == 3" class="box-big">
        <div class="title-box">
          <div class="title">地形模式</div>
          <el-checkbox
            v-model="showNoteLayer"
            @change="showNoteLayerChange"
          >注记</el-checkbox>
        </div>
        <div class="content-box">
          <div
            class="content-item"
            :class="[baseLayerIndex == 0 ? 'content-item-on' : '']"
            @click="changeBaseLayers(0)"
          >
            <img class="img" src="@/static/guide-bg.jpg" alt="">
            <div class="name">地图</div>
          </div>
          <div
            class="content-item"
            :class="[baseLayerIndex == 1 ? 'content-item-on' : '']"
            @click="changeBaseLayers(1)"
          >
            <img class="img" src="@/static/guide-bg.jpg" alt="">
            <div class="name">影像</div>
          </div>
          <div
            class="content-item"
            :class="[baseLayerIndex == 2 ? 'content-item-on' : '']"
            @click="changeBaseLayers(2)"
          >
            <img class="img" src="@/static/guide-bg.jpg" alt="">
            <div class="name">地形</div>
          </div>
          <div class="content-item">
            <img class="img" src="@/static/guide-bg.jpg" alt="">
            <div class="name">三维</div>
          </div>
        </div>
      </div>
      <div class="box-small">
        <div class="icon-box" @click="fullScreenClick">
          <img
            v-if="terrainSmallSelect == 0"
            class="img"
            src="@/static/templateImages/full-screen.png"
            alt=""
          >
          <img
            v-else
            class="img"
            src="@/static/templateImages/full-screen-off.png"
            alt=""
          >
        </div>
        <div class="icon-box" @click="zoomOut">
          <img
            v-if="terrainSmallSelect == 1"
            class="img1"
            src="@/static/templateImages/reduce.png"
            alt=""
          >
          <img
            v-else
            class="img1"
            src="@/static/templateImages/reduce-off.png"
            alt=""
          >
        </div>
        <div class="icon-box" @click="zoomIn">
          <img
            v-if="terrainSmallSelect == 2"
            class="img"
            src="@/static/templateImages/add.png"
            alt=""
          >
          <img
            v-else
            class="img"
            src="@/static/templateImages/add-off.png"
            alt=""
          >
        </div>
        <div class="icon-box" @click="isShowTerrainBigBoxClick">
          <img
            v-if="terrainSmallSelect == 3"
            class="img3"
            src="@/static/templateImages/map-icon.png"
            alt=""
          >
          <img
            v-else
            class="img3"
            src="@/static/templateImages/map-icon-off.png"
            alt=""
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import 'ol/ol.css';
import lodash from 'lodash';
import Map from 'ol/Map';
import View from 'ol/View';
import ScaleLine from 'ol/control/ScaleLine';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import WKT from 'ol/format/WKT';
import Draw from 'ol/interaction/Draw';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Select from 'ol/interaction/Select';
import Modify from 'ol/interaction/Modify';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import MultiPoint from 'ol/geom/MultiPoint';
import FullScreen from 'ol/control/FullScreen';

import OlStyle from 'ol/style/Style';
import OlStyleIcon from 'ol/style/Icon';
import OlStyleText from 'ol/style/Text';
import OlStyleCircle from 'ol/style/Circle';
import OlStyleFill from 'ol/style/Fill';
import OlStyleStroke from 'ol/style/Stroke';
import { click } from 'ol/events/condition';
import { get as getProjection } from 'ol/proj';
import { defaults as defaultInteractions } from 'ol/interaction';
import { getType } from '@turf/invariant';

export default {
  name: 'MapBasisLayer',
  props: {
    // 是否需要展示坐标采集框
    isCoordinate: {
      type: Boolean,
      default: true
    },
    // 是否需要展示地形模式
    isTerrain: {
      type: Boolean,
      default: true
    },
    // 绘制的是点线面啥
    drawType: {
      type: String,
      default: 'Point' // Point,LineString,Polygon
    }
  },
  data() {
    const defaultMap = {
      center: [114.99114990234375, 27.119064331054688],
      maxZoom: 18,
      minZoom: 4,
      zoom: 7,
      extent: [113.3436, 24.2914, 118.2858, 30.0441],
      baseLayers: [
        {
          url: 'http://t4.tianditu.gov.cn/DataServer?T=vec_c&x={1}&y={2}&l={0}&tk=f536641212889df16a6afaa1beff020b', // 平面
          noteUrl:
            'http://t4.tianditu.gov.cn/DataServer?T=cva_c&x={1}&y={2}&l={0}&tk=f536641212889df16a6afaa1beff020b',
          name: 'base_layer_tdt_vec_c', // 名称
          noteName: 'base_layer_tdt_cva_c',
          title: '天地图', // 标题
          index: 0, //
          origin: '天地图', // 来源
          type: 1, // 影像类型
          active: false, // 是否显示
          time: '未知', // 更新时间
          no: 'GS(2021)1487号' // 版本号
        },
        {
          url: 'http://t4.tianditu.gov.cn/DataServer?T=img_c&x={1}&y={2}&l={0}&tk=f536641212889df16a6afaa1beff020b', // 影像
          noteUrl:
            'http://t4.tianditu.gov.cn/DataServer?T=cia_c&x={1}&y={2}&l={0}&tk=f536641212889df16a6afaa1beff020b',
          name: 'base_layer_tdt_img_c', // 名称
          noteName: 'base_layer_tdt_cia_c',
          title: '天地图', // 标题
          index: 0, //
          origin: '天地图', // 来源
          type: 1, // 影像类型
          active: false, // 是否显示
          time: '未知', // 更新时间
          no: 'GS(2021)1487号' // 版本号
        },
        {
          url: 'http://t4.tianditu.gov.cn/DataServer?T=ter_c&x={1}&y={2}&l={0}&tk=f536641212889df16a6afaa1beff020b', // 地形
          noteUrl:
            'http://t4.tianditu.gov.cn/DataServer?T=cta_c&x={1}&y={2}&l={0}&tk=f536641212889df16a6afaa1beff020b',
          name: 'base_layer_tdt_ter_c', // 名称
          noteName: 'base_layer_tdt_cta_c',
          title: '天地图', // 标题
          index: 0, //
          origin: '天地图', // 来源
          type: 1, // 影像类型
          active: false, // 是否显示
          time: '未知', // 更新时间
          no: 'GS(2021)1487号' // 版本号
        }
      ]
    };

    const price = (rule, value, callback) => {
      const reg = /^[+-]?(0|([1-9]\d*))(\.\d+)?$/;
      if (!value) {
        callback(new Error('请输入'));
      } else if (!Number(value)) {
        callback(new Error('请输入数字值'));
      } else {
        if (reg.test(value)) {
          callback();
        } else {
          callback(new Error('请输入正确的数值'));
        }
      }
    };
    return {
      view: null,
      map: null,
      defaultMap,
      draw: null,
      mapId: 'mapId' + new Date().getTime() + Math.random(),
      baseLayerIndex: 1, // 基础图层总共0 1 2，就是baseLayers里面的
      baseLayerObj: {}, // 加载图层图层信息存放，图层名称：图层信息,地形，平面，影像
      drawLayerObj: {}, // 工具绘制图层信息存放obj，相当于和mapTypeList一样也是存放图层的
      positioningData: {
        // 坐标采集的经纬度
        longitude: undefined,
        latitude: undefined,
        longitudeEnd: undefined,
        latitudeEnd: undefined
      },
      // positioningDialogRules: {
      //   longitude: [{ required: true, validator: price, trigger: "blur" }],
      //   latitude: [{ required: true, validator: price, trigger: "blur" }],
      // },
      btnSelectIndex: -1, // 用户选择的功能index
      selectDataInteraction: null, // 这是绘制后给点加上选择事件
      selectDeleteDataInteraction: null, // 这是删除点要用的选择事件
      modifyInteraction: null, // 这是移动事件
      dataState: 'details', // 状态详情还是编辑details,update,add
      drawWktData: '', // 这个存放编辑绘制的wkt数据

      terrainSmallSelect: -1, // 地形模式小框选择的按钮
      showNoteLayer: false, // 是否需要注记层
      isFullScreen: false // 是否全屏
    };
  },

  computed: {
    dratTypeArr() {
      switch (this.drawType) {
        case 'Point':
          return ['Point'];
        case 'LineString':
          return ['LineString'];
        case 'Polygon':
          return ['Polygon'];
        case 'PointPolygon':
          return ['Point', 'Polygon'];
      }
    }
  },

  // components: {},

  watch: {},

  // created(){},

  mounted() {
    this.$nextTick(() => {
      this.initMap();
      // this.initDrawBtn();
    });
  },

  methods: {
    // 初始化加载地图
    initMap() {
      // view：定义地图的可见部分，包括中心点、缩放级别、旋转角度和投影方式。它是一个 View 对象。
      // 相当于就是在设置地图最开始的位置了
      this.view = new View({
        projection: getProjection('EPSG:4326'), // 坐标系EPSG:4326
        center: this.defaultMap.center, // 中心点坐标
        minZoom: this.defaultMap.minZoom, // 最小级别
        maxZoom: this.defaultMap.maxZoom,
        zoom: this.defaultMap.zoom
        // extent: this.defaultMap.extent, //范围限制
      });

      this.map = new Map({
        layers: [],
        view: this.view,
        target: this.mapId,
        controls: [],
        interactions: defaultInteractions({
          pinchRotate: false, // 移动端禁止地图旋转
          doubleClickZoom: false // 禁止双击放大地图
        })
      });

      // 添加比例尺
      const scaleLineControl = new ScaleLine({
        Units: 'metric' // 单位有5种：degrees imperial us nautical metric
      });
      this.map.addControl(scaleLineControl);

      // 往后添加基础图层
      const baseParam = this.defaultMap.baseLayers[this.baseLayerIndex]; // 这里写死了
      // 这里就是吧baseParm数据进行一个初始化成为一个瓦片图层
      const baseLayer = this.initBaseLayer(baseParam);
      this.baseLayerObj[baseParam.name] = baseLayer;
      this.addLayer(this.map, { layer: baseLayer, position: 1 });
      baseParam.active = true;

      const obj1 = {
        name: 'item_map1',
        type: 'LineString', // Point,LineString,Polygon,Circle
        style: {
          fill: {
            color: '#EA3535'
          },
          stroke: {
            width: 2,
            color: '#EA3535'
          }
          // image: {
          //   src: require('./image/icon-position-blue.png')
          // }
        }
      };

      // this.drawLayerLC(obj1, function(callback) {});
    },

    // 初始化图层信息
    initBaseLayer: function(layObj) {
      return new TileLayer({
        crossOrigin: 'anonymous',
        name: layObj.name || '',
        index: layObj.index || '',
        title: layObj.title || '',
        visible: layObj.visible || true,
        // 定义图层的数据源，可以是XYZ、WMTS、OSM等
        source: new XYZ({
          // url: layObj.url,
          tileUrlFunction: function(tileCoord) {
            // 返回一个字符串，表示瓦片的 URL 地址。
            let url = layObj.url;
            const z = tileCoord[0];
            const x = tileCoord[1];
            const y = tileCoord[2];
            url = url.split('{0}').join(z);
            url = url.split('{1}').join(x);
            url = url.split('{2}').join(y);
            return url;
          },
          wrapX: layObj.wrapX || false, // 是否在水平线上重复
          projection: layObj.projection || 'EPSG:4326',
          crossOrigin: 'anonymous'
        })
      });
    },

    // 控制按钮显示状态
    initDrawBtn() {
      if (this.dataState == 'details') {
        if (this.dratTypeArr.includes('Point')) {
          this.btnSelectIndex = 0;
        }
        if (this.dratTypeArr.includes('LineString')) {
          this.btnSelectIndex = 1;
        }
        if (this.dratTypeArr.includes('Polygon')) {
          this.btnSelectIndex = 2;
        }
      } else {
        if (this.dratTypeArr.includes('Point')) {
          this.drawBtnClick(0);
        }
        if (this.dratTypeArr.includes('LineString')) {
          this.drawBtnClick(1);
        }
        if (this.dratTypeArr.includes('Polygon')) {
          this.drawBtnClick(2);
        }
      }
    },

    // 添加图层方法
    addLayer(map, obj) {
      map = map || this.map;
      const layer = obj.layer;
      const position = obj.position;
      // 有设置位置就插入到指定位置，没有这添加在顶部
      if (obj.position != null) {
        const layersArray = map.getLayers(); // 获取map的所有layer图层
        layersArray.insertAt(position, layer); // 在指定位置插入
      } else {
        map.addLayer(layer);
      }
    },

    // 开始绘制 点0 线1 面2
    drawBtnClick(index) {
      if (this.btnSelectIndex == index) {
        this.btnSelectIndex = -1;
        if (this.draw) {
          this.map.removeInteraction(this.draw);
        }
        return;
      } else {
        this.btnSelectIndex = index;
        if (this.selectDeleteDataInteraction) {
          this.map.removeInteraction(this.selectDeleteDataInteraction);
        }
      }
      let type = 'Point';
      switch (index) {
        case 0:
          type = 'Point';
          break;
        case 1:
          type = 'LineString';
          break;
        case 2:
          type = 'Polygon';
          break;
      }
      const obj = {
        name: 'draw_layers' + new Date().getTime() + Math.random(),
        type: type, // Point,LineString,Polygon,Circle
        modify: false,
        style: {
          fill: {
            color: 'rgb(235, 227, 28, 0.6)'
          },
          stroke: {
            width: 2,
            color: 'rgb(235, 227, 28, 1)'
          }
        }
      };
      if (index == 0) {
        obj.style.image = {
          src: require('../MapLayer/image/icon-position-blue.png')
        };
      }
      this.drawLayerLC(obj, function(callback) {});
    },

    // 删除点
    deletePointClick() {
      const _this = this;
      _this.positioningData = {
        // 坐标采集的经纬度
        longitude: undefined,
        latitude: undefined,
        longitudeEnd: undefined,
        latitudeEnd: undefined
      };
      if (this.btnSelectIndex == 3) {
        this.btnSelectIndex = -1;
        if (this.selectDeleteDataInteraction) {
          this.map.removeInteraction(this.selectDeleteDataInteraction);
        }
        return;
      } else {
        this.btnSelectIndex = 3;
        if (this.draw) {
          this.map.removeInteraction(this.draw);
        }
        if (this.modifyInteraction) {
          this.map.removeInteraction(this.modifyInteraction);
        }
        if (this.selectDataInteraction) {
          this.map.removeInteraction(this.selectDataInteraction);
        }
      }

      const layers = this.map.getLayers().getArray();
      const drawLayers = [];

      layers.forEach((item) => {
        if (item.values_.name.indexOf('draw_layers') > -1) {
          drawLayers.push(item);
        }
      });
      drawLayers.forEach((item) => {
        this.map.removeLayer(item);
      });
      return;

      this.selectDeleteDataInteraction = new Select({
        condition: click,
        style: null,
        layers: layers,
        hitTolerance: 5
      });

      // 监听select事件
      this.selectDeleteDataInteraction.on('select', function(e) {
        /* console.log('select', e) */

        if (e.selected.length > 0) {
          console.log(`output->e`, e);
          const feature = e.selected[0];
          // const vectorSource = feature.get('draw_layers');
          // console.log(`output->vectorSource`, vectorSource);

          const layers = _this.map.getLayers().getArray();
          for (const i in layers) {
            const source = layers[i].getSource();
            if (source instanceof VectorSource) {
              const features = source.getFeatures();
              if (features.length > 0) {
                for (const j in features) {
                  if (features[j] === feature) {
                    source.removeFeature(feature);
                    // _this.map.removeLayer(layers[i]);
                    // return layers[i];
                  }
                }
              }
            }
          }
        } else {
          const res = false;
        }
      });

      this.map.addInteraction(this.selectDeleteDataInteraction);
    },

    drawLayerLC(data, callback) {
      const _this = this;

      const name = data.name;

      const style = data.style;

      if (this.draw) {
        this.map.removeInteraction(this.draw);
      }

      for (const key in this.drawLayerObj) {
        if (key.indexOf('draw_layers') > -1) {
          this.map.removeLayer(this.drawLayerObj[key]);
        }
      }

      if (!this.drawLayerObj[name]) {
        this.drawLayerObj[name] = new VectorLayer({
          source: new VectorSource(),
          name: name
        });

        // this.drawLayerObj[name].setStyle(_this.setCoordStyle(style));
        /* this.map.addLayer(this.drawLayerObj[name]) */

        this.map.addLayer(this.drawLayerObj[name]);
      }

      this.drawLayerObj[name].setStyle(_this.setCoordStyle(style));

      this.draw = new Draw({
        source: _this.drawLayerObj[name].getSource(),
        type: data.type, // LineString,Polygon
        // type: 'Polygon',
        // geometryFunction: data.geometryFunction,
        maxPoints: data.maxPoints || ''
      });

      // this.selectInteractionLayer(data, function(data) {
      //   console.log(`output->data`, data);
      // });

      // 监听绘制结束事件
      this.draw.on('drawend', function(event) {
        const features1 = event.feature;
        const layers = _this.map.getLayers().getArray();
        for (const i in layers) {
          const source = layers[i].getSource();
          if (source instanceof VectorSource) {
            const features = source.getFeatures();
            if (features.length > 0) {
              for (const j in features) {
                if (features[j] != features1) {
                  source.removeFeature(features[j]);
                }
              }
            }
          }
        }

        _this.drawWktData = new WKT().writeGeometry(
          event.feature.getGeometry()
        );

        const geometry = event.feature.getGeometry();
        _this.setPositioningData(geometry);
      });

      this.selectDataInteraction = new Select({
        condition: click,
        style: null,
        layers: [this.drawLayerObj[name]]
      });

      // 监听select事件
      this.selectDataInteraction.on('select', function(e) {
        /* console.log('select', e) */

        if (e.selected.length > 0) {
          const feature = e.selected[0];

          const geometry = feature.getGeometry();
          _this.setPositioningData(geometry);
        } else {
          const res = false;
        }
      });

      this.map.addInteraction(this.selectDataInteraction);

      if (data.modify) {
        // 可移动坐标

        // if (this.modify == null) {
        this.modifyInteraction = new Modify({
          source: this.drawLayerObj[name].getSource()
        });

        this.modifyInteraction.on(
          'modifyend',
          function(e) {
            const features = e.features.getArray();

            if (features.length > 0) {
              const geometry = features[0].getGeometry();
              _this.setPositioningData(geometry);
            }
          },
          _this
        );

        this.map.addInteraction(this.modifyInteraction);
        // }
      }

      this.draw.setActive(true);
      this.map.addInteraction(this.draw);
    },

    addPointLayer(obj) {
      const _this = this;
      let wktType = ''; // wkt的类型
      if (obj.state == 'add') {
        // 新增的不用创建
        this.dataState = 'update';
        this.initDrawBtn();
        return;
      }
      this.dataState = obj.state; // 状态是详情还是需要编辑还是新增
      this.initDrawBtn();
      const wktString = obj.wktString; // wkt字符串
      let feature, source, layer;
      var format = new WKT();
      var geometry = format.readGeometry(wktString);
      wktType = geometry.getType().toLowerCase();

      // 将几何对象转换为坐标数组赋值
      this.setPositioningData(geometry);

      feature = new Feature({
        geometry: geometry
      });

      const style = new OlStyle({
        image: new OlStyleIcon({
          src: require('../MapLayer/image/icon-position-blue.png'),
          scale: 1,
          rotateWithView: true
          // rotation: Math.PI / 2
        }),
        text: new OlStyleText({
          font: 'normal 22px 黑体',
          // // 对其方式
          textAlign: 'center',
          // 基准线
          textBaseline: 'middle',
          offsetY: -60,
          offsetX: 0,
          backgroundFill: new OlStyleStroke({
            color: 'rgba(255,255,255,0.2)'
          }),
          backgroundStroke: new OlStyleStroke({
            color: 'rgba(0,0,255,1)',
            width: 3
          }),
          // 文本填充样式
          fill: new OlStyleFill({
            color: 'rgba(0,0,0,1)'
          }),
          padding: [5, 5, 5, 5]

          // text: "森林消防专队\n防火物资储备库",
        }),
        fill: new OlStyleFill({
          color: 'rgba(255,255,0,0.2)'
        }),
        stroke: new OlStyleStroke({
          width: '2',
          color: 'rgba(255,255,0,1)'
        })
      });

      feature.setStyle(style);
      this.drawWktData = new WKT().writeGeometry(feature.getGeometry());

      source = new VectorSource({
        features: [feature]
      });
      layer = new VectorLayer({
        source,
        name: 'draw_layers' + new Date().getTime() + Math.random()
      });

      // 展示图层只会有一层
      for (const key in this.drawLayerObj) {
        if (key.indexOf('DY') > -1) {
          // this.drawLayerObj[key].setVisible(false);
          this.map.removeLayer(this.drawLayerObj[key]);
        }
      }
      this.drawLayerObj['DY' + new Date().getTime() + Math.random()] = layer;
      this.map.addLayer(layer);

      layer.setZIndex(9999);

      if (this.dataState == 'update') {
        if (this.modifyInteraction) {
          this.map.removeInteraction(this.modifyInteraction);
        }
        this.modifyInteraction = new Modify({
          source: source
        });

        this.modifyInteraction.on(
          'modifyend',
          function(e) {
            const features = e.features.getArray();

            if (features.length > 0) {
              const geometry = features[0].getGeometry();
              _this.drawWktData = new WKT().writeGeometry(geometry);
              _this.setPositioningData(geometry);
              // 缩放到要素的范围并将视角移动到中心点
              var extent = geometry.getExtent();
              _this.map
                .getView()
                .fit(extent, { padding: [100, 100, 100, 100] });
            }
          },
          _this
        );

        this.map.addInteraction(this.modifyInteraction);
      }

      // 缩放到要素的范围并将视角移动到中心点
      var extent = geometry.getExtent();
      this.map.getView().fit(extent, { padding: [100, 100, 100, 100] });
      // this.view.setCenter(extent);
      // this.view.setZoom(10);
    },

    returnAddLayerWkt() {
      return this.drawWktData;
    },

    // 更新地图宽度
    updateSizeFunction() {
      setTimeout(() => {
        this.map.updateSize();
      }, 10);
    },

    // 全屏功能
    fullScreen() {
      this.isFullScreen = true;
      this.terrainSmallSelect = 0;
      let mapBasis = this.$refs['mapBasis'];
      mapBasis.style.width = window.innerWidth + 'px';
      mapBasis.style.height = window.innerHeight + 'px';
      mapBasis.style.zIndex = 1002; // 左侧侧边栏设置了1001
      mapBasis.style.position = 'fixed';
      mapBasis.style.top = '0';
      mapBasis.style.right = '0';
      this.updateSizeFunction();
    },

    // 全屏按钮点击事件
    fullScreenClick() {
      if (this.isFullScreen) {
        // 关闭全屏
        this.isFullScreen = false;
        this.terrainSmallSelect = -1;
        let mapBasis = this.$refs['mapBasis'];
        mapBasis.style.width = '100%';
        mapBasis.style.height = '100%';
        mapBasis.style.zIndex = 0;
        mapBasis.style.position = 'relative';
        this.updateSizeFunction();
        this.$emit('fullScreenClickOff', this.drawWktData);
      } else {
        this.isFullScreen = true;
        this.terrainSmallSelect = 0;
        this.fullScreen();
      }
    },
    // 地图放大
    zoomIn() {
      this.terrainSmallSelect = 2;
      let zoom = this.view.getZoom();
      this.view.setZoom(zoom + 1);
    },

    // 地图缩小
    zoomOut() {
      this.terrainSmallSelect = 1;
      let zoom = this.view.getZoom();
      this.view.setZoom(zoom - 1);
    },

    // 地形模式切换框是否显示按钮点击事件
    isShowTerrainBigBoxClick() {
      this.terrainSmallSelect = this.terrainSmallSelect == 3 ? -1 : 3;
    },

    // 切换图层基础
    changeBaseLayers(index) {
      // 切换地图图层选择样式
      this.baseLayerIndex = index;

      let baseParam = this.defaultMap.baseLayers[index];

      this.defaultMap.baseLayers.forEach((v) => {
        if (v.name === baseParam.name) {
          v.active = true;
        } else {
          v.active = false;
        }
      });

      for (let key in this.baseLayerObj) {
        if (key !== baseParam.name) {
          this.baseLayerObj[key].setVisible(false);
        }
      }

      if (this.baseLayerObj[baseParam.name]) {
        this.baseLayerObj[baseParam.name].setVisible(baseParam.active);
      } else {
        const baseLayer = this.initBaseLayer(baseParam);
        this.baseLayerObj[baseParam.name] = baseLayer;
        this.addLayer(this.map, { layer: baseLayer, position: 1 });
      }

      this.addNoteLayer();

      // this.imageLayerInfo = baseParam;
    },

    showNoteLayerChange() {
      this.addNoteLayer(this.map);
    },
    // 添加注记图层
    addNoteLayer(map = this.map) {
      // 开启注记图层
      if (!this.showNoteLayer) {
        // 注记图层参数
        const baseParam = this.defaultMap.baseLayers[this.baseLayerIndex];
        if (this.baseLayerObj[baseParam.noteName]) {
          this.baseLayerObj[baseParam.noteName].setVisible(false);
        }
        return;
      }

      // 获取地图所有图层
      const layers = map.getLayers();

      // 注记图层参数
      const baseParam = this.defaultMap.baseLayers[this.baseLayerIndex];

      let noteLayer = {};

      if (this.baseLayerObj[baseParam.noteName]) {
        // 根据名称获取图层信息
        noteLayer = this.baseLayerObj[baseParam.noteName];
        noteLayer.setVisible(true);

        // 获取地图所有图层数组
        const layersArray = layers.getArray();

        layersArray.forEach((v, k) => {
          // 获取注记图层的键值，并移除
          if (v.get('name') == baseParam.noteName) {
            layers.removeAt(k);
          }
        });
      } else {
        let noteParam = {
          index: 0,
          url: baseParam.noteUrl,
          name: baseParam.noteName,
          title: '天地图注记',
          type: 1,
          active: true
        };

        noteLayer = this.initBaseLayer(noteParam);

        this.baseLayerObj[baseParam.noteName] = noteLayer;
      }

      // 在所有图层最后重新插入注记图层
      layers.insertAt(layers.values_.length + 1, noteLayer);
    },

    // 设置坐标样式
    setCoordStyle(olStyleObj) {
      const style = {};
      const styleArr = [];
      if (olStyleObj) {
        const styleObj = lodash.cloneDeep(olStyleObj);
        if (styleObj.text) {
          // 设置文本样式
          let OlStyle = {}; // style.text={};
          OlStyle = styleObj.text; // 文本样式

          if (styleObj.text.fill) {
            OlStyle.fill = new OlStyleFill(styleObj.text.fill); // 文本填充
          }
          if (styleObj.text.stroke) {
            OlStyle.stroke = new OlStyleStroke(styleObj.text.stroke); // 线宽
          }
          // let textOlStyle = new OlStyleText(OlStyle); //设置文本样式
          style.text = new OlStyleText(OlStyle); // textOlStyle;
          // let textStyle=new OlStyle({text:textOlStyle});
          // styleArr.push(textStyle);
        }
        if (styleObj.fill) {
          style.fill = new OlStyleFill(styleObj.fill);
          // styleArr.push(new OlStyle({fill:new OlStyleFill(styleObj.fill)}));
          // styleArr.push(new OlStyleFill(styleObj.fill));
        } else {
          style.fill = new OlStyleFill(this.defaultMap.defaultStyle.fill);
        }
        if (styleObj.stroke) {
          // styleArr.push(new OlStyle({stroke:new OlStyleStroke(styleObj.stroke)}));
          // styleArr.push(new OlStyleStroke(styleObj.stroke));
          style.stroke = new OlStyleStroke(styleObj.stroke);
        } else {
          style.stroke = new OlStyleStroke(this.defaultMap.defaultStyle.stroke);
        }
        styleArr.push(new OlStyle(style));
        if (styleObj.image) {
          const iconStyle = {};
          iconStyle.image = new OlStyleIcon(styleObj.image);
          iconStyle.geometry = function(feature) {
            const type = feature.getGeometry().getType().toLocaleLowerCase();
            const coordinates = feature.getGeometry().getCoordinates();
            if (type == 'point') {
              return feature.getGeometry(); // 返回自身
            } else if (type == 'multipoint') {
              return feature.getGeometry(); // 返回自身
            } else if (type == 'linestring') {
              const arr = [];
              arr.push(coordinates[0]);
              arr.push(coordinates[coordinates.length - 1]);
              return new MultiPoint(arr); // 返回线的头尾点
            } else if (type == 'multilinestring') {
              const arr = [];
              for (let i = 0; i < coordinates.length; i++) {
                arr.push(coordinates[i][0]);
                arr.push(coordinates[i][coordinates[i].length - 1]);
              }
              return new MultiPoint(arr); // 返回每条线的头尾点
            } else if (type == 'polygon') {
              // debugger
              return new Point(coordinates[0][0]); // 返回第一点
            } else if (type == 'multipolygon') {
              const arr = [];
              for (let i = 0; i < coordinates.length; i++) {
                arr.push(coordinates[i][0][0]);
              }
              return new MultiPoint(arr); // 返回多个面的第一点
            }
          };
          styleArr.push(new OlStyle(iconStyle));
        }
        if (styleObj.circle) {
          let circleStyle = {}; // style.text={};
          circleStyle = styleObj.circle; // 文本样式
          if (styleObj.circle.fill) {
            circleStyle.fill = new OlStyleFill(styleObj.circle.fill); // 文本填充
          } /*  else {
            circleStyle.fill = new OlStyleFill(
              this.defaultMap.defaultStyle.circle.fill
            ); //文本填充
          } */
          if (styleObj.circle.stroke) {
            circleStyle.stroke = new OlStyleStroke(styleObj.circle.stroke); // 线宽
          } /*  else {
            circleStyle.stroke = new OlStyleStroke(
              this.defaultMap.defaultStyle.circle.stroke
            ); //线宽
          } */

          if (styleObj.circle.image) {
            circleStyle.image = new OlStyleIcon(styleObj.circle.image); // 线宽
            styleArr.push(new OlStyle(circleStyle));
          } else {
            styleArr.push(
              new OlStyle({ image: new OlStyleCircle(circleStyle) })
            );
          }

          // style.image=new OlStyleCircle(circleStyle)//设置文本样式
        }
      }
      return styleArr;
    },

    // 处理经纬度精度
    handleCoordinateLength(data) {
      if (data) {
        return data.toFixed(8);
      }
    },

    // 对经纬度赋值
    setPositioningData(geometry) {
      if (!geometry) {
        return;
      }
      if (this.dratTypeArr.includes('Point')) {
        const coordinates = geometry.getCoordinates();
        this.positioningData.longitude = coordinates[0] ? coordinates[0] : '';
        this.positioningData.latitude = coordinates[1] ? coordinates[1] : '';
      } else {
        // 获取面的四至
        let extent = geometry.getExtent();
        this.positioningData.longitude = extent[0] ? extent[0] : '';
        this.positioningData.latitude = extent[1] ? extent[1] : '';
        this.positioningData.longitudeEnd = extent[2] ? extent[2] : '';
        this.positioningData.latitudeEnd = extent[3] ? extent[3] : '';
      }
    }
  }
};
</script>

<style lang="scss" scoped>
$app-list-primary-color: #0052d9;
.map-basis {
  position: relative;
  background-color: #fff;
  .coordinate-collection {
    position: absolute;
    top: 16px;
    right: 16px;
    width: 268px;
    // height: 196px;
    border-radius: 8px;
    background-color: #fff;
    padding: 12px 16px 2px 16px;
    .title {
      font-size: 16px;
      color: rgba(0, 0, 0, 0.9);
      font-weight: 600;
    }
    .btn-box {
      display: flex;
      margin-top: 12px;
      .btn-item {
        width: 32px;
        height: 32px;
        background-color: rgba(231, 231, 231, 1);
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 12px;
        border-radius: 3px;
        cursor: pointer;
      }
      .btn-item-click {
        background-color: $app-list-primary-color;
        color: #fff;
      }
    }
    .coordinate-form {
      margin-top: 12px;
      ::v-deep .el-form-item {
        margin-bottom: 5px;
      }
    }
  }
  .terrain-box {
    position: absolute;
    bottom: 16px;
    right: 16px;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    .box-big {
      width: 318px;
      height: 132px;
      border-radius: 6px;
      padding: 12px 16px;
      background-color: #fff;
      .title-box {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .title {
          color: rgba(0, 0, 0, 0.9);
          font-weight: 600;
          font-size: 16px;
        }
      }
      .content-box {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .content-item {
          width: 66px;
          height: 66px;
          margin-top: 12px;
          border-radius: 6px;
          overflow: hidden;
          position: relative;
          border: 2px solid #fff;
          cursor: pointer;
          .img {
            width: 100%;
            height: 100%;
            border-radius: 6px;
          }
          .name {
            position: absolute;
            left: 0;
            bottom: 0;
            font-size: 12px;
            height: 25px;
            width: 100%;
            color: #fff;
            font-weight: 400;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: rgb(0, 0, 0, 0.2);
          }
        }
        .content-item-on {
          border: 2px solid $app-list-primary-color;
        }
      }
    }
    .box-small {
      width: 148px;
      height: 40px;
      border-radius: 4px;
      padding: 4px;
      background-color: #fff;
      margin-top: 4px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .icon-box {
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        .img {
          width: 16px;
          height: 16px;
        }
        .img1 {
          width: 16px;
          height: 4px;
        }
        .img3 {
          width: 36px;
          height: 36px;
        }
      }
    }
  }
}
</style>
