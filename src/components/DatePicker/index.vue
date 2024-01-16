<template>
  <div>
    <el-date-picker class="mr10 w150" v-model="startTime" :type="type" :placeholder="placeholderArr[0]" :value-format="valueFormat" @change="handleChange" :picker-options="disabledStartDate">
    </el-date-picker>
    <el-date-picker class="w150" v-model="endTime" :type="type" :placeholder="placeholderArr[1]" :value-format="valueFormat" @change="handleChange" :picker-options="disabledEndDate">
    </el-date-picker>
  </div>
</template>
<script>
export default {
  name: "DatePicker",
  props: {
    type: {
      type: String,
      default: "",
    },
    valueFormat: {
      type: String,
      default: "",
    },
    dateObj: {
      type: Object,
      default: () => {
        return { startTime: "", endTime: "" };
      },
    },
    placeholderArr: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      startTime: this.dateObj.startTime,
      endTime: this.dateObj.endTime,
      disabledStartDate: this.pickerStartDate(),
      disabledEndDate: this.pickerEndDate(),
    };
  },
  methods: {
    pickerStartDate() {
      var _this = this;
      return {
        disabledDate(time) {
          let end = _this.endTime;
          if (!end) return;
          if (_this.type == "year") {
            return time.getFullYear() >= end;
          } else if ((_this.type = "date")) {
            return time.getTime() >= new Date(end).getTime() - 8.64e7;
          }
        },
      };
    },

    pickerEndDate() {
      let _this = this;
      return {
        disabledDate(time) {
          let start = _this.startTime;
          if (!start) return;
          if (_this.type == "year") {
            return time.getFullYear() <= start;
          } else if (_this.type == "date") {
            return time.getTime() <= new Date(start).getTime();
          }
        },
      };
    },
    handleChange() {
      this.$emit("handleChange", {
        startTime: this.startTime,
        endTime: this.endTime,
      });
    },
  },
};
</script>
<style scoped>
.mr10 {
  margin-right: 10px;
}
</style>