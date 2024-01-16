<template>
  <!-- 弹窗-新增、修改 -->
  <div>
    <el-dialog
      class="dialog-fullscreen"
      :title="itemStateMap[itemState]"
      :visible.sync="dialogVisible"
      :before-close="onClose"
      fullscreen
    >
      <!-- v-loading.fullscreen="dialogLoading" -->
      <el-form
        ref="itemForm"
        :model="itemForm"
        :rules="itemRules"
        label-width="200px"
      >
        <el-row :gutter="20">
          <el-col v-if="!isDetails" :span="24">
            <el-form-item label="方式选择" prop="radio">
              <el-radio-group v-model="itemForm.radio">
                <el-radio v-if="isShowType.includes(1)" :label="1"
                  >地图绘制</el-radio
                >
                <el-radio v-if="isShowType.includes(2)" :label="2"
                  >输入坐标</el-radio
                >
                <el-radio v-if="isShowType.includes(3)" :label="3"
                  >输入WKT</el-radio
                >
                <el-radio v-if="isShowType.includes(4)" :label="4"
                  >上传Excel</el-radio
                >
                <el-radio v-if="isShowType.includes(5)" :label="5"
                  >上传shp</el-radio
                >
              </el-radio-group>
            </el-form-item>
          </el-col>

          <el-col v-if="itemForm.radio == 1" :span="24">
            <el-form-item label="地理数据">
              <el-input
                v-model="itemForm.wktValue1"
                type="textarea"
                resize="none"
                :disabled="true"
                style="width: 660px"
              />
            </el-form-item>
            <div class="relative">
              <div v-if="!isDetails" class="item-maplayer-actions-footer">
                <el-button
                  v-if="!drawing"
                  class=""
                  type="primary"
                  icon="el-icon-scissors"
                  @click="drawLayer"
                >
                  绘制
                </el-button>
                <el-button
                  v-if="drawing"
                  class=""
                  icon="el-icon-circle-close"
                  @click="cancelDrawLayer"
                >
                  取消
                </el-button>
                <el-button
                  v-if="drawing"
                  class=""
                  type="primary"
                  icon="el-icon-circle-check"
                  :disabled="submitDisabled"
                  @click="submitDrawLayer"
                >
                  确定
                </el-button>
                <el-button
                  v-if="splitList.length > 0"
                  class=""
                  type="danger"
                  icon="el-icon-refresh-right"
                  @click="resetDrawLayer"
                >
                  重置
                </el-button>
              </div>
              <map-layer
                :id="itemMapId"
                ref="itemMapLayer"
                :height="itemMapHeight"
                :image-fetch="false"
              />
            </div>
          </el-col>

          <el-col v-if="itemForm.radio == 2" :span="24">
            <el-form-item label="">
              <el-button type="primary" @click="spotOptionAdd"
                >添加坐标点</el-button
              >
              <el-popover
                v-model="isPreviewMap"
                placement="right"
                style="height: 600px"
                trigger="click"
                :visible-arrow="false"
                @show="previewShow"
              >
                <PreviewMap
                  v-if="isPreviewMap"
                  style="width: 800px; height: 600px"
                  :preview-data="previewData"
                />
                <el-button slot="reference" type="primary" class="ml-10"
                  >预览</el-button
                >
              </el-popover>
            </el-form-item>
          </el-col>

          <template v-if="itemForm.radio == 2">
            <el-col
              v-for="(spot, index) in spotOption"
              :key="index + 'id'"
              :span="24"
              style="display: flex"
            >
              <el-form-item label="经度">
                <el-input-number
                  v-model="spot.long"
                  :precision="15"
                  :controls="false"
                  style="width: 300px"
                />
              </el-form-item>
              <el-form-item label="纬度" label-width="60px">
                <el-input-number
                  v-model="spot.lat"
                  :precision="15"
                  :controls="false"
                  style="width: 300px"
                />
              </el-form-item>
              <el-form-item label="" label-width="60px">
                <el-button
                  v-show="spotOption.length > 3"
                  type="danger"
                  @click="spotOptionDelete(index)"
                  >删除</el-button
                >
              </el-form-item>
            </el-col>
          </template>

          <el-col v-if="itemForm.radio == 3" :span="11">
            <el-form-item label="地理数据" prop="wktValue">
              <el-input
                v-model="itemForm.wktValue"
                type="textarea"
                resize="none"
                style="width: 660px"
              />
            </el-form-item>

            <el-form-item label="图斑预览">
              <el-popover
                v-model="isPreviewMap"
                placement="right"
                style="height: 600px"
                trigger="click"
                :visible-arrow="false"
                @show="previewShow"
              >
                <PreviewMap
                  v-if="isPreviewMap"
                  style="width: 800px; height: 600px"
                  :preview-data="previewData"
                />
                <el-button slot="reference" type="primary">查看</el-button>
              </el-popover>
            </el-form-item>
          </el-col>

          <el-col v-if="itemForm.radio == 4" :span="11">
            <el-form-item label="文件上传" prop="fileList">
              <el-upload
                class="upload-demo"
                :action="uploadUrl"
                :on-success="onSuccess"
                :on-remove="onRemove"
                :on-exceed="onExceed"
                :before-upload="beforeUpload"
                :file-list="itemForm.fileList"
                :headers="uploadHeader"
                :limit="1"
                accept=".xlsx, .xls"
              >
                <div class="upload">
                  <el-button size="small" type="primary">点击上传</el-button>
                  <div class="c-click ml-10" @click.stop="downTemplate">
                    下载模板
                  </div>
                </div>
                <div slot="tip" class="el-upload__tip">只能上传excel文件</div>
              </el-upload>
            </el-form-item>

            <el-form-item label="图斑预览">
              <el-popover
                v-model="isPreviewMap"
                placement="right"
                style="height: 600px"
                trigger="click"
                :visible-arrow="false"
                @show="previewShow"
              >
                <PreviewMap
                  v-if="isPreviewMap"
                  style="width: 800px; height: 600px"
                  :preview-data="previewData"
                />
                <el-button slot="reference" type="primary">查看</el-button>
              </el-popover>
            </el-form-item>
          </el-col>

          <el-col v-if="itemForm.radio == 5" :span="11">
            <el-form-item label="文件上传" prop="shpFileList">
              <el-upload
                class="upload-demo"
                :action="uploadUrlShp"
                :on-success="onSuccessShp"
                :on-remove="onRemoveShp"
                :on-exceed="onExceedShp"
                :before-upload="beforeUploadShp"
                :file-list="itemForm.shpFileList"
                :headers="uploadHeader"
                :limit="1"
                accept=".shp, .zip"
              >
                <div class="upload">
                  <el-button size="small" type="primary">点击上传</el-button>
                  <!-- <div class="c-click ml-10" @click.stop="downTemplate">
                    下载模板
                  </div> -->
                </div>
                <div slot="tip" class="el-upload__tip">
                  只能上传.shp或者.zip文件
                </div>
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col v-if="itemForm.radio == 5" :span="23">
            <el-form-item label="图斑列表">
              <el-table
                border
                class="mapfreckleaddTable"
                :data="tableDataWkt"
                style="width: 95%; height: 500px"
                height="500px"
                highlight-current-row
                @current-change="handleCurrentChange"
              >
                <el-table-column prop="id" width="50" label="序号" />
                <el-table-column prop="wktData" label="WKT">
                  <template slot-scope="scope">
                    <el-tooltip placement="top">
                      <div slot="content" style="width: 600px">
                        {{ scope.row.wktData }}
                      </div>
                      <div
                        style="
                          padding: 0 10px;
                          overflow: hidden;
                          white-space: nowrap;
                          text-overflow: ellipsis;
                        "
                      >
                        {{ scope.row.wktData }}
                      </div>
                    </el-tooltip>
                  </template>
                </el-table-column>

                <el-table-column
                  prop="wktData"
                  label="操作"
                  width="100"
                  align="center"
                >
                  <template slot-scope="scope">
                    <div
                      class="c-click"
                      @click="handleClick(scope.row.wktData)"
                    >
                      预览
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <div v-if="!isDetails" slot="footer" class="dialog-footer">
        <el-button :disabled="dialogLoading" @click="submitClose()">
          {{ $t("forest.cancel") }}
        </el-button>
        <el-button
          type="primary"
          :disabled="dialogLoading"
          @click="submitCreate()"
        >
          {{ $t("forest.confirm") }}
        </el-button>
      </div>

      <div v-else slot="footer" class="dialog-footer">
        <div style="height: 36px" />
      </div>
    </el-dialog>

    <el-dialog
      title="预览"
      :visible.sync="dialogVisibleShp"
      :before-close="onCloseShp"
      width="70%"
    >
      <PreviewMap
        v-if="dialogVisibleShp"
        style="width: 100%; height: 600px"
        :preview-data="previewDataShp"
      />
    </el-dialog>
  </div>
</template>

<script>
import MapLayer from "@/components/MapLayer";
import DrawMapLayer from "@/components/DrawMapLayer";
import PreviewMap from "./previewMap.vue";
import { getSimplifyBoundary1 } from "@/api/firprotOneMap/map";
import Overlay from "ol/Overlay";
import { getCenter } from "ol/extent";
import { getToken } from "@/utils/auth";
import { WKT } from "ol/format";
import Polygon from "ol/geom/Polygon";
import MultiPolygon from "ol/geom/MultiPolygon";
import LineString from "ol/geom/LineString";
import MultiLineString from "ol/geom/MultiLineString";
import { getArea, getLength } from "ol/sphere.js";
export default {
  name: "MapFreckleAdd",
  components: {
    MapLayer,
    PreviewMap,
  },
  mixins: [DrawMapLayer],
  props: {
    dialogVisible: {
      type: Boolean,
      default: false,
    },
    wktData: {
      type: String,
      default: "",
    },
    isShowType: {
      type: Array,
      required: true,
      default() {
        return [1, 2, 3, 4, 5];
      },
    },
    // 用于限制框选面积。有传限制，没有传不限制
    islimitNum: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      // isShowType: [1, 2],
      isDetails: false,
      dialogVisibleShp: false,
      previewDataShp: "",
      isPreviewMap: false,
      tableDataWkt: [],
      previewData: "",
      itemStateMap: {
        update: "编辑",
        create: "新增",
        details: "详情",
      },
      itemState: "create",
      // 新增、修改表单相关
      itemForm: {
        wktValue1: "",
        wktValue: "",
        radio: 1,
        fileList: [],
        shpFileList: [],
        shpSelectData: {},
      },
      itemRules: {
        wktValue: [
          { required: true, message: "地理数据不能为空", trigger: "blur" },
        ],
        fileList: [
          { required: true, message: "文件不能为空", trigger: "change" },
        ],
        shpFileList: [
          { required: true, message: "文件不能为空", trigger: "change" },
        ],
      },
      drawing: false, // 绘制开关
      itemMapId: "item_map",
      itemMapHeight: "600px",
      submitDisabled: false,
      dialogLoading: false,
      drawData: "",
      splitList: [], // 分割后的图斑数据
      spotOption: [
        { long: "0", lat: "0" },
        { long: "0", lat: "0" },
        { long: "0", lat: "0" },
      ],
      // spotOption: [
      //   { long: '123.307558528600012', lat: '40.842651776875002' },
      //   { long: '124.481150459099993', lat: '41.184060338475000' },
      //   { long: '124.054389757100012', lat: '40.453232636300001' }
      // ],
      uploadUrl: process.env.VUE_APP_BASE_API + "/transfer/upload_to_wkt",
      uploadUrlShp: process.env.VUE_APP_BASE_API + "/transfer/shp_to_wkt",
      uploadHeader: {
        token: getToken(),
      },
    };
  },
  computed: {},
  watch: {
    "itemForm.radio": {
      handler(ndata) {
        this.$nextTick(() => {
          if (ndata == 1 && this.$refs.itemMapLayer) {
            // this.showSimplifyBoundary1();
            this.$nextTick(() => {
              if (this.itemForm.wktValue1) {
                this.drawData = this.itemForm.wktValue1;
                setTimeout(() => {
                  // 定义新分割后空间数组
                  const polygonArr = [];

                  // 循环加入到数组中
                  // res.data.forEach((v) => {
                  //
                  // });
                  polygonArr.push({
                    coords: this.itemForm.wktValue1,
                    id: Math.random(),
                  });
                  // 定义分割后图层参数
                  const obj = {};
                  obj.name = this.itemMapId + "_layer";
                  obj.coordField = "coords";
                  obj.coordsArr = polygonArr;
                  obj.fit = true;

                  // 定义点击事件
                  obj.vectorEventFun = function (coordinate, feature) {};

                  // 添加分割后的图层
                  this.$refs["itemMapLayer"].addCoordinateLayer(obj);
                }, 1000);
              }
            });
            this.cancelDrawLayer();
          }
        });
      },
      deep: true,
    },
  },
  created() {
    if (this.wktData) {
      if (this.isShowType.length == 0) {
        // 方式选择为空，但是有wkt数据说明是详情
        this.isDetails = true;
        this.itemState = "details";
        this.drawData = this.wktData;
      } else {
        // 方式不为空，有wkt数据说明是编辑
        this.isDetails = false;
        this.itemState = "update";
        this.drawData = this.wktData;
      }
    }
  },
  mounted() {
    // this.showSimplifyBoundary1();
    this.$nextTick(() => {
      if (this.itemState !== "create") {
        setTimeout(() => {
          // 定义新分割后空间数组
          const polygonArr = [];

          // 循环加入到数组中
          // res.data.forEach((v) => {
          //
          // });
          polygonArr.push({
            coords: this.drawData,
            id: Math.random(),
          });
          // 定义分割后图层参数
          const obj = {};
          obj.name = this.itemMapId + "_layer_2";
          obj.coordField = "coords";
          obj.coordsArr = polygonArr;
          obj.fit = true;

          // 定义点击事件
          obj.vectorEventFun = function (coordinate, feature) {};

          // 添加分割后的图层
          this.$refs["itemMapLayer"].addCoordinateLayer(obj);
          this.itemForm.wktValue1 = this.drawData;
        }, 1000);
      }
    });
  },
  methods: {
    onClose() {
      this.$emit("update:dialogVisible", false);
    },
    onCloseShp() {
      this.dialogVisibleShp = false;
    },
    handleClick(data) {
      this.dialogVisibleShp = true;
      this.previewDataShp = data;
    },

    // 图层绘制
    drawLayer() {
      // 不管如何先关闭提示框
      this.$refs["itemMapLayer"].map.on("click", () => {
        if (this.tips) {
          this.tips.setPosition(undefined);
        }
      });
      this.$refs["itemMapLayer"].removeLayerByName(this.itemMapId + "_layer");
      if (this.drawData) {
        // 定义新分割后空间数组
        const polygonArr = [];

        // 循环加入到数组中
        // res.data.forEach((v) => {
        //
        // });
        polygonArr.push({
          coords: this.drawData,
          id: Math.random(),
        });
        // 定义分割后图层参数
        const obj1 = {};
        obj1.name = this.itemMapId + "_layer_2";
        obj1.coordField = "coords";
        obj1.coordsArr = polygonArr;
        obj1.fit = true;
        obj1.coordsStyle = {
          fill: {
            color: "rgba(255, 255, 0, 0)",
          },
          stroke: {
            width: 2,
            color: "#ffff00",
          },
        };

        // 定义点击事件
        obj1.vectorEventFun = function (coordinate, feature) {};

        // 添加分割后的图层
        this.$refs["itemMapLayer"].addCoordinateLayer(obj1);
      }

      this.drawingTip = this.$message({
        message: "正在绘制... 双击鼠标完成绘制",
        type: "success", // success,warning,error
        duration: 4000,
      });
      // console.log(`output->this.drawLayerObj`, this.drawLayerObj);

      this.drawData = "";
      this.drawing = true;
      const _this = this;
      const obj = {};
      obj.name = this.itemMapId + "_layer_2";
      obj.type = "Polygon";
      obj.modify = true;
      obj.single = true;
      obj.style = {
        fill: {
          color: "rgba(255, 255, 0, 0)",
        },
        stroke: {
          width: 2,
          color: "#ffff00",
        },
      };
      const tips = document.createElement("div");
      tips.className = "map-tips";

      this.tips = new Overlay({
        element: tips,
        offset: [0, -15],
        positioning: "bottom-center",
      });
      this.$refs["itemMapLayer"].map.addOverlay(this.tips);
      this.$refs["itemMapLayer"].drawLayer(obj, function (callback, features) {
        _this.submitDisabled = false;
        if (_this.drawingTip !== undefined) {
          _this.drawingTip.close();
        }
        _this.drawData = callback.wktValue;

        // wkt返回长度单位米
        let val = _this.$refs["itemMapLayer"].getAreaByWkt(callback.wktValue);

        if (_this.islimitNum > 0 && val > _this.islimitNum) {
          _this.$message({
            message: `圈选面积，不能超过${_this.islimitNum}平方米`,
            // message: `圈选面积，不能超过${_this.islimitNum / 10000}公顷`,
            type: "error", // success,warning,error
            duration: 4000,
          });
          _this.submitDisabled = true;
        }
        // if (type === 'Polygon') {
        if (val > 10000) {
          val =
            Math.round((val / 1000000) * 100) / 100 + " " + "km<sup>2</sup>";
        } else {
          val = Math.round(val * 100) / 100 + " " + "m<sup>2</sup>";
        }
        // }

        // 利用extent的getCenter方法来获取中心点
        const xy = new getCenter(features[0].getGeometry().getExtent());

        // 设置显示位置
        _this.tips.setPosition(xy);

        // 塞入到弹窗中
        tips.innerHTML = val;
      });
    },

    // 确定绘制
    submitDrawLayer() {
      if (this.tips) {
        this.tips.setPosition(undefined);
      }
      if (this.drawData === "") {
        this.$message({
          message: "请绘制区域",
          type: "error", // success,warning,error
          duration: 4000,
        });
        return;
      }
      // this.dialogLoading = true;
      const _this = this;
      const data = {};
      data.boundaryLine = this.itemForm.the_geom;
      data.pan_no_tb = this.itemForm.pan_no_tb;
      data.drawData = this.drawData;

      this.drawing = false;
      // 定义绘制分割线参数
      const obj_line = {};
      obj_line.name = this.itemMapId + "_layer_2";
      obj_line.active = false;
      // 关闭绘制分割线状态
      this.$refs["itemMapLayer"].setDrawLayerActice(obj_line);

      // 清除绘制分割线图层
      this.$refs["itemMapLayer"].clearDrawLayer(obj_line);

      // 定义新分割后空间数组
      const polygonArr = [];

      // 循环加入到数组中
      // res.data.forEach((v) => {
      //
      // });
      polygonArr.push({
        coords: this.drawData,
        id: this.itemForm.id,
      });
      // 定义分割后图层参数
      const obj = {};
      obj.name = _this.itemMapId + "_layer";
      obj.coordField = "coords";
      obj.coordsArr = polygonArr;
      obj.fit = true;

      // 定义点击事件
      obj.vectorEventFun = function (coordinate, feature) {};

      /* _this.$refs['itemMapLayer'].selectLayer(obj, function () {
      }) */

      // 添加分割后的图层
      this.$refs["itemMapLayer"].addCoordinateLayer(obj);
      this.itemForm.wktValue1 = this.drawData;

      this.dialogLoading = false;
    },

    // 取消绘制
    cancelDrawLayer() {
      if (this.tips) {
        this.tips.setPosition(undefined);
      }
      this.submitDisabled = false;
      // 清空切割的图层数据
      this.splitList = [];

      this.drawData = "";

      this.drawing = false;

      if (this.drawingTip !== undefined) {
        this.drawingTip.close();
      }

      // 定义绘制分割线参数
      const obj_line = {};
      obj_line.name = this.itemMapId + "_layer_2";
      obj_line.active = false;

      // 关闭绘制分割线状态
      this.$refs["itemMapLayer"].setDrawLayerActice(obj_line);

      // 清除绘制分割线图层
      this.$refs["itemMapLayer"].clearDrawLayer(obj_line);
    },

    // 图层绘制重置
    resetDrawLayer() {
      this.cancelDrawLayer();

      const polygonArr = [];
      polygonArr.push({
        coords: this.itemForm.the_geom,
        id: this.itemForm.id,
      });
      const obj = {};
      obj.name = this.itemMapId + "_layer";
      obj.coordField = "coords";
      obj.coordsArr = polygonArr;
      obj.fit = true;

      this.$refs["itemMapLayer"].addCoordinateLayer(obj);
    },

    // 绘制区划
    showSimplifyBoundary1() {
      this.mapQuery.type = 0;
      this.mapQuery.tolerance = this.$tolerance(this.mapQuery.areaCode);
      const areaObj = {};
      areaObj.areaCode = this.mapQuery.areaCode;
      areaObj.areaName = this.mapQuery.areaName;
      // 请求接口获取界限边界数据
      // 这里是在添加区划图层
      getSimplifyBoundary1(this.mapQuery).then((res) => {
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
          position: 998,
          fit: true,
          vectorEventFun: (coordinate, feature) => {
            return;
          },
        };
        // 添加图层进去
        this.$refs[this.mapQuery.mapName].addCoordinateLayer(
          this.getSimplifyBoundary1Obj
        );
      });
    },

    // 坐标点新增按钮
    spotOptionAdd() {
      if (this.spotOption.length > 10) {
        this.$message({
          message: "做多添加10个点位",
          type: "warning", // success,warning,error
          duration: 4000,
        });
        return;
      }
      this.spotOption.push({
        long: "",
        lat: "",
      });
    },

    // 坐标点删除按钮
    spotOptionDelete(index) {
      this.spotOption.splice(index, 1);
    },

    downTemplate() {
      window.open("./template/latitudeLongitudeTemplate.xlsx");
    },

    // 文件删除
    onRemove() {
      this.itemForm.fileList = [];
    },

    // 文件删除
    onRemoveShp() {
      this.itemForm.shpFileList = [];
      this.tableDataWkt = [];
    },

    onExceed() {
      this.$message.warning("只能上传一个文件");
    },

    onExceedShp() {
      this.$message.warning("只能上传一个文件");
    },

    // 文件上传成功
    onSuccess(res, file) {
      if (res.code != "200") {
        // this.$msgbox({
        //   title: '请注意',
        //   message: res.message
        // });
        this.$message.error(res.message);
        this.updateWkt = "";
        this.itemForm.fileList = [];
        return;
      }
      this.updateWkt = res.data;
      this.itemForm.fileList.push(file);
      this.$refs["itemForm"].validateField("fileList");
      this.$message.success("上传成功");
    },

    // 文件上传成功
    onSuccessShp(res, file) {
      if (res.code != "200") {
        // this.$msgbox({
        //   title: '请注意',
        //   message: res.message
        // });
        this.$message.error(res.message);
        this.itemForm.shpSelectData = {};
        this.itemForm.shpFileList = [];
        return;
      }
      this.itemForm.shpSelectData = {};
      this.tableDataWkt = [];
      res.data.forEach((item, index) => {
        this.tableDataWkt.push({
          id: index + 1,
          wktData: item,
        });
      });

      this.itemForm.shpFileList.push(file);
      this.$refs["itemForm"].validateField("shpFileList");
      this.$message.success("上传成功");
    },

    // 上传之前进行判断
    beforeUpload(file) {
      let name = file.name;
      name = name.toLowerCase();
      if (name.endsWith(".xls") || name.endsWith(".xlsx")) {
        // ;
        return true;
      } else {
        // this.$msgbox({
        //   title: '请注意',
        //   message: '您选择文件是' + name + '，文件类型错误，请重试'
        // });
        this.$message.warning("您选择文件是" + name + "，文件类型错误，请重试");
        return false;
      }
    },

    // 上传之前进行判断
    beforeUploadShp(file) {
      let name = file.name;
      name = name.toLowerCase();
      if (name.endsWith(".shp") || name.endsWith(".zip")) {
        // ;
        return true;
      } else {
        // this.$msgbox({
        //   title: '请注意',
        //   message: '您选择文件是' + name + '，文件类型错误，请重试'
        // });
        this.$message.warning("您选择文件是" + name + "，文件类型错误，请重试");
        return false;
      }
    },

    // 重置详情
    resetItem() {
      this.itemForm = {
        forestCode: "",
        yearNo: "",
        radio: 1,
        fileList: [],
      };
      this.spotOption = [
        { long: "", lat: "" },
        { long: "", lat: "" },
        { long: "", lat: "" },
      ];
    },

    // 关闭弹窗
    submitClose() {
      this.resetItem();
      this.itemVisible = false;
      if (this.drawingTip !== undefined) {
        this.drawingTip.close();
      }
      this.onClose();
    },

    // 新增确定按钮
    submitCreate() {
      this.$refs["itemForm"].validate((valid) => {
        if (valid) {
          if (this.itemForm.radio == 1 && this.drawData === "") {
            this.$message({
              message: "请绘制区域",
              type: "error", // success,warning,error
              duration: 4000,
            });
            return;
          }
          let spotString = "";

          if (this.itemForm.radio == 2) {
            console.log(`output->this.spotOption.length`, this.spotOption);
            for (let i = 0; i < this.spotOption.length; i++) {
              if (this.spotOption[i].long == 0 && this.spotOption[i].lat == 0) {
                this.$message({
                  message: "经纬度不能同时为0",
                  type: "error", // success,warning,error
                  duration: 4000,
                });
                return;
              }
              spotString +=
                this.spotOption[i].long.toFixed(15) +
                " " +
                this.spotOption[i].lat.toFixed(15) +
                ",";
            }
            spotString +=
              this.spotOption[0].long.toFixed(15) +
              " " +
              this.spotOption[0].lat.toFixed(15);
          }

          if (this.itemForm.radio == 5) {
            if (
              !this.itemForm.shpSelectData.wktData ||
              this.itemForm.shpSelectData.wktData == ""
            ) {
              this.$message({
                message: "请选择一个图斑",
                type: "error", // success,warning,error
                duration: 4000,
              });
              return;
            }
          }

          let boundaryLine;
          switch (this.itemForm.radio) {
            case 1:
              boundaryLine = this.drawData;
              break;
            case 2:
              boundaryLine = `POLYGON((${spotString}))`;
              break;
            case 3:
              boundaryLine = this.itemForm.wktValue;
              break;
            case 4:
              boundaryLine = this.updateWkt;
              break;
            case 5:
              boundaryLine = this.itemForm.shpSelectData.wktData;
              break;

            default:
              break;
          }
          this.submitClose();

          const val = this.getAreaByWkt(boundaryLine);
          if (this.islimitNum > 0 && val > this.islimitNum) {
            this.$message({
              message: `圈选面积，不能超过${this.islimitNum}平方米`,
              // message: `圈选面积，不能超过${this.islimitNum / 10000}公顷`,
              type: "error", // success,warning,error
              duration: 4000,
            });
            return;
          }

          this.$emit("returnWKT", boundaryLine);
        }
      });
    },

    // 根据wkt返回长度或面积单位米
    getAreaByWkt(wkt, obj = { radius: 6378137, projection: "EPSG:4326" }) {
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

    previewShow() {
      let spotString = "";
      if (this.itemForm.radio == 2) {
        for (let i = 0; i < this.spotOption.length; i++) {
          if (this.spotOption[i].long == 0 && this.spotOption[i].lat == 0) {
            this.$message({
              message: "经纬度不能同时为0",
              type: "error", // success,warning,error
              duration: 4000,
            });
            return;
          }
          spotString +=
            this.spotOption[i].long.toFixed(15) +
            " " +
            this.spotOption[i].lat.toFixed(15) +
            ",";
        }
        spotString +=
          this.spotOption[0].long.toFixed(15) +
          " " +
          this.spotOption[0].lat.toFixed(15);
      }
      let boundaryLine;
      switch (this.itemForm.radio) {
        case 1:
          boundaryLine = this.drawData;
          break;
        case 2:
          boundaryLine = `POLYGON((${spotString}))`;
          break;
        case 3:
          boundaryLine = this.itemForm.wktValue;
          break;
        case 4:
          boundaryLine = this.updateWkt;
          break;

        default:
          break;
      }
      this.previewData = boundaryLine;
    },

    // 表格选中事件
    handleCurrentChange(data) {
      this.itemForm.shpSelectData = data;
    },
  },
};
</script>

<style lang="scss" scoped>
.upload {
  display: flex;
  position: relative;
}
</style>
<style scoped>
.tooltips-width {
  max-width: 600px;
  position: absolute;
  border-radius: 4px;
  padding: 10px;
  z-index: 2000;
  font-size: 12px;
  line-height: 1.2;
  min-width: 10px;
  word-wrap: break-word;
}
</style>
