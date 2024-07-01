<template>
  <section class="example-document">
    <p class="example-document__title">{{ title }}</p>
    <ExamplePacket
      v-if="tabVisible"
      :editable="false"
      :tabList="tabList"
      placeholder="平台建议示例中仅包含开发者必须要关注的字段,以便提升开发者的开发效率"
    />
    <el-input
      v-else
      v-model="demo"
      :autosize="{ minRows: 10, maxRows: 35 }"
      :disabled="true"
      type="textarea"
      placeholder="平台建议示例中仅包含开发者必传的字段,以便提升开发者的开发效率"
    />
  </section>
</template>

<script>
import ExamplePacket from "@/views/intranet/scheme-manager/detail/components/external-call-internal/components/external-document/components/example-packet/index.vue";

export default {
  name: "ExampleDocument",
  components: { ExamplePacket },
  props: {
    title: { type: String, default: "" },
    tabVisible: { type: Boolean, default: false },
    demo: { type: String, default: "" },
    tabList: { type: Array, default: () => [] },
  },
};
</script>

<style lang="scss" scoped>
.example-document {
  margin-bottom: 16px;

  .example-document__title {
    margin-bottom: 16px;
    font-weight: 600;
    color: #666;
  }
}
</style>