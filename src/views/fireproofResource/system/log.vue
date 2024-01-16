<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="query.title"
        :placeholder="'请输入' + $t('log.title')"
        clearable
        style="width: 200px"
        class="filter-item mr-10"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="query.operName"
        :placeholder="'请输入' + $t('log.operName')"
        clearable
        style="width: 200px"
        class="filter-item mr-10"
        @keyup.enter.native="handleFilter"
      />
      <el-select
        v-model="query.businessType"
        :placeholder="'请选择' + $t('log.businessType')"
        clearable
        class="filter-item mr-10"
      >
        <el-option
          v-for="v in businessTypes"
          :key="v.code"
          :label="v.name"
          :value="v.code"
        />
      </el-select>
      <el-select
        v-model="query.operatorType"
        :placeholder="'请选择' + $t('log.operatorType')"
        clearable
        class="filter-item mr-10"
      >
        <el-option
          v-for="v in operatorTypes"
          :key="v.code"
          :label="v.name"
          :value="v.code"
        />
      </el-select>
      <el-select
        v-model="query.status"
        :placeholder="'请选择' + $t('log.status')"
        clearable
        class="filter-item mr-10"
      >
        <el-option label="正常" value="0" />
        <el-option label="异常" value="1" />
      </el-select>
      <el-button
        v-waves
        class="filter-item"
        icon="el-icon-search"
        @click="handleFilter"
      >
        {{ $t("table.search") }}
      </el-button>
    </div>
    <div class="c-main">
      <el-table
        v-loading="loading"
        :data="list"
        border
        fit
        highlight-current-row
        height="calc(100vh - 280px)"
        style="width: 100%; height: calc(100vh - 280px)"
      >
        <el-table-column type="index" :label="$t('log.id')" width="80" />
        <el-table-column :label="$t('log.title')">
          <template slot-scope="scope">
            {{ scope.row.title }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('log.operName')">
          <template slot-scope="scope">
            {{ scope.row.operName }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('log.businessType')">
          <template slot-scope="scope">
            {{ businessTypeMap[scope.row.businessType] }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('log.requestMethod')">
          <template slot-scope="scope">
            {{ scope.row.requestMethod }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('log.method')">
          <template slot-scope="scope">
            {{ scope.row.method }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('log.operTime')">
          <template slot-scope="scope">
            {{ scope.row.operTime }}
          </template>
        </el-table-column>

        <el-table-column :label="$t('log.status')" align="center" width="100px">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status === 0" type="success">正常</el-tag>
            <el-tag v-else type="danger">异常</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('table.actions')"
          align="center"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="handleShow(scope)">
              详情
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

    <el-dialog title="详情" :visible.sync="formVisible">
      <el-form ref="form" :model="item" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('log.title')" prop="title">
              <el-input v-model="item.title" readonly />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('log.operName')" prop="operName">
              <el-input v-model="item.operName" readonly />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('log.businessType')" prop="businessType">
              <el-input v-model="businessTypeMap[item.businessType]" readonly />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('log.requestMethod')" prop="requestMethod">
              <el-input v-model="item.requestMethod" readonly />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('log.operatorType')" prop="operatorType">
              <el-input v-model="operatorTypeMap[item.operatorType]" readonly />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('log.operIp')" prop="operIp">
              <el-input v-model="item.operIp" readonly />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('log.status')" prop="status">
              <el-input v-if="item.status === 0" value="正常" readonly />
              <el-input v-else value="异常" readonly />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('log.operTime')" prop="operTime">
              <el-input v-model="item.operTime" readonly />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('log.method')" prop="method">
              <el-input v-model="item.method" readonly />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('log.operUrl')" prop="operUrl">
              <el-input v-model="item.operUrl" readonly />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('log.operParam')" prop="operParam">
              <el-input
                v-model="item.operParam"
                :autosize="{ minRows: 2, maxRows: 4 }"
                type="textarea"
                resize="none"
                readonly
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('log.jsonResult')" prop="jsonResult">
              <el-input
                v-model="item.jsonResult"
                :autosize="{ minRows: 2, maxRows: 4 }"
                type="textarea"
                resize="none"
                readonly
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('log.errorMsg')" prop="errorMsg">
              <el-input
                v-model="item.errorMsg"
                :autosize="{ minRows: 2, maxRows: 4 }"
                type="textarea"
                resize="none"
                readonly
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { deepClone } from '@/utils';
import { fetchLogPage, fetchLogItem, fetchDictionaryList } from '@/api/system';
import waves from '@/directive/waves';
import Pagination from '@/components/Pagination';

const itemDefault = {
  id: undefined,
  title: undefined,
  operName: undefined,
  businessType: undefined,
  requestMethod: undefined,
  operatorType: undefined,
  operIp: undefined,
  status: undefined,
  operTime: undefined,
  method: undefined,
  operUrl: undefined,
  operParam: undefined,
  jsonResult: undefined,
  errorMsg: undefined
};

export default {
  components: { Pagination },
  directives: { waves },
  filters: {},
  data() {
    return {
      loading: true,
      item: {},
      list: [],
      total: 0,
      query: {
        pageNo: 1,
        pageSize: 10,
        title: undefined,
        operName: undefined,
        businessType: undefined,
        operatorType: undefined,
        status: undefined
      },
      businessTypes: [],
      businessTypeMap: {},
      operatorTypes: [],
      operatorTypeMap: [],
      formVisible: false
    };
  },
  computed: {},
  created() {
    this.getList();
    this.getBusinessTypes();
    this.getOperatorTypes();
  },
  methods: {
    // 获取列表
    async getList() {
      this.loading = true;
      const res = await fetchLogPage(this.query);
      this.list = res.data;
      this.total = res.total;
      this.loading = false;
    },

    // 获取业务类型列表
    async getBusinessTypes() {
      const query = {};
      query.code = 'businessType';
      const res = await fetchDictionaryList(query);
      this.businessTypes = res.data;
      for (let i = 0; i < res.data.length; i++) {
        this.businessTypeMap[res.data[i].code] = res.data[i].name;
      }
    },

    // 获取操作系统类型列表
    async getOperatorTypes() {
      const query = {};
      query.code = 'operatorType';
      const res = await fetchDictionaryList(query);
      this.operatorTypes = res.data;
      for (let i = 0; i < res.data.length; i++) {
        this.operatorTypeMap[res.data[i].code] = res.data[i].name;
      }
    },

    getItem(id) {
      fetchLogItem(id).then((response) => {
        this.item = response.data;
      });
    },

    // 重置详情
    resetItem() {
      this.item = deepClone(itemDefault);
    },

    // 搜索
    handleFilter() {
      this.query.pageNo = 1;

      if (this.query.title === '') {
        delete this.query.title;
      }
      if (this.query.operName === '') {
        delete this.query.operName;
      }
      if (this.query.businessType === '') {
        delete this.query.businessType;
      }
      if (this.query.operatorType === '') {
        delete this.query.operatorType;
      }
      if (this.query.status === '') {
        delete this.query.status;
      }

      this.getList();
    },

    // 更新
    handleShow(scope) {
      this.resetItem();
      this.formVisible = true;
      this.getItem(scope.row.id);
      this.$nextTick(() => {});
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
