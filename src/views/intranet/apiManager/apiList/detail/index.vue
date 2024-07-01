<template>
  <div class="detail">
    <HttpDetail v-if="serviceType === 'http'" />
    <JsfDetail v-else-if="serviceType === 'jsf'" />
  </div>
</template>

<script>
import JsfDetail from "@/views/intranet/apiManager/apiList/detail/jsfDetail/index.vue";
import HttpDetail from "@/views/intranet/apiManager/apiList/detail/httpDetail/index.vue";

export default {
  name: "detail",
  components: { JsfDetail, HttpDetail },
  data() {
    const self = this;
    return {
      serviceType: self.$route.params.type,
    };
  },
};
</script>

<style lang="scss" scoped>
.detail {
  margin: 0 20px;
}
</style>