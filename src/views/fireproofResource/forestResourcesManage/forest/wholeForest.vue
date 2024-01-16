<template>
  <div class="app-list-page" v-loading="requestLoading">
    <!-- 这是顶部的筛选条件 -->
    <div class="screen-box">
      <!-- 这是筛选条件 -->
      <!-- 这里的筛选条件最多4个，多余的就不展示了，放到更多里面了 -->
      <div class="screen-box-input">
        <div class="screen-box-item">
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
        </div>

        <div class="screen-box-item">
          <div class="item-text">图斑编号</div>
          <el-input
            v-model.trim="query.tbbh"
            style="flex: 1"
            placeholder="请输入图斑编号"
            class="filter-item"
            clearable
          />
        </div>

        <div class="screen-box-item">
          <div class="item-text">数据年份</div>
          <el-input
            v-model.trim="query.sjnf"
            style="flex: 1"
            placeholder="请输入数据年份"
            class="filter-item"
            clearable
          />
        </div>
      </div>

      <!-- 这是搜索按钮 -->
      <div class="screen-box-button">
        <el-popover placement="bottom" width="480" trigger="click">
          <div><MoreQuery /></div>
          <div slot="reference" style="display: flex; align-items: center">
            <div v-permission="['forestry:wholeForest:more']" class="text1">
              更多
              <i class="el-icon-morenew1" />
            </div>
          </div>
        </el-popover>

        <el-button
          type="primary"
          class="btn"
          v-permission="['forestry:wholeForest:query']"
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
          v-permission="['forestry:wholeForest:create']"
          class="btn1"
          type="primary"
          icon="el-icon-addnew"
          plain
          @click="handleAddClick"
          >新增</el-button
        >
        <el-button
          v-permission="['forestry:wholeForest:delete']"
          class="btn2"
          type="danger"
          icon="el-icon-deletenew"
          plain
          @click="handleBatchDeleteClick"
          >删除</el-button
        >
        <el-button
          v-permission="['forestry:wholeForest:import']"
          class="btn3"
          icon="el-icon-importnew"
          plain
          >导入</el-button
        >
        <el-button
          v-permission="['forestry:wholeForest:export']"
          class="btn4"
          icon="el-icon-exportnew"
          plain
          @click="downExcelClick"
          >导出</el-button
        >
        <el-button
          v-permission="['forestry:wholeForest:map-plus']"
          class="btn5"
          icon="el-icon-earth"
          plain
          >一张图</el-button
        >
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
          <div
            slot="reference"
            v-permission="['forestry:wholeForest:column-filter']"
            style="display: flex; align-items: center"
          >
            <div class="text" :class="[isScreen ? 'selectColor' : '']">
              筛选
            </div>
            <div class="icon">
              <i class="el-icon-screen" />
            </div>
          </div>
        </el-popover>

        <div
          v-permission="['forestry:wholeForest:layout']"
          style="display: flex; align-items: center"
          @click="ScreenCuttingChange()"
        >
          <div
            v-if="tableData.length > 0"
            class="text"
            :class="[isScreenCutting ? 'selectColor' : '']"
          >
            切屏
          </div>
          <div v-else class="text-no">切屏</div>
          <div
            class="icon"
            :style="{
              cursor: tableData.length > 0 ? 'pointer' : ' not-allowed',
            }"
          >
            <i class="el-icon-screen-cutting" />
          </div>
        </div>
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
          highlight-current-row
          :header-cell-style="headerCellStyle"
          :cell-style="cellStyle"
          @sort-change="tablesortChange"
          @selection-change="tableSelectionChange"
          @current-change="tableCurrentChange"
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
                <div slot="content">{{ scope.row.sysAreaVO.areaFullName }}</div>
                <div>
                  {{ handleFullName(scope.row.sysAreaVO.areaFullName) }}
                </div>
              </el-tooltip>
            </template>
          </el-table-column>
          <!--  这个是表格那一列能够点击展示详情弹框的  -->

          <el-table-column
            v-if="checkedTh.includes('tbbh')"
            prop="tbbh"
            label="图斑编号"
            min-width="120"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <div class="c-click" @click="handleDetailsClick(scope.row)">
                {{ scope.row.tbbh }}
              </div>
            </template>
          </el-table-column>
          <!--  这个是创建是有有升序降序操作的列  -->

          <el-table-column
            v-if="checkedTh.includes('caoBan')"
            prop="caoBan"
            label="草班"
            min-width="120"
            sortable="custom"
            show-overflow-tooltip
          />

          <el-table-column
            v-if="checkedTh.includes('cdL')"
            prop="cdL"
            label="草原类"
            min-width="120"
            show-overflow-tooltip
          />

          <el-table-column
            v-if="checkedTh.includes('dlbm')"
            prop="dlbm"
            label="地类编码"
            min-width="120"
            sortable="custom"
            show-overflow-tooltip
          />

          <el-table-column
            v-if="checkedTh.includes('diMao')"
            prop="diMao"
            label="地貌"
            min-width="120"
            show-overflow-tooltip
          />

          <el-table-column
            v-if="checkedTh.includes('disasterC')"
            prop="disasterC"
            label="灾害等级"
            min-width="120"
            show-overflow-tooltip
          />

          <el-table-column
            v-if="checkedTh.includes('dispe')"
            prop="dispe"
            label="灾害类型"
            min-width="120"
            show-overflow-tooltip
          />

          <el-table-column
            v-if="checkedTh.includes('ldQs')"
            prop="ldQs"
            label="土地所有权属"
            min-width="120"
            show-overflow-tooltip
          />

          <el-table-column
            v-if="checkedTh.includes('kbJiDu')"
            prop="kbJiDu"
            label="交通区位"
            min-width="120"
            show-overflow-tooltip
          />

          <el-table-column
            v-if="checkedTh.includes('ldghGl')"
            prop="ldghGl"
            label="林地规划管理"
            min-width="120"
            show-overflow-tooltip
          />

          <el-table-column
            v-if="checkedTh.includes('linBan')"
            prop="linBan"
            label="林班"
            min-width="120"
            show-overflow-tooltip
          />

          <el-table-column
            v-if="checkedTh.includes('linChang')"
            prop="linChang"
            label="林场"
            min-width="120"
            show-overflow-tooltip
          />

          <el-table-column
            v-if="checkedTh.includes('linYeJu')"
            prop="linYeJu"
            label="林业局"
            min-width="120"
            show-overflow-tooltip
          />

          <el-table-column
            v-if="checkedTh.includes('lmsyqs')"
            prop="lmsyqs"
            label="林木使用权"
            min-width="120"
            show-overflow-tooltip
          />

          <el-table-column
            v-if="checkedTh.includes('pingjunXj')"
            prop="pingjunXj"
            label="平均胸径"
            min-width="120"
            show-overflow-tooltip
          />

          <el-table-column
            v-if="checkedTh.includes('poDu')"
            prop="poDu"
            label="坡度"
            min-width="120"
            show-overflow-tooltip
          />

          <el-table-column
            v-if="checkedTh.includes('poWei')"
            prop="poWei"
            label="坡位"
            min-width="120"
            show-overflow-tooltip
          />

          <el-table-column
            v-if="checkedTh.includes('poXiang')"
            prop="poXiang"
            label="坡向"
            min-width="120"
            show-overflow-tooltip
          />

          <el-table-column
            v-if="checkedTh.includes('sdDj')"
            prop="sdDj"
            label="湿地等级"
            min-width="120"
            show-overflow-tooltip
          />

          <el-table-column
            v-if="checkedTh.includes('sdMc')"
            prop="sdMc"
            label="重要湿地名称"
            min-width="120"
            show-overflow-tooltip
          />

          <el-table-column
            v-if="checkedTh.includes('tuRangLx')"
            prop="tuRangLx"
            label="土壤类型(名称)"
            min-width="120"
            show-overflow-tooltip
          />

          <el-table-column
            v-if="checkedTh.includes('xbmj')"
            prop="xbmj"
            label="小班面积"
            min-width="120"
            sortable="custom"
            show-overflow-tooltip
          />

          <el-table-column
            v-if="checkedTh.includes('sjnf')"
            prop="sjnf"
            label="数据年份"
            min-width="120"
            sortable="custom"
            show-overflow-tooltip
          />

          <el-table-column
            v-if="checkedTh.includes('dlmc')"
            prop="dlmc"
            label="地类名称"
            min-width="120"
            show-overflow-tooltip
          />

          <el-table-column
            v-if="checkedTh.includes('xiaoBan')"
            prop="xiaoBan"
            label="图斑号(小班)"
            min-width="120"
            show-overflow-tooltip
          />

          <el-table-column
            v-if="checkedTh.includes('qiYuan')"
            prop="qiYuan"
            label="起源"
            min-width="120"
            show-overflow-tooltip
          />

          <el-table-column
            v-if="checkedTh.includes('senLinLb')"
            prop="senLinLb"
            label="森林类别"
            min-width="120"
            show-overflow-tooltip
          />

          <el-table-column
            v-if="checkedTh.includes('linZhong')"
            prop="linZhong"
            label="林种"
            min-width="120"
            show-overflow-tooltip
          />

          <el-table-column
            v-if="checkedTh.includes('dcRy')"
            prop="dcRy"
            label="调查日期"
            min-width="120"
            sortable="custom"
            show-overflow-tooltip
          />

          <el-table-column
            v-if="checkedTh.includes('dcRq')"
            prop="dcRq"
            label="调查日期"
            min-width="120"
            sortable="custom"
            show-overflow-tooltip
          />

          <el-table-column
            v-if="checkedTh.includes('yearNo')"
            prop="yearNo"
            label="年份"
            min-width="120"
            sortable="custom"
            show-overflow-tooltip
          />

          <el-table-column
            v-if="checkedTh.includes('version')"
            prop="version"
            label="版本"
            min-width="120"
            show-overflow-tooltip
          />

          <el-table-column
            v-if="checkedTh.includes('tuRangZd')"
            prop="tuRangZd"
            label="土壤质地"
            min-width="120"
            show-overflow-tooltip
          />

          <el-table-column
            v-if="checkedTh.includes('lzmc')"
            prop="lzmc"
            label="林种名称"
            min-width="120"
            show-overflow-tooltip
          />

          <el-table-column
            v-if="checkedTh.includes('createdTime')"
            prop="createdTime"
            label="创建时间"
            min-width="120"
            sortable="custom"
            show-overflow-tooltip
          />

          <el-table-column
            prop=""
            label="操作"
            width="108"
            align="center"
            :resizable="false"
          >
            <template slot-scope="scope">
              <i
                class="el-icon-searchnew list-table-icon"
                @click="handleUpdateClick(scope.row)"
              />
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
      <WholeForestEdit
        v-if="isScreenCutting"
        ref="wholeForestEdit"
        :current-selection-index="currentSelectionIndex"
        :query-page-size="query.pageSize"
        :current-selection="currentSelection"
        :table-data="tableData"
        @detailsDeleteClick="detailsDeleteClick"
        @handleMoveSelectClick="handleMoveSelectClick"
        @detailsSubmitClick="detailsSubmitClick"
        @detailsCancelClick="detailsCancelClick"
      />
    </div>
    <WholeForestEditDialog
      v-if="dialogVisible"
      :dialogtitle="dialogtitle"
      :dialog-visible.sync="dialogVisible"
      :dialog-select-data="dialogSelectData"
      @diaologSubmitClick="diaologSubmitClick"
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
import { fireproofDict } from "@/vendor/resource"; // 引入类型配置
import { commonDownload } from "@/api/system";
import { deepClone, permissionPath, downloadFile } from "@/utils";
import { isArray } from "@/utils/validate";
import { mapGetters } from "vuex";

import { wholeForestApi } from "@/api/forestry/wholeForest";
import WholeForestEditDialog from "./editDialogs/wholeForestEditDialog.vue";
import WholeForestEdit from "./edits/wholeForestEdit.vue";

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

const queryDefault = {
  pageNo: 1,
  pageSize: 20,
  areaCode: "",
  tbbh: undefined,
  sjnf: undefined,
  yearNo: undefined,
};

export default {
  // 这里吧组件引入进来
  components: {
    AreaSelect,
    Pagination,
    DictionarySelect,
    DictionaryText,
    Tinymce,
    WholeForestEditDialog,
    WholeForestEdit,
    MoreQuery,
  },
  data() {
    return {
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
      dialogVisible: false, // 控制弹窗开启关闭
      dialogSelectData: {}, // 编辑，详情点击时的那一条数据
      checkAll: false,
      checkedTh: fireproofDict("forestry_whole_forest").showColumn,
      isIndeterminate: true,
      // 表格表头列表
      tableListTitle: [
        { name: "地区编码", parameter: "areaCode" },
        { name: "图斑编号", parameter: "tbbh" },
        { name: "草班", parameter: "caoBan" },
        { name: "草原类", parameter: "cdL" },
        { name: "地类编码", parameter: "dlbm" },
        { name: "地貌", parameter: "diMao" },
        { name: "灾害等级", parameter: "disasterC" },
        { name: "灾害类型", parameter: "dispe" },
        { name: "土地所有权属", parameter: "ldQs" },
        { name: "交通区位", parameter: "kbJiDu" },
        { name: "林地规划管理", parameter: "ldghGl" },
        { name: "林班", parameter: "linBan" },
        { name: "林场", parameter: "linChang" },
        { name: "林业局", parameter: "linYeJu" },
        { name: "林木使用权", parameter: "lmsyqs" },
        { name: "平均胸径", parameter: "pingjunXj" },
        { name: "坡度", parameter: "poDu" },
        { name: "坡位", parameter: "poWei" },
        { name: "坡向", parameter: "poXiang" },
        { name: "湿地等级", parameter: "sdDj" },
        { name: "重要湿地名称", parameter: "sdMc" },
        { name: "土壤类型(名称)", parameter: "tuRangLx" },
        { name: "小班面积", parameter: "xbmj" },
        { name: "数据年份", parameter: "sjnf" },
        { name: "地类名称", parameter: "dlmc" },
        { name: "图斑号(小班)", parameter: "xiaoBan" },
        { name: "起源", parameter: "qiYuan" },
        { name: "森林类别", parameter: "senLinLb" },
        { name: "林种", parameter: "linZhong" },
        { name: "调查日期", parameter: "dcRy" },
        { name: "调查日期", parameter: "dcRq" },
        { name: "年份", parameter: "yearNo" },
        { name: "版本", parameter: "version" },
        { name: "土壤质地", parameter: "tuRangZd" },
        { name: "林种名称", parameter: "lzmc" },
        { name: "创建时间", parameter: "createdTime" },
      ],
    };
  },

  // components: {},

  // watch: {},

  computed: {
    ...mapGetters(["requestLoading"]),
    queryData() {
      const data = {};
      if (this.query.areaCode == "") {
        this.query.areaCode = this.$store.getters.areaCode;
      }
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
    // 获取用户区划代码
    this.query.areaCode = this.$store.getters.areaCode;
    this.listBoxWidth = localStorage.getItem("listBoxStyleWidth") || 800;
  },

  mounted() {
    this.getList();
  },

  beforeDestroy() {
    const listBoxDraw = document.getElementById("listBoxDraw");
    listBoxDraw.removeEventListener("mousedown", this.downFunction);
    window.removeEventListener("mouseup", this.mouseupFunction);
  },

  methods: {
    // 列表框拖动监听,这里功能要在拖拽的时候不可以复制文本或者选中文本，拖拽结束后就要可以复制文本，对比2次的div宽度判断。
    listBoxDrawFunction() {
      // 获取元素上的所有事件侦听器
      const listBoxDraw = document.getElementById("listBoxDraw");
      listBoxDraw.addEventListener("mousedown", this.downFunction);
      window.addEventListener("mouseup", this.mouseupFunction);
    },
    downFunction(event) {
      const listBox = document.getElementById("listBox");
      this.listBoxStyleWidth = listBox.style.width;
      window.addEventListener("mousemove", this.dragFunciton);
      this.isMoveBox = true;
    },
    dragFunciton(event) {
      const listBox = document.getElementById("listBox");
      listBox.style.width = event.clientX - 230 + "px";
    },
    mouseupFunction(event) {
      const _this = this;
      const listBox = document.getElementById("listBox");
      // 这样就为了避免多次触发
      if (listBox.style.width !== this.listBoxStyleWidth) {
        this.listBoxStyleWidth = listBox.style.width;
        if (this.isScreenCutting) {
          localStorage.setItem(
            "listBoxStyleWidth",
            this.listBoxStyleWidth
              .toString()
              .substring(0, this.listBoxStyleWidth.length - 2)
          ); // 保存数据
        }
        window.removeEventListener("mousemove", this.dragFunciton);
        this.isMoveBox = false;
      } else {
        return;
      }
    },

    // 列表数据查询
    getList() {
      wholeForestApi("page", "post", this.queryData)
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

    // 切屏按钮
    async ScreenCuttingChange() {
      if (this.tableData.length <= 0) {
        return;
      }
      this.isScreenCutting = !this.isScreenCutting;
      this.currentSelectionIndex = 0;
      if (this.isScreenCutting) {
        this.listBoxWidth = localStorage.getItem("listBoxStyleWidth") || 800;
        this.$nextTick(() => {
          this.listBoxDrawFunction(); // 添加事件监听
        });
        if (this.tableData.length > 0) {
          // 设置表格选中第一行
          this.currentSelection = this.tableData[0];
          this.$nextTick(() => {
            this.$refs["listTable"].setCurrentRow(this.tableData[0]);
          });
        }
      } else {
        this.$refs["listTable"].setCurrentRow({});
      }
    },

    // 列表属性框中的上一条下一条点击事件
    async handleMoveSelectClick(type) {
      // 队选中行的index进行加减
      // 更新选中行的数据
      if (type === "up") {
        if (this.currentSelectionIndex == 0) {
          return;
        }
        this.currentSelectionIndex--;
      } else {
        if (this.currentSelectionIndex == this.tableData.length - 1) {
          return;
        }
        this.currentSelectionIndex++;
      }
      this.$refs["listTable"].setCurrentRow(
        this.tableData[this.currentSelectionIndex]
      );
      this.currentSelection = this.tableData[this.currentSelectionIndex];
      this.$nextTick(() => {
        this.$refs["wholeForestEdit"].updateDetails();
      });
    },

    // 列表属性框中的删除点击事件
    detailsDeleteClick() {
      this.getDeleteFunction(this.currentSelection.id);
    },

    // 列表属性框中的保存点击事件
    detailsSubmitClick() {
      this.detailsType = "编辑";
      this.getList();
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

    // 列表右侧详情点击取消后需要重新触发下，获得详情
    detailsCancelClick() {
      this.tableCurrentChange(this.currentSelection);
    },

    // 列表表格，每一行的选中事件
    async tableCurrentChange(currentRow) {
      if (!currentRow) {
        if (this.dialogtitle == "编辑" || this.detailsType == "编辑") {
          // 这里这样写是因为，当在切屏状态下编辑后，为了让列表的选中行依旧正确
          this.$nextTick(() => {
            this.$refs["listTable"].setCurrentRow(
              this.tableData[this.currentSelectionIndex]
            );
            this.dialogtitle = "详情";
            this.detailsType = "详情";
          });
          return;
        }
        // 这样写，是因为当处于切屏状态下，切换分页会传递空值
        this.currentSelection = this.tableData[0];
        // 还有设置选中
        this.$refs["listTable"].setCurrentRow(this.tableData[0]);
      } else {
        this.currentSelection = currentRow;
        this.$refs["listTable"].setCurrentRow(this.currentSelection);
      }
      this.currentSelectionIndex = this.tableData.findIndex((item) => {
        return item.id === this.currentSelection.id;
      });

      // 是否开启了切屏开了就需要查询明细展示
      if (this.isScreenCutting) {
        if (this.tableData.length < 1) {
          this.currentSelection = {};
        }
        this.$nextTick(() => {
          this.$refs["wholeForestEdit"].initDetails();
        });
      }
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

    // 新增按钮
    handleAddClick() {
      this.dialogtitle = "新增";
      this.dialogVisible = true;
    },

    //导出按钮
    downExcelClick() {
      let data = new FormData();
      data.append("columns", this.checkedTh.join());
      wholeForestApi("export_all/excel", "post", data).then((res) => {
        downloadFile(res.file, res.name || "导出数据.xlsx");
      });
    },

    // 编辑按钮
    async handleUpdateClick(data) {
      this.dialogtitle = "编辑";
      this.dialogVisible = true;
      this.dialogSelectData = data;
    },

    // 查看详情按钮
    async handleDetailsClick(data) {
      this.dialogtitle = "详情";
      this.dialogVisible = true;
      this.dialogSelectData = data;
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
          wholeForestApi("delete", "post", ids).then((res) => {
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

    // 弹窗确认按钮事件
    diaologSubmitClick() {
      if (this.dialogtitle == "新增") {
        this.query.pageNo = 1;
        this.getList();
      } else {
        this.getList();
      }
    },

    // 筛选条件中区划选择配套的事件
    changeQueryArea(v) {
      const temp = deepClone(v);
      if (isArray(temp) && temp.length > 0) {
        this.query.areaCode = temp.pop();
      } else {
        this.query.areaCode = "";
      }
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
