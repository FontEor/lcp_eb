<template>
  <div class="app-container">
    <steps v-bind="stepsObj" />
    <div style="text-align: center; margin-top: 30px">
      <div style="margin-bottom: 20px">
        <img src="@/assets/img/publishEdit.png" width="80px" height="80px" />
      </div>
      <div style="width: 350px; margin: 0 auto">
        请确认您已<a
          href="javascript:void(0)"
          @click="showAliasList"
          style="color: #3c6ef0"
          >维护JSF别名</a
        >，否则调用方可能无法正常申请调用您的API。
      </div>
    </div>
    <div style="margin-top: 30px; text-align: center">
      <el-button @click="previous">上一步</el-button>
      <el-button type="primary" @click="next">下一步</el-button>
    </div>
  </div>
</template>

<script>
import steps from "@/components/steps/index.vue";
import request from "@/utils/request";
import gwApiRequest from "@/utils/gwApiRequest.js";

export default {
  components: {
    steps
  },
  data() {
    return {
      stepsObj: {
        active: 1,
        title: "发布API",
        tiptitle: [
          "部署服务",
          "维护JSF别名",
          "填写发布原因",
          "提交发布请求成功"
        ]
      },
      id: this.$route.params.id,
      qualifiedName: this.$route.query.qualifiedName
    };
  },
  methods: {
    async findApiBaseInfo(id) {
      const url = "/ApiManagerService/findApiBaseInfo";
      const data = [{ id }];
      return await gwApiRequest.post(url, JSON.stringify(data));
    },

    showAliasList() {
      window.open("/admin/#/apiManager/detail/jsf/" + this.id, "_blank");
    },
    previous() {
      this.$router.push({
        // path: "/apiManager/apiTabs/publishOne",
        name: "ApiManagerApiTabsPublishOne",
        params: { id: this.id },
        query: { qualifiedName: this.qualifiedName }
      });
    },
    next() {
      this.$router.push({
        // path: "/apiManager/apiTabs/publishFour",
        name: "ApiManagerApiTabsPublishAddThree",
        params: { id: this.id },
        query: { qualifiedName: this.qualifiedName }
      });
    }
  }
};
</script>