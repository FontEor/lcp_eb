<template>
  <div class="info-text">
    <p class="info-text-p">
      1.模拟快递员揽收时的称重量方，输入包裹6项信息（必须）；
    </p>
    <p class="info-text-p">2.点击【下一步】，包裹可进入下一环节（必须）；</p>
    <p class="info-text-p">3.本阶段您可调用接口（非必须）：</p>
    <p class="info-text-p">
      ①
      <a
        href="https://cloud.jdl.com/#/open-business-document/api-doc/267/845"
        target="_blank"
        >订单修改</a
      >。揽收完成前可修改下单信息。
    </p>
    <p class="info-text-p">
      ②
      <a
        href="https://cloud.jdl.com/#/open-business-document/api-doc/267/846"
        target="_blank"
        >订单取消</a
      >。流程达到终点前可调用，揽收前取消，揽收后拦截。
    </p>
    <p class="info-text-p">
      ③
      <a
        href="https://cloud.jdl.com/#/open-business-document/api-doc/267/1039"
        target="_blank"
        >订单轨迹查询</a
      >。全流程使用，用于查询订单轨迹。
    </p>

    <p class="info-text-p">
      ④
      <a
        href="https://cloud.jdl.com/#/open-business-document/api-doc/267/844"
        target="_blank"
        >订单状态查询</a
      >。全流程使用，用于查询订单状态。
    </p>
    <p class="info-text-p">
      ⑤
      <a
        href="https://cloud.jdl.com/#/open-business-document/api-doc/267/1038"
        target="_blank"
        >物流轨迹订阅</a
      >。如使用<a
        href="https://cloud.jdl.com/#/open-business-document/api-doc/267/1033"
        target="_blank"
        >物流轨迹推送</a
      >，则必须调用。建议【商家下单】环节调用，流程达到终点前可调用。
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
