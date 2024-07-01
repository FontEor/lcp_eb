<template>
  <section class="example-document">
    <p class="example-document__title">{{ title }}</p>
    <el-input
      v-model="demo"
      :autosize="{ minRows: 10, maxRows: 35 }"
      :disabled="true"
      type="textarea"
      placeholder="平台建议示例中仅包含开发者必传的字段,以便提升开发者的开发效率"
    />
  </section>
</template>

<script>
export default {
  name: "ExampleDocument",
  props: {
    title: { type: String, default: "" },
    demo: { type: String, default: "" },
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