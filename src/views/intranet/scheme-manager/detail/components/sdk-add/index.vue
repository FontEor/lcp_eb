<template>
  <div class="app-container">
    <el-page-header v-on:back="goBack" content="SDK信息" />
    <div class="my-wrap" style="width: 100%">
      <Steps v-bind="stepsObj" />
      <Step1 v-if="stepsObj.active === 0" :sdkId="sdkId" />
      <Step2 v-if="stepsObj.active === 1" :showInfoName="showInfoName" />
      <!-- <Step3 v-if="stepsObj.active === 2" /> -->
      <Step4 v-if="stepsObj.active === 2" />
      <Step5 v-if="stepsObj.active === 3" @gotoSdkList="goBack" />
    </div>
  </div>
</template>

<script>
import { parseTime } from "@/utils";
import Steps from "@/components/steps/index.vue";
import Step1 from "./components/step1.vue";
import Step2 from "./components/step2.vue";
import Step3 from "./components/step3.vue";
import Step4 from "./components/step4.vue";
import Step5 from "./components/step5.vue";

export default {
  name: "SdkAdd",
  components: {
    Steps,
    Step1,
    Step2,
    Step3,
    Step4,
    Step5,
  },
  props: {
    sdkId: Number,
    showInfoName: String,
  },
  mounted() {
    let step = this.$route.query.addStep;
    if (step) {
      this.stepsObj.active = parseInt(step);
    } else {
      this.stepsObj.active = 0;
    }
  },
  data() {
    return {
      visible: false,
      stepsObj: {
        active: 0,
        tiptitle: [
          "填写基本信息",
          "选择SDK包含的接口",
          // "下载SDK工程文件",
          "生成并上传SDK",
          "完成",
        ],
      },
      loading: true,
    };
  },

  filters: {
    parseTimefilter(obj, fomart) {
      return parseTime(obj, fomart);
    },
    parseAuthfilter(obj) {
      if (obj === true) {
        return "需要";
      }
      return "不需要";
    },
    parseStatusfilter(obj) {
      if (obj === 1) {
        return "初始化";
      }
      return "已发布";
    },
  },
  methods: {
    goBack() {
      this.$emit("showSdkEvent");
      this.$router.push({
        // path: '/openBiz/openBizDetail',
        name: "OpenBizOpenBizDetail",
        params: { id: this.$route.params.id },
        query: { tag: "sdkList" },
      });
    },
    querySdkList() {
      this.loading = false;
    },
    search() {
      this.querySdkList();
    },
    onSearchChange() {
      if (this.listQuery.searchKeyWord.trim().length === 0) this.querySdkList();
    },
    addSdk() {},
    // 为每一行加一个class 可以用来加样式
    rowClassName({ row, rowIndex }) {
      row.number = rowIndex + 1;
    },
    paginationChange(p) {
      this.listQuery.pageNumb = p.page;
      this.listQuery.pageSize = p.limit;
      this.querySdkList();
    },
    modifySdk(id) {},
    uploadSdk(id) {},
    deletSdk(id) {},
  },
};
</script>

<style lang="scss" scoped>
.bottom-btn-group {
  text-align: right;
  margin: 0 auto;
  width: 72%;
  .last {
    margin-right: 10px;
  }
}

.img-block {
  text-align: center;
}
</style>
