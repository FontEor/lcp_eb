<template>
  <div class="fill-group-message">
    <div class="form-content">
      <el-form
        ref="groupMessageForm"
        :rules="groupMessageRules"
        :model="groupMessageForm"
        label-width="120px"
      >
        <el-form-item label="英文名称" 
          ><span>{{ groupMessageForm.code }}</span>
        </el-form-item>
        <el-form-item label="中文名称" prop="cnName">
          <el-input
            v-model="groupMessageForm.cnName"
            placeholder="请输入中文名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="intr">
          <el-input
            v-model="groupMessageForm.intr"
            type="textarea"
            :rows="2"
            placeholder="描述"
          ></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="footer">
      <el-button @click="backApiGroupDetail()">取消</el-button>
      <el-button type="primary" @click="nextStep()"
        >下一步</el-button
      >
    </div>
  </div>
</template>

<script>
export default {
  props: {
    groupMessageForm: Object,
  },
  data() {
    return {
      groupMessageRules: {
        cnName: [
          { required: true, message: "请输入中文名称" },
          {
            pattern: /^[\u4e00-\u9fa5a-zA-Z0-9]*$/,
            message: "请输入中文、英文字母或数字",
          },
          {
            min: 2,
            max: 20,
            message: "请输入2到20个字符",
          },
        ],
        intr: [{ required: true, message: "请输入描述" }],
      },
    };
  },
  methods: {
    nextStep() {
      this.$refs["groupMessageForm"].validate((valid) => {
        if (valid) {
          this.$emit("nextStep");
        } else {
          return false;
        }
      });
    },
    backApiGroupDetail() {
      this.$router.push({
        name: "ApiManagerApiGroupDetail",
        params: { id: this.$route.params.id },
      });
    },
   
  },
};
</script>

<style lang="scss" scoped>
.fill-group-message {
  .form-content {
    width: 380px;
    margin-top: 30px;
  }
  .footer {
    text-align: center;
    margin-top: 40px;
  }
}
</style>