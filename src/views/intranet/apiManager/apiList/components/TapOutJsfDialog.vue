<template>
  <el-dialog
    width="530px"
    type="text"
    title="API下线申请"
    custom-class="tap-out-http-dia"
    :visible.sync="diaVisible"
  >
    <div class="dia-content" v-if="curStep === 'step1'">
      <p>
        <i class="el-icon-warning"></i>
        <span class="step1-title step-title">确认要下线此API吗？</span>
      </p>
      <p class="step1-des">
        此JSF接口中的方法有对接方案、HTTP接口使用，如下线将会影响使用方更新JSF方法文档
      </p>
    </div>
    <div class="dia-content step2-content" v-else-if="curStep === 'step2'">
      <p class="step-title">请填写审批人ERP账号</p>
      <p class="">审批通过后，API下线生效</p>
      <div class="step2-form_content">
        <el-form
          :model="applyerForm"
          :rules="applyerErpRule"
          ref="tapOutHttpApplyerErp"
        >
          <el-form-item
            prop="applyerErp"
            class="step2-form-item_wrap"
            label="审批人ERP账号"
          >
            <ErpPrincipal
              :formDataPrincipal.sync="applyerForm.applyerErp"
              placeholder="审批人可在京ME流程中心审批"
            />
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div
      class="dia-content dia-content_success"
      v-else-if="curStep === 'step3'"
    >
      <i class="el-icon-success"></i>
      <p class="step3-title">提交成功</p>
      <p class="step3-des">提醒审批人尽快审批吧，审批通过后API下线生效</p>
    </div>
    <div slot="footer">
      <template v-if="curStep === 'step1'">
        <el-button @click="handleDiaCancel">取消</el-button>
        <el-button type="primary" @click="handleDiaConfirm('step1')"
          >下线</el-button
        >
      </template>
      <template v-if="curStep === 'step2'">
        <el-button @click="handleDiaCancel">取消</el-button>
        <el-button type="primary" @click="handleDiaConfirm('step2')"
          >提交</el-button
        >
      </template>
      <template v-if="curStep === 'step3'">
        <el-button type="primary" @click="handleDiaConfirm('step3')"
          >确定</el-button
        >
      </template>
    </div>
  </el-dialog>
</template>

<script>
import store from "@/store/national/index.js";
import gwApiRequest from "@/utils/gwApiRequest.js";
import gateway from "@/api/intranet/gateway/index.js";
import ErpPrincipal from "@/views/intranet/apiManager/components/ErpPrincipal.vue";
export default {
  props: ["tapOutJsfDiaInfo"],
  computed: {
    diaVisible: {
      set(newVal) {
        this.$emit(
          "update:tapOutJsfDiaInfo",
          Object.assign({}, this.tapOutJsfDiaInfo, { show: newVal })
        );
      },
      get() {
        return this.pShow && !!this.curStep;
      }
    },
    pShow: {
      get() {
        return this.tapOutJsfDiaInfo.show;
      }
    }
  },
  watch: {
    pShow: {
      handler(newVal) {
        console.log("pShow", newVal);
        if (newVal) {
          this.checkJsfApiOfflineHaveHttp();
        } else {
          this.applyerForm.applyerErp = "";
        }
      },
      immediate: true
    }
  },
  data() {
    const applayerErpValidatePass = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入审批人ERP账号"));
        return;
      }
      if (value === store.getters.user_pin) {
        callback(new Error("审批人不能为当前操作人本人"));
        return;
      }
      callback();
    };
    return {
      applyerForm: {
        applyerErp: ""
      },
      curStep: "",
      applyerErpRule: {
        applyerErp: [
          {
            validator: applayerErpValidatePass,
            trigger: ["change", "blure"]
          },
          {
            required: true,
            trigger: ["change", "blure"]
          }
        ]
      }
    };
  },
  methods: {
    handleDiaCancel() {
      this.$emit(
        "update:tapOutJsfDiaInfo",
        Object.assign({}, this.tapOutJsfDiaInfo, { show: false })
      );
    },
    checkJsfApiOfflineHaveHttp() {
      // 是否可下线
      const param = [
        {
          qualifiedName: this.tapOutJsfDiaInfo.rowInfo.qualifiedName
        }
      ];
      gateway.HttpApiService.checkJsfApiOfflineHaveHttp(param)
        .then(response => {
          console.log("response", response);
          const { code, data } = response || {};
          if (+code === 20000) {
            if (data) {
              this.curStep = "step1";
            } else {
              this.curStep = "step2";
            }
          }
        })
        .catch(err => {
          this.$message.error(err);
          this.$emit(
            "update:tapOutJsfDiaInfo",
            Object.assign({}, this.tapOutJsfDiaInfo, { show: false })
          );
        });
    },
    offlineJsfApi() {
      return new Promise(res => {
        const param = [
          {
            qualifiedName: this.tapOutJsfDiaInfo.rowInfo.qualifiedName,
            approver: this.applyerForm.applyerErp
          }
        ];
        let data = false;
        gateway.HttpApiService.offlineJsfApi(JSON.stringify(param))
          .then(response => {
            const { code, message } = response || {};
            data = +code === 20000;
            +code !== 20000 && this.$message.error(message);
            res(data);
          })
          .catch(err => {
            res(data);
          });
      });
    },
    handleDiaConfirm(step) {
      switch (step) {
        case "step1":
          this.curStep = "step2";
          break;
        case "step2":
          this.$refs["tapOutHttpApplyerErp"].validate(async valid => {
            if (valid) {
              const applaySuccess = await this.offlineJsfApi();
              console.log("applaySuccess", applaySuccess);
              if (applaySuccess) {
                this.curStep = "step3";
                this.$emit("queryApi");
              }
            } else {
              return false;
            }
          });
          break;
        case "step3":
          this.handleDiaCancel();
          break;
      }
    }
  },
  components: {
    ErpPrincipal
  },
  name: "TapOutJsfDialog"
};
</script>

<style lang="scss" scoped>
.tap-out-http-dia {
  .dia-content {
    padding: 28px 14px;
  }
  .el-icon-warning {
    font-size: 20px;
    color: #fa7b55;
  }
  .step1-title {
    margin-left: 8px;
  }
  .step1-des {
    margin-left: 28px;
  }
  .step-title {
    color: #333333;
    font-weight: 600;
    margin-bottom: 8px;
  }
  .step2-form_content {
    display: flex;
    align-items: center;
    padding-top: 24px;
  }
  .step2-form-item_wrap {
    display: flex;
    .el-form-item__label {
      font-weight: 600;
    }
  }
  .dia-content_success {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .el-icon-success {
    font-size: 46px;
    color: #26a872;
  }
  .step3-title {
    font-size: 16px;
    color: rgb(0, 0, 0);
    padding: 16px 0 4px 0;
  }
  .step3-des {
    color: rgb(153, 153, 153);
  }
  // .step2-content {
  //   display: flex;
  //   flex-direction: column;
  //   align-items: center;
  // }
}
</style>