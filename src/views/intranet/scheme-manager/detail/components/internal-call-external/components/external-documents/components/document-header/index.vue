<template>
  <div class="document-header">
    <el-page-header
      :content="apiCode | formatPageHeaderContent"
      class="page-header"
      @back="$emit('back')"
    />
    <AlertCheckForUpdate
      :apiCode="apiCode"
      :outOfDate="outOfDate"
      @clickViewUpdateContentButton="onClickViewUpdateContentButton"
      @clickCheckForUpdateButton="onClickCheckForUpdateButton"
    />
    <ChangeContentDialog
      :dialogVisible.sync="changeContentDialogVisible"
      :id="id"
      :apiCode="apiCode"
      :updatePolicy="updatePolicy"
      @update:updatePolicy="($event) => $emit('update:updatePolicy', $event)"
      @updateNow="$emit('updateNow')"
    />
  </div>
</template>

<script>
import AlertCheckForUpdate from "./components/alert-check-for-update.vue";
import ChangeContentDialog from "./components/change-content-dialog/index.vue";
import bizapinterface from "@/api/intranet/lcp/bizapinterface.js";

export default {
  name: "DocumentHeader",
  components: { AlertCheckForUpdate, ChangeContentDialog },
  props: {
    id: { type: Number, required: true },
    apiCode: { type: String, required: true },
    outOfDate: { type: Boolean, required: true },
    updatePolicy: { type: Number, required: true },
  },
  data() {
    return {
      changeContentDialogVisible: false,
    };
  },
  filters: {
    formatPageHeaderContent(value) {
      return value ? `${value} 的接口文档` : "";
    },
  },
  methods: {
    // 根据接口ID检查接口文档元数据是否存在变更
    async checkForUpdate() {
      const { id } = this;
      const params = { id };
      return await bizapinterface.checkForUpdate(params).catch((error) => {
        throw new Error(`checkForUpdate, ${error}`);
      });
    },

    // 根据接口ID检查接口文档元数据是否存在变更
    async handleCheckForUpdate() {
      const { data } = await this.checkForUpdate().catch((error) => {
        throw new Error(`handleCheckForUpdate, ${error}`);
      });
      return data || false;
    },

    async openNoNewReleaseConfirm() {
      const message = "当前接口文档已是最新版";
      const type = "success";
      const showConfirmButton = false;
      const cancelButtonText = "关闭";
      const options = { type, showConfirmButton, cancelButtonText };
      await this.$confirm(message, options).catch(() => {});
    },

    async onClickViewUpdateContentButton() {
      this.changeContentDialogVisible = true;
    },
    async onClickCheckForUpdateButton() {
      const renewable = await this.handleCheckForUpdate().catch((error) => {
        throw new Error(`onClickCheckForUpdateButton, ${error}`);
      });
      if (renewable) {
        await this.onClickViewUpdateContentButton();
      } else {
        await this.openNoNewReleaseConfirm();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.document-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;

  .page-header {
    margin-right: 8px;
    white-space: nowrap;
  }
}
</style>