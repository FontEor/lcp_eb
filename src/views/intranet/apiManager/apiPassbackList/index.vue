<template>
  <div class="api-passback-list">
    <el-form :inline="true" @submit.native.prevent>
      <el-form-item>
        <el-input
          v-model.trim="searchKeyWord"
          placeholder="输入API名称、URL"
          style="width: 360px"
          @keyup.enter.native="loadTableData"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="loadTableData" icon="el-icon-search"
          >查询</el-button
        >
      </el-form-item>
      <el-form-item style="float: right">
        <el-button
          type="primary"
          @click="$router.push({ name: 'ApiManagerPassBackRegister' })"
          >注册API
        </el-button>
      </el-form-item>
    </el-form>

    <el-table
      v-if="tableData && tableData.length > 0"
      v-loading="loading"
      :data="tableData"
      align="left"
    >
      <template slot="empty">
        <div>经查询，无符合搜索条件的结果</div>
      </template>
      <el-table-column label="序号" type="index" width="48px" />
      <el-table-column
        v-for="item in tableList"
        :key="item.id"
        :prop="item.prop"
        :label="item.label"
        :min-width="item['min-width']"
        :formatter="item.formatter"
        :show-tooltip-when-overflow="true"
      >
      <template slot-scope="{row}">
        <div v-if="item.prop === 'status'">
          <span
            class="status_init status"
            v-if="+row.isOnline === 0 && +row.status === 1"
          >
            初始化
          </span>
          <span
            class="status_edit status"
            v-if="+row.isOnline === 1 && +row.status === 1"
          >
            编辑中
          </span>
          <span
            class="status_approve status"
            v-if="
              +row.status === 3 ||
                +row.status === 9 ||
                +row.status === 7
            "
          >
            审批中
          </span>
          <span class="status_released status" v-if="+row.status === 4">
            已发布
          </span>
          <span class="status_offline status" v-if="+row.status === 6">
            已下线
          </span>
        </div>
        <span v-else-if="item.prop === 'updateTime'">
          {{ serializationTime(row.updateTime) }}
        </span>
        <span v-else>{{ row[item.prop] }}</span>
      </template>
    </el-table-column>
      <el-table-column label="操作" min-width="8%">
        <template slot-scope="{ row: { id } }">
          <el-link
            type="primary"
            :underline="false"
            @click="
              $router.push({
                name: 'ApiManagerPassBackDetail',
                params: { id }
              })
            "
            >管理</el-link
          >

        </template>
      </el-table-column>
    </el-table>
    <div v-else class="api-passback-list__no-data">
      <img src="@/assets/img/noData.png" />
      <p>抱歉，没有查询到结果～</p>
    </div>

    <Pagination
      v-if="total > 0"
      :currentPage.sync="page"
      :pageSize.sync="pageSize"
      :pageSizes.sync="pageSizes"
      :total.sync="total"
      :reloadTableData="loadTableData"
    />
  </div>
</template>

<script>
import Pagination from "@/components/Pagination.vue";
import parseTime from "@/utils/parseTime.js";
import gateway from "@/api/intranet/gateway/index.js";

export default {
  name: "ApiPassbackList",
  components: { Pagination },
  data() {
    return {
      loading: true,
      tableData: [],
      tableList: [
        { prop: "name", label: "API名称", "min-width": "15%" },
        { prop: "url", label: "URL", "min-width": "25%" },
        { prop: "status", label: "状态", "min-width": "10%" },
        { prop: "updateUser", label: "更新人", "min-width": "15%" },
        {
          prop: "updateTime",
          label: "更新时间",
          "min-width": "20%",
        }
      ],
      searchKeyWord: "",
      total: 0,
      page: 1,
      pageSize: 10,
      pageSizes: [10, 20, 40, 60]
    };
  },
  methods: {
    serializationTime(time) {
      return parseTime.timeInTable(time);
    },
    // 根据API名称或URL查询内调外API列表
    async queryOuterApiByCondition() {
      const { pageSize, page, searchKeyWord } = this;
      const data = [{ pageSize, pageNumb:page }, { searchKeyWord,  sceneType: 1}];
      return await gateway.ApiManagerService.queryOuterApiByCondition(data);
    },

    // 加载表格数据
    async loadTableData() {
      this.loading = true;
      const { data } = await this.queryOuterApiByCondition().catch(() => {
        throw new Error("loadTableData queryOuterApiByCondition");
      });
      const { list, total } = data;
      this.tableData = list || [];
      this.total = total || 0;
      this.loading = false;
    }
  },
  created() {
    this.loadTableData();
  }
};
</script>

<style lang="scss" scoped>
.api-passback-list {
  min-height: calc(100vh - 100px);
  .api-passback-list__no-data {
    text-align: center;
  }
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
</style>