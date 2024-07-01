<template>
  <div>
    <div class="entrySuccess">
      <i class="el-icon-success"></i>
    </div>
    <h3>注册成功</h3>
    <p style="margin: 10px 0 50px" class="c-666">
      快去管理API吧，
      <span class="primary">{{ time }}s</span>后自动跳转到API管理页
    </p>
    <el-row>
      <el-button type="primary" @click="next">去管理API</el-button>
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
      time: 3,
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
      clearInterval(this.intervalID);
      const response = await this.findApiForWeb().catch(() => {
        throw new Error("next findApiForWeb");
      });
      const { data } = response;
      if (data.length > 0) {
        const [first] = data;
        this.$router.push({
          name: "ApiManagerDetail",
          params: { id: first.id, type: "jsf" },
          query: { tabName: "basic-data" },
        });
      }
    },
  },
  mounted() {
    this.qualifiedName = this.apiMessage.qualifiedName;
    let _this = this;
    _this.intervalID = window.setInterval(async function () {
      _this.time--;
      if (_this.time <= 0) {
        clearInterval(_this.intervalID);
        const response = await _this.findApiForWeb().catch(() => {
          throw new Error("mounted findApiForWeb");
        });
        const { data } = response;
        if (data.length > 0) {
          const [first] = data;
          _this.$router.push({
            name: "ApiManagerDetail",
            params: { id: first.id, type: "jsf" },
            query: { tabName: "basic-data" },
          });
        }
      }
    }, 1000);
  },
  beforeRouteLeave(to, from, next) {
    clearInterval(this.intervalID);
    next();
  },
};
</script>
<style scoped>
.entrySuccess {
  font-size: 36px;
  color: #26a872;
}
</style>
