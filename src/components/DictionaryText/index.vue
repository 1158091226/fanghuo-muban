<template>
  <span>
    <i v-if="loading" class="el-icon-loading" />
    {{ text || "-" }}
  </span>
</template>

<script>
import { fetchDictionaryList } from "@/api/system";
export default {
  name: "DictionaryText",
  props: {
    code: {
      type: String,
      default: "",
    },
    value: {
      type: [String, Number, Array],
      default: "",
    },
  },
  data() {
    return {
      list: [],
      text: "",
      loading: true,
    };
  },
  computed: {},
  watch: {
    value() {
      this.text = "";
      this.loading = true;
      this.getList();
    },
  },
  created() {
    this.getList();
  },
  methods: {
    async getList() {
      if (this.code == "") {
        return;
      }

      // 获取本地字典，判断是否存在
      const dictionary = this.$store.getters.dictionary;
      if (dictionary[this.code]) {
        this.list = dictionary[this.code];
        this.getName();
        return;
      }

      // // 这样写是避免循环创建应用多次这个组件，避免一直发送请求
      // if (!dictionary["isQuest" + this.code]) {
      //   dictionary["isQuest" + this.code] = true;
      //   this.$store.dispatch("app/setDictionary", dictionary);
      //   fetchDictionaryList({ code: this.code }).then((res) => {
      //     // 更新到本地字典
      //     dictionary[this.code] = res.data;
      //     dictionary["isQuest" + this.code] = false;
      //     this.$store.dispatch("app/setDictionary", dictionary);
      //     this.list = res.data;
      //     this.getName();
      //   });
      // }

      const data = {};
      data.code = this.code;
      const res = await fetchDictionaryList(data);
      this.list = res.data;
      this.getName();

      // 更新到本地字典
      dictionary[this.code] = this.list;
      this.$store.dispatch("app/setDictionary", dictionary);
    },

    getName() {
      // 判断thi.value是否为数组，如果是数组，遍历数组，如果是单个值，直接赋值
      // 2024-01-11 修复bug多选时，value为数组类型，导致无法选中值
      if (this.value instanceof Array) {
        this.text = this.value.map((v) => {
          for (let i = 0; i < this.list.length; i++) {
            if (this.list[i].code == v) {
              return this.list[i].name;
            }
          }
        }).join(",");
      } else {
        for (let i = 0; i < this.list.length; i++) {
          if (this.list[i].code == this.value) {
            this.text = this.list[i].name;
            break;
          }
        }
      }
      this.loading = false;
    },
  },
};
</script>
