<template>
  <div class="search-table">
    <el-table v-loading="tableLoading" :data="tableData" :hide-empty-img="true">
      <el-table-column
        v-for="{
          label,
          prop,
          type,
          width,
          minWidth,
          showOverflowTooltip,
          fixed,
        } in tableList"
        :key="label"
        :label="label"
        :type="type"
        :prop="prop"
        :width="width"
        :min-width="minWidth"
        :show-overflow-tooltip="showOverflowTooltip"
        :fixed="fixed"
      >
        <template
          #default="{
            row,
            row: { outOfDate, status, hide, id },
            column: { property },
            $index,
          }"
        >
          <template v-if="label === '序号'">
            {{ $index + 1 }}
          </template>
          <template v-else-if="label === '操作'">
            <el-badge
              v-if="judgeTableColumnEditDocumentButtonVisible(hide)"
              :is-dot="true"
              :hidden="
                judgeTableColumnEditDocumentButtonBadgeVisible(outOfDate)
              "
              class="cell__badge"
            >
              <el-button
                type="text"
                @click="$emit('clickTableColumnEditDocumentButton', row)"
                >编辑文档</el-button
              >
            </el-badge>
            <el-button
              v-if="judgeTableColumnHideButtonVisible(status, hide)"
              type="text"
              @click="$emit('clickTableColumnHideButton', row)"
              >隐藏</el-button
            >
            <el-button
              v-if="judgeTableColumnCancelHideButtonVisible(status, hide)"
              type="text"
              @click="$emit('clickTableColumnCancelHideButton', row)"
              >取消隐藏</el-button
            >
            <el-button
              v-if="judgeTableColumnDeleteButtonVisible(status)"
              type="text"
              style="color: #e1251b"
              @click="onClickTableColumnDeleteButton(id)"
              >删除</el-button
            >
          </template>
          <template v-else>
            <span :class="row | formatTableColumnClassName(property)">{{
              row | formatTableColumnText(property)
            }}</span>
          </template>
        </template>
      </el-table-column>
    </el-table>
    <Pagination
      :currentPage="currentPage"
      :pageSize="pageSize"
      :total="total"
      :reloadTableData="reloadTableData"
      @update:currentPage="($event) => $emit('update:currentPage', $event)"
      @update:pageSize="($event) => $emit('update:pageSize', $event)"
    />
  </div>
</template>

<script>
import Pagination from "@/components/Pagination.vue";
import bizmsg from "@/api/intranet/lcp/bizmsg.js";

export default {
  name: "SearchTable",
  components: { Pagination },
  props: {
    tableLoading: { type: Boolean, default: true },
    tableData: { type: Array, default: () => [] },
    currentPage: { type: Number, default: 1 },
    pageSize: { type: Number, default: 10 },
    total: { type: Number, default: 0 },
    reloadTableData: { type: Function, default: () => {} },
  },
  data() {
    return {
      unitId: parseInt(this.$route.params.id),

      tableList: [
        { label: "序号", type: "index", width: "60" },
        {
          label: "TOPIC",
          prop: "name",
          minWidth: "200",
          showOverflowTooltip: true,
        },
        {
          label: "中文名称",
          prop: "chineseName",
          minWidth: "200",
          showOverflowTooltip: true,
        },
        {
          label: "描述",
          prop: "descr",
          minWidth: "180",
          showOverflowTooltip: true,
        },
        {
          label: "所属分类",
          prop: "messageCategoryName",
          minWidth: "180",
          showOverflowTooltip: true,
        },
        { label: "状态", prop: "status", width: "80" },
        { label: "创建人", prop: "createUser", width: "180" },
        { label: "创建时间", prop: "createTime", width: "180" },
        { label: "操作", minWidth: "160", fixed: "right" },
      ],

      tableColumnDeleteButtonDebounceTimer: null,
    };
  },
  filters: {
    formatTableColumnClassName(row, property) {
      const { hide, status } = row;
      const hashMapStatusClassName = new Map()
        .set(1, "initColor")
        .set(5, "normalColor")
        .set(10, "updateColor");
      return property === "status"
        ? hide
          ? "deadColor"
          : hashMapStatusClassName.get(status) || ""
        : "";
    },
    formatTableColumnText(row, property) {
      const { hide, status } = row;
      const hashMapStatusText = new Map()
        .set(1, "初始化")
        .set(5, "已发布")
        .set(10, "编辑中");
      return property === "status"
        ? hide
          ? "已隐藏"
          : hashMapStatusText.get(status) || ""
        : row[property];
    },
  },
  methods: {
    // 根据对接方案ID与消息ID删除消息
    async deleteMessagePreById(id) {
      const { unitId } = this;
      const data = { unitId, id };
      return await bizmsg.deleteMessagePreById(data).catch((error) => {
        throw new Error(`deleteMessagePreById, ${error}`);
      });
    },

    // 根据对接方案ID与消息ID删除消息
    async handleDeleteMessagePreById(id) {
      await this.deleteMessagePreById(id).catch((error) => {
        throw new Error(`handleDeleteMessagePreById, ${error}`);
      });
      this.$message.success("操作成功！");
    },

    judgeTableColumnEditDocumentButtonVisible(hide) {
      return !Boolean(hide);
    },
    judgeTableColumnEditDocumentButtonBadgeVisible(outOfDate) {
      return !outOfDate;
    },
    judgeTableColumnHideButtonVisible(status, hide) {
      return status !== 1 && !hide;
    },
    judgeTableColumnCancelHideButtonVisible(status, hide) {
      return status !== 1 && hide;
    },
    judgeTableColumnDeleteButtonVisible(status) {
      return status === 1;
    },

    onClickTableColumnDeleteButton(id) {
      clearTimeout(this.tableColumnDeleteButtonDebounceTimer);
      this.tableColumnDeleteButtonDebounceTimer = setTimeout(async () => {
        await this.handleDeleteMessagePreById(id).catch((error) => {
          throw new Error(`onClickTableColumnDeleteButton, ${error}`);
        });
        this.$emit("updateDetailHeaderInfo");
        await this.reloadTableData().catch((error) => {
          throw new Error(`onClickTableColumnDeleteButton, ${error}`);
        });
      }, 300);
    },
  },
};
</script>

<style lang="scss" scoped>
.search-table {
  .cell__badge {
    margin-right: 12px;
    vertical-align: baseline;

    ::v-deep .el-badge__content {
      top: 6px;
    }
  }
}
</style>