<script>
import DrawMapLayer from "@/components/DrawMapLayer";
import {
  v1LayerServerLegendTree,
  getDrawDataV5,
  getDrawData,
} from "@/api/layerLegendManage/mcpLayer";
import CryptoJS from "crypto-js";
import { set16ToRgb } from "@/utils/custom";
export default {
  data() {
    return {
      defaultProps: {
        children: "childList",
        label: "cnName",
        // isLeaf: "isLeaf",
      },
      treeData: [],
      checkTreeObj: {
        // 33: {
        //   type: "enName",
        //   name: "cnName",
        //   textField: "textField",
        //   coordsStyle: "coordsStyle",
        //   isCluster: "isCluster",
        //   clusterStyle: "clusterStyle",
        //   drawGisColumn: "dataPool",
        //   mapType: "type",
        //   active: "isShow",
        //   geoBsm: "geoBsm",
        //   icon: "pointWellKnownName",
        //   position: "position",
        //   cqlFilter: "cqlFilter",
        //   columnName: "columnName",
        //   nodeTypeId: "nodeTypeId",
        // },
        2: {
          type: "enName",
          name: "cnName",
          work: "workArea",
          tableName: "geoBsm",
          layerName: "geoBsm",
          isWmts: "isWmts",
          geoBsm: "geoBsm",
          filterSql: "cqlFilter",
          nodeTypeId: "nodeTypeId",
          color: "fillColor",
          mapType: "type",
          active: "isShow",
          url: "mapUrl",
          position: "position",
          childList: "childList",
        },
        55: {
          type: "enName",
          name: "cnName",
          textField: "textField",
          coordsStyle: "coordsStyle",
          isCluster: "isCluster",
          clusterStyle: "clusterStyle",
          drawGisColumn: "dataPool",
          mapType: "type",
          active: "isShow",
          geoBsm: "geoBsm",
          icon: "pointWellKnownName",
          position: "position",
          cqlFilter: "cqlFilter",
          columnName: "columnName",
          nodeTypeId: "nodeTypeId",
        },
      },
      checkStrictly: false,
      clearTypeList: [33, 2, 55],
      secretKey: CryptoJS.enc.Utf8.parse("zlsk567890123!#?"),
      iv: CryptoJS.enc.Utf8.parse("zlsk567890123!#?"),
      scopeForm: {},
      mapKey: "",
      drawQuery: {},
    };
  },
  mixins: [DrawMapLayer],
  mounted() {},
  methods: {
    renderContent(h, { node, data, store }) {
      if (data.isWmts) {
        data[this.defaultProps.children]?.forEach((item) => {
          item.addWmtsClass = true;
        });
      }
      return h(
        "div",
        {
          class: `custom-tree-node ${data.type == 0 ? "el-tree-menu" : ""} ${
            node.checked ? "node-checked" : ""
          } ${data.addWmtsClass ? "wmts-box" : ""}`,
        },
        [
          h(
            "div",
            {
              class: "tree-node-item",
            },
            [
              h(
                "div",
                {
                  class: "label-class",
                  style: {
                    fontSize: data.foneSize + "px",
                    fontWeight: data.fontWeight,
                  },
                },
                data.cnName
              ),
              h("div", { class: "flex" }, [
                data.geoBsm &&
                  data.type === 55 &&
                  data.geometryType == "Point" &&
                  h(
                    "div",
                    {
                      class: "ml-10",
                    },
                    [
                      h("img", {
                        style: { width: "21px", height: "24px" },
                        attrs: {
                          src: data.pointWellKnownName,
                        },
                      }),
                    ]
                  ),
                data.type === 55 &&
                  data.geometryType == "Point" &&
                  h("div", {
                    class: "ml-10",
                    style: {
                      backgroundColor: data.fillColor || "red" || "transparent",
                      width: "30px",
                      height: "10px",
                    },
                  }),
                data.geoBsm &&
                  data.type === 55 &&
                  data.geometryType == "Polygon" &&
                  h(
                    "div",
                    {
                      class: "ml-10",
                    },
                    [
                      h("img", {
                        style: {
                          width: "21px",
                          height: "24px",
                          "background-color": "#0052d9",
                          "border-radius": "4px",
                        },
                        attrs: {
                          src: "@/static/templateImages/polygon.png",
                        },
                      }),
                    ]
                  ),
                data.geoBsm &&
                  data.type === 55 &&
                  data.geometryType == "Line" &&
                  h(
                    "div",
                    {
                      class: "ml-10",
                    },
                    [
                      h("img", {
                        style: {
                          width: "21px",
                          height: "24px",
                          "background-color": "#0052d9",
                          "border-radius": "4px",
                        },
                        attrs: {
                          src: "@/static/templateImages/line.png",
                        },
                      }),
                    ]
                  ),
                data.type === 55 &&
                  data.geometryType == "Polygon" &&
                  h("div", {
                    class: "ml-10",
                    style: {
                      backgroundColor: data.fillColor || "transparent",
                      borderWidth: data.strokeWidth
                        ? data.strokeWidth + "px"
                        : "0px",
                      borderColor: data.strokeColor,
                      opacity: data.fillOpacity,
                      borderStyle: "solid",
                      width: "30px",
                      height: "10px",
                    },
                  }),
                data.type === 55 &&
                  data.geometryType == "Line" &&
                  h("div", {
                    class: "ml-10",
                    style: {
                      backgroundColor: data.fillColor || "transparent",
                      borderWidth: data.strokeWidth
                        ? data.strokeWidth + "px"
                        : "0px",
                      borderColor: data.strokeColor,
                      opacity: data.fillOpacity,
                      borderStyle: "solid",
                      width: "30px",
                      height: "10px",
                    },
                  }),
                data.type === 4 &&
                  data.geometryType == "Polygon" &&
                  h("div", {
                    class: "ml-10",
                    style: {
                      backgroundColor:
                        set16ToRgb(data.fillColor, data.fillOpacity) ||
                        "transparent",
                      borderWidth: data.strokeWidth
                        ? data.strokeWidth + "px"
                        : "0px",
                      borderColor: data.strokeColor,
                      borderStyle: "solid",
                      width: "30px",
                      height: "10px",
                    },
                  }),
              ]),
            ]
          ),
        ]
      );
    },
    encrypt(data) {
      //加密
      if (data) {
        let encrypted = CryptoJS.AES.encrypt(data, this.secretKey, {
          iv: this.iv,
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7,
        });
        return encrypted.toString();
      } else {
        return "";
      }
    },
    decrypt(encryptedData) {
      //解密
      let decrypted = CryptoJS.AES.decrypt(encryptedData, this.secretKey, {
        iv: this.iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      });
      return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
    },
    async getTreeData(treeQueryObj = { treeDataName: "treeData", mapKey: "" }) {
      //获取图层树数据
      let res = await v1LayerServerLegendTree({
        mapKey:
          treeQueryObj.mapKey ||
          this.$route.query.mapKey ||
          this.mapKey ||
          "ZheOktp9tM",
      });
      this[treeQueryObj.treeDataName] = [res.data];
      this.checkTreeData(
        this[treeQueryObj.treeDataName],
        treeQueryObj.treeDataName
      );
      this[treeQueryObj.treeDataName] = [...this[treeQueryObj.treeDataName]];
      return new Promise((resolve) => {
        resolve();
      });
    },
    checkCql(childList, keysArray) {
      //获取当前图层的图例以及对应图层树勾选id
      let arr = childList.filter((item) => keysArray.includes(item.nodeTypeId)); //过滤出已勾选的图例
      let filterSql = "";
      arr.forEach((it) => {
        filterSql += " or " + it.cqlFilter;
      });
      filterSql = filterSql.split(" or ").filter((s) => {
        return s != "null" && s && s.trim(); // 注：IE9(不包含IE9)以下的版本没有trim()方法
      });
      filterSql = `(${filterSql.join(" or ")})`;
      return filterSql;
    },
    handleCheckChange(treeName = "treeData", data, nodeArray) {
      //图层树点击事件
      let keys = [...nodeArray.checkedKeys, ...nodeArray.halfCheckedKeys];
      let mapArr = this.mapTypeList.filter((item) => item.treeName == treeName);
      console.log(mapArr);
      mapArr.forEach((item) => {
        1;
        let active = null;
        if (keys.includes(item.nodeTypeId)) {
          active = true;
        }
        if (item.mapType === 2 && keys.includes(item.nodeTypeId)) {
          //图层根据图例展示,点击图层时根据图例获取cqlFilter，无图例则获取当前对象的cqlF
          let filterSql = item.childList?.length
            ? this.checkCql(item.childList, nodeArray.checkedKeys)
            : item.filterSql;
          if (item.filterSql != filterSql) {
            item.filterSql = filterSql;
            item.isChange = true;
            item.active = false;
            active = true;
          }
        }
        if (Boolean(item.active) != Boolean(active)) {
          this.changeTypeShow(item);
        }
      });
    },
    mapGetDetail(data, feature, coordinate) {
      //点击图层回调事件
      let mapType = "";
      let query = {};
      if (typeof feature == "object") {
        mapType = feature.mapType;
      } else {
        mapType = feature;
      }
      let obj = this.findTypeObj(mapType);
      query.id = data.id;
      this.scopeForm.tableName = obj.geoBsm;
      this.scopeForm.query = query;
      this.showPopDetail = true;
    },
    checkTreeData(data, treeName) {
      //遍历图层树，确认需要绘制的图层图例数据结构
      for (let index = 0; index < data.length; index++) {
        let item = data[index];
        let obj = {};
        //数据绘制
        if (item.type == 5) {
          //合并type 5 和 55
          //取type5的样式赋值文字样式
          item[this.defaultProps.children].forEach((val) => {
            //取type55样式为聚合样式
            val.textField = "title";
            val.isCluster = true;
            val.pointWellKnownName = val.pointWellKnownName
              ? this.$imgUrl(val.pointWellKnownName, "geoserver")
              : "";
            val.coordsStyle = {
              text: {
                font: `bold ${item.inOrEquals || 16}px Arial`,
                fill: {
                  color: item.fillColor || "#fff",
                },
                stroke: {
                  color: item.strokeColor || "#000",
                  width: item.strokeWidth * 1 || 2,
                },
                //offsetParent：获取带有定位的最近父元素
              },
              fill: {
                color: set16ToRgb(val.fillColor, val.fillOpacity),
              },
              stroke: {
                width: 2,
                color: val.strokeColor,
              },
            };
            val.clusterStyle = {
              text: {
                textAlign: "center",
                textBaseline: "middle",
                offsetY: 0,
                offsetX: 0,
                padding: [5, 5, 5, 5],
                fill: {
                  color: "#fff",
                },
                stroke: {
                  color: "#000",
                  width: 2,
                },
              },
              circle: {
                fill: {
                  color: set16ToRgb(val.fillColor, val.fillOpacity),
                },
              },
            };
            if (val.geometryType == "Point") {
              val.coordsStyle.text.offsetY = 25;
              val.coordsStyle.image = {
                src: val.pointWellKnownName,
              };
            }
            if (item[this.defaultProps.children].length == 1) {
              //只存在一个图例时，替换目录直接展示
              let childData = item[this.defaultProps.children][0];
              Object.keys(childData).forEach((key) => {
                //遍历图例属性，覆盖目录
                item[key] = childData[key];
              });
              delete item[this.defaultProps.children];
            }
          });
        } else if (item.type == 2) {
          if (item[this.defaultProps.children].length == 1) {
            //只存在一个图例时，替换目录直接展示
            let childData = item[this.defaultProps.children][0];
            item.cqlFilter = childData.cqlFilter;
            delete item[this.defaultProps.children];
          }
        }
        Object.keys(item).forEach((key) => {
          //遍历对象，根据需要的对象取值给maptypelist
          let val = this.checkTreeObj[item.type];
          if (val) {
            Object.keys(val).forEach((key2) => {
              if (val[key2] == key) {
                obj[key2] = item[key];
              }
            });
          }
        });
        if (this.clearTypeList.includes(item.type)) {
          //获取需要绘制的类型数据
          obj.nodeTypeId = item.nodeTypeId;
          obj.id = item.id;
          obj.clusterText = "title";
          obj.treeName = treeName;
          obj.list = [];
          obj.type = obj.isWmts ? obj.type + "wmts" : obj.type;
          obj.isMultiple = 1; //树形结构全部为多选，不取接口值
          obj.layerType = 1; //默认为数据库发布参数
          obj.getData = async function (type, active) {
            // that给对比使用，是改变this的指向问题
            //获取专题图层数据
            let obj = this.findTypeObj(type);
            if (obj.mapType == 55) {
              let query = {
                cqlFilter: this.encrypt(obj.cqlFilter),
                tableName: this.encrypt(obj.geoBsm),
                titleColumn: obj.columnName || "name",
                drawGisColumn: obj.drawGisColumn || "boundary_line",
                ...this.drawQuery,
              };
              let api = this.drawQuery.distanceMeter
                ? getDrawDataV5
                : getDrawData;
              let res = await api(query);
              obj.list = res.data.wktList;
            } else if (obj.mapType == 2) {
              obj.list = [{}];
            }
            this.changeMap(type, active);
          };
          obj.getDetail = this.mapGetDetail;
          this.mapTypeList.push(obj);
          // let typeObj = this.findTypeObj(obj.type) || "";
          // if (!typeObj) {
          //   this.mapTypeList.push(obj);
          // } else {
          //   typeObj.copyNodeTypeId = item.nodeTypeId;
          // }
        }
        if (
          this.defaultProps &&
          item[this.defaultProps.children] &&
          item[this.defaultProps.children].length > 0
        ) {
          this.checkTreeData(item[this.defaultProps.children], treeName);
        }
      }
    },
  },
};
</script>

<style></style>
