<template>
  <el-form
    :model="form"
    label-width="80px"
    ref="form"
    class="version-switching-form"
  >
    <div
      v-for="{ label, prop, className } in formParagraphList"
      :key="prop"
      class="version-switching-form__paragraph"
    >
      <p class="paragraph__label">{{ label }}</p>
      <p :class="className | formatParagraphContentClassName">
        {{ form[prop] }}
      </p>
    </div>
  </el-form>
</template>

<script>
export default {
  name: "VersionSwitchingForm",
  props: {
    form: { type: Object, required: true },
  },
  data() {
    return {
      formParagraphList: [
        { label: "接口名称:", prop: "apiName" },
        { label: "接口描述:", prop: "apiRemark", className: "pre-wrap" },
      ],
    };
  },
  filters: {
    formatParagraphContentClassName(value) {
      return value ? `paragraph__content pre-wrap` : "paragraph__content";
    },
  },
};
</script>

<style lang="scss" scoped>
.version-switching-form {
  margin-left: 12px;

  .version-switching-form__paragraph {
    margin-bottom: 8px;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;

    .paragraph__label {
      margin-right: 8px;
      min-width: 80px;
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