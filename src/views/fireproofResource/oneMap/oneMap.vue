<!--  -->
<template>
  <div style="padding: 10px">
    <div class="selects">
      <!-- <el-button @click="aaa3">sdfasdfsdf</el-button> -->
      <div class="resources-tree ml-10">
        <div class="tree-title-box">
          <div class="title">专题图层</div>
          <svg-icon
            v-if="treeShow"
            icon-class="retract"
            style="
              font-size: 20px;
              cursor: pointer;
              margin-right: 10px;
              color: #000;
              position: absolute;
              right: 0;
            "
            @click="treeShow = !treeShow"
          />
          <svg-icon
            v-else
            icon-class="launch"
            style="
              font-size: 20px;
              cursor: pointer;
              margin-right: 10px;
              color: #000;
              position: absolute;
              right: 0;
            "
            @click="treeShow = !treeShow"
          />
        </div>
        <!-- <el-input
          v-model="filterText"
          class="screen-input"
          placeholder="输入关键字进行过滤"
        /> -->
        <tree-select
          v-show="treeShow"
          ref="tree"
          class="tree"
          :data="treeData"
          :show-checkbox="true"
          :node-key="'id'"
          :auto-expand-parent="true"
          :default-checked-keys="defaultCheckedKeys"
          :default-expanded-keys="defaultExpandedKeys"
          :props="defaultProps"
          :map-resources-down-list-name="'mapResourcesDownList'"
          :is-show-update-tree="true"
          @check="handleCheckChange"
          @treeUpdateSuccess="treeUpdateSuccess"
        />
      </div>
    </div>

    <!-- 右侧的统计表格 -->
    <div v-if="false" class="table-box-father">
      <div
        v-show="!tableBoxAather"
        class="table-icon"
        @click="tableBoxAather = true"
      >
        <i class="el-icon-s-data" />
      </div>
      <div v-show="tableBoxAather" class="table-close">
        <div>
          <el-button plain size="small" @click="downExcelClick">
            {{ $t("route.export") }}
          </el-button>
          <i
            class="el-icon-close ml-10"
            style="cursor: pointer"
            @click="tableBoxAather = false"
          />
        </div>

        <div class="title">统计</div>
      </div>
      <div v-show="tableBoxAather" class="table-box">
        <el-table
          v-show="!isGyl"
          v-loading="areageLoading"
          :data="tableData"
          :height="tableBoxAatherHeight"
          :span-method="objectSpanMethod"
          :style="{
            width: '100%',
            height: tableBoxAatherHeight + 'px',
          }"
          empty-text="暂无数据"
        >
          <el-table-column
            align="center"
            type="index"
            width="50"
            label="序号"
          />
          <el-table-column prop="areaCnName" align="center" label="行政区划" />

          <el-table-column prop="typeCnName" align="center" label="地类" />

          <el-table-column prop="acreage" align="center" label="面积(平方米)" />
        </el-table>

        <!-- 不同的表头，只有公益林才需要用 -->
        <el-table
          v-show="isGyl"
          v-loading="areageLoading"
          :data="tableDataGyl"
          :height="tableBoxAatherHeight"
          :span-method="objectSpanMethodGyl"
          :style="{
            width: '100%',
            height: tableBoxAatherHeight + 'px',
          }"
          empty-text="暂无数据"
        >
          <el-table-column
            align="center"
            type="index"
            width="50"
            label="序号"
          />
          <el-table-column prop="areaCnName" align="center" label="行政区划" />
          <el-table-column prop="typeCnName" align="center" label="地类" />
          <el-table-column prop="" align="center" label="国家公益林">
            <el-table-column
              prop="firsLvAcreage"
              align="center"
              label="I级(平方米)"
            />
            <el-table-column
              prop="secLvAcreage"
              align="center"
              label="II级(平方米)"
            />
          </el-table-column>
          <el-table-column
            prop="localAcreage"
            align="center"
            label="地方公益林"
          />
        </el-table>
      </div>
    </div>

    <!-- 地图 -->
    <map-layer
      :id="mapId"
      ref="mapLayer"
      v-loading="loading"
      :height="mapHeight"
      :show-note-layer="false"
      :image-fetch="false"
      :layer-indexs="2"
      :is-custom="true"
      :map-control="false"
      :map-info="false"
      :roller-year="yearValue"
      :is-show-tool="true"
      :is-show-roller-year="false"
      :year-change-function="rollerYearChange"
      @hideRoller="radioSelect = ''"
      @hideDouble="radioSelect = ''"
      @personelInfoBtn="personelInfoBtn"
    />

    <!-- 图斑详情弹窗 -->
    <OneMapDetails
      v-if="dialogVisible"
      :dialog-type="dialogType"
      :dialog-visible.sync="dialogVisible"
      :dialog-select-data="detailObject"
    />
  </div>
</template>

<script>
import {
  treeYztSlfh,
  treeYztSlfhWkt,
  legendAcreage,
  legendAcreageDown,
  getSimplifyBoundary1,
} from "@/api/firprotOneMap/map";
import MapLayer from "@/components/MapLayer";
import { deepClone, set16ToRgb } from "@/utils";
import { getMasterList } from "@/api/auth";
import { isArray } from "@/utils/validate";
import DrawMapLayer from "@/components/DrawMapLayer";
import TreeSelect from "@/components/TreeSelect";
import AreaSelect from "@/components/AreaSelect";
import { downloadFile } from "@/utils";
import formatWKT from "terraformer-wkt-parser";
import OneMapDetails from "./oneMapDetails.vue";
import { mapGetters } from "vuex";
import treedata from "./data";
import { getDetailsApi } from "./importApi";
import { fireproofDict } from "@/vendor/resource";
import { commonDownload } from "@/api/system";
import { getCenter } from "ol/extent";
import JSONbig from "json-bigint";
export default {
  components: {
    MapLayer,
    TreeSelect,
    AreaSelect,
    OneMapDetails,
    // MapDetails
  },
  mixins: [DrawMapLayer],
  data() {
    return {
      treeShow: true,
      areageLoading: false,
      detailObject: {},
      dialogVisible: false,
      dialogType: "", // 详情弹窗的类型

      tableData: null, // 存放面积统计表格的数据
      tableDataGyl: null, // 存放面积统计表格的数据
      selectLegendId: [], // 勾选的id

      // 地图年份下拉列表
      options: [],
      yearValue: "", // 地图年份下拉选择的值
      treeData: [], // 地图左侧的类型树数据
      // 定义类型树展示值的参数
      defaultProps: {
        children: "childList",
        label: "enName",
      },

      // 查询条件
      query: {
        pageNo: 1,
        pageSize: 10,
        yearNo: undefined,
        bnCode: undefined,
        areaCode: undefined,
      },

      mapId: "mapLayer", // 存放地图组件的name，应该和ref值一样，后续遇到可以用这个参数，由于一开始导致直接写this.$refs['mapLayer']，其实应该写this.$refs[this.mapId]
      mapHeight: document.body.clientHeight - 130 + "px", // 计算地图组件高度
      loading: false, // 地图加载控制，转圈圈的
      // 这个就是存放图层的数组，地图的图层操作就是，列表里有就更新，没有就新增。这样点击事件才能对应上
      mapTypeList: [
        // {
        //   type: '类型',
        //   name: '类型名',
        //   color: '图层渲染及图标块颜色',
        //   tableName: '图层表名',
        //   filter: '图层是否需要区划过滤',
        //   sourceTable: '图层需要展示的layerName',
        //   work: '图层依赖',
        //   position: '图层层级',
        //   list: '数据',
        //   icon: '显示在选择区域的图标',
        //   point: '绘制点位时的图标',
        //   getData: '获取数据的函数，定义时需要定义默认的type和active参数',
        //   getDetail: '获取明细数据'
        // },
      ],
      oldcheckedKeys: [], // 这个是存放树勾选后的对象，用作切换年份后，树会更新，需要在吧上一次勾选的还原回去
      mapTypeWktDataList: {}, // 这个用来存放类型为wkt图层查询的数据，避免多次查询
      defaultCheckedKeys: [], // 默认勾选的节点的 key 的数组
      defaultExpandedKeys: [], // 默认展开的节点的 key 的数组
      getSimplifyBoundary1Obj: {}, // 这是创建区划边界图层的对象数据
      tableBoxAather: false, // 控制面积统计展示开关
      tableBoxAatherHeight: "0", // 计算面积统计表格也高度
      // drawElements: [],
      filterText: "",

      gylParentId: "",
      isGyl: false,
      type3Arr: [],
      // type3Arr: [
      //   'fireprot_impt_point',
      //   'fireprot_impt_target',
      //   'forestry_industrial_data',
      //   'forestry_old_and_famous_trees',
      //   'fireprot_isolation',
      //   'fireprot_watchtower',
      //   'fireprot_reservoir',
      //   'fireprot_hel_water_intaking',
      //   'fireprot_hel_landing',
      //   'fireprot_reserve',
      //   'fireprot_weather_station',
      //   'fireprot_escape_point',
      //   'fireprot_billboard',
      //   'fireprot_checkpoint',
      //   'fireprot_col',
      //   'fireprot_firetruck',
      //   'fireprot_individual_equipment',
      //   'fireprot_forest_protection'
      // ],
      oldId: "",
      oldType: "",
      clickDetailsData: undefined, // 用来存放地图点击某个点查询的详情
    };
  },

  // components: {},

  // watch: {},

  // computed: {},

  created() {
    this.mapQuery.mapName = "mapLayer";
    treeYztSlfh({ legendId: 7 }).then((res) => {
      // 给树状数据加上字体大小和粗细
      const childArr = JSON.parse(JSON.stringify(res.data));

      this.treeData = this.inputSize(childArr, 16, 500);
      // this.gylParentId = [
      //   this.treeToOneArrFirst(this.treeData, 'gyl_dl').id,
      //   this.treeToOneArrFirst(this.treeData, 'gyl_gjgyl').id,
      //   this.treeToOneArrFirst(this.treeData, 'gyl_dfgyl').id
      // ];
      // 这是让树状默认勾选上公共基础数据的行政界限和摇杆注记
      this.defaultCheckedKeys.push(
        this.treeToOneArrFirst(this.treeData, "ggjc_xzqhjx").id
      );
      this.oldcheckedKeys.push(
        this.treeToOneArrFirst(this.treeData, "ggjc_xzqhjx").id
      );
      // this.defaultCheckedKeys.push(
      //   this.treeToOneArrFirst(this.treeData, 'ggjc_zj').id
      // );
      // this.oldcheckedKeys.push(
      //   this.treeToOneArrFirst(this.treeData, 'ggjc_zj').id
      // );
      // this.defaultExpandedKeys.push(
      //   this.treeToOneArrFirst(this.treeData, 'gyl_dl').id
      // );
      // this.oldcheckedKeys.push(
      //   this.treeToOneArrFirst(this.treeData, 'ggjc_zj').parentId
      // );
    });
  },

  mounted() {
    // 构建完成后，在添加注记图层进去
    this.$nextTick(() => {
      this.showSimplifyBoundary();
      // this.$refs['mapLayer'].addTdtImageLayer({
      //   url: 'http://t5.tianditu.gov.cn/DataServer?T=cia_c&x={1}&y={2}&l={0}&tk=f536641212889df16a6afaa1beff020b',
      //   name: '影像注记',
      //   typeName: 'cia_c',
      //   active: true,
      //   source: '国家·天地图',
      //   desc: '数据来源于国家天地图中的影像注记',
      //   method: 'image'
      // });
      this.tableBoxAatherHeight = this.$refs.mapLayer.$el.offsetHeight - 220;
    });
  },

  methods: {
    // 这是对左侧数样式修改成功后调用的
    treeUpdateSuccess() {
      // 之后调用接口查询左侧树状数据
      treeYztSlfh(this.yearValue)
        .then((res) => {
          const childArr = JSON.parse(JSON.stringify(res.data));

          this.treeData = childArr;
          // 这里是先对比查找出之前勾选的的数据
          const dataarr = this.treeToOneArr(
            // res.data.childList,
            childArr,
            this.oldcheckedKeys
          );
          const list = {
            checkedKeys: this.oldcheckedKeys,
            checkedNodes: dataarr,
          };
          // 这里就是直接调用树状勾选事件
          if (dataarr.length > 0) {
            this.handleCheckChange(dataarr[0], list);
            // 赋值勾选的值
            this.defaultCheckedKeys = this.oldcheckedKeys;
            // 控制对应的节点展开
            this.defaultExpandedKeys = [
              ...new Set(
                dataarr.map((item) => {
                  return item.parentId;
                })
              ),
            ];
          } else {
            this.defaultCheckedKeys = [];
            this.defaultExpandedKeys = [];
          }
        })
        .catch(() => {});
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

    showSimplifyBoundary() {
      this.mapQuery.type = 0;
      this.mapQuery.tolerance = this.$tolerance(this.mapQuery.areaCode);
      const areaObj = {};
      areaObj.areaCode = this.mapQuery.areaCode;
      this.query.areaCode = this.mapQuery.areaCode;
      areaObj.areaName = this.mapQuery.areaName;
      // 请求接口获取界限边界数据
      // 这里是在添加区划图层
      getSimplifyBoundary1(this.mapQuery).then((res) => {
        if (res.data.length <= 0) {
          return;
        }
        this.loading = false;
        this.getSimplifyBoundary1Obj = {
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
          vectorEventFun: (coordinate, feature) => {
            // if (this.mapAreaQuery.stopArea) {
            //   return;
            // }
            // this.clearTime();
            // this.mapTimer = setInterval(() => {
            //   // 护林员网格防止bug禁止区划下跳
            //   if (
            //     this.zoomInWKT ||
            //     this.zoomInPoint ||
            //     this.findTypeObj('hlywg')?.active
            //   ) {
            //     return;
            //   }
            //   if (feature) {
            //     const cur = feature.values_.attr;
            //     this.resetMapArea(cur);
            //   }
            //   this.clearTime();
            // }, 50);
          },
        };

        this.$refs.mapLayer.addCoordinateLayer(this.getSimplifyBoundary1Obj);
      });
    },

    // 处理地图点击后的详情弹框需要的值，通过id和类型查询不同的接口
    handleInfoFunction(id, type) {
      // type = 'fireprot_isolation';
      // id = '1729750616085991426';
      let _this = this;
      return new Promise((resolve, reject) => {
        if (this.oldId == id && this.oldType == type) {
          resolve(_this.clickDetailsData);
        } else {
          this.oldId = id;
          this.oldType = type;
          getDetailsApi(id, type, (res) => {
            if (res != "") {
              _this.clickDetailsData = res.data;
              resolve(res.data);
            } else {
              reject(false);
            }
          });
        }
      });
    },

    // 这里就是图层点击后回调的函数
    async getJcsbDetail(data, feature, type = "geoserver") {
      // console.log(`output->data`, data);
      // console.log(`output->feature`, feature);
      let popupObj = {};
      let selectId = "";
      let selectType = "";
      let selectTitle = "";
      if (type == "wkt") {
        // 获取要素的几何对象
        let geometry = feature.getGeometry();

        if (geometry.getType() === "Polygon") {
          // 获取几何对象的中心点
          let center = geometry.getInteriorPoint().getCoordinates();
          popupObj.coords = center;
        } else {
          popupObj.coords = data;
        }
        let wktData = feature.values_.attr;
        selectId = wktData.id;
        selectType = wktData.name;
        selectTitle = wktData.text;
      } else {
        // 获取要素的几何对象
        const point = feature.geometry;

        if (point.type === "Polygon") {
          // 获取几何对象的中心点
          console.log(`output->point.coordinates[0]`, point.coordinates[0]);
          let coordinates = point.coordinates[0];
          coordinates.forEach((item) => {
            item[0] = JSONbig.parse(item[0]).toString();
            item[1] = JSONbig.parse(item[1]).toString();
          });

          // 计算经度和纬度的平均值
          const sum = coordinates.reduce(
            (acc, coord) => [
              acc[0] + parseFloat(coord[0]),
              acc[1] + parseFloat(coord[1]),
            ],
            [0, 0]
          );
          const center = [
            sum[0] / coordinates.length,
            sum[1] / coordinates.length,
          ];
          // let center = getCenter(coordinates);
          popupObj.coords = center;
        } else {
          popupObj.coords = point.coordinates;
        }

        let geoserverData = data;
        selectTitle = geoserverData.fire_source_point_name;
        selectId = geoserverData.id.toString();

        selectType = geoserverData.table_name;
      }

      console.log(`output->popupObj`, popupObj);
      let detailsData = await this.handleInfoFunction(selectId, selectType);
      let oneMapDialog = fireproofDict(selectType).oneMapDialog;
      const popupArr = [
        {
          key: "经度",
          value: popupObj.coords[0] ? popupObj.coords[0].toFixed(8) : "",
          type: "1",
          isshow: "isShowLong",
        },
        {
          key: "纬度",
          value: popupObj.coords[1] ? popupObj.coords[1].toFixed(8) : "",
          type: "1",
          isshow: "isShowLat",
        },
        {
          key: "行政区划",
          value: detailsData?.sysAreaVO?.areaFullName
            ? detailsData.sysAreaVO.areaFullName
            : "",
          width: "100%",
        },
      ];
      oneMapDialog.forEach((item) => {
        popupArr.unshift({
          key: item.label,
          value: detailsData[item.value] || "",
          width: "100%",
        });
      });

      popupObj.title = selectTitle;
      popupObj.content = popupArr;
      popupObj.buttons = [
        {
          name: "详情",
          type: "dialog",
          url: "",
          dialog: {
            name: "personelInfoBtn",
            visible: true,
            params: {
              id: selectId,
              type: selectType,
            },
          },
        },
      ];
      this.$refs["mapLayer"].addPopup(popupObj);
    },

    personelInfoBtn(data1, data2) {
      this.dialogVisible = true;
      this.detailObject = data2;
      this.dialogType = data2.type;
    },

    // 查询图片blog数据
    getSrcBlob(name) {
      return new Promise((resolve, reject) => {
        if (name) {
          commonDownload({
            uniqueName: name,
          }).then((res) => {
            const blob = new Blob([res.file], {
              type: res.file.type, // 替换为对应的图片类型
            });
            let srcdata = URL.createObjectURL(blob);
            console.log(`output->srcdata`, srcdata);
            resolve(srcdata);
          });
        } else {
          reject("");
        }
      });
    },

    // 绘制wkt图层
    async addWktLayerFunction(selectData) {
      console.log(`output->`, selectData);
      this.$refs["mapLayer"].closePopup();
      let mapLayers = this.$refs["mapLayer"].map.getLayers().getArray();
      let ishas = false;
      // 图层存在就直接展示
      for (let i = 0; i < mapLayers.length; i++) {
        const item = mapLayers[i];
        if (selectData.geoBsm == item.values_.name) {
          item.setVisible(true);
          return true;
        }
      }
      if (!ishas) {
        let imgurl = fireproofDict(selectData.geoBsm).imgurl;
        let text = fireproofDict(selectData.geoBsm).text;

        let coordsArr = this.mapTypeWktDataList[selectData.geoBsm].map(
          (item) => {
            return {
              boundaryLine: item.boundaryLine,
              id: item.id,
              text: item.title || text,
              name: selectData.geoBsm,
            };
          }
        );
        const obj = {};
        obj.name = selectData.geoBsm;
        obj.active = true;
        obj.coordField = "boundaryLine";
        obj.textField = "text";
        // obj.coordsArr = [
        //   {
        //     boundaryLine: 'POLYGON((115.20212173461914 28.344039916992188,116.08102798461914 27.904586791992188,115.18014907836914 26.882858276367188,115.20212173461914 28.344039916992188))',
        //     id: 2222,
        //     text: '3333',
        //     name: '4444'
        //   }
        // ];
        obj.coordsArr = coordsArr;
        obj.position = 10;
        obj.coordsStyle = {
          text: {
            font: "bold 16px Arial",
            textAlign: "center",
            textBaseline: "middle",
            offsetY: 35,
            offsetX: 0,
            padding: [5, 5, 5, 5],
            fill: {
              color: "#fff",
            },
            stroke: {
              color: "#000",
              width: 2,
            },
            overflow: true,
          },
          // fill: {
          //   color: "rgba(0, 255, 0, 0.4)",
          // },
          fill: {
            color: set16ToRgb(selectData.fillColor),
          },
          stroke: {
            width: selectData.strokeWidth || 0,
            color: selectData.strokeColor,
          },
        };
        // 绘制聚合点位的样式
        obj.clusterStyle = {
          text: {
            // font: 'bold 18px Arial',
            textAlign: "center",
            textBaseline: "middle",
            offsetY: 35,
            offsetX: 0,
            padding: [5, 5, 5, 5],
            fill: {
              color: "#000",
            },
            stroke: {
              color: "#000",
              width: 2,
            },
            overflow: true,
          },
          circle: {
            fill: {
              // color: 'rgba(0, 255, 0, 0.6)'
              color: selectData.fillColor,
            },
            // stroke: {
            //   color: '#000',
            //   width: 2
            // }
          },
        };
        // obj.unitName = '啊哈哈哈';
        if (selectData.pointWellKnownName) {
          obj.coordsStyle.image = {
            src: await this.getSrcBlob(selectData.pointWellKnownName),
            // imgSize: [44, 52],
            size: [50, 60],
            // anchor: [0.5, 0.5],
            // scale: 0.2,
          };
        }
        console.log(`output->obj`, obj);
        obj.isSelect = true;
        obj.callback = (data) => {
          // this.$refs['mapLayer'].closePopup();
          // 点和面点击返回不同
          if (selectData.geometryType == "Point") {
            if (data.values_.features.length == 1) {
              let featureData = data.values_.features[0];
              const geometry = featureData.getGeometry();
              const coordinate = geometry.getCoordinates();
              this.getJcsbDetail(coordinate, featureData, "wkt");
            }
          } else {
            const geometry = data.getGeometry();
            const coordinate = geometry.getCoordinates();
            this.getJcsbDetail(coordinate, data, "wkt");
          }
        };
        // obj.layerEventType = 'click';
        // obj.click = (coordinate, feature) => {
        //   this.$refs['mapLayer'].closePopup();
        //   console.log(`output->feature`, feature);
        //   this.getJcsbDetail(coordinate, feature, 'wkt');
        // };
        obj.fit = true;

        // 类型点需要用聚合创建，面的不用
        if (selectData.geometryType == "Point") {
          this.mapTypeList.push(
            this.$refs["mapLayer"].addClusterCoordinateArryLayer(obj)
          );
        } else {
          this.mapTypeList.push(this.$refs["mapLayer"].addCoordinateLayer(obj));
        }
      }
    },

    // 数据分类处理
    groupBy(array, f) {
      const groups = {};
      array.forEach(function (o) {
        var group = JSON.stringify(f(o));
        groups[group] = groups[group] || [];
        groups[group].push(o);
      });
      return Object.keys(groups).map(function (group) {
        return groups[group];
      });
    },

    // 数据分类处理
    arrayGroupBy(list, groupId) {
      const sorted = this.groupBy(list, function (item) {
        return [item[groupId]];
      });
      return sorted;
    },

    // 树的勾选事件，创建图层的操作全在这里了
    handleCheckChange(data, list) {
      // 先把勾选的key保留下来
      this.oldcheckedKeys = JSON.parse(JSON.stringify(list.checkedKeys));
      if (list.checkedNodes.length > 0) {
        // 图层全部关闭
        this.mapTypeList.forEach((ita) => {
          ita.active = false;
          // this.getMapType(ita);
        });
        let mapLayers = this.$refs["mapLayer"].map.getLayers().getArray();
        mapLayers.forEach((item) => {
          if (this.type3Arr.includes(item.values_.name)) {
            item.setVisible(false);
          }
        });
        let isshowNoteLayer = false; // 判断遥感影像注记是否被勾选
        let isshowSimplifyBoundary = false; // 判断行政区域划界限是否被勾选
        const idArr = [];
        // 对勾选的数据进行一个分组操作，通过type区分，区分后就相当于是一个一个的图层，然后再对
        // 区分的数组进行一个循环吧里面的sql语句组合起来
        const checkedNodes = this.arrayGroupBy(list.checkedNodes, "type");

        checkedNodes.forEach((checkItem) => {
          // type类型 0是目录 3是简单图层就是wkt数据 2是已发布的图层就自己的一张图没有sql筛选的 4就是2图层下的带有sql筛选出来的
          if (checkItem[0].type == "3") {
            checkItem.forEach((item, index) => {
              if (!this.type3Arr.includes(item.geoBsm)) {
                this.type3Arr.push(item.geoBsm);
              }
              if (this.mapTypeWktDataList[item.geoBsm]) {
                this.addWktLayerFunction(item);
              } else {
                treeYztSlfhWkt({
                  tableName: item.geoBsm,
                  name: item.columnName || "name",
                }).then((reswkt) => {
                  this.mapTypeWktDataList[item.geoBsm] = reswkt.data;
                  this.addWktLayerFunction(item);
                });
              }
            });
          }
          if (checkItem[0].type == "2") {
            // 这里是创建多图层
            checkItem.forEach((item, index) => {
              // if (item.cqlFilter) {
              idArr.push(item.id);
              // }

              // 现在mapTypeList图层数组中查找看之前有没有创建过图层
              const dataFind = this.mapTypeList.find((it) => {
                return it.type == item.cnName + item.id;
              });

              if (!dataFind) {
                // 没有找就创建
                const selectData = {};
                selectData.isChange = true;
                selectData.tableName = item.geoBsm;
                selectData.layerName = item.geoBsm;
                selectData.url = item.mapUrl;
                selectData.work = item.workArea;
                selectData.type = item.cnName + item.id;
                selectData.fit = false;
                selectData.filterSql = "";
                selectData.getData = () => {
                  const obj = this.findTypeObj(item.cnName + item.id);
                  obj.list = [{}];
                  obj.layerType = 1;
                  this.changeMap(obj.type, obj.active);
                };
                selectData.getDetail = (data, feature) => {
                  this.getJcsbDetail(data, feature);
                };
                this.mapTypeList.push(selectData);
                this.changeTypeShow(selectData);
              } else {
                // 找到就把特层开启，在吧sql更新上去
                dataFind.active = true;
              }
            });
            this.selectLegendId = JSON.parse(JSON.stringify(idArr));
          }
          if (checkItem[0].type == "4") {
            // 这里是创建一张图层，里面有很多筛选条件区分
            let filterSql = "";
            // 拼接sql语句
            checkItem.forEach((item, index) => {
              filterSql += " or " + item.cqlFilter;
              if (item.cqlFilter) {
                idArr.push(item.id);
              }
            });
            this.selectLegendId = JSON.parse(JSON.stringify(idArr));

            // sql语句拼装并且去除空值
            filterSql = filterSql.split(" or ").filter((s) => {
              return s != "null" && s && s.trim(); // 注：IE9(不包含IE9)以下的版本没有trim()方法
            });

            // 现在mapTypeList图层数组中查找看之前有没有创建过图层
            const dataFind = this.mapTypeList.find((it) => {
              return it.type == checkItem[0].forestCode + this.yearValue;
            });
            const filterText = `(${filterSql.join(" or ")})`;
            // const filterText = `(${filterSql.join(" or ")})and xiang like '${
            //   this.query.areaCode
            // }%'`;
            if (!dataFind) {
              // 没有找就创建
              const selectData = {};
              selectData.isChange = true;
              selectData.tableName = checkItem[0].geoBsm;
              selectData.layerName = checkItem[0].geoBsm;
              selectData.url = checkItem[0].mapUrl;
              selectData.work = checkItem[0].workArea;
              selectData.type = checkItem[0].forestCode + this.yearValue;
              selectData.fit = false;
              selectData.filterSql = filterText;
              selectData.getData = () => {
                const obj = this.findTypeObj(
                  checkItem[0].forestCode + this.yearValue
                );
                obj.list = [{}];
                obj.layerType = 1;
                this.changeMap(obj.type, obj.active);
              };
              selectData.getDetail = (data, feature) => {
                this.getJcsbDetail(data, feature);
              };
              this.mapTypeList.push(selectData);
              this.changeTypeShow(selectData);
            } else {
              // 找到就把特层开启，在吧sql更新上去
              dataFind.active = true;
              dataFind.filterSql = filterText;
            }
          }
          if (checkItem[0].type == -100) {
            //注记和区划界限
            checkItem.forEach((item, index) => {
              if (item.enName === "ggjc_xzqhjx") {
                isshowSimplifyBoundary = true;
              }
              if (item.enName === "ggjc_zj") {
                isshowNoteLayer = true;
              }
            });
          }
        });

        this.getMapType(); // 这个就是更新图层的方法，可以理解为重新渲染图层数组中的图层

        //         一张图页面，面积统计规则：
        // 1：用户勾选某种类型下，同级别的不同类型，则不展示面积统计
        // 2：用户勾选不同类型，则不展示面积统计
        let isquest = true;

        // 说明选择了2种不同的图层
        if (
          (isshowNoteLayer || isshowSimplifyBoundary) &&
          checkedNodes.length == 1
        ) {
          isquest = false;
        }
        if (
          (isshowNoteLayer || isshowSimplifyBoundary) &&
          checkedNodes.length >= 3
        ) {
          isquest = false;
        }
        if (
          !isshowNoteLayer &&
          !isshowSimplifyBoundary &&
          checkedNodes.length >= 2
        ) {
          isquest = false;
        }
        // 1：用户勾选某种类型下，同级别的不同类型，则不展示面积统计,用foneSize判断是因为有些一个操作一层一层往下修改foneSize，所以同层的foneSize肯定是一样的，再往下肯定更小
        // checkedNodes本身就被处理过，同一个图层的会被放在一个数组里，上面就已经判断过多个图层的可能了，到这里就是判断一个图层里的是否有同层勾选的问题了
        // 这里会有一种情况漏掉，当我勾选一个二级的，在勾选同层级在往下一个层级的图层会判断不到，
        // for (let i = 0; i < checkedNodes.length; i++) {
        //   for (let x = 0; x < checkedNodes[i].length; x++) {
        //     for (let y = 0; y < checkedNodes[i].length; y++) {
        //       // 这里判断foneSize相同说明是同一层的
        //       if (checkedNodes[i][x].foneSize === checkedNodes[i][y].foneSize) {
        //         if (
        //           checkedNodes[i][x].parentId !== checkedNodes[i][y].parentId
        //         ) {
        //           isquest = false;
        //           break;
        //         }
        //       }
        //     }
        //   }
        // }
        // this.isGyl = false;
        // // 这里区分公益林和其他，因为公益林的统计展示不一样
        // checkedNodes.forEach((item) => {
        //   item.forEach((it) => {
        //     if (this.gylParentId.includes(it.parentId)) {
        //       this.isGyl = true;
        //     }
        //   });
        // });
        // if (this.isGyl) {
        //   if (isquest) {
        //     // 查询区划统计-实时
        //     this.tableBoxAather = true;
        //     this.areageLoading = true;
        //     // legendAcreage({
        //     //   booleanPublic: this.isGyl,
        //     //   areaCode: this.query.areaCode,
        //     //   masterId: this.yearValue,
        //     //   legendId: idArr.join()
        //     // })
        //     //   .then((res) => {
        //     //     this.tableDataGyl = JSON.parse(JSON.stringify(res.data));
        //     //     this.areageLoading = false;
        //     //   })
        //     //   .catch(() => {
        //     //     this.areageLoading = false;
        //     //     this.tableBoxAather = false;
        //     //   });
        //   } else {
        //     this.tableBoxAather = false;
        //   }
        // } else {
        //   if (isquest) {
        //     // 查询区划统计-实时
        //     this.tableBoxAather = true;
        //     this.areageLoading = true;
        //     // legendAcreage({
        //     //   booleanPublic: this.isGyl,
        //     //   areaCode: this.query.areaCode,
        //     //   masterId: this.yearValue,
        //     //   legendId: idArr.join()
        //     // })
        //     //   .then((res) => {
        //     //     this.tableData = JSON.parse(JSON.stringify(res.data));
        //     //     this.areageLoading = false;
        //     //   })
        //     //   .catch(() => {
        //     //     this.areageLoading = false;
        //     //     this.tableBoxAather = false;
        //     //   });
        //   } else {
        //     this.tableBoxAather = false;
        //   }
        // }

        if (isshowNoteLayer) {
          this.$refs["mapLayer"].addTdtImageLayer({
            url: "http://t5.tianditu.gov.cn/DataServer?T=cia_c&x={1}&y={2}&l={0}&tk=f536641212889df16a6afaa1beff020b",
            name: "影像注记",
            typeName: "cia_c",
            active: true,
            source: "国家·天地图",
            desc: "数据来源于国家天地图中的影像注记",
            method: "image",
          });
        } else {
          this.$refs["mapLayer"].removeLayer({ name: "cia_c" });
        }
        if (isshowSimplifyBoundary) {
          const areaObj = {};
          areaObj.areaCode = this.mapQuery.areaCode;
          areaObj.areaName = this.mapQuery.areaName;
          this.mapAreaList.push(areaObj);
          this.getSimplifyBoundary1Obj.fit = false;
          this.$refs["mapLayer"].addCoordinateLayer(
            this.getSimplifyBoundary1Obj
          );
        } else {
          this.$refs["mapLayer"].removeLayerByName("area_layer");
        }
      } else {
        // 这里就是没有任何勾选，要把所有的图层都关闭
        this.$refs["mapLayer"].removeLayerByName("area_layer");
        this.$refs["mapLayer"].removeLayer({ name: "cia_c" });

        let mapLayers = this.$refs["mapLayer"].map.getLayers().getArray();
        mapLayers.forEach((item) => {
          for (let key in this.mapTypeWktDataList) {
            if (item.values_.name == key) {
              item.setVisible(false);
            }
          }
        });
        if (this.mapTypeList.length > 0) {
          this.mapTypeList.forEach((item) => {
            item.active = false; // 组件封装里会取反这里就是循环吧图层关闭，虽说只有一张图层
            this.getMapType(item);
          });
        }
      }
    },

    // 处理树状图数据，返回type等于name的item arr 要处理的树状数据
    treeToOneArrFirst(arr, name) {
      const data = JSON.parse(JSON.stringify(arr)); // 对传入的参数进行深拷贝
      const newData = []; // 创建空数组用来接收操作后的新数组
      const hasChildren = (item) => {
        // 递归遍历，把包含children的选项拿出来，push到之前新建的空数组内
        (item.childList || (item.childList = [])).map((v) => {
          hasChildren(v);
        });
        delete item.childList; // 删除原children属性，可选项
        newData.push(item);
      };
      data.map((v) => hasChildren(v));

      let selectData;
      selectData = newData.find((item) => {
        return item.enName === name;
      })
        ? newData.find((item) => {
            return item.enName === name;
          })
        : "";

      return selectData;
    },

    // arr 要处理的树状数据，selectArr用来对比查找的数组，就是勾选的数组
    treeToOneArr(arr, selectArr) {
      const data = JSON.parse(JSON.stringify(arr)); // 对传入的参数进行深拷贝
      const newData = []; // 创建空数组用来接收操作后的新数组
      const hasChildren = (item) => {
        // 递归遍历，把包含children的选项拿出来，push到之前新建的空数组内
        (item.childList || (item.childList = [])).map((v) => {
          hasChildren(v);
        });
        delete item.childList; // 删除原children属性，可选项
        newData.push(item);
      };
      data.map((v) => hasChildren(v));

      let selectData = [];
      selectData = selectArr.map((item) => {
        return newData.find((it) => {
          return it.id == item;
        });
      });

      return selectData;
    },

    // arr 要处理的树状数据，selectArr用来对比查找的数组，就是勾选的数组
    // childList字符串子类的参数名，name字符串用来对比查找的参数
    // fun字符串传‘filter’或者‘find’ 匹配多个，或者匹配一个
    treeToOneArrAll(arr, selectArr, childList, name, fun = "filter") {
      const data = JSON.parse(JSON.stringify(arr)); // 对传入的参数进行深拷贝
      const newData = []; // 创建空数组用来接收操作后的新数组
      const hasChildren = (item) => {
        // 递归遍历，把包含children的选项拿出来，push到之前新建的空数组内
        (item[childList] || (item[childList] = [])).map((v) => {
          hasChildren(v);
        });
        delete item[childList]; // 删除原children属性，可选项
        newData.push(item);
      };
      data.map((v) => hasChildren(v));

      let selectData;
      selectData = selectArr.map((item) => {
        return newData[fun]((it) => {
          return it[name] == item;
        });
      });

      return fun == "filter" ? selectData[0] : selectData;
    },

    // 遍历添加字体大小
    inputSize(data, size, fontWeight) {
      data.forEach((item) => {
        item.foneSize = size <= 13 ? 13 : size;
        item.fontWeight = fontWeight;
        if (item.childList && item.childList.length > 0) {
          this.inputSize(item.childList, size - 1, fontWeight - 50);
        }
      });
      return data;
    },

    // 年份切换事件
    yearChange(data) {
      // 这里是在处理选择的行政区划，因为面积统计查询接口的areaCodes，传递是要吧对应的子集code也传过去
      const selectAreaList = this.treeToOneArrAll(
        this.$refs["area-filter"].tree,
        [this.query.areaCode],
        "sysAreaList",
        "parentAreaCode"
      );
      let areaCodes = [];
      if (selectAreaList.length > 0) {
        selectAreaList.forEach((item) => {
          areaCodes.push(item.areaCode);
        });
      } else {
        areaCodes = [this.query.areaCode];
      }

      // 之后调用接口查询左侧树状数据
      treeYztSlfh(this.yearValue)
        .then((res) => {
          const childArr = JSON.parse(JSON.stringify(res.data));

          this.treeData = childArr;
          // 这里是先对比查找出之前勾选的的数据
          const dataarr = this.treeToOneArr(
            // res.data.childList,
            childArr,
            this.oldcheckedKeys
          );
          const list = {
            checkedKeys: this.oldcheckedKeys,
            checkedNodes: dataarr,
          };
          // 这里就是直接调用树状勾选事件
          if (dataarr.length > 0) {
            this.handleCheckChange(dataarr[0], list);
            // 赋值勾选的值
            this.defaultCheckedKeys = this.oldcheckedKeys;
            // 控制对应的节点展开
            this.defaultExpandedKeys = [
              ...new Set(
                dataarr.map((item) => {
                  return item.parentId;
                })
              ),
            ];
          } else {
            this.defaultCheckedKeys = [];
            this.defaultExpandedKeys = [];
          }
        })
        .catch(() => {});
    },

    // 卷帘年份切换事件
    rollerYearChange(
      yearId,
      rollerList2,
      rollerList1,
      rollerMap2,
      rollerMap1,
      type
    ) {
      // 之后调用接口查询左侧树状数据
      treeYztSlfh(yearId)
        // mapMenuYZTQuery(yearId)
        .then((res) => {
          const childArr = JSON.parse(JSON.stringify(res.data));
          // const childArr = [];
          // for (const key in res.data) {
          //   if (res.data[key]) {
          //     childArr.push(res.data[key]);
          //   }
          // }
          // res.data.forEach((item) => {
          //   childArr.push(_.cloneDeep(item));
          // });

          // 这里是先对比查找出之前勾选的的数据
          const dataarr = this.treeToOneArr(
            // res.data.childList,
            childArr,
            this.oldcheckedKeys
          );
          const list = {
            checkedKeys: this.oldcheckedKeys,
            checkedNodes: dataarr,
          };
          // 这里就是直接调用树状勾选事件
          if (dataarr.length > 0) {
            // 第一个传参没用，第二个是勾选的树，第三个是卷帘图层列表，第四个是选择的年份的值
            this.handleCheckChange1(
              dataarr[0],
              list,
              rollerList2,
              rollerList1,
              rollerMap2,
              rollerMap1,
              yearId,
              type
            );
          }
        })
        .catch(() => {});
    },

    // 树的勾选事件，创建图层的操作全在这里了,这是给卷帘用的
    handleCheckChange1(
      data,
      list,
      rollerList2,
      rollerList1,
      rollerMap2,
      rollerMap1,
      yearId,
      type
    ) {
      // 先把勾选的key保留下来
      if (list.checkedNodes.length > 0) {
        // 对勾选的数据进行一个分组操作，通过forestCode区分，区分后就相当于是一个一个的图层，然后再对
        // 区分的数组进行一个循环吧里面的sql语句组合起来
        const checkedNodes = this.arrayGroupBy(list.checkedNodes, "forestCode");

        checkedNodes.forEach((checkItem) => {
          if (type == 2) {
            // 这是左侧的地图选择
            for (const key in rollerList2) {
              this.options.forEach((item) => {
                if (key == checkItem[0].forestCode + item.id) {
                  rollerList2[key].setVisible(false);
                }
              });
            }
            const layerArr = rollerMap2.getLayers().getArray();
            layerArr.forEach((it) => {
              this.options.forEach((item) => {
                if (it.values_.name == checkItem[0].forestCode + item.id) {
                  it.setVisible(false);
                }
              });
            });
          } else {
            // 这是又侧的地图选择

            for (const key in rollerList1) {
              this.options.forEach((item) => {
                if (key == checkItem[0].forestCode + item.id) {
                  rollerList1[key].setVisible(false);
                }
              });
            }
            const layerArr = rollerMap1.getLayers().getArray();
            layerArr.forEach((it) => {
              this.options.forEach((item) => {
                if (it.values_.name == checkItem[0].forestCode + item.id) {
                  it.setVisible(false);
                }
              });
            });
          }

          let filterSql = "";
          // 拼接sql语句
          checkItem.forEach((item, index) => {
            filterSql += " or " + item.cqlFilter;
          });

          // sql语句拼装并且去除空值
          filterSql = filterSql.split(" or ").filter((s) => {
            return s != "null" && s && s.trim(); // 注：IE9(不包含IE9)以下的版本没有trim()方法
          });
          if (filterSql) {
            // 现在mapTypeList图层数组中查找看之前有没有创建过图层
            let dataFind;
            if (type == 2) {
              dataFind = checkItem[0].forestCode + yearId in rollerList2;
            } else {
              dataFind = checkItem[0].forestCode + yearId in rollerList1;
            }

            const filterText = `(${filterSql.join(" or ")})and xiang like '${
              this.query.areaCode
            }%'`;

            if (!dataFind) {
              const obj = {};
              obj.layerInfo = {};
              obj.layerInfo.filter = filterText;
              obj.layerInfo.url = checkItem[0].mapUrl;
              obj.layerInfo.name = checkItem[0].forestCode + yearId;
              obj.layerInfo.work = checkItem[0].workArea;
              obj.layerInfo.visible = true;
              obj.layerInfo.fit = false;
              obj.layerInfo.position = 11;
              obj.layerInfo.layerName = checkItem[0].geoBsm;
              obj.layerEventFun = function () {};

              const layerInfo = obj.layerInfo;
              const layer = {};
              const name = layerInfo.name;
              const layerName = layerInfo.layerName;
              const work = layerInfo.work;
              const url = layerInfo.url;
              layer.url = `${url}${work}/wms`;
              layer.layers = `${work}:${layerName}`;
              layer.name = name;
              layer.position = layerInfo.position;
              layer.visible = layerInfo.visible;
              layer.filter = layerInfo.filter;
              layer.format = layerInfo.format || "image/png";
              layer.version = layerInfo.version || "1.1.1";
              const layerObj = this.$refs.mapLayer.initWmsLayer(layer);

              if (type == 2) {
                // 这是左侧的地图
                rollerList2[checkItem[0].forestCode + yearId] = layerObj;
                rollerMap2.addLayer(layerObj);
              } else {
                // 这是右侧地图
                rollerList1[checkItem[0].forestCode + yearId] = layerObj;
                rollerMap1.addLayer(layerObj);
              }
            } else {
              if (type == 2) {
                // 这是左侧的地图
                const layerArr = rollerMap2.getLayers().getArray();
                layerArr.forEach((it) => {
                  this.options.forEach((item) => {
                    if (it.values_.name == checkItem[0].forestCode + yearId) {
                      it.setVisible(true);
                    }
                  });
                });
              } else {
                // 这是右侧地图
                const layerArr = rollerMap1.getLayers().getArray();
                layerArr.forEach((it) => {
                  this.options.forEach((item) => {
                    if (it.values_.name == checkItem[0].forestCode + yearId) {
                      it.setVisible(true);
                    }
                  });
                });
              }
            }
          }
        });
      } else {
      }
    },

    // 省市修改事件
    areaChange(v) {
      // 这里是在处理选择的行政区划，因为面积统计查询接口的areaCodes，传递是要吧对应的子集code也传过去
      const selectAreaList = this.treeToOneArrAll(
        this.$refs["area-filter"].tree,
        [v[v.length - 1]],
        "sysAreaList",
        "parentAreaCode"
      );
      let areaCodes = [];
      if (selectAreaList.length > 0) {
        selectAreaList.forEach((item) => {
          areaCodes.push(item.areaCode);
        });
      } else {
        areaCodes = [v[v.length - 1]];
      }

      const temp = deepClone(v);
      // this.query.areaCode = temp;
      if (isArray(temp) && temp.length > 0) {
        this.query.areaCode = temp.pop();
      } else {
        this.query.areaCode = "";
      }

      // 这里是绘制新的行政边界线图层，先删除原先的，在创建新的
      this.$refs["mapLayer"].updateWmsLayersForBncode(this.query.areaCode);
      this.mapQuery.areaCode = this.query.areaCode;
      this.mapQuery.type = 0;
      this.mapQuery.tolerance = this.$tolerance(this.mapQuery.areaCode);
      getSimplifyBoundary1(this.mapQuery).then((res) => {
        this.$refs["mapLayer"].removeLayerByName("area_layer");
        this.getSimplifyBoundary1Obj = {
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
        this.$refs["mapLayer"].addCoordinateLayer(this.getSimplifyBoundary1Obj);
      });

      // 这里是获取树状数据
      treeYztSlfh(this.yearValue)
        // mapMenuYZTQuery(this.yearValue)
        .then((res) => {
          const childArr = JSON.parse(JSON.stringify(res.data));
          // for (const key in res.data) {
          //   childArr.push(res.data[key]);
          // }

          this.treeData = childArr || [];
          // 获取到树状数据后，通过之前保留下来之前勾选的[key],进行对比操作
          // 在新树上从新勾选上
          const dataarr = this.treeToOneArr(
            // res.data.childList,
            childArr,
            this.oldcheckedKeys
          );
          const list = {
            checkedKeys: this.oldcheckedKeys,
            checkedNodes: dataarr,
          };
          if (dataarr.length > 0) {
            // 通过勾选的key得到对应新树的勾选item，之后调用树状的修改事件
            // 从而从新绘制图层
            this.handleCheckChange(dataarr[0], list);
            // 这里就是赋值上勾选key以及对应展开树
            this.defaultCheckedKeys = this.oldcheckedKeys;
            this.defaultExpandedKeys = [
              ...new Set(
                dataarr.map((item) => {
                  return item.parentId;
                })
              ),
            ];
          } else {
            this.defaultCheckedKeys = [];
            this.defaultExpandedKeys = [];
          }
        })
        .catch(() => {
          this.treeData = [];
        });
    },
    // 统计导出
    downExcelClick() {
      if (this.selectLegendId.length > 0) {
        legendAcreageDown({
          booleanPublic: this.isGyl,
          areaCode: this.query.areaCode,
          masterId: this.yearValue,
          legendId: this.selectLegendId.join(),
        }).then((res) => {
          downloadFile(res.file, "面积统计");
        });
      } else {
        return;
      }
    },

    // 面积统计的表格合并操作
    mergeComon(id, rowIndex) {
      // 合并单元格
      const idName = this.tableData[rowIndex][id];
      if (rowIndex > 0) {
        // eslint-disable-next-line eqeqeq
        if (this.tableData[rowIndex][id] != this.tableData[rowIndex - 1][id]) {
          let i = rowIndex;
          let num = 0;
          while (i < this.tableData.length) {
            if (this.tableData[i][id] === idName) {
              i++;
              num++;
            } else {
              i = this.tableData.length;
            }
          }
          return {
            rowspan: num,
            colspan: 1,
          };
        } else {
          return {
            rowspan: 0,
            colspan: 1,
          };
        }
      } else {
        let i = rowIndex;
        let num = 0;
        while (i < this.tableData.length) {
          if (this.tableData[i][id] === idName) {
            i++;
            num++;
          } else {
            i = this.tableData.length;
          }
        }
        return {
          rowspan: num,
          colspan: 1,
        };
      }
    },

    // 面积统计的表格合并操作
    mergeComonGyl(id, rowIndex) {
      // 合并单元格
      const idName = this.tableDataGyl[rowIndex][id];
      if (rowIndex > 0) {
        // eslint-disable-next-line eqeqeq
        if (
          this.tableDataGyl[rowIndex][id] != this.tableDataGyl[rowIndex - 1][id]
        ) {
          let i = rowIndex;
          let num = 0;
          while (i < this.tableDataGyl.length) {
            if (this.tableDataGyl[i][id] === idName) {
              i++;
              num++;
            } else {
              i = this.tableDataGyl.length;
            }
          }
          return {
            rowspan: num,
            colspan: 1,
          };
        } else {
          return {
            rowspan: 0,
            colspan: 1,
          };
        }
      } else {
        let i = rowIndex;
        let num = 0;
        while (i < this.tableDataGyl.length) {
          if (this.tableDataGyl[i][id] === idName) {
            i++;
            num++;
          } else {
            i = this.tableDataGyl.length;
          }
        }
        return {
          rowspan: num,
          colspan: 1,
        };
      }
    },

    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 1) {
        return this.mergeComon("areaCnName", rowIndex);
      }
    },
    objectSpanMethodGyl({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 1) {
        return this.mergeComonGyl("areaCnName", rowIndex);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
// // $fontColor: #fff;
// // $backgroundColor: rgba(2, 11, 38, 1);
// // $borderColor: 1px solid rgba(101, 216, 227, 0.4);
$fontColor: #000;
$backgroundColor: rgba(255, 255, 255, 1);
$borderColor: 1px solid #dfe6ec;
.selects {
  font-size: 14px;
  position: absolute;
  top: 30px;
  left: 20px;
  z-index: 1;
  // width: 0;
  height: 0;
  .table-btn {
    position: absolute;
    height: 32px;
    color: $fontColor;
    background-color: $backgroundColor;
    border: $borderColor;
    // color: #fff;
    // border: 1px solid rgba(101, 216, 227, 0.4) !important;
    // background-color: rgba(2, 11, 38, 0.9) !important;
  }
  .resources-tree {
    float: left;
    min-width: 200px;
    color: $fontColor;
    background-color: $backgroundColor;
    border-radius: 12px;
    overflow: hidden;
    border: $borderColor;
    // color: #fff;
    // border: 1px solid rgba(101, 216, 227, 0.4) !important;
    // background-color: rgba(2, 11, 38, 0.7) !important;
    .tree-title-box {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 320px;
      position: relative;
      .title {
        font-size: 16px;
        width: 100%;
        text-align: center;
        height: 50px;
        padding: 5px;
        line-height: 40px;
        border-bottom: $borderColor;
        // font-weight: 600;
      }
    }

    .tree {
      width: 320px;
      // background-color: rgba(2, 11, 38, 0) !important;
      background-color: $backgroundColor;
      max-height: 500px;
      overflow: auto;
      z-index: 1;
    }
  }
}

.table-box-father {
  position: relative;
  top: 55px;
  right: 0;
  z-index: 1;
  .table-icon {
    position: absolute;
    right: 12px;
    top: 20px;
    // background-color: rgba(2, 11, 38, 1);
    // border: 1px solid rgba(101, 216, 227, 1);
    // color: #fff;
    border: $borderColor;
    color: $fontColor;
    background-color: $backgroundColor;
    height: 30px;
    font-size: 12px;
    // width: 600px;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 3;
    cursor: pointer;
    padding: 5px;
  }
  .table-close {
    position: absolute;
    right: 12px;
    top: 20px;
    height: 50px;
    width: 600px;
    // border-top: 1px solid rgba(101, 216, 227, 1);
    // border-left: 1px solid rgba(101, 216, 227, 1);
    // border-right: 1px solid rgba(101, 216, 227, 1);
    border-top: $borderColor;
    border-left: $borderColor;
    border-right: $borderColor;
    // background-color: rgba(2, 11, 38, 1);
    // color: #fff;

    color: $fontColor;
    background-color: $backgroundColor;
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
    justify-content: space-between;
    padding: 20px 10px;
    border-radius: 12px 12px 0 0;
    .title {
      font-size: 18px;
      font-weight: 500;
    }
  }
  .table-box {
    position: absolute;
    top: 69px;
    right: 12px;
    width: 600px;
    border-radius: 0 0 12px 12px;
    overflow: hidden;
    border: $borderColor;
    // height: 700px;
    // background: rgba(255, 255, 255, 0.8);
    // overflow: auto;
  }
}

.contrast-box {
  position: relative;
  top: 50px;
  right: 0;
  z-index: 1;

  .contrast-content {
    position: absolute;
    top: 50px;
    right: 12px;
    width: 450px;
    height: 500px;
    background: rgba(255, 255, 255, 1);
    overflow: auto;

    .content-close {
      padding: 10px;
      color: #000;
      font-weight: 600;
      width: 100%;
      display: flex;
      font-size: 22px;
      flex-direction: row-reverse;
      cursor: pointer;
    }
    .content-title {
      width: 100%;
      padding: 0 10px;
      display: flex;
      justify-content: space-between;
      .title {
        color: #1887cd;
        font-size: 22px;
      }
      .btn {
        font-size: 22px;
        color: #e6522c;
        cursor: pointer;
      }
    }
    .content-details {
      padding: 10px;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      .details-item {
        width: 200px;
        height: 30px;
        // border: 1px solid #000;
        color: #000;
        display: flex;
        align-items: center;
      }
    }
  }
}

.contrast-year-box {
  .content-search {
    margin-bottom: 20px;
    display: flex;
    align-items: center;
  }
}
</style>
<style scoped>
/* 修改表格的背景色和边框颜色 */
.table-box >>> .el-table thead tr > th {
  /* color: #fff; */
  /* border: 1px solid rgba(101, 216, 227, 1); */
  /* background-color: rgba(2, 11, 38, 1); */

  color: var(--fontColor);
  background-color: var(--backgroundColor);
  border: var(--borderColor);
}
.table-box >>> .el-table tbody tr > td {
  /* color: #fff; */
  /* border: 1px solid rgba(101, 216, 227, 1); */
  /* background-color: rgba(2, 11, 38, 0.8); */
  color: var(--fontColor);
  background-color: var(--backgroundColor);
  border: var(--borderColor);
}

.table-box >>> .el-table tbody tr:hover > td {
  /* color: #fff; */
  /* border: 1px solid rgba(101, 216, 227, 1) !important; */
  /* background-color: rgba(2, 11, 38, 0.8) !important; */
  color: var(--fontColor);
  background-color: var(--backgroundColor);
  border: var(--borderColor);
}

.table-box >>> .el-table::before {
  /* background-color: transparent; */
  background-color: var(--backgroundColor);
}

/* 内容高度占满 */
.table-box >>> .el-table__body-wrapper {
  height: 100% !important;
}
/* 表格右侧滚动条去除 */
.table-box
  >>> .el-table--scrollable-y
  .el-table__body-wrapper::-webkit-scrollbar {
  width: 0px;
}

/* 去除表格右侧白边 */
.table-box >>> .el-table th.gutter {
  display: none;
  width: 0;
}
.table-box >>> .el-table colgroup col[name="gutter"] {
  display: none;
  width: 0;
}
/* 去除表格底色 */
.table-box >>> .el-table {
  /* background-color: transparent; */
  background-color: var(--backgroundColor);
}
.table-box >>> .el-table tr {
  /* background-color: transparent; */
  background-color: var(--backgroundColor);
}
/* 没有数据时的背景色 */
.table-box >>> .el-table__empty-block {
  /* color: var(--fontColor); */
  background-color: var(--backgroundColor);
  border: var(--borderColor);
  /* border: 1px solid rgba(101, 216, 227, 1); */
  /* background-color: rgba(2, 11, 38, 0.8); */
  display: flex;
  align-items: center;
}
/* 没有数据的提示文字样式 */
.table-box >>> .el-table__empty-text {
  /* color: #fff; */
  color: var(--fontColor);
}

.table-box >>> .el-table__body {
  width: 100% !important;
}

.toolbar-check-box >>> .el-radio {
  color: var(--fontColor);
  /* color: #fff; */
}

.table-box >>> .el-table--group,
.table-box >>> .el-table--border {
  border: 0px;
}
.table-box >>> .el-table--group::after,
.table-box >>> .el-table--border::after {
  width: 0;
}

.screen-input >>> .el-input__inner {
  color: var(--fontColor);
  background-color: var(--backgroundColor) !important;
  /* color: #fff; */
  border: 0px;
  /* background-color: rgba(2, 11, 38, 0.1) !important; */
}
</style>
<style>
.el-popover.area-table {
  /* background-color: #090d29; */
  /* border-color: rgba(101, 216, 227, 0.4); */
  /* color: var(--fontColor); */
  background-color: var(--backgroundColor);
  border: var(--borderColor);
}
.el-table {
  /* background-color: transparent; */
  background-color: var(--backgroundColor);
}
.el-table tr {
  /* background-color: transparent; */
  background-color: var(--backgroundColor);
}
</style>
