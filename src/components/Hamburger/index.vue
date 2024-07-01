<template>
<div class="hamburger" @click="toggleClick">
<i :class="isActive ? 'el-icon-arrow-left':'el-icon-arrow-right'"></i>
</div>
</template>

<script>
export default {
name: 'Hamburger',
props: {
  isActive: {
  type: Boolean,
  default: false
  }
},
methods: {
  toggleClick() {
    this.$emit('toggleClick')
    }
  }
}
</script>

<style lang="scss" scoped>
.hamburger {
  position: absolute;
  top: 45%;
  left: 100%;
  width: 12px;
  height: 42px;
  line-height: 42px;
  text-align: center;
  font-size: 8px;
  color: #fff;
  background: #3c6ef0;
  border-top-right-radius: 12px;
  border-bottom-right-radius: 12px;
  cursor: pointer;
}

</style>

