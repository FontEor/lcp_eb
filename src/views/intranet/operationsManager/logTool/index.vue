<template>
  <div class="app-container">
    <div class="log-tool">
      <SearchForm
        :bizUnitOptions.sync="bizUnitOptions"
        :searchFormData.sync="searchFormData"
        :handleSearch="handleSearch"
        :loading.sync="loading"
        ref="logSearchForm"
      />
      <TableList
        v-loading="tableLoading"
        :handleSearch="handleSearch"
        :logToolData.sync="logToolData"
        :pagination.sync="pagination"
        :callDirection="callDirection"
        :searchFormData="searchFormData"
      />
    </div>
  </div>
</template>

<script>
import SearchForm from "@/views/intranet/operationsManager/logTool/components/SearchForm.vue";
import TableList from "@/views/intranet/operationsManager/logTool/components/TableList.vue";
import operationsManager from "@/api/intranet/operationsManager/index.js";

export default {
  name: "LogTool",
  components: {
    SearchForm,
    TableList,
  },
  data() {
    return {
      bizUnitOptions: [],
      searchFormData: {
        domain: null,
        timeRange: [],
        env: null,
        apiUrI: "",
        status: null,
        appKey: null,
        pin: null,
        reqKeyWords: null,
        resKeyWords: null,
        statusCode: null,
        receiverAppKey: null, // 接收方appkey
      },
      logToolData: [],
      pagination: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
      },
      tableLoading: false,
      loading: false,
    };
  },
  computed: {
    callDirection () {
      return (this.searchFormData.apiUrI && this.searchFormData.apiUrI.callDirection) || '';
    }
  },
  created() {
    this.getBizUnitOptions();
  },
  methods: {
    // 查询对接方案和API分组
    async getLogDomain() {
      const params = { name: "" };
      return await operationsManager.getLogDomain(params);
    },
    // 日志列表查询接口
    async searchAppLogsList(page) {
      const {
        domain,
        timeRange,
        env,
        apiUrI,
        status,
        appKey,
        pin,
        reqKeyWords,
        resKeyWords,
        statusCode,
        receiverAppKey,
      } = this.searchFormData;
      const startTime = timeRange[0].valueOf();
      const endTime = timeRange[1].valueOf();
      const {domainType, code } = domain;
      const {apiUrl, callDirection} = apiUrI || {};
      this.pagination.pageNum = page || this.pagination.pageNum;
      const { pageNum, pageSize } = this.pagination;
      const LcpAppLogsEsSearchDto = {
        domainCode: code,
        domainType,
        startTime,
        endTime,
        env,
        apiUrl,
        status,
        appKey,
        pin,
        reqKeyWords,
        resKeyWords,
        statusCode,
        pageNum,
        pageSize,
        callDirection,
        receiverAppKey
      };
      return await operationsManager.getLogExecutionLogs(LcpAppLogsEsSearchDto);
    },
    // 获取对接方案
    async getBizUnitOptions() {
      const { data } = await this.getLogDomain().catch((e) => {
        throw new Error("getBizUnitOptions getLogDomain");
      });
      this.bizUnitOptions = data;
    },
    // 查询日志工具列表
    handleSearch(page) {
      this.$refs.logSearchForm.$refs.searchFormData.validate(async (valid) => {
        if (valid) {
          this.tableLoading = true;
          this.loading = true;
          this.logToolData = [];
          const { data } = await this.searchAppLogsList(page).catch(() => {
            this.tableLoading = false;
            this.loading = false;
            throw new Error("handleSearch searchAppLogsList");
          });
          this.pagination.total = data.total;
          this.logToolData = data.list || [];
          this.tableLoading = false;
          this.loading = false;
        } else {
          return false;
        }
      });
    },
  },
};
</script>

<style>
</style>