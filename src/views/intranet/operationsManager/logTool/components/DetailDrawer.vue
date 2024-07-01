<template>
  <el-drawer
    class="detail-drawer"
    size="708px"
    title="日志详情"
    :visible.sync="drawerVisible"
    :modal="false"
    :before-close="handleClose"
  >
    <el-tabs v-model="activeName">
      <el-tab-pane label="请求响应信息" name="requestResponseInfo">
        <el-form
          v-loading="drawerLoading"
          class="detail-drawer-form"
          label-width="120px"
          :model="detailData"
        >
          <el-form-item
            v-for="{ prop, label } in formList"
            :key="prop"
            :prop="prop"
            :label="label | formatFormItemLabel"
          >
            <template>
              <span class="form-text">{{ detailData[prop] || "-" }}</span>
            </template>
            <template>
              <el-button
                v-if="prop !== 'requestMethod'"
                type="text"
                @click="handleClickCopyButton(prop, label)"
              >
                <i class="el-icon-document-copy" />
              </el-button>
            </template>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="服务信息" name="serviceInformation">
        <!-- jsf类型 -->
        <el-form
          v-loading="drawerLoading"
          v-if="detailData.apiType === 1"
          class="detail-drawer-form"
          label-width="120px"
          :model="detailData"
        >
          <el-form-item
            v-for="{ prop, label } in serviceInfoJsfList"
            :key="prop"
            :prop="prop"
            :label="label | formatFormItemLabel"
          >
            <template>
              <span>
                {{ detailData[prop] || "-" }}
              </span>
              <el-button
                type="text"
                @click="handleClickCopyButton(prop, label)"
              >
                <i class="el-icon-document-copy" />
              </el-button>
            </template>
          </el-form-item>
        </el-form>
        <!-- http类型 -->
        <el-form
          v-loading="drawerLoading"
          v-if="detailData.apiType === 2"
          class="detail-drawer-form"
          label-width="120px"
          :model="detailData"
        >
          <el-form-item
            v-for="{ prop, label } in serviceInfoHttpList"
            :key="prop"
            :prop="prop"
            :label="label | formatFormItemLabel"
          >
            <template>
              <span>
                {{ detailData[prop] || "-" }}
              </span>
              <el-button
                type="text"
                @click="handleClickCopyButton(prop, label)"
              >
                <i class="el-icon-document-copy" />
              </el-button>
            </template>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
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
      activeName: "requestResponseInfo",
      formList: [
        { prop: "requestMethod", label: "请求方法" },
        { prop: "request", label: "请求报文" },
        { prop: "response", label: "响应报文" },
        { prop: "exceptionMessage", label: "异常信息" },
      ],
      serviceInfoJsfList: [
        { prop: "unitCode", label: "API分组编码" },
        { prop: "apiUrl", label: "API的URI" },
        { prop: "interfaceName", label: "JSF接口名" },
        { prop: "interfaceMethod", label: "JSF方法名" },
        { prop: "alias", label: "JSF别名" },
      ],
      serviceInfoHttpList: [
        { prop: "unitCode", label: "API分组编码" },
        { prop: "apiUrl", label: "API的URI" },
        { prop: "clusterName", label: "集群名称" },
      ],
    };
  },
  filters: {
    formatFormItemLabel(label) {
      return `${label}：` || "";
    },
  },
  methods: {
    handleClickCopyButton(prop, label) {
      const elInput = document.createElement("input");
      elInput.value = this.detailData[prop] || "";
      document.body.appendChild(elInput);
      elInput.select();
      if (document.execCommand("Copy") === true) {
        this.$message.success(`已成功复制${label || ""}`);
      } else {
        this.$message.error(`复制${label || ""}失败`);
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
      .form-text {
        word-break: break-all;
      }
    }
  }
}
</style>