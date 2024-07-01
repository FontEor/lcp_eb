<template>
  <div class="publish-api">
    <Title text="发布API" />
    <Steps :active="active" :titleList="titleList" />
    <div class="form-container">
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
          <el-button @click="previous">上一步</el-button>
          <el-button type="primary" @click="nextStep('apiInfoForm')"
            >下一步</el-button
          >
        </div>
      </div>
      <!-- API发布第三步，填写审批人ERP账号 -->
      <div v-show="active === 2">
        <p class="title">请填写指定的审批人ERP账号</p>
        <p class="title">审批通过后，API发布内容生效</p>
        <div class="form-content">
          <el-form
            ref="apiApproverForm"
            :rules="apiApproverRules"
            :model="apiApproverForm"
            label-width="126px"
          >
            <el-form-item label="审批人ERP账号" prop="approver">
              <ErpPrincipal
                :formDataPrincipal.sync="apiApproverForm.approver"
                placeholder="审批人可在京ME流程中心审批"
              />
            </el-form-item>
          </el-form>
        </div>
        <div class="footer">
          <el-button @click="previous">上一步</el-button>
          <el-button
            type="primary"
            @click="submitForm('apiApproverForm')"
            v-loading.fullscreen.lock="fullscreenLoading"
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
        <p class="success-tip">提醒审批人尽快审批吧，审批通过后发布内容生效</p>
        <div class="footer">
          <el-button @click="gotoApistore">去前台查看API</el-button>
          <el-button type="primary" @click="backApiList">继续管理API</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Title from "@/components/Title.vue";
import Steps from "@/components/Steps.vue";
import httpDetail from "@/api/intranet/apiManager/httpDetail/index.js";
import basicInfo from "@/api/intranet/apiManager/httpDetail/basicInfo.js";
import ErpPrincipal from "@/views/intranet/apiManager/components/ErpPrincipal.vue";
import { findBusinessCategoryList } from "@/api/apiStore/api";

export default {
  components: { Title, Steps, ErpPrincipal },
  name: "PublishApi",
  data() {
    return {
      radio: 1,
      progress: 0,
      fullscreenLoading: false,
      loading: false,
      active: 0,
      titleList: [
        "确认API信息",
        "填写API调用量",
        "填写审批人ERP账号",
        "提交发布请求成功",
      ],
      apiCategoryForm: {
        name: "",
        remark: "",
        category: {},
      },
      apiCategoryRules: {
        category: [{ required: true, message: "API分类不能为空" }],
      },
      apiInfoForm: {
        tps: null,
        dailyCall: null,
      },
      apiInfoRules: {
        tps: [
          { required: true, message: "每秒调用量峰值不能为空" },
          {
            type: "number",
            min: 1,
            max: 100000000,
            message: "每日发送量峰值必须为1-100000000的整数值",
          },
        ],
        dailyCall: [
          { required: true, message: "每日调用量峰值不能为空" },
          {
            type: "number",
            min: 1,
            max: 100000000,
            message: "每日发送量峰值必须为1-100000000的整数值",
          },
        ],
      },
      apiApproverForm: {
        approver: "",
      },
      apiApproverRules: {
        approver: [{ required: true, message: "审批人ERP账号不能为空" }],
      },
      categoryOptions: [],
    };
  },
  async created() {
    const response = await this.getApi();
    const {
      name,
      remark,
      isOnline,
      categoryId,
      categoryName,
      tps,
      dailyCall,
      approver,
    } = response.data;
    this.apiCategoryForm.name = name;
    this.apiCategoryForm.remark = remark;
    this.queryApiCategoryList();
    if (isOnline === 1) {
      //当前API已发布过,二次发布时回显首次发布时选中数据
      this.apiCategoryForm.category = { categoryId, categoryName };
      this.apiInfoForm.tps = tps;
      this.apiInfoForm.dailyCall = dailyCall;
      this.apiApproverForm.approver = approver || "";
    }
  },
  methods: {
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
    previous() {
      if (this.active > 0) {
        this.active--;
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.fullscreenLoading = true;
          const id = Number(this.$route.params.id);
          const categoryId = Number(this.apiCategoryForm.category.categoryId);
          const categoryName = this.apiCategoryForm.category.categoryName;
          const tps = Number(this.apiInfoForm.tps);
          const dailyCall = Number(this.apiInfoForm.dailyCall);
          const approver = this.apiApproverForm.approver;
          const data = {
            id,
            categoryId,
            categoryName,
            tps,
            dailyCall,
            approver,
          };
          httpDetail
            .postApi(data)
            .then((res) => {
              this.fullscreenLoading = false;
              if (this.active < 3) {
                this.active++;
              }
            })
            .catch((error) => {
              this.fullscreenLoading = false;
              const { message } = error.data;
              message && this.$message.error(message);
              throw new Error(error);
            });
        } else {
          return false;
        }
      });
    },
    gotoApistore() {
      window.location.href = "/#/apiStore?interfaceType=" + "http";
    },
    backApiList() {
      this.$router.push({ path: "/apiManager/mobile" });
    },
    async getApi() {
      const id = this.$route.params.id;
      const gwParams = [{ id }];
      return await httpDetail.getApi(gwParams).catch((error) => {
        const { message } = error.data;
        message && this.$message.error(message);
        throw new Error(error);
      });
    },
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
    //查询审批人接口
    async findUser(erp) {
      const params = { erp };
      return await basicInfo.findUser(params).catch((error) => {
        const { message } = error.data;
        message && this.$message.error(message);
        throw new Error(error);
      });
    },
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
      width: 480px;
      margin-top: 30px;
    }
    .title {
      margin-top: 10px;
      text-align: center;
    }
    .footer {
      text-align: center;
      margin-top: 40px;
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
