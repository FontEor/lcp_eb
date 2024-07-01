<template>
  <div class="detail-page">
    <HeaderInfo
      :url="headerInfo.url"
      :name="headerInfo.name"
      :createUser="headerInfo.createUser"
      :createTime="headerInfo.createTime"
      :statusInfo="headerInfoStatus"
    >
      <template v-slot:otherImage><span class="header-image"></span></template>
      <el-button
        type="primary"
        :disabled="headerInfoStatus.disabled"
        @click="handlePublish"
        >发 布</el-button
      >
    </HeaderInfo>
    <el-tabs v-model="activeRouteName" type="card" @tab-click="handleClickTab">
      <el-tab-pane
        label="基础数据"
        name="messageManagerBasicInfo"
      ></el-tab-pane>
      <el-tab-pane
        label="消息文档"
        name="messageManagerMessageDoc"
      ></el-tab-pane>
      <el-tab-pane label="订阅方" name="messageManagerSubscriber"></el-tab-pane>
      <el-tab-pane
        label="发布记录"
        name="messageManagerPublishRecords"
      ></el-tab-pane>
    </el-tabs>
    <div class="detail-content">
      <router-view
        :status="status"
        @updateBasicInfo="updateBasicInfo"
        @reloadBasicInfo="queryMessageBaseInfo"
      ></router-view>
    </div>
  </div>
</template>
<script>
import HeaderInfo from "@/views/intranet/apiManager/apiList/detail/components/HeaderInfo.vue";
import gateway from "@/api/intranet/gateway/index.js";
export default {
  data() {
    return {
      headerInfo: {},
      activeRouteName: "messageManagerBasicInfo",
      status: -1
    };
  },
  watch: {
    $route: {
      handler(newRoute) {
        if (newRoute) {
          this.activeRouteName = newRoute.name;
        }
      },
      immediate: true
    }
  },
  computed: {
    headerInfoStatus() {
      // 初始化：0; 编辑中：1; 审批中：2; 已发布：3; 已下线：4;
      const status = this.status;
      switch (+status) {
        case 0:
          return {
            text: "初始化",
            className: "status_init",
            disabled: false,
            status
          };
        case 1:
          return {
            text: "编辑中",
            className: "status_edit",
            disabled: false,
            status
          };
        case 2:
          return {
            text: "审批中",
            className: "status_approve",
            disabled: true,
            status
          };
        case 3:
          return {
            text: "已发布",
            className: "status_released",
            disabled: true,
            status
          };
        case 4:
          return {
            text: "已下线",
            className: "status_offline",
            disabled: false,
            status
          };
        default:
          return {};
      }
    }
  },
  mounted() {
    if (this.activeRouteName !== "messageManagerBasicInfo") {
      this.queryMessageBaseInfo();
    }
  },
  methods: {
    async queryMessageBaseInfo() {
      // 获取基础数据
      const param = [{ topic: this.$route.params.topic }];
      const response = await gateway.messageAccessService.queryMessageBaseInfo(
        param
      );
      const { data, code } = response || {};
      if (+code === 20000) {
        this.updateBasicInfo(data);
      }
    },
    updateBasicInfo(data) {
      const { topic, status, createUser, createTime, cnName, dailyCall,tps} = data || {};
      this.headerInfo = {
        url: topic,
        name: cnName,
        createUser: createUser,
        createTime: createTime,
        tps,
        dailyCall,
      };
      this.status = status;
    },
    handleClickTab() {
      const params = this.$route.params;
      this.$router.push({
        name: this.activeRouteName,
        params
      });
    },
    async handlePublish() {
      const param = [this.$route.params.topic];
      const response = await gateway.messageAccessService
        .checkMessageBeforePublish(param)
        .catch(err => console.log("err", err));
      const { code } = response || {};
      if (+code === 20000) {
        const {url, dailyCall = null, tps = null} = this.headerInfo;
        const query = {};
        (dailyCall || dailyCall === 0) && (query.dailyCall = dailyCall);
        (tps || tps === 0) && (query.tps = tps);
        this.$router.push({
          name: "messageManagerPublish",
          params: { topic:url},
          query,
        });
      }
    }
  },
  components: {
    HeaderInfo
  },
  name: "messageManagerDetail"
};
</script>
<style lang="scss" scoped>
.detail-page {
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
  }
  .detail-content {
    padding: 16px;
    background: #fff;
    min-height: calc(100vh - 250px);
    // 底部粘性按钮生效条件
    position: static;
    overflow: visible;
  }
  .header-image {
    display: inline-block;
    width: 4px;
    height: 48px;
    background: rgba(60, 110, 240, 1);
    border-radius: 2px;
    margin-right: 8px;
  }
}
</style>
