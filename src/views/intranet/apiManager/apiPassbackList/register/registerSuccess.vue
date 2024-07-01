<template>
  <div class="register-success">
    <div class="register-success__icon">
      <i class="el-icon-success"></i>
    </div>
    <p class="register-success__title">注册成功</p>
    <p class="register-success__tip">
      快去完善API基础数据吧，完善后发布即可对外生效
    </p>
    <el-button @click="$emit('update:active', 0)">继续注册API</el-button>
    <el-button
      type="primary"
      @click="
        $router.push({
          name: 'ApiManagerPassBackDetail',
          params: { id },
        })
      "
      >去完善API基础数据</el-button
    >
  </div>
</template>

<script>
export default {
  name: "RegisterSuccess",
  props: {
    active: {
      type: Number,
      required: true,
    },
    id: {
      type: Number,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.register-success {
  text-align: center;
  .register-success__icon {
    font-size: 50px;
    color: #26a872;
  }
  .register-success__title {
    font-size: 22px;
  }
  .register-success__tip {
    margin: 16px;
  }
}
</style>