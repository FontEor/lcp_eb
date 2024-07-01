<template>
  <div class="subscription-record">
    <!-- 默认记录列表 -->
    <OrderRecordList
      v-if="showRecordList"
      :showRecordList.sync="showRecordList"
      :currentRowData.sync="currentRowData"
      :tabName.sync="tabName"
    />
    <!-- 列表点击后的详情组件 -->
    <SubscriptionDetail
      v-else
      :showRecordList.sync="showRecordList"
      :currentRowData.sync="currentRowData"
      :tabName="tabName"
    />
  </div>
</template>

<script>
import OrderRecordList from "./components/order-record-list.vue";
import SubscriptionDetail from "./components/subscription-detail/index.vue";

export default {
  name: "SubscriptionRecord",
  components: {
    OrderRecordList,
    SubscriptionDetail,
  },
  data() {
    return {
      showRecordList: true,
      currentRowData: {},
      tabName: "interface", // interface 接口配置 message 1 消息配置
    };
  },
  methods: {},
};
</script>

<style lang="scss" scoped></style>
