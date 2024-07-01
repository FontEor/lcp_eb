<template>
  <div class="publish-api">
    <Title text="发布API" />
    <Steps :active="active" :titleList="titleList" />
    <div class="form-container" v-loading="publishApiLoading">
      <!-- API发布第一步，确认API信息 -->
      <div v-show="active === 0">
        <p class="title">请选择API分类</p>
        <p class="title">API在API仓库中，将按照选择的API分类展示</p>
        <div class="form-content">
          <el-form
            ref="apiCategoryForm"
            :rules="apiCategoryRules"
            :model="apiCategoryForm"
            label-width="120px"
          >
            <el-form-item label="中文名称"
              ><span>{{ apiCategoryForm.name }}</span>
            </el-form-item>
            <el-form-item label="功能描述"
              ><span>{{ apiCategoryForm.remark }}</span>
            </el-form-item>
            <el-form-item label="API分类" prop="category">
              <el-select
                v-model="apiCategoryForm.category"
                :filterable="true"
                placeholder="请选择API分类"
                value-key="categoryId"
                style="width: 100%"
              >
                <el-option
                  v-for="item in categoryOptions"
                  :key="item.categoryId"
                  :label="item.categoryName"
                  :value="item"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
        <div class="footer">
          <el-button type="primary" @click="nextStep('apiCategoryForm')"
            >下一步</el-button
          >
        </div>
      </div>
      <!-- API发布第二步，填写API调用量 -->
      <div v-show="active === 1">
        <p class="title">请填写API的每秒/日调用量峰值</p>
        <p class="title">物流开放平台会参考调用量峰值，判断是否需要扩容</p>
        <div class="form-content">
          <el-form
            ref="apiInfoForm"
            :rules="apiInfoRules"
            :model="apiInfoForm"
            label-width="120px"
          >
            <el-form-item label="每秒调用量峰值" prop="tps"
              ><el-input
                v-model.number="apiInfoForm.tps"
                placeholder="请输入API的每秒调用量峰值"
              ></el-input>
            </el-form-item>
            <el-form-item label="每日调用量峰值" prop="dailyCall">
              <el-input
                v-model.number="apiInfoForm.dailyCall"
                placeholder="请输入API的每日调用量峰值"
              ></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="footer">
          <el-button @click="active = 0">上一步</el-button>
          <el-button type="primary" @click="nextStep('apiInfoForm')"
            >下一步</el-button
          >
        </div>
      </div>
      <!-- API发布第三步，填写发布原因 -->
      <div v-show="active === 2">
        <div class="form-content">
          <el-form
            ref="apiApproverForm"
            :rules="apiApproverRules"
            :model="apiApproverForm"
            label-width="0px"
          >
            <el-form-item prop="reason">
              <el-input
                v-model="apiApproverForm.reason"
                :rows="5"
                type="textarea"
                placeholder="请填写本次发布的原因，如快递回传业务，新增XX字段用于回传XX内容给外部客户。"
              />
            </el-form-item>
          </el-form>
        </div>
        <div class="footer">
          <el-button @click="active = 1">上一步</el-button>
          <el-button
            :loading="loading"
            type="primary"
            @click="handleConfirmPublish('apiApproverForm')"
            >发布</el-button
          >
        </div>
      </div>
      <!-- API发布第四步，提交发布请求成功 -->
      <div v-show="active === 3">
        <div class="submit-success">
          <i class="el-icon-success"></i>
        </div>
        <p class="success-title">提交成功</p>
        <p class="success-tip">
          您可联系<a href="timline://chat/?topin=zhangjuzheng3">zhangjuzheng3</a
          >或<a href="timline://chat/?topin=dongguojun1">dongguojun1</a
          >提醒审批。
        </p>
        <p class="success-tip">审批通过后发布内容生效。</p>
        <div class="footer">
          <el-button
            type="primary"
            @click="
              $router.push({
                name: 'ApiManagerPassBackDetail',
                params: $route.params,
              })
            "
            >继续管理API</el-button
          >
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Title from "@/components/Title.vue";
import Steps from "@/components/Steps.vue";
import { findBusinessCategoryList } from "@/api/apiStore/api";
import gateway from "@/api/intranet/gateway/index.js";

export default {
  components: { Title, Steps },
  name: "PublishApi",
  data() {
    return {
      loading: false,
      publishApiLoading: true,
      active: 0,
      titleList: [
        "确认API信息",
        "填写API调用量",
        "填写发布原因",
        "提交发布请求成功",
      ],
      apiCategoryForm: {
        name: "",
        remark: "",
        category: null,
      },
      apiCategoryRules: {
        category: [{ required: true, message: "请选择API分类" }],
      },
      apiInfoForm: {
        tps: null,
        dailyCall: null,
      },
      apiInfoRules: {
        tps: [
          { required: true, message: "请输入API的每秒调用量峰值" },
          {
            type: "number",
            min: 1,
            max: 100000000,
            message: "每日发送量峰值必须为1-100000000的整数值",
          },
        ],
        dailyCall: [
          { required: true, message: "请输入API的每日调用量峰值" },
          { type: "number", message: "API的每日调用量峰值要求为数字值" },
          {
            type: "number",
            min: 1,
            max: 100000000,
            message: "每日发送量峰值必须为1-100000000的整数值",
          },
        ],
      },
      apiApproverForm: {
        reason: "",
      },
      apiApproverRules: {
        reason: [
          { required: true, message: "请输入发布原因" },
          {
            max: 200,
            message: "最多输入200字",
          },
        ],
      },
      categoryOptions: [],
      confirmPublishDebounceTimer: null,
    };
  },
  methods: {
    // 查询API基本信息
    async queryOuterApiBaseInfo() {
      const data = [this.$route.params];
      return await gateway.ApiManagerService.queryOuterApiBaseInfo(data);
    },
    // 判断是否进行发布
    async verifyOuterApi() {
      const data = [this.$route.params];
      return await gateway.ApiManagerService.verifyOuterApi(data);
    },
    //回传API发起审批/发布API接口
    async publishOuterApi() {
      const id = Number(this.$route.params.id);
      const reason = this.apiApproverForm.reason;
      const categoryId = Number(this.apiCategoryForm.category.categoryId);
      const categoryName = this.apiCategoryForm.category.categoryName;
      const dailyCall = Number(this.apiInfoForm.dailyCall);
      const tps = Number(this.apiInfoForm.tps);
      const data = [
        {
          id,
          categoryId,
          categoryName,
          tps,
          dailyCall,
          reason,
        },
      ];
      return await gateway.OuterDomainApiService.publishOuterApi(data);
    },

    // API基础数据
    async getApiBasicInfo() {
      await this.verifyOuterApi().catch((error) => {
        throw new Error(`getApiBasicInfo verifyOuterApi, ${error}`);
      });
      const response = await this.queryOuterApiBaseInfo().catch(() => {
        throw new Error(`getApiBasicInfo queryOuterApiBaseInfo, ${error}`);
      });
      const data = response.data;
      const { name, intr } = data;
      this.apiCategoryForm.name = name;
      this.apiCategoryForm.remark = intr || "";
      this.publishApiLoading = false;
    },
    //API分类列表
    queryApiCategoryList() {
      findBusinessCategoryList([{ pageSize: 10000, pageNumb: 1 }])
        .then((res) => {
          const data = res.data.map((item) => {
            const categoryId = item.id;
            const categoryName = item.name;
            return { categoryId, categoryName };
          });
          this.categoryOptions = data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    nextStep(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.active < 3) {
            this.active++;
          }
        } else {
          return false;
        }
      });
    },
    // 确认发布操作
    handleConfirmPublish(formName) {
      clearTimeout(this.confirmPublishDebounceTimer);
      this.confirmPublishDebounceTimer = setTimeout(() => {
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            this.loading = true;
            await this.publishOuterApi().catch((error) => {
              this.loading = false;
              throw new Error(`handleConfirmPublish publishOuterApi, ${error}`);
            });
            this.loading = false;
            this.nextStep(formName);
          } else {
            return false;
          }
        });
      }, 300);
    },
  },
  async created() {
    this.getApiBasicInfo();
    this.queryApiCategoryList();
  },
};
</script>
<style lang="scss" scoped>
.publish-api {
  margin: 0 20px;
  padding: 20px;
  background: #fff;
  min-height: calc(100vh - 120px);
  .form-container {
    display: flex;
    justify-content: center;
    align-items: center;
    .form-content {
      width: 580px;
      margin-top: 30px;
    }
    .title {
      margin-top: 10px;
      text-align: center;
    }
    .footer {
      text-align: center;
      margin-top: 20px;
    }
    .submit-success {
      font-size: 50px;
      color: #26a872;
      text-align: center;
    }
    .success-title {
      font-size: 22px;
      text-align: center;
    }
    .success-tip {
      margin-top: 20px;
      text-align: center;
    }
  }
}
</style>
