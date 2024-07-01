<template>
  <div class="detail">
    <SoftwareSystemApp v-if="serviceType === 'softwareSystemApp'" />
  </div>
</template>

<script>
import SoftwareSystemApp from "@/views/intranet/app-manager/detail/softwareSystemApp/index.vue";

export default {
  name: "Detail",
  components: { SoftwareSystemApp },
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