<template>
  <div class="myFormBox">
    <h3>完成</h3>
    <p>接下来您可以进一步编辑SDK相关信息、上传SDK文件。</p>
    <p style="margin-bottom: 20px;">在所有信息都补充完整后，您可以发布该对接方案，并尝试在前台查看或者调用</p>
    <el-row style="text-align: center;margin-bottom: 10px;">
      <el-button type="primary" @click="gotoSdkList">去管理SDK</el-button>
    </el-row>
  </div>
</template>

<script>
  export default {
    name: 'sdkAddStep5',
    data () {
      return {}
    },
    methods: {
      gotoSdkList (id) {
        this.$emit('gotoSdkList')
        this.$router.push({
          // path: '/openBiz/openBizDetail', 
          name:"OpenBizOpenBizDetail",
          params:{ id:this.$route.params.id},
          query: { tag: 'sdkAdd',sdkId:this.$route.query.sdkId }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .myFormBox {
    width: 72%;
    margin: 0 auto;

    h3 {
      margin-bottom: 20px;
      text-align: center;
      font-size: 24px;
      color: #333333;
    }

    p {
      text-align: center;
      margin-bottom: 0;
    }
  }
</style>
