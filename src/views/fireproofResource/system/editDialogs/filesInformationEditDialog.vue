<!--  -->
<template>
  <el-dialog
    :title="dialogtitle"
    :visible.sync="dialogVisible"
    :before-close="handleClose"
    class="dialog-class"
    width="50%"
    top="50px"
  >
    <div v-loading="requestLoading" class="dialog-content-box">
      <div
        ref="dialogContentLeft"
        class="dialog-content-left"
        style="width: 100%"
      >
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
            label="文件原名"
            :class="[
              dialogtitle == '详情' ? 'item-content' : 'item-content-edit',
            ]"
            prop="ogriginalName"
          >
            <el-input
              v-if="dialogtitle != '详情'"
              v-model="formDetailsDialog.ogriginalName"
              style="width: 100%"
              placeholder="请输入文件原名"
              class="filter-item"
              clearable
            />
            <div v-else>{{ formDetailsDialog.ogriginalName }}</div>
          </el-form-item>

          <!--  是否是空间信息  -->
          <el-form-item
            label="文件（相对）路径"
            :class="[
              dialogtitle == '详情' ? 'item-content' : 'item-content-edit',
            ]"
            prop="path"
          >
            <el-input
              v-if="dialogtitle != '详情'"
              v-model="formDetailsDialog.path"
              style="width: 100%"
              placeholder="请输入文件（相对）路径"
              class="filter-item"
              clearable
            />
            <div v-else>{{ formDetailsDialog.path }}</div>
          </el-form-item>

          <!--  是否是空间信息  -->
          <el-form-item
            label="仓库类型"
            :class="[
              dialogtitle == '详情' ? 'item-content' : 'item-content-edit',
            ]"
            prop="repoType"
          >
            <el-input
              v-if="dialogtitle != '详情'"
              v-model="formDetailsDialog.repoType"
              style="width: 100%"
              placeholder="请输入仓库类型"
              class="filter-item"
              clearable
            />
            <div v-else>{{ formDetailsDialog.repoType }}</div>
          </el-form-item>

          <!--  是否是空间信息  -->
          <el-form-item
            label="文件类型"
            :class="[
              dialogtitle == '详情' ? 'item-content' : 'item-content-edit',
            ]"
            prop="suffixType"
          >
            <el-input
              v-if="dialogtitle != '详情'"
              v-model="formDetailsDialog.suffixType"
              style="width: 100%"
              placeholder="请输入文件类型"
              class="filter-item"
              clearable
            />
            <div v-else>{{ formDetailsDialog.suffixType }}</div>
          </el-form-item>

          <!--  是否是空间信息  -->
          <el-form-item
            label="文件大小(byte)"
            :class="[
              dialogtitle == '详情' ? 'item-content' : 'item-content-edit',
            ]"
            prop="size"
          >
            <el-input
              v-if="dialogtitle != '详情'"
              v-model="formDetailsDialog.size"
              style="width: 100%"
              placeholder="请输入文件大小(byte)"
              class="filter-item"
              clearable
            />
            <div v-else>{{ formDetailsDialog.size }}</div>
          </el-form-item>

          <!--  是否是空间信息  -->
          <el-form-item
            label="文件重命名"
            :class="[
              dialogtitle == '详情' ? 'item-content' : 'item-content-edit',
            ]"
            prop="uniqueName"
          >
            <el-input
              v-if="dialogtitle != '详情'"
              v-model="formDetailsDialog.uniqueName"
              style="width: 100%"
              placeholder="请输入文件重命名"
              class="filter-item"
              clearable
            />
            <div v-else>{{ formDetailsDialog.uniqueName }}</div>
          </el-form-item>
        </el-form>
      </div>
      <!-- <div class="dialog-content-right">
        <MapBasisLayer v-if="dialogVisible" ref="MapBasisLayerDialog" />
      </div> -->
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
import { filesInformation } from "@/api/system";

const listItemDefault = {
  id: undefined,
  ogriginalName: undefined,
  path: undefined,
  repoType: undefined,
  suffixType: undefined,
  size: undefined,
  uniqueName: undefined,
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
      // 新增，编辑，详情数据存放
      formDetailsDialog: deepClone(listItemDefault),
      // 表单规则
      formRules: {},
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

    // 清空表单校验样式
    resetForm(formName) {
      this.$nextTick(() => {
        if (this.$refs[formName]) {
          this.$refs[formName].clearValidate();
        }
      });
    },

    // 获取明细
    getDetailsFunction(queryData, listdata) {
      return new Promise((resolve, reject) => {
        filesInformation("detail", "get", { id: queryData.id })
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
          // const temp = deepClone(this.$refs['area-filter-dialog'].codes);
          // if (isArray(temp) && temp.length > 0) {
          //   this.formDetailsDialog.areaCode = temp.pop();
          // } else {
          //   delete this.formDetailsDialog.areaCode;
          // }

          // this.formDetailsDialog.boundaryLine =
          //   this.$refs['MapBasisLayerDialog'].returnAddLayerWkt();
          // if (!this.formDetailsDialog.boundaryLine) {
          //   this.$message({
          //     type: 'error',
          //     message: '请在地图绘制对应位置'
          //   });
          //   return;
          // }

          if (this.dialogtitle == "新增") {
            filesInformation("create", "post", this.formDetailsDialog)
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
            filesInformation("update", "post", data)
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
    clearImgUrlFunction() {},

    // 图片赋值功能
    showImg() {},
  },
};
</script>

<style lang="less" scoped></style>
