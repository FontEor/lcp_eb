<template>
  <!-- 京东调外部API列表-API详情 -->
  <div class="detail" v-loading.lock="loading">
    <!-- 顶栏 -->
    <HeaderInfo
      :imagePath="imagePath"
      :url="url"
      :name="name"
      :createUser="createUser"
      :createTime="createTime"
      :statusInfo="btnStatusInfo.statusInfo"
    >
      <el-button
        type="primary"
        :disabled="btnStatusInfo.publishBtnStatus.disabled"
        :loading="publishApiLoading"
        @click="publishApi"
        v-if="btnStatusInfo.publishBtnStatus.visible"
        >发布</el-button
      >
    </HeaderInfo>
    <!-- 标签页 -->
    <el-tabs v-model="activeName" type="card" @tab-click="handleClickTab">
      <el-tab-pane label="基础数据" name="basic-data">
        <BasicData
          v-if="activeName === 'basic-data'"
          :editBtnStatusInfo="btnStatusInfo.basicEditBtnStatus"
          :name="name"
          :remark="remark"
          :visibility="visibility"
          :dataLevel="dataLevel"
          :domain="domain"
          :lcpApp="lcpApp"
          :productPrincipal="productPrincipal"
          :developPrincipal="developPrincipal"
          :operationPrincipal="operationPrincipal"
          @getApiBasicInfo="getApiBasicInfo"
        />
      </el-tab-pane>
      <el-tab-pane label="API文档" name="api-doc">
        <ApiDoc
          v-if="activeName === 'api-doc'"
          @getApiBasicInfo="getApiBasicInfo"
          :status="status"
          :apiDocEditBtnStatus="btnStatusInfo.apiDocEditBtnStatus"
          tabName="ApiManagerPassBack"
        />
      </el-tab-pane>
      <el-tab-pane label="安全配置" name="security-config">
        <SecurityConfig
          v-if="securityConfigVisible"
          :domainId="domainId"
          :url="url"
          @getApiBasicInfo="getApiBasicInfo"
        />
      </el-tab-pane>
      <el-tab-pane label="发布记录" name="update-record">
        <UpdateRecord v-if="activeName === 'update-record'" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import HeaderInfo from "@/views/intranet/apiManager/apiList/detail/components/HeaderInfo.vue";
import BasicData from "@/views/intranet/apiManager/apiPassbackList/detail/basicData.vue";
import ApiDoc from "@/views/intranet/apiManager/apiPassbackList/detail/apiDoc.vue";
import SecurityConfig from "./security-config.vue";
import UpdateRecord from "./update-record.vue";
import imagePath from "@/assets/intranet/images/apiManager/detail/http.png";
import gateway from "@/api/intranet/gateway/index.js";

export default {
  name: "Detail",
  components: { HeaderInfo, BasicData, ApiDoc, SecurityConfig, UpdateRecord },
  data() {
    return {
      loading: false,
      publishApiLoading: false,
      imagePath,
      url: "",
      name: "",
      createUser: "",
      createTime: new Date(),
      isOnline: 0,
      status: 0,
      // API基本信息
      remark: "",
      visibility: 0,
      dataLevel: 0,
      type: 2,
      domain: {},
      domainId: 0,
      lcpApp: {},
      productPrincipal: "",
      developPrincipal: "",
      operationPrincipal: "",

      activeName: this.$route.query.tab || "basic-data",
    };
  },
  computed: {
    securityConfigVisible() {
      const { activeName, domainId, url } = this;
      return activeName === "security-config" && domainId && url;
    },
    btnStatusInfo() {
      let statusInfo = {
        text: "",
        className: "",
        status: this.status,
        isOnline: this.isOnline,
      };
      let publishBtnStatus = {
        disabled: false,
        visible: true,
      };
      let basicEditBtnStatus = {
        disabled: false,
        visible: true,
        status: this.status,
        isOnline: this.isOnline,
      };
      let apiDocEditBtnStatus = {
        disabled: false,
        visible: true,
        status: this.status,
        isOnline: this.isOnline,
      };
      if (+this.isOnline === 0 && +this.status === 1) {
        //初始化：
        statusInfo.text = "初始化";
        statusInfo.className = "status status_init";
        publishBtnStatus.disabled = false;
        publishBtnStatus.visible = true;
        basicEditBtnStatus.disabled = false;
        basicEditBtnStatus.visible = true;
        apiDocEditBtnStatus.disabled = false;
        apiDocEditBtnStatus.visible = true;
      } else if (+this.isOnline === 1 && +this.status === 1) {
        //编辑中：
        statusInfo.text = "编辑中";
        statusInfo.className = "status status_edit";
        publishBtnStatus.disabled = false;
        publishBtnStatus.visible = true;
        basicEditBtnStatus.disabled = false;
        basicEditBtnStatus.visible = true;
        apiDocEditBtnStatus.disabled = false;
        apiDocEditBtnStatus.visible = true;
      } else if (
        +this.status === 3 ||
        +this.status === 9 ||
        +this.status === 7
      ) {
        // 审批中：
        statusInfo.text = "审批中";
        statusInfo.className = "status status_approve";
        publishBtnStatus.disabled = true;
        publishBtnStatus.visible = true;
        basicEditBtnStatus.disabled = true;
        basicEditBtnStatus.visible = true;
        apiDocEditBtnStatus.disabled = true;
        apiDocEditBtnStatus.visible = true;
      } else if (+this.status === 4) {
        // 已发布：
        statusInfo.text = "已发布";
        statusInfo.className = "status status_released";
        publishBtnStatus.disabled = true;
        publishBtnStatus.visible = true;
        basicEditBtnStatus.disabled = false;
        basicEditBtnStatus.visible = true;
        apiDocEditBtnStatus.disabled = false;
        apiDocEditBtnStatus.visible = true;
      } else if (this.status === 6) {
        // 已下线
        statusInfo.text = "已下线";
        statusInfo.className = "status status_offline";
        publishBtnStatus.disabled = true;
        publishBtnStatus.visible = true;
        basicEditBtnStatus.disabled = true;
        basicEditBtnStatus.visible = true;
        apiDocEditBtnStatus.disabled = true;
        apiDocEditBtnStatus.visible = true;
      }
      return {
        statusInfo,
        publishBtnStatus,
        basicEditBtnStatus,
        apiDocEditBtnStatus,
      };
    },
  },
  methods: {
    // 查询API基本信息
    async queryOuterApiBaseInfo() {
      const data = [this.$route.params];
      return await gateway.ApiManagerService.queryOuterApiBaseInfo(data);
    },
    // 判断是否进行发布
    async verifyOuterApi() {
      const data = [this.$route.params];
      return await gateway.ApiManagerService.verifyOuterApi(data);
    },

    // 点击标签操作，跳转路由
    handleClickTab() {
      const { activeName } = this;
      const tab = activeName;
      const name = "ApiManagerPassBackDetail";
      const query = { tab };
      this.$router.push({ name, query });
    },
    // API基础数据
    async getApiBasicInfo() {
      const response = await this.queryOuterApiBaseInfo().catch(() => {
        throw new Error("getApiBasicInfo queryOuterApiBaseInfo");
      });
      const data = response.data;
      const {
        name,
        url,
        updateUser,
        updateTime,
        intr,
        status,
        isOnline,
        visibility,
        dataLevel,
        appKey,
        appName,
        domain,
        domainId,
        domainName,
        developPrincipal,
        operationPrincipal,
        productPrincipal,
        createUser,
      } = data;
      this.name = name;
      this.url = url;
      this.createUser = createUser;
      this.createTime = updateTime;
      this.remark = intr || "";
      this.status = status;
      this.isOnline = isOnline;
      this.visibility = visibility;
      this.dataLevel = dataLevel;
      this.lcpApp = { lcpAppKey: appKey, lcpAppName: appName };
      this.domain = { domain, domainId, domainName };
      this.domainId = domainId;
      this.developPrincipal = developPrincipal || "";
      this.operationPrincipal = operationPrincipal || "";
      this.productPrincipal = productPrincipal || "";
    },
    // 点击发布按钮操作
    async publishApi() {
      this.publishApiLoading = true;
      await this.verifyOuterApi().catch(() => {
        this.publishApiLoading = false;
        throw new Error("publishApi verifyOuterApi");
      });
      this.publishApiLoading = false;
      this.$router.push({
        name: "ApiManagerPassBackPublish",
        params: this.$route.params,
      });
    },
  },
  created() {
    this.getApiBasicInfo();
  },
};
</script>

<style lang="scss" scoped>
.detail {
  margin: 0 20px;
  .el-tabs {
    ::v-deep .el-tabs__header {
      background: #f5f5f5;
      border-bottom: none;
      margin: 0;
      position: -webkit-sticky;
      position: sticky;
      top: 60px;
      z-index: 1;
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
