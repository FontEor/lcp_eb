<template>
  <div class="app-container">
    <steps v-bind="stepsObj" />
    <div style="text-align: center; margin-top: 30px">
      <div style="margin-bottom: 20px">
        <img src="@/assets/img/publishDeploy.png" width="80px" height="80px" />
      </div>
      <div style="width: 350px; margin: 0 auto">
        <!-- 按照<a :href="this.apiPublishPath" style="color: #3C6EF0" target="_blank">《API部署手册》</a>部署您的服务，否则用户可能无法成功调用API。部署成功后，可在平台查看调用方与调用量。 -->
        确认您的服务是否已部署，否则用户可能无法成功调用API。
      </div>
    </div>
    <!-- <div style="margin-top: 30px;text-align: center">
    <el-checkbox @change="checkChoose" class="my-checkbox">确认已按照《API部署手册》部署服务</el-checkbox>
  </div> -->
    <div style="margin-top: 30px; text-align: center">
      <el-button type="primary" @click="next">下一步</el-button>
    </div>
  </div>
</template>
<script>
import steps from "@/components/steps/index.vue";

export default {
  components: {
    steps
  },
  data() {
    return {
      // disabled: false,
      stepsObj: {
        active: 0,
        title: "发布API",
        tiptitle: [
          "部署服务",
          "维护JSF别名",
          "填写发布原因",
          "提交发布请求成功"
        ]
      },
      id: this.$route.params.id,
      qualifiedName: this.$route.query.qualifiedName,
      apiPublishPath: ""
    };
  },
  created() {
    this.apiPublishPath =
      window.location.protocol +
      "//" +
      `${window.location.host}/#` +
      `${window.env.docApiPublish}`;
    console.log(this.$route.query.qualifiedName);
  },
  methods: {
    // checkChoose() {
    //   this.disabled = event.target.checked;
    // },
    next() {
      this.$router.push({
        // path: "/apiManager/apiTabs/publishTwo",
        name: "ApiManagerApiTabsPublishTwo",
        params: { id: this.id },
        query: { qualifiedName: this.qualifiedName }
      });
    }
  }
};
</script>