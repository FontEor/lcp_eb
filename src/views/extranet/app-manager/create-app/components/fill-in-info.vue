<template>
  <div class="fill-in-info">
    <div v-if="authType !== 4">
      <div
        style="
          text-align: center;
          padding: 0 50px;
          margin-bottom: 60px;
          color: #666666;
        "
      >
        {{ $t("createApp.appMessage.5ix5y55ugig0") }}
      </div>
    </div>
    <div v-if="authType === 4 && form.systemSource === 'jos'">
      <div style="margin-bottom: 4rem; color: #666666; margin-left: -4rem">
        请输入您在JOS平台创建的应用信息，我们将同步JOS的应用信息到物流开放平台。若无JOS应用，【创建方式】请选择【在开放平台新建】。
      </div>
    </div>
    <el-form ref="form" :model="form" label-width="150px" :rules="rules">
      <el-form-item v-if="authType === 4">
        <template slot="label">
          <span>
            创建方式
            <el-tooltip
              class="item"
              effect="dark"
              content="若您在宙斯平台有应用，可将您在宙斯平台创建的应用信息同步到物流开放平台。"
              placement="top"
            >
              <i class="el-icon-info"></i> </el-tooltip
            >:</span
          >
        </template>
        <el-radio-group v-model="form.systemSource" @change="resetForm('form')">
          <el-radio label="lcp">在开放平台新建</el-radio>
          <el-radio label="jos">从宙斯导入</el-radio>
        </el-radio-group>
      </el-form-item>
      <div v-if="form.systemSource === 'lcp'">
        <el-form-item
          :label="$t('createApp.appMessage.5ix5y55ui1w1')"
          prop="name"
        >
          <div>
            <el-input
              class="el-input"
              v-model="form.name"
              :placeholder="$t('createApp.appMessage.5ix5y55ui1w2')"
            >
            </el-input>
          </div>
        </el-form-item>
        <el-form-item
          :label="$t('createApp.appMessage.5ix5y55ui1w3')"
          prop="remark"
        >
          <el-input
            type="textarea"
            v-model="form.remark"
            :placeholder="$t('createApp.appMessage.5ix5y55ui1w4')"
          ></el-input>
        </el-form-item>
      </div>
      <div v-else>
        <el-form-item label="JOS应用AppKey:" prop="code">
          <el-input
            v-model.trim="form.code"
            placeholder="请输入JOS平台应用的AppKey。"
          ></el-input>
        </el-form-item>
        <el-form-item label="JOS应用名称:" prop="JOSName">
          <el-input
            v-model.trim="form.JOSName"
            placeholder="请输入JOS平台应用的应用名称。"
          ></el-input>
        </el-form-item>
        <el-form-item label="JOS应用AppSecret:" prop="gatewaySecret">
          <el-input
            v-model.trim="form.gatewaySecret"
            placeholder="请输入JOS平台应用的AppSecret。"
          ></el-input>
        </el-form-item>
      </div>
      <div style="text-align: center">
        <el-button v-on:click="previous">{{
          $t("createApp.appMessage.5ix5y55uh740")
        }}</el-button>
        <el-button type="primary" @click="onSubmit">{{
          $t("createApp.appMessage.5ix5y55uhd00")
        }}</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import request from "@/utils/request";

export default {
  name: "FillInInfo",
  props: {
    authType: Number,
  },
  data() {
    return {
      submitDebounceTimer: null,
      submitLoading: false,
      form: {
        systemSource: "lcp",
        name: "",
        remark: "",
        code: "",
        gatewaySecret: "",
        JOSName: "",
      },
      rules: {
        name: [
          {
            required: true,
            message: this.$t("createApp.appMessage.5ix5y55uhqg0"),
            trigger: "blur",
          },
          {
            min: 2,
            max: 20,
            message: this.$t("createApp.appMessage.5ix5y55uhtw0"),
            trigger: "change",
          },
        ],
        remark: [
          {
            required: true,
            message: this.$t("createApp.appMessage.5ix5y55uhy40"),
            trigger: "blur",
          },
          {
            min: 10,
            max: 200,
            message: this.$t("createApp.appMessage.5ix5y55ui1w0"),
            trigger: "blur",
          },
        ],
        gatewaySecret: [
          {
            required: true,
            message: "请输入JOS应用AppSecret",
            trigger: "blur",
          },
          {
            min: 1,
            max: 50,
            message: "最大不能超过50个字符",
            trigger: "blur",
          },
        ],
        code: [
          {
            required: true,
            message: "请输入JOS应用AppKey",
            trigger: "blur",
          },
          {
            min: 1,
            max: 50,
            message: "最大不能超过50个字符",
            trigger: "blur",
          },
        ],
        JOSName: [
          {
            required: true,
            message: "请输入JOS应用名称",
            trigger: "blur",
          },
          {
            min: 1,
            max: 100,
            message: "最大不能超过100个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    //回退到上一步
    previous() {
      this.$emit("previous");
    },
    /**
     * 提交
     */
    onSubmit() {
      clearTimeout(this.submitDebounceTimer);
      this.submitDebounceTimer = setTimeout(() => {
        this.$refs["form"].validate((valid) => {
          if (valid) {
            this.form.type = this.authType;
            this.submitLoading = true;
            const formData = {};
            if (this.form.systemSource === "lcp") {
              Object.assign(formData, {
                type: this.form.type,
                name: this.form.name,
                remark: this.form.remark,
                systemSource: this.form.systemSource,
              });
            } else {
              Object.assign(formData, {
                type: this.form.type,
                name: this.form.JOSName,
                gatewaySecret: this.form.gatewaySecret,
                systemSource: this.form.systemSource,
                code: this.form.code,
                remark: "新功能,jdos应用导入功能相关数据。",
              });
            }
            request({
              url: "/app/addAppInfo",
              method: "post",
              params: formData,
            })
              .then((rsp) => {
                if (rsp.code === 20000) {
                  this.$emit("transferAppId", rsp.data);
                  this.$emit("next");
                }
                this.submitLoading = false;
              })
              .catch((e) => {
                this.submitLoading = false;
                console.log(e);
              });
          } else {
            return false;
          }
        });
      }, 300);
    },
  },
  mounted() {
    console.log("appMessage", this.authType);
  },
};
</script>

<style lang="scss" scoped>
.fill-in-info {
  width: 50%;
  margin: 0 auto;
  h4 {
    margin-bottom: 40px;
    font-size: 18px;
    color: #333333;
    text-align: center;
  }
  h3 {
    margin-bottom: 20px;
    font-size: 24px;
    color: #333333;
  }
}
</style>
