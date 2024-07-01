<template>
  <el-dialog
    :title="computeDialogTitle"
    :visible="dialogVisible"
    :close-on-click-modal="false"
    width="560px"
    class="hide-or-cancel-hide-dialog"
    @close="onCloseDialog"
    @closed="onClosedDialog"
  >
    <Steps :titleList="computedStepsTitleList" :active="stepsActive" />
    <StepConfirmHideOrCancelHide
      v-if="stepsActive === 0"
      :hidden="currentTableRowData.hide"
      :name="currentTableRowData.name"
    />
    <StepFinish
      v-else-if="stepsActive === 1"
      :hidden="currentTableRowData.hide"
      :name="currentTableRowData.name"
    />
    <template #footer>
      <StepConfirmHideOrCancelHideButtonWrapper
        v-if="stepsActive === 0"
        :id="currentTableRowData.id"
        :hidden="currentTableRowData.hide"
        :stepsActive.sync="stepsActive"
        @clickCancelButton="onClickCancelButton"
      />
      <StepFinishButtonWrapper
        v-else-if="stepsActive === 1"
        :id="currentTableRowData.id"
        :hidden="currentTableRowData.hide"
        @clickCloseButton="onClickCloseButton"
      />
    </template>
  </el-dialog>
</template>

<script>
import Steps from "@/components/Steps.vue";
import StepConfirmHideOrCancelHide from "./components/step-confirm-hide-or-cancel-hide.vue";
import StepFinish from "./components/step-finish.vue";
import StepConfirmHideOrCancelHideButtonWrapper from "./components/step-confirm-hide-or-cancel-hide-button-wrapper.vue";
import StepFinishButtonWrapper from "./components/step-finish-button-wrapper.vue";

export default {
  name: "HideOrCancelHideDialog",
  components: {
    Steps,
    StepConfirmHideOrCancelHide,
    StepFinish,
    StepConfirmHideOrCancelHideButtonWrapper,
    StepFinishButtonWrapper,
  },
  props: {
    currentTableRowData: { type: Object, required: true },
    dialogVisible: { type: Boolean, required: true },
  },
  data() {
    return {
      stepsActive: 0,
    };
  },
  computed: {
    computeDialogTitle() {
      const { hide } = this.currentTableRowData;
      const hashMapDialogTitle = new Map()
        .set(0, "消息隐藏")
        .set(1, "消息取消隐藏");
      return hashMapDialogTitle.get(hide) || "";
    },
    computedStepsTitleList() {
      const { hide } = this.currentTableRowData;
      const hashMapStepConfirmHideOrCancelHideTitle = new Map()
        .set(0, "确认隐藏")
        .set(1, "确认取消隐藏");
      return [hashMapStepConfirmHideOrCancelHideTitle.get(hide) || "", "完成"];
    },
  },
  methods: {
    onCloseDialog() {
      this.$emit("update:dialogVisible", false);
      this.$emit("close");
    },
    onClosedDialog() {
      this.stepsActive = 0;
    },
    onClickCancelButton() {
      this.$emit("update:dialogVisible", false);
    },
    onClickCloseButton() {
      this.$emit("update:dialogVisible", false);
    },
  },
};
</script>

<style lang="scss" scoped>
// .hide-or-cancel-hide-dialog {
// }
</style>