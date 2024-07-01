<template>
  <div class="sticky-wrapper">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "StickyWrapper",
};
</script>

<style lang="scss" scoped>
.sticky-wrapper {
  position: -webkit-sticky;
  position: sticky;
  bottom: 0;
  z-index: 1;
  padding: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba($color: #fff, $alpha: 0.9);
}
</style>