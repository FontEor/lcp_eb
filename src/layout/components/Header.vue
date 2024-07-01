<template>
  <div class="navbar cf">
    <div class="logo">
      <a
        class="navbar-logo"
        :clstag="
          clstag('appManager_1618992717469|1', 'appManager_1618993242376|1')
        "
      ></a>
    </div>
  </div>
</template>

<script>
import pageClick from "@/utils/pageClick.js";

export default {
  data() {
    return {};
  },
  methods: {
    // 点击事件埋点
    clstag(intranetId, extranetId) {
      return pageClick(intranetId, extranetId);
    },
  },
  created() {},
};
</script>

<style lang="scss" scoped>
.logo {
  height: 100%;
  padding-right: 50px;

  .navbar-logo {
    display: block;
    padding: 21px 0;
    width: 333px;
    background: url("~@/assets/img/header/header-logo.png") top 0px center no-repeat;
    background-size: 333px 30px;
  }
}

.navbar {
  height: 60px;
  padding: 0 10px 0 20px;
  position: relative;

  .logo {
    float: left;
    width: 320px;
    height: 27px;
    margin-top: 16px;
    margin-right: 20px;

    img {
      width: 100%;
      height: 100%;
      display: block;
    }
  }
}
</style>
