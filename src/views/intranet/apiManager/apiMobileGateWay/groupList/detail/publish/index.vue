<template>
  <div class="app-container">
    <steps v-bind="stepsObj" />
    <div class="form-container">
      <!-- API发布第一步，确认API信息 -->
      <div v-if="stepsObj.active === 0">
        <FillGroupMessage
          @nextStep="nextStep"
          :groupMessageForm="groupMessageForm"
        ></FillGroupMessage>
      </div>
      <div v-else-if="stepsObj.active === 1">
        <GroupAdjustment
          @nextStep="nextStep"
          @previous="previous"
          :callVolumeForm="callVolumeForm"
        />
      </div>
      <div v-else-if="stepsObj.active === 2">
        <FillApprover
          @nextStep="nextStep"
          @previous="previous"
          :groupMessageForm="groupMessageForm"
          :callVolumeForm="callVolumeForm"
        ></FillApprover>
      </div>
      <div v-else-if="stepsObj.active === 3">
        <PublishSuccess></PublishSuccess>
      </div>
    </div>
  </div>
</template>
<script>
import steps from "@/components/steps/index.vue";
import FillGroupMessage from "./fillGroupMessage.vue";
import FillApprover from "./fillApprover.vue";
import PublishSuccess from "./publishSuccess.vue";
import GroupAdjustment from "@/views/intranet/apiManager/apiMobileGateWay/groupList/detail/publish/GroupAdjustment.vue";
import gwApiRequest from "@/utils/gwApiRequest";

export default {
  components: {
    steps,
    FillGroupMessage,
    FillApprover,
    PublishSuccess,
    GroupAdjustment,
  },
  name: "publish",
  data() {
    return {
      loading: true,
      stepsObj: {
        active: 0,
        title: "发布分组",
        tiptitle: [
          "确认分组信息",
          "填写分组调用量",
          "填写审批人ERP账号",
          "提交发布请求成功",
        ],
      },
      groupMessageForm: {
        id: this.$route.params.id,
        code: "",
        cnName: "",
        intr: "",
      },
      callVolumeForm: {
        tps: "",
        dailyCall: "",
      },
    };
  },
  async created() {
    //获得分组的信息
    const response = await this.publishMessage();
  },
  methods: {
    nextStep() {
      if (this.stepsObj.active < 3) {
        this.stepsObj.active++;
      }
    },
    previous() {
      if (this.stepsObj.active > 0) {
        this.stepsObj.active--;
      }
    },

    async publishMessage() {
      //发送请求获得上次发布填写的信息
      let url = "/CloudDomainService/info";
      let params = [
        {
          id: this.$route.params.id,
        },
      ];
      gwApiRequest
        .post(url, params)
        .then((rsp) => {
          this.groupMessageForm.id = rsp.data.id;
          this.groupMessageForm.code = rsp.data.code;
          this.groupMessageForm.cnName = rsp.data.name;
          this.groupMessageForm.intr = rsp.data.description;
          this.callVolumeForm.dailyCall = rsp.data.dailyCall;
          this.callVolumeForm.tps = rsp.data.tps;
          this.loading = false;
        })
        .catch((e) => {
          console.log(e);
          this.loading = false;
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.form-container {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
