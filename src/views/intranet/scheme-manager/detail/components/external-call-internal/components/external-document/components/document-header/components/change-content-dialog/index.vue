<template>
  <el-dialog
    :visible="dialogVisible"
    :title="apiCode | formatDialogTitleText"
    :close-on-click-modal="false"
    top="5vh"
    width="1200px"
    class="change-content-dialog"
    @open="onOpenDialog"
    @close="onCloseDialog"
    @closed="onClosedDialog"
  >
    <div v-if="firstTipVisible" class="change-content-dialog__first-tip">
      <p>切换开关即可查看当前API文档内容，方便对比API仓库文档的参数差异。</p>
      <el-button type="text" @click="onClickISeeButton">我知道了</el-button>
    </div>

    <div v-loading="dialogLoading" class="change-content-dialog__content">
      <VersionSwitchingHeader
        :upcomingVersionSwitch.sync="upcomingVersionSwitch"
        :firstTipVisible.sync="firstTipVisible"
      />
      <VersionSwitchingForm :form="computeVersionSwitchingFormData" />
      <ComparisonTable
        :tableData="computeInParams"
        :tableColumnList="inParamsTableColumnList"
        :hashMapMutationAttributes="hashMapMutationAttributesParams"
        title="请求参数"
      />
      <ComparisonTable
        :tableData="computeOutParams"
        :tableColumnList="outParamsTableColumnList"
        :hashMapMutationAttributes="hashMapMutationAttributesParams"
        :title="'响应参数'"
      />
      <ComparisonTable
        :tableData="computeErrorCodes"
        :tableColumnList="errorCodesTableColumnList"
        :hashMapMutationAttributes="hashMapMutationAttributesErrorCodes"
        :title="'错误码'"
      />
    </div>

    <template #footer>
      <span class="footer__change-records-total">{{
        changeLineQuantity | formatChangeRecordsTotalText
      }}</span>
      <div class="footer__right-button-wrapper">
        <el-tooltip effect="dark" placement="top" style="margin-right: 0.5rem">
          <template #content>
            <p>
              部分更新：只更新字段结构(增删改、顺序、类型、必填)和错误码，不更新其他描述类内容。
            </p>
            <p>
              全部更新：部分更新基础上，额外更新字段描述、示例值、接口名称、接口描述等全部内容。
            </p>
          </template>
          <i class="el-icon-info-empty" />
        </el-tooltip>
        <div class="right-button-wrapper__update-method-switch-wrapper">
          <el-form
            :model="ruleForm"
            ref="ruleForm"
            :rules="rules"
            style="padding-top: 1.3rem"
          >
            <el-form-item prop="updateRadioVal">
              <el-radio
                v-model="ruleForm.updateRadioVal"
                label="1"
                style="margin-right: 0.5rem"
                @change="handleRadioClick(ruleForm.updateRadioVal)"
                >全部更新</el-radio
              >
              <el-radio
                v-model="ruleForm.updateRadioVal"
                label="2"
                style="margin-right: 0.5rem"
                @change="handleRadioClick(ruleForm.updateRadioVal)"
                >部分更新</el-radio
              >
            </el-form-item>
          </el-form>
        </div>
        <div class="right-button-wrapper__update-button-wrapper">
          <el-button @click="$emit('update:dialogVisible', false)"
            >暂不更新</el-button
          >
          <el-button type="primary" @click="onClickUpdateNowButton('ruleForm')"
            >立即更新</el-button
          >
        </div>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import VersionSwitchingHeader from "./components/version-switching-header.vue";
import VersionSwitchingForm from "./components/version-switching-form.vue";
import ComparisonTable from "./components/comparison-table.vue";
import bizapinterface from "@/api/intranet/lcp/bizapinterface.js";

export default {
  name: "ChangeContentDialog",
  components: { VersionSwitchingHeader, VersionSwitchingForm, ComparisonTable },
  props: {
    dialogVisible: { type: Boolean, required: true },
    id: { type: Number, required: true },
    apiCode: { type: String, required: true },
    updatePolicy: { type: Number, required: true },
  },
  data() {
    return {
      unitId: parseInt(this.$route.params.id),
      dialogLoading: false,
      firstTipVisible: false,
      changeLineQuantity: 0,
      upcomingVersionSwitch: true,
      versionSwitchingFormData: {
        apiName: "",
        apiRemark: "",
      },
      newVersionSwitchingFormData: {
        apiName: "",
        apiRemark: "",
      },
      inParams: [],
      outParams: [],
      errorCodes: [],
      newInParams: [],
      newOutParams: [],
      newErrorCodes: [],
      hashMapMutationAttributesParams: new Map()
        .set("name", 1)
        .set("oldType", 2)
        .set("required", 3)
        .set("exampleValue", 4)
        .set("remark", 5),
      hashMapMutationAttributesErrorCodes: new Map()
        .set("errorMsg", 1)
        .set("prescription", 2)
        .set("errorCode", 3),
      inParamsTableColumnList: [
        {
          label: "名称",
          prop: "name",
          minWidth: "30%",
        },
        {
          label: "类型",
          prop: "oldType",
          minWidth: "25%",
          showOverflowTooltip: true,
        },
        {
          label: "是否必填",
          prop: "required",
          minWidth: "15%",
        },
        {
          label: "示例",
          prop: "exampleValue",
          minWidth: "25%",
          showOverflowTooltip: true,
        },
        {
          label: "描述",
          prop: "remark",
          minWidth: "25%",
        },
      ],
      outParamsTableColumnList: [
        {
          label: "名称",
          prop: "name",
          minWidth: "30%",
        },
        {
          label: "类型",
          prop: "oldType",
          minWidth: "30%",
          showOverflowTooltip: true,
        },
        {
          label: "示例",
          prop: "exampleValue",
          minWidth: "25%",
          showOverflowTooltip: true,
        },
        {
          label: "描述",
          prop: "remark",
          minWidth: "25%",
        },
      ],
      errorCodesTableColumnList: [
        {
          label: "错误码",
          prop: "errorCode",
          minWidth: "35%",
        },
        {
          label: "错误消息",
          prop: "errorMsg",
          minWidth: "60%",
          showOverflowTooltip: true,
        },
        {
          label: "处理建议",
          prop: "prescription",
          minWidth: "60%",
          showOverflowTooltip: true,
        },
      ],
      ruleForm: { updateRadioVal: "" },
      rules: {
        updateRadioVal: [
          {
            required: true,
            message: "请选择元数据的更新类型",
            trigger: "change",
          },
        ],
      },
    };
  },
  filters: {
    formatDialogTitleText(value) {
      return value ? `${value} 接口文档变更内容` : "";
    },
    formatChangeRecordsTotalText(value) {
      return `共 ${value} 条变更记录`;
    },
  },
  computed: {
    computeVersionSwitchingFormData() {
      const {
        upcomingVersionSwitch,
        versionSwitchingFormData,
        newVersionSwitchingFormData,
      } = this;
      return upcomingVersionSwitch
        ? newVersionSwitchingFormData
        : versionSwitchingFormData;
    },
    computeInParams() {
      const { upcomingVersionSwitch, inParams, newInParams } = this;
      return upcomingVersionSwitch ? newInParams : inParams;
    },
    computeOutParams() {
      const { upcomingVersionSwitch, outParams, newOutParams } = this;
      return upcomingVersionSwitch ? newOutParams : outParams;
    },
    computeErrorCodes() {
      const { upcomingVersionSwitch, errorCodes, newErrorCodes } = this;
      return upcomingVersionSwitch ? newErrorCodes : errorCodes;
    },
  },
  methods: {
    // 根据对接方案ID、接口ID和参数可见性查询接口对外文档详情
    async getBizApiPreDetails() {
      const { unitId, id } = this;
      const visible = 2;
      const params = { unitId, id, visible };
      return await bizapinterface.getBizApiPreDetails(params).catch((error) => {
        throw new Error(`getBizApiPreDetails, ${error}`);
      });
    },
    // 根据对接方案ID、接口ID和参数可见性查询接口对外文档变更详情
    async getBizApiPreDetailsLatestVersion() {
      const { unitId, id } = this;
      const visible = 2;
      const params = { unitId, id, visible };
      return await bizapinterface
        .getBizApiPreDetailsLatestVersion(params)
        .catch((error) => {
          throw new Error(`getBizApiPreDetailsLatestVersion, ${error}`);
        });
    },
    // 根据对接方案ID、接口ID和参数可见性查询接口对外文档详情
    async handleGetBizApiPreDetails() {
      this.dialogLoading = true;
      const {
        data: { apiName, apiRemark, inParams, outParams, errorCodes },
      } = await this.getBizApiPreDetails().catch((error) => {
        throw new Error(`handleGetBizApiPreDetails, ${error}`);
      });
      this.versionSwitchingFormData.apiName = apiName || "";
      this.versionSwitchingFormData.apiRemark = apiRemark || "";
      this.inParams = Array.isArray(inParams) ? inParams : [];
      if (this.inParams.length > 0) {
        this.setSelectVal(this.inParams);
      }
      this.outParams = Array.isArray(outParams) ? outParams : [];
      if (this.outParams.length > 0) {
        this.setSelectVal(this.outParams);
      }
      this.errorCodes = Array.isArray(errorCodes) ? errorCodes : [];
      this.dialogLoading = false;
    },
    // 根据对接方案ID、接口ID和参数可见性查询接口对外文档变更详情
    async handleGetBizApiPreDetailsLatestVersion() {
      this.dialogLoading = true;
      const {
        data: {
          apiName,
          apiRemark,
          inParams,
          outParams,
          errorCodes,
          changeLineQuantity,
        },
      } = await this.getBizApiPreDetailsLatestVersion().catch((error) => {
        throw new Error(`handleGetBizApiPreDetailsLatestVersion, ${error}`);
      });
      this.newVersionSwitchingFormData.apiName = apiName || "";
      this.newVersionSwitchingFormData.apiRemark = apiRemark || "";
      this.newInParams = Array.isArray(inParams) ? inParams : [];
      if (this.newInParams.length > 0) {
        this.setSelectVal(this.newInParams);
      }
      this.newOutParams = Array.isArray(outParams) ? outParams : [];
      if (this.newOutParams.length > 0) {
        this.setSelectVal(this.newOutParams);
      }
      this.newErrorCodes = Array.isArray(errorCodes) ? errorCodes : [];
      this.changeLineQuantity = changeLineQuantity || 0;
      this.dialogLoading = false;
    },

    judgeFirstTipVisible() {
      const { name } = this.$route;
      const direction = "externalCallInternal";
      const key = `${name}/${direction}/ChangeContentDialog/firstTipVisible`;
      this.firstTipVisible = JSON.parse(localStorage.getItem(key) || "true");
    },
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
      this.$emit("update:updatePolicy", 2);
      await Promise.all([
        this.handleGetBizApiPreDetails(),
        this.handleGetBizApiPreDetailsLatestVersion(),
      ]).catch((error) => {
        throw new Error(`onOpenDialog, ${error}`);
      });
      this.judgeFirstTipVisible();
    },
    onCloseDialog() {
      this.$emit("update:dialogVisible", false);
      this.firstTipVisible = false;
    },
    onClosedDialog() {
      this.$emit("update:updatePolicy", 3);
      this.upcomingVersionSwitch = true;
      this.$refs["ruleForm"].resetFields();
    },
    onClickISeeButton() {
      this.firstTipVisible = false;
      const { name } = this.$route;
      const direction = "externalCallInternal";
      const key = `${name}/${direction}/ChangeContentDialog/firstTipVisible`;
      localStorage.setItem(key, `${this.firstTipVisible}`);
    },
    onClickUpdateNowButton(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$emit("updateNow");
          this.$emit("update:dialogVisible", false);
        } else {
          return false;
        }
      });
    },
    handleRadioClick(updateRadioVal) {
      if (updateRadioVal === "1") {
        this.$emit("update:updatePolicy", 1);
      } else {
        this.$emit("update:updatePolicy", 2);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.change-content-dialog {
  .change-content-dialog__first-tip {
    position: absolute;
    top: 24px;
    left: 160px;
    z-index: 1025;
    padding: 16px 24px;
    width: 240px;
    border-radius: 8px;
    background-color: #ecf1fe;

    &::before {
      position: absolute;
      top: 50%;
      left: -4px;
      z-index: 1026;
      width: 8px;
      height: 8px;
      content: "";
      background-color: #ecf1fe;
      transform: translateY(-50%) rotate(45deg);
    }

    .el-button {
      position: absolute;

      bottom: 12px;
      right: 24px;
    }
  }

  .change-content-dialog__content {
    position: relative;
    max-height: 400px;
    overflow: auto;

    @media (min-width: 1300px) {
      max-height: 560px;
    }

    .version-switching-header {
      position: -webkit-sticky;
      position: sticky;
      top: 0;
      z-index: 1024;
    }
  }

  ::v-deep .el-dialog__footer {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .footer__right-button-wrapper {
      display: flex;
      justify-content: space-between;
      align-items: center;
      //width: 340px;

      .right-button-wrapper__update-method-switch-wrapper {
        display: flex;
        justify-content: flex-start;
        align-items: center;

        // .right-button-wrapper__switch-active-text {
        //   margin-left: 8px;
        // }

        // .el-icon-info-empty {
        //   margin-left: 4px;
        //   color: #666;
        // }
      }
    }
  }
}
</style>
