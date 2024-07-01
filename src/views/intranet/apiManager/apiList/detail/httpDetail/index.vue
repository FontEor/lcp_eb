<template>
  <!-- HTTP协议API详情 -->
  <div class="http-detail" v-loading.lock="loading">
    <!-- 顶栏 -->
    <HeaderInfo
      :imagePath="imagePath"
      :url="url"
      :name="name"
      :createUser="createUser"
      :createTime="createTime"
      :showStatus="computeShowStatus"
      :statusInfo="httpBtnStatus.statusInfo"
    >
      <el-button
        type="primary"
        :disabled="computePublishDisabled"
        @click="publishApi"
        >发布</el-button
      >
    </HeaderInfo>
    <!-- 标签页 -->
    <el-tabs v-model="activeName" type="card" @tab-click="handleClickTab">
      <el-tab-pane label="基础数据" name="basic-data">
        <BasicInfo
          v-if="activeName === 'basic-data' && labelIdList"
          :disabledEdit="computeEditDisabled"
          :showStatus="computeShowStatus"
          :name="name"
          :remark="remark"
          :visibility="visibility"
          :dataLevel="dataLevel"
          :type="type"
          :testCluster="testCluster"
          :uatCluster="uatCluster"
          :prodCluster="prodCluster"
          :domain="domain"
          :lcpApp="lcpApp"
          :productPrincipal="productPrincipal"
          :developPrincipal="developPrincipal"
          :operationPrincipal="operationPrincipal"
          :interfaceName="interfaceName"
          :testAlias="testAlias"
          :uatAlias="uatAlias"
          :prodAlias="prodAlias"
          :method="method"
          :testToken="testToken"
          :uatToken="uatToken"
          :prodToken="prodToken"
          :leafIdList="labelIdList"
          @updateGetApi="updateGetApi"
        />
      </el-tab-pane>
      <el-tab-pane label="API文档" name="api-doc">
        <ApiDoc
          v-if="activeName === 'api-doc' && groupCode"
          :disabledEdit="computeEditDisabled"
          :groupCode="groupCode"
          @updateGetApi="updateGetApi"
          :status="status"
          tabName="http"
        />
      </el-tab-pane>
    </el-tabs>

    <el-dialog title="数据级别校验提示" :visible.sync="sensitive.visible">
      <span
        >API文档中包含【{{ sensitive.level }}】数据级别关键字:
        <span style="color: red">{{ displaySensitiveTokens }}</span
        >, 与API的当前【L{{
          dataLevel
        }}】数据级别不符，请确认是否去更新API数据级别？</span
      >
      <span slot="footer">
        <el-button @click="publishApi">继续发布API</el-button>
        <el-button type="primary" @click="gotoUpdateApi">去更新</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import HeaderInfo from "@/views/intranet/apiManager/apiList/detail/components/HeaderInfo.vue";
import BasicInfo from "@/views/intranet/apiManager/apiList/detail/httpDetail/basicData/index.vue";
import ApiDoc from "@/views/intranet/apiManager/apiList/detail/httpDetail/apiDoc/index.vue";
import imagePath from "@/assets/intranet/images/apiManager/detail/http.png";
import httpDetail from "@/api/intranet/apiManager/httpDetail/index.js";
import gwApiRequest from "@/utils/gwApiRequest";

export default {
  name: "HttpDetail",
  components: { HeaderInfo, BasicInfo, ApiDoc },
  data() {
    const self = this;
    return {
      loading: true,
      imagePath,
      url: "url",
      name: "name",
      createUser: "createUser",
      createTime: new Date(),
      isOnline: 0,
      status: 0,
      // API基本信息
      remark: "",
      visibility: 0,
      dataLevel: 0,
      type: 2,
      testCluster: {},
      uatCluster: {},
      prodCluster: {},
      domain: {},
      lcpApp: {},
      productPrincipal: "",
      developPrincipal: "",
      operationPrincipal: "",
      // API文档
      groupCode: "",

      activeName: self.$route.query.tab || "basic-data",
      sensitive: {
        visible: false,
        level: "",
        hits: [],
      },
      interfaceName: "",
      testAlias: "",
      uatAlias: "",
      prodAlias: "",
      method: "",
      testToken: "",
      uatToken: "",
      prodToken: "",
      labelIdList: null,
    };
  },
  computed: {
    // 用于展示状态 1:"初始化",2:"已发布",3:"编辑中"
    computeShowStatus() {
      const self = this;
      const statusMap = { 1: 3, 3: 3, 4: 2 };
      const isOnlineMap = {
        0: 1,
        1: (() => {
          return statusMap[self.status];
        })(),
      };
      return isOnlineMap[this.isOnline];
    },
    httpBtnStatus() {
      let publish = {
        visible: true,
        disabled: false,
      };
      let statusInfo = {
        text: "",
        className: "",
      };
      if (+this.isOnline === 0 && +this.status === 1) {
        //初始化：
        statusInfo.text = "初始化";
        statusInfo.className = "status status_init";
      } else if (+this.isOnline === 1 && +this.status === 1) {
        //编辑中：
        statusInfo.text = "编辑中";
        statusInfo.className = "status status_edit";
      } else if (
        +this.status === 3 ||
        +this.status === 9 ||
        +this.status === 7
      ) {
        // 审批中：
        statusInfo.text = "审批中";
        statusInfo.className = "status status_approve";
        publish.disabled = true;
      } else if (+this.status === 4) {
        // 已发布：
        statusInfo.text = "已发布";
        statusInfo.className = "status status_released";
        publish.disabled = true;
      } else if (this.status === 6) {
        // 已下线
        statusInfo.text = "已下线";
        statusInfo.className = "status status_offline";
        publish.disabled = false;
      }
      return {
        publish,
        statusInfo,
      };
    },
    computePublishDisabled() {
      //       初始化：==>isOnline==0 and status==1
      // 编辑中：==>isOnline==1 and status==1
      // 审批中：status==3 or status == 9 or status==7
      // 已发布：status =4
      // 已下线：status==6
      return (
        +this.status == 3 ||
        +this.status == 9 ||
        +this.status == 7 ||
        +this.status === 4
      );
    },
    computeEditDisabled() {
      return (
        +this.status === 3 ||
        +this.status === 9 ||
        +this.status === 7 ||
        +this.status === 6
      );
    },

    displaySensitiveTokens() {
      return [...new Set(this.sensitive.hits.map((hit) => hit.text))].join(
        "、"
      );
    },
  },
  methods: {
    async getApi() {
      const id = this.$route.params.id;
      const gwParams = [{ id }];
      return await httpDetail.getApi(gwParams).catch((error) => {
        const { message } = error.data;
        message && this.$message.error(message);
        throw new Error(error);
      });
    },
    async verifyApiSummaryFull() {
      const id = this.$route.params.id;
      const gwParams = [{ id }];
      return await httpDetail.verifyApiSummaryFull(gwParams).catch((error) => {
        const { message } = error.data;
        message && this.$message.error(message);
        throw new Error(error);
      });
    },

    // 点击标签操作，跳转路由
    handleClickTab() {
      const { type, id } = this.$route.params;
      const { activeName } = this;
      const tab = activeName;
      const name = "ApiManagerDetail";
      const params = { type, id };
      const query = { tab };
      this.$router.push({ name, params, query });
    },
    async publishApi() {
      await this.verifyApiSummaryFull();
      if (this.sensitive.visible) {
        this.$router.push({
          name: "PublishApi",
        });
      } else {
        const id = this.$route.params.id;
        let gwParams = [{ id }];
        gwApiRequest
          .post(`/HttpApiService/detectApi`, gwParams)
          .then((response) => response.data)
          .then((data) => {
            console.log(data);
            if (data.level) {
              this.sensitive.level = data.level;
              this.sensitive.hits = data.hits;
              this.sensitive.visible = true;
            } else {
              this.$router.push({
                name: "PublishApi",
              });
            }
          });
      }
    },
    async updateGetApi() {
      this.loading = true;
      const response = await this.getApi();
      const data = response.data;
      const {
        url,
        name,
        createUser,
        createTime,
        isOnline,
        status,
        remark,
        visibility,
        dataLevel,
        type,
        testClusterId,
        testClusterName,
        uatClusterId,
        uatClusterName,
        prodClusterId,
        prodClusterName,
        domainId,
        domainCode,
        domainName,
        lcpAppId,
        lcpAppKey,
        lcpAppName,
        productPrincipal,
        developPrincipal,
        operationPrincipal,
        groupCode,
        interfaceName,
        testAlias,
        uatAlias,
        prodAlias,
        method,
        testToken,
        uatToken,
        prodToken,
        labelIdList,
      } = data;
      this.url = url;
      this.name = name;
      this.createUser = createUser;
      this.createTime = createTime;
      this.isOnline = isOnline;
      this.status = status;
      this.remark = remark;
      this.visibility = visibility;
      this.dataLevel = dataLevel;
      this.type = type;
      this.testCluster = { testClusterId, testClusterName };
      this.uatCluster = { uatClusterId, uatClusterName };
      this.prodCluster = { prodClusterId, prodClusterName };
      this.domain = { domainId, domainCode, domainName };
      this.lcpApp = { lcpAppId, lcpAppKey, lcpAppName };
      this.productPrincipal = productPrincipal || "";
      this.developPrincipal = developPrincipal || "";
      this.operationPrincipal = operationPrincipal || "";
      this.groupCode = groupCode;
      this.interfaceName = interfaceName;
      this.testAlias = testAlias;
      this.uatAlias = uatAlias;
      this.prodAlias = prodAlias;
      this.method = method;
      this.testToken = testToken;
      this.uatToken = uatToken;
      this.prodToken = prodToken;
      this.labelIdList = labelIdList || [];
      this.loading = false;
    },
    gotoUpdateApi() {
      this.sensitive.visible = false;
    },
  },
  created() {
    this.updateGetApi();
  },
};
</script>

<style lang="scss" scoped>
.http-detail {
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
