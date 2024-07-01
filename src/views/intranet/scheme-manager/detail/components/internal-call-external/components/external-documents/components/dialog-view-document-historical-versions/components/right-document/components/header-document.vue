<template>
  <div class="header-document">
    <p class="header-document__title">版本信息</p>
    <el-button
      :clstag="clstag('OpenApi_1671105827529|2', '')"
      :main="true"
      @click="onClickRecoverButton"
      >恢 复</el-button
    >
  </div>
</template>

<script>
import buriedPoint from "@/mixins/buriedPoint.js";

export default {
  name: "HeaderDocument",
  mixins: [buriedPoint],
  props: {
    currentVersionName: { type: String, required: true },
  },
  methods: {
    async onClickRecoverButton() {
      const { currentVersionName } = this;
      const message = `确定要恢复到 ${currentVersionName} 的版本吗？`;
      const title = "恢复文档";
      const type = "warning";
      const confirmButtonText = "确定恢复";
      const options = { type, confirmButtonText };
      await this.$confirm(message, title, options)
        .then(() => {
          this.$emit("recoverDocument");
        })
        .catch(() => {});
    },
  },
};
</script>

<style lang="scss" scoped>
.header-document {
  margin-bottom: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .header-document__title {
    font-size: 16px;
    font-weight: 600;
    color: #333;
  }
}
</style>