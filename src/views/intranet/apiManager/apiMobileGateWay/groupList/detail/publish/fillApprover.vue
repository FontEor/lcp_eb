<template>
  <div class="fill-approver">
    <p class="title">请填写指定的审批人ERP账号</p>
    <p class="title">审批通过后，发布内容生效</p>
    <div class="form-content">
      <el-form
        ref="approverForm"
        :rules="approverRules"
        :model="approverForm"
        label-width="126px"
      >
        <el-form-item label="审批人ERP账号" prop="approver">
          <ErpPrincipal
            :formDataPrincipal.sync="approverForm.approver"
            placeholder="审批人可在京ME流程中心审批"
          />
        </el-form-item>
      </el-form>
    </div>
    <div class="footer">
      <el-button @click="previous">上一步</el-button>
      <el-button
        type="primary"
        @click="submitForm()"
        v-loading.fullscreen.lock="fullscreenLoading"
        >发布</el-button
      >
    </div>
  </div>
</template>

<script>
import ErpPrincipal from "@/views/intranet/apiManager/components/ErpPrincipal.vue";
import gwApiRequest from "@/utils/gwApiRequest";
export default {
  props: {
    groupMessageForm: Object,
    callVolumeForm: Object,
  },
  components: { ErpPrincipal },
  data() {
    return {
      fullscreenLoading: false,
      approverForm: {
        approver: "",
      },
      approverRules: {
        approver: [{ required: true, message: "审批人ERP账号不能为空" }],
      },
    };
  },
  methods: {
    submitForm() {
      this.$refs["approverForm"].validate((valid) => {
        if (valid) {
          this.cloudDomainServicePublish();
        } else {
          return false;
        }
      });
    },
    previous() {
      this.$emit("previous");
    },
    async cloudDomainServicePublish() {
      //发送请求获得上次发布填写的信息
      let url = "/CloudDomainService/publish";
      const data = [
        {
          id: this.groupMessageForm.id,
          code: this.groupMessageForm.code,
          name: this.groupMessageForm.cnName,
          description: this.groupMessageForm.intr,
          approveErp: this.approverForm.approver,
          tps: this.callVolumeForm.tps,
          dailyCall: this.callVolumeForm.dailyCall,
        },
      ];
      gwApiRequest
        .post(url, data)
        .then((rsp) => {
          if (rsp.code === 20000) {
            this.$emit("nextStep");
          }
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
.fill-approver {
  .form-content {
    width: 380px;
    margin-top: 30px;
  }
  .title {
    margin-top: 10px;
    text-align: center;
  }
  .footer {
    text-align: center;
    margin-top: 40px;
  }
}
</style>
