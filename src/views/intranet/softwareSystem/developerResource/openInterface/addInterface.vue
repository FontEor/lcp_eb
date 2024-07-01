<template>
  <div class="add-interface">
    <!-- 添加接口页头 -->
    <el-page-header @back="$emit('update:addable', false)" content="添加接口" />

    <!-- 步骤条 -->
    <Steps :active="active" :titleList="titleList" />

    <!-- 选择接口表单 -->
    <div v-show="active === 0" class="select-interface-form-wrapper">
      <p class="form-title">从API仓库选择接口</p>
      <p class="form-tip">
        从API仓库中选择软件系统的相关接口，这些接口将在前台-软件系统对应的API文档中展示。
      </p>
      <el-form
        :model="selectInterfaceFormData"
        :rules="selectInterfaceFormRules"
        label-width="80px"
        ref="selectInterfaceForm"
        class="select-interface-form"
      >
        <!-- API -->
        <el-form-item label="API" prop="interfaceName">
          <el-select
            v-model="selectInterfaceFormData.interfaceName"
            :filterable="true"
            :remote="true"
            :remote-method="remoteMethodInterfaceName"
            :loading="selectInterfaceNameLoading"
            placeholder="请输入API中文或英文名称"
            style="width: 70%"
            @change="changeSelectInterfaceName"
          >
            <el-option
              v-for="interfaceNameItem in interfaceNameOptionList"
              :key="interfaceNameItem.apiName"
              :label="interfaceNameItem.apiName"
              :value="interfaceNameItem.apiName"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <!-- Method -->
        <el-form-item label="Method" prop="methodName">
          <el-select
            v-model="selectInterfaceFormData.methodName"
            :filterable="true"
            :loading="selectMethodNameLoading"
            placeholder="请输入Method英文名称"
            style="width: 70%"
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
        <el-form-item label="所属分类" prop="productSysGroupId">
          <el-select
            v-model="selectInterfaceFormData.productSysGroupId"
            :loading="selectProductSysGroupIdLoading"
            placeholder="请选择API所属分组"
            style="width: 70%"
          >
            <el-option
              v-for="groupItem in groupOptionList"
              :key="groupItem.id"
              :label="groupItem.cnName"
              :value="groupItem.id"
            >
            </el-option>
          </el-select>
          <el-button
            type="text"
            icon="el-icon-plus"
            style="margin-left: 8px"
            @click="dialogVisible = true"
            >新增分类</el-button
          >
        </el-form-item>
      </el-form>

      <!-- 新增分类对话框 -->
      <el-dialog
        :visible.sync="dialogVisible"
        :close-on-click-modal="false"
        title="新增分类"
        width="480px"
        @close="closeDialog"
      >
        <div class="dialog-content">
          <el-form
            :model="createCategoryFormData"
            :rules="createCategoryFormRules"
            label-width="120px"
            ref="createCategoryForm"
            class="create-category-form"
          >
            <el-form-item label="分类中文名称" prop="cnName">
              <el-input
                v-model.trim="createCategoryFormData.cnName"
                placeholder="请输入分类中文名称，长度不超过20个字符"
              ></el-input>
            </el-form-item>
            <el-form-item label="分类英文名称" prop="enName">
              <el-input
                v-model.trim="createCategoryFormData.enName"
                placeholder="请输入分类英文名称，长度不超过20个字符"
              ></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div slot="footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleConfirmCreateCategory"
            >确 定</el-button
          >
        </div>
      </el-dialog>
    </div>

    <!-- 完成 -->
    <template v-if="active === 1">
      <div class="finish-wrapper">
        <i class="el-icon-success" />
        <p class="finish-title">添加成功</p>
        <p class="finish-tip">您可继续添加接口</p>
      </div>
    </template>

    <!-- 按钮 -->
    <div class="button-wrapper">
      <el-button
        v-if="active === 0"
        type="primary"
        @click="handleConfirmAddInterface"
        >确认添加</el-button
      >
      <div v-else-if="active === 1" class="button-wrapper__inner">
        <el-button @click="$emit('update:addable', false)"
          >返回接口列表</el-button
        >
        <el-button type="primary" @click="active = 0">继续添加接口</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import Steps from "@/components/Steps.vue";
import openInterface from "@/api/intranet/softwareSystem/developerResource/openInterface.js";
import developerResource from "@/api/intranet/softwareSystem/developerResource/index.js";
import regExp from "@/constants/regExp.js";

export default {
  name: "AddInterface",
  components: { Steps },
  props: {
    addable: {
      type: Boolean,
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
      titleList: ["选择接口", "完成"],
      // 选择接口表单
      selectInterfaceFormData: {
        interfaceName: "",
        methodName: "",
        productSysGroupId: null,
      },
      selectInterfaceFormRules: {
        interfaceName: [{ required: true, message: "请输入API中文或英文名称" }],
        methodName: [{ required: true, message: "请输入Method英文名称" }],
        productSysGroupId: [{ required: true, message: "请选择API所属分组" }],
      },
      interfaceNameOptionList: [],
      selectInterfaceNameLoading: false,
      methodOptionList: [],
      selectMethodNameLoading: false,
      groupOptionList: [],
      selectProductSysGroupIdLoading: false,
      // 新增分类对话框
      dialogVisible: false,
      createCategoryFormData: {
        cnName: "",
        enName: "",
      },
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
    };
  },
  watch: {
    active: {
      async handler(newValue) {
        if (newValue === 0) {
          await this.reloadGroupList().catch(() => {
            throw new Error("watch active");
          });
        }
      },
      immediate: true,
    },
  },
  methods: {
    // 获取API仓库接口
    async apiRepositories(keyWords) {
      const data = { keyWords };
      return await openInterface.apiRepositories(data).catch((error) => {
        const { message } = error.data;
        message && this.$message.error(message);
        throw new Error("apiRepositories");
      });
    },
    // 接口分类保存
    async groupSave() {
      const { productCode, type } = this;
      const { cnName, enName } = this.createCategoryFormData;
      const data = { productCode, type, cnName, enName };
      return await developerResource.save(data).catch((error) => {
        const { message } = error.data;
        message && this.$message.error(message);
        throw new Error("groupSave");
      });
    },
    // 添加开放api接口
    async add() {
      const { productCode } = this;
      const { interfaceName, methodName, productSysGroupId } =
        this.selectInterfaceFormData;
      const data = {
        productCode,
        interfaceName,
        methodName,
        productSysGroupId,
      };
      return await openInterface.add(data).catch((error) => {
        const { message } = error.data;
        message && this.$message.error(message);
        throw new Error("add");
      });
    },

    // 选择API远程搜索
    async remoteMethodInterfaceName(query) {
      if (query !== "") {
        this.selectInterfaceNameLoading = true;
        const response = await this.apiRepositories(query).catch(() => {
          throw new Error("remoteMethodInterfaceName");
        });
        const { data } = response.data;
        this.interfaceNameOptionList = data;
        this.selectInterfaceNameLoading = false;
      } else {
        this.interfaceNameOptionList = [];
      }
    },
    // 改变API选择框选中值时，为methodOptionList选项赋值并清空Method选中值
    changeSelectInterfaceName(value) {
      this.$refs.selectInterfaceForm.$children[1].resetField();
      this.selectMethodNameLoading = true;
      this.interfaceNameOptionList.some((item) => {
        const { apiName, methodNameList } = item;
        if (apiName === value) {
          this.methodOptionList = methodNameList;
          return true;
        } else {
          this.methodOptionList = [];
        }
      });
      this.selectMethodNameLoading = false;
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
    // 确认添加接口操作
    handleConfirmAddInterface() {
      this.$refs.selectInterfaceForm.validate(async (valid) => {
        if (valid) {
          await this.add().catch(() => {
            throw new Error("handleConfirmAddInterface");
          });
          this.$refs.selectInterfaceForm.resetFields();
          this.active = 1;
          this.$emit("updateStatus");
        } else {
          return false;
        }
      });
    },

    // 确认新增分类操作
    handleConfirmCreateCategory() {
      this.$refs.createCategoryForm.validate(async (valid) => {
        if (valid) {
          await this.groupSave().catch(() => {
            throw new Error("handleConfirmCreateCategory");
          });
          this.reloadGroupList();
          this.dialogVisible = false;
        } else {
          return false;
        }
      });
    },
    // 关闭对话框时清空新增分类表单
    closeDialog() {
      this.$refs.createCategoryForm.resetFields();
    },
  },
};
</script>

<style lang="scss" scoped>
.add-interface {
  // 选择接口表单
  .select-interface-form-wrapper {
    margin: 0 auto;
    width: 640px;
    .form-title {
      text-align: center;
      font-size: 18px;
      font-weight: bold;
    }
    .form-tip {
      margin: 16px;
      text-align: center;
    }
    .select-interface-form {
      margin: 0 auto;
      width: 480px;
    }
    .dialog-content {
      max-height: 50vh;
    }
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