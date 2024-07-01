<template>
  <div class="system-resource">
    <div class="system-resource__aside">
      <el-menu :default-active="active" @select="selectMenuItem">
        <el-menu-item
          v-for="(item, index) in menuTitleList"
          :key="index"
          :index="item.index"
        >
          <span slot="title">{{ item.title }}</span>
        </el-menu-item>
      </el-menu>
    </div>
    <div class="system-resource__main">
      <MenuResource v-if="active === 'menuResource'"></MenuResource>
    </div>
  </div>
</template>

<script>
import MenuResource from "@/views/intranet/softwareSystem/systemResource/menuResource/index.vue";

export default {
  name: "SystemResource",
  components: { MenuResource },
  data() {
    return {
      active: "menuResource",
      menuTitleList: [{ title: "菜单资源管理", index: "menuResource" }],
    };
  },
  methods: {
    selectMenuItem(index) {
      this.active = index;
    },
  },
};
</script>

<style lang="scss" scoped>
.system-resource {
  display: flex;
  // min-height: calc(100vh - 500px);
  .system-resource__aside {
    width: 140px;
    border-right: 1px solid #eaeaea;
    .el-menu {
      .el-menu-item {
        text-align: left;
        &.is-active {
          border-right: 2px solid #3c6ef0;
        }
      }
    }
  }
  .system-resource__main {
    max-width: calc(100% - 140px);
    flex-grow: 1;
    margin: 8px 0 8px 16px;
  }
}
</style>