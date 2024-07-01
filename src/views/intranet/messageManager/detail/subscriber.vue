<template>
  <div class="message-subscrib">
    <el-row>
      <el-col :span="18">
        <el-input
          placeholder="请输入应用名称、appKey"
          class="search-input"
          v-model="searchKeyWord"
          v-on:input="handleClearSearchInfo"
          @keyup.enter.native="search"
        ></el-input>
        <el-button type="primary" v-on:click="search" icon="el-icon-search"
          >查询</el-button
        >
      </el-col>
    </el-row>
    <el-table class="table-body" v-loading="loading" :data="tableDatas">
      <template slot="empty">
        <div>经查询，无符合搜索条件的结果</div>
      </template>
      <el-table-column type="index" label="序号" width="50" />
      <el-table-column
        label="应用名称"
        prop="appName"
        align="left"
        min-width="28%"
        :show-tooltip-when-overflow="true"
      />
      <el-table-column
        label="appKey"
        prop="appKey"
        align="left"
        min-width="40%"
        :show-tooltip-when-overflow="true"
      />
      <el-table-column
        label="订阅时间"
        prop="subscribeTime"
        align="left"
        min-width="20%"
      >
        <template slot-scope="{ row }">
          <span>{{ serializationTime(row.subscribeTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="接收方式"
        prop="receiveType"
        align="left"
        min-width="15%"
        :show-tooltip-when-overflow="true"
      >
        <template slot-scope="{ row }">
          {{
            (+row.receiveType === 1 && "websocket") ||
              (+row.receiveType === 2 && "http")
          }}
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      v-show="pageInfo.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageInfo.page"
      :page-sizes="pageInfo.pageSizes"
      :page-size="pageInfo.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="pageInfo.total || NaN"
      class="pagination"
    >
    </el-pagination>
  </div>
</template>
<script>
import parseTimeNew from "@/utils/parseTime.js";
import Pagination from "@/components/Pagination/index.vue";
import gateway from "@/api/intranet/gateway/index.js";
let fetchSearchKeyWord = "";
export default {
  data() {
    return {
      searchKeyWord: "",
      tableDatas: [],
      pageInfo: {
        total: 1,
        pageSize: 10,
        page: 1,
        pageSizes: [10, 20, 40, 60]
      },
      loading: false
    };
  },
  mounted() {
    this.getTableData();
  },
  methods: {
    search() {
      fetchSearchKeyWord = this.searchKeyWord.trim();
      this.pageInfo.page = 1;
      this.getTableData();
    },
    handleClearSearchInfo() {
      !this.searchKeyWord.trim().length && this.search();
    },
    handleSizeChange(size) {
      this.pageInfo.page = 1;
      this.pageInfo.pageSize = size;
      this.getTableData();
    },
    handleCurrentChange(curPage) {
      this.pageInfo.page = curPage;
      this.getTableData();
    },
    async getTableData() {
      this.loading = true;
      const { page, pageSize } = this.pageInfo;
      const param = [
        { page, pageSize },
        { topic: this.$route.params.topic, keyWords: fetchSearchKeyWord }
      ];
      const response = await gateway.messageAccessService
        .queryMessageSubscribers(param)
        .catch(error => {
          this.loading = false;
        });
      this.loading = false;
      const { code, data } = response || {};
      if (+code === 20000) {
        const { rows, page, total } = data || {};
        this.pageInfo = Object.assign(this.pageInfo, { page, total });
        this.tableDatas = rows || [];
      }
    },
    serializationTime(time) {
      return parseTimeNew.timeInTable(time);
    }
  },
  components: {
    Pagination
  },
  name: "messageManagerSubscriber"
};
</script>
<style lang="scss" scoped>
.message-subscrib {
  background: #fff;
  position: relative;
  .search-input {
    width: 350px;
    margin-right: 10px;
  }
  .table-body {
    margin-top: 18px;
  }
  .pagination {
    text-align: right;
    padding-top: 16px;
  }
}
</style>
