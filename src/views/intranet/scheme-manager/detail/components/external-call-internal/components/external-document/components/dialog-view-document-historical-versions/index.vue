<template>
  <el-dialog
    :visible="dialogVisible"
    :close-on-click-modal="false"
    title="查看文档历史版本"
    top="5vh"
    width="1200px"
    class="dialog-view-document-historical-versions"
    @open="onOpenDialog"
    @close="onCloseDialog"
    @closed="onClosedDialog"
  >
    <div
      v-loading="dialogLoading"
      class="dialog-view-document-historical-versions__content"
    >
      <LeftVersionList
        :emptyImageVisible="emptyImageVisible"
        :list="leftVersionList"
        :pageNum.sync="pageNum"
        :total="total"
        :currentVersionId.sync="currentVersionId"
        :currentVersionName.sync="currentVersionName"
        :loadingTextVisible="loadingTextVisible"
        ref="leftVersionList"
        @scrollLoad="onScrollLoad"
        @clickLeftVersionListItem="onClickLeftVersionListItem"
      />
      <RightDocument
        :emptyImageVisible="emptyImageVisible"
        :currentVersionName="currentVersionName"
        :form="rightDocumentFormData"
        :categoryList="categoryList"
        :requestParamsTableData="requestParamsTableData"
        :responseParamsTableData="responseParamsTableData"
        :errorCodesTableData="errorCodesTableData"
        :requestDemo="requestDemo"
        :responseDemo="responseDemo"
        :exceptionDemo="exceptionDemo"
        @recoverDocument="onRecoverDocument"
      />
    </div>
  </el-dialog>
</template>

<script>
import LeftVersionList from "./components/left-version-list.vue";
import RightDocument from "./components/right-document/index.vue";
import releaseRecord from "@/api/intranet/lcp/releaseRecord.js";

export default {
  name: "DialogViewDocumentHistoricalVersions",
  components: { LeftVersionList, RightDocument },
  props: {
    dialogVisible: { type: Boolean, required: true },
    apiId: { type: Number, required: true },
    categoryList: { type: Array, required: true },
  },
  data() {
    return {
      dialogLoading: false,
      pageNum: 1,
      pageSize: 30,
      total: 0,
      emptyImageVisible: true,
      leftVersionList: [],
      currentVersionId: 0,
      currentVersionName: "",
      loadingTextVisible: false,
      scrollLoadTime: 0,

      rightDocumentFormData: {
        publisher: "",
        apiName: "",
        apiRemark: "",
        categoryCode: "",
      },
      requestParamsTableData: [],
      responseParamsTableData: [],
      errorCodesTableData: [],
      requestDemo: [],
      responseDemo: [],
      exceptionDemo: [],
    };
  },
  methods: {
    // 根据对接方案接口ID查询接口文档版本列表
    async api$apiId() {
      const { apiId, pageNum, pageSize } = this;
      const params = { pageNum, pageSize };
      return await releaseRecord.api$apiId(apiId, params).catch((error) => {
        throw new Error(`api${apiId}, ${error}`);
      });
    },
    // 根据版本ID查询接口文档历史版本详情
    async apiDetails$id() {
      const { currentVersionId } = this;
      const id = currentVersionId;
      return await releaseRecord.apiDetails$id(id).catch((error) => {
        throw new Error(`apiDetails${id}, ${error}`);
      });
    },

    // 根据对接方案接口ID查询接口文档版本列表
    async handleApi$apiId() {
      const {
        data: { total, list },
      } = await this.api$apiId().catch((error) => {
        throw new Error(`handleApi$apiId, ${error}`);
      });
      this.total = total || 0;
      this.emptyImageVisible = Boolean(!this.total);
      this.leftVersionList = this.leftVersionList.concat(
        Array.isArray(list) ? list : []
      );
    },
    // 根据版本ID查询接口文档历史版本详情
    async handleApiDetails$id() {
      this.dialogLoading = true;
      const {
        data: {
          publisher,
          apiName,
          apiRemark,
          categoryCode,
          inParams,
          outParams,
          errorCodes,
          requestDemo,
          reponseDemo,
          exceptionDemo,
        },
      } = await this.apiDetails$id().catch((error) => {
        throw new Error(`handleApiDetails$id, ${error}`);
      });
      this.rightDocumentFormData.publisher = publisher || "";
      this.rightDocumentFormData.apiName = apiName || "";
      this.rightDocumentFormData.apiRemark = apiRemark || "";
      this.rightDocumentFormData.categoryCode = categoryCode || "";
      this.requestParamsTableData = Array.isArray(inParams) ? inParams : [];
      if (this.requestParamsTableData.length > 0) {
        this.setSelectVal(this.requestParamsTableData);
      }
      this.responseParamsTableData = Array.isArray(outParams) ? outParams : [];
      if (this.responseParamsTableData.length > 0) {
        this.setSelectVal(this.responseParamsTableData);
      }
      this.errorCodesTableData = Array.isArray(errorCodes) ? errorCodes : [];
      this.requestDemo = Array.isArray(requestDemo) ? requestDemo : [];
      this.responseDemo = Array.isArray(reponseDemo) ? reponseDemo : [];
      this.exceptionDemo = Array.isArray(exceptionDemo) ? exceptionDemo : [];
      this.dialogLoading = false;
    },

    /**
     * 设置默认值
     */
    setSelectVal(params) {
      if (params) {
        for (let param in params) {
          let paramObj = params[param];
          if (paramObj.required == "") {
            paramObj.required = "1";
          }
          paramObj.oldType = this.setTypeValue(paramObj.type);
          if (paramObj.children) {
            this.setSelectVal(paramObj.children);
          }
        }
      }
    },
    setTypeValue(typeVal) {
      if (!typeVal) {
        return "";
      } else {
        let aryTypeVal = typeVal.split(".");
        let ret = "";
        for (let i = 0; i < aryTypeVal.length; i++) {
          if (i == aryTypeVal.length - 1) {
            ret = ret + aryTypeVal[i];
            break;
          }
          if (aryTypeVal[i].indexOf("<") != -1) {
            ret =
              ret + aryTypeVal[i].substring(0, aryTypeVal[i].indexOf("<") + 1);
          }
          if (aryTypeVal[i].indexOf(",") != -1) {
            ret =
              ret + aryTypeVal[i].substring(0, aryTypeVal[i].indexOf(",") + 1);
          }
          if (aryTypeVal[i].indexOf(">") != -1) {
            ret = ret + aryTypeVal[i];
          }
        }
        return ret;
      }
    },

    async onOpenDialog() {
      this.dialogLoading = true;
      await this.handleApi$apiId().catch((error) => {
        throw new Error(`onOpenDialog, ${error}`);
      });
      await this.$nextTick();
      if (this.leftVersionList.length > 0) {
        const [firstListItem] = this.$refs.leftVersionList.$refs.listItem;
        firstListItem.click();
      }
      this.dialogLoading = false;
    },
    onCloseDialog() {
      this.$emit("update:dialogVisible", false);
    },
    onClosedDialog() {
      this.emptyImageVisible = true;
      this.pageNum = 1;
      this.total = 0;
      this.leftVersionList = [];
      this.currentVersionId = 0;
      this.currentVersionName = "";
      this.loadingTextVisible = false;
      this.scrollLoadTime = 0;
      this.rightDocumentFormData = {
        publisher: "",
        apiName: "",
        apiRemark: "",
        categoryCode: "",
      };
      this.requestParamsTableData = [];
      this.responseParamsTableData = [];
      this.errorCodesTableData = [];
      this.requestDemo = [];
      this.responseDemo = [];
      this.exceptionDemo = [];
    },
    async onScrollLoad() {
      const { scrollLoadTime, total, pageSize } = this;
      if (scrollLoadTime < 1) {
        this.scrollLoadTime += 1;
        return;
      }
      this.loadingTextVisible = true;
      // 避免在数据不足一页时ElementUI无限滚动组件循环加载
      if (total < pageSize) {
        this.loadingTextVisible = false;
        return;
      }
      setTimeout(async () => {
        this.pageNum += 1;
        await this.handleApi$apiId().catch((error) => {
          throw new Error(`onScrollLoad, ${error}`);
        });
        this.loadingTextVisible = false;
      }, 1000);
    },
    async onClickLeftVersionListItem() {
      await this.handleApiDetails$id().catch((error) => {
        throw new Error(`onClickLeftVersionListItem, ${error}`);
      });
    },
    onRecoverDocument() {
      const { currentVersionId } = this;
      this.$emit("recoverDocument", currentVersionId);
    },
  },
};
</script>

<style lang="scss" scoped>
.dialog-view-document-historical-versions {
  ::v-deep .el-dialog__body {
    padding: 0;
  }

  .dialog-view-document-historical-versions__content {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
  }
}
</style>