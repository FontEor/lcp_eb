<template>
  <div class="publish-success">
    <div class="submit-success">
      <i class="el-icon-success"></i>
    </div>
    <p class="success-title">提交成功</p>
    <p class="success-tip">提醒审批人尽快审批吧，审批通过后发布内容生效</p>
    <div class="footer" style="text-align: center">
      <el-button @click="gotoGroupList">返回分组列表</el-button>
      <el-button type="primary" @click="backGroupDetail"
        >继续管理分组</el-button
      >
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    gotoGroupList() {
      this.$router.push({
        name: "ApiManagerMobileApiGroup",
      });
    },
    backGroupDetail() {
      this.$router.push({
        name: "ApiManagerMobileApiGroupDetail",
        params:{id:this.$route.params.id}
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.publish-success {
  .submit-success {
    font-size: 50px;
    color: #26a872;
    text-align: center;
  }
  .success-title {
    font-size: 22px;
    text-align: center;
  }
  .success-tip {
    margin: 20px auto;
    text-align: center;
  }
}
</style>