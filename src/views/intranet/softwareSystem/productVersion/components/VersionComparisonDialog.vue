<template>
  <div class="version-comparison-dialog">
    <el-dialog
      title="版本对比详情"
      width="700px"
      :close-on-click-modal="false"
      :before-close="closeVersionComparisonDialog"
      :visible="showVersionComparisonDialog"
    >
      <el-form class="dialog-form">
        <el-form-item label="差异类别">
          <el-select
            v-model="status"
            @change="queryVersionComparisonPaginationList(1)"
            placeholder="请选择"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <el-table
        v-loading="tableCompareLoading"
        :data="tableData"
        height="350"
        style="width: 100%"
      >
        <el-table-column prop="status" label="差异类别">
          <template slot-scope="scope">{{
            formatStatusText(scope.row.status)
          }}</template>
        </el-table-column>
        <el-table-column prop="resourceCode" label="菜单资源编码">
        </el-table-column>
        <el-table-column prop="resourceName" label="菜单资源名称">
        </el-table-column>
        <el-table-column prop="path" label="菜单资源所处位置">
        </el-table-column>
      </el-table>

      <Pagination
        :currentPage.sync="pageNumb"
        :pageSize.sync="pageSize"
        :total.sync="total"
        :reloadTableData="queryVersionComparisonPaginationList"
      />
    </el-dialog>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination.vue";
import sysVersion from "@/api/intranet/lcp/sysVersion.js";

export default {
  name: "VersionComparisonDialog",
  components: {
    Pagination,
  },
  data() {
    return {
      options: [
        {
          value: 0,
          label: "全部",
        },
        {
          value: 1,
          label: "新增",
        },
        {
          value: 3,
          label: "减少",
        },
      ],
      tableData: [],
      pageNumb: 1,
      pageSize: 10,
      total: 0,
      status: 0,
      versionComparisonList: [],
      tableCompareLoading: false,
    };
  },
  props: {
    showVersionComparisonDialog: {
      type: Boolean,
      default: false,
    },
    versionRow: {
      type: Object,
      required: true,
    },
    tenementRow: {
      type: Object,
      required: true,
    },
  },
  watch: {
    showVersionComparisonDialog: {
      handler(val) {
        if (val === true) {
          this.status = 0;
          this.queryVersionComparisonList();
        }
      },
    },
  },
  methods: {
    formatStatusText(status) {
      const statusMap = { 1: "新增", 3: "减少" };
      return statusMap[status];
    },
    closeVersionComparisonDialog() {
      this.$emit("update:showVersionComparisonDialog", false);
    },
    async queryVersionComparisonList() {
      this.tableCompareLoading = true;
      const response = await this.compare().catch((error) => {
        this.tableCompareLoading = false;
        throw new Error("queryVersionComparisonList", error);
      });
      this.versionComparisonList = response.data;
      this.tableCompareLoading = false;
      this.queryVersionComparisonPaginationList(1);
    },

    // 前端分页操作
    queryVersionComparisonPaginationList(page = 0) {
      this.pageNumb = page || this.pageNumb;
      const filterVersionList =
        this.status === 0
          ? this.versionComparisonList
          : this.versionComparisonList.filter((item) => {
              return item.status === this.status;
            });
      if (filterVersionList.length > 0) {
        this.tableData = filterVersionList.slice(
          (this.pageNumb - 1) * this.pageSize,
          this.pageNumb * this.pageSize
        );
        this.total = filterVersionList.length;
      } else {
        this.tableData = [];
        this.total = 0;
      }
    },

    async compare() {
      const category = "MENUTREE";
      const currentLopResourceId = this.versionRow.lopResourceId;
      const targetLopResourceId = this.tenementRow.lopResourceId;
      const params = { category, currentLopResourceId, targetLopResourceId };
      return await sysVersion.compare(params).catch((error) => {
        throw new Error("compare", error);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.version-comparison-dialog {
  .dialog-form {
    margin-bottom: 20px;
  }
}
</style>