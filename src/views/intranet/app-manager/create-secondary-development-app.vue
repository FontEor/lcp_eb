<template>
  <div class="create-app">
    <!-- 标题 -->
    <Title text="创建应用" />
    <!-- 步骤条 -->
    <Steps :active="active" :titleList="titleList" />

    <!-- 填写信息表单 -->
    <div v-show="active === 1" class="basic-info-form-wrapper">
      <el-form
        class="basic-info-form"
        ref="basicInfoForm"
        label-width="80px"
        :model="basicInfoFormData"
        :rules="basicInfoFormRules"
      >
        <!-- 应用版本 -->
        <el-form-item label="应用版本" prop="sysVersionId">
          <el-select
            v-model="basicInfoFormData.sysVersionId"
            placeholder="请选择应用版本"
            style="width: 100%"
            :loading="selectSysVersionIdLoading"
          >
            <el-option
              v-for="item in sysVersionOptionList"
              :key="item.id"
              :label="item.versionName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- 应用名称 -->
        <el-form-item label="应用名称" prop="name">
          <el-input
            v-model.trim="basicInfoFormData.name"
            placeholder="请输入应用名称，长度在2到20个字符之间"
            style="width: 100%"
          ></el-input>
        </el-form-item>
        <!-- 应用描述 -->
        <el-form-item label="应用描述" prop="remark">
          <el-input
            v-model.trim="basicInfoFormData.remark"
            type="textarea"
            resize="vertical"
            placeholder="描述应用的使用对象、功能等信息，长度在10到200个字符之间"
            style="width: 100%"
            :rows="2"
          ></el-input>
        </el-form-item>
        <!-- 项目名称 -->
        <el-form-item label="项目名称" prop="projectName">
          <el-input
            v-model.trim="basicInfoFormData.projectName"
            placeholder="只允许输入英文字母、数字和“-”，且“-”不能出现在开头或者结尾"
            style="width: 100%"
          ></el-input>
        </el-form-item>
        <!-- 应用域名 -->
        <el-form-item label="应用域名">
          <!-- 测试环境 -->
          <el-input
            v-if="env === 'local' || env === 'devtest' || env === 'publictest'"
            style="width: 100%"
            :value="`测试环境：${basicInfoFormData.projectName}-${productCode}-test.jdl.com`"
            :readonly="true"
          ></el-input>
          <!-- 预发、生产环境 -->
          <template v-else-if="env === 'uat' || env === 'prod'">
            <el-input
              style="width: 100%"
              :value="`预发环境：${basicInfoFormData.projectName}-${productCode}-uat.jdl.com`"
              :readonly="true"
            ></el-input>
            <el-input
              style="width: 100%; margin-top: 8px"
              :value="`生产环境：${basicInfoFormData.projectName}-${productCode}.jdl.com`"
              :readonly="true"
            ></el-input>
          </template>
        </el-form-item>
      </el-form>
    </div>

    <!-- 提交审核 -->
    <template v-if="active === 2">
      <div class="finish-wrapper">
        <i class="el-icon-success" />
        <p class="finish-title">应用已提交审核</p>
        <p class="finish-tip">
          软件产品负责人审核通过后即可创建成功，您可在京ME或OA查询审批进度。
        </p>
      </div>
    </template>

    <!-- 按钮区域 -->
    <div class="button-wrapper">
      <template v-if="active === 1">
        <el-button @click="$router.push({ name: 'AppManagerCreateApp' })"
          >上一步</el-button
        >
        <el-button
          type="primary"
          :loading="confirmPublishLoading"
          @click="handleConfirmCreateApp"
          >确认创建</el-button
        >
      </template>
      <div v-else-if="active === 2" class="button-wrapper__inner">
        <el-button type="primary" @click="$router.push({ path: '/appManager' })"
          >返回应用列表</el-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import Title from "@/components/Title.vue";
import Steps from "@/components/Steps.vue";
import appManager from "@/api/intranet/appManager/index.js";

export default {
  name: "CreateSecondaryDevelopmentApp",
  components: { Title, Steps },
  data() {
    return {
      env: window.env.buildEnv,
      id: parseInt(this.$route.params.id),
      newAppId: null,
      productCode: this.$route.params.productCode,
      // 步骤条
      active: 1,
      titleList: ["选择应用类型", "填写信息", "提交审核"],
      // 填写信息表单
      basicInfoFormData: {
        sysVersionId: undefined,
        name: "",
        remark: "",
        projectName: "",
      },
      basicInfoFormRules: {
        sysVersionId: [{ required: true, message: "请选择应用版本" }],
        name: [
          { required: true, message: "请输入应用名称" },
          {
            min: 2,
            max: 20,
            message: "长度在2到20个字符之间",
          },
        ],
        remark: [
          { required: true, message: "请输入应用描述" },
          {
            min: 10,
            max: 200,
            message: "长度在10到200个字符之间",
          },
        ],
        projectName: [
          { required: true, message: "请输入项目名称" },
          {
            pattern:
              /(^[A-Za-z0-9]+$)|(^[A-Za-z0-9]+[A-Za-z0-9-]*[A-Za-z0-9]+)$/,
            message:
              "只允许输入英文字母、数字和“-”，且“-”不能出现在开头或者结尾",
            trigger: "blur",
          },
          {
            min: 2,
            max: 30,
            message: "长度在2到30个字符之间",
          },
        ],
      },
      selectSysVersionIdLoading: false,
      sysVersionOptionList: [],
      debounceTimer: null,
      confirmPublishLoading: false,
    };
  },
  methods: {
    // 查询软件系统版本
    async queryVersionListByProductCode() {
      const { productCode } = this.$route.params;
      const params = { productCode };
      return await appManager
        .queryVersionListByProductCode(params)
        .catch((error) => {
          const { message } = error.data;
          message && this.$message.error(message);
          throw new Error("queryVersionListByProductCode");
        });
    },
    // 模糊查询应用名称
    async findExistedAppList(query) {
      const name = query;
      const code = query;
      const params = { name, code };
      return await appManager.findExistedAppList(params).catch((error) => {
        const { message } = error.data;
        message && this.$message.error(message);
        throw new Error("findExistedAppList");
      });
    },
    // 创建软件系统应用
    async addProductAppInfo() {
      const { id, productCode } = this;
      const productId = id;
      const { sysVersionId, name, remark, projectName } =
        this.basicInfoFormData;
      const data = {
        productId,
        productCode,
        sysVersionId,
        name,
        remark,
        projectName,
      };
      return await appManager.addProductAppInfo(data).catch((error) => {
        const { message } = error.data;
        message && this.$message.error(message);
        throw new Error("addProductAppInfo");
      });
    },

    // 加载软件系统产品版本列表
    async reloadSysVersionOptionList() {
      this.selectSysVersionIdLoading = true;
      const response = await this.queryVersionListByProductCode().catch(() => {
        this.selectSysVersionIdLoading = false;
        throw new Error("reloadSysVersionOptionList");
      });
      const { data } = response.data;
      this.sysVersionOptionList = data;
      this.selectSysVersionIdLoading = false;
    },
    // 确认创建软件系统应用
    handleConfirmCreateApp() {
      this.$refs.basicInfoForm.validate(async (valid) => {
        if (valid) {
          clearTimeout(this.debounceTimer);
          this.debounceTimer = setTimeout(async () => {
            this.confirmPublishLoading = true;
            const response = await this.addProductAppInfo().catch(() => {
              this.confirmPublishLoading = false;
              throw new Error("handleConfirmCreateApp");
            });
            const { data } = response.data;
            this.newAppId = data;
            this.active = 2;
            this.$nextTick(() => {
              this.confirmPublishLoading = false;
            });
          }, 300);
        } else {
          return false;
        }
      });
    },
  },
  created() {
    this.reloadSysVersionOptionList();
  },
};
</script>

<style lang="scss" scoped>
.create-app {
  margin: 0 20px;
  padding: 20px;
  background: #fff;
  min-height: calc(100vh - 120px);
  .basic-info-form-wrapper {
    .basic-info-form {
      width: 500px;
      margin: 0 auto;
    }
  }
  // 完成
  .finish-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    .el-icon-success {
      font-size: 48px;
      color: #26a872;
    }
    .finish-title {
      margin: 8px auto;
      font-size: 24px;
    }
    .finish-tip {
      margin-bottom: 16px;
    }
  }
  // 按钮区域
  .button-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>