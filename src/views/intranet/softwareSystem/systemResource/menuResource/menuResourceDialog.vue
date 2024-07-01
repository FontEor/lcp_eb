<template>
  <!-- 添加和编辑资源对话框 -->
  <el-dialog
    class="menu-resource-dialog"
    width="720px"
    :visible.sync="dialogVisible"
    :title="computeMenuResourceDialogTitle"
    :close-on-click-modal="false"
    :destroy-on-close="true"
    @open="openDialog"
    @close="closeDialog"
  >
    <div class="content-wrapper">
      <p class="menu-resource-dialog__subtitle">仔细填写并核对信息</p>
      <el-form ref="form" :model="formData" label-width="auto">
        <!-- 固定字段 -->
        <el-form-item
          v-for="(item, index) in formList"
          :key="index"
          :label="item.label"
          :prop="item.prop"
          :rules="rules[item.prop]"
        >
          <el-select
            v-if="item.prop === 'resourceType'"
            v-model="formData[item.prop]"
            style="width: 100%"
            :placeholder="item.placeholder"
          >
            <el-option
              v-for="optionItem in optionList"
              :key="optionItem.value"
              :label="optionItem.label"
              :value="optionItem.value"
            >
            </el-option>
          </el-select>
          <el-input
            v-else
            v-model="formData[item.prop]"
            style="width: 100%"
            :placeholder="item.placeholder"
            :disabled="editable && item.prop === 'resourceCode'"
          ></el-input>
        </el-form-item>

        <!-- 扩展字段 -->
        <el-form-item
          v-for="(item, index) in extensionFieldList"
          :key="item.key"
          :label="item.key"
          :prop="`ext${index + 1}`"
          :rules="
            item.required
              ? [{ required: true, message: `请输入${item.key}` }]
              : null
          "
        >
          <el-select
            v-if="item.enumValue"
            v-model="formData[`ext${index + 1}`]"
            style="width: 100%"
          >
            <template v-if="item.enumValue.indexOf(',') > -1">
              <el-option
                v-for="(
                  extensionFieldOptionItem, extensionFieldOptionIndex
                ) in item.enumValue.split(',')"
                :key="extensionFieldOptionIndex"
                :label="extensionFieldOptionItem.split(':')[0]"
                :value="extensionFieldOptionItem.split(':')[1]"
              >
              </el-option>
            </template>
            <template v-else>
              <el-option
                :label="item.enumValue.split(':')[0]"
                :value="item.enumValue.split(':')[1]"
              >
              </el-option>
            </template>
          </el-select>
          <el-input
            v-else
            v-model="formData[`ext${index + 1}`]"
            style="width: 100%"
          ></el-input>
        </el-form-item>

        <!-- 固定字段-备注 -->
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="formData.remark"
            placeholder="请输入备注内容"
            type="textarea"
            :rows="1"
          ></el-input>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="submitResourceData">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import menuResource from "@/api/intranet/softwareSystem/systemResource/menuResource.js";
import regExp from "@/constants/regExp.js";

export default {
  name: "MenuResourceDialog",
  props: {
    category: {
      type: String,
      required: true,
    },
    menuResourceDialogVisible: {
      type: Boolean,
      required: true,
    },
    editable: {
      type: Boolean,
      required: true,
    },
    menuResourceFormData: {
      type: Object,
      required: true,
    },
    // 查询系统资源扩展字段配置
    queryConfig: {
      type: Function,
      required: true,
    },
    extensionFieldList: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      dialogVisible: false,
      formData: {
        resourceCode: "",
        resourceName: "",
        resourceType: null,
        resourceUrl: "",
        icon: "",
        remark: "",
      },
      rules: {
        resourceCode: [
          { required: true, message: "请输入资源编码" },
          { max: 50, message: "资源编码最大长度为50个字符" },
          { pattern: regExp.normal, message: "资源编码不可输入特殊字符" },
        ],
        resourceName: [
          { required: true, message: "请输入资源名称" },
          { max: 30, message: "资源名称最大长度为30个字符" },
        ],
        resourceType: [{ required: true, message: "请选择类型" }],
        resourceUrl: [{ max: 400, message: "URL最大长度为400个字符" }],
        icon: [{ max: 400, message: "ICON最大长度为400个字符" }],
        remark: [{ max: 120, message: "备注最大长度为120个字符" }],
      },
      formList: [
        {
          label: "资源编码",
          prop: "resourceCode",
          placeholder: "请输入资源编码",
        },
        {
          label: "资源名称",
          prop: "resourceName",
          placeholder: "请输入资源名称",
        },
        { label: "类型", prop: "resourceType", placeholder: "请选择类型" },
        {
          label: "URL",
          prop: "resourceUrl",
          placeholder: "请输入资源对应的URL",
        },
        { label: "ICON", prop: "icon", placeholder: "请输入ICON的链接" },
      ],
      optionList: [
        { label: "菜单", value: 0 },
        { label: "按钮", value: 1 },
        { label: "其它", value: 2 },
      ],
      extensionFieldFormData: {},
    };
  },
  computed: {
    computeMenuResourceDialogTitle() {
      return this.editable ? "编辑子资源" : "添加子资源";
    },
  },
  watch: {
    menuResourceDialogVisible: {
      handler(newValue) {
        this.dialogVisible = newValue;
      },
    },
    menuResourceFormData: {
      handler(newValue) {
        this.formData = newValue;
      },
    },
  },
  methods: {
    // 创建资源子节点
    async createNode() {
      const { category } = this;
      const parentId = this.formData.id;
      const {
        lopResourceId,
        resourceCode,
        resourceName,
        resourceType,
        resourceUrl,
        icon,
        remark,
      } = this.formData;
      // 处理扩展字段JSON字符串
      let extendedField;
      Object.keys(this.formData).forEach((item) => {
        if (item.indexOf("ext") > -1) {
          if (!extendedField) {
            extendedField = {};
          }
          extendedField[
            this.extensionFieldList[parseInt(item.replace("ext", "")) - 1].key
          ] = this.formData[item];
        }
      });
      if (extendedField) {
        extendedField = JSON.stringify(extendedField);
      }
      const data = {
        category,
        parentId,
        lopResourceId,
        resourceCode,
        resourceName,
        resourceType,
        resourceUrl,
        icon,
        extendedField,
        remark,
      };
      return await menuResource.createNode(data).catch((error) => {
        const { message } = error.data;
        message && this.$message.error(message);
        throw new Error("createNode");
      });
    },
    // 修改资源子节点
    async updateNode() {
      const { category } = this;
      const {
        id,
        lopResourceId,
        resourceName,
        resourceType,
        resourceUrl,
        icon,
        remark,
      } = this.formData;
      // 处理扩展字段JSON字符串
      let extendedField;
      Object.keys(this.formData).forEach((item) => {
        if (item.indexOf("ext") > -1) {
          if (!extendedField) {
            extendedField = {};
          }
          extendedField[
            this.extensionFieldList[parseInt(item.replace("ext", "")) - 1].key
          ] = this.formData[item];
        }
      });
      if (extendedField) {
        extendedField = JSON.stringify(extendedField);
      }
      const data = {
        category,
        id,
        lopResourceId,
        resourceName,
        resourceType,
        resourceUrl,
        icon,
        extendedField,
        remark,
      };
      return await menuResource.updateNode(data).catch((error) => {
        const { message } = error.data;
        message && this.$message.error(message);
        throw new Error("updateNode");
      });
    },

    // 打开对话框时，获取扩展字段
    async openDialog() {
      const response = await this.queryConfig();
      const { data } = response.data;
      this.$emit("update:extensionFieldList", data);
    },
    // 关闭对话框时，还原表格数据
    closeDialog() {
      this.$refs.form.resetFields();
      this.$emit("update:menuResourceFormData", {
        resourceCode: "",
        resourceName: "",
        resourceType: null,
        resourceUrl: "",
        icon: "",
        remark: "",
      });
      this.$emit("update:menuResourceDialogVisible", false);
    },
    // 提交资源操作
    submitResourceData() {
      this.$refs["form"].validate(async (valid) => {
        if (valid) {
          this.editable ? await this.updateNode() : await this.createNode();
          this.$message.success(`${this.computeMenuResourceDialogTitle}成功！`);
          this.dialogVisible = false;
          this.$emit("update:afterSubmitResourceData");
        } else {
          return false;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.menu-resource-dialog {
  .content-wrapper {
    max-height: 50vh;
    overflow: auto;
    .menu-resource-dialog__subtitle {
      margin-bottom: 8px;
      text-align: center;
      font-weight: 600;
    }
    .el-form {
      width: 400px;
      margin: 0 auto;
      .el-select {
        width: 100%;
      }
    }
  }
}
</style>