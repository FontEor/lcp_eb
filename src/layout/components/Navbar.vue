<template>
  <div class="navbar cf">
    <div class="logo">
      <!--      <a :href="homeUrl"><img src="../../assets/img/jdl_logo.png" alt="物流开放平台" class="navbar-logo"></a>-->
      <a
        class="navbar-logo"
        :href="homeUrl"
        :clstag="
          clstag('appManager_1618992717469|1', 'appManager_1618993242376|1')
        "
      ></a>
    </div>
    <div class="right-menu">
      <el-badge
        v-if="isIntranet"
        class="msg-icon"
        :value="msgCount"
        :clstag="
          clstag('appManager_1618992717469|2', 'appManager_1618993242376|2')
        "
      >
        <a href="javascript:void(0)" @click="goToMsg">
          <i class="el-icon-message"></i>
        </a>
      </el-badge>
      <div v-else class="work-order-icon">
        <el-badge :value="newMessageNumber">
          <i class="el-icon-document-empty" @click="goToWorkOrder"></i>
        </el-badge>
      </div>

      <template>
        <span
          href="javascript:void(0)"
          class="right-menu-item"
          style="border: 0px; font-size: 15px"
          >{{ name }}</span
        >
      </template>
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <img
            :src="headImg + '?imageView2/1/w/80/h/80'"
            class="user-avatar"
            :clstag="
              clstag('appManager_1618992717469|3', 'appManager_1618993242376|3')
            "
          />
          <i class="el-icon-caret-bottom"></i>
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <a href="javascript:void(0)" @click="changeTeam" v-if="isIntranet">
            <el-dropdown-item>{{
              $t("components.Navbar.5ix0v4ety6o1")
            }}</el-dropdown-item>
          </a>
          <a href="javascript:void(0)" @click="quitToHomePage">
            <el-dropdown-item>{{
              $t("components.Navbar.5ix0v4ety6o0")
            }}</el-dropdown-item>
          </a>
        </el-dropdown-menu>
      </el-dropdown>
    </div>


    <el-dialog
      title="选择团队"
      :visible="teamDialogVisible"
      width="460px"
      :before-close="handleClose"
      :close-on-click-modal="false"
      :append-to-body="true"
    >
      <div class="team-select">
        <el-select
          v-model="teamInfo"
          value-key="id"
          placeholder="团队名称"
          size="big"
          style="width:100%"
        >
          <el-option
            v-for="item in teamList"
            :key="item.id"
            :label="item.name"
            :value="item"
          ></el-option>
        </el-select>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button
          type="primary"
          @click="chooseSupplier"
          >确 定</el-button
        >
      </div>
    </el-dialog>

         



  </div>
</template>

<script>
import { mapGetters } from "vuex";
import request from "@/utils/request";
import pageClick from "@/utils/pageClick.js";
import isIntranet from "@/utils/isIntranet.js";
import lcp from "@/api/extranet/lcp/index";
import intranetLcp from "@/api/intranet/lcp/index.js";
import Cookies from "js-cookie";

export default {
  data() {
    return {
      homeUrl: `http://${window.location.host}/`,
      count: 0,
      newMessageNumber: null,
      isIntranet: isIntranet(),
      teamDialogVisible: false,
      teamInfo: undefined,
      teamList: []
    };
  },
  computed: {
    ...mapGetters([
      "sidebar",
      "headImg",
      "avatar",
      "device",
      "user_develop",
      "name",
      "msgCount",
    ]),
  },
  methods: {
    // 点击事件埋点
    clstag(intranetId, extranetId) {
      return pageClick(intranetId, extranetId);
    },
    thisLogout() {
      window.location.href = `${window.location.host}/#/home`;
      return;
    },
    async logout() {
      await this.$store.dispatch("user/logout");
      this.$router.push(`/login?redirect=${this.$route.fullPath}`);
    },
    toBeADevelop() {
      this.$router.push("/toBeDeveloperStep2");
    },
    quitToHomePage() {
      //清除所有的状态
      this.$store.dispatch("user/logout");
    },
    goToMsg() {
      this.$router.push("/messageReceive");
    },
    async newMessage() {
      return await lcp.workOrder.newMessage().catch((error) => {
        throw new Error("newMessage" + error);
      });
    },
    async fetchNewMessage() {
      const { data } = await this.newMessage().catch((error) => {
        throw new Error("fetchNewMessage" + error);
      });
      this.newMessageNumber = data === 0 ? null : data;
    },
    goToWorkOrder() {
      window.microPushStatus("/upgrade/");
    },

    async getTeamListInfo() { 
      try { 
        const res = await intranetLcp.user.getTeamListInfo(); 
        this.teamList = res.data; 
        const supplierId = Cookies.get('supplierId');
        this.teamInfo = this.teamList.find(team => team.id == supplierId);
      } 
      catch (error) { 
        console.log(error); 
      } 
    },

    changeTeam(){
      this.teamDialogVisible = true;
      this.getTeamListInfo();
    },

    handleClose() {
      this.teamDialogVisible = false;
    },

    chooseSupplier() {
      Cookies.set("supplierId", this.teamInfo.id);
      Cookies.set("groupCode", this.teamInfo.code);
      this.$message({
            type: "success",
            message: "切换团队成功!",
          });
      
      this.teamDialogVisible = false;
      this.$router.go(0)
    },
    
  },
  watch: {
    "$route.fullPath": {
      handler() {
        this.fetchNewMessage();
      },
    },
  },
  created() {
    let url = "/message/getMessageSignCount";
    request({
      url: url,
      method: "get",
    })
      .then((rsp) => {
        if (rsp.code === 20000) {
          this.$store.dispatch("user/setMsgCount", rsp.data);
        }
      })
      .catch((e) => {
        console.log(e);
      });
    this.fetchNewMessage();
  },
};
</script>

<style lang="scss" scoped>
.logo {
  height: 100%;
  padding-right: 50px;

  .navbar-logo {
    display: block;
    padding: 21px 0;
    width: 333px;
    background: url("~@/assets/img/header/header-logo.png") top 0px center
      no-repeat;
    background-size: 333px 30px;
  }
}

.navbar {
  height: 60px;
  padding: 0 10px 0 20px;
  position: relative;

  .logo {
    float: left;
    width: 320px;
    height: 27px;
    margin-top: 16px;
    margin-right: 20px;

    img {
      width: 100%;
      height: 100%;
      display: block;
    }
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    cursor: pointer;
    float: right;
    height: 100%;
    line-height: 60px;
    padding-right: 10px;
    &:focus {
      outline: none;
    }
    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #fff;
      vertical-align: text-bottom;
    }
    ::v-deep .el-badge {
      margin: 3px 10px 0;
      vertical-align: top;
      .el-icon-message {
        padding: 0 12px;
        font-size: 22px;
        color: #fff;
      }
      .el-badge__content {
        border: none;
        &.is-fixed {
          top: 16px;
          right: 20px;
        }
      }
    }
    .work-order-icon {
      display: inline;
      .el-icon-document-empty {
        font-size: 22px;
      }
      ::v-deep .el-badge {
        margin: 3px 10px 0;
        vertical-align: top;
        .el-badge__content {
          border: none;
          &.is-fixed {
            top: 16px;
            right: 10px;
          }
        }
      }
    }
    .avatar-container {
      vertical-align: top;
      height: 100%;
      .avatar-wrapper {
        position: relative;

        .user-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          vertical-align: middle;
        }

        .el-icon-caret-bottom {
          font-size: 12px;
          margin-left: 8px;
          color: #fff;
        }
      }
    }
  }
}
.team-select{
  padding: 20px 0;
}
</style>
