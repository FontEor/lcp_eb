<template>
  <!-- 软件系统应用详情 -->
  <div class="software-system-app" v-loading.lock="loading">
    <!-- 顶栏 -->
    <HeaderInfo
      :name="name"
      :createUser="createUser"
      :createTime="createTime"
      :showStatus="computeShowStatus"
    >
      <el-button
        v-show="status === 2 || status === 3"
        type="primary"
        @click="
          $router.push({
            name: 'AppManagerDetailPublish',
            params: { id, type },
          })
        "
        >发 布</el-button
      >
    </HeaderInfo>

    <!-- 标签页 -->
    <el-tabs v-model="activeName" type="card" @tab-click="tabClick">
      <el-tab-pane label="概览" name="overview">
        <Overview
          v-if="activeName === 'overview'"
          :appBasicForm="basicInfo"
          @updateAppStatus="reloadAppBaseInfo"
        />
      </el-tab-pane>
      <el-tab-pane label="配置扩展点" name="configExtensionPoint">
        <ConfigExtensionPoint
          v-if="activeName === 'configExtensionPoint'"
          :basicInfo="basicInfo"
          @updateAppStatus="reloadAppBaseInfo"
        />
      </el-tab-pane>
      <el-tab-pane label="推送应用" name="pushApp">
        <PushApp
          v-if="activeName === 'pushApp'"
          :appCode="appCode"
          @updateAppStatus="reloadAppBaseInfo"
        />
      </el-tab-pane>
      <el-tab-pane label="日志工具" name="loggingTools">
        <LoggingTools
          v-if="activeName === 'loggingTools'"
          :appCode="appCode"
          :productCode="productCode"
          :productDomainName="productDomainName"
          :productUatDomainName="productUatDomainName"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import HeaderInfo from "@/views/intranet/app-manager/detail/components/HeaderInfo.vue";
import Overview from "@/views/intranet/app-manager/detail/softwareSystemApp/overview/index.vue";
import ConfigExtensionPoint from "@/views/intranet/app-manager/detail/softwareSystemApp/configExtensionPoint/index.vue";
import PushApp from "@/views/intranet/app-manager/detail/softwareSystemApp/pushApp/index.vue";
import LoggingTools from "@/views/intranet/app-manager/detail/softwareSystemApp/loggingTools/index.vue";
import appManager from "@/api/intranet/appManager/index.js";

export default {
  name: "SoftwareSystemApp",
  components: {
    HeaderInfo,
    Overview,
    ConfigExtensionPoint,
    PushApp,
    LoggingTools,
  },
  data() {
    const self = this;
    return {
      loading: true,
      id: self.$route.params.id,
      type: self.$route.params.type,
      appCode: "",
      productCode: "",
      activeName: "first",
      name: "",
      createUser: "",
      createTime: "",
      status: 1,
      basicInfo: {},
      productDomainName: "",
      productUatDomainName: "",
    };
  },
  computed: {
    computeShowStatus() {
      return this.status;
    },
  },
  methods: {
    // 查询软件系统应用详情信息
    async getAppBaseInfo() {
      const { id } = this;
      const params = { id };
      return await appManager.getAppBaseInfo(params).catch((error) => {
        const { message } = error.data;
        message && this.$message.error(message);
        throw new Error("getAppBaseInfo");
      });
    },

    // 标签选中时改变query
    tabClick(vm) {
      const { name } = vm;
      const tab = name;
      this.$router.push({ query: { tab } });
    },
    // 加载应用详情信息
    async reloadAppBaseInfo() {
      this.loading = true;
      const response = await this.getAppBaseInfo().catch(() => {
        throw new Error("reloadAppBaseInfo");
      });
      const { data } = response.data;
      const {
        code,
        name,
        createUser,
        createTime,
        status,
        productCode,
        productDomainName,
        productUatDomainName,
      } = data;
      this.basicInfo = data;
      this.name = name;
      this.createUser = createUser;
      this.createTime = createTime;
      this.status = status;
      this.appCode = code;
      this.productCode = productCode;
      this.productDomainName = productDomainName;
      this.productUatDomainName = productUatDomainName;
      this.loading = false;
    },
  },
  async created() {
    await this.reloadAppBaseInfo();
    this.activeName = this.$route.query.tab || "overview";
  },
};
</script>

<style lang="scss" scoped>
.software-system-app {
  .el-tabs {
    ::v-deep .el-tabs__header {
      background: #f5f5f5;
      border-bottom: none;
      margin: 0;
      position: -webkit-sticky;
      position: sticky;
      top: 60px;
      z-index: 4;
      .el-tabs__item {
        border: none;
      }
    }
    ::v-deep .el-tabs__content {
      padding: 16px;
      background: #fff;
      min-height: calc(100vh - 250px);
      // 底部粘性按钮生效条件
      position: static;
      overflow: visible;
    }
  }
}
</style>
