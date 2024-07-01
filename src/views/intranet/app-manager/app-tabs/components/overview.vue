<template type="ElementUI">
  <div>
    <el-form
      :model="appSummaryForm"
      :rules="rules"
      ref="appSummaryForm"
      label-width="130px"
      class="overview-appSummaryForm"
      :disabled="editer.status"
    >
      <el-form-item :label="$t('app.appOverView.5ix5wo2kfsg1')" prop="name">
        <el-input
          v-if="!editer.status"
          v-model="appSummaryForm.name"
          :placeholder="$t('app.appOverView.5ix5wo2k9vk0')"
        ></el-input>
        <span v-if="editer.status">{{
          appSummaryForm.name === ""
            ? $t("app.appOverView.5ix5wo2kbww0")
            : appSummaryForm.name
        }}</span>
      </el-form-item>

      <el-form-item :label="$t('app.appOverView.5ix5wo2kfsg2')" prop="remark">
        <el-input
          v-if="!editer.status"
          type="textarea"
          v-model="appSummaryForm.remark"
          :placeholder="$t('app.appOverView.5ix5wo2kc6g0')"
        ></el-input>
        <span v-if="editer.status">{{
          appSummaryForm.remark === ""
            ? $t("app.appOverView.5ix5wo2kbww0")
            : appSummaryForm.remark
        }}</span>
      </el-form-item>

      <el-form-item label="appKey:" prop="code">
        <span
          >{{ appSummaryForm.code }}
          <el-tooltip
            class="item"
            effect="dark"
            :content="$t('app.appOverView.5ix5wo2kcc40')"
            placement="top"
            ><a href="javascript:void(0)" v-on:click="copyAppKey"
              ><i class="el-icon-document-copy" /></a></el-tooltip
        ></span>
      </el-form-item>
      <el-form-item label="appSecret:">
        <span v-if="secretDisplay === true">
          {{ secretMeg }}
          <el-tooltip
            class="item"
            effect="dark"
            :content="$t('app.appOverView.5ix5wo2kch40')"
            placement="top"
          >
            <a href="javascript:void(0)" v-on:click="copyAppSecret"
              ><i class="el-icon-document-copy" />
            </a>
          </el-tooltip>
          <a
            href="javascript:void(0)"
            style="color: #3c6ef0"
            v-on:click="displayAppSecret(false)"
          >
            {{ $t("app.appOverView.5ix5wo2kcn40") }}</a
          ></span
        >
        <span v-else
          ><a
            href="javascript:void(0)"
            v-on:click="displayAppSecret(true)"
            style="color: #3c6ef0"
            >{{ $t("app.appOverView.5ix5wo2kcs80") }}</a
          ></span
        >
      </el-form-item>
      <el-form-item prop="pkiid">
        <span slot="label"
          >{{ $t("app.appOverView.5ix5wo2kfsg4") }}
          <el-tooltip
            class="el-icon-help-solid"
            :content="$t('app.appOverView.5ix5wo2kcx40')"
            placement="top"
            ><i class="el-icon-help-solid" /></el-tooltip
          >:</span
        >
        <span
          >{{ appSummaryForm.pkiid }}
          <el-tooltip
            class="el-icon-question"
            effect="dark"
            :content="$t('app.appOverView.5ix5wo2kd280')"
            placement="top"
            ><a href="javascript:void(0)" v-on:click="copyRSAIdKey"
              ><i class="el-icon-document-copy" /></a></el-tooltip
        ></span>
      </el-form-item>
      <el-form-item>
        <span slot="label"
          >{{ $t("app.appOverView.5ix5wo2kcx41") }}
          <el-tooltip
            class="el-icon-help-solid"
            :content="$t('app.appOverView.5ix5wo2kcx40')"
            placement="top"
            ><i class="el-icon-help-solid" /></el-tooltip
          >:</span
        >
        <span v-if="publicSecretDisplay === true">
          {{ publicSecret }}
          <el-tooltip
            class="item"
            effect="dark"
            :content="$t('app.appOverView.5ix5wo2kde80')"
            placement="top"
          >
            <a href="javascript:void(0)" v-on:click="copyPublicSecret"
              ><i class="el-icon-document-copy" />
            </a>
          </el-tooltip>
          <a
            href="javascript:void(0)"
            style="color: #3c6ef0"
            v-on:click="displayPublicSecret(false)"
          >
            {{ $t("app.appOverView.5ix5wo2kcn40") }}</a
          ></span
        >
        <span v-else
          ><a
            href="javascript:void(0)"
            v-on:click="displayPublicSecret(true)"
            style="color: #3c6ef0"
            >{{ $t("app.appOverView.5ix5wo2kcs80") }}</a
          ></span
        >
      </el-form-item>
      <el-form-item>
        <div v-if="!editer.status && systemSource !== 'clps'">
          <el-button
            :loading="submitButtonLoading"
            type="primary"
            @click="onClickSubmitButton('appSummaryForm')"
            >{{ $t("app.appOverView.5ix5wo2kcx42") }}
          </el-button>
          <el-button v-on:click="cancelAppForm('appSummaryForm')"
            >{{ $t("app.appOverView.5ix5wo2kcx43") }}
          </el-button>
        </div>
      </el-form-item>
    </el-form>
    <div v-if="editer.status && systemSource !== 'clps'">
      <el-button
        type="primary"
        v-on:click="editerForm('appSummaryForm')"
        style="margin-left: 8%"
        >{{ $t("app.appOverView.5ix5wo2kcx44") }}
      </el-button>
    </div>
  </div>
</template>
<script>
import request from "@/utils/request";
import { Message } from "@lui/lui-ui";

export default {
  computed: {
    computeAppTypeText: function () {
      if (this.appSummaryForm.type === 3) {
        return this.$t("app.appOverView.5ix5wo2kdq81");
      } else if (this.appSummaryForm.type === 4) {
        return this.$t("app.appOverView.5ix5wo2kdq80");
      } else if (this.appSummaryForm.type === 5) {
        return this.$t("app.appOverView.5ix5wo2kdx40");
      }
    },
    //如果type=3/4/5则显示gatewaySecret，否则显示secret
    secretMeg: function () {
      if (
        this.appSummaryForm.type === 3 ||
        this.appSummaryForm.type === 4 ||
        this.appSummaryForm.type === 5
      ) {
        return this.appSummaryForm.gatewaySecret;
      } else {
        return this.appSummaryForm.secret;
      }
    },
  },
  data() {
    return {
      editer: {
        status: true,
      },
      appSummaryForm: {
        id: "",
        name: "",
        code: "",
        secret: "",
        gatewaySecret: "",
        remark: "",
        type: "",
        pkiid: "",
      },
      //账号来源是哪里，如果是eclp则不允许编辑
      systemSource: null,
      secretDisplay: false,
      publicSecretDisplay: false,
      publicSecret: "",
      oldAppSummaryForm: {
        oldName: "",
        oldRemark: "",
      },

      rules: {
        name: [
          {
            required: true,
            message: this.$t("app.appOverView.5ix5wo2ke3s0"),
            trigger: "blur",
          },
          {
            min: 2,
            max: 20,
            message: this.$t("app.appOverView.5ix5wo2keak0"),
            trigger: "blur",
          },
        ],
        remark: [
          {
            required: true,
            message: this.$t("app.appOverView.5ix5wo2kef00"),
            trigger: "blur",
          },
          {
            min: 10,
            max: 200,
            message: this.$t("app.appOverView.5ix5wo2kej40"),
            trigger: "blur",
          },
        ],
      },
      submitButtonLoading: false,
      submitButtonDebounceTimer: null,
    };
  },

  created() {
    this.fetchAppSummary();
  },
  methods: {
    fetchAppSummary() {
      let url = "/app/getApp";
      request({
        url: url,
        method: "get",
        params: { id: this.$route.params.id },
      })
        .then((rsp) => {
          this.appSummaryForm = rsp.data;
          this.$emit("updateTitle", this.appSummaryForm);
          delete this.appSummaryForm.createTime;
          delete this.appSummaryForm.updateTime;
          delete this.appSummaryForm.ts;
          this.oldAppSummaryForm.oldName = this.appSummaryForm.name;
          this.oldAppSummaryForm.oldRemark = this.appSummaryForm.remark;
          this.systemSource = this.appSummaryForm.systemSource;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    onClickSubmitButton(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          clearTimeout(this.submitButtonDebounceTimer);
          this.submitButtonDebounceTimer = setTimeout(() => {
            this.submitButtonLoading = true;
            request({
              url: "/app/saveAppBaseInfo",
              method: "post",
              params: this.appSummaryForm,
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
              },
            })
              .then((rsp) => {
                Message.success(this.$t("app.appOverView.5ix5wo2kemw0"));
                this.editer.status = true;
                this.submitButtonLoading = false;
                this.fetchAppSummary();
              })
              .catch((e) => {
                //Message.error("应用信息修改失败" + e)
                console.log(e);
                this.submitButtonLoading = false;
              });
          }, 300);
        } else {
          return false;
        }
      });
    },

    cancelAppForm(formName) {
      this.$refs[formName].clearValidate();
      this.editer.status = true;
      this.appSummaryForm.name = this.oldAppSummaryForm.oldName;
      this.appSummaryForm.remark = this.oldAppSummaryForm.oldRemark;
    },

    editerForm(formName) {
      this.editer.status = false;
    },

    copyAppKey() {
      let appKeyInput = document.createElement("input");
      appKeyInput.value = this.appSummaryForm.code;
      document.body.appendChild(appKeyInput);
      appKeyInput.select();
      if (document.execCommand("Copy") === true) {
        appKeyInput.className = "appKeyInput";
        appKeyInput.style.display = "none";
        Message.success(this.$t("app.appOverView.5ix5wo2keqo0"));
      } else {
        Message.error(this.$t("app.appOverView.5ix5wo2kf9g0"));
      }
    },

    copyAppSecret() {
      let appSecretInput = document.createElement("input");
      appSecretInput.value =
        this.appSummaryForm.type == 3 ||
        this.appSummaryForm.type == 4 ||
        this.appSummaryForm.type == 5
          ? this.appSummaryForm.gatewaySecret
          : this.appSummaryForm.secret;
      document.body.appendChild(appSecretInput);
      appSecretInput.select();
      if (document.execCommand("Copy") === true) {
        appSecretInput.className = "appSecretInput";
        appSecretInput.style.display = "none";
        Message.success(this.$t("app.appOverView.5ix5wo2kffw0"));
      } else {
        Message.error(this.$t("app.appOverView.5ix5wo2kflc0"));
      }
    },

    displayAppSecret(display) {
      this.secretDisplay = display;
    },

    copyRSAIdKey() {
      let rsaIdInput = document.createElement("input");
      rsaIdInput.value = this.appSummaryForm.pkiid;
      document.body.appendChild(rsaIdInput);
      rsaIdInput.select();
      if (document.execCommand("Copy") === true) {
        rsaIdInput.className = "rsaIdInput";
        rsaIdInput.style.display = "none";
        Message.success(this.$t("app.appOverView.5ix5wo2kfp00"));
      } else {
        Message.error(this.$t("app.appOverView.5ix5wo2kfsg0"));
      }
    },
    copyPublicSecret() {
      let rsaPublicSecretInput = document.createElement("input");
      rsaPublicSecretInput.value = this.publicSecret;
      document.body.appendChild(rsaPublicSecretInput);
      rsaPublicSecretInput.select();
      if (document.execCommand("Copy") === true) {
        rsaPublicSecretInput.className = "rsaPublicSecretInput";
        rsaPublicSecretInput.style.display = "none";
        Message.success(this.$t("app.appOverView.5ix5wo2kfp00"));
      } else {
        Message.error(this.$t("app.appOverView.5ix5wo2kfsg0"));
      }
    },
    displayPublicSecret(display) {
      let url = "/app/getPKI";
      request({
        url: url,
        method: "get",
        params: { id: this.$route.params.id, PKIId: this.appSummaryForm.pkiid },
      })
        .then((rsp) => {
          console.log(rsp.data);
          this.publicSecret = rsp.data;
        })
        .catch((e) => {
          console.log(e);
        });
      this.publicSecretDisplay = display;
    },
  },
};
</script>
<style scoped>
.overview-appSummaryForm {
  padding: 0px;
  width: 50%;
}
.el-icon-help-solid {
  color: #3c6ef0;
}
</style>
