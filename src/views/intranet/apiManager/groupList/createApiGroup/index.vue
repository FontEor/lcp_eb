<template>
  <div class="create-api-group">
    <Title text="创建API分组" />
    <Steps :active="active" :titleList="titleList" />
    <div class="create-api-group-form">
      <!-- 第一步 填写分组基本信息 -->
      <div v-show="active === 0">
        <el-form
          :model="basicInfoForm"
          :rules="basicInfoFormRules"
          ref="basicInfoForm"
          label-width="120px"
        >
          <el-form-item label="分组英文名称" prop="code">
            <el-input
              v-model="basicInfoForm.code"
              placeholder="请输入分组英文名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="分组中文名称" prop="cnName">
            <el-input
              v-model="basicInfoForm.cnName"
              placeholder="请输入分组中文名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="分组描述" prop="intr">
            <el-input
              type="textarea"
              v-model="basicInfoForm.intr"
              placeholder="请输入分组使用场景的描述"
            ></el-input>
          </el-form-item>
        </el-form>
        <div class="form-btn">
          <el-button @click="handleCancel()">取消</el-button>
          <el-button type="primary" @click="nextStep('basicInfoForm')"
            >下一步</el-button
          >
        </div>
      </div>
      <!-- 第二步 选择分组内API的类型-->
      <div v-show="active === 1">
        <el-form
          :model="apiTypeForm"
          :rules="apiTypeFormRules"
          ref="apiTypeForm"
          label-width="120px"
        >
          <el-form-item label="API的发布范围" prop="serviceType">
            <el-radio v-model="apiTypeForm.serviceType" :label="1"
              >发布到内网</el-radio
            >
            <el-radio v-model="apiTypeForm.serviceType" :label="2"
              >发布到公网</el-radio
            >
          </el-form-item>
          <el-form-item label="API的服务类型" prop="type">
            <el-select
              style="width: 100%"
              v-model="apiTypeForm.type"
              placeholder="请选择"
            >
              <el-option
                v-for="item in options"
                :key="item.type"
                :label="item.label"
                :value="item.type"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div class="form-btn">
          <el-button @click="previous()">上一步</el-button>
          <el-button type="primary" @click="confirmSubmit('apiTypeForm')"
            >确认创建</el-button
          >
        </div>
      </div>
      <!-- 第三步 创建成功 -->
      <div v-show="active === 2">
        <div class="form-success">
          <div class="form-success__icon">
            <i class="el-icon-success"></i>
          </div>
          <p class="form-success__title">创建成功</p>
          <p class="form-success__tip">
            快去完善分组基础数据吧，完善后发布即可生效
          </p>
        </div>
        <div class="form-btn">
          <el-button @click="backToFirstStep()">继续创建分组</el-button>
          <el-button
            type="primary"
            @click="
              $router.push({
                name: 'ApiManagerApiGroupDetail',
                params: { id },
              })
            "
            >完善分组基础数据</el-button
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Title from "@/components/Title.vue";
import Steps from "@/components/Steps.vue";
import apiManager from "@/api/intranet/apiManager/index.js";

export default {
  name: "CreateApiGroup",
  components: { Title, Steps },
  data() {
    const validateCode = async (rule, value, callback) => {
      const response = await apiManager
        .checkDomainIsExist([value])
        .catch((error) => {
          const { message } = error.data;
          message && this.$message.error(message);
          callback(new Error(" "));
        });
      const { data } = response;
      data === false
        ? callback()
        : callback(new Error("已有用户使用过此英文名称"));
    };
    return {
      active: 0,
      titleList: ["填写分组基本信息", "选择分组内API的类型", "创建成功"],
      basicInfoForm: {
        code: "",
        cnName: "",
        intr: "",
      },
      basicInfoFormRules: {
        code: [
          { required: true, message: "分组英文名称不能为空" },
          { min: 2, max: 30, message: "请输入2-30个字符" },
          { pattern: /^[A-Za-z_]*$/, message: "请输入英文字母、_、.、-" },
          { validator: validateCode },
        ],
        cnName: [
          { required: true, message: "分组中文名称不能为空" },
          { min: 2, max: 30, message: "请输入2-30个字符" },
        ],
        intr: [
          { required: true, message: "分组描述不能为空" },
          { min: 10, max: 100, message: "请输入10-100个字符" },
        ],
      },
      apiTypeForm: {
        serviceType: 1,
        type: 1,
      },
      apiTypeFormRules: {
        serviceType: [{ required: true, message: "API的发布范围不能为空" }],
        type: [{ required: true, message: "API的服务类型不能为空" }],
      },
      id: null,
      options: [
        {
          type: 1,
          label: "JSF服务",
        },
        {
          type: 2,
          label: "HTTP服务",
        },
        {
          type: 3,
          label: "HTTP流",
        },
      ],
    };
  },
  methods: {
    async saveCloudDomain() {
      const { code, cnName, intr } = this.basicInfoForm;
      const { serviceType, type } = this.apiTypeForm;
      const data = [
        {
          code: code,
          name: cnName,
          description: intr,
          serviceType: serviceType,
          type: type,
          sceneType: 1,
        },
      ];
      return await apiManager.saveCloudDomain(data).catch((error) => {
        const { message } = error.data;
        message && this.$message.error(message);
        throw new Error(error);
      });
    },
    //   点击取消
    handleCancel() {
      this.$router.push({
        name: "ApiManagerApiGroup",
      });
    },
    // 点击上一步
    previous() {
      this.active--;
    },
    //  点击下一步
    nextStep(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.active++;
        } else {
          return false;
        }
      });
    },
    // 确认创建
    confirmSubmit(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const response = await this.saveCloudDomain().catch((error) => {
            const { message } = error.data;
            message && this.$message.error(message);
            throw new Error(error);
          });
          this.id = response.data.id;
          this.active++;
        } else {
          return false;
        }
      });
    },
    backToFirstStep() {
      this.active = 0;
      this.$refs["basicInfoForm"].resetFields();
      this.$refs["apiTypeForm"].resetFields();
    },
  },
};
</script>


<style lang="scss" scoped>
.create-api-group {
  margin: 0 20px;
  padding: 20px;
  background: #fff;
  min-height: calc(100vh - 120px);
  .create-api-group-form {
    width: 450px;
    margin: 60px auto;
    .form-btn {
      display: flex;
      justify-content: center;
    }
    .form-success {
      text-align: center;
      .form-success__icon {
        font-size: 50px;
        color: #26a872;
      }
      .form-success__title {
        font-size: 22px;
      }
      .form-success__tip {
        margin: 16px;
      }
    }
  }
}
</style>