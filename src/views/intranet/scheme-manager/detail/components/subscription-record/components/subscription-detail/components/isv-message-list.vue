<template>
  <div class="isv-message-list">
    <el-table :data="tableData" style="width: 100%">
      <el-table-column type="index" label="序号"> </el-table-column>
      <el-table-column prop="name" label="TOPIC"> </el-table-column>
      <el-table-column prop="chineseName" label="中文名称"> </el-table-column>
      <el-table-column prop="descr" label="描述"> </el-table-column>
      <el-table-column prop="receiveType" label="接收方式">
        <template slot-scope="scope">
          {{ formatReceiveType(scope.row.receiveType) }}
        </template>
      </el-table-column>
      <el-table-column prop="callUrl" min-width="200">
        <template #header>
          <span>{{ env | formatInternalCallExternalCallUrlHeader }}</span>
        </template>
        <template #default="{ row: { callUrl } }">
          {{ formatTableData(callUrl) }}
        </template>
      </el-table-column>
      <el-table-column
        v-if="env === 'uat' || env === 'prod'"
        prop="shadowboxCallUrl"
        label="预发环境回调URL"
        min-width="200"
      >
        <template #default="{ row: { shadowboxCallUrl } }">
          <span>{{
            hasUat
              | formatInternalCallExternalShadowboxCallUrlText(shadowboxCallUrl)
          }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="订阅时间">
        <template slot-scope="scope">
          {{ formatParseTime(scope.row.createTime) }}
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination
      v-if="total > 0"
      :currentPage.sync="pageNum"
      :pageSize.sync="pageSize"
      :total.sync="total"
      :reloadTableData="findSubMsgByAppKey"
    />
  </div>
</template>

<script>
import Pagination from "@/components/Pagination.vue";
import openBusinese from "@/api/intranet/openBusinese/index.js";
import parseTime from "@/utils/parseTime.js";

export default {
  name: "IsvMessageList",
  components: {
    Pagination,
  },
  props: {
    currentRowData: {
      type: Object,
      default: {},
    },
    hasUat: { type: Number, required: true },
  },
  data() {
    return {
      env: window.env.baseEnv,
      tableData: [],
      dialogVisible: false,
      form: {},
      pageNum: 1,
      pageSize: 10,
      total: 0,
    };
  },
  filters: {
    formatInternalCallExternalCallUrlHeader(env) {
      const hashMap = new Map()
        .set("test", "测试环境回调URL")
        .set("uat", "生产环境回调URL")
        .set("prod", "生产环境回调URL");
      return hashMap.get(env) || "-";
    },
    formatInternalCallExternalShadowboxCallUrlText(hasUat, shadowboxCallUrl) {
      return (hasUat && shadowboxCallUrl) || "-";
    },
  },
  methods: {
    async findSubMsgByAppKey() {
      const data = {
        page: this.pageNum,
        pageSize: this.pageSize,
        appKey: this.currentRowData.appKey,
        unitId: Number(this.$route.params.id),
      };
      const response = await openBusinese.subscriptionRecord.findSubMsgByAppKey(
        data
      );
      this.tableData = response.data.list;
      this.total = response.data.total;
    },
    formatReceiveType(receiveType) {
      const receiveTypeMap = [, "WebSocket", "HTTP"];
      return receiveTypeMap[receiveType];
    },
    formatTableData(val) {
      return val || "-";
    },
    //转换时间戳
    formatParseTime(time) {
      return parseTime.timeInTable(time);
    },
  },
  mounted() {
    this.findSubMsgByAppKey();
  },
};
</script>

<style lang="scss" scoped>
</style>