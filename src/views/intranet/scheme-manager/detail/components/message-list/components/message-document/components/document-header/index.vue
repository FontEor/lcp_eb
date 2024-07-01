<template>
  <div class="document-header">
    <el-page-header
      :content="name | formatPageHeaderContent"
      class="page-header"
      @back="$emit('back')"
    />
    <AlertCheckForUpdate
      :name="name"
      :outOfDate="outOfDate"
      @clickUpdateNowButton="onClickUpdateNowButton"
      @clickCheckForUpdateButton="onClickCheckForUpdateButton"
    />
    <ChangeContentDialog
      :dialogVisible.sync="changeContentDialogVisible"
      :id="id"
      :apiCode="name"
      :updatePolicy="updatePolicy"
      @update:updatePolicy="($event) => $emit('update:updatePolicy', $event)"
      @updateNow="$emit('updateNow')"
    />
  </div>
</template>

<script>
import AlertCheckForUpdate from "./components/alert-check-for-update.vue";
import ChangeContentDialog from "./components/change-content-dialog/index.vue";
import bizmsg from "@/api/intranet/lcp/bizmsg.js";

export default {
  name: "DocumentHeader",
  components: { AlertCheckForUpdate, ChangeContentDialog },
  props: {
    id: { type: Number, required: true },
    name: { type: String, required: true },
    outOfDate: { type: Number, required: true },
    updatePolicy: { type: Number, required: true },
  },
  data () {
    return {
      changeContentDialogVisible: false,
    };
  },
  filters: {
    formatPageHeaderContent(name) {
      return name ? `${name} 的消息文档` : "";
    },
  },
  methods: {
    // 根据消息ID检查消息文档元数据是否存在变更
    async checkForUpdate() {
      const { id } = this;
      const params = { id };
      return await bizmsg.checkForUpdate(params).catch((error) => {
        throw new Error(`checkForUpdate, ${error}`);
      });
    },

    // 根据消息ID检查消息文档元数据是否存在变更
    async handleCheckForUpdate() {
      const { data } = await this.checkForUpdate().catch((error) => {
        throw new Error(`handleCheckForUpdate, ${error}`);
      });
      return data || false;
    },

    async openUpdateNowConfirm() {
      // TODO
      this.changeContentDialogVisible = true;
      return false;
      const message =
        "检测到当前消息文档的元数据有更新，是否需要同步更新对接方案下的文档？";
      const cancelButtonText = "暂不更新";
      const confirmButtonText = "立即更新";
      const options = { cancelButtonText, confirmButtonText };
      await this.$confirm(message, options)
        .then(() => {
          this.$emit("updateNow");
        })
        .catch(() => {});
    },
    async openNoNewReleaseConfirm() {
      const message = "当前消息文档已是最新版";
      const type = "success";
      const showConfirmButton = false;
      const cancelButtonText = "关闭";
      const options = { type, showConfirmButton, cancelButtonText };
      await this.$confirm(message, options).catch(() => {});
    },

    async onClickUpdateNowButton() {
      await this.openUpdateNowConfirm();
    },
    async onClickCheckForUpdateButton() {
      const renewable = await this.handleCheckForUpdate().catch((error) => {
        throw new Error(`onClickCheckForUpdateButton, ${error}`);
      });
      if (renewable) {
        await this.openUpdateNowConfirm();
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
