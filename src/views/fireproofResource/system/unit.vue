<template>
  <div class="app-container">
    <div class="filter-container">
      <area-select ref="area-filter" :value="query.areaCode" :placeholder="'请选择'+$t('unit.areaCode')" :class-name="'filter-item mr-10'" />
      <el-input v-model="query.bnName" :placeholder="'请输入'+$t('unit.bnName')" class="filter-item mr-10" style="width:200px;" @keyup.enter.native="handleFilter" />
      <el-input v-model="query.bnCode" :placeholder="'请输入'+$t('unit.bnCode')" class="filter-item mr-10" style="width:200px;" @keyup.enter.native="handleFilter" />
      <el-button v-waves type="primary" class="filter-item" icon="el-icon-search" @click="handleFilter">
        {{ $t('table.search') }}
      </el-button>
    </div>
    <el-table v-loading="loading" :data="list" border fit highlight-current-row style="width: 100%;">
      <el-table-column type="index" :label="$t('unit.id')" width="80" />
      <el-table-column :label="$t('unit.areaCode')">
        <template slot-scope="{row}">
          <!-- <area-text v-if="row.xian !== ''" :value="row.xian" />
          <area-text v-else-if="row.shi !== ''" :value="row.shi" />
          <area-text v-else :value="row.sheng" /> -->
          <area-text :value="row.bnCode" />
        </template>
      </el-table-column>
      <el-table-column :label="$t('unit.bnName')">
        <template slot-scope="{row}">
          {{ row.bnName }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('unit.bnCode')">
        <template slot-scope="{row}">
          {{ row.bnCode }}
        </template>
      </el-table-column>

    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="query.pageNo" :limit.sync="query.pageSize" @pagination="getList" />
  </div>
</template>

<script>
import { fetchUnitPage } from '@/api/system';
import AreaText from '@/components/AreaText';
import AreaSelect from '@/components/AreaSelect';
import waves from '@/directive/waves';
import Pagination from '@/components/Pagination';
import { isArray } from '@/utils/validate';
import { permissionPath } from '@/utils';

const itemDefault = {
  id: undefined,
  bnCode: undefined,
  bnName: undefined,
  areaCode: undefined
};

export default {
  components: { AreaText, AreaSelect, Pagination },
  directives: { waves },
  filters: {
  },
  data() {
    return {
      loading: true,
      path: '',
      item: {},
      list: [],
      total: 0,
      query: {
        pageNo: 1,
        pageSize: 10,
        areaCode: undefined,
        bnCode: undefined,
        bnName: undefined
      }
    };
  },
  created() {
    this.path = permissionPath(this.$route.path);

    this.getList();
  },
  methods: {

    // 获取列表
    async getList() {
      this.loading = true;
      const res = await fetchUnitPage(this.query);
      this.list = res.data;
      this.total = res.total;
      this.loading = false;
    },

    // 搜索
    handleFilter() {
      this.query.pageNo = 1;
      const codes = this.$refs['area-filter'].codes;
      if (isArray(codes)) {
        this.query.areaCode = codes.pop();
      }
      if (this.query.bnCode === '') {
        delete (this.query.bnCode);
      }
      if (this.query.bnName === '') {
        delete (this.query.bnName);
      }
      this.getList();
    }

  }
};
</script>

<style lang="scss" scoped>
</style>
