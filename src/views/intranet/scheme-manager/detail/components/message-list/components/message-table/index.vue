<template>
  <section class="message-table">
    <Alert :closable="false">
      <template #title>
        {{ tagTipText }}
        <a :href="tagTipAnchorHref" target="_blank" class="tag-tip__anchor">{{
          tagTipAnchorText
        }}</a>
      </template>
    </Alert>
    <SearchForm
      :formData="searchFormData"
      @keyupEnterLeftInput="onKeyupEnterSearchFormLeftInput"
      @clickLeftButton="onClickSearchFormLeftButton"
      @clickRightButton="onClickSearchFormRightButton"
    />
    <SearchTable
      :tableLoading="searchTableLoading"
      :tableData="searchTableData"
      :currentPage.sync="searchTableCurrentPage"
      :pageSize.sync="searchTablePageSize"
      :total="searchTableTotal"
      :reloadTableData="handleReloadSearchTableData"
      @clickTableColumnEditDocumentButton="
        onClickSearchTableColumnEditDocumentButton
      "
      @clickTableColumnHideButton="onClickTableColumnHideButton"
      @clickTableColumnCancelHideButton="onClickTableColumnCancelHideButton"
      @updateDetailHeaderInfo="$emit('updateDetailHeaderInfo')"
    />
    <HideOrCancelHideDialog
      :currentTableRowData="currentTableRowData"
      :dialogVisible.sync="hideOrCancelHideDialogVisible"
      @close="handleReloadSearchTableData"
    />
  </section>
</template>

<script>
import Alert from "@/components/Alert.vue";
import SearchForm from "./components/search-form.vue";
import SearchTable from "./components/search-table.vue";
import HideOrCancelHideDialog from "./components/hide-or-cancel-hide-dialog/index.vue";
import bizmsg from "@/api/intranet/lcp/bizmsg.js";

const {
  env: { intranetHost, docMessageListTag },
} = window;

export default {
  name: "MessageTable",
  components: { Alert, SearchForm, SearchTable, HideOrCancelHideDialog },
  props: {
    currentDisplayComponentName: { type: String, required: true },
    currentTableRowData: { type: Object, required: true },
  },
  data() {
    return {
      unitId: parseInt(this.$route.params.id),

      tagTipText: "您可通过物流开放平台SDK向ISV/商家推送消息",
      tagTipAnchorHref: `//${intranetHost}/#/${docMessageListTag}`,
      tagTipAnchorText: "使用手册",

      searchFormData: { queryLike: "" },

      searchTableLoading: true,
      searchTableData: [],
      searchTableCurrentPage: 1,
      searchTablePageSize: 10,
      searchTableTotal: 0,

      hideOrCancelHideDialogVisible: false,
    };
  },
  methods: {
    // 根据对接方案ID与消息TOPIC或消息名称关键词查询消息列表数据
    async findMessagePreList() {
      const {
        unitId,
        searchFormData: { queryLike },
        searchTableCurrentPage,
        searchTablePageSize,
      } = this;
      const pageNumb = searchTableCurrentPage;
      const pageSize = searchTablePageSize;
      const params = { unitId, queryLike, pageNumb, pageSize };
      return await bizmsg.findMessagePreList(params).catch((error) => {
        throw new Error(`findMessagePreList, ${error}`);
      });
    },

    // 根据对接方案ID与消息TOPIC或消息名称关键词查询消息列表数据操作
    async handleFindMessagePreList() {
      this.searchTableLoading = true;
      const {
        data: { total, list },
      } = await this.findMessagePreList().catch((error) => {
        throw new Error(`handleFindMessagePreList, ${error}`);
      });
      this.searchTableData = Array.isArray(list) ? list : [];
      this.searchTableTotal = total || 0;
      this.searchTableLoading = false;
    },

    async handleReloadSearchTableData() {
      await this.handleFindMessagePreList().catch((error) => {
        throw new Error(`handleReloadSearchTableData, ${error}`);
      });
    },

    async onKeyupEnterSearchFormLeftInput() {
      await this.onClickSearchFormLeftButton().catch((error) => {
        throw new Error(`onKeyupEnterSearchFormLeftInput, ${error}`);
      });
    },
    async onClickSearchFormLeftButton() {
      this.searchTableCurrentPage = 1;
      this.handleFindMessagePreList().catch((error) => {
        throw new Error(`onClickSearchFormLeftButton, ${error}`);
      });
    },
    onClickSearchFormRightButton() {
      this.$emit("update:currentDisplayComponentName", "MessageAddition");
    },
    onClickSearchTableColumnEditDocumentButton(row) {
      this.$emit("update:currentTableRowData", row);
      this.$emit("update:currentDisplayComponentName", "MessageDocument");
    },
    onClickTableColumnHideButton(row) {
      this.$emit("update:currentTableRowData", row);
      this.hideOrCancelHideDialogVisible = true;
    },
    onClickTableColumnCancelHideButton(row) {
      this.$emit("update:currentTableRowData", row);
      this.hideOrCancelHideDialogVisible = true;
    },
  },
  mounted() {
    this.onClickSearchFormLeftButton().catch((error) => {
      throw new Error(`mounted, ${error}`);
    });
  },
};
</script>

<style lang="scss" scoped>
.message-table {
  .tag-tip__anchor {
    text-decoration: underline;
  }
}
</style>