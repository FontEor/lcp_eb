<template>
  <div class="sidebar">
    <hamburger
      :isActive="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />
    <el-scrollbar v-if="showRouter" wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
        @select="menuIsChose"
        @open="menuIsChose"
        @close="menuIsChose"
      >
        <sidebar-item
          v-for="route in routes"
          :key="route.path"
          :item="route"
          :base-path="route.path"
          :elMenuStyle="route.elMenuStyleActive"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Hamburger from "@/components/Hamburger";
import SidebarItem from "@/layout/components/Sidebar/SidebarItem.vue";
import variables from "@/styles/variables.scss";
import pageClick from "@/utils/pageClick.js";
import store from "@/store/international/index.js";

export default {
  components: { SidebarItem, Hamburger },
  props: {
    showRouter: {
      default: true,
      type: Boolean,
    },
  },
  data() {
    return {
      // routes: this.$router.options.routes,
      //activeMenu:"/_4"
    };
  },
  computed: {
    ...mapGetters(["sidebar"]),
    activeMenu() {
      const { meta, name } = this.$route;
      const { activeMenu } = meta;
      if (!activeMenu) {
        if (meta && meta.length > 0) {
          return meta[0].url;
        } else {
          return name;
        }
      } else {
        return activeMenu;
      }
      // const route = this.$route
      // const { meta, path } = route
      // // if set path, the sidebar will highlight the path you set
      // if (meta.activeMenu) {
      //   return meta.activeMenu
      // }
      // return path
    },
    showLogo() {
      // return this.$store.state.settings.sidebarLogo
      return true;
    },
    variables() {
      return variables;
    },
    isCollapse() {
      return !this.sidebar.opened;
    },
    routes() {
      return store.state.app.menus;
    },
  },
  methods: {
    // 点击事件埋点
    clstag(intranetId, extranetId) {
      return pageClick(intranetId, extranetId);
    },
    // 由于el-menu中的menu__item不能直接设置自定义属性，因此模拟点击事件
    menuIsChose(menuIndex, menuIndexPath) {
      const menuTable = {
        // 技术开放
        "/openTechnology": "appManager_1618992717469|4",
        // 对接方案
        "/openBiz": "appManager_1618992717469|5",
        // 软件系统
        "/softwareSystem": "appManager_1618992717469|6",
        // 开发管理
        "/developmentManagement": "appManager_1618992717469|7",
        // 应用管理
        "/appManager": "appManager_1618992717469|8",
        // API管理
        "/apiManager": "appManager_1618992717469|9",
        // 消息管理
        "/messageManager": "messageManager_1669964723128|1",
        // 个人中心
        "/personalCenter": "appManager_1618992717469|10",
        // 用户管理
        "/userManager": "appManager_1618992717469|11",
        // 消息中心
        "/messageCenter": "appManager_1618992717469|12",
        // 消息接收
        "/messageReceive": "appManager_1618992717469|13",
      };
      const div = document.createElement("div");
      div.setAttribute("clstag", this.clstag(menuTable[menuIndex] || "", ""));
      document.body.appendChild(div);
      div.click();
      div.remove();
    },
    toggleSideBar() {
      this.$store.dispatch("app/toggleSideBar");
    },
  },
};
</script>
<style lang="scss" scoped>
.hamburger-container {
  z-index: 1;
}
</style>