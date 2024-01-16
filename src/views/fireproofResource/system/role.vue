<template>
  <div class="app-container">
    <div class="filter-container clearfix">
      <div class="fl">
        <el-input
          v-model="query.roleName"
          :placeholder="$t('role.roleName')"
          style="width: 200px"
          class="filter-item"
          @keyup.enter.native="handleFilter"
        />
        <el-button
          v-waves
          class="filter-item ml-10"
          icon="el-icon-search"
          @click="handleFilter"
        >
          {{ $t("table.search") }}
        </el-button>
      </div>
      <div class="fr">
        <el-button
          class="filter-item ml-10"
          type="primary"
          icon="el-icon-edit"
          @click="handleCreate"
        >
          {{ $t("table.create") }}
        </el-button>
      </div>
    </div>

    <el-table
      v-loading="loading"
      :data="list"
      border
      fit
      highlight-current-row
      height="calc(100vh - 210px)"
      style="width: 100%; height: calc(100vh - 210px)"
    >
      <el-table-column type="index" :label="$t('role.id')" width="80" />
      <el-table-column :label="$t('role.roleName')" width="220">
        <template slot-scope="{ row }">
          {{ row.roleName }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('role.roleCode')" width="220">
        <template slot-scope="{ row }">
          {{ row.roleCode }}
        </template>
      </el-table-column>

      <el-table-column align="header-center" :label="$t('role.description')">
        <template slot-scope="{ row }">
          {{ row.description || "-" }}
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('table.actions')"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope)">
            {{ $t("table.edit") }}
          </el-button>
          <el-button type="danger" size="mini" @click="handleDelete(scope)">
            {{ $t("table.delete") }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

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
        label-width="80px"
      >
        <el-form-item :label="$t('role.roleName')" prop="roleName">
          <el-input v-model="item.roleName" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item :label="$t('role.roleCode')" prop="roleCode">
          <el-input v-model="item.roleCode" placeholder="请输入角色代码" />
        </el-form-item>
        <el-form-item :label="$t('role.description')">
          <el-input
            v-model="item.description"
            :autosize="{ minRows: 2, maxRows: 4 }"
            type="textarea"
            placeholder="请输入角色描述"
          />
        </el-form-item>
        <el-form-item label="角色权限">
          <el-tree
            ref="tree"
            :check-strictly="checkStrictly"
            :data="menus"
            :props="menusPropsDefault"
            show-checkbox
            node-key="id"
            class="permission-tree"
          />
        </el-form-item>
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
  </div>
</template>

<script>
import {
  fetchRoleList,
  fetchMenuTree,
  fetchRoleMenuList,
  createRoleItem,
  updateRoleItem,
  deleteRoleItem
} from '@/api/system';
import waves from '@/directive/waves'; // waves directive
import { deepClone, permissionPath } from '@/utils';

const itemDefault = {
  id: undefined,
  roleName: undefined,
  roleCode: undefined,
  status: '0',
  description: ''
};

export default {
  directives: { waves },
  data() {
    return {
      loading: true,
      path: '',
      item: {},
      list: [],
      menus: [],
      query: {
        roleName: undefined,
        status: undefined
      },

      dialogLoading: true, // 弹窗加载状态

      checkStrictly: false,
      menusPropsDefault: {
        children: 'children',
        label: 'label'
      },
      formState: '',
      formStateMap: {
        update: '编辑',
        create: '新增'
      },
      formVisible: false,
      // 表单校验
      rules: {
        roleName: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' }
        ],
        roleCode: [
          { required: true, message: '角色代码不能为空', trigger: 'blur' }
        ]
      }
    };
  },
  computed: {},
  created() {
    this.path = permissionPath(this.$route.path);
    this.getList();
    this.getMenus();
  },
  methods: {
    async getList() {
      this.loading = true;
      const res = await fetchRoleList(this.query);
      this.list = res.data;
      this.loading = false;
    },
    async getMenus() {
      const res = await fetchMenuTree();
      this.menus = res.data;
    },

    // 所有菜单节点数据
    getMenuAllCheckedKeys() {
      // 目前被选中的菜单节点
      const checkedKeys = this.$refs.tree.getCheckedKeys();
      // 半选中的菜单节点
      const halfCheckedKeys = this.$refs.tree.getHalfCheckedKeys();
      checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys);
      return checkedKeys;
    },

    // 重置详情
    resetItem() {
      if (this.$refs.tree != undefined) {
        this.$refs.tree.setCheckedKeys([]);
      }
      this.item = deepClone(itemDefault);
    },

    // 搜索
    handleFilter() {
      this.query.pageNo = 1;

      if (this.query.roleName === '') {
        delete this.query.roleName;
      }

      this.getList();
    },

    // 新增
    handleCreate() {
      this.resetItem();
      this.formState = 'create';
      this.formVisible = true;
      this.dialogLoading = true;
      this.$nextTick(() => {
        this.$refs['form'].clearValidate();
        this.dialogLoading = false;
      });
    },

    // 新增数据
    createData() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.dialogLoading = true;
          this.item.menuIds = this.getMenuAllCheckedKeys();
          createRoleItem(this.item).then((response) => {
            this.item.id = response.data.id;
            this.list.unshift(this.item);
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

    // 更新
    handleUpdate(scope) {
      this.resetItem();
      this.formState = 'update';
      this.formVisible = true;
      this.dialogLoading = true;
      this.checkStrictly = true;
      this.item = deepClone(scope.row);
      this.$nextTick(() => {
        this.$refs['form'].clearValidate();
        fetchRoleMenuList(scope.row.id).then((response) => {
          const checkedKeys = response.data.checkedKeys;
          checkedKeys.forEach((v) => {
            this.$nextTick(() => {
              this.$refs.tree.setChecked(v, true, false);
            });
          });
          this.checkStrictly = false;
          this.dialogLoading = false;
        });
      });
    },

    // 更新数据
    updateData() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.dialogLoading = true;
          this.item.menuIds = this.getMenuAllCheckedKeys();
          updateRoleItem(this.item).then(() => {
            const k = this.list.findIndex((v) => v.id === this.item.id);
            this.list.splice(k, 1, this.item);
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

    // 删除
    handleDelete({ $index, row }) {
      this.$confirm('确认删除该角色？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          await deleteRoleItem(row.id);
          this.list.splice($index, 1);
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          });
        })
        .catch(() => {
          /* console.error(err) */
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.app-container {
  .permission-tree {
    margin-bottom: 30px;
  }
}
</style>
