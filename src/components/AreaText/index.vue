<template>
  <span> {{ text }} </span>
</template>

<script>
import { getAreaThisAndChild } from '@/api/system';
import { dictLookup, flattenTreeData } from '@/utils';
export default {
  name: 'AreaText',
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      tree: [],
      text: '',
      allTree: []
    };
  },
  computed: {},
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
      this.allTree = flattenTreeData(
        JSON.parse(sessionStorage.getItem('areaTree'))
      );
      this.text = dictLookup(this.allTree, this.value, 'areaCode', 'areaName');
      // if (this.value == '') {
      //   return;
      // }
      // const data = {};
      // data.areaCode = this.value;
      // const res = await getAreaThisAndChild(data);
      // if (!res) {
      //   this.text = '';
      // } else {
      //   this.tree = res.data.AreaData;
      //   this.getChecked(this.value);
      // }
    },

    getName(data, code) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].areaCode === code) {
          let temp = '';
          // if (code.length > 2) {
          //   temp += "/";
          // }
          temp += data[i].areaName;
          this.text += temp;
          break;
        }

        if (data[i].areaCode !== code && data[i].sysAreaList != undefined) {
          this.getName(data[i].sysAreaList, code);
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
