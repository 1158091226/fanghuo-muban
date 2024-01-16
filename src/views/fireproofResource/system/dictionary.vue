<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="query.name"
        :placeholder="$t('dictionary.name')"
        style="width: 200px"
        class="filter-item mr-10"
        @keyup.enter.native="handleFilter"
      />
      <el-button
        v-waves
        class="filter-item mr-10"
        icon="el-icon-search"
        @click="handleFilter"
      >
        {{ $t("table.search") }}
      </el-button>
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >
        {{ $t("table.create") }}
      </el-button>
    </div>
    <div class="c-main">
      <el-table
        ref="list"
        v-loading="loading"
        :data="list"
        border
        fit
        highlight-current-row
        height="calc(100vh - 280px)"
        style="width: 100%; height: calc(100vh - 280px)"
        row-key="id"
        lazy
        :load="getListChildren"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
        <el-table-column type="index" :label="$t('dictionary.id')" width="80" />
        <el-table-column :label="$t('dictionary.name')">
          <template slot-scope="scope">
            {{ scope.row.name }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('dictionary.code')">
          <template slot-scope="scope">
            {{ scope.row.code }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('dictionary.describe')">
          <template slot-scope="scope">
            {{ scope.row.describe || "-" }}
          </template>
        </el-table-column>

        <el-table-column
          :label="$t('table.actions')"
          align="center"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <el-button
              v-permission="[path + ':update']"
              type="primary"
              size="mini"
              @click="handleUpdate(scope)"
            >
              {{ $t("table.edit") }}
            </el-button>
            <el-button
              v-permission="[path + ':delete']"
              type="danger"
              size="mini"
              @click="handleDelete(scope)"
            >
              {{ $t("table.delete") }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="query.pageNo"
        :limit.sync="query.pageSize"
        @pagination="getList"
      />
    </div>

    <el-dialog
      :title="formStateMap[formState]"
      :visible.sync="formVisible"
      width="500px"
    >
      <el-form
        ref="form"
        v-loading="dialogLoading"
        :model="item"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item label="上级字典" prop="parentCode">
          <!-- <el-select v-model="item.parentCode" placeholder="请选择" style="width:100%">
            <el-option v-for="v in dictionaries" :key="v.code" :label="v.name" :value="v.code" />
          </el-select> -->
          <treeselect
            v-model="item.parentCode"
            :options="dictionaries"
            :normalizer="normalizer"
            :show-count="true"
            placeholder="选择上级菜单"
          />
        </el-form-item>

        <el-form-item :label="$t('dictionary.name')" prop="name">
          <el-input v-model="item.name" placeholder="请输入字典名称" />
        </el-form-item>
        <el-form-item :label="$t('dictionary.code')" prop="code">
          <el-input v-model="item.code" placeholder="请输入字典编码" />
        </el-form-item>
        <el-form-item :label="$t('dictionary.describe')" prop="describe">
          <el-input v-model="item.describe" placeholder="请输入字典描述" />
        </el-form-item>
        <el-form-item :label="$t('dictionary.sorting')" prop="sorting">
          <el-input-number
            v-model="item.sorting"
            controls-position="right"
            :min="0"
            style="width: 100%"
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
  fetchDictionaryPage,
  fetchDictionaryList,
  fetchDictionaryItem,
  createDictionaryItem,
  updateDictionaryItem,
  deleteDictionaryList
} from '@/api/system';
import waves from '@/directive/waves';
import Pagination from '@/components/Pagination';
import Treeselect from '@riophae/vue-treeselect';
import '@riophae/vue-treeselect/dist/vue-treeselect.css';
import { deepClone, permissionPath } from '@/utils';

const itemDefault = {
  id: undefined,
  name: undefined,
  code: undefined,
  describe: undefined,
  sorting: 0,
  parentId: 0,
  parentCode: '0'
};

export default {
  components: { Pagination, Treeselect },
  directives: { waves },
  filters: {},
  data() {
    return {
      loading: true,
      path: '',
      item: {},
      list: [],
      dictionaries: [],
      total: 0,
      query: {
        pageNo: 1,
        pageSize: 10,
        name: undefined
      },

      dialogLoading: true, // 弹窗加载状态

      formState: '',
      formStateMap: {
        update: '编辑',
        create: '新增'
      },
      formVisible: false,

      // 表单校验
      rules: {
        name: [
          { required: true, message: '字典名称不能为空', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '字典编号不能为空', trigger: 'blur' }
        ]
      },

      listChildren: new Map()
    };
  },
  computed: {},
  created() {
    this.path = permissionPath(this.$route.path);
    this.getList();
  },
  methods: {
    /** 转换菜单数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.code,
        label: node.name,
        children: node.children
      };
    },
    getList() {
      this.loading = true;
      fetchDictionaryPage(this.query).then((response) => {
        this.list = response.data;
        this.total = response.total;
        this.loading = false;

        for (let i = 0; i < this.list.length; i++) {
          this.list[i].hasChildren = true;
        }

        /* const temp = []
        for (let i = 0; i < this.list.length; i++) {
          this.list[i].hasChildren = true
          temp.push(this.list[i])
        }

        this.dictionaries = temp

        const none = {}
        none.name = '主字典'
        none.code = ''
        this.dictionaries.unshift(none) */
      });
    },

    /** 查询菜单下拉树结构 */
    getTreeselect() {
      this.dictionaries = [];
      const menu = { code: '0', name: '主字典', children: [] };
      menu.children = this.handleTree(this.list, 'code');
      this.dictionaries.push(menu);
      /* console.log(this.dictionaries) */
    },

    getItem() {
      fetchDictionaryItem(this.item.id).then((response) => {
        this.item.parentCode = response.data.parentCode;
        this.item.sorting = response.data.sorting;
      });
    },

    getListChildren(tree, treeNode, resolve) {
      const pid = tree.id;
      this.listChildren.set(pid, { tree, treeNode, resolve }); // 将当前选中节点数据存储到maps中
      const query = {};
      query.code = tree.code;
      fetchDictionaryList(query).then((response) => {
        resolve(response.data);
      });
      // console.log(this.list)
    },

    // 重置详情
    resetItem() {
      this.item = deepClone(itemDefault);
    },

    // 搜索
    handleFilter() {
      this.query.pageNo = 1;

      if (this.query.name === '') {
        delete this.query.name;
      }

      this.getList();
    },

    updateChildrenList(item) {
      // 根据code取得上级key值
      const parent = this.list.findIndex((v) => v.code === item.parentCode);

      // 根据key值取得上级ID
      const pid = this.list[parent].id;
      if (this.listChildren.has(pid)) {
        const { tree, treeNode, resolve } = this.listChildren.get(pid); // 根据pid取出对应的节点数据
        this.$set(this.$refs.list.store.states.lazyTreeNodeMap, pid, []); // 将对应节点下的数据清空，从而实现数据的重新加载
        this.getListChildren(tree, treeNode, resolve);
      }
    },

    // 新增
    handleCreate() {
      this.resetItem();

      this.getTreeselect();

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
        /* console.log(this.item)
        return */
        if (valid) {
          this.dialogLoading = true;
          createDictionaryItem(this.item).then((response) => {
            if (this.item.parentCode !== '0') {
              this.updateChildrenList(this.item);
            } else {
              this.item.id = response.data;
              this.item.hasChildren = true;
              this.list.unshift(this.item);
            }

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
      this.getTreeselect();
      this.formState = 'update';
      this.formVisible = true;
      this.dialogLoading = true;
      this.item = deepClone(scope.row);
      this.getItem();
      this.$nextTick(() => {
        this.$refs['form'].clearValidate();
        this.dialogLoading = false;
      });
    },

    // 更新数据
    updateData() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          /* console.log(this.item)
          return */
          this.dialogLoading = true;
          updateDictionaryItem(this.item).then(() => {
            if (this.item.parentCode !== '0') {
              this.updateChildrenList(this.item);
            } else {
              const k = this.list.findIndex((v) => v.id === this.item.id);
              this.list.splice(k, 1, this.item);
            }

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
      this.$confirm('确认删除该字典？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          const ids = [];
          ids.push(row.id);
          await deleteDictionaryList(ids);

          if (row.parentCode !== '0') {
            this.updateChildrenList(row);
          } else {
            this.list.splice($index, 1);
          }

          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          });
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.c-main {
  background-color: #fff;
  padding: 0px 10px 5px 10px;
}
</style>
