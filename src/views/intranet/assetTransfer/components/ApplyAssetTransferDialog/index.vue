<template>
  <el-dialog
    class="apply-asset-transfer-dialog"
    title="申请移交资产"
    width="1200px"
    top="5vh"
    :visible="applyAssetTransferDialogVisible"
    :max-height="560"
    :close-on-click-modal="false"
    @update:visible="
      ($event) => $emit('update:applyAssetTransferDialogVisible', $event)
    "
    @close="onCloseApplyAssetTransferDialog"
  >
    <Steps :active.sync="active" :titleList="titleList" />
    <StepBasicInfo
      v-if="active === 0"
      ref="StepBasicInfo"
      :basicInfoFormData.sync="basicInfoFormData"
      :isAdmin="isAdmin"
    />
    <StepSelectAsset
      v-else-if="active === 1"
      :selectAssetData.sync="selectAssetData"
      :transferData.sync="transferData"
      :transferType="basicInfoFormData.transferType"
    />
    <StepSuccess v-else-if="active === 2" />
    <template #footer>
      <template v-if="active === 0">
        <el-button
          @click="$emit('update:applyAssetTransferDialogVisible', false)"
          >取 消</el-button
        >
        <el-button type="primary" @click="onClickStepBasicInfoNextStepButton"
          >下一步</el-button
        >
      </template>
      <div v-else-if="active === 1">
        <el-button @click="active = 0">上一步</el-button>
        <el-button
          :loading="stepSelectAssetSubmitButtonLoading"
          type="primary"
          @click="onClickStepSelectAssetSubmitButton"
          >提交申请</el-button
        >
      </div>
      <template v-else-if="active === 2">
        <el-button
          @click="$emit('update:applyAssetTransferDialogVisible', false)"
          >关 闭</el-button
        >
        <el-button
          type="primary"
          @click="onClickStepSuccessContinueCreateButton"
          >继续创建资产交接申请</el-button
        >
      </template>
    </template>
  </el-dialog>
</template>

<script>
import Steps from "@/components/Steps.vue";
import StepBasicInfo from "@/views/intranet/assetTransfer/components/ApplyAssetTransferDialog/components/StepBasicInfo.vue";
import StepSelectAsset from "@/views/intranet/assetTransfer/components/ApplyAssetTransferDialog/components/StepSelectAsset.vue";
import StepSuccess from "@/views/intranet/assetTransfer/components/ApplyAssetTransferDialog/components/StepSuccess.vue";
import lcp from "@/api/intranet/lcp/index.js";

export default {
  name: "ApplyAssetTransferDialog",
  components: { Steps, StepBasicInfo, StepSelectAsset, StepSuccess },
  props: {
    applyAssetTransferDialogVisible: { type: Boolean, required: true },
    isAdmin: { type: Boolean, required: true },
  },
  data() {
    return {
      active: 0,
      titleList: ["填写申请基本信息", "选择交接的资产", "申请成功"],
      basicInfoFormData: {
        subject: "",
        transferType: 1,
        target: {},
      },
      selectAssetData: [],
      transferData: [],
      stepSelectAssetSubmitButtonLoading: false,
      stepSelectAssetSubmitButtonDebounceTimer: null,
    };
  },
  methods: {
    // 提交资产交接申请
    async submitOrder() {
      const {
        subject,
        transferType,
        target: { targetCode, targetName },
      } = this.basicInfoFormData;
      const items = this.formatSubmitItems();
      const data = { subject, transferType, targetCode, targetName, items };
      return await lcp.assetTransfer.submitOrder(data).catch((error) => {
        throw new Error(`submitOrder, ${error}`);
      });
    },

    async handleSubmitOrder() {
      await this.submitOrder().catch((error) => {
        throw new Error(`handleSubmitOrder, ${error}`);
      });
    },

    formatSubmitItems() {
      const { selectAssetData, transferData } = this;
      return selectAssetData.reduce((previous, current) => {
        const { assetId, assetBizType, assetName, assetDesc } =
          transferData.find(({ customId }) => customId === current);
        return previous.concat({ assetId, assetBizType, assetName, assetDesc });
      }, []);
    },
    resetApplyAssetTransferData() {
      this.basicInfoFormData = { subject: "", transferType: 1, target: {} };
      this.selectAssetData = [];
      this.active = 0;
    },
    onClickStepBasicInfoNextStepButton() {
      this.$refs.StepBasicInfo.$refs.basicInfoForm
        .validate()
        .then(() => {
          this.active = 1;
        })
        .catch(() => {});
    },
    onClickStepSelectAssetSubmitButton() {
      const { selectAssetData } = this;
      if (selectAssetData.length > 0) {
        clearTimeout(this.stepSelectAssetSubmitButtonDebounceTimer);
        this.stepSelectAssetSubmitButtonDebounceTimer = setTimeout(async () => {
          this.stepSelectAssetSubmitButtonLoading = true;
          await this.handleSubmitOrder().catch((error) => {
            this.stepSelectAssetSubmitButtonLoading = false;
            throw new Error(`onClickStepSelectAssetSubmitButton, ${error}`);
          });
          this.active = 2;
          this.stepSelectAssetSubmitButtonLoading = false;
        }, 300);
      } else {
        this.$message.warning("请选择需要移交的资产！");
      }
    },
    onClickStepSuccessContinueCreateButton() {
      this.resetApplyAssetTransferData();
    },
    onCloseApplyAssetTransferDialog() {
      this.resetApplyAssetTransferData();
      this.$emit("close");
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
