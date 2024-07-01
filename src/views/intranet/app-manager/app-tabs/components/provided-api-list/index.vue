<
<template>
  <div>
    <el-radio-group v-model="isSwitch" style="margin-bottom: 20px">
      <el-radio-button :label="false">JSF协议</el-radio-button>
      <el-radio-button :label="true">HTTP协议</el-radio-button>
    </el-radio-group>
    <JsfList v-if="!isSwitch && appKey" :appKey="appKey" />
    <HttpList v-else-if="isSwitch && appKey" :appKey="appKey" />
  </div>
</template>

<script>
import request from "@/utils/request";
import JsfList from "./components/jsf-list.vue";
import HttpList from "./components/http-list.vue";

export default {
  components: {
    JsfList,
    HttpList,
  },
  data() {
    return {
      isSwitch: false,
      appKey: "",
    };
  },
  methods: {
    getAppKey() {
      let url = "/app/getApp";
      request({
        url: url,
        method: "get",
        params: { id: this.$route.params.id },
      })
        .then((rsp) => {
          if (rsp.data) {
            this.appKey = rsp.data.code;
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },
  },
  mounted() {
    this.getAppKey();
  },
};
</script>

<style lang="scss" scoped></style>
