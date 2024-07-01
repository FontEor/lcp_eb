<template>
  <div class="app-container">
    <steps v-bind="httpStepsObj" />
    <div class="entryFormBox tc">
      <div>
        <HttpApiProtocol @next="next" v-if="progress === 0" />
        <HttpProvider
          v-if="progress === 1"
          @previous="previous"
          @next="next"
          @provideMethod="provideMethod"
        />
        <HttpApiInfo
          v-if="progress === 2"
          @previous="previous"
          @next="next"
          @getApiId="getApiId"
          :type="type"
        />
        <HttpSubmitFinish v-if="progress === 3" :apiId="apiId" />
      </div>
    </div>
  </div>
</template>
<script>
import steps from "@/components/steps/index.vue";
import HttpApiProtocol from "@/views/intranet/apiManager/apiMobileGateWay/register/HttpRegisterApi/HttpApiProtocol.vue";
import HttpApiInfo from "@/views/intranet/apiManager/apiMobileGateWay/register/HttpRegisterApi/HttpApiInfo.vue";
import HttpProvider from "@/views/intranet/apiManager/apiMobileGateWay/register/HttpRegisterApi/HttpProvider.vue";
import HttpSubmitFinish from "@/views/intranet/apiManager/apiMobileGateWay/register/HttpRegisterApi/HttpSubmitFinish.vue";

export default {
  components: {
    steps,
    HttpApiProtocol,
    HttpApiInfo,
    HttpProvider,
    HttpSubmitFinish,
  },
  data() {
    return {
      apiMessage: {
        qualifiedName: "",
        cnName: "",
        registerType: "",
        jsfDate: Object,
      },
      apiId: 0,
      httpStepsObj: {},
      httpStepsList: [
        {
          active: 0,
          title: "注册API",
          tiptitle: [
            "选择API调用协议",
            "提供API的方式",
            "填写API基本信息",
            "注册成功",
          ],
        },
        {
          active: 1,
          title: "注册API",
          tiptitle: [
            "选择API调用协议",
            "提供API的方式",
            "填写API基本信息",
            "注册成功",
          ],
        },
        {
          active: 2,
          title: "注册API",
          tiptitle: [
            "选择API调用协议",
            "提供API的方式",
            "填写API基本信息",
            "注册成功",
          ],
        },
        {
          active: 3,
          title: "注册API",
          tiptitle: [
            "选择API调用协议",
            "提供API的方式",
            "填写API基本信息",
            "注册成功",
          ],
        },
      ],
      progress: 0,
      type: 1,
    };
  },
  created() {
    this.httpStepsObj = this.httpStepsList[this.progress];
  },
  methods: {
    /**
     * 上一步
     */
    previous() {
      if (this.progress > 0) {
        this.progress--;
        this.httpStepsObj = this.httpStepsList[this.progress];
      }
    },
    /**
     * 下一步
     */
    next() {
      if (this.progress < 3) {
        this.progress++;
        this.httpStepsObj = this.httpStepsList[this.progress];
      }
    },
    /**
     * 获取的API id
     */
    getApiId(data) {
      this.apiId = data;
    },
    /**
     * 提供接口的方式
     */
    provideMethod(data) {
      this.type = data;
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep .my-step-bar {
  width: 80%;
  margin: 25px auto 35px;
}
</style>
