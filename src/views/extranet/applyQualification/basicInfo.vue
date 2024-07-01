<template>
  <div class="app-container">
    <div class="content">
      <p class="desc">为了尽快通过资质审核，请如实填写以下信息</p>
      <el-form
        ref="basicInfo"
        :model="basicInfoData"
        :rules="basicInfoRules"
        label-width="140px"
      >
        <el-form-item
          v-for="(item, index) in basicInfoList"
          :key="index"
          :label="item.label"
          :prop="item.prop"
        >
          <el-input
            v-if="item.prop === 'companyCode'"
            v-model.trim="basicInfoData[item.prop]"
            :placeholder="item.placeholder"
          ></el-input>
          <el-cascader
            v-else-if="item.prop === 'cascaderOptions'"
            v-model="basicInfoData.cascaderOptions"
            :options="basicInfoData.cascaderData"
            :props="{
              value: 'areaCode',
              label: 'areaName',
              children: 'cities',
            }"
            ref="cascader"
            placeholder="请选择地区"
            style="width: 100%"
            @change="onAreaChange"
            @expand-change="onAreaItemChange"
          ></el-cascader>
          <el-select
            v-else-if="item.prop === 'scale'"
            v-model="basicInfoData[item.prop]"
            :placeholder="item.placeholder"
            style="width: 100%"
          >
            <el-option
              v-for="{ value, label } in scaleOptionList"
              :key="value"
              :value="value"
              :label="label"
            ></el-option>
          </el-select>
          <el-select
            v-else-if="item.prop === 'businessScope'"
            v-model="basicInfoData[item.prop]"
            :placeholder="item.placeholder"
            :multiple="true"
            style="width: 100%"
          >
            <el-option
              v-for="item in businessScopeOptionList"
              :key="item"
              :value="item"
              :label="item"
            ></el-option>
          </el-select>
          <el-input
            v-else
            v-model.trim="basicInfoData[item.prop]"
            :placeholder="item.placeholder"
          ></el-input>
        </el-form-item>
        <el-form-item label="手机验证码" prop="verificationCode">
          <div class="auth-code-wrapper">
            <el-input
              v-model.trim="basicInfoData.verificationCode"
              placeholder="请填写手机验证码"
            ></el-input>
            <el-button
              :loading="verificationCodeLoading"
              type="primary"
              style="margin-left: 16px"
              @click="handleGetVerificationCode"
              >{{ computeVerificationCodeText }}</el-button
            >
          </div>
        </el-form-item>
      </el-form>
      <div class="footer">
        <el-button
          :loading="submitButtonLoading"
          type="primary"
          @click="onClickSubmitButton"
          >提交</el-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import qualification from "@/api/extranet/applyQualification/index";
import request from "@/utils/request";

export default {
  name: "BasicInfo",
  data() {
    const validateCompanyCode = async (rule, value, callback) => {
      const companyCode = value;
      const params = { companyCode };
      await qualification
        .companyCodeExistedFlag(params)
        .then(() => {
          callback();
        })
        .catch((error) => {
          const { message, code } = error.data;
          if (code === 10001) {
            callback(new Error("统一社会信用代码或营业执照号已经被占用"));
          } else {
            message && this.$message.error(message);
            callback(new Error(" "));
          }
        });
    };
    const validateContactsName = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("联系人姓名不能为空"));
      } else {
        const reg = RegExp(/^[\u4e00-\u9fa5a-zA-Z]*$/);
        if (reg.test(value)) {
          callback();
        } else {
          callback(new Error("请输入正确的姓名"));
        }
      }
    };
    const validateContactsEmail = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("联系人邮箱不能为空"));
      } else {
        const reg =
          /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
        if (reg.test(value)) {
          callback();
        } else {
          callback(new Error("请输入正确的邮箱账号"));
        }
      }
    };
    const validateContactsPhone = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("联系人手机号码不能为空"));
      } else {
        const reg = RegExp(/^1[3456789]\d{9}$/);
        if (reg.test(value)) {
          callback();
        } else {
          callback(new Error("请输入正确的手机号"));
        }
      }
    };
    const validateVerificationCode = (rule, value, callback) => {
      const reg = RegExp(/^(\d{6})$/);
      if (value === null || value === "") {
        callback(new Error("短信验证码不能为空"));
      } else if (reg.test(value)) {
        callback();
      } else {
        callback(new Error("请输入正确的短信验证码"));
      }
    };
    return {
      verificationCodeLoading: false,
      verificationCodeTime: 0,
      basicInfoData: {
        companyName: "",
        companyCode: "",
        contactsName: "",
        contactsEmail: "",
        contactsPhone: "",
        verificationCode: "",

        //--地区选项
        cascaderOptions: [],
        //--地区数据
        cascaderData: [],
        //--级联Label
        cascaderLabel: [],
        scale: null,
        businessScope: [],
      },
      basicInfoList: [
        {
          label: "企业名称",
          prop: "companyName",
          placeholder: "请填写营业执照上的公司名称",
        },
        {
          label: "统一社会信用代码或营业执照号",
          prop: "companyCode",
          placeholder: "请填写统一社会信用代码或营业执照号",
        },
        {
          label: "企业所在地区",
          prop: "cascaderOptions",
          placeholder: "请选择企业所在地区",
        },
        {
          label: "企业规模",
          prop: "scale",
          placeholder: "请选择企业规模",
        },
        {
          label: "主营业务",
          prop: "businessScope",
          placeholder: "请选择主营业务",
        },
        {
          label: "联系人姓名",
          prop: "contactsName",
          placeholder: "请填写贵公司的联系人姓名",
        },
        {
          label: "联系人邮箱",
          prop: "contactsEmail",
          placeholder: "用于接收平台的重要消息",
        },
        {
          label: "联系人电话",
          prop: "contactsPhone",
          placeholder: "用于接收平台的重要通知",
        },
      ],
      basicInfoRules: {
        companyName: [{ required: true, message: "企业名称不能为空" }],
        companyCode: [
          { required: true, message: "统一社会信用代码或营业执照号不能为空" },
          {
            pattern:
              /^([0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10}|[1-9]\d{14})$/,
            message: "请输入正确的统一社会信用代码或营业执照号",
          },
          { validator: validateCompanyCode, trigger: "blur" },
        ],

        cascaderOptions: [{ required: true, message: "企业所在地区不能为空" }],
        scale: [{ required: true, message: "企业规模不能为空" }],
        businessScope: [{ required: true, message: "主营业务不能为空" }],
        contactsName: [
          { required: true, message: "联系人姓名不能为空" },
          { validator: validateContactsName },
        ],
        contactsEmail: [
          { required: true, message: "联系人邮箱不能为空" },
          { validator: validateContactsEmail },
        ],
        contactsPhone: [
          { required: true, message: "联系人电话不能为空" },
          { validator: validateContactsPhone },
        ],
        verificationCode: [
          { required: true, message: "手机验证码不能为空" },
          { validator: validateVerificationCode },
        ],
      },
      // 企业规模选项列表
      scaleOptionList: [
        { value: 1, label: "0-50人" },
        { value: 2, label: "51-100人" },
        { value: 3, label: "101-500人" },
        { value: 4, label: "500人以上" },
      ],
      // 主营业务选项列表
      businessScopeOptionList: [
        "软件和信息技术服务业",
        "电商零售",
        "服饰",
        "食品",
        "酒水",
        "3C数码",
        "母婴",
        "家电",
        "家居",
        "生鲜",
        "汽车配件",
        "物流",
        "办公用品",
        "图书",
        "运动户外",
        "医药保健",
        "美妆个护",
        "餐饮",
        "玩具乐器",
        "建材",
        "制造业",
        "日用品",
        "服务业",
        "其他",
      ],
      submitButtonLoading: false,
      submitButtonDebounceTimer: null,
    };
  },
  computed: {
    computeVerificationCodeText() {
      return this.verificationCodeLoading
        ? `重新发送（${this.verificationCodeTime}s）`
        : "获取验证码";
    },
  },
  methods: {
    // 获取验证码接口调用
    async getAuthCode() {
      const phone = this.basicInfoData.contactsPhone;
      const params = { phone };
      return await qualification.getAuthCode(params).catch((error) => {
        const { message } = error.data;
        message && this.$message.error(message);
        throw new Error(error);
      });
    },

    //--地区变更操作
    onAreaChange() {
      if (
        this.$refs["cascader"][0].getCheckedNodes()[0] &&
        this.$refs["cascader"][0].getCheckedNodes()[0].pathLabels
      ) {
        this.basicInfoData.cascaderLabel =
          this.$refs["cascader"][0].getCheckedNodes()[0].pathLabels;
      }
    },
    //--触发地区信息级连联动作
    onAreaItemChange(val) {
      this.getAreaList(val);
    },
    //--获取地区列表
    getAreaList(val) {
      let queryLevel;
      let areaCode;
      if (!val) {
        queryLevel = 1;
        areaCode = "";
      } else if (val.length === 1) {
        queryLevel = 2;
        areaCode = val[0];
      } else if (val.length === 2) {
        queryLevel = 3;
        areaCode = val[1];
      }
      let url = "/supplierIsv/getAreaList";
      request({
        url: url,
        method: "get",
        params: {
          queryLevel: queryLevel,
          areaCode: areaCode,
        },
      })
        .then((rsp) => {
          if (rsp.code === 20000) {
            let items = rsp.data;
            if (queryLevel === 1) {
              this.basicInfoData.cascaderData = items.map((value, i) => {
                return {
                  areaCode: value.areaCode,
                  areaName: value.areaName,
                  cities: [],
                };
              });
            } else if (queryLevel === 2) {
              this.basicInfoData.cascaderData.map((value, i) => {
                if (value.areaCode === val[0]) {
                  if (!value.cities.length) {
                    value.cities = items.map((value, i) => {
                      return {
                        areaCode: value.areaCode,
                        areaName: value.areaName,
                        // cities: [],
                      };
                    });
                  }
                }
              });
            }
            // else if (queryLevel === 3) {
            //   this.basicInfoData.cascaderData.map((value, i) => {
            //     if (value.areaCode === val[0]) {
            //       value.cities.map((value, i) => {
            //         if (value.areaCode === val[1]) {
            //           if (!value.cities.length) {
            //             value.cities = items.map((value, i) => {
            //               return {
            //                 areaCode: value.areaCode,
            //                 areaName: value.areaName,
            //               };
            //             });
            //           }
            //         }
            //       });
            //     }
            //   });
            // }
          } else {
            this.$message.error("服务器获取数据失败!");
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },
    showAreaList() {
      let val = this.basicInfoData.cascaderOptions;
      let queryLevel = 1;
      let areaCode = "";
      let url = "/supplierIsv/getAreaList";
      request({
        url: url,
        method: "get",
        params: {
          queryLevel: queryLevel,
          areaCode: areaCode,
        },
      })
        .then((rsp) => {
          if (rsp.code === 20000) {
            let Items = rsp.data;
            if (queryLevel === 1) {
              this.basicInfoData.cascaderData = Items.map((value, i) => {
                return {
                  areaCode: value.areaCode,
                  areaName: value.areaName,
                  cities: [],
                };
              });
            } else if (queryLevel === 2) {
              this.basicInfoData.cascaderData.map((value, i) => {
                if (value.areaCode === val[0]) {
                  if (!value.cities.length) {
                    value.cities = Items.map((value, i) => {
                      return {
                        areaCode: value.areaCode,
                        areaName: value.areaName,
                        // cities: [],
                      };
                    });
                  }
                }
              });
            }
            // else if (queryLevel === 3) {
            //   this.basicInfoData.cascaderData.map((value, i) => {
            //     if (value.areaCode === val[0]) {
            //       value.cities.map((value, i) => {
            //         if (value.areaCode === val[1]) {
            //           if (!value.cities.length) {
            //             value.cities = Items.map((value, i) => {
            //               return {
            //                 areaCode: value.areaCode,
            //                 areaName: value.areaName,
            //               };
            //             });
            //           }
            //         }
            //       });
            //     }
            //   });
            // }
          } else {
            this.$message.error("服务器获取数据失败!");
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },
    // 点击获取验证码按钮
    handleGetVerificationCode() {
      this.$refs["basicInfo"].validateField(
        "contactsPhone",
        async (errorMessage) => {
          if (!errorMessage) {
            this.verificationCodeLoading = true;
            this.verificationCodeTime = 60;
            await this.getAuthCode();
            const step = () => {
              setTimeout(() => {
                if (this.verificationCodeTime > 0) {
                  this.verificationCodeTime -= 1;
                  step();
                } else {
                  this.verificationCodeLoading = false;
                }
              }, 1000);
            };
            step();
          }
        }
      );
    },
    // 提交基本信息
    async onClickSubmitButton() {
      // 新增基本信息
      this.$refs["basicInfo"].validate((valid) => {
        if (valid) {
          clearTimeout(this.submitButtonDebounceTimer);
          this.submitButtonDebounceTimer = setTimeout(async () => {
            this.submitButtonLoading = true;
            await this.addBaseInfo().catch((error) => {
              this.submitButtonLoading = false;
              throw new Error(`onClickSubmitButton, ${error}`);
            });
            this.$router.push({
              path: "/qualificationManagement",
            });
            this.submitButtonLoading = false;
          }, 300);
        } else {
          return false;
        }
      });
    },
    // 新增基本信息接口调用
    async addBaseInfo() {
      const companyName = this.basicInfoData.companyName;
      const companyCode = this.basicInfoData.companyCode;
      const contactsName = this.basicInfoData.contactsName;
      const contactsEmail = this.basicInfoData.contactsEmail;
      const contactsPhone = this.basicInfoData.contactsPhone;
      const verificationCode = this.basicInfoData.verificationCode;

      const provinceCode = this.basicInfoData.cascaderOptions[0];
      const cityCode = this.basicInfoData.cascaderOptions[1];
      const provinceName = this.basicInfoData.cascaderLabel[0];
      const cityName = this.basicInfoData.cascaderLabel[1];
      const scale = this.basicInfoData.scale;
      const businessScope = this.basicInfoData.businessScope.join("/");
      const data = {
        companyName,
        companyCode,
        contactsName,
        contactsEmail,
        contactsPhone,
        verificationCode,
        provinceCode,
        cityCode,
        provinceName,
        cityName,
        scale,
        businessScope,
      };
      return await qualification.addBaseInfo(data).catch((error) => {
        const { message } = error.data;
        message && this.$message.error(message);
        throw new Error(error);
      });
    },
  },
  created() {
    this.showAreaList();
  },
};
</script>

<style lang="scss" scoped>
.app-container {
  display: flex;
  justify-content: center;
  align-items: center;
  .content {
    width: 600px;
    margin: 32px auto;
    .desc {
      text-align: center;
      margin-bottom: 30px;
    }
    .auth-code-wrapper {
      display: flex;
      justify-content: space-between;
    }
    ::v-deep .el-form-item__label[for="companyCode"] {
      line-height: 1;
    }
    .footer {
      text-align: center;
    }
  }
}
</style>
