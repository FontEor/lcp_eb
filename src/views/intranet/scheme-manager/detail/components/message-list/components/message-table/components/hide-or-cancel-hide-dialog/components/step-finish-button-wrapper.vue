<template>
  <div class="step-finish-button-wrapper">
    <el-button @click="$emit('clickCloseButton')">关闭</el-button>
    <el-button type="primary" @click="onClickGoToViewButton"
      >前往前台查看</el-button
    >
  </div>
</template>

<script>
const {
  env: { extranetHost },
  location: { port },
} = window;

export default {
  name: "StepFinishButtonWrapper",
  props: {
    id: { type: Number, required: true },
    hidden: { type: Number, required: true },
  },
  data() {
    return {
      unitId: parseInt(this.$route.params.id),
    };
  },
  methods: {
    onClickGoToViewButton() {
      const { unitId, id, hidden } = this;
      const hashMapHref = new Map()
        .set(
          0,
          `//${extranetHost}:${port}/#/open-business-document/message-doc/${unitId}`
        )
        .set(
          1,
          `//${extranetHost}:${port}/#/open-business-document/message-doc/${unitId}/${id}`
        );
      window.open(hashMapHref.get(hidden) || "", "_blank");
    },
  },
};
</script>

<style lang="scss" scoped>
// .step-finish-button-wrapper {
// }
</style>