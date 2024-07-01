<template>
  <div class="step-finish">
    <i class="el-icon-success" />
    <p
      v-for="tipText in computeTipTextList"
      :key="tipText"
      class="step-finish__tip"
    >
      {{ tipText }}
    </p>
  </div>
</template>

<script>
export default {
  name: "StepFinish",
  props: {
    hidden: { type: Number, required: true },
    name: { type: String, required: true },
  },
  computed: {
    computeTipTextList() {
      const { hidden, name } = this;
      const hashMapTipTextList = new Map()
        .set(0, ["隐藏成功", `前台将不再展示 ${name} 消息`])
        .set(1, ["取消隐藏成功", `前台将展示 ${name} 消息`]);
      return hashMapTipTextList.get(hidden) || [];
    },
  },
};
</script>

<style lang="scss" scoped>
.step-finish {
  text-align: center;

  .el-icon-success {
    margin: 8px;
    font-size: 36px;
    color: #26a872;
  }

  .step-finish__tip {
    &:nth-child(2) {
      font-size: 20px;
    }
  }
}
</style>