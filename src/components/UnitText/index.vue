<template>
  <span>
    <i v-if="!text" class="el-icon-loading" />{{ text }}
  </span>
</template>

<script>
import { fetchUnitTree } from '@/api/system';
export default {
  name: 'UnitText',
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      tree: [],
      text: ''
    };
  },
  computed: {
  },
  watch: {
    value() {
      this.text = '';
      this.getList();
    }
  },
  created() {
    this.getList();
  },
  methods: {

    async getList() {
      if (this.value == '') {
        return;
      }
      const res = await fetchUnitTree();
      this.tree = res.data;
      this.getChecked(this.value);
    },

    getName(data, code) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].bnCode === code) {
          let temp = '';
          if (code.length > 2) {
            temp += '/';
          }
          temp += data[i].bnName;
          this.text += temp;
          break;
        }

        if (data[i].bnCode !== code && data[i].childList != undefined) {
          this.getName(data[i].childList, code);
        }
      }
    },

    // 格式
    getChecked(code) {
      const code_2 = code.length > 0 ? code.substr(0, 2) : 0;
      const code_4 = code.length > 2 ? code.substr(0, 4) : 0;
      const code_6 = code.length > 4 ? code.substr(0, 6) : 0;
      const code_9 = code.length > 6 ? code.substr(0, 9) : 0;
      const code_12 = code.length > 9 ? code.substr(0, 12) : 0;
      const code_15 = code.length > 12 ? code.substr(0, 15) : 0;
      const code_18 = code.length > 15 ? code.substr(0, 18) : 0;

      if (code_2 !== 0) {
        this.getName(this.tree, code_2);
      }

      if (code_4 !== 0) {
        this.getName(this.tree, code_4);
      }

      if (code_6 !== 0) {
        this.getName(this.tree, code_6);
      }

      if (code_9 !== 0) {
        this.getName(this.tree, code_9);
      }

      if (code_12 !== 0) {
        this.getName(this.tree, code_12);
      }

      if (code_15 !== 0) {
        this.getName(this.tree, code_15);
      }

      if (code_18 !== 0) {
        this.getName(this.tree, code_18);
      }
    }

  }
};
</script>
