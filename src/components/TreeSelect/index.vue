<!--  -->
<template>
  <div style="width: 100%; height: 100%">
    <el-tree
      ref="eltree"
      :class="className"
      :data="data"
      :show-checkbox="showCheckbox"
      :auto-expand-parent="autoExpandParent"
      :default-checked-keys="defaultCheckedKeys"
      :default-expanded-keys="defaultExpandedKeys"
      :props="props"
      :node-key="nodeKey"
      :default-expand-all="false"
      :filter-node-method="filterNode"
      @check="check"
    >
      <el-popover
        v-if="[2, 3, 4].includes(data.type)"
        slot-scope="{ node, data }"
        style="width: 100%"
        placement="right"
        width="400"
        trigger="hover"
        :disabled="!data.describe"
      >
        <div class="popover-class">
          <div class="title">{{ data.cnName }}</div>
          <div class="name">描述：</div>
          <div class="text">
            {{ data.describe ? data.describe.describe : "" }}
          </div>
          <div class="name">时间：</div>
          <div class="text">
            {{ data.describe ? data.describe.timing : "" }}
          </div>
          <div class="name">数据来源：</div>
          <div class="text">
            {{ data.describe ? data.describe.source : "" }}
          </div>
        </div>
        <div
          slot="reference"
          style="
            display: flex;
            align-items: center;
            padding: 10px;
            justify-content: space-between;
            width: 100%;
          "
        >
          <!-- {{ $t(`${mapResourcesDownListName}.${node.label}`) }} -->
          <div
            class="label-class"
            :style="{
              fontSize: data.foneSize + 'px',
              fontWeight: data.fontWeight,
            }"
          >
            {{ data.cnName }}
          </div>
          <!-- <span>{{ data.cnName }}</span> -->
          <div class="flex">
            <div
              v-if="
                data.geoBsm && data.type === 3 && data.geometryType == 'Point'
              "
              class="ml-10"
            >
              <!-- :src="require(`@/static/oneMapimages/${data.geoBsm}.png`)" -->
              <img
                style="width: 21px; height: 24px"
                :src="imgurl + data.pointWellKnownName"
                alt=""
              />
            </div>
            <div
              v-show="data.type === 3 && data.geometryType == 'Point'"
              :style="{
                backgroundColor: data.fillColor || 'red' || 'transparent',
                width: '30px',
                height: '10px',
              }"
              class="ml-10"
            />
            <div
              v-if="
                data.geoBsm && data.type === 3 && data.geometryType == 'Polygon'
              "
              class="ml-10"
            >
              <!-- :src="imgurl + data.pointWellKnownName" -->
              <img
                src="@/static/templateImages/polygon.png"
                style="
                  width: 21px;
                  height: 24px;
                  background-color: #0052d9;
                  border-radius: 4px;
                "
                alt=""
              />
            </div>
            <div
              v-show="data.type === 3 && data.geometryType == 'Polygon'"
              :style="{
                backgroundColor: data.fillColor || 'transparent',
                borderWidth: data.strokeWidth ? data.strokeWidth + 'px' : '0px',
                borderColor: data.strokeColor,
                opacity: data.fillOpacity,
                borderStyle: 'solid',
                width: '30px',
                height: '10px',
              }"
              class="ml-10"
            />
            <div
              v-show="data.type === 4 && data.geometryType == 'Polygon'"
              :style="{
                backgroundColor: data.fillColor || 'transparent',
                borderWidth: data.strokeWidth ? data.strokeWidth + 'px' : '0px',
                borderColor: data.strokeColor,
                opacity: data.fillOpacity,
                borderStyle: 'solid',
                width: '30px',
                height: '10px',
              }"
              class="ml-10"
            />

            <!-- <div
            v-show="data.type === 1 && data.parentId === -1"
            :style="{
              fontSize: '16px',
              color: data.fillColor,
              textShadow: `${data.strokeColor} 1px 0 0, ${data.strokeColor} 0 1px 0, ${data.strokeColor} -1px 0 0, ${data.strokeColor} 0 -1px 0`
            }"
          >
            {{ data.columnName }}
          </div> -->
            <div
              v-if="data.type === 20 && isShowUpdateTree"
              class="ml-10"
              @click.stop="handleUpdate(data)"
            >
              <i class="el-icon-edit-outline" />
            </div>
            <div
              v-if="data.type === 40 && isShowUpdateTree"
              class="ml-10"
              @click.stop="handleUpdate(data)"
            >
              <i class="el-icon-edit-outline" />
            </div>
          </div>
        </div>
      </el-popover>
      <div
        v-else
        slot-scope="{ node, data }"
        style="
          display: flex;
          align-items: center;
          padding: 10px;
          justify-content: space-between;
          width: 100%;
        "
      >
        <div
          class="label-class"
          :style="{
            fontSize: data.foneSize + 'px',
            fontWeight: data.fontWeight,
          }"
        >
          {{ data.cnName }}
        </div>
      </div>
    </el-tree>
    <!-- 添加或修改菜单对话框 -->
    <el-dialog
      title="修改"
      :visible.sync="formVisible"
      width="850px"
      :append-to-body="true"
    >
      <el-form
        ref="form"
        v-loading="dialogLoading"
        :model="item"
        :rules="rules"
        label-width="120px"
      >
        <el-row>
          <!-- <el-col :span="24">
            <el-form-item :label="$t('resourceTree.parentId')" prop="parentId">
              <treeselect
                v-model="item.parentId"
                :options="menuMap"
                :normalizer="normalizer"
                :show-count="true"
                :placeholder="'选择' + $t('resourceTree.parentId')"
              />
            </el-form-item>
          </el-col> -->

          <!-- <el-col :span="24">
            <el-form-item :label="$t('resourceTree.type')" prop="type">
              <el-radio-group v-model="item.type" @input="itemTypeInput">
                <el-radio :label="1">目录</el-radio>
                <el-radio :label="0">菜单</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col> -->

          <el-col :span="12">
            <el-form-item :label="$t('resourceTree.cnName')" prop="cnName">
              <el-input
                v-model="item.cnName"
                :placeholder="'请输入' + $t('resourceTree.cnName')"
              />
            </el-form-item>
          </el-col>

          <!-- <el-col :span="12">
            <el-form-item :label="$t('resourceTree.enName')" prop="enName">
              <el-input
                v-model="item.enName"
                :placeholder="'请输入' + $t('resourceTree.enName')"
              />
            </el-form-item>
          </el-col> -->

          <el-col v-if="item.type === 0" :span="24">
            <el-form-item
              :label="$t('resourceTree.cqlFilter')"
              :prop="item.type == 0 ? 'cqlFilter' : ''"
            >
              <el-select
                v-model="item.columnName"
                style="width: 40%"
                clearable
                :placeholder="'请选择'"
                @change="columnNameChange"
              >
                <el-option
                  v-for="(item, index) in columnNameOptions"
                  :key="index + item"
                  :label="item"
                  :value="item"
                />
              </el-select>

              <el-select
                v-model="item.inOrEquals"
                class="ml-10"
                style="width: 17%"
                :placeholder="'请选择'"
                @change="inOrEqualsChange"
              >
                <el-option
                  v-for="item in inOrEqualsOptions"
                  :key="item.id"
                  :label="item.value"
                  :value="item.id"
                />
              </el-select>

              <el-autocomplete
                v-if="item.inOrEquals == 0"
                v-model="item.filterCondition0"
                style="width: 40%"
                class="ml-10"
                clearable
                :fetch-suggestions="querySearch"
                placeholder="请输入内容"
              />

              <el-select
                v-if="item.inOrEquals == 1"
                v-model="item.filterCondition1"
                class="ml-10"
                style="width: 40%"
                multiple
                collapse-tags
                :placeholder="'请选择'"
              >
                <el-option
                  v-for="item in filterCondition1Options"
                  :key="item.id"
                  :label="item.value"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item :label="$t('resourceTree.sorting')" prop="sorting">
              <el-input-number
                v-model="item.sorting"
                controls-position="right"
                :min="0"
              />
            </el-form-item>
          </el-col>

          <el-col v-if="item.type === 0" :span="12">
            <el-form-item
              :label="$t('resourceTree.strokeColor')"
              class="colorSelect"
            >
              <el-color-picker v-model="item.strokeColor" />
            </el-form-item>
          </el-col>

          <el-col v-if="item.type === 0" :span="12">
            <el-form-item
              :label="$t('resourceTree.strokeWidth')"
              prop="strokeWidth"
            >
              <el-input-number
                v-model="item.strokeWidth"
                controls-position="right"
                :min="0"
              />
            </el-form-item>
          </el-col>

          <el-col v-if="item.type === 0" :span="12">
            <el-form-item
              :label="$t('resourceTree.fillColor')"
              class="colorSelect"
              :prop="item.type == 0 ? 'fillColor' : ''"
            >
              <el-color-picker v-model="item.fillColor" />
            </el-form-item>
          </el-col>

          <el-col v-if="item.type === 0" :span="12">
            <el-form-item
              :label="$t('resourceTree.fillOpacity')"
              prop="fillOpacity"
            >
              <el-input-number
                v-model="item.fillOpacity"
                controls-position="right"
                :min="0"
                :step="0.1"
                :max="1"
              />
            </el-form-item>
          </el-col>

          <el-col v-if="item.type === 1 && item.parentId === -1" :span="12">
            <el-form-item label="注记关联字段名" prop="columnName">
              <el-select
                v-model="item.columnName"
                style="width: 100%"
                clearable
                :placeholder="'请选择'"
                @change="columnNameChange"
              >
                <el-option
                  v-for="(item, index) in columnNameOptions"
                  :key="index + item"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col v-if="item.type === 1 && item.parentId === -1" :span="12">
            <el-form-item label="注记文字大小" prop="inOrEquals">
              <el-input-number
                v-model="item.inOrEquals"
                controls-position="right"
                :min="0"
                :max="999"
              />
            </el-form-item>
          </el-col>

          <el-col v-if="item.type === 1 && item.parentId === -1" :span="12">
            <el-form-item label="注记描边颜色" class="colorSelect">
              <el-color-picker v-model="item.strokeColor" />
            </el-form-item>
          </el-col>

          <el-col v-if="item.type === 1 && item.parentId === -1" :span="12">
            <el-form-item
              label="注记填充颜色"
              class="colorSelect"
              :prop="item.type == 0 ? 'fillColor' : ''"
            >
              <el-color-picker v-model="item.fillColor" />
            </el-form-item>
          </el-col>
          <!--
          <el-col :span="12">
            <el-form-item>
              <span slot="label">
                <el-tooltip
                  content="选择停用则路由将不会出现在侧边栏，也不能被访问"
                  placement="top"
                >
                  <i class="el-icon-question" />
                </el-tooltip>
                {{ $t('resourceTree.enable') }}
              </span>
              <el-radio-group v-model="item.enable">
                <el-radio v-for="v in statusMap" :key="v.key" :label="v.key">{{
                  v.value
                }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col> -->
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :disabled="dialogLoading" @click="formVisible = false">
          {{ $t("table.cancel") }}
        </el-button>
        <el-button
          type="primary"
          :disabled="dialogLoading"
          @click="updateData()"
        >
          {{ $t("table.confirm") }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { deepClone, permissionPath, set16ToRgb } from "@/utils";
import {
  updateLegendlDetail,
  updateLegendlPage,
  legendGetColumnList,
  legendGetdataListByColumn,
  updateLegendlUpdate,
  geoserverRefreshStyle,
  updateLegendlUpdateLabel,
  commonDownThumbnailload,
} from "@/api/system";
import Treeselect from "@riophae/vue-treeselect";

const itemDefault = {
  cnName: undefined, // 中文名
  cqlFilter: undefined, // 筛选的sql语句
  enName: undefined, // 英文名字
  enable: 0, // 是否可用 0可用1不可用
  fillColor: undefined, // 填充颜色
  fillOpacity: undefined, // 填充颜色透明度
  icon: undefined, // 图标
  media: undefined, // 多媒体
  parentId: -1, // 父级id
  remark: undefined, // 备注
  sorting: undefined, // 排序
  strokeColor: undefined, // 线条颜色
  strokeWidth: undefined, // 线条宽度
  type: 0, // 类型 0菜单1目录
  inOrEquals: 0, // 过滤语句第二个值
  filterCondition0: undefined, // 过滤语句第三个值第一类
  filterCondition1: undefined, // 过滤语句第三个值第二类
  columnName: undefined, // 过滤语句的第一个值
};
export default {
  name: "TreeSelect",
  components: {
    Treeselect,
  },
  props: {
    data: {
      type: Array,
      default() {
        return [];
      },
    },
    defaultCheckedKeys: {
      type: Array,
      default() {
        return [];
      },
    },
    defaultExpandedKeys: {
      type: Array,
      default() {
        return [];
      },
    },
    showCheckbox: {
      type: Boolean,
      default: false,
    },
    autoExpandParent: {
      type: Boolean,
      default: true,
    },
    props: {
      type: Object,
      default() {
        return {
          children: "children",
          label: "label",
        };
      },
    },
    className: {
      type: String,
      default: "",
    },
    nodeKey: {
      type: String,
      default: "",
    },
    mapResourcesDownListName: {
      type: String,
      default: "",
    },
    // 是否可以编辑树
    isShowUpdateTree: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    const sqlFiltervalidator = (rule, value, callback) => {
      const filterCondition0 = this.item.filterCondition0;
      const filterCondition1 = this.item.filterCondition1;
      const columnName = this.item.columnName;
      const inOrEquals = this.item.inOrEquals;
      if (inOrEquals === 0) {
        if (!filterCondition0 || !columnName) {
          callback(new Error("请选择"));
        } else {
          callback();
        }
      } else {
        if (filterCondition1.length == 0 || !columnName) {
          callback(new Error("请选择"));
        } else {
          callback();
        }
      }
    };
    return {
      menuMap: [],
      item: {},
      filterCondition1Options: [],
      formVisible: false,
      dialogLoading: false,
      rules: {
        parentId: [
          { required: true, message: "请选择上级菜单", trigger: "change" },
        ],
        cnName: [
          { required: true, message: "菜单名称不能为空", trigger: "blur" },
        ],
        // enName: [
        //   { required: true, message: '英文名称不能为空', trigger: 'blur' }
        // ],
        cqlFilter: [
          { required: true, validator: sqlFiltervalidator, trigger: "change" },
        ],
        sorting: [
          { required: true, message: "菜单顺序不能为空", trigger: "blur" },
        ],
        fillColor: [
          { required: true, message: "填充颜色不能为空", trigger: "change" },
        ],
        // path: [{ required: true, message: '路由地址不能为空', trigger: 'blur' }]
      },
      statusMap: [
        { key: 0, value: "启用" },
        { key: 1, value: "禁用" },
      ],
      imgurl:
        process.env.VUE_APP_BASE_API +
        "/files/minIo/thumbnail_download?uniqueName=",
      columnNameOptions: [],
      filterCondition1Options: [],
      inOrEqualsOptions: [
        { value: "=", id: 0 },
        { value: "IN", id: 1 },
      ],
    };
  },

  // components: {},

  // watch: {},

  // computed: {},
  beforeCreate() {
    // legendGetColumnList().then((res) => {
    //   this.columnNameOptions = res.data;
    // });
  },

  created() {},

  // mounted(){},

  methods: {
    check(data, list) {
      this.$emit("check", data, list);
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.cnName.indexOf(value) !== -1;
    },
    // handleUpdate(data) {
    //   console.log(`output->data`, data);
    // },

    handleUpdate(scope) {
      this.resetItem();
      this.getTreeselect();
      this.item = Object.assign({}, scope);
      this.getItem(scope.id);
      this.formVisible = true;
      this.dialogLoading = true;
      this.$nextTick(() => {
        this.$refs["form"].clearValidate();
        this.dialogLoading = false;
      });
    },

    resetItem() {
      this.item = deepClone(itemDefault);
    },

    /** 查询菜单下拉树结构 */
    getTreeselect() {
      updateLegendlPage({
        pageNo: 1,
        pageSize: 99999,
      }).then((res) => {
        this.menuMap = [];
        const menu = { id: -1, cnName: "主类目", children: [] };
        menu.children = this.handleTree(res.data.list, "id");
        this.menuMap.push(menu);
      });
    },

    /** 转换菜单数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.id,
        label: node.cnName,
        children: node.children,
      };
    },

    getItem(id) {
      updateLegendlDetail(id).then((response) => {
        this.item = Object.assign({}, response.data);
        legendGetdataListByColumn({ columnName: this.item.columnName }).then(
          (res) => {
            const list = res.data.map((item) => {
              return { value: item, id: item };
            });

            this.filterCondition1Options = list;
          }
        );
        if (this.item.inOrEquals === 0) {
          this.$set(this.item, "filterCondition0", this.item.filterCondition);
          this.$set(this.item, "filterCondition1", []);
        } else {
          this.$set(
            this.item,
            "filterCondition1",
            this.item.filterCondition.split(",")
          );
          this.$set(this.item, "filterCondition0", "");
        }
      });
    },
    itemTypeInput() {
      this.item.cqlFilter = "";
      this.item.filterCondition0 = "";
      this.item.filterCondition1 = [];
      this.item.columnName = "";
      this.item.strokeWidth = undefined;
      this.item.strokeColor = "";
      this.item.fillColor = "";
      this.item.fillOpacity = undefined;
      this.$refs["form"].clearValidate();
    },

    querySearch(queryString, cb) {
      if (this.item.columnName && queryString) {
        const restaurants = this.filterCondition1Options;
        const results = restaurants.filter((item) => {
          return (
            item.value.toLowerCase().indexOf(queryString.toLowerCase()) > -1
          );
        });
        const list = results.map((item) => {
          return { value: item };
        });
        cb(results);
      } else {
        cb(this.filterCondition1Options);
      }
    },

    columnNameChange(data) {
      this.filterCondition1Options = [];
      if (data) {
        legendGetdataListByColumn({ columnName: data }).then((res) => {
          const list = res.data.map((item) => {
            return { value: item, id: item };
          });
          this.item.filterCondition0 = "";
          this.item.filterCondition1 = "";
          this.filterCondition1Options = list;
        });
      } else {
        this.item.filterCondition0 = "";
        this.item.filterCondition1 = "";
        this.filterCondition1Options = [];
      }
    },

    inOrEqualsChange() {
      this.item.filterCondition0 = "";
      this.item.filterCondition1 = "";
    },

    updateData() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.item.type === 0) {
            this.item.filterCondition1 =
              this.item.filterCondition1.length > 0
                ? this.item.filterCondition1.join(",")
                : "";
            this.item.filterCondition =
              this.item.inOrEquals === 0
                ? this.item.filterCondition0
                : this.item.filterCondition1;
          }
          this.dialogLoading = true;
          const tempData = Object.assign({}, this.item);
          if (this.item.parentId === -1) {
            updateLegendlUpdateLabel(tempData).then(() => {
              geoserverRefreshStyle(this.item.id).then((res) => {
                this.$emit("treeUpdateSuccess");
                this.formVisible = false;
              });
            });
          } else {
            updateLegendlUpdate(tempData).then(() => {
              geoserverRefreshStyle(this.item.id).then((res) => {
                this.$emit("treeUpdateSuccess");
                this.formVisible = false;
              });
            });
          }
        }
      });
    },
  },
};
</script>

<style scoped>
.flex {
  display: flex;
  align-items: center;
}
.el-tree >>> .el-tree__empty-block {
  min-height: 32px;
}
.el-tree >>> .el-tree-node__content {
  height: 36px;
}
.el-tree >>> .el-tree-node__label {
  /* color: #fff; */
  color: var(--fontColor);
}
.el-tree >>> .el-tree-node__content:hover,
.el-tree >>> .el-tree-node__content:focus {
  /* background-color: rgba(61, 85, 105, 0.7); */
  background-color: var(--backgroundColor);
}
.el-tree >>> .el-tree-node:focus > .el-tree-node__content {
  /* background-color: rgba(61, 85, 105, 0.7); */
  background-color: var(--backgroundColor);
}
.colorSelect >>> .el-form-item__content {
  height: 36px;
}

.label-class {
  /* color: #fff; */
  color: var(--fontColor);
}
</style>
<style lang="scss" scoped>
.popover-class {
  .title {
    font-size: 18px;
    height: 30px;
    border-bottom: 1px solid #eee;
  }
  .name {
    color: #000;
    font-weight: 600;
    margin-top: 10px;
  }
  .text {
    margin-top: 10px;
  }
}
</style>
