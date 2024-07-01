<template>
  <div class="platform-message">
    <el-row type="flex" justify="start" align="center">
      <el-form
        :model="searchFormData"
        :inline="true"
        @keyup.enter.native="handleGetMsgSignList(1)"
      >
        <el-form-item
          v-for="{ label, prop } in searchFormItemList"
          :key="prop"
          :label="label"
          :prop="prop"
        >
          <el-input
            v-if="prop === 'title'"
            v-model.trim="searchFormData.title"
            :clearable="true"
            placeholder="请输入方案中文名称、方法中API、消息中文名称"
            style="width: 360px"
          />
          <el-select
            v-else-if="prop === 'isRead'"
            v-model="searchFormData.isRead"
            style="width: 120px"
          >
            <el-option
              v-for="{ label, value } in isReadOptionList"
              :key="value"
              :label="label"
              :value="value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-search"
            @click="handleGetMsgSignList(1)"
            >搜索</el-button
          >
        </el-form-item>
      </el-form>
    </el-row>

    <el-table v-loading="tableLoading" :data="tableData">
      <el-table-column label="序号" type="index" width="60" />
      <el-table-column
        v-for="{ label, prop, width } in tableColumnList"
        :key="prop"
        :label="label"
        :prop="prop"
        :width="width"
      >
        <template #default="{ row, row: { isRead, createTime } }">
          <span
            v-if="prop === 'isRead'"
            :class="isRead | formatIsReadTableColumnClassName"
          >
            {{ isRead | formatIsReadTableColumnText }}
          </span>
          <span v-else-if="prop === 'createTime'">
            {{ createTime | formatCreateTimeTableColumnText }}
          </span>
          <span v-else>
            {{ row[prop] }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120" fixed="right">
        <template #default="{ row, $index }">
          <el-button type="text" @click="onClickDetailButton(row)"
            >详情</el-button
          >
          <el-popover
            v-model="row.popoverVisible"
            :ref="`popover-${$index}`"
            trigger="manual"
            width="190"
            placement="top-end"
          >
            <p>消息被删除后将不再显示，是否确认删除？</p>
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
                @click="onClickConfirmDeleteButton"
                >确定</el-button
              >
            </div>
            <el-button
              slot="reference"
              type="text"
              style="margin-left: 8px; color: #e1251b"
              @click="onClickDeleteButton(row, `popover-${$index}`)"
              >删除</el-button
            >
          </el-popover>
        </template>
      </el-table-column>
    </el-table>

    <Pagination
      :currentPage.sync="pageNumb"
      :pageSize.sync="pageSize"
      :total.sync="total"
      :reloadTableData="handleGetMsgSignList"
    />

    <el-dialog
      v-if="detailDialogVisible"
      :visible.sync="detailDialogVisible"
      :close-on-click-modal="false"
      :max-height="420"
      title="详情"
      width="720px"
    >
      <MarkdownPreview
        v-loading="markdownLoading"
        v-if="markdown"
        v-model="markdown"
        class="markdown-preview"
      />
      <template #footer>
        <el-button type="primary" @click="detailDialogVisible = false"
          >关 闭</el-button
        >
      </template>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination.vue";
import MarkdownPreview from "@/components/MarkdownPreview/index.vue";
import { parseTime } from "@/utils";
import lcp from "@/api/intranet/lcp/index.js";

export default {
  name: "PlatformMessage",
  components: { Pagination, MarkdownPreview },
  props: {
    msgType: { type: Number, required: true },
  },
  data() {
    return {
      searchFormItemList: [
        { label: "", prop: "title" },
        { label: "消息状态", prop: "isRead" },
      ],
      searchFormData: {
        title: "",
        isRead: null,
      },
      isReadOptionList: [
        { label: "-", value: null },
        { label: "未读", value: 0 },
        { label: "已读", value: 1 },
      ],
      tableLoading: true,
      tableData: [],
      tableColumnList: [
        { label: "消息标题", prop: "title" },
        { label: "消息状态", prop: "isRead", width: "80" },
        { label: "通知时间", prop: "createTime", width: "160" },
      ],
      pageNumb: 1,
      pageSize: 10,
      total: 0,
      currentRowData: {},
      detailDialogVisible: false,
      markdownLoading: true,
      markdown: "",
    };
  },
  filters: {
    formatIsReadTableColumnClassName(isRead) {
      const hashMap = new Map().set(0, "unknownColor").set(1, "normalColor");
      return hashMap.get(isRead) || "-";
    },
    formatIsReadTableColumnText(createTime) {
      const hashMap = new Map().set(0, "未读").set(1, "已读");
      return hashMap.get(createTime) || "-";
    },
    formatCreateTimeTableColumnText(createTime) {
      return parseTime(createTime) || "-";
    },
  },
  methods: {
    // 根据标题关键词查询消息中心列表数据
    async getMsgSignList() {
      const { title, isRead } = this.searchFormData;
      const { msgType, pageNumb, pageSize } = this;
      const params = { title, isRead, msgType, pageNumb, pageSize };
      return await lcp.message.getMsgSignList(params).catch((error) => {
        throw new Error(`getMsgSignList, ${error}`);
      });
    },
    // 根据ID与消息ID标题关键词查询消息中心列表数据
    async modifyMsgSignRead() {
      const { id, messageId } = this.currentRowData;
      const params = { id, messageId };
      return await lcp.message.modifyMsgSignRead(params).catch((error) => {
        throw new Error(`modifyMsgSignRead, ${error}`);
      });
    },
    // 查询当前用户未读消息数量
    async getMessageSignCount() {
      return await lcp.message.getMessageSignCount().catch((error) => {
        throw new Error(`getMessageSignCount, ${error}`);
      });
    },
    // 根据ID删除消息
    async delMsg() {
      const { id } = this.currentRowData;
      const params = { id };
      return await lcp.message.delMsg(params).catch((error) => {
        throw new Error(`delMsg, ${error}`);
      });
    },

    async handleGetMsgSignList(pageNumb = 0) {
      this.pageNumb = pageNumb || this.pageNumb;
      this.tableLoading = true;
      const {
        data: { list = [], total = 0 },
      } = await this.getMsgSignList().catch((error) => {
        throw new Error(`handleGetMsgSignList, ${error}`);
      });
      this.tableData = list || [];
      this.tableData = this.tableData.map((item) => ({
        ...item,
        popoverVisible: false,
      }));
      this.total = total || 0;
      this.tableLoading = false;
    },
    async handleModifyMsgSignRead() {
      this.markdownLoading = true;
      const { data = "" } = await this.modifyMsgSignRead().catch((error) => {
        throw new Error(`handleModifyMsgSignRead, ${error}`);
      });
      this.markdown = data || "";
      this.markdownLoading = false;
    },
    async handleGetMessageSignCount() {
      const { data = 0 } = await this.getMessageSignCount().catch((error) => {
        throw new Error(`handleGetMessageSignCount, ${error}`);
      });
      this.$store.dispatch("user/setMsgCount", data || 0);
    },
    async handleDelMsg() {
      await this.delMsg().catch((error) => {
        throw new Error(`handleDelMsg, ${error}`);
      });
    },

    async onClickDetailButton(row) {
      const { id, messageId, isRead } = row;
      this.currentRowData = { id, messageId };
      await this.handleModifyMsgSignRead().catch((error) => {
        throw new Error(`onClickDetailButton, ${error}`);
      });
      if (isRead === 0) {
        await Promise.all([
          this.handleGetMsgSignList(),
          this.handleGetMessageSignCount(),
        ]).catch((error) => {
          throw new Error(`onClickDetailButton, ${error}`);
        });
      }
      this.detailDialogVisible = true;
    },
    onClickDeleteButton(row, popoverRefName) {
      row.popoverVisible = true;
      // 解决el-table-column fixed popover 重复显示的问题
      this.$nextTick(() => {
        this.$refs[popoverRefName].$refs.popper.previousSibling.remove();
      });
      const { id } = row;
      this.currentRowData = { id };
    },
    async onClickConfirmDeleteButton() {
      await this.handleDelMsg().catch((error) => {
        throw new Error(`onClickConfirmDeleteButton, ${error}`);
      });
      this.$message.success("操作成功！");
      await this.handleGetMsgSignList(1).catch((error) => {
        throw new Error(`onClickConfirmDeleteButton, ${error}`);
      });
    },
  },
  async created() {
    await this.handleGetMsgSignList().catch((error) => {
      throw new Error(`created, ${error}`);
    });
  },
};
</script>

<style lang="scss" scoped>
.platform-message {
}
</style>