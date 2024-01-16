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
            <span />

            <!--  是否是空间信息  -->
            <span />

            <!--  是否是空间信息  -->
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
            <!-- <el-form-item
              label="物资储备库关联id"
              :class="[
                dialogtitle == '详情' ? 'item-content' : 'item-content-edit',
              ]"
              prop="reserveId"
            >
              <el-input
                v-if="dialogtitle != '详情'"
                v-model="formDetailsDialog.reserveId"
                style="width: 100%"
                placeholder="请输入物资储备库关联id"
                class="filter-item"
                clearable
              />
              <div v-else>{{ formDetailsDialog.reserveId }}</div>
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
              label="联系电话"
              :class="[
                dialogtitle == '详情' ? 'item-content' : 'item-content-edit',
              ]"
              prop="tel"
            >
              <el-input
                v-if="dialogtitle != '详情'"
                v-model="formDetailsDialog.tel"
                style="width: 100%"
                placeholder="请输入联系电话"
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
              label="工作内容"
              :class="[
                dialogtitle == '详情' ? 'item-content' : 'item-content-edit',
              ]"
              prop="content"
            >
              <el-input
                v-if="dialogtitle != '详情'"
                v-model="formDetailsDialog.content"
                style="width: 100%"
                placeholder="请输入工作内容"
                class="filter-item"
                clearable
              />
              <div v-else>{{ formDetailsDialog.content }}</div>
            </el-form-item>
            <el-form-item
              label="描述说明"
              :class="[
                dialogtitle == '详情' ? 'item-content' : 'item-content-edit',
              ]"
              prop="describe"
            >
              <el-input
                v-if="dialogtitle != '详情'"
                v-model="formDetailsDialog.describe"
                type="textarea"
                placeholder="请输入描述说明"
              />
              <div v-else>{{ formDetailsDialog.describe }}</div>
            </el-form-item>
          </el-form>
        </div>
        <!-- <div class="dialog-content-right">
          <MapBasisLayer v-if="dialogVisible" ref="MapBasisLayerDialog" />
        </div> -->
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
import { reserveManagerApi } from "@/api/fireprot/reserveManager";

const listItemDefault = {
  id: undefined,
  createdTime: undefined,
  lastModifyTime: undefined,
  areaCode: "",
  sysAreaVO: {},
  reserveId: undefined,
  name: undefined,
  tel: undefined,
  position: undefined,
  content: undefined,
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
      // 新增，编辑，详情数据存放
      formDetailsDialog: deepClone(listItemDefault),
      // 表单规则
      formRules: {
        areaCode: [
          { required: true, message: "请选择行政区划", trigger: "change" },
        ],
        reserveId: [
          {
            required: true,
            message: "请输入物资储备库关联id",
            trigger: "blur",
          },
        ],
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        tel: [{ required: true, message: "请输入联系电话", trigger: "blur" }],
        position: [{ required: true, message: "请输入职位", trigger: "blur" }],
        content: [
          { required: true, message: "请输入工作内容", trigger: "blur" },
        ],
        describe: [
          { required: true, message: "请输入描述说明", trigger: "blur" },
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
        reserveManagerApi("detail", "get", { id: queryData.id })
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
          this.formDetailsDialog.reserveId = this.dialogSelectData.reserveId;

          if (this.dialogtitle == "新增") {
            reserveManagerApi("create", "post", this.formDetailsDialog)
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
            reserveManagerApi("update", "post", data)
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
