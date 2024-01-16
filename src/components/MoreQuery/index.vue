<!-- 搜索栏更多功能的组件 -->
<template>
  <div class="more-query">
    <div class="title-box">
      <div class="text">更多条件查询</div>
      <div
        class="add-box"
        :style="{ marginRight: isRolling ? '18px' : '14px' }"
        @click="addClick"
      >
        <img class="img" src="@/static/templateImages/add-off.png" alt="">
      </div>
    </div>

    <div ref="contentbox" class="content-box">
      <div
        v-for="(item, index) in selectList"
        :key="index"
        class="content-item"
      >
        <div class="select-box">
          <el-select
            v-model="item.parameter"
            placeholder="请选择"
            style="flex: 1"
          >
            <el-option
              v-for="item in optionsParameter"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-select
            v-model="item.requirement"
            placeholder="请选择"
            style="flex: 1; margin-left: 12px"
          >
            <el-option
              v-for="item in optionRequirement"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-input
            v-model="item.value"
            placeholder="请输入内容"
            style="flex: 1; margin-left: 12px"
          />
        </div>
        <div class="delete-box" @click="deleteClick(index)">
          <img
            class="img"
            src="@/static/templateImages/reduce-off.png"
            alt=""
          >
        </div>
      </div>
    </div>

    <div class="foot-box">
      <el-button style="flex: 1" @click="resetClick">重置</el-button>
      <el-button
        style="flex: 1"
        type="primary"
        @click="queryClick"
      >查询</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      optionsParameter: [
        { label: '名称', value: 'name' },
        { label: '负责人', value: 'responsible' },
        { label: '负责人电话', value: 'responsibleTel' },
        { label: '面积(亩)', value: 'acreage' },
        { label: '人口(人)', value: 'population' }
      ],
      optionRequirement: [{ label: 'like', value: 'like' }],
      selectList: [
        {
          parameter: '',
          requirement: '',
          value: ''
        }
      ],
      isRolling: false
    };
  },

  // components: {},

  // watch: {},

  // computed: {},

  // created(){},

  // mounted(){},

  methods: {
    addClick() {
      this.selectList.push({
        parameter: '',
        requirement: '',
        value: ''
      });
      this.$nextTick(() => {
        let contentbox = document.getElementsByClassName('content-box');
        if (contentbox[0].scrollHeight >= 484) {
          this.isRolling = true;
        } else {
          this.isRolling = false;
        }
      });
    },

    deleteClick(index) {
      this.selectList.splice(index, 1);
    },

    resetClick() {
      this.selectList = [
        {
          parameter: '',
          requirement: '',
          value: ''
        }
      ];
    },
    queryClick() {
      console.log(`output->this.selectList`, this.selectList);
      this.$emit('returnMoreQuery', this.selectList);
    }
  }
};
</script>

<style lang="scss" scoped>
.more-query {
  width: 100%;
  height: 600px;
  position: relative;
  .title-box {
    height: 54px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: -12px;
    border-bottom: 1px solid rgb(236, 236, 236);
    .text {
      font-size: 16px;
      color: rgba(0, 0, 0, 0.9);
      font-weight: 600;
    }
    .add-box {
      width: 15px;
      height: 15px;
      border: 1px solid #666666;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      margin-right: 14px;
      .img {
        width: 70%;
        height: 70%;
      }
    }
  }
  .content-box {
    max-height: 484px;
    overflow-y: auto;
    .content-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 64px;
      border-bottom: 1px solid rgb(236, 236, 236);
      .select-box {
        display: flex;
        width: 90%;
      }
      .delete-box {
        width: 15px;
        height: 15px;
        border: 1px solid #666666;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        // margin-left: 38px;
        margin-right: 14px;
        .img {
          width: 70%;
          height: 2px;
        }
      }
    }
  }

  .foot-box {
    width: 100%;
    display: flex;
    height: 64px;
    align-items: center;
    margin-top: 10px;
    position: absolute;
    left: 0;
    bottom: -12px;
    // box-shadow: 0px -8px 10px -5px rgba(0, 0, 0, 0.08);
    // box-shadow: 0px -16px 24px 2px rgba(0, 0, 0, 0.04);
    // box-shadow: 0px -6px 30px 5px rgba(0, 0, 0, 0.05);
    // border-radius: 0px 0px 6px 6px;
  }

  ::v-deep .el-input--medium .el-input__inner {
    height: 32px;
    line-height: 32px;
    color: rgba(0, 0, 0, 0.9);
  }

  ::v-deep .el-input--medium .el-input__icon {
    line-height: 32px;
  }

  ::v-deep .el-cascader .el-input .el-icon-arrow-down {
    height: 32px;
  }

  ::v-deep .el-cascader--medium {
    line-height: 32px;
  }
}
</style>
