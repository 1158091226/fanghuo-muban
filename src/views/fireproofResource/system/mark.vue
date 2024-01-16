<template>
  <div class="app-container">
    <div class="filter-container clearfix">
      <div class="fl">
        <el-input v-model="query.markCode" :placeholder="$t('mark.markCode')" style="width: 200px;" class="filter-item mr-10" @keyup.enter.native="handleFilter" />
        <el-button v-waves class="filter-item mr-10" icon="el-icon-search" @click="handleFilter">
          {{ $t('table.search') }}
        </el-button>
      </div>
      <div class="fr">
        <el-button v-permission="[path+':create']" class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">
          {{ $t('table.create') }}
        </el-button>
      </div>
    </div>
    <el-table v-loading="loading" :data="list" border fit highlight-current-row style="width: 100%;">
      <el-table-column type="index" :label="$t('mark.id')" width="80" />
      <el-table-column :label="$t('mark.markCode')">
        <template slot-scope="scope">
          {{ scope.row.markCode }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('mark.tableName')">
        <template slot-scope="scope">
          {{ typeMap[scope.row.tableName] }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('mark.markDescription')">
        <template slot-scope="scope">
          {{ scope.row.markDescription }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('mark.isPublicMark')" align="center" width="100px">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.isPublicMark === 0" type="info">否</el-tag>
          <el-tag v-else type="primary">是</el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.actions')" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-permission="[path+':update']" type="primary" size="mini" @click="handleUpdate(scope)">
            {{ $t('table.edit') }}
          </el-button>
          <el-button v-permission="[path+':delete']" type="danger" size="mini" @click="handleDelete(scope)">
            {{ $t('table.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="query.pageNo" :limit.sync="query.pageSize" @pagination="getList" />

    <el-dialog :title="formStateMap[formState]" :visible.sync="formVisible" width="500px">
      <el-form ref="form" :model="item" :rules="rules" label-width="80px">
        <el-form-item :label="$t('mark.tableName')" prop="tableName">
          <el-select v-model="item.tableName" placeholder="请选择" style="width:100%">
            <el-option v-for="v in types" :key="v.code" :label="v.name" :value="v.code" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('mark.markCode')" prop="markCode">
          <el-input v-model="item.markCode" placeholder="请输入标记编码" />
        </el-form-item>
        <el-form-item :label="$t('mark.markDescription')">
          <el-input v-model="item.markDescription" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="请输入标记描述" />
        </el-form-item>
        <el-form-item :label="$t('mark.sortOrder')" prop="sortOrder">
          <el-input-number v-model="item.sortOrder" controls-position="right" :min="0" style="width:100%" />
        </el-form-item>
        <el-form-item :label="$t('mark.isPublicMark')" prop="isPublicMark">
          <el-radio-group v-model="item.isPublicMark">
            <el-radio :label="0">否</el-radio>
            <el-radio :label="1">是</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="formVisible = false">
          {{ $t('table.cancel') }}
        </el-button>
        <el-button type="primary" @click="formState==='create'?createData():updateData()">
          {{ $t('table.confirm') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchMarkPage, createMarkItem, updateMarkItem, deleteMarkList, fetchDictionaryList } from '@/api/system';
import waves from '@/directive/waves';
import Pagination from '@/components/Pagination';
import { deepClone, permissionPath } from '@/utils';

const itemDefault = {
  id: undefined,
  markCode: undefined,
  markDescription: undefined,
  sortOrder: 0,
  tableName: undefined,
  isPublicMark: 0
};

export default {
  components: { Pagination },
  directives: { waves },
  filters: {

  },
  data() {
    return {
      loading: true,
      path: '',
      item: {},
      list: [],
      types: [],
      typeMap: {},
      total: 0,
      query: {
        pageNo: 1,
        pageSize: 10,
        markCode: undefined
      },

      formState: '',
      formStateMap: {
        update: '编辑',
        create: '新增'
      },
      formVisible: false,

      // 表单校验
      rules: {
        tableName: [
          { required: true, message: '标记类型不能为空', trigger: 'blur' }
        ],
        markCode: [
          { required: true, message: '标记编号不能为空', trigger: 'blur' }
        ]
      }
    };
  },
  computed: {

  },
  created() {
    this.path = permissionPath(this.$route.path);
    this.getList();
    this.getTypes();
  },
  methods: {

    /* getList() {
      this.loading = true
      fetchPage(this.query).then(response => {
        this.list = response.data.records
        this.total = response.data.total
        this.loading = false
      })
    }, */

    // 获取列表
    async getList() {
      this.loading = true;
      const res = await fetchMarkPage(this.query);
      this.list = res.data.records;
      this.total = res.data.total;
      this.loading = false;
    },

    // 获取类型列表
    async getTypes() {
      const query = {};
      query.code = 'dataType';
      const res = await fetchDictionaryList(query);
      this.types = res.data;
      for (let i = 0; i < res.data.length; i++) {
        this.typeMap[res.data[i].code] = res.data[i].name;
      }
    },

    // 重置详情
    resetItem() {
      this.item = deepClone(itemDefault);
    },

    // 搜索
    handleFilter() {
      this.query.pageNo = 1;

      if (this.query.markCode === '') {
        delete (this.query.markCode);
      }

      this.getList();
    },

    // 新增
    handleCreate() {
      this.resetItem();
      this.formState = 'create';
      this.formVisible = true;
      this.$nextTick(() => {
        this.$refs['form'].clearValidate();
      });
    },

    // 新增数据
    createData() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          createMarkItem(this.item).then(response => {
            this.item.id = response.data.id;
            this.list.unshift(this.item);
            this.formVisible = false;
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
      this.item = deepClone(scope.row);
      this.$nextTick(() => {
        this.$refs['form'].clearValidate();
      });
    },

    // 更新数据
    updateData() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          updateMarkItem(this.item).then(() => {
            const k = this.list.findIndex(v => v.id === this.item.id);
            this.list.splice(k, 1, this.item);
            this.formVisible = false;
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
      this.$confirm('确认删除该标记？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          const data = {};
          data.ids = row.id;
          await deleteMarkList(data);
          this.list.splice($index, 1);
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          });
        })
        .catch(err => { console.error(err); });
    }

  }
};
</script>

<style lang="scss" scoped>
.app-container {
  .roles-table {
    margin-top: 30px;
  }
  .permission-tree {
    margin-bottom: 30px;
  }
}
</style>
