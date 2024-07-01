<template>
  <div class="table-list">
    <el-table :data="logToolData">
      <el-table-column :label="$t('logTool.tableList.5izjgyk09ac0')" type="index" width="50"></el-table-column>
      <el-table-column
        v-for="item in labelList"
        :key="item.prop"
        :label="item.label"
        :prop="item.prop"
        :min-width="item.minWidth"
      >
        <template slot-scope="{ row }">
          <el-tooltip
            v-if="item.prop === 'requestUri'"
            effect="dark"
            :content="row.requestUri"
            placement="top"
          >
            <span class="list-uri">{{ row.requestUri }}</span>
          </el-tooltip>
          <span v-else-if="item.prop === 'startTime'">
            {{ row.startTime | formatStartTimeText }}
          </span>
          <span v-else-if="item.prop === 'latenciesRequest'">{{
            formatterLatencies(row.latenciesRequest)
          }}</span>
          <span v-else>{{ row[item.prop] }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('logTool.tableList.5izjgyk09q00')">
        <template slot-scope="{ row }">
          <el-button type="text" @click="openRightDrawer(row)">{{$t('logTool.tableList.5izjgyk09uc0')}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <Pagination
      v-if="total > 0"
      :currentPage.sync="pagination.page"
      :pageSize.sync="pagination.pageSize"
      :total.sync="total"
      :reloadTableData="handleSearch"
      style="margin: 0px; float: right"
    />
    <DetailDrawer
      :drawerVisible.sync="drawerVisible"
      :detailData="detailData"
      :handleClose="handleClose"
      :drawerLoading="drawerLoading"
    />
  </div>
</template>

<script>
import DetailDrawer from "./components/detail-drawer.vue";
import Pagination from "@/components/Pagination.vue";
import gateway from "@/api/extranet/gateway/index.js";

export default {
  name: "TableList",
  components: {
    Pagination,
    DetailDrawer,
  },
  props: {
    appKey: {
      type: String,
      required: true,
    },
    bizUnit: {
      type: Number | String,
      required: true,
    },
    env: {
      type: String,
      required: true,
    },
    pagination: {
      type: Object,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    handleSearch: {
      type: Function,
      required: true,
    },
    logToolData: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      drawerVisible: false,
      currentRowData: {},
      detailData: {},
      drawerLoading: false,
      labelList: [
        { label: "URI", prop: "requestUri", minWidth: '100px'},
        { label: "请求状态", prop: "status" },
        { label: "状态码", prop: "errorCode" },
        { label: "异常信息", prop: "errorMsg" },
        {
          label: "请求开始时间",
          prop: "startTime",
        },
        {
          label: "请求耗时",
          prop: "latenciesRequest",
        },
      ],
    };
  },
  filters: {
    formatStartTimeText(startTime) {
      startTime = parseInt(startTime);
      const YMD = new Date(startTime).toLocaleDateString().replaceAll("/", "-");
      const tmp = new Date(startTime);
      const h = tmp.getHours().toString().padStart(2, '0');
      const m = tmp.getMinutes().toString().padStart(2, '0');
      const s = tmp.getSeconds().toString().padStart(2, '0');
      return startTime ? `${YMD} ${h}:${m}:${s}` : "-";
    },
  },
  methods: {
    // 日志详情查询接口
    async searchAppLogsDetails() {
      const { id, requestUri } = this.currentRowData;
      const url = requestUri;
      const appKey = this.appKey;
      const bizUnit = this.bizUnit;
      const env = this.env;
      const data = [{ id, url, appKey, bizUnit, env }];
      const headers = { appKey, bizUnit };
      return await gateway.logs.searchAppLogsDetails(data, headers);
    },
    async openRightDrawer(row) {
      // this.drawerLoading = true;
      this.drawerVisible = true;
      this.currentRowData = row;
      // const { data } = await this.searchAppLogsDetails().catch((error) => {
      //   throw new Error(`openRightDrawer searchAppLogsDetails, ${error}`);
      // });
      this.detailData = row;
      // this.drawerLoading = false;
    },
    handleClose() {
      this.drawerVisible = false;
    },
    formatterLatencies(value) {
      return value ? `${Number(value) * 1000}ms` : "";
    },
  },
};
</script>

<style lang="scss" scoped>
.table-list {
  .list-uri {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    min-width: 100px;
    max-width: 125px;
    display: inline-block;
  }
}
</style>