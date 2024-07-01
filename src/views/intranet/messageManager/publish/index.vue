<template>
  <div class="step-content">
    <p class="page-title">发布消息</p>
    <el-steps
      :active="currentStep"
      finish-status="success"
      align-center
      class="step-bar"
    >
      <el-step title="填写消息推送量"></el-step>
      <el-step title="填写发布原因"></el-step>
      <el-step title="提交发布请求成功"></el-step>
    </el-steps>
    <router-view></router-view>
  </div>
</template>
<script>
export default {
  watch: {
    $route: {
      handler(newRoute) {
        const { name } = newRoute || {};
        switch (name) {
          case "messageManagerPublishOne":
            this.currentStep = 0;
            break;
          case "messageManagerPublishTwo":
            this.currentStep = 1;
            break;
          case "messageManagerPublishThree":
            this.currentStep = 2;
            break;
        }
      },
      immediate: true
    }
  },
  data() {
    return {
      currentStep: 0
    };
  },
  methods: {},
  name: "messageManagerPublish"
};
</script>
<style lang="scss" scoped>
.step-content {
  margin: 0 20px;
  padding: 20px;
  background: #fff;
  min-height: calc(100vh - 100px);
  position: relative;
  .page-title {
    font-size: 16px;
    line-height: 24px;
    font-weight: 600;
    padding-left: 12px;
    display: flex;
    align-items: center;
    &::before {
      content: "";
      display: inline-block;
      width: 3px;
      height: 16px;
      background: #3c6ef0;
      margin-right: 10px;
    }
  }
  .step-bar {
    width: 80%;
    margin: 25px auto 70px;
  }
}
</style>
