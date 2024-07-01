<template>
  <article class="debugging-overview">
    <HeaderInfo :sceneName="sceneName" :explanation="explanation" />
    <MainTabs
      :initActiveName="initActiveName"
      :tabPaneList="tabPaneList"
      :routeName="$route.name"
      :routeParams="$route.params"
    >
      <template v-slot="{ name }">
        <DevelopmentInfo v-if="name === 'developmentInfo'" />
        <BusinessDebugging v-else-if="name === 'businessDebugging'" />
      </template>
    </MainTabs>
  </article>
</template>

<script>
import HeaderInfo from "@/views/extranet/sandboxDebugging/debuggingOverview/components/HeaderInfo.vue";
import MainTabs from "@/views/extranet/sandboxDebugging/debuggingOverview/components/MainTabs.vue";
import DevelopmentInfo from "@/views/extranet/sandboxDebugging/debuggingOverview/developmentInfo/index.vue";
import BusinessDebugging from "@/views/extranet/sandboxDebugging/debuggingOverview/businessDebugging/index.vue";

export default {
  name: "DebuggingOverview",
  components: { HeaderInfo, MainTabs, DevelopmentInfo, BusinessDebugging },
  data() {
    return {
      sceneName: "京东快递-B2C正向下单",
      explanation: "用于验证从快递下单到快递员揽收流程",
      initActiveName: this.$route.params.activeName || "",
      tabPaneList: [
        { label: "开发信息", name: "developmentInfo" },
        { label: "业务联调", name: "businessDebugging" },
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
.debugging-overview {
}
</style>