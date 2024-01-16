<template>
  <!-- <el-select v-model="code" filterable :clearable="clearable" :multiple="multiple" :disabled="disabled" :placeholder="placeholder">
    <el-option v-for="(v, k) in list" :key="k" :label="v.name" :value="v.code" />
  </el-select> -->

  <el-radio-group v-model="code" :disabled="disabled" v-on="$listeners">
    <el-radio v-for="(v, k) in list" :key="k" :label="v.code">{{ v.name }}</el-radio>
  </el-radio-group>

</template>

<script>
import { fetchDictionaryList } from '@/api/system';
export default {
  name: 'DictionaryRadio',
  props: {
    type: {
      type: String,
      default: ''
    },
    value: {
      type: String,
      default: ''
    },
    options: {
      type: Array,
      default: function() {
        return [];
      }
    },
    disabled: {
      type: Boolean,
      default: false
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
        return this.value + ''; // 传入数据并通过 +'' 转换为字符串类型
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

      this.list.forEach(v => {
        this.map[v.code] = v.name;
      });
    },
    change() {

    }

  }
};
</script>
