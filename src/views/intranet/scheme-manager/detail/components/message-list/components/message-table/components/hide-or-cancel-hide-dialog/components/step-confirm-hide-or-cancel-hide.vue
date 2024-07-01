<template>
  <div class="step-confirm-hide-or-cancel-hide">
    <i class="el-icon-warning" />
    <p
      v-for="tipText in computeTipTextList"
      :key="tipText"
      class="step-confirm-hide-or-cancel-hide__tip"
    >
      {{ tipText }}
    </p>
  </div>
</template>

<script>
export default {
  name: "StepConfirmHideOrCancelHide",
  props: {
    hidden: { type: Number, required: true },
    name: { type: String, required: true },
  },
  computed: {
    computeTipTextList() {
      const { hidden, name } = this;
      const hashMapTipTextList = new Map()
        .set(0, [
          "消息隐藏会立即生效",
          `前台将不再展示 ${name} 消息，但不影响已使用消息的用户接收消息`,
          "确认隐藏？",
        ])
        .set(1, [
          "消息取消隐藏会立即生效",
          `前台将展示 ${name} 消息，可能会有新用户接入并订阅消息`,
          "确认取消隐藏？",
        ]);
      return hashMapTipTextList.get(hidden) || [];
    },
  },
};
</script>

<style lang="scss" scoped>
.step-confirm-hide-or-cancel-hide {
  text-align: center;

  .el-icon-warning {
    margin: 8px;
    font-size: 36px;
    color: #e1251b;
  }
}
</style>