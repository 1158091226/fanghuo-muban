<!--  -->
<template>
  <div class="list-details">
    <div v-show="isShowHandle" class="title">详情</div>

    <!-- 这是属性框的内容部分 -->
    <div class="details-content-box">
      <el-form
        ref="formDetails"
        :model="formDetails"
        label-width="130px"
        label-position="right"
        :rules="detailsType != '详情' ? formRules : {}"
        :class="[detailsType == '详情' ? 'details' : '']"
      >
        <span />

        <el-form-item
          label="行政区划"
          :class="[
            detailsType == '详情' ? 'item-content' : 'item-content-edit',
          ]"
          prop="areaCode"
        >
          <area-select
            v-if="detailsType != '详情'"
            ref="area-filter"
            :value="formDetails.areaCode"
            style="width: 100%"
            placeholder="请选择行政区划"
            :clearable="true"
            :is-width-zero="false"
            @change="changeAreaDetails"
          />
          <div v-else>
            <div>
              {{
                formDetails.sysAreaVO.areaFullName
                  ? formDetails.sysAreaVO.areaFullName
                  : ""
              }}
            </div>
          </div>
        </el-form-item>

        <!--  是否是基类  -->
        <el-form-item
          label="图斑编号"
          :class="[
            detailsType == '详情' ? 'item-content' : 'item-content-edit',
          ]"
          prop="tbbh"
        >
          <el-input
            v-if="detailsType != '详情'"
            v-model="formDetails.tbbh"
            style="width: 100%"
            placeholder="请输入图斑编号"
            class="filter-item"
            clearable
          />
          <div v-else>{{ formDetails.tbbh }}</div>
        </el-form-item>
        <el-form-item
          label="草班"
          :class="[
            detailsType == '详情' ? 'item-content' : 'item-content-edit',
          ]"
          prop="caoBan"
        >
          <el-input
            v-if="detailsType != '详情'"
            v-model="formDetails.caoBan"
            style="width: 100%"
            placeholder="请输入草班"
            class="filter-item"
            clearable
          />
          <div v-else>{{ formDetails.caoBan }}</div>
        </el-form-item>
        <el-form-item
          label="草原类"
          :class="[
            detailsType == '详情' ? 'item-content' : 'item-content-edit',
          ]"
          prop="cdL"
        >
          <el-input
            v-if="detailsType != '详情'"
            v-model="formDetails.cdL"
            style="width: 100%"
            placeholder="请输入草原类"
            class="filter-item"
            clearable
          />
          <div v-else>{{ formDetails.cdL }}</div>
        </el-form-item>
        <el-form-item
          label="地类编码"
          :class="[
            detailsType == '详情' ? 'item-content' : 'item-content-edit',
          ]"
          prop="dlbm"
        >
          <el-input
            v-if="detailsType != '详情'"
            v-model="formDetails.dlbm"
            style="width: 100%"
            placeholder="请输入地类编码"
            class="filter-item"
            clearable
          />
          <div v-else>{{ formDetails.dlbm }}</div>
        </el-form-item>
        <el-form-item
          label="地貌"
          :class="[
            detailsType == '详情' ? 'item-content' : 'item-content-edit',
          ]"
          prop="diMao"
        >
          <el-input
            v-if="detailsType != '详情'"
            v-model="formDetails.diMao"
            style="width: 100%"
            placeholder="请输入地貌"
            class="filter-item"
            clearable
          />
          <div v-else>{{ formDetails.diMao }}</div>
        </el-form-item>
        <el-form-item
          label="灾害等级"
          :class="[
            detailsType == '详情' ? 'item-content' : 'item-content-edit',
          ]"
          prop="disasterC"
        >
          <el-input
            v-if="detailsType != '详情'"
            v-model="formDetails.disasterC"
            style="width: 100%"
            placeholder="请输入灾害等级"
            class="filter-item"
            clearable
          />
          <div v-else>{{ formDetails.disasterC }}</div>
        </el-form-item>
        <el-form-item
          label="灾害类型"
          :class="[
            detailsType == '详情' ? 'item-content' : 'item-content-edit',
          ]"
          prop="dispe"
        >
          <el-input
            v-if="detailsType != '详情'"
            v-model="formDetails.dispe"
            style="width: 100%"
            placeholder="请输入灾害类型"
            class="filter-item"
            clearable
          />
          <div v-else>{{ formDetails.dispe }}</div>
        </el-form-item>
        <el-form-item
          label="土地所有权属"
          :class="[
            detailsType == '详情' ? 'item-content' : 'item-content-edit',
          ]"
          prop="ldQs"
        >
          <el-input
            v-if="detailsType != '详情'"
            v-model="formDetails.ldQs"
            style="width: 100%"
            placeholder="请输入土地所有权属"
            class="filter-item"
            clearable
          />
          <div v-else>{{ formDetails.ldQs }}</div>
        </el-form-item>
        <el-form-item
          label="交通区位"
          :class="[
            detailsType == '详情' ? 'item-content' : 'item-content-edit',
          ]"
          prop="kbJiDu"
        >
          <el-input
            v-if="detailsType != '详情'"
            v-model="formDetails.kbJiDu"
            style="width: 100%"
            placeholder="请输入交通区位"
            class="filter-item"
            clearable
          />
          <div v-else>{{ formDetails.kbJiDu }}</div>
        </el-form-item>
        <el-form-item
          label="林地规划管理"
          :class="[
            detailsType == '详情' ? 'item-content' : 'item-content-edit',
          ]"
          prop="ldghGl"
        >
          <el-input
            v-if="detailsType != '详情'"
            v-model="formDetails.ldghGl"
            style="width: 100%"
            placeholder="请输入林地规划管理"
            class="filter-item"
            clearable
          />
          <div v-else>{{ formDetails.ldghGl }}</div>
        </el-form-item>
        <el-form-item
          label="林班"
          :class="[
            detailsType == '详情' ? 'item-content' : 'item-content-edit',
          ]"
          prop="linBan"
        >
          <el-input
            v-if="detailsType != '详情'"
            v-model="formDetails.linBan"
            style="width: 100%"
            placeholder="请输入林班"
            class="filter-item"
            clearable
          />
          <div v-else>{{ formDetails.linBan }}</div>
        </el-form-item>
        <el-form-item
          label="林场"
          :class="[
            detailsType == '详情' ? 'item-content' : 'item-content-edit',
          ]"
          prop="linChang"
        >
          <el-input
            v-if="detailsType != '详情'"
            v-model="formDetails.linChang"
            style="width: 100%"
            placeholder="请输入林场"
            class="filter-item"
            clearable
          />
          <div v-else>{{ formDetails.linChang }}</div>
        </el-form-item>
        <el-form-item
          label="林业局"
          :class="[
            detailsType == '详情' ? 'item-content' : 'item-content-edit',
          ]"
          prop="linYeJu"
        >
          <el-input
            v-if="detailsType != '详情'"
            v-model="formDetails.linYeJu"
            style="width: 100%"
            placeholder="请输入林业局"
            class="filter-item"
            clearable
          />
          <div v-else>{{ formDetails.linYeJu }}</div>
        </el-form-item>
        <el-form-item
          label="林木使用权"
          :class="[
            detailsType == '详情' ? 'item-content' : 'item-content-edit',
          ]"
          prop="lmsyqs"
        >
          <el-input
            v-if="detailsType != '详情'"
            v-model="formDetails.lmsyqs"
            style="width: 100%"
            placeholder="请输入林木使用权"
            class="filter-item"
            clearable
          />
          <div v-else>{{ formDetails.lmsyqs }}</div>
        </el-form-item>
        <el-form-item
          label="林木所有权属"
          :class="[
            detailsType == '详情' ? 'item-content' : 'item-content-edit',
          ]"
          prop="lmqs"
        >
          <el-input
            v-if="detailsType != '详情'"
            v-model="formDetails.lmqs"
            style="width: 100%"
            placeholder="请输入林木所有权属"
            class="filter-item"
            clearable
          />
          <div v-else>{{ formDetails.lmqs }}</div>
        </el-form-item>
        <el-form-item
          label="平均胸径"
          :class="[
            detailsType == '详情' ? 'item-content' : 'item-content-edit',
          ]"
          prop="pingjunXj"
        >
          <el-input
            v-if="detailsType != '详情'"
            v-model="formDetails.pingjunXj"
            style="width: 100%"
            placeholder="请输入平均胸径"
            class="filter-item"
            clearable
          />
          <div v-else>{{ formDetails.pingjunXj }}</div>
        </el-form-item>
        <el-form-item
          label="坡度"
          :class="[
            detailsType == '详情' ? 'item-content' : 'item-content-edit',
          ]"
          prop="poDu"
        >
          <el-input
            v-if="detailsType != '详情'"
            v-model="formDetails.poDu"
            style="width: 100%"
            placeholder="请输入坡度"
            class="filter-item"
            clearable
          />
          <div v-else>{{ formDetails.poDu }}</div>
        </el-form-item>
        <el-form-item
          label="坡位"
          :class="[
            detailsType == '详情' ? 'item-content' : 'item-content-edit',
          ]"
          prop="poWei"
        >
          <el-input
            v-if="detailsType != '详情'"
            v-model="formDetails.poWei"
            style="width: 100%"
            placeholder="请输入坡位"
            class="filter-item"
            clearable
          />
          <div v-else>{{ formDetails.poWei }}</div>
        </el-form-item>
        <el-form-item
          label="坡向"
          :class="[
            detailsType == '详情' ? 'item-content' : 'item-content-edit',
          ]"
          prop="poXiang"
        >
          <el-input
            v-if="detailsType != '详情'"
            v-model="formDetails.poXiang"
            style="width: 100%"
            placeholder="请输入坡向"
            class="filter-item"
            clearable
          />
          <div v-else>{{ formDetails.poXiang }}</div>
        </el-form-item>
        <el-form-item
          label="湿地等级"
          :class="[
            detailsType == '详情' ? 'item-content' : 'item-content-edit',
          ]"
          prop="sdDj"
        >
          <el-input
            v-if="detailsType != '详情'"
            v-model="formDetails.sdDj"
            style="width: 100%"
            placeholder="请输入湿地等级"
            class="filter-item"
            clearable
          />
          <div v-else>{{ formDetails.sdDj }}</div>
        </el-form-item>
        <el-form-item
          label="重要湿地名称"
          :class="[
            detailsType == '详情' ? 'item-content' : 'item-content-edit',
          ]"
          prop="sdMc"
        >
          <el-input
            v-if="detailsType != '详情'"
            v-model="formDetails.sdMc"
            style="width: 100%"
            placeholder="请输入重要湿地名称"
            class="filter-item"
            clearable
          />
          <div v-else>{{ formDetails.sdMc }}</div>
        </el-form-item>
        <el-form-item
          label="事权等级"
          :class="[
            detailsType == '详情' ? 'item-content' : 'item-content-edit',
          ]"
          prop="shiQuanD"
        >
          <el-input
            v-if="detailsType != '详情'"
            v-model="formDetails.shiQuanD"
            style="width: 100%"
            placeholder="请输入事权等级"
            class="filter-item"
            clearable
          />
          <div v-else>{{ formDetails.shiQuanD }}</div>
        </el-form-item>
        <el-form-item
          label="生态区位"
          :class="[
            detailsType == '详情' ? 'item-content' : 'item-content-edit',
          ]"
          prop="stqw"
        >
          <el-input
            v-if="detailsType != '详情'"
            v-model="formDetails.stqw"
            style="width: 100%"
            placeholder="请输入生态区位"
            class="filter-item"
            clearable
          />
          <div v-else>{{ formDetails.stqw }}</div>
        </el-form-item>
        <el-form-item
          label="生态区位名称"
          :class="[
            detailsType == '详情' ? 'item-content' : 'item-content-edit',
          ]"
          prop="stqumc"
        >
          <el-input
            v-if="detailsType != '详情'"
            v-model="formDetails.stqumc"
            style="width: 100%"
            placeholder="请输入生态区位名称"
            class="filter-item"
            clearable
          />
          <div v-else>{{ formDetails.stqumc }}</div>
        </el-form-item>
        <el-form-item
          label="土地使用权"
          :class="[
            detailsType == '详情' ? 'item-content' : 'item-content-edit',
          ]"
          prop="tdsyqs"
        >
          <el-input
            v-if="detailsType != '详情'"
            v-model="formDetails.tdsyqs"
            style="width: 100%"
            placeholder="请输入土地使用权"
            class="filter-item"
            clearable
          />
          <div v-else>{{ formDetails.tdsyqs }}</div>
        </el-form-item>
        <el-form-item
          label="土层厚度"
          :class="[
            detailsType == '详情' ? 'item-content' : 'item-content-edit',
          ]"
          prop="tuCengHd"
        >
          <el-input
            v-if="detailsType != '详情'"
            v-model="formDetails.tuCengHd"
            style="width: 100%"
            placeholder="请输入土层厚度"
            class="filter-item"
            clearable
          />
          <div v-else>{{ formDetails.tuCengHd }}</div>
        </el-form-item>
        <el-form-item
          label="土壤类型(名称)"
          :class="[
            detailsType == '详情' ? 'item-content' : 'item-content-edit',
          ]"
          prop="tuRangLx"
        >
          <el-input
            v-if="detailsType != '详情'"
            v-model="formDetails.tuRangLx"
            style="width: 100%"
            placeholder="请输入土壤类型(名称)"
            class="filter-item"
            clearable
          />
          <div v-else>{{ formDetails.tuRangLx }}</div>
        </el-form-item>
        <el-form-item
          label="小班面积"
          :class="[
            detailsType == '详情' ? 'item-content' : 'item-content-edit',
          ]"
          prop="xbmj"
        >
          <el-input
            v-if="detailsType != '详情'"
            v-model="formDetails.xbmj"
            style="width: 100%"
            placeholder="请输入小班面积"
            class="filter-item"
            clearable
          />
          <div v-else>{{ formDetails.xbmj }}</div>
        </el-form-item>
        <el-form-item
          label="数据年份"
          :class="[
            detailsType == '详情' ? 'item-content' : 'item-content-edit',
          ]"
          prop="sjnf"
        >
          <el-date-picker
            v-if="detailsType != '详情'"
            v-model="formDetails.sjnf"
            type="date"
            placeholder="请选择数据年份"
            style="width: 100%"
            value-format="yyyy-MM-dd"
          />
          <div v-else>{{ formDetails.sjnf }}</div>
        </el-form-item>

        <el-form-item
          label="说明"
          :class="[
            detailsType == '详情' ? 'item-content' : 'item-content-edit',
          ]"
          prop="describe"
        >
          <tinymce
            v-if="detailsType != '详情'"
            v-model="formDetails.describe"
            :height="300"
          />
          <div v-else>
            <div v-html="formDetails.describe" />
          </div>
        </el-form-item>

        <!--  是否是空间信息  -->
        <span />
      </el-form>
      <template v-if="isShowHandle">
        <div
          v-show="isShowMapBasisLayer"
          ref="contentMapBox"
          class="content-map-box"
        >
          <MapBasisLayer
            drawType="Polygon"
            v-show="isShowMapBasisLayer"
            ref="MapBasisLayer"
            :is-coordinate="detailsIsCoordinate"
            :is-terrain="false"
            @fullScreenClickOff="fullScreenClickOff"
          />
        </div>
        <div class="map-btn-box">
          <div
            v-if="isShowMapBasisLayer"
            class="map-btn"
            @click="detailsFullScreenClick"
          >
            <img
              class="img1"
              src="@/static/templateImages/full-screen-off.png"
              alt=""
            />
          </div>

          <div class="map-btn" @click="isShowMapBasisLayerClick">
            <img
              v-if="isShowMapBasisLayer"
              class="img"
              src="@/static/templateImages/map-icon.png"
              alt=""
            />
            <img
              v-else
              class="img"
              src="@/static/templateImages/map-icon-off.png"
              alt=""
            />
          </div>
        </div>
      </template>
    </div>

    <!-- 这是属性框的底部按钮部分 -->
    <div v-show="isShowHandle" class="details-btn-box">
      <div v-if="detailsType == '详情'" class="btn-left">
        <div
          :class="[currentSelectionIndex == 0 ? 'left-text-no' : 'left-text']"
          @click="handleMoveSelectClick('up')"
        >
          上一条
        </div>
        <div
          :class="[
            currentSelectionIndex == tableData.length - 1
              ? 'left-text-no'
              : 'left-text',
          ]"
          @click="handleMoveSelectClick('down')"
        >
          下一条
        </div>
      </div>
      <div v-else>&nbsp;</div>
      <div v-if="detailsType == '详情'" class="btn-right">
        <div
          v-permission="['forestry:wholeForest:delete']"
          class="right-text"
          @click="detailsDeleteClick"
        >
          删除
        </div>
        <el-button
          v-permission="['forestry:wholeForest:update']"
          type="primary"
          class="right-btn"
          @click="detailsUpdateClick"
          >编辑</el-button
        >
      </div>
      <div v-else class="btn-right">
        <div class="right-text1" @click="detailsCancelClick">取消</div>
        <el-button type="primary" class="right-btn" @click="detailsSaveClick"
          >保存</el-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import AreaSelect from "@/components/AreaSelect"; // 这个是引入行政区划组件
import Pagination from "@/components/Pagination"; // 这个是引入分页组件

import DictionarySelect from "@/components/DictionarySelect"; // 引入下拉组件
import DictionaryText from "@/components/DictionaryText"; // 引入下拉文字显示组件
import MoreQuery from "@/components/MoreQuery"; // 引入更多组件
import Tinymce from "@/components/Tinymce"; // 引入富文本
import MapBasisLayer from "@/components/MapBasis";
import { deepClone, downloadFile } from "@/utils";
import { isArray } from "@/utils/validate";
import { commonDownload } from "@/api/system";
import { wholeForestApi } from "@/api/forestry/wholeForest";

const listItemDefault = {
  id: undefined,
  areaCode: "",
  sysAreaVO: {},
  tbbh: undefined,
  caoBan: undefined,
  cdL: undefined,
  dlbm: undefined,
  diMao: undefined,
  disasterC: undefined,
  dispe: undefined,
  ldQs: undefined,
  kbJiDu: undefined,
  ldghGl: undefined,
  linBan: undefined,
  linChang: undefined,
  linYeJu: undefined,
  lmsyqs: undefined,
  lmqs: undefined,
  pingjunXj: undefined,
  poDu: undefined,
  poWei: undefined,
  poXiang: undefined,
  sdDj: undefined,
  sdMc: undefined,
  shiQuanD: undefined,
  stqw: undefined,
  stqumc: undefined,
  tdsyqs: undefined,
  tuCengHd: undefined,
  tuRangLx: undefined,
  xbmj: undefined,
  sjnf: undefined,
  describe: undefined,
  boundaryLine: undefined,
};

export default {
  // 这里吧组件引入进来
  components: {
    AreaSelect,
    Pagination,
    MapBasisLayer,
    DictionarySelect,
    DictionaryText,
    Tinymce,
    MoreQuery,
  },
  props: {
    // 这个是控制是否需要操作功能
    isShowHandle: {
      type: Boolean,
      default: true,
    },
    // 选中行的index
    currentSelectionIndex: {
      type: Number,
      default: 0,
    },
    // 选中的行的数据
    currentSelection: {
      type: Object,
      default() {
        return {};
      },
    },
    // 每页的条数范围
    queryPageSize: {
      type: Number,
      default: 1,
    },
    // 表格数据
    tableData: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      detailsType: "详情", // 这个类型只会有详情和编辑
      detailsIsCoordinate: false, // 列表框里的地图控制是否需要展示坐标采集
      isShowMapBasisLayer: true, // 控制列表中属性框的地图显示隐藏
      uploadUrl: process.env.VUE_APP_BASE_API + "/files/minIo/common_upload",
      formDetails: deepClone(listItemDefault), // 这个是存放列表框中的属性框
      // 表单规则
      formRules: {
        areaCode: [
          { required: true, message: "请选择行政区划", trigger: "change" },
        ],
        tbbh: [{ required: true, message: "请输入图斑编号", trigger: "blur" }],
        boundaryLine: [
          { required: true, message: "请输入地理坐标", trigger: "blur" },
        ],
      },
    };
  },

  // components: {},

  // watch: {},

  // computed: {},

  created() {
    this.initDetails();
  },

  // mounted(){},

  methods: {
    async initDetails() {
      this.formDetails = deepClone(listItemDefault);
      // this.isShowMapBasisLayer = true;
      this.detailsType = "详情";
      this.clearImgUrlFunction();
      if (this.currentSelection) {
        await this.getDetailsFunction(this.currentSelection, "formDetails");
        this.showImg();
        this.handleIsShow();
        this.$nextTick(() => {
          const obj = {
            state: "details", // 状态详情还是编辑details,update,add
            wktString: this.formDetails.boundaryLine,
          };
          setTimeout(() => {
            if (this.$refs["MapBasisLayer"]?.addPointLayer) {
              this.$refs["MapBasisLayer"].addPointLayer(obj);
            }
          }, 0);
        });
      }
    },

    //方便父组件更新详情的方法
    async updateDetails() {
      await this.getDetailsFunction(this.currentSelection, "formDetails");
      this.showImg();
      this.handleIsShow();
    },

    // 列表属性框中的编辑点击事件
    async detailsUpdateClick() {
      this.formDetails = deepClone(listItemDefault);
      await this.getDetailsFunction(this.currentSelection, "formDetails");
      this.showImg();
      this.detailsType = "编辑";
      this.$message({
        type: "warning",
        message: "切换其他数据时，当前编辑的数据不会保存！",
        duration: 4000,
      });
      this.$nextTick(() => {
        const obj = {
          state: "update", // 状态详情还是编辑details,update,add
          wktString: this.formDetails.boundaryLine,
        };
        setTimeout(() => {
          this.$refs["MapBasisLayer"].addPointLayer(obj);
        }, 0);
      });
    },

    // 列表属性框中的删除点击事件
    detailsDeleteClick() {
      this.$emit("detailsDeleteClick");
    },

    // 列表属性框中的取消按钮事件
    detailsCancelClick() {
      this.detailsType = "详情";
      this.resetForm("formDetails");
      this.$emit("detailsCancelClick");
    },

    // 列表属性框中的保存点击事件
    detailsSaveClick() {
      this.$refs["formDetails"].validate((valid) => {
        if (valid) {
          // 这里是对行政区划选择的数据处理，因为选择的后返回的是数组，所以要取最后一个
          const temp = deepClone(this.$refs["area-filter"].codes);
          if (isArray(temp) && temp.length > 0) {
            this.formDetails.areaCode = temp.pop();
          } else {
            delete this.formDetails.areaCode;
          }
          this.formDetails.boundaryLine =
            this.$refs["MapBasisLayer"].returnAddLayerWkt();
          if (!this.formDetails.boundaryLine) {
            this.$message({
              type: "error",
              message: "请在地图绘制对应位置",
            });
            return;
          }

          let data = {};
          for (let key in this.formDetails) {
            data[key] =
              this.formDetails[key] == null ? undefined : this.formDetails[key];
          }

          wholeForestApi("update", "post", data)
            .then((res) => {
              this.$message({
                type: "success",
                message: "修改成功",
              });
              this.$emit("detailsSubmitClick");
            })
            .catch((err) => {});
        }
      });
    },

    // 列表属性框中的全屏按钮点击事件
    detailsFullScreenClick() {
      this.detailsIsCoordinate = true; // 全屏后开启地图的坐标采集
      setTimeout(() => {
        this.$refs["MapBasisLayer"].fullScreen();
      }, 0);
    },

    // 列表属性框中地图全屏按钮关闭回调事件
    fullScreenClickOff(wktdata) {
      this.detailsIsCoordinate = false;
    },

    // 列表属性框中的上一条下一条点击事件
    async handleMoveSelectClick(type) {
      this.$emit("handleMoveSelectClick", type);
    },

    // 列表属性框中的地图缩放按钮
    isShowMapBasisLayerClick() {
      this.isShowMapBasisLayer = !this.isShowMapBasisLayer;
      if (this.isShowMapBasisLayer) {
        this.$nextTick(() => {
          const obj = {
            state: "details", // 状态详情还是编辑details,update,add
            wktString: this.formDetails.boundaryLine,
          };
          setTimeout(() => {
            this.$refs["MapBasisLayer"].updateSizeFunction();
            this.$refs["MapBasisLayer"].addPointLayer(obj);
          }, 0);
        });
      }
    },

    fileDown(name) {
      commonDownload({ uniqueName: name }).then((res) => {
        downloadFile(res.file, res.name);
      });
    },

    // 表单中区划选择配套的事件
    changeAreaDetails(v) {
      const temp = deepClone(v);
      if (isArray(temp) && temp.length > 0) {
        this.formDetails.areaCode = temp.pop();
      } else {
        this.formDetails.areaCode = "";
      }
    },

    // 敏感数据显示隐藏
    isShowSecretFunction(data, start, end) {
      if (!data) {
        return;
      }
      end = end == -1 ? data.length : end;
      let dataText = JSON.parse(JSON.stringify(data));
      let xingnum = end - start;
      let xing = "";
      for (let i = 0; i < xingnum; i++) {
        xing += "*";
      }
      let text;
      text = dataText.replace(dataText.substring(start, end), xing); // 利用

      return text;
    },

    // 获取明细
    getDetailsFunction(queryData, listdata) {
      return new Promise((resolve, reject) => {
        wholeForestApi("detail", "get", { id: queryData.id })
          .then((res) => {
            let data = {};
            for (let key in res.data) {
              data[key] = res.data[key] == null ? undefined : res.data[key];
            }
            this[listdata] = Object.assign({}, data);
            resolve(true);
          })
          .catch(() => {
            reject(false);
          });
      });
    },

    // 图片赋值功能
    showImg() {},

    // 清空图片地址
    clearImgUrlFunction() {},

    // 查看详情的时候把数据都脱敏
    handleIsShow() {},
  },
};
</script>

<style lang="less" scoped></style>
