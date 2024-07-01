<template>
  <div class="open-extension-point">
    <!-- 顶部tag信息 -->
    <TagTip
      v-if="currentDisplayComponentName !== 'EditExtensionPointDocument'"
      class="tag-tip"
      :closable="false"
    >
      了解更多请查看
      <a class="anchor initColor" :href="computeHref" target="_blank"
        >扩展点介绍</a
      >
    </TagTip>

    <!-- 注册扩展点 -->
    <RegisterExtensionPoint
      v-if="currentDisplayComponentName === 'RegisterExtensionPoint'"
      :currentDisplayComponentName.sync="currentDisplayComponentName"
      :productCode="productCode"
      :type="type"
      :groupList="groupList"
      @updateStatus="$emit('updateStatus')"
    />
    <!-- 编辑扩展点文档 -->
    <EditExtensionPointDocument
      v-else-if="
        currentDisplayComponentName === 'EditExtensionPointDocument' &&
        extensionPointId
      "
      :currentDisplayComponentName.sync="currentDisplayComponentName"
      :productCode="productCode"
      :extensionPointId.sync="extensionPointId"
      :methodName.sync="methodName"
      @updateStatus="$emit('updateStatus')"
    />
    <!-- 扩展点列表 -->
    <ExtensionPointList
      v-else-if="currentDisplayComponentName === 'ExtensionPointList'"
      :currentDisplayComponentName.sync="currentDisplayComponentName"
      :productCode="productCode"
      :extensionPointId.sync="extensionPointId"
      :methodName.sync="methodName"
      @updateStatus="$emit('updateStatus')"
    />
  </div>
</template>

<script>
import TagTip from "@/components/common/TagTip.vue";
import RegisterExtensionPoint from "@/views/intranet/softwareSystem/developerResource/openExtensionPoint/registerExtensionPoint.vue";
import ExtensionPointList from "@/views/intranet/softwareSystem/developerResource/openExtensionPoint/extensionPointList/index.vue";
import EditExtensionPointDocument from "@/views/intranet/softwareSystem/developerResource/openExtensionPoint/editExtensionPointDocument/index.vue";
import developerResource from "@/api/intranet/softwareSystem/developerResource/index.js";

export default {
  name: "OpenExtensionPoint",
  components: {
    TagTip,
    RegisterExtensionPoint,
    ExtensionPointList,
    EditExtensionPointDocument,
  },
  props: {
    productCode: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      currentDisplayComponentName: "ExtensionPointList",
      // 开发者资源类别类型 2:"接口", 3:"扩展点", 4:"消息"
      type: 3,
      extensionPointId: null,
      methodName: "",
    };
  },
  computed: {
    // 计算TagTip跳转链接
    computeHref() {
      const { dictionary } = this.$store.state.tools;
      try {
        return dictionary.docLink["spiIntro"].value;
      } catch (error) {
        return "";
      }
    },
  },
  methods: {
    // 根据开发者资源分类查询接口分组
    async groupList() {
      const { productCode, type } = this;
      const data = { productCode, type };
      return await developerResource.list(data).catch((error) => {
        const { message } = error.data;
        message && this.$message.error(message);
        throw new Error("groupList");
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.open-extension-point {
  padding-left: 16px;
  .tag-tip {
    .anchor.initColor {
      color: #3c6ef0;
    }
  }
}
</style>