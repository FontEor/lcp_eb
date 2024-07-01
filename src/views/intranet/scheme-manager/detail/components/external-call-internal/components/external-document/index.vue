<template>
  <section v-loading="externalDocumentLoading" class="external-document">
    <DocumentHeader
      :id="currentTableRowData.id"
      :apiCode="apiCode"
      :outOfDate="outOfDate"
      :updatePolicy.sync="updatePolicy"
      @back="onBack"
      @updateNow="onUpdateNow"
    />

    <!--文档头部-->
    <el-form
      :model="documentTitleForm"
      ref="documentTitleFormRef"
      :rules="documentTitleFormRules"
      class="api-wrapper"
      label-width="120px"
    >
      <span v-if="editable">
        <el-form-item prop="apiName" label="对外接口名称">
          <el-input
            v-model.trim="documentTitleForm.apiName"
            class="input-title"
            placeholder="请输入内容"
          ></el-input>
        </el-form-item>
      </span>
      <p class="api-desc" v-if="!editable">
        <span class="method-content">对外接口名称</span>
        <span class="api-desc-content">{{ documentTitleForm.apiName }}</span>
      </p>
      <el-form-item prop="apiRemark" label="对外接口描述" v-if="editable">
        <el-input
          type="textarea"
          :rows="5"
          v-model="documentTitleForm.apiRemark"
          placeholder="请输入内容"
          class="input-title"
        ></el-input>
      </el-form-item>
      <div class="api-desc" v-if="!editable">
        <span class="method-content">对外接口描述</span>
        <p class="api-desc-content">{{ documentTitleForm.apiRemark }}</p>
      </div>
      <el-form-item prop="categoryCode" label="所属分类" v-if="editable">
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
      <p class="api-desc" v-if="!editable">
        <span class="method-content">所属分类</span>
        <span class="api-desc-content">{{ categoryName }}</span>
      </p>
    </el-form>

    <div class="document-content" ref="docContent">
      <!--请求参数-->
      <div class="inparams-class">
        <span class="unit-inparams-title">请求参数</span>
      </div>
      <TreeTable
        :tableData="inParams"
        :treeNodeList.sync="inParams"
        :tableColumnInfo="columnsInParams"
        :editer="!editable"
      >
      </TreeTable>
      <!--返回参数-->
      <h4 class="unit-sub-title">响应参数</h4>
      <TreeTable
        :tableData="outParams"
        :treeNodeList.sync="outParams"
        :tableColumnInfo="columnsOutParams"
        :editer="!editable"
      >
      </TreeTable>
      <!--请求报文示例-->
      <h4 class="unit-sub-title">
        请求报文示例<span class="unit-sub-title-title" v-if="editable"
          >如系统自动生成的【模板示例】报文无法满足外部客户可调用的要求，请自行新增可调用的报文示例</span
        >
      </h4>
      <ExamplePacket
        :editable="editable"
        :tabList.sync="requestTabList"
        placeholder="平台建议示例中仅包含开发者必传的字段,以便提升开发者的开发效率"
      />

      <!--响应报文示例-->
      <h4 class="unit-sub-title" style="margin-top: 30px">
        响应报文示例<span class="unit-sub-title-title" v-if="editable"
          >如系统自动生成的【模板示例】报文无法满足外部客户可调用的要求，请自行新增可调用的报文示例</span
        >
      </h4>
      <ExamplePacket
        :editable="editable"
        :tabList.sync="responseTabList"
        placeholder="平台建议示例中仅包含开发者必须要关注的字段,以便提升开发者的开发效率"
      />

      <!--异常示例-->
      <h4 class="unit-sub-title" style="margin-top: 30px">
        异常示例<span class="unit-sub-title-title" v-if="editable"
          >可根据需求自行录入报文示例,如不录入,前台的API文档将不展示该模块</span
        >
      </h4>
      <el-input
        v-model="exceptionDemo"
        :autosize="{ minRows: 10, maxRows: 35 }"
        :disabled="!editable"
        type="textarea"
        placeholder="平台建议示例中仅包含开发者必须要关注的字段,以便提升开发者的开发效率"
      />

      <!--错误码-->
      <h4 class="unit-sub-title" style="margin-top: 30px">错误码</h4>
      <TreeTable
        :tableData="errorCodes"
        :tableColumnInfo="columnsErrorCode"
        :editer="!editable"
      >
        <template v-slot:customColumn>
          <el-table-column
            prop="errorCode"
            label="错误码"
            min-width="35%"
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
            min-width="60%"
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
            min-width="60%"
            :show-tooltip-when-overflow="!editable"
            style="margin: 0px; padding: 0px"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.prescription }}</span>
            </template>
          </el-table-column>
        </template>
      </TreeTable>
    </div>

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
      :apiId="currentTableRowData.id"
      :categoryList="manageCategoryData"
      @recoverDocument="onRecoverDocument"
    />
  </section>
</template>

<script>
import buriedPoint from "@/mixins/buriedPoint.js";
import DocumentHeader from "./components/document-header/index.vue";
import TreeTable from "./components/tree-table.vue";
import ExamplePacket from "./components/example-packet/index.vue";
import StickyWrapper from "@/components/StickyWrapper.vue";
import ClassificationDialog from "./components/classification-dialog.vue";
import DialogViewDocumentHistoricalVersions from "./components/dialog-view-document-historical-versions/index.vue";
import bizapinterface from "@/api/intranet/lcp/bizapinterface.js";
import releaseRecord from "@/api/intranet/lcp/releaseRecord.js";

export default {
  name: "ExternalDocument",
  mixins: [buriedPoint],
  components: {
    DocumentHeader,
    TreeTable,
    ExamplePacket,
    StickyWrapper,
    ClassificationDialog,
    DialogViewDocumentHistoricalVersions,
  },
  props: {
    // 接口列表激活视图
    activeView: {
      type: String,
      required: true,
    },
    currentTableRowData: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      unitId: parseInt(this.$route.params.id),

      externalDocumentLoading: true,
      editable: false,

      apiCode: "",
      outOfDate: false,
      metadataRenew: false,

      getBizApiPreDetailsResponse: {},
      inParams: [],
      outParams: [],
      errorCodes: [],
      exceptionDemo: "",
      exceptionTabList: [],
      requestTabList: [
        // {
        //   tag: '模板示例',
        //   content: '这是模板示例的值啦啦啦',
        //   order: 1,
        // },
        // {
        //   tag: '示例一',
        //   content: '这是示例一的值哈哈哈',
        //   tooltipInfo: {
        //     content: '提示文案'
        //   }
        // },
        // {
        //   tag: '示例二',
        //   content: '这是示例二的值啦啦啦',
        // }
      ],
      responseTabList: [],
      // 更新策略 {1:"全部更新",2:"增量更新",3:"本地更新"}
      updatePolicy: 3,
      visible: 1, //是否隐藏状态
      mapChangeVisible: new Map(), //改变的map
      mapVisible: new Map(), //隐藏map
      showClassificationDialog: false,
      manageCategoryData: [],
      manageCategoryProp: [],
      categoryName: "",

      saveButtonLoading: false,
      saveButtonDebounceTimer: null,

      documentTitleForm: {
        //标题form字段
        apiName: "",
        apiRemark: "",
        categoryCode: "",
      },
      documentTitleFormRules: {
        //标题错误form提示
        apiName: [
          { required: true, message: "接口名称不能为空", trigger: "blur" },
          {
            min: 2,
            max: 255,
            message: "长度在 2 到 20 个字符",
            trigger: "blur",
          },
        ],
        apiRemark: [
          { required: true, message: "接口描述不能为空", trigger: "blur" },
          {
            min: 2,
            max: 500,
            message: "长度在 2 到 500 个字符",
            trigger: "change",
          },
        ],
      },
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
          min_width: "25%",
        },
        {
          prop: "required",
          label: "是否必填",
          min_width: "15%",
          modify: true,
          type: "select",
        },
        {
          prop: "exampleValue",
          label: "示例",
          min_width: "25%",
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
        {
          prop: "operate",
          label: "是否对外显示",
          min_width: "20%",
          modify: true,
          type: "button",
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
          prop: "exampleValue",
          label: "示例",
          min_width: "25%",
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
        {
          prop: "operate",
          label: "是否对外显示",
          min_width: "20%",
          modify: true,
          type: "button",
        },
      ],

      viewDocumentHistoricalVersionsDialogVisible: false,
    };
  },
  watch: {
    exceptionDemo: {
      handler(newValue) {
        const [exceptionDemoFirst] = this.exceptionTabList;
        const content = newValue;
        this.exceptionTabList.splice(0, 1, {
          ...(exceptionDemoFirst || {}),
          content,
        });
      },
      immediate: true,
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
    // 根据对接方案ID、接口ID和参数可见性查询接口对外文档详情
    async getBizApiPreDetails() {
      const { unitId, visible } = this;
      const { id } = this.currentTableRowData;
      const params = { unitId, id, visible };
      return await bizapinterface.getBizApiPreDetails(params).catch((error) => {
        throw new Error(`getBizApiPreDetails, ${error}`);
      });
    },
    // 根据对接方案ID、接口ID、参数可见性和更新策略生成接口对外文档详情
    async generateBizApiPreDetailsPreview() {
      const { unitId, visible, updatePolicy } = this;
      const { id } = this.currentTableRowData;
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
        getBizApiPreDetailsResponse,
        inParams,
        outParams,
        errorCodes,
        metadataRenew,
        updatePolicy,
        exceptionTabList,
        requestTabList,
        responseTabList,
      } = this;
      requestTabList.forEach(item => {
        if (item.tag === "模板示例") {
          delete item.tooltipInfo
        }
      })
      responseTabList.forEach(item => {
        if (item.tag === "模板示例") {
          delete item.tooltipInfo
        }
      })
      const { apiName, apiRemark, categoryCode } = this.documentTitleForm;
      const data = {
        ...getBizApiPreDetailsResponse,
        inParams,
        outParams,
        errorCodes,
        apiName,
        apiRemark,
        categoryCode,
        metadataRenew,
        updatePolicy,
        reponseDemo: responseTabList,
        requestDemo: requestTabList,
        exceptionDemo: exceptionTabList,
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
    // 根据对接方案ID、接口ID和参数可见性查询接口对外文档详情
    async handleGetBizApiPreDetails() {
      this.externalDocumentLoading = true;
      const {
        data,
        data: {
          apiCode,
          outOfDate,
          inParams,
          outParams,
          apiName,
          apiRemark,
          categoryCode,
          errorCodes,
          requestDemo: requestTabList,
          reponseDemo: responseTabList,
          exceptionDemo: exceptionTabList,
        },
      } = await this.getBizApiPreDetails().catch((error) => {
        throw new Error(`handleGetBizApiPreDetails, ${error}`);
      });
      this.getBizApiPreDetailsResponse = data || {};
      this.apiCode = apiCode || "";
      this.outOfDate = outOfDate || false;
      this.mapChangeVisible = new Map();
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

      this.requestTabList = (Array.isArray(requestTabList) ? requestTabList : []).map(item => {
         if (item.tag === '模板示例') {
          item.tooltipInfo = {
            content: '模板报文示例是系统根据API文档中非隐藏参数及参数的示例值生成的，用于帮助外部客户了解API的结构定义。'
          }
        }
        return item;
      });
      this.responseTabList = (Array.isArray(responseTabList)
        ? responseTabList
        : []).map(item => {
           if (item.tag === '模板示例') {
            item.tooltipInfo = {
              content: '模板报文示例是系统根据API文档中非隐藏参数及参数的示例值生成的，用于帮助外部客户了解API的结构定义。'
            }
          }
          return item;
        });
      this.exceptionTabList = Array.isArray(exceptionTabList)
        ? exceptionTabList
        : [];
      const [exceptionDemoFirst] = this.exceptionTabList;
      const { content: exceptionDemo } = exceptionDemoFirst || {};
      this.exceptionDemo = exceptionDemo || "";
    },
    // 根据对接方案ID、接口ID、参数可见性和更新策略生成接口对外文档详情
    async handleGenerateBizApiPreDetailsPreview() {
      this.externalDocumentLoading = true;
      const {
        data,
        data: {
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
      this.getBizApiPreDetailsResponse = data || {};
      this.apiCode = apiCode || "";
      this.outOfDate = outOfDate || false;
      this.mapChangeVisible = new Map();
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
      if (this.mapChangeVisible.size === 0) {
        this.$message.success("保存成功!");
      } else {
        this.$message.success(
          "保存成功,接口文档有更新，请到【方案管理-SDK信息】中同步更新SDK"
        );
      }
    },
    // 根据版本ID查询接口文档历史版本详情
    async handleApiDetails$id(id) {
      this.externalDocumentLoading = true;
      const {
        data,
        data: {
          apiCode,
          outOfDate,
          inParams,
          outParams,
          apiName,
          apiRemark,
          categoryCode,
          errorCodes,
          requestDemo: requestTabList,
          reponseDemo: responseTabList,
          exceptionDemo: exceptionTabList,
        },
      } = await this.apiDetails$id(id).catch((error) => {
        throw new Error(`handleApiDetails$id, ${error}`);
      });
      this.getBizApiPreDetailsResponse = data || {};
      this.apiCode = apiCode || "";
      this.outOfDate = outOfDate || false;
      this.mapChangeVisible = new Map();
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
      this.requestTabList = (Array.isArray(requestTabList) ? requestTabList : []).map(item => {
        if (item.tag === '模板示例') {
          item.tooltipInfo = {
            content: '模板报文示例是系统根据API文档中非隐藏参数及参数的示例值生成的，用于帮助外部客户了解API的结构定义。'
          }
        }
        return item;
      });
      this.responseTabList = (Array.isArray(responseTabList)
        ? responseTabList
        : []).map(item => {
          if (item.tag === '模板示例') {
            item.tooltipInfo = {
              content: '模板报文示例是系统根据API文档中非隐藏参数及参数的示例值生成的，用于帮助外部客户了解API的结构定义。'
            }
          }
          return item;
        });
      this.exceptionTabList = Array.isArray(exceptionTabList)
        ? exceptionTabList
        : [];
      const [exceptionDemoFirst] = this.exceptionTabList;
      const { content: exceptionDemo } = exceptionDemoFirst || {};
      this.exceptionDemo = exceptionDemo || "";
      this.externalDocumentLoading = false;
      this.$message.success("文档数据更新成功，保存文档并发布后生效。");
    },

    /**
     * 设置默认值
     * type标识是输入，还是输出
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
          this.mapVisible.set(paramObj.id, paramObj.visible);
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
    changeUpdateStatus(row) {
      if (this.mapVisible.get(row.id) != row.visible) {
        this.mapChangeVisible.set(row.id, row.visible);
      } else {
        this.mapChangeVisible.delete(row.id);
      }
    },

    onBack() {
      this.$emit("update:activeView", "interfaceList");
    },
    async onUpdateNow() {
      this.visible = 2;
      this.editable = true;
      await this.$nextTick();
      await this.handleGenerateBizApiPreDetailsPreview().catch((error) => {
        throw new Error(`onUpdateNow, ${error}`);
      });
      this.metadataRenew = true;
    },
    async onClickCancelButton() {
      this.visible = 1;
      this.editable = false;
      await this.handleGetBizApiPreDetails().catch((error) => {
        throw new Error(`onClickCancelButton, ${error}`);
      });
      this.metadataRenew = false;
    },
    afterSaveCheck() {
      return new Promise(async (res) => {
        const id = this.currentTableRowData && this.currentTableRowData.id;
        const { data } = await bizapinterface.checkRisk(id).catch((err) => {
          console.log("err", err);
        });
        const { risk, paramList } = data || {};
        if (risk) {
          let msg = "";
          (paramList || []).forEach((param, index) => {
            msg += (index === 0 && `${param}`) || `，${param}`;
          });
          this.$alert(
            `当前接口配置的参数映射值【${msg}】已变更，为不影响运行时调用，请前往「接口列表-编辑-设置参数映射」调整参数！`,
            "接口参数替换变更提醒",
            {
              confirmButtonText: "我知道了",
              callback: (action) => {
                res(risk);
              },
            }
          );
        }
      });
    },
    async onClickSaveButton() {
      clearTimeout(this.saveButtonDebounceTimer);
      this.saveButtonDebounceTimer = setTimeout(async () => {
        this.$refs["documentTitleFormRef"].validate(async (valid) => {
          if (valid) {
            this.saveButtonLoading = true;
            await this.handleSaveBizApiPreDetails().catch((error) => {
              this.saveButtonLoading = false;
              throw new Error(`onClickSaveButton, ${error}`);
            });
            this.saveButtonLoading = false;
            await this.onClickCancelButton().catch((error) => {
              throw new Error(`onClickSaveButton, ${error}`);
            });
            this.$emit("updateDetailHeaderInfo");
            await this.afterSaveCheck();
          } else {
            this.saveButtonLoading = false;
            const apiName = this.documentTitleForm.apiName;
            const apiRemark = this.documentTitleForm.apiRemark;
            if (
              (typeof apiName === "undefined" ||
                apiName === null ||
                apiName.toString().trim() === "") &&
              (typeof apiRemark === "undefined" ||
                apiRemark === null ||
                apiRemark.toString().trim() === "")
            ) {
              this.$message.error("【接口名称】、【接口描述】均不能为空");
              return;
            }
            if (
              typeof apiName === "undefined" ||
              apiName === null ||
              apiName.toString().trim() === ""
            ) {
              this.$message.error("【接口名称】不能为空");
              return;
            }
            if (
              typeof apiRemark === "undefined" ||
              apiRemark === null ||
              apiRemark.toString().trim() === ""
            ) {
              this.$message.error("【接口描述】不能为空");
              return;
            }
          }
        });
      }, 300);
    },
    onClickViewDocumentHistoricalVersionsButton() {
      this.viewDocumentHistoricalVersionsDialogVisible = true;
    },
    async onClickEditButton() {
      this.editable = true;
      this.visible = 2;
      await this.handleGetBizApiPreDetails().catch((error) => {
        throw new Error(`onClickEditButton, ${error}`);
      });
    },
    async onRecoverDocument(id) {
      this.viewDocumentHistoricalVersionsDialogVisible = false;
      this.visible = 2;
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
    await this.handleGetBizApiPreDetails().catch((error) => {
      throw new Error(`created, ${error}`);
    });
  },
};
</script>

<style lang="scss" scoped>
.external-document {
  .sticky-wrapper {
    justify-content: flex-end;
  }
}

.api-wrapper {
  padding: 8px 20px;
  .management-classification {
    margin: 0 12px;
  }
}
.api-desc {
  font-size: 16px;
  margin: 20px auto;
  display: flex;
  align-items: flex-start;
  .method-content {
    color: #666666;
    font-weight: 700;
    font-size: 14px;
    width: 84px;
    text-align: right;
  }
  .api-desc-content {
    display: inline-block;
    width: 500px;
    margin-left: 24px;
    font-size: 14px;
    white-space: pre-wrap;
  }
}

.input-title {
  display: inline-block;
  width: 600px;
  ::v-deep .el-input__inner {
    width: 360px;
    font-size: 14px;
    color: #333333;
    line-height: 32px;
  }
}

.document-content {
  padding: 0 40px;
}

.inparams-class {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
.unit-inparams-title {
  position: relative;
  font-size: 14px;
  color: #666;
  line-height: 20px;
  font-weight: 700;
}

.unit-sub-title {
  position: relative;
  margin-bottom: 20px;
  // padding-left: 12px;
  font-size: 14px;
  color: #666;
  line-height: 20px;
  font-weight: 700;
}
.unit-sub-title-title {
  margin-bottom: 20px;
  font-size: 10px;
  color: #666;
  line-height: 20px;
  margin-left: 8px;
  font-weight: 500;
  margin-top: 30px;
}
::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 10px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 10px;
}

::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 10px;
  box-shadow: inset 0 0 2px rgba(0, 0, 0, 0.2);
  background: #cccccc;
}

::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  background: #ffffff;
}
</style>
