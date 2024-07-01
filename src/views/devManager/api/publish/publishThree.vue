<template>
  <div class="app-container">
    <steps v-bind="stepsObj" />
    <div class="entryFormBox tc" style="width: 80%; margin-left: 10%">
      <monitor />
    </div>
    <div style="margin-top: 30px; text-align: center">
      <el-button @click="previous">上一步</el-button>
      <el-button type="primary" @click="next">发 布</el-button>
    </div>
  </div>
</template>

<script>
import steps from "@/components/steps/index.vue";
import monitor from "@/views/devManager/api/manager/livemonitor.vue";
import request from "@/utils/request";
import gwApiRequest from "@/utils/gwApiRequest.js";

export default {
  components: {
    steps,
    monitor,
  },
  data() {
    return {
      stepsObj: {
        active: 2,
        title: "发布API",
        tiptitle: ["部署服务", "维护JSF别名", "完成"],
      },
      id: this.$route.params.id,
      qualifiedName: this.$route.query.qualifiedName,
    };
  },
  methods: {
    async findApiBaseInfo(id) {
      const url = "/ApiManagerService/findApiBaseInfo";
      const data = [{ id }];
      return await gwApiRequest.post(url, JSON.stringify(data));
    },

    updateTitle(e) {
      this.id = e.id;
      this.qualifiedName = e.qualifiedName;
      this.createUser = e.createUser;
      this.createTime = parseTime(e.createTime, "{y}-{m}-{d} {h}:{i}");
      this.updateTime = parseTime(e.updateTime, "{y}-{m}-{d} {h}:{i}");
      this.status = e.status;
    },
    async fetchApiSummary(id) {
      const { data } = await this.findApiBaseInfo(id).catch(() => {
        throw new Error("fetchApiInstance findApiBaseInfo");
      });
      this.updateTitle(data);
    },
    previous() {
      this.$router.push({
        // path: "/apiManager/apiTabs/publishTwo",
        name: "ApiManagerApiTabsPublishTwo",
        params: { id: this.id },
        query: { qualifiedName: this.qualifiedName },
      });
    },
    next() {
      gwApiRequest({
        url: "/ApiManagerService/publishApi",
        method: "post",
        data: JSON.stringify([{ id: this.id }])
      })
        .then((rsp) => {
          this.fetchApiSummary(this.id);
          this.$router.push({
            // path: "/apiManager/apiTabs/publishFour",
            name: "ApiManagerApiTabsPublishFour",
            params: { id: this.id },
            query: { qualifiedName: this.qualifiedName },
          });
        })
        .catch((e) => {
          console.log(e);
        });
    },
  },
};
</script>
