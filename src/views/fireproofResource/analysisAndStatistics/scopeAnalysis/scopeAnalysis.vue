<template>
  <div v-loading="requestLoading" class="app-list-page">
    <!-- 这是顶部的筛选条件 -->
    <div class="screen-box">
      <!-- 这是筛选条件 -->
      <!-- 这里的筛选条件最多4个，多余的就不展示了，放到更多里面了 -->
      <div class="screen-box-input">
        <!-- <div class="screen-box-item">
          <div class="item-text">行政区划</div>
          <area-select
            ref="area-filter"
            :value="query.areaCode"
            style="flex: 1"
            placeholder="请选择行政区划"
            :class-name="'filter-item'"
            :clearable="true"
            @change="changeQueryArea"
          />
        </div> -->

        <div class="screen-box-item">
          <div class="item-text">分析状态</div>
          <el-select
            v-model="query.status"
            class="filter-item"
            clearable
            placeholder="请选择分析状态"
          >
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
      </div>

      <!-- 这是搜索按钮 -->
      <div class="screen-box-button">
        <el-button
          v-permission="['analysis:partial:query']"
          type="primary"
          class="btn"
          style="margin-left: 0px"
          @click="handleSearchClick"
          >搜索 <i class="el-icon-selectnew" />
        </el-button>
        <div class="text2" @click="handleResetClick">重置</div>
      </div>
    </div>

    <!-- 这是新增删除等功能操作框 -->
    <div class="operation-box">
      <div class="operation-box-left">
        <el-button
          v-permission="['analysis:partial:create']"
          class="btn1"
          type="primary"
          icon="el-icon-addnew"
          plain
          @click="handleAdd"
          >新增</el-button
        >
        <el-button
          v-permission="['analysis:partial:delete']"
          class="btn2"
          type="danger"
          icon="el-icon-deletenew"
          plain
          @click="handleBatchDeleteClick"
          >删除</el-button
        >
        <!-- <el-button
          v-permission="['analysis:partial:import']"
          class="btn3"
          icon="el-icon-importnew"
          plain
        >导入</el-button>
        <el-button
          v-permission="['analysis:partial:export']"
          class="btn4"
          icon="el-icon-exportnew"
          plain
        >导出</el-button>
        <el-button
          v-permission="['analysis:partial:map-plus']"
          class="btn5"
          icon="el-icon-earth"
          plain
        >一张图</el-button> -->
      </div>

      <div class="operation-box-right">
        <el-popover
          placement="bottom"
          trigger="click"
          width="200"
          @show="isScreen = true"
          @hide="isScreen = false"
        >
          <div class="screen-list-box">
            <div class="list-box-title">
              <div>
                <el-checkbox
                  v-model="checkAll"
                  :indeterminate="isIndeterminate"
                  @change="handleCheckAllChange"
                  >列属性</el-checkbox
                >
              </div>
              <div class="icon" @click="handleResetCheckClick">
                <i class="el-icon-resetnew" />
              </div>
            </div>
            <el-checkbox-group
              v-model="checkedTh"
              class="list-box-check-box"
              @change="handlecheckedThChange"
            >
              <el-checkbox
                v-for="(item, index) in tableListTitle"
                :key="index"
                class="list-box-check-item"
                :label="item.parameter"
                >{{ item.name }}</el-checkbox
              >
            </el-checkbox-group>
          </div>
          <div slot="reference" style="display: flex; align-items: center">
            <div class="text" :class="[isScreen ? 'selectColor' : '']">
              筛选
            </div>
            <div class="icon">
              <i class="el-icon-screen" />
            </div>
          </div>
        </el-popover>
      </div>
    </div>

    <!-- 这个是装列表框和属性框 -->
    <div class="list-map-box" :class="[isMoveBox ? 'not-select' : '']">
      <!-- 这是列表框 -->
      <div
        id="listBox"
        class="list-box"
        :style="{ width: isScreenCutting ? listBoxWidth + 'px' : '100%' }"
      >
        <!-- 这是表格部分 -->
        <el-table
          ref="listTable"
          class="list-table"
          :data="tableData"
          style="width: 100%"
          border
          height="calc(100% - 76px)"
          :header-cell-style="headerCellStyle"
          :cell-style="cellStyle"
          @sort-change="tablesortChange"
          @selection-change="tableSelectionChange"
        >
          <el-table-column
            prop="selection"
            type="selection"
            width="40"
            align="center"
          />
          <el-table-column prop="serialnumber" label="序号" width="75">
            <template slot-scope="scope">
              {{ scope.$index + 1 }}
            </template>
          </el-table-column>
          <el-table-column
            v-if="checkedTh.includes('id')"
            prop="id"
            label="主键"
            min-width="120"
            show-overflow-tooltip
          />

          <el-table-column
            v-if="checkedTh.includes('areaCode')"
            prop="areaCode"
            label="行政区划"
            min-width="120"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" placement="top">
                <div slot="content">
                  {{
                    scope.row.sysAreaVO ? scope.row.sysAreaVO.areaFullName : ""
                  }}
                </div>
                <div>
                  {{
                    handleFullName(
                      scope.row.sysAreaVO
                        ? scope.row.sysAreaVO.areaFullName
                        : ""
                    )
                  }}
                </div>
              </el-tooltip>
            </template>
          </el-table-column>

          <el-table-column
            v-if="checkedTh.includes('cnCodeName')"
            prop="cnCodeName"
            label="分析对象"
            min-width="120"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <!-- <div
                v-if="scope.row.status == 1"
                class="c-click"
                @click="handleDetailsClick(scope.row)"
              >
                {{ scope.row.cnCodeName }}
              </div>
              <div v-else>
                {{ scope.row.cnCodeName }}
              </div> -->
              <div>
                {{ scope.row.cnCodeName }}
              </div>
            </template>
          </el-table-column>

          <el-table-column
            v-if="checkedTh.includes('describe')"
            prop="describe"
            label="分析名称"
            min-width="120"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <div
                v-if="scope.row.status == 1"
                class="c-click"
                @click="handleDetailsClick(scope.row)"
              >
                {{ scope.row.describe }}
              </div>
              <div v-else>
                {{ scope.row.describe }}
              </div>
            </template>
          </el-table-column>

          <el-table-column
            v-if="checkedTh.includes('analyseTime')"
            prop="analyseTime"
            label="分析时间"
            min-width="120"
            show-overflow-tooltip
          />

          <el-table-column
            v-if="checkedTh.includes('duration')"
            prop="duration"
            label="消耗时间（秒）"
            min-width="120"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <div>
                {{ scope.row.duration / 1000 }}
              </div>
            </template>
          </el-table-column>

          <!--  这个是创建是有有升序降序操作的列  -->

          <!-- <el-table-column
            v-if="checkedTh.includes('status')"
            label="分析状态"
            min-width="120"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <el-popover
                v-if="scope.row.status == 2"
                placement="top-start"
                trigger="hover"
              >
                <div class="popover-content">{{ scope.row.failMsg }}</div>
                <el-tag
                  slot="reference"
                  :type="scope.row.status == 1 ? 'success' : 'info'"
                  effect="plain"
                >
                  {{ scope.row.status | statusFilter(statusOptions) }}
                </el-tag>
              </el-popover>

              <el-tag
                v-else
                :type="scope.row.status == 1 ? 'success' : 'info'"
                effect="plain"
              >
                {{ scope.row.status | statusFilter(statusOptions) }}
              </el-tag>
            </template>
          </el-table-column> -->

          <el-table-column
            v-if="checkedTh.includes('status')"
            prop="status"
            label="分析状态"
            min-width="120"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              {{ scope.row.status | statusFilter(statusOptions) }}
            </template>
          </el-table-column>

          <el-table-column
            prop=""
            label="操作"
            width="108"
            align="center"
            :resizable="false"
          >
            <template slot-scope="scope">
              <!-- <i
                class="el-icon-searchnew list-table-icon"
                @click="handleUpdateClick(scope.row)"
              /> -->
              <i
                class="el-icon-delete list-table-icon"
                @click="handleDeleteClick(scope.row)"
              />
            </template>
          </el-table-column>
        </el-table>

        <!-- 这是分页部分 -->
        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="query.pageNo"
          :limit.sync="query.pageSize"
          :page-sizes.sync="pageSizes"
          :is-small="isScreenCutting"
          @pagination="getList"
        />

        <div
          id="listBoxDraw"
          class="list-draw"
          :style="{ width: isScreenCutting ? '45px' : '0px' }"
        />
      </div>

      <!-- 这是属性框 -->
    </div>

    <!-- 弹窗-新增、修改 -->
    <el-dialog
      v-if="itemVisible"
      :title="itemStateMap[itemState]"
      :visible.sync="itemVisible"
      :show-close="!dialogLoading"
      width="40%"
    >
      <el-form
        ref="itemForm"
        v-loading.fullscreen="dialogLoading"
        :model="itemForm"
        :rules="itemRules"
        label-width="100px"
      >
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="分析名称" prop="title">
              <el-input
                v-model="itemForm.title"
                placeholder="请输入分析名称"
                clearable
              ></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="行政区划" prop="areaCode">
              <area-select
                ref="area-filter-add"
                :value="itemForm.areaCode"
                placeholder="请选择行政区划"
                style="width: 100%"
                :clearable="true"
                :is-width-zero="false"
                @change="changeAddArea"
              />
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="分析对象" prop="tableNames">
              <el-cascader
                ref="elCascader"
                v-model="itemForm.tableNames"
                style="width: 100%"
                :options="optionsTree"
                :props="props"
                collapse-tags
                clearable
                @change="handleChange"
              />
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="分析范围" prop="wktValue">
              <el-input
                v-model="itemForm.wktValue"
                :disabled="true"
                placeholder="请输入分析范围"
                clearable
              >
                <el-button
                  slot="append"
                  icon="el-icon-edit"
                  @click="mapWktClick"
                />
              </el-input>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="分析描述" prop="describe">
              <el-input
                v-model="itemForm.describe"
                type="textarea"
                :autosize="{ minRows: 5, maxRows: 10 }"
                placeholder="请输入分析描述"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button :disabled="dialogLoading" @click="submitClose()">
          {{ $t("forest.cancel") }}
        </el-button>
        <el-button
          type="primary"
          :disabled="dialogLoading"
          @click="itemState === 'create' ? submitCreate() : submitUpdate()"
        >
          {{ $t("forest.confirm") }}
        </el-button>
      </div>
    </el-dialog>
    <MapFreckleAdd
      v-if="dialogVisibleWKT"
      :dialog-visible.sync="dialogVisibleWKT"
      :wkt-data="wktData"
      :is-show-type="isShowType"
      @returnWKT="mapAddReturnWKT"
    />
    <!-- :islimit-num="15000000" -->
    <scopeAnalysisDetails
      v-if="dialogVisible"
      :dialog-visible.sync="dialogVisible"
      :basic-data="basicData"
      :analysis-data="analysisData"
      :forest-code-options="forestCodeOptions"
    />
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
import { commonDownload } from "@/api/system";
import { deepClone, permissionPath, downloadFile } from "@/utils";
import { isArray } from "@/utils/validate";
import { mapGetters } from "vuex";
import MapFreckleAdd from "@/components/MapFreckleAdd";

import { layersDescribeApi } from "@/api/system";
import {
  partialPage,
  treeYztSlfhSimple,
  partialCreate,
  partailDetail,
  partialDelete,
} from "@/api/scopeAnalysis/scopeAnalysis";
import DrawMapLayer from "@/components/DrawMapLayer";
import scopeAnalysisDetails from "./scopeAnalysisDetails.vue";

const queryDefault = {
  pageNo: 1,
  pageSize: 20,
  areaCode: "",
  status: undefined,
};

export default {
  // 这里吧组件引入进来
  components: {
    AreaSelect,
    Pagination,
    MapBasisLayer,
    DictionarySelect,
    DictionaryText,
    MapFreckleAdd,
    Tinymce,
    scopeAnalysisDetails,
    MoreQuery,
  },
  filters: {
    statusFilter: (key, arr) => {
      const obj = arr.find((item) => key == item.value);
      return obj != undefined ? obj.label : "-";
    },
  },
  mixins: [DrawMapLayer],
  data() {
    return {
      // 查询相关
      statusOptions: [
        { label: "分析中", value: 0 },
        { label: "分析完成", value: 1 },
        { label: "分析失败", value: 2 },
      ],
      // 弹窗相关
      dialogVisibleWKT: false,
      wktData: "",
      isShowType: [],
      itemStateMap: {
        update: "编辑数据分析",
        create: "新增数据分析",
      },
      // 新增、修改表单相关
      itemForm: {
        tableNames: "",
        title: "",
        describe: "",
        areaCode: "",
        wktValue: undefined,
      },
      spotOption: [
        { long: "", lat: "" },
        { long: "", lat: "" },
        { long: "", lat: "" },
      ],
      itemVisible: false, // 经营单位列表
      itemState: "",
      dialogLoading: false, // 弹窗加载状态
      itemRules: {
        tableNames: [
          { required: true, message: "分析对象不能为空", trigger: "change" },
        ],
        wktValue: [
          { required: true, message: "分析范围不能为空", trigger: "blur" },
        ],
        title: [
          { required: true, message: "分析名称不能为空", trigger: "blur" },
        ],
      },

      // 新增弹框
      forestCodeOptions: [],
      itemLayerVisible: false,
      itemLayerLoading: true,
      itemLayerKey: undefined,
      itemLayerForm: {},
      itemLayerRules: {},

      itemUnitName: "",
      itemUnitVisible: false,
      itemUnitLoading: true,
      drawData: "", // 分割线
      optionsTree: [], // 类别树
      props: {
        multiple: true,
        value: "cqlFilter",
        label: "cnName",
        children: "childList",
      },
      // 详情页弹窗
      dialogVisible: false,
      basicData: {}, // 基础数据
      analysisData: [], // 分析数据
      tips: null,

      // 列表请求的数据
      query: deepClone(queryDefault),
      pageSizes: [queryDefault.pageSize, 50, 100, 200],
      areaCodeLevel: 0, // 用于记录areacode等级
      sort: {}, // 这个是表格筛选的值，key是参数，值就是升序或者降序
      listBoxWidth: 0, // 切屏后列表框的宽度大小，最小宽度设置630了在样式里了
      isScreenCutting: false, // 是否开启了切屏
      isScreen: false, // 是否点开了筛选
      isMoveBox: false, // 是否在拖拽
      listBoxStyleWidth: null, // 存放拖拽边框的长度，用于判断相同就不在出发鼠标抬起事件
      total: 0, // 列表总条数
      tableData: [], // 存放列表数据
      multipleSelection: [], // 这个是存放表格多选勾选的数据
      currentSelection: {}, // 这个是表格单行选中的数据
      currentSelectionIndex: 0, // 这个是用于记录选中行的index，用于上一条下一跳的功能
      detailsType: "详情", // 这个类型只会有详情和编辑
      dialogtitle: "新增", // 弹窗名称
      dialogSelectData: {}, // 编辑，详情点击时的那一条数据
      checkAll: false,
      checkedTh: ["analyseTime", "describe", "duration", "status", "areaCode"],
      isIndeterminate: true,
      // 表格表头列表
      tableListTitle: [
        { name: "分析时间", parameter: "analyseTime" },
        { name: "行政区划", parameter: "areaCode" },
        { name: "分析对象", parameter: "cnCodeName" },
        { name: "消耗时间（毫秒）", parameter: "duration" },
        { name: "分析状态", parameter: "status" },
        { name: "分析名称", parameter: "describe" },
      ],
      timer: null,
    };
  },

  // components: {},

  // watch: {},

  computed: {
    ...mapGetters(["requestLoading"]),
    queryData() {
      const data = {};
      // if (this.query.areaCode == '') {
      //   this.query.areaCode = this.$store.getters.areaCode;
      // }
      for (const i in this.query) {
        if (this.query[i]) {
          data[i] = this.query[i];
        }
      }
      if (Object.keys(this.sort).length > 0) {
        data.sort = this.sort;
      }
      if (this.query.areaCode) {
        this.areaCodeLevel = Math.floor(this.query.areaCode.length / 2);
      }
      return data;
    },
  },

  created() {
    this.listBoxWidth = localStorage.getItem("listBoxStyleWidth") || 800;
    this.mapQuery.mapName = "itemMapLayer";
  },

  mounted() {
    this.getList();
    // 设置定时器获取数据，每1分钟，后面需改成webSocket方式
    this.timer = setInterval(() => {
      this.getList();
    }, 60000);
    // 通过 $once 来监听定时器，在 beforeDestroy 钩子可以被清除。
    this.$once("hook:beforeDestroy", () => {
      clearInterval(this.timer);
      this.timer = null;
    });
  },

  beforeDestroy() {
    clearInterval(this.timer);
    const listBoxDraw = document.getElementById("listBoxDraw");
    listBoxDraw.removeEventListener("mousedown", this.downFunction);
    window.removeEventListener("mouseup", this.mouseupFunction);
  },

  methods: {
    // 获取分析对象树
    getTreeFunction() {
      return new Promise((resolve, reject) => {
        treeYztSlfhSimple()
          .then((res) => {
            this.optionsTree = res.data;
            resolve(true);
          })
          .catch(() => {
            reject(false);
          });
      });

      // treeYztSlfhSimple().then((res) => {
      //   console.log(`output->res`, res);
      //   this.optionsTree = res.data;
      //   console.log(`output->this.optionsTree`, this.optionsTree);
      // });
    },
    // 新增
    async handleAdd() {
      this.resetItem();
      this.itemState = "create";
      await this.getTreeFunction();
      this.itemVisible = true;
      // this.dialogLoading = true;
      this.itemLayerVisible = false;
      this.itemUnitVisible = false;
      this.splitList = [];
      this.$nextTick(async () => {
        this.$refs["itemForm"].clearValidate();
        if (this.drawData != "") {
          this.$refs["itemMapLayer"].removeLayerByName(
            this.itemMapId + "_layer"
          );

          if (JSON.stringify(this.extent) !== "{}") {
            this.$refs["itemMapLayer"].view.setZoom(7);
            this.$refs["itemMapLayer"].fitByExtent(this.extent, false);
          }
        }
      });
    },

    mapAddReturnWKT(data) {
      // this.itemForm.wktValue = data;
      this.$set(this.itemForm, "wktValue", data);
      this.wktData = data;
      this.$refs["itemForm"].validate();
    },

    mapWktClick() {
      this.dialogVisibleWKT = true;
      this.isShowType = [1, 2, 3, 4, 5];
      this.wktData = this.itemForm.wktValue || "";
    },

    handleChange(data) {
      // console.log(`output->data`, data);
    },

    //新增中区划选择配套的事件
    changeQueryArea(v) {
      const temp = deepClone(v);
      if (isArray(temp) && temp.length > 0) {
        this.query.areaCode = temp.pop();
      } else {
        this.query.areaCode = "";
      }
    },

    //新增中区划选择配套的事件
    changeAddArea(v) {
      const temp = deepClone(v);
      if (isArray(temp) && temp.length > 0) {
        this.itemForm.areaCode = temp.pop();
      } else {
        this.itemForm.areaCode = "";
      }
    },

    // 新增确定按钮
    submitCreate() {
      this.$refs["itemForm"].validate((valid) => {
        if (valid) {
          this.dialogLoading = true;

          let Arr = this.$refs.elCascader.getCheckedNodes(true);
          let tableNamesArr = Arr.map((item) => {
            return item.value;
          });

          tableNamesArr = tableNamesArr.filter((s) => {
            return s != "null" && s && s.trim(); // 注：IE9(不包含IE9)以下的版本没有trim()方法
          });

          // 这里是对行政区划选择的数据处理，因为选择的后返回的是数组，所以要取最后一个
          const temp = deepClone(this.$refs["area-filter-add"].codes);
          if (isArray(temp) && temp.length > 0) {
            this.itemForm.areaCode = temp.pop();
          } else {
            delete this.itemForm.areaCode;
          }

          const data = {
            boundaryLine: this.itemForm.wktValue,
            title: this.itemForm.title,
            tableNames: tableNamesArr.join(","),
            describe: this.itemForm.describe,
            areaCode: this.itemForm.areaCode,
          };
          partialCreate(data).then((res) => {
            if (res.code === 200) {
              this.$message({
                message: "新增成功，开始分析",
                type: "success", // success,warning,error
                duration: 4000,
              });
              this.dialogLoading = false;
              this.submitClose();
              this.getList();
            } else {
              this.dialogLoading = false;
            }
          });
        }
      });
    },

    // 关闭弹窗
    submitClose() {
      this.resetItem();
      this.itemVisible = false;
      if (this.drawingTip !== undefined) {
        this.drawingTip.close();
      }
    },

    // 重置详情
    resetItem() {
      this.itemForm = {
        tableNames: "",
        title: "",
        describe: "",
        areaCode: "",
        wktValue: undefined,
      };
      this.spotOption = [
        { long: "", lat: "" },
        { long: "", lat: "" },
        { long: "", lat: "" },
      ];
    },

    // 列表数据查询
    getList() {
      partialPage(this.queryData)
        .then((res) => {
          this.tableData = res.data.list;
          this.total = res.data.total;
        })
        .catch((err) => {});
    },

    // 搜索按钮
    handleSearchClick() {
      this.query.pageNo = 1;
      this.getList();
    },

    // 重置按钮
    handleResetClick() {
      this.query = deepClone(queryDefault);
      // 获取用户区划代码
      this.query.areaCode = this.$store.getters.areaCode;
      this.getList();
    },

    // 筛选按钮全选的改变事件
    handleCheckAllChange(val) {
      let parameters = [];
      parameters = this.tableListTitle.map((item) => {
        return item.parameter;
      });
      this.checkedTh = val ? parameters : [];
      this.isIndeterminate = false;
    },

    // 筛选按钮普通列勾选改变事件
    handlecheckedThChange(value) {
      const checkedCount = value.length;
      this.checkAll = checkedCount === this.tableListTitle.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.tableListTitle.length;
    },

    // 筛选按钮清空按钮
    handleResetCheckClick() {
      this.checkedTh = [];
      this.isIndeterminate = false;
      this.checkAll = false;
    },

    // 列表表格，表头的排序点击事件
    tablesortChange(column) {
      this.sort = {};
      if (!column.order) {
        this.getList();
      } else {
        this.sort[column.prop] = column.order === "ascending" ? "asc" : "desc";
        this.query.pageNo = 1;
        this.getList();
      }
    },

    // 列表表格，勾选点击事件
    tableSelectionChange(selection) {
      this.multipleSelection = selection;
    },

    // 编辑按钮
    async handleUpdateClick(data) {
      this.dialogtitle = "编辑";
      this.dialogVisible = true;
      this.dialogSelectData = data;
    },

    // 数据分类处理
    groupBy(array, f) {
      const groups = {};
      array.forEach(function (o) {
        var group = JSON.stringify(f(o));
        groups[group] = groups[group] || [];
        o.tabsActiveName = "";
        groups[group].push(o);
      });
      return Object.keys(groups).map(function (group) {
        return groups[group];
      });
    },

    // 数据分类处理
    arrayGroupBy(list, groupId) {
      const sorted = this.groupBy(list, function (item) {
        return [item[groupId]];
      });
      return sorted;
    },

    // 查看详情按钮
    async handleDetailsClick(data) {
      partailDetail({ id: data.id }).then((res) => {
        let data = res.data;
        this.basicData = {
          title: data.title,
          analyseTime: data.analyseTime,
          cnCodeName: data.cnCodeName.substring(1, data.cnCodeName.length - 1),
          duration: data.duration,
          describe: data.describe,
          boundaryLine: data.boundaryLine,
          id: data.id,
        };
        this.analysisData = this.arrayGroupBy(
          // res.data.details.concat(data),
          res.data.detailList,
          "tableName"
        );
        // this.analysisData = res.data;
        this.dialogVisible = true;
      });
    },

    // 列表单条删除事件
    handleDeleteClick(data) {
      this.getDeleteFunction(data.id);
    },

    // 批量删除按钮事件
    handleBatchDeleteClick() {
      if (this.multipleSelection.length < 1) {
        this.$message({
          type: "warning",
          message: "请选择需要删除的内容",
        });
        return;
      }
      this.getDeleteFunction(null);
    },

    // 删除事件
    getDeleteFunction(data) {
      const ids = data
        ? [data]
        : this.multipleSelection.map((item) => {
            return item.id;
          });
      this.$confirm("确定删除？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          partialDelete(ids).then((res) => {
            this.$message({
              type: "success",
              message: "删除成功",
            });
            this.getList();
          });
        })
        .catch(() => {
          // this.$message({
          //   type: 'info',
          //   message: '已取消操作'
          // });
        });
    },

    // 处理行政区划展示
    handleFullName(name) {
      if (name) {
        const arr = name.split("\\");
        if (arr.length > 0) {
          return arr[this.areaCodeLevel - 1]
            ? arr[this.areaCodeLevel - 1]
            : arr[arr.length - 1];
        } else {
          return "";
        }
      } else {
        return "";
      }
    },

    // 表头合并
    headerCellStyle({ row, column, rowIndex, columnIndex }) {
      let base = { "background-color": "#f5f5f5" };
      // 这里为了是将第一列的表头隐藏，就形成了合并表头的效果
      if (rowIndex === 0) {
        // 判断对第几列合并  property就是prop传入的属性
        if (row[columnIndex].property === "selection") {
          // 第一列width扩展2倍
          return { ...base, width: "180%", display: "inline-block" };
        } else if (row[columnIndex].property === "serialnumber") {
          // 其余列设置font-size 0 隐藏
          return { ...base, margin: 0 };
        }
      }

      return base;
    },

    // 合并序号和勾选列
    cellStyle({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        return {
          width: "180%",
          display: "inline-block",
          borderRightWidth: "0px !important",
        };
      }
      if (columnIndex === 1) {
        return {
          padding: "12px 0px 10px 0px !important",
        };
      }
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/styles/templateScoped.scss";
</style>
