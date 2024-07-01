<template>
  <div>
    <p class="protocol-desc">调用API时，通过哪种协议调用？</p>
    <div class="protocol-content">
      <el-radio-group v-model="apiSeivece">
        <div class="protocol-radio">
          <el-radio :label="1" :disabled="+apiSeivece === 2">JSF协议</el-radio>
        </div>
        <div class="protocol-radio">
          <el-radio :label="2" :disabled="+apiSeivece === 1">HTTP协议</el-radio>
        </div>
      </el-radio-group>
    </div>
    <el-button type="primary" @click="nextStep">下一步</el-button>
  </div>
</template>
<script>
export default {
  data() {
    return {
      apiSeivece: 1,
    };
  },
  mounted() {
    const {query} = this.$route || {};
    query.type === 'jsf' && (this.apiSeivece = 1);
    query.type === 'http' && (this.apiSeivece = 2);
    console.log('mounted')
  },
  methods: {
    nextStep() {
      this.$emit("next");
      this.$emit("apiService",this.apiSeivece)
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
  margin: 40px auto;
  display: flex;
  justify-content: center;
  text-align: left;
  .protocol-radio {
    margin: 20px auto;
  }
}
</style>
