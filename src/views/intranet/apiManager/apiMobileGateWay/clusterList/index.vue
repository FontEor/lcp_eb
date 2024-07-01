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
              placeholder="输入集群的中文名称"
              v-model="listQuery.searchKeyWord"
              @input="onSearchChange"
              style="width: 350px"
              @keyup.enter.native="search"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="search" icon="el-icon-search"
              >查询</el-button
            >
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="6">
        <el-button
          type="primary"
          @click="createClusterDialogVisible = true"
          style="margin-bottom: 5px; float: right"
          >创建集群</el-button
        >
      </el-col>
    </el-row>
    <div v-if="tableDatas.length === 0" class="noData">
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
      align="left"
      class="my-table mb2"
    >
      <template slot="empty">
        <div>经查询，无符合搜索条件的结果</div>
      </template>
      <el-table-column label="序号" prop="number" width="48px" />
      <el-table-column label="集群名称" prop="name" min-width="30%" />
      <el-table-column label="集群描述" prop="desc" min-width="40%" />
      <el-table-column label="集群类型" prop="type" min-width="17%">
        <template slot-scope="scope">
          <span>{{ formatType(scope.row.type) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新人" prop="updateUser" min-width="17.11%" />
      <el-table-column label="更新时间" prop="updateTime" min-width="24.11%">
        <template slot-scope="{ row }">
          <span>{{ serializationTime(row.updateTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="9%">
        <template slot-scope="scope">
          <el-popover
            v-if="scope.row.useFlag"
            :ref="'popover-' + scope.row.id"
            placement="top"
            width="200"
            trigger="click"
          >
            <template>
              <p>已有API使用此集群，是否继续？</p>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" @click="cancleEditCluster(scope.row)"
                  >取消</el-button
                >
                <el-button
                  type="primary"
                  size="mini"
                  @click="confirmEditCluster(scope.row)"
                  >继续</el-button
                >
              </div>
            </template>
            <el-link
            type="primary"
            :underline="false"
            slot="reference"
            >编辑</el-link>
          </el-popover>
          <el-link
           v-if="!scope.row.useFlag"
            type="primary"
            :underline="false"
            slot="reference"
            @click="editCluster(scope.row)"
            >编辑</el-link
          >

        </template>
      </el-table-column>
    </el-table>
    <el-row>
      <el-col :span="24">
        <pagination
          v-show="listQuery.total"
          :total="listQuery.total"
          :pageSizes.sync="listQuery.pageSizes"
          :page.sync="listQuery.pageNumb"
          :limit.sync="listQuery.pageSize"
          v-on:pagination="paginationChange"
          style="margin: 0px; float: right"
        />
      </el-col>
    </el-row>
    <CreateClusterDialog
      :createClusterDialogVisible.sync="createClusterDialogVisible"
      @queryRefresh="queryRefresh"
    />
    <EditClusterDialog
      v-if="editClusterDialogVisible"
      :editClusterDialogVisible.sync="editClusterDialogVisible"
      :id.sync="id"
      @queryRefresh="queryRefresh"
      @tabsValue="tabsValue"
    />
  </div>
</template>
<script>
import Pagination from "@/components/Pagination/index.vue";
import { parseTime } from "@/utils";
import parseTimeNew from "@/utils/parseTime.js";
import CreateClusterDialog from "@/views/intranet/apiManager/apiMobileGateWay/apiList/detail/httpDetail/basicData/createClusterDialog.vue";
import EditClusterDialog from "@/views/intranet/apiManager/apiMobileGateWay/clusterList/editClusterDialog.vue";
import cloudCluster from "@/api/intranet/apiManager/cloudCluster/index.js";

export default {
  components: { Pagination, CreateClusterDialog, EditClusterDialog },
  data() {
    return {
      showPopover: false,
      id: 0,
      tableDatas: [],
      listQuery: {
        searchKeyWord: "",
        total: 0,
        pageNumb: 1,
        pageSize: 10,
        pageSizes: [10, 20, 40, 60],
      },
      loading: true,
      loadingInstance: "",
      createClusterDialogVisible: false,
      editClusterDialogVisible: false,
    };
  },
  filters: {
    parseTimefilter(obj, fomart) {
      return parseTime(obj, fomart);
    },
  },
  methods: {
    queryRefresh(data) {
      if (data) {
        this.queryApi();
      }
    },
    tabsValue(data) {
      this.$emit("showMobileApiList", data);
    },
    formatType(type) {
      const hashMap = { 2: "HTTP服务", 3: "HTTP流" };
      return hashMap[type] || "";
    },
    serializationTime(time) {
      return parseTimeNew.timeInTable(time);
    },
    search() {
      this.queryApi();
    },
    queryApi() {
      const page = this.listQuery.pageNumb;
      const pageSize = this.listQuery.pageSize;
      const name = this.listQuery.searchKeyWord.trim();
      const sidx = "updateTime";
      const sord = "desc";
      const gwParams = [
        { page, pageSize, sord, sidx },
        { name, sceneType: 3 },
      ];
      cloudCluster
        .queryListPage(gwParams)
        .then((res) => {
          this.listQuery.total = res.data.total;
          this.tableDatas = res.data.rows;
          this.loading = false;
        })
        .catch((error) => {
          console.log(error);
          this.loading = false;
        });
    },
    paginationChange(p) {
      this.listQuery.pageNumb = p.page;
      this.listQuery.pageSize = p.limit;
      this.queryApi();
    },
    rowClassName({ row, rowIndex }) {
      row.number = rowIndex + 1;
    },

    onSearchChange() {
      if (this.listQuery.searchKeyWord.trim().length === 0) {
        this.queryApi();
      }
    },
    cancleEditCluster(row) {
      this.$refs[`popover-` + row.id].doClose();
    },
    confirmEditCluster(row) {
      this.$refs[`popover-` + row.id].doClose();
      this.editCluster(row);
    },
    editCluster(row) {
      this.editClusterDialogVisible = true;
      this.id = row.id;
    },
  },
  created() {
    this.queryApi(1, this.listQuery.limit);
  },
};
</script>

<style lang="scss" scoped>
.noData {
  text-align: center;
}
</style>
