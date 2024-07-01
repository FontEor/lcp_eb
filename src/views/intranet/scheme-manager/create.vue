<template>
  <div class="createBizUnit">
    <div class="app-container">
      <h2 class="menuTitle">创建对接方案</h2>

      <Steps :active="steps.active" :tiptitle="steps.tiptitle" />

      <div class="stepForm">
        <!-- 根据数据表显示各步骤表单标题与提示文本 -->
        <h3 class="stepFormTitle">{{ computeStepFormTitle }}</h3>
        <p class="stepFormTip">{{ computeStepFormTip }}</p>

        <!-- 第一步基本信息表单formBasic -->
        <el-form
          v-show="steps.active === 0"
          :model="formBasic.data"
          :rules="formBasic.rules"
          label-width="190px"
          ref="formBasic"
        >
          <el-form-item
            v-for="(item, index) in formBasic.itemList"
            :key="index"
            :label="item.label"
            :prop="item.prop"
            v-show="!item.hidden"
          >
            <span slot="label" v-if="item.componentType === 'radio'">
              {{item.label}}&nbsp;
              <el-tooltip content="注意此处指底层接口的服务类型，不是对接方案，对接方案对外统一为http服务" placement="top">
                <i class="el-icon-help-solid" />
              </el-tooltip>
            </span>
            <el-radio-group
              v-if="item.componentType === 'radio'"
              v-model="formBasic.data.domainType"
              @change="changeCheckShow"
            >
              <el-radio :label="1">JSF服务</el-radio>
              <el-radio :label="2">HTTP服务</el-radio>
            </el-radio-group>
            <el-checkbox-group
              v-else-if="item.componentType === 'check'"
              v-model="formBasic.data.checkList"
            >
              <el-checkbox
                v-show="checkboxItem.envList.includes(formChooseEnv.env)"
                v-for="(
                  checkboxItem, checkboxIndex
                ) in formChooseEnv.checkboxList"
                :key="checkboxIndex"
                :label="checkboxItem.label"
                :disabled="checkboxItem.checked"
                >{{ checkboxItem.text }}</el-checkbox
              >
            </el-checkbox-group>

            <el-select
              v-model="formBasic.data.solutionType"
              placeholder="请选择"
              style="width: 100%"
              v-else-if="
                item.componentType == 'select' && item.prop == 'solutionType'
              "
              @change="onChangeSolutionType"
            >
              <el-option
                v-for="item in solutionTypeOptionList"
                :key="item.dictName"
                :label="item.dictValue"
                :value="item.dictName"
              >
              </el-option>
            </el-select>
            <el-select
              v-model="formBasic.data.businessTypeCode"
              placeholder="请选择"
              style="width: 100%"
              v-else-if="
                item.componentType == 'select' &&
                item.prop == 'businessTypeCode'
              "
            >
              <el-option
                v-for="item in businessTypeCodeOptionList"
                :key="item.code"
                :label="item.name"
                :value="item.code"
              >
              </el-option>
            </el-select>
            <el-input
              v-else
              v-model.trim="formBasic.data[item.prop]"
              :type="item.type"
              :placeholder="item.placeholder"
              :rows="item.rows"
              resize="vertical"
            ></el-input>
          </el-form-item>
        </el-form>

        <!-- 第二步选择接口图片展示 -->
        <div v-show="steps.active === 1" class="imageWrapper">
          <el-image
            :src="require('@/assets/addInterface.gif')"
            :preview-src-list="[require('@/assets/addInterface.gif')]"
            fit="contain"
          ></el-image>
        </div>

        <!-- 第四步创建SDK图片展示 -->
        <div v-show="steps.active === 2" class="imageWrapper">
          <el-image
            :src="require('@/assets/addSDK.gif')"
            :preview-src-list="[require('@/assets/addSDK.gif')]"
            fit="contain"
          ></el-image>
        </div>

        <!-- 第五步完成展示卡片 -->
        <div v-show="steps.active === 3" class="cardWrapper">
          <div v-for="(item, index) in cardList" :key="index" class="card">
            <p class="cardTitle">{{ item.title }}</p>
            <div class="cardContent">
              <p class="cardTip">{{ item.tip }}</p>
              <el-button type="primary" @click="item.goTo">{{
                item.buttonText
              }}</el-button>
            </div>
          </div>
        </div>

        <!-- 前四步显示的按钮 -->
        <div v-if="steps.active < 3" class="buttonWrapper">
          <el-button v-if="steps.active > 0" @click="previousStep"
            >上一步</el-button
          >
          <el-button v-if="steps.active < 2" type="primary" @click="nextStep"
            >下一步</el-button
          >
          <el-button
            v-if="steps.active === 2"
            type="primary"
            :loading="confirmCreateLoading"
            @click="onClickConfirmCreateButton"
            >确认创建</el-button
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Steps from "@/components/steps/index.vue";
import lcp from "@/api/intranet/lcp/index.js";

export default {
  name: "CreateBizUnit",
  components: { Steps },
  data() {
    const that = this;
    const validateCode = async (rule, value, callback) => {
      const result = await this.handleIsCodeExist(value).catch((error) => {
        callback(new Error("对接方案编码校验异常"));
        throw new Error(`validateCode, ${error}`);
      });
      callback(result ? undefined : new Error("对接方案编码已存在"));
    };
    return {
      unitId: 0,
      steps: {
        active: 0,
        tiptitle: ["填写基本信息", "选择接口", "创建SDK", "完成"],
      },
      stepFormTitleTable: [
        "请填写对接方案基本信息",
        "选择您要开放的接口",
        "创建SDK",
        "接下来您可以",
      ],
      stepFormTipTable: [
        "此处填写的信息将直接展示给用户，以供用户了解和订阅对接方案，请认真填写",
        "从API仓库中选择您要开放的接口，稍后可在对接方案管理-接口管理中继续添加接口",
        "将一组接口打包生成SDK，以方便合作伙伴对接业务系统",
        "补全对接方案相关信息后，即可发布该对接方案",
      ],
      formRefTable: ["formBasic", ,],
      formBasic: {
        data: {
          checkList: [],
          businessTypeCode: "",
          solutionType: "",
        },
        itemList: [
          {
            label: "对接方案编码",
            prop: "code",
            placeholder: "2-30个字符，由字母、下划线组成",
            hidden: false,
          },
          {
            label: "对接方案名称",
            prop: "name",
            placeholder: "2-30个字符",
            hidden: false,
          },
          {
            label: "方案类型",
            prop: "solutionType",
            placeholder: "2-30个字符",
            hidden: false,
            componentType: "select",
          },
          {
            label: "所属分类",
            prop: "businessTypeCode",
            placeholder: "2-30个字符",
            hidden: false,
            componentType: "select",
          },
          {
            label: "底层接口类型",
            prop: "domainType",
            componentType: "radio",
            hidden: false,
          },
          {
            label: "对接环境",
            prop: "checkList",
            componentType: "check",
            hidden: true,
          },
          {
            label: "对接方案简介",
            prop: "remark",
            type: "textarea",
            placeholder: "简述对接方案的主要服务内容，10-200个字符",
            rows: 3,
            hidden: false,
          },
        ],
        rules: {
          code: [
            { required: true, message: "编码不能为空" },
            { min: 2, max: 30, message: "请输入2-30个字符" },
            { pattern: /^[A-Za-z_]*$/, message: "请输入英文字母、_" },
            { validator: validateCode },
          ],
          name: [
            { required: true, message: "名称不能为空" },
            { min: 2, max: 30, message: "请输入2-30个字符" },
          ],
          remark: [
            { required: true, message: "简介不能为空" },
            { min: 10, max: 200, message: "请输入10-200个字符" },
          ],
          domainType: [{ required: true, message: "服务类型不能为空" }],
          solutionType: [{ required: true, message: "方案类型不能为空" }],
          businessTypeCode: [{ required: true, message: "所属分类不能为空" }],
        },
      },
      formAccess: {
        data: {
          authProtocol: 1,
          signAlg: 1,
          signEntity: 1,
        },
        rules: {
          appType: [{ required: true, message: "应用类型不能为空" }],
        },
        // 签名认证对应appType
        accessTable: [, , { type: "oauth2" }, , { type: "hmac" }],
      },
      cardList: [
        {
          title: "管理要开放的接口",
          tip: "继续增加要开放的接口，确保接口列表完整覆盖所有场景要用到的业务接口",
          buttonText: "去管理",
          goTo() {
            that.goToRoute("OpenBizOpenBizDetail", "interfaceList");
          },
        },
        {
          title: "创建SDK",
          tip: "创建多语言SDK，开发者可通过SDK调用接口，对接更快",
          buttonText: "去创建",
          goTo() {
            that.goToRoute("OpenBizOpenBizDetail", "sdkAdd");
          },
        },
      ],
      formChooseEnv: {
        checkboxList: [
          {
            label: "test",
            text: "测试环境",
            envList: ["local", "test"],
            checked: true,
          },
          { label: "uat", text: "生产环境", envList: ["prod"], checked: true },
          { label: "prod", text: "生产环境", envList: ["prod"], checked: true },
        ],
        envTable: {
          local: ["test"],
          test: ["test"],
          uat: ["prod"],
          prod: ["prod"],
        },
        env: window.env.baseEnv,
      },
      solutionTypeOptionList: [],
      businessTypeCodeOptionList: [],
      confirmCreateLoading: false,
      confirmCreateDebounceTimer: null,
    };
  },
  computed: {
    computeStepFormTitle() {
      return this.stepFormTitleTable[this.steps.active];
    },
    computeStepFormTip() {
      return this.stepFormTipTable[this.steps.active];
    },
  },
  methods: {
    // 根据类型与字典名查询字典表数据
    async getDicts() {
      const type = "solutionType";
      const params = { type };
      return await lcp.lcpDict.getDicts(params).catch((error) => {
        throw new Error(`getDicts, ${error}`);
      });
    },
    // 根据对接方案编码校验其是否已存在
    async isCodeExist(code) {
      const params = { code };
      return await lcp.bizunit.isCodeExist(params).catch((error) => {
        throw new Error(`isCodeExist, ${error}`);
      });
    },
    // 根据对接方案编码校验其是否已存在
    async findBySolutionType() {
      const { solutionType } = this.formBasic.data;
      const params = { solutionType };
      return await lcp.businesstype
        .findBySolutionType(params)
        .catch((error) => {
          throw new Error(`findBySolutionType, ${error}`);
        });
    },
    // 创建对接方案单元
    async insertBizUnitPre() {
      const { code, name, solutionType, businessTypeCode, domainType, remark } =
        this.formBasic.data;
      const data = {
        code,
        name,
        remark,
        domainType,
        solutionType,
        businessTypeCode,
      };
      return await lcp.bizunit.insertBizUnitPre(data).catch((error) => {
        throw new Error(`insertBizUnitPre, ${error}`);
      });
    },

    async handleGetDicts() {
      const { data = [] } = await this.getDicts().catch((error) => {
        throw new Error(`handleGetDicts, ${error}`);
      });
      this.solutionTypeOptionList = data instanceof Array ? data : [];
    },
    async handleIsCodeExist(query) {
      const { data = false } = await this.isCodeExist(query).catch((error) => {
        throw new Error(`handleIsCodeExist, ${error}`);
      });
      return data || false;
    },
    async handleFindBySolutionType() {
      const { data = [] } = await this.findBySolutionType().catch((error) => {
        throw new Error(`handleFindBySolutionType, ${error}`);
      });
      this.businessTypeCodeOptionList = data instanceof Array ? data : [];
    },
    async handleInsertBizUnitPre() {
      const { data = 0 } = await this.insertBizUnitPre().catch((error) => {
        throw new Error(`handleInsertBizUnitPre, ${error}`);
      });
      this.unitId = data || 0;
    },

    previousStep() {
      this.steps.active -= 1;
    },
    nextStep() {
      if (this.formRefTable[this.steps.active]) {
        this.$refs[this.formRefTable[this.steps.active]].validate((valid) => {
          if (valid) {
            this.steps.active += 1;
          } else {
            return false;
          }
        });
      } else {
        this.steps.active += 1;
      }
    },
    onClickConfirmCreateButton() {
      clearTimeout(this.confirmCreateDebounceTimer);
      this.confirmCreateDebounceTimer = setTimeout(async () => {
        this.confirmCreateLoading = true;
        await this.handleInsertBizUnitPre().catch((error) => {
          this.confirmCreateLoading = false;
          throw new Error(`onClickConfirmCreateButton, ${error}`);
        });
        this.nextStep();
        this.confirmCreateLoading = false;
      }, 300);
    },
    goToRoute(name, tag) {
      const id = this.unitId;
      this.$router.push({
        name,
        params: { id },
        query: { tag },
      });
    },
    changeCheckShow(sel) {
      this.formBasic.itemList[3].hidden = false;
      //预发、线上环境
      if (
        this.formChooseEnv.env === "uat" ||
        this.formChooseEnv.env === "prod"
      ) {
        if (sel == "2") {
          //如果是http
          this.formBasic.data.checkList = ["prod", "uat"];
          this.formChooseEnv.checkboxList[2].checked = true; //禁止选中
        } else if (sel == "1") {
          //如果是jsf
          this.formBasic.data.checkList =
            this.formChooseEnv.envTable[this.formChooseEnv.env]; //选中某个
          this.formChooseEnv.checkboxList[2].checked = false; //可以选中
        }
      } else {
        //其他环境test
        this.formBasic.data.checkList =
          this.formChooseEnv.envTable[this.formChooseEnv.env];
      }
    },
    /**
     * 选中对接方案类型
     */
    async onChangeSolutionType() {
      this.formBasic.data.businessTypeCode = "";
      await this.handleFindBySolutionType().catch((error) => {
        throw new Error(`onChangeSolutionType, ${error}`);
      });
    },
  },
  async created() {
    await this.handleGetDicts().catch((error) => {
      throw new Error(`created, ${error}`);
    });
  },
};
</script>

<style lang="scss" scoped>
.createBizUnit {
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
  .stepForm {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .stepFormTitle {
      margin-bottom: 20px;
      font-size: 24px;
    }
    .stepFormTip {
      margin-bottom: 20px;
      text-align: center;
    }
    .el-form {
      width: 500px;
    }
    .el-image {
      width: 500px;
    }
    .buttonWrapper {
      margin-top: 12px;
    }
    .card {
      margin-bottom: 20px;
      padding: 20px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
      .cardTitle {
        font-size: 18px;
      }
      .cardContent {
        margin-top: 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .cardTip {
          margin-right: 20px;
        }
      }
    }
    .radioTooltip {
      margin-left: 4px;
    }
    .formItemContent {
      .formItemContentItem {
        display: inline-block;
        width: 140px;
        text-align: center;
        color: #666;
      }
    }
  }
  ::v-deep .el-textarea__inner {
    padding: 5px 10px;
  }
}
</style>