<template>
  <div class="subscription-detail">
    <div class="subscription-detail__header">
      <el-page-header
        @back="backToList"
        :content="`“${currentRowData.appName}”应用订阅${
          tabName === 'interface' ? '接口' : '消息'
        }详情`"
      />
    </div>
    <div class="subscription-detail__content">
      <div class="content__table">
        <!-- 接口列表 -->
        <template v-if="tabName === 'interface'">
          <JsfInterfaceList
            v-if="domainType == 1"
            :currentRowData.sync="currentRowData"
            :hasUat="hasUat"
          />
          <HttpInterfaceList
            v-else-if="domainType == 2"
            :currentRowData.sync="currentRowData"
            :hasUat="hasUat"
          />
        </template>
        <!-- 消息列表 -->
        <template v-else>
          <!-- 合作伙伴消息列表 -->
          <PartnerMessageList
            v-if="currentRowData.type === 5"
            :currentRowData.sync="currentRowData"
            :hasUat="hasUat"
          />
          <!-- isv及自研商家消息列表 -->
          <IsvMessageList
            v-else-if="currentRowData.type === 3 || currentRowData.type === 4"
            :currentRowData.sync="currentRowData"
            :hasUat="hasUat"
          />
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import JsfInterfaceList from "./components/jsf-interface-list/index.vue";
import HttpInterfaceList from "./components/http-interface-list.vue";
import PartnerMessageList from "./components/partner-message-list.vue";
import IsvMessageList from "./components/isv-message-list.vue";
import request from "@/utils/request.js";

export default {
  name: "SubscriptionDetail",
  components: {
    PartnerMessageList,
    IsvMessageList,
    HttpInterfaceList,
    JsfInterfaceList,
  },
  props: {
    currentRowData: {
      type: Object,
      default() {
        return {};
      },
    },
    tabName: {
      type: String,
      default() {
        return "interface";
      },
    },
  },
  data() {
    return {
      domainType: "", //对接方案类型
      hasUat: 0, //是否有uat
    };
  },
  methods: {
    backToList() {
      this.$emit("update:showRecordList", true);
    },
  },
  mounted() {
    request({
      url: "/bizunit/getOverview",
      method: "get",
      params: { id: this.$route.params.id },
    })
      .then((response) => {
        if (response.data) {
          this.domainType = response.data.domainType;
          this.hasUat = response.data.hasUat;
        } else {
          this.$message({
            message: "无数据错误",
            type: "warning",
            center: true,
          });
        }
      })
      .catch((error) => {
        console.log("postBizUnitsData 请求失败", error);
      });
  },
};
</script>

<style lang="scss" scoped>
.subscription-detail {
  .subscription-detail__content {
    .content__table {
      margin-top: 20px;
    }
  }
}
</style>
