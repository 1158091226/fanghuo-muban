<template>
  <div />
</template>
<script>
import { getSimplifyBoundary1 } from "@/api/h5";
import { forwardUrl } from "@/api/system";
import { isArray } from "@/utils/validate";
import formatWKT from "terraformer-wkt-parser";

export default {
  name: "DrawMapLayer",
  data() {
    return {
      popUpButtonData: [],
      mapAreaQuery: {
        callback: null, // 区划变更回调方法
        coordsStyle: null, // 区划边界样式
        stopArea: false, // 区划是否可以点击
        showArea: true,
      },
      mapQuery: {
        mapName: "itemMapLayer", // maplayer name
        type: 1,
        areaCode:
          this.$store.getters.areaCode || this.$store.getters.userInfo.areaCode,
        areaName:
          this.$store.getters.areaName || this.$store.getters.userInfo.areaName,
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
        //   isMultiple : '是否多选',   true/false多选图层可与其他图层叠加
        //   color: '图层渲染及图标块颜色',
        //   filter: '图层是否需要区划过滤',
        //   filterSql: '图层过滤sql语句,不再推荐传入filter'
        //   tableName: '图层表名和layerName',
        //   layerType: '图层类型1为数据库 2shp发布',
        //   work: '图层依赖',
        //   choseColor: '图层选中外框颜色',
        //   onlyClick: 唯一可点击图层,
        //   position: '层级',
        //   list: '数据', [{olstyle:'可定义每个绘制图标样式'}]
        //   coordsStyle: '可定义绘制样式',
        //   textField: '文本字段'
        //   strokeStyle: '可定义stroke样式',
        //   imageStyle: '可定义image样式'
        //   coordField: '可定义绘制参数名'
        //   icon: '显示在选择区域的图标',
        //   point: '绘制点位时的图标',
        //   pointScale: '图标的放大缩小参数'
        //   getData: '获取数据的函数，定义时需要定义默认的type和active参数',
        //   getDetail: '获取明细数据',
        //   isCluster: '是否聚合展示',
        //   clusterStyle: '聚合样式'
        //   popText: '多个弹窗展示字段',
        //   isChange: true时，list设置为空数组可强制获取新数据,
        //   showDetailType: '详情弹窗类型默认detail,设置pop为地图组件小窗口'
        // },
      ],
      mapTimer: null,
      zoomInWKT: false, // 是否点击进图层
      zoomInPoint: false, // 是否点击到绘制点位
      loading: false,
      popDetail: {}, // 点击后明细内容
      showPopDetail: false, // 详情展示
      // showPopDetail: false, // 图层详情展示
      showPopWgDetail: false, // 网格详情展示
      showDetailType: "detail",
      showType: true,
      isCesium: this.$store.getters?.mapMode == "3d" ? true : false, //默认
    };
  },
  beforeDestroy() {
    this.clearTime();
  },
  methods: {
    // 绘制区划边界
    async showSimplifyBoundary() {
      if (!this.loading && this.mapAreaQuery.showArea) {
        this.loading = true;
        const areaObj = {};
        areaObj.areaCode = this.mapQuery.areaCode;
        areaObj.areaName = this.mapQuery.areaName;
        this.mapAreaList.push(areaObj);
        await getSimplifyBoundary1({
          ...areaObj,
          tolerance: this.$tolerance(this.mapQuery.areaCode),
          type: this.mapQuery.type,
        }).then((res) => {
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
            position: 1,
            fit: true,
            vectorEventFun: async (coordinate, feature) => {
              if (this.mapAreaQuery.stopArea) {
                return;
              }
              this.clearTime();
              // let active = this.mapTypeList.every((item) => item.active);
              // if (!active) {
              //   this.zoomInWKT = this.zoomInPoint = false;
              // }
              this.mapTimer = setInterval(() => {
                // 护林员网格防止bug禁止区划下跳

                if (this.zoomInWKT || this.zoomInPoint) {
                  return;
                }
                if (feature) {
                  const cur = feature.values_.attr;
                  this.resetMapArea(cur);
                }
                this.clearTime();
              }, 40);
            },
          };
          if (!this.isCesium) {
            this.$refs[this.mapQuery.mapName].addCoordinateLayer(obj);
          } else {
            this.$refs[this.mapQuery.mapName].addWktLayer(obj);
          }
        });
      }
    },
    //切换聚合展示
    changeCluster(isCluster) {
      this.mapTypeList.forEach((item) => {
        if (!item.tableName) {
          item.isCluster = isCluster;
          item.isChange = true;
          this.$refs[this.mapQuery.mapName].removeLayerByName(item.type);
          this.checkFun(item);
        }
      });
    },
    //切换wmts与wms图层显示
    changeWmts(isWmts) {
      this.mapTypeList.forEach((item) => {
        if (!item.tableName) {
          item.isWmts = isWmts;
          item.isChange = true;
          this.$refs[this.mapQuery.mapName].removeLayerByName(item.type);
          this.checkFun(item);
        }
      });
    },
    // 切换专题图类型
    changeTypeShow(obj, multiple = true) {
      if (!obj.isMultiple) {
        this.mapTypeList.forEach((item) => {
          if (!item.isMultiple) {
            item.active = false;
            this.checkFun(item);
          }
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
      this.showPopDetail = false;
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
      //避免地图隐藏
      if (!this.isCesium) {
        let typeObj = this.findTypeObj(type);
        this.$refs[this.mapQuery.mapName]
          ?.getLayerByName(typeObj.type)
          ?.setVisible(active);
      }
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
          if (item.active) {
            this.checkFun(item);
          }
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
      let polygonArr = [];
      if (!isArray(data)) {
        const flyData = data ? formatWKT.convert(data) : "";
        polygonArr.push({
          coords: flyData,
          id: "active",
        });
      } else {
        polygonArr = data;
      }
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
      if (!this.isCesium) {
        this.$refs[this.mapQuery.mapName].addCoordinateLayer(obj);
      } else {
        this.$refs[this.mapQuery.mapName].addWktLayer(obj);
      }
    },
    getObjData(type, active) {
      // 根据类型请求接口
      const obj = this.findTypeObj(type);
      obj.getData.call(this, type, active);
    },
    // getDetail(id, type) {
    //   // 根据类型请求接口
    //   const obj = this.findTypeObj(type);
    //   obj.getDetail(id);
    // },
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
    sleep(time) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, time);
      });
    },
    loadMap(type, active = true) {
      // 接口数据绘制地图
      const typeObj = this.findTypeObj(type);
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
        (typeObj.isChange ||
          typeObj.yearNo != this.mapQuery.yearNo ||
          typeObj.areaCode != this.mapQuery.areaCode)
      ) {
        // 图层数据存在，且图层状态active等于true展示
        typeObj.isChange = false;
        typeObj.yearNo = this.mapQuery.yearNo;
        typeObj.areaCode = this.mapQuery.areaCode;
        typeObj.list.forEach((item) => {
          item.mapType = typeObj.type;
        });
        const obj = {
          name: typeObj.type,
          coordField: typeObj.coordField || "boundaryLine",
          coordsArr: typeObj.list,
          textField: typeObj.textField,
          isHeatMap: typeObj.isHeatMap,
          heatMapStyle: typeObj.heatMapStyle,
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
                      require("@/static/image/icon_position_blue.png"),
                    scale: typeObj.pointScale,
                  }
                : null,
          },
          position: typeObj.position || 1000,
          fit: typeObj.fit,
          fitOptions: typeObj.fitOptions,
          clusterStyle: typeObj.clusterStyle || null,
          vectorEventFun: async (coordinate, obj) => {
            this.zoomInPoint = true; // 点击点位防止区划下跳
            if (obj && typeObj.active) {
              typeObj.isClick = true;
              await this.sleep(50); //阻止执行等待图层点击事件执行完成
              if (this.zoomInWKT && typeObj.getDetail) {
                //是否点击到图层且当前点位存在详情事件
                if (isArray(obj)) {
                  //点位返回结果为数组则为聚合点位
                  this.checkClusterData(obj, coordinate, typeObj);
                } else {
                  this.popUpButtonData.push({
                    name: typeObj.name,
                    type: "function",
                    function: this.showPopUpDetail,
                    params: {
                      data: obj.values_.attr,
                      coordinate,
                      typeObj,
                    },
                  });
                }
              } else if (typeObj.getDetail) {
                //未点击图层且存在详情事件
                if (isArray(obj)) {
                  //点位返回结果为数组则为聚合点位
                  this.checkClusterData(obj, coordinate, typeObj);
                } else {
                  this.popUpButtonData.push({
                    name: typeObj.name,
                    type: "function",
                    function: this.showPopUpDetail,
                    params: {
                      data: obj.values_.attr,
                      coordinate,
                      typeObj,
                    },
                  });
                }
                setTimeout(() => {
                  this.showPopUp(coordinate);
                }, 4);
              }
            } else if (coordinate == "clusterClick") {
              typeObj.isClick = true;
              await this.sleep(50);
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
        if (!this.isCesium) {
          if (typeObj.isCluster) {
            this.$refs[this.mapQuery.mapName].addClusterCoordinateArryLayer(
              obj
            );
          } else {
            this.$refs[this.mapQuery.mapName].addCoordinateLayer(obj);
          }
        } else {
          // console.log('走到cesium', obj);
          let params = {
            isCluster: typeObj.isCluster,
          };
          params = Object.assign(obj, params);
          this.$refs[this.mapQuery.mapName].addWktLayer(params);
        }
      } else {
        if (!this.isCesium) {
          setTimeout(() => {
            this.$refs[this.mapQuery.mapName]
              ?.getLayerByName(typeObj.type)
              ?.setVisible(active);
            this.$refs[this.mapQuery.mapName]?.closePopup();
            typeObj.isClick = false;
          }, 4);
        } else {
          let params = {
            name: typeObj.type,
          };
          params = Object.assign(typeObj, params);
          // console.log('更新图层', params);
          this.$refs[this.mapQuery.mapName].setWktLayerVisible(params);
          this.$refs[this.mapQuery.mapName]?.closePopup();
          typeObj.isClick = false;
        }
      }
    },
    //过滤聚合数据，弹窗展示可选内容
    checkClusterData(features, coordinate, typeObj) {
      features.forEach((item) => {
        this.popUpButtonData.push({
          name: item.values_.attr[typeObj.popText || "text"] || typeObj.name,
          type: "function",
          function: this.showPopUpDetail,
          params: {
            data: item.values_.attr,
            coordinate,
            typeObj,
          },
        });
      });
    },
    showPopUp(coordinate) {
      this.showPopDetail = false;
      //详情弹窗,根据返回结果展示,单个展示对应事件，多个展示popup选择组件
      if (this.popUpButtonData.length > 1) {
        const popupObj = {};
        popupObj.coords = coordinate;
        popupObj.title = "图层列表";
        popupObj.content = [];
        popupObj.class = "popup-map-list";
        popupObj.buttons = this.popUpButtonData;
        this.$refs[this.mapQuery.mapName].addPopup(popupObj);
      } else {
        let params = this.popUpButtonData[0].params;
        params.coordinate = coordinate;
        this.showPopUpDetail(params);
      }
      this.popUpButtonData = [];
    },
    loadWktMap(type, active = true) {
      // 渲染图层数据
      const typeObj = this.findTypeObj(type);
      let mapLayer = this.$refs[this.mapQuery.mapName];
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
        typeObj.isChange = false;
        typeObj.yearNo = this.mapQuery.yearNo;
        typeObj.areaCode = typeObj.onlyAreaCode || this.mapQuery.areaCode;
        const obj = {};
        obj.layerInfo = {};
        obj.layerInfo.url = typeObj.url || this.$mapUrl;
        obj.layerInfo.name = typeObj.type;
        obj.layerInfo.visible = true;
        obj.layerInfo.fit = typeObj.fit || false;
        obj.layerInfo.position = typeObj.position || 11;
        obj.layerInfo.extent = typeObj.extent || [];
        if (typeObj.filter) {
          const filter = Object.assign({}, typeObj.filter);
          filter.areaCode = typeObj.onlyAreaCode || typeObj.areaCode;
          obj.layerInfo.filter =
            this.$refs[this.mapQuery.mapName]?.getLayerFilter(filter);
        } else if (typeObj.filterSql) {
          obj.layerInfo.filter = typeObj.filterSql;
          // let areaCql = `area_code like '${typeObj.areaCode}%'`;
          // obj.layerInfo.filter = typeObj.filterSql
          //   ? `${typeObj.filterSql} and ${areaCql}`
          //   : areaCql;
        }
        obj.layerInfo.work = typeObj.work;
        // obj.layerInfo.layerName = typeObj.list[0].fileGuid;
        if (typeObj.layerType == 1) {
          // 发布类型为：数据库
          obj.layerInfo.layerName = typeObj.layerName || typeObj.sourceTable;
        } else {
          // 发布类型为：shp
          obj.layerInfo.layerName = typeObj.dataPool;
        }
        if (typeObj.isWmts) {
          obj.layerInfo.layerName = typeObj.layerName;
          obj.layerInfo.format = typeObj.format;
          obj.layerInfo.infoFormat = typeObj.infoFormat;
          obj.layerInfo.projection = typeObj.projection;
          obj.layerInfo.resolutions = typeObj.resolutions;
          obj.layerInfo.gridNames = typeObj.gridNames;
          obj.layerInfo.gridsetName = typeObj.gridsetName;
          obj.layerInfo.url = obj.layerInfo.url + obj.layerInfo.work;
        }
        obj.layerEventFun = async (coordinate, feature) => {
          if (!typeObj.active || this.mapQuery.loading) {
            return;
          }
          this.zoomInWKT = true; //防止区划下跳
          this.mapQuery.loading = true; // 防止多次请求
          await this.sleep(10); //等待点击点位返回
          let list = [];
          let hasOnlyClick = false;
          Object.keys(feature).forEach((name) => {
            const obj = {};
            obj.name = name;
            obj.url = feature[name];
            obj.typeObj = this.findObj(name, "type"); // 多图层点击只会触发一次时间，点击对象需要绑定至数据列表
            if (obj.typeObj.onlyClick) {
              // 判断是否存在唯一可点击的图层
              hasOnlyClick = true;
            }
            if (obj.typeObj.getDetail) {
              list.push(obj);
            }
          });
          if (hasOnlyClick) {
            list = list.filter((item) => item.typeObj.onlyClick);
          }
          if (!list.length) {
            //不存在图层事件则过滤图层
            return (this.mapQuery.loading = this.zoomInWKT = false);
          }
          forwardUrl(list).then((res) => {
            //图层接口返回数据，点位数据不存在则过滤
            this.mapQuery.loading = false;
            const data = [];
            res.data.forEach((item) => {
              let obj = list.find((val) => val.name == item.name);
              if (obj) {
                // 因使用雪花id会导致前端JSON字符串转化对象的时候影响经度问题，这个行代码千万不能再删了！！！！！！！
                item.data = item.data.replace(/"id":(\d+)/, '"id":"$1"');
                obj.data = JSON.parse(item.data);
                obj.data?.features?.length && data.push(obj);
              }
            });
            if (data.length > 1 || this.popUpButtonData.length) {
              //点击图层数量大于1或者存在点击点位
              data.forEach((item) => {
                let typeObj = item.typeObj;
                if (typeObj.getDetail) {
                  typeObj.isClick = true;
                  this.checkFeatures(
                    item.data.features,
                    item.data,
                    typeObj,
                    coordinate
                  );
                }
              });
              this.showPopUp(coordinate);
            } else if (data.length === 1) {
              //只点击了当前图层
              let item = data[0];
              let typeObj = item.typeObj;
              typeObj.isClick = true;
              this.$refs[this.mapQuery.mapName].closePopup();
              if (item.data.features.length > 1) {
                this.checkFeatures(
                  item.data.features,
                  item.data,
                  typeObj,
                  coordinate
                );
                this.showPopUp(coordinate);
              } else {
                const feature = item.data.features[0];
                this.showPopUpDetail({
                  data: item.data,
                  feature,
                  typeObj,
                  coordinate,
                });
              }
            } else {
              list.forEach((item) => {
                // 当前图层点击位置不存在返回数据时，清空数据
                item.typeObj.isClick = false;
              });
              this.$refs[this.mapQuery.mapName].closePopup();
              this.mapDrawWkt();
              this.showPopDetail = false;
              if (!this.checkClick()) {
                this.zoomInWKT = false;
              }
            }
          });
          setTimeout(() => {
            // 点击图层阻止区划点击
            this.clearTime();
            this.zoomInWKT = false;
          }, 300);
        };

        if (!this.isCesium) {
          if (typeObj.isWmts) {
            mapLayer.addWmtsLayer(obj);
          } else {
            mapLayer.addWmsLayer(obj);
          }
          mapLayer.updateSize();
        } else {
          // console.log('cesium叠加wms', obj);
          // let params = Object.assign(obj, obj.layerInfo);
          // console.log('params', params);
          let params = {
            url: process.env.VUE_APP_GEOSEVER_API,
            active: typeObj.active,
            layerEventFun: obj.layerEventFun,
          };
          //
          params = Object.assign(obj.layerInfo, params);
          // console.log('new_params', params);
          mapLayer.addWmsLayer(params);
        }
      } else {
        if (mapLayer) {
          if (!this.isCesium) {
            Object.keys(mapLayer.wmsLayerObj).forEach((key) => {
              //清空wms图层
              if (typeObj.type == key) {
                const obj = this.$refs[this.mapQuery.mapName].wmsLayerObj[key];
                obj.setVisible(active);
                this.mapDrawWkt();
              }
            });
            Object.keys(mapLayer.wmtsLayerObj).forEach((key) => {
              //清空wmts图层
              if (typeObj.type == key) {
                const obj = this.$refs[this.mapQuery.mapName].wmtsLayerObj[key];
                obj.setVisible(active);
                this.mapDrawWkt();
              }
            });
            typeObj.isClick = false;
            this.showPopDetail = false;
            this.$refs[this.mapQuery.mapName].closePopup();
          } else {
            // console.log('before', typeObj);
            let params = Object.assign(typeObj, {
              url: process.env.VUE_APP_GEOSEVER_API,
              name: typeObj.type,
              active: active,
            });
            mapLayer.setWmsLayerVisible(params);
            this.mapDrawWkt();
            typeObj.isClick = false;
            this.showPopDetail = false;
            this.$refs[this.mapQuery.mapName].closePopup();
          }
        }
      }
    },
    checkFeatures(features, data, typeObj, coordinate) {
      //返回数据处理
      features.forEach((feature, index) => {
        this.popUpButtonData.push({
          name:
            feature.properties[typeObj.popText || "name"] ||
            `${typeObj.name}-${index + 1}`,
          type: "function",
          function: this.showPopUpDetail,
          params: {
            data,
            feature,
            typeObj,
            coordinate,
          },
        });
      });
    },
    checkFeatureId(id) {
      //查看返回数据id是否正确
      id = String(id);
      return id.includes(".") ? id.slice(id.lastIndexOf(".") + 1) : id;
    },
    showPopUpDetail(params) {
      //详情弹窗事件
      let { data, feature, typeObj, coordinate } = params;
      if (feature) {
        const properties = feature?.properties;
        // properties.boundaryLine = `POINT(${coordinate.join(" ")})`;
        properties.typeTitle = typeObj.name;
        feature.mapType = typeObj.type;
        properties.id = this.checkFeatureId(properties.id || feature.id);
        this.mapDrawWkt(feature.geometry, typeObj.choseColor);
        typeObj.getDetail.call(this, properties, feature, coordinate);
      } else {
        this.mapDrawWkt();
        typeObj.getDetail.call(this, data, typeObj.type, coordinate);
      }
      this.popUpButtonData = [];
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
  },
};
</script>
