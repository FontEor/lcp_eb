<template>
  <div class="api-manager">
    <div class="tab-wrap">
      <div
        :class="[
          'tab-openingapi',
          'tab-content',
          parentTabClassName('openingApi'),
        ]"
      >
        <p
          class="tab-content-title"
          @click="
            handleSwitchTab('openingApi', {
              name: 'jsf',
              $attrs: { query: { type: 'jsf' } },
            })
          "
        >
          开放API
          <el-tooltip
            class="item"
            effect="dark"
            content="开放给外部客户、京东内部业务线使用的API；如：USF3.0系统以API形式开放权限管理的能力给京东集团的业务系统管理自身权限。"
            placement="bottom-start"
          >
            <p class="tab-tip-img"></p>
          </el-tooltip>
        </p>
        <el-tabs
          class="child-tabs"
          v-model="activeOpeningItem"
          @tab-click="(tab) => handleSwitchTab('openingApi', tab)"
        >
          <el-tab-pane
            label="JSF服务API"
            name="jsf"
            :query="{ type: 'jsf' }"
          ></el-tab-pane>
          <el-tab-pane
            label="HTTP服务API"
            name="http"
            :query="{ type: 'http' }"
          ></el-tab-pane>
          <el-tab-pane label="回传API" name="ApiManagerPassBack"></el-tab-pane>
          <el-tab-pane label="API分组" name="ApiManagerApiGroup"></el-tab-pane>
          <el-tab-pane label="集群" name="ApiManagerCluster"></el-tab-pane>
        </el-tabs>
      </div>
      <div :class="['tab-content','tab-gatewayapi', parentTabClassName('gatewayApi')]">
        <p
          class="tab-content-title"
          @click="handleSwitchTab('gatewayApi', { name: 'ApiManagerMobile' })"
        >
          移动端网关API
          <el-tooltip
            class="item"
            effect="dark"
            content="提供给移动端、PC端使用的API；如：发布API给京东快递小程序使用、发布API给站长工作台使用。"
            placement="bottom-start"
          >
            <p class="tab-tip-img"></p>
          </el-tooltip>
        </p>
        <el-tabs
          class="child-tabs"
          v-model="activeGatewayApiItem"
          @tab-click="(tab) => handleSwitchTab('gatewayApi', tab)"
        >
          <el-tab-pane
            label="HTTP协议API"
            name="ApiManagerMobile"
          ></el-tab-pane>
          <el-tab-pane
            label="API分组"
            name="ApiManagerMobileApiGroup"
          ></el-tab-pane>
          <el-tab-pane
            label="集群"
            name="ApiManagerMobileCluster"
          ></el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <div class="main-content">
      <template v-if="activeParentTab === 'openingApi'">
        <ApiList
          v-if="activeOpeningItem === 'jsf' || activeOpeningItem === 'http'"
        />
        <PassBack v-else-if="activeOpeningItem === 'ApiManagerPassBack'" />
        <GroupList v-else-if="activeOpeningItem === 'ApiManagerApiGroup'" />
        <ClusterList
          v-else-if="activeOpeningItem === 'ApiManagerCluster'"
          @showApiList="showApiList"
        ></ClusterList>
      </template>
      <template v-else-if="activeParentTab === 'gatewayApi'">
        <MobileGateWayApiList
          v-if="activeGatewayApiItem === 'ApiManagerMobile'"
        />
        <MobileGateWayGroupList
          v-else-if="activeGatewayApiItem === 'ApiManagerMobileApiGroup'"
        />
        <MobileGateWayClusterList
          v-else-if="activeGatewayApiItem === 'ApiManagerMobileCluster'"
          @showMobileApiList="showMobileApiList"
        ></MobileGateWayClusterList>
      </template>
    </div>
  </div>
</template>

<script>
import ApiList from "@/views/intranet/apiManager/apiList/index.vue";
import ClusterList from "@/views/intranet/apiManager/clusterList/index.vue";
import GroupList from "./groupList/index.vue";
import PassBack from "@/views/intranet/apiManager/apiPassbackList/index.vue";
import MobileGateWayApiList from "@/views/intranet/apiManager/apiMobileGateWay/apiList/index.vue";
import MobileGateWayClusterList from "@/views/intranet/apiManager/apiMobileGateWay/clusterList/index.vue";
import MobileGateWayGroupList from "@/views/intranet/apiManager/apiMobileGateWay/groupList/index.vue";
import buriedPoint from "@/mixins/buriedPoint.js";


const activeOpeningTabList = [
  "/apiManager",
  "ApiManagerPassBack",
  "ApiManagerApiGroup",
  "ApiManagerCluster",
];
const activeGatewayApiTapList = [
  "ApiManagerMobile",
  "ApiManagerMobileApiGroup",
  "ApiManagerMobileCluster",
];
const monitoringMap = {
  "jsf": "apiManager_jsf_1670468865530|1",
  "http": "apiManager_http_1670470412984|1",
  "ApiManagerPassBack": "apiManager_passBack_1670471262879|1",
}

export default {
  name: "ApiManager",
  mixins: [buriedPoint],
  components: {
    ApiList,
    GroupList,
    ClusterList,
    PassBack,
    MobileGateWayApiList,
    MobileGateWayClusterList,
    MobileGateWayGroupList,
  },
  data() {
    return {
      activeParentTab: "openingApi",
      activeOpeningItem: "",
      activeGatewayApiItem: "",
    };
  },
  computed: {
    parentTabClassName() {
      return (name) => {
        if (this.activeParentTab === name) {
          return "tab-content-active";
        }
        return "tab-content-off";
      };
    },
  },
  watch: {
    $route: {
      handler(newRoute, oldRoute) {
        if (!newRoute) return;
        const { path, query, name } = newRoute || {};
        if (
          activeOpeningTabList.includes(name) ||
          activeOpeningTabList.includes(path)
        ) {
          this.activeParentTab = "openingApi";
          this.activeOpeningItem = name;
          this.activeGatewayApiItem = "";
          if (path === "/apiManager") {
            if (!query.type) {
              this.$router.replace({
                path: "/apiManager",
                query: { type: "jsf" },
              });
            }
            this.activeOpeningItem = query.type;
          }
          this.monitoring(this.activeOpeningItem);
        }
        if (
          activeGatewayApiTapList.includes(name) ||
          activeGatewayApiTapList.includes(path)
        ) {
          this.activeParentTab = "gatewayApi";
          this.activeOpeningItem = "";
          this.activeGatewayApiItem = name;
        }
      },
      immediate: true,
    },
  },
  methods: {
    showApiList(data) {
      if (data) {
        this.activeOpeningItem = "jsf";
        this.$router.replace({ path: "/apiManager", query: { type: "jsf" } });
      }
    },
    showMobileApiList(data) {
      if (data) {
        this.$router.replace({ path: "/apiManager/mobile" });
      }
    },
    handleSwitchTab(activePTabName, tab) {
      const activeTabName = tab.name;
      const query = tab.$attrs && tab.$attrs.query;
      if (
        (activePTabName === "openingApi" && activeTabName === "jsf") ||
        (activePTabName === "openingApi" && activeTabName === "http")
      ) {
        this.$router.push({ path: "/apiManager", query });
        return;
      }
      this.$router.push({ name: activeTabName, query });
    },
    monitoring(activeTabName) {
      const monitoring = monitoringMap[activeTabName] || "";
      if (monitoring) {
        const div = document.createElement("div");
        div.setAttribute("clstag", this.clstag(monitoring,""));
        document.body.appendChild(div);
        div.click();
        div.remove();
      }
    }
  },
  mounted() {},
};
</script>

<style lang="scss" scoped>
.api-manager {
  margin: 0 20px;
  height: calc(100vh - 100px);
  position: relative;
  display: flex;
  flex-direction: column;
}
.tab-wrap {
  display: flex;
  .tab-content {
    width: 50%;
    display: flex;
    align-items: center;
    border-radius: 4px 4px 0 0;
    padding: 0 20px;
    transition: all 0.5s;
    ::v-deep .el-tabs__header {
      margin-bottom: 0;
    }
    ::v-deep .el-tabs__item {
      padding: 0 10px;
    }
    ::v-deep .el-tabs__nav-wrap::after {
      background-color: transparent;
    }
  }
  .tab-openingapi {
    margin-right: 10px;
  }
  .tab-content-title {
    height: 20px;
    font-size: 16px;
    font-family: PingFang SC;
    font-weight: 600;
    padding-right: 20px;
    margin-right: 10px;
    border-right: 1px solid rgba(234, 234, 234, 1);
    display: flex;
    align-items: center;
    cursor: pointer;
    word-break: keep-all;
    transition: all 0.5s;
    .tab-tip-img {
      width: 15px;
      height: 15px;
      margin-left: 4px;
      background: url("../../../assets/images/api-manager-off-tab.png") top left
        no-repeat;
      background-size: contain;
    }
    &:hover {
      .tab-tip-img {
        background: url("../../../assets/images/api-manager-active-tab.png") top
          left no-repeat;
        background-size: contain;
      }
    }
  }
  .tab-content-off {
    background: rgba(255, 255, 255, 0.5);
    .tab-content-title {
      color: rgba(51, 51, 51, 1);
    }
  }
  .tab-content-active {
    background: rgba(255, 255, 255, 1);
    .tab-content-title {
      color: rgba(60, 110, 240, 1);
    }
  }
  .child-tabs {
    width: 73%;
  }
}
.main-content {
  padding: 20px;
  width: 100%;
  background: rgba(255, 255, 255, 1);
  border-radius: 0 0 4px 4px;
  border-top: 1px solid rgba(234, 234, 234, 1);
  flex: 1;
  overflow-y: auto;
}
</style>
