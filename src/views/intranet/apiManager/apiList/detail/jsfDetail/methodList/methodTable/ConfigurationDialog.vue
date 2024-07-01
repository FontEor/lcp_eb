<template>
  <div class="configuration-dialog">
    <el-dialog
      :title="currentRow.name + '方法配置'"
      :visible="configurationDialogVisible"
      :close-on-click-modal="false"
      width="530px"
      @close="handleClose"
    >
      <el-form
        class="configuration-form"
        ref="configurationForm"
        :model="configurationForm"
        :rules="configurationFormRules"
        label-width="110px"
      >
        <el-form-item label="支持泛化调用" prop="generalizeDetail">
          <el-switch
            :active-value="1"
            :inactive-value="0"
            v-model="configurationForm.supportGeneralize"
            @change="val => handlerSupportGeneralizeChange(false, val)"
          >
          </el-switch>
          <p class="link" @click="handleGetParamsType">
            从JSF注册中心拉取JSF方法一级参数类型
          </p>
          <!-- ,“java.util.List” -->
          <el-input
            type="textarea"
            :rows="3"
            placeholder="由于在调用JSF服务时，需要网关指定一级参数类型。请使用上方的快捷按钮获取一级参数类型，或者手动维护参数类型。示例：[“com.aaa.bbb.ccc”]"
            v-model="configurationForm.generalizeDetail"
          >
          </el-input>
        </el-form-item>
        <p class="tip">
          为避免出现因为配置导致调用失败情况，请确保上面的一级参数类型及位置与运行时一致
        </p>
        <el-form-item label="异常类型白名单" prop="excpsWhites">
          <el-input
            type="textarea"
            rows="4"
            v-model.trim="configurationForm.excpsWhites"
            placeholder="异常类型配置到白名单后，网关会将异常信息放到错信息中返回给用户。多个用“,”分割，最多支持配置5个。示例：java.lang.Exception,java.lang.NullPointerException"
          ></el-input>
        </el-form-item>
        <el-form-item class="form-radio" prop="effectRange">
          <span class="radio-label">生效范围</span>
          <el-radio-group v-model="configurationForm.effectRange">
            <el-radio :label="0">在部分对接方案/API分组生效</el-radio>
            <el-tooltip
              class="item"
              effect="dark"
              content="选择全部生效后，配置信息将对使用此JSF方法的所有用户生效。如未进行过配置验证，请勿轻易选择全部生效。"
              placement="bottom-start"
            >
              <el-radio :label="1">全部生效</el-radio>
            </el-tooltip>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="effectDomains">
          <el-input
            type="textarea"
            rows="4"
            v-model.trim="configurationForm.effectDomains"
            placeholder="填写生效异常类型白名单的对接方案编码，多个请用“,”分割，最多支持配置10个。示例：JD_CMBC,CMBC"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="handleSave">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import jsfDetail from "@/api/intranet/apiManager/jsfDetail/index.js";

export default {
  name: "ConfigurationDialog",
  props: {
    currentRow: {
      type: Object,
      required: true
    },
    configurationDialogVisible: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      configurationForm: {
        excpsWhites: null,
        effectDomains: null,
        effectRange: 1,
        supportGeneralize: 0,
        generalizeDetail: ""
      },
      configurationFormRules: {
        excpsWhites: [
          {
            pattern: /^([^,]*,){0,4}[^,]*$/,
            message: "异常类型超过5个"
          }
        ],
        effectDomains: [
          {
            pattern: /^([^,]*,){0,9}[^,]*$/,
            message: "异常类型超过10个"
          }
        ],
        generalizeDetail: [
          {
            validator: (rule, value, callback) => {
              if (this.configurationForm.supportGeneralize === 0) {
                callback();
                return;
              }
              const len = value.length;
              const regExp = /^[a-zA-Z0-9,\.[\]''""]*$/g;
              if (len > 100 || len <= 0) {
                callback(new Error("字符长度范围为：1-100"));
                return;
              }
              const pass = regExp.test(value.replace(/\s*/g, ""));
              if (!pass) {
                callback(new Error('允许输入英文字母、数字、[]、""、"、.、,'));
                return;
              }
              try {
                this.paramTypeList = JSON.parse(
                  this.configurationForm.generalizeDetail
                );
              } catch (err) {
                callback(new Error("请输入正确格式的一级参数类型"));
                return;
              }
              // if (!this.paramTypeList.includes("java.util.List")) {
              //   callback(new Error("配置信息需包含泛型java.util.List"));
              //   return;
              // }

              callback();
            },
            trigger: "change"
          }
        ]
      },
      paramTypeList: []
    };
  },
  watch: {
    configurationDialogVisible: {
      async handler(newValue) {
        if (newValue) {
          console.log("this.currentRow", this.currentRow);
          const { qualifiedName, name } = this.currentRow;
          const interfaceName = qualifiedName;
          const methodName = name;
          const { data } = await jsfDetail
            .findMethodConfig([{ interfaceName, methodName }])
            .catch(() => {
              throw new Error("handleConfiguration findMethodConfig");
            });
          if (data) {
            this.configurationForm.effectDomains = data.effectDomains;
            this.configurationForm.effectRange = data.effectRange;
            this.configurationForm.excpsWhites = data.excpsWhites;
            this.configurationForm.generalizeDetail = JSON.stringify(
              data.jsfGeneric.paramTypeList
            );
            this.configurationForm.supportGeneralize = data.jsfGeneric.enabled;
          }
        }
      }
    }
  },
  methods: {
    handlerSupportGeneralizeChange(singleCheck = false, newStatus) {
      if (+newStatus === 0 && !singleCheck) return;
      if (
        !newStatus &&
        singleCheck &&
        this.configurationForm.generalizeDetail.length <= 0
      ) {
        return true;
      }
      if (this.configurationForm.generalizeDetail.length <= 0) {
        // 检验：文本框中是否维护了配置信息
        this.configurationForm.supportGeneralize = 0;
        this.$message(
          "无法开启支持泛化调用开关请在开关下的文本框中，维护一级参数的配置信息"
        );
        return;
      }
      try {
        this.paramTypeList = JSON.parse(
          this.configurationForm.generalizeDetail
        );
      } catch (err) {
        this.$message.error({ message: "请输入正确格式的一级参数类型" });
        return;
      }
      // if (!this.paramTypeList.includes("java.util.List")) {
      //   // 校验：文本框中是否维护的配置信息，一级参数是否存在java.util.List泛型
      //   this.$message.error({
      //     message: "无法开启支持泛化调用开关配置内容中不包含泛型"
      //   });
      //   this.configurationForm.supportGeneralize = 0;
      //   return;
      // }
      !singleCheck && (this.configurationForm.supportGeneralize = newStatus);
      return true;
    },
    handleGetParamsType() {
      const {
        qualifiedName: interfaceName,
        name: methodName
      } = this.currentRow;
      jsfDetail
        .queryOneLevelParamTypeForMethod([{ interfaceName, methodName }])
        .then(response => {
          this.configurationForm.generalizeDetail = JSON.stringify(
            response.data
          );
        });
    },
    handleClose() {
      this.$emit("update:configurationDialogVisible", false);
      this.$refs.configurationForm.resetFields();
    },
    handleSave() {
      this.$refs["configurationForm"].validate(async valid => {
        if (valid) {
          const { qualifiedName, name } = this.currentRow;
          const interfaceName = qualifiedName;
          const methodName = name;
          const {
            effectRange,
            excpsWhites,
            effectDomains
          } = this.configurationForm;
          if (!this.handlerSupportGeneralizeChange(true)) {
            return;
          }
          const data = {
            interfaceName,
            methodName,
            effectRange,
            excpsWhites,
            effectDomains,
            jsfGeneric: {
              enabled: this.configurationForm.supportGeneralize,
              paramTypeList: this.paramTypeList
            }
          };
          await jsfDetail
            .saveMethodConfig([data])
            .then(() => {
              this.$emit("updateStatus");
              this.$emit("reloadTableData");
            })
            .catch(() => {
              throw new Error("handleConfiguration findMethodConfig");
            });
          this.$emit("update:configurationDialogVisible", false);
        } else {
          return false;
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.configuration-dialog {
  .configuration-form {
    .radio-label {
      margin-right: 8px;
    }
  }
  .link {
    color: #3c6ef0;
    text-decoration: underline;
    cursor: pointer;
  }
  .tip {
    color: red;
    line-height: 20px;
    margin: -4px 0 22px 110px;
  }
}
</style>
