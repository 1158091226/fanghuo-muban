<!--  -->
<template>
  <el-dialog
    :title="dialogtitle"
    :visible.sync="dialogVisible"
    :before-close="handleClose"
    class="dialog-class"
    width="84%"
    top="50px"
  >
    <div class="dialog-content-box" v-loading="requestLoading">
      <div class="dialog-content-left" ref="dialogContentLeft">
        <el-form
          ref="formDetailsDialog"
          :model="formDetailsDialog"
          label-width="130px"
          label-position="right"
          :rules="dialogtitle != '详情' ? formRules : {}"
          :class="[dialogtitle == '详情' ? 'details' : '']"
        >
          <span />

          <!--  是否是空间信息  -->
          <el-form-item
            label="行政区划"
            :class="[
              dialogtitle == '详情' ? 'item-content' : 'item-content-edit',
            ]"
            prop="areaCode"
          >
            <area-select
              v-if="dialogtitle != '详情'"
              ref="area-filter-dialog"
              :value="formDetailsDialog.areaCode"
              style="width: 100%"
              placeholder="请选择行政区划"
              :clearable="true"
              :is-width-zero="false"
              @change="changeAreaDialog"
            />
            <div v-else>
              <div>
                {{
                  formDetailsDialog.sysAreaVO.areaFullName
                    ? formDetailsDialog.sysAreaVO.areaFullName
                    : ""
                }}
              </div>
            </div>
          </el-form-item>

          <!--  是否是基类  -->
          <span />

          <!--  是否是空间信息  -->
          <span />

          <!--  是否是空间信息  -->
          <el-form-item
            label="名称"
            :class="[
              dialogtitle == '详情' ? 'item-content' : 'item-content-edit',
            ]"
            prop="name"
          >
            <el-input
              v-if="dialogtitle != '详情'"
              v-model="formDetailsDialog.name"
              style="width: 100%"
              placeholder="请输入名称"
              class="filter-item"
              clearable
            />
            <div v-else>{{ formDetailsDialog.name }}</div>
          </el-form-item>
          <el-form-item
            label="地址"
            :class="[
              dialogtitle == '详情' ? 'item-content' : 'item-content-edit',
            ]"
            prop="address"
          >
            <el-input
              v-if="dialogtitle != '详情'"
              v-model="formDetailsDialog.address"
              style="width: 100%"
              placeholder="请输入地址"
              class="filter-item"
              clearable
            />
            <div v-else>{{ formDetailsDialog.address }}</div>
          </el-form-item>
          <el-form-item
            label="中心坐标点"
            :class="[
              dialogtitle == '详情' ? 'item-content' : 'item-content-edit',
            ]"
            prop="centerPoint"
          >
            <el-input
              v-if="dialogtitle != '详情'"
              v-model="formDetailsDialog.centerPoint"
              style="width: 100%"
              placeholder="请输入中心坐标点"
              class="filter-item"
              clearable
            />
            <div v-else>{{ formDetailsDialog.centerPoint }}</div>
          </el-form-item>
          <el-form-item
            label="保护对象"
            :class="[
              dialogtitle == '详情' ? 'item-content' : 'item-content-edit',
            ]"
            prop="protectTarget"
          >
            <el-input
              v-if="dialogtitle != '详情'"
              v-model="formDetailsDialog.protectTarget"
              style="width: 100%"
              placeholder="请输入保护对象"
              class="filter-item"
              clearable
            />
            <div v-else>{{ formDetailsDialog.protectTarget }}</div>
          </el-form-item>
          <el-form-item
            label="保护地类型"
            :class="[
              dialogtitle == '详情' ? 'item-content' : 'item-content-edit',
            ]"
            prop="protectType"
          >
            <dictionary-select
              v-if="dialogtitle != '详情'"
              v-model.trim="formDetailsDialog.protectType"
              type="natural_reserve_type"
              :show-code="false"
              :placeholder="'请选择保护地类型'"
              class="filter-item"
              style="width: 100%"
            />
            <div v-else>
              <dictionary-text
                code="natural_reserve_type"
                :value="formDetailsDialog.protectType"
              />
            </div>
          </el-form-item>

          <el-form-item
            label="保护等级"
            :class="[
              dialogtitle == '详情' ? 'item-content' : 'item-content-edit',
            ]"
            prop="protectLevel"
          >
            <dictionary-select
              v-if="dialogtitle != '详情'"
              v-model.trim="formDetailsDialog.protectLevel"
              type="natural_reserve_level"
              :show-code="false"
              :placeholder="'请选择保护等级'"
              class="filter-item"
              style="width: 100%"
            />
            <div v-else>
              <dictionary-text
                code="natural_reserve_level"
                :value="formDetailsDialog.protectLevel"
              />
            </div>
          </el-form-item>

          <el-form-item
            label="落图面积(亩)"
            :class="[
              dialogtitle == '详情' ? 'item-content' : 'item-content-edit',
            ]"
            prop="plotArea"
          >
            <el-input
              v-if="dialogtitle != '详情'"
              v-model="formDetailsDialog.plotArea"
              style="width: 100%"
              placeholder="请输入落图面积(亩)"
              class="filter-item"
              clearable
            />
            <div v-else>{{ formDetailsDialog.plotArea }}</div>
          </el-form-item>
          <el-form-item
            label="核心区面积(亩)"
            :class="[
              dialogtitle == '详情' ? 'item-content' : 'item-content-edit',
            ]"
            prop="coreArea"
          >
            <el-input
              v-if="dialogtitle != '详情'"
              v-model="formDetailsDialog.coreArea"
              style="width: 100%"
              placeholder="请输入核心区面积(亩)"
              class="filter-item"
              clearable
            />
            <div v-else>{{ formDetailsDialog.coreArea }}</div>
          </el-form-item>
          <el-form-item
            label="缓冲区面积(亩)"
            :class="[
              dialogtitle == '详情' ? 'item-content' : 'item-content-edit',
            ]"
            prop="bufferArea"
          >
            <el-input
              v-if="dialogtitle != '详情'"
              v-model="formDetailsDialog.bufferArea"
              style="width: 100%"
              placeholder="请输入缓冲区面积(亩)"
              class="filter-item"
              clearable
            />
            <div v-else>{{ formDetailsDialog.bufferArea }}</div>
          </el-form-item>
          <el-form-item
            label="审批面积(亩)"
            :class="[
              dialogtitle == '详情' ? 'item-content' : 'item-content-edit',
            ]"
            prop="approvedArea"
          >
            <el-input
              v-if="dialogtitle != '详情'"
              v-model="formDetailsDialog.approvedArea"
              style="width: 100%"
              placeholder="请输入审批面积(亩)"
              class="filter-item"
              clearable
            />
            <div v-else>{{ formDetailsDialog.approvedArea }}</div>
          </el-form-item>
          <el-form-item
            label="批建时间"
            :class="[
              dialogtitle == '详情' ? 'item-content' : 'item-content-edit',
            ]"
            prop="approvedTime"
          >
            <el-date-picker
              v-if="dialogtitle != '详情'"
              v-model="formDetailsDialog.approvedTime"
              type="date"
              placeholder="请选择批建时间"
              style="width: 100%"
              value-format="yyyy-MM-dd"
            />
            <div v-else>{{ formDetailsDialog.approvedTime }}</div>
          </el-form-item>

          <el-form-item
            label="调查人"
            :class="[
              dialogtitle == '详情' ? 'item-content' : 'item-content-edit',
            ]"
            prop="investigator"
          >
            <el-input
              v-if="dialogtitle != '详情'"
              v-model="formDetailsDialog.investigator"
              style="width: 100%"
              placeholder="请输入调查人"
              class="filter-item"
              clearable
            />
            <div v-else>{{ formDetailsDialog.investigator }}</div>
          </el-form-item>
          <el-form-item
            label="审核人"
            :class="[
              dialogtitle == '详情' ? 'item-content' : 'item-content-edit',
            ]"
            prop="auditor"
          >
            <el-input
              v-if="dialogtitle != '详情'"
              v-model="formDetailsDialog.auditor"
              style="width: 100%"
              placeholder="请输入审核人"
              class="filter-item"
              clearable
            />
            <div v-else>{{ formDetailsDialog.auditor }}</div>
          </el-form-item>
          <span />

          <el-form-item
            label="备注"
            :class="[
              dialogtitle == '详情' ? 'item-content' : 'item-content-edit',
            ]"
            prop="beizhu"
          >
            <el-input
              v-if="dialogtitle != '详情'"
              v-model="formDetailsDialog.beizhu"
              style="width: 100%"
              placeholder="请输入备注"
              class="filter-item"
              clearable
            />
            <div v-else>{{ formDetailsDialog.beizhu }}</div>
          </el-form-item>
          <el-form-item
            label="附件"
            :class="[
              dialogtitle == '详情' ? 'item-content' : 'item-content-edit',
            ]"
            prop="fileUniqueName"
          >
            <el-input
              v-if="dialogtitle != '详情'"
              v-model="formDetailsDialog.fileUniqueName"
              style="width: 100%"
              placeholder=""
              class="filter-item"
              clearable
              :readonly="true"
            />
            <el-upload
              v-if="dialogtitle != '详情'"
              class="upload-demo"
              :action="uploadUrl"
              :show-file-list="false"
              :before-upload="beforeUpload"
              :on-success="onUploadSuccessDialog"
            >
              <el-button size="small" type="primary" class="mt-10"
                >点击上传</el-button
              >
              <el-button
                size="small"
                type="primary"
                class="mt-10"
                @click.stop="formDetailsDialog.fileUniqueName = ''"
                >删除</el-button
              >
              <div slot="tip" class="el-upload__tip">只能上传PDF文件</div>
            </el-upload>
            <div v-else>
              <div
                class="c-click"
                @click="fileDown(formDetailsDialog.fileUniqueName)"
              >
                {{
                  formDetailsDialog.fileUniqueName
                    ? formDetailsDialog.fileUniqueName
                    : ""
                }}
              </div>
            </div>
          </el-form-item>

          <el-form-item
            label="图片"
            :class="[
              dialogtitle == '详情' ? 'item-content' : 'item-content-edit',
            ]"
            prop="photoUniqueName"
          >
            <el-upload
              v-if="dialogtitle != '详情'"
              class="avatar-uploader"
              style="height: 100px"
              :action="uploadUrl"
              :show-file-list="false"
              :before-upload="beforeImgUpload"
              :on-success="onUploadImgDialogSuccessphotoUniqueName"
            >
              <div
                v-if="imageUrlDialogphotoUniqueName"
                style="position: relative"
              >
                <img :src="imageUrlDialogphotoUniqueName" class="avatar" />
                <img
                  slot="suffix"
                  class="avatar-error"
                  src="~@/static/templateImages/close-circle-filled.png"
                  alt=""
                  @click.stop="
                    imageUrlDialogphotoUniqueName = '';
                    formDetailsDialog.photoUniqueName = '';
                  "
                />
              </div>
              <i v-else class="el-icon-plus avatar-uploader-icon" />
            </el-upload>

            <div v-else>
              <img
                v-if="
                  imageUrlDialogphotoUniqueName &&
                  !isShowimageUrlDialogphotoUniqueName
                "
                :src="imageUrlDialogphotoUniqueName"
                class="avatar"
                @click="isShowimageUrlDialogphotoUniqueName = true"
              />

              <div
                v-if="isShowimageUrlDialogphotoUniqueName"
                class="overlay"
                @click="isShowimageUrlDialogphotoUniqueName = false"
              >
                <img :src="imageUrlDialogphotoUniqueName" class="large-image" />
              </div>
            </div>
          </el-form-item>

          <el-form-item
            label="描述"
            :class="[
              dialogtitle == '详情' ? 'item-content' : 'item-content-edit',
            ]"
            prop="describe"
          >
            <tinymce
              v-if="dialogtitle != '详情'"
              v-model="formDetailsDialog.describe"
              :height="300"
            />
            <div v-else>
              <div v-html="formDetailsDialog.describe" />
            </div>
          </el-form-item>
        </el-form>
      </div>
      <div class="dialog-content-right">
        <MapBasisLayer
          v-if="dialogVisible"
          ref="MapBasisLayerDialog"
          drawType="Polygon"
        />
      </div>
    </div>
    <span v-show="dialogtitle != '详情'" slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleSubmitClick">确定</el-button>
    </span>
  </el-dialog>
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
import { mapGetters } from "vuex";
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
    dialogVisible: {
      type: Boolean,
      default: false,
    },
    dialogtitle: {
      type: String,
      default: "详情",
    },
    dialogSelectData: {
      type: Object,
      default() {
        return { any };
      },
    },
  },
  data() {
    return {
      uploadUrl: process.env.VUE_APP_BASE_API + "/files/minIo/common_upload",
      imageUrlDialogphotoUniqueName: "", // 控制图片预览
      isShowimageUrlDialogphotoUniqueName: false,
      // 新增，编辑，详情数据存放
      formDetailsDialog: deepClone(listItemDefault),
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

  computed: {
    ...mapGetters(["requestLoading"]),
  },

  async created() {
    if (this.dialogtitle != "新增") {
      this.formDetailsDialog = deepClone(listItemDefault);
      this.resetForm("formDetailsDialog");
      await this.getDetailsFunction(this.dialogSelectData, "formDetailsDialog");
      if (this.dialogtitle == "详情") {
        this.handleIsShow();
      }
      this.showImg();
      this.$nextTick(() => {
        const obj = {
          state: this.dialogtitle == "详情" ? "details" : "update", // 状态详情还是编辑details,update,add
          wktString: this.formDetailsDialog.boundaryLine,
        };
        setTimeout(() => {
          this.$refs["MapBasisLayerDialog"].addPointLayer(obj);
        }, 0);
      });
    } else {
      this.formDetailsDialog = deepClone(listItemDefault);
      this.resetForm("formDetailsDialog");
      this.clearImgUrlFunction();
      this.$nextTick(() => {
        const obj = {
          state: "add", // 状态详情还是编辑details,update,add
        };
        setTimeout(() => {
          this.$refs["MapBasisLayerDialog"].addPointLayer(obj);
        }, 0);
      });
    }
  },

  // mounted(){},

  methods: {
    // 弹窗关闭
    async handleClose() {
      this.formDetailsDialog = deepClone(listItemDefault);
      this.resetForm("formDetailsDialog");
      this.handleIsShow();
      this.$refs.dialogContentLeft.scrollTop = 0;
      // this.dialogVisible = false;

      this.$emit("close");
      this.$emit("update:dialogVisible", false);
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

    // 弹框的上传成功的钩子
    onUploadSuccessDialog(res, file, fileList) {
      if (res.code != "200") {
        this.$msgbox({
          title: "请注意",
          message: res.message,
        });
        this.fileList = [];
        return;
      } else {
        this.formDetailsDialog.fileUniqueName = res.data.uniqueName;
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

    // 弹窗的上传成功的钩子
    onUploadImgDialogSuccessphotoUniqueName(res, file, fileList) {
      if (res.code != "200") {
        this.$msgbox({
          title: "请注意",
          message: res.message,
        });
        return;
      } else {
        this.formDetailsDialog.photoUniqueName = res.data.uniqueName;
        this.imageUrlDialogphotoUniqueName = URL.createObjectURL(file.raw);
        this.$message.success("上传成功");
      }
    },

    // 清空表单校验样式
    resetForm(formName) {
      this.$nextTick(() => {
        if (this.$refs[formName]) {
          this.$refs[formName].clearValidate();
        }
      });
    },

    // 表单中区划选择配套的事件
    changeAreaDialog(v) {
      const temp = deepClone(v);
      if (isArray(temp) && temp.length > 0) {
        this.formDetailsDialog.areaCode = temp.pop();
      } else {
        this.formDetailsDialog.areaCode = "";
      }
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

    // 查看详情的时候把数据都脱敏
    handleIsShow() {},

    // 弹窗确认按钮
    handleSubmitClick() {
      this.$refs["formDetailsDialog"].validate((valid) => {
        if (valid) {
          // 这里是对行政区划选择的数据处理，因为选择的后返回的是数组，所以要取最后一个
          const temp = deepClone(this.$refs["area-filter-dialog"].codes);
          if (isArray(temp) && temp.length > 0) {
            this.formDetailsDialog.areaCode = temp.pop();
          } else {
            delete this.formDetailsDialog.areaCode;
          }

          this.formDetailsDialog.boundaryLine =
            this.$refs["MapBasisLayerDialog"].returnAddLayerWkt();
          if (!this.formDetailsDialog.boundaryLine) {
            this.$message({
              type: "error",
              message: "请在地图绘制对应位置",
            });
            return;
          }

          if (this.dialogtitle == "新增") {
            naturalReserveApi("create", "post", this.formDetailsDialog)
              .then((res) => {
                this.$message({
                  type: "success",
                  message: "新增成功",
                });
                this.handleClose();
                this.$emit("diaologSubmitClick");
              })
              .catch((err) => {});
          } else {
            let data = {};
            for (let key in this.formDetailsDialog) {
              data[key] =
                this.formDetailsDialog[key] == null
                  ? undefined
                  : this.formDetailsDialog[key];
            }
            naturalReserveApi("update", "post", data)
              .then((res) => {
                this.$message({
                  type: "success",
                  message: "修改成功",
                });
                this.handleClose();
                this.$emit("diaologSubmitClick");
              })
              .catch((err) => {});
          }
        }
      });
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

    // 清空图片地址
    clearImgUrlFunction() {
      this.imageUrlDialogphotoUniqueName = "";
    },

    // 图片赋值功能
    showImg() {
      if (this.formDetailsDialog.photoUniqueName) {
        commonDownload({
          uniqueName: this.formDetailsDialog.photoUniqueName,
        }).then((res) => {
          const blob = new Blob([res.file], {
            type: res.file.type, // 替换为对应的图片类型
          });
          this.imageUrlDialogphotoUniqueName = URL.createObjectURL(blob);
        });
      }
    },
  },
};
</script>

<style lang="less" scoped></style>
