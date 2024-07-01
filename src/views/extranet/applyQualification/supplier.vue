<template>
  <div>
    <div class="supplier">
      <div class="tit-view">
        <h2 class="big-tit">
          <span style="font-weight: 600">自研商家资质</span>
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
        <Alert v-if="!isSubmitSuccess">
          <template #title>
            <p>
              1.如无编码，您可前往jdl.com提交<a
                href="https://www.jdl.com/ecology/cooperation"
                target="_blank"
                >物流合作申请</a
              >，提交后会有物流销售联系您签约，签约后获得对应编码；
            </p>
            <p>
              2.此处仅是身份认定，如有多个编码选择任意一个认证通过即可，接口调用时不会对此处填写的编码做校验；
            </p>
            <p>
              3.编码应与签约时的公司名称匹配，如提示报错可在<a
                href="https://cloud.jdl.com/admin/#/userBaseInfo"
                target="_blank"
                >基本信息</a
              >中修改公司名称。
            </p>
          </template>
        </Alert>
        <div v-if="!isSubmitSuccess">
          <el-row class="form-top">
            <el-col :offset="6">
              <el-form
                ref="supplierForm"
                :model="supplierForm"
                :rules="rules"
                :validate-on-rule-change="false"
                :inline="true"
              >
                <el-form-item>
                  <el-select v-model="type" style="width: 120px">
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                      <span style="float: left">{{ item.label }}</span>
                      <span>{{ item.description }}</span>
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item
                  label-width="0px"
                  prop="BusinessNo"
                  :error="errorMessage"
                >
                  <el-input
                    style="width: 400px"
                    v-model.trim="supplierForm.BusinessNo"
                    :placeholder="placeholder"
                  ></el-input>
                </el-form-item>
              </el-form>
            </el-col>
          </el-row>
          <el-row>
            <el-col :offset="6">
              <div style="float: left; margin-left: 230px">
                <span class="dialog-footer" slot="footer">
                  <el-button
                    :loading="submitButtonLoading"
                    type="primary"
                    @click="onClickSubmitButton"
                    >提交</el-button
                  >
                </span>
              </div>
            </el-col>
          </el-row>
        </div>
        <SubmitSuccess v-if="isSubmitSuccess"></SubmitSuccess>
      </div>
    </div>
  </div>
</template>

<script>
import SubmitSuccess from "./submit-success.vue";
import request from "@/utils/request";
import { parseTime } from "@/utils";
import Alert from "@/components/Alert.vue";

export default {
  name: "Supplier",
  components: {
    SubmitSuccess,
    Alert,
  },
  computed: {
    computeStatusText() {
      return this.menuHeader.statusTable[this.status];
    },
    computeStatusClass() {
      return this.menuHeader.statusColor[this.status];
    },
    placeholder() {
      const hashMap = {
        eclp: "商家编码/配送编码/青龙业主号/月结编码 示例: 010KXXXXXX",
        division: "示例：EBU441XXXXXXXXXX",
        cloudWarehouse: "示例：KH2000000XXXX",
        servicePlus: "厂家编码 示例：01058554XXXX",
      };
      return hashMap[this.type];
    },
  },

  data() {
    var validateBusinessNo = (rule, value, callback) => {
      this.errorMessage = "";
      if (value === null || value === "") {
        callback(new Error("请输入"));
      } else {
        callback();
      }
    };
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
      supplierForm: {
        id: "",
        BusinessNo: "",
      },
      rules: {
        BusinessNo: [{ required: true, validator: validateBusinessNo }],
      },
      isSubmitSuccess: false,
      status: 0,
      updateTime: "",
      errorMessage: "",
      options: [
        {
          label: "月结编码",
          description: "(适用于快递、快运、同城速配等)",
          value: "eclp",
        },
        {
          label: "事业部编码",
          description: "(适用于快运、大件、仓配等)",
          value: "division",
        },
        {
          label: "客户编码",
          description: "(适用于云仓)",
          value: "cloudWarehouse",
        },
        {
          label: "服务编码",
          description: "(适用于服务+)",
          value: "servicePlus",
        },
      ],
      type: "eclp",
      submitButtonLoading: false,
      submitButtonDebounceTimer: null,
    };
  },

  methods: {
    getSupplierMessage() {
      let url = "/supplierIsv/getSellerAuth";
      request({
        url: url,
        method: "get",
      })
        .then((rsp) => {
          //如果状态是审核中(1),已认证(3),则跳转到资质管理页面
          if (rsp.data.status === 1 || rsp.data.status === 3) {
            //如果是提交资质申请成功页面就不用跳转
            if (!this.isSubmitSuccess) {
              this.$router.push("/");
              return;
            }
          }
          if (
            rsp.data.eclpBusinessNo !== null &&
            rsp.data.eclpBusinessNo !== undefined
          ) {
            this.supplierForm.id = rsp.data.id;
            this.supplierForm.BusinessNo = rsp.data.eclpBusinessNo;
            this.status = rsp.data.status;
            this.type = rsp.data.sellerType;
            this.updateTime = rsp.data.updateTime;
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },

    onClickSubmitButton() {
      this.$refs["supplierForm"].validate((valid) => {
        if (valid) {
          clearTimeout(this.submitButtonDebounceTimer);
          this.submitButtonDebounceTimer = setTimeout(() => {
            this.submitButtonLoading = true;
            let url = "/supplierIsv/saveSeller";
            request({
              url: url,
              method: "post",
              data: {
                id: this.supplierForm.id,
                eclpBusinessNo: this.supplierForm.BusinessNo,
                // 事业部编码与月结编码值都是eclp，为了避免下拉框中值重复导致的问题，因此向后端传值时再进行赋值
                sellerType: this.type === "division" ? "eclp" : this.type,
              },
            })
              .then((rsp) => {
                console.log("supplier", rsp);
                if (rsp.code === 20000) {
                  // this.isSubmitSuccess = true;
                  this.status = 1;
                  this.updateTime = new Date();
                  this.$router.push({
                    path: "/qualificationManagement",
                  });
                  this.submitButtonLoading = false;
                } else {
                  this.$message.error(rsp.message);
                  this.submitButtonLoading = false;
                  return false;
                }
              })
              .catch((e) => {
                console.log(e);
                this.submitButtonLoading = false;
              });
          }, 300);
        } else {
          console.log("error submit!!");
          return false;
        }
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
          this.getSupplierMessage();
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
  mounted() {},
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
.supplier {
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
    .line1 {
      height: 1px;
      background-color: #d9d9d9;
      flex-grow: 0.08;
      margin-right: 20px;
    }
    .line2 {
      height: 1px;
      background-color: #d9d9d9;
      flex-grow: 1;
      margin-left: 20px;
    }
    .line3 {
      height: 1px;
      background-color: #f5f5f5;
      flex-grow: 1;
    }
    .form-top {
      margin-top: 14%;
      .el-form-item {
        margin-bottom: 42px;
      }
    }
  }
}
</style>
