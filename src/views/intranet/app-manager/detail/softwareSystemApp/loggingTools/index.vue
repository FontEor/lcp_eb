<template>
  <div class="logging-tools">
    <el-radio-group v-model="radioValue" class="second-tabs">
      <el-radio-button label="扩展点日志" />
    </el-radio-group>

    <ExtensionPointLog
      v-if="radioValue === '扩展点日志'"
      :appCode="appCode"
      :productCode="productCode"
      :productDomainName="productDomainName"
      :productUatDomainName="productUatDomainName"
    />
  </div>
</template>

<script>
import ExtensionPointLog from "@/views/intranet/app-manager/detail/softwareSystemApp/loggingTools/extensionPointLog/index.vue";

export default {
  name: "loggingTools",
  components: { ExtensionPointLog },
  props: {
    appCode: {
      type: String,
      required: true,
    },
    productCode: {
      type: String,
      required: true,
    },
    productDomainName: {
      type: String,
      required: true,
    },
    productUatDomainName: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      radioValue: "扩展点日志",
    };
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
.logging-tools {
  ::v-deep .el-radio-group.second-tabs {
    display: flex;
    justify-content: center;
    .el-radio-button {
      font-weight: normal;
      &.is-active > .el-radio-button__inner {
        color: #3c6ef0;
        background: #fff;
      }
    }
  }
}
</style>