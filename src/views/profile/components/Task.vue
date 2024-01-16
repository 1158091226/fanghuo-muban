<template>
  <!-- <el-form>
    <el-form-item label="Name">
      <el-input v-model.trim="user.name" />
    </el-form-item>
    <el-form-item label="Email">
      <el-input v-model.trim="user.email" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit">Update</el-button>
    </el-form-item>
  </el-form> -->

  <el-form ref="taskForm" :model="taskForm" :rules="taskRules" label-width="80px">
    <el-form-item :label="'当前'+$t('forest.dataSource')" prop="source">
      <dictionary-select v-model="taskForm.source" type="dataSource" :show-code="false" :placeholder="'请选择'+$t('forest.dataSource')" :clearable="false" class="right-menu-item" style="width:300px" />
    </el-form-item>
    <el-form-item :label="'当前'+$t('forest.nian_du')" prop="year">
      <el-date-picker v-model="taskForm.year" type="year" :placeholder="'请选择'+$t('forest.nian_du')" :clearable="false" format="yyyy 年" value-format="yyyy" style="width:300px" />
    </el-form-item>
    <el-form-item v-if="parseInt(taskForm.year) > 2022" :label="'当前'+$t('forest.sj_bq')" prop="phase">
      <dictionary-select v-model="taskForm.phase" type="forest_sj_bq" :show-code="false" :placeholder="'请选择'+$t('forest.sj_bq')" :clearable="false" class="right-menu-item" style="width:300px" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitTask">{{ $t('forest.confirm') }}</el-button>
    </el-form-item>
  </el-form>

</template>

<script>
import DictionarySelect from '@/components/DictionarySelect';
export default {
  components: { DictionarySelect },
  props: {

  },
  data() {
    return {
      taskForm: {
        year: this.$store.state.app.useYear,
        phase: this.$store.state.app.usePhase,
        source: this.$store.state.app.useSource
      },
      taskRules: {
        year: [
          { required: true, message: '请选择年版', trigger: 'change' }
        ],
        phase: [
          { required: true, message: '请选择期数', trigger: 'change' }
        ],
        source: [
          { required: true, message: '请选择图层', trigger: 'change' }
        ]
      }
    };
  },
  methods: {
    submitTask() {
      this.$refs['taskForm'].validate(async(valid) => {
        if (valid) {
          const temp = {};
          temp.id = this.$store.getters.userId;
          temp.tblx = this.taskForm.source;
          temp.yearNo = this.taskForm.year;
          temp.sjBq = this.taskForm.phase;
          await this.$store.dispatch('app/setUse', temp);
          this.$notify({
            title: '成功',
            message: '提交成功',
            type: 'success',
            duration: 2000
          });
        }
      });
    }
  }
};
</script>
