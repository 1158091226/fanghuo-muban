<template>
  <el-select
    v-model="code"
    filterable
    :clearable="clearable"
    :multiple="multiple"
    :disabled="disabled"
    :placeholder="placeholder"
    :class="className"
    :popper-class="popperClassName"
    @change="change"
  >
    <el-option
      v-for="(v, k) in list"
      :key="k"
      :label="`${showCode ? v.code : ''} ${v.name}`"
      :value="v.code"
    />
  </el-select>
</template>

<script>
import { fetchDictionaryList } from '@/api/system';
export default {
  name: 'DictionarySelect',
  props: {
    type: {
      type: String,
      default: ''
    },
    value: {
      type: [String, Number, Array],
      default: ''
    },
    options: {
      type: Array,
      default: function() {
        return [];
      }
    },
    clearable: {
      type: Boolean,
      default: true
    },
    multiple: {
      type: Boolean,
      default: false
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
    },
    showCode: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      list: [],
      map: {}
    };
  },
  computed: {
    code: {
      get: function() {
        // return this.value + ''; // 传入数据并通过 +'' 转换为字符串类型
        
        // 2024-01-11 修复bug多选时，value为数组类型，导致无法选中；如果value为数组类型，直接返回
        if (this.value instanceof Array) {
          return this.value;
        } else {
          return this.value + '';
        }
      },
      set: function(v) {
        this.$emit('input', v); // 接口返回数据时回调input方法为下拉框赋值
      }
    }
  },
  created() {
    this.getList();
  },
  methods: {
    async getList() {
      if (this.type && this.type !== '') {
        // 获取本地字典，判断是否存在
        const dictionary = this.$store.getters.dictionary;
        if (dictionary[this.type]) {
          this.list = dictionary[this.type];
          return;
        }

        const data = {};
        data.code = this.type;
        const res = await fetchDictionaryList(data);
        this.list = res.data;

        // 更新到本地字典
        dictionary[this.type] = this.list;
        this.$store.dispatch('app/setDictionary', dictionary);
      } else {
        this.list = this.options;
      }

      this.list.forEach((v) => {
        this.map[v.code] = v.name;
      });
    },

    change(v) {
      this.$emit('change', v);
    }
  }
};
</script>
