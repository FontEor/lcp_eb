<template>
  <div style="padding: 0px" meta="x:241.0,y:121.0,width:600.0,height:326.0">
    <el-table
      :data="tableDatas"
      :row-class-name="rowClassName"
      class="my-table mb2"
      empty-text="暂无审批通过的API"
    >
      <el-table-column
        label="序号"
        prop="number"
        align="center"
        min-width="13.21%"
      />
      <el-table-column
        label="API"
        prop="url"
        align="left"
        min-width="41.47%"
        :show-tooltip-when-overflow="true"
      >
        <template slot-scope="scope">
          <a
            href="javascript:void(0)"
            v-on:click="onGotoApiOverView(scope.row.instanceId)"
            class="link"
            style="color: rgb(60, 110, 240)"
          >
            {{ scope.row.url }}
          </a>
        </template>
      </el-table-column>
      <el-table-column
        label="中文名称"
        prop="apiName"
        align="center"
        :show-tooltip-when-overflow="true"
      />
    </el-table>
    <el-row>
      <el-col :span="24" :push="17">
        <pagination
          v-show="listQuery.total"
          :total="listQuery.total"
          :pageSizes.sync="listQuery.pageSizes"
          :page.sync="listQuery.pageNumb"
          :limit.sync="listQuery.pageSize"
          v-on:pagination="paginationChange"
          style="margin: 0px"
        />
      </el-col>
    </el-row>
  </div>
</template>
<script>
import Pagination from "@/components/Pagination/index.vue";
import request from "@/utils/request";
import gwApiRequest from '@/utils/gwApiRequest';
export default {
  props: {
    appKey: String,
  },
  components: { Pagination },

  data() {
    return {
      tableDatas: [],
      listQuery: {
        total: 1,
        pageNumb: 1,
        pageSize: 10,
        pageSizes: [10, 20, 40, 60],
      },
    };
  },

  created() {
    this.queryApiOfCallee();
  },
  methods: {
    rowClassName({ row, rowIndex }) {
      row.number = rowIndex + 1;
    },
    queryApiOfCallee() {
      const pageSize = this.listQuery.pageSize;
      const page = this.listQuery.pageNumb;
      const appKey = this.appKey;
      const sidx = "updateTime";
      const sord = "desc";
      const gwParams = [{page, pageSize, sord, sidx}, {appKey}];
      let url = "/HttpApiService/queryApplyApiList";
      gwApiRequest.post(url, gwParams)
        .then((rsp) => {
          if (rsp.data) {
            this.listQuery.total = rsp.data.total;
            this.tableDatas = rsp.data.rows;
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },
    paginationChange(p) {
      this.listQuery.pageNumb = p.page;
      this.listQuery.pageSize = p.limit;
      this.queryApiOfCallee();
    },
    onGotoApiOverView(id) {
      this.$router.push({
        name: "ApiManagerDetail",
        params: { type: "http", id: id },
      });
    },
  },
};
</script>