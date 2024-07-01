<template>
  <div class="my-wrap">
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="myEntryFormBox"
    >
      <el-form-item label="API" prop="qualifiedName"
        ><el-input v-model="ruleForm.qualifiedName" :disabled="true"></el-input
      ></el-form-item>
      <el-form-item label="中文名称" prop="cnName"
        ><el-input v-model="ruleForm.cnName"></el-input
      ></el-form-item>
      <el-form-item label="所属应用" prop="value">
        <el-select
          v-model="ruleForm.value"
          placeholder="请选择应用"
          style="width: 100%"
        >
          <el-option
            v-for="item in ruleForm.options"
            :key="item.value"
            :label="item.label"
            :value="item.code"
          ></el-option>
        </el-select>
      </el-form-item>
      <div style="text-align: center">
        <el-button :disabled="openIsDisabled" type="" @click="prestep()"
          >上一步</el-button
        >
        <el-button
          :disabled="openIsDisabled"
          type="primary"
          style=""
          @click="submitForm('ruleForm')"
          >确认注册</el-button
        >
      </div>
    </el-form>
  </div>
</template>

<script>
import request from "@/utils/request";
import gwApiRequest from "@/utils/gwApiRequest.js";

export default {
  props: {
    apiMessage: Object,
  },
  data() {
    return {
      openIsDisabled: false,
      xmlStr: "",
      ruleForm: {
        options: "",
        value: "",
        cnName: "",
        qualifiedName: "",
      },
      rules: {
        value: [{ required: true, message: "请选择应用", trigger: "change" }],
        cnName: [
          { required: true, message: "请填写API名称", trigger: "blur" },
          {
            min: 2,
            max: 255,
            message: "长度在 2 到 255 个字符",
            trigger: "blur",
          },
        ],
        qualifiedName: [
          { required: true, message: "API不能为空", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    async saveApi() {
      const { qualifiedName, cnName, value } = this.ruleForm;
      const appCode = value;
      const apiXml = this.xmlStr;
      const { registerType } = this.apiMessage;
      const { jsfAlias } = this.apiMessage.jsfDate;
      const data = [
        { qualifiedName, cnName, appCode, apiXml, registerType, jsfAlias, sceneType: 1 },
      ];
      return await gwApiRequest.post(
        "/ApiManagerService/saveApi",
        JSON.stringify(data)
      );
    },

    submitForm(formName) {
      if ((this.ruleForm.xmlStr = "")) {
        this.$message.error("文件为空!");
        return false;
      }
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          this.openIsDisabled = true;
          await this.saveApi().catch((error) => {
            let _this = this;
            let time = 5;
            let intervalID = window.setInterval(function () {
              time--;
              if (time <= 0) {
                clearInterval(intervalID);
                _this.openIsDisabled = false;
              }
            }, 1000);
            console.log(error);
            throw new Error("submitForm saveApi" + error);
          });
          sessionStorage.removeItem("apiXml");
          this.apiMessage.qualifiedName = this.ruleForm.qualifiedName;
          this.$emit("next");
          this.openIsDisabled = false;
        } else {
          return false;
        }
      });
    },
    prestep() {
      // sessionStorage.removeItem("apiXml");
      this.$emit("previous");
    },
  },
  created() {
    this.ruleForm.qualifiedName = this.apiMessage.qualifiedName;
    this.xmlStr = unescape(sessionStorage.getItem("apiXml"));
    let url = "/select/findAppListForSelect";
    request({
      url: url,
      method: "get",
    })
      .then((rsp) => {
        this.ruleForm.options = rsp.data;
      })
      .catch((e) => {
        console.log(e);
      });
  },
};
</script>

<style lang="scss" scoped>
.myEntryFormBox {
  width: 420px;
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
