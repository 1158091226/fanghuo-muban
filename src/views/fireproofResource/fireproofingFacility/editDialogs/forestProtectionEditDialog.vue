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
            label="所属单位"
            :class="[
              dialogtitle == '详情' ? 'item-content' : 'item-content-edit',
            ]"
            prop="unit"
          >
            <el-input
              v-if="dialogtitle != '详情'"
              v-model="formDetailsDialog.unit"
              style="width: 100%"
              placeholder="请输入所属单位"
              class="filter-item"
              clearable
            />
            <div v-else>{{ formDetailsDialog.unit }}</div>
          </el-form-item>
          <el-form-item
            label="建筑面积(平方米)"
            :class="[
              dialogtitle == '详情' ? 'item-content' : 'item-content-edit',
            ]"
            prop="buildArea"
          >
            <el-input
              v-if="dialogtitle != '详情'"
              v-model="formDetailsDialog.buildArea"
              style="width: 100%"
              placeholder="请输入建筑面积(平方米)"
              class="filter-item"
              clearable
            />
            <div v-else>{{ formDetailsDialog.buildArea }}</div>
          </el-form-item>
          <el-form-item
            label="建设日期"
            :class="[
              dialogtitle == '详情' ? 'item-content' : 'item-content-edit',
            ]"
            prop="buildTime"
          >
            <el-date-picker
              v-if="dialogtitle != '详情'"
              v-model="formDetailsDialog.buildTime"
              type="date"
              placeholder="请选择建设日期"
              style="width: 100%"
              value-format="yyyy-MM-dd"
            />
            <div v-else>{{ formDetailsDialog.buildTime }}</div>
          </el-form-item>

          <el-form-item
            label="负责人"
            :class="[
              dialogtitle == '详情' ? 'item-content' : 'item-content-edit',
            ]"
            prop="responsible"
          >
            <el-input
              v-if="dialogtitle != '详情'"
              v-model="formDetailsDialog.responsible"
              style="width: 100%"
              placeholder="请输入负责人"
              class="filter-item"
              clearable
            />
            <div v-else>{{ formDetailsDialog.responsible }}</div>
          </el-form-item>
          <el-form-item
            label="联系电话"
            :class="[
              dialogtitle == '详情' ? 'item-content' : 'item-content-edit',
            ]"
            prop="responsibleTel"
          >
            <el-input
              v-if="dialogtitle != '详情'"
              v-model="formDetailsDialog.responsibleTel"
              style="width: 100%"
              placeholder="请输入联系电话"
              class="filter-item"
              clearable
            />
            <div v-else>
              <div v-if="isShowresponsibleTel">
                {{ isShowSecretFunction(formDetailsDialog.responsibleTel, 3, 7)
                }}<el-button
                  size="mini"
                  class="ml-10"
                  @click="isShowresponsibleTel = !isShowresponsibleTel"
                  >查看</el-button
                >
              </div>
              <div v-else>
                {{ formDetailsDialog.responsibleTel
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
            <el-input
              v-if="dialogtitle != '详情'"
              v-model="formDetailsDialog.describe"
              type="textarea"
              placeholder="请输入描述"
            />
            <div v-else>{{ formDetailsDialog.describe }}</div>
          </el-form-item>
        </el-form>
      </div>
      <div class="dialog-content-right">
        <MapBasisLayer
          v-if="dialogVisible"
          ref="MapBasisLayerDialog"
          drawType="Point"
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
import { forestProtectionApi } from "@/api/fireprot/forestProtection";

const listItemDefault = {
  id: undefined,
  areaCode: "",
  sysAreaVO: {},
  boundaryLine: undefined,
  createdTime: undefined,
  lastModifyTime: undefined,
  name: undefined,
  address: undefined,
  unit: undefined,
  buildArea: undefined,
  buildTime: undefined,
  responsible: undefined,
  responsibleTel: undefined,
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
      isShowresponsibleTel: true, // 控制敏感数据查看
      imageUrlDialogphotoUniqueName: "", // 控制图片预览
      isShowimageUrlDialogphotoUniqueName: false,
      // 新增，编辑，详情数据存放
      formDetailsDialog: deepClone(listItemDefault),
      // 表单规则
      formRules: {
        areaCode: [
          { required: true, message: "请选择行政区划", trigger: "change" },
        ],
        boundaryLine: [
          { required: true, message: "请输入空间位置", trigger: "blur" },
        ],
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        address: [{ required: true, message: "请输入地址", trigger: "blur" }],
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
        forestProtectionApi("detail", "get", { id: queryData.id })
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
    handleIsShow() {
      this.isShowresponsibleTel = true; // 控制敏感数据查看
    },

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
            forestProtectionApi("create", "post", this.formDetailsDialog)
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
            forestProtectionApi("update", "post", data)
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
