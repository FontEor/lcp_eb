<template>
  <div class="partner">
    <div class="tit-view">
      <h2 class="big-tit">
        <span style="font-weight: 600">合作伙伴资质</span>
        <div class="com-tag" :class="computeStatusClass">
          {{ computeStatusText }}
        </div>
      </h2>
      <p class="tip" v-if="updateTime !== ''">
        认证状态更新于
        {{ updateTime | parseTimefilter("{y}-{m}-{d} {h}:{i}") }}
      </p>
      <p class="tip" v-else>
        资质认证过程中遇到问题，您可以通过<a
          href="https://cloud.jdl.com/admin/#/upgrade/work-order"
          target="_blank"
          >提交工单</a
        >的方式获得帮助
      </p>
    </div>
    <div class="container">
      <div v-if="!isSubmitSuccess">
        <div class="line-box">
          <span class="line3"></span>
        </div>
        <el-form
          class="form"
          label-width="140px"
          :model="partnerForm"
          ref="partnerForm"
          :rules="rules"
        >
          <el-row>
            <el-col :span="24">
              <el-divider content-position="left"
                ><h2 class="title">企业信息</h2></el-divider
              >
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="合作类型" prop="cooperationType">
                <el-radio-group v-model="partnerForm.cooperationType">
                  <el-radio :label="1">供应商</el-radio>
                  <el-radio :label="2">分销商</el-radio>
                  <el-radio :label="3">其他</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-divider content-position="left"
                ><h2 class="title">合作信息</h2></el-divider
              >
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="注册推荐人邮箱" prop="referrerMail">
                <el-input
                  placeholder="请填写与您对接的京东员工邮箱"
                  v-model="partnerForm.referrerMail"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="合作内容" prop="cooperationContent">
                <el-input
                  type="textarea"
                  placeholder="请填写合作内容，长度不超过500"
                  :rows="2"
                  maxlength="500"
                  show-word-limit
                  v-model="partnerForm.cooperationContent"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <div class="buttonWrapper">
            <el-button
              :loading="submitButtonLoading"
              type="primary"
              @click="onClickSubmitButton('partnerForm')"
              >提交
            </el-button>
          </div>
        </el-form>
      </div>
      <SubmitSuccess v-if="isSubmitSuccess"></SubmitSuccess>
    </div>
  </div>
</template>

<script>
import SubmitSuccess from "./submit-success.vue";
import request from "@/utils/request";
import { parseTime } from "@/utils";

export default {
  name: "Partner",
  components: {
    SubmitSuccess,
  },
  data() {
    return {
      menuHeader: {
        statusTable: ["未认证", "审核中", "未通过", "已认证"],
        statusColor: [
          "initBtnColor",
          "updateBtnColor",
          "unknownBtnColor",
          "normalBtnColor",
        ],
      },
      partnerForm: {
        //--认证信息唯一标示
        id: "",
        //--合作性质
        cooperationType: 1,
        //--推荐人邮箱
        referrerMail: "",
        //--合作内容
        cooperationContent: "",
      },
      isSubmitSuccess: false,
      //区别是未认证、审核中等状态的
      status: 0,
      updateTime: "",
      rules: {
        cooperationType: [{ required: true }],
        referrerMail: [
          {
            pattern:
              /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/,
            message: "推荐人邮箱格式不正确",
          },
          {
            min: 1,
            max: 50,
            message: "长度超过限制，长度在 1到 50 个字符",
            trigger: "blur",
          },
        ],
        cooperationContent: [
          { required: true, message: "合作内容不能为空", trigger: "blur" },
          {
            min: 1,
            max: 500,
            message: "长度超过限制，长度在 1到 500 个字符",
            trigger: "blur",
          },
        ],
      },
      submitButtonLoading: false,
      submitButtonDebounceTimer: null,
    };
  },
  computed: {
    computeStatusText() {
      return this.menuHeader.statusTable[this.status];
    },
    computeStatusClass() {
      return this.menuHeader.statusColor[this.status];
    },
  },
  methods: {
    //--查询合作伙伴认证信息
    getPartnerAuthData() {
      const url = "/supplierIsv/queryPartner";
      const method = "get";
      request({ url, method })
        .then((response) => {
          //如果状态是审核中(1),已认证(3),则跳转到资质管理页面
          if (response.data.status === 1 || response.data.status === 3) {
            if (!this.isSubmitSuccess) {
              this.$router.push({ path: "/" });
              return;
            }
          }
          const data = response.data;
          //表单一项项赋值，避免partnerForm.cascaderData值被赋值为空
          if (data.status !== 0) {
            this.partnerForm.id = data.id;
            this.partnerForm.cooperationType = data.cooperationType;
            this.partnerForm.name = data.name;
            this.partnerForm.cooperationContent = data.cooperationContent;
            this.partnerForm.referrerMail = data.referrerMail;
            this.updateTime = data.updateTime;
            this.status = data.status;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    //--提交调用
    onClickSubmitButton(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          clearTimeout(this.submitButtonDebounceTimer);
          this.submitButtonDebounceTimer = setTimeout(() => {
            if (this.partnerForm.id !== null && this.partnerForm.id !== "") {
              //未通过状态更新提交
              this.onUpdatePartnerData();
            } else {
              this.onSavePartnerData();
            }
          }, 300);
        } else {
          return false;
        }
      });
    },
    //--保存合作伙伴认证信息
    onSavePartnerData() {
      this.submitButtonLoading = true;
      const url = "/supplierIsv/savePartner";
      const method = "post";
      const headers = { "Content-Type": "application/json" };
      //--构建提交体信息,提交表单数据
      this.addressForm = {};
      //组合表单请求参数
      this.submitForm = Object.assign(this.partnerForm, this.addressForm);
      const data = this.submitForm;
      request({ url, method, headers, data })
        .then((response) => {
          this.isSubmitSuccess = true;
          this.status = 1;
          this.updateTime = new Date();
          this.submitButtonLoading = false;
        })
        .catch((error) => {
          console.log("保存认证信息失败", error);
          this.submitButtonLoading = false;
        });
    },

    //--更新合作伙伴认证信息
    onUpdatePartnerData() {
      this.submitButtonLoading = true;
      const url = "/supplierIsv/updatePartner";
      const method = "post";
      const headers = { "Content-Type": "application/json" };
      //--构建提交体信息,提交表单数据
      this.addressForm = {};
      //组合表单请求参数
      this.submitForm = Object.assign(this.partnerForm, this.addressForm);
      const data = this.submitForm;
      request({ url, method, headers, data })
        .then((response) => {
          this.isSubmitSuccess = true;
          this.status = 1;
          this.updateTime = new Date();
          this.submitButtonLoading = false;
        })
        .catch((error) => {
          console.log("保存认证信息失败", error);
          this.submitButtonLoading = false;
        });
    },
    //判断是否是主账号，否则跳出
    isMainAccount() {
      const url = "/user/getUserRole";
      const method = "get";
      request({ url, method })
        .then((response) => {
          if (response.data !== 1) {
            this.$router.push({ path: "/qualificationManagement" });
            return;
          }
          this.getPartnerAuthData();
          console.log("主子", response);
        })
        .catch((error) => {
          console.log("获得主子账号失败", error);
        });
    },
  },
  created() {
    //判断是否是主子账号
    this.isMainAccount();
  },
  filters: {
    parseTimefilter(obj, fomart) {
      if (obj) {
        return parseTime(obj, fomart);
      } else {
        return "";
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.partner {
  .tit-view {
    background: #fff;
    padding: 10px 20px 10px 32px;
    margin: 0 20px 20px;
    position: relative;
    &:before {
      content: "";
      position: absolute;
      top: 50%;
      left: 20px;
      width: 4px;
      height: 45px;
      background: #3c6ef0;
      transform: translateY(-50%);
    }
  }
  .big-tit {
    line-height: 26px;
    position: relative;
    font-size: 16px;
    .status-text {
      font-weight: 100;
    }
  }
  .tip {
    font-size: 14px;
    line-height: 24px;
    margin-top: 5px;
  }
  .container {
    background: #fff;
    padding: 10px 20px 20px;
    margin: 20px;
    min-height: calc(100vh - 215px);
    .line-box {
      margin-top: 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 50px;
    }
    .text {
      color: rgb(99, 139, 243);
    }
    .line3 {
      height: 1px;
      background-color: #f5f5f5;
      flex-grow: 1;
    }
    .form-top {
      margin-top: 10px;
    }
    .title {
      font-size: 16px;
      color: #3c6ef0;
    }

    .form {
      margin: 0 auto;
      width: 800px;

      .el-input {
        width: 100%;
      }

      .buttonWrapper {
        display: flex;
        justify-content: center;
      }
    }
  }
}
</style>
