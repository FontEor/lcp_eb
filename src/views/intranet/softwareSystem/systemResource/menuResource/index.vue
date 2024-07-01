<template>
  <div class="menu-resource">
    <TagTip :closable="false" class="tag-tip">
      您可在列表中维护该软件全部范围的菜单资源。了解更多请看
      <a class="anchor initColor" :href="hrefHelpDocument" target="_blank"
        >新手帮助文档</a
      >
    </TagTip>

    <!-- 菜单资源表格 -->
    <div class="menu-resource__table-wrapper">
      <MenuResourceTable
        category="MENUTREE"
        :ref="refTable"
        :refTable="refTable"
        :loading.sync="loading"
        :queryResourcesList="queryResourcesList"
        :extensionFieldList.sync="extensionFieldList"
        :queryConfig="queryConfig"
        :scrollTop.sync="scrollTop"
        @update:handleExtensionField="handleExtensionField"
        @update:handleAddSubResource="handleAddSubResource"
        @update:handleEdit="handleEdit"
      />
    </div>

    <!-- 添加和编辑资源对话框 -->
    <MenuResourceDialog
      category="MENUTREE"
      :menuResourceDialogVisible.sync="menuResourceDialogVisible"
      :editable="editable"
      :menuResourceFormData.sync="menuResourceFormData"
      :queryConfig="queryConfig"
      :extensionFieldList.sync="extensionFieldList"
      @update:afterSubmitResourceData="refreshTableData"
    />

    <!-- 扩展字段配置对话框 -->
    <ExtensionFieldDialog
      category="MENUTREE"
      :extensionFieldDialogVisible.sync="extensionFieldDialogVisible"
      :queryConfig="queryConfig"
      @update:afterSubmitExtensionFieldData="refreshTableData"
    />
  </div>
</template>

<script>
import TagTip from "@/components/common/TagTip.vue";
import MenuResourceTable from "@/views/intranet/softwareSystem/systemResource/menuResource/menuResourceTable.vue";
import MenuResourceDialog from "@/views/intranet/softwareSystem/systemResource/menuResource/menuResourceDialog.vue";
import ExtensionFieldDialog from "@/views/intranet/softwareSystem/systemResource/menuResource/extensionFieldDialog.vue";
import menuResource from "@/api/intranet/softwareSystem/systemResource/menuResource.js";

export default {
  name: "MenuResource",
  components: {
    TagTip,
    MenuResourceTable,
    MenuResourceDialog,
    ExtensionFieldDialog,
  },
  data() {
    return {
      hrefHelpDocument: "//lcp.jdl.com/#/newHand/53054",

      category: "MENUTREE",
      productId: this.$route.params.id,
      loading: true,
      refTable: "menuResourceTable",

      menuResourceDialogVisible: false,

      editable: false,
      menuResourceFormData: {
        resourceCode: "",
        resourceName: "",
        resourceType: null,
        resourceUrl: "",
        icon: "",
        remark: "",
      },

      extensionFieldDialogVisible: false,
      extensionFieldList: [],

      scrollTop: 0,
    };
  },
  methods: {
    // 查询资源列表
    async queryResourcesList() {
      const { category, productId } = this;
      const params = { category, productId };
      return await menuResource
        .queryResourcesList(params)
        .catch(async (error) => {
          // 若当前系统资源未初始化，则初始化资源创建根节点
          if (error.data.code === 10029) {
            await this.initSysResources().catch((error) => {
              const { message } = error.data;
              message && this.$message.error(message);
              throw new Error("initSysResources");
            });
            return await menuResource
              .queryResourcesList(params)
              .catch((error) => {
                const { message } = error.data;
                message && this.$message.error(message);
                throw new Error("queryResourcesList");
              });
          } else {
            const { message } = error.data;
            message && this.$message.error(message);
            throw new Error("queryResourcesList");
          }
        });
    },
    // 查询系统资源扩展字段配置
    async queryConfig() {
      const { category, productId } = this;
      const params = { category, productId };
      return await menuResource.queryConfig(params).catch((error) => {
        const { message } = error.data;
        message && this.$message.error(message);
        throw new Error("queryConfig");
      });
    },
    // 创建资源根节点
    async initSysResources() {
      const { category, productId } = this;
      const data = { category, productId };
      return await menuResource.initSysResources(data).catch((error) => {
        const { message } = error.data;
        message && this.$message.error(message);
        throw new Error("initSysResources");
      });
    },

    // 配置扩展字段操作
    handleExtensionField() {
      this.extensionFieldDialogVisible = true;
    },
    // 菜单资源表格添加子资源操作
    handleAddSubResource(row) {
      this.editable = false;
      this.menuResourceDialogVisible = true;
      this.$nextTick(() => {
        const { id, lopResourceId } = row;
        this.menuResourceFormData = Object.assign(
          JSON.parse(JSON.stringify(this.menuResourceFormData)),
          {
            id,
            lopResourceId,
          }
        );
      });
    },
    // 菜单资源表格编辑操作
    handleEdit(row) {
      this.editable = true;
      this.menuResourceDialogVisible = true;
      this.$nextTick(() => {
        this.menuResourceFormData = JSON.parse(JSON.stringify(row));
      });
    },
    // 提交资源操作后，重新获取菜单资源表格数据
    async refreshTableData() {
      this.loading = true;
      (async () => {
        const response = await this.queryConfig();
        const { data } = response.data;
        this.extensionFieldList = data;
      })();
      const expansionRowList =
        this.$refs[this.refTable].$refs[this.refTable].getTreeExpandRecords();
      const { data } = await this.queryResourcesList();
      await this.$refs[this.refTable].$refs[this.refTable].reloadData([
        data.data,
      ]);
      this.$refs[this.refTable].$refs[this.refTable].doLayout();
      expansionRowList.forEach((item) => {
        this.$refs[this.refTable].$refs[this.refTable].setTreeExpansion(
          item,
          true
        );
      });
      this.scrollTop > -1
        ? this.$refs[this.refTable].$refs[this.refTable].pagingScrollTopLeft(
            this.scrollTop,
            0
          )
        : this.$refs[this.refTable].$refs[this.refTable].scrollBottom();
      this.loading = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.menu-resource {
  .el-icon-warning.unknownColor {
    font-size: 20px;
    vertical-align: middle;
  }
  .anchor.initColor {
    color: #3c6ef0;
  }
}
</style>