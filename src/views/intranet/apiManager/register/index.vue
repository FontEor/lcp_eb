<template>
  <div class="app-container">
    <steps v-bind="stepsObj" />
    <div class="entryFormBox tc">
      <JsfApiProtocol
        @next="next"
        @apiService="apiService"
        v-if="progress === 0"
      />
      <div v-if="showJsf">
        <!-- <JsfSubmitXml
          v-if="progress === 1"
          @previous="previous"
          @next="next"
          :apiMessage="apiMessage"
        />
        <JsfApiInfo
          v-if="progress === 2"
          @previous="previous"
          @next="next"
          :apiMessage="apiMessage"
        />
        <JsfSubmitFinish v-if="progress === 3" :apiMessage="apiMessage" /> -->
        <SubmitXml
          v-if="progress === 1"
          @previous="previous"
          @next="next"
          :apiMessage="apiMessage"
        />
        <SubmitApiMessage
          v-if="progress === 2"
          @previous="previous"
          @next="next"
          :apiMessage="apiMessage"
        />
        <SubmitFinish v-if="progress === 3" :apiMessage="apiMessage" />
      </div>
      <div v-if="showHttp">
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
import JsfSubmitXml from "@/views/intranet/apiManager/register/JsfRegisterApi/JsfSubmitXml.vue";
import JsfSubmitFinish from "@/views/intranet/apiManager/register/JsfRegisterApi/JsfSubmitFinish.vue";
import JsfApiProtocol from "@/views/intranet/apiManager/register/JsfRegisterApi/JsfApiProtocol.vue";
import JsfApiInfo from "@/views/intranet/apiManager/register/JsfRegisterApi/JsfApiInfo.vue";
import HttpApiInfo from "@/views/intranet/apiManager/register/HttpRegisterApi/HttpApiInfo.vue";
import HttpProvider from "@/views/intranet/apiManager/register/HttpRegisterApi/HttpProvider.vue";
import HttpSubmitFinish from "@/views/intranet/apiManager/register/HttpRegisterApi/HttpSubmitFinish.vue";
import SubmitXml from "@/views/intranet/apiManager/register/JsfRegisterApi/submitXml.vue";
import SubmitApiMessage from "@/views/intranet/apiManager/register/JsfRegisterApi/SubmitApiMessage.vue";
import SubmitFinish from "@/views/intranet/apiManager/register/JsfRegisterApi/SubmitFinish.vue";

export default {
  components: {
    steps,
    JsfSubmitXml,
    JsfSubmitFinish,
    JsfApiProtocol,
    JsfApiInfo,
    HttpApiInfo,
    HttpProvider,
    HttpSubmitFinish,
    SubmitXml,
    SubmitApiMessage,
    SubmitFinish,
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
      stepsObj: {},
      httpStepsObj: {},
      jsfStepsList: [
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
      showJsf: false,
      showHttp: false,
      type: 1,
    };
  },
  created() {
    this.stepsObj = this.jsfStepsList[this.progress];
    this.httpStepsObj = this.httpStepsList[this.progress];
  },
  methods: {
    /**
     * 上一步
     */
    previous() {
      if (this.progress > 0) {
        this.progress--;
        this.stepsObj = this.jsfStepsList[this.progress];
        this.httpStepsObj = this.httpStepsList[this.progress];
      }
    },
    /**
     * 下一步
     */
    next() {
      if (this.progress < 3) {
        this.progress++;
        this.stepsObj = this.jsfStepsList[this.progress];
        this.httpStepsObj = this.httpStepsList[this.progress];
      }
    },
    /**
     * 选择的协议
     */
    apiService(data) {
      console.log(data);
      if (data === 1) {
        //jsf协议
        this.showJsf = true;
        this.showHttp = false;
      } else if (data === 2) {
        //http协议
        this.showHttp = true;
        this.showJsf = false;
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
