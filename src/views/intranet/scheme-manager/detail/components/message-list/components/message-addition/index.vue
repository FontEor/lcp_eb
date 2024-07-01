<template>
  <section class="message-addition">
    <el-page-header @back="onBack" content="添加消息" />
    <Steps :titleList="stepsTitleList" :active="stepsActive" />
    <StepFillInBasicInfo
      v-if="stepsActive === 0"
      :active.sync="stepsActive"
      :currentTableRowData="currentTableRowData"
      @update:currentTableRowData="
        ($event) => $emit('update:currentTableRowData', $event)
      "
      @updateDetailHeaderInfo="$emit('updateDetailHeaderInfo')"
    />
    <StepFinish
      v-else-if="stepsActive === 1"
      @clickBackToMessageListButton="onClickBackToMessageListButton"
      @clickEditMessageDocumentButton="onClickEditMessageDocumentButton"
    />
  </section>
</template>

<script>
import Steps from "@/components/Steps.vue";
import StepFillInBasicInfo from "./components/step-fill-in-basic-info.vue";
import StepFinish from "./components/step-finish.vue";

export default {
  name: "MessageAddition",
  components: { Steps, StepFillInBasicInfo, StepFinish },
  props: {
    currentDisplayComponentName: { type: String, required: true },
    currentTableRowData: { type: Object, required: true },
  },
  data() {
    return { stepsTitleList: ["填写基本信息", "完成"], stepsActive: 0 };
  },
  methods: {
    onBack() {
      this.$emit("update:currentDisplayComponentName", "MessageTable");
    },
    onClickBackToMessageListButton() {
      this.$emit("update:currentDisplayComponentName", "MessageTable");
    },
    onClickEditMessageDocumentButton() {
      this.$emit("update:currentDisplayComponentName", "MessageDocument");
    },
  },
};
</script>

<style lang="scss" scoped>
// .message-addition {
// }
</style>