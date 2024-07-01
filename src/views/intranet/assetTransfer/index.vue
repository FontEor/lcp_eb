<template>
  <article class="asset-transfer app-container">
    <SearchForm
      :searchFormData.sync="searchFormData"
      @keyupEnter="onKeyupEnterSearchForm"
    >
      <el-button type="primary" @click="applyAssetTransferDialogVisible = true"
        >申请移交资产</el-button
      >
    </SearchForm>
    <SearchTable
      :searchTableLoading="searchTableLoading"
      :searchTableData.sync="searchTableData"
    >
      <template #actionColumn="{ row }">
        <el-button type="text" @click="onClickDetailButton(row)"
          >详情</el-button
        >
      </template>
      <Pagination
        :currentPage.sync="pageNumb"
        :pageSize.sync="pageSize"
        :total.sync="total"
        :reloadTableData="handleQueryAssetTransferOrderList"
      />
    </SearchTable>
    <ApplyAssetTransferDialog
      :applyAssetTransferDialogVisible.sync="applyAssetTransferDialogVisible"
      :isAdmin="isAdmin"
      @close="onKeyupEnterSearchForm"
    />
    <DetailDialog
      :detailDialogVisible.sync="detailDialogVisible"
      :currentRowData="currentRowData"
    />
  </article>
</template>

<script>
import SearchForm from "@/views/intranet/assetTransfer/components/SearchForm/index.vue";
import SearchTable from "@/views/intranet/assetTransfer/components/SearchTable/index.vue";
import Pagination from "@/components/Pagination.vue";
import ApplyAssetTransferDialog from "@/views/intranet/assetTransfer/components/ApplyAssetTransferDialog/index.vue";
import DetailDialog from "@/views/intranet/assetTransfer/components/DetailDialog/index.vue";
import lcp from "@/api/intranet/lcp/index.js";

export default {
  name: "AssetTransfer",
  components: {
    SearchForm,
    SearchTable,
    Pagination,
    ApplyAssetTransferDialog,
    DetailDialog,
  },
  data() {
    return {
      searchFormData: {
        subject: "",
        status: null,
      },
      searchTableLoading: true,
      searchTableData: [],
      pageNumb: 1,
      pageSize: 10,
      total: 0,
      applyAssetTransferDialogVisible: false,
      isAdmin: false,
      detailDialogVisible: false,
      currentRowData: {},
    };
  },
  methods: {
    // 获取当前用户团队角色
    async getUserRole() {
      return await lcp.user.getUserRole().catch((error) => {
        throw new Error(`getUserRole, ${error}`);
      });
    },
    // 根据申请主题和申请状态查询资产交接申请数据
    async queryAssetTransferOrderList() {
      const { subject, status } = this.searchFormData;
      const { pageNumb, pageSize } = this;
      const params = { subject, status, pageNumb, pageSize };
      return await lcp.assetTransfer
        .queryAssetTransferOrderList(params)
        .catch((error) => {
          throw new Error(`queryAssetTransferOrderList, ${error}`);
        });
    },

    async handleGetUserRole() {
      const { data = 0 } = await this.getUserRole().catch((error) => {
        throw new Error(`handleGetUserRole,${error}`);
      });
      this.isAdmin = Boolean(data) || false;
    },
    async handleQueryAssetTransferOrderList(pageNumb = 0) {
      this.pageNumb = pageNumb || this.pageNumb;
      this.searchTableLoading = true;
      const {
        data: { list = [], total = 0 },
      } = await this.queryAssetTransferOrderList().catch((error) => {
        throw new Error(`handleQueryAssetTransferOrderList, ${error}`);
      });
      this.searchTableData = list || [];
      this.total = total || 0;
      this.searchTableLoading = false;
    },
    async onKeyupEnterSearchForm() {
      await this.handleQueryAssetTransferOrderList(1).catch((error) => {
        throw new Error(`onKeyupEnterSearchForm, ${error}`);
      });
    },
    async onClickDetailButton(row) {
      const { id, targetCode, targetName } = row;
      this.currentRowData = { id, targetCode, targetName };
      this.detailDialogVisible = true;
    },
  },
  async created() {
    await Promise.all([
      this.handleGetUserRole(),
      this.handleQueryAssetTransferOrderList(),
    ]).catch((error) => {
      throw new Error(`created, ${error}`);
    });
  },
};
</script>

<style lang="scss" scoped>
.asset-transfer {
}
</style>