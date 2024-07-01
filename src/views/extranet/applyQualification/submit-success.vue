<template>
  <div class="submit-success">
    <i class="el-icon-success normalColor" />
    <p class="title">提交成功</p>

    <div
      v-if="
        routeName === 'ApplyIsvQualification' ||
        routeName === 'ApplyPartnerQualification'
      "
      class="tip"
    >
      资质申请长时间未通过或被驳回，您可通过<el-button
        type="text"
        @click="onClickSubmitWorkOrderButton"
        >提交工单</el-button
      >的方式与平台联系
    </div>
    <p v-else-if="routeName === 'ApplySupplierQualification'" class="tip">
      自研商家资质无需人工审核，系统自动审批通过
    </p>

    <el-button
      type="primary"
      @click="onClickBackToQualificationManagementButton"
      >返回资质管理</el-button
    >
  </div>
</template>

<script>
export default {
  computed: {
    routeName() {
      const { name } = this.$route;
      return name;
    },
  },
  methods: {
    onClickSubmitWorkOrderButton() {
      const path = "/upgrade/work-order";
      this.$router.push({ path });
    },
    onClickBackToQualificationManagementButton() {
      const name = "Qualification";
      this.$router.push({ name });
    },
  },
};
</script>

<style lang="scss" scoped>
.submit-success {
  display: flex;
  flex-direction: column;
  align-items: center;

  .el-icon-success {
    margin: 24px;
    font-size: 48px;
  }

  .title {
    font-size: 20px;
  }

  .tip {
    margin: 16px;
  }
}
</style>
