<template>
  <el-drawer
    class="detail-drawer"
    size="708px"
    :title="$t('logTool.detailDrawer.5izjhm9wa1s0')"
    :visible.sync="drawerVisible"
    :modal="false"
    :before-close="handleClose"
  >
    <el-form
      v-loading="drawerLoading"
      class="detail-drawer-form"
      label-width="100px"
      :model="detailData"
    >
      <el-form-item
        v-for="{ prop, label } in formList"
        :key="prop"
        :prop="prop"
        :label="label | formatFormItemLabel"
      >
        <template v-if="prop === 'requestMethod'">
          <span>{{ detailData[prop] | formatFormItemText }}</span>
        </template>
        <template v-else>
          <span v-if="prop === 'exceptionMessage'">
            {{ detailData[prop] | formatFormItemText }}
          </span>
          <span class="form-json-text" v-else>
            {{ detailData[prop] | formatFormItemText }}
          </span>
          <el-tooltip
            v-if="detailData[prop]"
            effect="dark"
            placement="top"
            :content="formatFormItemToolTipContent(label)"
          >
            <el-button type="text" @click="handleClickCopyButton(prop, label)">
              <i class="el-icon-document-copy" />
            </el-button>
          </el-tooltip>
        </template>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<script>
export default {
  name: "DetailDrawer",
  props: {
    drawerVisible: {
      type: Boolean,
      required: true,
      default: false,
    },
    detailData: {
      type: Object,
      required: true,
    },
    handleClose: {
      type: Function,
      required: true,
    },
    drawerLoading: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      formList: [
        {
          prop: "requestMethod",
          label: "请求方法",
        },
        {
          prop: "uriArgs",
          label: "URL参数",
        },
        {
          prop: "request",
          label: "请求报文",
        },
        {
          prop: "response",
          label: "响应报文",
        },
        {
          prop: "exceptionMessage",
          label: "异常描述",
        },
      ],
    };
  },
  filters: {
    formatFormItemLabel(label) {
      return `${label}：` || "";
    },
    formatFormItemText(value) {
      return value || "-";
    },
  },
  methods: {
    formatFormItemToolTipContent(label) {
      return `${this.$t("logTool.detailDrawer.5izjhm9wazg3")}${label || ""}`;
    },
    handleClickCopyButton(prop, label) {
      const elInput = document.createElement("input");
      elInput.value = this.detailData[prop] || "";
      document.body.appendChild(elInput);
      elInput.select();
      if (document.execCommand("Copy") === true) {
        this.$message.success(
          `${this.$t("logTool.detailDrawer.5izjhm9wazg2")}${label || ""}`
        );
      } else {
        this.$message.error(
          `${this.$t("logTool.detailDrawer.5izjhm9wazg3")}${
            label || ""
          }${this.$t("logTool.detailDrawer.5izjhm9wazg4")}`
        );
      }
      elInput.remove();
    },
  },
};
</script>

<style lang="scss" scoped>
.detail-drawer {
  ::v-deep.el-drawer__header {
    margin-bottom: 6px;
    font-size: 16px;
    font-weight: 500;
  }

  ::v-deep .el-drawer__body {
    padding: 8px;
    overflow: auto;

    .detail-drawer-form {
      padding-top: 20px;
      border-top: 1px solid #dee0e3;
      .form-json-text {
        word-break: break-all;
      }
    }
  }
}
</style>