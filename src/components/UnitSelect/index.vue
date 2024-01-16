<template>
  <el-cascader ref="cascader" v-model="list" :options="tree" :props="props" :disabled="disabled" :placeholder="placeholder" :class="className" :popper-class="popperClassName" @change="change" />
</template>

<script>
import { fetchUnitTree } from '@/api/system';
import { isArray } from '@/utils/validate';
export default {
  name: 'UnitSelect',
  props: {
    value: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: '请选择'
    },
    className: {
      type: String,
      default: ''
    },
    popperClassName: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      tree: [],
      props: {
        checkStrictly: true,
        expandTrigger: 'hover',
        value: 'bnCode',
        label: 'bnName',
        children: 'childList'
        /* lazy: true,
        lazyLoad(node, resolve) {
          const { level, data } = node
          if (level > 1) {
            const query = {}
            query.areaCode = data.areaCode
            fetchTreeChildren(query).then(response => {
              resolve(response.data)
            })
          } else {
            resolve([])
          }
        } */
      },
      codes: []
    };
  },
  computed: {
    list: {
      get: function() {
        if (this.value !== undefined && !isArray(this.value)) {
          return this.getChecked(this.value);
        } else {
          return this.codes;
        }
      },
      set: function(v) {
        if (!v.length) this.$refs['cascader'].$el.style.width = '';
        this.codes = v;
      }
    }
  },
  created() {
    this.getList();
  },
  methods: {

    async getList() {
      const res = await fetchUnitTree();
      this.tree = this.format(res.data);
    },

    /* async getListChildren(data, code, child) {
      child = child || []

      if (child.length < 1) {
        const query = {}
        query.areaCode = code
        const res = await fetchTreeChildren(query)
        child = res.data
      }

      for (let i = 0; i < data.length; i++) {
        if (data[i].areaCode === code) {
          this.$set(data[i], 'sysAreaList', child)
          break
        }

        if (data[i].areaCode !== code && data[i].sysAreaList != undefined) {
          data[i].sysAreaList.leaf = false
          this.getListChildren(data[i].sysAreaList, code, child)
        }
      }
    }, */

    // 格式区划代码列表，删除sysAreaList为空的键
    format(data) {
      data.forEach((v, k) => {
        if (v.childList.length > 0) {
          this.format(v.childList);
        } else {
          delete v.childList;
        }
      });
      return data;
    },

    // 格式
    getChecked(code) {
      const code_2 = code.substr(0, 2);
      const code_4 = code.length > 2 ? code.substr(0, 4) : 0;
      const code_6 = code.length > 4 ? code.substr(0, 6) : 0;
      const code_9 = code.length > 6 ? code.substr(0, 9) : 0;
      const code_12 = code.length > 9 ? code.substr(0, 12) : 0;
      const code_15 = code.length > 12 ? code.substr(0, 15) : 0;
      const code_18 = code.length > 15 ? code.substr(0, 18) : 0;
      const num = [];

      // 当数据只有一个时，一般为区县时
      if (this.tree[0] !== undefined && this.tree[0].childList === undefined) {
        num.push(code);
        this.codes = num;
        return num;
      }

      // 当数据第一层代码只有2位时，一般为省级用户，
      if (this.tree[0] !== undefined && this.tree[0].bnCode.length === 2) {
        num.push(code_2);
      }

      if (code_4 !== 0) {
        num.push(code_4);
      }

      if (code_6 !== 0) {
        num.push(code_6);
      }

      if (code_9 !== 0) {
        num.push(code_9);
      }

      if (code_12 !== 0) {
        num.push(code_12);
      }

      if (code_15 !== 0) {
        num.push(code_15);
      }

      if (code_18 !== 0) {
        num.push(code_18);
      }
      this.codes = num;

      return num;
    },

    // 自动宽度
    autoWidth() {
      if (this.$refs['cascader'].getCheckedNodes()[0] === undefined) {
        return;
      }

      // 获取选中的节点
      const arr = this.$refs['cascader'].getCheckedNodes()[0].pathLabels;

      // 获取当前元素样式
      const className = this.$refs['cascader'].$el.className;

      // 宽度自动计算的样式
      const autoWidth = [
        'filter-item', // 列表筛选里的组件
        'map-select' // 一张图里的组件
      ];

      let flag = false;
      autoWidth.forEach(v => {
        if (className.indexOf(v) != -1) {
          flag = true;
        }
      });

      // 判断是否存在需要自动计算样式中
      if (flag) {
        const str = arr.join(' / ');
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
        this.$refs['cascader'].$el.style.width = num + 57 + 'px';
      }
    },

    change(v) {
      this.$emit('change', v);

      // 自动宽度
      this.autoWidth();
    }

  }
};
</script>
