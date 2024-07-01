<template>
  <div class="security-config">
    <div class="background">
      <el-row class="top">
        <el-col :span="24">
          <div class="broadcast">
            <img class="img" src="@/assets/img/volume.png">
            <span style="margin-left: 10px">物流开放平台为API提供了一系列的安全配置，可根据API的使用场景、数据级别进行了不同的安全配置。</span>
          </div>
        </el-col>
      </el-row>
    </div>
    <SignAuthentication v-bind:algorithm-list="algorithmList"
                        :edite-disabled="editeDisabled"
                        @refresh="refresh">
    </SignAuthentication>
    <LoginAuthentication v-bind:login-auth-array="loginAuthArray"
                         @refresh="refresh"
                         :edite-disabled="editeDisabled">
    </LoginAuthentication>

  </div>
</template>

<script>
import gwApiRequest from "@/utils/gwApiRequest";
import SignAuthentication from "@/views/intranet/apiManager/groupList/detail/basicData/signAuthentication";
import LoginAuthentication from "@/views/intranet/apiManager/groupList/detail/basicData/loginAuthentication";

export default {
  components: {LoginAuthentication, SignAuthentication},
  props: {
    editeDisabled: Boolean,
  },
  data() {
    return {
      //签名插件数据
      algorithmList: null,
      //登录态插件数据
      loginAuthArray: null,
    }
  },
  created() {
    this.getSecuityConfig();
  },
  methods: {
    //获取插件模板数据
    async getSecuityConfig() {
      let url = "/CloudPluginManagerService/queryCloudPluginByCloudDomainId";
      let params =[ {
        domainId: this.$route.params.id,
      }]

      gwApiRequest.post(url, params).then((rsp) => {
        this.algorithmList = rsp.data["1"];
        this.loginAuthArray = rsp.data["2"];
      })
          .catch((e) => {
            console.log(e);
          });
    },
    refresh() {
      console.log("security Config  ******************....")
      this.$emit("refresh");
      this.getSecuityConfig();
    }
  },
};
</script>

<style lang="scss" scoped>
.security-config {
  .background {
    background-color: #fafafa;

    .top {
      margin-top: 20px;

      .broadcast {
        margin-top: 5px;
        margin-bottom: 5px;
        margin-left: 20px;

        .img {
          width: 20px;
          height: 20px;
        }
      }

      .com-view-dep {
        margin: 0px;
        padding: 12px 20px;
        background: #fafafa;
        border-radius: 4px;

        .tit-wrap1 {
          padding: 0 12px;
          position: relative;
          background: #fafafa;

          &::before {
            content: "";
            display: block;
            width: 3px;
            height: 50%;
            background: #3c6ef0;
            position: absolute;
            top: 6px;
            left: 0;
          }

          .tit1 {
            font-size: 16px;
            line-height: 24px;
            font-weight: 600;
            display: inline-block;
            max-width: 80%;
            word-break: break-all;
          }

          .tit2 {
            color: #333333;
            font-size: 14px;
            line-height: 24px;
            font-weight: 600;
            display: inline-block;
            max-width: 80%;
            word-break: break-all;
          }
        }

        .describe {
          color: #b5b5b5;
          margin-top: 10px;
        }
      }
    }

    .status {
      border: 1px solid;
      color: rgb(60, 110, 240);
      border-radius: 4px;
      font-size: 14px;
      padding: 2px;
    }
  }

  .menuHeader {
    display: flex;
    align-items: center;

    .menuTitle {
      padding: 0 12px;
      font-size: 16px;
      font-weight: 600;
      position: relative;

      &::before {
        content: "";
        display: block;
        width: 3px;
        height: 50%;
        background: #3c6ef0;
        position: absolute;
        top: 5px;
        left: 0;
      }
    }
  }
}
</style>

