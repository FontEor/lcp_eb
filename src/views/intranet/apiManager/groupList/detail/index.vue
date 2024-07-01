<template>
  <div class="group-detail" v-loading.lock="loading">
    <Header
      :cnName="cnName"
      :code="code"
      :createUser="createUser"
      :createTime="createTime"
      :showStatus="computeShowStatus"
    >
      <el-button
        type="primary"
        :disabled="computePublishDisabled"
        @click="publishApiGroup"
        >发布</el-button
      ></Header
    >
    <!-- 标签页 -->
    <el-tabs v-if="!loading" v-model="activeName" type="card">
      <el-tab-pane v-if="activeName === 'first'" label="基础数据" name="first">
        <BasicData
          :baseInfo="baseInfo"
          :showStatus="computeShowStatus"
          :editDisabled="computeEditDisabled"
          @refresh="refresh"
        ></BasicData>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Header from "./header.vue";
import BasicData from "./basicData/index.vue";
import gwApiRequest from "@/utils/gwApiRequest";
export default {
  components: { Header, BasicData },
  data() {
    return {
      loading: true,
      code: "code",
      cnName: "cnName",
      createUser: "createUser",
      createTime: new Date(),
      isOnline: 0,
      status: 0,

      baseInfo: {
        id: 0,
        code: "",
        cnName: "",
        intr: "",
        type: 1,
        serviceType: 1,
        testCluster: {
          id: 0,
          name: "",
        },
        uatCluster: {
          id: 0,
          name: "",
        },
        prodCluster: {
          id: 0,
          name: "",
        },
        productOwner: "",
        developOwner: "",
        operateOwner: "",
      },
      //控制页签的
      activeName: "first",
    };
  },
  computed: {
    // 用于展示状态 1:"初始化",2:"已发布",3:"更新中"
    computeShowStatus() {
      if (this.status === 4) {
        return 2;
      }
      if (this.status === 1 || this.status === 3) {
        if (this.isOnline === 0) {
          return 1;
        }
        if (this.isOnline === 1) {
          return 3;
        }
      }
    },
    //发布按钮是否置灰
    computePublishDisabled() {
      if (this.status === 3 || this.status === 4) {
        return true;
      } else {
        return false;
      }
    },
    computeEditDisabled() {
      if (this.status === 3) {
        return true;
      } else {
        return false;
      }
    },
  },
  methods: {
    getApiGroupDetail() {
      let url = "/CloudDomainService/info";
      let params=[{
        id: this.$route.params.id,
      }];
      gwApiRequest.post(url,params)
        .then((rsp) => {
          this.code = rsp.data.code;
          this.cnName = rsp.data.name;
          this.createUser = rsp.data.createUser;
          this.createTime = rsp.data.createTime;
          this.status = rsp.data.status;
          this.isOnline = rsp.data.isOnline;
          this.fillBaseInfo(rsp.data);

          this.loading = false;
        })
        .catch((e) => {
          console.log(e);
          this.loading = false;
        });
    },
    fillBaseInfo(data) {
      this.baseInfo.id = data.id;
      this.baseInfo.code = data.code;
      this.baseInfo.cnName = data.name;
      this.baseInfo.intr = data.description;
      this.baseInfo.isOnline = data.isOnline;
      this.baseInfo.serviceType = data.serviceType;
      this.baseInfo.type = data.type;
      this.baseInfo.productOwner = data.productOwner;
      this.baseInfo.developOwner = data.developOwner;
      this.baseInfo.operateOwner = data.operateOwner;
      this.baseInfo.testCluster.id = data.testClusterId;
      this.baseInfo.testCluster.name = data.testClusterName;
      this.baseInfo.uatCluster.id = data.uatClusterId;
      this.baseInfo.uatCluster.name = data.uatClusterName;
      this.baseInfo.prodCluster.id = data.prodClusterId;
      this.baseInfo.prodCluster.name = data.prodClusterName;
    },

    //刷新当前页基本信息的数据
    refresh() {
      this.getApiGroupDetail();
    },
    //验证数据是否齐全，是否允许发布
    verify() {
      let url = "/CloudDomainService/prePublish";
     let  params=[{
        id: this.$route.params.id,
      }];
      gwApiRequest.post(url,params)
        .then((rsp) => {
          if (rsp.code === 20000) {
            this.goPublishApiGroup();
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },
    publishApiGroup() {
      this.verify();
    },
    goPublishApiGroup() {
      this.$router.push({
        name: "ApiManagerApiGroupDetailPublish",
        params: { id: this.$route.params.id },
      });
    },
  },
  mounted() {
    this.refresh();
  },
};
</script>

<style lang="scss" scoped>
.group-detail {
  .el-tabs {
    ::v-deep .el-tabs__header {
      background: #f5f5f5;
      border-bottom: none;
      margin: 0;
      position: -webkit-sticky;
      position: sticky;
      top: 60px;
      z-index: 1;
      margin-left: 20px;
      .el-tabs__nav {
        border-bottom: none;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
      }

      .el-tabs__item {
        border: none;
      }
    }
    ::v-deep .el-tabs__content {
      margin-left: 20px;
      margin-right: 20px;
      padding: 16px;
      background: #fff;
      min-height: calc(100vh - 250px);
      // 底部粘性按钮生效条件
      position: static;
      overflow: visible;
      .el-radio-group.second-tabs {
        display: flex;
        justify-content: center;
        .el-radio-button {
          font-weight: normal;
          &.is-active > .el-radio-button__inner {
            color: #3c6ef0;
            background: #fff;
          }
        }
      }
    }
  }
}
</style>
