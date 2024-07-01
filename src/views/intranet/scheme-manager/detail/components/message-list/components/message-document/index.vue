<template>
  <section v-loading="messageDocumentLoading" class="message-document">
    <DocumentHeader
      :id="currentTableRowData.id"
      :name="name"
      :updatePolicy.sync="updatePolicy"
      :outOfDate="outOfDate"
      @back="onBack"
      @updateNow="onUpdateNow"
    />
    <DocumentForm
      :editable="editable"
      :formData="documentFormData"
      :editedFormData.sync="editedDocumentFormData"
      :classificationDialogVisible.sync="classificationDialogVisible"
      :categoryOptionList.sync="categoryOptionList"
      ref="documentForm"
    />
    <DocumentTable
      :editable="editable"
      :tableData="documentTableData"
      :editedTableData.sync="editedDocumentTableData"
      ref="documentTable"
    />
    <!-- 消息所属分类弹窗 -->
    <ClassificationDialog
      :classificationDialogVisible.sync="classificationDialogVisible"
      :tableData.sync="tableData"
      :getMessageCategoryByUnitId="getMessageCategoryByUnitId"
    />
    <StickyWrapper>
      <div v-if="editable" class="sticky-wrapper__button-wrapper">
        <el-button @click="onClickCancelButton">取消</el-button>
        <el-button
          :loading="saveButtonLoading"
          type="primary"
          @click="onClickSaveButton"
          >保存</el-button
        >
      </div>
      <el-button v-else type="primary" @click="onClickEditButton"
        >编辑</el-button
      >
    </StickyWrapper>
  </section>
</template>

<script>
import DocumentHeader from "./components/document-header/index.vue";
import DocumentForm from "./components/document-form.vue";
import DocumentTable from "./components/document-table.vue";
import StickyWrapper from "@/components/StickyWrapper.vue";
import ClassificationDialog from "./components/classification-dialog.vue";
import bizmsg from "@/api/intranet/lcp/bizmsg.js";

export default {
  name: "MessageDocument",
  components: {
    DocumentHeader,
    DocumentForm,
    DocumentTable,
    StickyWrapper,
    ClassificationDialog,
  },
  props: {
    currentDisplayComponentName: { type: String, required: true },
    currentTableRowData: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      unitId: parseInt(this.$route.params.id),

      messageDocumentLoading: true,
      editable: false,
      name: "",
      outOfDate: 0,
      metadataRenew: false,

      documentFormData: { chineseName: "", descr: "", messageCategoryCode: "" },
      editedDocumentFormData: {
        chineseName: "",
        descr: "",
        messageCategoryCode: "",
      },
      categoryOptionList: [],
      tableData: [],
      classificationDialogVisible: false,

      documentTableData: [],
      editedDocumentTableData: [],

      saveButtonLoading: false,
      saveButtonDebounceTimer: null,

      // 更新策略 {1:"全部更新",2:"增量更新",3:"本地更新"}
      updatePolicy: 3,
    };
  },
  methods: {
    // 根据对接方案ID与消息ID查询消息文档详情
    async getMessagePreDetail() {
      const { unitId } = this;
      const { id } = this.currentTableRowData;
      const data = { unitId, id };
      return await bizmsg.getMessagePreDetail(data).catch((error) => {
        throw new Error(`getMessagePreDetail, ${error}`);
      });
    },
    // 根据对接方案ID与消息ID更新消息文档详情
    async updateMessagePre() {
      const { unitId, name, metadataRenew, editedDocumentTableData } = this;
      const { id } = this.currentTableRowData;
      const { chineseName, descr, messageCategoryCode } =
        this.editedDocumentFormData;
      const messagePropList = editedDocumentTableData;
      const data = {
        unitId,
        id,
        name,
        chineseName,
        descr,
        messageCategoryCode,
        metadataRenew,
        messagePropList,
      };
      return await bizmsg.updateMessagePre(data).catch((error) => {
        throw new Error(`updateMessagePre, ${error}`);
      });
    },
    // 根据消息ID更新消息文档元数据
    async getMsgPreDetailsLatestVersion() {
      const { id } = this.currentTableRowData;
      const params = { id };
      return await bizmsg
        .getMsgPreDetailsLatestVersion(params)
        .catch((error) => {
          throw new Error(`getMsgPreDetailsLatestVersion, ${error}`);
        });
    },

    // 根据对接方案ID与消息ID查询消息文档详情
    async handleGetMessagePreDetail() {
      this.messageDocumentLoading = true;
      const {
        data: {
          name,
          outOfDate,
          chineseName,
          descr,
          messageCategoryCode,
          messagePropList,
        },
      } = await this.getMessagePreDetail().catch((error) => {
        throw new Error(`handleGetMessagePreDetail, ${error}`);
      });
      this.name = name || "";
      this.outOfDate = outOfDate || 0;
      this.documentFormData = { chineseName, descr, messageCategoryCode };
      const documentTableData = Array.isArray(messagePropList)
        ? messagePropList
        : [];
      this.documentTableData = documentTableData;
      this.messageDocumentLoading = false;
    },
    // 根据对接方案ID与消息ID更新消息文档详情
    async handleUpdateMessagePre() {
      await this.updateMessagePre().catch((error) => {
        throw new Error(`handleUpdateMessagePre, ${error}`);
      });
      this.$message.success("操作成功！");
    },
    // 根据消息ID更新消息文档元数据
    async handleGetMsgPreDetailsLatestVersion() {
      this.messageDocumentLoading = true;
      const {
        data: { chineseName, descr, messageCategoryCode, messagePropList },
      } = await this.getMsgPreDetailsLatestVersion().catch((error) => {
        throw new Error(`handleGetMsgPreDetailsLatestVersion, ${error}`);
      });
      this.editedDocumentFormData = { chineseName, descr, messageCategoryCode };
      const editedDocumentTableData = Array.isArray(messagePropList)
        ? messagePropList
        : [];
      this.editedDocumentTableData = editedDocumentTableData;
      this.messageDocumentLoading = false;
      this.$message.success("文档数据更新成功，保存文档并发布后生效。");
    },

    // 生成详情数据 回调
    async handleGenerateBizMsgPreDetailsPreview() {
      this.messageDocumentLoading = true;
      const {
        data: {
          name,
          outOfDate,
          chineseName,
          descr,
          messageCategoryCode,
          messagePropList,
        },
      } = await this.generateBizMsgPreDetailsPreview().catch((error) => {
        throw new Error(`generateBizMsgPreDetailsPreview, ${error}`);
      });
      this.name = name || "";
      this.outOfDate = outOfDate || 0;
      this.editedDocumentFormData = { chineseName, descr, messageCategoryCode };
      const editedDocumentTableData = Array.isArray(messagePropList)
        ? messagePropList
        : [];
      this.editedDocumentTableData = editedDocumentTableData;
      this.messageDocumentLoading = false;
      this.$message.success("文档数据更新成功，保存文档并发布后生效。");
    },

    // 生成详情数据 接口
    async generateBizMsgPreDetailsPreview() {
      const { unitId, updatePolicy } = this;
      const { id } = this.currentTableRowData;
      const params = { unitId, id, queryPolicy: updatePolicy };
      return await bizmsg.getMsgPreDetailsPreview(params).catch((error) => {
        throw new Error(`generateBizMsgPreDetailsPreview, ${error}`);
      });
    },

    async getMessageCategoryByUnitId() {
      const { unitId } = this;
      const params = { unitId };
      const response = await bizmsg
        .getMessageCategoryByUnitId(params)
        .catch((error) => {
          throw new Error(`getMessageCategoryByUnitId, ${error}`);
        });
      const { data } = response;
      this.categoryOptionList = data;

      this.tableData = Array.isArray(data)
        ? data.map((item) => {
            const editNameState = false;
            const editCodeState = false;
            return { ...item, editNameState, editCodeState };
          })
        : [];
    },

    async validateDocumentForm() {
      await this.$refs["documentForm"].validate().catch((valid) => {
        throw new Error(`validateDocumentForm, form validate ${valid}!`);
      });
    },
    async validateDocumentTable() {
      await this.$refs["documentTable"].validate().catch((valid) => {
        throw new Error(`validateDocumentTable, form validate ${valid}!`);
      });
    },

    onBack() {
      this.$emit("update:currentDisplayComponentName", "MessageTable");
    },
    async onUpdateNow() {
      // this.visible = 2; // 这是干嘛的？
      this.editable = true;
      await this.$nextTick();
      await this.handleGenerateBizMsgPreDetailsPreview().catch((error) => {
        throw new Error(`onUpdateNow, ${error}`);
      });
      this.metadataRenew = true;
    },

    onClickCancelButton() {
      this.editable = false;
      this.metadataRenew = false;
    },
    onClickSaveButton() {
      clearTimeout(this.saveButtonDebounceTimer);
      this.saveButtonDebounceTimer = setTimeout(async () => {
        await Promise.all([
          this.validateDocumentForm(),
          this.validateDocumentTable(),
        ]).catch((error) => {
          throw new Error(`onClickSaveButton, ${error}`);
        });
        this.saveButtonLoading = true;
        await this.handleUpdateMessagePre().catch((error) => {
          this.saveButtonLoading = false;
          throw new Error(`onClickSaveButton, ${error}`);
        });
        this.editable = false;
        this.saveButtonLoading = false;
        this.$emit("updateDetailHeaderInfo");
        await this.handleGetMessagePreDetail().catch((error) => {
          throw new Error(`onClickSaveButton, ${error}`);
        });
      }, 300);
    },
    onClickEditButton() {
      this.editable = true;
    },
  },
  async mounted() {
    await this.handleGetMessagePreDetail().catch((error) => {
      throw new Error(`mounted, ${error}`);
    });
    await this.getMessageCategoryByUnitId().catch((error) => {
      throw new Error(`mounted, ${error}`);
    });
  },
};
</script>

<style lang="scss" scoped>
.message-document {
  .sticky-wrapper {
    justify-content: flex-end;
  }
}
</style>
