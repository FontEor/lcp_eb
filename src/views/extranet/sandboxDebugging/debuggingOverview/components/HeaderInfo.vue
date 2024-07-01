<template>
  <header class="header-info">
    <section class="header-info__section">
      <h3 class="section__scene-name">{{ sceneName }}</h3>
      <p class="section__explanation">{{ explanation }}</p>
    </section>
  </header>
</template>

<script>
export default {
  name: "HeaderInfo",
  props: {
    sceneName: { type: String, default: "" },
    explanation: { type: String, default: "" },
  },
};
</script>

<style lang="scss" scoped>
.header-info {
  margin: 0 20px 16px 20px;
  padding: 0 28px;
  height: 80px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  background: #fff;

  .header-info__section {
    position: relative;
    font-size: 16px;

    &::after {
      position: absolute;
      top: 0;
      left: -10px;
      margin: 0;
      padding: 0;
      width: 4px;
      height: 48px;
      box-sizing: border-box;
      display: block;
      content: "";
      border-radius: 4px;
      background: #3c6ef0;
    }

    .section__scene-name {
      font-weight: 600;
    }

    .section__explanation {
      color: #999;
    }
  }
}
</style>