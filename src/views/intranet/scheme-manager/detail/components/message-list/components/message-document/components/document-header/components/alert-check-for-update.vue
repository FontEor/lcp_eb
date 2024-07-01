<template>
  <div class="alert-check-for-update">
    <p class="alert-check-for-update__tip">{{ name | formatTipText }}</p>
    <Alert v-if="computeOutOfDateAlertVisible" :closable="false" type="warning">
      <template #title>
        <span>检测到当前消息文档元数据内容有更新，</span>
        <el-button
          type="text"
          style="font-size: inherit"
          @click="$emit('clickUpdateNowButton')"
          >查看更新内容</el-button
        >
      </template>
    </Alert>
    <Alert v-else :closable="false" :showIcon="false" type="default">
      <template #title>
        <el-button
          type="text"
          style="margin-right: 4px; font-size: inherit"
          @click="$emit('clickCheckForUpdateButton')"
          >检查更新</el-button
        >
        <el-tooltip
          content="检查当前消息文档参数是否为最新版本"
          placement="top"
        >
          <i class="el-icon-info-empty" />
        </el-tooltip>
      </template>
    </Alert>
  </div>
</template>

<script>
import Alert from "@/components/Alert.vue";

export default {
  name: "AlertCheckForUpdate",
  components: { Alert },
  props: {
    name: { type: String, required: true },
    outOfDate: { type: Number, required: true },
  },
  data() {
    return {};
  },
  filters: {
    formatTipText(name) {
      return name
        ? `本文档由 ${name} 的消息文档克隆生成，编辑仅影响当前文档`
        : "";
    },
  },
  computed: {
    computeOutOfDateAlertVisible() {
      const { outOfDate } = this;
      return Boolean(outOfDate);
    },
  },
};
</script>

<style lang="scss" scoped>
.alert-check-for-update {
  display: flex;
  flex-direction: column;
  align-items: flex-end;

  .alert-check-for-update__tip {
    color: #b5b5b5;
  }

  .alert {
    padding: 0 8px;
    width: auto;

    .el-icon-info-empty {
      color: #999;
    }
  }
}
</style>