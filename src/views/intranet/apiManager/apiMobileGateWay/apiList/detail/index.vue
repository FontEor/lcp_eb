<template>
  <div class="detail">
    <HttpDetail />
  </div>
</template>

<script>
import HttpDetail from "@/views/intranet/apiManager/apiMobileGateWay/apiList/detail/httpDetail/index.vue";

export default {
  name: "detail",
  components: { HttpDetail },
};
</script>

<style lang="scss" scoped>
.detail {
  margin: 0 20px;
}
</style>