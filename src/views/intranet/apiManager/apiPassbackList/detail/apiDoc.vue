<template>
  <div v-loading="loading" class="api-doc">
    <div v-if="editable" class="content__title">
      <Title text="请求参数" />
      <QuickMaintain
        :isRequest="true"
        :handleUpdateParamList="handleUpdateParamList"
        :tabName="tabName"
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
      :status="apiDocEditBtnStatus.status"
    />

    <div v-if="editable" class="content__title">
      <Title text="响应参数" />
      <QuickMaintain
        :isRequest="false"
        :handleUpdateParamList="handleUpdateParamList"
        :tabName="tabName"
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
      :status="apiDocEditBtnStatus.status"
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
        v-if="!editable && apiDocEditBtnStatus.visible"
        type="primary"
        :disabled="apiDocEditBtnStatus.disabled"
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
import ParamTable from "@/views/intranet/apiManager/apiList/detail/components/paramTable.vue";
import ErrorCodeTable from "@/views/intranet/apiManager/apiList/detail/components/errorCodeTable.vue";
import QuickMaintain from "@/views/intranet/apiManager/apiList/detail/httpDetail/apiDoc/quickMaintain.vue";
import gateway from "@/api/intranet/gateway";

export default {
  name: "ApiDoc",
  components: {
    StickyWrapper,
    Title,
    ParamTable,
    ErrorCodeTable,
    QuickMaintain
  },
  props: {
    apiDocEditBtnStatus: {
      type: Object,
      default: () => ({ disabled: false, visible: true })
    },
    tabName: {
      type: String,
      default: "",
    }
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
      saveLoading: false
    };
  },
  watch: {
    requestParamTableData: {
      // 监听请求参数数据变化时，更新编辑态请求参数表格数据
      handler(newValue) {
        this.requestParamTableEditedData = JSON.parse(JSON.stringify(newValue));
      }
    },
    responseParamTableData: {
      // 监听响应参数数据变化时，更新编辑态请求参数表格数据
      handler(newValue) {
        this.responseParamTableEditedData = JSON.parse(
          JSON.stringify(newValue)
        );
      }
    },
    errorCodeTableData: {
      // 监听错误码数据变化时，更新编辑态错误码表格数据
      handler(newValue) {
        this.errorCodeTableEditedData = JSON.parse(JSON.stringify(newValue));
      }
    }
  },
  methods: {
    // 内调外API详情-查询API文档
    async findApiDoc() {
      const bizId = this.$route.params.id;
      const apiType = 4;
      const data = [{ bizId, apiType }];
      return await gateway.ApiManagerService.findApiDoc(data);
    },
    // 内调外API详情-更新文档
    async updateApiDoc() {
      const id = parseInt(this.$route.params.id);
      const type = 4;
      const {
        requestParamTableEditedData,
        responseParamTableEditedData,
        errorCodeTableEditedData
      } = this;
      const inParamList = requestParamTableEditedData;
      const outParamList = responseParamTableEditedData;
      const errorCodeList = errorCodeTableEditedData;
      const data = [{ id, type, inParamList, outParamList, errorCodeList }];
      return await gateway.ApiManagerService.updateApiDoc(data);
    },

    // 加载API文档数据
    async loadApiData() {
      this.loading = true;
      const response = await this.findApiDoc().catch(() => {
        throw new Error("loadApiData findApiDoc");
      });
      const {
        inParamList = [],
        outParamList = [],
        errorCodeList = []
      } = response.data;
      this.requestParamTableData = this.initTableData(inParamList);
      this.responseParamTableData = this.initTableData(outParamList);
      this.errorCodeTableData = errorCodeList;
      this.loading = false;
    },
    // 保存文档操作
    handleClickSave() {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(async () => {
        this.saveLoading = true;
        await Promise.all([
          this.$refs.requestParamTable.validateTable(),
          this.$refs.responseParamTable.validateTable(),
          this.$refs.errorCodeTable.validateTable()
        ]).catch(() => {
          this.saveLoading = false;
          throw new Error("handleClickSave validate");
        });
        await this.updateApiDoc().catch(() => {
          this.saveLoading = false;
          throw new Error("handleClickSave updateApiDoc");
        });
        this.editable = false;
        this.$emit("getApiBasicInfo");
        this.$message.success("操作成功！");
        this.saveLoading = false;
        this.loadApiData();
      }, 300);
    },
    // 初始化表格数据，为children字段添加保底值
    initTableData(tableData) {
      return tableData.map(item => {
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
        false: "responseParamTableEditedData"
      };
      this[
        isRequestHashMap[isRequest] || "requestParamTableEditedData"
      ] = this.initTableData(newParamList);
    },
    // 取消编辑操作，重置请求参数、响应参数、错误码表格
    handleClickCancel() {
      this.requestParamTableData = [...this.requestParamTableData];
      this.responseParamTableData = [...this.responseParamTableData];
      this.errorCodeTableData = [...this.errorCodeTableData];
      this.editable = false;
    }
  },
  created() {
    this.loadApiData();
  }
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
