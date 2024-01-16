<template>
  <div class="map-layer" :style="{ height: height }">
    <div :id="id" ref="rootmap" class="map-panel" style="height: 100%" />
    <!-- 轨迹回放控制器 -->
    <!-- <div class="speed-control" v-if="trackPlayBackObj.showControl">
      <el-slider
        class="ml-10 mr-10"
        v-model="trackPlayBackObj.rate"
        style="width: 500px"
      ></el-slider>
      <span class="ml-10" size="mini" @click="refreshAnimation"
        >轨迹回放速度重置</span
      >
    </div> -->
    <!-- 轨迹回放gif -->
    <div
      v-show="
        trackPlayBackObj.showControl && trackPlayBackObj.imgType == 'people'
      "
      ref="map-people"
      class="map-people"
      :class="{ 'left-people': trackPlayBackObj.showLeft }"
    />
    <div
      v-show="trackPlayBackObj.showControl && trackPlayBackObj.imgType == 'uav'"
      ref="map-uav"
      class="map-uav"
      :style="{ transform: `rotate(${trackPlayBackObj.imgDeg}deg)` }"
    />
    <!-- 巡护轨迹时长距离 -->
    <div
      v-if="trackPlayBackObj.showControl && trackPlayBackObj.imgType != 'uav'"
      class="bottom-box"
    >
      <el-slider
        v-model="trackPlayBackObj.timeRate"
        class="ml-10 mr-10 time-line"
        :max="trackPlayBackObj.difTime"
        :step="0.01"
        :marks="checkTimeMarks()"
        @change="changeTimeRate"
      />
      <!-- <el-popover placement="top" width="400" trigger="click">
        <div>轨迹点列表</div>
        <div v-for="(item, index) in trackPlayBackObj.newPoints" :key="index">
          <div class="flex">
            <span>{{}}</span>
          </div>
        </div>
        <el-button slot="reference" type="text">查看轨迹点</el-button>
      </el-popover> -->
      <!-- <span>{{ trackPlayBackObj.nowDifTime | isFixed }}小时</span> -->

      <!-- <div>
        <div>当前巡护距离</div>
        <div>{{ trackPlayBackObj.nowLength | isFixed }}千米</div>
      </div> -->
    </div>
    <!-- 分屏 -->
    <div v-if="mapDouble" class="map-double">
      <div class="item">
        <!-- <el-select v-model="tt" filterable class="map-select" :popper-class="`map-select-popper`">
          <el-option :label="`斤斤计较`" :value="1" />
          <el-option :label="`斤斤计较2`" :value="2" />
        </el-select> -->
        <div class="map-select">
          <div class="i-select" @click="handleDoubleLayers(1)">
            <div class="hd">
              <i class="icon">
                <svg-icon icon-class="international" />
              </i>
              <i class="text">{{ doubleTitle1 }}</i>
              <i
                class="arrow"
                :class="[
                  doubleActive1 ? 'el-icon-arrow-down' : 'el-icon-arrow-up'
                ]"
              />
            </div>
            <div class="bd" :class="{ active: doubleActive1 }">
              <ul>
                <li
                  v-for="(v, k) in defaultMap.imageLayers"
                  :key="k"
                  :class="{ active: doubleIndex1 === k }"
                  @click="changeDoubleLayers(doubleMap1, 1, k)"
                >
                  {{ v.title }}
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div id="double_1" ref="double_1" />
      </div>
      <div class="item">
        <div class="map-select">
          <div class="i-select" @click="handleDoubleLayers(2)">
            <div class="hd">
              <i class="icon">
                <svg-icon icon-class="international" />
              </i>
              <i class="text">{{ doubleTitle2 }}</i>
              <i
                class="arrow"
                :class="[
                  doubleActive2 ? 'el-icon-arrow-up' : 'el-icon-arrow-down'
                ]"
              />
            </div>
            <div class="bd" :class="{ active: doubleActive2 }">
              <ul>
                <li
                  v-for="(v, k) in defaultMap.imageLayers"
                  :key="k"
                  :class="{ active: doubleIndex2 === k }"
                  @click="changeDoubleLayers(doubleMap2, 2, k)"
                >
                  {{ v.title }}
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div id="double_2" ref="double_2" />
      </div>
      <div class="line" />
      <div class="close" @click="hideDouble"><i class="el-icon-close" /></div>
    </div>

    <!-- 对比 -->
    <div class="map-compare" />

    <!-- 卷帘 -->
    <div v-if="mapRoller" class="map-roller">
      <div id="roller" ref="roller" />
      <el-slider
        v-model="rollerValue"
        class="point"
        :show-tooltip="false"
        @input="bindRollerEvent"
      />
      <div class="mask" :style="{ left: rollerValue + '%' }">
        <!-- <div class="text-1">{{rollerTitle1 || '未知年份'}}</div> -->
        <!-- <div class="text-2">{{rollerTitle2 || '未知年份'}}</div> -->
        <div class="text-1 map-select">
          <div class="i-select" @click="handleRollerLayers(1)">
            <div class="hd">
              <i class="icon">
                <svg-icon icon-class="international" />
              </i>
              <i class="text">{{ rollerTitle1 }}</i>
              <i
                v-if="!year"
                class="arrow"
                :class="[
                  rollerActive1 ? 'el-icon-arrow-down' : 'el-icon-arrow-up'
                ]"
              />
            </div>
            <div class="bd" :class="{ active: rollerActive1 }">
              <ul>
                <li
                  v-for="(v, k) in rollerImages1"
                  :key="k"
                  :class="{ active: rollerIndex1 === k }"
                  @click="changeRollerLayers(1, k)"
                >
                  {{ v.title }}
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="text-2 map-select">
          <div class="i-select" @click="handleRollerLayers(2)">
            <div class="hd">
              <i class="icon">
                <svg-icon icon-class="international" />
              </i>
              <i class="text">{{ rollerTitle2 }}</i>
              <i
                v-if="!year"
                class="arrow"
                :class="[
                  rollerActive2 ? 'el-icon-arrow-down' : 'el-icon-arrow-up'
                ]"
              />
            </div>
            <div class="bd" :class="{ active: rollerActive2 }">
              <ul>
                <li
                  v-for="(v, k) in rollerImages2"
                  :key="k"
                  :class="{ active: rollerIndex2 === k }"
                  @click="changeRollerLayers(2, k)"
                >
                  {{ v.title }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div class="close" @click="hideRoller"><i class="el-icon-close" /></div>
    </div>

    <div v-if="imageSelect" class="map-selects">
      <div class="map-select fr">
        <div class="i-select ml-10" @click="handleMapSelect('image')">
          <div class="hd">
            <i class="icon">
              <svg-icon icon-class="international" />
            </i>
            <i class="text">{{ defaultMap.imageTitle }}</i>
            <i
              class="arrow"
              :class="[
                defaultMap.imageActive
                  ? 'el-icon-arrow-up'
                  : 'el-icon-arrow-down'
              ]"
            />
          </div>
          <div class="bd" :class="{ active: defaultMap.imageActive }">
            <ul>
              <li
                v-for="(v, k) in defaultMap.imageLayers"
                :key="k"
                :class="{ active: v.active }"
                @click="changeImageLayers(k)"
              >
                {{ v.title }}
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="map-select fr">
        <div
          class="i-select ml-10"
          style="width: 100px"
          @click="handleMapSelect('tool')"
        >
          <div class="hd">
            <i class="icon">
              <i class="el-icon-s-cooperation" />
            </i>
            <i class="text">{{ defaultMap.toolTitle }}</i>
            <i
              v-if="
                defaultMap.toolTitle === '测距' ||
                  defaultMap.toolTitle === '测面'
              "
              class="arrow el-icon-close pointer"
              @click.stop="hideMeasure"
            />
            <i
              v-else
              class="arrow"
              :class="[
                defaultMap.toolActive
                  ? 'el-icon-arrow-up'
                  : 'el-icon-arrow-down'
              ]"
            />
          </div>
          <div class="bd" :class="{ active: defaultMap.toolActive }">
            <ul>
              <li @click="showDouble">分屏</li>
              <!-- <li>对比</li> -->
              <li @click="showRoller">卷帘</li>
              <li @click="showMeasure('LineString')">测距</li>
              <li @click="showMeasure('Polygon')">测面</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div v-if="mapControl" class="map-control">
      <div
        v-if="baseSelect"
        class="item"
        :class="{ active: baseLayerControl }"
        @click="showChangeLayers()"
      >
        <i class="el-icon-menu" />
      </div>
      <div class="item" @click="zoomIn()">
        <i class="el-icon-plus" />
      </div>
      <div class="item" @click="zoomOut()">
        <i class="el-icon-minus" />
      </div>
    </div>

    <!--地图弹出层-->
    <div
      :class="`popupImg_${id}`"
      class="popup"
      :style="{ transform: `scale(${scaleValue})` }"
    >
      <div v-loading="popupLoading" class="body">
        <div class="hd hd-img">
          <!-- <div class="title">{{ popupData.title }}</div> -->
          <div class="close" @click="closePopup()" />
        </div>

        <div id="popup-content" class="bd bd-img">
          <template v-for="(item, index) in popupData.content">
            <img :key="index" :src="$imgUrl(item, `${imgType}`)" alt="">
          </template>
          <!-- <div
            class="item"
            v-for="(v, k) in popupData.content"
            :key="k"
            :style="{ width: v.width }"
          >
            <span>{{ v.key }}</span>
            <span class="value" :title="v.value">{{ v.value || "-" }}</span>
          </div> -->
        </div>
        <div class="arrow" />
      </div>
    </div>
    <div
      :id="`popup_${id}`"
      class="popup"
      :style="{ transform: ` scale(${scaleValue})` }"
    >
      <div v-loading="popupLoading" class="body">
        <div class="hd">
          <div class="title">{{ popupData.title }}</div>
          <div class="close" @click="closePopup()" />
        </div>
        <div id="popup-content" class="bd">
          <div
            v-for="(v, k) in popupData.content"
            :key="k"
            class="item"
            :style="{ width: v.width }"
          >
            <span>{{ v.key }}</span>
            <span class="value" :title="v.value">{{ v.value || '-' }}</span>
          </div>
        </div>
        <div class="ft">
          <div
            v-for="(v, k) in popupData.buttons"
            :key="k"
            class="btn"
            @click="handlePopupBtn(v)"
          >
            {{ v.name }}
          </div>
        </div>
      </div>
      <div class="arrow" />
      <!-- <div class="label">森林火灾</div> -->
    </div>

    <div v-if="baseLayerControl" class="map-base-layer">
      <div
        class="item vec"
        :class="{ selected: baseLayerIndex == 0 }"
        @click="changeBaseLayers(0)"
      >
        <div class="mark" />
        <span class="title">地图</span>
      </div>
      <div
        class="item img"
        :class="{ selected: baseLayerIndex == 1 }"
        @click="changeBaseLayers(1)"
      >
        <div class="mark" />
        <span class="title">影像</span>
      </div>
      <div
        class="item ter"
        :class="{ selected: baseLayerIndex == 2 }"
        @click="changeBaseLayers(2)"
      >
        <div class="mark" />
        <span class="title">地形</span>
      </div>
    </div>

    <div
      v-if="JSON.stringify(imageLayerInfo) !== '{}' && mapInfo"
      class="map-info"
    >
      <span class="mr-10">{{ imageLayerInfo.no }}</span>
      <span class="mr-10">来源：{{ imageLayerInfo.origin }}</span>
      <!-- <span>时相：{{imageLayerInfo.time || '未知'}}</span> -->
    </div>
    <VideoConnection v-if="videoData.show" :video-data="videoData" />
  </div>
</template>
<script>
import 'ol/ol.css';
import { get as getProjection } from 'ol/proj';
import {
  // getWidth, getTopLeft, boundingExtent,
  extend,
  getCenter
} from 'ol/extent';
import View from 'ol/View';
import Map from 'ol/Map';
import { defaults as defaultInteractions } from 'ol/interaction';
import { unByKey } from 'ol/Observable';
import { getArea, getLength } from 'ol/sphere.js';
import TileLayer from 'ol/layer/Tile';
import TileWMS from 'ol/source/TileWMS';
import VectorSource from 'ol/source/Vector';
import ClusterSource from 'ol/source/Cluster'; // 聚合
import WMTSTileGrid from 'ol/tilegrid/WMTS';
import TileGrid from 'ol/tilegrid/TileGrid';
import VectorLayer from 'ol/layer/Vector';
import Feature from 'ol/Feature';
import Overlay from 'ol/Overlay';
// import geom from 'ol/geom.js'
import MultiPoint from 'ol/geom/MultiPoint';
import Point from 'ol/geom/Point';
import Polygon from 'ol/geom/Polygon';
import MultiPolygon from 'ol/geom/MultiPolygon';
import LineString from 'ol/geom/LineString';
import MultiLineString from 'ol/geom/MultiLineString';

import olStyle from 'ol/style/Style';
import olStyleIcon from 'ol/style/Icon';
import olStyleText from 'ol/style/Text';
import olStyleCircle from 'ol/style/Circle';
import olStyleFill from 'ol/style/Fill';
import olStyleStroke from 'ol/style/Stroke';
import XYZ from 'ol/source/XYZ';
import WKT from 'ol/format/WKT';
import lodash from 'lodash';
// import { defaults as defaultControls } from 'ol/control';
// import FullScreen from 'ol/control/FullScreen';
// import MousePosition from 'ol/control/MousePosition';
import Draw from 'ol/interaction/Draw';
import Snap from 'ol/interaction/Snap';
import Modify from 'ol/interaction/Modify';
import Select from 'ol/interaction/Select';
import { click } from 'ol/events/condition';

import ScaleLine from 'ol/control/ScaleLine';

import * as olCoordinate from 'ol/coordinate';
import ImageLayer from 'ol/layer/Image';
import RasterSource from 'ol/source/Raster';
import GeoJSON from 'ol/format/GeoJSON';

import { fromExtent } from 'ol/geom/Polygon';
import { bbox as bboxStrategy } from 'ol/loadingstrategy';
/* eslint-disable */

import formatWKT from 'terraformer-wkt-parser';
import areaData from './area-data';
import VideoConnection from '@/components/VideoConnection';
import { getRenderPixel } from 'ol/render';
import { deepClone, parseTime } from '@/utils';
import patrol from '@/api/patrol';
import { isArray } from '@/utils/validate';
import { LinearRing } from 'ol/geom'; //引入几何类
const jsts = require('jsts/dist/jsts.min.js'); //引入jsts

const OL3Parser = new jsts.io.OL3Parser();
OL3Parser.inject(
  Point,
  LineString,
  LinearRing,
  Polygon,
  MultiPoint,
  MultiLineString,
  MultiPolygon
);

export default {
  name: 'MapLayer',
  props: {
    copyMap: {
      type: Object,
      default: null
    },
    //地图divID由父组件传，解决一个页面两个地图视图问题
    id: {
      type: String,
      default: 'mapId' + new Date().getTime() + Math.random()
    },
    height: {
      type: String,
      default: '500px'
    },
    // 影像选择
    imageSelect: {
      type: Boolean,
      default: true
    },

    // 加载影像数据
    imageFetch: {
      type: Boolean,
      default: true
    },

    // 自定义颜色
    isCustom: {
      type: Boolean,
      default: false
    },

    // 缩放值
    scaleValue: {
      type: Number,
      default: 1
    },

    // 区域边界，区域外遮罩
    areaWkt: {
      type: String,
      default: ''
    },
    // 显示底图，默认显示
    showBaseLayer: {
      type: Boolean,
      default: true
    },
    // 显示注记图层，默认显示
    showNoteLayer: {
      type: Boolean,
      default: true
    },
    trackPlayBack: {
      type: Object,
      default: () => {}
    },
    year: {
      type: Number,
      default: null
    },
    mapInfo: {
      type: Boolean,
      default: true
    },
    mapControl: {
      type: Boolean,
      default: true
    },
    baseSelect: {
      type: Boolean,
      default: false
    },
    baseLayer: {
      type: Number,
      default: 1
    }
  },
  components: {
    VideoConnection
  },
  data() {
    const defaultMap = {
      //初始化地图配置项
      center: [114.99114990234375, 27.119064331054688],
      maxZoom: 18,
      minZoom: 4,
      zoom: 7,
      extent: [113.3436, 24.2914, 118.2858, 30.0441],
      interactions: defaultInteractions({
        pinchRotate: false, // 移动端禁止地图旋转
        doubleClickZoom: false //禁止双击放大地图
      }),
      tk: 'f536641212889df16a6afaa1beff020b',
      layerEventType: 'singleclick',

      geoServerUrl: this.$mapUrl,
      geoServerWork: 'LYGL_SLDC_Work', //工作区
      // geoServerData: 'LYGL_JiAn_Data',//数据存储

      baseLayers: [
        {
          url: 'http://t4.tianditu.gov.cn/DataServer?T=vec_c&x={1}&y={2}&l={0}&tk=f536641212889df16a6afaa1beff020b', //平面
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
          url: 'http://t4.tianditu.gov.cn/DataServer?T=ter_c&x={1}&y={2}&l={0}&tk=f536641212889df16a6afaa1beff020b', //地形
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
      ],
      toolTitle: '工具',
      toolActive: false,
      imageTitle: '天地图',
      imageActive: false,
      imageLayers: [
        {
          url: 'http://t5.tianditu.gov.cn/DataServer?T=img_c&x={1}&y={2}&l={0}&tk=f536641212889df16a6afaa1beff020b',
          name: 'base_layer_tdt',
          title: '天地图',
          index: 0,
          origin: '天地图',
          type: 1,
          active: true,
          time: '未知',
          no: 'GS(2021)1487号'
        },
        {
          index: 0,
          url: 'https://jx.zhlzz.com:8036/slzy_yx/rest/wmts?ACCOUNT=admin&PASSWD=admin123&layer=satImage&style=default&tilematrixset=satImage&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fjpeg&TileMatrix={0}&TileCol={1}&TileRow={2}',
          // url: "http://124.193.194.41/rest/wmts?ACCOUNT=admin&PASSWD=admin123&layer=satImage&style=default&tilematrixset=satImage&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fjpeg&TileMatrix={0}&TileCol={1}&TileRow={2}",
          name: 'image_layer_0',
          title: '即时影像',
          type: 0,
          active: false,
          origin: '国家林草局',
          time: null,
          no: 'GS(2020)3758号',
          year: '2022'
        },
        {
          index: 0,
          url: 'https://jx.zhlzz.com:8036/slzy_2021/rest/wmts?ACCOUNT=admin&PASSWD=admin123&layer=satImage&style=default&tilematrixset=satImage&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fjpeg&TileMatrix={0}&TileCol={1}&TileRow={2}',
          // url: "http://124.193.194.42:8080/onemap21/rest/wmts?ACCOUNT=admin&PASSWD=admin123&layer=satImage&style=default&tilematrixset=satImage&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fjpeg&TileMatrix={0}&TileCol={1}&TileRow={2}",
          name: 'image_layer_1',
          title: '2021版影像',
          type: 0,
          active: false,
          origin: '国家林草局',
          time: null,
          no: 'GS(2020)3758号',
          year: '2021'
        },
        {
          index: 0,
          url: 'https://jx.zhlzz.com:8036/slzy_2020/rest/wmts?ACCOUNT=admin&PASSWD=admin123&layer=satImage&style=default&tilematrixset=satImage&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fjpeg&TileMatrix={0}&TileCol={1}&TileRow={2}',
          // url: "http://124.193.194.42:8080/onemap20/rest/wmts?ACCOUNT=admin&PASSWD=admin123&layer=satImage&style=default&tilematrixset=satImage&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fjpeg&TileMatrix={0}&TileCol={1}&TileRow={2}",
          name: 'image_layer_2',
          title: '2020版影像',
          type: 0,
          active: false,
          origin: '国家林草局',
          time: null,
          no: 'GS(2020)3758号',
          year: '2020'
        },
        {
          index: 0,
          url: 'https://jx.zhlzz.com:8036/slzy_2019/rest/wmts?ACCOUNT=admin&PASSWD=admin123&layer=satImage&style=default&tilematrixset=satImage&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fjpeg&TileMatrix={0}&TileCol={1}&TileRow={2}',
          // url: "http://124.193.194.42:8080/onemap19/rest/wmts?ACCOUNT=admin&PASSWD=admin123&layer=satImage&style=default&tilematrixset=satImage&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fjpeg&TileMatrix={0}&TileCol={1}&TileRow={2}",
          name: 'image_layer_3',
          title: '2019版影像',
          type: 0,
          active: false,
          origin: '国家林草局',
          time: null,
          no: 'GS(2020)3758号',
          year: '2019'
        },
        {
          index: 0,
          url: 'https://jx.zhlzz.com:8036/slzy_2018/rest/wmts?ACCOUNT=admin&PASSWD=admin123&layer=satImage&style=default&tilematrixset=satImage&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fjpeg&TileMatrix={0}&TileCol={1}&TileRow={2}',
          // url: "http://124.193.194.42:8080/onemap18/rest/wmts?ACCOUNT=admin&PASSWD=admin123&layer=satImage&style=default&tilematrixset=satImage&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fjpeg&TileMatrix={0}&TileCol={1}&TileRow={2}",
          name: 'image_layer_4',
          title: '2018版影像',
          type: 0,
          active: false,
          origin: '国家林草局',
          time: '2022-05',
          no: 'GS(2020)3758号',
          year: '2018'
        },
        {
          index: 0,
          url: 'https://jx.zhlzz.com:8036/slzy_2017/rest/wmts?ACCOUNT=admin&PASSWD=admin123&layer=satImage&style=default&tilematrixset=satImage&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fjpeg&TileMatrix={0}&TileCol={1}&TileRow={2}',
          // url: "http://124.193.194.42:8080/onemap17/rest/wmts?ACCOUNT=admin&PASSWD=admin123&layer=satImage&style=default&tilematrixset=satImage&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fjpeg&TileMatrix={0}&TileCol={1}&TileRow={2}",
          name: 'image_layer_5',
          title: '2017版影像',
          type: 0,
          active: false,
          origin: '国家林草局',
          time: null,
          no: 'GS(2020)3758号',
          year: '2017'
        }
      ],

      defaultStyle: {
        fill: {
          color: 'rgba(255, 255, 255, 0)'
        },
        text: {
          font: '14px 微软雅黑', //默认是'10px sans-serif'
          //text:'',//文本内容
          //textAlign：'center',//文本对齐 'left', 'right', 'center', 'end' 'start'.针对于placement: 'point',默认为'center'；针对于placement: 'line'，默认是让渲染器选择不超过maxAngle的位置
          //textBaseline:'middle',//文本基线  'bottom', 'top', 'middle', 'alphabetic', 'hanging', 'ideographic' 默认'middle'
          //placement:'',//文本布置
          //scale：,
          padding: [0, 0, 0, 0], //文本周围的像素填充。数组中值的顺序是[top, right, bottom, left]
          fill: {
            color: '#FFFFFF'
          }, //如果未设置，默认未#333
          stroke: {
            color: '#FFFFFF',
            width: 1
          }
          // offsetX:0,//水平文本偏移量(以像素为单位)。正值将把文本右移。默认0
          // offsetY:0,//垂直文本偏移量(以像素为单位)。正值会将文本向下移动。默认0
          // rotation：0,//默认0
          // rotateWithView:false,
          // backgroundFill:  ,//当placement:“point”时，填充文本背景的样式。默认为无填充
          // backgroundStroke: ,//当placement:“point”时，描绘文本背景的样式。默认为无描绘
        },
        stroke: {
          width: 2, //宽
          color: '#00C5D4' //颜色、渐变或图案
          // lineCap:'round',//线帽风格  butt, round, 或者 square 默认 round
          // lineJoin:'round',//线连接方式 bevel, round, 或者 miter 默认 round
          // lineDash： [],//线间隔模式 这个变化与分辨率有关 默认为undefined Internet Explorer 10和更低版本不支持
          // lineDashOffset:0,//线段间隔偏移 默认0
          // miterLimit:10,// 默认10
        }
        // image: {
        //   //anchor:[0.5,0.5]，//锚。默认值是图标中心 默认值是[0.5,0.5]
        //   // anchorOrigin:'top-left',//锚的原点:左下角、右下角、左上方或右上方。默认是左上
        //   // anchorXUnits:'fraction',//指定锚点x值的单位。'fraction'的值表示x值是图标的'fraction'。'pixels'的值表示像素中的x值,默认为'fraction'
        //   // anchorYUnits:'fraction',//指定锚点y值的单位。'fraction'的值表示y值是图标的'fraction'。'pixels'的值表示像素中的y值,默认为'fraction'
        //   // color:color,//颜色、渐变或图案
        //   // crossOrigin:,
        //   // img:,//图标的图像对象  如果没有提供src选项，则必须已经加载了提供的图像
        //   // imgSize:,//
        //   // offset:[0,0].//偏移值，默认为[0,0]
        //   // offsetOrigin:'top-left',//偏移量的原点，bottom-left, bottom-right, top-left or top-right. 默认是`top-left`
        //   // opacity:1,//默认是1  （0，1）
        //   // scale:1,//默认是1
        //   // rotation：0，//以弧度旋转(顺时针方向正旋转) 默认为0
        //   // size：,//图标大小(以像素为单位)。可与偏移量一起用于定义要从原点(sprite)图标图像使用的子矩形
        //   src: require("../../static/image/icon_position_blue.png"), //'../../img/icon_position_blue.png',//图像URL源
        //   //src:"../../img/icon_position_blue.png",
        //   // rotateWithView：false,//是否旋转视图中的图标  默认为false
        // },
        // circle: {
        //   radius: 10,
        //   fill: {
        //     color: "#049c53",
        //   },
        //   stroke: {
        //     color: "#fff",
        //   },
        // },
      },
      eventObjForVector: {
        click: {},
        dblclick: {},
        pointermove: {},
        singleclick: {}
      },
      isOpenDFM: true, //是否显示度分秒
      fractionDigits: 2 //保留位数,
    };
    const map = null;
    const view = null;
    const popupLayer = null;
    return {
      imgType: null,
      videoData: {},
      map,
      view,
      defaultMap,
      baseLayerControl: false, //是否显示图层切换div 默认隐藏
      baseLayerIndex: this.baseLayer, //初始化显示图层0：平面；1：影像；2：地形,
      baseLayerObj: {}, //加载图层图层信息存放，图层名称：图层信息
      drawLayerObj: {}, //前端绘制图层信息存放obj
      wmsLayerObj: {}, //geoserver图层存放obj
      trackPlayBackObj: {
        timeIndex: 0,
        nowDifTime: 0.0,
        nowLength: 0.0,
        speed: 500,
        index: 0,
        date: null,
        tempDate: null,
        newPoints: [],
        arrData: [],
        inter: null,
        drawVector: null,
        showLeft: false,
        ispuse: 0,
        rate: 50,
        timeRate: 0,
        imgType: 'people',
        imgDeg: 0,
        buffer: 100, //缓冲区距离，单位为米，默认为100
        areaBoundaryLine: null, //责任区数据，单个为字符串，多个为数组，单个数组也可
        showDeal: false, //是否展示虚拟轨迹点
        showControl: false, //是否展示轨迹回放控制器
        drawType: 'point' //轨迹显示方式'point' 显示点位，'line'显示线
      }, //轨迹回放对象
      imageLayerObj: {},
      imageLayerInfo: {},
      popupLoading: false,
      popupLayer,
      popupData: {
        /* forestryUserName: '',
        eventTypeName: '',
        statusName: '',
        reportTime: '',
        lon: '',
        lat: '',
        description: '', */
      },
      toolData: {},
      mapDouble: false,
      doubleView: null,
      doubleMap1: null,
      doubleMap2: null,
      doubleTitle1: '',
      doubleTitle2: '',
      doubleActive1: false,
      doubleActive2: false,
      doubleIndex1: 0,
      doubleIndex2: 0,
      mapRoller: false,
      rollerMap: null,
      rollerValue: 50,
      rollerTitle1: '',
      rollerTitle2: '',
      rollerActive1: false,
      rollerActive2: false,
      rollerIndex1: 0,
      rollerIndex2: 0,
      rollerImages1: [],
      rollerImages2: [],
      tips: null
    };
  },
  created() {
    /* setTimeout(() => {
      this.showRoller();
    }, 1000); */
  },
  mounted() {
    this.$nextTick(() => {
      this.initMap();
    });
  },
  beforeDestroy() {
    this.destroy();
  },
  watch: {},
  methods: {
    multiPointToLine(arr) {
      var geojsonTemp = {
        type: 'LineString',
        coordinates: arr
      };
      // 空间数据转换
      const flyData = formatWKT.convert(geojsonTemp);
      const polygonArr = [];
      polygonArr.push({
        coords: flyData,
        id: new Date().getDate
      });
      return polygonArr;
    },
    //根据wkt返回长度或面积单位米
    getAreaByWkt: function (
      wkt,
      obj = { radius: 6378137, projection: 'EPSG:4326' }
    ) {
      var geom = new WKT().readGeometry(wkt);
      var output = 0;
      if (geom instanceof Polygon || geom instanceof MultiPolygon) {
        output = getArea(geom, obj);
      } else if (
        geom instanceof LineString ||
        geom instanceof MultiLineString
      ) {
        output = getLength(geom, obj);
      }
      return output;
    },
    //根据wkt返回点位对象
    getFeatureByWKT(wkt) {
      return new WKT().readGeometryFromText(wkt);
    },
    getCoordinatesByWkt(wkt) {
      let feature = this.getFeatureByWKT(wkt);
      return feature.getCoordinates();
    },
    getDrawVector: function () {
      if (!this.trackPlayBackObj.drawVector) {
        this.trackPlayBackObj.drawVector = new VectorLayer({
          name: 'trackLayer',
          source: new VectorSource(),
          zIndex: 1000
        });
        this.map.getLayers().insertAt(1, this.trackPlayBackObj.drawVector);
      }
      return this.trackPlayBackObj.drawVector;
    },
    checkIsInArea(point, boundaryLine) {
      let inArea = false;
      if (isArray(boundaryLine) && boundaryLine.length) {
        for (let index = 0; index < boundaryLine.length; index++) {
          const wkt = boundaryLine[index];

          inArea = this.judgeIsIntersectsCoordinate(
            this.getBufferWkt(wkt, this.trackPlayBackObj.buffer),
            point
          );
          if (inArea) {
            break;
          }
        }
      } else if (boundaryLine) {
        inArea = this.judgeIsIntersectsCoordinate(
          this.getBufferWkt(boundaryLine, this.trackPlayBackObj.buffer),
          point
        );
      } else {
        inArea = true;
      }
      return inArea;
    },
    //判断责任区内外点位样式
    checkPointStyle(point) {
      //Point(118,28)
      let style = this.checkIsInArea(
        new WKT().writeGeometry(point),
        this.trackPlayBackObj.areaBoundaryLine
      )
        ? new olStyle({
            image: new olStyleIcon({
              anchor: [0.5, 1],
              scale: 0.8,
              src: require('./image/pointhighlights-green.png')
            })
          })
        : new olStyle({
            image: new olStyleIcon({
              anchor: [0.5, 1],
              scale: 0.8,
              src: require('./image/pointhighlights-red.png')
            })
          });
      return style;
    },
    checkLineStyle() {
      let style = new olStyle({
        fill: new olStyleFill({
          color: 'rgba(255, 0, 0, 0.5)'
        }),
        stroke: new olStyleStroke({
          color: 'red',
          width: 3
        })
      });
      return style;
    },
    //添加线
    addLine: function (point1, point2) {
      var drawVector = this.getDrawVector();
      let style = this.checkLineStyle();
      if (point1 && point2) {
        var line = new LineString([point1, point2]);
        var feature = new Feature({
          geometry: line
        });
        feature.setStyle(style);
        drawVector.getSource().addFeature(feature);
      } else if (point1) {
        var feature0 = drawVector.getSource().getFeatures()[0];
        if (feature0) {
          feature0.getGeometry().appendCoordinate(point1);
        }
      }
    },
    //添加点位
    addPoint: function (point) {
      var drawVector = this.getDrawVector();
      var point = new Point(point);
      let style = this.checkPointStyle(point);
      var feature = new Feature({
        geometry: point
      });
      feature.setStyle(style);
      drawVector.getSource().addFeature(feature);
    },
    calculateRotation: function (start, end) {
      let dx = end[0] - start[0];
      let dy = end[1] - start[1];
      let rotation = Math.atan2(dy, dx) * (180 / Math.PI);
      return rotation;
    },
    changeDirection: function (point1, point2) {
      if (point1[0] - point2[0] > 0) {
        this.trackPlayBackObj.showLeft = true;
      } else {
        this.trackPlayBackObj.showLeft = false;
      }
    },
    loadTimeAndLength(index) {
      this.trackPlayBackObj.nowDifTime =
        index > -1
          ? this.trackPlayBackObj.difTimeList[index]
          : this.trackPlayBackObj.difTime;
      this.trackPlayBackObj.nowLength =
        index > -1
          ? this.trackPlayBackObj.lengthList[index]
          : this.trackPlayBackObj.length;
    },
    moveFeature: function (event) {
      var vectorContext = event.vectorContext;
      var index = this.trackPlayBackObj.index;
      var date = this.trackPlayBackObj.date;
      let timeIndex = this.trackPlayBackObj.timeIndex; //获取时间轴下标
      var newPoints = this.trackPlayBackObj.newPoints;
      if (index >= newPoints.length) {
        this.stopAnimation();
        return;
      }
      var frameState = event.frameState;
      this.loadTrackPosition(newPoints[index]);
      this.loadTimeAndLength(index);
      if (this.trackPlayBackObj.drawType === 'point') {
        this.addPoint(newPoints[index]);
      } else if (this.trackPlayBackObj.drawType === 'line') {
        if (index == 1) {
          this.addLine(newPoints[0], newPoints[1]);
        } else if (index > 1) {
          this.addLine(newPoints[index]);
        }
      }
      if (index > 0) {
        var rotation = this.calculateRotation(
          newPoints[index - 1],
          newPoints[index]
        );
        let imgType = this.trackPlayBackObj.imgType;
        if (imgType == 'people') {
          this.changeDirection(newPoints[index - 1], newPoints[index]);
        } else if (imgType == 'uav') {
          this.trackPlayBackObj.imgDeg = -rotation;
        }
      }
      if (this.trackPlayBackObj.ispuse == 0) {
        var t = frameState.time - date;
        if (t / this.trackPlayBackObj.speed > index - timeIndex) {
          //开始下标减去时间轴下标判断动画重新开始执行步骤
          this.trackPlayBackObj.index = this.trackPlayBackObj.index + 1;
          this.trackPlayBackObj.timeRate =
            this.trackPlayBackObj.difTimeList[index].toFixed(2) * 1;
          // ((index / newPoints.length) * 100) | 0;
        }
      }
    },
    changeTimeRate(val) {
      var drawVector = this.getDrawVector();
      drawVector.getSource().clear(); //清空视图
      let marks = this.trackPlayBackObj.marks;
      let arr = Object.keys(marks).map((key) => key);
      let index = marks[this.findNearestNumber(arr, val)].index; //查找根据点击位置查找最相近的下标
      let points = this.trackPlayBackObj.newPoints.slice(0, index);
      this.stopAnimation();
      this.trackPlayBackObj.index = index;
      this.trackPlayBackObj.timeIndex = index; //动画已跳过下标数
      points.forEach((item) => {
        //绘制进度条覆盖的点位
        this.addPoint(item);
      });
      this.startAnimation();
      // console.log(drawVector.getSource().getFeatures());
    },
    findNearestNumber(arr, target) {
      //查找数组内最近似的值
      return arr.reduce((pre, curr) => {
        return Math.abs(pre - target) > Math.abs(curr - target) ? curr : pre;
      });
    },
    loadTrackPosition: function (coordinate) {
      if (!this.trackPlayBackObj.overlay) {
        const imgType = this.trackPlayBackObj.imgType;
        const imgObj = {
          people: {
            widthOffeset: 64 / 2,
            heightOffeset: 68
          },
          uav: {
            widthOffeset: 32 / 2,
            heightOffeset: 32 / 2
          }
        };
        var widthOffeset = imgObj[imgType].widthOffeset;
        var heightOffeset = imgObj[imgType].heightOffeset;
        this.trackPlayBackObj.overlay = new Overlay({
          position: [0, 0],
          positioning: 'center-bottom',
          element: this.$refs[`map-${imgType}`],
          //stopEvent: false,
          offset: [-widthOffeset, -heightOffeset]
        });
        this.map.addOverlay(this.trackPlayBackObj.overlay);
      }
      this.trackPlayBackObj.overlay.setPosition(coordinate);
    },
    //停止轨迹回放动画
    stopAnimation: function (mapID) {
      this.trackPlayBackObj.index = 0;
      this.trackPlayBackObj.date = 0;
      this.trackPlayBackObj.tempDate = 0;
      this.trackPlayBackObj.timeRate = this.trackPlayBackObj.difTime;
      this.loadTimeAndLength();
      this.map.un('postcompose', this.moveFeature);
      clearInterval(this.trackPlayBackObj.inter);
      this.trackPlayBackObj.inter = null;
    },
    checkTimeMarks() {
      let marks = {};
      let timeList = this.trackPlayBackObj.difTimeList;
      timeList.forEach((item, index) => {
        // console.log(index);
        marks[item] = {
          index
        };
      });
      this.trackPlayBackObj.marks = marks;
      return marks;
    },
    DealPoints: function (points) {
      var newPoints = [];
      points.forEach((item, i) => {
        var currLng = parseFloat(item[0]);
        var currLat = parseFloat(item[1]);
        newPoints.push([currLng, currLat]);

        if (i + 1 == points.length) {
          return false;
        }
        var nextLng = parseFloat(points[i + 1][0]);
        var nextLat = parseFloat(points[i + 1][1]);

        var diffLng = nextLng - currLng;
        var diffLat = nextLat - currLat;

        var currParamsLng = 0;
        var currParamsLat = 0;

        var base = 0.0001;

        currParamsLng = 0.0001;
        currParamsLat = (diffLat / diffLng) * 0.0001;

        if (diffLng < diffLat) {
          currParamsLng = (diffLng / diffLat) * 0.0001;
          currParamsLat = 0.0001;
        }
        if (currParamsLng < 0) {
          currParamsLng = -currParamsLng;
        }

        if (diffLat > 0) {
          if (currParamsLat < 0) {
            currParamsLat = -currParamsLat;
          }
        } else {
          if (currParamsLat > 0) {
            currParamsLat = -currParamsLat;
          }
        }
        if (diffLng == 0) {
          currParamsLng = 0;
          currParamsLat = 0.0001;
        }

        if (diffLat == 0) {
          currParamsLng = 0.0001;
          currParamsLat = 0;
        }

        if (diffLng > 0) {
          currLng = currLng + currParamsLng;
          currLat = currLat + currParamsLat;
          while (currLng < nextLng) {
            newPoints.push([currLng, currLat]);

            currLng = currLng + currParamsLng;
            currLat = currLat + currParamsLat;
          }
        } else if (diffLng < 0) {
          currLng = currLng - currParamsLng;
          currLat = currLat + currParamsLat;
          while (currLng > nextLng) {
            newPoints.push([currLng, currLat]);
            currLng = currLng - currParamsLng;
            currLat = currLat + currParamsLat;
          }
        } else {
          currLng = currLng + currParamsLng;
          currLat = currLat + currParamsLat;
          while (currLat < nextLat) {
            newPoints.push([currLng, currLat]);
            currLng = currLng + currParamsLng;
            currLat = currLat + currParamsLat;
          }
        }
      });
      return newPoints;
    },
    changeSpeed: function () {
      this.trackPlayBackObj.speed = (100 - this.trackPlayBackObj.rate) * 10;
    },
    refreshAnimation: function () {
      this.trackPlayBackObj.speed = (100 - this.trackPlayBackObj.rate) * 10;
      this.trackPlayBackObj.timeIndex = 0; //重置时间轴下标
      this.stopAnimation();
      if (this.trackPlayBackObj.drawVector) {
        this.trackPlayBackObj.drawVector.getSource().clear();
      }
      this.startAnimation();
    },
    startAnimation: function () {
      if (
        this.trackPlayBackObj.date == undefined ||
        this.trackPlayBackObj.date == 0
      ) {
        this.trackPlayBackObj.date = new Date().getTime();
      }
      if (
        this.trackPlayBackObj.tempDate != undefined &&
        this.trackPlayBackObj.tempDate != 0
      ) {
        this.trackPlayBackObj.date =
          this.trackPlayBackObj.date +
          (new Date().getTime() - this.trackPlayBackObj.tempDate);
      }
      this.trackPlayBackObj.ispuse = 0;
      var lines = new LineString(this.trackPlayBackObj.newPoints);
      var extent = lines.getExtent();
      this.fitByExtent(extent, true, {
        padding: this.trackPlayBackObj.padding || [100, 100, 100, 100],
        fit: true
      });
      this.map.on('postcompose', this.moveFeature);
      this.map.render();
      this.trackPlayBackObj.inter = setInterval(() => {
        this.map.render();
      }, this.trackPlayBackObj.speed);
    },
    //是否显示虚拟点位，平滑移动
    checkPoints(arr) {
      return this.trackPlayBackObj.showDeal
        ? this.DealPoints(arr)
        : this.trackPlayBackObj.arrData;
    },
    //加载巡护轨迹
    trackPlayBackInit(data) {
      var arr = [];
      this.trackPlayBackObj.difTime =
        data.difTime * 1 ||
        ((new Date() - new Date(data.startTime)) / 1000 / 60 / 60).toFixed(2) *
          1; //巡护时长
      this.trackPlayBackObj.difTimeList = data.difTimeList || [];
      this.trackPlayBackObj.length = data.length; //巡护距离
      this.trackPlayBackObj.startTime = data.startTime; //巡护开始时间
      this.trackPlayBackObj.endTime = data.endTime || parseTime(new Date()); //巡护结束时间
      this.trackPlayBackObj.arrData = [];
      this.trackPlayBackObj.speed = (100 - this.trackPlayBackObj.rate) * 10;
      let points = data.patrolRecordRouteLine || [];
      //data = data.reverse();
      points.forEach((wkt) => {
        var fea = new WKT().readGeometryFromText(wkt);
        arr.push(fea.getCoordinates());
        this.trackPlayBackObj.arrData.push(fea.getCoordinates());
      });
      this.trackPlayBackObj.newPoints = this.checkPoints(arr);
      this.checkTimeAndLength();
      this.startAnimation();
    },
    checkTimeAndLength() {
      //计算
      let difTimeList = [];
      let lengthList = (this.trackPlayBackObj.lengthList = [0]);
      if (
        this.trackPlayBackObj.difTimeList &&
        this.trackPlayBackObj.difTimeList.length
      ) {
        this.trackPlayBackObj.difTimeList.forEach((item) => {
          difTimeList.push(
            (new Date(item) - new Date(this.trackPlayBackObj.startTime)) /
              1000 /
              60 /
              60
          );
        });
      }
      this.trackPlayBackObj.newPoints.forEach((newPoint, index) => {
        let length = this.trackPlayBackObj.newPoints.length;
        //每个点位时长换算,有返回时间及无返回
        if (
          !this.trackPlayBackObj.difTimeList ||
          !this.trackPlayBackObj.difTimeList.length
        ) {
          difTimeList.push((this.trackPlayBackObj.difTime / length) * index);
        }
        //每个点位距离换算
        if (index > 0) {
          let oldPoint = this.trackPlayBackObj.newPoints[index - 1];
          lengthList[index] =
            lengthList[index - 1] +
            this.getAreaByWkt(
              new WKT().writeGeometry(new LineString([oldPoint, newPoint]))
            ) /
              1000;
        } else if (index == length - 1) {
          lengthList.push(this.trackPlayBackObj.length);
        }
      });
      this.trackPlayBackObj.difTimeList = difTimeList;
    },
    //加载轨迹回放数据
    async loadTrackPlayBackData(obj, trackData) {
      let id = obj.id;
      this.trackPlayBackObj = Object.assign(this.trackPlayBackObj, obj);
      if (id) {
        let res = await patrol.patrolForestryUserinfo('route', 'get', {
          id
        });
        let data = res.data;
        if (data.patrolRecordRouteLine.length) {
          this.trackPlayBackInit(data);
        }
      } else {
        this.trackPlayBackInit(trackData);
      }
    },
    changeControl(bool) {
      this.trackPlayBackObj.showControl = bool;
    },
    freeMomory(key) {
      if (this.drawLayerObj[key].getSource() instanceof ClusterSource) {
        this.drawLayerObj[key].getSource().getSource().clear();
        this.drawLayerObj[key].getSource().clear();
      } else {
        this.drawLayerObj[key].getSource().clear();
      }
      delete this.drawLayerObj[key];
    },
    //销毁、清除内存
    destroy() {
      for (const key in this.drawLayerObj) {
        if (Object.hasOwnProperty.call(this.drawLayerObj, key)) {
          this.freeMomory(key);
        }
      }
      this.map = null;
      this.view = null;
      this.draw = null;
      this.snap = null;
      if (this.trackPlayBackObj?.inter) {
        clearInterval(this.trackPlayBackObj.inter);
        this.trackPlayBackObj.inter = null;
        this.trackPlayBackObj = null;
      }
    },

    // 初始化加载地图
    initMap: function () {
      //debugger;
      this.view = new View({
        projection: getProjection('EPSG:4326'), //坐标系EPSG:4326
        center: this.defaultMap.center, //中心点坐标
        minZoom: this.defaultMap.minZoom, //最小级别
        maxZoom: this.defaultMap.maxZoom,
        zoom: this.defaultMap.zoom
        // extent: this.defaultMap.extent, //范围限制
      });
      let view = null;
      if (this.copyMap) {
        view = this.copyMap.map.getView();
      }
      this.map = new Map({
        layers: [],
        view: view || this.view,
        target: this.id,
        controls: [],
        interactions: defaultInteractions({
          pinchRotate: false, // 移动端禁止地图旋转
          doubleClickZoom: false //禁止双击放大地图
        })
      });
      if (this.showBaseLayer) {
        this.addBaseLayer();
      } else {
        this.addScaleLint();
      }
    },

    addLayer(map, obj) {
      map = map || this.map;
      const layer = obj.layer;
      const position = obj.position;
      if (obj.position != null) {
        const layersArray = map.getLayers();
        layersArray.insertAt(position, layer);
      } else {
        map.addLayer(layer);
      }
      /* if (obj.singleClick && typeof (obj.singleClick) == 'function') {
          myMap.event.singleClick(layer, obj.singleClick);
      } */
    },

    //显示分屏
    showDouble() {
      this.mapDouble = true;

      this.toolData['double_1_layerObj'] = {};
      this.toolData['double_2_layerObj'] = {};

      const currParam = this.defaultMap.baseLayers[this.baseLayerIndex];
      const currLayer = this.initBaseLayer(currParam);

      this.toolData['double_1_layerObj'][currParam.name] = currLayer;
      this.toolData['double_2_layerObj'][currParam.name] = currLayer;

      this.doubleView = new View({
        projection: getProjection('EPSG:4326'), //坐标系EPSG:4326
        center: this.defaultMap.center, //中心点坐标
        minZoom: this.defaultMap.minZoom, //最小级别
        maxZoom: this.defaultMap.maxZoom,
        zoom: this.defaultMap.zoom
        // extent: this.defaultMap.extent, //范围限制
      });

      this.$nextTick(() => {
        this.doubleMap1 = new Map({
          layers: [
            this.initBaseLayer(this.defaultMap.baseLayers[this.baseLayerIndex])
          ],
          view: this.doubleView,
          target: 'double_1',
          controls: []
        });
        this.doubleMap2 = new Map({
          layers: [
            this.initBaseLayer(this.defaultMap.baseLayers[this.baseLayerIndex])
          ],
          view: this.doubleMap1.getView(),
          target: 'double_2',
          controls: []
        });

        this.doubleIndex1 = 0;
        this.doubleIndex2 = 1;

        const layer_1 = this.defaultMap.imageLayers[this.doubleIndex1];
        const temp_1 = this.initImageLayer(layer_1);
        const layer_2 = this.defaultMap.imageLayers[this.doubleIndex2];
        const temp_2 = this.initImageLayer(layer_2);

        this.doubleTitle1 = layer_1.title;
        this.doubleTitle2 = layer_2.title;

        this.toolData['double_1_layerObj'][layer_1.name] = temp_1;
        this.toolData['double_2_layerObj'][layer_2.name] = temp_2;

        this.addLayer(this.doubleMap1, { layer: temp_1, position: 1 });
        this.addLayer(this.doubleMap2, { layer: temp_2, position: 1 });

        //显示注记图层
        if (this.showNoteLayer) {
          const noteLayer = this.baseLayerObj[currParam.noteName];
          this.addLayer(this.doubleMap1, { layer: noteLayer, position: 10 });
          this.addLayer(this.doubleMap2, { layer: noteLayer, position: 10 });
          this.toolData['double_1_layerObj'][currParam.noteName] = noteLayer;
          this.toolData['double_2_layerObj'][currParam.noteName] = noteLayer;
        }

        for (const k in this.drawLayerObj) {
          if (Object.hasOwnProperty.call(this.drawLayerObj, k)) {
            const v = this.drawLayerObj[k];
            if (v.values_.visible) {
              this.addLayer(this.doubleMap1, {
                layer: v,
                position: v.values_.zIndex
              });
              this.addLayer(this.doubleMap2, {
                layer: v,
                position: v.values_.zIndex
              });
              this.toolData['double_1_layerObj'][k] = v;
              this.toolData['double_2_layerObj'][k] = v;
            }
          }
        }

        for (const k in this.wmsLayerObj) {
          if (Object.hasOwnProperty.call(this.wmsLayerObj, k)) {
            const v = this.wmsLayerObj[k];
            if (v.values_.visible) {
              this.addLayer(this.doubleMap1, {
                layer: v,
                position: v.values_.zIndex
              });
              this.addLayer(this.doubleMap2, {
                layer: v,
                position: v.values_.zIndex
              });
              this.toolData['double_1_layerObj'][k] = v;
              this.toolData['double_2_layerObj'][k] = v;
            }
          }
        }
      });
    },

    //关闭分屏
    hideDouble() {
      for (const k in this.toolData['double_1_layerObj']) {
        if (Object.hasOwnProperty.call(this.toolData['double_1_layerObj'], k)) {
          const v = this.toolData['double_1_layerObj'][k];
          this.doubleMap1.removeLayer(v);
        }
      }
      for (const k in this.toolData['double_2_layerObj']) {
        if (Object.hasOwnProperty.call(this.toolData['double_2_layerObj'], k)) {
          const v = this.toolData['double_2_layerObj'][k];
          this.doubleMap2.removeLayer(v);
        }
      }
      this.toolData['double_1_layerObj'] = {};
      this.toolData['double_2_layerObj'] = {};
      this.doubleView = null;
      this.doubleMap1 = null;
      this.doubleMap2 = null;
      this.mapDouble = false;
      this.$emit('hideDouble');
    },

    // 打开分屏切换选项
    handleDoubleLayers(tag) {
      if (tag === 1) {
        this.doubleActive1 = !this.doubleActive1;
        this.doubleActive2 = false;
      } else {
        this.doubleActive1 = false;
        this.doubleActive2 = !this.doubleActive2;
      }
    },

    //分屏切换
    changeDoubleLayers(map, tag, index) {
      const layer = this.defaultMap.imageLayers[index];
      const layerMap = this.toolData[`double_${tag}_layerObj`][layer.name];

      if (tag === 1) {
        this.doubleTitle1 = layer.title;
        this.doubleIndex1 = index;
      } else {
        this.doubleTitle2 = layer.title;
        this.doubleIndex2 = index;
      }

      for (let key in this.toolData[`double_${tag}_layerObj`]) {
        if (key !== layer.name && key.indexOf('image_layer_') == 0) {
          this.toolData[`double_${tag}_layerObj`][key].setVisible(false);
        }
      }

      if (layerMap) {
        layerMap.setVisible(true);
      } else {
        const temp = this.initImageLayer(layer);
        this.toolData[`double_${tag}_layerObj`][layer.name] = temp;
        this.addLayer(map, { layer: temp, position: 2 });
      }
    },

    // 显示卷帘
    showRoller(year = this.year) {
      this.mapRoller = true;

      let index = 0;
      this.toolData['roller_layerObj'] = {};

      const currParam = this.defaultMap.baseLayers[this.baseLayerIndex];
      const currLayer = this.initBaseLayer(currParam);

      this.$nextTick(() => {
        this.rollerMap = new Map({
          layers: [currLayer],
          view: this.view,
          target: 'roller',
          controls: []
        });

        this.rollerImages1 = deepClone(this.defaultMap.imageLayers);
        this.rollerImages2 = deepClone(this.defaultMap.imageLayers);
        // this.rollerImages1.splice(0, 1);
        // this.rollerImages2.splice(0, 1);

        if (year) {
          //已左侧为主，根据传入年度查找年版影像k值
          let i = this.rollerImages2.findIndex((v) => v.year == year);
          index = i >= 0 ? i : 0;
        }

        this.rollerImages1[index].disable = true;
        this.rollerImages2[index + 1].disable = true;

        const layer_1 = this.rollerImages1[index + 1];
        const temp_1 = this.initImageLayer(layer_1);
        const layer_2 = this.rollerImages2[index];
        const temp_2 = this.initImageLayer(layer_2);

        this.rollerTitle1 = layer_1.title;
        this.rollerTitle2 = layer_2.title;
        this.rollerIndex1 = index + 1;
        this.rollerIndex2 = index;

        this.toolData['roller_layerObj'][layer_1.name] = temp_1;
        this.toolData['roller_layerObj'][layer_2.name] = temp_2;

        this.addLayer(this.rollerMap, { layer: temp_1, position: 1 });
        this.addLayer(this.rollerMap, { layer: temp_2, position: 2 });
        this.bindRoller(temp_2);

        //显示注记图层
        if (this.showNoteLayer) {
          const noteLayer = this.baseLayerObj[currParam.noteName];
          this.addLayer(this.rollerMap, { layer: noteLayer, position: 10 });
          this.toolData['roller_layerObj'][currParam.noteName] = noteLayer;
        }

        for (const k in this.drawLayerObj) {
          if (Object.hasOwnProperty.call(this.drawLayerObj, k)) {
            const v = this.drawLayerObj[k];
            if (v.values_.visible) {
              this.addLayer(this.rollerMap, {
                layer: v,
                position: v.values_.zIndex
              });
              this.toolData['roller_layerObj'][k] = v;
            }
          }
        }

        for (const k in this.wmsLayerObj) {
          if (Object.hasOwnProperty.call(this.wmsLayerObj, k)) {
            const v = this.wmsLayerObj[k];
            if (v.values_.visible) {
              this.addLayer(this.rollerMap, {
                layer: v,
                position: v.values_.zIndex
              });
              this.toolData['roller_layerObj'][k] = v;
            }
          }
        }
      });
    },

    //关闭卷帘
    hideRoller() {
      for (const k in this.toolData['roller_layerObj']) {
        if (Object.hasOwnProperty.call(this.toolData['roller_layerObj'], k)) {
          const v = this.toolData['roller_layerObj'][k];
          this.rollerMap.removeLayer(v);
        }
      }
      this.toolData['roller_layerObj'] = {};
      this.rollerMap = null;
      this.mapRoller = false;
      this.$emit('hideRoller');
    },

    // 打开卷帘切换选项
    handleRollerLayers(tag) {
      if (this.year) {
        //固定年版号传入不可切换卷帘年份
        return;
      }
      if (tag === 1) {
        this.rollerActive1 = !this.rollerActive1;
        this.rollerActive2 = false;
      } else {
        this.rollerActive1 = false;
        this.rollerActive2 = !this.rollerActive2;
      }
    },

    //卷帘切换
    changeRollerLayers(tag, index) {
      //   const layerMap = this.toolData[`roller_layerObj`][layer.name];
      if (
        this.rollerImages1[index].disable ||
        this.rollerImages2[index].disable
      ) {
        this.$message({
          message: '该年版已展示，左右两侧不能使用相同年版',
          type: 'error'
        });
        return;
      }

      let layer = '';
      if (tag === 1) {
        layer = this.rollerImages1[index];
        this.rollerTitle1 = layer.title;
        this.rollerIndex1 = index;
        this.rollerImages2.forEach((v) => {
          v.disable = false;
        });
        this.rollerImages2[index].disable = true;
      } else {
        layer = this.rollerImages2[index];
        this.rollerTitle2 = layer.title;
        this.rollerIndex2 = index;
        this.rollerImages1.forEach((v) => {
          v.disable = false;
        });
        this.rollerImages1[index].disable = true;
      }

      for (let key in this.toolData[`roller_layerObj`]) {
        if (key !== layer.name && key.indexOf('image_layer_') == 0) {
          //   this.toolData[`roller_layerObj`][key].setVisible(false);
          this.rollerMap.removeLayer(this.toolData[`roller_layerObj`][key]);
        }
        /* if (key !== layer.name && key !== "image_layer_tdt_cia") {

        } */
      }

      const layer_1 = this.rollerImages1[this.rollerIndex1];
      const temp_1 = this.initImageLayer(layer_1);
      const layer_2 = this.rollerImages2[this.rollerIndex2];
      const temp_2 = this.initImageLayer(layer_2);

      this.toolData['roller_layerObj'][layer_1.name] = temp_1;
      this.toolData['roller_layerObj'][layer_2.name] = temp_2;

      this.addLayer(this.rollerMap, { layer: temp_1, position: 1 });
      this.addLayer(this.rollerMap, { layer: temp_2, position: 2 });
      this.bindRoller(temp_2);
    },

    bindRollerEvent() {
      if (this.rollerMap) {
        this.rollerMap.render();
      }
    },

    bindRoller(layer) {
      //   console.log(layer);
      if (!layer) {
        return;
      }
      //   let layer = this.imageLayerObj[this.defaultMap.imageLayers[1].name];
      layer.on('prerender', (event) => {
        /* var ctx = event.context;
        var width = ctx.canvas.width * (this.rollerValue / 100);
        //$('#swipeSplit').css({ 'left': width + "px" });
        ctx.save();
        ctx.beginPath();
        ctx.rect(width, 0, ctx.canvas.width - width, ctx.canvas.height);
        ctx.clip(); */

        const ctx = event.context;
        const mapSize = this.map.getSize();
        const width = mapSize[0] * (this.rollerValue / 100);
        const tl = getRenderPixel(event, [width, 0]);
        const tr = getRenderPixel(event, [mapSize[0], 0]);
        const bl = getRenderPixel(event, [width, mapSize[1]]);
        const br = getRenderPixel(event, mapSize);

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(tl[0], tl[1]);
        ctx.lineTo(bl[0], bl[1]);
        ctx.lineTo(br[0], br[1]);
        ctx.lineTo(tr[0], tr[1]);
        ctx.closePath();
        ctx.clip();
      });
      layer.on('postrender', (event) => {
        var ctx = event.context;
        ctx.restore();
      });
    },

    handleMapSelect(type) {
      if (type === 'image') {
        this.defaultMap.imageActive = !this.defaultMap.imageActive;
        this.defaultMap.toolActive = false;
      } else {
        if (this.defaultMap.toolTitle !== '工具') {
          this.defaultMap.toolActive = false;
          return;
        }

        this.defaultMap.toolActive = !this.defaultMap.toolActive;
        this.defaultMap.imageActive = false;
      }
    },

    // 关闭提示框
    hideTips() {
      if (this.tips) {
        this.tips.setPosition(undefined);
      }
    },

    // 测距侧面
    showMeasure(type) {
      if (!type) {
        this.$message({
          message: '类型错误',
          type: 'error',
          duration: 4000
        });
      }

      // 不管如何先关闭提示框
      this.map.on('click', this.hideTips);

      this.defaultMap.toolTitle = '测距';

      const obj = {};
      obj.name = 'measure_layer';
      obj.type = type;
      obj.modify = true;
      obj.single = true;
      obj.style = {
        // fill: {
        //   color: 'rgba(255, 255, 255, 0.2)'
        // },
        // stroke: {
        //   color: 'rgba(0, 0, 0, 0.5)',
        //   lineDash: [10, 10],
        //   width: 4
        // },
        fill: {
          color: 'rgba(255, 255, 0, 0)'
        },
        stroke: {
          width: 2,
          color: '#ffff00'
        }
      };

      let tips = document.createElement('div');
      tips.className = 'map-tips';

      this.tips = new Overlay({
        element: tips,
        offset: [0, -15],
        positioning: 'bottom-center'
      });
      this.map.addOverlay(this.tips);

      this.drawLayer(obj, (callback, features) => {
        // wkt返回长度单位米
        let val = this.getAreaByWkt(callback.wktValue);

        // 单位换算,取小数点后2位数
        if (type === 'LineString') {
          if (val > 100) {
            val = Math.round((val / 1000) * 100) / 100 + ' ' + 'km';
          } else {
            val = Math.round(val * 100) / 100 + ' ' + 'm';
          }
        }

        if (type === 'Polygon') {
          if (val > 10000) {
            val =
              Math.round((val / 1000000) * 100) / 100 + ' ' + 'km<sup>2</sup>';
          } else {
            val = Math.round(val * 100) / 100 + ' ' + 'm<sup>2</sup>';
          }
        }

        // 利用extent的getCenter方法来获取中心点
        const xy = new getCenter(features[0].getGeometry().getExtent());

        // 设置显示位置
        this.tips.setPosition(xy);

        // 塞入到弹窗中
        tips.innerHTML = val;
      });
    },

    // 关闭测距侧面
    hideMeasure() {
      // 清除绘制图层
      const obj = {};
      obj.name = 'measure_layer';
      obj.active = false;
      this.clearDrawLayer(obj);

      // 关闭提示
      this.hideTips();

      // 恢复标题
      this.defaultMap.toolTitle = '工具';
    },

    changeStyleFontSize(obj) {
      this.view.on('change:resolution', () => {
        let initSize = 2;
        if (obj.areaCode && obj.areaCode.length > 2) {
          initSize = 1;
        }
        if (obj.areaCode && obj.areaCode.length > 4) {
          initSize = 1;
        }
        const zoom = this.view.getZoom();
        const scale = zoom * initSize;
        const font = 'normal ' + scale + 'px 微软雅黑';
        //console.log(zoom + 'x' + initSize + '=' + scale);

        var features = this.drawLayerObj[obj.layerName]
          ?.getSource()
          .getFeatures();
        if (features) {
          features.forEach((v) => {
            const style = v.getStyle();
            style[0].getText().setFont(font);
            v.setStyle(style);
          });
        }
      });
    },

    addTdtWfsLayer(obj) {
      let name = obj.typeName;
      if (this.drawLayerObj[name]) {
        //this.map.removeLayer(this.drawLayerObj[name]);
        this.drawLayerObj[name].setVisible(obj.active);
        return;
      }

      let url = obj.url || 'http://gisserver.tianditu.gov.cn/TDTService/wfs';
      let typeName = obj.typeName || 'HYDA';
      var vs = new VectorSource({
        format: new GeoJSON(),
        projection: 'EPSG:4326',
        url: (extent) => {
          //console.log(extent);
          return (
            url +
            '?service=WFS&' +
            'version=1.1.0&request=GetFeature&typeName=' +
            typeName +
            '&' +
            'outputFormat=application/json&srsname=EPSG:4326&' +
            'bbox=' +
            //extent.join(",") +
            this.defaultMap.extent.join(',') +
            ',EPSG:4326'
          );
        },
        strategy: bboxStrategy
      });

      this.drawLayerObj[name] = new VectorLayer({
        source: vs,
        style: new olStyle({
          //添加显示的样式
          image: new olStyleCircle({
            stroke: new olStyleStroke({
              color: '#26FFFF',
              width: 1.25
            }),
            radius: 15,
            fill: new olStyleFill({
              color: '#26FFFF'
            })
          }),
          stroke: new olStyleStroke({
            color: obj.color,
            width: 1
          })
        })
      });
      this.drawLayerObj[name].setZIndex(0);

      this.map.addLayer(this.drawLayerObj[name]);
    },

    addTdtImageLayer: function (obj) {
      let name = obj.typeName;
      obj.type = 1;
      if (this.drawLayerObj[name]) {
        //this.map.removeLayer(this.drawLayerObj[name]);
        this.drawLayerObj[name].setVisible(obj.active);
        return;
      }

      let layer = this.initImageLayer(obj);

      this.drawLayerObj[name] = layer;

      this.map.addLayer(layer);
    },

    //控制点击显示地图、影像图层div显示
    showChangeLayers: function () {
      this.baseLayerControl = !this.baseLayerControl;
    },

    // 初始化图层信息
    initBaseLayer: function (layObj) {
      return new TileLayer({
        name: layObj.name || '',
        index: layObj.index || '',
        title: layObj.title || '',
        visible: layObj.visible || true,
        source: new XYZ({
          //url: layObj.url,
          tileUrlFunction: function (tileCoord) {
            let url = layObj.url;
            let z = tileCoord[0];
            let x = tileCoord[1];
            let y = tileCoord[2];
            url = url.split('{0}').join(z);
            url = url.split('{1}').join(x);
            url = url.split('{2}').join(y);
            return url;
          },
          wrapX: layObj.wrapX || false, //是否在水平线上重复
          projection: layObj.projection || 'EPSG:4326',
          crossOrigin: 'anonymous'
        })
      });
    },

    // 添加基础图层
    addBaseLayer: function (map = this.map) {
      //if (!this.isCustom) {
      let baseParam = this.defaultMap.baseLayers[this.baseLayerIndex];
      let baseLayer = this.initBaseLayer(baseParam);
      this.addLayer(map, { layer: baseLayer, position: 1 });
      baseParam.active = true;
      this.imageLayerInfo = baseParam;
      this.baseLayerObj[baseParam.name] = baseLayer;

      // 添加注记图层
      this.addNoteLayer();

      // 获取影像图层
      this.getImageList();
      /* } else {
        let layer = this.initBaseLayer(
          this.defaultMap.baseLayers[1]
        );

        //openlayer 像素转换类，可以直接当做source使用
        const raster = new RasterSource({
          sources: [
            //传入图层，这里是天地图矢量图或者天地图矢量注记
            layer,
          ],
          //这里设置为image类型，与官方示例不同，优化速度
          operationType: 'image',
          operation: function (pixels, data) {
            //执行颜色转换方法，注意，这里的方法需要使用lib引入进来才可以使用
            let reverseFunc = function (pixelsTemp) {
              //蓝色
              for (var i = 0; i < pixelsTemp.length; i += 4) {
                var r = pixelsTemp[i];
                var g = pixelsTemp[i + 1];
                var b = pixelsTemp[i + 2];
                //运用图像学公式，设置灰度值
                var grey = r * 0.3 + g * 0.59 + b * 0.11;
                //将rgb的值替换为灰度值
                pixelsTemp[i] = grey;
                pixelsTemp[i + 1] = grey;
                pixelsTemp[i + 2] = grey;

                //基于灰色，设置为蓝色，这几个数值是我自己试出来的，可以根据需求调整
                pixelsTemp[i] = 55 - pixelsTemp[i];
                pixelsTemp[i + 1] = 255 - pixelsTemp[i + 1];
                pixelsTemp[i + 2] = 305 - pixelsTemp[i + 2];
              }
            };
            reverseFunc(pixels[0].data);
            return pixels[0];
          },
          //线程数量
          threads: 10,
          //允许operation使用外部方法
        //   lib: {
        //     reverseFunc: reverseFunc,
        //   }
        });

        //创建新图层，注意，必须使用 ImageLayer
        let layer2 = new ImageLayer({
          name: "天地图矢量图层",
          source: raster,
        });
        this.map.addLayer(layer2);

        this.imageLayerInfo = this.defaultMap.baseLayers[1];

        this.getImageList();
      } */

      // 添加比例尺
      this.addScaleLint();
    },

    // 添加注记图层
    addNoteLayer(map = this.map) {
      // 开启注记图层
      if (!this.showNoteLayer) {
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

    // 切换图层基础
    changeBaseLayers: function (index) {
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

      this.imageLayerInfo = baseParam;
    },

    // 获取地图影像列表
    async getImageList() {
      const list = [];

      if (this.imageFetch) {
        const api = require('@/api/data');
        const query = {};
        query.status = 1;
        const res = await api.fetchMapImageList(query);

        res.data.forEach((v, k) => {
          const temp = {};
          temp.index = 0;
          temp.url = v.mapUrl;
          temp.name = 'image_layer_' + k;
          temp.title = v.biName;
          temp.type = parseInt(v.imageType);
          temp.active = false;
          temp.origin = v.origin;
          temp.time = v.imageTime;
          temp.no = 'GS(2020)3758号';
          list.push(temp);
        });

        // 赋值影像列表
        this.defaultMap.imageLayers = list;
      }

      // 赋值中心点和显示范围
      if (JSON.stringify(this.$store.getters.extent) !== '{}') {
        this.defaultMap.extent = this.$store.getters.extent;
        this.defaultMap.center = new getCenter(this.defaultMap.extent);
        this.fitByExtent(this.$store.getters.extent, true, {
          padding: [100, 0, 100, 0]
        });
      }
    },

    // 初始化影像图层
    initImageLayer: function (obj) {
      let tileGrid = '';
      tileGrid = new TileGrid({
        resolutions: [
          0.703125, 0.3515625, 0.17578125, 0.087890625, 0.0439453125,
          0.02197265625, 0.010986328125, 0.0054931640625, 0.00274658203125,
          0.001373291015625, 0.0006866455078125, 0.00034332275390625,
          0.000171661376953125, 0.0000858306884765625, 0.0000429153442382812,
          0.0000214576721191406, 0.0000107288360595703, 0.00000536441802978515
        ],
        matrixIds: [
          0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17
        ],
        origin: [-180, 90]
      });

      let yx;
      //console.log(obj);
      if (obj.type == 1) {
        yx = new TileLayer({
          name: obj.name || '',
          index: obj.index || '',
          title: obj.title || '',
          visible: obj.visible || true,
          source: new XYZ({
            crossOrigin: 'anonymous',
            projection: 'EPSG:4326',
            //tileGrid: tileGrid,
            tileUrlFunction: function (tileCoord) {
              let url = obj.url;
              let z = tileCoord[0];
              let x = tileCoord[1];
              let y = tileCoord[2];
              url = url.split('{0}').join(z);
              url = url.split('{1}').join(x);
              url = url.split('{2}').join(y);
              return url;
            },
            wrapX: true
          })
        });
      } else {
        yx = new TileLayer({
          name: obj.name || '',
          index: obj.index || '',
          title: obj.title || '',
          visible: obj.visible || true,
          source: new XYZ({
            crossOrigin: 'anonymous',
            projection: 'EPSG:4326',
            tileGrid: tileGrid,
            tileUrlFunction: function (tileCoord) {
              let url = obj.url;
              let z = tileCoord[0];
              let x = tileCoord[1];
              let y = tileCoord[2];
              url = url.split('{0}').join(z);
              url = url.split('{1}').join(x);
              url = url.split('{2}').join(y);
              return url;
            },
            wrapX: true
          })
        });
      }
      return yx;
    },

    // 切换影像图层
    changeImageLayers: function (index) {
      let layer = this.defaultMap.imageLayers[index];

      this.defaultMap.imageLayers.forEach((v) => {
        if (v.name === layer.name) {
          v.active = !v.active;
        } else {
          v.active = false;
        }
      });

      if (this.imageLayerObj[layer.name]) {
        this.imageLayerObj[layer.name].setVisible(layer.active);
      } else {
        const temp = this.initImageLayer(layer);
        this.imageLayerObj[layer.name] = temp;
        this.addLayer(this.map, { layer: temp, position: 5 });
      }

      this.defaultMap.imageTitle = layer.active ? layer.title : '天地图';
      this.imageLayerInfo = layer;

      for (let key in this.imageLayerObj) {
        if (
          key !== layer.name &&
          key !== this.defaultMap.baseLayers[this.baseLayerIndex].noteName
        ) {
          this.imageLayerObj[key].setVisible(false);
        }
      }

      this.addNoteLayer();
    },

    //绘制区域遮罩
    drawAreaMask(obj) {
      let areaWkt = obj.areaWkt || false;
      let geoJson = new GeoJSON();

      let geojsonTemp = !areaWkt ? areaData.geo : formatWKT.parse(areaWkt);

      //console.log(geoJson.readFeatures(geojsonTemp)[0].getGeometry());

      //获取边界数据MultiPolygon数组
      //let ft = geoJson.readFeatures(geojsonTemp)[0].getGeometry().getGeometries();
      //获取绘制边界数据的数组，我的是数组中的第一个所以取[1]
      let linearRing = geoJson.readFeatures(geojsonTemp)[0].getGeometry();
      // 全球范围（太卡 抛弃）改取当前视窗的范围
      let extent = [-180, -90, 180, 90];
      // let polygonRing = fromExtent(linearRing.getExtent());获取Polygon的范围，太小因此改用视窗范围
      //获取当前窗口的范围
      //let extent = _this.map.getView().calculateExtent();
      //不想看到视窗外部线条因此做了计算
      for (let i = 0; i < extent.length; i++) {
        extent[0] = extent[0] - 0.04; //左
        extent[1] = extent[1] - 0.04; //下
        extent[2] = extent[2] + 0.04; //右
        extent[3] = extent[3] + 0.04; //上
      }
      //针对视窗范围设置Extent
      let polygonRing = fromExtent(extent);
      //把视窗范围添加至边界线中也就是确定外环位置
      polygonRing.appendLinearRing(linearRing);
      //把数据生成Feature
      let Polygons = new Feature({
        geometry: polygonRing
      });
      //实例化一个矢量图层Vector作为绘制层
      let vectorSource = new VectorSource({
        features: [Polygons]
        // features: geoJson.readFeatures(area),
      });

      const name = 'area_mask_layer';

      if (this.drawLayerObj[name]) {
        this.map.removeLayer(this.drawLayerObj[name]);
      }

      //创建一个图层并设置填充样式
      let vector = new VectorLayer({
        source: vectorSource,
        name: name,
        style: new olStyle({
          fill: new olStyleFill({
            color: 'rgba(0,0,0,.9)'
          })
          //   stroke: new olStyleStroke({
          //     lineDash: [1, 2, 3, 4, 5],
          //     color: '#ffcc33',
          //     width: 4,
          //   }),
        })
      });

      this.drawLayerObj[name] = vector;

      //设置图层层级
      vector.setZIndex(1);
      //添加至地图
      this.map.addLayer(vector);
    },

    initWmsLayer: function (layObj) {
      return new TileLayer({
        name: layObj.name || '',
        visible: layObj.visible,
        source: new TileWMS({
          url: layObj.url,
          params: {
            FORMAT: layObj.format || 'image/png',
            VERSION: layObj.version || '1.1.1',
            TILED: layObj.tiled || true,
            LAYERS: layObj.layers,
            EXCEPTIONS: 'application/vnd.ogc.se_inimage',
            //tilesOrigin: obj.tilesOrigin,
            CQL_FILTER: layObj.filter || '1=1',
            STYLES: layObj.styles
          }
        })
      });

      /* return new TileLayer({
        name: layObj.name || "",
        visible: layObj.visible,
        source: new TileWMS({
          url: layObj.url,
          params: {
            'TILED': true,
            'LAYERS': layObj.layers
          },
          serverType: 'geoserver',
        }),
      }); */
    },

    //添加比例尺
    addScaleLint: function () {
      var scaleLineControl = new ScaleLine({
        Units: 'metric' //单位有5种：degrees imperial us nautical metric
      });

      this.map.addControl(scaleLineControl);
    },

    // 地图放大
    zoomIn: function () {
      let zoom = this.view.getZoom();
      this.view.setZoom(zoom + 1);
    },

    // 地图缩小
    zoomOut: function () {
      let zoom = this.view.getZoom();
      this.view.setZoom(zoom - 1);
    },

    updateSize: function () {
      if (this.map) {
        this.map.updateSize();
      }
    },

    getZoom: function () {
      return this.view.getZoom();
    },

    /* setExtent: function (extent) {
      console.log('extent', extent)
      this.map.setExtent(extent)
    }, */

    loadFeatures: function (coordsArr, textField, coordField, coordsStyle) {
      let features = [];
      for (let i = 0; i < coordsArr.length; i++) {
        let coordsObj = coordsArr[i];
        let showText = coordsObj[textField];
        let feature = this.showCoordinate(
          coordsObj[coordField],
          null,
          coordsObj
        );
        let style = {}; //this.defaultMap.defaultStyle;
        if (coordsObj.olstyle) {
          //如果单个点单独设置样式使用单个点的样式
          style = coordsObj.olstyle;
          //feature.setStyle(this.setCoordStyle());
        } else if (coordsStyle) {
          //如果批量设置样式，使用批量的样式
          style = coordsStyle;
          //feature.setStyle(this.setCoordStyle(coordsStyle));
        } else {
          style = this.defaultMap.defaultStyle;
        }
        if (style.text) {
          style.text.text = showText; //Object.assign(style.text,{text:showText}) ;
        }
        if (feature) {
          feature.setStyle(this.setCoordStyle(style));
          features.push(feature);
        }
      }
      return features;
    },

    // 添加坐标图层，根据坐标添加图层
    addCoordinateLayer: function (dataOption) {
      /*
         name:图层名称
         coordsArr：[{}]需要绘制的坐标数据
         coordsStyle：全局样式
         fitOptions：地图自适应{padding：[10,10,10,10]}
         */
      //debugger
      //console.log(dataOption);
      let textField = dataOption.textField || 'name';
      let idField = dataOption.idField || 'id';
      let coordField = dataOption.coordField || 'coord';
      let name = dataOption.name; //图层名称
      let coordsArr = dataOption.coordsArr; //图层数组对象[{coord:"point(112 26)",olstyle:obj,id:'1',...}]coord:wkt坐标，id;数据唯一标识，点击事件绑定用，style点、线、面的独立样式
      let coordsStyle = dataOption.coordsStyle; //绘制的样式，若coordsArr未自定义olstyle，使用公共的样式去设置

      if (this.drawLayerObj[name]) {
        this.drawLayerObj[name].getSource().clear();
      } else {
        this.drawLayerObj[name] = new VectorLayer({
          source: new VectorSource(),
          name: name
        });

        if (dataOption.position) {
          var layersArray = this.map.getLayers();
          layersArray.insertAt(dataOption.position, this.drawLayerObj[name]);
        } else {
          this.map.addLayer(this.drawLayerObj[name]);
        }
      }
      let features = this.loadFeatures(
        coordsArr,
        textField,
        coordField,
        coordsStyle
      );
      this.drawLayerObj[name].getSource().addFeatures(features);

      if (dataOption.position) {
        this.drawLayerObj[name].setZIndex(dataOption.position);
      }

      if (dataOption.fit && features.length > 0) {
        if (!dataOption.fitOptions)
          dataOption.fitOptions = { padding: [100, 100, 100, 100] };
        this.fitByExtent(
          this.drawLayerObj[name].getSource().getExtent(),
          dataOption.isChangeZoom,
          dataOption.fitOptions
        );
      }
      //console.log(this.drawLayerObj);
      //console.log('typeof', typeof dataOption.vectorEventFun)
      //要素点击事件的方法
      this.bindEventForVector(
        this.drawLayerObj[name],
        dataOption.vectorEventFun,
        dataOption
      );

      //console.log(this.drawLayerObj[name]);
      return this.drawLayerObj[name];
    },
    getBufferGeometry: function (wkt, buffer) {
      var geom = new WKT().readGeometry(wkt);
      var geomTransform = null;
      var type = geom.getType();
      switch (type) {
        case 'LineString':
        case 'Point':
        case 'Polygon':
        case 'MultiPolygon':
        case 'MultiLineString':
        case 'MultiPoint':
          {
            var jstsGeom = OL3Parser.read(geom);
            var tol = buffer;
            tol = parseFloat(tol) / 111112;
            var buffered = jstsGeom.buffer(tol);
            geomTransform = OL3Parser.write(buffered);
          }
          break;
        default:
          break;
      }
      return geomTransform;
    },
    //获取根据wkt值返回缓冲区的wkt
    getBufferWkt: function (wkt, buffer) {
      var geometry = this.getBufferGeometry(
        wkt,
        buffer || this.trackPlayBackObj.buffer
      );
      var bugfferWkt = new WKT().writeGeometry(geometry);
      return bugfferWkt;
    },
    // 判断巡护轨迹点是否在责任区或网格内
    judgeIsIntersectsCoordinate: function (wkt1, wkt2) {
      let w1 = new WKT().readGeometryFromText(wkt1);
      let w2 = new WKT().readGeometryFromText(wkt2);
      return w1.intersectsCoordinate(w2.getCoordinates());
    },

    // 选择图层
    selectLayer: function (obj, callback) {
      let _this = this;

      let name = obj.name; //图层名称

      this.select = new Select({
        condition: click,
        style: new olStyle({
          image: new olStyleCircle({
            radius: 30,
            stroke: new olStyleStroke({
              width: 4,
              color: 'red'
            }),
            fill: new olStyleFill({
              color: 'green'
            })
          }),
          stroke: new olStyleStroke({
            width: 2,
            color: '#ffff00'
          })
          /* fill: new olStyleFill({
            color: 'green'
          }) */
        }),
        layers: [this.drawLayerObj[name]]
      });

      // 监听select事件
      this.select.on('select', function (e) {
        /* console.log('select', e) */

        if (e.selected.length > 0) {
          const feature = e.selected[0];
          const res = {};
          res.id = feature.getId();
          /* console.log('namee', id) */
          /* document.getElementById('msg').innerText = '被选中的要素：' + name; */

          if (callback && typeof callback == 'function') {
            callback.call(_this.drawLayerObj[name], res);
          }
        } else {
          const res = false;
          if (callback && typeof callback == 'function') {
            callback.call(_this.drawLayerObj[name], res);
          }
        }
      });

      // 添加单选工具
      this.map.addInteraction(this.select);
    },

    //
    addClusterCoordinateArryLayer: function (dataOption) {
      //聚合显示
      let textField = dataOption.textField || 'name';
      let idField = dataOption.idField || 'id';
      let coordField = dataOption.coordField || 'coord';
      let name = dataOption.name; //图层名称
      let distance = dataOption.distance || 50;
      let coordsArr = dataOption.coordsArr; //图层数组对象[{coord:"point(112 26)",olstyle:obj,id:'1',...}]coord:wkt坐标，id;数据唯一标识，点击事件绑定用，style点、线、面的独立样式
      let coordsStyle = dataOption.coordsStyle; //绘制的样式，若coordsArr未自定义olstyle，使用公共的样式去设置
      let clusterStyle = dataOption.clusterStyle;
      let unitName = dataOption.unitName || '';
      let self = this;

      if (this.drawLayerObj[name]) {
        //this.drawLayerObj[name].getSource().clear();
        this.map.removeLayer(this.drawLayerObj[name]);
        delete this.drawLayerObj[name];
        //this.drawLayerObj[name].getSource().clear();
      }

      let features = this.loadFeatures(
        coordsArr,
        textField,
        coordField,
        coordsStyle
      );

      let clusterSource = new ClusterSource({
        distance: distance,
        source: new VectorSource({
          features: features
        })
      });

      // else{
      this.drawLayerObj[name] = new VectorLayer({
        source: clusterSource,
        name: name,
        style: function (feature) {
          var size = feature.get('features').length;
          var style;
          if (size && size == 1) {
            style = feature.getProperties().features[0].getStyle();
          } else if (size > 1) {
            var param = {};
            var radius = 12;
            param.text = {};
            param.text.text = size.toString() + unitName;
            if (size > 9 && size < 100) {
              radius = 18;
            } else if (size >= 100 && size < 500) {
              radius = 22;
            } else if (size >= 500) {
              radius = 30;
            }
            //param.radius = radius;
            param.circle = {};
            param.circle.radius = radius;
            if (clusterStyle) {
              if (clusterStyle.circle) {
                /* param.circle.fill = clusterStyle.circle.fill;
                param.circle.stroke = clusterStyle.circle.stroke; */
                param.circle.image = clusterStyle.circle.image;
              }
              if (clusterStyle.text) {
                param.text.fill = clusterStyle.text.fill;
              }
            }
            //coordsStyle.circle.radius=radius;
            //coordsStyle.text.text=size.toString();
            style = self.setCoordStyle(param); //myMap.common.cluster.getStyle(param);
          }
          return style;
        }
      });

      this.map.addLayer(this.drawLayerObj[name]);
      this.drawLayerObj[name].getSource().addFeatures(features);

      if (dataOption.position) {
        this.drawLayerObj[name].setZIndex(dataOption.position);
      }
      if (dataOption.fit && features.length > 0) {
        this.fitByExtent(
          this.drawLayerObj[name].getSource().getExtent(),
          dataOption.isChangeZoom,
          dataOption.fitOptions
        );
      }
      //要素点击事件的方法
      //debugger;
      //this.bindEventForVector(this.drawLayerObj[name], dataOption.vectorEventFun);

      /* this.defaultMap.eventObjForVector['click'] = this.drawLayerObj[name];
        this.unBindEventForVector('click', name); */

      let eventTypeList = (
        dataOption.layerEventType || this.defaultMap.layerEventType
      ).split(',');
      eventTypeList.forEach((clickType) => {
        let eventFun = dataOption[clickType] || dataOption.vectorEventFun;

        this.unBindEventForVector(clickType, name);
        if (eventFun) {
          const key = this.map.on(clickType, (e) => {
            this.drawLayerObj[name]
              .getFeatures(e.pixel)
              .then((clickedFeatures) => {
                //
                if (clickedFeatures.length) {
                  // Get clustered Coordinates
                  let features = clickedFeatures[0].get('features');
                  if (features) {
                    if (features.length > 1) {
                      //返回聚合点的总数，大于1，地图级
                      this.zoomIn();

                      //根据点位，进行定位方法
                      const wktArr = [];
                      features.forEach((v) => {
                        if (v.values_.attr[coordField]) {
                          wktArr.push(v.values_.attr[coordField]);
                        }
                      });
                      this.fitByWKT(wktArr);

                      eventFun.call(e, '', null);
                    } else if (features.length == 1) {
                      let feature = features[0];
                      eventFun.call(e, e.coordinate, feature);
                      if (e && e.stopPropagation) {
                        //debugger;
                        e.stopPropagation();
                      } else {
                        e.cancelBubble = true;
                      }
                      //let featureAttr=feature.get('attr');
                      //console.log(featureAttr)
                    }
                  }
                  //dataOption.vectorEventFun(e.)

                  //console.log(features)
                  // if (features.length > 1) {
                  //   // const extent = boundingExtent(
                  //   //   features.map((r) => r.getGeometry().getCoordinates())
                  //   // );
                  //   //map.getView().fit(extent, {duration: 1000, padding: [50, 50, 50, 50]});
                  // }else if(features.length==1){

                  // }
                }
              });
          });
          this.defaultMap.eventObjForVector[clickType][name] = key;
        }
      });

      /* setTimeout(() => {
          this.map.un(key.type, key.listener);
        }, 3000); */
      return this.drawLayerObj[name];
      // }
    },

    // 新增绘制功能，未整理 START

    getByType: function (type, style, select) {
      type = (type || '').toLocaleLowerCase();
      var obj = {};
      style = style || {};
      if (type == 'point' || type == 'multipoint') {
        type = 'point';
        if (select != true) {
          obj = $.extend({}, myMap.deafaultStyle['point'], style['point']);
          obj.text = $.extend(
            {},
            myMap.deafaultStyle['text_select'],
            style['text']
          );
        } else {
          obj = $.extend(
            {},
            myMap.deafaultStyle['point_select'],
            style['point_select']
          );
          obj.text = $.extend(
            {},
            myMap.deafaultStyle['text_select'],
            style['text_select']
          );
        }
      } else if (type == 'linestring' || type == 'multilinestring') {
        type = 'linestring';
        if (select != true) {
          obj = $.extend(
            {},
            myMap.deafaultStyle['linestring'],
            style['linestring']
          );
          obj.text = $.extend(
            {},
            myMap.deafaultStyle['text_select'],
            style['text']
          );
        } else {
          obj = $.extend(
            {},
            myMap.deafaultStyle['linestring_select'],
            style['linestring_select']
          );
          obj.text = $.extend(
            {},
            myMap.deafaultStyle['text_select'],
            style['text_select']
          );
        }
      } else if (type == 'polygon' || type == 'multipolygon') {
        type = 'polygon';
        if (select != true) {
          obj = $.extend({}, myMap.deafaultStyle['polygon'], style['polygon']);
          obj.text = $.extend(
            {},
            myMap.deafaultStyle['text_select'],
            style['text_select']
          );
        } else {
          obj = $.extend(
            {},
            myMap.deafaultStyle['polygon_select'],
            style['polygon_select']
          );
          obj.text = $.extend(
            {},
            myMap.deafaultStyle['text_select'],
            style['text_select']
          );
        }
      } else {
        type = 'commonStyle';
      }
      var style = this[type](obj);
      if (select == true) {
        if (style.setZIndex) {
          style.setZIndex(1000);
        } else if (style) {
          $.each(style || [], function (a, b) {
            if (b.setZIndex) {
              b.setZIndex(1000);
            }
          });
        }
      }
      return style;
    },

    // 删除图层，根据图层名字删除图层
    removeLayer: function (data) {
      let name = data.name;
      if (this.drawLayerObj[name]) {
        this.map.removeLayer(this.drawLayerObj[name]);
        delete this.drawLayerObj[name];
      }
    },
    //删除geosever图层
    removeWmsLayer(name) {
      if (this.wmsLayerObj[name]) {
        this.map.removeLayer(this.wmsLayerObj[name]);
        delete this.wmsLayerObj[name];
      }
    },
    // 重置地图到默认中心点及缩放
    resetView: function (data) {
      this.view.animate({
        center: this.defaultMap.center,
        zoom: this.defaultMap.zoom
      });
    },

    // 绘制图层
    drawLayer: function (data, callback) {
      let _this = this;

      let name = data.name;
      let style = data.style || this.defaultMap.defaultStyle;
      if (this.draw) {
        this.map.removeInteraction(this.draw);
      }
      if (this.snap) {
        this.map.removeInteraction(this.snap);
      }
      if (!this.drawLayerObj[name]) {
        this.drawLayerObj[name] = new VectorLayer({
          source: new VectorSource(),
          name: name
        });
        this.drawLayerObj[name].setStyle(this.setCoordStyle(style));
        /* this.map.addLayer(this.drawLayerObj[name]) */

        this.map.addLayer(this.drawLayerObj[name]);
      }

      let geometryFunction, maxPoints;

      this.draw = new Draw({
        source: this.drawLayerObj[name].getSource(),
        type: data.type, //Point,LineString,Polygon,Circle
        //几何信息变更时调用函数
        geometryFunction: geometryFunction,
        //最大点数
        maxPoints: maxPoints
      });

      this.draw.setActive(true);
      this.map.addInteraction(this.draw);
      /* console.log(this.draw);
      return; */
      this.snap = new Snap({
        source: this.drawLayerObj[name].getSource()
      });
      this.map.addInteraction(this.snap);

      this.draw.on(
        'drawstart',
        function (e) {
          if (data.single == true) {
            _this.drawLayerObj[name].getSource().clear();
          }
          var lastCoord = _this.drawLayerObj[name].getSource().getFeatures()[0]; //取第一个坐标
          var lasttype;
          if (lastCoord) {
            lasttype = lastCoord.getGeometry().getType();
          }
          if (!lasttype || lasttype != data.type) {
            _this.drawLayerObj[name].getSource().clear();
          }
        },
        this
      );

      this.draw.on(
        'drawend',
        function (e) {
          var feature = e.feature;
          var features = _this.drawLayerObj[name].getSource().getFeatures();
          features.push(feature); //到第十个以后顺序会错乱
          feature.setStyle(_this.setCoordStyle(style));
          if (callback && typeof callback == 'function') {
            setTimeout(function () {
              var returnData = _this.getAllTypeValue(
                features,
                data.isOpenDFM,
                data.fractionDigits,
                feature
              );
              /* console.log('returnData', returnData); */
              callback.call(_this.drawLayerObj[name], returnData, features);
            }, 100);
          }
        },
        this
      );
      if (data.modify) {
        //可移动坐标

        if (this.modify == null) {
          this.modify = new Modify({
            source: this.drawLayerObj[name].getSource()
          });

          this.map.addInteraction(this.modify);
        }

        this.modify.on(
          'modifyend',
          function (e) {
            var features = e.features.getArray();

            if (features.length > 0) {
              if (callback && typeof callback == 'function') {
                var returnData = _this.getAllTypeValue(
                  features,
                  data.isOpenDFM,
                  data.fractionDigits
                );
                /* this.drawLayerObj[name].globalCoordinate = returnData; */
                /* console.log(returnData) */
                callback.call(_this.drawLayerObj[name], returnData);

                /* const geometry = e.features.getGeometry()
                let pointArr = geometry.getCoordinates()
                callback.call(this.drawLayerObj[name], pointArr); */
              }
            }
          },
          this
        );
      }
    },

    //设置绘制图层开关
    setDrawLayerActice: function (obj) {
      var name = obj.name;
      if (this.drawLayerObj[name]) {
        this.draw.setActive(obj.active == true ? true : false);
      }
    },

    //清除绘制图层
    clearDrawLayer: function (obj, callback) {
      var name = obj.name;

      if (this.drawLayerObj[name]) {
        this.drawLayerObj[name].getSource().clear();
      }

      if (this.draw) {
        this.map.removeInteraction(this.draw);
      }
      if (this.snap) {
        this.map.removeInteraction(this.snap);
      }
      const res = {
        x: '',
        y: '',
        x2: '',
        y2: '',
        type: '',
        wktValue: '',
        firstPoint: ''
      };
      if (callback && typeof callback == 'function') {
        callback.call(this.drawLayerObj[name], res);
      }
    },

    getAllTypeValue: function (features, isOpenDFM, fractionDigits, feature) {
      isOpenDFM = isOpenDFM || this.isOpenDFM;
      fractionDigits = fractionDigits || this.fractionDigits;
      var value = features[0].getGeometry().clone().getExtent() || [];
      for (var i = 1; i < features.length; i++) {
        value = extend(value, features[i].getGeometry().getExtent());
      }

      var type = features[0].getGeometry().clone().getType();

      if (type.toLocaleLowerCase() == 'point') {
        value[2] = '';
        value[3] = '';
      }
      value = this.judgeIsToDFM(value, isOpenDFM, fractionDigits);
      var result = {};
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

    toStringHDMS: function (x, y, fractionDigits) {
      var result = ['', ''];
      if (x && x != '' && y && y != '') {
        var str;
        if (fractionDigits) {
          str = new olCoordinate.toStringHDMS([x, y], fractionDigits); //返回例如："25° 53′ 11.07″ N 114° 57′ 09.72″ E"
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
    toStringXY: function (x, y, fractionDigits) {
      var result = ['', ''];
      if (x && x != '' && y && y != '') {
        var str;
        if (fractionDigits) {
          str = new toStringXY([x, y], fractionDigits); //返回例如："114.986, 25.817"
        } else {
          str = x + ',' + y;
        }
        str = str.replace(/ /g, '').split(',');
        result[0] = str[1];
        result[1] = str[0];
      }
      return result;
    },

    //将四至换算
    judgeIsToDFM: function (extent, isOpenDFM, fractionDigits) {
      fractionDigits = fractionDigits || this.fractionDigits;
      isOpenDFM = isOpenDFM || this.isOpenDFM;
      if (isOpenDFM) {
        var result = this.toStringHDMS(extent[0], extent[1], fractionDigits);
        var result2 = this.toStringHDMS(extent[2], extent[3], fractionDigits);
        return [result[0], result[1], result2[0], result2[1]];
      } else {
        var result = this.toStringXY(extent[0], extent[1], fractionDigits);
        var result2 = this.toStringXY(extent[2], extent[3], fractionDigits);
        return [result[0], result[1], result2[0], result2[1]];
      }
    },

    //根据元素取坐标类型
    getTypeByFeature: function (feature) {
      return feature.getGeometry().getType();
    },

    //根据元素取wkt
    getWKTByFeature: function (feature) {
      return new WKT().writeGeometry(feature.getGeometry());
    },

    //根据多个要素取wkt坐标值（拼接的形式，对于相交的面拼成多面是否会造成无效坐标待考证）
    getWKTValueByFeatures: function (features) {
      if (features == null || features.length == 0) {
        return '';
      }
      if (features.length == 1) {
        return this.getWKTByFeature(features[0]);
      } else {
        var type = this.getTypeByFeature(features[0]);

        var arr = [];
        for (var i = 0; i < features.length; i++) {
          var data = this.getWKTByFeature(features[i]);
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

    //取第一点坐标
    getFirstPoint: function (feature) {
      if (!feature) {
        return null;
      }
      var type = feature.getGeometry().getType();
      var firstCoordinates = feature.getGeometry().getCoordinates();
      if (type.toLocaleLowerCase() == 'point') {
        firstCoordinates = firstCoordinates;
      } else if (type.toLocaleLowerCase() == 'linestring') {
        firstCoordinates = firstCoordinates[0];
      } else if (type.toLocaleLowerCase() == 'polygon') {
        firstCoordinates = firstCoordinates[0][0];
      }
      return 'POINT(' + firstCoordinates[0] + ' ' + firstCoordinates[1] + ')';
    },

    // 新增绘制功能，未整理 END

    //过滤，新
    getLayerFilter: function (params) {
      var filter = [];
      //   filter.push("is_delete=0");

      /* var yearNo = layName.substr(layName.lastIndexOf("_") + 1);
      if (!isNaN(yearNo)) {
        filter.push(" year_no = '" + yearNo + "'");
      } */

      let res = '';

      if (params.is_delete !== undefined && params.is_delete !== '') {
        filter.push(`is_delete = ${params.is_delete}`);
      }

      if (params.areaCode !== undefined && params.areaCode !== '') {
        filter.push(`area_code like '${params.areaCode}%'`);
      }

      if (params.bnCode !== undefined && params.bnCode !== '') {
        filter.push(`bn_code like '${params.bnCode}%'`);
      }

      if (params.sbuCode !== undefined && params.sbuCode !== '') {
        filter.push(`sbu_code like '${params.sbuCode}%'`);
      }

      if (params.yearNo !== undefined && params.yearNo !== '') {
        filter.push(`year_no = '${params.yearNo}'`);
      }

      if (params.nian_du !== undefined && params.nian_du !== '') {
        filter.push(`${params.nian_du}`);
      }

      if (params.hs_bhyy !== undefined && params.hs_bhyy !== '') {
        filter.push(`${params.hs_bhyy}`);
      }

      if (params.sheng !== undefined && params.sheng !== '') {
        filter.push(`${params.sheng}`);
      }

      if (params.shi !== undefined && params.shi !== '') {
        filter.push(`${params.shi}`);
      }

      if (params.xian !== undefined && params.xian !== '') {
        filter.push(`${params.xian}`);
      }

      if (params.areaCodes !== undefined && params.areaCodes !== '') {
        filter.push(`${params.areaCodes}`);
      }

      /* for (var i = 0; i < legendTr.length; i++) {
        var tr = $(legendTr[i]);
        var field = tr.attr("data-field");
        var fieldValue = tr.attr("data-filter") || '';
        if (fieldValue.length > 0 && tr.hasClass("disabled-legend")) {
          filter.push("(" + field + "<>" + fieldValue + ")");
        }
      } */
      /* var paramStr = filter.join(" and");
      if (filter.length > 0) {
        areaStr = areaStr + " and" + paramStr
      } */
      res = filter.join(' and ');
      return res;
    },

    // 叠加wms图层服务
    addWmsLayer: function (dataOption) {
      let layerInfo = dataOption.layerInfo;
      let layer = {};
      let name = layerInfo.name || layerInfo.layerName;
      let layerName = layerInfo.layerName || name;
      let work = layerInfo.work || this.defaultMap.geoServerWork; //config.mapConfig.geoserverWork; //工作空间

      /* let filter = layerInfo.filter || this.getLayerFilter(this.query) */
      /* console.log(filter)
      return */
      if (this.wmsLayerObj[name]) {
        this.wmsLayerObj[name].setVisible(layerInfo.visible);
        if (layerInfo.filter && layerInfo.filter.length > 0) {
          this.updateLayerByFilter(this.wmsLayerObj[name], layerInfo.filter);
        }
      } else {
        let url = layerInfo.url || this.defaultMap.geoServerUrl;
        layer.url = `${url}${work}/wms`;
        layer.layers = `${work}:${layerName}`;
        layer.name = name;
        layer.position = layerInfo.position;
        layer.visible = layerInfo.visible;
        layer.filter = layerInfo.filter;
        layer.format = layerInfo.format || 'image/png';
        layer.version = layerInfo.version || '1.1.1';
        let layerObj = this.initWmsLayer(layer);

        /* let layerObj = new TileLayer({
          source: new TileWMS({
            url: layer.url,
            params: {
              'TILED': true,
              'LAYERS': layer.layers
            },
            serverType: 'geoserver',
          }),
        }); */

        if (layerInfo.position) {
          var layersArray = this.map.getLayers();
          layersArray.insertAt(layerInfo.position, layerObj);
        } else {
          this.map.addLayer(layerObj);
        }
        this.wmsLayerObj[name] = layerObj;

        if (layerInfo.position) {
          this.wmsLayerObj[name].setZIndex(layerInfo.position);
        }

        // 更新地图缩放
        if (layerInfo.fit) {
          this.map.getView().fit(this.defaultMap.extent, this.map.getSize());
        }

        // setTimeout(function(){
        //   self.fitByExtent(layerObj.getSource().tmpExtent_)
        // },500)
        //console.log(layerObj.getSource().tmpExtent_)

        if (typeof dataOption.layerEventFun == 'function') {
          this.bindEventForWmsLayer(dataOption);
        }
      }
    },

    updateWmsLayersForBncode: function (bnCode) {
      if (!bnCode) {
        //console.log('返回了');
        return;
      }
      const obj = this.wmsLayerObj;
      for (const k in obj) {
        if (Object.hasOwnProperty.call(obj, k)) {
          const v = obj[k];
          let visible = v.getVisible();
          if (visible) {
            const name = v.values_.name;

            let year = name.split('|');
            year = year[1];

            let filter = {};
            filter.bnCode = bnCode;
            filter.yearNo = year;
            filter = this.getLayerFilter(filter);

            this.updateLayerByFilter(v, filter);
          }
        }
      }
    },

    addPopup: function (popupObj) {
      let popup_ = null;
      if (popupObj.img) {
        //判断弹框是否全部是图片
        document.getElementsByClassName(
          `popupImg_${this.id}`
        )[0].style.display = 'block';
        popup_ = document.getElementsByClassName(`popupImg_${this.id}`)[0];
        this.imgType = popupObj.imgType;
      } else {
        document.getElementById(`popup_${this.id}`).style.display = 'block';
        popup_ = document.getElementById(`popup_${this.id}`);
      }

      this.popupLoading = true;
      //document.getElementById("popup-content").innerHTML = popupObj.content;
      this.popupData = Object.assign({}, popupObj);
      document.getElementById(`popup_${this.id}`).style.display = 'block';
      let popupWidth = 424;
      let popupHeight = 194;
      //框默认高度 + 获取文本内容渲染高度 + 默认40像素间隔
      popupHeight =
        popupHeight + 40 * Math.ceil(this.popupData.content.length / 2) + 40;
      if (this.scaleValue !== 1) {
        popupHeight = popupHeight * this.scaleValue;
      }
      if (!this.popupLayer) {
        // let popupWidth = document.getElementById(
        //   `popup_${this.id}`
        // ).offsetWidth;
        // let popupHeight = document.getElementById(
        //   `popup_${this.id}`
        // ).offsetHeight;
        let popupLayer = new Overlay({
          element: document.getElementById(`popup_${this.id}`),
          //当前窗口可见
          autoPan: popupObj.autoPan || true,
          positioning: popupObj.positioning || 'bottom-center',
          stopEvent: popupObj.stopEvent || true,
          offset: popupObj.offset || [-(popupWidth / 2), -popupHeight],
          autoPanAnimation: {
            //当Popup超出地图边界时，为了Popup全部可见，地图移动的速度
            duration: popupObj.duration || 250
          }
        });
        this.popupLayer = popupLayer;
      } else {
        this.popupLayer.setOffset([-(popupWidth / 2), -popupHeight]);
      }

      this.map.addOverlay(this.popupLayer);
      this.popupLayer.setPosition(popupObj.coords);
      this.popupLoading = false;
    },

    closePopup: function (callback) {
      //console.log('关闭的popupLayer', this.popupLayer);
      if (this.popupLayer) {
        this.popupLayer.setPosition(null);
        document.getElementById(`popup_${this.id}`).style.display = 'none';

        //删除src\views\forestry-resource-monitor-system\dropchart-analysis-display\comprehensive-display.vue里定义的点击高亮图层
        if (this.drawLayerObj['light_layer']) {
          this.map.removeLayer(this.drawLayerObj['light_layer']);
          delete this.drawLayerObj['light_layer'];
        }
      }
    },

    destroyPopup: function () {
      this.map.getOverlays().clear();
      this.map.removeOverlay(this.popupLayer);
    },
    showVideoConnection(data) {
      this.videoData = {
        id: data.id,
        tel: data.tel,
        name: data.name,
        show: true
      };
    },
    handlePopupBtn: function (v) {
      if (v.type === 'dialog') {
        this.$emit(v.dialog.name, v.dialog.visible, v.dialog.params);
        return;
      }
      this.showVideoConnection(v.data);
      // window.open(v.url);
    },

    //根据筛选参数更新图层
    updateLayerByFilter: function (layer, filter) {
      var filterParams = {
        CQL_FILTER: null
      };
      if (filter.replace(/^\s\s*/, '').replace(/\s\s*$/, '') != '') {
        filterParams['CQL_FILTER'] = filter;
      }
      layer.getSource().updateParams(filterParams);
      layer.getSource().refresh({ force: true, active: true });
    },

    bindEventForWmsLayer: function (layobj) {
      if (!layobj) {
        return;
      }
      let eventTypeList = (
        layobj.layerEventType || this.defaultMap.layerEventType
      ).split(',');
      eventTypeList.forEach((clickType) => {
        this.unBindEventForVector(clickType, 'wmslayerevent');
        let self = this;
        let key = this.map.on(clickType, function (e) {
          let layersInfo = {};
          for (let name in self.wmsLayerObj) {
            if (self.wmsLayerObj[name].getVisible()) {
              let url = self.getWmsUrlInfo(
                e.coordinate,
                self.wmsLayerObj[name],
                layobj.param
              );
              layersInfo[name] = url;
            }
          }
          if (
            [typeof layobj[clickType], typeof layobj.layerEventFun].includes(
              'function'
            )
          ) {
            let eventFun = layobj[clickType] || layobj.layerEventFun;
            eventFun.call(e, e.coordinate, layersInfo);
          }
        });
      });
    },

    // 绑定要素的点击事件
    bindEventForVector: function (layobj, mapEventCallBack, dataOption) {
      //console.log('layobj', layobj);
      if (!layobj) {
        return;
      }
      let layerName = layobj.get('name');
      let eventTypeList = (
        dataOption.layerEventType || this.defaultMap.layerEventType
      ).split(',');
      eventTypeList.forEach((clickType) => {
        this.unBindEventForVector(clickType, layerName);
        let self = this;
        let featureKey = this.map.on(
          clickType,
          function (e) {
            var feature = self.getFeatureByPixel(e.pixel, layobj);
            if (
              [typeof mapEventCallBack, typeof dataOption[clickType]].includes(
                'function'
              )
            ) {
              let eventFun = dataOption[clickType] || mapEventCallBack;
              eventFun.call(e, e.coordinate, feature, layerName);
            }
          },
          { hitTolerance: 8 }
        );
        this.defaultMap.eventObjForVector[clickType][layerName] = featureKey;
      });
    },

    getWmsUrlInfo: function (coordinate, layer, param) {
      if (param) {
        param = Object.assign(
          { INFO_FORMAT: 'application/json', FEATURE_COUNT: 50 },
          param
        );
      } else {
        param = { INFO_FORMAT: 'application/json', FEATURE_COUNT: 50 };
      }

      //param = Object.assign( { 'INFO_FORMAT': 'application/json', 'FEATURE_COUNT': 50 },param) ;//$.extend({},, param);
      var source = layer.getSource();
      //console.log(source)
      var url = source.getFeatureInfoUrl(
        coordinate,
        this.view.getResolution(),
        this.view.getProjection(),
        param
      );
      return url;
    },

    getFeatureByPixel: function (pixel, layobj) {
      let feature = this.map.forEachFeatureAtPixel(
        pixel, //遍历所有像素点，只有有存在该图层则返回元素
        function (feature, layer) {
          if (feature) {
            if (layer != null) {
              let name = layer.get('name');
              if (name == layobj.get('name')) {
                return feature;
              }
            }
          }
        }
      );
      return feature;
    },

    unBindEventForVector: function (eventType, layerName) {
      //解绑元素的点击事件
      //   console.log('执行了', this.defaultMap.eventObjForVector);
      var key = this.getEventObjByLayerName(eventType, layerName);
      if (key) {
        unByKey(key);
        this.defaultMap.eventObjForVector[eventType][layerName] = null;
      }
    },

    getEventObjByLayerName: function (eventType, layerName) {
      let eventObj = this.defaultMap.eventObjForVector[eventType];
      let result;
      if (eventObj) {
        result = eventObj[layerName];
      }
      return result;
    },

    fitByExtent: function (extent, changeZoom, fitoptions, map) {
      //debugger
      map = map || this.map;
      fitoptions = fitoptions || {};
      changeZoom = changeZoom == false ? false : true;
      var zoom = this.view.getZoom();
      if (!changeZoom) {
        fitoptions = Object.assign(fitoptions, {
          maxZoom: zoom,
          minZoom: zoom,
          constrainResolution: true
        }); //对象合并，相当于jquery的$.extend({}, fitoptions || {}, { maxZoom: zoom, minZoom: zoom, constrainResolution: true });
        this.view.fit(extent, fitoptions);
      } else {
        this.view.fit(extent, fitoptions);
      }
    },

    //设置坐标样式
    setCoordStyle: function (olStyleObj) {
      let style = {};
      var styleArr = [];
      if (olStyleObj) {
        var styleObj = lodash.cloneDeep(olStyleObj);
        if (styleObj.text) {
          //设置文本样式
          let olStyle = {}; //style.text={};
          olStyle = styleObj.text; //文本样式

          if (styleObj.text.fill) {
            olStyle.fill = new olStyleFill(styleObj.text.fill); //文本填充
          }
          if (styleObj.text.stroke) {
            olStyle.stroke = new olStyleStroke(styleObj.text.stroke); //线宽
          }
          //let textOlStyle = new olStyleText(olStyle); //设置文本样式
          style.text = new olStyleText(olStyle); //textOlStyle;
          //let textStyle=new olStyle({text:textOlStyle});
          //styleArr.push(textStyle);
        }
        if (styleObj.fill) {
          style.fill = new olStyleFill(styleObj.fill);
          //styleArr.push(new olStyle({fill:new olStyleFill(styleObj.fill)}));
          //styleArr.push(new olStyleFill(styleObj.fill));
        } else {
          style.fill = new olStyleFill(this.defaultMap.defaultStyle.fill);
        }
        if (styleObj.stroke) {
          //styleArr.push(new olStyle({stroke:new olStyleStroke(styleObj.stroke)}));
          //styleArr.push(new olStyleStroke(styleObj.stroke));
          style.stroke = new olStyleStroke(styleObj.stroke);
        } else {
          style.stroke = new olStyleStroke(this.defaultMap.defaultStyle.stroke);
        }
        styleArr.push(new olStyle(style));
        if (styleObj.image) {
          let iconStyle = {};
          iconStyle.image = new olStyleIcon(styleObj.image);
          iconStyle.geometry = function (feature) {
            var type = feature.getGeometry().getType().toLocaleLowerCase();
            var coordinates = feature.getGeometry().getCoordinates();
            if (type == 'point') {
              return feature.getGeometry(); //返回自身
            } else if (type == 'multipoint') {
              return feature.getGeometry(); //返回自身
            } else if (type == 'linestring') {
              var arr = [];
              arr.push(coordinates[0]);
              arr.push(coordinates[coordinates.length - 1]);
              return new MultiPoint(arr); //返回线的头尾点
            } else if (type == 'multilinestring') {
              var arr = [];
              for (var i = 0; i < coordinates.length; i++) {
                arr.push(coordinates[i][0]);
                arr.push(coordinates[i][coordinates[i].length - 1]);
              }
              return new MultiPoint(arr); //返回每条线的头尾点
            } else if (type == 'polygon') {
              //debugger
              return new Point(coordinates[0][0]); //返回第一点
            } else if (type == 'multipolygon') {
              var arr = [];
              for (var i = 0; i < coordinates.length; i++) {
                arr.push(coordinates[i][0][0]);
              }
              return new MultiPoint(arr); //返回多个面的第一点
            }
          };
          styleArr.push(new olStyle(iconStyle));
        }
        if (styleObj.circle) {
          let circleStyle = {}; //style.text={};
          circleStyle = styleObj.circle; //文本样式
          if (styleObj.circle.fill) {
            circleStyle.fill = new olStyleFill(styleObj.circle.fill); //文本填充
          } /*  else {
            circleStyle.fill = new olStyleFill(
              this.defaultMap.defaultStyle.circle.fill
            ); //文本填充
          } */
          if (styleObj.circle.stroke) {
            circleStyle.stroke = new olStyleStroke(styleObj.circle.stroke); //线宽
          } /*  else {
            circleStyle.stroke = new olStyleStroke(
              this.defaultMap.defaultStyle.circle.stroke
            ); //线宽
          } */

          if (styleObj.circle.image) {
            circleStyle.image = new olStyleIcon(styleObj.circle.image); //线宽
            styleArr.push(new olStyle(circleStyle));
          } else {
            styleArr.push(
              new olStyle({ image: new olStyleCircle(circleStyle) })
            );
          }

          //style.image=new olStyleCircle(circleStyle)//设置文本样式
        }
      }
      return styleArr;
    },

    showCoordinate: function (coords, olStyle, attrObj) {
      /*
          coords:wkt坐标
          olStyle：样式
          attrObj：元素绑定的属性信息
        */
      if (coords) {
        let feature;
        let _geometry = new WKT().readGeometry(coords);
        feature = new Feature({
          geometry: _geometry
        });
        if (attrObj) {
          //将属性信息绑定到这个坐标元素上
          feature.set('attr', attrObj);

          //设置ID
          feature.setId(attrObj.id);
        }
        if (olStyle) {
          feature.setStyle(olStyle);
        }
        return feature;
      } else {
        //console.log(coords)
        //throw new Error("坐标未定义");
      }
    },

    fitByWKT: function (wktArr, changeZoom = true, fitoptions, map) {
      let extent = this.getExtentForWktArr(wktArr);
      this.fitByExtent(extent, changeZoom, fitoptions, map);
    },

    getExtentForWktArr: function (wktArr) {
      let extent = [];
      if (wktArr) {
        let geometry;
        for (let i = 0; i < wktArr.length; i++) {
          geometry = new WKT().readGeometry(wktArr[i]);
          if (i == 0) {
            extent = geometry.getExtent();
          } else {
            extent = extend(extent, geometry.getExtent());
          }
        }
      }
      return extent;
    },

    //删除图层，根据图层名字
    removeLayerByName: function (layerName) {
      //根据图层名称移除图层
      let layer = this.getLayerByName(layerName);
      if (layer) {
        this.map.removeLayer(layer);
        delete this.drawLayerObj[layerName];
      }
    },

    //获取图层，根据图层名字
    getLayerByName: function (layerName) {
      var layers = this.map.getLayers();
      let layer;
      if (layers) {
        let layArr = layers.getArray();
        for (let index in layArr) {
          let item = layArr[index];
          if (item.getLayers) {
            for (let node in item.getLayers().getArray()) {
              if (layerName == node.get('name')) {
                layer = item;
                return layer;
              }
            }
          } else {
            if (layerName == item.get('name')) {
              layer = item;
              return layer;
            }
          }
        }
      }
      return layer;
    }
  }
};
</script>
<style scoped>
/* #map {
  height: 100vh;
  width: 100vw;
} */

.map-layer {
  position: relative;
  overflow: hidden;
}

.map-panel {
  width: 100%;
  height: 100%;
  /* height: 100vh; */
}
.ol-zoom {
  top: auto;
  left: auto;
  right: 0.5rem;
  bottom: 10rem;
}
/* 选择图层 */
.map-base-layer {
  position: absolute;
  right: 54px;
  bottom: 46px;
}

/* 选择图层大小 */
.map-base-layer .item {
  width: 200px;
  height: 100px;
  float: left;
  border: 1px solid rgba(2, 11, 38, 0.9);
  cursor: pointer;
  position: relative;
}
.map-base-layer .item .mark {
  background: rgba(0, 0, 0, 0.3);
  width: 100%;
  height: 100%;
}
.map-base-layer .item .title {
  width: 40px;
  height: 20px;
  line-height: 20px;
  text-align: center;
  color: #fff;
  font-size: 14px;
  position: absolute;
  top: 0;
  left: 0;
}
.map-base-layer .selected {
  border: 1px solid #1890ff;
}
.map-base-layer .selected .title {
  background-color: #1890ff;
}
.map-base-layer .selected .mark {
  background: transparent;
}

.map-base-layer .item.vec {
  background: url(./image/vec-c.png) no-repeat;
  background-size: 100%;
}
.map-base-layer .item.img {
  background: url(./image/img-c.png) no-repeat;
  background-size: 100%;
}
.map-base-layer .item.ter {
  background: url(./image/ter-c.png) no-repeat;
  background-size: 100%;
}
.popup {
  position: absolute;
  display: none;
}
.popup .body {
  width: 424px;
  overflow: hidden;
  position: relative;
}
.popup .body .hd {
  background: url('./image/point-item-bg-hd.png') no-repeat;
  width: 424px;
  height: 80px;
  overflow: hidden;
  position: relative;
}
.popup .body .bd {
  background: url('./image/point-item-bg-bd.png') repeat-y;
  width: 424px;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}
.popup .body .ft {
  background: url('./image/point-item-bg-ft.png') no-repeat;
  width: 424px;
  height: 80px;
  overflow: hidden;
  position: relative;
}
.popup .close {
  background: url('./image/point-item-close.png') no-repeat;
  width: 64px;
  height: 32px;
  overflow: hidden;
  position: absolute;
  top: 7px;
  right: 7px;
  cursor: pointer;
}
.popup .title {
  width: 200px;
  font-family: YouSheBiaoTiHei;
  font-size: 28px;
  color: #ffffff;
  line-height: 1;
  text-shadow: 0 2px 12px #0a53fa;
  font-weight: 400;
  position: absolute;
  top: 20px;
  left: 20px;
  border-bottom: 1px solid;
  border-image: linear-gradient(
      90deg,
      rgba(8, 108, 235, 0) 0%,
      rgba(8, 108, 235, 0.5) 50%,
      rgba(8, 108, 235, 0) 100%
    )
    30 3;
}
.popup .close:hover {
  background-image: url('./image/point-item-close-hover.png');
  top: 6px;
}
.popup .bd .item {
  width: 50%;
  line-height: 40px;
  color: #fff;
  border-bottom: 1px solid;
  border-image: linear-gradient(
      90deg,
      rgba(8, 108, 235, 0) 0%,
      rgba(8, 108, 235, 0.5) 50%,
      rgba(8, 108, 235, 0) 100%
    )
    30 3;
  overflow: hidden;
}
.popup .bd .item span {
  display: inline-block;
  vertical-align: top;
}
.popup .bd .item .value {
  width: calc(100% - 80px);
  line-height: 26px;
  font-size: 18px;
  color: rgba(149, 182, 220, 1);
  margin-left: 10px;
  display: inline-block;
  /* text-overflow: ellipsis;
  white-space: nowrap; */
  word-break: break-word;
  padding: 7px 0;
}
.popup .bd .item .value.value-time {
  width: 100px;
  font-size: 16px;
  line-height: 20px;
  height: 40px;
  white-space: normal;
}
.popup .ft {
  text-align: center;
}

.popup .btn {
  background: url('./image/point-item-btn.png') no-repeat;
  width: 112px;
  height: 39px;
  line-height: 39px;
  color: #fff;
  text-align: center;
  margin: 20px auto 0;
  overflow: hidden;
  cursor: pointer;
  display: inline-block;
}
.popup .btn:hover {
  background-image: url('./image/point-item-btn-hover.png');
}

.popup .arrow {
  background: url('./image/point-item-arrow.png') no-repeat;
  width: 45px;
  height: 24px;
  margin: 0 auto 10px;
  overflow: hidden;
}
.popup .label {
  background: url('./image/point-item-label.png') no-repeat;
  width: 93px;
  height: 29px;
  line-height: 27px;
  color: #fff;
  text-align: center;
  margin: 0 auto 30px;
  overflow: hidden;
}

.map-selects {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 1;
}

.map-info {
  background-color: rgba(2, 11, 38, 0.9);
  height: 26px;
  line-height: 26px;
  color: #fff;
  font-size: 12px;
  padding: 0 10px;
  position: absolute;
  right: 10px;
  bottom: 10px;
}

.map-control {
  border-radius: 2px;
  /* border: 1px solid rgba(101, 216, 227, 0.4); */
  background-color: rgba(2, 11, 38, 0.9);
  position: absolute;
  right: 10px;
  bottom: 46px;
  width: 34px;
  text-align: center;
  font-size: 14px;
  float: right;
}

.map-control .item {
  width: 100%;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  border: 1px solid rgba(101, 216, 227, 0.4);
}
.map-control .item.active {
  background: #1890ff;
}
.map-control .item:last-child {
  border-top: none;
}
.map-control .item i {
  font-weight: bold;
}

.map-double {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 999;
  width: 100%;
  height: 100%;
  background: #fff;
}
.map-double .close {
  background-color: rgba(2, 11, 38, 0.9);
  width: 36px;
  height: 36px;
  line-height: 36px;
  text-align: center;
  color: #fff;
  font-size: 24px;
  font-weight: bold;
  position: absolute;
  top: 0;
  right: 0;
  z-index: 1;
  cursor: pointer;
}
.map-double .item {
  width: 100%;
  height: 50%;
  position: relative;
}
.map-double .line {
  background: rgba(101, 216, 227, 0.4);
  width: 100%;
  height: 2px;
  position: absolute;
  top: 50%;
  left: 0;
  z-index: 1;
}
.map-double .item #double_1,
.map-double .item #double_2 {
  height: 100%;
}
.map-double .item .map-select {
  position: absolute;
  left: 0;
  top: 1px;
  z-index: 1;
}
.map-double .item:first-child .map-select {
  top: auto;
  bottom: -1px;
}
.map-double .item:first-child .i-select .bd {
  top: auto;
  bottom: 34px;
}
.map-roller {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  z-index: 9;
  background-color: #fff;
}
.map-roller #roller {
  width: 100%;
  height: 100%;
}
.map-roller .mask {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  border-left: 2px solid rgba(38, 92, 133, 0.8);
  background-color: rgba(38, 92, 133, 0.3);
}
.map-roller .close {
  background-color: rgba(2, 11, 38, 0.9);
  width: 36px;
  height: 36px;
  line-height: 36px;
  text-align: center;
  color: #fff;
  font-size: 24px;
  font-weight: bold;
  position: absolute;
  top: 0;
  right: 0;
  z-index: 10;
  cursor: pointer;
}
.map-roller .point {
  width: 100%;
  position: absolute;
  top: 50%;
  left: 0;
  z-index: 10;
}

.map-roller .item .map-select {
  position: absolute;
  /* left: 0;
  top: 1px;
  z-index: 1; */
}
.map-roller .map-select {
  top: auto;
  bottom: 0;
}
.map-roller .map-select .i-select .bd {
  top: auto;
  bottom: 34px;
}

.map-roller .text-1 {
  position: absolute;
  bottom: 0;
  left: -160px;
  z-index: 10;
  /* width: 100px;
  text-align: center;
  background: rgba(38, 92, 133, 0.8);
  font-size: 14px;
  padding: 5px;
  font-weight: bold;
  color: white; */
}
.map-roller .text-2 {
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 10;
  /* width: 100px;
  text-align: center;
  background: rgba(38, 92, 133, 0.8);
  font-size: 14px;
  padding: 5px;
  font-weight: bold;
  color: white; */
}
</style>
<style lang="scss">
.map-roller .point .el-slider__runway {
  background-color: transparent;
}
.map-roller .point .el-slider__bar {
  background-color: transparent;
}
.map-people {
  height: 58px;
  width: 64px;
  background: url('./image/foot.gif');
  background-size: 100%;
  background-repeat: no-repeat;
  background-position: center bottom;
}
.map-uav {
  height: 32px;
  width: 32px;
  background: url('./image/fj.png');
  background-size: 100%;
  background-repeat: no-repeat;
  background-position: center bottom;
}
.left-people {
  background: url('./image/foot-left.gif');
}
.speed-control {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
}
.speed-control > span {
  height: 36px;
  line-height: 36px;
  color: #fff;
  border-radius: 2px;
  border: 1px solid rgba(101, 216, 227, 0.4);
  background-color: rgba(2, 11, 38, 0.9);
  padding: 0 10px;
  cursor: pointer;
  font-size: 14px;
}
.bottom-box {
  position: absolute;
  bottom: 20px;
  flex-wrap: wrap;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  & > span {
    color: #fff;
    border-radius: 2px;
    border: 1px solid rgba(101, 216, 227, 0.4);
    background-color: rgba(2, 11, 38, 0.9);
    padding: 0px 6px;
    text-align: center;
    font-size: 16px;
    margin: 0 10px;
  }
}
.time-line {
  width: 1000px !important;
  border-radius: 0;
  .el-slider__runway {
    height: 30px;
    background: rgba(0, 0, 0, 0.8);
    .el-slider__bar {
      &::before {
        position: absolute;
        bottom: 0;
        height: 10px;
        background: rgba(8, 108, 235, 1);
        z-index: 2;
        content: '';
        width: 100%;
      }
      height: 30px;
      bottom: 0;
      background-color: transparent;
      background-image: linear-gradient(
        0deg,
        rgba(8, 108, 235, 0.8),
        rgba(8, 108, 235, 0)
      );
      z-index: 1;
    }
  }
  .el-slider__marks-stop {
    height: 24px;
    width: 1px;
    bottom: 0;
    margin-left: 3px;
    background-color: rgba(255, 255, 255, 0.4);
  }
  .el-slider__button-wrapper {
    top: 0;
    .el-slider__button {
      border: none;
      background: transparent;
      width: 100%;
      height: 100%;
    }
  }
}
/**提示框的样式信息**/
.map-tips {
  font-size: 14px;
  position: relative;
  color: #000;
  padding: 4px 8px;
  white-space: nowrap;
  border-radius: 2px;
  background-color: #ffff00;
}
.map-tips:before {
  border-top: 6px solid #ffff00;
  border-right: 6px solid transparent;
  border-left: 6px solid transparent;
  content: '';
  position: absolute;
  bottom: -5px;
  margin-left: -7px;
  left: 50%;
}
</style>
