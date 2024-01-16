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
        <span />

        <span />

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
          label="地址"
          :class="[
            detailsType == '详情' ? 'item-content' : 'item-content-edit',
          ]"
          prop="address"
        >
          <el-input
            v-if="detailsType != '详情'"
            v-model="formDetails.address"
            style="width: 100%"
            placeholder="请输入地址"
            class="filter-item"
            clearable
          />
          <div v-else>{{ formDetails.address }}</div>
        </el-form-item>
        <el-form-item
          label="中心坐标点"
          :class="[
            detailsType == '详情' ? 'item-content' : 'item-content-edit',
          ]"
          prop="centerPoint"
        >
          <el-input
            v-if="detailsType != '详情'"
            v-model="formDetails.centerPoint"
            style="width: 100%"
            placeholder="请输入中心坐标点"
            class="filter-item"
            clearable
          />
          <div v-else>{{ formDetails.centerPoint }}</div>
        </el-form-item>
        <el-form-item
          label="保护对象"
          :class="[
            detailsType == '详情' ? 'item-content' : 'item-content-edit',
          ]"
          prop="protectTarget"
        >
          <el-input
            v-if="detailsType != '详情'"
            v-model="formDetails.protectTarget"
            style="width: 100%"
            placeholder="请输入保护对象"
            class="filter-item"
            clearable
          />
          <div v-else>{{ formDetails.protectTarget }}</div>
        </el-form-item>
        <el-form-item
          label="保护地类型"
          :class="[
            detailsType == '详情' ? 'item-content' : 'item-content-edit',
          ]"
          prop="protectType"
        >
          <dictionary-select
            v-if="detailsType != '详情'"
            v-model.trim="formDetails.protectType"
            type="natural_reserve_type"
            :show-code="false"
            :placeholder="'请选择保护地类型'"
            class="filter-item"
            style="width: 100%"
          />
          <div v-else>
            <dictionary-text
              code="natural_reserve_type"
              :value="formDetails.protectType"
            />
          </div>
        </el-form-item>

        <el-form-item
          label="保护等级"
          :class="[
            detailsType == '详情' ? 'item-content' : 'item-content-edit',
          ]"
          prop="protectLevel"
        >
          <dictionary-select
            v-if="detailsType != '详情'"
            v-model.trim="formDetails.protectLevel"
            type="natural_reserve_level"
            :show-code="false"
            :placeholder="'请选择保护等级'"
            class="filter-item"
            style="width: 100%"
          />
          <div v-else>
            <dictionary-text
              code="natural_reserve_level"
              :value="formDetails.protectLevel"
            />
          </div>
        </el-form-item>

        <el-form-item
          label="落图面积(亩)"
          :class="[
            detailsType == '详情' ? 'item-content' : 'item-content-edit',
          ]"
          prop="plotArea"
        >
          <el-input
            v-if="detailsType != '详情'"
            v-model="formDetails.plotArea"
            style="width: 100%"
            placeholder="请输入落图面积(亩)"
            class="filter-item"
            clearable
          />
          <div v-else>{{ formDetails.plotArea }}</div>
        </el-form-item>
        <el-form-item
          label="核心区面积(亩)"
          :class="[
            detailsType == '详情' ? 'item-content' : 'item-content-edit',
          ]"
          prop="coreArea"
        >
          <el-input
            v-if="detailsType != '详情'"
            v-model="formDetails.coreArea"
            style="width: 100%"
            placeholder="请输入核心区面积(亩)"
            class="filter-item"
            clearable
          />
          <div v-else>{{ formDetails.coreArea }}</div>
        </el-form-item>
        <el-form-item
          label="缓冲区面积(亩)"
          :class="[
            detailsType == '详情' ? 'item-content' : 'item-content-edit',
          ]"
          prop="bufferArea"
        >
          <el-input
            v-if="detailsType != '详情'"
            v-model="formDetails.bufferArea"
            style="width: 100%"
            placeholder="请输入缓冲区面积(亩)"
            class="filter-item"
            clearable
          />
          <div v-else>{{ formDetails.bufferArea }}</div>
        </el-form-item>
        <el-form-item
          label="审批面积(亩)"
          :class="[
            detailsType == '详情' ? 'item-content' : 'item-content-edit',
          ]"
          prop="approvedArea"
        >
          <el-input
            v-if="detailsType != '详情'"
            v-model="formDetails.approvedArea"
            style="width: 100%"
            placeholder="请输入审批面积(亩)"
            class="filter-item"
            clearable
          />
          <div v-else>{{ formDetails.approvedArea }}</div>
        </el-form-item>
        <el-form-item
          label="批建时间"
          :class="[
            detailsType == '详情' ? 'item-content' : 'item-content-edit',
          ]"
          prop="approvedTime"
        >
          <el-date-picker
            v-if="detailsType != '详情'"
            v-model="formDetails.approvedTime"
            type="date"
            placeholder="请选择批建时间"
            style="width: 100%"
            value-format="yyyy-MM-dd"
          />
          <div v-else>{{ formDetails.approvedTime }}</div>
        </el-form-item>

        <el-form-item
          label="调查人"
          :class="[
            detailsType == '详情' ? 'item-content' : 'item-content-edit',
          ]"
          prop="investigator"
        >
          <el-input
            v-if="detailsType != '详情'"
            v-model="formDetails.investigator"
            style="width: 100%"
            placeholder="请输入调查人"
            class="filter-item"
            clearable
          />
          <div v-else>{{ formDetails.investigator }}</div>
        </el-form-item>
        <el-form-item
          label="审核人"
          :class="[
            detailsType == '详情' ? 'item-content' : 'item-content-edit',
          ]"
          prop="auditor"
        >
          <el-input
            v-if="detailsType != '详情'"
            v-model="formDetails.auditor"
            style="width: 100%"
            placeholder="请输入审核人"
            class="filter-item"
            clearable
          />
          <div v-else>{{ formDetails.auditor }}</div>
        </el-form-item>
        <!--  是否是空间信息  -->
        <span />

        <el-form-item
          label="备注"
          :class="[
            detailsType == '详情' ? 'item-content' : 'item-content-edit',
          ]"
          prop="beizhu"
        >
          <el-input
            v-if="detailsType != '详情'"
            v-model="formDetails.beizhu"
            style="width: 100%"
            placeholder="请输入备注"
            class="filter-item"
            clearable
          />
          <div v-else>{{ formDetails.beizhu }}</div>
        </el-form-item>
        <el-form-item
          label="附件"
          :class="[
            detailsType == '详情' ? 'item-content' : 'item-content-edit',
          ]"
          prop="fileUniqueName"
        >
          <el-input
            v-if="detailsType != '详情'"
            v-model="formDetails.fileUniqueName"
            style="width: 100%"
            placeholder=""
            class="filter-item"
            clearable
            :readonly="true"
          />
          <el-upload
            v-if="detailsType != '详情'"
            class="upload-demo"
            :action="uploadUrl"
            :show-file-list="false"
            :before-upload="beforeUpload"
            :on-success="onUploadSuccess"
          >
            <el-button size="small" type="primary" class="mt-10"
              >点击上传</el-button
            >
            <el-button
              size="small"
              type="primary"
              class="mt-10"
              @click.stop="formDetails.fileUniqueName = ''"
              >删除</el-button
            >
            <div slot="tip" class="el-upload__tip">只能上传PDF文件</div>
          </el-upload>
          <div v-else>
            <div class="c-click" @click="fileDown(formDetails.fileUniqueName)">
              {{ formDetails.fileUniqueName ? formDetails.fileUniqueName : "" }}
            </div>
          </div>
        </el-form-item>

        <el-form-item
          label="图片"
          :class="[
            detailsType == '详情' ? 'item-content' : 'item-content-edit',
          ]"
          prop="photoUniqueName"
        >
          <el-upload
            v-if="detailsType != '详情'"
            class="avatar-uploader"
            style="height: 100px"
            :action="uploadUrl"
            :show-file-list="false"
            :before-upload="beforeImgUpload"
            :on-success="onUploadImgSuccessphotoUniqueName"
          >
            <div v-if="imageUrlphotoUniqueName" style="position: relative">
              <img :src="imageUrlphotoUniqueName" class="avatar" />
              <img
                slot="suffix"
                class="avatar-error"
                src="~@/static/templateImages/close-circle-filled.png"
                alt=""
                @click.stop="
                  imageUrlphotoUniqueName = '';
                  formDetails.photoUniqueName = '';
                "
              />
            </div>
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>

          <div v-else>
            <img
              v-if="imageUrlphotoUniqueName && !isShowimageUrlphotoUniqueName"
              :src="imageUrlphotoUniqueName"
              class="avatar"
              @click="isShowimageUrlphotoUniqueName = true"
            />

            <div
              v-if="isShowimageUrlphotoUniqueName"
              class="overlay"
              @click="isShowimageUrlphotoUniqueName = false"
            >
              <img :src="imageUrlphotoUniqueName" class="large-image" />
            </div>
          </div>
        </el-form-item>

        <el-form-item
          label="描述"
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
          v-permission="['forestry:naturalReserve:delete']"
          class="right-text"
          @click="detailsDeleteClick"
        >
          删除
        </div>
        <el-button
          v-permission="['forestry:naturalReserve:update']"
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
import { naturalReserveApi } from "@/api/forestry/naturalReserve";

const listItemDefault = {
  id: undefined,
  areaCode: "",
  sysAreaVO: {},
  createdTime: undefined,
  lastModifyTime: undefined,
  name: undefined,
  address: undefined,
  centerPoint: undefined,
  protectTarget: undefined,
  protectType: undefined,
  protectLevel: undefined,
  plotArea: undefined,
  coreArea: undefined,
  bufferArea: undefined,
  approvedArea: undefined,
  approvedTime: undefined,
  investigator: undefined,
  auditor: undefined,
  boundaryLine: undefined,
  beizhu: undefined,
  fileUniqueName: undefined,
  photoUniqueName: undefined,
  describe: undefined,
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
      imageUrlphotoUniqueName: "", // 控制图片预览
      isShowimageUrlphotoUniqueName: false,
      uploadUrl: process.env.VUE_APP_BASE_API + "/files/minIo/common_upload",
      formDetails: deepClone(listItemDefault), // 这个是存放列表框中的属性框
      // 表单规则
      formRules: {
        areaCode: [
          { required: true, message: "请选择行政区划", trigger: "change" },
        ],
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        centerPoint: [
          { required: true, message: "请输入中心坐标点", trigger: "blur" },
        ],
        protectLevel: [
          { required: true, message: "请选择保护等级", trigger: "change" },
        ],
        boundaryLine: [
          {
            required: true,
            message: "请输入保护区范围/面状数据",
            trigger: "blur",
          },
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

          naturalReserveApi("update", "post", data)
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

    // 上传之前进行判断
    beforeUpload(file) {
      const name = file.name;
      if (name.endsWith(".pdf")) {
        return true;
      } else {
        this.$msgbox({
          title: "请注意",
          message: "您选择文件是" + name + "，文件类型错误，请重试",
        });
        return false;
      }
    },
    // 列表详情上传成功的钩子
    onUploadSuccess(res, file, fileList) {
      if (res.code != "200") {
        this.$msgbox({
          title: "请注意",
          message: res.message,
        });
        this.fileList = [];
        return;
      } else {
        this.formDetails.fileUniqueName = res.data.uniqueName;
        this.$message.success("上传成功");
      }
    },

    fileDown(name) {
      commonDownload({ uniqueName: name }).then((res) => {
        downloadFile(res.file, res.name);
      });
    },

    beforeImgUpload(file) {
      const name = file.name;
      if (name.endsWith(".png") || name.endsWith(".jpg")) {
        return true;
      } else {
        this.$msgbox({
          title: "请注意",
          message: "您选择文件是" + name + "，文件类型错误，请重试",
        });
        return false;
      }
    },

    // 的上传成功的钩子
    onUploadImgSuccessphotoUniqueName(res, file, fileList) {
      if (res.code != "200") {
        this.$msgbox({
          title: "请注意",
          message: res.message,
        });
        return;
      } else {
        this.formDetails.photoUniqueName = res.data.uniqueName;
        this.imageUrlphotoUniqueName = URL.createObjectURL(file.raw);
        this.$message.success("上传成功");
      }
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
        naturalReserveApi("detail", "get", { id: queryData.id })
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
    showImg() {
      if (this.formDetails.photoUniqueName) {
        commonDownload({ uniqueName: this.formDetails.photoUniqueName }).then(
          (res) => {
            const blob = new Blob([res.file], {
              type: res.file.type, // 替换为对应的图片类型
            });
            this.imageUrlphotoUniqueName = URL.createObjectURL(blob);
          }
        );
      }
    },

    // 清空图片地址
    clearImgUrlFunction() {
      this.imageUrlphotoUniqueName = "";
    },

    // 查看详情的时候把数据都脱敏
    handleIsShow() {},
  },
};
</script>

<style lang="less" scoped></style>
