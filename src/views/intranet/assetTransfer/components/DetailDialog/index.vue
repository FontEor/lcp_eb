<template>
  <el-dialog
    class="detail-dialog"
    title="详情"
    width="800px"
    :visible="detailDialogVisible"
    :max-height="520"
    :close-on-click-modal="false"
    @update:visible="($event) => $emit('update:detailDialogVisible', $event)"
    @open="onOpenDetailDialog"
  >
    <p>
      <span>资产接收方：{{ currentRowData.targetName }}</span>
      <span>（{{ currentRowData.targetCode }}）</span>
    </p>
    <br />
    <p>资产清单</p>
    <el-table v-loading="tableLoading" :data="tableData">
      <el-table-column label="序号" type="index" width="60" />
      <el-table-column label="移交项明细">
        <template slot-scope="scope">
          <p>
            【{{ scope.row.assetBizType | formatAssetBizType }}】{{
              scope.row.source
            }}
            -
            {{ scope.row.assetName }}
          </p>
        </template>
      </el-table-column>
    </el-table>
    <Pagination
      :currentPage.sync="pageNumb"
      :pageSize.sync="pageSize"
      :total.sync="total"
      :reloadTableData="handleQueryAssetTransferOrderItemList"
    />
    <template #footer>
      <el-button
        type="primary"
        @click="$emit('update:detailDialogVisible', false)"
        >关 闭</el-button
      >
    </template>
  </el-dialog>
</template>

<script>
import Pagination from "@/components/Pagination.vue";
import lcp from "@/api/intranet/lcp/index.js";

export default {
  name: "DetailDialog",
  components: { Pagination },
  props: {
    detailDialogVisible: { type: Boolean, required: true },
    currentRowData: { type: Object, required: true },
  },
  data() {
    return {
      tableLoading: true,
      tableData: [],
      tableColumnList: [{ label: "移交项明细", prop: "assetName" }],
      pageNumb: 1,
      pageSize: 10,
      total: 0,
    };
  },
  filters: {
    formatAssetBizType(type) {
      const assetBizTypeList = [
        { label: "对接方案", value: 102 },
        { label: "API分组-外部调用京东", value: 232 },
        { label: "API-HTTP协议API", value: 231 },
        { label: "API-JSF服务API", value: 242 },
        { label: "API-回传API", value: 243 },
        { label: "内网应用", value: 103 },
        { label: "消息", value: 244 },
      ];
      const item = assetBizTypeList.find((item) => {
        if (item.value === type) {
          return item.label;
        }
      });
      return item && item.label;
    },
  },
  methods: {
    // 根据申请ID查询资产交接详情列表数据
    async queryAssetTransferOrderItemList() {
      const { id } = this.currentRowData;
      const orderId = id;
      const params = { orderId };
      return await lcp.assetTransfer
        .queryAssetTransferOrderItemList(params)
        .catch((error) => {
          throw new Error(`queryAssetTransferOrderItemList, ${error}`);
        });
    },
    async handleQueryAssetTransferOrderItemList() {
      this.tableLoading = true;
      const {
        data: { list = [], total = 0 },
      } = await this.queryAssetTransferOrderItemList().catch((error) => {
        throw new Error(`handleQueryAssetTransferOrderItemList, ${error}`);
      });
      this.tableData = list instanceof Array ? list : [];
      this.total = total || 0;
      this.tableLoading = false;
    },
    async onOpenDetailDialog() {
      await this.handleQueryAssetTransferOrderItemList().catch((error) => {
        throw new Error(`onOpenDetailDialog, ${error}`);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
