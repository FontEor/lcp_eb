<template>
  <div class="method-table">
    <div class="method-table__search">
      <div class="search__form">
        <el-input
          v-model.trim="queryString"
          :clearable="true"
          placeholder="请输入方法名、方法中文名称"
          style="width: 360px"
          @keyup.enter.native="reloadTableData"
        />
        <el-button
          type="primary"
          style="margin-left: 8px"
          @click="reloadTableData"
          >查 询</el-button
        >
      </div>
      <div class="search__button-wrapper">
        <el-button
          main
          @click="addMethodDialogVisible = true"
          v-if="jsfAddBtnStatus.visible"
          :disabled="jsfAddBtnStatus.disabled"
          >添加方法</el-button
        >
      </div>
    </div>
    <!-- 开放接口表格 -->
    <el-table
      v-loading="tableDataLoading"
      :data="tableData"
      :hideEmptyImg="true"
      style="width: 100%"
    >
      <el-table-column
        type="index"
        label="序号"
        min-width="80"
      ></el-table-column>
      <el-table-column
        v-for="item in tableList"
        :key="item.prop"
        :prop="item.prop"
        :label="item.label"
        :min-width="item['min-width']"
        :show-tooltip-when-overflow="true"
        :formatter="item.formatter"
      >
      </el-table-column>
      <el-table-column prop="handle" label="操作" min-width="100" fixed="right">
        <template slot-scope="{ row }">
          <el-button
            type="text"
            @click="handleEditDoc(row.id)"
            v-if="jsfBtnStatus(row).edit.visible"
            :disabled="jsfBtnStatus(row).edit.disabled"
            >编辑文档</el-button
          >
          <el-button
            type="text"
            @click="handleConfiguration(row)"
            v-if="jsfBtnStatus(row).config.visible"
            :disabled="jsfBtnStatus(row).config.disabled"
            >配置</el-button
          >
          <!-- <el-tooltip
            effect="dark"
            content="JSF下线后，API仓库不会再展示此JSF，对接方案、软件系统将无法添加此JSF。不影响JSF的运行时。"
            placement="top-start"
          >
            <el-button
              type="text"
              class="tap-out-http"
              @click="handleTapOutJsf(row)"
              v-if="jsfBtnStatus(row).offline.visible"
              :disabled="jsfBtnStatus(row).offline.disabled"
              >下线</el-button
            >
          </el-tooltip> -->
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <Pagination
      v-if="total > 0"
      :currentPage.sync="currentPage"
      :pageSize.sync="pageSize"
      :total.sync="total"
      :reloadTableData="reloadTableData"
    />

    <!-- 添加方法对话框 -->
    <AddMethodDialog
      :qualifiedName="qualifiedName"
      :addMethodDialogVisible.sync="addMethodDialogVisible"
      :handleEditDoc="handleEditDoc"
      :reloadTableData="reloadTableData"
      @updateStatus="$emit('updateStatus')"
    />
    <!-- 配置对话框 -->
    <ConfigurationDialog
      :configurationDialogVisible.sync="configurationDialogVisible"
      :currentRow="currentRow"
      @updateStatus="$emit('updateStatus')"
      @reloadTableData="reloadTableData"
    />
    <TapOutJsfDialog
      :tapOutJsfDiaInfo.sync="tapOutJsfDiaInfo"
      @queryApi="reloadTableData"
    ></TapOutJsfDialog>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination.vue";
import AddMethodDialog from "@/views/intranet/apiManager/apiList/detail/jsfDetail/methodList/methodTable/addMethodDialog.vue";
import ConfigurationDialog from "@/views/intranet/apiManager/apiList/detail/jsfDetail/methodList/methodTable/ConfigurationDialog.vue";
import jsfDetail from "@/api/intranet/apiManager/jsfDetail/index.js";
import parseTime from "@/utils/parseTime.js";
import TapOutJsfDialog from "./TapOutJsfDialog.vue";

export default {
  name: "MethodTable",
  components: {
    Pagination,
    AddMethodDialog,
    ConfigurationDialog,
    TapOutJsfDialog
  },
  props: {
    qualifiedName: {
      type: String,
      required: true
    },
    editApiDocVisible: {
      type: Boolean,
      required: true
    },
    methodId: {
      type: Number,
      required: true
    },
    jsfAddBtnStatus: {
      type: Object,
      default: () => {
        return {
          visible: true,
          disabled: false
        };
      }
    }
  },
  computed: {
    jsfBtnStatus() {
      return row => {
        const { isOnline, status } = row;
        let offline = {
          disabled: false,
          visible: true
        };
        let config = {
          disabled: false,
          visible: true
        };
        let edit = {
          disabled: false,
          visible: true
        };
        if (+isOnline === 0 && +status === 1) {
          offline.visible = false;
          // 初始化
        } else if (+isOnline === 1 && +status === 1) {
          // 编辑中
        } else if (+status === 3 || +status === 9 || +status === 7) {
          // 审批中
          edit.disabled = true;
          config.disabled = true;
          offline.disabled = true;
        } else if (+status === 4) {
          // 已发布
        } else if (+status === 6) {
          // 已下线
          edit.disabled = true;
          config.disabled = true;
          offline.visible = false;
        }
        return {
          offline,
          edit,
          config
        };
      };
    }
  },
  data() {
    return {
      queryString: "",
      // 接口列表
      tableDataLoading: true,
      tableData: [],
      tableList: [
        { prop: "name", label: "方法名", "min-width": "300" },
        { prop: "cnName", label: "方法名称中文名", "min-width": "180" },
        { prop: "remark", label: "描述", "min-width": "240" },
        {
          prop: "status",
          label: "状态",
          formatter: (row, column, cellValue) => {
            // 初始化：isOnline==0 and status==1
            // 编辑中：isOnline==1 and status==1
            // 审批中：status==3 or status == 9 or status==7
            // 已发布：status==4
            // 已下线：status==6
            const { status, isOnline } = row;
            let statusClass = "";
            let content = "";
            if (+isOnline === 0 && +status === 1) {
              content = "初始化";
              statusClass = "status status_init";
            } else if (+isOnline === 1 && +status === 1) {
              content = "编辑中";
              statusClass = "status status_edit";
            } else if (+status === 3 || +status === 9 || +status === 7) {
              content = "审批中";
              statusClass = "status status_approve";
            } else if (+status === 4) {
              content = "已发布";
              statusClass = "status status_released";
            } else if (+status == 6) {
              content = "已下线";
              statusClass = "status status_offline";
            }
            return <span class={statusClass}>{content}</span>;
          }
        },
        { prop: "updateUser", label: "更新人", "min-width": "100" },
        {
          prop: "updateTime",
          label: "更新时间",
          "min-width": "180",
          formatter: (row, column, cellValue) =>
            parseTime.timeInTable(cellValue)
        }
      ],
      // 分页器
      currentPage: 1,
      pageSize: 10,
      total: 0,
      // 添加方法对话框
      addMethodDialogVisible: false,
      // 配置对话框
      configurationDialogVisible: false,
      currentRow: {},
      tapOutJsfDiaInfo: {
        show: false,
        rowInfo: null
      }
    };
  },
  methods: {
    // 方法列表-根据方法名或方法中文名方法列表
    async queryMethodListByInterfaceOrCnName() {
      const { qualifiedName, queryString, currentPage, pageSize } = this;
      const name = queryString;
      const page = currentPage;
      const data = [
        { pageSize, page },
        { name, qualifiedName }
      ];
      return await jsfDetail.queryMethodListByInterfaceOrCnName(data);
    },

    // 加载方法表格
    async reloadTableData() {
      this.tableDataLoading = true;
      const { data } = await this.queryMethodListByInterfaceOrCnName().catch(
        () => {
          this.tableDataLoading = false;
          throw new Error("reloadTableData queryMethodListByInterfaceOrCnName");
        }
      );
      const { total, list } = data;
      this.total = total;
      this.tableData = list;
      this.tableDataLoading = false;
    },
    // 编辑文档操作
    handleEditDoc(methodId) {
      this.$emit("update:editApiDocVisible", true);
      this.$emit("update:methodId", methodId);
    },
    // 查询配置
    handleConfiguration(row) {
      this.configurationDialogVisible = true;
      this.currentRow = row;
    },
    handleTapOutJsf(row) {
      this.tapOutJsfDiaInfo = {
        show: true,
        rowInfo: row
      };
    }
  },
  created() {
    this.reloadTableData();
  }
};
</script>

<style lang="scss" scoped>
.method-table {
  .method-table__search {
    margin-bottom: 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;
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