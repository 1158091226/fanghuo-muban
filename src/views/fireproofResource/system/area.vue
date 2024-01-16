<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="query.areaCode"
        :placeholder="'请输入' + $t('area.areaCode')"
        class="filter-item mr-10"
        style="width: 200px"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="query.areaName"
        :placeholder="'请输入' + $t('area.areaName')"
        class="filter-item mr-10"
        style="width: 200px"
        @keyup.enter.native="handleFilter"
      />
      <el-button
        v-waves
        class="filter-item"
        icon="el-icon-search"
        @click="handleFilter"
      >
        {{ $t("table.search") }}
      </el-button>
      <!-- <el-button v-permission="['system:area:create']" class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">
        {{ $t('table.create') }}
      </el-button> -->
      <!-- <el-button v-permission="['system:area:import']" class="filter-item" type="primary" icon="el-icon-upload2" @click="handleImport">
        {{ $t('table.import') }}
      </el-button> -->
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
        <el-table-column type="index" :label="$t('area.id')" width="80" />
        <el-table-column :label="$t('area.areaCode')">
          <template slot-scope="{ row }">
            {{ row.areaCode }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('area.areaName')">
          <template slot-scope="{ row }">
            {{ row.areaName }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('area.areaFullName')">
          <template slot-scope="{ row }">
            {{ row.areaFullName }}
          </template>
        </el-table-column>

        <!-- <el-table-column :label="$t('table.actions')" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-permission="['system:area:update']" type="primary" size="small" @click="handleUpdate(scope)">
            {{ $t('table.edit') }}
          </el-button>
          <el-button v-permission="['system:area:delete']" type="danger" size="small" @click="handleDelete(scope)">
            {{ $t('table.delete') }}
          </el-button>
        </template>
      </el-table-column> -->
      </el-table>
      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="query.pageNo"
        :limit.sync="query.pageSize"
        @pagination="getList"
      />
    </div>
  </div>
</template>

<script>
import { fetchAreaPage } from '@/api/system';
import { deepClone } from '@/utils';
import waves from '@/directive/waves';
import Pagination from '@/components/Pagination';

export default {
  components: { Pagination },
  directives: { waves },
  filters: {},
  data() {
    return {
      loading: true,
      list: [],
      total: 0,
      query: {
        pageNo: 1,
        pageSize: 10,
        areaCode: undefined,
        areaName: undefined
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    // 获取列表
    async getList() {
      this.loading = true;
      const res = await fetchAreaPage(this.query);
      this.list = res.data;
      this.total = res.total;
      this.loading = false;
    },

    // 搜索
    handleFilter() {
      this.query.pageNo = 1;

      if (this.query.areaCode === '') {
        delete this.query.areaCode;
      }
      if (this.query.areaName === '') {
        delete this.query.areaName;
      }

      this.getList();
    },

    handleImport() {}
  }
};
</script>

<style lang="scss" scoped>
.c-main {
  background-color: #fff;
  padding: 0px 10px 5px 10px;
}
</style>
