<template>
  <div :class="{ hidden: hidden }" class="pagination-container">
    <div class="statistics-text">
      共{{ total }}条&nbsp;第{{ currentPage }}/{{
        Math.ceil(total / pageSize)
      }}页
    </div>
    <el-pagination
      :background="background"
      :current-page.sync="currentPage"
      :page-size.sync="pageSize"
      :layout="layout"
      :page-sizes="pageSizes"
      :total="total"
      :pager-count="5"
      :small="isSmall"
      v-bind="$attrs"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import { scrollTo } from '@/utils/scroll-to';

export default {
  name: 'Pagination',
  props: {
    total: {
      required: true,
      type: Number
    },
    page: {
      type: Number,
      default: 1
    },
    limit: {
      type: Number,
      default: 20
    },
    pageSizes: {
      type: Array,
      default() {
        return [10, 50, 100, 200];
      }
    },
    layout: {
      type: String,
      default: 'sizes, prev, pager, next, jumper'
      // default: 'total, sizes, prev, pager, next, jumper'
    },
    background: {
      type: Boolean,
      default: true
    },
    autoScroll: {
      type: Boolean,
      default: true
    },
    isSmall: {
      type: Boolean,
      default: false
    },
    hidden: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    currentPage: {
      get() {
        return this.page;
      },
      set(val) {
        this.$emit('update:page', val);
      }
    },
    pageSize: {
      get() {
        return this.limit;
      },
      set(val) {
        this.$emit('update:limit', val);
      }
    }
  },
  methods: {
    handleSizeChange(val) {
      this.$emit('pagination', { page: this.currentPage, limit: val });
      if (this.autoScroll) {
        scrollTo(0, 800);
      }
    },
    handleCurrentChange(val) {
      this.$emit('pagination', { page: val, limit: this.pageSize });
      if (this.autoScroll) {
        scrollTo(0, 800);
      }
    }
  }
};
</script>

<style scoped>
.pagination-container {
  background: #fff;
  padding: 0px 0px;
  margin-top: 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.statistics-text {
  color: rgba(0, 0, 0, 0.6);
  font-size: 14px;
  font-weight: 400;
}
.pagination-container.hidden {
  display: none;
}
</style>
