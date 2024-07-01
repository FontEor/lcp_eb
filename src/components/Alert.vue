<template>
  <el-alert
    :class="{ alert: true, 'alert--default': !type }"
    :type="type"
    :title="title"
    :description="description"
    :effect="effect"
    :show-icon="showIcon"
    :closable="closable"
  >
    <template #title>
      <slot name="title"></slot>
    </template>
    <slot name="default"></slot>
  </el-alert>
</template>

<script>
export default {
  name: "Alert",
  props: {
    type: { type: String, default: "" },
    title: { type: String, default: "" },
    description: { type: String, default: "" },
    effect: { type: String, default: "light" },
    showIcon: { type: Boolean, default: true },
    closable: { type: Boolean, default: true },
  },
};
</script>

<style lang="scss" scoped>
.alert {
  margin-bottom: 8px;

  &.alert--default {
    background: #f5f5f5;

    ::v-deep .el-alert__content {
      padding: 0 16px 0 8px;

      .el-alert__title {
        font-size: 14px;
      }

      .el-alert__closebtn {
        top: 50%;
        right: 12px;
        transform: translateY(-50%);
      }
    }
  }
}
</style>