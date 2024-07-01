<template>
  <div class="entryFormBox tc">
    <div class="entrySuccess">
      <i class="el-icon-success"></i>
    </div>
    <h3>{{ $t("createApp.finish.5ix616jnf000") }}</h3>
    <p class="txtC" style="text-align: center; margin-bottom: 50px">
      <span class="primary">{{ time }}s</span>
      {{ $t("createApp.finish.5ix616jnfn40") }}
    </p>
    <el-row class="txtC" style="text-align: center">
      <el-button type="primary" @click="appOpenBiz">{{
        $t("createApp.finish.5ix616jnfs80")
      }}</el-button>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "Finish",
  props: {
    appId: Number,
  },

  data() {
    return {
      time: 3,
      intervalID: "",
    };
  },
  methods: {
    appOpenBiz() {
      this.$router.push({
        // path: "/appManager/appTabs",
        name: "AppManagerAppTabs",
        params: { id: this.appId },
        query: { tabName: "DockingScheme" },
      });
    },
  },
  created() {
    console.log("appId", this.appId);
    //必须要这么干，
    let _this = this;
    _this.intervalID = window.setInterval(function () {
      _this.time--;
      console.log(_this.time);
      if (_this.time <= 0) {
        clearInterval(_this.intervalID);
        _this.appOpenBiz();
      }
    }, 1000);
  },
};
</script>

<style lang="scss" scoped>
.entryFormBox {
  .entrySuccess {
    font-size: 36px;
    color: #26a872;
  }
}
</style>
