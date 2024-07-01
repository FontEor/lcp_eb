<template>
  <div v-loading="loading" class="publish">
    <Title text="应用发布" />
    <Steps :active="active" :titleList="titleList" />

    <!-- 第一步-请确认基本信息表单 -->
    <div v-show="active === 0" class="publish__main confirm-basic-info">
      <p class="main__title">请确认基本信息</p>
      <el-form
        class="confirm-basic-info__form"
        ref="confirmBasicInfoForm"
        label-width="120px"
        :model="confirmBasicInfoFormData"
      >
        <el-form-item label="应用中文名称" prop="name">
          <el-input
            v-model.trim="confirmBasicInfoFormData.name"
            placeholder="请输入应用中文名称"
            style="width: 100%"
          ></el-input>
        </el-form-item>
        <el-form-item label="应用描述" prop="remark">
          <el-input
            v-model.trim="confirmBasicInfoFormData.remark"
            type="textarea"
            placeholder="请输入应用描述"
            style="width: 100%"
          ></el-input>
        </el-form-item>
        <el-form-item label="应用分类">
          <span>{{ computeAppClassificationText }}</span>
        </el-form-item>
      </el-form>
    </div>

    <!-- 第二步-发布扩展点 -->
    <div v-show="active === 1" class="publish__main publish-extension-point">
      <p class="main__title">确认扩展点变更</p>
      <el-table
        class="publish-extension-point__table"
        height="240"
        style="width: 100%"
        empty-text="暂无变更记录"
        :data="extensionPointTableData"
        :hide-empty-img="true"
      >
        <el-table-column
          v-for="item in extensionPointTableList"
          :key="item.id"
          :prop="item.prop"
          :label="item.label"
          :min-width="item['min-width']"
        >
          <template slot-scope="{ row, column }">
            <span v-if="column.property === 'environment'">
              {{ formatEnvironmentText(row[column.property]) }}
            </span>
            <span v-else-if="column.property === 'spiOperate'">
              {{ formatSpiOperateText(row[column.property]) }}
            </span>
            <span v-else>{{ row[column.property] }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 第三步-完成 -->
    <div v-show="active === 2" class="publish__main publish-success">
      <i class="el-icon-success publish-success__icon" />
      <p class="main__title">发布成功</p>
      <p class="main__tip">您可以继续管理应用系统，或查看发布的扩展点。</p>
    </div>

    <!-- 按钮区域 -->
    <div class="publish__button-wrapper">
      <el-button
        v-show="active === 0"
        type="primary"
        @click="handleBasicInfoNextStep"
        >下一步</el-button
      >
      <div v-show="active === 1" class="button-wrapper__inner">
        <el-button @click="active = 0">上一步</el-button>
        <el-button
          :loading="confirmPublishLoading"
          type="primary"
          @click="handleConfirmPublish"
          >{{ computeConfirmPublishButtonText }}</el-button
        >
      </div>
      <div v-show="active === 2" class="publish__button-wrapper">
        <el-button
          @click="
            $router.replace({
              name: 'AppManagerDetail',
              params: { id, type },
            })
          "
          >管理应用系统</el-button
        >
        <el-button
          type="primary"
          @click="
            $router.replace({
              name: 'AppManagerDetail',
              params: { id, type },
              query: { tab: 'configExtensionPoint' },
            })
          "
          >返回扩展点列表</el-button
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
  name: "Publish",
  components: { Title, Steps },
  data() {
    const self = this;
    return {
      id: parseInt(self.$route.params.id),
      type: self.$route.params.type,
      loading: true,
      active: 0,
      titleList: ["确认基本信息", "确认扩展点变更", "完成"],
      // 请确认基本信息表单
      confirmBasicInfoFormData: {},
      confirmBasicInfoFormRules: {
        name: [
          { required: true, message: "请输入应用中文名称" },
          { min: 2, max: 20, message: "长度在2到20个字符" },
        ],
        remark: [
          { required: true, message: "请输入应用描述信息" },
          { min: 10, max: 200, message: "长度在10到200个字符" },
        ],
      },
      // 发布扩展点
      extensionPointTableData: [],
      extensionPointTableList: [
        { prop: "spiName", label: "扩展点名称", "min-width": "140" },
        { prop: "uri", label: "URI", "min-width": "200" },
        { prop: "environment", label: "环境", "min-width": "140" },
        { prop: "spiOperate", label: "操作内容", "min-width": "100" },
      ],
      debounceTimer: null,
      confirmPublishLoading: false,
    };
  },
  watch: {
    active: {
      handler(newValue) {
        if (newValue === 1) {
          this.queryExtensionPointChangeList();
        }
      },
    },
  },
  computed: {
    // 计算确认发布按钮文案
    computeConfirmPublishButtonText() {
      const { confirmPublishLoading } = this;
      return confirmPublishLoading ? "发布中" : "确认发布";
    },
    // 计算应用分类显示内容
    computeAppClassificationText() {
      const { productCode = "", sysVersionName = "" } =
        this.confirmBasicInfoFormData;
      return `${productCode}-${sysVersionName}`;
    },
  },
  methods: {
    // 查询软件系统应用详情信息
    async getAppBaseInfo() {
      const { id } = this;
      const params = { id };
      return await appManager.getAppBaseInfo(params).catch((error) => {
        const { message } = error.data;
        message && this.$message.error(message);
        throw new Error("getAppBaseInfo");
      });
    },
    // 应用管理发布-查询扩展点操作日志
    async queryOperateLog() {
      const { code } = this.confirmBasicInfoFormData;
      const appCode = code;
      return await appManager.queryOperateLog(appCode).catch((error) => {
        const { message } = error.data;
        message && this.$message.error(message);
        throw new Error("queryOperateLog");
      });
    },
    // 修改软件系统应用基本信息
    async updateProductAppInfo() {
      const { id } = this;
      const { name, remark } = this.confirmBasicInfoFormData;
      const data = { id, name, remark };
      return appManager.updateProductAppInfo(data).catch((error) => {
        const { message } = error.data;
        message && this.$message.error(message);
        throw new Error("updateProductAppInfo");
      });
    },
    // 应用管理发布
    async publishProductApp() {
      const { id } = this;
      const params = { id };
      return await appManager.publishProductApp(params).catch((error) => {
        const { message } = error.data;
        message && this.$message.error(message);
        throw new Error("publishProductApp");
      });
    },

    // 格式化扩展点环境文案
    formatEnvironmentText(environment) {
      if (!environment && environment.length === 0) {
        return "";
      }
      const { dictionary } = this.$store.state.tools;
      try {
        return environment
          .map((item) => dictionary.environment[item].value)
          .join("、");
      } catch (error) {
        return environment.join("、") || "";
      }
    },
    // 格式化扩展点操作文案
    formatSpiOperateText(spiOperate) {
      const { dictionary } = this.$store.state.tools;
      try {
        return dictionary.spiOperate[spiOperate].value;
      } catch (error) {
        return spiOperate || "";
      }
    },
    // 获取应用基本信息
    async queryAppBaseInfo() {
      this.loading = true;
      const response = await this.getAppBaseInfo().catch(() => {
        throw new Error("queryAppBaseInfo");
      });
      const { code, name, remark, productCode, sysVersionName, status } =
        response.data.data;
      // 二开应用状态为初始化:2和编辑中:3才可以发布
      if (status !== 2 && status !== 3) {
        this.$message.error("当前应用状态异常，暂不可发布！");
        throw new Error("queryAppBaseInfo status error");
      }
      this.confirmBasicInfoFormData = {
        code,
        name,
        remark,
        productCode,
        sysVersionName,
      };
      this.loading = false;
    },
    // 基本信息表单下一步操作
    handleBasicInfoNextStep() {
      this.$refs["confirmBasicInfoForm"].validate((valid) => {
        if (valid) {
          this.active = 1;
        } else {
          return false;
        }
      });
    },
    // 获取扩展点变更操作列表
    async queryExtensionPointChangeList() {
      const response = await this.queryOperateLog().catch(() => {
        throw new Error("queryExtensionPointChangeList");
      });
      const { data } = response.data;
      this.extensionPointTableData = data || [];
    },
    // 确认发布软件系统操作
    handleConfirmPublish() {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(async () => {
        this.confirmPublishLoading = true;
        await this.updateProductAppInfo().catch(() => {
          this.confirmPublishLoading = false;
          throw new Error("handleConfirmPublish updateProductAppInfo");
        });
        await this.publishProductApp().catch(() => {
          this.confirmPublishLoading = false;
          throw new Error("handleConfirmPublish publishProductApp");
        });
        this.active = 2;
        this.$nextTick(() => {
          this.confirmPublishLoading = false;
        });
      }, 300);
    },
  },
  created() {
    this.queryAppBaseInfo();
  },
};
</script>

<style lang="scss" scoped>
.publish {
  margin: 0 20px;
  padding: 20px;
  background: #fff;
  min-height: calc(100vh - 120px);

  .publish__main {
    margin: 0 auto;
    width: 80%;
    .main__title {
      font-size: 24px;
      text-align: center;
    }
    .main__tip {
      margin: 8px;
      text-align: center;
    }
    &.confirm-basic-info {
      .confirm-basic-info__form {
        margin: 0 auto;
        width: 80%;
      }
    }
    &.publish-extension-point {
      width: 70%;
      .publish-extension-point__table {
        margin-bottom: 8px;
        width: 100%;
      }
    }
    &.publish-success {
      margin: 32px auto;
      .publish-success__icon {
        width: 100%;
        text-align: center;
        font-size: 48px;
        color: #26a872;
      }
    }
  }

  .publish__button-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>