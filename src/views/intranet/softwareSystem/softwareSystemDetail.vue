<template>
  <div class="software-system-detail">
    <div
      class="com-view-dep com-tit-view"
      style="margin: auto; margin-bottom: 20px"
    >
      <div class="tit-wrap">
        <div>
          <h2 class="tit">
            {{ name }}
          </h2>
          <div :class="computeProductStatusClassName">
            {{ computeProductStatusText }}
          </div>
        </div>
        <p class="tip">{{ createUser }} 创建于 {{ createTime }}</p>
      </div>
      <div class="btn-wrap">
        <el-tooltip placement="top">
          <div slot="content">
            如果控制台中的软件系统概述信息或使用手册有变更，则需发布到前台，才会实际生效。
          </div>

          <el-button
            v-if="computePublishButtonVisible"
            type="primary"
            @click="handlePublishButton"
            >发 布</el-button
          >
        </el-tooltip>
      </div>
    </div>

    <el-tabs v-model="tabName" type="card" :before-leave="changeTab">
      <el-tab-pane label="概览" name="overview">
        <Overview
          v-if="tabName === 'overview'"
          ref="overview"
          :productCode="productCode"
          @updateTitle="updateTitle"
          @updateStatus="fetchProductSummary(id)"
        />
      </el-tab-pane>
      <el-tab-pane label="使用手册" name="manual">
        <SoftwareSystemManual
          v-if="tabName === 'manual'"
          ref="manual"
        ></SoftwareSystemManual>
      </el-tab-pane>
      <el-tab-pane label="系统资源" name="systemResource">
        <SystemResource v-if="tabName === 'systemResource'" />
      </el-tab-pane>
      <el-tab-pane label="产品版本" name="productVersion">
        <ProductVersion
          ref="productVersion"
          v-if="tabName === 'productVersion'"
          :productInfo.sync="productInfo"
          @updateStatus="fetchProductSummary(id)"
        />
      </el-tab-pane>
      <el-tab-pane label="开发者资源" name="developerResource">
        <DeveloperResource
          v-if="tabName === 'developerResource' && productCode"
          :productCode="productCode"
          ref="developerResource"
          @updateStatus="fetchProductSummary(id)"
        />
      </el-tab-pane>
      <el-tab-pane label="订阅" name="subscribe">
        <SoftwareSystemSubscribe
          v-if="tabName === 'subscribe'"
          ref="subscribe"
        ></SoftwareSystemSubscribe>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import SoftwareSystemSubscribe from "@/views/intranet/softwareSystem/softwareSystemSubscribe/index.vue";
import Overview from "@/views/intranet/softwareSystem/overview/index.vue";
import SoftwareSystemManual from "@/views/intranet/softwareSystem/softwareSystemManual.vue";
import SystemResource from "@/views/intranet/softwareSystem/systemResource/index.vue";
import ProductVersion from "@/views/intranet/softwareSystem/productVersion/index.vue";
import DeveloperResource from "@/views/intranet/softwareSystem/developerResource/index.vue";
import softwareSystem from "@/api/intranet/softwareSystem/index.js";
import request from "@/utils/request";
import { parseTime } from "@/utils";

export default {
  name: "SoftwareSystemDetail",
  components: {
    Overview,
    SoftwareSystemManual,
    SoftwareSystemSubscribe,
    SystemResource,
    ProductVersion,
    DeveloperResource,
  },
  data() {
    return {
      tabName: "overview",
      id: this.$route.params.id,
      name: "",
      createUser: "",
      createTime: "",
      updateTime: "",
      status: "",
      firstRadio: "产品基本信息",
      productCode: "",
      productInfo: {},
    };
  },
  computed: {
    // 计算软件系统状态类名
    computeProductStatusClassName() {
      const classNameHashMap = {
        0: "com-tag initBtnColor",
        1: "com-tag normalBtnColor",
        2: "com-tag updateBtnColor",
      };
      const { status } = this;
      return classNameHashMap[status] || "";
    },
    // 计算软件系统状态文案
    computeProductStatusText() {
      const { status } = this;
      const { dictionary } = this.$store.state.tools;
      try {
        return dictionary.productStatus[status].value;
      } catch (error) {
        return status || "";
      }
    },
    // 计算软件系统发布按钮是否显示
    computePublishButtonVisible() {
      const { status } = this;
      const publishStatusList = [0, 2];
      return publishStatusList.includes(status);
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
        throw new Error("dry");
      });
    },

    // 操作软件系统发布按钮
    handlePublishButton() {
      const { id, tabName } = this;
      return tabName === "overview" && this.$refs["overview"].editable
        ? this.$message.warning("发布失败，请保存当前概览信息。")
        : this.dry()
            .then(() =>
              this.$router.push({
                name: "SoftwareSystemDetailPublish",
                params: { id },
              })
            )
            .catch(() => {
              throw new Error("handlePublishButton");
            });
    },
    fetchProductSummary(productId) {
      let url = "/product";
      request({
        url: url,
        method: "get",
        params: { id: productId },
      })
        .then((rsp) => {
          this.productCode = rsp.data.code;
          this.updateTitle(rsp.data);
        })
        .catch((e) => {
          console.log(e);
        });
    },

    updateTitle(product) {
      this.productInfo = product;
      this.id = product.id;
      this.name = product.name;
      this.createUser = product.createUser;
      this.createTime = parseTime(product.createTime, "{y}-{m}-{d} {h}:{i}");
      this.updateTime = parseTime(product.updateTime, "{y}-{m}-{d} {h}:{i}");
      this.status = product.status;
    },

    changeTab(activeName, oldActiveName) {
      if (oldActiveName === "overview") {
        //--守护概览编辑状态
        if (this.$refs["overview"].editable) {
          this.$message.warning("切换操作失败，请保存当前概览信息。");
          return false;
        }
      }
      this.tabName = activeName;
      const { tabName } = this;
      this.$router.push({ query: { tabName } });
    },
  },
  created() {
    this.tabName = this.$route.query.tabName || "overview";
    this.fetchProductSummary(this.id);
  },
};
</script>

<style lang="scss" scoped>
.software-system-detail {
  margin: 0 20px;
  .el-tabs {
    ::v-deep .el-tabs__header {
      background: #f5f5f5;
      border-bottom: none;
      margin: 0;
      position: -webkit-sticky;
      position: sticky;
      top: 60px;
      z-index: 2000;
      .el-tabs__item {
        border: none;
      }
    }
    ::v-deep .el-tabs__content {
      padding: 16px;
      background: #fff;
      min-height: calc(100vh - 260px);
      // 底部粘性按钮生效条件
      position: static;
      overflow: visible;
    }
  }
}
</style>
