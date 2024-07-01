<template>
  <div class="app-container">
    <div class="entryBox">
      <steps v-bind="stepsObj" />
      <div class="entryFormBox tc">
        <UpdateApiSumbitXml
          v-if="progress === 0"
          @next="next"
          :apiMessage="apiMessage"
        />

         <EditXml
          v-if="progress === 1"
          @previous="previous"
          @next="next"
          :apiMessage="apiMessage"
        />

        <CheckUpdateMethod
          v-if="progress === 2"
          @previous="previous"
          @next="next"
          :apiMessage="apiMessage"
        />

        <SumbitDescription
          v-if="progress === 3"
          @previous="previous"
          @next="next"
          :apiMessage="apiMessage"
        />

        <UpdateFinish v-if="progress === 4" :apiMessage="apiMessage" />
      </div>
    </div>
  </div>
</template>
<script>
import steps from "@/components/steps/index.vue";
import UpdateApiSumbitXml from "@/views/devManager/api/updateapi/UpdateApiSumbitXml";
import CheckUpdateMethod from "@/views/devManager/api/updateapi/CheckUpdateMethod";
import SumbitDescription from "@/views/devManager/api/updateapi/SumbitDescription";
import UpdateFinish from "@/views/devManager/api/updateapi/UpdateFinish";
import EditXml from "@/views/devManager/api/updateapi/EditXml";

export default {
  components: {
    steps,
    UpdateApiSumbitXml,
    CheckUpdateMethod,
    SumbitDescription,
    UpdateFinish,
    EditXml,
  },
  data() {
    return {
      apiMessage: {
        id: null,
        apiupdatecompare: Object,
        //第一步和第二步用下面的
        registerType:"",
        jsfDate:Object,
      },
      stepsObj: {},
      stepsList: [
        {
          active: 0,
          title: "更新API",
          tiptitle: [
            "上传API文件",
            "确认API文件",
            "查看更新信息",
            "补充更新信息",
            "更新成功"
          ]
        },
        {
          active: 1,
          title: "更新API",
          tiptitle: [
            "上传API文件",
            "确认API文件",
            "查看更新信息",
            "补充更新信息",
            "更新成功"
          ]
        },
        {
          active: 2,
          title: "更新API",
          tiptitle: [
            "上传API文件",
            "确认API文件",
            "查看更新信息",
            "补充更新信息",
            "更新成功"
          ]
        },
        {
          active: 3,
          title: "更新API",
          tiptitle: [
            "上传API文件",
            "确认API文件",
            "查看更新信息",
            "补充更新信息",
            "更新成功"
          ]
        },
        {
          active: 4,
          title: "更新API",
          tiptitle: [
            "上传API文件",
            "确认API文件",
            "查看更新信息",
            "补充更新信息",
            "更新成功"
          ]
        }
      ],
      progress: 0
    };
  },
  created() {
    this.stepsObj = this.stepsList[this.progress];
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
      if (this.progress < 4) {
        this.progress++;
        this.stepsObj = this.stepsList[this.progress];
      }
    }
  }
};
</script>
<style lang="scss" scoped>
    ::v-deep .my-step-bar{
      width: 80%;
      margin: 25px auto 35px;
}
</style>
