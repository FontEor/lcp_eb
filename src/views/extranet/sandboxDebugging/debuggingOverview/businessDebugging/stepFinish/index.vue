<template>
  <section class="step-finish">
    <i class="el-icon-success" />
    <p class="step-finish__title">恭喜您，完成了方案联调！</p>
    <p class="step-finish__tip">
      接下来你需要将环境配置从沙箱切换为生产，并将方案上线。
    </p>
    <el-row type="flex" justify="center">
      <el-button
        :clstag="clstag('', 'sandboxDebugging_1654841119615|3')"
        @click="onClickRetry"
        >重新联调</el-button
      >
      <el-button type="primary" @click="onClickViewTutorial"
        >查看教程</el-button
      >
    </el-row>
  </section>
</template>

<script>
import buriedPoint from "@/mixins/buriedPoint.js";

export default {
  name: "StepFinish",
  mixins: [buriedPoint],
  props: {
    waybillCode: { type: String, required: true },
    active: { type: Number, required: true },
  },
  methods: {
    onClickRetry() {
      this.$emit("update:waybillCode", "");
      this.$emit("update:active", 0);
    },
    onClickViewTutorial() {
      window.open("//cloud.jdl.com/#/devSupport/54047", "_blank");
    },
  },
};
</script>

<style lang="scss" scoped>
.step-finish {
  margin-top: 80px;
  text-align: center;

  .el-icon-success {
    font-size: 46px;
    color: #26a872;
  }

  .step-finish__title {
    margin: 8px;
    font-size: 16px;
    color: #333;
  }

  .step-finish__tip {
    margin-bottom: 30px;
    color: #666;
  }
}
</style>