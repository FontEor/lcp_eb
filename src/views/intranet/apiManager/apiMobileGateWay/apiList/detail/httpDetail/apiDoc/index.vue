<template>
  <div v-loading="loading" class="api-doc">
    <div v-if="editable" class="content__title">
      <Title text="请求参数" />
      <QuickMaintain
        :qualifiedName="qualifiedName"
        :methodId="methodId"
        :methodName="methodName"
        :alias="alias"
        :isRequest="true"
        :handleUpdateParamList="handleUpdateParamList"
        :provideWay="provideWay"
        :tableData="requestParamTableEditedData"
      />
    </div>
    <Title v-else text="请求参数" />
    <ParamTable
      :editable="editable"
      :isRequest="true"
      :paramTableData.sync="requestParamTableData"
      :paramTableEditedData.sync="requestParamTableEditedData"
      ref="requestParamTable"
    />

    <div v-if="editable" class="content__title">
      <Title text="响应参数" />
      <QuickMaintain
        :qualifiedName="qualifiedName"
        :methodId="methodId"
        :methodName="methodName"
        :alias="alias"
        :isRequest="false"
        :handleUpdateParamList="handleUpdateParamList"
        :provideWay="provideWay"
        :tableData="responseParamTableEditedData"
      />
    </div>
    <Title v-else text="响应参数" />
    <ParamTable
      :editable="editable"
      :isRequest="false"
      :paramTableData.sync="responseParamTableData"
      :paramTableEditedData.sync="responseParamTableEditedData"
      ref="responseParamTable"
    />

    <Title text="错误码" />
    <ErrorCodeTable
      :editable="editable"
      :errorCodeTableData="errorCodeTableData"
      :errorCodeTableEditedData="errorCodeTableEditedData"
      ref="errorCodeTable"
    />

    <StickyWrapper>
      <el-button
        v-if="!editable"
        type="primary"
        :disabled="disabledEdit"
        @click="editable = true"
        >编 辑</el-button
      >
      <div v-else class="button-wrapper">
        <el-button @click="handleClickCancel">取 消</el-button>
        <el-button
          type="primary"
          :loading="saveLoading"
          @click="handleClickSave"
          >保 存</el-button
        >
      </div>
    </StickyWrapper>
  </div>
</template>

<script>
import StickyWrapper from "@/components/StickyWrapper.vue";
import Title from "@/components/Title.vue";
import ParamTable from "@/views/intranet/apiManager/apiMobileGateWay/apiList/detail/components/paramTable.vue";
import ErrorCodeTable from "@/views/intranet/apiManager/apiMobileGateWay/apiList/detail/components/errorCodeTable.vue";
import QuickMaintain from "@/views/intranet/apiManager/apiMobileGateWay/apiList/detail/httpDetail/apiDoc/quickMaintain.vue";
import apiDoc from "@/api/intranet/apiManager/httpDetail/apiDoc.js";
import httpDetail from "@/api/intranet/apiManager/httpDetail/index.js";

export default {
  name: "ApiDoc",
  components: {
    StickyWrapper,
    Title,
    ParamTable,
    ErrorCodeTable,
    QuickMaintain,
  },
  props: {
    disabledEdit: {
      type: Boolean,
      required: true,
    },
    groupCode: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      loading: true,
      editable: false,
      // 请求参数表格
      requestParamTableData: [],
      requestParamTableEditedData: [],
      // 响应参数表格
      responseParamTableData: [],
      responseParamTableEditedData: [],
      // 错误码表格
      errorCodeTableData: [],
      errorCodeTableEditedData: [],
      debounceTimer: null,
      saveLoading: false,
      // 提供API的方式
      provideWay: 0,
      qualifiedName: "",
      methodId: 0,
      methodName: "",
      alias: "",
    };
  },
  watch: {
    requestParamTableData: {
      // 监听请求参数数据变化时，更新编辑态请求参数表格数据
      handler(newValue) {
        this.requestParamTableEditedData = JSON.parse(JSON.stringify(newValue));
      },
    },
    responseParamTableData: {
      // 监听响应参数数据变化时，更新编辑态请求参数表格数据
      handler(newValue) {
        this.responseParamTableEditedData = JSON.parse(
          JSON.stringify(newValue)
        );
      },
    },
    errorCodeTableData: {
      // 监听错误码数据变化时，更新编辑态错误码表格数据
      handler(newValue) {
        this.errorCodeTableEditedData = JSON.parse(JSON.stringify(newValue));
      },
    },
  },
  methods: {
    // API管理-选择HTTP协议-点击管理进入HTTP协议API详情-API文档-查询API文档
    async findApiDoc() {
      const { id } = this.$route.params;
      const { groupCode } = this;
      const params = { id, groupCode };
      return await apiDoc.findApiDoc(params);
    },
    // 方法列表-编辑文档-保存文档
    async updateApiDoc() {
      const type = 2;
      const {
        requestParamTableEditedData,
        responseParamTableEditedData,
        errorCodeTableEditedData,
      } = this;
      const id = parseInt(this.$route.params.id);
      const inParamList = requestParamTableEditedData;
      const outParamList = responseParamTableEditedData;
      const errorCodeList = errorCodeTableEditedData;
      const data = [
        {
          type,
          id,
          inParamList,
          outParamList,
          errorCodeList,
        },
      ];
      return await httpDetail.updateApiDoc(data);
    },

    // 加载API方法数据
    async loadApiMethodData() {
      this.loading = true;
      const { data } = await this.findApiDoc().catch(() => {
        throw new Error("loadApiMethodData findApiDoc");
      });
      const {
        inParamList = [],
        outParamList = [],
        errorCodeList = [],
        type = 0,
        interfaceName,
        id,
      } = data;
      const { baseEnv } = window.env;
      this.requestParamTableData = this.initTableData(inParamList);
      this.responseParamTableData = this.initTableData(outParamList);
      this.errorCodeTableData = errorCodeList;
      this.provideWay = type;
      this.qualifiedName = interfaceName;
      this.methodId = id;
      this.methodName = data[`${baseEnv}Method`] || "";
      this.alias = data[`${baseEnv}Alias`] || "";
      this.loading = false;
    },
    // 初始化表格数据，为children字段添加保底值
    initTableData(tableData) {
      return tableData.map((item) => {
        let { children } = item;
        if (children && children.length > 0) {
          children = this.initTableData(children);
        } else {
          children = [];
        }
        return { ...item, children };
      });
    },
    // 更新参数列表操作
    handleUpdateParamList(isRequest = true, newParamList) {
      const isRequestHashMap = {
        true: "requestParamTableEditedData",
        false: "responseParamTableEditedData",
      };
      this[isRequestHashMap[isRequest] || "requestParamTableEditedData"] =
        this.initTableData(newParamList);
    },
    // 取消编辑操作，重置请求参数、响应参数、错误码表格
    handleClickCancel() {
      this.requestParamTableData = [...this.requestParamTableData];
      this.responseParamTableData = [...this.responseParamTableData];
      this.errorCodeTableData = [...this.errorCodeTableData];
      this.editable = false;
    },
    // 保存文档操作
    handleClickSave() {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(async () => {
        this.saveLoading = true;
        await Promise.all([
          this.$refs.requestParamTable.validateTable(),
          this.$refs.responseParamTable.validateTable(),
          this.$refs.errorCodeTable.validateTable(),
        ]).catch(() => {
          this.saveLoading = false;
          throw new Error("handleClickSave validate");
        });
        await this.updateApiDoc().catch(() => {
          this.saveLoading = false;
          throw new Error("handleClickSave updateApiDoc");
        });
        this.editable = false;
        this.$message.success("操作成功！");
        this.saveLoading = false;
        this.loadApiMethodData();
        this.$emit("updateGetApi");
      }, 300);
    },
  },
  created() {
    this.loadApiMethodData();
  },
};
</script>

<style lang="scss" scoped>
.api-doc {
  margin-top: 8px;
  .content__title {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .title {
    margin: 8px 0;
  }
}
</style>