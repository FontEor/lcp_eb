<template>
  <div class="step-one-content">
    <p class="des">为保障消息发送可靠性和稳定性，请仔细评估</p>
    <el-form
      :model="formData"
      :rules="formRules"
      ref="publishForm"
      class="form-content"
      label-width="180px"
    >
      <el-form-item label="每秒发送量峰值" prop="tps">
        <el-input
          v-model="formData.tps"
          placeholder="例：1000"
          type="number"
        ></el-input>
      </el-form-item>
      <el-form-item label="每日发送量峰值" prop="dailyCall">
        <el-input
          v-model="formData.dailyCall"
          placeholder="例：100000"
          type="number"
        ></el-input>
      </el-form-item>
    </el-form>
    <p>
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="handleConfirm">下一步</el-button>
    </p>
  </div>
</template>
<script>
export default {
  data() {
    return {
      formData: {
        tps: null,
        dailyCall: null
      },
      formRules: {
        tps: [
          {
            required: true,
            message: "请输入每秒发送峰值",
            trigger: "change"
          }
        ],
        dailyCall: [
          {
            required: true,
            message: "请输入每日发送峰值",
            trigger: "change"
          }
        ]
      }
    };
  },
  watch: {
    $route: {
      handler(newVal) {
        if (newVal) {
          const { tps = null, dailyCall = null } = newVal.query || {};
          this.formData = {
            tps: Number(tps),
            dailyCall: Number(dailyCall)
          };
        }
      },
      immediate: true
    }
  },
  methods: {
    handleCancel() {
      this.$router.push({
        name: "messageManagerBasicInfo",
        query: this.$route.query || {},
        params: this.$route.params
      });
    },
    handleConfirm() {
      this.$refs.publishForm.validate(valid => {
        if (valid) {
          const { tps, dailyCall } = this.formData;
          this.$router.push({
            name: "messageManagerPublishTwo",
            query: { tps, dailyCall },
            params: this.$route.params
          });
        }
      });
    }
  },
  name: "messageManagerPublishOne"
};
</script>
<style lang="scss" scoped>
.step-one-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  .des {
    margin-bottom: 22px;
  }
  .form-content {
    width: 40%;
  }
}
</style>
