<template>
  <!-- 妥投 -->
  <div class="info-text">
    <p class="info-text-p">1.本阶段您可调用接口（非必须）：</p>
    <p class="info-text-p">
      ①
      <a
        href="https://cloud.jdl.com/#/open-business-document/api-doc/267/1039"
        target="_blank"
        >订单轨迹查询</a
      >。全流程使用，用于查询订单轨迹。
    </p>
    <p class="info-text-p">
      ②
      <a
        href="https://cloud.jdl.com/#/open-business-document/api-doc/267/844"
        target="_blank"
        >订单状态查询</a
      >。全流程使用，用于查询订单状态。
    </p>
    <p class="info-text-p">
      ③
      <a
        href="https://cloud.jdl.com/#/open-business-document/api-doc/267/843"
        target="_blank"
        >实际费用查询</a
      >。全流程使用，用于查询订单状态。
    </p>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {};
  },
  created() {},
  methods: {},
};
</script>

<style lang="scss" scoped>
::v-deep .el-tabs__header {
  margin-bottom: 0;
}
.info-text {
  // margin: auto 16px;
  font-size: 14px;
  font-family: PingFang SC;
  font-weight: normal;
  color: rgba(51, 51, 51, 1);
  .info-text-p {
    margin-bottom: 16px;
  }
}
</style>
