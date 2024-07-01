<template>
  <div class="customerGroupSave">
    <el-page-header
      @back="goBack"
      :content="computeHeaderContent"
    ></el-page-header>
    <Steps :tiptitle="tipTitleList" :active="activeStep"></Steps>

    <div class="stepForm">
      <!-- 进入最后一步时在标题上显示完成图标 -->
      <i
        v-if="activeStep === tipTitleList.length - 1"
        class="el-icon-success"
      ></i>
      <!-- 根据数据表显示各步骤表单标题与提示文本 -->
      <div class="stepFormTitle">{{ computeStepFormTitle }}</div>
      <div class="stepFormTip">
        {{ computeStepFormTip }}
      </div>

      <!-- 第一步基本信息表单formBasic -->
      <el-form
        v-show="activeStep === 0"
        :model="formBasicData"
        :rules="formBasic.rules"
        label-width="120px"
        ref="formBasic"
      >
        <el-form-item
          v-for="(item, index) in formBasic.itemList"
          :key="index"
          :label="item.label"
          :prop="item.prop"
        >
          <el-input
            v-model.trim="formBasicData[item.prop]"
            :type="item.type"
            :placeholder="item.placeholder"
            :rows="item.rows"
            :disabled="isEdit && item.prop === 'groupName'"
            resize="vertical"
          ></el-input>
        </el-form-item>
      </el-form>
      <!-- 第二步添加客户表单formCustomer -->
      <el-form
        v-show="activeStep === 1 && activeStep < tipTitleList.length - 1"
        :model="formCustomerData"
        :rules="formCustomer.rules"
        label-width=""
        ref="formCustomer"
      >
        <el-form-item
          v-for="(item, index) in formCustomer.itemList"
          :key="index"
          :label="item.label"
          :prop="item.prop"
        >
          <!-- 表单校验数字需要v-model.number绑定 -->
          <el-input
            v-model.trim="formCustomerData[item.prop]"
            :type="item.type"
            :placeholder="item.placeholder"
            :rows="item.rows"
            resize="vertical"
          ></el-input>
        </el-form-item>
      </el-form>

      <!-- 前两步显示的按钮 -->
      <div v-if="activeStep < tipTitleList.length - 1" class="buttonWrapper">
        <el-button
          v-if="tipTitleList && tipTitleList.length > 2 && activeStep > 0"
          @click="previousStep"
          >{{ $t("app.CustomerGroupSave.5ix7eb4vpq80") }}</el-button
        >
        <!-- <el-button v-if="activeStep === 0" type="primary" @click="nextStep"
          >{{$t('app.CustomerGroupSave.5ix7eb4vqc00')}}</el-button
        > -->
        <el-button type="primary" @click="nextStep">{{
          computeConfirmContent
        }}</el-button>
      </div>
      <!-- 最后一步显示的按钮 -->
      <div v-else class="buttonWrapper">
        <el-button type="plain" @click="goBack">{{
          $t("app.CustomerGroupSave.5ix7eb4vqh00")
        }}</el-button>
        <el-button v-if="!isEdit" type="primary" @click="recreateGroup">{{
          $t("app.CustomerGroupSave.5ix7eb4vqkk0")
        }}</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import api from "@/api";
import Steps from "@/components/steps/index.vue";

export default {
  name: "CustomerGroupSave",
  components: {
    Steps,
  },
  props: {
    groupId: {
      type: Number | null,
      required: true,
    },
    appCode: {
      type: String,
      required: true,
    },
    isEdit: {
      type: Boolean,
      required: true,
    },
    goBack: {
      type: Function,
      required: true,
    },
    formBasicData: {
      type: Object,
      required: true,
    },
    formCustomerData: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      activeStep: 0,
      tipTitleList: [
        this.$t("app.CustomerGroupSave.5ix7eb4vqnk0"),
        this.$t("app.CustomerGroupSave.5ix7eb4vqsc0"),
        this.$t("app.CustomerGroupSave.5ix7eb4vqvg0"),
      ],
      stepFormTitleTable: [
        this.$t("app.CustomerGroupSave.5ix7eb4vqyc0"),
        this.$t("app.CustomerGroupSave.5ix7eb4vr1s0"),
        this.$t("app.CustomerGroupSave.5ix7eb4vr540"),
      ],
      stepFormTipTable: ["", "", "", ""],
      confirmContentTable: [
        this.$t("app.CustomerGroupSave.5ix7eb4vqc00"),
        this.$t("app.CustomerGroupSave.5ix7eb4vr840"),
      ],

      formRefTable: ["formBasic", "formCustomer"],
      formBasic: {
        rules: {
          groupName: [
            {
              required: true,
              message: this.$t("app.CustomerGroupSave.5ix7eb4vrbc0"),
            },
            {
              min: 2,
              max: 30,
              message: this.$t("app.CustomerGroupSave.5ix7eb4vrec0"),
            },
            {
              pattern: /^[A-Z_a-z]*$/,
              message: this.$t("app.CustomerGroupSave.5ix7eb4vrhg0"),
            },
          ],
          desc: [
            {
              required: true,
              message: this.$t("app.CustomerGroupSave.5ix7eb4vrkk0"),
            },
            {
              min: 10,
              max: 100,
              message: this.$t("app.CustomerGroupSave.5ix7eb4vrnk0"),
            },
          ],
        },
        itemList: [
          {
            label: this.$t("app.CustomerGroupSave.5ix7eb4vrqk0"),
            prop: "groupName",
            placeholder: this.$t("app.CustomerGroupSave.5ix7eb4vrqk1"),
          },
          {
            label: this.$t("app.CustomerGroupSave.5ix7eb4vrtg0"),
            prop: "desc",
            type: "textarea",
            placeholder: this.$t("app.CustomerGroupSave.5ix7eb4vrtg1"),
            rows: 4,
          },
        ],
      },
      formCustomer: {
        rules: {
          pinList: [
            {
              required: true,
              message: this.$t("app.CustomerGroupSave.5ix7eb4vrwk0"),
            },
            {
              pattern: /^[a-zA-Z_0-9,]*$/,
              message: this.$t("app.CustomerGroupSave.5ix7eb4vs000"),
            },
          ],
        },
        itemList: [
          {
            label: "",
            prop: "pinList",
            type: "textarea",
            placeholder: this.$t("app.CustomerGroupSave.5ix7eb4vs001"),
            rows: 4,
          },
        ],
      },
    };
  },
  computed: {
    computeStepFormTitle() {
      if (this.isEdit) {
        if (this.formBasicData.groupName === "default") {
          this.stepFormTitleTable = [
            this.$t("app.CustomerGroupSave.5ix7eb4vqyc0"),
            this.$t("app.CustomerGroupSave.5ix7eb4vs4c0"),
          ];
        } else {
          this.stepFormTitleTable = [
            this.$t("app.CustomerGroupSave.5ix7eb4vqyc0"),
            this.$t("app.CustomerGroupSave.5ix7eb4vr1s0"),
            this.$t("app.CustomerGroupSave.5ix7eb4vs4c0"),
          ];
        }
      }
      console.log(this.stepFormTitleTable[this.activeStep]);
      return this.stepFormTitleTable[this.activeStep];
    },
    computeStepFormTip() {
      if (this.isEdit) {
        if (this.formBasicData.groupName === "default") {
          this.stepFormTipTable = ["", ""];
        } else {
          this.stepFormTipTable = ["", "", ""];
        }
      }
      return this.stepFormTipTable[this.activeStep];
    },
    computeHeaderContent() {
      return this.isEdit
        ? this.$t("app.CustomerGroupSave.5ix7eb4vs740")
        : this.$t("app.CustomerGroupSave.5ix7eb4vsa80");
    },
    computeConfirmContent() {
      if (this.isEdit) {
        if (this.formBasicData.groupName === "default") {
          this.confirmContentTable = [
            this.$t("app.CustomerGroupSave.5ix7eb4vscw0"),
          ];
        } else {
          this.confirmContentTable = [
            this.$t("app.CustomerGroupSave.5ix7eb4vqc00"),
            this.$t("app.CustomerGroupSave.5ix7eb4vscw0"),
          ];
        }
      }
      return this.confirmContentTable[this.activeStep];
    },
  },
  methods: {
    previousStep() {
      this.activeStep -= 1;
    },
    nextStep() {
      this.$refs[this.formRefTable[this.activeStep]].validate(async (valid) => {
        if (valid) {
          if (this.activeStep < this.tipTitleList.length - 2) {
            this.activeStep += 1;
          } else {
            const id = this.groupId;
            const appCode = this.appCode;
            const groupName = this.formBasicData.groupName;
            const desc = this.formBasicData.desc;
            const pinList =
              this.formCustomerData.pinList &&
              this.formCustomerData.pinList.length
                ? this.formCustomerData.pinList.split(",")
                : null;
            const data = { id, appCode, groupName, desc, pinList };
            await api.appManager
              .postCustomerGroupSaveData(data)
              .catch((error) => {
                throw error;
              });
            this.activeStep += 1;
          }
        } else {
          return false;
        }
      });
    },
    recreateGroup() {
      this.$emit("update:groupId", null);
      this.$refs[this.formRefTable[0]].resetFields();
      this.$refs[this.formRefTable[1]].resetFields();
      this.activeStep = 0;
    },
  },
  mounted() {
    this.tipTitleList =
      this.formBasicData.groupName === "default"
        ? [
            this.$t("app.CustomerGroupSave.5ix7eb4vqnk0"),
            this.$t("app.CustomerGroupSave.5ix7eb4vqvg0"),
          ]
        : [
            this.$t("app.CustomerGroupSave.5ix7eb4vqnk0"),
            this.$t("app.CustomerGroupSave.5ix7eb4vqsc0"),
            this.$t("app.CustomerGroupSave.5ix7eb4vqvg0"),
          ];
  },
};
</script>

<style lang="scss" scoped>
.customerGroupSave {
  .stepForm {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .el-icon-success {
      color: #26a872;
      font-size: 64px;
      margin: 8px;
    }
    .stepFormTitle {
      margin-bottom: 20px;
      font-size: 24px;
    }
    .stepFormTip {
      margin-bottom: 20px;
      text-align: center;
    }
    .el-form {
      width: 470px;
    }
  }
}
::v-deep .el-textarea__inner {
  padding: 4px 10px;
}
</style>
