<template>
  <div :class="classObj" class="app-wrapper">
    <div
      v-if="device === 'mobile' && sidebar.opened"
      class="drawer-bg"
      @click="handleClickOutside"
    />
    <div class="edi-container">
      <div class="fixed-header">
        <Header />
      </div>
      <app-main />
    </div>
  </div>
</template>

<script>
import Header from "@/layout/components/Header.vue";
import AppMain from "@/layout/components/AppMain.vue";
import ResizeMixin from "./mixin/ResizeHandler";

export default {
  name: "BasicLayout",
  components: {
    Header,
    AppMain,
  },
  mixins: [ResizeMixin],
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar;
    },
    device() {
      return this.$store.state.app.device;
    },
    fixedHeader() {
      return this.$store.state.settings.fixedHeader;
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === "mobile",
      };
    },
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch("app/closeSideBar", { withoutAnimation: false });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
@import "~@/styles/variables.scss";

.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}
.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.edi-container {
  min-height: 100%;
  position: relative;
  padding: 0 20px;
  margin-bottom: 10px;
}

.fixed-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  // 为了遮挡loading的z-index
  z-index: 2000;
  color: #fff;
  transition: width 0.28s;
  background: #3c6ef0;
}
</style>
