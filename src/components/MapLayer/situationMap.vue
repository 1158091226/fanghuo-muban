<!--  -->
<template>
  <div class="SituationMap">
    <div class="situationMap-conten">
      <h3 @click="downImgClick">基本工具</h3>
      <h4>元素</h4>
      <h4 @click="getDrawDataClick">获取数据</h4>
      <div style="display: flex">
        <span>删除功能：</span>
        <el-switch
          v-model="isDeleteDraw"
          :disabled="isUpdateDraw || isDrag"
          @change="drawDeleteClick"
        />
        <span class="ml-10">修改功能：</span>
        <el-switch
          v-model="isUpdateDraw"
          :disabled="isDeleteDraw || isDrag"
          @change="drawUpdateClick"
        />
        <span class="ml-10">拖拽功能：</span>
        <el-switch
          v-model="isDrag"
          :disabled="isDeleteDraw || isUpdateDraw"
          @change="dragClick"
        />
      </div>
      <div class="img-box">
        <div
          v-for="(item, index) in imgList"
          :key="index"
          class="img-item"
          :style="{
            backgroundColor: selectTypeId == item.id ? 'red' : 'yellow',
          }"
          @click="drawTypeClick(item.id)"
        >
          {{ item.name }}
        </div>
      </div>
      <h4>样式</h4>
      <div class="style-box">
        <div class="style-left">
          <div class="style-item">
            <span>填充</span>
            <el-color-picker
              v-model="fillColor"
              class="ml-10"
              @change="fillColorChange"
            />
            <!-- :disabled="selectTypeId > 0" -->
          </div>
          <div class="style-item">
            <span>描边</span>
            <el-color-picker
              v-model="strokeColor"
              class="ml-10"
              :disabled="selectTypeId > 0"
            />
          </div>
        </div>
        <div class="style-left">
          <div class="style-item">
            <span>字号</span>
            <el-input-number
              v-model="sizeNum"
              :controls="false"
              :min="1"
              :max="99"
              class="input"
              :disabled="selectTypeId > 0"
            />
          </div>
          <div class="style-item">
            <span>像素</span>
            <el-input-number
              v-model="pxNum"
              :controls="false"
              :min="1"
              :max="99"
              class="input"
              :disabled="selectTypeId > 0"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="situation-map">
      <div id="pdfDom" style="height: 100%">
        <div id="situation" ref="situation" style="height: 100%" />
      </div>
      <div class="close" @click="situationClose">
        <i class="el-icon-close" />
      </div>
    </div>

    <el-dialog title="提示" :visible.sync="dialogVisible" width="25%">
      <el-form
        ref="textform"
        :model="textFrom"
        :rules="textRules"
        style="width: 100%"
      >
        <el-form-item
          prop="text"
          label="文字内容"
          style="display: flex; width: 100%; justify-content: center"
        >
          <el-input
            v-model.trim="textFrom.text"
            placeholder="请输入"
            style="width: 300px"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="textConfirmClick">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Map from 'ol/Map';
import View from 'ol/View';
import lodash from 'lodash';
import { get as getProjection } from 'ol/proj';
import { defaults as defaultInteractions } from 'ol/interaction';
import ScaleLine from 'ol/control/ScaleLine';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Draw from 'ol/interaction/Draw';
import { createBox } from 'ol/interaction/Draw.js';
import Modify from 'ol/interaction/Modify';
import Translate from 'ol/interaction/Translate';
import Overlay from 'ol/Overlay';
import Select from 'ol/interaction/Select';
import { click } from 'ol/events/condition';
import Feature from 'ol/Feature';

import { unByKey } from 'ol/Observable';

import * as olCoordinate from 'ol/coordinate';
import WKT from 'ol/format/WKT';

import olStyle from 'ol/style/Style';
import olStyleIcon from 'ol/style/Icon';
import olStyleText from 'ol/style/Text';
import olStyleCircle from 'ol/style/Circle';
import olStyleFill from 'ol/style/Fill';
import olStyleStroke from 'ol/style/Stroke';

import MultiPoint from 'ol/geom/MultiPoint';
import Point from 'ol/geom/Point';
import Polygon from 'ol/geom/Polygon';
import Circle from 'ol/geom/Circle';
import situationDraw from './situationDraw/situationDraw.vue';
export default {
  mixins: [situationDraw],
  data() {
    const view = null;
    const map = null;
    const draw = null;
    const measureTooltipElement = null;
    const measureTooltip = null;
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
    return {
      defaultMap,
      view,
      map,
      draw,
      measureTooltipElement,
      measureTooltip,
      strokeColor: '#EA3535', // 描边颜色
      fillColor: '#EA3535', // 填充颜色
      sizeNum: 30, // 字号
      pxNum: 5, // 描边宽度
      selectTypeId: 0,
      imgList: [
        { id: 1, name: '文字' },
        { id: 2, name: '折线' },
        { id: 3, name: '圆' },
        // { id: 4, name: '椭圆' },
        { id: 5, name: '矩形' },
        { id: 6, name: '多边形' },
        { id: 7, name: '直箭头' },
        { id: 8, name: '进攻箭头' },
        // { id: 9, name: '自由线' },
        { id: 10, name: '分队箭头' },
        { id: 11, name: '钳击箭头' }
      ],
      drawLayerObj: {}, // 工具绘制图层信息存放obj，相当于和mapTypeList一样也是存放图层的
      dialogVisible: false,
      textFrom: {
        text: ''
      },
      textRules: {
        text: [{ required: true, message: '请输入内容', trigger: 'blur' }]
      },
      modify: null, // 存放拖动的功能
      isDeleteDraw: false,
      isUpdateDraw: false,
      isDrag: false,
      translateInteraction: null,
      selectInteraction: null, // 选择后的各种交互
      selectDataInteraction: null, // 选择返回图层数据
      modifyInteraction: null
      // isOpenDFM: true, // 是否显示度分秒
      // fractionDigits: 2 // 保留位数,
    };
  },

  // components: {},

  // watch: {},

  // computed: {},

  created() {},

  mounted() {
    this.$nextTick(() => {
      this.initMap();
    });
  },

  methods: {
    situationClose() {
      this.$emit('situationClose');
    },

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
        target: 'situation',
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
      const baseParam = this.defaultMap.baseLayers[1]; // 这里写死了
      // 这里就是吧baseParm数据进行一个初始化成为一个瓦片图层
      const baseLayer = this.initBaseLayer(baseParam);
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

    // 绘制类型点击事件
    drawTypeClick(id) {
      if (this.isDeleteDraw) {
        this.$message.warning('请先关闭删除模式');
        return;
      }
      if (this.isUpdateDraw) {
        this.$message.warning('请先关闭修改模式');
        return;
      }
      if (this.isDrag) {
        this.$message.warning('请先关闭拖拽功能');
        return;
      }
      this.selectTypeId = id;
      const obj = {
        name: 'draw_layers' + new Date().getTime() + Math.random(),
        type: 'LineString', // Point,LineString,Polygon,Circle
        modify: true,
        geometryFunction: '',
        freehand: false, // 控制自由绘制的，只有线段和多边形可以用
        style: {
          fill: {
            color: this.fillColor
          },
          stroke: {
            width: this.pxNum,
            color: this.strokeColor
          }
        }
      };
      switch (id) {
        // 点位文字
        case 1:
          this.textFrom.text = '';
          this.dialogVisible = true;
          break;
        // 折线
        case 2:
          obj.type = 'LineString';
          this.drawLayerLC(obj, function(callback) {});
          break;
        // 圆形
        case 3:
          obj.type = 'Circle';
          this.drawLayerLC(obj, function(callback) {});
          break;
        // 椭圆
        case 4:
          obj.type = 'Polygon';
          obj.geometryFunction = this.geometryFunction('TY');
          this.drawLayerLC(obj, function(callback) {});
          break;
        // 矩形
        case 5:
          obj.type = 'Circle';
          obj.geometryFunction = createBox();
          this.drawLayerLC(obj, function(callback) {});
          break;
        // 多边形
        case 6:
          obj.type = 'Polygon';
          this.drawLayerLC(obj, function(callback) {});
          break;
        // 直箭头
        case 7:
          // obj.type = 'LineString';
          obj.maxPoints = 2;
          obj.type = 'LineString';
          obj.geometryFunction = this.geometryFunction('ZXJT');
          this.drawLayerLC(obj, function(callback) {});
          break;
        // 进攻箭头
        case 8:
          obj.type = 'Polygon';
          obj.geometryFunction = this.geometryFunction('JGJT');
          this.drawLayerLC(obj, function(callback) {});
          break;
        // 自由线
        case 9:
          obj.type = 'LineString';
          obj.freehand = true;
          this.drawLayerLC(obj, function(callback) {});
          break;
        // 分队箭头
        case 10:
          obj.type = 'Polygon';
          obj.geometryFunction = this.geometryFunction('FDJT');
          this.drawLayerLC(obj, function(callback) {});
          break;
        // 钳击箭头
        case 11:
          obj.type = 'Polygon';
          obj.geometryFunction = this.geometryFunction('QJJT');
          this.drawLayerLC(obj, function(callback) {});
          break;

        default:
          break;
      }
    },

    drawLayerLC(data, callback) {
      const _this = this;

      const name = data.name;

      const style = data.style || this.defaultMap.defaultStyle;

      if (this.draw) {
        this.map.removeInteraction(this.draw);
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
        type: data.type,
        // type: 'Polygon',
        geometryFunction: data.geometryFunction,
        maxPoints: data.maxPoints || '',
        freehand: data.freehand
      });

      // this.selectInteractionLayer(data, function(data) {
      //   console.log(`output->data`, data);
      // });

      // 监听绘制结束事件
      this.draw.on('drawend', function(event) {
        const yuan = new WKT().writeGeometry(event.feature.getGeometry());
        console.log(`output->yuan`, yuan);

        // 直线箭头
        if (_this.selectTypeId === 7) {
          // _this.drawZXJT(event, _this.drawLayerObj[name], data.style);
        } else {
          const feature = event.feature;
          // 在绘制结束后执行你的操作
          // 例如获取绘制的要素信息、保存要素等
          // console.log('绘制结束:', feature);
          if (_this.draw) {
            // 将绘制交互对象设置为非激活状态
            // _this.draw.setActive(false);
          }
          // _this.selectTypeId = 0;
        }
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
          console.log(`output->e11111111111111`, e);
          const feature = e.selected[0];
          const layers = _this.map.getLayers().getArray();
          for (const i in layers) {
            const source = layers[i].getSource();
            if (source instanceof VectorSource) {
              const features = source.getFeatures();
              if (features.length > 0) {
                for (const j in features) {
                  if (features[j] === feature) {
                    // source.removeFeature(feature);
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

      this.map.addInteraction(this.selectDataInteraction);

      if (!data.modify) {
        // 可移动坐标

        // if (this.modify == null) {
        const modify = new Modify({
          source: this.drawLayerObj[name].getSource()
        });

        this.map.addInteraction(modify);
        // }

        modify.on(
          'modifyend',
          function(e) {
            const features = e.features.getArray();

            if (features.length > 0) {
              if (callback && typeof callback == 'function') {
                const returnData = _this.getAllTypeValue(
                  features,
                  data.isOpenDFM,
                  data.fractionDigits
                );
                /* this.drawLayerObj[name].globalCoordinate = returnData; */
                /* console.log(returnData) */
                callback.call(_this.drawLayerObj[name], returnData, features);

                /* const geometry = e.features.getGeometry()
                let pointArr = geometry.getCoordinates()
                callback.call(this.drawLayerObj[name], pointArr); */
              }
            }
          },
          this
        );
      }

      this.draw.setActive(true);
      this.map.addInteraction(this.draw);
    },

    // 填充色改变事件
    fillColorChange() {
      // this.map.removeInteraction(this.draw);
      // this.draw = null;
      // this.drawTypeClick(this.selectTypeId);
    },

    // 获取所有的绘制图层信息
    getDrawDataClick() {
      //  console.log(`output->yuan`, event.feature.getGeometry());
      //   console.log(`output->yuan`, event.feature.getGeometry().getCenter());
      //   console.log(`output->yuan`, event.feature.getGeometry().getRadius());
      //   // 假设您有一个名为"circleFeature"的圆形要素对象
      //   let circleGeometry = event.feature.getGeometry(); // 获取圆形要素的几何属性
      //   let center = circleGeometry.getCenter(); // 获取圆心坐标
      //   let radius = circleGeometry.getRadius(); // 获取圆形半径
      //   // 创建一个WKT格式的字符串
      //   let wktData =
      //     'CIRCLE((' + center[0] + ' ' + center[1] + '), ' + radius + ')';
      const circleFeature = new Feature({
        geometry: new Circle(
          [111.06903076171875, 27.047653198242188],
          1.1548716087320372
        )
      });
      // 创建一个矢量图层，并将要素对象添加到其中
      const vectorLayer = new VectorLayer({
        source: new VectorSource({
          features: [circleFeature]
        })
      });

      // 将矢量图层添加到地图中
      this.map.addLayer(vectorLayer);
      console.log(`output->3`, 3);
      // const layers = this.map.getLayers().getArray();
      // const drawLayers = [];

      // layers.forEach((item) => {
      //   if (item.values_.name.indexOf('draw_layers') > -1) {
      //     drawLayers.push(item);
      //   }
      // });

      // for (const i in drawLayers) {
      //   const source = drawLayers[i].getSource();
      //   if (source instanceof VectorSource) {
      //     const features = source.getFeatures();
      //     if (features.length > 0) {
      //       for (const j in features) {
      //         console.log(`output->features[j]`, features[j]);
      //         const wktdata = new WKT().writeFeature(features[j]);
      //         console.log(`output->wktdata`, wktdata);
      //       }
      //     }
      //   }
      // }
    },

    // 删除功能开启
    drawDeleteClick() {
      if (!this.isDeleteDraw) {
        this.map.removeInteraction(this.selectInteraction);
        this.selectInteraction = null;
      } else {
        this.map.removeInteraction(this.draw);
        this.draw = null;
        const _this = this;
        this.selectTypeId = 0;
        const layers = this.map.getLayers().getArray();
        const drawLayers = [];

        layers.forEach((item) => {
          if (item.values_.name.indexOf('draw_layers') > -1) {
            drawLayers.push(item);
          }
        });
        this.map.removeInteraction(this.selectInteraction);

        this.selectInteraction = new Select({
          condition: click,
          style: null,
          layers: layers
        });

        // 监听select事件
        this.selectInteraction.on('select', function(e) {
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

        // 添加单选工具
        this.map.addInteraction(this.selectInteraction);
      }
    },

    // 修改功能
    drawUpdateClick() {
      if (!this.isUpdateDraw) {
        this.map.removeInteraction(this.selectInteraction);
        this.selectInteraction = null;
        this.map.removeInteraction(this.modifyInteraction);
        this.modifyInteraction = null;
      } else {
        this.selectTypeId = -1;
        this.map.removeInteraction(this.draw);
        this.draw = null;
        const _this = this;
        const layers = this.map.getLayers().getArray();
        const drawLayers = [];

        layers.forEach((item) => {
          if (item.values_.name.indexOf('draw_layers') > -1) {
            drawLayers.push(item);
          }
        });
        this.map.removeInteraction(this.selectInteraction);

        this.selectInteraction = new Select({
          condition: click,
          style: null,
          layers: layers
        });

        // 监听select事件
        this.selectInteraction.on('select', function(e) {
          /* console.log('select', e) */

          if (e.selected.length > 0) {
            const feature = e.selected[0];

            if (feature.getGeometry().getType() === 'Point') {
              // 弹出对话框
              const style = {
                fill: {
                  color: '#EA3535'
                },
                stroke: {
                  width: 2,
                  color: '#EA3535'
                },
                image: {
                  src: require('./image/icon-position-blue.png')
                },
                text: {
                  font: `normal ${_this.sizeNum}px 黑体`,
                  // // 对其方式
                  textAlign: 'center',
                  // 基准线
                  textBaseline: 'middle',
                  offsetY: -60,
                  offsetX: 0,
                  backgroundFill: new olStyleStroke({
                    color: 'rgba(255,255,255,0.4)'
                  }),
                  backgroundStroke: new olStyleStroke({
                    color: _this.strokeColor,
                    width: _this.pxNum
                  }),
                  // 文本填充样式
                  fill: {
                    color: _this.fillColor
                  },
                  padding: [5, 5, 5, 5],

                  text: _this.textFrom.text
                }
              };
              feature.setStyle(_this.setCoordStyle(style));
            } else {
              // (feature.getGeometry().getType() === 'Polygon')
              // 修改样式
              const style = {
                fill: {
                  color: _this.fillColor
                },
                stroke: {
                  width: _this.pxNum,
                  color: _this.strokeColor
                }
              };
              feature.setStyle(_this.setCoordStyle(style));
              const selectfeature = _this.selectInteraction.getFeatures();
              selectfeature.clear();

              // 这里是添加点位拖拽修改功能
              // const layers = _this.map.getLayers().getArray();
              for (const i in layers) {
                const source = layers[i].getSource();
                if (source instanceof VectorSource) {
                  const features = source.getFeatures();
                  if (features.length > 0) {
                    for (const j in features) {
                      if (features[j] === feature) {
                        // source.removeFeature(feature);
                        _this.map.removeInteraction(_this.modifyInteraction);
                        _this.modifyInteraction = null;

                        const newsource = new VectorSource({
                          features: [feature]
                        });

                        _this.modifyInteraction = new Modify({
                          source: newsource
                        });

                        _this.modifyInteraction.on(
                          'modifyend',
                          function(e) {
                            const features = e.features.getArray();

                            if (features.length > 0) {
                              // if (callback && typeof callback == 'function') {
                              _this.getAllTypeValue(
                                features,
                                undefined,
                                undefined
                              );
                              // }
                            }
                          },
                          _this
                        );

                        _this.map.addInteraction(_this.modifyInteraction);
                        // _this.map.removeLayer(layers[i]);
                        // return layers[i];
                      }
                    }
                  }
                }
              }

              // }
            }
          } else {
            const res = false;
          }
        });

        // 添加单选工具
        this.map.addInteraction(this.selectInteraction);
      }
    },

    // 拖拽功能
    dragClick() {
      if (!this.isDrag) {
        this.map.removeInteraction(this.translateInteraction);
        this.translateInteraction = null;
      } else {
        this.map.removeInteraction(this.draw);
        this.draw = null;
        const _this = this;
        this.selectTypeId = 0;
        const layers = this.map.getLayers().getArray();
        const drawLayers = [];

        layers.forEach((item) => {
          if (item.values_.name.indexOf('draw_layers') > -1) {
            drawLayers.push(item);
          }
        });

        this.translateInteraction = new Translate({
          layers: drawLayers
        });
        this.map.addInteraction(this.translateInteraction);
      }
    },

    // 边界修改功能
    getAllTypeValue: function(features, isOpenDFM, fractionDigits, feature) {
      isOpenDFM = isOpenDFM || this.isOpenDFM;
      fractionDigits = fractionDigits || this.fractionDigits;
      let value = features[0].getGeometry().clone().getExtent() || [];
      for (let i = 1; i < features.length; i++) {
        value = extend(value, features[i].getGeometry().getExtent());
      }

      const type = features[0].getGeometry().clone().getType();

      if (type.toLocaleLowerCase() == 'point') {
        value[2] = '';
        value[3] = '';
      }
      if (type.toLocaleLowerCase() == 'circle') {
        return {};
      }
      value = this.judgeIsToDFM(value, isOpenDFM, fractionDigits);
      const result = {};
      result.x = value[0];
      result.y = value[1];
      result.x2 = value[2] || '';
      result.y2 = value[3] || '';
      result.type = type;
      result.wktValue = this.getWKTValueByFeatures(features);
      result.firstPoint = this.getFirstPoint(features[0]);
      if (feature) {
        result.coordinate = this.getWKTByFeature(feature);
        result.coords = feature.getGeometry().getCoordinates();
      }
      return result;
    },

    toStringHDMS: function(x, y, fractionDigits) {
      const result = ['', ''];
      if (x && x != '' && y && y != '') {
        let str;
        if (fractionDigits) {
          str = new olCoordinate.toStringHDMS([x, y], fractionDigits); // 返回例如："25° 53′ 11.07″ N 114° 57′ 09.72″ E"
        } else {
          str = new olCoordinate.toStringHDMS([x, y]);
        }
        str = str
          .replace(/ /g, '')
          .replace('N', '|')
          .replace('S', '|')
          .replace('E', '|')
          .replace('W', '|')
          .split('|');
        result[0] = str[1];
        result[1] = str[0];
      }
      return result;
    },
    toStringXY: function(x, y, fractionDigits) {
      const result = ['', ''];
      if (x && x != '' && y && y != '') {
        let str;
        if (fractionDigits) {
          str = new toStringXY([x, y], fractionDigits); // 返回例如："114.986, 25.817"
        } else {
          str = x + ',' + y;
        }
        str = str.replace(/ /g, '').split(',');
        result[0] = str[1];
        result[1] = str[0];
      }
      return result;
    },

    // 将四至换算
    judgeIsToDFM: function(extent, isOpenDFM, fractionDigits) {
      fractionDigits = fractionDigits || this.fractionDigits;
      isOpenDFM = isOpenDFM || this.isOpenDFM;
      if (isOpenDFM) {
        const result = this.toStringHDMS(extent[0], extent[1], fractionDigits);
        const result2 = this.toStringHDMS(extent[2], extent[3], fractionDigits);
        return [result[0], result[1], result2[0], result2[1]];
      } else {
        const result = this.toStringXY(extent[0], extent[1], fractionDigits);
        const result2 = this.toStringXY(extent[2], extent[3], fractionDigits);
        return [result[0], result[1], result2[0], result2[1]];
      }
    },

    // 根据元素取坐标类型
    getTypeByFeature: function(feature) {
      return feature.getGeometry().getType();
    },

    // 根据元素取wkt
    getWKTByFeature: function(feature) {
      return new WKT().writeGeometry(feature.getGeometry());
    },

    // 根据多个要素取wkt坐标值（拼接的形式，对于相交的面拼成多面是否会造成无效坐标待考证）
    getWKTValueByFeatures: function(features) {
      if (features == null || features.length == 0) {
        return '';
      }
      if (features.length == 1) {
        return this.getWKTByFeature(features[0]);
      } else {
        const type = this.getTypeByFeature(features[0]);

        const arr = [];
        for (let i = 0; i < features.length; i++) {
          const data = this.getWKTByFeature(features[i]);
          if (data.toUpperCase().indexOf(type.toUpperCase()) < 0) {
            return '';
          }
          switch (type.toLocaleLowerCase()) {
            case 'point':
              arr.push(
                data.substring(data.indexOf('(') + 1, data.indexOf(')'))
              );
              if (i == features.length - 1) {
                return 'MULTIPOINT(' + arr.join(',') + ')';
              }
              break;
            case 'linestring':
              arr.push(data.substring(data.indexOf('(')));
              if (i == features.length - 1) {
                return 'MULTILINESTRING(' + arr.join(',') + ')';
              }
              break;
            case 'polygon':
              arr.push(data.substring(data.indexOf('(')));
              if (i == features.length - 1) {
                return 'MULTIPOLYGON(' + arr.join(',') + ')';
              }
              break;
            default:
          }
        }
      }
    },

    // 取第一点坐标
    getFirstPoint: function(feature) {
      if (!feature) {
        return null;
      }
      const type = feature.getGeometry().getType();
      let firstCoordinates =
        type.toLocaleLowerCase() == 'geometrycollection'
          ? feature.getGeometry()
          : feature.getGeometry().getCoordinates();
      if (type.toLocaleLowerCase() == 'point') {
        firstCoordinates = firstCoordinates;
      } else if (type.toLocaleLowerCase() == 'geometrycollection') {
        const point = [];
        for (let i = 0; i < firstCoordinates.length; i++) {
          point.push(firstCoordinates[i].getCoordinates());
        }
        firstCoordinates = point[0];
      } else if (type.toLocaleLowerCase() == 'linestring') {
        firstCoordinates = firstCoordinates[0];
      } else if (type.toLocaleLowerCase() == 'polygon') {
        firstCoordinates = firstCoordinates[0][0];
      }
      return 'POINT(' + firstCoordinates[0] + ' ' + firstCoordinates[1] + ')';
    },

    // 文字弹窗的确认按钮
    textConfirmClick() {
      this.$refs.textform.validate((valid) => {
        if (valid) {
          this.dialogVisible = false;
          const obj = {
            name: 'draw_layers' + new Date().getTime() + Math.random(),
            type: 'Point', // Point,LineString,Polygon,Circle
            style: {
              fill: {
                color: '#EA3535'
              },
              stroke: {
                width: 2,
                color: '#EA3535'
              },
              image: {
                src: require('./image/icon-position-blue.png')
              },
              text: {
                font: `normal ${this.sizeNum}px 黑体`,
                // // 对其方式
                textAlign: 'center',
                // 基准线
                textBaseline: 'middle',
                offsetY: -60,
                offsetX: 0,
                backgroundFill: new olStyleStroke({
                  color: 'rgba(255,255,255,0.4)'
                  // color: this.set16ToRgb(this.fillColor)
                }),
                backgroundStroke: new olStyleStroke({
                  color: this.strokeColor,
                  width: this.pxNum
                }),
                // 文本填充样式
                fill: {
                  color: this.fillColor
                },
                padding: [5, 5, 5, 5],

                text: this.textFrom.text
              }
            }
          };
          this.drawLayerLC(obj, function(callback) {});
        }
      });
    },

    // 导出图片
    downImgClick() {
      this.getPdf(false, (res) => {});
    },

    // 设置坐标样式
    setCoordStyle: function(olStyleObj) {
      const style = {};
      const styleArr = [];
      if (olStyleObj) {
        const styleObj = lodash.cloneDeep(olStyleObj);
        if (styleObj.text) {
          // 设置文本样式
          let olStyle = {}; // style.text={};
          olStyle = styleObj.text; // 文本样式

          if (styleObj.text.fill) {
            olStyle.fill = new olStyleFill(styleObj.text.fill); // 文本填充
          }
          if (styleObj.text.stroke) {
            olStyle.stroke = new olStyleStroke(styleObj.text.stroke); // 线宽
          }
          // let textOlStyle = new olStyleText(olStyle); //设置文本样式
          style.text = new olStyleText(olStyle); // textOlStyle;
          // let textStyle=new olStyle({text:textOlStyle});
          // styleArr.push(textStyle);
        }
        if (styleObj.fill) {
          style.fill = new olStyleFill(styleObj.fill);
          // styleArr.push(new olStyle({fill:new olStyleFill(styleObj.fill)}));
          // styleArr.push(new olStyleFill(styleObj.fill));
        } else {
          style.fill = new olStyleFill(this.defaultMap.defaultStyle.fill);
        }
        if (styleObj.stroke) {
          // styleArr.push(new olStyle({stroke:new olStyleStroke(styleObj.stroke)}));
          // styleArr.push(new olStyleStroke(styleObj.stroke));
          style.stroke = new olStyleStroke(styleObj.stroke);
        } else {
          style.stroke = new olStyleStroke(this.defaultMap.defaultStyle.stroke);
        }
        styleArr.push(new olStyle(style));
        if (styleObj.image) {
          const iconStyle = {};
          iconStyle.image = new olStyleIcon(styleObj.image);
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
          styleArr.push(new olStyle(iconStyle));
        }
        if (styleObj.circle) {
          let circleStyle = {}; // style.text={};
          circleStyle = styleObj.circle; // 文本样式
          if (styleObj.circle.fill) {
            circleStyle.fill = new olStyleFill(styleObj.circle.fill); // 文本填充
          } /*  else {
            circleStyle.fill = new olStyleFill(
              this.defaultMap.defaultStyle.circle.fill
            ); //文本填充
          } */
          if (styleObj.circle.stroke) {
            circleStyle.stroke = new olStyleStroke(styleObj.circle.stroke); // 线宽
          } /*  else {
            circleStyle.stroke = new olStyleStroke(
              this.defaultMap.defaultStyle.circle.stroke
            ); //线宽
          } */

          if (styleObj.circle.image) {
            circleStyle.image = new olStyleIcon(styleObj.circle.image); // 线宽
            styleArr.push(new olStyle(circleStyle));
          } else {
            styleArr.push(
              new olStyle({ image: new olStyleCircle(circleStyle) })
            );
          }

          // style.image=new olStyleCircle(circleStyle)//设置文本样式
        }
      }
      return styleArr;
    },

    // 16进制转成rgb
    set16ToRgb(str) {
      const reg = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;
      if (!reg.test(str)) {
        return;
      }
      let newStr = str.toLowerCase().replace(/\#/g, '');
      const len = newStr.length;
      if (len == 3) {
        let t = '';
        for (let i = 0; i < len; i++) {
          t += newStr.slice(i, i + 1).concat(newStr.slice(i, i + 1));
        }
        newStr = t;
      }
      const arr = []; // 将字符串分隔，两个两个的分隔
      const num = 6;
      for (let i = 0; i < num; i = i + 2) {
        const s = newStr.slice(i, i + 2);
        arr.push(parseInt('0x' + s));
      }
      return 'rgba(' + arr.join(',') + ',0.2)';
    }
  }
};
</script>

<style lang="scss" scoped>
.SituationMap {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  .situationMap-conten {
    position: absolute;
    top: 10px;
    left: 10px;
    background-color: rgba($color: blue, $alpha: 0.3);
    width: 400px;
    height: 600px;
    padding: 10px;
    color: #fff;
    z-index: 11;
    .img-box {
      width: 100%;
      display: flex;
      // justify-content: space-between;
      flex-wrap: wrap;
      .img-item {
        width: 80px;
        height: 80px;
        border-radius: 5px;
        // background-color: yellow;
        opacity: 0.8;
        cursor: pointer;
        margin-right: 10px;
        margin-top: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #000;
      }
    }
    .style-box {
      display: flex;
      .style-left {
        width: 50%;
        .style-item {
          display: flex;
          align-items: center;
          margin-top: 10px;
          .input {
            width: 120px;
            margin-left: 10px;
          }
        }
      }
    }
  }
  .situation-map {
    position: absolute;
    top: 0px;
    left: 0;
    height: 100%;
    width: 100%;
    z-index: 10;
    background-color: #fff;
    .close {
      background-color: #fff;
      width: 36px;
      height: 36px;
      line-height: 36px;
      text-align: center;
      color: #000;
      font-size: 24px;
      font-weight: bold;
      position: absolute;
      top: 10px;
      right: 10px;
      z-index: 11;
      cursor: pointer;
    }
  }
}
</style>
