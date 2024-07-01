<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import isIntranet from "@/utils/isIntranet.js";

export default {
  name: "App",
  computed: {
    ...mapGetters(["user_pin"]),
  },
  created() {
    // 语言环境设置
    this.$i18n.locale = "zh-cn";
    // 以下是子午线埋点代码
    const jdpts = {};
    window.jdpts = jdpts;
    jdpts._st = new Date().getTime();
    const jaq = [];
    window.jaq = jaq || [];
    let account = window.env.baseStreamAccount;
    if (!isIntranet()) {
      account = window.env.baseStreamCloudAccount;
    }
    jaq.push(["domain", "jdl.com"]);

    jaq.push(["account", account]);
    jaq.push(["erp_account", this.$store.getters.user_pin]);
    jaq.push(["anchorpvflag", "true"]);
    jaq.push(["anchorToUri", 1]);

    const ja = document.createElement("script");
    ja.type = "text/javascript";
    ja.async = true;
    ja.src = "//wl.jd.com/joya.js";
    const s = document.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(ja, s);
  },
  mounted() {
    if (isIntranet()) {
      this.$watermark.init({ text: this.user_pin });
    }
  },
};
</script>

<style lang="scss">
@import "~@/assets/styles/index.scss";
</style>
