<template>
  <section class="step-collection">
    <Title text="订单信息" />
    <el-form class="order-info-form" label-width="80px" :model="orderInfo">
      <el-row>
        <el-col
          v-for="{ label, prop, span } in orderInfoList"
          :key="prop"
          :span="span"
        >
          <el-form-item :label="`${label}:`">
            <span>{{ orderInfo[prop] }}</span>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <Title text="揽收信息" />
    <el-form
      :model="stepCollectionFormData"
      :rules="stepCollectionFormRules"
      label-width="80px"
      ref="stepCollectionForm"
    >
      <el-row>
        <el-col
          v-for="{ label, prop, placeholder } in stepCollectionFormList"
          :key="prop"
          :span="12"
        >
          <el-form-item :label="label" :prop="prop">
            <el-input
              v-if="['length', 'width', 'height'].includes(prop)"
              v-model.trim="stepCollectionFormData[prop]"
              :placeholder="placeholder"
              style="width: 90%"
            >
              <template #append>cm</template>
            </el-input>
            <el-input
              v-else-if="['amount', 'itemType'].includes(prop)"
              v-model.trim="stepCollectionFormData[prop]"
              :placeholder="placeholder"
              style="width: 90%"
            ></el-input>
            <el-input
              v-else-if="['weight'].includes(prop)"
              v-model.trim="stepCollectionFormData[prop]"
              :placeholder="placeholder"
              style="width: 90%"
            >
              <template #append>kg</template>
            </el-input>
            <el-select
              v-else-if="['payment'].includes(prop)"
              v-model="stepCollectionFormData[prop]"
              :disabled="true"
              style="width: 90%"
            >
              <el-option
                v-for="{ label, value } in paymentOptionList"
                :key="value"
                :label="label"
                :value="value"
              />
            </el-select>
            <el-select
              v-else-if="['promiseTimeType'].includes(prop)"
              v-model="stepCollectionFormData[prop]"
              style="width: 90%"
            >
              <el-option
                v-for="{ label, value } in promiseTimeTypeOptionList"
                :key="value"
                :label="label"
                :value="value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-row type="flex" justify="center">
      <el-button @click="onClickPreviousStep">上一步</el-button>
      <el-button
        type="primary"
        :loading="collectionLoading"
        :clstag="clstag('', 'sandboxDebugging_1654841119615|2')"
        @click="onClickCollection"
        >揽 收</el-button
      >
    </el-row>
  </section>
</template>

<script>
import Title from "@/components/Title.vue";
import buriedPoint from "@/mixins/buriedPoint.js";
import lcp from "@/api/extranet/lcp/index.js";

export default {
  name: "StepCollection",
  components: { Title },
  mixins: [buriedPoint],
  props: {
    orderInfo: { type: Object, required: true },
    active: { type: Number, required: true },
  },
  data() {
    return {
      orderInfoList: [
        { label: "运单号", prop: "waybillCode", span: 12 },
        { label: "寄件人", prop: "sender", span: 12 },
        { label: "寄件地址", prop: "address", span: 24 },
      ],
      stepCollectionFormData: {
        length: null,
        width: null,
        height: null,
        amount: null,
        weight: null,
        itemType: "",
        payment: 4,
        promiseTimeType: 1,
      },
      stepCollectionFormRules: {
        length: [
          { required: true, message: "请输入包裹长" },
          {
            pattern: /^([1-9](\.\d+)?|[1-9]\d(\.\d+)?|1\d{2}(\.\d+)?|200)$/,
            message: "请输入1-200的整数或小数",
          },
        ],
        amount: [
          { required: true, message: "请输入包裹数量" },
          {
            pattern: /^([1-9]?|[1-9]\d|[1-9]\d{2})$/,
            message: "请输入1-999的整数",
          },
        ],
        width: [
          { required: true, message: "请输入包裹宽" },
          {
            pattern: /^([1-9](\.\d+)?|[1-9]\d(\.\d+)?|100)$/,
            message: "请输入1-100的整数或小数",
          },
        ],
        weight: [
          { required: true, message: "请输入重量" },
          {
            pattern: /^([1-9]?|[1-9]\d|[1-9]\d{2}|[1-4]\d{3})$/,
            message: "请输入1-4999的整数",
          },
        ],
        height: [
          { required: true, message: "请输入包裹高" },
          {
            pattern: /^([1-9](\.\d+)?|[1-9]\d(\.\d+)?|100)$/,
            message: "请输入1-100的整数或小数",
          },
        ],
        itemType: [
          { required: true, message: "请输入物品类型" },
          { max: 20, message: "最多支持输入20个字符" },
        ],
      },
      stepCollectionFormList: [
        { label: "包裹长", prop: "length", placeholder: "请输入包裹长" },
        { label: "包裹数量", prop: "amount", placeholder: "请输入包裹数量" },
        { label: "包裹宽", prop: "width", placeholder: "请输入包裹宽" },
        { label: "重量", prop: "weight", placeholder: "请输入包裹数量" },
        { label: "包裹高", prop: "height", placeholder: "请输入包裹高" },
        {
          label: "物品类型",
          prop: "itemType",
          placeholder: "请输入物品类型，如：文件",
        },
        { label: "支付方式", prop: "payment" },
        { label: "时效类型", prop: "promiseTimeType" },
      ],
      paymentOptionList: [{ label: "寄付月结", value: 4 }],
      promiseTimeTypeOptionList: [
        { label: "特惠送", value: 1 },
        { label: "特快送", value: 2 },
      ],
      previousStepDebounceTimer: null,
      collectionLoading: false,
      collectionDebounceTimer: null,
    };
  },
  methods: {
    // 沙箱联调-业务联调-揽件
    async orderCollection() {
      const { waybillCode = "" } = this.orderInfo;
      let { length, width, height, amount, weight } =
        this.stepCollectionFormData;
      const { payment, itemType, promiseTimeType } =
        this.stepCollectionFormData;
      length = parseFloat(length);
      width = parseFloat(width);
      height = parseFloat(height);
      amount = parseInt(amount);
      weight = parseInt(weight);
      const data = {
        waybillCode,
        length,
        width,
        height,
        payment,
        amount,
        weight,
        itemType,
        promiseTimeType,
      };
      return await lcp.sandbox.orderCollection(data).catch((error) => {
        throw new Error(`orderCollection, ${error}`);
      });
    },

    async handleOrderCollection() {
      await this.orderCollection().catch((error) => {
        throw new Error(`handleOrderCollection, ${error}`);
      });
    },
    onClickPreviousStep() {
      clearTimeout(this.previousStepDebounceTimer);
      this.previousStepDebounceTimer = setTimeout(() => {
        this.$emit("update:active", this.active - 1);
      }, 300);
    },
    onClickCollection() {
      clearTimeout(this.collectionDebounceTimer);
      this.collectionDebounceTimer = setTimeout(() => {
        this.$refs.stepCollectionForm
          .validate()
          .then(async () => {
            this.collectionLoading = true;
            await this.handleOrderCollection().catch((error) => {
              this.collectionLoading = false;
              throw new Error(`onClickCollection, ${error}`);
            });
            setTimeout(() => {
              this.$emit("update:active", this.active + 1);
              this.collectionLoading = false;
            }, 2000);
          })
          .catch(() => {});
      }, 300);
    },
  },
};
</script>

<style lang="scss" scoped>
.step-collection {
  margin: 0 auto;
  width: 800px;

  .title {
    margin: 26px 0 16px 0;
  }

  .order-info-form {
    .el-form-item {
      margin-bottom: 0px;
    }
  }
}
</style>