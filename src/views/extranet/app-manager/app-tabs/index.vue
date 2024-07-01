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
        @tab-click="onTabClick"
      >
        <el-tab-pane :label="$t('app.appTabs.5ix1z3aotes0')" name="302">
          <Overview v-if="tabName === '302'" @updateTitle="updateTitle" />
        </el-tab-pane>
        <el-tab-pane
          v-if="appKey && appType !== 5"
          :lazy="true"
          :label="$t('app.appTabs.5ix1z3apdcc0')"
          name="CustomerGroup"
        >
          <CustomerGroup :app-code="appKey"></CustomerGroup>
        </el-tab-pane>
        <el-tab-pane
          :label="$t('app.appTabs.5ix1z3apdic0')"
          name="DockingScheme"
        >
          <DockingScheme
            v-if="tabName === 'DockingScheme' && appKey && appType"
            :appKey.sync="appKey"
            :appType.sync="appType"
          />
        </el-tab-pane>
        <el-tab-pane :label="$t('app.appTabs.5ix1z3apdo80')" name="LogTool">
          <LogTool
            v-if="tabName === 'LogTool' && appKey"
            :appKey.sync="appKey"
          />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import request from "@/utils/request";
import Overview from "./components/overview.vue";
import CustomerGroup from "./components/customer-group/index.vue";
import DockingScheme from "./components/docking-scheme/index.vue";
import LogTool from "./components/log-tool/index.vue";
import buriedPoint from "@/mixins/buriedPoint.js";
import { parseTime } from "@/utils";

export default {
  components: {
    Overview,
    DockingScheme,
    LogTool,
    CustomerGroup,
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
    onTabClick(tab) {
      const { name = "" } = tab;
      const hashMap = new Map().set("LogTool", "log_1655708143199|1");
      const div = document.createElement("div");
      div.setAttribute("clstag", this.clstag("", hashMap.get(name) || ""));
      document.body.appendChild(div);
      div.click();
      div.remove();
    },
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
      let url = "/app/getOuterApp";
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
