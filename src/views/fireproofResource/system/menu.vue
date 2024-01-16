<template>
  <div class="app-container">
    <div class="filter-container clearfix">
      <div class="fl" />
      <el-input
        v-model="query.menuName"
        :placeholder="'请输入' + $t('menu.menuName')"
        style="width: 200px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-select
        v-model="query.status"
        :placeholder="'请选择' + $t('menu.status')"
        clearable
        class="filter-item ml-10"
      >
        <el-option
          v-for="v in statusMap"
          :key="v.key"
          :label="v.value"
          :value="v.key"
        />
      </el-select>
      <el-button
        v-waves
        class="filter-item ml-10"
        icon="el-icon-search"
        @click="handleFilter"
      >
        {{ $t("table.search") }}
      </el-button>
      <el-button
        class="filter-item ml-10"
        icon="el-icon-sort"
        @click="toggleExpandAll"
      >{{ !isExpandAll ? "展开" : "折叠" }}</el-button>
      <div class="fr" />
      <el-button
        v-permission="[path + ':create']"
        class="filter-item ml-10"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >
        {{ $t("table.create") }}
      </el-button>
    </div>

    <el-table
      v-if="listRefresh"
      :key="listKey"
      v-loading="loading"
      :data="list"
      :default-expand-all="isExpandAll"
      tooltip-effect="dark"
      border
      fit
      highlight-current-row
      height="calc(100vh - 210px)"
      style="width: 100%; height: calc(100vh - 210px)"
      row-key="id"
    >
      <el-table-column :label="$t('menu.orderNum')" width="120">
        <template slot-scope="{ row }">
          <span>{{ row.orderNum }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('menu.menuName')">
        <template slot-scope="{ row }">
          <span>{{ row.menuName }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('menu.path')">
        <template slot-scope="{ row }">
          <span>{{ row.path }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('menu.icon')" align="center" width="100">
        <template slot-scope="{ row }">
          <!-- row.icon会存在null值，需要强判断 -->
          <i
            v-if="row.icon && row.icon.includes('el-icon')"
            :class="row.icon"
          />
          <svg-icon
            v-if="row.icon && !row.icon.includes('el-icon')"
            :icon-class="row.icon"
          />
        </template>
      </el-table-column>

      <el-table-column :label="$t('menu.menuType')" align="center" width="100">
        <template slot-scope="{ row }">
          <el-tag v-if="row.menuType == 'M'" type="primary">目录</el-tag>
          <el-tag v-if="row.menuType == 'C'" type="success">菜单</el-tag>
          <el-tag v-if="row.menuType == 'F'" type="warning">按钮</el-tag>
        </template>
      </el-table-column>

      <el-table-column :label="$t('menu.status')" align="center" width="100">
        <template slot-scope="{ row }">
          <el-tooltip
            :content="'当前状态: ' + statusMap[row.status].value"
            placement="top"
          >
            <el-switch
              v-model="row.status"
              active-value="0"
              inactive-value="1"
              @change="handleStatus(row)"
            />
          </el-tooltip>
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('table.actions')"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            v-waves
            v-permission="[path + ':update']"
            type="primary"
            size="mini"
            @click="handleUpdate(scope)"
          >
            {{ $t("table.edit") }}
          </el-button>
          <el-button
            slot="reference"
            v-permission="[path + ':delete']"
            size="mini"
            type="danger"
            @click="handleDelete(scope)"
          >
            {{ $t("table.delete") }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改菜单对话框 -->
    <el-dialog
      :title="textMap[formStateMap]"
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
            <el-form-item label="上级菜单">
              <treeselect
                v-model="item.parentId"
                :options="menuMap"
                :normalizer="normalizer"
                :show-count="true"
                placeholder="选择上级菜单"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('menu.menuType')" prop="menuType">
              <el-radio-group v-model="item.menuType">
                <el-radio label="M">目录</el-radio>
                <el-radio label="C">菜单</el-radio>
                <el-radio label="F">按钮</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item v-if="item.menuType != 'F'" :label="$t('menu.icon')">
              <el-popover
                placement="bottom-start"
                width="460"
                trigger="click"
                @show="$refs['iconSelect'].reset()"
              >
                <IconSelect ref="iconSelect" @selected="selectedIcon" />
                <el-input
                  slot="reference"
                  v-model="item.icon"
                  :placeholder="'请选择' + $t('menu.icon')"
                  clearable
                >
                  <!-- <svg-icon v-if="item.icon" slot="prefix" :icon-class="item.icon" class="el-input__icon" style="height: 32px;width: 16px;" />
                  <i v-else slot="prefix" class="el-icon-search el-input__icon" /> -->
                  <i
                    v-if="!item.icon"
                    slot="prefix"
                    class="el-icon-search el-input__icon"
                  />
                </el-input>
              </el-popover>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('menu.menuName')" prop="menuName">
              <el-input
                v-model="item.menuName"
                :placeholder="'请输入' + $t('menu.menuName')"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('menu.orderNum')" prop="orderNum">
              <el-input-number
                v-model="item.orderNum"
                controls-position="right"
                :min="0"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="item.menuType != 'F'">
              <span slot="label">
                <el-tooltip
                  content="选择是外链则路由地址需要以`http(s)://`开头"
                  placement="top"
                >
                  <i class="el-icon-question" />
                </el-tooltip>
                {{ $t("menu.isFrame") }}
              </span>
              <el-radio-group v-model="item.isFrame">
                <el-radio label="0">是</el-radio>
                <el-radio label="1">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="item.menuType != 'F'" prop="path">
              <span slot="label">
                <el-tooltip
                  content="访问的路由地址，如：`user`，如外网地址需内链访问则以`http(s)://`开头"
                  placement="top"
                >
                  <i class="el-icon-question" />
                </el-tooltip>
                {{ $t("menu.path") }}
              </span>
              <el-input
                v-model="item.path"
                :placeholder="'请输入' + $t('menu.path')"
              />
            </el-form-item>
          </el-col>

          <el-col v-if="item.menuType != 'F'" :span="12">
            <el-form-item prop="component">
              <span slot="label">
                <el-tooltip
                  content="访问的组件路径，如：`system/user/index`，默认在`views`目录下"
                  placement="top"
                >
                  <i class="el-icon-question" />
                </el-tooltip>
                {{ $t("menu.component") }}
              </span>
              <el-input
                v-model="item.component"
                :placeholder="'请输入' + $t('menu.component')"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="item.menuType != 'F'" prop="redirect">
              <span slot="label">
                <el-tooltip
                  content="不填写默认未noRedirect，填写请输入组件路径，如：`system/user/index`"
                  placement="top"
                >
                  <i class="el-icon-question" />
                </el-tooltip>
                {{ $t("menu.redirect") }}
              </span>
              <el-input
                v-model="item.redirect"
                :placeholder="'请输入' + $t('menu.redirect')"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="item.menuType != 'M'">
              <el-input
                v-model="item.perms"
                :placeholder="'请输入' + $t('menu.perms')"
                maxlength="100"
              />
              <span slot="label">
                <el-tooltip content="例如：system:user:list" placement="top">
                  <i class="el-icon-question" />
                </el-tooltip>
                {{ $t("menu.perms") }}
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="item.menuType == 'C'">
              <el-input
                v-model="item.query"
                :placeholder="'请输入' + $t('menu.query')"
                maxlength="255"
              />
              <span slot="label">
                <el-tooltip
                  content="访问路由的默认传递参数，如：`{&quot;id&quot;: 1, &quot;name&quot;: &quot;ry&quot;}`"
                  placement="top"
                >
                  <i class="el-icon-question" />
                </el-tooltip>
                {{ $t("menu.query") }}
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="item.menuType == 'C'">
              <span slot="label">
                <el-tooltip
                  content="选择是则会被`keep-alive`缓存，需要匹配组件的`name`和地址保持一致"
                  placement="top"
                >
                  <i class="el-icon-question" />
                </el-tooltip>
                {{ $t("menu.isCache") }}
              </span>
              <el-radio-group v-model="item.isCache">
                <el-radio label="0">缓存</el-radio>
                <el-radio label="1">不缓存</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="item.menuType != 'F'">
              <span slot="label">
                <el-tooltip
                  content="选择隐藏则路由将不会出现在侧边栏，但仍然可以访问"
                  placement="top"
                >
                  <i class="el-icon-question" />
                </el-tooltip>
                {{ $t("menu.visible") }}
              </span>
              <el-radio-group v-model="item.visible">
                <el-radio v-for="v in visibleMap" :key="v.key" :label="v.key">{{
                  v.value
                }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="item.menuType != 'F'">
              <span slot="label">
                <el-tooltip
                  content="选择停用则路由将不会出现在侧边栏，也不能被访问"
                  placement="top"
                >
                  <i class="el-icon-question" />
                </el-tooltip>
                {{ $t("menu.status") }}
              </span>
              <el-radio-group v-model="item.status">
                <el-radio v-for="v in statusMap" :key="v.key" :label="v.key">{{
                  v.value
                }}</el-radio>
              </el-radio-group>
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
          @click="formStateMap === 'create' ? createData() : updateData()"
        >
          {{ $t("table.confirm") }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  fetchMenuList,
  fetchMenuItem,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem
} from '@/api/system';
import waves from '@/directive/waves'; // waves directive
import IconSelect from '@/components/IconSelect';
import Treeselect from '@riophae/vue-treeselect';
import '@riophae/vue-treeselect/dist/vue-treeselect.css';
import { deepClone, permissionPath } from '@/utils';

const itemDefault = {
  id: undefined,
  parentId: 0,
  menuName: undefined,
  icon: undefined,
  menuType: 'M',
  orderNum: 1,
  isFrame: '1',
  isCache: '0',
  visible: '0',
  status: '0'
};

export default {
  components: {
    Treeselect,
    IconSelect
  },
  directives: { waves },
  filters: {},
  data() {
    return {
      listKey: 0,
      list: [],
      loading: true,
      path: '',
      query: {
        menuName: undefined,
        status: undefined
      },
      item: {},

      dialogLoading: true, // 弹窗加载状态

      formVisible: false,
      formStateMap: '',
      deleteVisible: false,
      textMap: {
        update: '编辑',
        create: '新增'
      },
      rules: {
        menuName: [
          { required: true, message: '菜单名称不能为空', trigger: 'blur' }
        ],
        orderNum: [
          { required: true, message: '菜单顺序不能为空', trigger: 'blur' }
        ],
        path: [
          { required: true, message: '路由地址不能为空', trigger: 'blur' }
        ]
      },
      statusMap: [
        { key: '0', value: '启用' },
        { key: '1', value: '禁用' }
      ],
      visibleMap: [
        { key: '0', value: '显示' },
        { key: '1', value: '隐藏' }
      ],
      menuMap: [],
      // 是否展开，默认全部折叠
      isExpandAll: false,
      // 重新渲染表格状态
      listRefresh: true
    };
  },
  created() {
    this.path = permissionPath(this.$route.path);
    this.getList();
  },
  methods: {
    /** 展开/折叠操作 */
    toggleExpandAll() {
      this.listRefresh = false;
      this.isExpandAll = !this.isExpandAll;
      this.$nextTick(() => {
        this.listRefresh = true;
      });
    },

    // 选择图标
    selectedIcon(name) {
      this.item.icon = name;
    },

    /** 转换菜单数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.id,
        label: node.menuName,
        children: node.children
      };
    },

    /** 查询菜单下拉树结构 */
    getTreeselect() {
      fetchMenuList(this.listQuery).then((response) => {
        this.menuMap = [];
        const menu = { id: 0, menuName: '主类目', children: [] };
        menu.children = this.handleTree(response.data, 'id');
        this.menuMap.push(menu);
      });
    },

    // 动态国际化
    translateTable(key) {
      if (!key) {
        return;
      }
      const value = 'table.' + key;
      return this.$t(value);
    },

    getList() {
      this.loading = true;
      fetchMenuList(this.query).then((response) => {
        this.list = response.data;
        this.list = this.handleTree(response.data, 'id');
        this.loading = false;
      });
    },

    getItem(id) {
      fetchMenuItem(id).then((response) => {
        this.item = Object.assign({}, response.data);
      });
    },

    handleFilter() {
      if (this.query.menuName === '') {
        delete this.query.menuName;
      }
      if (this.query.status === '') {
        delete this.query.status;
      }

      this.getList();
    },
    resetItem() {
      this.item = deepClone(itemDefault);
    },
    handleStatus(row) {
      const temp = {};
      temp.id = row.id;
      temp.status = row.status;
      updateMenuItem(temp).then(() => {
        this.$notify({
          title: '成功',
          message: '更新成功',
          type: 'success',
          duration: 2000
        });
      });
    },
    handleCreate() {
      this.resetItem();
      this.getTreeselect();
      this.formStateMap = 'create';
      this.formVisible = true;
      this.dialogLoading = true;
      this.$nextTick(() => {
        this.$refs['form'].clearValidate();
        this.dialogLoading = false;
      });
    },
    createData() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.dialogLoading = true;
          createMenuItem(this.item).then((response) => {
            this.getList();
            this.formVisible = false;
            this.dialogLoading = false;
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            });
          });
        }
      });
    },
    handleUpdate(scope) {
      this.resetItem();
      this.getTreeselect();
      this.item = Object.assign({}, scope.row);
      this.getItem(scope.row.id);
      this.formStateMap = 'update';
      this.formVisible = true;
      this.dialogLoading = true;
      this.$nextTick(() => {
        this.$refs['form'].clearValidate();
        this.dialogLoading = false;
      });
    },

    updateData() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.dialogLoading = true;
          const tempData = Object.assign({}, this.item);
          updateMenuItem(tempData).then(() => {
            this.getList();
            this.formVisible = false;
            this.dialogLoading = false;
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            });
          });
        }
      });
    },

    handleDelete(scope) {
      this.$confirm('确认删除该菜单？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        confirmButtonType: '',
        type: 'warning'
      })
        .then(async() => {
          /* const data = {}
          data.ids = scope.row.id */
          await deleteMenuItem(scope.row.id);
          this.getList();
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          });
        })
        .catch(() => {
          // console.error(err)
        });
    }
  }
};
</script>

<style scoped></style>
