<template>
  <div class="user-base-info app-container">
    <div class="menuHeader">
      <h2 class="menuTitle">个人基本信息</h2>
    </div>
    <br />
    <el-form label-width="80px" label-position="left" style="margin-left: 35px">
      <el-form-item label="账号:">
        <span>{{ baseInfo.pin }}</span>
      </el-form-item>
      <el-form-item label="姓名:">
        <span>{{ baseInfo.name }}</span>
      </el-form-item>
      <el-form-item label="手机号:">
        <span>{{ baseInfo.phone }}</span>
        <a
          style="margin-left: 20px; color: #3c6ef0"
          :href="computeUrl"
          target="_blank"
          >更改</a
        >
      </el-form-item>
      <el-form-item label="角色:">
        <span>{{ roleTypeName }}</span>
      </el-form-item>
      <el-form-item label="团队编码:">
        <span>{{ baseInfo.supplierCode }}</span>
      </el-form-item>
    </el-form>

    <div class="menuHeader">
      <h2 class="menuTitle">企业信息</h2>
    </div>
    <br />
    <el-form
      ref="baseInfo"
      :model="baseInfo"
      label-width="120px"
      :rules="rules"
      label-position="left"
      style="margin-left: 35px"
    >
      <el-form-item label="企业名称:" prop="companyName">
        <el-row>
          <el-col :span="5" style="width: 200px">
            <el-input
              v-if="editerStatus"
              v-model.trim="baseInfo.companyName"
            ></el-input>
            <span v-if="!editerStatus">{{ baseInfo.companyName }}</span>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="统一社会信用代码或营业执照号:" prop="companyCode">
        <el-col :span="5" style="width: 200px">
          <span v-if="!editerStatus">{{ baseInfo.companyCode }}</span>
          <el-input
            v-if="editerStatus"
            v-model="baseInfo.companyCode"
          ></el-input>
        </el-col>
      </el-form-item>

      <el-form-item label="企业所在地区:">
        <el-row>
          <el-col :span="5" style="width: 200px">
            <span v-if="!editerStatus">
              {{
                baseInfo.cascaderLabel[0]
                  | formatProvinceNameText
                  | formatCityNameText(baseInfo.cascaderLabel[1])
              }}
            </span>
            <el-cascader
              v-else
              v-model="baseInfo.cascaderOptions"
              :options="baseInfo.cascaderData"
              ref="cascader"
              @expand-change="onAreaItemChange"
              @change="onAreaChange"
              placeholder="请选择地区"
              :props="{
                value: 'areaCode',
                label: 'areaName',
                children: 'cities',
              }"
              style="width: 100%"
            ></el-cascader>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="企业规模:">
        <el-row>
          <el-col :span="5" style="width: 200px">
            <span v-if="!editerStatus">{{
              baseInfo.scale | formatScaleText
            }}</span>
            <el-select
              v-else
              v-model="baseInfo.scale"
              placeholder="请选择企业规模"
              style="width: 100%"
            >
              <el-option
                v-for="{ value, label } in scaleOptionList"
                :key="value"
                :value="value"
                :label="label"
              ></el-option>
            </el-select>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="主营业务:">
        <el-row>
          <el-col :span="5" style="width: 200px">
            <span v-if="!editerStatus">
              {{ baseInfo.businessScope | formatBusinessScopeText }}
            </span>
            <el-select
              v-else
              v-model="baseInfo.businessScope"
              :multiple="true"
              placeholder="请选择主营业务"
              style="width: 100%"
            >
              <el-option
                v-for="item in businessScopeOptionList"
                :key="item"
                :value="item"
                :label="item"
              ></el-option>
            </el-select>
          </el-col>
        </el-row>
      </el-form-item>

      <el-form-item label="联系人姓名:" prop="contactsName">
        <el-row>
          <el-col :span="5" style="width: 200px">
            <span v-if="!editerStatus">{{ baseInfo.contactsName }}</span>
            <el-input
              v-if="editerStatus"
              v-model="baseInfo.contactsName"
            ></el-input>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="联系人邮箱:" prop="contactsEmail">
        <el-row>
          <el-col :span="5" style="width: 200px">
            <span v-if="!editerStatus">{{ baseInfo.contactsEmail }}</span>
            <el-input
              v-if="editerStatus"
              v-model="baseInfo.contactsEmail"
            ></el-input>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="联系人手机号:" prop="contactsPhone">
        <el-row>
          <el-col :span="5" style="width: 200px">
            <span v-if="!editerStatus">{{ baseInfo.contactsPhone }}</span>
            <el-input
              v-if="editerStatus"
              v-model="baseInfo.contactsPhone"
            ></el-input>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item
        v-if="verificationStatus"
        label="手机号验证码:"
        prop="verificationCode"
      >
        <el-row>
          <el-col :span="5" style="width: 200px">
            <el-input
              placeholder="填写手机验证码"
              v-model="baseInfo.verificationCode"
            ></el-input>
          </el-col>
          <el-col :span="2" style="margin-left: 10px">
            <el-button
              type="primary"
              class="sendButton"
              v-bind:disabled="verificationButtonStatus"
              @click="sendVerificationCode()"
              >{{ verificationButtonContent }}</el-button
            >
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>
    <div
      v-if="
        baseInfo.roleType === 1 && baseInfo.supplierCode && source !== 'clps'
      "
      style="margin-left: 33px"
    >
      <el-button
        v-if="!editerStatus"
        type="primary"
        @click="updateEditerStatus()"
        >编辑
      </el-button>
      <el-button v-if="editerStatus" @click="updateEditerStatus()"
        >取消
      </el-button>
      <el-button
        v-if="editerStatus"
        type="primary"
        @click="saveBaseInfo()"
        style="margin-left: 40px"
        >保存
      </el-button>
    </div>
  </div>
</template>

<script>
import request from "@/utils/request";
import qualification from "@/api/extranet/applyQualification/index";
import userManager from "@/api/extranet/userManager/index.js";

export default {
  name: "UserBaseInfo",
  data() {
    var validateCompanyName = (rule, value, callback) => {
      if (value === null || value.trim() === "") {
        callback(new Error("企业名称不能为空"));
      } else {
        callback();
      }
    };
    const validateCompanyCode = async (rule, value, callback) => {
      if (value === null || value.trim() === "") {
        callback(new Error("统一社会信用代码或营业执照号不能为空"));
        return;
      }
      if (this.baseInfo.companyCode === this.desensitizationData.companyCode) {
        callback();
        return;
      }
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
    var validateContactsName = (rule, value, callback) => {
      if (value === null || value.trim() === "") {
        callback(new Error("联系人姓名不能为空"));
      } else if (value !== this.desensitizationData.contactsName) {
        let regex = RegExp(/^[\u4e00-\u9fa5a-zA-Z]*$/);
        if (regex.test(value)) {
          callback();
        } else {
          callback(new Error("请输入正确的姓名"));
        }
      } else {
        callback();
      }
    };
    var validateContactsEmail = (rule, value, callback) => {
      if (value === null || value.trim() === "") {
        callback(new Error("联系人邮箱不能为空"));
      } else if (value !== this.desensitizationData.contactsEmail) {
        let regex =
          /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
        if (regex.test(value)) {
          callback();
        } else {
          callback(new Error("请输入正确的邮箱账号"));
        }
      } else {
        callback();
      }
    };
    var validateContactsPhone = (rule, value, callback) => {
      if (value === null || value.trim() === "") {
        callback(new Error("联系人手机号码不能为空"));
      } else if (value !== this.desensitizationData.contactsPhone) {
        let regex = RegExp(/^1[3456789]\d{9}$/);
        if (regex.test(value)) {
          callback();
        } else {
          callback(new Error("请输入正确的手机号"));
        }
      } else {
        callback();
      }
    };
    var validateVerificationCode = (rule, value, callback) => {
      if (this.verificationStatus) {
        let regex = RegExp(/^(\d{6})$/);
        if (value === null || value.trim() === "") {
          callback(new Error("短信验证码不能为空"));
        } else if (regex.test(value)) {
          callback();
        } else {
          callback(new Error("请输入正确的短信验证码"));
        }
      } else {
        callback();
      }
    };
    return {
      //账号来源是哪里，如果是eclp则不允许编辑
      modifyPhoneUrl: window.env.idaasModifyPhone,
      source: null,
      baseInfo: {
        pin: "",
        name: "",
        phone: "",
        roleType: 1,
        supplierCode: "",
        companyName: "",
        companyCode: "",
        contactsName: "",
        contactsPhone: "",
        contactsEmail: "",
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
      //脱敏数据，用于数据保存时比较是否有变化
      desensitizationData: {
        companyName: "",
        companyCode: "",
        contactsName: "",
        contactsPhone: "",
        contactsEmail: "",

        cascaderOptions: [],
        scale: null,
        businessScope: [],
      },
      editerStatus: false,
      //是否显示输入验证码的输入框
      verificationStatus: false,
      //获取验证码的按钮展示内容
      verificationButtonContent: "获取验证码",
      //获取验证码的按钮是否不可点击
      verificationButtonStatus: false,
      //发送验证码的按钮倒计时
      verificationButtonTime: 60,
      //验证码倒计时是否开始，当为false时代表初始化状态，为true时倒计时可以开始
      verificationIsStart: false,
      rules: {
        companyName: [{ validator: validateCompanyName }],
        companyCode: [
          {
            pattern:
              /^([0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10}|[1-9]\d{14})$/,
            message: "请输入正确的统一社会信用代码或营业执照号",
          },
          { validator: validateCompanyCode },
        ],
        contactsName: [{ validator: validateContactsName }],
        contactsEmail: [{ validator: validateContactsEmail }],
        contactsPhone: [{ validator: validateContactsPhone }],
        verificationCode: [{ validator: validateVerificationCode }],

        cascaderOptions: [
          {
            required: true,
            message: "企业所在地区不能为空",
            trigger: "change",
          },
        ],
      },
    };
  },
  filters: {
    formatProvinceNameText(provinceName) {
      return provinceName || "";
    },
    formatCityNameText(formatProvinceNameText, cityName) {
      return formatProvinceNameText
        ? cityName
          ? `${formatProvinceNameText}/${cityName}`
          : formatProvinceNameText
        : "-";
    },
    formatScaleText(scale) {
      const hashMap = {
        1: "0-50人",
        2: "51-100人",
        3: "101-500人",
        4: "500人以上",
      };
      return hashMap[scale] || "-";
    },
    formatBusinessScopeText(businessScope) {
      return businessScope.join("/") || "-";
    },
  },
  computed: {
    roleTypeName: function () {
      if (this.baseInfo.roleType === 1) {
        return "管理员";
      } else {
        return "普通用户";
      }
    },
    computeUrl() {
      const returnUrl = window.location.href;
      return `${this.modifyPhoneUrl}${encodeURIComponent(
        returnUrl + "?from=modifyPhoneUrl"
      )}`;
    },
  },
  watch: {
    // 如果 `contactsPhone` 发生改变，则需要手机验证码
    "baseInfo.contactsPhone": function () {
      if (
        this.baseInfo.contactsPhone !== this.desensitizationData.contactsPhone
      ) {
        this.verificationStatus = true;
      } else {
        this.verificationStatus = false;
      }
    },
  },
  methods: {
    async syncOutDeveloperFromIdaas() {
      await userManager.syncOutDeveloperFromIdaas();
    },
    // src/views/extranet/applyQualification/partner.vue
    async showAreaList(queryLevel = 1, areaCode = "") {
      let val = this.baseInfo.cascaderOptions;
      let url = "/supplierIsv/getAreaList";
      await request({
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
              this.baseInfo.cascaderData = Items.map((value, i) => {
                return {
                  areaCode: value.areaCode,
                  areaName: value.areaName,
                  cities: [],
                };
              });
            } else if (queryLevel === 2) {
              this.baseInfo.cascaderData.map((value, i) => {
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
            //   this.baseInfo.cascaderData.map((value, i) => {
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
              this.baseInfo.cascaderData = items.map((value, i) => {
                return {
                  areaCode: value.areaCode,
                  areaName: value.areaName,
                  cities: [],
                };
              });
            } else if (queryLevel === 2) {
              this.baseInfo.cascaderData.map((value, i) => {
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
            //   this.baseInfo.cascaderData.map((value, i) => {
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
    //--触发地区信息级连联动作
    onAreaItemChange(val) {
      this.getAreaList(val);
    },
    //--地区变更操作
    onAreaChange() {
      if (
        this.$refs["cascader"].getCheckedNodes()[0] &&
        this.$refs["cascader"].getCheckedNodes()[0].pathLabels
      ) {
        this.baseInfo.cascaderLabel =
          this.$refs["cascader"].getCheckedNodes()[0].pathLabels;
      }
    },
    updateEditerStatus() {
      this.verificationIsStart = false;
      if (this.editerStatus) {
        this.baseInfo.verificationCode = "";
        this.editerStatus = false;
        //下面这个方法可能也会触发监听contactsPhone值变化的方法
        this.$refs["baseInfo"].clearValidate();
        this.initBaseInfo();
      } else {
        this.editerStatus = true;
      }
    },
    async initBaseInfo() {
      let url = "/supplierIsv/getBaseInfo";
      await request({
        url: url,
        method: "post",
      })
        .then(async (rsp) => {
          if (rsp.code === 20000) {
            this.source = rsp.data.source;
            this.baseInfo.pin = rsp.data.pin;
            this.baseInfo.name = rsp.data.name;
            this.baseInfo.phone = rsp.data.phone;
            this.baseInfo.roleType = rsp.data.roleType;
            this.baseInfo.supplierCode = rsp.data.supplierCode;
            this.baseInfo.companyName = rsp.data.companyName;
            this.baseInfo.companyCode = rsp.data.companyCode;
            this.baseInfo.contactsName = rsp.data.contactsName;
            this.baseInfo.contactsPhone = rsp.data.contactsPhone;
            this.baseInfo.contactsEmail = rsp.data.contactsEmail;

            this.baseInfo.cascaderOptions = [
              rsp.data.provinceCode || "",
              rsp.data.cityCode || "",
            ];
            this.baseInfo.cascaderLabel = [
              rsp.data.provinceName,
              rsp.data.cityName,
            ];
            this.baseInfo.scale = rsp.data.scale;
            this.baseInfo.businessScope = rsp.data.businessScope
              ? rsp.data.businessScope.split("/")
              : [];

            this.desensitizationData.companyName = rsp.data.companyName;
            this.desensitizationData.companyCode = rsp.data.companyCode;
            this.desensitizationData.contactsName = rsp.data.contactsName;
            this.desensitizationData.contactsPhone = rsp.data.contactsPhone;
            this.desensitizationData.contactsEmail = rsp.data.contactsEmail;

            this.desensitizationData.cascaderOptions = [
              rsp.data.provinceCode || "",
              rsp.data.cityCode || "",
            ];
            this.desensitizationData.cascaderLabel = [
              rsp.data.provinceName,
              rsp.data.cityName,
            ];
            this.desensitizationData.scale = rsp.data.scale;
            this.desensitizationData.businessScope = rsp.data.businessScope
              ? rsp.data.businessScope.split("/")
              : [];
          } else {
            this.$message({
              message: rsp.message,
              type: "error",
            });
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },
    sendVerificationCode() {
      let regex = RegExp(/^1[3456789]\d{9}$/);
      if (regex.test(this.baseInfo.contactsPhone)) {
        this.updateVerificationButtonStatus();
        let url = "/user/getAuthCode";
        request({
          url: url,
          method: "post",
          params: { phone: this.baseInfo.contactsPhone },
        })
          .then((rsp) => {
            if (rsp.code === 20000) {
            } else {
              this.$message({
                message: rsp.message,
                type: "error",
              });
            }
          })
          .catch((e) => {
            console.log(e);
          });
      } else {
        this.$message({
          message: "请输入正确的手机号",
          type: "error",
        });
      }
    },
    /**
     * 改变获取验证码的状态，60s内不可编辑，倒计时
     */
    updateVerificationButtonStatus() {
      this.verificationIsStart = true;
      this.verificationButtonStatus = true;
      this.verificationButtonContent = this.verificationButtonTime + "s";
      let clock = window.setInterval(() => {
        this.verificationButtonTime--;
        this.verificationButtonContent = this.verificationButtonTime + "s";
        if (
          this.verificationButtonTime < 0 ||
          this.verificationIsStart === false
        ) {
          window.clearInterval(clock);
          this.verificationButtonContent = "获取验证码";
          this.verificationButtonStatus = false;
          this.verificationButtonTime = 60;
        }
      }, 1000);
    },
    saveBaseInfo() {
      this.$refs["baseInfo"].validate((valid) => {
        if (valid) {
          this.submitBaseInfo();
        }
      });
    },
    submitBaseInfo() {
      const form = {};
      if (this.baseInfo.companyName != this.desensitizationData.companyName) {
        form.companyName = this.baseInfo.companyName;
      }
      if (this.baseInfo.companyCode != this.desensitizationData.companyCode) {
        form.companyCode = this.baseInfo.companyCode;
      }
      if (this.baseInfo.contactsName != this.desensitizationData.contactsName) {
        form.contactsName = this.baseInfo.contactsName;
      }
      if (
        this.baseInfo.contactsPhone != this.desensitizationData.contactsPhone
      ) {
        form.contactsPhone = this.baseInfo.contactsPhone;
      }
      if (
        this.baseInfo.contactsEmail != this.desensitizationData.contactsEmail
      ) {
        form.contactsEmail = this.baseInfo.contactsEmail;
      }
      if (
        this.baseInfo.cascaderOptions[0] !==
        this.desensitizationData.cascaderOptions[0]
      ) {
        form.provinceCode = this.baseInfo.cascaderOptions[0];
      }
      if (
        this.baseInfo.cascaderOptions[1] !==
        this.desensitizationData.cascaderOptions[1]
      ) {
        form.cityCode = this.baseInfo.cascaderOptions[1];
      }
      if (
        this.baseInfo.cascaderLabel[0] !==
        this.desensitizationData.cascaderLabel[0]
      ) {
        form.provinceName = this.baseInfo.cascaderLabel[0];
      }
      if (
        this.baseInfo.cascaderLabel[1] !==
        this.desensitizationData.cascaderLabel[1]
      ) {
        form.cityName = this.baseInfo.cascaderLabel[1];
      }
      if (this.baseInfo.scale !== this.desensitizationData.scale) {
        form.scale = this.baseInfo.scale;
      }
      if (
        this.baseInfo.businessScope.join("/") !==
        this.desensitizationData.businessScope.join("/")
      ) {
        form.businessScope = this.baseInfo.businessScope.join("/");
      }
      if (this.verificationStatus) {
        form.verificationCode = this.baseInfo.verificationCode;
      }
      let url = "/supplierIsv/updateBaseInfo";
      request({
        url: url,
        method: "post",
        data: form,
      })
        .then((rsp) => {
          if (rsp.code === 20000) {
            this.updateEditerStatus();
            this.initBaseInfo();
            this.$message({
              message: rsp.message,
              type: "success",
            });
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },
  },
  async created() {
    if (this.$route.query.from === "modifyPhoneUrl") {
      //同步idaas用户手机号
      await this.syncOutDeveloperFromIdaas();
      this.$router.replace({ query: "" });
    }
    await this.initBaseInfo();
    await this.showAreaList();
    this.baseInfo.cascaderOptions.length > 0 &&
      this.baseInfo.cascaderOptions[0] &&
      (await this.showAreaList(2, this.baseInfo.cascaderOptions[0]));
  },
};
</script>

<style lang="scss" scoped>
.user-base-info {
  .menuHeader {
    display: flex;
    align-items: center;

    .menuTitle {
      padding: 0 12px;
      font-size: 16px;
      font-weight: 600;
      position: relative;

      &::before {
        content: "";
        display: block;
        width: 3px;
        height: 100%;
        background: #3c6ef0;
        position: absolute;
        top: 0;
        left: 0;
      }
    }
  }

  .sendButton {
    width: 100px;
  }
}
</style>