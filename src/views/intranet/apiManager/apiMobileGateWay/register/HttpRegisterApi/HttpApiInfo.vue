<template>
  <div>
    <p class="protocol-desc">请填写API基本信息</p>
    <div class="protocol-content">
      <el-form
        :model="httpForm"
        :rules="httpFormrules"
        ref="httpForm"
        label-width="126px"
      >
        <el-form-item prop="name">
          <span slot="label">
            API中文名称&nbsp;<el-tooltip
              class="item"
              content="API的中文名称，如：快运纯配下单接口"
              placement="top"
              ><i style="color: #3c6ef0" class="el-icon-help"
            /></el-tooltip>
          </span>
          <el-col :span="18">
            <el-input
              v-model="httpForm.name"
              placeholder="请输入API中文名称"
            ></el-input>
          </el-col>
        </el-form-item>
        <el-form-item prop="lcpApp">
          <span slot="label">
            所属应用&nbsp;<el-tooltip
              class="item"
              content="API发布者调用自己的API时，可使用此应用进行签名认证。"
              placement="top"
              ><i style="color: #3c6ef0" class="el-icon-help"
            /></el-tooltip>
          </span>
          <el-col :span="18">
            <el-select
              style="width: 100%"
              v-model="httpForm.lcpApp"
              :filterable="true"
              value-key="lcpAppId"
              placeholder="请选择API所属应用"
            >
              <el-option
                v-for="item in appOptions"
                :key="item.lcpAppId"
                :label="item.lcpAppName"
                :value="item"
              >
              </el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item prop="domain">
          <span slot="label">
            所属分组&nbsp;<el-tooltip
              class="item"
              content="同一使用场景的API组成分组，可在分组维度下配置策略/集群，对分组下更新的API进行批量的发布。"
              placement="top"
              ><i style="color: #3c6ef0" class="el-icon-help"
            /></el-tooltip>
          </span>
          <el-col :span="18">
            <el-select
              style="width: 100%"
              v-model="httpForm.domain"
              :filterable="true"
              value-key="domainId"
              placeholder="请选择API所属分组"
            >
              <el-option
                v-for="item in domainOptions"
                :key="item.domainId"
                :label="item.domainName + '(' + item.domainCode + ')'"
                :value="item"
              >
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="6">
            <el-button type="text" @click="createGroup">+创建分组</el-button>
          </el-col>
        </el-form-item>
        <el-form-item prop="url">
          <span slot="label">
            URI&nbsp;<el-tooltip
              class="item"
              content="HTTP接口的URI，调用方会根据URI进行调用，如：/order/cancelOrder"
              placement="top"
              ><i style="color: #3c6ef0" class="el-icon-help"
            /></el-tooltip>
          </span>
          <el-col :span="18">
            <el-input
              v-model="httpForm.url"
              placeholder="发布后的请求路径，例如：/u1"
            ></el-input>
          </el-col>
        </el-form-item>
        <el-button @click="previous">上一步</el-button>
        <el-button
          type="primary"
          @click="nextStep('httpForm')"
          v-loading.fullscreen.lock="fullscreenLoading"
          >确认注册
        </el-button>
      </el-form>
      <el-dialog title="创建应用" width="440px" :visible.sync="showAppDialog">
        <el-form :model="appForm">
          <el-form-item label-width="110px">
            <span slot="label">
              应用名称&nbsp;<el-tooltip
                class="item"
                content="应用的中文名称，如：京东物流小程序"
                placement="top"
                ><i style="color: #3c6ef0" class="el-icon-help"
              /></el-tooltip>
            </span>
            <el-input
              v-model="appForm.name"
              placeholder="请输入应用中文名称"
            ></el-input>
          </el-form-item>
          <el-form-item label-width="110px">
            <span slot="label">
              应用描述&nbsp;<el-tooltip
                class="item"
                content="应用使用场景的描述，如：用于京东物流小程序注册API、调用API"
                placement="top"
                ><i style="color: #3c6ef0" class="el-icon-help"
              /></el-tooltip>
            </span>
            <el-input
              type="textarea"
              v-model="appForm.name"
              placeholder="请输入应用使用场景的描述"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="footer">
          <el-button @click="showAppDialog = false">取 消</el-button>
          <el-button type="primary" @click="showAppDialog = false"
            >保 存
          </el-button>
        </div>
      </el-dialog>
    </div>
    <el-dialog
      title="创建分组"
      width="500px"
      :close-on-click-modal="false"
      @close="closeGroupForm"
      :visible.sync="showGroupDialog"
      style="text-align: left"
    >
      <el-form :model="groupForm" ref="groupForm" :rules="groupFormRules">
        <el-form-item label-width="130px" prop="code">
          <span slot="label">
            分组英文名称&nbsp;<el-tooltip
              class="item"
              content="分组的英文编码，调用API时需要在LOP-DN字段中传。"
              placement="top"
              ><i style="color: #3c6ef0" class="el-icon-help"
            /></el-tooltip>
          </span>
          <el-input
            v-model="groupForm.code"
            placeholder="请输入分组编码"
          ></el-input>
        </el-form-item>
        <el-form-item label-width="130px" prop="cnName">
          <span slot="label">
            分组中文名称&nbsp;<el-tooltip
              class="item"
              content="分组的中文名称，如：技术开放平台产品组的分组。"
              placement="top"
              ><i style="color: #3c6ef0" class="el-icon-help"
            /></el-tooltip>
          </span>
          <el-input
            v-model="groupForm.cnName"
            placeholder="请输入分组中文名称"
          ></el-input>
        </el-form-item>
        <el-form-item label-width="130px" prop="intr">
          <span slot="label">
            分组描述&nbsp;<el-tooltip
              class="item"
              content="具体描述分组下一类API的应用场景，如：基础平台组为云仓物控平台项目提供的API组，调用方设备为PC端，账号体系为passport。"
              placement="top"
              ><i style="color: #3c6ef0" class="el-icon-help"
            /></el-tooltip>
          </span>
          <el-input
            type="textarea"
            v-model="groupForm.intr"
            placeholder="请输入分组使用场景的描述"
          ></el-input>
        </el-form-item>
        <el-form-item label-width="130px" prop="serviceType">
          <span slot="label">
            发布范围&nbsp;<el-tooltip
              class="item"
              content="发布到内网，仅内网可用。发布到公网，内网、公网均可用"
              placement="top"
              ><i style="color: #3c6ef0" class="el-icon-help"
            /></el-tooltip>
          </span>
          <el-radio v-model="groupForm.serviceType" :label="1"
            >发布到内网
          </el-radio>
          <el-radio v-model="groupForm.serviceType" :label="2"
            >发布到公网
          </el-radio>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="onCancle">取 消</el-button>
        <el-button
          type="primary"
          @click="saveGroupForm('groupForm')"
          :loading="loading"
          >确认创建
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import apiManager from "@/api/intranet/apiManager/index";

export default {
  props: {
    type: Number,
  },
  data() {
    return {
      apiId: 0,
      httpForm: {
        domain: {},
      },
      httpFormrules: {
        name: [{ required: true, message: "API中文名称不能为空" }],
        lcpApp: [{ required: true, message: "所属应用不能为空" }],
        domain: [{ required: true, message: "所属分组不能为空" }],
        url: [
          { required: true, message: "URI不能为空", trigger: "blur" },
          {
            min: 1,
            max: 100,
            message: "长度在 1 到 100 个字符",
          },
          {
            pattern: /^\//,
            message: "格式不正确,以“/”开头！",
          },
          {
            pattern: /^\/[a-zA-Z0-9_\{\}\.\/-]*$/,
            message: "请输入'/'、英文字母、数字、'_'、'-'、'.'、'{'、'}'",
          },
        ],
      },
      appForm: {},
      groupForm: {
        intr: "",
        cnName: "",
        code: "",
        serviceType: 1,
        uatClusterId: null,
        uatClusterName: null,
        testClusterId: null,
        testClusterName: null,
        prodClusterId: null,
        prodClusterName: null,
      },
      groupFormRules: {
        intr: [{ required: true, message: "分组描述不能为空" }],
        cnName: [{ required: true, message: "分组中文名称不能为空" }],
        code: [
          { required: true, message: "分组英文名称不能为空" },
          { min: 2, max: 30, message: "请输入2-30个字符" },
          { pattern: /^[A-Za-z_]*$/, message: "请输入英文字母、_" },
        ],
        serviceType: [{ required: true, message: "发布范围不能为空" }],
      },
      showAppDialog: false,
      showGroupDialog: false,
      domainOptions: [],
      appOptions: [],
      apiId: 0,
      fullscreenLoading: false,
      loading: false,
    };
  },
  mounted() {
    this.getAppListForSelect();
    this.remoteDomain();
  },
  methods: {
    async getAppListForSelect() {
      const response = await this.findAppListForSelect();
      let { data } = response.data;
      if (data && data.length > 0) {
        data = data.map((item) => {
          const lcpAppId = item.value;
          const lcpAppKey = item.code;
          const lcpAppName = item.label;
          return { lcpAppId, lcpAppKey, lcpAppName };
        });
      }
      this.appOptions = data;
    },
    async findAppListForSelect() {
      return await apiManager.findAppListForSelect().catch((error) => {
        const { message } = error.data;
        message && this.$message.error(message);
        throw new Error(error);
      });
    },
    // API分组模糊查询
    async remoteDomain(query) {
      if (query !== "") {
        const response = await this.queryCloudDomainList(query);
        const data = response.data;
        let { rows } = data;
        if (rows && rows.length > 0) {
          rows = rows.map((item) => {
            const domainId = item.id;
            const domainCode = item.code;
            const domainName = item.cnName;
            return { domainId, domainCode, domainName };
          });
        }
        this.domainOptions = rows;
      } else {
        this.domainOptions = [];
      }
    },
    async queryCloudDomainList(query) {
      const keyWords = query;
      const isOnline = null;
      const page = 1;
      const pageSize = 10000;
      const type = this.type;
      const data = [
        { page, pageSize },
        { queryLike: keyWords, type, isOnline, sceneType: 3 },
      ];
      return await apiManager.queryCloudDomainList(data).catch((error) => {
        const { message } = error.data;
        message && this.$message.error(message);
        throw new Error(error);
      });
    },

    nextStep(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          //需要先获得分组的集群
          this.getGroupCluster(this.httpForm.domain.domainId);
        } else {
          return false;
        }
      });
    },
    submit() {
      this.fullscreenLoading = true;
      const type = this.type;
      const name = this.httpForm.name;
      const lcpAppId = this.httpForm.lcpApp.lcpAppId;
      const lcpAppName = this.httpForm.lcpApp.lcpAppName;
      const lcpAppKey = this.httpForm.lcpApp.lcpAppKey;
      const domainCode = this.httpForm.domain.domainCode;
      const domainId = this.httpForm.domain.domainId;
      const domainName = this.httpForm.domain.domainName;
      const url = this.httpForm.url;
      const testClusterId = this.groupForm.testClusterId;
      const testClusterName = this.groupForm.testClusterName;
      const uatClusterId = this.groupForm.uatClusterId;
      const uatClusterName = this.groupForm.uatClusterName;
      const prodClusterId = this.groupForm.prodClusterId;
      const prodClusterName = this.groupForm.prodClusterName;
      const sceneType = 3;
      const data = {
        type,
        lcpAppId,
        name,
        lcpAppName,
        lcpAppKey,
        domainCode,
        domainId,
        domainName,
        url,
        testClusterId,
        testClusterName,
        uatClusterId,
        uatClusterName,
        prodClusterId,
        prodClusterName,
        sceneType,
      };
      console.log("this.groupForm", this.groupForm);
      console.log("data", data);
      apiManager.httpRegister
        .addHttpApi([data])
        .then((res) => {
          this.apiId = res.data;
          this.fullscreenLoading = false;
          this.$emit("getApiId", this.apiId);
          this.$emit("next");
        })
        .catch((error) => {
          this.fullscreenLoading = false;
          console.log(error);
        });
    },
    previous() {
      this.$emit("previous");
    },
    createGroup() {
      this.showGroupDialog = true;
    },
    createApp() {
      this.showAppDialog = true;
    },
    onCancle() {
      this.$refs["groupForm"].resetFields();
      this.showGroupDialog = false;
    },
    closeGroupForm() {
      this.$refs["groupForm"].resetFields();
    },
    saveGroupForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true;
          const intr = this.groupForm.intr;
          const type = this.type;
          const cnName = this.groupForm.cnName;
          const code = this.groupForm.code;
          const serviceType = this.groupForm.serviceType;
          const data = [
            {
              description: intr,
              type: type,
              name: cnName,
              code: code,
              serviceType: serviceType,
              sceneType: 3,
            },
          ];
          apiManager.httpRegister
            .saveCloudDomain(data)
            .then((res) => {
              const { code, id, name } = res.data;
              const domain = {
                domainCode: code,
                domainId: id,
                domainName: name,
              };
              this.httpForm.domain = domain;
              this.loading = false;
              this.showGroupDialog = false;
              this.$refs[formName].resetFields();
              this.remoteDomain();
              this.httpForm.domain = domain;
            })
            .catch((error) => {
              this.loading = false;
              console.log(error);
            });
        } else {
          return false;
        }
      });
    },
    //获得分组的集群
    getGroupCluster(domainId) {
      let params = [{ id: domainId }];
      apiManager.apiGroup
        .getCloudDomainBase(params)
        .then((res) => {
          if (res.data.testClusterId > 0) {
            this.groupForm.testClusterId = res.data.testClusterId;
            this.groupForm.testClusterName = res.data.testClusterName;
          }
          if (res.data.uatClusterId > 0) {
            this.groupForm.uatClusterId = res.data.uatClusterId;
            this.groupForm.uatClusterName = res.data.uatClusterName;
          }
          if (res.data.prodClusterId > 0) {
            this.groupForm.prodClusterId = res.data.prodClusterId;
            this.groupForm.prodClusterName = res.data.prodClusterName;
          }
          console.log("this.groupForm1", this.groupForm);
          this.submit();
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.protocol-desc {
  margin-top: 40px;
  font-size: 16px;
}

.protocol-content {
  width: 500px;
  margin: 40px auto;
}

.footer {
  text-align: center;
}
</style>
