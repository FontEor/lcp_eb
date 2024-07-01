<template>
  <div>
    <el-radio-group v-model="firstRadio" class="second-tabs">
      <el-radio-button label="基本信息" />
      <el-radio-button label="安全配置" />
    </el-radio-group>
    <BaseInfo
      v-if="firstRadio === '基本信息'"
      :base-info="baseInfo"
      :edit-disabled="editDisabled"
      :showStatus="showStatus"
      @refresh="refresh"
    />
    <SecurityConfig
      v-if="firstRadio === '安全配置'"
      :edit-disabled="editDisabled"
      @refresh="refresh"
    />
  </div>
</template>

<script>
import BaseInfo from "./baseInfo.vue";
import SecurityConfig from "./securityConfig.vue";

export default {
  components: { BaseInfo, SecurityConfig },
  props: {
    baseInfo: Object,
    editDisabled: Boolean,
    showStatus: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      //基本信息
      firstRadio: "基本信息",
    };
  },
  methods: {
    refresh() {
      this.$emit("refresh");
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
