<!-- @author zhengjie -->
<template>
  <div class="icon-body">
    <el-input v-model="name" style="position: relative;" clearable placeholder="请输入图标名称" @clear="filterIcons" @input.native="filterIcons">
      <i slot="suffix" class="el-icon-search el-input__icon" />
    </el-input>
    <ul class="icon-list">
      <li v-for="(item, index) in list" :key="index" @click="selectedIcon(item)">
        <i v-if="item.includes('el-icon')" :class="item" />
        <svg-icon v-else :icon-class="item" />
        <p>{{ item }}</p>
      </li>
    </ul>
  </div>
</template>

<script>
import svgIcons from './svg-icons';
import elementIcons from './element-icons';

export default {
  name: 'IconSelect',
  data() {
    return {
      name: '',
      list: [],
      svgIcons,
      elementIcons
    };
  },
  created() {
    this.list = this.svgIcons.concat(this.elementIcons);
  },
  methods: {
    filterIcons() {
      if (this.name) {
        this.list = this.list.filter(item => item.includes(this.name));
      } else {
        this.list = this.svgIcons.concat(this.elementIcons);
      }
    },
    selectedIcon(name) {
      this.$emit('selected', name);
      document.body.click();
    },
    reset() {
      this.name = '';
      this.list = this.svgIcons.concat(this.elementIcons);
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.icon-body {
  width: 100%;
  padding: 10px;
  .icon-list {
    height: 200px;
    overflow-y: scroll;
    margin: 0;
    padding: 0;
    border-left: 1px solid #dcdfe6;
    li {
      height: 75px;
      line-height: 30px;
      cursor: pointer;
      width: 33%;
      float: left;
      text-align: center;
      list-style: none;
      padding-top: 10px;
      border-right: 1px solid #dcdfe6;
      border-bottom: 1px solid #dcdfe6;
    }
    i,
    svg {
      display: inline-block;
      fill: currentColor;
      overflow: hidden;
      font-size: 24px;
      width: 100%;
      vertical-align: top;
    }
    p {
      margin: 0;
    }
  }
}
</style>
