<template>
  <el-dialog
    :visible="dialogVisible"
    :close-on-click-modal="false"
    title="查看资源"
    width="900px"
    top="5vh"
    class="view-resources-dialog"
    @opened="onOpenedDialog"
    @close="onCloseDialog"
  >
    <div class="dialog-content">
      <!-- 选择资源 -->
      <div class="checkbox-tree-table">
        <CheckboxTreeTable
          v-loading="loading"
          :fullScreenHeight="fullScreenHeight"
          :tableColumnList="tableColumnList"
          :extendedList="extendedList"
          :noEditHeight="360"
          styleTop="top: 60px"
          ref="checkboxTreeTable"
        />
      </div>
    </div>
  </el-dialog>
</template>

<script>
import CheckboxTreeTable from "./components/CheckboxTreeTable.vue";
import sysVersion from "@/api/intranet/lcp/sysVersion.js";

export default {
  name: "ViewResourcesDialog",
  components: { CheckboxTreeTable },
  props: {
    dialogVisible: { type: Boolean, required: true },
    extendedList: { type: Array, required: true },
    lopResourceId: { type: Number },
  },
  data() {
    return {
      loading: false,
      tableColumnList: [
        {
          prop: "resourceName",
          width: "300",
          label: "资源名称",
        },
        {
          prop: "resourceCode",
          width: "200",
          label: "资源编码",
        },
        {
          prop: "resourceType",
          label: "类型",
        },
      ],

      resizeDebounceTimer: null,
      fullScreenHeight: 460,
    };
  },
  methods: {
    // 根据资源标识ID与资源类别查询产品版本资源详情
    async queryVersionDetails() {
      const { lopResourceId } = this;
      const category = "MENUTREE";
      const params = { lopResourceId, category };
      return await sysVersion.queryVersionDetails(params).catch((error) => {
        throw new Error(`queryVersionDetails, ${error}`);
      });
    },

    // 根据资源标识ID与资源类别查询产品版本资源详情
    async handleQueryVersionDetails() {
      const { data } = await this.queryVersionDetails().catch((error) => {
        throw new Error(`handleQueryVersionDetails, ${error}`);
      });
      await this.$refs["checkboxTreeTable"].$refs["table"].reloadData([
        data || {},
      ]);
    },

    // 尺寸调整时改变虚拟表格高度防抖
    resizeThrottler() {
      clearTimeout(this.resizeDebounceTimer);
      this.resizeDebounceTimer = setTimeout(() => {
        this.fullScreenHeight = document.body.offsetHeight - 100;
        this.$refs["checkboxTreeTable"].$refs["table"].doLayout();
      }, 100);
    },

    async onOpenedDialog() {
      this.loading = true;
      window.addEventListener("resize", this.resizeThrottler, false);
      this.resizeThrottler();
      await this.handleQueryVersionDetails().catch((error) => {
        throw new Error(`onOpenedDialog, ${error}`);
      });
      await this.$nextTick();
      this.$refs["checkboxTreeTable"].echoSelection();
      await this.$nextTick();
      const [root] =
        this.$refs["checkboxTreeTable"].$refs["table"].getUTreeData();
      const expansionRowList = [root];
      const allRowList =
        this.$refs["checkboxTreeTable"].$refs["table"].getUTreeData();
      allRowList.forEach((item) => {
        if (!expansionRowList.includes(item)) {
          this.$refs["checkboxTreeTable"].$refs["table"].setTreeExpansion(
            item,
            false
          );
        }
      });
      this.loading = false;
    },
    onCloseDialog() {
      window.removeEventListener("resize", this.resizeThrottler, false);
      this.$emit("update:dialogVisible", false);
    },
  },
};
</script>

<style lang="scss" scoped>
.view-resources-dialog {
  .dialog-content {
    height: 400px;
    overflow: auto;

    .checkbox-tree-table {
      margin: 0 auto;
      width: 700px;

      ::v-deep .el-table-column--selection {
        pointer-events: none;
      }
    }
  }
}
</style>