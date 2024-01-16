<template>
  <el-cascader
    ref="cascader"
    v-model="areas"
    :props="props"
    :disabled="disabled"
    :placeholder="placeholder"
    :class="className"
    :popper-class="popperClassName"
    :clearable="clearable"
    @change="change"
  />
</template>

<script>
import {
  fetchAreaTree,
  fetchAreaTreeChildren,
  fetchAreaList,
} from "@/api/system";
import { isArray } from "@/utils/validate";
// import defaultSettings from '@/settings';

export default {
  name: "AreaSelect",
  props: {
    value: {
      type: String,
      default: "",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
      default: "请选择",
    },
    className: {
      type: String,
      default: "",
    },
    popperClassName: {
      type: String,
      default: "",
    },
    isAllTree: {
      type: Boolean,
      default: true,
    },
    clearable: {
      type: Boolean,
      default: false,
    },
    // 控制清空后时候要恢复长度或者说清空宽度
    isWidthZero: {
      type: Boolean,
      default: true,
    },
    // 控制层级
    levelData: {
      type: String,
      default: "",
    },
  },
  data() {
    let allTreeData = this.$store.getters.allTreeData;
    return {
      tree: [],
      props: {
        checkStrictly: true,
        expandTrigger: "hover",
        value: "areaCode",
        label: "areaName",
        children: "sysAreaList",
        lazy: true,
        lazyLoad: this.lazyLoad,
      },
      codes: [],
    };
  },
  computed: {
    areas: {
      get: function () {
        if (this.value !== undefined && !isArray(this.value)) {
          return this.getAreaChecked(this.value);
        } else {
          return this.codes;
        }
      },
      set: function (v) {
        if (!v.length && this.isWidthZero) {
          this.$refs["cascader"].$el.style.width = "";
        }
        this.codes = v;
      },
    },
  },
  watch: {
    // areas(v) {
    //   this.keys++;
    // },
  },
  created() {},
  beforeDestroy() {
    this.tree = null;
  },
  methods: {
    promisFunction(ms) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(true);
        }, ms);
      });
    },

    async lazyLoad(node, resolve) {
      let allTreeData = this.$store.getters.allTreeData;
      if (node.level == 0) {
        await this.promisFunction(500);
        resolve([{ areaName: "江西省", areaCode: "36", sysAreaList: [] }]);
      } else {
        if (allTreeData.length < 1) {
          const res = await fetchAreaList();
          this.$store.dispatch("app/setAllTreeData", res.data);
          allTreeData = res.data;
        }
        let arr = allTreeData.filter((obj) => obj.parentAreaCode == node.value);
        arr.forEach((item) => {
          let itemArr = [];
          itemArr = allTreeData.filter(
            (obj) => obj.parentAreaCode == item.areaCode
          );
          if (this.levelData) {
            item.leaf =
              node.level == this.levelData ? true : !itemArr.length > 0;
          } else {
            item.leaf = !itemArr.length > 0;
          }
        });
        this.$nextTick(() => resolve(arr));
      }
    },
    recursion(data) {
      for (let i in data) {
        if (data[i].areaLevelNum == 3) delete data[i].sysAreaList;
        data[i].sysAreaList &&
          data[i].sysAreaList.length &&
          this.recursion(data[i].sysAreaList);
      }
      return data;
    },

    async getList() {
      const res = await fetchAreaTree();
      const arr = this.formatAreas(res.data.AreaData);
      if (!this.isAllTree && this.$store.getters.level == 3) {
        delete arr[0].sysAreaList;
      }
      this.tree = arr;
      // console.log(this.tree);
    },

    // 获取当前用户完整区划树
    async getAreaTree() {
      const level = this.$store.getters.level;
      const areaCode = this.$store.getters.areaCode;
      const res = await fetchAreaList();
      const resData = res.data;

      // 显示几级
      const showLevel = 5;

      const obj = {};
      for (let i = level; i < showLevel + 1; i++) {
        obj[i] = [];
      }
      resData.forEach((item) => {
        if (item.areaLevelNum == showLevel) delete item.sysAreaList;
        if (item.areaLevelNum >= level) {
          if (
            item.areaLevelNum !== showLevel &&
            item.sysAreaList === undefined
          ) {
            item.sysAreaList = [];
          }
          obj[item.areaLevelNum].push(item);
        }
      });
      const len = level + 1;
      for (let i = showLevel + 1; i > len; i--) {
        const pArr = obj[i - 2];
        const arr = obj[i - 1];
        pArr.forEach((item) => {
          arr.forEach((item2) => {
            if (item.areaCode == item2.parentAreaCode) {
              item.sysAreaList.push(item2);
            }
          });
        });
      }

      let arr = [];
      for (var key in obj) {
        arr = obj[key].filter((item) => item.areaCode == areaCode);
        this.$store.dispatch("app/setAllTreeData", resData);
        break;
      }

      if (arr.length > 0) {
        this.tree = arr;
      }
    },

    /* async getListChildren(data, code, child) {
      child = child || [];

      if (child.length < 1) {
        const query = {};
        query.areaCode = code;
        const res = await fetchAreaTreeChildren(query);
        child = res.data;
      }

      for (let i = 0; i < data.length; i++) {
        if (data[i].areaCode === code) {
          this.$set(data[i], 'sysAreaList', child);
          break;
        }

        if (data[i].areaCode !== code && data[i].sysAreaList !== undefined) {
          data[i].sysAreaList.leaf = false;
          this.getListChildren(data[i].sysAreaList, code, child);
        }
      }
    }, */

    // 格式区划代码列表，删除sysAreaList为空的键
    formatAreas(data) {
      data.forEach((v, k) => {
        if (v.sysAreaList.length > 0) {
          this.formatAreas(v.sysAreaList);
        } else {
          delete v.sysAreaList;
        }
      });
      return data;
    },

    // 格式
    getAreaChecked(code) {
      const arr = [];
      arr.push(code.substr(0, 2));
      code.length > 2 ? arr.push(code.substr(0, 4)) : 0;
      code.length > 4 ? arr.push(code.substr(0, 6)) : 0;
      code.length > 6 ? arr.push(code.substr(0, 9)) : 0;
      code.length > 9 ? arr.push(code.substr(0, 12)) : 0;
      code.length > 12 ? arr.push(code.substr(0, 15)) : 0;
      code.length > 15 ? arr.push(code.substr(0, 18)) : 0;
      const _arr = arr.slice(this.$store.getters.level - 1, arr.length);
      this.codes = _arr;
      return _arr;

      // const level = this.$store.getters.level;

      // const code_2 = code.substr(0, 2);
      // const code_4 = code.length > 2 ? code.substr(0, 4) : 0;
      // const code_6 = code.length > 4 ? code.substr(0, 6) : 0;
      // const code_9 = code.length > 6 ? code.substr(0, 9) : 0;
      // const code_12 = code.length > 9 ? code.substr(0, 12) : 0;
      // const code_15 = code.length > 12 ? code.substr(0, 15) : 0;
      // const code_18 = code.length > 15 ? code.substr(0, 18) : 0;

      // const num = [];

      // //
      // if (level === 1) {
      //   num.push(code_2);
      // }

      // if (code_4 !== 0 && level <= 2) {
      //   num.push(code_4);
      // }

      // if (code_6 !== 0 && level <= 3) {
      //   this.getListChildren(this.tree, code_4);
      //   num.push(code_6);
      // }

      // if (code_9 !== 0) {
      //   this.getListChildren(this.tree, code_6);
      //   num.push(code_9);
      // }

      // if (code_12 !== 0) {
      //   this.getListChildren(this.tree, code_9);
      //   num.push(code_12);
      // }

      // if (code_15 !== 0) {
      //   this.getListChildren(this.tree, code_12);
      //   num.push(code_15);
      // }

      // if (code_18 !== 0) {
      //   this.getListChildren(this.tree, code_15);
      //   num.push(code_18);
      // }
      // this.codes = num;

      // return num;
    },

    // 自动宽度
    autoWidth() {
      if (!this.$refs["cascader"].getCheckedNodes()[0]) {
        return;
      }
      // 获取选中的节点
      const arr = this.$refs["cascader"].getCheckedNodes()[0].pathLabels;

      // 获取当前元素样式
      const className = this.$refs["cascader"].$el.className;

      // 宽度自动计算的样式
      const autoWidth = [
        "filter-item", // 列表筛选里的组件
      ];

      let flag = false;
      autoWidth.forEach((v) => {
        if (className.indexOf(v) != -1) {
          flag = true;
        }
      });
      // 判断是否存在需要自动计算样式中
      if (flag) {
        const str = arr.join(" / ");
        let num = 0;
        for (var i = str.length - 1; i >= 0; i--) {
          const code = str.charCodeAt(i);
          if (code > 255) {
            // 字符编码大于255，说明是双字节字符
            // console.log('中文');
            num += 14;
          } else {
            // console.log('英文');
            num += 4;
          }
        }
        this.$refs["cascader"].$el.style.width = num + 57 + "px";
      }
    },

    change(v) {
      this.$emit("change", v);

      // 自动宽度
      this.autoWidth();

      // 选择后立即关闭对话框
      this.$refs["cascader"].dropDownVisible = false;
    },
  },
};
</script>
