<template>
  <div class="setp-two-content">
    <el-form
      :model="formData"
      :rules="formRules"
      ref="publishForm"
      class="form-content"
    >
      <el-form-item prop="publishCase">
        <el-input
          type="textarea"
          show-word-limit
          maxlength="200"
          :rows="6"
          v-model="formData.publishCase"
          placeholder="请填写本次发布的原因，如：仓业务新增销售出库明细消息，仓库出库完成会将出库单状态和明细信息推送给商家。"
        ></el-input>
      </el-form-item>
    </el-form>
    <p>
      <el-button @click="handlePreStep">上一步</el-button>
      <el-button type="primary" @click="handlePublish">发布</el-button>
    </p>
  </div>
</template>
<script>
import gateway from "@/api/intranet/gateway/index.js";
export default {
  data() {
    return {
      formData: {
        publishCase: ""
      },
      formRules: {
        publishCase: [
          {
            required: true,
            min: 5,
            max: 200,
            message: "请输入5-200个字符",
            trigger: "change"
          }
        ]
      }
    };
  },
  mounted() {
    this.$refs.publishForm && this.$refs.publishForm.resetFields();
  },
  methods: {
    handlePreStep() {
      this.$router.push({
        name: "messageManagerPublishOne",
        query: this.$route.query || {},
        params: this.$route.params
      });
    },
    handlePublish() {
      this.$refs.publishForm &&
        this.$refs.publishForm.validate(async valid => {
          if (valid) {
            const { tps, dailyCall } = this.$route.query || {};
            const param = [
              Object.assign({}, this.formData, {
                tps,
                dailyCall,
                topic: this.$route.params && this.$route.params.topic
              })
            ];
            const response = await gateway.messageAccessService.applyPublish(
              param
            );
            const { code } = response || {};
            if (+code === 20000) {
              this.$router.push({
                name: "messageManagerPublishThree",
                params: this.$route.params
              });
            }
          }
        });
    }
  },
  name: "messageManagerPublishTwo"
};
</script>
<style lang="scss" scoped>
.setp-two-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.form-content {
  width: 40%;
}
</style>
