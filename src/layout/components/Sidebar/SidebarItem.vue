<template>
  <div v-if="!item.hidden" class="sidebarItem">
    <template
      v-if="
        hasOneShowingChild(item.children, item) &&
        ((onlyOneChild != null && !onlyOneChild.children) ||
          (onlyOneChild != null && onlyOneChild.noShowingChildren)) &&
        !item.alwaysShow
      "
    >
      <app-link
        class="menuConsoleClass"
        v-if="onlyOneChild.meta && !onlyOneChild.meta.microUsePath"
        :to="resolvePath(onlyOneChild.path)"
      >
        <el-menu-item
          :index="resolvePath(onlyOneChild.path)"
          :class="{ 'submenu-title-noDropdown': !isNest }"
        >
          <item
            :icon="onlyOneChild.meta.icon || (item.meta && item.meta.icon)"
            :title="onlyOneChild.meta.title"
          />
        </el-menu-item>
      </app-link>
      <el-menu-item
        v-if="onlyOneChild.meta && onlyOneChild.meta.microUsePath"
          :index="resolvePath(onlyOneChild.path)"
          :class="{ 'submenu-title-noDropdown': !isNest }"
          @click="handleSwitchMicroApp(onlyOneChild.meta.microUsePath)"
        >
          <item
            :icon="onlyOneChild.meta.icon || (item.meta && item.meta.icon)"
            :title="onlyOneChild.meta.title"
          />
        </el-menu-item>

    </template>

    <el-submenu
      v-else
      ref="subMenu"
      :index="resolvePath(item.path)"
      popper-append-to-body
    >
      <template slot="title">
        <item
          v-if="item.meta"
          :icon="item.meta && item.meta.icon"
          :title="item.meta.title"
        />
      </template>
      <sidebar-item
        v-for="child in item.children"
        :key="child.path"
        :is-nest="true"
        :item="child"
        :base-path="resolvePath(child.path)"
        class="nest-menu"
        :elMenuStyle="child.elMenuStyleActive"
      />
    </el-submenu>
  </div>
</template>

<script>
import path from "path";
import { isExternal } from "@/utils/validate";
import Item from "./Item";
import AppLink from "./Link";
import FixiOSBug from "./FixiOSBug";
import isIntranet from "@/utils/isIntranet.js";
import microApp, {getActiveApps} from '@micro-zoe/micro-app'

export default {
  name: "SidebarItem",
  components: { Item, AppLink },
  mixins: [FixiOSBug],
  props: {
    // route object
    item: {
      type: Object,
      required: true,
    },
    isNest: {
      type: Boolean,
      default: false,
    },
    basePath: {
      type: String,
      default: "",
    },
    elMenuStyle: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    // To fix https://github.com/PanJiaChen/vue-admin-template/issues/237
    // TODO: refactor with render function
    this.onlyOneChild = null;
    return {
      /**
       * erp没显示的菜单
       */
      hiddenErpMenu: {
        "/isvManager": true,
        "/supplierManager": true,
        "/partnerManager": true,
      },
      /**
       * passport没显示的菜单
       */
      hiddenPassportMenu: {
        "/apiManager": true,
        "/openBiz": true,
        "/_3": true,
      },
      /**
       * 只有一个子菜单时候，不隐藏父菜单
       */
      filterOneChildItemPath: [
        "/logTool",
        "/userManager",
        "/openBiz",
        "/appManager",
        "/messageReceive",
      ],
    };
  },
  methods: {
    handleSwitchMicroApp(path) {
      // if(!getActiveApps().includes('lcp_web_upgrade')) {
      //   this.$router.push({path});
      // } else {
      //   microApp.setData('lcp_web_upgrade', {routeName: 'Home'})
      // }
      window.microPushStatus(path, 'Home')
    },
    hasOneShowingChild(children = [], parent) {
      if (!this.juageHidden(parent)) {
        return false;
      }

      const showingChildren = children.filter((item) => {
        this.juageHidden(item);

        if (item.hidden) {
          return false;
        } else {
          // Temp set(will be used if only has one showing child)
          this.onlyOneChild = item;
          return true;
        }
      });

      // When there is only one child router, the child router is displayed by default
      if (showingChildren.length === 1) {
        if (this.filterOnlyOneChild(showingChildren)) {
          return false;
        }
        return true;
      }

      // Show parent if there are no child router to display
      if (showingChildren.length === 0) {
        this.onlyOneChild = { ...parent, path: "", noShowingChildren: true };
        return true;
      }
      return false;
    },

    filterOnlyOneChild(showingChildren) {
      return this.filterOneChildItemPath.includes(showingChildren[0].path);
    },

    resolvePath(routePath) {
      if (isExternal(routePath)) {
        return routePath;
      }
      if (isExternal(this.basePath)) {
        return this.basePath;
      }
      return path.resolve(this.basePath, routePath);
    },
    /**
     * 判断是否隐藏
     */
    juageHidden(item) {
      /**
       * erp隐藏左边菜单
       */
      if (isIntranet()) {
        if (this.hiddenErpMenu[item.path]) {
          item.hidden = true;
          return false;
        }
      }
      /**
       * passport隐藏左边菜单
       */
      if (!isIntranet()) {
        if (this.hiddenPassportMenu[item.path]) {
          item.hidden = true;
          return false;
        }
      }
      return true;
    },
  },
};
</script>
<style lang="scss" scoped>
.menuConsoleClass ::v-deep .el-menu-item {
  height: 48px;
  line-height: 48px;
  padding: 0 45px;
}
</style>
