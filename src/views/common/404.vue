<template>
  <div class="wscn-http404-container">
    <div class="pic-404">
      <img class="pic-404-bg" src="@/assets/404_images/404.png" alt="404">
      <el-button type="primary" class="bullshit__return-home" @click="routerback">返回</el-button>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Page404',
  methods: {
    routerback() {
       window.location.href = window.location.protocol+"//"+`${window.location.host}`
    }
  }
}
</script>

<style lang="scss" scoped>
.wscn-http404-container{
  transform: translate(-50%,-50%);
  position: absolute;
  top: 40%;
  left: 50%;
  .pic-404{
    position:relative;
    width:660px;
    height:400px;
    margin:0 auto;
  }
  .pic-404-bg{
    width:100%;
    height:100%;
  }
  .bullshit__return-home{
    position:absolute;
    bottom:40px;
    left:50%;
    transform: translateX(-50%);
  }
}
</style>
