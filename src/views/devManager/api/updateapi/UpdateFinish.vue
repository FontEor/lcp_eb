<template>
  <div>
    <div class="entrySuccess">
      <i class="el-icon-success"></i>
    </div>
    <h3 class="textStyle">更新API成功</h3>
    <p
      v-if="publish"
      class="txtC"
      style="margin-bottom: 50px;text-align: center;color:red;"
    >
      发布API之后，才能对外生效。
    </p>
    <el-row class="txtC" style="text-align: center">
      <el-button  @click="nextPage">去API详情页</el-button>
      <el-button type="primary" @click="publishApi">发布API</el-button>
    </el-row>
  </div>
</template>
<script>
import request from "@/utils/request";
import gwApiRequest from '@/utils/gwApiRequest';
export default {
  props: {
    apiMessage: Object
  },
  data() {
    return {
      intervalID: "",
      publish: false,
      id:null,
    };
  },
  mounted() {
    this.publish = this.apiMessage.apiupdatecompare.publish;
    console.log(typeof this.publish, "类型");
    this.id=this.apiMessage.id;
  },
  methods: {
    nextPage() {
      clearInterval(this.intervalID);
      this.$router.push({
        // path: "/apiManager/apiTabs",
         name:"ApiManagerDetail",
         params:{id: this.id, type:"jsf"},             
         query: {tabName: "basic-data" }
      });
    },
    publishApi() {
      gwApiRequest({
        url: "/ApiManagerService/verifyPublishApi",
        method: "post",
        data: JSON.stringify([{
          id: this.id
        }])
      })
        .then(rsp => {
          this.$router.push({
            // path: "/apiManager/apiTabs/publishOne",
            name:"ApiManagerApiTabsPublishOne",
            params:{id:this.id},
            query: {
              qualifiedName: this.qualifiedName
            }
          });
        })
        .catch(e => {
          console.log(e);
        });
    }
  },
  beforeRouteLeave(to, from, next) {
    // clearInterval(this.intervalID);
    next();
  }
};
</script>
<style scoped>
.entrySuccess {
  font-size: 36px;
  color: #26a872;
}

.textStyle {
  margin-bottom: 40px;
}
</style>
