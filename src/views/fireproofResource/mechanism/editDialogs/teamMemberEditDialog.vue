<!--  -->
<template>
  <el-dialog
    :title="dialogtitle"
    :visible.sync="dialogVisible"
    :before-close="handleClose"
    :append-to-body="true"
    class="dialog-class"
    width="84%"
    top="50px"
  >
    <div class="app-list-page">
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
            <span />

            <!--  是否是空间信息  -->
            <!-- <el-form-item
            label="关联的防火队id"
            :class="[
              dialogtitle == '详情' ? 'item-content' : 'item-content-edit',
            ]"
            prop="teamId"
          >
            <el-input
              v-if="dialogtitle != '详情'"
              v-model="formDetailsDialog.teamId"
              style="width: 100%"
              placeholder="请输入关联的防火队id"
              class="filter-item"
              clearable
            />
            <div v-else>{{ formDetailsDialog.teamId }}</div>
          </el-form-item> -->
            <el-form-item
              label="姓名"
              :class="[
                dialogtitle == '详情' ? 'item-content' : 'item-content-edit',
              ]"
              prop="name"
            >
              <el-input
                v-if="dialogtitle != '详情'"
                v-model="formDetailsDialog.name"
                style="width: 100%"
                placeholder="请输入姓名"
                class="filter-item"
                clearable
              />
              <div v-else>{{ formDetailsDialog.name }}</div>
            </el-form-item>
            <el-form-item
              label="年龄"
              :class="[
                dialogtitle == '详情' ? 'item-content' : 'item-content-edit',
              ]"
              prop="age"
            >
              <el-input
                v-if="dialogtitle != '详情'"
                v-model="formDetailsDialog.age"
                style="width: 100%"
                placeholder="请输入年龄"
                class="filter-item"
                clearable
              />
              <div v-else>{{ formDetailsDialog.age }}</div>
            </el-form-item>
            <el-form-item
              label="电话"
              :class="[
                dialogtitle == '详情' ? 'item-content' : 'item-content-edit',
              ]"
              prop="tel"
            >
              <el-input
                v-if="dialogtitle != '详情'"
                v-model="formDetailsDialog.tel"
                style="width: 100%"
                placeholder="请输入电话"
                class="filter-item"
                clearable
              />
              <div v-else>{{ formDetailsDialog.tel }}</div>
            </el-form-item>
            <el-form-item
              label="职位"
              :class="[
                dialogtitle == '详情' ? 'item-content' : 'item-content-edit',
              ]"
              prop="position"
            >
              <el-input
                v-if="dialogtitle != '详情'"
                v-model="formDetailsDialog.position"
                style="width: 100%"
                placeholder="请输入职位"
                class="filter-item"
                clearable
              />
              <div v-else>{{ formDetailsDialog.position }}</div>
            </el-form-item>
            <el-form-item
              label="专业技术水平"
              :class="[
                dialogtitle == '详情' ? 'item-content' : 'item-content-edit',
              ]"
              prop="technicalLevel"
            >
              <el-input
                v-if="dialogtitle != '详情'"
                v-model="formDetailsDialog.technicalLevel"
                style="width: 100%"
                placeholder="请输入专业技术水平"
                class="filter-item"
                clearable
              />
              <div v-else>{{ formDetailsDialog.technicalLevel }}</div>
            </el-form-item>
            <el-form-item
              label="特长说明"
              :class="[
                dialogtitle == '详情' ? 'item-content' : 'item-content-edit',
              ]"
              prop="speciality"
            >
              <el-input
                v-if="dialogtitle != '详情'"
                v-model="formDetailsDialog.speciality"
                style="width: 100%"
                placeholder="请输入特长说明"
                class="filter-item"
                clearable
              />
              <div v-else>{{ formDetailsDialog.speciality }}</div>
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
                  <img
                    :src="imageUrlDialogphotoUniqueName"
                    class="large-image"
                  />
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
        <!-- <div class="dialog-content-right"></div> -->
      </div>
    </div>
    <span v-if="dialogtitle != '详情'" slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleSubmitClick">确定</el-button>
    </span>
    <span v-else slot="footer" class="dialog-footer">
      <div style="height: 66px"></div>
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
import { teamMemberApi } from "@/api/fireprot/teamMember";

const listItemDefault = {
  areaCode: "",
  sysAreaVO: {},
  id: undefined,
  createdTime: undefined,
  lastModifyTime: undefined,
  teamId: undefined,
  name: undefined,
  age: undefined,
  tel: undefined,
  position: undefined,
  technicalLevel: undefined,
  speciality: undefined,
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
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
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
        // setTimeout(() => {
        //   this.$refs["MapBasisLayerDialog"].addPointLayer(obj);
        // }, 0);
      });
    } else {
      this.formDetailsDialog = deepClone(listItemDefault);
      this.resetForm("formDetailsDialog");
      this.clearImgUrlFunction();
      this.$nextTick(() => {
        const obj = {
          state: "add", // 状态详情还是编辑details,update,add
        };
        // setTimeout(() => {
        //   this.$refs["MapBasisLayerDialog"].addPointLayer(obj);
        // }, 0);
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
        teamMemberApi("detail", "get", { id: queryData.id })
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

          // this.formDetailsDialog.boundaryLine =
          //   this.$refs["MapBasisLayerDialog"].returnAddLayerWkt();
          // if (!this.formDetailsDialog.boundaryLine) {
          //   this.$message({
          //     type: "error",
          //     message: "请在地图绘制对应位置",
          //   });
          //   return;
          // }
          this.formDetailsDialog.teamId = this.dialogSelectData.teamId;

          if (this.dialogtitle == "新增") {
            teamMemberApi("create", "post", this.formDetailsDialog)
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
            teamMemberApi("update", "post", data)
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

<style lang="scss" scoped>
.app-list-page {
  min-height: calc(100vh - 260px) !important;
  padding: 0px;
  .dialog-content-box {
    height: calc(100vh - 260px);
    .dialog-content-left {
      width: 100%;
      height: 100%;
    }
  }
  ::v-deep .el-input--suffix .el-input__inner {
    padding: 5px 28px 5px 8px;
  }
  //时间日期选择图标去掉
  ::v-deep .el-icon-date:before {
    content: "" !important;
  }
  ::v-deep .el-icon-time:before {
    content: "" !important;
  }
  ::v-deep .el-button--mini {
    padding: 4px 10px;
  }
}
.dialog-class {
  ::v-deep .el-input--medium .el-input__inner {
    height: 32px;
  }
}
</style>
