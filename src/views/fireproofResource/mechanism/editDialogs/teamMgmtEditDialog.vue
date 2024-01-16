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
            label="队伍编号"
            :class="[
              dialogtitle == '详情' ? 'item-content' : 'item-content-edit',
            ]"
            prop="teamNum"
          >
            <el-input
              v-if="dialogtitle != '详情'"
              v-model="formDetailsDialog.teamNum"
              style="width: 100%"
              placeholder="请输入队伍编号"
              class="filter-item"
              clearable
            />
            <div v-else>{{ formDetailsDialog.teamNum }}</div>
          </el-form-item>
          <span />

          <!--  是否是空间信息  -->
          <span />

          <!--  是否是空间信息  -->
          <span />

          <!--  是否是空间信息  -->
          <span />

          <el-form-item
            label="中文地址"
            :class="[
              dialogtitle == '详情' ? 'item-content' : 'item-content-edit',
            ]"
            prop="address"
          >
            <el-input
              v-if="dialogtitle != '详情'"
              v-model="formDetailsDialog.address"
              style="width: 100%"
              placeholder="请输入中文地址"
              class="filter-item"
              clearable
            />
            <div v-else>{{ formDetailsDialog.address }}</div>
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
            label="队伍成立时间"
            :class="[
              dialogtitle == '详情' ? 'item-content' : 'item-content-edit',
            ]"
            prop="establishmentTime"
          >
            <el-date-picker
              v-if="dialogtitle != '详情'"
              v-model="formDetailsDialog.establishmentTime"
              type="datetime"
              style="width: 100%"
              placeholder="选择队伍成立时间"
              value-format="yyyy-MM-dd HH:mm:ss"
            />
            <div v-else>{{ formDetailsDialog.establishmentTime }}</div>
          </el-form-item>

          <el-form-item
            label="队伍人数"
            :class="[
              dialogtitle == '详情' ? 'item-content' : 'item-content-edit',
            ]"
            prop="numOfPeople"
          >
            <el-input-number
              v-if="dialogtitle != '详情'"
              v-model="formDetailsDialog.numOfPeople"
              style="width: 100%"
              placeholder="请输入队伍人数"
              :controls="false"
            />
            <div v-else>{{ formDetailsDialog.numOfPeople }}</div>
          </el-form-item>

          <el-form-item
            label="队伍类型"
            :class="[
              dialogtitle == '详情' ? 'item-content' : 'item-content-edit',
            ]"
            prop="type"
          >
            <dictionary-select
              v-if="dialogtitle != '详情'"
              v-model.trim="formDetailsDialog.type"
              type="fireproofing_team_type"
              :show-code="false"
              :placeholder="'请选择队伍类型'"
              class="filter-item"
              style="width: 100%"
            />
            <div v-else>
              <dictionary-text
                code="fireproofing_team_type"
                :value="formDetailsDialog.type"
              />
            </div>
          </el-form-item>

          <el-form-item
            label="平均年龄(岁"
            :class="[
              dialogtitle == '详情' ? 'item-content' : 'item-content-edit',
            ]"
            prop="avaAge"
          >
            <el-input
              v-if="dialogtitle != '详情'"
              v-model="formDetailsDialog.avaAge"
              style="width: 100%"
              placeholder="请输入平均年龄(岁"
              class="filter-item"
              clearable
            />
            <div v-else>{{ formDetailsDialog.avaAge }}</div>
          </el-form-item>
          <el-form-item
            label="营区用地面积(平方米)"
            :class="[
              dialogtitle == '详情' ? 'item-content' : 'item-content-edit',
            ]"
            prop="campArea"
          >
            <el-input
              v-if="dialogtitle != '详情'"
              v-model="formDetailsDialog.campArea"
              style="width: 100%"
              placeholder="请输入营区用地面积(平方米)"
              class="filter-item"
              clearable
            />
            <div v-else>{{ formDetailsDialog.campArea }}</div>
          </el-form-item>
          <el-form-item
            label="营房建筑面积(平方米)"
            :class="[
              dialogtitle == '详情' ? 'item-content' : 'item-content-edit',
            ]"
            prop="barrackArea"
          >
            <el-input
              v-if="dialogtitle != '详情'"
              v-model="formDetailsDialog.barrackArea"
              style="width: 100%"
              placeholder="请输入营房建筑面积(平方米)"
              class="filter-item"
              clearable
            />
            <div v-else>{{ formDetailsDialog.barrackArea }}</div>
          </el-form-item>
          <el-form-item
            label="训练场地面积(平方米)"
            :class="[
              dialogtitle == '详情' ? 'item-content' : 'item-content-edit',
            ]"
            prop="trainingArea"
          >
            <el-input
              v-if="dialogtitle != '详情'"
              v-model="formDetailsDialog.trainingArea"
              style="width: 100%"
              placeholder="请输入训练场地面积(平方米)"
              class="filter-item"
              clearable
            />
            <div v-else>{{ formDetailsDialog.trainingArea }}</div>
          </el-form-item>
          <el-form-item
            label="飞机飞行时数(年/小时)"
            :class="[
              dialogtitle == '详情' ? 'item-content' : 'item-content-edit',
            ]"
            prop="flightHours"
          >
            <el-input
              v-if="dialogtitle != '详情'"
              v-model="formDetailsDialog.flightHours"
              style="width: 100%"
              placeholder="请输入飞机飞行时数(年/小时)"
              class="filter-item"
              clearable
            />
            <div v-else>{{ formDetailsDialog.flightHours }}</div>
          </el-form-item>
          <el-form-item
            label="无人机飞行时数(年/小时)"
            :class="[
              dialogtitle == '详情' ? 'item-content' : 'item-content-edit',
            ]"
            prop="droneFlightHours"
          >
            <el-input
              v-if="dialogtitle != '详情'"
              v-model="formDetailsDialog.droneFlightHours"
              style="width: 100%"
              placeholder="请输入无人机飞行时数(年/小时)"
              class="filter-item"
              clearable
            />
            <div v-else>{{ formDetailsDialog.droneFlightHours }}</div>
          </el-form-item>
          <el-form-item
            label="近五年火灾火情处置次数"
            :class="[
              dialogtitle == '详情' ? 'item-content' : 'item-content-edit',
            ]"
            prop="hqczcs"
          >
            <el-input
              v-if="dialogtitle != '详情'"
              v-model="formDetailsDialog.hqczcs"
              style="width: 100%"
              placeholder="请输入近五年火灾火情处置次数"
              class="filter-item"
              clearable
            />
            <div v-else>{{ formDetailsDialog.hqczcs }}</div>
          </el-form-item>
          <el-form-item
            label="近五年火灾火情出动人次"
            :class="[
              dialogtitle == '详情' ? 'item-content' : 'item-content-edit',
            ]"
            prop="hqcdrc"
          >
            <el-input
              v-if="dialogtitle != '详情'"
              v-model="formDetailsDialog.hqcdrc"
              style="width: 100%"
              placeholder="请输入近五年火灾火情出动人次"
              class="filter-item"
              clearable
            />
            <div v-else>{{ formDetailsDialog.hqcdrc }}</div>
          </el-form-item>
          <el-form-item
            label="近五年火灾火情出动车辆"
            :class="[
              dialogtitle == '详情' ? 'item-content' : 'item-content-edit',
            ]"
            prop="hqcdqc"
          >
            <el-input
              v-if="dialogtitle != '详情'"
              v-model="formDetailsDialog.hqcdqc"
              style="width: 100%"
              placeholder="请输入近五年火灾火情出动车辆"
              class="filter-item"
              clearable
            />
            <div v-else>{{ formDetailsDialog.hqcdqc }}</div>
          </el-form-item>
          <el-form-item
            label="近五年平均出警响应时间/分"
            :class="[
              dialogtitle == '详情' ? 'item-content' : 'item-content-edit',
            ]"
            prop="avgCjxysj"
          >
            <el-input
              v-if="dialogtitle != '详情'"
              v-model="formDetailsDialog.avgCjxysj"
              style="width: 100%"
              placeholder="请输入近五年平均出警响应时间/分"
              class="filter-item"
              clearable
            />
            <div v-else>{{ formDetailsDialog.avgCjxysj }}</div>
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
    <span v-if="dialogtitle != '详情'" slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleSubmitClick">确定</el-button>
    </span>
    <span v-else slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleSuppliesClick">物资</el-button>
      <el-button type="primary" @click="handleManagerClick">管理人员</el-button>
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
      // 新增，编辑，详情数据存放
      formDetailsDialog: deepClone(listItemDefault),
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
    handleSuppliesClick() {
      this.$emit("handleSuppliesClick", this.dialogSelectData);
    },
    handleManagerClick() {
      this.$emit("handleManagerClick", this.dialogSelectData);
    },
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
            teamMgmtApi("create", "post", this.formDetailsDialog)
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
            teamMgmtApi("update", "post", data)
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
