<template>
  <article class="business-debugging">
    <BusinessSteps
      v-if="computeStepVisible"
      :active="active"
      :stepList="stepList"
    />
    <StepFinish
      v-else
      :waybillCode.sync="stepPostFormData.waybillCode"
      :active.sync="active"
    />
    <StepPost
      v-if="active === 0"
      :stepPostFormData="stepPostFormData"
      :orderInfo.sync="orderInfo"
      :active.sync="active"
    />
    <StepCollection
      v-else-if="active === 1"
      :orderInfo="orderInfo"
      :active.sync="active"
    />
    <StepSearch
      v-else-if="active === 2"
      :waybillCode.sync="stepPostFormData.waybillCode"
      :active.sync="active"
    />
  </article>
</template>

<script>
import BusinessSteps from "@/views/extranet/sandboxDebugging/debuggingOverview/businessDebugging/components/BusinessSteps.vue";
import StepFinish from "@/views/extranet/sandboxDebugging/debuggingOverview/businessDebugging/stepFinish/index.vue";
import StepPost from "@/views/extranet/sandboxDebugging/debuggingOverview/businessDebugging/stepPost/index.vue";
import StepCollection from "@/views/extranet/sandboxDebugging/debuggingOverview/businessDebugging/stepCollection/index.vue";
import StepSearch from "@/views/extranet/sandboxDebugging/debuggingOverview/businessDebugging/stepSearch/index.vue";
import postImageUrl from "@/assets/extranet/images/sandboxDebugging/post.svg";
import postActiveImageUrl from "@/assets/extranet/images/sandboxDebugging/postActive.svg";
import collectionImageUrl from "@/assets/extranet/images/sandboxDebugging/collection.svg";
import collectionActiveImageUrl from "@/assets/extranet/images/sandboxDebugging/collectionActive.svg";
import trackSearchImageUrl from "@/assets/extranet/images/sandboxDebugging/trackSearch.svg";
import trackSearchActiveImageUrl from "@/assets/extranet/images/sandboxDebugging/trackSearchActive.svg";

export default {
  name: "BusinessDebugging",
  components: {
    BusinessSteps,
    StepFinish,
    StepPost,
    StepCollection,
    StepSearch,
  },
  data() {
    return {
      active: 0,
      stepList: [
        {
          title: "寄件",
          description: "商家下单",
          // icon: "el-icon-document-empty",
          descriptionImage: postImageUrl,
          descriptionActiveImage: postActiveImageUrl,
        },
        {
          title: "揽件",
          description: "快递员上门揽收",
          // icon: "el-icon-user",
          descriptionImage: collectionImageUrl,
          descriptionActiveImage: collectionActiveImageUrl,
        },
        {
          title: "查询",
          description: "查询物流轨迹",
          // icon: "el-icon-date",
          descriptionImage: trackSearchImageUrl,
          descriptionActiveImage: trackSearchActiveImageUrl,
        },
      ],
      stepPostFormData: {
        waybillCode: "",
      },
      orderInfo: { waybillCode: "" },
    };
  },
  computed: {
    computeStepVisible() {
      const { active, stepList } = this;
      return active > -1 && active < stepList.length;
    },
  },
};
</script>

<style lang="scss" scoped>
.business-debugging {
}
</style>