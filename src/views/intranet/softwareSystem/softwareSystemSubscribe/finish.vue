<template>
  <div align="center">
    <el-row>
      <el-col :offset="2" :span="20">
        版本正在开通中，预计需要1-2分钟完成开通，开通结果将通过邮件/咚咚告知。
      </el-col>
    </el-row>
    <el-row>
      <el-col :offset="2" :span="20">您可以关闭当前弹窗去进行其他操作</el-col>
    </el-row>
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <div class="finish-btn">
      <span class="dialog-footer" slot="footer">
        <el-button v-on:click="onCancel" type="primary">完成</el-button>
      </span>
    </div>
  </div>
</template>
<script>
export default {
  methods: {
    onCancel() {
      this.$emit("onCancel");
    },
  },
};
</script>
<style lang="scss" scoped>
.finish-btn {
  display: flex;
  justify-content: flex-end;
}
</style>