<template>
  <div>
    <span v-if="this.nodata === 'no'">
      <el-input
        type="text"
        placeholder="请输入应用名称/开发商名称/Appkey"
        v-model="queryLike"
        @keyup.native.enter="queryOrder"
        style="width: 350px; margin: 0 10px 20px 0"
      ></el-input>

      <el-button type="primary" icon="el-icon-search" @click="queryOrder"
        >查询</el-button
      >
      <el-table
        :data="tableDatas"
        v-loading="loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        meta="x:37.0,y:57.0,width:901.0,height:216.0"
        :row-class-name="rowClassName"
        class="my-table mb2"
      >
        <template slot="empty">
          <div>经查询，无符合搜索条件的结果</div>
        </template>
        <el-table-column label="序号" prop="number" width="60" />
        <el-table-column
          label="应用名称"
          prop="appName"
          :show-tooltip-when-overflow="true"
        />
        <el-table-column
          label="应用类型"
          prop="type"
          :show-tooltip-when-overflow="true"
        >
          <template slot-scope="scope">
            <span>{{ formatType(scope) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="开发商名称"
          prop="supplierName"
          :show-tooltip-when-overflow="true"
        />

        <el-table-column label="订阅人" prop="ordererName" />
        <el-table-column label="订阅时间" prop="orderTime" width="160">
          <template slot-scope="scope">
            <span>{{
              scope.row.orderTime | parseTimefilter("{y}-{m}-{d} {h}:{i}")
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="100">
          <template slot-scope="scope">
            <el-button type="text" @click="handleManagement(scope, 'interface')"
              >接口配置</el-button
            >
            <el-button type="text" @click="handleManagement(scope, 'message')"
              >消息配置</el-button
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
    </span>
    <span v-if="this.nodata === 'yes'">
      <div style="margin-top: 0px; text-align: center">
        <img src="@/assets/img/noData.png" />
      </div>
      <div class="noDataMessage">还没有开发者订阅过哦～</div>
    </span>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination/index.vue";
import { parseTime } from "@/utils";
import request from "@/utils/request";
export default {
  name: "orderRecord",
  components: { Pagination },
  data() {
    return {
      nodata: "yes",
      unitId: "",
      listQuery: {
        searchKeyWord: "",
        total: 1,
        pageNumb: 1,
        pageSize: 10,
        pageSizes: [10, 20, 40, 60],
      },
      tableDatas: [],
      loading: true,
      queryLike: "",
    };
  },
  filters: {
    parseTimefilter(obj, fomart) {
      return parseTime(obj, fomart);
    },
  },
  created() {
    this.unitId = this.$route.params.id;
    this.queryOrder();
  },
  methods: {
    queryOrder() {
      this.loading = true;
      let _this = this;
      let url = "/bizunit/findBizOrderList";
      let params = {
        pageSize: _this.listQuery.pageSize,
        pageNumb: _this.listQuery.pageNumb,
        unitId: this.unitId,
        status: 1,
        queryLike: this.queryLike,
      };
      request({
        url: url,
        method: "get",
        params: params,
      })
        .then((rsp) => {
          console.log(rsp);
          if (rsp.data) {
            _this.tableDatas = rsp.data.list;
            _this.listQuery.total = rsp.data.total;
            this.loading = false;
            if (_this.tableDatas.length == 0 && this.nodata === "yes") {
              this.nodata = "yes";
            } else {
              this.nodata = "no";
            }
          }
        })
        .catch((e) => {
          console.log(e);
          this.loading = false;
          this.nodata = "yes";
        });
    },
    paginationChange(p) {
      this.listQuery.pageNumb = p.page;
      this.listQuery.pageSize = p.limit;
      this.queryOrder();
    },
    // 为每一行加一个class 可以用来加样式
    rowClassName({ row, rowIndex }) {
      row.number = rowIndex + 1;
    },
    handleManagement(scope, tabName) {
      this.$emit("update:showRecordList", false);
      this.$emit("update:tabName", tabName);
      this.$emit("update:currentRowData", scope.row);
    },
    formatType(scope) {
      const typeList = ["", "", "", "ISV应用", "商家自研应用", "合作伙伴"];
      return typeList[scope.row.type];
    },
  },
};
</script>

<style scoped>
.noDataMessage {
  width: 100%;
  margin: 0 auto;
  margin-top: 0px;
  text-align: center;
  vertical-align: middle;
}
</style>
