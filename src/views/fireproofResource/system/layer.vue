<template>
  <!-- 图层管理 -->
  <div class="app-container">
    <el-row :gutter="20" class="search-content">
      <!-- 筛选条件 -->
      <el-col :span="16">
        <!-- <el-select
          v-model="query.forestCode"
          clearable
          :placeholder="'请选择' + translate('scopeAnalysis', 'forestCode')"
        >
          <el-option
            v-for="item in forestCodeOptions"
            :key="item.id"
            :label="item.name"
            :value="item.code"
          />
        </el-select> -->

        <el-input
          v-model="query.cnName"
          v-permission="[path + ':query']"
          :placeholder="'请输入名称'"
          class="w200"
        />

        <!-- <el-select
          v-model="query.layerType"
          :placeholder="'请选择' + $t('layer.layerType')"
          clearable
          class="w200"
        >
          <el-option
            v-for="v in layerTypes"
            :key="v.code"
            :label="v.name"
            :value="v.code"
          />
        </el-select> -->
        <el-button class="search-btn ml-10" @click="handleFilter()">{{
          $t("table.search")
        }}</el-button>
      </el-col>
      <!-- 操作栏 -->
      <el-col :span="8">
        <div class="c-operation" style="text-align: right">
          <el-button
            v-permission="[path + ':create']"
            type="success"
            icon="el-icon-plus"
            plain
            size="small"
            @click="handleCreate"
          >
            {{ $t("table.create") }}
          </el-button>
        </div>
      </el-col>
    </el-row>

    <!-- 主体内容 -->
    <el-row :gutter="20" class="c-main mt-20">
      <!-- 左侧表格 -->
      <el-col id="app_l" :span="24" class="c-main-l">
        <div
          class="c-table-wrapper"
          :class="{ 'has-pagination': tableData.total }"
        >
          <el-table
            ref="list"
            v-loading="loading"
            :data="tableData.list"
            height="calc(100vh - 280px)"
            style="width: 100%; height: calc(100vh - 280px)"
            row-key="id"
            border
            class="c-table"
          >
            <!-- <el-table-column type="selection" width="55" /> -->
            <el-table-column type="index" :label="$t('role.id')" width="80" />
            <!-- <el-table-column :label="$t('layer.layerType')">
              <template slot-scope="{ row }">
                {{ layerTypeMap[row.layerType] }}
              </template>
            </el-table-column> -->
            <el-table-column :label="$t('layer.layer')">
              <template slot-scope="scope">
                {{ scope.row.remarks }}
              </template>
            </el-table-column>
            <!-- <el-table-column :label="$t('layer.forestCode')">
              <template slot-scope="scope">
                {{ forestTypeMap[scope.row.forestCode] }}
              </template>
            </el-table-column> -->
            <!-- <el-table-column
              :label="$t('layer.yearNo')"
              width="200"
              align="center"
            >
              <template slot-scope="scope">
                {{ scope.row.yearNo }}
              </template>
            </el-table-column> -->

            <!-- <el-table-column
              :label="$t('layer.recordStatus')"
              align="center"
              width="200"
            >
              <template slot-scope="scope">
                <el-tag v-if="scope.row.recordStatus == '0'" type="info"
                  >未备案</el-tag
                >
                <el-tag v-else type="success">已备案</el-tag>
              </template>
            </el-table-column> -->

            <!-- <el-table-column
              :label="$t('layer.isRelease')"
              align="center"
              width="200"
            >
              <template slot-scope="scope">
                <el-tag v-if="scope.row.isRelease == '0'" type="info"
                  >未发布</el-tag
                >
                <el-tag v-else type="success">已发布</el-tag>
              </template>
            </el-table-column> -->

            <el-table-column
              fixed="right"
              :label="$t('table.actions')"
              width="200"
              align="center"
            >
              <template slot-scope="scope">
                <el-button
                  type="danger"
                  size="mini"
                  @click.native="handleDelete(scope.row)"
                >
                  {{ $t("table.delete") }}
                </el-button>
                <!-- <el-dropdown>
                  <span class="el-dropdown-link">
                    更多<i class="el-icon-arrow-down el-icon--right" />
                  </span>
                  <el-dropdown-menu slot="dropdown" size="small">

                    <el-dropdown-item @click.native="roleClick(scope.row)">
                      配置角色
                    </el-dropdown-item>
                    <el-dropdown-item @click.native="userClick(scope.row)">
                      分配用户
                    </el-dropdown-item>
                    <el-dropdown-item @click.native="handleDelete(scope.row)">
                      删除
                    </el-dropdown-item>
                    <el-dropdown-item
                      v-show="scope.row.recordStatus == '0'"
                      @click.native="recordStatusClick(scope.row)"
                    >
                      备案
                    </el-dropdown-item>
                    <el-dropdown-item
                      v-show="
                        scope.row.recordStatus == '1' &&
                        scope.row.isRelease == '0'
                      "
                      @click.native="unRecordStatusClick(scope.row)"
                    >
                      取消备案
                    </el-dropdown-item>
                    <el-dropdown-item
                      v-show="
                        scope.row.recordStatus == '1' &&
                        scope.row.isRelease == '0'
                      "
                      @click.native="releaseClick(scope.row)"
                    >
                      发布
                    </el-dropdown-item>
                    <el-dropdown-item
                      v-show="
                        scope.row.recordStatus == '1' &&
                        scope.row.isRelease == '1'
                      "
                      @click.native="unPubilshClick(scope.row)"
                    >
                      取消发布
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown> -->
              </template>
            </el-table-column>
          </el-table>
        </div>
        <pagination
          v-show="tableData.total"
          :total="tableData.total"
          :page.sync="query.pageNo"
          :limit.sync="query.pageSize"
          @pagination="getList"
        />
      </el-col>
    </el-row>

    <el-dialog
      :title="formStateMap[formState]"
      :visible.sync="formVisible"
      width="680px"
    >
      <el-form
        ref="form"
        v-loading="dialogLoading"
        :model="item"
        :rules="rules"
        label-width="100px"
      >
        <el-row>
          <el-col :span="24">
            <el-form-item label="发布图层" prop="tableName">
              <el-select
                filterable
                v-model="item.tableName"
                placeholder="发布图层"
                style="width: 100%"
                @change="tableNameChange"
              >
                <el-option
                  v-for="v in tableNameOptions"
                  :key="v.tableViewName"
                  :label="v.comment"
                  :value="v.tableViewName"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="关联图例" prop="legendName">
              <el-select
                filterable
                v-model="item.legendName"
                placeholder="关联图例"
                style="width: 100%"
              >
                <el-option
                  v-for="v in legendNameOptions"
                  :key="v.id"
                  :label="v.cnName"
                  :value="v.enName"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="唯一标识" prop="layerSuffix">
              <el-input
                v-model.trim="item.layerSuffix"
                placeholder="唯一标识"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="图层排序" prop="sorting">
              <el-input-number
                v-model="item.sorting"
                controls-position="right"
                :min="0"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="图层名称" prop="remarks">
              <el-input v-model="item.remarks" placeholder="请输入图层名称" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button :disabled="dialogLoading" @click="formVisible = false">
          {{ $t("table.cancel") }}
        </el-button>
        <el-button
          type="primary"
          :disabled="dialogLoading"
          @click="formState === 'create' ? createData() : updateData()"
        >
          {{ $t("table.confirm") }}
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :title="roleText" :visible.sync="formVisibleRole" width="680px">
      <div class="content">
        <el-form
          ref="formRole"
          :model="formDataRole"
          label-width="100px"
          :rules="rules"
        >
          <el-form-item label="图层名称" prop="title">
            <span>{{ formDataRole.layer }}</span>
          </el-form-item>

          <el-form-item label="年份" prop="title">
            <span>{{ formDataRole.yearNo }}</span>
          </el-form-item>

          <el-form-item
            v-if="roleText == '配置角色'"
            label="角色"
            prop="describe"
          >
            <el-select
              v-model="formDataRole.roleIdList"
              filterable
              placeholder="请选择"
              multiple
              class="w100"
            >
              <el-option
                v-for="item in RoleOptions"
                :key="item.id"
                :label="item.roleName"
                :value="item.id"
              />
            </el-select>
          </el-form-item>

          <el-form-item v-else label="用户" prop="describe">
            <el-select
              v-model="formDataRole.userIdList"
              filterable
              placeholder="请选择"
              multiple
              class="w100"
            >
              <el-option
                v-for="item in UserOptions"
                :key="item.id"
                :label="item.nameCh"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button :disabled="dialogLoadingRole" @click="onCloseRole">
          {{ $t("table.cancel") }}
        </el-button>
        <el-button
          type="primary"
          :disabled="dialogLoadingRole"
          @click="handleCreateDataRole()"
        >
          {{ $t("table.confirm") }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  publishInfoPage,
  geoGetUsableTable,
  updateLegendlPage,
  publishInfoDelete,
  publishInfoCreate,
  fetchLayerRelease,
  fetchLayerUnPublish,
  fetchLayerItem,
  createLayerItem,
  updateLayerItem,
  deleteLayerList,
  fetchRoleList,
  getSystemLayerRole,
  putSystemLayerRole,
  getSystemLayerUser,
  putSystemLayerUser,
  fetchList,
  getSystemLayerUserAll,
  layerPutOnRecord,
} from "@/api/system";
// import api from '@/api/forestpatrol';
// import { getMasterList } from '@/api/auth';
import waves from "@/directive/waves";
import Pagination from "@/components/Pagination";
import { deepClone, permissionPath, dictLookup } from "@/utils";

import { fetchDictionaryList } from "@/api/system";

const itemDefault = {
  id: undefined,
  legendName: undefined, //关联的图例样式表
  tableName: undefined, //发布图层对应的表名/视图
  areaCode: undefined, //区划代码(预留字段)
  bnCode: undefined, //经营单位代码(预留字段)
  bsm: undefined, //bsm(预留字段)
  forestCode: undefined, //林地字典代码(预留字段)
  layer: undefined, //图层名称(推荐自动生成，备注信息填写到备注字段内
  layerType: undefined, //图层类型(0-shp文件、1-数据库、2-第三方提供),默认为=1
  masterId: undefined, //主控表的id(预留字段)
  remarks: undefined, //备注
  sorting: undefined, //排序
  typeCode: undefined, //图层的类型代码(预留字段)
  yearNo: undefined, //年版(预留字段)
};
// const itemDefault = {
//   id: undefined,
//   layerType: "0",
//   forestType: undefined,
//   layer: undefined,
//   mapUrl: undefined,
//   workArea: undefined,
//   bsm: "",
//   styleName: undefined,
//   lineWidth: 1,
//   lineColor: undefined,
//   fillColor: undefined,
//   account: undefined,
//   passWord: undefined,
//   expirationTime: undefined,
//   geoDataPath: undefined,
//   srs: "EPSG:4326",
//   isRelease: "1",
// };

export default {
  components: { Pagination },
  directives: { waves },
  filters: {},
  data() {
    const validator1 = (rule, value, callback) => {
      if (value == "") {
        callback();
      } else {
        const pattern = /^[a-zA-Z0-9]*$/;

        if (pattern.test(value)) {
          // 匹配成功的逻辑
          callback();
        } else {
          // 匹配失败的逻辑
          callback(new Error("图层名称只能由纯英文和数字组成"));
        }
      }
    };
    return {
      loading: false,
      path: permissionPath(this.$route.path),
      item: {},
      // 列表
      tableData: {
        loading: false,
        list: [],
        total: 10,
      },
      types: [],
      typeMap: {},
      layerTypes: [],
      layerTypeMap: {},
      forestTypes: [],
      forestTypeMap: {},
      total: 0,
      query: {
        forestCode: undefined,
        yearNo: undefined,
        cnName: undefined,
        pageNo: 1,
        pageSize: 10,
      },
      tableNameOptions: [], //发布图层下拉数据
      legendNameOptions: [], //关联图例下拉数据

      forestCodeOptions: [], // 类别下拉
      dialogLoading: true,
      formState: "",
      formStateMap: {
        update: "编辑",
        create: "新增",
      },
      formVisible: false,
      rules: {
        tableName: [
          { required: true, message: "请选择发布图层", trigger: "change" },
        ],
        legendName: [
          { required: true, message: "请选择关联图例", trigger: "change" },
        ],
        sorting: [
          { required: true, message: "请输入图层排序", trigger: "blur" },
        ],
        remarks: [
          { required: true, message: "请输入图层名称", trigger: "blur" },
        ],
        layerSuffix: [
          { required: false, validator: validator1, trigger: "blur" },
        ],
      },
      uploadHeaders: { token: this.$store.getters.token },
      uploadUrl: process.env.VUE_APP_BASE_API + "multimedia/uploadshp/shp",
      // 配置角色用户
      roleText: "",
      formVisibleRole: false,
      dialogLoadingRole: false,
      selectRowData: {},
      formDataRole: {
        layer: "",
        yearNo: "",
        roleIdList: null,
        userIdList: null,
      },
      UserOptions: [],
      RoleOptions: [],
    };
  },
  beforeCreate() {
    geoGetUsableTable({ groupName: "" }).then((res) => {
      this.tableNameOptions = res.data;
    });
    updateLegendlPage({ type: "2" }).then((res) => {
      this.legendNameOptions = res.data.list;
    });
  },
  created() {
    // 查询字典-新增资源类别的下拉
    // fetchDictionaryList({
    //   code: "lincao-senglinleibie",
    // }).then((response) => {
    //   this.forestCodeOptions = response.data;
    // });
    // fetchRoleList().then((res) => {
    //   this.RoleOptions = res.data;
    // });
    // getSystemLayerUserAll({ department: 1 }).then((res) => {
    //   this.UserOptions = res.data;
    // });
    this.getList();
  },
  methods: {
    tableNameChange(item) {
      console.log(`output->item`, item);
      let comment = dictLookup(
        this.tableNameOptions,
        item,
        "tableViewName",
        "comment"
      );
      let tableName = dictLookup(
        this.tableNameOptions,
        item,
        "tableViewName",
        "tableName"
      );
      this.item.remarks = comment;
      this.item.layerPrefix = tableName;
    },

    roleClick(row) {
      this.roleText = "配置角色";
      this.selectRowData = row;
      getSystemLayerRole({ layerId: row.id }).then((res) => {
        this.formDataRole = {
          layer: row.layer,
          yearNo: row.yearNo,
          roleIdList: res.data,
          userIdList: [],
        };
        this.formVisibleRole = true;
      });
    },
    userClick(row) {
      this.roleText = "分配用户";
      this.selectRowData = row;
      getSystemLayerUser({ layerId: row.id }).then((res) => {
        this.formDataRole = {
          layer: row.layer,
          yearNo: row.yearNo,
          roleIdList: [],
          userIdList: res.data,
        };
        this.formVisibleRole = true;
      });
    },
    handleCreateDataRole() {
      this.$refs["formRole"].validate((valid) => {
        if (valid) {
          this.dialogLoadingRole = true;
          if (this.roleText == "配置角色") {
            putSystemLayerRole({
              layerId: this.selectRowData.id,
              relatedList: this.formDataRole.roleIdList,
            })
              .then((res) => {
                this.$message.success("配置成功");
                this.formVisibleRole = false;
                this.getList();
                this.dialogLoadingRole = false;
              })
              .catch((err) => {
                this.dialogLoadingRole = false;
              });
          } else {
            putSystemLayerUser({
              layerId: this.selectRowData.id,
              relatedList: this.formDataRole.userIdList,
            })
              .then((res) => {
                this.$message.success("配置成功");
                this.formVisibleRole = false;
                this.getList();
                this.dialogLoadingRole = false;
              })
              .catch((err) => {
                this.dialogLoadingRole = false;
              });
          }
        }
      });
    },
    onCloseRole() {
      this.formDataRole = {
        layer: "",
        yearNo: "",
        roleIdList: [],
      };
      this.dialogLoadingRole = false;
      this.formVisibleRole = false;
    },
    // 动态国际化
    translate(type, key) {
      if (!key) {
        return;
      }
      const value = type + "." + key;
      return this.$t(value);
    },
    uploadSuccess(response) {
      if (response.status === "200") {
        this.item.bsm = response.data;
        this.item.bsm = this.item.bsm.replace(".zip", "");
        // this.item.bsm = response.data;
        this.$message.success("上传成功");
      } else {
        this.$message.error("上传失败，请重新上传");
      }
    },

    // 获取列表
    async getList() {
      this.loading = true;
      const data = {
        pageNo: this.query.pageNo,
        pageSize: this.query.pageSize,
      };
      const res = await publishInfoPage(data);
      this.tableData.list = res.data.list;
      this.tableData.total = res.data.total;
      this.loading = false;
    },

    getItem(id) {
      fetchLayerItem(id).then((response) => {
        this.item = Object.assign({}, response.data); // copy obj
      });
    },

    // 重置详情
    resetItem() {
      this.item = deepClone(itemDefault);
    },

    // 搜索
    handleFilter() {
      this.query.pageNo = 1;
      if (this.query.layer === "") delete this.query.layer;
      if (this.query.layerType === "") delete this.query.layerType;
      this.getList();
    },

    // 新增
    handleCreate() {
      this.resetItem();
      this.formState = "create";
      this.formVisible = true;
      this.dialogLoading = true;
      this.$nextTick(() => {
        this.$refs["form"].clearValidate();
        this.dialogLoading = false;
      });
    },

    // 新增数据
    createData() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.dialogLoading = true;
          publishInfoCreate(this.item).then(() => {
            this.formVisible = false;
            this.dialogLoading = false;
            this.$message.success("保存成功");
            this.getList();
          });
        }
      });
    },

    // 更新
    handleUpdate(scope) {
      this.resetItem();
      this.item = deepClone(scope.row);
      this.formState = "update";
      this.formVisible = true;
      this.dialogLoading = true;
      this.getItem(scope.row.id);
      this.$nextTick(() => {
        this.$refs["form"].clearValidate();
        this.dialogLoading = false;
      });
    },

    // 更新数据
    updateData() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.dialogLoading = true;
          updateLayerItem(this.item).then(() => {
            this.formVisible = false;
            this.dialogLoading = false;
            this.$message.success("更新成功");
            this.getList();
          });
        }
      });
    },

    // 发布图层
    releaseClick(row) {
      this.$confirm("确认发布图层-" + row.layer + "？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "",
      })
        .then(async () => {
          this.loading = true;
          await fetchLayerRelease([row.id]);
          this.$message.success("发布成功");
          this.getList();
        })
        .catch((err) => {
          console.error(err);
        });
    },

    // 取消发布图层
    unPubilshClick(row) {
      this.$confirm("确认取消发布图层-" + row.layer + "？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "",
      })
        .then(async () => {
          this.loading = true;
          await fetchLayerUnPublish([row.id]);
          this.$message.success("取消发布成功");
          this.getList();
        })
        .catch((err) => {
          console.error(err);
        });
    },

    // 备案图层
    recordStatusClick(row) {
      this.$confirm("确认备案图层-" + row.layer + "？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "",
      })
        .then(async () => {
          this.loading = true;
          await layerPutOnRecord({
            id: row.id,
            recordStatus: 1,
          });
          this.$message.success("备案成功");
          this.getList();
        })
        .catch((err) => {
          console.error(err);
        });
    },

    // 取消备案图层
    unRecordStatusClick(row) {
      this.$confirm("确认取消备案图层-" + row.layer + "？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "",
      })
        .then(async () => {
          this.loading = true;
          await layerPutOnRecord({
            id: row.id,
            recordStatus: 0,
          });
          this.$message.success("取消备案成功");
          this.getList();
        })
        .catch((err) => {
          console.error(err);
        });
    },

    // 删除
    handleDelete(row) {
      this.$confirm("确认删除图层-" + row.layer + "？", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          this.loading = true;
          await publishInfoDelete([row.id]);
          this.$message.success("删除成功");
          this.getList();
        })
        .catch((err) => {
          console.error(err);
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.c-main {
  background-color: #fff;
  padding: 0px 0px 5px 0px;
}
.content {
  // height: 210px;
  padding: 0 30px 0 10px;
  .w100 {
    width: 100%;
  }
}
.w200 {
  width: 200px;
}
</style>
