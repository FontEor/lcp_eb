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
      <p>切换开关即可查看当前消息文档内容，方便对比消息文档的参数差异。</p>
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
        title="消息体"
      />
    </div>

    <template #footer>
      <span class="footer__change-records-total">{{
        changeLineQuantity | formatChangeRecordsTotalText
      }}</span>
      <div class="footer__right-button-wrapper">
        <div class="right-button-wrapper__update-method-switch-wrapper">
          <el-switch
            :value="updatePolicy"
            :active-value="1"
            :inactive-value="2"
            @change="($event) => $emit('update:updatePolicy', $event)"
          />
          <p class="right-button-wrapper__switch-active-text">
            {{ updatePolicy | formatFooterSwitchActiveText }}
          </p>
          <el-tooltip effect="dark" placement="top" style="margin-right: 8px">
            <template #content>
              <template v-if="computeFooterFullUpdateTooltipContentTextVisible">
                <p>
                  全部更新：包括消息名称、消息描述、参数增删及顺序变更、参数名称及类型修改、参数描述及示例值、参数是否必填变更、错误码增删改。
                </p>
              </template>
              <template v-else>
                <p>
                  部分更新：只更新参数增删及顺序变更、参数名称及类型修改、参数是否必填修改、错误码增删改。不会变更参数的示例值、参数描述和消息口名称、消息描述。
                </p>
              </template>
            </template>
            <i class="el-icon-info-empty" />
          </el-tooltip>
        </div>
        <div class="right-button-wrapper__update-button-wrapper">
          <el-button @click="$emit('update:dialogVisible', false)"
            >暂不更新</el-button
          >
          <el-button type="primary" @click="onClickUpdateNowButton"
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
import bizmsg from "@/api/intranet/lcp/bizmsg.js";

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
        .set("descr", 5),
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
          prop: "descr",//"remark",
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
    };
  },
  filters: {
    formatDialogTitleText(value) {
      return value ? `${value} 消息文档变更内容` : "";
    },
    formatChangeRecordsTotalText(value) {
      return `共 ${value} 条变更记录`;
    },
    formatFooterSwitchActiveText(value) {
      const hashMap = new Map().set(1, "全部更新").set(2, "部分更新");
      return hashMap.get(value) || "";
    },
  },
  computed: {
    computeFooterFullUpdateTooltipContentTextVisible() {
      const { updatePolicy } = this;
      const hashMap = new Map().set(1, true).set(2, false);
      return hashMap.get(updatePolicy) || false;
    },
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
  },
  methods: {
    // 现有文档详情 请求
    async getBizMsgPreDetails() {
      const { unitId, id } = this;
      const visible = 1;
      const params = { unitId, id, visible };
      return await bizmsg.getMessagePreDetail(params).catch((error) => {
        throw new Error(`getBizMsgPreDetails, ${error}`);
      });
    },
    // 最新版本变更详情 请求
    async getBizMsgPreDetailsLatestVersion() {
      const { unitId, id } = this;
      const visible = 1;
      const params = { unitId, id, visible };
      return await bizmsg
        .getBizMsgPreDetailsLatestVersion(params)
        .catch((error) => {
          throw new Error(`getBizMsgPreDetailsLatestVersion, ${error}`);
        });
    },

    // 现有文档详情 数据处理函数
    async handleGetBizMsgPreDetails() {
      this.dialogLoading = true;
      const {
        data: { chineseName, descr, messagePropList },
      } = await this.getBizMsgPreDetails().catch((error) => {
        throw new Error(`handleGetBizMsgPreDetails, ${error}`);
      });
      this.versionSwitchingFormData.apiName = chineseName || "";
      this.versionSwitchingFormData.apiRemark = descr || "";
      this.inParams = Array.isArray(messagePropList) ? messagePropList : [];
      if (this.inParams.length > 0) {
        this.setSelectVal(this.inParams);
      }
      this.dialogLoading = false;
    },
    // 最新版本变更文档详情 数据处理函数
    async handleGetBizMsgPreDetailsLatestVersion() {
      this.dialogLoading = true;
      const {
        data: {
          chineseName,
          descr,
          messagePropList,
          changeLineQuantity,
        },
      } = await this.getBizMsgPreDetailsLatestVersion().catch((error) => {
        throw new Error(`handleGetBizMsgPreDetailsLatestVersion, ${error}`);
      });
      this.newVersionSwitchingFormData.apiName = chineseName || "";
      this.newVersionSwitchingFormData.apiRemark = descr || "";
      this.newInParams = Array.isArray(messagePropList) ? messagePropList : [];
      if (this.newInParams.length > 0) {
        this.setSelectVal(this.newInParams);
      }
      this.changeLineQuantity = changeLineQuantity || 0;
      this.dialogLoading = false;
    },

    // 第一次开关提示语
    judgeFirstTipVisible() {
      const { name } = this.$route;
      const direction = "internalCallExternal";
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
        this.handleGetBizMsgPreDetails(),
        this.handleGetBizMsgPreDetailsLatestVersion(),
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
    },
    onClickISeeButton() {
      this.firstTipVisible = false;
      const { name } = this.$route;
      const direction = "internalCallExternal";
      const key = `${name}/${direction}/ChangeContentDialog/firstTipVisible`;
      localStorage.setItem(key, `${this.firstTipVisible}`);
    },
    onClickUpdateNowButton() {
      this.$emit("updateNow");
      this.$emit("update:dialogVisible", false);
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
      width: 340px;

      .right-button-wrapper__update-method-switch-wrapper {
        display: flex;
        justify-content: flex-start;
        align-items: center;

        .right-button-wrapper__switch-active-text {
          margin-left: 8px;
        }

        .el-icon-info-empty {
          margin-left: 4px;
          color: #666;
        }
      }
    }
  }
}
</style>
