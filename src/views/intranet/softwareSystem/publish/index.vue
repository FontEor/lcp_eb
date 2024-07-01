<template>
  <div v-loading="loading" class="publish">
    <Title text="软件系统发布" />
    <Steps :active="active" :titleList="titleList" />

    <template v-if="isSecondaryDevelopment">
      <!-- 第一步-请确认基本信息表单 -->
      <div v-show="active === 0" class="publish__main confirm-basic-info">
        <p class="main__title">请确认基本信息</p>
        <p class="main__tip">
          此处填写的信息将直接展示给用户，以供用户了解和购买软件系统，请认真确认。
        </p>
        <el-form
          class="confirm-basic-info__form"
          label-width="100px"
          :model="confirmBasicInfoFormData"
        >
          <el-form-item label="系统名称">
            {{ confirmBasicInfoFormData.name }}
          </el-form-item>
          <el-form-item label="发布范围">
            {{
              formatConfirmBasicInfoFormScope(confirmBasicInfoFormData.scope)
            }}
          </el-form-item>
          <el-form-item label="系统描述">
            <pre class="form__description">
            {{ confirmBasicInfoFormData.description }}
          </pre
            >
          </el-form-item>
        </el-form>
      </div>

      <!-- 第二步-完善使用手册 -->
      <div v-show="active === 1" class="publish__main improve-manual">
        <p class="main__title">完善使用手册</p>
        <p class="main__tip">
          软件系统发布后，您仍可在使用手册页面逐一创建、发布文档，发布后，用户即可在物流开放平台查看文档。
        </p>
        <div class="improve-manual__image">
          <el-image :src="addDocument" :preview-src-list="[addDocument]" />
        </div>
      </div>

      <!-- 第三步-发布扩展点 -->
      <div v-show="active === 2" class="publish__main publish-extension-point">
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

      <!-- 第四步-完成 -->
      <div v-show="active === 3" class="publish__main publish-success">
        <i class="el-icon-success publish-success__icon" />
        <p class="main__title">发布成功</p>
        <p class="main__tip">
          您可以继续编写使用手册、开发者资源，或管理软件系统。
        </p>
      </div>

      <!-- 按钮区域 -->
      <div class="publish__button-wrapper">
        <el-button v-show="active === 0" type="primary" @click="active = 1"
          >下一步</el-button
        >
        <div v-show="active === 1" class="button-wrapper__inner">
          <el-button @click="active = 0">上一步</el-button>
          <el-button type="primary" @click="active = 2">下一步</el-button>
        </div>
        <div v-show="active === 2" class="button-wrapper__inner">
          <el-button @click="active = 1">上一步</el-button>
          <el-button
            :loading="confirmPublishLoading"
            type="primary"
            @click="handleConfirmPublish"
            >{{ computeConfirmPublishButtonText }}</el-button
          >
        </div>
        <div v-show="active === 3" class="publish__button-wrapper">
          <el-button
            @click="
              $router.replace({
                name: 'SoftwareSystemDetail',
                params: { id },
                query: { tabName: 'developerResource' },
              })
            "
            >添加开发者资源</el-button
          >
          <el-button
            type="primary"
            @click="
              $router.replace({ name: 'SoftwareSystemDetail', params: { id } })
            "
            >管理软件系统</el-button
          >
        </div>
      </div>
    </template>

    <template v-else>
      <!-- 第一步-请确认基本信息表单 -->
      <div v-show="active === 0" class="publish__main confirm-basic-info">
        <p class="main__title">请确认基本信息</p>
        <p class="main__tip">
          此处填写的信息将直接展示给用户，以供用户了解和购买软件系统，请认真确认。
        </p>
        <el-form
          class="confirm-basic-info__form"
          label-width="100px"
          :model="confirmBasicInfoFormData"
        >
          <el-form-item label="系统名称">
            {{ confirmBasicInfoFormData.name }}
          </el-form-item>
          <el-form-item label="发布范围">
            {{
              formatConfirmBasicInfoFormScope(confirmBasicInfoFormData.scope)
            }}
          </el-form-item>
          <el-form-item label="系统描述">
            <pre class="form__description">
            {{ confirmBasicInfoFormData.description }}
          </pre
            >
          </el-form-item>
        </el-form>
      </div>

      <!-- 第二步-完善使用手册 -->
      <div v-show="active === 1" class="publish__main improve-manual">
        <p class="main__title">完善使用手册</p>
        <p class="main__tip">
          软件系统发布后，您仍可在使用手册页面逐一创建、发布文档，发布后，用户即可在物流开放平台查看文档。
        </p>
        <div class="improve-manual__image">
          <el-image :src="addDocument" :preview-src-list="[addDocument]" />
        </div>
      </div>

      <!-- 第三步-完成 -->
      <div v-show="active === 2" class="publish__main publish-success">
        <i class="el-icon-success publish-success__icon" />
        <p class="main__title">发布成功</p>
        <p class="main__tip">
          您可以继续编写使用手册、开发者资源，或管理软件系统。
        </p>
      </div>

      <!-- 按钮区域 -->
      <div class="publish__button-wrapper">
        <el-button v-show="active === 0" type="primary" @click="active = 1"
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
                name: 'SoftwareSystemDetail',
                params: { id },
              })
            "
            >管理软件系统</el-button
          >
          <el-button
            type="primary"
            @click="
              $router.replace({
                name: 'SoftwareSystemDetail',
                params: { id },
                query: { tabName: 'manual' },
              })
            "
            >编写使用手册</el-button
          >
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import Title from "@/components/Title.vue";
import Steps from "@/components/Steps.vue";
import softwareSystem from "@/api/intranet/softwareSystem/index.js";
import addDocument from "@/assets/addDocument.gif";

export default {
  name: "Publish",
  components: { Title, Steps },
  data() {
    const self = this;
    return {
      id: self.$route.params.id,
      productCode: "",
      loading: true,
      isSecondaryDevelopment: false,
      active: 0,
      titleList: ["确认基本信息", "完善使用手册", "确认扩展点变更", "完成"],
      // 请确认基本信息表单
      confirmBasicInfoFormData: {},
      // 完善使用手册
      addDocument,
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
        if (newValue === 2) {
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
  },
  methods: {
    // 软件系统-校验是否满足发布条件
    async dry() {
      const { id } = this;
      const params = { id };
      return await softwareSystem.dry(params).catch((error) => {
        const { message } = error.data;
        message && this.$message.error(message);
        setTimeout(() => {
          this.$router.replace({ name: "SoftwareSystem" });
        }, 2000);
        throw new Error("dry");
      });
    },
    // 软件系统-详情 查看详情信息
    async product() {
      const { id } = this;
      const params = { id };
      return await softwareSystem.product(params).catch((error) => {
        const { message } = error.data;
        message && this.$message.error(message);
        throw new Error("product");
      });
    },
    // 软件系统-发布-查询扩展点操作日志
    async queryOperateLog() {
      const { productCode } = this;
      return await softwareSystem
        .queryOperateLog(productCode)
        .catch((error) => {
          const { message } = error.data;
          message && this.$message.error(message);
          throw new Error("queryOperateLog");
        });
    },
    // 软件系统-根据ID发布软件系统
    async publish() {
      const { id } = this;
      const params = { id };
      return await softwareSystem.publish(params).catch((error) => {
        const { message } = error.data;
        message && this.$message.error(message);
        throw new Error("publish");
      });
    },

    // 格式化确认基本信息表单发布范围
    formatConfirmBasicInfoFormScope(scope) {
      const hashMap = { 1: "外网", 2: "内网" };
      return hashMap[scope] || "";
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
    // 校验软件系统状态是否可发布
    async checkSoftwareSystemPublishable() {
      this.loading = true;
      await this.dry().catch(() => {
        throw new Error("checkSoftwareSystemPublishable");
      });
      this.loading = false;
    },
    // 获取软件系统基本信息
    async querySoftwareSystemBasicInfo() {
      const response = await this.product().catch(() => {
        throw new Error("querySoftwareSystemBasicInfo");
      });
      const {
        code,
        name,
        scope,
        description,
        secondaryDevelopment = "0",
      } = response.data.data;
      this.productCode = code;
      this.isSecondaryDevelopment = Boolean(parseInt(secondaryDevelopment));
      this.confirmBasicInfoFormData = { name, scope, description };
      if (!this.isSecondaryDevelopment) {
        this.titleList = ["确认基本信息", "完善使用手册", "完成"];
      }
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
        await this.publish().catch(() => {
          this.confirmPublishLoading = false;
          throw new Error("handleConfirmPublish");
        });
        this.active = this.isSecondaryDevelopment ? 3 : 2;
        this.$nextTick(() => {
          this.confirmPublishLoading = false;
        });
      }, 300);
    },
  },
  created() {
    this.querySoftwareSystemBasicInfo();
    this.checkSoftwareSystemPublishable().catch(() => {
      throw new Error("created checkSoftwareSystemPublishable");
    });
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
        .form__description {
          padding-top: 6px;
          font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB,
            Microsoft YaHei, Arial, sans-serif;
          white-space: pre-line;
          line-height: 1.5em;
          max-height: 5em;
          overflow: auto;
        }
      }
    }
    &.improve-manual {
      .improve-manual__image {
        margin: 0 auto;
        width: 45%;
        min-height: 180px;
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