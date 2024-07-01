<template>
  <div class="step-fill-in-basic-info">
    <p class="step-fill-in-basic-info__title">填写基本信息</p>
    <div class="step-fill-in-basic-info__tip">
      <p>此处填写的信息将直接展示给用户，供用户了解消息内容，请认真填写</p>
      <p>在消息添加前需确保该消息已在【开发管理-消息管理】中注册</p>
    </div>
    <el-form
      :model="formData"
      :rules="formRules"
      label-width="100px"
      ref="form"
      class="step-fill-in-basic-info__form"
    >
      <el-form-item
        v-for="{ label, prop, placeholder } in formItemList"
        :key="prop"
        :label="label"
        :prop="prop"
      >
        <template v-if="prop === 'name'">
          <el-select
            v-model="formData[prop]"
            :placeholder="placeholder"
            :loading="nameOptionLoading"
            :clearable="true"
            :filterable="true"
            :remote="true"
            :remote-method="remoteMethodSearchNameOptionList"
            style="width: 100%"
            @change="onChangeNameSelect"
          >
            <el-option
              v-for="{ name } in nameOptionList"
              :key="name"
              :label="name"
              :value="name"
            />
          </el-select>
        </template>
        <template v-else-if="prop === 'chineseName'">
          <el-input
            v-model.trim="formData[prop]"
            :placeholder="placeholder"
            :clearable="true"
            style="width: 100%"
          />
        </template>
      </el-form-item>
    </el-form>
    <div class="step-fill-in-basic-info__button-wrapper">
      <el-button
        :loading="confirmAdditionLoading"
        type="primary"
        @click="onClickConfirmAdditionButton"
        >确认添加</el-button
      >
    </div>
  </div>
</template>

<script>
import bizmsg from "@/api/intranet/lcp/bizmsg.js";

export default {
  name: "StepFillInBasicInfo",
  prop: {
    active: { type: Number, required: true },
    currentTableRowData: { type: Object, required: true },
  },
  data() {
    return {
      unitId: parseInt(this.$route.params.id),
      formData: { name: "", chineseName: "" },
      formRules: {
        name: [
          { required: true, message: "请输入消息TOPIC", trigger: "change" },
        ],
        chineseName: [
          { required: true, message: "请输入中文名称" },
          { max: 30, message: "长度至多为 30 个字符" },
          {
            pattern: /^[\u4e00-\u9fa5A-z0-9\-_]*$/,
            message: "仅支持输入中文、英文、数字、“-”和下划线",
          },
        ],
      },
      formItemList: [
        {
          label: "消息TOPIC",
          prop: "name",
          placeholder: "请输入消息管理中注册的消息TOPIC",
        },
        {
          label: "中文名称",
          prop: "chineseName",
          placeholder: "请输入中文名称",
        },
      ],
      nameOptionLoading: false,
      nameOptionList: [],
      confirmAdditionLoading: false,
      confirmAdditionDebounceTimer: null,
    };
  },
  methods: {
    // 根据消息TOPIC关键词查询消息列表数据
    async findMessageByGateWay(msgTopic) {
      const params = { msgTopic };
      return await bizmsg.findMessageByGateWay(params).catch((error) => {
        throw new Error(`findMessageByGateWay, ${error}`);
      });
    },
    // 根据对接方案ID添加消息保存消息TOPIC与中文名称
    async insertMessagePre() {
      const { unitId } = this;
      const { name, chineseName } = this.formData;
      const data = { unitId, name, chineseName };
      return await bizmsg.insertMessagePre(data).catch((error) => {
        throw new Error(`insertMessagePre, ${error}`);
      });
    },

    // 根据消息TOPIC关键词查询消息列表数据
    async handleFindMessageByGateWay(query) {
      this.nameOptionLoading = true;
      const { data } = await this.findMessageByGateWay(query).catch((error) => {
        throw new Error(`handleFindMessageByGateWay, ${error}`);
      });
      this.nameOptionList = Array.isArray(data) ? data : [];
      this.nameOptionLoading = false;
    },
    // 根据对接方案ID添加消息保存消息TOPIC与中文名称
    async handleInsertMessagePre() {
      const { data } = await this.insertMessagePre().catch((error) => {
        throw new Error(`handleInsertMessagePre, ${error}`);
      });
      const id = data || 0;
      this.$emit("update:currentTableRowData", { id });
    },

    async remoteMethodSearchNameOptionList(query) {
      if (query) {
        await this.handleFindMessageByGateWay(query).catch((error) => {
          throw new Error(`remoteMethodSearchNameOptionList, ${error}`);
        });
      } else {
        this.nameOptionList = [];
      }
    },

    onChangeNameSelect(value) {
      if (value) {
        const { chineseName } = this.nameOptionList.find(
          ({ name }) => name === value
        );
        this.formData.chineseName = chineseName || "";
      }
    },
    onClickConfirmAdditionButton() {
      clearTimeout(this.confirmAdditionDebounceTimer);
      this.confirmAdditionDebounceTimer = setTimeout(async () => {
        await this.$refs["form"].validate().catch((valid) => {
          throw new Error(
            `onClickConfirmAdditionButton, form validate ${valid}!`
          );
        });
        this.confirmAdditionLoading = true;
        await this.handleInsertMessagePre().catch((error) => {
          this.confirmAdditionLoading = false;
          throw new Error(`onClickConfirmAdditionButton, ${error}`);
        });
        this.$emit("update:active", 1);
        this.confirmAdditionLoading = false;
        this.$emit("updateDetailHeaderInfo");
      }, 300);
    },
  },
};
</script>

<style lang="scss" scoped>
.step-fill-in-basic-info {
  .step-fill-in-basic-info__title {
    margin-bottom: 16px;
    font-size: 24px;
    text-align: center;
  }

  .step-fill-in-basic-info__tip {
    margin-bottom: 16px;
    text-align: center;
  }

  .step-fill-in-basic-info__form {
    margin: 0 auto;
    width: 560px;
  }

  .step-fill-in-basic-info__button-wrapper {
    display: flex;
    justify-content: center;
  }
}
</style>