<template>
  <div class="overview">
    <div class="overview-container">
      <p class="sub-title">基础信息</p>
      <el-form
        :model="appBasicForm"
        :rules="appBasicRules"
        ref="appBasicForm"
        label-width="130px"
      >
        <el-form-item label="应用中文名称:" prop="name">
          <el-input
            v-if="editable"
            v-model="appBasicForm.name"
            placeholder="请输入当前APP应用中文名称,2-20个字符."
            style="width: 30%"
          ></el-input>
          <span v-if="!editable">{{
            appBasicForm.name === "" ? "未填写" : appBasicForm.name
          }}</span>
        </el-form-item>

        <el-form-item label="应用描述:" prop="remark">
          <el-input
            v-if="editable"
            type="textarea"
            v-model="appBasicForm.remark"
            placeholder="请描述当前APP应用,10-200个字符."
            style="width: 50%"
          ></el-input>
          <span v-if="!editable">{{
            appBasicForm.remark === "" ? "未填写" : appBasicForm.remark
          }}</span>
        </el-form-item>
        <el-form-item label="appKey:" prop="code">
          <span
            >{{ appBasicForm.code }}
            <el-tooltip
              class="item"
              effect="dark"
              content="复制AppKey"
              placement="top"
              ><a @click="copyAppKey"
                ><i class="el-icon-document-copy" /></a></el-tooltip
          ></span>
        </el-form-item>
        <el-form-item label="appSecret:">
          <span v-if="secretDisplay === true">
            {{ secretMeg }}
            <el-tooltip
              class="item"
              effect="dark"
              content="复制AppSecret"
              placement="top"
            >
              <a @click="copyAppSecret"><i class="el-icon-document-copy" /> </a>
            </el-tooltip>
            <a style="color: #3c6ef0" @click="secretDisplay = false">
              隐藏</a
            ></span
          >
          <span v-else
            ><a @click="secretDisplay = true" style="color: #3c6ef0"
              >查看</a
            ></span
          >
        </el-form-item>
        <el-form-item label="应用分类:">
          {{
            appBasicForm.productCode + "-" + appBasicForm.sysVersionName
          }}</el-form-item
        >
        <el-row
          v-if="env === 'local' || env === 'devtest' || env === 'publictest'"
        >
          <el-col :span="8">
            <el-form-item label="测试环境应用域名:">
              <span class="copy-text">{{ appBasicForm.appDomain }}</span>
              <a
                v-clipboard:copy="appBasicForm.appDomain"
                v-clipboard:success="onCopy"
                v-clipboard:error="onError"
                ><i class="el-icon-document-copy"
              /></a>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="测试环境JSF别名:">
              <span class="copy-text">{{ appBasicForm.jsfAlias }}</span>
              <a
                v-clipboard:copy="appBasicForm.jsfAlias"
                v-clipboard:success="onCopy"
                v-clipboard:error="onError"
                ><i class="el-icon-document-copy"
              /></a>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="env === 'uat' || env === 'prod'">
          <el-col :span="8">
            <el-form-item label="预发环境应用域名:">
              <span class="copy-text">{{ appBasicForm.appDomainUat }}</span>
              <a
                v-clipboard:copy="appBasicForm.appDomainUat"
                v-clipboard:success="onCopy"
                v-clipboard:error="onError"
                ><i class="el-icon-document-copy"
              /></a>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="预发环境JSF别名:">
              <span class="copy-text">{{ appBasicForm.jsfAliasUat }}</span>
              <a
                v-clipboard:copy="appBasicForm.jsfAliasUat"
                v-clipboard:success="onCopy"
                v-clipboard:error="onError"
                ><i class="el-icon-document-copy"
              /></a>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="env === 'uat' || env === 'prod'">
          <el-col :span="8">
            <el-form-item label="生产环境应用域名:">
              <span class="copy-text">{{ appBasicForm.appDomain }}</span>
              <a
                v-clipboard:copy="appBasicForm.appDomain"
                v-clipboard:success="onCopy"
                v-clipboard:error="onError"
                ><i class="el-icon-document-copy"
              /></a>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="生产环境JSF别名:"
              ><span class="copy-text">{{ appBasicForm.jsfAlias }}</span>
              <a
                v-clipboard:copy="appBasicForm.jsfAlias"
                v-clipboard:success="onCopy"
                v-clipboard:error="onError"
                ><i class="el-icon-document-copy"
              /></a>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <p class="sub-title">测试验证</p>
      <el-form label-width="130px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="租户名:">
              <span>{{ appBasicForm.supplierName }}</span></el-form-item
            >
          </el-col>
          <el-col :span="8">
            <el-form-item label="租户编码:">
              <span>{{ appBasicForm.supplierCode }}</span></el-form-item
            >
          </el-col>
        </el-row>
        <el-row
          v-if="env === 'local' || env === 'devtest' || env === 'publictest'"
        >
          <el-form-item label="测试环境:">
            <span class="copy-text">{{ appBasicForm.productDomainName }}</span>
            <a
              v-clipboard:copy="appBasicForm.productDomainName"
              v-clipboard:success="onCopy"
              v-clipboard:error="onError"
              ><i class="el-icon-document-copy"
            /></a>
          </el-form-item>
        </el-row>
        <el-row v-else-if="env === 'uat' || env === 'prod'">
          <el-col :span="8">
            <el-form-item label="预发环境:">
              <span class="copy-text">{{
                appBasicForm.productUatDomainName
              }}</span>
              <a
                v-clipboard:copy="appBasicForm.productUatDomainName"
                v-clipboard:success="onCopy"
                v-clipboard:error="onError"
                ><i class="el-icon-document-copy"
              /></a>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="生产环境:"
              ><span class="copy-text">{{
                appBasicForm.productDomainName
              }}</span>
              <a
                v-clipboard:copy="appBasicForm.productDomainName"
                v-clipboard:success="onCopy"
                v-clipboard:error="onError"
                ><i class="el-icon-document-copy"
              /></a>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <StickyWrapper>
      <el-button v-if="!editable" type="primary" @click="handleEdit"
        >编辑</el-button
      >
      <div v-else class="button-wrapper">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </div>
    </StickyWrapper>
  </div>
</template>

<script>
import StickyWrapper from "@/components/StickyWrapper.vue";
import appManager from "@/api/intranet/appManager/index.js";

export default {
  name: "Overview",
  components: { StickyWrapper },
  props: {
    appBasicForm: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      editable: false,
      appBasicRules: {
        name: [
          { required: true, message: "请输入应用中文名称", trigger: "blur" },
          { min: 2, max: 20, message: "长度在2到20个字符", trigger: "blur" },
        ],
        remark: [
          { required: true, message: "请输入应用描述信息", trigger: "blur" },
          {
            min: 10,
            max: 200,
            message: "长度在10到200个字符",
            trigger: "blur",
          },
        ],
      },
      secretDisplay: false,
      env: window.env.buildEnv,
    };
  },
  computed: {
    secretMeg() {
      if (
        this.appBasicForm.type === 3 ||
        this.appBasicForm.type === 4 ||
        this.appBasicForm.type === 5 ||
        this.appBasicForm.type === 7
      ) {
        return this.appBasicForm.gatewaySecret;
      } else {
        return this.appBasicForm.secret;
      }
    },
  },
  methods: {
    handleEdit() {
      this.editable = true;
    },
    handleCancel() {
      this.$emit("updateAppStatus");
      this.$refs["appBasicForm"].resetFields();
      this.editable = false;
    },
    handleSave() {
      this.$refs["appBasicForm"].validate((valid) => {
        if (valid) {
          this.updateProductAppInfo();
        } else {
          return false;
        }
      });
    },
    async updateProductAppInfo() {
      const id = this.$route.params.id;
      const name = this.appBasicForm.name;
      const remark = this.appBasicForm.remark;
      const data = { id, name, remark };
      const response = await appManager.updateProductAppInfo(data);
      if (response) {
        this.$message.success("应用信息修改成功");
        this.editable = false;
        this.$emit("updateAppStatus");
      }
    },
    copyAppKey() {
      let appKeyInput = document.createElement("input");
      appKeyInput.value = this.appBasicForm.code;
      document.body.appendChild(appKeyInput);
      appKeyInput.select();
      if (document.execCommand("Copy") === true) {
        appKeyInput.className = "appKeyInput";
        appKeyInput.style.display = "none";
        this.$message.success("已经成功复制AppKey");
      } else {
        this.$message.error("复制AppKey失败");
      }
    },
    copyAppSecret() {
      let appSecretInput = document.createElement("input");
      appSecretInput.value =
        this.appBasicForm.type == 3 ||
        this.appBasicForm.type == 4 ||
        this.appBasicForm.type == 5 ||
        this.appBasicForm.type == 7
          ? this.appBasicForm.gatewaySecret
          : this.appBasicForm.secret;
      document.body.appendChild(appSecretInput);
      appSecretInput.select();
      if (document.execCommand("Copy") === true) {
        appSecretInput.className = "appSecretInput";
        appSecretInput.style.display = "none";
        this.$message.success("已经成功复制AppSecret");
      } else {
        this.$message.error("复制AppSecret失败");
      }
    },
    onCopy(e) {
      this.$message.success("复制成功");
    },
    onError(e) {
      this.$message.error("复制失败");
    },
  },
};
</script>

<style lang="scss" scoped>
.overview {
  .overview-container {
    padding: 20px;
    .sub-title {
      margin-bottom: 22px;
      padding: 0 8px;
      border-left: 4px solid #3c6ef0;
      font-size: 16px;
      font-weight: 600;
    }
    .copy-text {
      margin-right: 4px;
    }
  }
}
</style>