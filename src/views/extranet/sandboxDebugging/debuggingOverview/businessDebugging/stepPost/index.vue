<template>
  <section class="step-post">
    <Title text="下单方法" />
    <p class="step-post__tip">
      在本地调用京东快递接单接口（/WaybillJosService/receiveOrderInfo）并将接口返回的运单号填写在下方
    </p>
    <p class="step-post__address">
      <span>寄件地址：</span>
      <span>{{ address }}</span>
      <el-button
        v-clipboard="address"
        v-clipboard:success="onCopySuccess"
        type="text"
        icon="el-icon-document-copy"
        style="margin-left: 8px"
      />
    </p>
    <p class="step-post__warning">
      <i class="el-icon-warning-outline" />
      <span>
        为确保测试环境快递员能够揽收成功，寄件地址请按照平台提供的地址填写
      </span>
    </p>

    <el-form
      :model="stepPostFormData"
      :rules="stepPostFormRules"
      ref="stepPostForm"
      style="margin: 16px auto"
    >
      <el-form-item
        label="京东物流运单号"
        prop="waybillCode"
        label-width="140px"
      >
        <el-input
          v-model.trim="stepPostFormData.waybillCode"
          placeholder="请输入接口返回的运单号，如：JDVXXXX"
          style="width: 100%"
        ></el-input>
      </el-form-item>
    </el-form>
    <el-row type="flex" justify="center">
      <el-button
        type="primary"
        :loading="nextStepLoading"
        :clstag="clstag('', 'sandboxDebugging_1654841119615|1')"
        @click="onClickNextStep"
        >下一步</el-button
      >
    </el-row>
  </section>
</template>

<script>
import Title from "@/components/Title.vue";
import buriedPoint from "@/mixins/buriedPoint.js";
import lcp from "@/api/extranet/lcp/index.js";

export default {
  name: "StepPost",
  components: { Title },
  mixins: [buriedPoint],
  props: {
    stepPostFormData: {
      type: Object,
      validator(value) {
        return (
          Object.keys(value).includes("waybillCode") &&
          typeof value.waybillCode === "string"
        );
      },
    },
    orderInfo: { type: Object, required: true },
    active: { type: Number, required: true },
  },
  data() {
    return {
      address: "北京市石景山区八角街道璟公院10号楼@1#39#石景山站#1",
      stepPostFormRules: {
        waybillCode: [{ required: true, message: "请输入京东物流运单号" }],
      },
      nextStepLoading: false,
      nextStepDebounceTimer: null,
    };
  },
  methods: {
    // 沙箱联调-业务联调-运单号校验
    async checkWaybillCodeExist() {
      const { waybillCode } = this.stepPostFormData;
      const params = { waybillCode };
      return await lcp.sandbox.checkWaybillCodeExist(params).catch((error) => {
        throw new Error(`checkWaybillCodeExist, ${error}`);
      });
    },

    async handleCheckWaybillCodeExist() {
      const {
        data: { address = "", sender = "" },
      } = await this.checkWaybillCodeExist().catch((error) => {
        throw new Error(`handleCheckWaybillCodeExist, ${error}`);
      });
      const { waybillCode } = this.stepPostFormData;
      this.$emit("update:orderInfo", {
        waybillCode,
        address,
        sender,
      });
    },
    onCopySuccess() {
      this.$message.success("字段内容已复制");
    },
    onClickNextStep() {
      clearTimeout(this.nextStepDebounceTimer);
      this.nextStepDebounceTimer = setTimeout(() => {
        this.$refs.stepPostForm
          .validate()
          .then(async () => {
            this.nextStepLoading = true;
            await this.handleCheckWaybillCodeExist().catch((error) => {
              this.nextStepLoading = false;
              throw new Error(`onClickNextStep, ${error}`);
            });
            this.$emit("update:active", this.active + 1);
            this.nextStepLoading = false;
          })
          .catch(() => {});
      }, 300);
    },
  },
};
</script>

<style lang="scss" scoped>
.step-post {
  margin: 0 auto;
  width: 800px;

  .title {
     margin: 26px 0 16px 0;
  }

  .step-post__tip,
  .step-post__address {
    color: #666;
  }

  .step-post__warning {
    color: #ff6e4c;
  }
}
</style>