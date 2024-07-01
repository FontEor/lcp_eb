<template>
  <div class="overview">
    <el-radio-group v-model="radioValue" class="second-tabs">
      <el-radio-button label="产品基本信息" />
      <el-radio-button label="配置产品介绍页" />
    </el-radio-group>

    <ProductBasicInfo
      v-if="radioValue === '产品基本信息'"
      :editable.sync="editable"
      :secondaryDevelopment.sync="secondaryDevelopment"
      @updateTitle="updateTitle"
    />
    <ConfigureProductIntroduction
      v-else-if="radioValue === '配置产品介绍页'"
      :editable.sync="editable"
      :productCode="productCode"
      :secondaryDevelopment="secondaryDevelopment"
      @updateStatus="$emit('updateStatus')"
    />
  </div>
</template>

<script>
import ProductBasicInfo from "@/views/intranet/softwareSystem/overview/productBasicInfo.vue";
import ConfigureProductIntroduction from "@/views/intranet/softwareSystem/overview/configureProductIntroduction.vue";

export default {
  name: "Overview",
  components: { ProductBasicInfo, ConfigureProductIntroduction },
  props: {
    productCode: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      radioValue: "产品基本信息",
      editable: false,
      secondaryDevelopment: "",
    };
  },
  methods: {
    updateTitle(e) {
      this.$emit("updateTitle", e);
    },
  },
};
</script>

<style lang="scss" scoped>
.overview {
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