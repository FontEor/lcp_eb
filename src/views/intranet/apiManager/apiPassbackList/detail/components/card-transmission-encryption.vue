<template>
  <section class="card-transmission-encryption">
    <div class="card-transmission-encryption__header">
      <div class="header__title">
        <div class="title__text">
          <Title text="传输加密" />
          <p>{{ formatPluginCodeText }}</p>
        </div>
        <p class="title__tip">通过对传输报文的加密，降低敏感数据泄漏风险。</p>
      </div>
      <el-button v-if="!editable" main @click="onClickSetButton"
        >设置</el-button
      >
    </div>

    <template v-if="editable">
      <div class="card-transmission-encryption__form">
        <el-radio-group v-model="enabledPluginCode">
          <el-radio label="out-cipher">
            <el-button
              type="text"
              style="margin-right: 8px; color: #666"
              @click="onClickEditableEnabledPluginCodeRadioButton('out-cipher')"
              >平台通用加解密 &gt;</el-button
            >
            <el-tag
              v-if="isOnlinePluginCode === 'out-cipher'"
              style="cursor: default"
              >使用中</el-tag
            >
          </el-radio>
        </el-radio-group>

        <el-button
          v-if="enabledPluginCode"
          size="mini"
          icon="el-icon-delete"
          main
          @click="onClickClearButton"
          >清空</el-button
        >
      </div>

      <div class="card-transmission-encryption__button-wrapper">
        <el-button @click="onClickCancelButton">取消</el-button>
        <el-button
          :loading="saveButtonLoading"
          type="primary"
          @click="onClickSaveButton"
          >保存</el-button
        >
      </div>
    </template>

    <el-dialog
      title="平台通用加解密详情"
      :visible.sync="dialogPlatformCommonVisible"
      :close-on-click-modal="false"
      width="640px"
      class="card-transmission-encryption__dialog-platform-common"
      @close="onCloseDialogPlatformCommon"
    >
      <el-form
        v-loading="dialogPlatformCommonLoading"
        :model="formPlatformCommonModel"
        :rules="formPlatformCommonRules"
        label-width="120px"
        ref="formPlatformCommonRef"
      >
        <el-row>
          <el-col :span="4">
            <p style="line-height: 32px">加解密内容</p>
          </el-col>
          <el-col :span="10">
            <el-form-item label="请求报文加密:" prop="ciphertextIsReqEncrypt">
              <el-switch
                v-model="formPlatformCommonModel.ciphertextIsReqEncrypt"
                :disabled="true"
                active-inner-text="开"
                inactive-inner-text="关"
              />
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="响应报文解密:" prop="ciphertextIsRespDecrypt">
              <el-switch
                v-model="formPlatformCommonModel.ciphertextIsRespDecrypt"
                active-inner-text="开"
                inactive-inner-text="关"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-divider />

        <el-row>
          <el-col :span="4">
            <p style="line-height: 32px">加密算法</p>
          </el-col>
          <el-col :span="10">
            <el-form-item label="算法名称:" prop="cipherAlgorithmName">
              <el-select
                v-model="formPlatformCommonModel.cipherAlgorithmName"
                style="width: 100%"
              >
                <el-option label="AES" value="AES" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="加密模式:" prop="cipherAlgorithmMode">
              <el-select
                v-model="formPlatformCommonModel.cipherAlgorithmMode"
                style="width: 100%"
              >
                <el-option label="CBC" value="cbc" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row type="flex" justify="end">
          <el-col :span="4"></el-col>
          <el-col :span="10">
            <el-form-item label="加密块位数" prop="cipherAlgorithmBlockSize">
              <el-select
                v-model="formPlatformCommonModel.cipherAlgorithmBlockSize"
                style="width: 100%"
              >
                <el-option label="128" :value="128" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="密钥位数:" prop="cipherAlgorithmKeySize">
              <el-select
                v-model="formPlatformCommonModel.cipherAlgorithmKeySize"
                style="width: 100%"
              >
                <el-option label="128" :value="128" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row type="flex" justify="end">
          <el-col :span="4"> </el-col>
          <el-col :span="20">
            <el-form-item label="填充模式:" prop="cipherAlgorithmPaddingMode">
              <el-select
                v-model="formPlatformCommonModel.cipherAlgorithmPaddingMode"
                style="width: 100%"
              >
                <el-option label="PKCS5Padding" value="PKCS5Padding" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-divider />

        <el-row>
          <el-col :span="4">
            <p>密码来源</p>
          </el-col>
          <el-col :span="10">
            <el-form-item label="密文来源:" prop="sourceType">
              <el-select
                v-model="formPlatformCommonModel.sourceType"
                style="width: 100%"
              >
                <el-option label="HTTP请求头" :value="1" />
                <el-option label="URL参数" :value="2" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item
              label="密文字段名:"
              prop="sourceName"
              style="margin-bottom: 22px"
            >
              <el-input
                v-model="formPlatformCommonModel.sourceName"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <template #footer>
        <el-button @click="onClickDialogPlatformCommonCancelButton"
          >取消</el-button
        >
        <el-button
          :loading="dialogPlatformCommonSaveButtonLoading"
          type="primary"
          @click="onClickDialogPlatformCommonSaveButton"
          >保存</el-button
        >
      </template>
    </el-dialog>
  </section>
</template>

<script>
import Title from "@/components/Title.vue";
import gateway from "@/api/intranet/gateway";
import { debounce } from "lodash";

export default {
  name: "CardTransmissionEncryption",
  components: { Title },
  props: {
    domainId: { type: Number, required: true },
    url: { type: String, required: true },
  },
  data() {
    return {
      outerApiId: parseInt(this.$route.params.id),
      editable: false,
      isOnline: 0,
      isOnlinePluginCode: "",
      enabledPluginCode: "",
      code: "",
      configList: [],

      saveButtonLoading: false,
      dialogPlatformCommonSaveButtonLoading: false,

      dialogPlatformCommonVisible: false,
      dialogPlatformCommonLoading: false,
      platformCommonPluginId: 0,
      formPlatformCommonModel: {
        ciphertextIsReqEncrypt: true,
        ciphertextIsRespDecrypt: false,

        cipherAlgorithmName: "AES",
        cipherAlgorithmMode: "cbc",
        cipherAlgorithmBlockSize: 128,
        cipherAlgorithmKeySize: 128,
        cipherAlgorithmPaddingMode: "PKCS5Padding",

        sourceType: 1,
        sourceName: "ciphertext",
      },
      formPlatformCommonRules: {
        sourceName: [
          { required: true, message: "字段长度为1-20字符" },
          { max: 20, message: "字段长度为1-20字符" },
          {
            pattern: /^[a-zA-Z0-9]*$/,
            message: "只支持英文字母和数字",
          },
        ],
      },
    };
  },
  computed: {
    formatPluginCodeText() {
      const hashMap = new Map().set("out-cipher", "平台通用加解密");
      const { isOnlinePluginCode } = this;
      return hashMap.get(isOnlinePluginCode) || "";
    },
  },
  methods: {
    // 查询回传API安全配置列表接口
    async findListByCondition() {
      const { domainId: outerDomainId, url } = this;
      const outerDomainPluginPreCondition = { outerDomainId, url };
      const data = [outerDomainPluginPreCondition];
      return await gateway.OuterDomainApiPluginPreService.findListByCondition(
        data
      );
    },
    // 查询回传API安全配置详情接口
    async findDetailByCondition() {
      const { code, domainId: outerDomainId, outerApiId } = this;
      const outerDomainPluginPreCondition = { code, outerDomainId, outerApiId };
      const data = [outerDomainPluginPreCondition];
      return await gateway.OuterDomainApiPluginPreService.findDetailByCondition(
        data
      );
    },
    // 保存回传API安全配置接口
    async save(isEnabledToggle = true) {
      let { platformCommonPluginId: id } = this;
      id = id || undefined;
      const {
        domainId: outerDomainId,
        outerApiId,
        code,
        enabledPluginCode,
      } = this;
      const {
        ciphertextIsReqEncrypt: isReqEncrypt,
        ciphertextIsRespDecrypt: isRespDecrypt,

        cipherAlgorithmName,
        cipherAlgorithmMode: mode,
        cipherAlgorithmBlockSize: blockSize,
        cipherAlgorithmKeySize: keySize,
        cipherAlgorithmPaddingMode: paddingMode,

        sourceType: type,
        sourceName,
      } = this.formPlatformCommonModel;
      const format = 1;
      const ciphertext = { isReqEncrypt, isRespDecrypt };
      const algorithm = {
        name: cipherAlgorithmName,
        mode,
        blockSize,
        keySize,
        paddingMode,
      };
      const source = { type, name: sourceName, format };
      const cipher = { algorithm, source };
      const pluginConfig = JSON.stringify({ ciphertext, cipher });
      const config = isEnabledToggle ? undefined : { name: code, pluginConfig };
      const isEnabled = isEnabledToggle
        ? code === enabledPluginCode
        : undefined;
      const outerDomainPluginPreCondition = {
        id,
        outerDomainId,
        outerApiId,
        code,
        config,
        isEnabled,
      };
      const data = [outerDomainPluginPreCondition];
      return await gateway.OuterDomainApiPluginPreService.save(data);
    },

    // 查询回传API安全配置列表接口调用
    async handleFindListByCondition() {
      const { data } = await this.findListByCondition().catch((error) => {
        console.error("handleFindListByCondition");
        throw error;
      });
      this.configList = Array.isArray(data)
        ? data.length > 0
          ? data
          : [{ code: "out-cipher" }]
        : [{ code: "out-cipher" }];
      this.configList.some((item) => {
        const { code, isOnline, isEnabled } = item;
        if (isEnabled) {
          this.enabledPluginCode = code || "";
        }
        if (isOnline) {
          this.isOnline = isOnline;
          this.isOnlinePluginCode = code || "";
          return true;
        }
      });
    },
    // 查询回传API安全配置详情接口调用
    async handleFindDetailByCondition() {
      const { data } = await this.findDetailByCondition().catch((error) => {
        console.error("handleFindDetailByCondition");
        throw error;
      });
      const { id: platformCommonPluginId, config } = data || {};
      const { pluginConfig } = config || {};
      this.platformCommonPluginId = platformCommonPluginId || 0;
      if (!pluginConfig) {
        this.formPlatformCommonModel = {
          ciphertextIsReqEncrypt: true,
          ciphertextIsRespDecrypt: false,

          cipherAlgorithmName: "AES",
          cipherAlgorithmMode: "cbc",
          cipherAlgorithmBlockSize: 128,
          cipherAlgorithmKeySize: 128,
          cipherAlgorithmPaddingMode: "PKCS5Padding",

          sourceType: 1,
          sourceName: "ciphertext",
        };
        return;
      }
      try {
        const {
          ciphertext: {
            isReqEncrypt: ciphertextIsReqEncrypt,
            isRespDecrypt: ciphertextIsRespDecrypt,
          },
          cipher: {
            algorithm: {
              name: cipherAlgorithmName,
              mode: cipherAlgorithmMode,
              blockSize: cipherAlgorithmBlockSize,
              keySize: cipherAlgorithmKeySize,
              paddingMode: cipherAlgorithmPaddingMode,
            },
            source: { type: sourceType, name: sourceName },
          },
        } = JSON.parse(pluginConfig);
        this.formPlatformCommonModel = {
          ciphertextIsReqEncrypt,
          ciphertextIsRespDecrypt,

          cipherAlgorithmName,
          cipherAlgorithmMode,
          cipherAlgorithmBlockSize,
          cipherAlgorithmKeySize,
          cipherAlgorithmPaddingMode,

          sourceType,
          sourceName,
        };
      } catch (error) {
        console.error(error);
        this.formPlatformCommonModel = {
          ciphertextIsReqEncrypt: true,
          ciphertextIsRespDecrypt: false,

          cipherAlgorithmName: "AES",
          cipherAlgorithmMode: "cbc",
          cipherAlgorithmBlockSize: 128,
          cipherAlgorithmKeySize: 128,
          cipherAlgorithmPaddingMode: "PKCS5Padding",

          sourceType: 1,
          sourceName: "ciphertext",
        };
      }
    },
    // 保存回传API安全配置接口调用
    async handleSave(isEnabledToggle = true) {
      await this.save(isEnabledToggle).catch((error) => {
        console.error("handleSave");
        throw error;
      });
      this.$message.success("操作成功！");
    },

    onClickSetButton() {
      this.editable = true;
    },
    async onClickEditableEnabledPluginCodeRadioButton(code) {
      this.dialogPlatformCommonVisible = true;
      this.dialogPlatformCommonLoading = true;
      this.code = code || "";
      await this.handleFindDetailByCondition().catch((error) => {
        console.error("onClickEditableEnabledPluginCodeRadioButton");
        throw error;
      });
      this.dialogPlatformCommonLoading = false;
    },
    onClickClearButton() {
      this.enabledPluginCode = "";
    },
    onClickCancelButton() {
      this.configList.every((item) => {
        const { isEnabled, code } = item;
        if (!isEnabled) {
          return true;
        }
        this.enabledPluginCode = code || "";
      });
      this.editable = false;
    },
    onClickSaveButton: debounce(async function () {
      const { isOnline, configList } = this;
      if (!isOnline) {
        this.saveButtonLoading = true;
        for (const config of configList) {
          const { id, code } = config;
          this.platformCommonPluginId = id;
          this.code = code;
          await this.handleSave(true).catch((error) => {
            this.saveButtonLoading = false;
            console.error("onClickSaveButton");
            throw error;
          });
        }
        this.saveButtonLoading = false;
        await this.handleFindListByCondition().catch((error) => {
          console.error("onClickSaveButton");
          throw error;
        });
        this.editable = false;
        this.$emit("getApiBasicInfo");
        return;
      }

      const h = this.$createElement;
      this.$msgbox({
        title: "修改提示",
        message: h(
          "p",
          null,
          "回传API加密配置已经生效并发布，再次修改配置可能会导致已对接客户线上报错，请确认是否修改加密配置？"
        ),
        customClass: "dialog-modification-tip",
        showCancelButton: true,
      })
        .then(async () => {
          for (const config of configList) {
            const { id, code } = config;
            this.platformCommonPluginId = id;
            this.code = code;
            await this.handleSave(true).catch((error) => {
              console.error("onClickSaveButton");
              throw error;
            });
          }
          await this.handleFindListByCondition().catch((error) => {
            console.error("onClickSaveButton");
            throw error;
          });
          this.editable = false;
          this.$emit("getApiBasicInfo");
        })
        .catch(() => {});
    }, 300),
    onCloseDialogPlatformCommon() {
      this.$refs["formPlatformCommonRef"].resetFields();
    },
    onClickDialogPlatformCommonCancelButton() {
      this.dialogPlatformCommonVisible = false;
    },
    onClickDialogPlatformCommonSaveButton: debounce(async function () {
      this.$refs["formPlatformCommonRef"]
        .validate()
        .then(async () => {
          const { isOnline } = this;
          if (!isOnline) {
            this.dialogPlatformCommonSaveButtonLoading = true;
            await this.handleSave(false).catch((error) => {
              this.dialogPlatformCommonSaveButtonLoading = false;
              console.error("onClickDialogPlatformCommonSaveButton");
              throw error;
            });
            this.dialogPlatformCommonSaveButtonLoading = false;
            await this.handleFindListByCondition().catch((error) => {
              console.error("onClickDialogPlatformCommonSaveButton");
              throw error;
            });
            this.dialogPlatformCommonVisible = false;
            this.$emit("getApiBasicInfo");
            return;
          }

          const h = this.$createElement;
          this.$msgbox({
            title: "修改提示",
            message: h(
              "p",
              null,
              "回传API加密配置已经生效并发布，再次修改配置可能会导致已对接客户线上报错，请确认是否修改加密配置？"
            ),
            customClass: "dialog-modification-tip",
            showCancelButton: true,
          })
            .then(async () => {
              await this.handleSave(false).catch((error) => {
                console.error("onClickDialogPlatformCommonSaveButton");
                throw error;
              });

              await this.handleFindListByCondition().catch((error) => {
                console.error("onClickDialogPlatformCommonSaveButton");
                throw error;
              });
              this.dialogPlatformCommonVisible = false;
              this.$emit("getApiBasicInfo");
            })
            .catch(() => {});
        })
        .catch(() => {});
    }, 300),
  },
  async created() {
    await this.handleFindListByCondition().catch((error) => {
      console.error("created");
      throw error;
    });
  },
};
</script>

<style lang="scss" scoped>
.card-transmission-encryption {
  padding: 16px;
  background-color: #f9f9f9;

  .card-transmission-encryption__header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .header__title {
      .title__text {
        display: flex;
        align-items: center;

        .title {
          margin-right: 16px;
        }
      }

      .title__tip {
        padding: 8px;
        color: #666;
      }
    }
  }

  .card-transmission-encryption__form {
    padding: 0 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 320px;
  }

  .card-transmission-encryption__button-wrapper {
    margin-top: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .card-transmission-encryption__dialog-platform-common {
    .el-form-item {
      margin-bottom: 8px;
    }
    .el-divider {
      margin-top: 8px;
      margin-bottom: 16px;
    }
  }
}
</style>
