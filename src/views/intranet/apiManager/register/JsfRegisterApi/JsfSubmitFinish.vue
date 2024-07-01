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
      <el-button @click="next">继续注册API</el-button>
      <el-button type="primary" @click="next">去完善API基础数据</el-button>
    </el-row>
  </div>
</template>
<script>
import gwApiRequest from "@/utils/gwApiRequest.js";

export default {
  props: {
    apiMessage: Object,
  },
  data() {
    return {
      intervalID: "",
      qualifiedName: "",
    };
  },
  methods: {
    async findApiForWeb() {
      const url = "/ApiDepotService/findApiForWeb";
      const { qualifiedName } = this;
      const data = [{ qualifiedName}];
      return await gwApiRequest.post(url, JSON.stringify(data));
    },

    async next() {
      const response = await this.findApiForWeb().catch(() => {
        throw new Error("next findApiForWeb");
      });
      const { data } = response;
      if (data.length > 0) {
        const [first] = data;
        this.$router.push({
          name: "ApiManagerDetail",
          params: { id: first.id , type:"jsf"},
          query: { tabName: "basic-data" },
        });
      }
    },
  },
  mounted() {
    this.qualifiedName = this.apiMessage.qualifiedName;
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
