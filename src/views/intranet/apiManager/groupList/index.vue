<template>
  <div>
    <el-row class="filter-container">
      <el-col :span="18">
        <el-form
          style="height: 45px"
          :inline="true"
          :model="listQuery"
          @submit.native.prevent
        >
          <el-form-item>
            <el-input
              placeholder="请输入分组中文/英文名称"
              v-model="listQuery.searchKeyWord"
              v-on:input="onSearchChange"
              style="width: 350px"
              @keyup.enter.native="search"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" v-on:click="search" icon="el-icon-search"
              >查询</el-button
            >
          </el-form-item>
        </el-form>
      </el-col>
      <el-button
        class="filter-container-btn"
        type="primary"
        @click="createApiGroup"
        >创建API分组</el-button
      >
    </el-row>
    <div v-if="tableDatas.length === 0 && type === 1" class="noData">
      <img src="@/assets/img/noData.png" />
      <p>抱歉，没有查询到结果～</p>
    </div>
    <el-table
      :data="tableDatas"
      v-loading="loading"
      v-if="tableDatas.length > 0"
      element-loading-text="加载中"
      element-loading-spinner="el-icon-loading"
      meta="x:37.0,y:57.0,width:901.0,height:216.0"
      :row-class-name="rowClassName"
      class="my-table mb2"
    >
      <template slot="empty">
        <div>经查询，无符合搜索条件的结果</div>
      </template>
      <el-table-column
        label="序号"
        prop="number"
        width="48px"
      />
      <el-table-column
        label="分组中文名称"
        prop="cnName"
        align="left"
        min-width="20%"
        :show-tooltip-when-overflow="true"
      />
      <el-table-column
        label="分组英文名称"
        prop="code"
        align="left"
        min-width="20%"
        :show-tooltip-when-overflow="true"
      />
      <el-table-column
        label="分组内API的服务类型"
        prop="type"
        align="left"
        min-width="12%"
        :show-tooltip-when-overflow="true"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.type === 1">JSF</span>
          <span v-if="scope.row.type === 2">HTTP</span>
          <span v-if="scope.row.type === 3">HTTP流</span>
        </template>
      </el-table-column>
      <el-table-column
        label="分组内API的发布范围"
        prop="serviceType"
        align="left"
        min-width="12%"
        :show-tooltip-when-overflow="true"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.serviceType === 1">内网</span>
          <span v-if="scope.row.serviceType === 2">公网</span>
        </template>
      </el-table-column>
      <el-table-column
        label="分组状态"
        prop="status"
        min-width="10%"
      >
        <template slot-scope="scope">
          <span class="normalColor" v-if="scope.row.status === 4">运行中</span>
          <span
            class="initColor"
            v-if="
              (scope.row.status === 1 || scope.row.status === 3) &&
              scope.row.isOnline === 0
            "
            >初始化</span
          >
          <span
            class="updateColor"
            v-if="
              (scope.row.status === 1 || scope.row.status === 3) &&
              scope.row.isOnline === 1
            "
            >更新中</span
          >
        </template>
      </el-table-column>
      <el-table-column
        label="更新人"
        prop="updateUser"
        align="left"
        min-width="10%"
        :show-tooltip-when-overflow="true"
      />
      <el-table-column
        label="更新时间"
        prop="updateTime"
        min-width="15%"
      >
        <template slot-scope="{ row }">
          <span>{{ serializationTime(row.updateTime) }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" prop="id" min-width="8%">
        <template slot-scope="scope">
          <el-link
            type="primary"
            :underline="false"
            @click="apiGroupDetail(scope.row.id)"
            >管理</el-link
          >

        </template>
      </el-table-column>
    </el-table>
    <el-row>
      <el-col :span="24">
        <!-- jsf -->
        <pagination
          v-show="listQuery.total"
          :total="listQuery.total"
          :pageSizes.sync="listQuery.pageSizes"
          :page.sync="listQuery.page"
          :limit.sync="listQuery.pageSize"
          v-on:pagination="paginationChange"
          style="margin: 0px; float: right"
        />
      </el-col>
    </el-row>
  </div>
</template>
<script>
import Pagination from "@/components/Pagination/index.vue";
import request from "@/utils/request";
import { parseTime } from "@/utils";
import parseTimeNew from "@/utils/parseTime.js";
import gwApiRequest from "@/utils/gwApiRequest";

export default {
  components: { Pagination },
  data() {
    return {
      tableDatas: [],
      type: 1,
      listQuery: {
        searchKeyWord: "",
        total: 0,
        page: 1,
        pageSize: 10,
        pageSizes: [10, 20, 40, 60],
      },
      loading: true,
      loadingInstance: "",
    };
  },
  filters: {
    parseTimefilter(obj, fomart) {
      return parseTime(obj, fomart);
    },
  },
  methods: {
    search() {
      this.queryApiGroup();
    },
    serializationTime(time) {
      return parseTimeNew.timeInTable(time);
    },
    queryApiGroup() {
      let url = "/CloudDomainService/query";
      let params = [
        {
          pageSize: this.listQuery.pageSize,
          page: this.listQuery.page,
        },
        { queryLike: this.listQuery.searchKeyWord.trim(),sceneType: 1},
      ];
      gwApiRequest
        .post(url, params)
        .then((rsp) => {
          this.listQuery.total = rsp.data.total;
          this.tableDatas = rsp.data.rows;
          if (!this.tableDatas) {
            this.tableDatas = [];
          }
          this.loading = false;
        })
        .catch((e) => {
          console.log(e);
          this.loading = false;
        });
    },
    paginationChange(p) {
      this.listQuery.page = p.page;
      this.listQuery.pageSize = p.limit;
      this.queryApiGroup();
    },
    rowClassName({ row, rowIndex }) {
      row.number = rowIndex + 1;
    },
    onSearchChange() {
      if (this.listQuery.searchKeyWord.trim().length === 0) {
        this.queryApiGroup();
      }
    },
    apiGroupDetail(id) {
      this.$router.push({
        name: "ApiManagerApiGroupDetail",
        params: { id: id },
      });
    },
    // 创建API分组
    createApiGroup() {
      this.$router.push({
        name: "ApiManagerCreateApiGroup",
      });
    },
  },
  created() {
    this.queryApiGroup();
  },
};
</script>

<style lang="scss" scoped>
.filter-container {
  .filter-container-btn {
    float: right;
  }
}
.noData {
  text-align: center;
}
</style>
