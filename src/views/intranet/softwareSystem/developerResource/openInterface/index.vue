<template>
  <div class="open-interface">
    <!-- 添加接口 -->
    <AddInterface
      v-if="addable"
      :addable.sync="addable"
      :productCode="productCode"
      :type="type"
      :groupList="groupList"
      @updateStatus="$emit('updateStatus')"
    />
    <!-- 接口列表 -->
    <InterfaceList
      v-else
      :addable.sync="addable"
      :productCode="productCode"
      @updateStatus="$emit('updateStatus')"
    />
  </div>
</template>

<script>
import AddInterface from "@/views/intranet/softwareSystem/developerResource/openInterface/addInterface.vue";
import InterfaceList from "@/views/intranet/softwareSystem/developerResource/openInterface/interfaceList.vue";
import developerResource from "@/api/intranet/softwareSystem/developerResource/index.js";

export default {
  name: "OpenInterface",
  components: { AddInterface, InterfaceList },
  props: {
    productCode: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      addable: false,
      // 开发者资源类别类型 2:"接口", 3:"扩展点", 4:"消息"
      type: 2,
    };
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
.open-interface {
  padding-left: 16px;
}
</style>