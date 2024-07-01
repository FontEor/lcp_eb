<template>
  <el-tabs
    v-model="activeName"
    class="main-tabs"
    type="card"
    @tab-click="onTabClick"
  >
    <el-tab-pane
      v-for="{ label, name } in tabPaneList"
      :key="name"
      :label="label"
      :name="name"
    >
      <slot v-bind="{ label, name }"></slot>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
export default {
  name: "MainTabs",
  props: {
    initActiveName: { type: String, default: "" },
    tabPaneList: { type: Array, default: () => [] },
    routeName: { type: String, default: "" },
    routeParams: { type: Object, default: () => ({}) },
  },
  data() {
    return { activeName: this.initActiveName };
  },
  methods: {
    onTabClick({ name }) {
      const activeName = name;
      const { routeName, routeParams } = this;
      routeName &&
        Object.keys(routeParams).includes("activeName") &&
        this.$router.push({
          name: routeName,
          params: { ...routeParams, activeName },
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.main-tabs {
  margin: 0 20px;

  &.el-tabs {
    ::v-deep .el-tabs__header {
      position: sticky;
      position: -webkit-sticky;
      top: 60px;
      z-index: 3;
      margin: 0;
      border-bottom: none;
      background: #f5f5f5;
      .el-tabs__item {
        border: none;
      }
    }
    ::v-deep .el-tabs__content {
      padding: 16px;
      min-height: calc(100vh - 260px);
      background: #fff;
    }
  }
}
</style>