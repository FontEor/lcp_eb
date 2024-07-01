<template>
  <div class="text-style">
    <div class="header_contain">
      <img class="header_img" src="@/assets/sandbox/iconHeader.png" alt="" />
      <span class="header_span">商家下单</span>
    </div>
    <div class="common-info-contain-info-other">
      <p class="common-info-contain-info-other-p">
        请输入沙箱环境调用快递<a
          href="https://cloud.jdl.com/#/open-business-document/api-doc/267/841"
          >下单接口</a
        >后获取的单号用于后续业务联调
      </p>
      <p class="common-info-contain-info-other-p p-text-style">
        注：每组单号仅能输入一次，单号重置后无法再次填入
      </p>
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="150px"
        class="demo-ruleForm"
      >
        <el-form-item label="京东物流运单号" prop="wayBillCode">
          <template #label>
            京东物流运单号
            <el-tooltip
              class="item"
              effect="dark"
              content="调用下单接口后响应参数中wayBillCode值，需要与orderCode对应"
              placement="top"
            >
              <i class="el-icon-warning"></i>
            </el-tooltip>
          </template>
          <el-input
            :disabled="wayBillCodeTemp !== ''"
            v-model.trim="ruleForm.wayBillCode"
            placeholder="请输入京东物流运单号"
          ></el-input>
        </el-form-item>
        <el-form-item label="京东物流订单号" prop="orderCode">
          <template #label>
            京东物流订单号
            <el-tooltip
              class="item"
              effect="dark"
              content="调用下单接口后响应参数中orderCode值，需要与wayBillCode对应"
              placement="top"
            >
              <i class="el-icon-warning"></i>
            </el-tooltip>
          </template>
          <el-input
            :disabled="orderCodeTemp !== ''"
            v-model.trim="ruleForm.orderCode"
            placeholder="请输入京东物流订单号"
          ></el-input>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import sandboxStore from "@/store/national/extranet/modules/sandbox";
export default {
  name: "merchantOrder",
  components: {},
  data() {
    return {
      ruleForm: {
        wayBillCode: "",
        orderCode: "",
      },
      rules: {
        wayBillCode: [
          { required: true, message: "请输入京东物流运单号", trigger: "blur" },
        ],
        orderCode: [
          { required: true, message: "请输入京东物流订单号", trigger: "blur" },
        ],
      },
      wayBillCodeTemp: "",
      orderCodeTemp: "",
    };
  },
  mounted() {
    this.ruleForm.wayBillCode = sandboxStore.state.wayBillCode;
    this.ruleForm.orderCode = sandboxStore.state.orderCode;
    this.wayBillCodeTemp = sandboxStore.state.wayBillCode;
    this.orderCodeTemp = sandboxStore.state.orderCode;
  },
  created() {},
  methods: {
    validateForm() {
      return new Promise((resolve) => {
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            sandboxStore.commit("setWayBillCode", this.ruleForm.wayBillCode);
            sandboxStore.commit("setOrderCode", this.ruleForm.orderCode);
          }
          resolve(valid);
        });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.text-style {
  font-size: 14px;
  font-family: PingFang SC;
  font-weight: normal;
  color: rgba(51, 51, 51, 1);
}
.header_contain {
  display: flex;
  align-items: center;
  // width: 120px;
  height: 16px;
  margin-bottom: 16px;
  .header_img {
    width: 12px;
    height: 14px;
    background: linear-gradient(
      130.13deg,
      rgba(60, 110, 240, 1) 0%,
      rgba(88, 134, 255, 1) 100%
    );
    border-radius: 2px;
    margin-right: 8px;
  }
  .header_span {
    font-size: 16px;
    font-family: PingFang SC;
    font-weight: 600;
    color: rgba(0, 0, 0, 1);
  }
}
.common-info-contain-info-other {
  margin-top: 16px;
  .common-info-contain-info-other-p {
    // height: 32px;
    line-height: 32px;
  }
  .p-text-style {
    color: rgba(255, 9, 9, 1);
  }
}
</style>
