<template>
  <div class="register-extension-point">
    <!-- 注册扩展点页头 -->
    <el-page-header
      @back="$emit('update:currentDisplayComponentName', 'ExtensionPointList')"
      content="注册扩展点"
    />

    <!-- 步骤条 -->
    <Steps :active="active" :titleList="titleList" />

    <!-- 上传SPI定义文件 -->
    <el-upload
      v-if="active === 0"
      class="upload-wrapper"
      action="upload"
      :drag="true"
      :auto-upload="false"
      :file-list="fileList"
      :on-change="changeUploadFileList"
    >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">
        将IDEA插件生成的API描述文件拖到此处，或
        <em>点击上传</em>
      </div>
      <div class="el-upload__tip" slot="tip">
        <a :href="computeHref" target="_blank">如何获取API描述文件?</a>
      </div>
    </el-upload>

    <!-- 填写基础信息表单 -->
    <div v-show="active === 1" class="basic-info-form-wrapper">
      <el-form
        :model="basicInfoFormData"
        :rules="basicInfoFormRules"
        label-width="80px"
        ref="basicInfoForm"
        class="basic-info-form"
      >
        <!-- 方法名称 -->
        <el-form-item label="方法名称" prop="methodName">
          <el-select
            v-model="basicInfoFormData.methodName"
            :loading="selectMethodNameLoading"
            :filterable="true"
            :clearable="true"
            placeholder="请选择方法名称"
            style="width: 70%"
            @change="changeMethodName"
          >
            <el-option
              v-for="(methodItem, index) in methodOptionList"
              :key="index"
              :label="methodItem"
              :value="methodItem"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <!-- 所属分类 -->
        <el-form-item label="所属分类" prop="productSysGroup">
          <el-select
            v-model="basicInfoFormData.productSysGroup"
            @focus="reloadGroupList"
            value-key="id"
            :loading="selectProductSysGroupIdLoading"
            placeholder="请选择扩展点所属分组"
            style="width: 70%"
          >
            <el-option
              v-for="groupItem in groupOptionList"
              :key="groupItem.id"
              :label="groupItem.cnName"
              :value="groupItem"
            >
            </el-option>
          </el-select>
          <el-button
            type="text"
            icon="el-icon-plus"
            style="margin-left: 8px"
            @click="handleSpiClassification"
            >管理分类</el-button
          >
        </el-form-item>
        <!-- 中文名称 -->
        <el-form-item label="中文名称" prop="cnName">
          <el-input
            v-model.trim="basicInfoFormData.cnName"
            placeholder="请输入中文名称"
            style="width: 70%"
          ></el-input>
        </el-form-item>
        <!-- URI -->
        <el-form-item label="URI" prop="uri">
          <el-input
            v-model.trim="basicInfoFormData.uri"
            disabled
            style="width: 70%"
          ></el-input>
        </el-form-item>
      </el-form>
      <!-- 管理分类对话框 -->
      <ClassificationDialog
        :showClassificationDialog.sync="showClassificationDialog"
        :tableData.sync="spiTableData"
        :productCode.sync="productCode"
        :queryTableList="queryTableList"
      />
    </div>

    <!-- 描述触发场景 -->
    <MarkdownEditor
      ref="MarkdownEditor"
      v-if="active === 2"
      v-model="docJssKey"
      class="markdown-editor"
    />

    <!-- 完成 -->
    <template v-else-if="active === 3">
      <div class="finish-wrapper">
        <i class="el-icon-success" />
        <p class="finish-title">注册成功</p>
        <p class="finish-tip">您可继续注册扩展点</p>
      </div>
    </template>

    <!-- 按钮 -->
    <div class="button-wrapper">
      <el-button v-if="active === 1" type="primary" @click="verifyBasicInfoForm"
        >下一步</el-button
      >
      <el-button
        v-else-if="active === 2"
        type="primary"
        @click="handleConfirmRegisterExtensionPoint"
        >确认注册</el-button
      >
      <div v-else-if="active === 3" class="button-wrapper__inner">
        <el-button
          @click="
            $emit('update:currentDisplayComponentName', 'ExtensionPointList')
          "
          >返回扩展点列表</el-button
        >
        <el-button type="primary" @click="active = 0">继续注册扩展点</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import Steps from "@/components/Steps.vue";
import MarkdownEditor from "@/components/MarkdownEditor/index.vue";
import ClassificationDialog from "@/views/intranet/softwareSystem/developerResource/openExtensionPoint/editExtensionPointDocument/classificationDialog.vue";
import openExtensionPoint from "@/api/intranet/softwareSystem/developerResource/openExtensionPoint.js";
import developerResource from "@/api/intranet/softwareSystem/developerResource/index.js";
import regExp from "@/constants/regExp.js";

export default {
  name: "RegisterExtensionPoint",
  components: { Steps, ClassificationDialog, MarkdownEditor },
  props: {
    currentDisplayComponentName: {
      type: String,
      required: true,
    },
    productCode: {
      type: String,
      required: true,
    },
    type: {
      type: Number,
      required: true,
    },
    groupList: {
      type: Function,
    },
  },
  data() {
    return {
      active: 0,
      titleList: [
        "上传SPI定义文件",
        "填写基础信息",
        "描述触发场景",
        "注册成功",
      ],
      // 上传SPI定义文件
      hrefHelpDocument: `//lcp.jdl.com/#${window.env.docDescription}`,
      fileList: [],
      interfaceName: "",
      xmlJssKey: "",
      // 填写基础信息表单
      basicInfoFormData: {
        methodName: "",
        productSysGroup: { id: null },
        cnName: "",
        uri: "",
      },
      basicInfoFormRules: {
        methodName: [{ required: true, message: "请输入方法名称" }],
        productSysGroup: [{ required: true, message: "请选择扩展点所属分类" }],
        cnName: [{ required: true, message: "请输入中文名称" }],
        uri: [
          { required: true, message: "请输入URI" },
          { pattern: /^\//, message: "URI必须以/开头，例如：/u1" },
        ],
      },
      methodOptionList: [],
      selectMethodNameLoading: false,
      groupOptionList: [],
      selectProductSysGroupIdLoading: false,
      // 触发场景
      docJssKey: "",
      createCategoryFormRules: {
        cnName: [
          { required: true, message: "请输入分类中文名称" },
          { max: 20, message: "长度不超过20个字符" },
          {
            pattern: regExp.chinese,
            message: "请输入中文字符",
          },
        ],
        enName: [
          { required: true, message: "请输入分类英文名称" },
          { max: 20, message: "长度不超过20个字符" },
          {
            pattern: regExp.english,
            message: "请输入英文字母",
          },
        ],
      },
      debounceTimer: null,
      confirmRegisterLoading: false,
      showClassificationDialog: false,
      spiTableData: [],
    };
  },
  computed: {
    // 计算API描述文件跳转链接
    computeHref() {
      const { dictionary } = this.$store.state.tools;
      try {
        return dictionary.docLink["apiDescrFile"].value;
      } catch (error) {
        return "";
      }
    },
  },
  watch: {
    active: {
      async handler(newValue) {
        if (newValue === 1) {
          await this.reloadGroupList().catch(() => {
            throw new Error("watch active");
          });
        }
      },
      immediate: true,
    },
  },
  methods: {
    async upload(raw) {
      const data = new FormData();
      data.append("file", raw);
      return await openExtensionPoint.upload(data).catch((error) => {
        const { message } = error.data;
        message && this.$message.error(message);
        throw new Error("upload");
      });
    },
    // 注册开放扩展点
    async save() {
       this.docJssKey = this.$refs.MarkdownEditor.getValue();
      const { productCode, interfaceName, xmlJssKey, docJssKey } = this;
      const { methodName, productSysGroup, cnName, uri } =
        this.basicInfoFormData;
      const productSysGroupId = productSysGroup.id;
      const data = {
        productCode,
        interfaceName,
        xmlJssKey,
        methodName,
        productSysGroupId,
        cnName,
        uri,
        docJssKey,
      };
      return await openExtensionPoint.save(data).catch((error) => {
        const { message } = error.data;
        message && this.$message.error(message);
        throw new Error("save");
      });
    },

    // 上传文件列表改变时
    async changeUploadFileList(file) {
      const { raw } = file;
      if (raw.type !== "text/xml") {
        this.$message.error("只支持xml格式的文件！");
        this.fileList = [];
        return false;
      }
      const response = await this.upload(raw).catch(() => {
        this.fileList = [];
        throw new Error("changeUploadFileList");
      });
      const { data } = response.data;
      const { interfaceName, xmlJssKey, methodNameList } = data;
      this.interfaceName = interfaceName || "";
      if (interfaceName && interfaceName.length < 255) {
        this.xmlJssKey = xmlJssKey;
        this.methodOptionList = methodNameList;
        this.$message.success("上传API描述文件成功！");
        this.active = 1;
      } else {
        this.fileList = [];
        this.$message.error("服务名称必须小于255个字符!");
      }
    },
    // 查询所属分类列表
    async reloadGroupList() {
      this.selectProductSysGroupIdLoading = true;
      const response = await this.groupList().catch(() => {
        throw new Error("reloadGroupList");
      });
      const { data } = response.data;
      this.groupOptionList = data;
      this.selectProductSysGroupIdLoading = false;
    },
    // 方法名称改变时，为URI添加默认值
    changeMethodName(value) {
      const { interfaceName } = this;
      const { productSysGroup } = this.basicInfoFormData;
      const { enName = "" } = productSysGroup;
      const interfaceNameString = interfaceName.split(".").slice(-1)[0];
      this.basicInfoFormData.uri = `${enName}/${interfaceNameString}/${value}`;
    },
    // 校验基本信息表单
    verifyBasicInfoForm() {
      this.$refs.basicInfoForm.validate((valid) => {
        if (valid) {
          this.active = 2;
        } else {
          return false;
        }
      });
    },
    // 重置各个步骤绑定值
    resetFields() {
      this.fileList = [];
      this.$refs.basicInfoForm.resetFields();
      this.docJssKey = "";
    },
    // 确认注册扩展点操作
    async handleConfirmRegisterExtensionPoint() {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(async () => {
        this.confirmRegisterLoading = true;
        await this.save().catch(() => {
          this.confirmRegisterLoading = false;
          throw new Error("handleConfirmRegisterExtensionPoint");
        });
        this.active = 3;
        this.resetFields();
        this.$emit("updateStatus");
        this.$nextTick(() => {
          this.confirmRegisterLoading = false;
        });
      }, 300);
    },
    // 点击管理分类按钮
    async handleSpiClassification() {
      await this.queryTableList();
      this.showClassificationDialog = true;
    },
    // 查询管理分类表格列表
    async queryTableList() {
      const response = await this.queryGroupList();
      const responseData = response.data.data;
      responseData.forEach((item) => {
        item.editNameState = false;
        item.editCodeState = false;
      });
      this.spiTableData = responseData;
    },

    // 查询所属分类分组
    async queryGroupList() {
      const { productCode } = this;
      const type = 3;
      const data = { productCode, type };
      const response = await developerResource.list(data).catch((error) => {
        const { message } = error.data;
        message && this.$message.error(message);
        throw new Error("queryGroupList");
      });
      return response;
    },
  },
};
</script>

<style lang="scss" scoped>
.register-extension-point {
  // 上传SPI定义文件
  .upload-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    .el-upload__tip {
      color: #3c6ef0;
    }
  }
  // 基本信息表单
  .basic-info-form-wrapper {
    margin: 0 auto;
    width: 640px;
    .basic-info-form {
      margin: 0 auto;
      width: 480px;
    }
    .dialog-content {
      max-height: 50vh;
    }
  }
  // 触发场景描述
  .markdown-editor {
    margin-bottom: 16px;
    min-height: 50vh;
  }
  // 完成
  .finish-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    .el-icon-success {
      font-size: 48px;
      color: #26a872;
    }
    .finish-title {
      margin: 8px auto;
      font-size: 24px;
    }
    .finish-tip {
      margin-bottom: 16px;
    }
  }
  // 按钮区域
  .button-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>