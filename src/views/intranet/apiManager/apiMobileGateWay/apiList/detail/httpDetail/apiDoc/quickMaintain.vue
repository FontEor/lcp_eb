<template>
  <div class="quick-maintain">
    <!-- 快速维护下拉菜单 -->
    <el-dropdown
      class="quick-maintain__dropdown"
      trigger="click"
      @command="handleCommandDropdownItem"
    >
      <span>快速维护<i class="el-icon-arrow-down el-icon--right"></i> </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="jsonEdit">JSON编辑</el-dropdown-item>
        <el-dropdown-item command="importXml">导入XML文件</el-dropdown-item>
        <el-dropdown-item command="importJson">导入JSON报文</el-dropdown-item>
        <el-dropdown-item v-if="provideWay === 1" command="pullFromJsf"
          >从JSF注册中心拉取元数据</el-dropdown-item
        >
      </el-dropdown-menu>
    </el-dropdown>

    <!-- 导入XML文件 -->
    <el-dialog
      custom-class="import-xml-dialog"
      title="导入XML文件"
      width="480px"
      :visible.sync="importXmlDialogVisible"
      :close-on-click-modal="false"
      @close="$refs.importXmlForm.resetFields()"
    >
      <p class="quick-maintain-tip">{{ computeQuickMaintainTipText }}</p>
      <el-form
        class="import-xml-form"
        ref="importXmlForm"
        :model="importXmlFormData"
        :rules="importXmlFormRules"
      >
        <el-form-item
          v-for="item in importXmlFormList"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          label-width="100px"
        >
          <template v-if="['method'].includes(item.prop)">
            <el-radio-group
              v-model="importXmlFormData.method"
              style="margin: 8px; width: 100%"
            >
              <el-radio label="uploadFile">上传文件</el-radio>
            </el-radio-group>
          </template>
          <template v-else-if="['fileList'].includes(item.prop)">
            <el-upload
              class="import-xml-form__upload"
              ref="importXmlFormUpload"
              :action="uploadUrl"
              :file-list="importXmlFormData.fileList"
              :auto-upload="false"
              :on-change="handleChangeImportXmlUpload"
              :on-success="handleSuccessImportXmlUpload"
              :on-error="handleErrorImportXmlUpload"
            >
              <el-button slot="trigger" type="primary">选取文件</el-button>
              <div slot="tip" class="el-upload__tip">
                只能上传XML文件，且不超过500kb
              </div>
            </el-upload>
          </template>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="importXmlDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          :loading="importXmlSaveLoading"
          @click="handleClickConfirmImportXml"
          >确 定</el-button
        >
      </div>
    </el-dialog>

    <!-- 导入JSON文件 -->
    <el-dialog
      custom-class="import-json-dialog"
      title="导入"
      width="560px"
      :visible.sync="importJsonDialogVisible"
      :close-on-click-modal="false"
      @close="$refs.importJsonForm.resetFields()"
    >
      <el-form
        class="json-dialog-form"
        ref="importJsonForm"
        :model="importJsonFormData"
        :rules="importJsonFormRules"
        label-width="100px"
      >
        <p class="quick-maintain-tip">{{ computeQuickMaintainTipText }}</p>
        <el-form-item prop="method" label="导入方式">
          <el-radio-group v-model="importXmlFormData.method">
            <el-radio label="uploadFile">文件导入</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="fileList" label="导入操作">
          <el-upload
            class="form__upload"
            ref="importJsonFormUpload"
            :action="uploadUrl"
            :file-list="importJsonFormData.fileList"
            :limit="1"
            :on-exceed="handleJsonExceed"
            :before-upload="handleBeforeUpload"
            :on-remove="handleRemoveImportJsonUpload"
            :on-success="handleSuccessImportJsonUpload"
            :on-error="handleErrorImportJsonUpload"
          >
            <el-button type="primary" icon="el-icon-upload2"
              >上传文件</el-button
            >
            <div slot="tip" class="el-upload__tip">
              上传的文件大小不能超过500kb
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="importJsonDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSaveImportJson">保存</el-button>
      </div>
    </el-dialog>

    <!-- JSON编辑 -->
    <el-dialog
      custom-class="import-json-dialog"
      :title="isRequest ? 'JSON编辑请求参数':'JSON编辑响应参数'"
      width="832px"
      :visible.sync="jsonEditDialogVisible"
      :close-on-click-modal="false"
    >
      <div div class="dialog-flex">
        <div class="dialog-flex-left">使用方法见<a href="http://lcp.jdl.com/#/apiNewHand/55044" target="_blank">JSON编辑操作指南</a></div>
        <div class="dialog-flex-right"><a @click="copyCodeText()" class="copyCodeText">复制代码</a></div>
      </div>
      <div :id="'jsonEdit_'+ isRequest" class="json-view-container" style="width: 800px; height: 400px;"></div>
      <div slot="footer">
        <el-button @click="jsonEditDialogVisible = false">取消</el-button>
        <el-button type="primary" 
          @click="handleJsonEdit">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import JsfDetail from "@/api/intranet/apiManager/jsfDetail/index.js";
import HttpDetail from "@/api/intranet/apiManager/httpDetail/index.js";
import JsfApiMetaService from "@/api/intranet/gateway/JsfApiMetaService.js";
import JSONEditor from 'jsoneditor';
import 'jsoneditor/dist/jsoneditor.min.css';
import Clipboard from 'clipboard';

export default {
  name: "QuickMaintain",
  props: {
    qualifiedName: {
      type: String,
      default: "",
    },
    methodName: {
      type: String,
      default: "",
    },
    methodId: {
      type: Number,
      default: 0,
    },
    alias: {
      type: String,
      default: "",
    },
    isRequest: {
      type: Boolean,
      default: true,
    },
    handleUpdateParamList: {
      type: Function,
      default: () => {},
    },
    provideWay: {
      type: Number,
      default: 0,
    },
    tableData: {
      type: Array,
      default: () => [],
    }
  },
  data() {
    return {
      // 从JSF注册中心拉取元数据
      pullFromJsfDebounceTimer: null,

      // 导入XML文件
      uploadUrl: `${window.env.gatewayFileBaseApi}lop/mulfile/upload?LOP-DN=${window.env.gatewayUploadLopDnXml}`,
      importXmlDialogVisible: false,
      importXmlFormData: { method: "uploadFile", fileList: [] },
      importXmlFormRules: {
        method: [{ required: true, message: "请选择导入方式" }],
        fileList: [{ type: "array", required: true, message: "请上传XML文件" }],
      },
      importXmlFormList: [
        {
          prop: "method",
          label: "导入方式",
        },
        {
          prop: "fileList",
          label: "导入操作",
        },
      ],
      importXmlDebounceTimer: null,
      importXmlSaveLoading: false,
      // 导入json文件
      importJsonFormData: { method: "uploadFile", fileList: [] },
      importJsonFormRules: {
        method: [{ required: true, message: "请选择导入方式" }],
        fileList: [
          { type: "array", required: true, message: "请上传JSON文件" },
        ],
      },
      importJsonDialogVisible: false,
      // json编辑
      jsonEditDialogVisible: false,
      jsonEditor: undefined,
      jsonEditDebounceTimer: null,
    };
  },
  computed: {
    // 计算快速维护提示文案
    computeQuickMaintainTipText() {
      const hashMap = { true: "请求", false: "响应" };
      return `更新将覆盖原有${hashMap[this.isRequest]}参数，请谨慎操作！`;
    },
  },
  methods: {
    // 根据JSF接口名、JSF别名查询JSF接口在JSF注册中心的状态
    async findApiStatus() {
      const { qualifiedName, methodName, alias } = this;
      if (!qualifiedName || !methodName || !alias) {
        this.$message.error(
          "从JSF注册中心拉取不到元数据，请确认在【基础数据】维护的JSF信息是否正确？"
        );
        throw new Error("qualifiedName or methodName or alias is empty!");
      }
      const jsfAlias = alias;
      const methodList = [methodName];
      const data = [{ qualifiedName, jsfAlias, methodList }];
      return await JsfApiMetaService.findApiStatus(data);
    },
    // 方法列表-编辑文档-快速维护-JSF拉取-根据JSF接口名、方法名、别名拉取元数据
    async quickMaintainApiDocByJsf() {
      const { qualifiedName, methodName, alias } = this;
      const { methodId, isRequest } = this;
      const isRequestHashMap = { true: 1, false: 2 };
      const judgeType = isRequestHashMap[isRequest] || 1;
      const data = [{ qualifiedName, methodName, alias, methodId, judgeType }];
      return await JsfDetail.quickMaintainApiDocByJsf(data);
    },
    // 方法列表-编辑文档-快速维护-JSF拉取-根据JSF接口名、方法名、别名拉取元数据
    async quickMaintainApiDocByXml(jssKey) {
      const { isRequest } = this;
      const isRequestHashMap = { true: 1, false: 2 };
      const type = 2;
      const appId = parseInt(this.$route.params.id);
      const judgeType = isRequestHashMap[isRequest] || 1;
      const data = [{ appId, judgeType, type, jssKey }];
      return await JsfDetail.quickMaintainApiDocByXml(data);
    },

    // 点击快速维护下拉菜单项操作
    handleCommandDropdownItem(command) {
      const commandHashMap = {
        importXml: () => this.handleClickImportXml(),
        importJson: () => this.handleClickImportJson(),
        pullFromJsf: () => this.handleClickPullFromJsf(),
        jsonEdit: () => this.handleClickJsonEdit(),
      };
      commandHashMap[command]();
    },
    // 点击快速维护下拉菜单选择从JSF注册中心拉取元数据操作
    handleClickPullFromJsf() {
      clearTimeout(this.pullFromJsfDebounceTimer);
      this.pullFromJsfDebounceTimer = setTimeout(async () => {
        await this.findApiStatus().catch((error) => {
          const { code } = error;
          code === 10003 &&
            this.$message.error(
              "从JSF注册中心拉取不到元数据，请确认在【基础数据】维护的JSF信息是否正确？"
            );
          throw new Error("handleClickConfirmPullFromJsf findApiStatus");
        });
        const { data } = await this.quickMaintainApiDocByJsf().catch(() => {
          throw new Error(
            "handleClickConfirmPullFromJsf quickMaintainApiDocByJsf"
          );
        });
        const { inParamList = [], outParamList = [] } = data;
        const { isRequest } = this;
        this.handleUpdateParamList(
          isRequest,
          isRequest ? inParamList : outParamList
        );
        this.$message.success("操作成功！");
      }, 300);
    },

    // 点击快速维护下拉菜单选择导入XML文件操作
    handleClickImportXml() {
      this.importXmlDialogVisible = true;
    },
    // 导入XML上传文件改变时，更新文件列表
    handleChangeImportXmlUpload(file, fileList) {
      if (fileList && fileList.length > 0) {
        this.importXmlFormData.fileList = [file];
      }
    },
    // 导入XML上传成功时
    async handleSuccessImportXmlUpload(uploadResponse) {
      const [jssKey] = uploadResponse.fileName;
      const { data } = await this.quickMaintainApiDocByXml(jssKey).catch(() => {
        this.importXmlSaveLoading = false;
        throw new Error(
          "handleSuccessImportXmlUpload quickMaintainApiDocByXml"
        );
      });
      const { inParamList = [], outParamList = [] } = data;
      const { isRequest } = this;
      this.handleUpdateParamList(
        isRequest,
        isRequest ? inParamList : outParamList
      );
      this.importXmlDialogVisible = false;
      this.importXmlSaveLoading = false;
      this.$message.success("操作成功！");
    },
    // 导入XML上传失败时
    handleErrorImportXmlUpload() {
      this.importXmlSaveLoading = false;
      this.importXmlFormData.fileList = [];
      this.$message.error("上传失败，请重新上传");
    },
    // 点击导入XML文件确定按钮
    handleClickConfirmImportXml() {
      clearTimeout(this.importXmlDebounceTimer);
      this.importXmlDebounceTimer = setTimeout(async () => {
        this.importXmlSaveLoading = true;
        await this.$refs.importXmlForm.validate().catch(() => {
          this.importXmlSaveLoading = false;
          throw new Error("handleClickConfirmImportXml validate");
        });
        this.$refs.importXmlFormUpload[0].submit();
      }, 300);
    },
    // 点击快速维护下拉菜单选择导入JSON文件操作
    handleClickImportJson() {
      this.importJsonDialogVisible = true;
    },

    handleJsonExceed() {
      this.$message.warning(
        "当前限制只能选择 1 个文件，请删除已选文件后重新上传"
      );
    },

    handleErrorImportJsonUpload() {
      this.importJsonFormData.fileList = [];
      this.$message.error("上传失败，请重新上传");
    },

    handleBeforeUpload(file) {
      const size = file.size / 1024;
      if (size > 500) {
        this.$message.error("导入失败，文件大小超过500KB");
        return false;
      }
    },
    // 移除上传文件
    handleRemoveImportJsonUpload(file, fileList) {
      this.importJsonFormData.fileList = [];
    },
    // 上传文件成功
    handleSuccessImportJsonUpload(response, file, fileList) {
      this.importJsonFormData.fileList = fileList;
    },

    // 保存JSON导入
    handleSaveImportJson() {
      this.$refs.importJsonForm.validate(async (valid) => {
        if (valid) {
          const jssKey = this.importJsonFormData.fileList[0].name;
          const { data } = await this.quickMaintainApiDocByJson(jssKey).catch(
            () => {
              this.importJsonFormData.fileList = [];
              throw new Error("handleSaveImportJson quickMaintainApiDocByJson");
            }
          );
          const { inParamList = [], outParamList = [] } = data;
          const { isRequest } = this;
          this.handleUpdateParamList(
            isRequest,
            isRequest ? inParamList : outParamList
          );
          this.importJsonDialogVisible = false;
          this.$message.success("导入成功，可继续在页面维护API文档详细信息");
        } else {
          return false;
        }
      });
    },

    // 方法列表-编辑文档-快速维护-JSF拉取-根据JSF接口名、方法名、别名拉取元数据
    async quickMaintainApiDocByJson(jssKey) {
      const { isRequest } = this;
      const isRequestHashMap = { true: 1, false: 2 };
      const type = 2;
      const appId = parseInt(this.$route.params.id);
      const judgeType = isRequestHashMap[isRequest] || 1;
      const data = [{ appId, judgeType, type, jssKey }];
      return await HttpDetail.quickMaintainApiDocByJson(data);
    },
    
    // JSON编辑
    handleClickJsonEdit(){
      this.jsonEditDialogVisible = true;

      clearTimeout(this.jsonEditDebounceTimer);

      this.jsonEditDebounceTimer = setTimeout(() => {
        const container = document.getElementById('jsonEdit_' + this.isRequest);
        const options = {
          mode: 'code',
          search: false,
          enableSort: false,
          enableTransform: false,
          language: 'zh-CN',
          onChange: () => {},
        };
        // console.log('container>>',container)
        if (!this.jsonEditor) {
          this.jsonEditor = new JSONEditor(container, options);
        }
        this.jsonEditor.set(this.tableData);
        
      },300);      
    },

    handleJsonEdit(){
      const { isRequest } = this;
      // console.log('isRequest',isRequest);
      // console.log('this.jsonEditor.get()',this.jsonEditor.get())
      this.handleUpdateParamList(
        isRequest,
        this.jsonEditor.get()
      );
      this.jsonEditDialogVisible = false;
    },

    copyCodeText() {
      let clipboard = new Clipboard('.copyCodeText', {
        text: () => {
          return JSON.stringify(this.jsonEditor.get(), null, 2);
        }
      })
      clipboard.on('success', () => {
        this.$message.success('复制成功！')
        clipboard.destroy()
      })
      clipboard.on('error', () => {
        this.$message.error('复制失败！')
        clipboard.destroy()
      })
    }
  },
};
</script>

<style lang="scss" scoped>
.quick-maintain {
  .quick-maintain__dropdown {
    color: #3c6ef0;
    cursor: pointer;
  }
  .quick-maintain-tip {
    margin-bottom: 8px;
    text-align: center;
    color: #e1251b;
    font-size: 16px;
    font-weight: bolder;
  }
  .import-xml-dialog {
    .import-xml-form {
      .import-xml-form__upload {
        padding: 8px;
        height: 120px;
        background: #f5f5f5;
        border-radius: 4px;
      }
    }
  }
  .import-json-dialog {
    .json-dialog-form {
      .form__upload {
        padding: 12px;
        height: 140px;
        background: #f5f5f5;
        border-radius: 4px;
        .el-upload__tip {
          color: #999999;
        }
      }
    }
  }
  .dialog-flex{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 6px;
    .dialog-flex-left{
      text-align: left;
    }
    .dialog-flex-right{
      text-align: right;
    }
  }
}
</style>