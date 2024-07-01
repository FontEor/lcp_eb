<template>
  <div class="title">
    <div class="title__icon"></div>
    <div class="title__text">{{ text }}</div>
  </div>
</template>

<script>
export default {
  name: "Title",
  props: {
    text: {
      type: String,
      default: "",
    },
  },
};
</script>

<style lang="scss" scoped>
.title {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  .title__icon {
    width: 4px;
    height: 14px;
    background: #3c6ef0;
    border-radius: 4px;
    margin-right: 8px;
  }
  .title__text {
    font-size: 16px;
    font-weight: 600;
  }
}
</style>