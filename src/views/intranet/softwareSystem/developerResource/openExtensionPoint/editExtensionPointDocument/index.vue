<template>
  <div class="edit-extension-point-document">
    <!-- 扩展点文档页头 -->
    <el-page-header
      @back="$emit('update:currentDisplayComponentName', 'ExtensionPointList')"
      :content="'编辑文档 ( ' + methodName + ' )'"
    />

    <!-- 扩展点文档 -->
    <div class="extension-point-document" v-loading.lock="loading">
      <!-- 顶部中文名称与描述 -->
      <el-form
        :model="extensionPointFormData"
        :rules="extensionPointFormRules"
        label-position="left"
        ref="extensionPointForm"
        class="extension-point-form"
      >
        <el-form-item label="中文名称" prop="cnName" label-width="110px">
          <el-input
            v-model.trim="extensionPointFormData.cnName"
            :show-word-limit="true"
            style="width: 360px"
            maxlength="20"
          ></el-input>
        </el-form-item>
        <el-form-item prop="cnName" label-width="110px">
          <span slot="label">
            所属分类&nbsp;<el-tooltip
              content="创建扩展点分类，便于使用方在扩展点文档中根据分类快速找到目标扩展点。"
              placement="top"
              ><i style="color: #3c6ef0" class="el-icon-help"
            /></el-tooltip>
          </span>
          <el-select
            style="width: 360px"
            v-model="extensionPointFormData.productSysGroupId"
            @focus="handleSysOptions"
          >
            <el-option
              v-for="item in sysGroupOptions"
              :key="item.id"
              :label="item.cnName"
              :value="item.id"
            >
            </el-option
          ></el-select>
          <el-button
            class="classification-button"
            type="text"
            @click="handleSpiClassification"
            >管理分类</el-button
          >
        </el-form-item>
        <el-form-item label=" " prop="remark">
          <el-input
            v-model="extensionPointFormData.remark"
            :show-word-limit="true"
            :rows="4"
            resize="none"
            type="textarea"
            maxlength="255"
            style="width: 90%"
          ></el-input>
        </el-form-item>
      </el-form>
      <!--请求参数-->
      <h4 class="document-sub-title">请求参数</h4>
      <ApiTable
        :tableData="
          methodObj.inParamList === null ? new Array() : methodObj.inParamList
        "
        :tableColumnInfo="columnsInParams"
        :editer="!editable"
        :hideEmptyImg="true"
      >
      </ApiTable>
      <!--返回参数-->
      <h4 class="document-sub-title">响应参数</h4>
      <ApiTable
        :tableData="
          methodObj.outParamList == null ? new Array() : methodObj.outParamList
        "
        :tableColumnInfo="columnsOutParams"
        :editer="!editable"
        :hideEmptyImg="true"
      >
      </ApiTable>
      <!--错误码-->
      <h4 class="document-sub-title">错误码</h4>
      <el-form
        :model="errorCodeForm"
        ref="errorCodeFormRef"
        :rules="errorCodeFormRules"
      >
        <ApiTable
          :tableData="errorCodeForm.tableData"
          :tableColumnInfo="columnsErrorCode"
          :editer="!editable"
          :showOperation="true"
          :hideEmptyImg="true"
        >
          <template v-slot:customColumn>
            <el-table-column
              prop="errorCode"
              label="错误码"
              min-width="35%"
              :show-tooltip-when-overflow="!editable"
              style="margin: 0px; padding: 0px"
            >
              <template slot-scope="scope">
                <span v-if="!editable">{{ scope.row.errorCode }}</span>
                <el-form-item
                  v-else
                  :prop="'tableData.' + scope.$index + '.errorCode'"
                  :rules="errorCodeFormRules.errorCode"
                >
                  <el-input
                    maxlength="200"
                    v-model.trim="scope.row.errorCode"
                    v-if="editable"
                    placeholder="错误码"
                  ></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              prop="errorMsg"
              label="错误消息"
              min-width="60%"
              :show-tooltip-when-overflow="!editable"
              style="margin: 0px; padding: 0px"
            >
              <template slot-scope="scope">
                <span v-if="!editable">{{ scope.row.errorMsg }}</span>
                <el-form-item
                  v-else
                  :prop="'tableData.' + scope.$index + '.errorMsg'"
                  :rules="errorCodeFormRules.errorMsg"
                >
                  <el-input
                    maxlength="255"
                    type="text"
                    v-model.trim="scope.row.errorMsg"
                    v-if="editable"
                    placeholder="错误消息，长度在 2 到 255 个字符"
                  ></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column min-width="6%" v-if="editable">
              <template slot-scope="scope">
                <el-form-item>
                  <a
                    class="link2"
                    href="javascript:;"
                    @click="deleteRow(scope.$index, errorCodeForm.tableData)"
                    ><i class="el-icon-delete"></i
                  ></a>
                </el-form-item>
              </template>
            </el-table-column>
          </template>
        </ApiTable>
      </el-form>
      <el-row v-if="editable" class="add-row">
        <a href="javascript:;" @click="insertRow()"
          ><i class="el-icon-plus"></i>
          <span style="color: #3c6ef0">添加</span></a
        >
      </el-row>

      <StickyWrapper>
        <div class="button-wrapper">
          <el-button type="primary" :loading="saveLoading" @click="handleSave"
            >保存</el-button
          >
        </div>
      </StickyWrapper>
      <!-- 管理分类对话框 -->
      <ClassificationDialog
        :showClassificationDialog.sync="showClassificationDialog"
        :tableData.sync="spiTableData"
        :productCode.sync="productCode"
        :queryTableList="queryTableList"
      />
    </div>
  </div>
</template>

<script>
import StickyWrapper from "@/components/StickyWrapper.vue";
import ApiTable from "@/views/intranet/softwareSystem/developerResource/openExtensionPoint/editExtensionPointDocument/apiTable.vue";
import openExtensionPoint from "@/api/intranet/softwareSystem/developerResource/openExtensionPoint.js";
import ClassificationDialog from "@/views/intranet/softwareSystem/developerResource/openExtensionPoint/editExtensionPointDocument/classificationDialog.vue";
import developerResource from "@/api/intranet/softwareSystem/developerResource/index.js";

export default {
  name: "EditExtensionPointDocument",
  components: { StickyWrapper, ApiTable, ClassificationDialog },
  props: {
    productCode: {
      type: String,
      required: true,
    },
    extensionPointId: {
      type: Number,
      required: true,
    },
    methodName: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      loading: true,
      editable: true,
      // 扩展点文档顶部
      extensionPointFormData: { cnName: "", remark: "", productSysGroupId: null },
      showClassificationDialog: false,
      extensionPointFormRules: {
        cnName: [
          { required: true, message: "扩展点中文名称不能为空" },
          {
            min: 2,
            max: 255,
            message: "长度在 2 到 20 个字符",
          },
        ],
        remark: [
          { required: true, message: "扩展点描述不能为空" },
          {
            min: 2,
            max: 255,
            message: "长度在 2 到 255 个字符",
          },
        ],
      },
      methodObj: {}, //方法对象
      oldMethodObj: {}, //老的方法对象
      errorCodeForm: {
        //错误的form对象
        tableData: [],
        oldTableData: [],
      },
      errorCodeFormRules: {
        //错误的form提示
        errorCode: [
          { required: true, message: "请输入错误码" },
          {
            min: 1,
            max: 200,
            message: "长度在 1 到 200 个字符",
          },
        ],
        errorMsg: [
          { required: true, message: "请输入错误消息" },
          {
            min: 2,
            max: 255,
            message: "长度在 2 到 255 个字符",
          },
        ],
      },
      columnsErrorCode: [
        //错误列
        {
          prop: "errorCode",
          label: "错误码",
          modify: true,
          min_width: "35%",
        },
        {
          prop: "errorMsg",
          label: "错误消息",
          modify: true,
          min_width: "60%",
        },
      ],
      columnsInParams: [
        //参数列
        {
          prop: "name",
          label: "名称",
          min_width: "30%",
        },
        {
          prop: "oldtype",
          label: "类型",
          min_width: "30%",
        },
        {
          prop: "required",
          label: "是否必填",
          min_width: "21%",
          modify: true,
          type: "select",
        },
        {
          prop: "exampleValue",
          label: "示例",
          min_width: "20%",
          modify: true,
          type: "input",
        },
        {
          prop: "remark",
          label: "描述",
          min_width: "25%",
          modify: true,
          type: "textarea",
        },
      ],
      columnsOutParams: [
        //参数列
        {
          prop: "name",
          label: "名称",
          min_width: "30%",
        },
        {
          prop: "oldtype",
          label: "类型",
          min_width: "30%",
        },
        {
          prop: "exampleValue",
          label: "示例",
          min_width: "20%",
          modify: true,
          type: "input",
        },
        {
          prop: "remark",
          label: "描述",
          min_width: "25%",
          modify: true,
          type: "textarea",
        },
      ],
      saveLoading: false,
      sysGroupOptions: [],
      spiTableData: [],
    };
  },
  methods: {
    // 软件系统详情-开发者资源-开放接口-查看扩展点文档
    async getDoc() {
      const { extensionPointId } = this;
      const id = extensionPointId;
      const params = { id };
      return await openExtensionPoint.getDoc(params).catch((error) => {
        const { message } = error.data;
        message && this.$message.error(message);
        throw new Error("getDoc");
      });
    },
    // 软件系统详情-开发者资源-开放接口-更新扩展点文档
    async editDoc() {
      const { productCode, extensionPointId } = this;
      const id = extensionPointId;
      const { cnName, remark, productSysGroupId } = this.extensionPointFormData;
      const {
        inParamList = [],
        outParamList = [],
        errorCodeList = [],
      } = this.methodObj;
      const data = {
        productCode,
        id,
        cnName,
        remark,
        inParamList,
        outParamList,
        errorCodeList,
        productSysGroupId,
      };
      return await openExtensionPoint.editDoc(data).catch((error) => {
        const { message } = error.data;
        message && this.$message.error(message);
        throw new Error("editDoc");
      });
    },

    deleteRow(index, rows) {
      rows.splice(index, 1);
    },
    insertRow() {
      this.errorCodeForm.tableData.push({
        errorCode: "",
        errorMsg: "",
        objId: this.methodObj.id,
      });
    },
    // 保存
    handleSave() {
      this.methodObj.errorCodeList = JSON.parse(
        JSON.stringify(this.errorCodeForm.tableData)
      );
      this.methodObj.cnName = this.extensionPointFormData.cnName;
      this.methodObj.remark = this.extensionPointFormData.remark;
      this.methodObj.productSysGroupId =
        this.extensionPointFormData.productSysGroupId;
      let extensionPointFormValid = false;
      this.$refs["extensionPointForm"].validate((valid) => {
        if (valid) {
          extensionPointFormValid = true;
        } else {
          return false;
        }
      });

      this.$refs["errorCodeFormRef"].validate(async (valid) => {
        if (valid) {
          if (extensionPointFormValid) {
            this.saveLoading = true;
            await this.editDoc().catch(() => {
              this.saveLoading = false;
              throw new Error("handleSave");
            });
            this.$message.success("保存成功！");
            this.saveLoading = false;
            await this.reloadDocument();
            this.$emit("updateStatus");
            this.$emit(
              "update:currentDisplayComponentName",
              "ExtensionPointList"
            );
          } else {
            return false;
          }
        } else {
          return false;
        }
      });
    },
    // 加载扩展点文档数据
    async reloadDocument() {
      this.loading = true;
      const response = await this.getDoc().catch(() => {
        throw new Error("reloadDocument");
      });
      const { data } = response.data;
      this.oldMethodObj = {};
      this.methodObj = data;
      if (this.methodObj.inParamList && this.methodObj.inParamList.length > 0) {
        this.setSelectVal(this.methodObj.inParamList);
      }
      if (
        this.methodObj.outParamList &&
        this.methodObj.inParamList.length > 0
      ) {
        this.setSelectVal(this.methodObj.outParamList);
      }
      this.oldMethodObj = this.copyDeep(this.methodObj);
      this.extensionPointFormData.cnName = this.methodObj.cnName;
      this.extensionPointFormData.remark = this.methodObj.remark;
      this.extensionPointFormData.productSysGroupId =
        this.methodObj.productSysGroupId;
      this.initErrorCodeData();
      this.loading = false;
    },
    /**
     * 初始化错误码数据
     */
    initErrorCodeData() {
      this.errorCodeForm.oldTableData = [];
      if (this.methodObj.errorCodeList) {
        this.errorCodeForm.tableData = this.methodObj.errorCodeList;
        this.errorCodeForm.oldTableData = this.copyDeep(
          this.errorCodeForm.tableData
        );
      } else {
        this.errorCodeForm.tableData = [];
      }
    },
    copyDeep(templateData) {
      return JSON.parse(JSON.stringify(templateData));
    },
    /**
     * 设置默认值
     */
    setSelectVal(params) {
      if (params) {
        for (let param in params) {
          let paramObj = params[param];
          if (paramObj.required === "") {
            paramObj.required = 1;
          }
          paramObj.oldtype = this.setTypeValue(paramObj.type);
          if (paramObj.children) {
            this.setSelectVal(paramObj.children);
          }
        }
      }
    },
    setTypeValueDeep(params) {
      if (params) {
        for (let param in params) {
          let paramObj = params[param];
          paramObj.oldtype = this.setTypeValue(paramObj.type);
          if (paramObj.children) {
            this.setSelectVal(paramObj.children);
          }
        }
      }
    },
    setTypeValue(typeVal) {
      if (!typeVal) {
        return "";
      } else {
        if (typeVal === "") {
          return "";
        }
        let aryTypeVal = typeVal.split(".");
        let ret = "";
        for (let i = 0; i < aryTypeVal.length; i++) {
          if (i === aryTypeVal.length - 1) {
            ret = ret + aryTypeVal[i];
            break;
          }
          if (aryTypeVal[i].indexOf("<") !== -1) {
            ret =
              ret + aryTypeVal[i].substring(0, aryTypeVal[i].indexOf("<") + 1);
          }
          if (aryTypeVal[i].indexOf(",") !== -1) {
            ret =
              ret + aryTypeVal[i].substring(0, aryTypeVal[i].indexOf(",") + 1);
          }
          if (aryTypeVal[i].indexOf(">") !== -1) {
            ret = ret + aryTypeVal[i];
          }
        }
        return ret;
      }
    },

    // 点击管理分类按钮
    async handleSpiClassification() {
      await this.queryTableList();
      this.showClassificationDialog = true;
    },

    // 获取所属分类下拉框数据
    async handleSysOptions() {
      const response = await this.queryGroupList();
      this.sysGroupOptions = response.data.data;
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
  created() {
    this.reloadDocument();
    this.handleSysOptions()
  },
  destroyed() {
    this.$emit("update:extensionPointId", null);
  },
};
</script>

<style lang="scss" scoped>
.edit-extension-point-document {
  .extension-point-form {
    margin-top: 16px;
    ::v-deep .el-form-item__label {
      font-weight: 700;
    }
    .classification-button {
      margin-left: 16px;
    }
  }

  .document-sub-title {
    position: relative;
    margin-bottom: 20px;
    padding-left: 12px;
    font-size: 16px;
    color: #333333;
    line-height: 20px;
    &:before {
      position: absolute;
      top: 50%;
      left: 0;
      transform: translateY(-50%);
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background: #3c6ef0;
      content: "";
    }
  }
  ::v-deep .el-table::before {
    z-index: auto;
  }

  /*
 * Api-document-edit
 */
  .relative {
    position: relative;
  }

  .opr-row {
    position: absolute;
    top: 0;
    right: 0;
  }

  .input-title {
    display: inline-block;
    width: auto;

    .el-input__inner {
      width: 360px;
      font-size: 20px;
      color: #333333;
      line-height: 32px;
    }
  }

  .document-title {
    .txtP {
      font-size: 14px;
      color: #666666;
      line-height: 32px;
    }
  }

  .add-row {
    a {
      display: block;
      height: 32px;
      padding: 0;
      background: #f5f5f5;
      border: 1px dashed #d9d9d9;
      border-radius: 4px;
      font-size: 14px;
      color: #666;
      line-height: 30px;
      text-align: center;
      cursor: pointer;
    }

    &:hover a {
      color: #3c6ef0;
    }
  }

  .link2 {
    color: #666;

    &:hover {
      color: #3c6ef0;
    }
  }
}
</style>