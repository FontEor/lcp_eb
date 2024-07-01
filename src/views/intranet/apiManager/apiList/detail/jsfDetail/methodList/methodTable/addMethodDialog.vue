<template>
  <el-dialog
    custom-class="add-method-dialog"
    title="添加方法"
    width="480px"
    :visible="addMethodDialogVisible"
    :close-on-click-modal="false"
    @close="resetAddMethodForm"
    @update:visible="$emit('update:addMethodDialogVisible', $event)"
  >
    <div class="body__content">
      <!-- 添加方法表单 -->
      <el-form
        v-show="addMethodFormVisible"
        :model="addMethodFormData"
        :rules="addMethodFormRules"
        label-width="100px"
        ref="addMethodForm"
        class="add-method-form"
      >
        <el-form-item label="JSF方法名" prop="name">
          <el-input
            v-model.trim="addMethodFormData.name"
            placeholder="请输入JSF方法名，如：queryDictByBean"
            style="width: 100%"
          ></el-input>
        </el-form-item>
        <el-form-item label="中文名称" prop="cnName">
          <el-input
            v-model.trim="addMethodFormData.cnName"
            placeholder="请输入方法中文名称，如：获取XXXX"
            style="width: 100%"
          ></el-input>
        </el-form-item>
        <el-form-item label="方法描述" prop="remark">
          <el-input
            v-model.trim="addMethodFormData.remark"
            :rows="4"
            type="textarea"
            resize="none"
            placeholder="请输入方法能力、使用场景描述，如：获取XXXX"
            style="width: 100%"
          ></el-input>
        </el-form-item>
      </el-form>

      <div v-show="!addMethodFormVisible" class="add-method-success">
        <i class="el-icon-success add-method-success__icon" />
        <p class="add-method-success__title">添加成功</p>
        <p class="add-method-success__tip">
          您可以点击下方快捷入口，继续添加方法或编辑文档。
        </p>
      </div>
    </div>
    <div slot="footer">
      <div v-show="addMethodFormVisible" class="footer__button-wrapper">
        <el-button @click="$emit('update:addMethodDialogVisible', false)"
          >取 消</el-button
        >
        <el-button
          :loading="confirmAddMethodLoading"
          type="primary"
          @click="handleConfirmAddMethod"
          >确认添加</el-button
        >
      </div>
      <div v-show="!addMethodFormVisible" class="footer__button-wrapper">
        <el-button @click="resetAddMethodForm">继续添加</el-button>
        <el-button type="primary" @click="goToEditDoc">编辑文档</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import jsfDetail from "@/api/intranet/apiManager/jsfDetail/index.js";

export default {
  name: "AddMethodDialog",
  props: {
    qualifiedName: {
      type: String,
      required: true,
    },
    addMethodDialogVisible: {
      type: Boolean,
      required: true,
    },
    handleEditDoc: {
      type: Function,
      required: true,
    },
    reloadTableData: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    return {
      addMethodFormVisible: true,
      addMethodFormData: { name: "", cnName: "", remark: "" },
      addMethodFormRules: {
        name: [{ required: true, message: "请输入JSF方法名" }],
        cnName: [
          { required: true, message: "请输入中文名称" },
          { min: 2, max: 20, message: "长度在 2 到 20 个字符之间" },
        ],
        remark: [
          { required: true, message: "请输入方法描述" },
          { min: 2, max: 255, message: "长度在 2 到 255 个字符之间" },
        ],
      },
      debounceTimer: null,
      confirmAddMethodLoading: false,
      methodId: 0,
    };
  },
  methods: {
    // 方法列表-用户填写表单添加方法
    async addApiMethod() {
      const apiId = this.$route.params.id;
      const { qualifiedName } = this;
      const { name, cnName, remark } = this.addMethodFormData;
      const data = [{ apiId, qualifiedName, name, cnName, remark }];
      return await jsfDetail.addApiMethod(data);
    },

    // 确认添加方法操作，添加成功后得到方法ID
    handleConfirmAddMethod() {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => {
        this.$refs.addMethodForm.validate(async (valid) => {
          if (valid) {
            this.confirmAddMethodLoading = true;
            const { data } = await this.addApiMethod().catch(() => {
              this.confirmAddMethodLoading = false;
              throw new Error("handleConfirmAddMethod addApiMethod");
            });
            this.methodId = data;
            this.addMethodFormVisible = false;
            this.confirmAddMethodLoading = false;
            this.reloadTableData();
            this.$emit("updateStatus");
          } else {
            return false;
          }
        });
      }, 300);
    },
    // 重置添加方法表单
    resetAddMethodForm() {
      this.$refs.addMethodForm.resetFields();
      this.addMethodFormVisible = true;
    },
    // 跳转编辑文档操作
    goToEditDoc() {
      this.$emit("update:addMethodDialogVisible", false);
      this.handleEditDoc(this.methodId);
    },
  },
};
</script>

<style lang="scss" scoped>
.add-method-dialog {
  .add-method-success {
    .add-method-success__icon {
      margin: 16px auto;
      width: 100%;
      text-align: center;
      font-size: 48px;
      color: #26a872;
    }
    .add-method-success__title {
      font-size: 24px;
      text-align: center;
    }
    .add-method-success__tip {
      margin: 8px;
      text-align: center;
    }
  }
}
</style>