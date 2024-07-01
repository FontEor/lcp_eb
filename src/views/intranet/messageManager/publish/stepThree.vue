<template>
  <div class="step-three-content">
    <div class="entrySuccess">
      <i class="el-icon-success"></i>
    </div>
    <p class="step-title">提交成功</p>
    <div class="step-des">
      <p>平台已邮件、京ME通知运营人员进行审批</p>
      <p>审批通过后发布内容生效</p>
    </div>
    <p>
      <el-button type="primary" @click="handleManagerMessage"
        >继续管理消息</el-button
      >
    </p>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  methods: {
    handleManagerMessage() {
      this.$router.push({
        name: "messageManagerBasicInfo",
        query: this.$route.query || {}
      });
    }
  },
  name: "messageManagerPublishThree"
};
</script>
<style lang="scss" scoped>
.step-three-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  .entrySuccess {
    font-size: 46px;
    color: #60ca02;
  }
  .step-title {
    font-weight: 600;
    font-size: 20px;
  }
  .step-des {
    padding: 16px 0 24px 0;
    text-align: center;
    line-height: 26px;
  }
}
</style>
