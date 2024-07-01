<template>
  <div class="interface-list">
    <div class="search-wrapper">
      <div></div>
      <el-button type="primary" @click="$emit('update:addable', true)"
        >添加接口</el-button
      >
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
        v-for="(item, index) in tableList"
        :key="index"
        :prop="item.prop"
        :label="item.label"
        :min-width="item['min-width']"
        :show-tooltip-when-overflow="true"
      >
        <template slot-scope="{ row, column }">
          <template v-if="column.property === 'methodName'">
            <el-link type="primary" @click="linkToApiDoc(row)">{{
              row[column.property]
            }}</el-link>
          </template>
          <template v-else>
            <span>{{ row[column.property] }}</span>
          </template>
        </template>
      </el-table-column>
      <el-table-column prop="handle" label="操作" min-width="80" fixed="right">
        <template slot-scope="{ row, $index }">
          <el-popover
            v-model="row.popoverVisible"
            placement="top-end"
            width="204"
            trigger="manual"
            popper-class="interface-list__table-column__popover"
            :ref="`popover-${$index}`"
          >
            <p>删除后，API文档中将不显示该接口，但不会影响用户调用。</p>
            <p>是否仍要删除？</p>
            <div style="text-align: right; margin: 0">
              <el-button
                size="mini"
                type="text"
                @click="row.popoverVisible = false"
                >取消</el-button
              >
              <el-button
                type="primary"
                size="mini"
                @click="handleConfirmDeleteInterface(row)"
                >确定</el-button
              >
            </div>
            <el-button
              slot="reference"
              type="text"
              style="color: #e1251b"
              @click="handleDeleteButton(row, `popover-${$index}`)"
              >删除</el-button
            >
          </el-popover>
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
  </div>
</template>

<script>
import Pagination from "@/components/Pagination.vue";
import openInterface from "@/api/intranet/softwareSystem/developerResource/openInterface.js";

export default {
  name: "InterfaceList",
  components: { Pagination },
  props: {
    addable: {
      type: Boolean,
      required: true,
    },
    productCode: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      // 查询表单
      productSysGroupId: undefined,
      keyWords: "",
      // 接口列表
      tableDataLoading: true,
      tableData: [],
      tableList: [
        { prop: "methodName", label: "接口", "min-width": "300" },
        { prop: "cnName", label: "中文名称", "min-width": "180" },
        { prop: "remark", label: "接口描述", "min-width": "180" },
        { prop: "supportedVersions", label: "支持的版本", "min-width": "180" },
        {
          prop: "productSysGroupCnName",
          label: "所属分类",
          "min-width": "180",
        },
      ],
      // 分页器
      currentPage: 1,
      pageSize: 10,
      total: 0,
    };
  },
  methods: {
    // 查询API列表
    async openInterfaceList() {
      const {
        productCode,
        productSysGroupId,
        keyWords,
        currentPage,
        pageSize,
      } = this;
      const pageNum = currentPage;
      const data = {
        productCode,
        productSysGroupId,
        keyWords,
        pageNum,
        pageSize,
      };
      return await openInterface.list(data).catch((error) => {
        const { message } = error.data;
        message && this.$message.error(message);
        throw new Error("openInterfaceList");
      });
    },
    // 删除开放API
    async delete(id) {
      const params = { id };
      return await openInterface.delete(params).catch((error) => {
        const { message } = error.data;
        message && this.$message.error(message);
        throw new Error("delete");
      });
    },

    // 点击接口方法名跳转API仓库
    linkToApiDoc({ interfaceName, methodName }) {
      window.open(
        `${window.location.origin}#/apiMethodList?qualifiedName=${interfaceName}&methodName=${methodName}`,
        "_blank"
      );
    },
    // 加载接口表格
    async reloadTableData() {
      this.tableDataLoading = true;
      const response = await this.openInterfaceList().catch(() => {
        throw new Error("reloadTableData");
      });
      const { data } = response.data;
      const { total, list } = data;
      this.total = total;
      this.tableData = list.map((item) => ({ ...item, popoverVisible: false }));
      this.tableDataLoading = false;
    },
    // 操作删除按钮
    async handleDeleteButton(row, popoverRefName) {
      const response = await this.openInterfaceList().catch(() => {
        throw new Error("handleDeleteButton");
      });
      const { data } = response.data;
      const { list } = data;
      const even = list.some(
        ({ id, supportedVersions }) => row.id === id && supportedVersions
      );
      even
        ? await this.handleConfirmDeleteInterface(row)
        : this.openDoubleCheckPopover(row, popoverRefName);
    },
    // 打开删除接口二次确认弹出框
    openDoubleCheckPopover(row, popoverRefName) {
      row.popoverVisible = true;
      // 解决el-table-column fixed popover 重复显示的问题
      this.$nextTick(() => {
        this.$refs[popoverRefName].$refs.popper.previousSibling.remove();
      });
    },
    // 操作确认删除接口按钮
    async handleConfirmDeleteInterface(row) {
      const { id } = row;
      await this.delete(id).catch(() => {
        throw new Error("handleConfirmDeleteInterface");
      });
      row.popoverVisible = false;
      this.$message.success("删除接口成功！");
      this.$emit("updateStatus");
      this.reloadTableData();
    },
  },
  mounted() {
    this.reloadTableData();
  },
};
</script>

<style lang="scss" scoped>
.interface-list {
  .search-wrapper {
    margin-bottom: 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>