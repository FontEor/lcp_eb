<template>
  <el-container v-if="supplierId !== -1">
    <el-header style="height: 80px" class="header-info">
      <div class="header-wrapper">
        <div class="text-wrapper">
          <div class="title-wrapper">
            <p class="title">新增商家</p>
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
                v-model.trim="basicInfoForm.code"
                placeholder="请输入EDI中要使用的商家编码"
              ></el-input>
            </el-form-item>
            <el-form-item label="商家名称" prop="name">
              <el-input
                v-model.trim="basicInfoForm.name"
                placeholder="请输入EDI中要使用的商家名称"
              ></el-input>
            </el-form-item>
            <el-form-item label="业务编码" prop="businessCodeType">
              <el-radio-group
                v-model="basicInfoForm.businessCodeType"
                @change="changeBusinessCodeType"
              >
                <el-radio :label="1">青龙业主号</el-radio>
                <el-radio :label="2">事业部编码</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item prop="businessCode">
              <el-input
                v-model.trim="basicInfoForm.businessCode"
                placeholder="请输入商家业务编码"
              ></el-input>
            </el-form-item>
            <el-form-item label="对接业务" prop="businessDescription">
              <el-input
                v-model.trim="basicInfoForm.businessDescription"
                type="textarea"
                placeholder="请输入对接业务介绍，10-200个字符"
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
          <p class="special-configuration-desc">
            您可在当前页面填写，或稍后在【EDI-商家管理】编辑
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
            <el-button @click="createMerchant">暂时跳过</el-button>
            <el-button @click="createMerchant" type="primary">下一步</el-button>
          </div>
        </div>
        <!-- 步骤三 完成 -->
        <div class="finish-wrapper" v-show="active === 2">
          <i class="el-icon-success" />
          <p class="finish-title">
            商家创建完成，请耐心等待平台工作人员审核（咚咚群：82490630）
          </p>
          <p class="finish-content">
            商家编码：{{ code }}，商家名称：{{ name }}
          </p>
          <p class="finish-content">
            审核通过后，您接下来可以继续在EDI
            IDE中导入商家，开始接口的开发工作（<a
              href="http://edi.com/help"
              style="color: #3c6ef0"
              target="_blank"
              >查看操作手册</a
            >
            ）
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
  name: "NewMerchant",
  components: { Steps },
  data() {
    const validateCode = async (rule, value, callback) => {
      const code = value;
      await ediManager
        .isExistMerchant(code)
        .then((res) => {
          const { code, data } = res.data;
          if (code === 20000) {
            if (data) {
              callback(new Error("商家编码已存在，请输入新的商家编码"));
            } else {
              callback();
            }
          }
        })
        .catch((error) => {
          const { message } = error.data;
          message && this.$message.error(message);
          callback(new Error(" "));
        });
    };
    const validateBusinessCode = async (rule, value, callback) => {
      const params = {
        businessCode: value,
        businessCodeType: this.basicInfoForm.businessCodeType,
      };
      await ediManager
        .isCorrectBusinessCode(params)
        .then((res) => {
          const { code, data } = res.data;
          if (code === 20000) {
            if (!data) {
              callback(new Error("请输入正确的业务编码"));
            } else {
              callback();
            }
          }
        })
        .catch((error) => {
          const { message } = error.data;
          message && this.$message.error(message);
          callback(new Error(" "));
        });
    };
    return {
      titleList: ["填写基本信息", "填写特殊配置", "完成"],
      active: 0,
      basicInfoForm: {
        code: "",
        name: "",
        businessCode: "",
        businessCodeType: 1,
        businessDescription: "",
      },
      basicInfoRules: {
        name: [{ required: true, message: "商家名称不能为空" }],
        code: [
          { required: true, message: "商家编码不能为空" },
          { validator: validateCode, trigger: "blur" },
        ],
        businessCodeType: [{ required: true, message: "业务编码不能为空" }],
        businessCode: [
          { required: true, message: "业务编码不能为空" },
          { validator: validateBusinessCode, trigger: "blur" },
        ],
        businessDescription: [
          { required: true, message: "对接业务不能为空" },
          { min: 10, max: 200, message: "请输入10-200个字符", trigger: "blur" },
        ],
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
    async createMerchant() {
      let params = Object.assign(
        this.basicInfoForm,
        this.specialConfigurationForm
      );
      const response = await ediManager.createMerchant(params);
      if (response) {
        this.code = response.data.code;
        this.name = response.data.name;
        if (this.active < 3) {
          this.active++;
        }
      }
    },
    changeBusinessCodeType() {
      this.$refs["basicInfoForm"].validateField("businessCode");
    },
  },
  created() {
    this.supplierId = Number(Cookies.get("supplierId"));
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
      width: 500px;
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
      width: 1000px;
      .el-icon-success {
        font-size: 60px;
        color: #26a872;
        margin: 30px 0 20px;
      }
      .finish-title {
        font-size: 18px;
        margin: 18px;
      }
      .finish-content {
        color: #9a9a9a;
        margin: 20px 0;
      }
      .finish-button {
        margin-top: 50px;
      }
    }
  }
}
</style>