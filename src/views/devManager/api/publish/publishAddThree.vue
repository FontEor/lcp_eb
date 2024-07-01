<template>
  <div class="app-container">
    <steps v-bind="stepsObj" />
    <div class="entryFormBox tc" style="width: 80%; margin-left: 10%">
      <el-form
        :model="formData"
        :rules="formrules"
        class="textarea"
        ref="postMessageForm"
      >
        <el-form-item prop="postMessage">
          <el-input
            type="textarea"
            :rows="6"
            placeholder="请填写本次发布的原因，如：快递b2c业务，新增取件码核销场景开放给外部客户。"
            v-model="formData.postMessage"
          >
          </el-input>
        </el-form-item>
      </el-form>
    </div>
    <div style="margin-top: 30px; text-align: center">
      <el-button @click="previous">上一步</el-button>
      <el-button type="primary" @click="next">发布</el-button>
    </div>
  </div>
</template>

<script>
import steps from "@/components/steps/index.vue";
import monitor from "@/views/devManager/api/manager/livemonitor.vue";
import gwApiRequest from "@/utils/gwApiRequest.js";
import { parseTime } from "@/utils";

export default {
  components: {
    steps,
    monitor
  },
  data() {
    return {
      stepsObj: {
        active: 2,
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
      formData: {
        postMessage: ""
      },
      formrules: {
        postMessage: [
          { required: true, message: "请填写发布信息", trigger: "blur" }
        ]
      }
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
        name: "ApiManagerApiTabsPublishTwo",
        params: { id: this.id },
        query: { qualifiedName: this.qualifiedName }
      });
    },
    next() {
      this.$refs.postMessageForm.validate(valid => {
        if (!valid) {
          return false;
        } else {
          gwApiRequest({
            url: "/ApiManagerService/applyPublishApi",
            method: "post",
            data: JSON.stringify([
              { id: this.id, reason: this.formData.postMessage }
            ])
          })
            .then(rsp => {
              this.fetchApiSummary(this.id);
              this.$router.push({
                name: "ApiManagerApiTabsPublishFour",
                params: { id: this.id },
                query: { qualifiedName: this.qualifiedName }
              });
            })
            .catch(e => {
              console.log(e);
            });
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.textarea {
  width: 63%;
  margin: 0 auto;
}
</style>