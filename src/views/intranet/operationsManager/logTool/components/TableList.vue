<template>
  <div class="table-list">
    <el-table :data="logToolData">
      <el-table-column label="序号" type="index" width="50"></el-table-column>
      <el-table-column
        v-for="item in labelList"
        :key="item.prop"
        :label="item.label"
        :prop="item.prop"
        show-overflow-tooltip
      >
        <template slot-scope="{ row }">
          <span v-if="item.prop === 'startTime'">
            {{ row.startTime | formatStartTimeText }}
          </span>
          <span v-else-if="item.prop === 'elapsedTime'">
            {{ row.elapsedTime * 1000 + "ms" }}
          </span>
          <span v-else>{{ row[item.prop] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="{ row }">
          <el-button type="text" @click="executionLogDetail(row)"
            >详情</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <Pagination
      v-if="pagination.total > 0"
      :currentPage.sync="pagination.pageNum"
      :pageSize.sync="pagination.pageSize"
      :total.sync="pagination.total"
      :reloadTableData="handleSearch"
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
import DetailDrawer from "@/views/intranet/operationsManager/logTool/components/DetailDrawer.vue";
import Pagination from "@/components/Pagination.vue";
import operationsManager from "@/api/intranet/operationsManager/index.js";

export default {
  name: "TableList",
  components: {
    Pagination,
    DetailDrawer
  },
  props: {
    pagination: {
      type: Object,
      required: true
    },
    handleSearch: {
      type: Function,
      required: true
    },
    logToolData: {
      type: Array,
      required: true
    },
    callDirection: {
      type: Number | String,
      required: true
    },
    searchFormData: {
      type: Object,
      required: true,
    }
  },
  data() {
    return {
      drawerVisible: false,
      detailData: {},
      drawerLoading: false,
      labelList: [
        { label: "API的URI", prop: "apiUrl" },
        { label: "平台响应状态", prop: "status" },
        { label: "平台响应状态码", prop: "statusCode" },
        { label: "异常信息", prop: "errorMsg" },
        {
          label: "请求开始时间",
          prop: "startTime"
        },
        {
          label: "耗时",
          prop: "elapsedTime"
        }
      ]
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
    }
  },
  methods: {
    // 日志详情查询接口
    async searchAppLogsDetails(row) {
      // const { id, appKey, domainCode, domainType, env, apiUrl } = row;
      const {appKey, env, domain, apiUrI} = this.searchFormData || {};
      const { domainType, code } = domain || {};
      const {apiUrl} = apiUrI;
      const data = { id: row.id, appKey, domainCode: code, domainType, env, callDirection: this.callDirection, apiUrl};
      return await operationsManager.getLogExecutionLogDetail(data);
    },
    async executionLogDetail(row) {
      this.drawerVisible = true;
      this.detailData = {};
      let rowInfo = {};
      if (+this.callDirection === 2) {
        // 回传API 从获取列表接口拿部分数据
        const {requestMethod,request,response,exceptionMessage} = row || {};
        rowInfo = {requestMethod,request,response,exceptionMessage};
      }
      this.drawerLoading = true;
        const { data } = await this.searchAppLogsDetails(row).catch(error => {
          this.drawerLoading = false;
          throw new Error(`executionLogDetail searchAppLogsDetails, ${error}`);
        });
        this.detailData = Object.assign({}, data, rowInfo);
        this.drawerLoading = false;
    },
    handleClose() {
      this.drawerVisible = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.table-list {
  .list-uri {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}
</style>
