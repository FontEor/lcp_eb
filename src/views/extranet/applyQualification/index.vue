<template>
  <div v-if="showQualification" class="apply-qualification app-container">
    <Alert>
      <template #title>
        <div class="tip">
          资质申请长时间未通过或被驳回，您可通过<el-button
            type="text"
            @click="onClickSubmitWorkOrderButton"
            >提交工单</el-button
          >的方式与平台联系。
        </div>
      </template>
    </Alert>
    <div class="qualification-wrapper">
      <!-- ISV -->
      <div class="qualification-box">
        <div class="qualification-status" :class="isvStatusClass">
          {{ isvStatus }}
        </div>
        <div class="qualification-title">
          ISV({{ $t("applyQualification.index.5ix6x2162ns1") }})
        </div>
        <div class="qualification-content">
          <ul>
            <li>
              {{ $t("applyQualification.index.5ix6x2160h80") }}
            </li>
            <li>
             <p>{{ $t("applyQualification.index.5ix6x2161340") }}</p>
              {{ $t("applyQualification.index.5ix6x2161341") }}
            </li>
          </ul>
        </div>
        <div class="qualification-footer">
          <div
            v-if="
              isvStatus === $t('applyQualification.index.5ix6x21617w0') ||
              isvStatus === $t('applyQualification.index.5ix6x2161bk0')
            "
          >
            <el-button type="primary" @click="gotoBaseInfo">{{
              $t("applyQualification.index.5ix6x2161ew0")
            }}</el-button>
          </div>
          <div
            v-if="
              isvStatus === $t('applyQualification.index.5ix6x2161ig0') ||
              isvStatus === $t('applyQualification.index.5ix6x2161lo0')
            "
          >
            <el-button
              v-if="userRole === 1"
              type="primary"
              @click="gotoCertification('isv')"
              >{{ $t("applyQualification.index.5ix6x2161ow0") }}</el-button
            >
            <el-tooltip
              class="item"
              effect="dark"
              :content="this.isvTooltipText"
              placement="bottom"
            >
              <el-button type="info" v-if="userRole === 0">{{
                $t("applyQualification.index.5ix6x2161ow0")
              }}</el-button>
            </el-tooltip>
          </div>
        </div>
      </div>
      <!-- 自研商家 -->
      <div class="qualification-box">
        <div class="qualification-status" :class="businessStatusClass">
          {{ businessStatus }}
        </div>
        <div class="qualification-title">
          {{ $t("applyQualification.index.5ix6x2161s80") }}
        </div>
        <div class="qualification-content">
          <ul>
            <li>
              {{ $t("applyQualification.index.5ix6x2161vc0") }}
            </li>
            <li>
              <p>{{ $t("applyQualification.index.5ix6x2161yo0") }}</p>
              {{ $t("applyQualification.index.5ix6x2161yo1") }}
            </li>
          </ul>
        </div>
        <div class="qualification-footer">
          <div
            v-if="
              businessStatus === $t('applyQualification.index.5ix6x21617w0') ||
              businessStatus === $t('applyQualification.index.5ix6x2161bk0')
            "
          >
            <el-button type="primary" @click="gotoBaseInfo">{{
              $t("applyQualification.index.5ix6x2161ew0")
            }}</el-button>
          </div>
          <div
            v-if="
              businessStatus === $t('applyQualification.index.5ix6x2161ig0') ||
              businessStatus === $t('applyQualification.index.5ix6x2161lo0')
            "
          >
            <el-button
              v-if="userRole === 1"
              type="primary"
              @click="gotoCertification('business')"
              >{{ $t("applyQualification.index.5ix6x2161ow0") }}</el-button
            >
            <el-tooltip
              class="item"
              effect="dark"
              :content="this.businessTooltipText"
              placement="bottom"
            >
              <el-button v-if="userRole === 0" type="info">{{
                $t("applyQualification.index.5ix6x2161ow0")
              }}</el-button>
            </el-tooltip>
          </div>
        </div>
      </div>
      <!-- 合作伙伴 -->
      <div class="qualification-box">
        <div class="qualification-status" :class="partnerStatusClass">
          {{ partnerStatus }}
        </div>
        <div class="qualification-title">
          {{ $t("applyQualification.index.5ix6x2162200") }}
        </div>
        <div class="qualification-content">
          <ul>
            <li>
              <p>{{ $t("applyQualification.index.5ix6x2162580") }}</p>
              <p>{{ $t("applyQualification.index.5ix6x216258a") }}</p>
              <p>{{ $t("applyQualification.index.5ix6x216258b") }}</p>
              <p>{{ $t("applyQualification.index.5ix6x216258c") }}</p>
              <p>{{ $t("applyQualification.index.5ix6x216258d") }}</p>
            </li>
            <li>
              <p>{{ $t("applyQualification.index.5ix6x2162581") }}</p>
            </li>
          </ul>
        </div>
        <div class="qualification-footer">
          <div
            v-if="
              partnerStatus === $t('applyQualification.index.5ix6x21617w0') ||
              partnerStatus === $t('applyQualification.index.5ix6x2161bk0')
            "
          >
            <el-button type="primary" @click="gotoBaseInfo">{{
              $t("applyQualification.index.5ix6x2161ew0")
            }}</el-button>
          </div>
          <div
            v-if="
              partnerStatus === $t('applyQualification.index.5ix6x2161ig0') ||
              partnerStatus === $t('applyQualification.index.5ix6x2161lo0')
            "
          >
            <el-button
              v-if="userRole === 1"
              type="primary"
              @click="gotoCertification('partner')"
              >{{ $t("applyQualification.index.5ix6x2161ow0") }}</el-button
            >
            <el-tooltip
              class="item"
              effect="dark"
              :content="this.partnerTooltipText"
              placement="bottom"
            >
              <el-button v-if="userRole === 0" type="info">{{
                $t("applyQualification.index.5ix6x2161ow0")
              }}</el-button>
            </el-tooltip>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Alert from "@/components/Alert.vue";
import apiExtranet from "@/api/extranet/index.js";

export default {
  name: "ApplyQualification",
  components: { Alert },
  data() {
    return {
      certificationStatus: [],
      isvStatus: "",
      businessStatus: "",
      partnerStatus: "",
      isvStatusClass: "",
      businessStatusClass: "",
      partnerStatusClass: "",
      userRole: 0,
      isvTooltipText: "",
      businessTooltipText: "",
      partnerTooltipText: "",
      showQualification: false,
    };
  },
  methods: {
    async qualificationStatus() {
      const statusText = [
        this.$t("applyQualification.index.5ix6x2161lo0"),
        this.$t("applyQualification.index.5ix6x21617w0"),
        this.$t("applyQualification.index.5ix6x2161ig0"),
        this.$t("applyQualification.index.5ix6x2161bk0"),
      ];
      const statusColor = [
        "initBtnColor",
        "updateBtnColor",
        "unknownBtnColor",
        "normalBtnColor",
      ];
      await apiExtranet.applyQualification
        .getQualificationStatus()
        .then((res) => {
          this.certificationStatus = res.data;
          this.certificationStatus.forEach((item) => {
            //type值不为纯数字，所以使用'=='
            if (item.type == 1) {
              this.isvStatus = statusText[item.status];
              this.isvStatusClass = statusColor[item.status];
              if (
                this.isvStatus ===
                this.$t("applyQualification.index.5ix6x2161ig0")
              ) {
                this.isvTooltipText = this.$t(
                  "applyQualification.index.5ix6x2162880"
                );
              } else if (
                this.isvStatus ===
                this.$t("applyQualification.index.5ix6x2161lo0")
              ) {
                this.isvTooltipText = this.$t(
                  "applyQualification.index.5ix6x2162bc0"
                );
              }
            } else if (item.type == 2) {
              this.businessStatus = statusText[item.status];
              this.businessStatusClass = statusColor[item.status];
              if (
                this.businessStatus ===
                this.$t("applyQualification.index.5ix6x2161ig0")
              ) {
                this.businessTooltipText = this.$t(
                  "applyQualification.index.5ix6x2162eo0"
                );
              } else if (
                this.businessStatus ===
                this.$t("applyQualification.index.5ix6x2161lo0")
              ) {
                this.businessTooltipText = this.$t(
                  "applyQualification.index.5ix6x2162hs0"
                );
              }
            } else if (item.type == 4) {
              this.partnerStatus = statusText[item.status];
              this.partnerStatusClass = statusColor[item.status];
              if (
                this.partnerStatus ===
                this.$t("applyQualification.index.5ix6x2161ig0")
              ) {
                this.partnerTooltipText = this.$t(
                  "applyQualification.index.5ix6x2162kw0"
                );
              } else if (
                this.partnerStatus ===
                this.$t("applyQualification.index.5ix6x2161lo0")
              ) {
                this.partnerTooltipText = this.$t(
                  "applyQualification.index.5ix6x2162ns0"
                );
              }
            }
          });
        })
        .catch((error) => {
          console.log(error);
        });
    },
    gotoBaseInfo() {
      this.$router.push({ path: "/userBaseInfo" });
    },
    async getUserRole() {
      await apiExtranet.applyQualification
        .getUserRole()
        .then((res) => {
          //1则为主账号，0则为子账号
          this.userRole = res.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    gotoCertification(type) {
      if (type === "isv") {
        this.$router.push({
          path: "/qualificationManagement/applyIsvQualification",
        });
      } else if (type === "business") {
        this.$router.push({
          path: "/qualificationManagement/applySupplierQualification",
        });
      } else if (type === "partner") {
        this.$router.push({
          path: "/qualificationManagement/applyPartnerQualification",
        });
      }
    },
    onClickSubmitWorkOrderButton() {
      const path = "/upgrade/work-order";
      this.$router.push({ path });
    },
  },
  async mounted() {
    const response = await apiExtranet.applyQualification.haveBaseInfoFlag();
    const { haveBaseInfoFlag } = response.data;
    const { data } = await apiExtranet.applyQualification.getUserRole();
    if (!haveBaseInfoFlag && data === 1) {
      //无基本信息且是主账号，跳转基本信息页面
      this.$router.push({
        path: "/qualificationManagement/applyBasicInfo",
      });
    } else {
      //进入资质认证页面
      this.showQualification = true;
      await this.getUserRole();
      await this.qualificationStatus();
    }
  },
};
</script>

<style lang="scss" scoped>
.apply-qualification {
  .qualification-wrapper {
    margin-top: 16px;
    height: 60vh;
    display: flex;
    justify-content: center;
    align-items: center;

    .qualification-box {
      position: relative;
      height: 340px;
      width: 353px;
      margin-right: 40px;
      border: 1px solid #eee;
      background-color: #f8fcff;
      border-radius: 25px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
      .qualification-status {
        width: 80px;
        height: 30px;
        border-radius: 23px 0px;
        font-size: 14px;
        text-align: center;
        line-height: 28px;
        border-left: 0px;
      }
      .qualification-title {
        font-weight: 700;
        font-style: normal;
        font-size: 20px;
        text-align: center;
        margin-top: 6px;
      }
      .qualification-content {
        font-size: 16px;
        font-weight: 400;
        line-height: 24px;
        ul,
        ol,
        li {
          list-style-type: disc;
          margin: 20px;
        }
      }
      .qualification-footer {
        position: absolute;
        left: 50%;
        bottom: 10px;
        transform: translateX(-50%);
        width: 353px;
        height: 40px;
        text-align: center;
      }
    }
  }
}
</style>
