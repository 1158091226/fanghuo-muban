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
          label="名称"
          :class="[
            detailsType == '详情' ? 'item-content' : 'item-content-edit',
          ]"
          prop="name"
        >
          <el-input
            v-if="detailsType != '详情'"
            v-model="formDetails.name"
            style="width: 100%"
            placeholder="请输入名称"
            class="filter-item"
            clearable
          />
          <div v-else>{{ formDetails.name }}</div>
        </el-form-item>
        <el-form-item
          label="队伍编号"
          :class="[
            detailsType == '详情' ? 'item-content' : 'item-content-edit',
          ]"
          prop="teamNum"
        >
          <el-input
            v-if="detailsType != '详情'"
            v-model="formDetails.teamNum"
            style="width: 100%"
            placeholder="请输入队伍编号"
            class="filter-item"
            clearable
          />
          <div v-else>{{ formDetails.teamNum }}</div>
        </el-form-item>
        <span />

        <span />

        <span />

        <!--  是否是空间信息  -->
        <span />

        <el-form-item
          label="中文地址"
          :class="[
            detailsType == '详情' ? 'item-content' : 'item-content-edit',
          ]"
          prop="address"
        >
          <el-input
            v-if="detailsType != '详情'"
            v-model="formDetails.address"
            style="width: 100%"
            placeholder="请输入中文地址"
            class="filter-item"
            clearable
          />
          <div v-else>{{ formDetails.address }}</div>
        </el-form-item>
        <el-form-item
          label="负责人"
          :class="[
            detailsType == '详情' ? 'item-content' : 'item-content-edit',
          ]"
          prop="responsible"
        >
          <el-input
            v-if="detailsType != '详情'"
            v-model="formDetails.responsible"
            style="width: 100%"
            placeholder="请输入负责人"
            class="filter-item"
            clearable
          />
          <div v-else>{{ formDetails.responsible }}</div>
        </el-form-item>
        <el-form-item
          label="联系电话"
          :class="[
            detailsType == '详情' ? 'item-content' : 'item-content-edit',
          ]"
          prop="responsibleTel"
        >
          <el-input
            v-if="detailsType != '详情'"
            v-model="formDetails.responsibleTel"
            style="width: 100%"
            placeholder="请输入联系电话"
            class="filter-item"
            clearable
          />
          <div v-else>
            <div v-if="isShowresponsibleTel">
              {{ isShowSecretFunction(formDetails.responsibleTel, 3, 7)
              }}<el-button
                size="mini"
                class="ml-10"
                @click="isShowresponsibleTel = !isShowresponsibleTel"
                >查看</el-button
              >
            </div>
            <div v-else>
              {{ formDetails.responsibleTel
              }}<el-button
                size="mini"
                class="ml-10"
                @click="isShowresponsibleTel = !isShowresponsibleTel"
                >隐藏</el-button
              >
            </div>
          </div>
        </el-form-item>

        <el-form-item
          label="队伍成立时间"
          :class="[
            detailsType == '详情' ? 'item-content' : 'item-content-edit',
          ]"
          prop="establishmentTime"
        >
          <el-date-picker
            v-if="detailsType != '详情'"
            v-model="formDetails.establishmentTime"
            type="datetime"
            style="width: 100%"
            placeholder="选择队伍成立时间"
            value-format="yyyy-MM-dd HH:mm:ss"
          />
          <div v-else>{{ formDetails.establishmentTime }}</div>
        </el-form-item>

        <el-form-item
          label="队伍人数"
          :class="[
            detailsType == '详情' ? 'item-content' : 'item-content-edit',
          ]"
          prop="numOfPeople"
        >
          <el-input-number
            v-if="detailsType != '详情'"
            v-model="formDetails.numOfPeople"
            style="width: 100%"
            placeholder="请输入队伍人数"
            :controls="false"
          />
          <div v-else>{{ formDetails.numOfPeople }}</div>
        </el-form-item>

        <el-form-item
          label="队伍类型"
          :class="[
            detailsType == '详情' ? 'item-content' : 'item-content-edit',
          ]"
          prop="type"
        >
          <dictionary-select
            v-if="detailsType != '详情'"
            v-model.trim="formDetails.type"
            type="fireproofing_team_type"
            :show-code="false"
            :placeholder="'请选择队伍类型'"
            class="filter-item"
            style="width: 100%"
          />
          <div v-else>
            <dictionary-text
              code="fireproofing_team_type"
              :value="formDetails.type"
            />
          </div>
        </el-form-item>

        <el-form-item
          label="平均年龄(岁"
          :class="[
            detailsType == '详情' ? 'item-content' : 'item-content-edit',
          ]"
          prop="avaAge"
        >
          <el-input
            v-if="detailsType != '详情'"
            v-model="formDetails.avaAge"
            style="width: 100%"
            placeholder="请输入平均年龄(岁"
            class="filter-item"
            clearable
          />
          <div v-else>{{ formDetails.avaAge }}</div>
        </el-form-item>
        <el-form-item
          label="营区用地面积(平方米)"
          :class="[
            detailsType == '详情' ? 'item-content' : 'item-content-edit',
          ]"
          prop="campArea"
        >
          <el-input
            v-if="detailsType != '详情'"
            v-model="formDetails.campArea"
            style="width: 100%"
            placeholder="请输入营区用地面积(平方米)"
            class="filter-item"
            clearable
          />
          <div v-else>{{ formDetails.campArea }}</div>
        </el-form-item>
        <el-form-item
          label="营房建筑面积(平方米)"
          :class="[
            detailsType == '详情' ? 'item-content' : 'item-content-edit',
          ]"
          prop="barrackArea"
        >
          <el-input
            v-if="detailsType != '详情'"
            v-model="formDetails.barrackArea"
            style="width: 100%"
            placeholder="请输入营房建筑面积(平方米)"
            class="filter-item"
            clearable
          />
          <div v-else>{{ formDetails.barrackArea }}</div>
        </el-form-item>
        <el-form-item
          label="训练场地面积(平方米)"
          :class="[
            detailsType == '详情' ? 'item-content' : 'item-content-edit',
          ]"
          prop="trainingArea"
        >
          <el-input
            v-if="detailsType != '详情'"
            v-model="formDetails.trainingArea"
            style="width: 100%"
            placeholder="请输入训练场地面积(平方米)"
            class="filter-item"
            clearable
          />
          <div v-else>{{ formDetails.trainingArea }}</div>
        </el-form-item>
        <el-form-item
          label="飞机飞行时数(年/小时)"
          :class="[
            detailsType == '详情' ? 'item-content' : 'item-content-edit',
          ]"
          prop="flightHours"
        >
          <el-input
            v-if="detailsType != '详情'"
            v-model="formDetails.flightHours"
            style="width: 100%"
            placeholder="请输入飞机飞行时数(年/小时)"
            class="filter-item"
            clearable
          />
          <div v-else>{{ formDetails.flightHours }}</div>
        </el-form-item>
        <el-form-item
          label="无人机飞行时数(年/小时)"
          :class="[
            detailsType == '详情' ? 'item-content' : 'item-content-edit',
          ]"
          prop="droneFlightHours"
        >
          <el-input
            v-if="detailsType != '详情'"
            v-model="formDetails.droneFlightHours"
            style="width: 100%"
            placeholder="请输入无人机飞行时数(年/小时)"
            class="filter-item"
            clearable
          />
          <div v-else>{{ formDetails.droneFlightHours }}</div>
        </el-form-item>
        <el-form-item
          label="近五年火灾火情处置次数"
          :class="[
            detailsType == '详情' ? 'item-content' : 'item-content-edit',
          ]"
          prop="hqczcs"
        >
          <el-input
            v-if="detailsType != '详情'"
            v-model="formDetails.hqczcs"
            style="width: 100%"
            placeholder="请输入近五年火灾火情处置次数"
            class="filter-item"
            clearable
          />
          <div v-else>{{ formDetails.hqczcs }}</div>
        </el-form-item>
        <el-form-item
          label="近五年火灾火情出动人次"
          :class="[
            detailsType == '详情' ? 'item-content' : 'item-content-edit',
          ]"
          prop="hqcdrc"
        >
          <el-input
            v-if="detailsType != '详情'"
            v-model="formDetails.hqcdrc"
            style="width: 100%"
            placeholder="请输入近五年火灾火情出动人次"
            class="filter-item"
            clearable
          />
          <div v-else>{{ formDetails.hqcdrc }}</div>
        </el-form-item>
        <el-form-item
          label="近五年火灾火情出动车辆"
          :class="[
            detailsType == '详情' ? 'item-content' : 'item-content-edit',
          ]"
          prop="hqcdqc"
        >
          <el-input
            v-if="detailsType != '详情'"
            v-model="formDetails.hqcdqc"
            style="width: 100%"
            placeholder="请输入近五年火灾火情出动车辆"
            class="filter-item"
            clearable
          />
          <div v-else>{{ formDetails.hqcdqc }}</div>
        </el-form-item>
        <el-form-item
          label="近五年平均出警响应时间/分"
          :class="[
            detailsType == '详情' ? 'item-content' : 'item-content-edit',
          ]"
          prop="avgCjxysj"
        >
          <el-input
            v-if="detailsType != '详情'"
            v-model="formDetails.avgCjxysj"
            style="width: 100%"
            placeholder="请输入近五年平均出警响应时间/分"
            class="filter-item"
            clearable
          />
          <div v-else>{{ formDetails.avgCjxysj }}</div>
        </el-form-item>
      </el-form>
      <template v-if="isShowHandle">
        <div
          v-show="isShowMapBasisLayer"
          ref="contentMapBox"
          class="content-map-box"
        >
          <MapBasisLayer
            drawType="Point"
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
          v-permission="['fireprot:teamMgmt:delete']"
          class="right-text"
          @click="detailsDeleteClick"
        >
          删除
        </div>
        <el-button
          v-permission="['fireprot:teamMgmt:update']"
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
import { teamMgmtApi } from "@/api/fireprot/teamMgmt";

const listItemDefault = {
  areaCode: "",
  sysAreaVO: {},
  name: undefined,
  teamNum: undefined,
  id: undefined,
  createdTime: undefined,
  lastModifyTime: undefined,
  boundaryLine: undefined,
  address: undefined,
  responsible: undefined,
  responsibleTel: undefined,
  establishmentTime: undefined,
  numOfPeople: undefined,
  type: undefined,
  avaAge: undefined,
  campArea: undefined,
  barrackArea: undefined,
  trainingArea: undefined,
  flightHours: undefined,
  droneFlightHours: undefined,
  hqczcs: undefined,
  hqcdrc: undefined,
  hqcdqc: undefined,
  avgCjxysj: undefined,
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
      isShowresponsibleTel: true, // 控制敏感数据查看
      uploadUrl: process.env.VUE_APP_BASE_API + "/files/minIo/common_upload",
      formDetails: deepClone(listItemDefault), // 这个是存放列表框中的属性框
      // 表单规则
      formRules: {
        areaCode: [
          { required: true, message: "请选择行政区划", trigger: "change" },
        ],
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        boundaryLine: [
          {
            required: true,
            message: "请输入空间位置/队伍所在的位置",
            trigger: "blur",
          },
        ],
        address: [
          { required: true, message: "请输入中文地址", trigger: "blur" },
        ],
        responsible: [
          { required: true, message: "请输入负责人", trigger: "blur" },
        ],
        responsibleTel: [
          { required: true, message: "请输入联系电话", trigger: "blur" },
        ],
        establishmentTime: [
          { required: true, message: "请选择队伍成立时间", trigger: "change" },
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

          teamMgmtApi("update", "post", data)
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
        teamMgmtApi("detail", "get", { id: queryData.id })
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
    handleIsShow() {
      this.isShowresponsibleTel = true; // 控制敏感数据查看
    },
  },
};
</script>

<style lang="less" scoped></style>
