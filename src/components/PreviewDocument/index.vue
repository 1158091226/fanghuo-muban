<!-- 文书预览 -->
<template>
  <div>
    <el-dialog
      v-if="dialogVisible"
      :title="previewData.title || '文书预览'"
      :visible.sync="dialogVisible"
      width="794px"
      top="40px"
      :before-close="previewBtn"
    >
      文书预览
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'PreviewDocument',
  props: {
    previewData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      dialogVisible: this.previewData.visible
    };
  },
  created() {},
  methods: {
    previewBtn() {
      this.$emit('previewBtn', false);
    }
  }
};
</script>
