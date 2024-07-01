<template>
  <div class="developer-resource">
    <el-radio-group
      v-model="radioValue"
      class="developer-resource__radio-group"
    >
      <el-radio-button label="开放接口" />
      <el-radio-button label="开放扩展点" />
    </el-radio-group>

    <OpenInterface
      v-if="radioValue === '开放接口'"
      :productCode="productCode"
      @updateStatus="$emit('updateStatus')"
    />
    <OpenExtensionPoint
      v-else-if="radioValue === '开放扩展点'"
      :productCode="productCode"
      @updateStatus="$emit('updateStatus')"
    />
  </div>
</template>

<script>
import OpenInterface from "@/views/intranet/softwareSystem/developerResource/openInterface/index.vue";
import OpenExtensionPoint from "@/views/intranet/softwareSystem/developerResource/openExtensionPoint/index.vue";

export default {
  name: "DeveloperResource",
  components: { OpenInterface, OpenExtensionPoint },
  props: {
    productCode: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      radioValue: "开放接口",
    };
  },
};
</script>

<style lang="scss" scoped>
.developer-resource {
  ::v-deep .developer-resource__radio-group.el-radio-group {
    margin-bottom: 8px;
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