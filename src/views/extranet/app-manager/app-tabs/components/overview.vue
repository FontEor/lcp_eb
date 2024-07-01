<template>
  <div class="overview">
    <el-form
      :model="formModel"
      :rules="formRules"
      ref="formRef"
      label-width="160px"
      class="overview__form"
    >
      <!-- 应用中文名称 -->
      <el-form-item :disabled="!editable" label="应用中文名称:" prop="name">
        <el-input
          v-if="editable"
          v-model="formModel.name"
          placeholder="请输入当前APP应用中文名称，2-20个字符"
          style="width: 50%"
        />
        <span v-else>{{ formModel.name || "未填写" }}</span>
      </el-form-item>
      <!-- 应用描述 -->
      <el-form-item
        v-if="systemSource !== 'jos'"
        :disabled="!editable"
        label="应用描述:"
        prop="remark"
      >
        <el-input
          v-if="editable"
          v-model="formModel.remark"
          type="textarea"
          placeholder="请描述当前APP应用，10-200个字符"
          style="width: 50%"
        />
        <span v-else>{{ formModel.remark || "未填写" }}</span>
      </el-form-item>
      <!-- 应用类别 -->
      <el-form-item label="应用类别:">
        <span>{{ formatAppTypeText || "-" }} </span>
      </el-form-item>
      <!-- AppKey -->
      <el-form-item label="AppKey:">
        <span>
          {{ appKey || "-" }}
        </span>
        <el-tooltip content="复制AppKey" effect="dark" placement="top">
          <el-button
            v-clipboard="appKey"
            v-clipboard:success="onCopySuccess"
            type="text"
            class="el-icon-document-copy"
          />
        </el-tooltip>
      </el-form-item>
      <!-- AppSecret -->
      <el-form-item label="AppSecret:">
        <template v-if="appSecretVisible">
          <span>{{ formatAppSecretText || "-" }}</span>
          <el-tooltip content="复制AppSecret" effect="dark" placement="top">
            <el-button
              v-clipboard="formatAppSecretText"
              v-clipboard:success="onCopySuccess"
              type="text"
              style="margin-left: 4px"
              class="el-icon-document-copy"
            />
          </el-tooltip>
          <el-button type="text" @click="onClickViewAppSecretButton(false)"
            >隐藏</el-button
          >
        </template>
        <el-button v-else type="text" @click="onClickViewAppSecretButton(true)"
          >查看</el-button
        >
      </el-form-item>
      <!-- 报文加解密密钥 -->
      <el-form-item>
        <template #label>
          <span>报文加解密密钥</span>
          <el-tooltip
            content="物流开放平台支持RSA形式的API加密传输，不同调用方向和环境的秘钥不同。"
            placement="top"
          >
            <i class="el-icon-help-solid initColor" style="margin-left: 4px" />
          </el-tooltip>
          <span>:</span>
        </template>
        <el-radio-group
          v-model="keyCallMethod"
          :disabled="false"
          @change="onChangeKeyCallMethodRadioGroup"
        >
          <el-radio-button :label="1">客户调JDL公钥</el-radio-button>
          <el-radio-button :label="2">JDL调客户私钥</el-radio-button>
        </el-radio-group>
        <!-- 报文加解密密钥-密钥环境 -->
        <el-form-item label="密钥环境:" label-width="120px">
          <el-radio-group v-model="keyEnv" @change="onChangeKeyEnvRadioGroup">
            <el-radio label="prod">生产环境</el-radio>
            <el-radio label="uat">预发环境</el-radio>
          </el-radio-group>
        </el-form-item>

        <template v-if="keyCallMethod === 1">
          <!-- 报文加解密密钥-RSA秘钥ID -->
          <el-form-item label-width="120px">
            <template #label>
              <span>RSA秘钥ID</span>
              <el-tooltip
                content="在使用物流开放平台资源（API、SDK等）的过程中，可能要求应用以RSA加密传输的形式使用。物流开放平台自动为每个应用生成了RSA秘钥对，您可以查看RSA秘钥ID和公钥，加密数据。"
                placement="top"
              >
                <i
                  class="el-icon-help-solid initColor"
                  style="margin-left: 4px"
                />
              </el-tooltip>
              <span>:</span>
            </template>
            <span>{{ formatPositivePkiIdText || "-" }}</span>
            <el-tooltip content="复制RSA秘钥ID" effect="dark" placement="top">
              <el-button
                v-clipboard="formatPositivePkiIdText"
                v-clipboard:success="onCopySuccess"
                type="text"
                style="margin-left: 4px"
                class="el-icon-document-copy"
              />
            </el-tooltip>
          </el-form-item>
          <!-- 报文加解密密钥-RSA公钥 -->
          <el-form-item label-width="120px">
            <template #label>
              <span>RSA公钥</span>
              <el-tooltip
                content="在使用物流开放平台资源（API、SDK等）的过程中，可能要求应用以RSA加密传输的形式使用。物流开放平台自动为每个应用生成了RSA秘钥对，您可以查看RSA秘钥ID和公钥，加密数据。"
                placement="top"
              >
                <i
                  class="el-icon-help-solid initColor"
                  style="margin-left: 4px"
                />
              </el-tooltip>
              <span>:</span>
            </template>
            <template v-if="positivePkiVisible">
              <span>{{ positivePki || "-" }}</span>
              <el-tooltip content="复制RSA公钥" effect="dark" placement="top">
                <el-button
                  v-clipboard="positivePki"
                  v-clipboard:success="onCopySuccess"
                  type="text"
                  style="margin-left: 4px"
                  class="el-icon-document-copy"
                />
              </el-tooltip>
              <el-button
                type="text"
                @click="onClickViewOrHidePositivePkiButton(false)"
                >隐藏</el-button
              >
            </template>
            <el-button
              v-else
              type="text"
              @click="onClickViewOrHidePositivePkiButton(true)"
              >查看</el-button
            >
          </el-form-item>
        </template>

        <template v-else-if="keyCallMethod === 2">
          <!-- 报文加解密密钥-RSA私钥 -->
          <el-form-item label-width="120px">
            <template #label>
              <span>RSA私钥</span>
              <el-tooltip
                content="可用于解密回传API的加密报文，RSA私钥默认生效。RSA私钥每天支持重置1次（网关限流），每次重置后需要手动点击【私钥生效】才会生效。"
                placement="top"
              >
                <i
                  class="el-icon-help-solid initColor"
                  style="margin-left: 4px"
                />
              </el-tooltip>
              <span>:</span>
            </template>
            <template v-if="backPkiVisible">
              <span>{{ backPki || "-" }}</span>
              <el-tooltip content="复制RSA私钥" effect="dark" placement="top">
                <el-button
                  v-clipboard="backPki"
                  v-clipboard:success="onCopySuccess"
                  type="text"
                  style="margin-left: 4px"
                  class="el-icon-document-copy"
                />
              </el-tooltip>
              <el-button type="text" @click="onClickResetBackPkiButton"
                >重置</el-button
              >
              <el-button
                v-if="backPkiEffectButtonVisible"
                type="text"
                @click="onClickBackEffectPkiButton"
                >私钥生效</el-button
              >
            </template>
            <el-button v-else type="text" @click="onClickViewBackPkiButton"
              >查看</el-button
            >
          </el-form-item>
        </template>
      </el-form-item>

      <div v-if="buttonWrapperVisible" class="form__button-wrapper">
        <div v-if="editable">
          <el-button @click="onClickCancelButton">取消</el-button>
          <el-button
            :loading="saveButtonLoading"
            type="primary"
            @click="onClickSaveButton"
            >保存</el-button
          >
        </div>
        <el-button v-else type="primary" @click="onClickEditButton"
          >编辑</el-button
        >
      </div>
    </el-form>
  </div>
</template>

<script>
import lcp from "@/api/extranet/lcp/index.js";
import { debounce } from "lodash";
import JSEncrypt from "jsencrypt";

export default {
  name: "Overview",
  data() {
    return {
      id: parseInt(this.$route.params.id) || 0,
      editable: false,
      formModel: {
        name: "",
        remark: "",
      },
      formRules: {
        name: [
          { required: true, message: "请输入应用中文名称" },
          { min: 2, max: 20, message: "长度在2到20个字符" },
        ],
        remark: [
          { required: true, message: "请输入应用描述" },
          { min: 10, max: 200, message: "长度在10到200个字符" },
        ],
      },
      type: 0,
      appKey: "",
      appSecretVisible: false,
      gatewaySecret: "",
      systemSource: "",
      key: this.generateRandomString(),
      iv: this.generateRandomString(),
      keyCallMethod: 1,
      keyEnv: "prod",
      prodPositivePkiId: null,
      uatPositivePkiId: null,
      positivePkiVisible: false,
      positivePki: "",
      backPkiVisible: false,
      backPki: "",
      prodBackResetCount: 0,
      uatBackResetCount: 0,
      prodBackNeedEffect: 0,
      uatBackNeedEffect: 0,
      saveButtonLoading: false,
    };
  },
  computed: {
    formatAppTypeText() {
      const { type } = this;
      const hashMap = new Map()
        .set(3, "ISV应用")
        .set(4, "商家自研应用")
        .set(5, "合作伙伴应用");
      return hashMap.get(type) || "-";
    },
    formatAppSecretText() {
      const { type, gatewaySecret } = this;
      const hashMap = new Map()
        .set(3, gatewaySecret)
        .set(4, gatewaySecret)
        .set(5, gatewaySecret);
      return hashMap.get(type);
    },
    formatPositivePkiIdText() {
      const { keyEnv, prodPositivePkiId, uatPositivePkiId } = this;
      const hashMap = new Map()
        .set("prod", prodPositivePkiId)
        .set("uat", uatPositivePkiId);
      return hashMap.get(keyEnv);
    },
    formatBackResetCountText() {
      const { keyEnv, prodBackResetCount, uatBackResetCount } = this;
      const hashMap = new Map()
        .set("prod", prodBackResetCount)
        .set("uat", uatBackResetCount);
      return hashMap.get(keyEnv);
    },
    backPkiEffectButtonVisible() {
      const { keyEnv, prodBackNeedEffect, uatBackNeedEffect } = this;
      const hashMap = new Map()
        .set("prod", Boolean(prodBackNeedEffect))
        .set("uat", Boolean(uatBackNeedEffect));
      return hashMap.get(keyEnv);
    },
    buttonWrapperVisible() {
      return this.systemSource !== "clps" && this.systemSource !== "jos";
    },
  },
  methods: {
    // 根据应用ID查询外网应用管理概览数据接口
    async getOuterApp() {
      const { id } = this;
      const params = { id };
      return await lcp.app.getOuterApp(params);
    },
    // 根据AppKey查询AppSecret接口
    async getAppSecret() {
      const { appKey, key, iv } = this;
      const params = { appKey };
      const { publicKey } = window.env;
      const encrypt = new JSEncrypt();
      encrypt.setPublicKey(publicKey || "");
      const ciphertext = encrypt.encrypt(key + iv);
      const getAppSecretParams = { params, key, iv, ciphertext };
      return await lcp.app.getAppSecret(getAppSecretParams);
    },
    // 根据AppKey和pki类型查询外调内公钥接口
    async getPositivePki() {
      const { appKey, keyEnv } = this;
      const hashMap = new Map().set("prod", 1).set("uat", 2);
      const code = appKey;
      const pkiType = hashMap.get(keyEnv);
      const data = { code, pkiType };
      return await lcp.app.getPositivePki(data);
    },
    // 根据AppKey和pki类型查询内调外私钥接口
    async getBackPki() {
      const { appKey, keyEnv, key, iv } = this;
      const hashMap = new Map().set("prod", 3).set("uat", 4);
      const code = appKey;
      const pkiType = hashMap.get(keyEnv);
      const data = { code, pkiType };
      const { publicKey } = window.env;
      const encrypt = new JSEncrypt();
      encrypt.setPublicKey(publicKey || "");
      const ciphertext = encrypt.encrypt(key + iv);
      const getBackPki = { data, key, iv, ciphertext };
      return await lcp.app.getBackPki(getBackPki);
    },
    // 根据AppKey查询内调外API重置次数接口
    async getAppBackPkiMessage() {
      const { appKey: appCode } = this;
      const params = { appCode };
      return await lcp.app.getAppBackPkiMessage(params);
    },
    // 根据AppKey和pki类型重置内调外私钥接口
    async resetCallBackPKI() {
      const { appKey, keyEnv } = this;
      const hashMap = new Map().set("prod", 3).set("uat", 4);
      const code = appKey;
      const pkiType = hashMap.get(keyEnv);
      const data = { code, pkiType };
      return await lcp.app.resetCallBackPKI(data);
    },
    // 根据AppKey和pki类型生效内调外私钥接口
    async effectCallBackPKI() {
      const { appKey, keyEnv } = this;
      const hashMap = new Map().set("prod", 3).set("uat", 4);
      const code = appKey;
      const pkiType = hashMap.get(keyEnv);
      const data = { code, pkiType };
      return await lcp.app.effectCallBackPKI(data);
    },
    // 保存概览数据接口
    async saveAppBaseInfo() {
      const { id } = this;
      const { name, remark } = this.formModel;
      const params = { id, name, remark };
      return await lcp.app.saveAppBaseInfo(params);
    },

    // 根据应用ID查询外网应用管理概览数据接口调用
    async handleGetOuterApp() {
      const {
        data: {
          name = "",
          remark = "",
          type,
          code,
          systemSource,
          createUser,
          createTime,
          appPositivePkiDto: { prodPositivePkiId, uatPositivePkiId },
        },
      } = await this.getOuterApp().catch((error) => {
        console.error("handleGetOuterApp");
        throw error;
      });
      this.formModel = { name, remark };
      this.type = type || 0;
      this.appKey = code || "";
      this.systemSource = systemSource || "";
      this.prodPositivePkiId = prodPositivePkiId || null;
      this.uatPositivePkiId = uatPositivePkiId || null;
      const { id } = this;
      this.$emit("updateTitle", {
        id,
        name,
        remark,
        type,
        code,
        createUser,
        createTime,
      });
    },
    // 根据AppKey查询AppSecret接口调用
    async handleGetAppSecret() {
      const {
        data: { gatewaySecret },
      } = await this.getAppSecret().catch((error) => {
        console.error("handleGetAppSecret");
        throw error;
      });
      this.gatewaySecret = gatewaySecret || "";
    },
    // 根据AppKey和pki类型查询外调内公钥接口调用
    async handleGetPositivePki() {
      const { data } = await this.getPositivePki().catch((error) => {
        console.error("handleGetPositivePki");
        throw error;
      });
      this.positivePki = data || "";
    },
    // 根据AppKey和pki类型查询内调外私钥接口调用
    async handleGetBackPki() {
      const { data } = await this.getBackPki().catch((error) => {
        console.error("handleGetBackPki");
        throw error;
      });
      this.backPki = data || "";
    },
    // 根据AppKey查询内调外API重置次数接口调用
    async handleGetAppBackPkiMessage() {
      const {
        data: {
          prodBackResetCount,
          uatBackResetCount,
          prodBackNeedEffect,
          uatBackNeedEffect,
        },
      } = await this.getAppBackPkiMessage().catch((error) => {
        console.error("handleGetAppBackPkiMessage");
        throw error;
      });
      this.prodBackResetCount = prodBackResetCount || 0;
      this.uatBackResetCount = uatBackResetCount || 0;
      this.prodBackNeedEffect = prodBackNeedEffect || 0;
      this.uatBackNeedEffect = uatBackNeedEffect || 0;
    },
    // 根据AppKey和pki类型重置内调外私钥接口调用
    async handleResetCallBackPKI() {
      await this.resetCallBackPKI().catch((error) => {
        console.error("handleResetCallBackPKI");
        throw error;
      });
    },
    // 根据AppKey和pki类型生效内调外私钥接口调用
    async handleEffectCallBackPKI() {
      await this.effectCallBackPKI().catch((error) => {
        console.error("handleEffectCallBackPKI");
        throw error;
      });
    },
    // 保存概览数据接口调用
    async handleSaveAppBaseInfo() {
      await this.saveAppBaseInfo().catch((error) => {
        console.error("saveAppBaseInfo");
        throw error;
      });
    },
    generateRandomString() {
      let randomString = "";
      for (let i = 0; i < 16; i++) {
        // 生成大写字母65-90, 小写字母97-122, 数字48-57之间的随机整数
        const asciiCode =
          Math.floor(Math.random() * 3) === 0
            ? Math.floor(Math.random() * (90 - 65 + 1)) + 65
            : Math.floor(Math.random() * (122 - 97 + 1)) + 97 ||
              Math.floor(Math.random() * (57 - 48 + 1)) + 48;
        // 将ascii码转换成对应字符并加入随机字符串
        const chars = String.fromCharCode(asciiCode);
        randomString += chars;
      }
      return randomString;
    },

    onCopySuccess() {
      this.$message.success("复制成功！");
    },
    async onClickViewAppSecretButton(value = true) {
      if (!value) {
        this.appSecretVisible = value;
        return;
      }
      await this.handleGetAppSecret().catch((error) => {
        console.error("onClickViewAppSecretButton");
        throw error;
      });
      this.appSecretVisible = value;
    },
    onChangeKeyCallMethodRadioGroup() {
      this.positivePkiVisible = false;
      this.backPkiVisible = false;
    },
    onChangeKeyEnvRadioGroup() {
      this.positivePkiVisible = false;
      this.backPkiVisible = false;
    },
    async onClickViewOrHidePositivePkiButton(value = true) {
      if (!value) {
        this.positivePkiVisible = value;
        return;
      }
      await this.handleGetPositivePki().catch((error) => {
        console.error("onClickViewOrHidePositivePkiButton");
        throw error;
      });
      this.positivePkiVisible = value;
    },
    onClickViewBackPkiButton: debounce(async function () {
      await this.handleGetBackPki().catch((error) => {
        console.error("onClickViewBackPkiButton");
        throw error;
      });
      await this.handleGetAppBackPkiMessage().catch((error) => {
        console.log("onClickResetBackPkiButton");
        throw error;
      });
      this.backPkiVisible = true;
    }, 300),
    async onClickResetBackPkiButton() {
      await this.handleGetAppBackPkiMessage().catch((error) => {
        console.log("onClickResetBackPkiButton");
        throw error;
      });
      const { formatBackResetCountText } = this;
      const h = this.$createElement;
      this.$msgbox({
        title: "重置提醒",
        message: h("section", null, [
          h(
            "p",
            null,
            `①确认重置后将生成新的RSA私钥，本日重置次数(${formatBackResetCountText}/1)；`
          ),
          h(
            "p",
            null,
            "②重置后私钥不生效，点击【私钥生效】按钮后，网关将立即使用新的秘钥加密报文。"
          ),
        ]),
        customClass: "dialog-reset-tip",
        showCancelButton: true,
      })
        .then(async () => {
          await this.handleResetCallBackPKI().catch((error) => {
            console.error("onClickResetBackPkiButton");
            throw error;
          });
          this.$message.success("操作成功！");
          this.backPkiVisible = false;
        })
        .catch(() => {});
    },
    onClickBackEffectPkiButton() {
      const h = this.$createElement;
      this.$msgbox({
        title: "私钥生效提醒",
        message: h(
          "p",
          null,
          "点击【确认】后，网关将使用新的RSA秘钥加密回传API报文，为了避免解密报错，请尽量在业务低峰期操作，请确认是否私钥生效？"
        ),
        customClass: "dialog-effect-tip",
        showCancelButton: true,
      })
        .then(async () => {
          await this.handleEffectCallBackPKI().catch((error) => {
            console.error("onClickBackEffectPkiButton");
            throw error;
          });
          this.$message.success("操作成功！");
          this.backPkiVisible = false;
        })
        .catch(() => {});
    },
    async onClickCancelButton() {
      this.$refs["formRef"].resetFields();
      this.editable = false;
      await this.handleGetOuterApp().catch((error) => {
        console.error("onClickCancelButton");
        throw error;
      });
    },
    onClickSaveButton: debounce(async function () {
      await this.$refs["formRef"].validate().catch(() => {
        throw new Error("未通过表单校验");
      });
      this.saveButtonLoading = true;
      await this.handleSaveAppBaseInfo().catch((error) => {
        this.saveButtonLoading = false;
        console.error("onClickSaveButton");
        throw error;
      });
      this.$message.success("保存成功！");
      this.editable = false;
      this.saveButtonLoading = false;
      await this.handleGetOuterApp().catch((error) => {
        console.error("onClickSaveButton");
        throw error;
      });
    }, 300),
    onClickEditButton() {
      this.editable = true;
    },
  },
  async created() {
    await this.handleGetOuterApp().catch((error) => {
      console.error("created");
      throw error;
    });
  },
};
</script>

<style lang="scss" scoped>
.overview {
  .overview__form {
    .form__button-wrapper {
      display: flex;
      justify-content: center;
    }
  }
}
</style>

<style lang="scss">
.dialog-reset-tip {
  width: 640px;
}
</style>
