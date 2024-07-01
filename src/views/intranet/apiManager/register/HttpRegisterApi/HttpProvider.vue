<template>
  <div>
    <p class="protocol-desc">请选择通过哪种方式提供这个接口</p>
    <div class="protocol-content">
      <el-radio-group v-model="type">
        <div class="radio-item">
          <el-radio disabled :label="1">一个JSF服务的接口方法</el-radio>
        </div>
        <div class="radio-item">
          <el-radio :label="2">IP端口组成的服务器集群</el-radio>
        </div>
      </el-radio-group>
    </div>
    <div class="footer">
      <el-button @click="previous">上一步</el-button>
      <el-button type="primary" @click="nextStep">下一步</el-button>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      type: 2,
    };
  },
  mounted() {},
  methods: {
    nextStep() {
      this.$emit("next");
      this.$emit("provideMethod", this.type);
    },
    previous() {
      this.$emit("previous");
    },
  },
};
</script>
<style lang="scss" scoped>
.protocol-desc {
  margin-top: 40px;
  font-size: 16px;
}
.protocol-content {
  width: 500px;
  margin: 40px auto;
  .radio-item {
    margin: 20px auto;
  }
}
</style>
