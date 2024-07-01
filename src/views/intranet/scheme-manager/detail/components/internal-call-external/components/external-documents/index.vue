<template>
  <section v-loading="externalDocumentLoading" class="external-documents">
    <DocumentHeader
      :id="currentRowId"
      :apiCode="apiCode"
      :outOfDate="outOfDate"
      :updatePolicy.sync="updatePolicy"
      @back="onBack"
      @updateNow="onUpdateNow"
    />

    <!-- 接口信息表单 -->
    <el-form
      class="document-title-form"
      :model="documentTitleForm"
      ref="documentTitleFormRef"
      :rules="documentTitleFormRules"
    >
      <el-form-item
        prop="apiName"
        label="接口名称"
        label-width="90px"
        v-if="editable"
      >
        <el-input
          class="form__input"
          v-model.trim="documentTitleForm.apiName"
          placeholder="请输入内容"
        ></el-input>
      </el-form-item>
      <div class="form-api" v-if="!editable">
        <span class="api-desc-title">接口名称</span>
        <span class="api-desc-content">{{ documentTitleForm.apiName }}</span>
      </div>

      <el-form-item
        prop="apiRemark"
        label="接口描述"
        label-width="90px"
        v-if="editable"
      >
        <el-input
          class="form__input"
          :rows="5"
          type="textarea"
          v-model="documentTitleForm.apiRemark"
          placeholder="请输入内容"
        ></el-input>
      </el-form-item>
      <div class="form-api" v-if="!editable">
        <span class="api-desc-title">接口描述</span>
        <p class="api-desc-content">{{ documentTitleForm.apiRemark }}</p>
      </div>
      <el-form-item
        prop="categoryCode"
        label="所属分类"
        v-if="editable"
        label-width="90px"
      >
        <span slot="label">
          所属分类
          <el-tooltip
            class="item"
            effect="dark"
            content="创建接口分类，便于使用方在API文档中根据分类快速找到目标API。"
            placement="top"
          >
            <i class="el-icon-help"></i>
          </el-tooltip>
        </span>
        <el-select
          v-model="documentTitleForm.categoryCode"
          placeholder="请选择所属分类"
        >
          <el-option
            v-for="item in manageCategoryData"
            :key="item.id"
            :label="item.name"
            :value="item.code"
          ></el-option>
        </el-select>
        <el-button
          type="text"
          @click="showClassificationDialog = true"
          class="management-classification"
          >管理分类</el-button
        >
      </el-form-item>
      <p class="form-api" v-if="!editable">
        <span class="api-desc-title">所属分类</span>
        <span class="api-desc-content">{{ categoryName }}</span>
      </p>
    </el-form>
    <!--请求参数-->
    <h4 class="document-sub-title">请求参数</h4>
    <ApiTable
      :tableData="inParams"
      :tableColumnInfo="columnsInParams"
      :editer="!editable"
      :hideEmptyImg="true"
    >
    </ApiTable>
    <!--返回参数-->
    <h4 class="document-sub-title">响应参数</h4>
    <ApiTable
      :tableData="outParams"
      :tableColumnInfo="columnsOutParams"
      :editer="!editable"
      :hideEmptyImg="true"
    >
    </ApiTable>
    <!--请求报文示例-->
    <div class="message-example">
      <h4 class="message-example__title">请求报文示例</h4>
      <span class="title__desc" v-if="editable"
        >可根据需要自行录入报文示例，如不录入，系统会根据“请求参数”中的内容自动生成</span
      >
      <el-input
        type="textarea"
        v-model="requestDemo"
        :autosize="{ minRows: 10, maxRows: 35 }"
        :disabled="!editable"
        placeholder="平台建议示例中仅包含开发者必须要关注的字段，以便提升开发者的开发效率"
      ></el-input>
    </div>

    <!--响应报文示例-->
    <div class="message-example">
      <h4 class="message-example__title">响应报文示例</h4>
      <span class="title__desc" v-if="editable"
        >可根据需要自行录入报文示例，如不录入，系统会根据“响应参数”中的内容自动生成</span
      >
      <el-input
        type="textarea"
        v-model="responseDemo"
        :autosize="{ minRows: 10, maxRows: 35 }"
        :disabled="!editable"
        placeholder="平台建议示例中仅包含开发者必需要关注的字段，以便提升开发者的开发效率"
      ></el-input>
    </div>

    <!--异常示例-->
    <div class="message-example">
      <h4 class="message-example__title" style="margin-top: 30px">
        异常示例<span class="title__desc" v-if="editable"
          >可根据需求自行录入报文示例,如不录入,前台的API文档将不展示该模块</span
        >
      </h4>
      <el-input
        type="textarea"
        :autosize="{ minRows: 10, maxRows: 35 }"
        v-model="exceptionDemo"
        :disabled="!editable"
        placeholder="平台建议示例中仅包含开发者必须要关注的字段,以便提升开发者的开发效率"
      ></el-input>
    </div>

    <!--错误码-->
    <h4 class="document-sub-title">错误码</h4>
    <ApiTable
      :tableData="errorCodes"
      :tableColumnInfo="columnsErrorCode"
      :editer="!editable"
      :showOperation="true"
      :hideEmptyImg="true"
    >
      <template v-slot:customColumn>
        <el-table-column
          prop="errorCode"
          label="错误码"
          min-width="360"
          :show-tooltip-when-overflow="!editable"
          style="margin: 0px; padding: 0px"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.errorCode }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="errorMsg"
          label="错误消息"
          min-width="600"
          :show-tooltip-when-overflow="!editable"
          style="margin: 0px; padding: 0px"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.errorMsg }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="prescription"
          label="处理建议"
          min-width="600"
          :show-tooltip-when-overflow="!editable"
          style="margin: 0px; padding: 0px"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.prescription }}</span>
          </template>
        </el-table-column>
      </template>
    </ApiTable>

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
      <template v-else>
        <el-button
          :clstag="clstag('OpenApi_1671105827529|1', '')"
          type="text"
          @click="onClickViewDocumentHistoricalVersionsButton"
          >查看文档历史版本</el-button
        >
        <el-button type="primary" @click="onClickEditButton">编辑</el-button>
      </template>
    </StickyWrapper>
    <!-- 管理分类对话框 -->
    <ClassificationDialog
      :showClassificationDialog.sync="showClassificationDialog"
      :tableData.sync="manageCategoryProp"
      :queryTableList="handleGetApiCategory"
      :unitId="unitId"
    />
    <DialogViewDocumentHistoricalVersions
      :dialogVisible.sync="viewDocumentHistoricalVersionsDialogVisible"
      :apiId="currentRowId"
      :categoryList="manageCategoryData"
      @recoverDocument="onRecoverDocument"
    />
  </section>
</template>

<script>
import buriedPoint from "@/mixins/buriedPoint.js";
import DocumentHeader from "./components/document-header/index.vue";
import ApiTable from "./components/api-table.vue";
import StickyWrapper from "@/components/StickyWrapper.vue";
import ClassificationDialog from "./components/classification-dialog.vue";
import DialogViewDocumentHistoricalVersions from "./components/dialog-view-document-historical-versions/index.vue";
import bizapinterface from "@/api/intranet/lcp/bizapinterface.js";
import releaseRecord from "@/api/intranet/lcp/releaseRecord.js";

export default {
  name: "ExternalDocuments",
  mixins: [buriedPoint],
  props: {
    currentRowId: {
      type: Number,
      required: true,
    },
  },
  components: {
    DocumentHeader,
    ApiTable,
    StickyWrapper,
    ClassificationDialog,
    DialogViewDocumentHistoricalVersions,
  },
  data() {
    return {
      unitId: parseInt(this.$route.params.id),

      externalDocumentLoading: true,

      editable: false,
      metadataRenew: false,
      manageCategoryData: [],
      manageCategoryProp: [],

      version: "",
      apiCode: "",
      outOfDate: false,
      inParams: [],
      outParams: [],
      categoryName: "",
      errorCodes: [],

      // 更新策略 {1:"全部更新",2:"增量更新",3:"本地更新"}
      updatePolicy: 3,
      documentTitleForm: {
        apiName: "",
        apiRemark: "",
        categoryCode: "",
      },
      documentTitleFormRules: {
        //标题错误form提示
        apiName: [
          { required: true, message: "接口名称不能为空" },
          {
            min: 2,
            max: 255,
            message: "长度在 2 到 20 个字符",
          },
        ],
        apiRemark: [
          { required: true, message: "接口描述不能为空" },
          {
            min: 2,
            max: 500,
            message: "长度在 2 到 500 个字符",
          },
        ],
      },
      requestDemo: "",
      responseDemo: "",
      exceptionDemo: "",

      columnsInParams: [
        //参数列
        {
          prop: "name",
          label: "名称",
          min_width: "30%",
        },
        {
          prop: "oldType",
          label: "类型",
          min_width: "30%",
        },
        {
          prop: "required",
          label: "是否必填",
          min_width: "21%",
          modify: true,
          type: "select",
        },
        {
          prop: "exampleValue",
          label: "示例",
          min_width: "20%",
          modify: true,
          type: "input",
        },
        {
          prop: "remark",
          label: "描述",
          min_width: "25%",
          modify: true,
          type: "textarea",
        },
      ],
      columnsOutParams: [
        //参数列
        {
          prop: "name",
          label: "名称",
          min_width: "30%",
        },
        {
          prop: "oldType",
          label: "类型",
          min_width: "30%",
        },
        {
          prop: "required",
          label: "是否必填",
          min_width: "21%",
          modify: true,
          type: "select",
        },
        {
          prop: "exampleValue",
          label: "示例",
          min_width: "20%",
          modify: true,
          type: "input",
        },
        {
          prop: "remark",
          label: "描述",
          min_width: "25%",
          modify: true,
          type: "textarea",
        },
      ],
      columnsErrorCode: [
        //错误列
        {
          prop: "errorCode",
          label: "错误码",
          modify: true,
          min_width: "35%",
        },
        {
          prop: "errorMsg",
          label: "错误消息",
          modify: true,
          min_width: "60%",
        },
      ],

      saveButtonLoading: false,
      saveButtonDebounceTimer: null,
      showClassificationDialog: false,

      viewDocumentHistoricalVersionsDialogVisible: false,
    };
  },
  computed: {
    computeTitle() {
      return this.apiCode + "的接口文档";
    },
  },
  methods: {
    // 根据对接方案ID查询其下所有的分类
    async getApiCategory() {
      const { unitId } = this;
      const params = { unitId };
      return await bizapinterface.getApiCategory(params).catch((error) => {
        throw new Error(`getApiCategory, ${error}`);
      });
    },
    // 根据对接方案ID、接口ID查询内调外接口对外文档详情
    async getOutwardApiPreDetails() {
      const { unitId, currentRowId } = this;
      const id = currentRowId;
      const params = { unitId, id };
      return await bizapinterface.lcp.unit
        .getOutwardApiPreDetails(params)
        .catch((error) => {
          throw new Error(`getOutwardApiPreDetails, ${error}`);
        });
    },
    // 根据对接方案ID、接口ID、参数可见性和更新策略生成接口对外文档详情
    async generateBizApiPreDetailsPreview() {
      const { unitId, currentRowId, updatePolicy } = this;
      const visible = 1;
      const id = currentRowId;
      const params = { unitId, id, visible, updatePolicy };
      return await bizapinterface
        .generateBizApiPreDetailsPreview(params)
        .catch((error) => {
          throw new Error(`generateBizApiPreDetailsPreview, ${error}`);
        });
    },
    // 根据对接方案ID、接口ID等信息保存接口文档
    async saveBizApiPreDetails() {
      const {
        unitId,
        currentRowId,
        metadataRenew,
        version,
        inParams,
        outParams,
        errorCodes,
        requestDemo,
        responseDemo,
        exceptionDemo,
        updatePolicy,
      } = this;
      const id = currentRowId;
      const { apiName, apiRemark, categoryCode } = this.documentTitleForm;
      const data = {
        unitId,
        id,
        metadataRenew,
        version,
        inParams,
        outParams,
        errorCodes,
        apiName,
        apiRemark,
        categoryCode,
        requestDemo: [{ content: requestDemo }],
        reponseDemo: [{ content: responseDemo }],
        exceptionDemo: [{ content: exceptionDemo }],
        updatePolicy,
      };
      return await bizapinterface.saveBizApiPreDetails(data).catch((error) => {
        throw new Error(`saveBizApiPreDetails, ${error}`);
      });
    },
    // 根据版本ID查询接口文档历史版本详情
    async apiDetails$id(id) {
      return await releaseRecord.apiDetails$id(id).catch((error) => {
        throw new Error(`apiDetails${id}, ${error}`);
      });
    },

    // 根据对接方案ID查询其下所有的分类
    async handleGetApiCategory() {
      const { data } = await this.getApiCategory().catch((error) => {
        throw new Error(`handleGetApiCategory, ${error}`);
      });
      this.manageCategoryData = Array.isArray(data)
        ? data.map((item) => {
            const editNameState = false;
            const editCodeState = false;
            return { ...item, editNameState, editCodeState };
          })
        : [];
      this.manageCategoryProp = JSON.parse(
        JSON.stringify(this.manageCategoryData)
      );
    },
    // 根据对接方案ID、接口ID查询内调外接口对外文档详情
    async handleGetOutwardApiPreDetails() {
      this.externalDocumentLoading = true;
      const {
        data: {
          version,
          apiCode,
          outOfDate,
          inParams,
          outParams,
          apiName,
          apiRemark,
          categoryCode,
          errorCodes,
          requestDemo,
          reponseDemo,
          exceptionDemo,
        },
      } = await this.getOutwardApiPreDetails().catch((error) => {
        throw new Error(`handleGetOutwardApiPreDetails, ${error}`);
      });
      this.version = version || "";
      this.apiCode = apiCode || "";
      this.outOfDate = outOfDate || false;
      this.inParams = Array.isArray(inParams) ? inParams : [];
      if (this.inParams.length > 0) {
        this.setSelectVal(this.inParams);
      }
      this.outParams = Array.isArray(outParams) ? outParams : [];
      if (this.outParams.length > 0) {
        this.setSelectVal(this.outParams);
      }
      this.documentTitleForm.apiName = apiName || "";
      this.documentTitleForm.apiRemark = apiRemark || "";
      this.documentTitleForm.categoryCode = categoryCode || "";
      const { name } = this.manageCategoryData.find(
        ({ code }) => code === categoryCode
      );
      this.categoryName = name || "";
      this.errorCodes = Array.isArray(errorCodes) ? errorCodes : [];
      this.requestDemo = requestDemo || "";
      this.responseDemo = reponseDemo || "";
      this.exceptionDemo = exceptionDemo || "";
      this.externalDocumentLoading = false;
    },
    // 根据对接方案ID、接口ID、参数可见性和更新策略生成接口对外文档详情
    async handleGenerateBizApiPreDetailsPreview() {
      this.externalDocumentLoading = true;
      const {
        data: {
          version,
          apiCode,
          outOfDate,
          inParams,
          outParams,
          apiName,
          apiRemark,
          categoryCode,
          errorCodes,
        },
      } = await this.generateBizApiPreDetailsPreview().catch((error) => {
        throw new Error(`handleGenerateBizApiPreDetailsPreview, ${error}`);
      });
      this.version = version || "";
      this.apiCode = apiCode || "";
      this.outOfDate = outOfDate || false;
      this.inParams = Array.isArray(inParams) ? inParams : [];
      if (this.inParams.length > 0) {
        this.setSelectVal(this.inParams);
      }
      this.outParams = Array.isArray(outParams) ? outParams : [];
      if (this.outParams.length > 0) {
        this.setSelectVal(this.outParams);
      }
      this.documentTitleForm.apiName = apiName || "";
      this.documentTitleForm.apiRemark = apiRemark || "";
      this.documentTitleForm.categoryCode = categoryCode || "";
      const { name } = this.manageCategoryData.find(
        ({ code }) => code === categoryCode
      );
      this.categoryName = name || "";
      this.errorCodes = Array.isArray(errorCodes) ? errorCodes : [];

      this.externalDocumentLoading = false;
      this.$message.success("文档数据更新成功，保存文档并发布后生效。");
    },
    // 根据对接方案ID、接口ID等信息保存接口文档
    async handleSaveBizApiPreDetails() {
      await this.saveBizApiPreDetails().catch((error) => {
        throw new Error(`handleSaveBizApiPreDetails, ${error}`);
      });
      this.$message.success("保存成功!");
    },
    // 根据版本ID查询接口文档历史版本详情
    async handleApiDetails$id(id) {
      this.externalDocumentLoading = true;
      const {
        data: {
          version,
          apiCode,
          outOfDate,
          inParams,
          outParams,
          apiName,
          apiRemark,
          categoryCode,
          errorCodes,
          requestDemo: requestDemoList,
          reponseDemo: responseDemoList,
          exceptionDemo: exceptionDemoList,
        },
      } = await this.apiDetails$id(id).catch((error) => {
        throw new Error(`handleApiDetails$id, ${error}`);
      });
      this.version = version || "";
      this.apiCode = apiCode || "";
      this.outOfDate = outOfDate || false;
      this.inParams = Array.isArray(inParams) ? inParams : [];
      if (this.inParams.length > 0) {
        this.setSelectVal(this.inParams);
      }
      this.outParams = Array.isArray(outParams) ? outParams : [];
      if (this.outParams.length > 0) {
        this.setSelectVal(this.outParams);
      }
      this.documentTitleForm.apiName = apiName || "";
      this.documentTitleForm.apiRemark = apiRemark || "";
      this.documentTitleForm.categoryCode = categoryCode || "";
      const { name } = this.manageCategoryData.find(
        ({ code }) => code === categoryCode
      );
      this.categoryName = name || "";
      this.errorCodes = Array.isArray(errorCodes) ? errorCodes : [];

      const [requestDemoFirst] = Array.isArray(requestDemoList)
        ? requestDemoList
        : [];
      const { content: requestDemo } = requestDemoFirst || {};
      this.requestDemo = requestDemo || "";

      const [responseDemoFirst] = Array.isArray(responseDemoList)
        ? responseDemoList
        : [];
      const { content: responseDemo } = responseDemoFirst || {};
      this.responseDemo = responseDemo || "";

      const [exceptionDemoFirst] = Array.isArray(exceptionDemoList)
        ? exceptionDemoList
        : [];
      const { content: exceptionDemo } = exceptionDemoFirst || {};
      this.exceptionDemo = exceptionDemo || "";

      this.externalDocumentLoading = false;
      this.$message.success("文档数据更新成功，保存文档并发布后生效。");
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

    onBack() {
      this.$emit("update:showComponent", "InterfaceTableList");
    },
    async onUpdateNow() {
      this.editable = true;
      await this.$nextTick();
      await this.handleGenerateBizApiPreDetailsPreview().catch((error) => {
        throw new Error(`onUpdateNow, ${error}`);
      });
      this.metadataRenew = true;
    },
    async onClickCancelButton() {
      this.editable = false;
      await this.handleGetOutwardApiPreDetails().catch((error) => {
        throw new Error(`onClickCancelButton, ${error}`);
      });
      this.metadataRenew = false;
    },
    onClickSaveButton() {
      clearTimeout(this.saveButtonDebounceTimer);
      this.saveButtonDebounceTimer = setTimeout(async () => {
        this.$refs["documentTitleFormRef"].validate(async (valid) => {
          if (valid) {
            this.saveButtonLoading = true;
            await this.handleSaveBizApiPreDetails().catch((error) => {
              this.saveButtonLoading = false;
              throw new Error(error);
            });
            this.saveButtonLoading = false;
            await this.onClickCancelButton().catch((error) => {
              throw new Error(`onClickSaveButton, ${error}`);
            });
            this.$emit("updateDetailHeaderInfo");
          } else {
            return false;
          }
        });
      }, 300);
    },
    onClickViewDocumentHistoricalVersionsButton() {
      this.viewDocumentHistoricalVersionsDialogVisible = true;
    },
    async onClickEditButton() {
      this.editable = true;
      await this.handleGetOutwardApiPreDetails().catch((error) => {
        throw new Error(`onClickEditButton, ${error}`);
      });
    },
    async onRecoverDocument(id) {
      this.viewDocumentHistoricalVersionsDialogVisible = false;
      this.editable = true;
      await this.$nextTick();
      await this.handleApiDetails$id(id).catch((error) => {
        throw new Error(`onRecoverDocument, ${error}`);
      });
    },
  },
  async created() {
    await this.handleGetApiCategory().catch((error) => {
      throw new Error(`created, ${error}`);
    });
    await this.handleGetOutwardApiPreDetails().catch((error) => {
      throw new Error(`created, ${error}`);
    });
  },
};
</script>

<style lang="scss" scoped>
.external-documents {
  .document-title-form {
    margin: 20px 0;
    .form__input {
      width: 600px;
    }
    .form-api {
      display: flex;
      margin: 12px 0;
      .api-desc-title {
        color: #666666;
        font-weight: 700;
      }
      .api-desc-content {
        margin-left: 14px;
        white-space: break-spaces;
        word-wrap: break-word;
        width: 800px;
      }
    }
    .management-classification {
      margin: 0 12px;
    }
  }
  .message-example {
    margin: 10px 0;
    .message-example__title {
      position: relative;
      margin-bottom: 20px;
      font-size: 16px;
      color: #333333;
      line-height: 20px;
      display: inline-block;
    }
    .title__desc {
      font-size: 12px;
      color: #666;
      margin-left: 8px;
    }
  }
  .document-sub-title {
    position: relative;
    margin-bottom: 20px;
    font-size: 16px;
    color: #333333;
    line-height: 20px;
  }
  ::v-deep .el-table::before {
    z-index: auto;
  }

  .sticky-wrapper {
    justify-content: flex-end;
  }
}
</style>
