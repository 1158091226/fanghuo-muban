<!--
 * @Author: 叶述妙
 * @Date: 2022-11-09 08:34:50
 * @LastEditors: 叶述妙
 * @LastEditTime: 2022-12-05 18:25:14
-->
<template>
  <div>
    <el-dialog
      title="视频连线"
      :visible.sync="videoData.show"
      width="80%"
      append-to-body="true"
    >
      <iframe
        :src="iframeUrl"
        frameborder="0"
        class="video-connection-iframe"
        allow="camera;microphone"
      ></iframe>
      <div slot="footer">
        <el-button type="primary" @click="videoData.show = false"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    videoData: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      iframeUrl: "",
    };
  },
  mounted() {
    this.getVideoIframe();
  },
  methods: {
    getVideoIframe: function (receiveUserId, Name) {
      var rid = parseInt(Math.random() * 100000);
      var userId = 11; //LZBaseInfoManage.Config.UserInfo.Account//.
      var url =
        "https://videotrtc.zhlzz.com/jiangxi/index.html?userid=" +
        this.videoData.id +
        "&receiveuserid=" +
        this.videoData.tel +
        "&rid=" +
        rid +
        "&receivename=" +
        this.videoData.name;
      this.iframeUrl = url;
    },
  },
};
</script>

<style lang="stylus" scoped>
.video-connection-iframe
  width 100%
  min-height 500px
</style>
