<template>
  <div class="dialog-config-customer-code-container">
    <el-dialog
      title="配置业务编码"
      :visible="dialogVisible"
      :close-on-click-modal="false"
      width="1200px"
      top="5vh"
      class="dialog-config-customer-code"
      @open="onOpenDialog"
      @close="onCloseDialog"
    >
      <header class="dialog-config-customer-code__header">
        <section>
          <p>新建：创建新的业务编码输入框</p>
          <p>编辑：修改业务编码</p>
          <p>删除：删除本行业务编码</p>
        </section>
        <el-button type="primary" @click="onClickNewButton">新建</el-button>
      </header>
      <el-table v-loading="tableLoading" :data="tableData" hide-empty-img>
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column
          v-for="{ label, prop, width } in tableColumnList"
          :key="prop"
          :label="label"
          :width="width"
        >
          <template #default="{ row }">
            <span v-if="prop === 'updateTime'">{{
              $dayjs(row[prop]).format("YYYY-MM-DD HH:mm:ss")
            }}</span>
            <span v-else>{{ row[prop] }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="120">
          <template #default="{ row, row: { id, isDefault } }">
            <el-button type="text" @click="onClickTableColumnEditButton(row)"
              >编辑</el-button
            >
            <el-button
              v-if="!isDefault"
              type="text"
              style="color: #e1251b"
              @click="onClickTableColumnDeleteButton(id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <Pagination
        :currentPage.sync="pageNumb"
        :pageSize.sync="pageSize"
        :total.sync="total"
      />
      <template #footer>
        <el-button @click="$emit('update:dialogVisible', false)"
          >关闭</el-button
        >
      </template>
    </el-dialog>
    <el-dialog
      :title="formatEditCustomerCodeDialogTitle"
      :visible="editCustomerDialogVisible"
      :close-on-click-modal="false"
      width="400px"
      class="dialog-edit-customer-code"
      @close="onCloseEditCustomerCodeDialog"
    >
      <el-form :model="formModel" :rules="formRules" ref="form">
        <el-form-item prop="customerCode">
          <el-input
            v-model.trim="formModel.customerCode"
            placeholder="请输入业务编码"
            style="width: 100%"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editCustomerDialogVisible = false">取消</el-button>
        <el-button
          :loading="editCustomerCodeDialogSaveButtonLoading"
          type="primary"
          @click="onClickEditCustomerCodeDialogSaveButton"
          >保存</el-button
        >
      </template>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination.vue";
import lcp from "@/api/intranet/lcp/index.js";
import { debounce } from "lodash";

export default {
  name: "DialogConfigBusinessCode",
  components: { Pagination },
  props: {
    dialogVisible: {
      type: Boolean,
      required: true,
    },
    bizCalloutSubId: {
      type: Number,
    },
  },
  data() {
    return {
      pageNumb: 1,
      pageSize: 10,
      total: 0,
      tableLoading: false,
      tableData: [],
      tableColumnList: [
        { label: "生产环境回调URL", prop: "callBackUrl" },
        { label: "预发环境回调URL", prop: "shadowboxCallbackUrl" },
        { label: "业务编码", prop: "customerCode" },
        { label: "更新时间", prop: "updateTime" },
        { label: "更新人", prop: "updateUser" },
      ],
      id: 0,
      editCustomerDialogVisible: false,
      formModel: {
        customerCode: "",
      },
      formRules: {
        customerCode: [{ required: true, message: "请输入业务编码" }],
      },
      editCustomerCodeDialogSaveButtonLoading: false,
    };
  },
  computed: {
    formatEditCustomerCodeDialogTitle() {
      const { id } = this;
      return id ? "编辑业务编码" : "新增业务编码";
    },
  },
  methods: {
    // 根据内调外订阅接口ID查询内调外业务编码列表接口
    async queryPage() {
      const { pageNumb, pageSize, bizCalloutSubId } = this;
      const params = { pageNumb, pageSize, bizCalloutSubId };
      return lcp.bizapinterface.callOutConfig.queryPage(params);
    },
    // 根据内调外订阅接口业务编码ID编辑（新增）业务编码接口
    async edit() {
      let { id } = this;
      id = id || undefined;
      const { bizCalloutSubId } = this;
      const { customerCode } = this.formModel;
      const data = { id, bizCalloutSubId, customerCode };
      return await lcp.bizapinterface.callOutConfig.edit(data);
    },
    // 根据内调外订阅接口业务编码删除ID业务编码接口
    async delete() {
      const { id } = this;
      const data = { id };
      return await lcp.bizapinterface.callOutConfig.delete(data);
    },

    // 根据内调外订阅接口ID查询内调外业务编码列表接口调用
    async handleQueryPage() {
      this.tableLoading = true;
      const {
        data: { total, list },
      } = await this.queryPage().catch((error) => {
        console.error("handleQueryPage");
        throw error;
      });
      this.total = total || 0;
      this.tableData = Array.isArray(list) ? list : [];
      this.tableLoading = false;
    },
    // 根据内调外订阅接口业务编码ID编辑（新增）业务编码接口
    async handleEdit() {
      this.editCustomerCodeDialogSaveButtonLoading = true;
      await this.edit().catch((error) => {
        this.editCustomerCodeDialogSaveButtonLoading = false;
        console.error("handleEdit");
        throw error;
      });
      this.$message.success("操作成功！");
      this.editCustomerCodeDialogSaveButtonLoading = false;
    },
    // 根据内调外订阅接口业务编码删除ID业务编码接口调用
    async handleDelete() {
      await this.delete().catch((error) => {
        console.error("handleDelete");
        throw error;
      });
      this.$message.success("操作成功！");
    },

    async onOpenDialog() {
      await this.handleQueryPage().catch((error) => {
        console.error("onOpenDialog");
        throw error;
      });
    },
    onCloseDialog() {
      this.pageNumb = 1;
      this.pageSize = 10;
      this.$emit("update:dialogVisible", false);
    },
    onClickNewButton() {
      this.editCustomerDialogVisible = true;
    },
    onClickTableColumnEditButton(row) {
      const { id, customerCode } = row;
      this.id = id;
      this.formModel.customerCode = customerCode;
      this.editCustomerDialogVisible = true;
    },
    async onClickTableColumnDeleteButton(id) {
      this.id = id;
      const h = this.$createElement;
      await this.$msgbox({
        title: "删除提示",
        message: h("p", null, "请确认是否删除本行业务编码？"),
        customClass: "dialog-delete-tip",
        showCancelButton: true,
      })
        .then(async () => {
          await this.handleDelete().catch((error) => {
            console.error("onClickTableColumnDeleteButton");
            throw error;
          });
        })
        .catch(() => {});
      this.id = 0;
      await this.handleQueryPage().catch((error) => {
        console.error("onOpenDialog");
        throw error;
      });
    },
    async onCloseEditCustomerCodeDialog() {
      this.id = 0;
      this.$refs["form"].resetFields();
      await this.handleQueryPage().catch((error) => {
        console.error("onCloseEditCustomerCodeDialog");
        throw error;
      });
    },
    onClickEditCustomerCodeDialogSaveButton: debounce(async function () {
      await this.$refs["form"].validate().catch(() => {
        throw new Error("未通过表单校验");
      });
      await this.handleEdit().catch((error) => {
        console.error("onClickEditCustomerCodeDialogSaveButton");
        throw error;
      });
      this.editCustomerDialogVisible = false;
    }, 300),
  },
};
</script>

<style lang="scss" scoped>
.dialog-config-customer-code {
  /deep/ .el-dialog__body {
    height: 420px;
    overflow: auto;

    .dialog-config-customer-code__header {
      margin-bottom: 8px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }
  }
}
</style>
