<template>
  <div class="app-container">
    <steps v-bind="stepsObj" />
    <div>
      <div style="margin-top: 30px; margin-bottom: 20px; text-align: center">
        <img src="@/assets/img/publishFinish.png" width="60px" height="60px" />
      </div>
      <!-- <div style="text-align: center; width: 350px; margin: 0 auto;">
        发布成功，您可进一步管理API，或去前台查看已发布的API
      </div> -->
      <p class="title">提交成功</p>
      <div class="des">
        <p>
          您可联系<a href="timline://chat/?topin=zhangjuzheng3">zhangjuzheng3</a
          >或<a href="timline://chat/?topin=dongguojun1">dongguojun1</a
          >提醒审批。
        </p>
        <p>审核通过后发布内容生效</p>
      </div>
    </div>
    <div style="margin-top: 30px; text-align: center">
      <el-button @click="onWatchToFront">去前台查看API</el-button>
      <el-button type="primary" @click="onManagerApi">继续管理API</el-button>
    </div>
  </div>
</template>
<script>
import steps from "@/components/steps/index.vue";
export default {
  components: {
    steps,
  },
  data() {
    return {
      stepsObj: {
        active: 3,
        title: "发布API",
        tiptitle: [
          "部署服务",
          "维护JSF别名",
          "填写发布原因",
          "提交发布请求成功",
        ],
      },
      id: this.$route.params.id,
      qualifiedName: this.$route.query.qualifiedName,
    };
  },
  created() {
    console.log(this.$route.query.qualifiedName);
  },
  methods: {
    onWatchToFront() {
      window.open(
        "/#/apiMethodList?qualifiedName=" + this.qualifiedName,
        "_blank"
      );
    },
    onManagerApi() {
      this.$router.push({
        // path: '/apiManager/apiTabs',
        name: "ApiManagerDetail",
        params: { id: this.id, type: "jsf" },
        query: { tabName: "basic-data" },
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.title {
  text-align: center;
  font-weight: bold;
  font-size: 20px;
  padding-bottom: 20px;
}
.des {
  text-align: center;
  //width: 224px;
  margin: 0 auto;
  font-size: 1rem;
}
</style>
