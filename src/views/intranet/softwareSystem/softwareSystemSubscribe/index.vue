<template>
  <div>
    <SubscribeList
      v-if="num === 1"
      @next="updateNum"
      :tenementInfo="tenementInfo"
      :systemMessage="systemMessage"
    ></SubscribeList>
    <SubscribeVersion
      v-if="num === 2"
      @back="updateNum"
      :tenementInfo="tenementInfo"
      :systemMessage="systemMessage"
    ></SubscribeVersion>
  </div>
</template>

<script>
import request from "@/utils/request";
import SubscribeList from "./subscribe.vue";
import SubscribeVersion from "./subscribeVersion.vue";
export default {
  components: { SubscribeList, SubscribeVersion },
  data() {
    return {
      tenementInfo: {},
      systemMessage: {},
      num: 0,
    };
  },
  methods: {
    updateNum() {
      if (this.num === 1) {
        this.num = 2;
      } else {
        this.num = 1;
      }
    },
     /**
     * 获得软件系统信息
     */
    fetchProductSummary(productId) {
      let url = "/product";
      request({
        url: url,
        method: "get",
        params: { id: productId },
      })
        .then((rsp) => {
          this.systemMessage = rsp.data;
          //得到系统信息，则前往订阅第一个页面
          this.num = 1;
        })
        .catch((e) => {
          console.log(e);
        });
    },
  },
  created(){
    this.fetchProductSummary(this.$route.params.id);
  }
};
</script>

<style lang="scss" scoped>
</style>