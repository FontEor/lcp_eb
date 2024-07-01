<template>
  <div class="edit-api-doc">
    <el-page-header :content="methodName" @back="goBack" />

    <div v-loading="loading" class="edit-api-doc__content">
      <Title text="基本信息" />
      <el-form
        :model="basicInfoFormData"
        :rules="basicInfoFormRules"
        label-width="80px"
        ref="basicInfoForm"
      >
        <el-form-item label="中文名称" prop="cnName">
          <el-input
            v-model.trim="basicInfoFormData.cnName"
            placeholder="请输入方法中文名称，如：获取XXXX"
            style="width: 100%"
          ></el-input>
        </el-form-item>
        <el-form-item label="方法描述" prop="methodRemark">
          <el-input
            v-model="basicInfoFormData.methodRemark"
            :rows="2"
            type="textarea"
            resize="none"
            placeholder="请输入方法能力、使用场景描述，如：获取XXXX"
            style="width: 100%"
          ></el-input>
        </el-form-item>
      </el-form>

      <div class="content__title">
        <Title text="请求参数" />
        <QuickMaintain
          :qualifiedName="qualifiedName"
          :methodName="methodName"
          :methodId="methodId"
          :isRequest="true"
          :handleUpdateParamList="handleUpdateParamList"
          :tabName="tabName"
          :tableData="requestParamTableEditedData"
        />
      </div>
      <ParamTable
        :editable="editable"
        :isRequest="true"
        :paramTableData.sync="requestParamTableData"
        :paramTableEditedData.sync="requestParamTableEditedData"
        ref="requestParamTable"
        :status="status"
      />

      <div class="content__title">
        <Title text="响应参数" />
        <QuickMaintain
          :qualifiedName="qualifiedName"
          :methodName="methodName"
          :methodId="methodId"
          :isRequest="false"
          :handleUpdateParamList="handleUpdateParamList"
          :tabName="tabName"
          :tableData="responseParamTableEditedData"
        />
      </div>
      <ParamTable
        :editable="editable"
        :isRequest="false"
        :paramTableData.sync="responseParamTableData"
        :paramTableEditedData.sync="responseParamTableEditedData"
        ref="responseParamTable"
        :status="status"
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
          type="primary"
          :loading="saveLoading"
          @click="handleClickSave"
          >保 存</el-button
        >
      </StickyWrapper>
    </div>
  </div>
</template>

<script>
import StickyWrapper from "@/components/StickyWrapper.vue";
import Title from "@/components/Title.vue";
import ParamTable from "@/views/intranet/apiManager/apiList/detail/components/paramTable.vue";
import ErrorCodeTable from "@/views/intranet/apiManager/apiList/detail/components/errorCodeTable.vue";
import QuickMaintain from "@/views/intranet/apiManager/apiList/detail/jsfDetail/methodList/editApiDoc/quickMaintain.vue";
import jsfDetail from "@/api/intranet/apiManager/jsfDetail/index.js";

export default {
  name: "EditApiDoc",
  components: {
    StickyWrapper,
    Title,
    ParamTable,
    ErrorCodeTable,
    QuickMaintain,
  },
  props: {
    editApiDocVisible: {
      type: Boolean,
      required: true,
    },
    methodId: {
      type: Number,
      required: true,
    },
    status: {
      type: Number,
      required: true,
    },
    tabName: {
      type:String,
      default: "",
    }
  },
  data() {
    return {
      loading: true,
      qualifiedName: "",
      methodName: "",
      basicInfoFormData: { cnName: "", methodRemark: "" },
      basicInfoFormRules: {
        cnName: [
          { required: true, message: "请输入中文名称" },
          { min: 2, max: 20, message: "长度在 2 到 20 个字符之间" },
        ],
        methodRemark: [
          { required: true, message: "请输入方法描述" },
          { min: 2, max: 500, message: "长度在 2 到 500 个字符之间" },
        ],
      },
      editable: true,
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
    // 方法列表-编辑文档-根据方法ID获取方法文档数据
    async findApiDoc() {
      const { methodId } = this;
      const data = [{ methodId }];
      return await jsfDetail.findApiDoc(data);
    },
    // 方法列表-编辑文档-保存文档
    async updateApiDoc() {
      const typeHashMap = { jsf: 1, http: 2 };
      const type = typeHashMap[this.$route.params.type];
      const {
        qualifiedName,
        methodId,
        methodName,
        requestParamTableEditedData,
        responseParamTableEditedData,
        errorCodeTableEditedData,
      } = this;
      const id = methodId;
      const name = methodName;
      const inParamList = requestParamTableEditedData;
      const outParamList = responseParamTableEditedData;
      const errorCodeList = errorCodeTableEditedData;
      const { cnName, methodRemark } = this.basicInfoFormData;
      const remark = methodRemark;
      const data = [
        {
          type,
          id,
          name,
          cnName,
          qualifiedName,
          remark,
          inParamList,
          outParamList,
          errorCodeList,
        },
      ];
      return await jsfDetail.updateApiDoc(data);
    },

    // 加载API方法数据
    async loadApiMethodData() {
      this.loading = true;
      const { data } = await this.findApiDoc().catch(() => {
        throw new Error("loadApiMethodData findApiDoc");
      });
      const {
        qualifiedName,
        name,
        cnName,
        remark,
        inParamList = [],
        outParamList = [],
        errorCodeList = [],
      } = data;
      this.qualifiedName = qualifiedName;
      this.methodName = name;
      this.basicInfoFormData.cnName = cnName;
      this.basicInfoFormData.methodRemark = remark;
      this.requestParamTableData = this.initTableData(inParamList);
      this.responseParamTableData = this.initTableData(outParamList);
      this.errorCodeTableData = errorCodeList;
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
    // 返回方法列表
    goBack() {
      this.$emit("update:editApiDocVisible", false);
      this.$emit("update:methodId", 0);
    },
    // 保存文档操作
    handleClickSave() {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(async () => {
        this.saveLoading = true;
        await Promise.all([
          this.$refs.basicInfoForm.validate(),
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
        this.$message.success("操作成功！");
        this.$emit("update:editApiDocVisible", false);
        this.$emit("update:methodId", 0);
        this.saveLoading = false;
        this.$emit("updateStatus");
      }, 300);
    },
  },
  created() {
    this.loadApiMethodData();
  },
};
</script>

<style lang="scss" scoped>
.edit-api-doc {
  .edit-api-doc__content {
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
}
</style>
