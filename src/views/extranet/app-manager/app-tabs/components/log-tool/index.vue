<template>
  <div class="log-tool">
    <SearchForm
      :bizUnitOptions.sync="bizUnitOptions"
      :searchFormData.sync="searchFormData"
      :appCode="appKey"
      :handleSearch="handleSearch"
      :loading.sync="loading"
      ref="logSearchForm"
    />
    <TableList
      v-loading="tableLoading"
      :handleSearch="handleSearch"
      :logToolData.sync="logToolData"
      :appKey.sync="appKey"
      :bizUnit="searchFormData.bizUnit"
      :env="searchFormData.env"
      :pagination.sync="pagination"
      :total="total"
    />
  </div>
</template>

<script>
import SearchForm from "./components/search-form.vue";
import TableList from "./components/table-list/index.vue";
import lcp from "@/api/extranet/lcp/index.js";

export default {
  name: "LogTool",
  props: {
    appKey: {
      type: String,
      required: true,
    },
  },
  components: {
    SearchForm,
    TableList,
  },
  data() {
    return {
      bizUnitOptions: [],
      searchFormData: {
        bizUnit: null,
        env: "",
        url: "",
        resquestParameter: "",
        responseParameter: "",
        statusCode: "",
        timeFrame: this.$t('logTool.index.5izjb7us5b91'),
        status: "",
        pin: "",
      },
      logToolData: [],
      pagination: {
        page: 1,
        pageSize: 10,
      },
      total: 0,
      tableLoading: false,
      loading: false,
    };
  },
  methods: {
    // 应用管理-查询对接方案
    async findRecord() {
      const appKey = this.appKey;
      const params = { appKey };
      return await lcp.bizunit.findRecord(params);
    },
    // 日志列表查询接口
    async searchAppLogsList() {
      const hashMap = {
        [this.$t('logTool.index.5izjb7us5b91')]: "900000",
        [this.$t('logTool.index.5izjb7us5b92')]: "3600000",
        [this.$t('logTool.index.5izjb7us5b93')]: "86400000",
        [this.$t('logTool.index.5izjb7us5b94')]: "432000000",
        [this.$t('logTool.index.5izjb7us5b95')]: "604800000",
      };
      // const appKey = this.appKey;
      const {
        bizUnit,
        env,
        url,
        resquestParameter,
        responseParameter,
        statusCode,
        timeFrame,
        status,
        pin,
      } = this.searchFormData;
      const endTime = new Date().getTime();
      const startTime = endTime - Number(hashMap[timeFrame]);
      // const LcpAppLogsEsSearchDto = [
      //   this.pagination,
      //   {
      //     appKey,
      //     bizUnit,
      //     env,
      //     url,
      //     resquestParameter,
      //     responseParameter,
      //     statusCode,
      //     startTime,
      //     endTime,
      //     status,
      //     pin,
      //   },
      // ];
      // const headers = { appKey, bizUnit };
      // return await gateway.logs.searchAppLogsList(
      //   LcpAppLogsEsSearchDto,
      //   headers
      // );
      const param = {
        appKey: this.appKey,
        unitId: bizUnit,
        env,
        apiId: url,
        pageNumb: this.pagination.page,
        pageSize: this.pagination.pageSize,
        startTime,
        endTime,
        statusCode,
        status,
        pin,
        requestParameter: resquestParameter,
        responseParameter,
      }
      return await lcp.unit.searchAppLogsList(param);
    },
    // 获取对接方案
    async getBizUnitOptions() {
      const { data } = await this.findRecord().catch((e) => {
        throw new Error("getBizUnitOptions findRecord");
      });
      this.bizUnitOptions = data && data.filter((item) => item.status === 1);
      this.searchFormData.bizUnit =
        this.bizUnitOptions.length > 0 ? Number(this.bizUnitOptions[0].unitId) : null;
    },
    // 查询日志工具列表
    handleSearch() {
      this.$refs.logSearchForm.$refs.searchFormData.validate(async (valid) => {
        if (valid) {
          this.tableLoading = true;
          this.loading = true;
          const { data } = await this.searchAppLogsList().catch((err) => {
            this.tableLoading = false;
            this.loading = false;
            throw new Error("handleSearch searchAppLogsList");
          });
          this.total = data.total;
          this.logToolData = data.list || [];
          this.tableLoading = false;
          this.loading = false;
        } else {
          return false;
        }
      });
    },
  },
  created() {
    this.getBizUnitOptions();
  },
};
</script>

<style>
</style>