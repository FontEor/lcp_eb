<template>
  <div>
    <div class="entrySuccess">
      <i class="el-icon-success"></i>
    </div>
    <p class="title">注册成功</p>
    <p style="margin: 10px 0 50px" class="c-666">
      快去完善API基础数据吧，完善后发布即可对外生效
    </p>
    <el-row>
      <el-button @click="registerApi">继续注册API</el-button>
      <el-button type="primary" @click="next">去完善API基础数据</el-button>
    </el-row>
  </div>
</template>
<script>
export default {
  props: {
    apiId: Number,
  },
  data() {
    return {};
  },
  mounted() {},
  methods: {
    registerApi() {
      this.$router.go(0);
    },
    next() {
      this.$router.push({
        name: "ApiManagerDetail",
        params: { type: "http", id: this.apiId },
      });
    },
  },
};
</script>
<style scoped>
.title {
  font-size: 22px;
}
.entrySuccess {
  font-size: 50px;
  color: #26a872;
}
</style>
