<template>
  <div class="security-config">
    <Alert :closable="false">
      <template #title>
        物流开放平台为API提供了一系列的安全配置，可根据API的使用场景、数据级别开启不同的安全配置。
      </template>
    </Alert>

    <CardTransmissionEncryption
      :domainId="domainId"
      :url="url"
      @getApiBasicInfo="$emit('getApiBasicInfo')"
    />
  </div>
</template>

<script>
import Alert from "@/components/Alert.vue";
import CardTransmissionEncryption from "./components/card-transmission-encryption.vue";

export default {
  name: "SecurityConfig",
  components: { Alert, CardTransmissionEncryption },
  props: {
    domainId: { type: Number, required: true },
    url: { type: String, required: true },
  },
};
</script>

<style lang="scss" scoped>
// .security-config {
// }
</style>
