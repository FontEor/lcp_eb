<template>
  <section class="search-table">
    <el-table v-loading="searchTableLoading" :data="searchTableData">
      <el-table-column label="序号" type="index" width="60" />
      <el-table-column
        v-for="{ label, prop, width, showOverflowTooltip } in searchTableList"
        :key="prop"
        :label="label"
        :prop="prop"
        :width="width"
        :show-overflow-tooltip="showOverflowTooltip"
      >
        <template #default="{ row }">
          <span v-if="prop === 'transferType'">
            {{ row[prop] | formatTableColumnTransferTypeText }}
          </span>
          <span
            v-else-if="prop === 'status'"
            :class="row[prop] | formatTableColumnStatusClassName"
          >
            {{ row[prop] | formatTableColumnStatusText }}
          </span>
          <span v-else>{{ row[prop] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="80">
        <template #default="scope">
          <slot name="actionColumn" v-bind="scope"></slot>
        </template>
      </el-table-column>
    </el-table>
    <slot></slot>
  </section>
</template>

<script>
export default {
  name: "SearchTable",
  props: {
    searchTableLoading: { type: Boolean, required: true },
    searchTableData: { type: Array, required: true },
  },
  data() {
    return {
      searchTableList: [
        { label: "申请主题", prop: "subject", showOverflowTooltip: true },
        { label: "接收方类型", prop: "transferType", width: "100" },
        {
          label: "接收方",
          prop: "targetName",
          width: "100",
          showOverflowTooltip: true,
        },
        { label: "申请状态", prop: "status", width: "100" },
        { label: "申请时间", prop: "createTime", width: "160" },
      ],
    };
  },
  filters: {
    formatTableColumnTransferTypeText(transferType) {
      const hashMap = new Map().set(1, "个人").set(2, "团队");
      return hashMap.get(transferType) || "-";
    },
    formatTableColumnStatusClassName(status) {
      const hashMap = new Map()
        .set(1, "updateColor")
        .set(2, "normalColor")
        .set(3, "unknownColor")
        .set(4, "deadColor");
      return hashMap.get(status) || "";
    },
    formatTableColumnStatusText(status) {
      const hashMap = new Map()
        .set(1, "审核中")
        .set(2, "通过")
        .set(3, "驳回")
        .set(4, "已取消");
      return hashMap.get(status) || "-";
    },
  },
};
</script>

<style lang="scss" scoped>
.search-table {
}
</style>