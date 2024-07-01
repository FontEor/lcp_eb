<template>
  <el-link
    class="link"
    :type="type"
    :underline="underline"
    :disabled="disabled"
    :href="href"
    :icon="icon"
    :target="target"
  >
    <slot></slot>
  </el-link>
</template>

<script>
export default {
  name: "Link",
  props: {
    type: { type: String, default: "primary" },
    underline: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    href: { type: String, default: "" },
    icon: { type: String, default: "" },
    target: { type: String, default: "_blank" },
  },
};
</script>

<style lang="scss" scoped>
.link {
  font-size: inherit;
  vertical-align: baseline;
}
</style>