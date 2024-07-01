<template>
  <el-dialog
    :visible="createGroupDialogVisible"
    :close-on-click-modal="false"
    title="创建分组"
    width="560px"
    class="create-group-dialog"
    @close="dialogBeforeClose"
  >
    <el-form
      :model="groupFormData"
      :rules="groupFormRules"
      ref="groupFormData"
      class="create-group-dialog__form"
    >
      <el-form-item label-width="140px" prop="code">
        <span slot="label">
          分组英文名称&nbsp;<el-tooltip
            class="item"
            content="分组的英文编码，调用API时需要在LOP-DN字段中传。"
            placement="top"
            ><i style="color: #3c6ef0" class="el-icon-help"
          /></el-tooltip>
        </span>
        <el-input
          v-model.trim="groupFormData.code"
          placeholder="请输入分组编码"
        ></el-input>
      </el-form-item>
      <el-form-item label-width="140px" prop="cnName">
        <span slot="label">
          分组中文名称&nbsp;<el-tooltip
            class="item"
            content="分组的中文名称，如：技术开放平台产品组的分组。"
            placement="top"
            ><i style="color: #3c6ef0" class="el-icon-help"
          /></el-tooltip>
        </span>
        <el-input
          v-model.trim="groupFormData.cnName"
          placeholder="请输入分组中文名称"
        ></el-input>
      </el-form-item>
      <el-form-item label-width="140px" prop="intr">
        <span slot="label">
          分组描述&nbsp;<el-tooltip
            class="item"
            content="具体描述分组下一类API的应用场景，如：基础平台组为云仓物控平台项目提供的API组，调用方设备为PC端，账号体系为passport。"
            placement="top"
            ><i style="color: #3c6ef0" class="el-icon-help"
          /></el-tooltip>
        </span>
        <el-input
          type="textarea"
          v-model.trim="groupFormData.intr"
          placeholder="请输入分组使用场景的描述"
        ></el-input>
      </el-form-item>
      <el-form-item label-width="140px" prop="serviceType">
        <span slot="label">
          发布范围&nbsp;<el-tooltip
            class="item"
            content="发布到内网，仅内网可用。发布到公网，内网、公网均可用"
            placement="top"
            ><i style="color: #3c6ef0" class="el-icon-help"
          /></el-tooltip>
        </span>
        <el-radio v-model="groupFormData.serviceType" :label="1"
          >发布到内网</el-radio
        >
        <el-radio v-model="groupFormData.serviceType" :label="2"
          >发布到公网</el-radio
        >
      </el-form-item>
    </el-form>

    <div slot="footer">
      <el-button @click="$emit('update:createGroupDialogVisible', false)"
        >取 消</el-button
      >
      <el-button type="primary" :loading="handleSaveLoading" @click="handleSave"
        >确认创建</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
import apiManager from "@/api/intranet/apiManager/index.js";

export default {
  name: "CreateGroupDialog",
  props: {
    createGroupDialogVisible: {
      type: Boolean,
      required: true,
    },
    type: {
      type: Number,
      required: true,
    },
    getDomain: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      groupFormData: {
        code: "",
        cnName: "",
        intr: "",
        serviceType: 1,
      },
      groupFormRules: {
        code: [
          { required: true, message: "分组英文名称不能为空" },
          { min: 2, max: 30, message: "请输入2-30个字符" },
          { pattern: /^[A-Za-z_]*$/, message: "请输入英文字母、_" },
        ],
        cnName: [{ required: true, message: "分组中文名称不能为空" }],
        intr: [{ required: true, message: "分组描述不能为空" }],
        serviceType: [{ required: true, message: "发布范围不能为空" }],
      },
      handleSaveLoading: false,
    };
  },
  methods: {
    async saveCloudDomain() {
      const { code, cnName, intr, serviceType } = this.groupFormData;
      const type = this.type; // 服务类型 1:JSF服务 2:HTTP服务 3:HTTP流
      const data = [
        {
          code: code,
          name: cnName,
          description: intr,
          serviceType: serviceType,
          type: type,
          sceneType: 3,
        },
      ];
      return await apiManager.saveCloudDomain(data).catch((error) => {
        const { message } = error.data;
        message && this.$message.error(message);
        throw new Error(error);
      });
    },

    dialogBeforeClose() {
      this.$refs["groupFormData"].resetFields();
      this.$emit("update:createGroupDialogVisible", false);
    },
    handleSave() {
      this.$refs["groupFormData"].validate(async (valid) => {
        if (valid) {
          this.handleSaveLoading = true;
          const response = await this.saveCloudDomain().catch((error) => {
            this.handleSaveLoading = false;
            const { message } = error.data;
            message && this.$message.error(message);
            throw new Error(error);
          });
          const { code, id, name } = response.data;
          const domain = {
            domainCode: code,
            domainId: id,
            domainName: name,
          };
          this.$message.success("创建分组成功");
          this.$emit("update:createGroupDialogVisible", false);
          this.$emit("update:getDomain", domain);
          this.handleSaveLoading = false;
        } else {
          return false;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.create-group-dialog {
  .create-group-dialog__form {
    width: 480px;
    margin: 0 auto;
  }
}
</style>
