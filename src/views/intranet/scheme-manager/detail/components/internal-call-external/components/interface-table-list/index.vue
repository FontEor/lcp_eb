<template>
  <div class="interface-table-list">
    <div class="list-operation">
      <el-button type="primary" icon="el-icon-plus" @click="handleAddInterface"
        >添加接口</el-button
      >
    </div>
    <el-table
      v-loading="tableLoading"
      :data="tableData"
      style="width: 100%"
      class="list-table"
    >
      <el-table-column type="index" label="序号" width="60"></el-table-column>
      <el-table-column
        prop="apiName"
        label="中文名称"
        min-width="180"
        :show-tooltip-when-overflow="true"
      >
      </el-table-column>
      <el-table-column
        prop="apiUrl"
        label="URI"
        min-width="180"
        :show-tooltip-when-overflow="true"
      >
      </el-table-column>
      <el-table-column
        prop="apiRemark"
        label="描述"
        min-width="180"
        :show-tooltip-when-overflow="true"
      >
      </el-table-column>
      <el-table-column prop="categoryName" label="所属分类" min-width="80">
        <template slot-scope="{ row }">
          <span>{{ getCategoryName(row) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" min-width="80">
        <template slot-scope="scope">
          <span :class="formatStatusClass(scope.row.status)">
            {{ formatStatusType(scope.row.status) }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="createUser" label="创建人" min-width="100">
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" min-width="100">
        <template slot-scope="scope">
          {{ formatParseTime(scope.row.createTime) }}
        </template>
      </el-table-column>
      <el-table-column prop="updateUser" label="更新人" min-width="100" />
      <el-table-column prop="updateTime" label="更新时间" min-width="180">
        <template slot-scope="scope">
          {{ formatParseTime(scope.row.updateTime) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" min-width="280">
        <template #default="{ row, row: { outOfDate, status, id } }">
          <el-badge :is-dot="outOfDate" class="table__badge">
            <el-button
              type="text"
              class="badge__button"
              @click="goExternalDocuments(row)"
              >对外文档</el-button
            >
          </el-badge>
          <el-button
            type="text"
            @click="onClickAutoConfigureBusinessCodeButton(row)"
            >业务编码自动配置</el-button
          >
          <el-popover
            v-if="judgeDeletePopoverVisible(status)"
            placement="left-start"
            width="240"
            trigger="click"
            style="display: inline-block; margin-left: 10px"
          >
            <p>若接口已经被发布过，则不可删除。确认删除此接口？</p>
            <div style="text-align: center; margin-top: 8px">
              <el-button
                type="danger"
                style="width: 100%"
                @click="onClickConfirmDeleteButton(id)"
                >确认删除</el-button
              >
            </div>
            <el-button slot="reference" type="text" style="color: #e1251b"
              >删除</el-button
            >
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination
      v-if="total > 0"
      :currentPage.sync="pageNum"
      :pageSize.sync="pageSize"
      :total.sync="total"
      :reloadTableData="queryInterfaceList"
    />
    <DialogAutoConfigureBusinessCode
      :dialogConfigVisible.sync="dialogAutoConfigureBusinessCodeVisible"
      :currentRow="currentRow"
      @closeConfigDialog="queryInterfaceList"
    />
  </div>
</template>

<script>
import Pagination from "@/components/Pagination.vue";
import DialogAutoConfigureBusinessCode from "./components/dialog-auto-configure-business-code.vue";
import parseTime from "@/utils/parseTime.js";
import openBusinese from "@/api/intranet/openBusinese/index.js";
import bizapinterface from "@/api/intranet/lcp/bizapinterface.js";
import openBiz from "@/api/intranet/openBiz/index";

export default {
  name: "InterfaceTableList",
  components: {
    Pagination,
    DialogAutoConfigureBusinessCode,
  },
  data() {
    return {
      tableLoading: false,
      tableData: [],
      pageNum: 1,
      pageSize: 10,
      total: 0,
      manageCategoryData: [],
      dialogAutoConfigureBusinessCodeVisible: false,
      currentRow: {},
    };
  },
  methods: {
    async queryInterfaceList() {
      this.tableLoading = true;
      const params = {
        pageNumb: this.pageNum,
        pageSize: this.pageSize,
        orderBy: "seq",
        orderType: "asc",
        queryLike: "",
        unitId: Number(this.$route.params.id),
        callDirection: 2,
      };
      const response = await openBusinese.interfaceList.queryInterfaceList(
        params
      );
      this.tableData = response.data.list;
      this.total = response.data.total;
      this.tableLoading = false;
      this.$emit("updateDetailHeaderInfo");
    },
    // 根据接口ID删除对接方案API
    async deleteInterface(id) {
      const params = { id };
      return await bizapinterface.deleteInterface(params);
    },

    //转换状态值
    formatStatusType(status) {
      const receiveStatusMap = {
        1: "初始化",
        2: "审核中",
        4: "审核通过",
        5: "已发布",
        9: "审核未通过",
        10: "编辑中",
      };
      return receiveStatusMap[status];
    },

    // 转换状态class值
    formatStatusClass(status) {
      const statusClassTable = {
        1: "initColor",
        2: "updateColor",
        4: "normalColor",
        5: "normalColor",
        9: "deadColor",
        10: "updateColor",
      };
      return statusClassTable[status];
    },
    //转换时间戳
    formatParseTime(time) {
      return time ? parseTime.timeInTable(time) : "-";
    },
    //跳转添加接口
    handleAddInterface() {
      this.$emit("update:showComponent", "AddInterfaceSteps");
    },
    // 跳转对外文档
    goExternalDocuments(row) {
      this.$emit("update:showComponent", "ExternalDocuments");
      this.$emit("update:currentRowId", row.id);
      this.$emit("update:outOfDate", row.outOfDate);
    },
    // 管理接口分类列表
    async manageCategoryList() {
      const unitId = this.$route.params.id;
      const rep = await openBiz.interfaceList
        .getApiCategory({ unitId })
        .catch((error) => {
          throw new Error("manageCategoryList getApiCategory");
        });
      const responseData = rep.data;
      responseData.map((item) => {
        item.editNameState = false;
        item.editCodeState = false;
        return item;
      });
      this.manageCategoryData = responseData;
    },
    getCategoryName(row) {
      const manageCategoryData = this.manageCategoryData.find(
        (item) => item.code === row.categoryCode
      );
      return manageCategoryData ? manageCategoryData.name : "";
    },
    // 判断删除按钮可见性
    judgeDeletePopoverVisible(status) {
      return status === 1;
    },
    onClickAutoConfigureBusinessCodeButton(row) {
      this.currentRow = row;
      this.dialogAutoConfigureBusinessCodeVisible = true;
    },
    // 点击删除按钮操作
    async onClickConfirmDeleteButton(id) {
      await this.deleteInterface(id).catch((error) => {
        throw new Error(`onClickConfirmDeleteButton deleteInterface, ${error}`);
      });
      this.$message.success("删除成功");
      await this.queryInterfaceList().catch((error) => {
        throw new Error(
          `onClickConfirmDeleteButton queryInterfaceList, ${error}`
        );
      });
    },
  },
  created() {
    this.manageCategoryList();
  },
  mounted() {
    this.queryInterfaceList();
  },
};
</script>

<style lang="scss" scoped>
.interface-table-list {
  .list-operation {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 14px;
  }
  .list-table {
    .table__badge {
      vertical-align: baseline;

      ::v-deep .el-badge__content {
        top: 6px;
        margin-right: 4px;
      }
      .badge__button {
        margin: 0 8px;
      }
    }
  }
}
</style>
