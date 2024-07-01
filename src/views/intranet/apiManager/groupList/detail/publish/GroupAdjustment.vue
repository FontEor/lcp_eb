<template>
  <div class="group-adjustment">
    <div class="group-adjustment-desc">
      <p class="desc-content">请填写分组的每秒/日调用量峰值</p>
      <p class="desc-content">物流开放平台会参考调用量峰值，判断是否需要扩容</p>
    </div>
    <el-form
      :model="callVolumeForm"
      :rules="callVolumeRules"
      ref="callVolumeForm"
      label-width="120px"
    >
      <el-form-item label="每秒调用量峰值" prop="tps">
        <el-input
          v-model.number="callVolumeForm.tps"
          placeholder="请输入API分组的每秒调用量峰值"
        ></el-input>
      </el-form-item>
      <el-form-item label="每日调用量峰值" prop="dailyCall">
        <el-input
          v-model.number="callVolumeForm.dailyCall"
          placeholder="请输入API分组的每日调用量峰值"
        ></el-input>
      </el-form-item>
    </el-form>
    <div class="group-adjustment-btn">
      <el-button @click="previous()">上一步</el-button>
      <el-button type="primary" @click="nextStep()">下一步</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "GroupAdjustment",
  props: {
    callVolumeForm: {
      type: Object,
      default: true,
    },
  },
  data() {
    return {
      callVolumeRules: {
        tps: [
          { required: true, message: "每秒调用量峰值不能为空" },
          {
            type: "number",
            min: 0,
            max: 10000000000,
            message: "每秒调用量峰值为数字且长度为1-10",
          },
        ],
        dailyCall: [
          { required: true, message: "每日调用量峰值不能为空" },
          {
            type: "number",
            min: 0,
            max: 10000000000,
            message: "每日调用量峰值为数字且长度为1-10",
          },
        ],
      },
    };
  },
  methods: {
    nextStep() {
      this.$refs["callVolumeForm"].validate((valid) => {
        if (valid) {
          this.$emit("nextStep");
        } else {
          return false;
        }
      });
    },
    previous() {
      this.$emit("previous");
    },
  },
};
</script>

<style lang="scss" scoped>
.group-adjustment {
  width: 480px;
  .group-adjustment-desc {
    text-align: center;
    .desc-content {
      margin: 20px 0;
    }
  }
  .group-adjustment-btn {
    display: flex;
    justify-content: center;
    margin-top: 40px;
  }
}
</style>