<template>
  <div class="step-confirm-hide-or-cancel-hide">
    <el-button @click="$emit('clickCancelButton')">取消</el-button>
    <el-button
      v-if="computeConfirmHideButtonVisible"
      :loading="confirmHideButtonLoading"
      type="primary"
      @click="onClickConfirmHideButton"
      >确认隐藏</el-button
    >
    <el-button
      v-else
      type="primary"
      :loading="confirmCancelHideButtonLoading"
      @click="onClickConfirmCancelHideButton"
      >确认取消隐藏</el-button
    >
  </div>
</template>

<script>
import bizmsg from "@/api/intranet/lcp/bizmsg.js";

export default {
  name: "StepConfirmHideOrCancelHideButtonWrapper",
  props: {
    id: { type: Number | undefined, required: true },
    hidden: { type: Number | undefined, required: true },
    stepsActive: { type: Number, required: true },
  },
  data() {
    return {
      unitId: parseInt(this.$route.params.id),

      confirmHideButtonLoading: false,
      confirmHideButtonDebounceTimer: null,
      confirmCancelHideButtonLoading: false,
      confirmCancelHideDebounceTimer: null,
    };
  },
  computed: {
    computeConfirmHideButtonVisible() {
      const { hidden } = this;
      return !Boolean(hidden);
    },
  },
  methods: {
    // 根据对接方案ID与消息ID隐藏消息
    async hide() {
      const { unitId, id } = this;
      const data = { unitId, id };
      return bizmsg.hide(data).catch((error) => {
        throw new Error(`hide, ${error}`);
      });
    },
    // 根据对接方案ID与消息ID取消隐藏消息
    async hideCancel() {
      const { unitId, id } = this;
      const data = { unitId, id };
      return bizmsg.hideCancel(data).catch((error) => {
        throw new Error(`hideCancel, ${error}`);
      });
    },

    // 根据对接方案ID与消息ID隐藏消息
    async handleHide() {
      await this.hide().catch((error) => {
        throw new Error(`handleHide, ${error}`);
      });
      this.$emit("update:stepsActive", 1);
    },
    // 根据对接方案ID与消息ID取消隐藏消息
    async handleHideCancel() {
      await this.hideCancel().catch((error) => {
        throw new Error(`handleHideCancel, ${error}`);
      });
      this.$emit("update:stepsActive", 1);
    },

    onClickConfirmHideButton(id) {
      clearTimeout(this.confirmHideButtonDebounceTimer);
      this.confirmHideButtonDebounceTimer = setTimeout(async () => {
        await this.handleHide(id).catch((error) => {
          throw new Error(`onClickConfirmHideButton, ${error}`);
        });
      }, 300);
    },
    onClickConfirmCancelHideButton(id) {
      clearTimeout(this.confirmCancelHideDebounceTimer);
      this.confirmCancelHideDebounceTimer = setTimeout(async () => {
        await this.handleHideCancel(id).catch((error) => {
          throw new Error(`onClickConfirmCancelHideButton, ${error}`);
        });
      }, 300);
    },
  },
};
</script>

<style lang="scss" scoped>
// .step-confirm-hide-or-cancel-hide {
// }
</style>