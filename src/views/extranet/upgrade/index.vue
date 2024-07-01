<template>
  <div class="micro-wrap">
    <micro-app-lcp_web_upgrade
      name="lcp_web_upgrade"
      :url="url"
      :data="microData"
      baseroute="/upgrade/"
      @created="handleCreate"
      @beforemount="handleBeforeMount"
      @mounted="handleMount"
      @unmount="handleUnmount"
      @error="handleError"
      @datachange="handleDataChange"
    ></micro-app-lcp_web_upgrade>
  </div>
</template>

<script>
import config from "@/config";
import isIntranet from "@/utils/isIntranet.js";

export default {
  name: "Upgrade",
  data() {
    return {
      microData: {},
      workOrderData: {},
    };
  },
  computed: {
    url() {
      return `${
        isIntranet() ? config.lcp_web_upgrade_i : config.lcp_web_upgrade_e
      }/admin/lcp_web_upgrade/`;
    },
  },
  methods: {
    handleCreate() {
      console.log("lcp_web_upgrade created");
    },
    handleBeforeMount() {
      console.log("lcp_web_upgrade BeforeMount");
    },
    handleMount() {
      console.log("lcp_web_upgrade Mount");
    },
    handleUnmount() {
      console.log("lcp_web_upgrade Unmount");
      // if (this.workOrderData.sseInstance) {
      //   this.workOrderData.sseInstance.close();
      // }
    },
    handleError() {
      console.log("lcp_web_upgrade  Error");
    },
    async handleDataChange(e) {
      const { routeName, type, data } = e.detail.data || {};
      // if (routeName === "WorkOrder") {
      //   if (type === "sseClose") {
      //     this.workOrderData = { ...this.workOrderData, sseInstance: data };
      //   }
      // }
    },
  },
};
</script>

<style lang="scss" scoped>
.micro-wrap {
  margin: 0 20px;
  background: #fff;
  min-height: calc(100vh - 100px);
  position: relative;
}
</style>
