<template>
  <section class="step-basic-info">
    <el-form
      class="step-basic-info__form"
      :model="basicInfoFormData"
      :rules="basicInfoFormRules"
      ref="basicInfoForm"
      label-width="100px"
    >
      <el-form-item
        v-for="{ label, prop, placeholder } in basicInfoFormItemList"
        :key="prop"
        :label="label"
        :prop="prop"
      >
        <el-input
          v-if="prop === 'subject'"
          v-model.trim="basicInfoFormData.subject"
          :placeholder="placeholder"
          style="width: 100%"
        />
        <template v-else-if="prop === 'transferType'">
          <el-radio-group
            v-model="basicInfoFormData.transferType"
            @change="handleRadioChange"
          >
            <el-radio :label="1">个人</el-radio>
            <el-radio :label="2">团队</el-radio>
          </el-radio-group>
        </template>
        <template v-else-if="prop === 'target'">
          <el-select
            v-if="basicInfoFormData.transferType === 1"
            v-model.trim="basicInfoFormData.target"
            :clearable="true"
            :filterable="true"
            :remote="true"
            :remote-method="remoteMethodSearchErpTargetOptionList"
            :loading="targetLoading"
            value-key="targetCode"
            placeholder="请输入资产接收人ERP账号"
            style="width: 100%"
          >
            <el-option
              v-for="item in erpTargetOptionList"
              :key="item.targetCode"
              :label="item.targetCode"
              :value="item"
            >
              <span style="float: left">{{ item.targetCode }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">
                {{ item.targetName }}
              </span>
            </el-option>
          </el-select>
          <el-select
            v-else-if="basicInfoFormData.transferType === 2"
            v-model.trim="basicInfoFormData.target"
            :clearable="true"
            :filterable="true"
            :remote="true"
            :remote-method="remoteMethodSearchTeamTargetOptionList"
            :loading="targetLoading"
            value-key="targetCode"
            placeholder="输入资产接收团队名称"
            style="width: 100%"
          >
            <el-option
              v-for="item in teamTargetOptionList"
              :key="item.targetCode"
              :label="item.targetCode"
              :value="item"
            >
              <span style="float: left">{{ item.targetCode }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">
                {{ item.targetName }}
              </span>
            </el-option>
          </el-select>
        </template>
      </el-form-item>
    </el-form>
  </section>
</template>

<script>
import lcp from "@/api/intranet/lcp/index.js";

export default {
  name: "StepBasicInfo",
  props: {
    basicInfoFormData: { type: Object, required: true },
    isAdmin: { type: Boolean, required: true },
  },
  data() {
    let validatorTarget = (rule, value, callback) => {
      if (
        (JSON.stringify(value) === "{}" ||
          JSON.stringify(value) === "null" ||
          JSON.stringify(value) === "") &&
        this.basicInfoFormData &&
        this.basicInfoFormData.transferType == 1
      ) {
        callback(new Error("请选择资产接收方账号"));
      } else if (
        (JSON.stringify(value) === "{}" ||
          JSON.stringify(value) === "null" ||
          JSON.stringify(value) === "") &&
        this.basicInfoFormData &&
        this.basicInfoFormData.transferType == 2
      ) {
        callback(new Error("请选择资产接收团队"));
      }
      callback();
    };
    return {
      basicInfoFormItemList: [
        {
          label: "申请主题",
          prop: "subject",
          placeholder: "如：将字节快手工作内容移交给XXX",
        },
        { label: "资产接收方", prop: "transferType" },
        { label: " ", prop: "target" },
      ],
      basicInfoFormRules: {
        subject: [
          { required: true, message: "请输入申请主题" },
          { min: 5, max: 20, message: "请输入5-20个字符" },
        ],
        transferType: [{ required: true, message: "请选择资产接收方" }],
        target: [
          { validator: validatorTarget },
          { required: true, message: "请选择资产接收方账号" },
        ],
      },
      targetLoading: false,
      erpTargetOptionList: [],
      teamTargetOptionList: [],
    };
  },
  watch: {
    "basicInfoFormData.transferType": {
      handler() {
        const { basicInfoFormData } = this;
        const target = null;
        this.$emit("update:basicInfoFormData", {
          ...basicInfoFormData,
          target,
        });
      },
    },
  },
  methods: {
    handleRadioChange(value) {
      this.$refs.basicInfoForm.validate();
    },
    // 根据ERP账号关键词查询内网账户
    async findUser(erp) {
      const params = { erp };
      return await lcp.hrInfo.findUser(params).catch((error) => {
        throw new Error(`findUser, ${error}`);
      });
    },
    // 团队管理员根据模糊查询团队列表数据
    async queryInnerSupplier(supplierName) {
      const params = { supplierName };
      return await lcp.supplier.queryInnerSupplier(params).catch((error) => {
        throw new Error(`queryInnerSupplier, ${error}`);
      });
    },

    async handleFindUser(query) {
      this.targetLoading = true;
      const { data = [] } = await this.findUser(query).catch((error) => {
        throw new Error(`handleFindUser, ${error}`);
      });
      this.erpTargetOptionList =
        data instanceof Array
          ? data.map(({ userName = "", realName = "" }) => {
              const targetCode = userName;
              const targetName = realName;
              return { targetCode, targetName };
            })
          : [];
      this.targetLoading = false;
    },
    async handleQueryInnerSupplier(query) {
      this.targetLoading = true;
      const { data = [] } = await this.queryInnerSupplier(query).catch(
        (error) => {
          throw new Error(`handleQueryInnerSupplier, ${error}`);
        }
      );
      this.teamTargetOptionList =
        data instanceof Array
          ? data.map(({ code = "", name = "" }) => {
              const targetCode = code;
              const targetName = name;
              return { targetCode, targetName };
            })
          : [];
      this.targetLoading = false;
    },

    async remoteMethodSearchErpTargetOptionList(query) {
      if (query !== "") {
        await this.handleFindUser(query).catch((error) => {
          throw new Error(`remoteMethodSearchErpTargetOptionList, ${error}`);
        });
      } else {
        this.erpTargetOptionList = [];
      }
    },
    async remoteMethodSearchTeamTargetOptionList(query) {
      if (query !== "") {
        await this.handleQueryInnerSupplier(query).catch((error) => {
          throw new Error(`remoteMethodSearchTeamTargetOptionList, ${error}`);
        });
      } else {
        this.teamTargetOptionList = [];
      }
    },
    async initTargetOptionList() {
      const {
        target: { targetName = "" },
      } = this.basicInfoFormData;
      if (targetName) {
        const { transferType } = this.basicInfoFormData;
        const hashMap = new Map()
          .set(1, this.remoteMethodSearchErpTargetOptionList)
          .set(2, this.remoteMethodSearchTeamTargetOptionList);
        if (hashMap.get(transferType)) {
          await hashMap
            .get(transferType)(targetName)
            .catch((error) => {
              throw new Error(`initTargetOptionList, ${error}`);
            });
        }
      }
    },
  },
  async created() {
    await this.initTargetOptionList().catch((error) => {
      throw new Error(`created, ${error}`);
    });
  },
};
</script>

<style lang="scss" scoped>
.step-basic-info {
  .step-basic-info__form {
    margin: 0 auto;
    width: 400px;
  }
}
</style>
