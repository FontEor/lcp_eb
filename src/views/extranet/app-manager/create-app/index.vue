<template>
  <div class="app-container">
    <steps v-bind="stepsObj" />
    <SelectAppType
      v-if="progress === 0"
      @next="next"
      @transferAuthType="transferAuthType"
      :authType="authType"
    ></SelectAppType>
    <FillInInfo
      v-if="progress === 1"
      @previous="previous"
      @next="next"
      :authType="authType"
      @transferAppId="transferAppId"
    />
    <Finish v-if="progress === 2" :appId="appId" />
  </div>
</template>

<script>
import steps from "@/components/steps/index.vue";
import SelectAppType from "./components/select-app-type.vue";
import FillInInfo from "./components/fill-in-info.vue";
import Finish from "./components/finish.vue";
export default {
  name: "CreateApp",
  components: {
    steps,
    SelectAppType,
    FillInInfo,
    Finish,
  },
  data() {
    return {
      stepsObj: {},
      stepsList: [
        {
          active: 0,
          title: this.$t("createApp.index.5ix5trx3xts0"),
          tiptitle: [
            this.$t("createApp.index.5ix5trx3yj40"),
            this.$t("createApp.index.5ix5trx3ynw0"),
            this.$t("createApp.index.5ix5trx3yro0"),
          ],
        },
        {
          active: 1,
          title: this.$t("createApp.index.5ix5trx3xts0"),
          tiptitle: [
            this.$t("createApp.index.5ix5trx3yj40"),
            this.$t("createApp.index.5ix5trx3ynw0"),
            this.$t("createApp.index.5ix5trx3yro0"),
          ],
        },
        {
          active: 2,
          title: this.$t("createApp.index.5ix5trx3xts0"),
          tiptitle: [
            this.$t("createApp.index.5ix5trx3yj40"),
            this.$t("createApp.index.5ix5trx3ynw0"),
            this.$t("createApp.index.5ix5trx3yro0"),
          ],
        },
      ],
      progress: 0,
      authType: -1,
      appId: -1,
    };
  },
  methods: {
    /**
     * 上一步
     */
    previous() {
      if (this.progress > 0) {
        this.progress--;
        this.stepsObj = this.stepsList[this.progress];
      }
    },
    /**
     * 下一步
     */
    next() {
      if (this.progress < 2) {
        this.progress++;
        this.stepsObj = this.stepsList[this.progress];
      }
    },
    /**
     * 把应用的类型给authType赋值，给第二步保存表单提供一个参数
     */
    transferAuthType(authType) {
      console.log("transferAuthType", authType);
      this.authType = authType;
    },
    transferAppId(id) {
      console.log("transferAppId", id);
      this.appId = id;
    },
  },
  created() {
    this.stepsObj = this.stepsList[this.progress];
    console.log("this.stepsObj", this.stepsObj);
  },
};
</script>

<style lang="scss" scoped></style>
