<!--
 * @Author: 叶述妙
 * @Date: 2022-11-09 08:34:50
 * @LastEditors: linguoxie2 171742691@qq.com
 * @LastEditTime: 2024-08-08 17:24:59
-->
<template>
  <div>
    <el-dialog
      title="视频连线"
      :visible.sync="show"
      width="80%"
      append-to-body="true"
      @close="close"
    >
      <iframe
        :src="iframeUrl"
        frameborder="0"
        class="video-connection-iframe"
        allow="camera;microphone"
      ></iframe>
      <div slot="footer">
        <el-button type="primary" @click="videoData.show=false;show = false"
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
      show: false,
    };
  },
  mounted() {
    this.getVideoIframe();
  },
  methods: {
    close(){
      this.videoData.show = false;
    },
    getVideoIframe: function (receiveUserId, Name) {
      // userid：发送方 平台名称 + 用户id/电话
      // username：发送方 姓名
      // receiveuserid: 接收方电话
      // receivename： 接收方名称
      // channel: 渠道 ，不传默认zlsk
      // 判断是https还是http
      let protocol = window.location.protocol;
      let isHttps = protocol === "https:" ? true : false;
      let url =
        "https://www.zlskgroup.com/zlskpublic/#/index?" +
        "userid=" + "jiangximergeshow" + this.videoData.id +
        "&username=" + this.videoData.username +
        "&receiveuserid=" + this.videoData.tel +
        "&receivename=" + this.videoData.name;
      let isBlank = this.CommonConst.videoConnectionBlank; // undefined, true, false
      console.log("isBlank:", isBlank,isBlank == undefined, isHttps)

      if (isBlank || (!isHttps && isBlank == undefined)) {
          this.close();
          window.open(url);
          return false;
        }
        this.show = true;
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
