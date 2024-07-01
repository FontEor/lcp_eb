<template>
  <div class="distribute-drawer">
    <el-drawer
      size="708px"
      title="下发资源"
      :visible.sync="showDrawerVisible"
      :before-close="handleClose"
    >
      <Steps :active="active" :titleList="titleList" />
      <!-- 第一步 选择租户-->
      <div class="drawer-content" v-show="active === 0">
        <p class="drawer-content-desc">
          请调整分页器后，在当页内勾选要使用新版本{{
            currentRow.versionCode
          }}的租户，完成后点击下一步。
        </p>
        <el-table
          :data="tenantListData"
          :row-key="getRowKeys"
          :height="tableHeight"
          @selection-change="handleSelectionChange"
          style="width: 100%"
        >
          <el-table-column
            type="selection"
            width="55"
            :reserve-selection="true"
          >
          </el-table-column>
          <el-table-column prop="tenementName" label="租户名称">
          </el-table-column>
          <el-table-column prop="tenementCode" label="租户编码">
          </el-table-column>
          <el-table-column prop="envName" label="开通环境"> </el-table-column>
          <el-table-column prop="versionName" label="当前版本名称">
          </el-table-column>
          <el-table-column prop="versionCode" label="当前版本号">
          </el-table-column>
          <el-table-column label="操作" width="110">
            <template slot-scope="scope">
              <el-button type="text" @click="handleCompareDetail(scope.row)"
                >查看对比详情</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <Pagination
          :currentPage.sync="pageNumb"
          :pageSize.sync="pageSize"
          :total.sync="total"
          :reloadTableData="syncResourcesList"
        />
        <div class="drawer-content-footer">
          <el-button @click="handleClose">返回</el-button>
          <el-button type="primary" @click="selectTenantNextStep"
            >下一步</el-button
          >
        </div>
      </div>
      <!-- 第二步 二次确认 -->
      <div class="drawer-content" v-show="active === 1">
        <p class="drawer-content-desc">
          请再次确认是否要将新版本{{
            currentRow.versionCode
          }}覆盖到如下租户中，确认无误请点下一步。
        </p>
        <el-table
          :data="confirmationTableData"
          :height="tableHeight"
          style="width: 100%"
        >
          <el-table-column prop="tenementName" label="租户名称">
          </el-table-column>
          <el-table-column prop="tenementCode" label="租户编码">
          </el-table-column>
          <el-table-column prop="envName" label="开通环境"> </el-table-column>
          <el-table-column prop="versionName" label="当前版本名称">
          </el-table-column>
          <el-table-column prop="versionCode" label="当前版本号">
          </el-table-column>
        </el-table>
        <Pagination
          :currentPage.sync="confirmation.pageNumb"
          :pageSize.sync="confirmation.pageSize"
          :total.sync="confirmation.total"
          :reloadTableData="queryConfirmationPagination"
        />
        <div class="drawer-content-footer">
          <el-button @click="previousStep">上一步</el-button>
          <el-button type="primary" @click="submitBatchSync">下一步</el-button>
        </div>
      </div>
      <!-- 第三步 下发结果 -->
      <div class="drawer-content" v-show="active === 2">
        <div class="drawer-content-result">
          <p>由于本次下发资源量较大，系统正在异步下发，</p>
          <p>下发结果将通过邮件/咚咚通知，请注意查收。</p>
        </div>
      </div>
    </el-drawer>
    <VersionComparisonDialog
      :showVersionComparisonDialog.sync="showVersionComparisonDialog"
      :versionRow="currentRow"
      :tenementRow="tenementRow"
    />
  </div>
</template>

<script>
import VersionComparisonDialog from "@/views/intranet/softwareSystem/productVersion/components/VersionComparisonDialog.vue";
import Steps from "@/components/Steps.vue";
import Pagination from "@/components/Pagination.vue";
import productVersionApi from "@/api/intranet/softwareSystem/productVersion/index.js";
import _ from "lodash";

export default {
  name: "DistributeDrawer",
  components: {
    VersionComparisonDialog,
    Steps,
    Pagination,
  },
  props: {
    showDrawerVisible: {
      type: Boolean,
      required: true,
      default: false,
    },
    currentRow: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      active: 0,
      titleList: ["选择租户", "二次确认", "下发结果"],
      tableHeight: 500,
      pageNumb: 1,
      pageSize: 10,
      total: 0,
      tenantListData: [],
      confirmationTableData: [],
      multipleSelection: [],
      showVersionComparisonDialog: false,
      tenementRow: {},
      confirmation: {
        pageNumb: 1,
        pageSize: 10,
        total: 0,
      },
    };
  },
  mounted() {
    this.syncResourcesList();
    this.resizeHeight();
    window.addEventListener("resize", this.resizeHeight, false);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.resizeHeight, false);
  },
  methods: {
    // 监听视口变化改变表格高度自适应
    resizeHeight: _.debounce(function () {
      this.tableHeight = window.innerHeight - 350;
    }, 200),

    getRowKeys(row) {
      return row.id;
    },
    handleClose() {
      this.$emit("update:showDrawerVisible", false);
      this.$emit("update:showDistributeDrawer", false);
    },
    // 上一步
    previousStep() {
      this.active -= 1;
    },

    // 批量同步SaaS系统资源版本
    async submitBatchSync() {
      await this.batchSync().catch((error) => {
        throw new Error("submitBatchSync", error);
      });
      this.active += 1;
    },

    async batchSync() {
      const activateIds = [];
      this.multipleSelection.length > 0 &&
        this.multipleSelection.forEach((item) => {
          activateIds.push(item.id);
        });
      const versionId = this.currentRow.id;
      const data = { activateIds, versionId };
      return await productVersionApi.batchSync(data).catch((error) => {
        throw new Error("batchSync", error);
      });
    },

    selectTenantNextStep() {
      if (this.multipleSelection.length === 0) {
        this.$message.error("请至少选择一个租户！");
      } else {
        this.active += 1;
      }
    },
    handleCompareDetail(row) {
      this.tenementRow = row;
      this.showVersionComparisonDialog = true;
    },
    async syncResourcesList() {
      const { productId } = this.currentRow;
      const status = 2; //已开通
      const data = { productId, status };
      const { pageSize, pageNumb } = this;
      const params = { pageSize, pageNumb };
      const response = await productVersionApi
        .syncResourcesList(data, params)
        .catch((error) => {
          throw new Error("syncResourcesList", error);
        });
      this.tenantListData = response.data.list;
      this.total = response.data.total;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.queryConfirmationPagination();
    },
    // 前端进行分页操作
    queryConfirmationPagination() {
      if (this.multipleSelection.length > 0) {
        this.confirmationTableData = this.multipleSelection.slice(
          (this.confirmation.pageNumb - 1) * this.confirmation.pageSize,
          this.confirmation.pageNumb * this.confirmation.pageSize
        );
        this.confirmation.total = this.multipleSelection.length;
      } else {
        this.confirmationTableData = [];
        this.confirmation.total = 0;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.distribute-drawer {
  ::v-deep.el-drawer__header {
    margin-bottom: 6px;
    font-size: 16px;
    font-weight: 500;
  }

  ::v-deep .el-drawer__body {
    padding: 8px;
    overflow: auto;
  }
  .drawer-content {
    margin: 0 auto;
    .drawer-content-desc {
      margin: 30px auto;
      text-align: center;
    }
    .drawer-content-footer {
      display: flex;
      justify-content: flex-end;
      margin-top: 30px;
    }
    .drawer-content-result {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      margin-top: 200px;
    }
  }
}
</style>