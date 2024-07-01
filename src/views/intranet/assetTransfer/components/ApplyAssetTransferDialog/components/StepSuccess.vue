<template>
  <section class="step-success">
    <i class="el-icon-success" />
    <p>资产交接申请提交成功！</p>
    <p>你可以在【京ME/ERP-流程中心】查看申请进度。</p>
  </section>
</template>

<script>
export default {
  name: "StepSuccess",
};
</script>

<style lang="scss" scoped>
.step-success {
  text-align: center;

  .el-icon-success {
    margin-bottom: 8px;
    font-size: 48px;
    color: #26a872;
  }
}
</style>