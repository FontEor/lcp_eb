<template>
  <el-container v-if="supplierId !== -1">
    <el-header style="height: 80px" class="header-info">
      <div class="header-wrapper">
        <div class="text-wrapper">
          <div class="title-wrapper">
            <p class="title">编辑商家</p>
          </div>
        </div>
      </div>
    </el-header>
    <!-- 内容区 -->
    <el-main class="container">
      <!-- 步骤条 -->
      <Steps :active="active" :titleList="titleList" />
      <div class="form-content">
        <!-- 步骤一 填写基本信息 -->
        <div class="basic-form" v-show="active === 0">
          <p class="step-title">为了更好地服务商家，请认真填写以下信息</p>
          <el-form
            :model="basicInfoForm"
            :rules="basicInfoRules"
            ref="basicInfoForm"
            label-width="140px"
          >
            <el-form-item label="商家编码" prop="code">
              <el-input
                disabled
                v-model="basicInfoForm.code"
                placeholder="请输入EDI中要使用的商家编码"
              ></el-input>
            </el-form-item>
            <el-form-item label="商家名称" prop="name">
              <el-input
                v-model.trim="basicInfoForm.name"
                placeholder="请输入EDI中要使用的商家名称"
              ></el-input>
            </el-form-item>
          </el-form>
          <div style="text-align: center">
            <el-button @click="validateNextStep('basicInfoForm')" type="primary"
              >下一步</el-button
            >
          </div>
        </div>
        <!-- 步骤二 填写特殊配置 -->
        <div class="special-configuration-form" v-show="active === 1">
          <p class="special-configuration-title">
            为了给商家提供稳定可靠的服务，请务必完善以下信息
          </p>
          <el-form
            :model="specialConfigurationForm"
            :rules="specialConfigurationRules"
            ref="specialConfigurationForm"
            label-width="140px"
          >
            <p class="special-configuration-content">
              1. 【商家系统】特殊配置：是否配置了京东物流网关域名host？
            </p>
            <el-form-item prop="isHostDomainName">
              <el-radio
                v-model="specialConfigurationForm.isHostDomainName"
                :label="true"
                >是</el-radio
              >
              <el-radio
                v-model="specialConfigurationForm.isHostDomainName"
                :label="false"
                >否</el-radio
              >
            </el-form-item>
            <div v-if="specialConfigurationForm.isHostDomainName === true">
              <el-form-item label="域名：" prop="hostDomainName">
                <el-input
                  v-model.trim="specialConfigurationForm.hostDomainName"
                  placeholder="示例：api.jdwl.jd.local"
                ></el-input>
              </el-form-item>
              <el-form-item label="IP：" prop="hostIp">
                <el-input
                  v-model.trim="specialConfigurationForm.hostIp"
                  placeholder="示例：10.126.211.234 , 11.70.215.191, 11.60.217.127"
                ></el-input>
              </el-form-item>
              <el-form-item label="备注：" prop="hostRemark">
                <el-input
                  v-model.trim="specialConfigurationForm.hostRemark"
                  placeholder="示例：库房是4层协议不支持域名访问，直接使用网关的实例ip"
                ></el-input>
              </el-form-item>
            </div>

            <p class="special-configuration-content">
              2. 【商家系统】特殊配置：是否配置了京东物流网关域名VIP白名单？
            </p>
            <el-form-item prop="isVipWhitelist">
              <el-radio
                v-model="specialConfigurationForm.isVipWhitelist"
                :label="true"
                >是</el-radio
              >
              <el-radio
                v-model="specialConfigurationForm.isVipWhitelist"
                :label="false"
                >否</el-radio
              >
            </el-form-item>
            <div v-if="specialConfigurationForm.isVipWhitelist === true">
              <el-form-item label="域名：" prop="vipWhitelist">
                <el-input
                  v-model.trim="specialConfigurationForm.vipWhitelist"
                  placeholder="示例：api.jdwl.jd.local"
                ></el-input>
              </el-form-item>
              <el-form-item label="IP：" prop="vipIp">
                <el-input
                  v-model.trim="specialConfigurationForm.vipIp"
                  placeholder="示例：10.126.211.234 , 11.70.215.191, 11.60.217.127"
                ></el-input>
              </el-form-item>
            </div>
            <p class="special-configuration-content">
              3. 【商家系统】特殊配置： 是否绑定了京东物流网关域名SSL证书？
            </p>
            <el-form-item prop="isDomainNameCertificate">
              <el-radio
                v-model="specialConfigurationForm.isDomainNameCertificate"
                :label="true"
                >是</el-radio
              >
              <el-radio
                v-model="specialConfigurationForm.isDomainNameCertificate"
                :label="false"
                >否</el-radio
              >
            </el-form-item>
            <p class="special-configuration-content">
              4. 【京东物流网关】特殊配置：是否配置了商家IP白名单？
            </p>
            <el-form-item prop="isIpWhitelist">
              <el-radio
                v-model="specialConfigurationForm.isIpWhitelist"
                :label="true"
                >是</el-radio
              >
              <el-radio
                v-model="specialConfigurationForm.isIpWhitelist"
                :label="false"
                >否</el-radio
              >
            </el-form-item>
          </el-form>
          <div style="text-align: center">
            <el-button @click="previousStep">上一步</el-button>
            <el-button @click="updateMerchant" type="primary">下一步</el-button>
          </div>
        </div>
        <!-- 步骤三 完成 -->
        <div class="finish-wrapper" v-show="active === 2">
          <i class="el-icon-success" />
          <p class="finish-title">
            商家信息编辑完成，商家编码：{{ code }}，商家名称：{{ name }}
          </p>
        </div>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import Steps from "@/components/Steps.vue";
import ediManager from "@/api/intranet/ediManager/index.js";
import Cookies from "js-cookie";

export default {
  name: "EditMerchant",
  components: { Steps },
  data() {
    return {
      titleList: ["填写基本信息", "填写特殊配置", "完成"],
      active: 0,
      basicInfoForm: {
        code: "",
        name: "",
      },
      basicInfoRules: {
        name: [{ required: true, message: "商家名称不能为空" }],
        code: [{ required: true, message: "商家编码不能为空" }],
      },
      specialConfigurationForm: {},
      specialConfigurationRules: {},
      code: "",
      name: "",
      supplierId: -1,
    };
  },
  methods: {
    validateNextStep(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.active < 3) {
            this.active++;
          }
        } else {
          return false;
        }
      });
    },
    previousStep() {
      if (this.active > 0) {
        this.active--;
      }
    },
    async updateMerchant() {
      const data = Object.assign(
        this.basicInfoForm,
        this.specialConfigurationForm
      );
      const response = await ediManager.updateMerchant(data);
      if (response) {
        this.code = response.data.code;
        this.name = response.data.name;
        if (this.active < 3) {
          this.active++;
        }
      }
    },

    async echoMerchant() {
      const code = this.$route.query.partnerId;
      const response = await ediManager.echoMerchant(code);
      if (response) {
        const {
          code,
          name,
          isVipWhitelist,
          hostDomainName,
          isIpWhitelist,
          isDomainNameCertificate,
          hostIp,
          hostRemark,
          vipWhitelist,
          vipIp,
          isHostDomainName,
        } = response.data;
        this.basicInfoForm = { code, name };
        this.specialConfigurationForm = {
          isHostDomainName,
          hostDomainName,
          hostIp,
          hostRemark,
          isVipWhitelist,
          vipWhitelist,
          vipIp,
          isDomainNameCertificate,
          isIpWhitelist,
        };
      }
    },
  },
  mounted() {
    this.supplierId = Number(Cookies.get("supplierId"));
    this.echoMerchant();
  },
};
</script>

<style lang="scss" scoped>
.header-info {
  margin-bottom: 8px;
  padding: 10px 16px;
  background: #fff;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .header-wrapper {
    height: 60px;
    padding-left: 12px;
    border-radius: 4px;
    border-left: 4px solid #3c6ef0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .text-wrapper {
      .title-wrapper {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        .title {
          color: #333;
          font-size: 18px;
          font-weight: 600;
        }
      }
    }
  }
}
.container {
  background: #ffffff;
  min-height: calc(100vh - 190px);
  .form-content {
    .basic-form {
      margin: 0 auto;
      width: 440px;
      .step-title {
        text-align: center;
        margin: 30px;
      }
    }
    .special-configuration-form {
      margin: 0 auto;
      width: 480px;
      .special-configuration-title {
        text-align: center;
        margin-top: 30px;
        font-size: 16px;
        color: red;
      }
      .special-configuration-desc {
        text-align: center;
        margin: 10px 0 30px;
        color: red;
      }
      .special-configuration-content {
        margin: 20px;
      }
    }
    .finish-wrapper {
      text-align: center;
      margin: 0 auto;
      width: 1020px;
      .el-icon-success {
        font-size: 60px;
        color: #26a872;
        margin: 30px 0 20px;
      }
      .finish-title {
        font-size: 18px;
        margin: 18px;
      }
    }
  }
}
</style>