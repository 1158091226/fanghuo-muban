<template>
  <div />
</template>

<script>
import { getSimplifyBoundary1 } from "@/api/auth";
// import MapLayer from '@/components/MapLayer';
import { forwardUrl } from "@/api/system";
import formatWKT from "terraformer-wkt-parser";
import JSONbig from "json-bigint";

export default {
  name: "DrawMapLayer",
  components: {
    // MapLayer
  },
  data() {
    return {
      mapAreaQuery: {
        callback: null, // 区划变更回调方法
        coordsStyle: null, // 区划边界样式
        stopArea: false, // 区划是否可以点击
      },
      mapQuery: {
        mapName: "itemMapLayer", // maplayer name
        // areaCode: '',
        areaName: "",
        areaCode:
          this.$store.getters.areaCode ||
          this.$store.getters.userInfo.areaCode ||
          "",
        // areaName:
        //   this.$store.getters.areaName ||
        //   this.$store.getters.userInfo.areaName ||
        //   '',
        patternType: 4,
        pageSize: 99999,
        pageNo: 1,
        // yearNo: '绑定年度之后可传递年度参数',年度改变可调用changeMapYear
      },
      mapAreaList: [], // 已点击区划列表
      mapTypeList: [
        // {
        //   type: '类型',
        //   name: '类型名',
        //   active: '图层显示隐藏',
        //   color: '图层渲染及图标块颜色',
        //   filter: '图层是否需要区划过滤',
        //   tableName: '图层表名和layerName',
        //   layerType: '图层类型1为数据库 2shp发布',
        //   work: '图层依赖',
        //   choseColor: '图层选中外框颜色',
        //   onlyClick: 唯一可点击图层,
        //   position: '层级',
        //   list: '数据', [{onstyle:'可定义每个绘制图标样式'}]
        //   coordsStyle: '可定义绘制样式',
        //   strokeStyle: '可定义stroke样式',
        //   imageStyle: '可定义image样式'
        //   coordsField: '可定义绘制参数名'
        //   icon: '显示在选择区域的图标',
        //   point: '绘制点位时的图标',
        //   pointScale: '图标的放大缩小参数'
        //   getData: '获取数据的函数，定义时需要定义默认的type和active参数',
        //   getDetail: '获取明细数据',
        //   isCluster: '是否聚合展示',
        //   clusterStyle: '聚合样式'
        //   isChange: true时，list设置为空数组可强制获取新数据,
        //   showDetailType: '详情弹窗类型默认detail,设置pop为地图组件小窗口'
        // },
      ],
      mapTimer: null,
      zoomInWKT: false, // 是否点击进图层
      zoomInPoint: false, // 是否点击到绘制点位
      loading: false,
      popDetail: {}, // 点击后明细内容
      showPopDetail: false, // 点位详情展示
      showPopWKTDetail: false, // 图层详情展示
      showPopWgDetail: false, // 网格详情展示
      showDetailType: "detail",
      showType: true,
    };
  },
  beforeDestroy() {
    this.clearTime();
  },
  methods: {
    // 绘制区划边界
    showSimplifyBoundary() {
      if (!this.loading) {
        this.loading = true;
        this.mapQuery.type = 0;
        this.mapQuery.tolerance = this.$tolerance(this.mapQuery.areaCode);
        const areaObj = {};
        areaObj.areaCode = this.mapQuery.areaCode;
        areaObj.areaName = this.mapQuery.areaName;
        this.mapAreaList.push(areaObj);
        getSimplifyBoundary1(this.mapQuery).then((res) => {
          this.loading = false;
          const obj = {
            name: "area_layer",
            coordField: "boundaryLine",
            textField: "areaName",
            coordsArr: res.data,
            coordsStyle: this.mapAreaQuery.coordsStyle || {
              fill: {
                color: "rgba(255, 255, 0, 0)",
              },
              stroke: {
                width: 2,
                color: "#00ffff",
              },
              text: {
                fill: {
                  color: "#ffffff",
                },
                font: "16px Microsoft YaHei",
                stroke: {
                  width: 1,
                },
              },
            },
            position: 998,
            fit: true,
            vectorEventFun: (coordinate, feature) => {
              if (this.mapAreaQuery.stopArea) {
                return;
              }
              this.clearTime();
              this.mapTimer = setInterval(() => {
                // 护林员网格防止bug禁止区划下跳
                if (
                  this.zoomInWKT ||
                  this.zoomInPoint ||
                  this.findTypeObj("hlywg")?.active
                ) {
                  return;
                }
                if (feature) {
                  const cur = feature.values_.attr;
                  this.resetMapArea(cur);
                }
                this.clearTime();
              }, 50);
            },
          };
          this.$refs[this.mapQuery.mapName].addCoordinateLayer(obj);
        });
      }
    },
    // 切换专题图类型
    changeTypeShow(obj, multiple = true) {
      if (!multiple) {
        this.mapTypeList.forEach((item) => {
          item.active = false;
          this.checkFun(item);
        });
      }
      obj.active = !obj.active;
      this.mapTypeList = [...this.mapTypeList];
      this.getMapType(obj);
    },
    // 外部调用区划方法
    resetMapArea(obj) {
      // 传入区划对象，刷新林业资源数据
      this.mapQuery.areaCode = obj.areaCode;
      this.mapQuery.areaName = obj.areaName;
      if (this.mapQuery.areaCode.length < 12) {
        this.showSimplifyBoundary();
        this.getMapType();
        this.mapAreaQuery.callback && this.mapAreaQuery.callback();
      }
    },
    // 切换年度
    changeMapYear() {
      this.mapDrawWkt(); // 清除选中区域
      // this.clearMap();
      this.showPopDetail = this.showPopWKTDetail = false;
      this.getMapType();
    },
    // 区划返回
    backToArea(obj, index) {
      if (
        obj.areaCode !=
          this.mapAreaList[this.mapAreaList.length - 1].areaCode &&
        !this.loading
      ) {
        this.changeMapYear();
        this.mapAreaList.splice(index);
        this.resetMapArea(obj);
      }
    },
    changeMap(type, active) {
      // 切换地图展示
      if (this.findTypeObj(type).tableName) {
        this.loadWktMap(type, active);
      } else {
        this.loadMap(type, active);
      }
    },
    getMapType(obj) {
      // 根据类型展示加载地图
      if (this.mapType) {
        const obj = this.findTypeObj(this.mapType);
        obj.active = obj.fit = true;
        this.showType = false;
        this.checkFun(obj);
      } else if (obj) {
        this.checkFun(obj);
      } else {
        this.mapTypeList.forEach((item) => {
          item.isClick = false;
          this.checkFun(item);
        });
      }
    },
    findObj(val, type) {
      // 查找当前点击的类型对象
      const index = this.mapTypeList.findIndex((item) => item[type] == val);
      return this.mapTypeList[index];
    },
    findTableNameObj(name) {
      // 查找当前点击的类型对象
      const index = this.mapTypeList.findIndex(
        (item) => item.tableName == name
      );
      return this.mapTypeList[index];
    },
    findTypeObj(type) {
      // 查找当前点击的类型对象
      const index = this.mapTypeList.findIndex((item) => item.type == type);
      return this.mapTypeList[index];
    },
    mapDrawWkt(data, color = "red") {
      // 选中图层信息标红或清空选中内容.默认红色
      const flyData = data ? formatWKT.convert(data) : "";
      const polygonArr = [];
      polygonArr.push({
        coords: flyData,
        id: "active",
      });
      const obj = {};
      obj.name = "light_layer";
      obj.coordField = "coords";
      obj.coordsArr = polygonArr;
      obj.coordsStyle = {
        stroke: {
          width: 3,
          color,
        },
      };
      obj.position = 1234;
      obj.fitOptions = {
        padding: [100, 0, 100, 0],
      };
      this.$refs[this.mapQuery.mapName].addCoordinateLayer(obj);
    },
    getObjData(type, active) {
      // 根据类型请求接口
      const obj = this.findTypeObj(type);
      obj.getData(type, active);
    },
    getDetail(id, type) {
      // 根据类型请求接口
      const obj = this.findTypeObj(type);
      obj.getDetail(id);
    },
    checkFun(item) {
      // 查看是否需要请求数据
      if (
        item.active &&
        (item.yearNo != this.mapQuery.yearNo ||
          item.areaCode != this.mapQuery.areaCode)
      ) {
        // 数据未改变不请求接口
        this.getObjData(item.type, item.active);
      } else {
        this.changeMap(item.type, item.active);
      }
    },
    clearTime() {
      clearInterval(this.mapTimer);
      this.mapTimer = null;
    },
    checkClick() {
      // 查看是否有图层或点位被选中
      return this.mapTypeList
        .map((item) => item.isClick)
        .some((item) => item == true);
    },
    changeShow() {
      // 组件嵌套问题v-model不可删除，解决方式
      this.$forceUpdate();
    },
    loadMap(type, active = true) {
      // 接口数据绘制地图
      const typeObj = this.findTypeObj(type);
      typeObj.list = typeObj.list ? typeObj.list : [];
      if (
        !typeObj.list.length &&
        (typeObj.yearNo != this.mapQuery.yearNo ||
          typeObj.areaCode != this.mapQuery.areaCode)
      ) {
        // 新数据为空时切换地图隐藏
        active = false;
      }
      if (
        typeObj.list.length &&
        active &&
        (typeObj.yearNo != this.mapQuery.yearNo ||
          typeObj.areaCode != this.mapQuery.areaCode)
      ) {
        // 图层数据存在，且图层状态active等于true展示
        typeObj.yearNo = this.mapQuery.yearNo;
        typeObj.areaCode = this.mapQuery.areaCode;
        typeObj.list.forEach((item) => {
          item.mapType = typeObj.type;
        });
        const obj = {
          name: typeObj.type,
          coordField: typeObj.coordField || "boundaryLine",
          coordsArr: typeObj.list,
          coordsStyle: typeObj.coordsStyle || {
            fill: {
              color: "rgba(255, 255, 0, 0)",
            },
            stroke: typeObj.strokeStyle || {
              width: 2,
              color: "#ffff00",
            },
            image:
              typeObj.imageStyle || typeObj.point
                ? {
                    anchor: [0.5, 1],
                    src:
                      typeObj.point ||
                      require("@/components/MapLayer/image/icon-position-blue.png"),
                    scale: typeObj.pointScale,
                  }
                : null,
          },
          position: typeObj.position || 1000,
          fit: typeObj.fit,
          clusterStyle: typeObj.clusterStyle || null,
          vectorEventFun: (callback, obj) => {
            this.zoomInPoint = true; // 点击点位
            if (obj && typeObj.active) {
              const type = obj.get("attr").mapType;
              typeObj.isClick = true;
              this.mapDrawWkt();
              const cur = obj.values_.attr;
              this.getDetail(cur, type);
            } else {
              typeObj.isClick = false;
              this.showPopDetail = this.showEventItem = false;
              this.$refs[this.mapQuery.mapName].closePopup();
              if (!this.checkClick()) {
                // 判断未点击则清除
                this.zoomInPoint = false;
              }
            }
          },
        };
        if (typeObj.isCluster) {
          this.$refs[this.mapQuery.mapName].addClusterCoordinateArryLayer(obj);
        } else {
          this.$refs[this.mapQuery.mapName].addCoordinateLayer(obj);
        }
      } else {
        setTimeout(() => {
          this.$refs[this.mapQuery.mapName]
            ?.getLayerByName(typeObj.type)
            ?.setVisible(active);
          this.$refs[this.mapQuery.mapName]?.closePopup();
        }, 4);
      }
    },
    // 点击地图点位（包含聚合）
    clickMapPoint() {
      this.zoomInArea = false;
      setTimeout(() => {
        this.zoomInArea = true;
      }, 4);
    },
    loadWktMap(type, active = true) {
      // 渲染图层数据
      const typeObj = this.findTypeObj(type);
      let isChange = false;
      if (
        typeObj.yearNo != this.mapQuery.yearNo ||
        typeObj.areaCode != this.mapQuery.areaCode ||
        typeObj.isChange
      ) {
        isChange = true;
      }
      if (!typeObj.list.length && isChange) {
        // 新数据为空时切换地图隐藏
        active = false;
      }
      if (typeObj.list.length && active && isChange) {
        // 图层数据存在，且图层状态active等于true展示
        typeObj.yearNo = this.mapQuery.yearNo;
        typeObj.areaCode = typeObj.onlyAreaCode || this.mapQuery.areaCode;
        const obj = {};
        obj.layerInfo = {};
        if (typeObj.filter) {
          const filter = Object.assign({}, typeObj.filter);
          filter.areaCode = typeObj.onlyAreaCode || typeObj.areaCode;
          obj.layerInfo.filter =
            this.$refs[this.mapQuery.mapName]?.getLayerFilter(filter);
        } else if (typeObj.filterSql) {
          obj.layerInfo.filter = typeObj.filterSql;
        }
        obj.layerInfo.url = typeObj.url || this.$mapUrl;
        // obj.layerInfo.name = typeObj.tableName;
        obj.layerInfo.name = typeObj.type;
        obj.layerInfo.work = typeObj.work;
        obj.layerInfo.visible = true;
        obj.layerInfo.fit = typeObj.fit || false;
        obj.layerInfo.position = typeObj.position || 11;

        // obj.layerInfo.layerName = typeObj.list[0].fileGuid;
        if (typeObj.layerType == 1) {
          // 发布类型为：数据库
          obj.layerInfo.layerName = typeObj.layerName || typeObj.sourceTable;
        } else {
          // 发布类型为：shp
          obj.layerInfo.layerName = typeObj.dataPool;
        }
        obj.layerEventFun = function (coordinate, feature) {
          if (!typeObj.active || this.mapQuery.loading) {
            return;
          }
          this.zoomInWKT = true;
          this.mapQuery.loading = true;
          let list = [];
          let hasOnlyClick = false;
          Object.keys(feature).forEach((name) => {
            const obj = {};
            obj.name = name;
            obj.url = feature[name];
            obj.typeObj = this.findObj(name, "type"); // 多图层点击只会触发一次时间，点击对象需要绑定至数据列表
            list.push(obj);
            if (obj.typeObj.onlyClick) {
              // 判断是否存在唯一可点击的图层
              hasOnlyClick = true;
            }
          });
          if (hasOnlyClick) {
            list = list.filter((item) => item.typeObj.onlyClick);
          }
          forwardUrl(list).then((res) => {
            this.mapQuery.loading = false;
            const data = res.data;
            if (data.length && !this.showPopDetail) {
              data.forEach((item, index) => {
                // item.data = JSON.parse(item.data);
                item.data = JSONbig.parse(item.data);
                console.log(item.data);
                if (item.data.features.length) {
                  list[index].typeObj.isClick = true; // 点击当前图层数据
                  const type = list[index].typeObj.type;
                  const feature = item.data.features[index];
                  const data = feature.properties;
                  const obj = this.findTypeObj(type);
                  data.boundaryLine = `POINT(${coordinate.join(" ")})`;
                  data.typeTitle = item.name;
                  obj.getDetail(data, feature);
                  this.mapDrawWkt(
                    item.data.features[0].geometry,
                    obj.choseColor
                  );
                } else {
                  list[index].typeObj.isClick = false; // 未点中当前图层数据
                }
              });
              if (!this.checkClick()) {
                // 所有对象无点击时，清除图层和点击状态
                this.mapDrawWkt();
                this.showPopWKTDetail = false;
                this.zoomInWKT = false;
              }
            } else {
              list.forEach((item) => {
                // 当前图层点击位置不存在返回数据时，清空数据
                item.typeObj.isClick = false;
              });
              this.showPopWKTDetail = false;
              if (!this.checkClick()) {
                this.zoomInWKT = false;
              }
            }
          });
          setTimeout(() => {
            // 点击图层阻止区划点击
            this.clearTime();
            this.zoomInWKT = false;
          }, 200);
        }.bind(this);
        this.$refs[this.mapQuery.mapName].addWmsLayer(obj);
        this.$refs[this.mapQuery.mapName].updateSize();
      } else {
        if (this.$refs[this.mapQuery.mapName]) {
          Object.keys(this.$refs[this.mapQuery.mapName].wmsLayerObj).forEach(
            (key) => {
              if (typeObj.type == key) {
                const obj = this.$refs[this.mapQuery.mapName].wmsLayerObj[key];
                obj.setVisible(active);
                this.showPopWKTDetail = false;
                this.mapDrawWkt();
                this.$refs[this.mapQuery.mapName].closePopup();
              }
            }
          );
        }
      }
    },
    steupDetail(data, type) {
      // 其他页面调取详情数据
      const obj = this.findTypeObj(type);
      const showDetailType = obj.showDetailType || this.showDetailType;
      if (showDetailType === "pop") {
        const popupObj = {};
        const point = formatWKT.parse(data.boundaryLine);
        data.lon = point.coordinates[0];
        data.lat = point.coordinates[1];
        popupObj.coords = point.coordinates;
        const popupArr = [];
        this.itemParams.forEach((item) => {
          let obj = null;
          if (item.type != "image") {
            obj = {
              key: this.translate(type, item.name),
              value: data[item.name == "areaCode" ? "areaName" : item.name],
            };
            popupArr.push(obj);
          }
        });
        popupObj.title = data.typeTitle;
        popupObj.content = popupArr;
        this.$refs[this.mapQuery.mapName].addPopup(popupObj);
      } else if (showDetailType === "detail") {
        this.popDetail = data;
        this.popDetail.translateType = obj.dataTypeName;
      }
    },
    // 获取防火办
    // async getFhb(type, active) {
    //   const res = await api.resourceFangHuoBan(
    //     "findByPage",
    //     "post",
    //     this.mapQuery
    //   );
    //   this.findTypeObj(type).list = res.data;
    //   this.changeMap(type, active);
    // },
    // 获取森林督查
    // async getSldc(type, active) {
    //   let mapQuery = deepClone(this.mapQuery);
    //   mapQuery.impType = 1;
    //   mapQuery.tableName = [
    //     "forest_supervision_self_examination",
    //     "resource_forest_supervision",
    //   ];
    //   const res = await getforestSupervisionLayerList(mapQuery);
    //   this.findTypeObj(type).list = res.data;
    //   this.changeMap(type, active);
    // },
    // getFhbDetail(id) {
    //   //防火办详情
    //   api.resourceFangHuoBan("getDetail", "get", { id }).then((res) => {
    //     this.setupFhbParam();
    //     res.data.typeTitle = this.findTypeObj("slfh").name;
    //     this.steupDetail(res.data, "slfh");
    //     this.showPopDetail = true;
    //   });
    // },
    // getSldcDetail(data) {
    //   //森林督查详情
    //   this.setupSldcParam();
    //   data.typeTitle = "图斑详情";
    //   this.steupDetail(data, "sldc");
    //   this.showPopWKTDetail = true;
    // },
    // getHlywgDetail(data, feature) {
    //   this.showPopWKTDetail = false;
    //   this.showPopWgDetail = true;
    //   this.popWgId = data.id
    // ? data.id
    //     : feature.id.slice(feature.id.lastIndexOf(".") + 1);
    // },
  },
};
</script>
