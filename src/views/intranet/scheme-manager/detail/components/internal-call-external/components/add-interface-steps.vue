<template>
  <div class="add-interface-steps">
    <div class="add-interface-steps__header">
      <el-page-header @back="backToList" content="添加接口" />
    </div>
    <div class="add-interface-steps__step">
      <Steps :active="active" :titleList="titleList" />
      <!-- 第一步：选择接口 -->
      <div class="step__form" v-show="active === 0">
        <h1 class="form__title">从API仓库选择接口</h1>
        <p class="form__desc">
          从API仓库中选择对接方案的相关接口，这些接口将会被开放到外网。开放其他团队的接口前，请与接口研发负责人确认是否可开放。
        </p>
        <el-form
          class="form__interface"
          ref="stepForm"
          :model="stepForm"
          :rules="stepFormRules"
          label-width="120px"
        >
          <el-form-item label="接口URI" prop="apiUrl">
            <el-select
              style="width: 320px"
              v-model="stepForm.apiUrl"
              filterable
              remote
              :remote-method="remoteUrlMethod"
              @change="handleUrlChange"
              :loading="loading"
              placeholder="输入接口URI，如：/sendPackInfoBack"
            >
              <el-option
                v-for="(item, index) in urlOption"
                :key="index"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="接口所属分组" prop="code">
            <el-select
              style="width: 320px"
              v-model="stepForm.code"
              placeholder="请选择接口所属分组"
            >
              <el-option
                v-for="(item, index) in domainsOption"
                :key="index"
                :label="item.code"
                :value="item.code"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <el-button class="next-step-button" type="primary" @click="nextStep"
          >下一步</el-button
        >
      </div>
      <!-- 第二步：完成 -->
      <div class="add-interface-steps__finish" v-show="active === 1">
        <i class="el-icon-success" />
        <p class="finish__title">完成</p>
        <el-row>
          <el-button @click="backToList">返回接口列表</el-button>
          <el-button type="primary" @click="toExternalDocuments"
            >编辑接口文档</el-button
          >
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import Steps from "@/components/Steps.vue";
import openBusinese from "@/api/intranet/openBusinese/index.js";

export default {
  name: "AddInterfaceSteps",
  components: {
    Steps,
  },
  data() {
    return {
      active: 0,
      titleList: ["选择接口", "完成"],
      domainsOption: [],
      urlOption: [],
      loading: false,
      stepForm: {
        apiUrl: "",
        code: "",
      },
      stepFormRules: {
        apiUrl: [{ required: true, message: "接口URI不能为空" }],
        code: [
          { required: true, message: "接口所属分组不能为空", trigger: "blur" },
        ],
      },
      apiId: null,
    };
  },
  methods: {
    // 模糊查询API接口
    async remoteUrlMethod(query) {
      if (query !== "") {
        this.loading = true;
        setTimeout(async () => {
          this.loading = false;
          const response = await this.listFuzzyUrls(query);
          this.urlOption = response.data;
        }, 200);
      } else {
        this.urlOption = [];
      }
    },

    // 选择接口URI则查询查询接口所属分组列表
    handleUrlChange() {
      this.queryListGateWayDomainsByUrl();
    },

    // 查询接口所属分组
    async queryListGateWayDomainsByUrl() {
      const response = await this.listGateWayDomainsByUrl();
      this.domainsOption = response.data;
    },

    // 查询API接口
    async listFuzzyUrls(query) {
      const data = query;
      const response = await openBusinese.interfaceList.listFuzzyUrls(data);
      return response;
    },

    // 查询接口所属分组接口
    async listGateWayDomainsByUrl() {
      const data = this.stepForm.apiUrl;
      const response = await openBusinese.interfaceList.listGateWayDomainsByUrl(
        data
      );
      return response;
    },

    //保存添加接口数据
    async addOutwardApi() {
      const data = {
        unitId: this.$route.params.id,
        apiUrl: this.stepForm.apiUrl,
        domainOfGateway: this.stepForm.code,
        apiType: "test",
        type: 2,
      };
      const response = await openBusinese.interfaceList.addOutwardApi(data);
      return response;
    },

    backToList() {
      this.$emit("update:showComponent", "InterfaceTableList");
    },
    toExternalDocuments() {
      this.$emit("update:showComponent", "ExternalDocuments");
      this.$emit("update:currentRowId", this.apiId);
    },

    async nextStep() {
      this.$refs["stepForm"].validate(async (valid) => {
        if (valid) {
          const response = await this.addOutwardApi().catch((error) => {
            throw new Error("addOutwardApi Error");
          });
          this.$emit("updateDetailHeaderInfo");
          if (this.active < 1) {
            ++this.active;
          }
          this.apiId = response.data;
        } else {
          return false;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.add-interface-steps {
  .add-interface-steps__step {
    margin: 0 auto;
    width: 700px;
    .step__form {
      text-align: center;
      .form__title {
        font-size: 18px;
        font-weight: bold;
      }
      .form__desc {
        margin: 20px 48px;
      }
      .form__interface {
        margin: 0 auto;
        width: 420px;
      }
      .next-step-button {
        margin: 20px auto;
      }
    }
  }
  .add-interface-steps__finish {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .el-icon-success {
      font-size: 50px;
      color: #26a872;
    }
    .finish__title {
      margin: 10px auto 40px;
      font-size: 24px;
    }
  }
}
</style>