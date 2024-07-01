<template>
  <div class="step-finish">
    <div class="step-finish__icon-wrapper">
      <i class="el-icon-success" />
    </div>
    <p class="step-finish__title">消息添加成功</p>
    <p class="step-finish__tip">接下来您可以编辑消息文档</p>
    <div class="step-finish__button-wrapper">
      <el-button @click="$emit('clickBackToMessageListButton')"
        >返回消息列表</el-button
      >
      <el-button type="primary" @click="$emit('clickEditMessageDocumentButton')"
        >编辑消息文档</el-button
      >
    </div>
  </div>
</template>

<script>
export default {
  name: "StepFinish",
};
</script>

<style lang="scss" scoped>
.step-finish {
  .step-finish__icon-wrapper {
    text-align: center;

    .el-icon-success {
      font-size: 64px;
      color: #26a872;
    }
  }

  .step-finish__title {
    margin-bottom: 16px;
    font-size: 24px;
    text-align: center;
  }

  .step-finish__tip {
    margin-bottom: 16px;
    text-align: center;
  }

  .step-finish__button-wrapper {
    display: flex;
    justify-content: center;
  }
}
</style>