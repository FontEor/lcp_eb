<template>
  <div class="customerGroup">
    <div v-if="isShowCustomerGroupTable" class="customerGroupTableArea">
      <!-- 顶部tag信息 -->
      <TagTip :text="tagText"></TagTip>
      <!-- 客户分组表格 -->
      <div class="tableAreaHeader">
        <div class="inputWrapper">
          <el-input
            v-model.trim="table.inputValue"
            :placeholder="$t('app.CustomerGroup.5ix6jam5i7o0')"
            @keyup.native.enter="requestTableData"
          ></el-input>
          <el-button
            type="primary"
            icon="el-icon-search"
            @click="requestTableData"
            >{{ $t("app.CustomerGroup.5ix6jam5j0w0") }}</el-button
          >
        </div>
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="handleCreateButton"
          >{{ $t("app.CustomerGroup.5ix6jam5j640") }}</el-button
        >
      </div>
      <el-table
        v-if="pagination.total"
        :data="table.data"
        v-loading="table.loading"
      >
        <el-table-column
          type="index"
          :label="$t('app.CustomerGroup.5ix6jam5j9k0')"
          align="center"
          width="60"
        ></el-table-column>
        <el-table-column
          v-for="(item, index) in table.itemList"
          :key="index"
          :prop="item.prop"
          :label="item.label"
          :formatter="item.formatter"
          align="center"
        >
        </el-table-column>
        <el-table-column
          :label="$t('app.CustomerGroup.5ix6jam5je80')"
          align="center"
          width="180"
        >
          <template slot-scope="{ row }">
            <el-button type="text" @click="handleEditButton(row.id)">{{
              $t("app.CustomerGroup.5ix6jam5jio0")
            }}</el-button>
            <el-button
              v-if="row.groupName !== 'default'"
              type="text"
              @click="handleDeleteButton(row.id, row.groupName)"
              >{{ $t("app.CustomerGroup.5ix6jam5jm40") }}</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div v-else class="noData">
        <img src="@/assets/img/noData.png" />
        <p>{{ $t("app.CustomerGroup.5ix6jam5jp80") }}</p>
      </div>
      <!-- 删除分组对话框 -->
      <el-dialog
        :title="$t('app.CustomerGroup.5ix6jam5jsw0')"
        :visible.sync="table.dialogVisible"
        width="32%"
      >
        <p>
          {{ $t("app.CustomerGroup.5ix6jam5jsw1") }}{{ groupName
          }}{{ $t("app.CustomerGroup.5ix6jam5jsw2") }}
        </p>
        <div slot="footer" class="dialog-footer">
          <el-button @click="table.dialogVisible = false">{{
            $t("app.CustomerGroup.5ix6jam5jw00")
          }}</el-button>
          <el-button type="primary" @click="handleConfirmButton">{{
            $t("app.CustomerGroup.5ix6jam5jz00")
          }}</el-button>
        </div>
      </el-dialog>
      <el-pagination
        v-show="pagination.total"
        :current-page.sync="pagination.page"
        :page-size.sync="pagination.pageSize"
        :page-sizes="pagination.pageSizes"
        :total="pagination.total"
        layout="total, sizes, prev, pager, next, jumper"
        background
        @current-change="requestTableData"
        @size-change="requestTableData"
      ></el-pagination>
    </div>
    <!-- 分组新建/编辑 -->
    <Save
      v-else
      :groupId="groupId"
      :appCode="appCode"
      :isEdit.sync="isEdit"
      :goBack="goBack"
      :formBasicData.sync="formBasicData"
      :formCustomerData.sync="formCustomerData"
    />
  </div>
</template>

<script>
import TagTip from "@/components/common/TagTip.vue";
import Save from "./components/save.vue";
import api from "@/api/index.js";
import parseTime from "@/utils/parseTime.js";

export default {
  name: "CustomerGroup",
  components: {
    TagTip,
    Save,
  },
  props: {
    appCode: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      isShowCustomerGroupTable: true,
      isEdit: false,
      groupId: null,
      groupName: "",
      tagText: this.$t("app.CustomerGroup.5ix6jam5k280"),
      formBasicData: {},
      formCustomerData: {},
      table: {
        loading: true,
        inputValue: "",
        dialogVisible: false,
        data: [],
        itemList: [
          {
            label: this.$t("app.CustomerGroup.5ix6jam5k5c0"),
            prop: "groupName",
          },
          { label: this.$t("app.CustomerGroup.5ix6jam5k8s0"), prop: "desc" },
          {
            label: this.$t("app.CustomerGroup.5ix6jam5kc00"),
            prop: "updateUser",
          },
          {
            label: this.$t("app.CustomerGroup.5ix6jam5kes0"),
            prop: "updateTime",
            formatter: (row, column, cellValue) =>
              parseTime.timeInTable(cellValue),
          },
        ],
      },
      pagination: {
        page: 1,
        pageSize: 10,
        pageSizes: [10, 20, 40, 60],
        total: 0,
      },
    };
  },
  methods: {
    toggleShowMessageTable() {
      this.isShowCustomerGroupTable = !this.isShowCustomerGroupTable;
    },
    goBack() {
      this.requestTableData();
      this.toggleShowMessageTable();
    },
    handleCreateButton() {
      this.groupId = null;
      this.isEdit = false;
      this.formBasicData = {};
      this.formCustomerData = {};
      this.toggleShowMessageTable();
    },
    // 编辑所选客户分组
    async handleEditButton(id) {
      this.groupId = id;
      this.isEdit = true;
      const params = { id };
      const response = await api.appManager
        .getCustomerGroupDetailData(params)
        .catch((error) => {
          throw error;
        });
      const { groupName, desc, pinList } = response.data;
      this.formBasicData = { groupName, desc };
      this.formCustomerData = { pinList: pinList.join(",") };
      this.toggleShowMessageTable();
    },
    // 删除客户分组
    handleDeleteButton(id, groupName) {
      this.groupId = id;
      this.groupName = groupName;
      this.table.dialogVisible = true;
    },
    async handleConfirmButton() {
      try {
        const id = this.groupId;
        const params = { id };
        await api.appManager.postCustomerGroupDeleteData(params);
        this.table.dialogVisible = false;
        this.requestTableData();
      } catch (error) {
        console.log(error);
      }
    },
    async requestTableData() {
      this.table.loading = true;
      const appCode = this.appCode;
      const groupName = this.table.inputValue;
      const pageSize = this.pageSize;
      const pageNumb = this.page;
      const params = { appCode, groupName, pageSize, pageNumb };
      try {
        const response = await api.appManager.getCustomerGroupListData(params);
        const { list, total } = response.data;
        this.table.data = list;
        this.pagination.total = total;
        this.table.loading = false;
      } catch (error) {
        console.log(error);
      }
    },
  },
  mounted() {
    this.requestTableData();
  },
};
</script>

<style lang="scss" scoped>
.customerGroup {
  .customerGroupTableArea {
    .tableAreaHeader {
      margin-bottom: 10px;
      display: flex;
      justify-content: space-between;
      .inputWrapper {
        // width: 500px;
        .el-input {
          margin-right: 10px;
          width: 300px;
        }
      }
    }
    .el-table {
      ::v-deep .el-dialog__header,
      ::v-deep .el-dialog__body {
        text-align: left;
      }
    }
    .el-pagination {
      display: flex;
      justify-content: flex-end;
    }
  }

  .noData {
    text-align: center;
    color: #999;
  }
}
</style>
