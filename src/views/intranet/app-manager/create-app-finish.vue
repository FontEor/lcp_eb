<template>
  <div class="app-container">
    <div class="entryBox">
      <steps v-bind="stepsObj" />
      <div class="entryFormBox tc">
        <div class="entrySuccess">
          <i class="el-icon-success"></i>
        </div>
        <h3>{{ $t("app.addappsuccess.5ix6v94ryr80") }}</h3>
        <p
          class="txtC"
          style="text-align: center; margin-bottom: 50px"
          v-if="isIntranet"
        >
          <span class="primary">{{ time }}s</span
          >{{ $t("app.addappsuccess.5ix6v94s0400") }}
        </p>
        <p
          class="txtC"
          style="text-align: center; margin-bottom: 50px"
          v-if="!isIntranet"
        >
          <span class="primary">{{ time }}s</span
          >{{ $t("app.addappsuccess.5ix6v94s0bg0") }}
        </p>
        <el-row class="txtC" style="text-align: center">
          <el-button v-if="isIntranet" @click="appmanager">{{
            $t("app.addappsuccess.5ix6v94s0is0")
          }}</el-button>
          <el-button v-if="isIntranet" type="primary" @click="next">{{
            $t("app.addappsuccess.5ix6v94s0mc0")
          }}</el-button>
          <el-button v-if="!isIntranet" type="primary" @click="appOpenBiz">{{
            $t("app.addappsuccess.5ix6v94s0r40")
          }}</el-button>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import steps from "@/components/steps/index.vue";
import isIntranet from "@/utils/isIntranet.js";

export default {
  components: {
    steps,
  },
  data() {
    return {
      stepsObj: {
        active: 3,
        title: this.$t("app.addappsuccess.5ix6v94s0uo0"),
        tiptitle: [this.$t("app.addappsuccess.5ix6v94s0yo0")],
      },
      time: 3,
      intervalID: "",
      id: this.$route.query.id,
      isIntranet: isIntranet(),
    };
  },
  methods: {
    next() {
      clearInterval(this.intervalID);
      this.$router.push({ path: "/apiManager/registerApi" });
    },
    appmanager() {
      clearInterval(this.intervalID);
      this.$router.push({
        // path: '/appManager/appTabs',
        name: "AppManagerAppTabs",
        params: { id: this.id },
        query: { tabName: "302" },
      });
    },
    appOpenBiz() {
      clearInterval(this.intervalID);
      this.$router.push({
        // path: '/appManager/appTabs',
        name: "AppManagerAppTabs",
        params: { id: this.id },
        query: { tabName: "DockingScheme" },
      });
    },
  },
  created() {
    let _this = this;
    _this.intervalID = window.setInterval(function () {
      _this.time--;
      if (_this.time <= 0) {
        clearInterval(_this.intervalID);
        if (isIntranet()) {
          _this.$router.push({ path: "/apiManager/registerApi" });
        } else {
          _this.$router.push({
            // path: '/appManager/appTabs',
            name: "AppManagerAppTabs",
            params: { id: _this.id },
          });
        }
      }
    }, 1000);
  },
  beforeRouteLeave(to, form, next) {
    clearInterval(this.intervalID);
    next();
  },
};
</script>

<style scoped>
.entrySuccess {
  font-size: 36px;
  color: #26a872;
}
</style>
