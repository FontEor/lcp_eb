<template>
  <el-steps
    :active="active"
    :align-center="true"
    finish-status="success"
    class="steps"
  >
    <el-step
      v-for="(item, index) in titleList"
      :key="index"
      :title="item"
    ></el-step>
  </el-steps>
</template>

<script>
export default {
  name: "Steps",
  props: {
    titleList: {
      type: Array,
      default: () => {
        return [];
      },
    },
    active: { type: Number, required: true },
  },
};
</script>

<style lang="scss" scoped>
.steps {
  margin: 16px auto;
  width: 80%;
}
</style>