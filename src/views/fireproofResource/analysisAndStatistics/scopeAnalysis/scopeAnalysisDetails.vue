<!-- 局部范围提取分析详情页 -->
<template>
  <el-dialog
    v-loading="requestLoading"
    fullscreen
    title="分析报告"
    :visible.sync="dialogVisible"
    :before-close="onClose"
  >
    <div ref="app-container" class="app-container">
      <!-- 筛选条件、操作栏 -->
      <div class="search-content basic-details">
        <div class="text-title">基本信息</div>
        <!-- <div class="details-box">名称：XXXXX分析</div> -->
        <div class="flex details-box" style="margin-top: 20px">
          <div>分析名称：{{ basicData.title }}</div>
          <div>分析时间：{{ basicData.analyseTime }}</div>
          <div class="ml-10">
            分析用时：{{ (basicData.duration / 1000).toFixed(1) }}秒
          </div>
        </div>

        <div class="flex details-box" style="width: 90%; margin: 20px 0 10px 0">
          <div>分析对象：{{ basicData.cnCodeName }}</div>
          <!-- <div class="ml-10">涉及数据年份：{{ basicData.yearNo }}</div> -->
        </div>

        <div class="flex details-box" style="width: 90%; margin: 20px 0 10px 0">
          <div>分析描述：{{ basicData.describe }}</div>
          <!-- <div class="ml-10">涉及数据年份：{{ basicData.yearNo }}</div> -->
        </div>
        <!-- <div class="flex details-box">
          <div>上传文件：XXXXXXX</div>
        </div> -->
      </div>
      <!-- 主体内容 -->
      <el-row class="c-main">
        <!-- 左侧表格 -->
        <el-col id="app_l" :span="10" class="c-main-l analysis-repory">
          <div class="c-table-wrapper">
            <div class="text-title">详情</div>
            <el-tabs v-model="activeNameLeft" @tab-click="tabClick">
              <el-tab-pane
                label="数据列表"
                name="first"
                style="margin-top: -20px"
              >
                <el-collapse class="mt-10" accordion @change="collapseChange">
                  <el-collapse-item
                    v-for="(item, index) in analysisData"
                    :key="item[0].tableName"
                    :name="item[0].tableName"
                  >
                    <template slot="title">
                      <div class="collapse-title">
                        {{ index + 1 }}、{{
                          returnTitleName(item[0].tableName)
                        }}
                      </div>
                    </template>

                    <div style="padding: 5px">
                      <!-- <el-tabs v-model="item[0].tabsActiveName" type="card">
                        <el-tab-pane
                          v-for="(it, ind) in handleItem(tableData)"
                          :key="ind + 'id'"
                          label="列表"
                        > -->
                      <!-- :label="it[0].parentId + ''" -->
                      <el-table
                        :data="tableData"
                        :row-style="{ cursor: 'pointer' }"
                        style="width: 100%"
                        highlight-current-row
                        @selection-change="listSelectionChange"
                        @current-change="handleItemChange"
                      >
                        <el-table-column
                          align="center"
                          type="index"
                          width="100"
                          label="序号"
                        />

                        <template v-for="item in handleTable()">
                          <el-table-column
                            :label="item.label"
                            width="150"
                            show-overflow-tooltip
                            v-if="item.type == 'areaCode'"
                          >
                            <template slot-scope="scope">
                              <div>{{ scope.row.sysAreaVO.areaFullName }}</div>
                            </template>
                          </el-table-column>

                          <el-table-column
                            :label="item.label"
                            width="150"
                            show-overflow-tooltip
                            v-if="item.type == 'text'"
                          >
                            <template slot-scope="scope">
                              <div>
                                {{ scope.row[item.value] }}
                              </div>
                            </template>
                          </el-table-column>

                          <el-table-column
                            :label="item.label"
                            width="150"
                            show-overflow-tooltip
                            v-if="item.type == 'select'"
                          >
                            <template slot-scope="scope">
                              <dictionary-text
                                :code="item.dict"
                                :value="scope.row[item.value]"
                              />
                            </template>
                          </el-table-column>
                        </template>
                      </el-table>
                      <!-- </el-tab-pane>
                      </el-tabs> -->
                    </div>
                  </el-collapse-item>
                </el-collapse>
              </el-tab-pane>
              <!-- <el-tab-pane label="数据分析" name="second">
                <div ref="tuliBox" style="width: 100%; height: 500px">
                  <div id="tuli1" style="width: 100%; height: 500px" />
                </div>
              </el-tab-pane> -->
            </el-tabs>
          </div>
        </el-col>
        <!-- 右侧地图 -->
        <el-col id="app_r" :span="14" class="c-main-r analysis-repory1">
          <el-tabs
            v-model="tabAction"
            v-loading="loading"
            :class="{ 'c-tabs-fixed': tabFixed }"
            :style="{ width: tabWidth }"
            class="c-tabs"
          >
            <el-tab-pane key="map" label="地图" name="map">
              <keep-alive>
                <map-layer
                  :id="mapId"
                  ref="maplayer"
                  :height="mapHeight"
                  :image-fetch="false"
                />
              </keep-alive>
            </el-tab-pane>
            <el-tab-pane key="attr" label="属性" name="attr">
              <DetailsItem
                ref="detailsItem"
                :dialog-type="dialogType"
                :dialog-select-data="detailObject"
              />
            </el-tab-pane>
          </el-tabs>
        </el-col>
      </el-row>
    </div>
  </el-dialog>
</template>

<script>
import AreaSelect from "@/components/AreaSelect";
import AreaText from "@/components/AreaText";
import PreviewDocument from "@/components/PreviewDocument";
import DictionaryText from "@/components/DictionaryText";
import Pagination from "@/components/Pagination";
import MapLayer from "@/components/MapLayer"; //
import { isArray } from "@/utils/validate";
import { permissionPath, deepClone, dictLookup } from "@/utils";
// import forestAttr from '@/vendor/use-attr';
// import forestDict from '@/vendor/use-dict';
import {
  analysePolygonDetails,
  partailDetailData,
} from "@/api/scopeAnalysis/scopeAnalysis";
import { fireproofDict } from "@/vendor/resource";
import echarts from "@/utils/charts";
// import { dictLookup } from '@/utils';
import { mapGetters } from "vuex";
import WKT from "ol/format/WKT";
import DetailsItem from "./detailsItem.vue";
import { fetchDictionaryList, commonDownload } from "@/api/system";

export default {
  components: {
    Pagination,
    MapLayer,
    AreaSelect,
    PreviewDocument,
    AreaText,
    DictionaryText,
    DetailsItem,
  },
  filters: {
    statusFilter: (key, arr) => {
      const obj = arr.find((item) => key == item.value);
      return obj != undefined ? obj.label : "-";
    },
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false,
    },
    basicData: {
      type: Object,
      default() {
        return {};
      },
    },
    analysisData: {
      type: Array,
      default() {
        return [];
      },
    },
    forestCodeOptions: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      loading: false,

      // 地图相关
      mapId: "maplayer",
      mapHeight: "100%",
      appHeight: "0px",
      itemMapId: "item_map",
      itemMapHeight: "300px",

      listChange: [], // 需要设置的行
      listSelect: [], // 勾选的行
      itemChange: {}, // 选中的行
      selectTableName: "", // 选中的表名

      // 切换相关
      tabMap: [
        { label: "地图", key: "map", param: [] },
        { label: "属性", key: "attr", param: [] },
      ],
      tabFixed: false,
      tabWidth: "100%",
      tabAction: "map",

      tableData: [], // 存放表格数据

      // 单条详情相关
      itemParams: [], // 单条详情配置字典，用于动态生成详情
      attributeData: {}, // 单条详情数据

      // 分析表单相关
      // forestDict: {},
      forestProps: {
        value: "Code",
        label: "Name",
        disabled: "disabled",
        children: "Child",
      },

      activeNameLeft: "first",
      // 图例需要的
      dimensions: [],
      source: [],
      series: [],

      // 不同属性
      detailObject: {},
      dialogType: "", // 详情弹窗的类型
    };
  },
  created() {
    // this.forestDict = deepClone(forestDict);
  },
  computed: {
    ...mapGetters(["requestLoading"]),
  },
  mounted() {
    // 先对里面的数据进行升序排列
    for (let i = 0; i < this.analysisData.length; i++) {
      this.analysisData[i].sort(this.sortBy("parentId", 1));
    }
    // 这里对tabsActiveName赋值，为了tab页会默认选在第一个上
    for (let i = 0; i < this.analysisData.length; i++) {
      this.analysisData[i][0].tabsActiveName =
        this.analysisData[i][0].parentId + "";
    }
    // this.handleDataTL();
    this.$nextTick(() => {
      setTimeout(() => {
        const polygonArr = [];
        // this.analysisData.detailList.forEach((item) => {
        //   polygonArr.push({
        //     coords: item.boundaryLine,
        //     id: item.id
        //   });
        // });
        polygonArr.push({
          coords: this.basicData.boundaryLine,
          id: this.basicData.id,
        });
        const obj = {};
        obj.name = "intersect_layer";
        obj.coordField = "coords";
        obj.position = 10;
        obj.coordsArr = polygonArr;
        obj.coordsStyle = {
          // fill: {
          //   color: 'rgba(255, 255, 255, 0.4)'
          // },
          stroke: {
            width: 2,
            color: "#ffff00",
          },
        };
        obj.fit = true;
        this.$refs["maplayer"].addCoordinateLayer(obj);
      }, 0);
    });
  },
  beforeDestroy() {},
  methods: {
    // 动态国际化
    translate(type, key) {
      if (!key) {
        return;
      }
      const value = type + "." + key;
      return this.$t(value);
    },
    tabClick() {
      if (this.activeNameLeft == "first") {
      } else {
        this.$nextTick(() => {
          //         dataset: {
          //   dimensions: ['product', '2015', '2016', '2017'],
          //   source: [
          //     { product: 'Matcha Latte', 2015: 43.3, 2016: 85.8, 2017: 93.7 },
          //     { product: 'Milk Tea', 2015: 83.1, 2016: 73.4, 2017: 55.1 },
          //     { product: 'Cheese Cocoa', 2015: 86.4, 2016: 65.2, 2017: 82.5 },
          //     { product: 'Walnut Brownie', 2015: 72.4, 2016: 53.9, 2017: 39.1 }
          //   ]
          // },
          // xAxis: { type: 'category' },
          // yAxis: {},
          // // Declare several bar series, each will be mapped
          // // to a column of dataset.source by default.
          // series: [{ type: 'bar', barMaxWidth: 150 }, { type: 'bar', barMaxWidth: 150 }, { type: 'bar', barMaxWidth: 150 }]
          const chartdom = document.getElementById("tuli1");
          const mychart = echarts.init(chartdom);

          const option = {
            legend: {},
            tooltip: {},
            dataset: {
              dimensions: this.dimensions,
              source: this.source,
            },
            xAxis: { type: "category" },
            yAxis: {},
            series: this.series,
          };

          mychart.setOption(option);
          // mychart.resize();
        });
      }
    },
    getTitle(item) {
      const data = dictLookup(
        this.forestCodeOptions,
        item[0].forestCode,
        "code",
        "name"
      );
      return data;
    },

    async collapseChange(data) {
      if (data) {
        this.tableData = [];
        this.selectTableName = data;
        // 在这里先把用户点击下去那一类，其中有用到的字典的现在这里请求一遍，如果不这样做在循环创建表格的时候就会请求很多次字典接口，场景就是直接在这个页面刷新，本地字典都没有缓存时。
        // 获取本地字典，判断是否存在
        const dictionary = this.$store.getters.dictionary;
        let dictArr = fireproofDict(data).dictName;
        for (let i = 0; i < dictArr.length; i++) {
          if (!dictionary[dictArr[i]]) {
            await fetchDictionaryList({ code: dictArr[i] }).then((res) => {
              // 更新到本地字典
              dictionary[dictArr[i]] = res.data;
              this.$store.dispatch("app/setDictionary", dictionary);
            });
          }
        }

        setTimeout(() => {
          partailDetailData({
            id: this.basicData.id,
            tableName: data,
          }).then((res) => {
            this.tableData = res.data;
          });
        }, 0);
      }
    },

    returnTitleName(type) {
      let data = fireproofDict(type);
      return data.text;
    },

    listSelectionChange(data) {},

    async handleItemChange(row, oldrow) {
      console.log(`output->row11111111`, row);
      if (row) {
        // analysePolygonDetails({
        //   forestCode: row.forestCode,
        //   id: row.forestCodeId
        // })
        //   .then((res) => {
        //     this.itemParams = deepClone(forestAttr.analysisDetailsdict);
        //     this.attributeData = res.data[0];
        //   })
        //   .catch((err) => {});
        let imgurl = "";
        // 创建一个 WKT 解析器对象
        let wktParser = new WKT();

        // 解析 WKT 数据为几何对象
        let geometry = wktParser.readGeometry(
          row.boundaryLine.split(";")[1]
            ? row.boundaryLine.split(";")[1]
            : row.boundaryLine.split(";")[0]
        );
        // 获取几何对象的类型
        let geometryType = geometry.getType();
        if (geometryType === "Point") {
          if (row.pointWellKnownName) {
            imgurl = await this.getSrcBlob(row.pointWellKnownName);
          } else {
            imgurl = fireproofDict(this.selectTableName).imgurl || "";
          }
          // imgurl = fireproofDict(this.selectTableName).imgurl;
        }
        const polygonArr1 = [];
        polygonArr1.push({
          coords: row.boundaryLine.split(";")[1]
            ? row.boundaryLine.split(";")[1]
            : row.boundaryLine.split(";")[0],
          id: row.id,
          text: row.name || row.fireSourcePointName,
        });
        const obj1 = {};
        obj1.name = "intersect_layer1";
        obj1.coordField = "coords";
        obj1.textField = "text";
        obj1.coordsArr = polygonArr1;
        obj1.coordsStyle = {
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
          fill: {
            color: "rgba(0, 255, 0, 0.4)",
          },
        };
        if (imgurl) {
          obj1.coordsStyle.image = {
            src: imgurl,
          };
        }
        obj1.fit = false;
        obj1.moveMap = true;
        this.$refs["maplayer"].addCoordinateLayer(obj1);
        if (this.tabAction === "attr") {
          this.$nextTick(() => {
            this.detailObject = { id: row.id };
            this.$refs.detailsItem.updateIs(this.selectTableName);
          });
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

    // attr为数组排序是依据对象的哪一个属性
    // rev为升序还是降序，默认为升序，true表示升序，false表示降序
    sortBy(attr, rev) {
      if (rev == undefined) {
        rev = 1;
      } else {
        rev ? 1 : -1;
      }
      return function (a, b) {
        a = a[attr];
        b = b[attr];
        if (a < b) {
          return rev * -1;
        }
        if (a > b) {
          return rev * 1;
        }
        return 0;
      };
    },

    handleItem(item) {
      return [item];
      // 这里是对item进行年份分类
      return this.arrayGroupBy(item, "parentId");
    },

    onClose() {
      this.$emit("update:dialogVisible", false);
    },

    handleTable() {
      return fireproofDict(this.selectTableName).tableData;
    },

    // 处理图例数据
    handleDataTL() {
      const tulidata = deepClone(this.analysisData);
      tulidata.forEach((item) => {
        const sDataObject = {
          product: item[0].forestCode + "面积(平方米)",
        };

        item.forEach((it) => {
          // 这里是吧所有类型的年份都加进去
          if (!this.dimensions.includes(it.yearNo)) {
            this.dimensions.push(it.yearNo);
          }
        });
        // 这里是公益林，湿地等进行一个年份分类
        const yearData = this.arrayGroupBy(item, "yearNo");
        yearData.forEach((itemY) => {
          // 这里是要计算每个年份的面积只和
          let mianJiAll = 0;
          itemY.forEach((itY) => {
            mianJiAll += parseFloat(itY.mianJi) * 100000;
          });
          sDataObject[itemY[0].yearNo] = mianJiAll / 100000;
        });
        this.source.push(sDataObject);
      });
      this.dimensions.forEach((item) => {
        this.series.push({ type: "bar", barMaxWidth: 150 });
      });
      this.dimensions.unshift("product"); // 这是图例的类型和顺序
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
            resolve(srcdata);
          });
        } else {
          reject("");
        }
      });
    },
  },
};
// <<script setup lang="ts">
</script>

<style lang="scss" scoped>
.c-main {
  height: calc(100% - 180px) !important;
  display: flex;
  // align-items: center;
  justify-content: space-between;
  margin-top: 20px;
  .analysis-repory {
    padding: 10px;
    border: 0.5px solid #eee;
    box-shadow: 0px 6px 30px 5px rgba(0, 0, 0, 0.05),
      0px 16px 24px 2px rgba(0, 0, 0, 0.04),
      0px 8px 10px -5px rgba(0, 0, 0, 0.08);
    .collapse-title {
      font-size: 18px;
      font-weight: 600;
    }
  }
  .analysis-repory1 {
    margin-left: 10px;
    padding: 10px;
    border: 0.5px solid #eee;
    box-shadow: 0px 6px 30px 5px rgba(0, 0, 0, 0.05),
      0px 16px 24px 2px rgba(0, 0, 0, 0.04),
      0px 8px 10px -5px rgba(0, 0, 0, 0.08);
  }
}
.flex {
  display: flex;
  align-items: center;
}
.text-title {
  font-size: 20px;
  font-weight: 600;
  color: #000;
}
.basic-details {
  border: 1px solid #eee;
  padding: 10px;
  box-shadow: 0px 6px 30px 5px rgba(0, 0, 0, 0.05),
    0px 16px 24px 2px rgba(0, 0, 0, 0.04), 0px 8px 10px -5px rgba(0, 0, 0, 0.08);
  .details-box {
    margin-top: 10px;
    width: 90%;
    justify-content: space-between;
  }
}
</style>
<style scoped>
.analysis-repory >>> .el-collapse-item__wrap {
  border-bottom: 0px !important;
}
</style>
