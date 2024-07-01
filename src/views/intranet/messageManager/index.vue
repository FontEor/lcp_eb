<template>
  <div class="message-manager">
    <el-row>
      <el-col :span="18">
        <el-input
          placeholder="请输入消息的名称、TOPIC"
          class="search-input"
          v-model="searchKeyWord"
          v-on:input="handleClearSearchInfo"
          @keyup.enter.native="search"
        ></el-input>
        <el-button type="primary" v-on:click="search" icon="el-icon-search"
          >查询</el-button
        >
      </el-col>
      <el-col :span="6">
        <el-button
          type="primary"
          icon="el-icon-plus"
          v-on:click="() => (showRegister = true)"
          class="register-button"
          >注册消息</el-button
        >
      </el-col>
    </el-row>
    <el-table class="table-body" v-loading="loading" :data="tableDatas">
      <template slot="empty">
        <div>经查询，无符合搜索条件的结果</div>
      </template>
      <el-table-column type="index" label="序号" width="50" />
      <el-table-column
        label="名称"
        prop="cnName"
        align="left"
        min-width="25%"
        :show-tooltip-when-overflow="true"
      />
      <el-table-column
        label="TOPIC"
        prop="topic"
        align="left"
        min-width="40%"
        :show-tooltip-when-overflow="true"
      />
      <el-table-column
        label="状态"
        prop="status"
        min-width="13%"
        align="left"
      >
        <template
          slot-scope="scope"
          v-if="scope.row.status !== null || scope.row.status !== undefined"
        >
          <span v-if="+scope.row.status === 0" class="status_init status"
            >初始化</span
          >
          <span v-if="+scope.row.status === 1" class="status_edit status"
            >编辑中</span
          >
          <span v-if="+scope.row.status === 2" class="status_approve status"
            >审批中</span
          >
          <span v-if="+scope.row.status === 3" class="status_released status"
            >已发布</span
          >
          <span v-if="+scope.row.status === 4" class="status_offline status"
            >已下线</span
          >
        </template>
      </el-table-column>
      <el-table-column
        label="更新人"
        prop="updateUser"
        align="left"
        min-width="12.11%"
        :show-tooltip-when-overflow="true"
      />
      <el-table-column
        label="更新时间"
        prop="updateTime"
        align="left"
        min-width="15.11%"
      >
        <template slot-scope="{ row }">
          <span>{{ serializationTime(row.updateTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" prop="id" min-width="8%" align="left">
        <template slot-scope="scope">
          <el-link
            type="primary"
            :underline="false"
            :disabled="!managerBtnUseable(scope.row.status)"
            @click="
              $router.push({
                name: 'messageManagerDetail',
                params: { topic: scope.row.topic }
              })
            "
            >管理</el-link
          >
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
    <RegisterMessage
      :visible.sync="showRegister"
      @updateMessageList="updateMessageList"
    ></RegisterMessage>
  </div>
</template>
<script>
import parseTimeNew from "@/utils/parseTime.js";
import Pagination from "@/components/Pagination/index.vue";
import RegisterMessage from "./components/RegisterMessage.vue";
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
      loading: false,
      showRegister: false
    };
  },
  computed: {
    managerBtnUseable() {
      // 初始化：0; 编辑中：1; 审批中：2; 已发布：3; 已下线：4;
      const useableList = [0, 1, 2, 3, 4];
      return status => {
        return useableList.includes(+status);
      };
    }
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
      this.pageInfo.pageSize = size;
      this.pageInfo.page = 1;
      this.getTableData();
    },
    handleCurrentChange(curPage) {
      this.pageInfo.page = curPage;
      this.getTableData();
    },
    async getTableData() {
      this.loading = true;
      this.tableDatas = [];
      const { pageSize, page: pageNumb } = this.pageInfo;
      const param = [{ pageSize, pageNumb }, { keyWords: fetchSearchKeyWord }];
      const response = await gateway.messageAccessService
        .queryMessageList(param)
        .catch(error => {
          this.loading = false;
        });
      this.loading = false;
      const { code, data } = response || {};
      if (+code === 20000) {
        const { page, total, rows } = data || {};
        this.pageInfo = Object.assign(this.pageInfo, { page, total });
        this.tableDatas = rows;
      }
    },
    serializationTime(time) {
      return parseTimeNew.timeInTable(time);
    },
    updateMessageList(rejectSuccess) {
      rejectSuccess && this.getTableData();
    }
  },
  components: {
    Pagination,
    RegisterMessage
  },
  name: "messageManager"
};
</script>
<style lang="scss" scoped>
.message-manager {
  margin: 0 20px;
  padding: 20px;
  background: #fff;
  min-height: calc(100vh - 100px);
  position: relative;
  .search-input {
    width: 350px;
    margin-right: 10px;
  }
  .table-body {
    margin-top: 18px;
  }
  .register-button {
    margin-bottom: 5px;
    float: right;
  }
  .pagination {
    text-align: right;
    padding-top: 16px;
  }
  .status {
    &::before {
      content: "";
      display: inline-block;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      margin-right: 4px;
    }
    &_init {
      color: #3c6ef0;
      &::before {
        background: #3c6ef0;
      }
    }
    &_edit,
    &_approve {
      color: #ea730b;
      &::before {
        background: #ea730b;
      }
    }
    &_released {
      color: #26a872;
      &::before {
        background: #26a872;
      }
    }
    &_offline {
      color: #666666;
      &::before {
        background: #666666;
      }
    }
  }
}
</style>
