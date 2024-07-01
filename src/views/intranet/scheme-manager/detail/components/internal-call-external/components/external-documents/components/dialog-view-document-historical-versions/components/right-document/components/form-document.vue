<template>
  <el-form :model="form" label-width="80px" ref="form" class="form-document">
    <div
      v-for="{ label, prop, className } in formParagraphList"
      :key="prop"
      class="form-document__paragraph"
    >
      <p class="paragraph__label">{{ label }}</p>
      <p :class="className | formatParagraphContentClassName">
        {{ formatParagraphContentText(form[prop]) }}
      </p>
    </div>
  </el-form>
</template>

<script>
export default {
  name: "FormDocument",
  props: {
    form: { type: Object, required: true },
    categoryList: { type: Array, required: true },
  },
  data() {
    return {
      formParagraphList: [
        { label: "发布人", prop: "publisher" },
        { label: "对外接口名称", prop: "apiName" },
        { label: "对外接口描述", prop: "apiRemark", className: "pre-wrap" },
        { label: "所属分类", prop: "categoryCode" },
      ],
    };
  },
  filters: {
    formatParagraphContentClassName(value) {
      return value ? `paragraph__content pre-wrap` : "paragraph__content";
    },
  },
  methods: {
    formatParagraphContentText(value) {
      const { categoryList } = this;
      const category = categoryList.find(({ code }) => code === value);
      const { name } = category || {};
      return name || value;
    },
  },
};
</script>

<style lang="scss" scoped>
.form-document {
  margin-bottom: 16px;

  .form-document__paragraph {
    margin-bottom: 8px;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;

    .paragraph__label {
      margin-right: 16px;
      min-width: 88px;
      font-weight: 600;
      text-align: right;
    }

    .paragraph__content {
      color: #333;

      &.pre-wrap {
        margin-left: -4px;
        white-space: pre-wrap;
      }
    }
  }
}
</style>