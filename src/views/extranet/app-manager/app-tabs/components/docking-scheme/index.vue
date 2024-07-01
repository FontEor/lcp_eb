<template>
  <div class="docking-scheme">
    <!-- 应用管理-对接方案列表 -->
    <TableList
      v-if="showComponent === 'TableList'"
      :appKey="appKey"
      :showComponent.sync="showComponent"
      :currentRow.sync="currentRow"
    />
    <!-- 应用管理-对接方案列表-配置 -->
    <Configuration
      v-if="showComponent === 'Configuration'"
      :showComponent.sync="showComponent"
      :currentRow.sync="currentRow"
      :appKey.sync="appKey"
      :appType.sync="appType"
    />
  </div>
</template>

<script>
import TableList from "./components/table-list.vue";
import Configuration from "./components/configuration/index.vue";

export default {
  name: "DockingScheme",
  components: {
    TableList,
    Configuration,
  },
  props: {
    appKey: {
      type: String,
      required: true,
    },
    appType: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      showComponent: "TableList",
      currentRow: {},
    };
  },
};
</script>

<style lang="scss" scoped></style>
