<template>
  <div class="query-api-dialog">
    <el-dialog
      title="API查询"
      :visible="dialogQueryApiVisible"
      @close="handleClose"
    >
      <el-form :inline="true" :model="form">
        <el-form-item>
          <el-select
            filterable
            clearable
            @change="handleQueryApi(1)"
            v-model="form.id"
            placeholder="请选择对接方案"
          >
            <el-option
              v-for="item in solutionOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input
            style="width: 300px"
            v-model="form.queryLike"
            placeholder="请输入接口的调用路径/方法名"
            @keyup.enter.native="handleQueryApi(1)"
          ></el-input>
        </el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          @click="handleQueryApi(1)"
          >查询</el-button
        >
      </el-form>

      <el-table class="query-api-dialog__table" :data="tableData">
        <el-table-column
          show-overflow-tooltip
          property="interfaceName"
          label="jsf接口"
          width="260"
        ></el-table-column>
        <el-table-column
          show-overflow-tooltip
          property="interfaceMethod"
          label="jsf方法名"
          width="260"
        ></el-table-column>
        <el-table-column
          show-overflow-tooltip
          property="apiName"
          label="方法中文名称"
          width="260"
        ></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="handleChooseApi(scope.row)"
              >选择</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <Pagination
        :currentPage.sync="pageNumb"
        :pageSize.sync="pageSize"
        :total.sync="total"
        :reloadTableData="handleQueryApi"
      />
    </el-dialog>
  </div>
</template>

<script>
import bizunit from "@/api/intranet/lcp/bizunit";
import bizapinterface from "@/api/intranet/lcp/bizapinterface";
import Pagination from "@/components/Pagination.vue";

export default {
  name: "QueryApiDialog",
  components: { Pagination },
  props: {
    dialogQueryApiVisible: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      form: {
        id: null,
        queryLike: "",
      },
      tableData: [],
      solutionOptions: [],
      // 分页器
      pageNumb: 1,
      pageSize: 10,
      total: 0,
    };
  },
  created() {
    this.fuzzyQuery();
  },
  methods: {
    // 查询对接方案
    async fuzzyQuery() {
      const response = await bizunit.fuzzyQuery().catch((error) => {
        throw new Error("fuzzyQuery" + error);
      });
      this.solutionOptions = response.data.list;
    },
    async handleQueryApi(page) {
      if (!this.form.queryLike && !this.form.id) {
        this.tableData = [];
        this.total = 0;
      } else {
        this.pageNumb = page || this.pageNumb;
        const { pageNumb, pageSize } = this;
        const params = {
          callDirection: 1,
          unitId: this.form.id,
          pageSize,
          pageNumb,
          orderBy: "seq",
          orderType: "asc",
          queryLike: this.form.queryLike,
          type: 1,
        };
        const response = await bizapinterface
          .queryInterface(params)
          .catch((error) => {
            throw new Error("queryInterface" + error);
          });
        this.tableData = response.data.list;
        this.total = response.data.total;
      }
    },
    handleChooseApi(row) {
      this.$emit("updateInterfaceName", row);
      this.$emit("update:dialogQueryApiVisible", false);
    },
    // 关闭弹窗
    handleClose() {
      this.$emit("update:dialogQueryApiVisible", false);
    },
  },
};
</script>

<style lang="scss" scoped>
.query-api-dialog {
  .query-api-dialog__table {
    min-height: 380px;
  }
}
</style>