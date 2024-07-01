<template>
  <div>
    <div class="tit-view">
      <h2 class="big-tit">{{ appName }}</h2>
      <p class="tip">
        {{ appCreateUser }}{{ $t("app.appTabs.5ix1z3aotes1")
        }}{{ appCreateTime }}
      </p>
    </div>
    <div class="my-tabs">
      <el-tabs
        v-model="tabName"
        :tab-position="tabPosition"
        :before-leave="leaveTab"
      >
        <el-tab-pane :label="$t('app.appTabs.5ix1z3aotes0')" name="302">
          <Overview v-if="tabName === '302'" @updateTitle="updateTitle" />
        </el-tab-pane>
        <el-tab-pane :label="$t('app.appTabs.5ix1z3apcuc0')" name="303">
          <ProvidedApiList v-if="tabName === '303'" />
        </el-tab-pane>
        <el-tab-pane :label="$t('app.appTabs.5ix1z3apd600')" name="304">
          <CalledApiList v-if="tabName === '304'" />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import request from "@/utils/request";
import Overview from "./components/overview.vue";
import ProvidedApiList from "./components/provided-api-list/index.vue";
import CalledApiList from "./components/called-api-list/index.vue";
import buriedPoint from "@/mixins/buriedPoint.js";
import { parseTime } from "@/utils";

export default {
  components: {
    Overview,
    ProvidedApiList,
    CalledApiList,
  },
  mixins: [buriedPoint],
  data() {
    return {
      tabPosition: "top",
      appId: "",
      appName: "",
      appRemark: "",
      appCreateUser: "",
      appCreateTime: "",
      tabName: "302",
      appKey: "",
      appType: 0,
    };
  },
  methods: {
    updateTitle(e) {
      this.appId = e.id;
      this.appName = e.name;
      this.appRemark = e.remark;
      this.appCreateUser = e.createUser;
      this.appCreateTime = parseTime(e.createTime, "{y}-{m}-{d} {h}:{i}");
      this.appKey = e.code;
      this.appType = e.type;
    },

    fetchAppSummary() {
      let url = "/app/getApp";
      request({
        url: url,
        method: "get",
        params: { id: this.$route.params.id },
      })
        .then((rsp) => {
          if (rsp.data) {
            this.updateTitle(rsp.data);
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },

    leaveTab(activeName, oldActiveName) {
      this.tabName = activeName;
      this.$router.push({
        name: "AppManagerAppTabs",
        params: { id: this.appId },
        query: { tabName: this.tabName },
      });
    },

    goBack() {
      this.$router.push("/appManager");
    },
  },
  created() {
    this.appId = this.$route.params.id;
    this.tabName = this.$route.query.tabName;
    this.fetchAppSummary();
  },
};
</script>

<style lang="scss" scoped>
.tit-view {
  background: #fff;
  padding: 10px 20px 10px 32px;
  margin: 0 20px 20px;
  position: relative;
  &:before {
    content: "";
    position: absolute;
    top: 50%;
    left: 20px;
    width: 4px;
    height: 45px;
    background: #3c6ef0;
    transform: translateY(-50%);
  }
}
.big-tit {
  line-height: 26px;
  position: relative;
  font-size: 16px;
  font-weight: 600;
}
.tip {
  font-size: 14px;
  line-height: 24px;
  margin-top: 5px;
}
.my-tabs {
  background: #fff;
  padding: 10px 20px 20px;
  margin: 20px;
  margin-bottom: 0;
  min-height: calc(100vh - 215px);
}
</style>
