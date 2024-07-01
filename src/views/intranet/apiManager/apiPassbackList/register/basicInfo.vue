<template>
  <div class="basic-info">
    <div class="basic-info__step-form">
      <el-form
        class="pass-back-form"
        ref="passBackForm"
        label-width="90px"
        :model="passBackFormData"
        :rules="passBackFormRules"
      >
        <el-form-item prop="name" label="中文名称">
          <el-input
            v-model.trim="passBackFormData.name"
            maxlength="30"
            show-word-limit
            placeholder="输入API中文名称"
            style="width: 80%"
          ></el-input>
        </el-form-item>
        <el-form-item prop="app" label="所属应用">
          <el-select
            v-model="passBackFormData.app"
            value-key="appId"
            placeholder="选择API所属应用"
            style="width: 80%"
            :filterable="true"
          >
            <el-option
              v-for="item in appOptionList"
              :key="item.appId"
              :label="item.appName"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="domain" label="所属分组">
          <div class="content__domain">
            <el-select
              v-model="passBackFormData.domain"
              value-key="domainId"
              placeholder="选择API所属分组"
              style="width: 80%"
              :filterable="true"
              :loading="domainLoading"
            >
              <el-option
                v-for="item in domainOptionList"
                :key="item.domainId"
                :label="`${item.name}(${item.domain})`"
                :value="item"
              >
                <span style="float: left">{{ item.name }}</span>
                <span style="color: #999">{{ `(${item.domain})` }}</span>
              </el-option>
            </el-select>
            <el-button type="text" @click="createGroupDialogVisible = true"
              >+创建分组</el-button
            >
          </div>
        </el-form-item>
        <el-form-item prop="url" label="URI">
          <el-input
            v-model.trim="passBackFormData.url"
            maxlength="50"
            show-word-limit
            placeholder="输入API的URL，如/update/order"
            style="width: 80%"
          ></el-input>
        </el-form-item>
      </el-form>
      <el-button
        type="primary"
        :loading="confirmRegisterLoading"
        @click="handleConfirmRegister"
        >确认注册</el-button
      >
    </div>
    <!-- 创建分组对话框 -->
    <el-dialog
      title="创建分组"
      width="500px"
      :visible.sync="createGroupDialogVisible"
      :close-on-click-modal="false"
      @close="$refs.createGroupForm.resetFields()"
    >
      <el-form
        ref="createGroupForm"
        label-width="110px"
        :model="createGroupFormData"
        :rules="createGroupFormRules"
      >
        <el-form-item
          v-for="item in createGroupFormList"
          :key="item.prop"
          :label="item.label"
          :prop="item.prop"
        >
          <el-input
            v-model.trim="createGroupFormData[item.prop]"
            :type="item.type"
            :placeholder="item.placeholder"
            :maxlength="item.maxLength"
            show-word-limit
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="createGroupDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          :loading="confirmCreateGroupLoading"
          @click="handleConfirmCreateGroup"
          >确认创建</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import lcp from "@/api/intranet/lcp/index.js";
import gateway from "@/api/intranet/gateway/index.js";

export default {
  name: "BasicInfo",
  props: {
    active: {
      type: Number,
      required: true,
    },
    id: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      // 基本信息表单
      passBackFormData: {domain: {}},
      passBackFormRules: {
        name: [
          { required: true, message: "请输入API中文名称" },
          { min: 2, max: 30, message: "请输入2-30个字符" },
          { pattern: /^\S*$/, message: "API中文名称要求不允许输入空格、换行" },
        ],
        app: [{ required: true, message: "请输入API所属应用" }],
        domain: [{ required: true, message: "请输入API所属分组", trigger: 'blur' }],
        url: [
          { required: true, message: "请输入URL" },
          {
            pattern: /^\//,
            message: "URL要求以“/”开头",
          },
          {
            pattern: /^\/[a-zA-Z0-9_\{\}\.\/-]*$/,
            message: "请输入英文字母、数字、'/'、'_'、'-'、'.'、'{'、'}'",
          },
          { min: 2, max: 50, message: "请输入2-50个字符" },
        ],
      },
      appOptionList: [],
      domainOptionList: [],
      domainLoading: false,
      confirmRegisterLoading: false,
      confirmRegisterDebounceTimer: null,
      // 创建分组对话框
      createGroupDialogVisible: false,
      createGroupFormData: {},
      createGroupFormList: [
        {
          label: "分组英文名称",
          prop: "domain",
          placeholder: "输入API分组英文名称",
          maxLength: "30",
        },
        {
          label: "分组中文名称",
          prop: "name",
          placeholder: "输入API分组中文名称",
          maxLength: "30",
        },
        {
          label: "分组描述",
          prop: "intr",
          placeholder: "输API分组使用场景的描述",
          type: "textarea",
          maxLength: "100",
        },
      ],
      createGroupFormRules: {
        name: [
          { required: true, message: "请输入分组中文名称" },
          {
            pattern: /^\S*$/,
            message: "分组中文名称要求不允许输入空格、换行",
          },
        ],
        domain: [
          { required: true, message: "请输入分组英文名称" },
          {
            pattern: /^[a-zA-Z0-9_\.\{\}-]*$/,
            message: "请输入英文字母、数字、'_'、'-'、'.'",
          },
          { min: 2, max: 30, message: "请输入2-30个字符" },
        ],
        intr: [
          { required: true, message: "请输入分组描述" },
          { min: 5, max: 100, message: "请输入5-100个字符" },
        ],
      },
      confirmCreateGroupLoading: false,
      confirmCreateGroupDebounceTimer: null,
    };
  },
  methods: {
    // 查询应用列表
    async findAppListForSelect() {
      return await lcp.select.findAppListForSelect();
    },
    // 查询所属分组列表
    async query(queryLike) {
      const data = [{ queryLike }];
      return await gateway.OuterDomainService.query(data);
    },
    // 注册API-创建分组
    async create() {
      const { name, domain, intr } = this.createGroupFormData;
      const source = "LCP";
      const data = [{ name, domain, intr, source, sceneType: 1 }];
      return await gateway.OuterDomainService.create(data);
    },
    // 注册API
    async saveOuterApi() {
      const {
        name,
        app: { appKey, appName },
        domain: { domainId, domain },
        url,
      } = this.passBackFormData;
      const source = "LCP";
      const data = [
        {
          name,
          appKey,
          appName,
          domainId,
          domain,
          url,
          source,
          sceneType: 1
        },
      ];
      return await gateway.ApiManagerService.saveOuterApi(data);
    },

    // 获取所属应用列表操作
    async handleGetAppOptionList() {
      const { data } = await this.findAppListForSelect().catch(() => {
        throw new Error("handleGetAppOptionList findAppListForSelect");
      });
      this.appOptionList =
        data && data.length > 0
          ? data.map((item) => {
              const appId = item.value;
              const appKey = item.code;
              const appName = item.label;
              return { appId, appKey, appName };
            })
          : [];
    },
    // 远程搜索所属分组
    async remoteMethodDomain(query) {
        if (query !== "") {
          this.domainLoading = true;
          const { data } = await this.query(query).catch(() => {
            this.domainLoading = false;
            throw new Error("remoteMethodDomain query");
          });
          this.domainOptionList =
            data && data.length > 0
              ? data.map((item) => {
                  const { id, domain, name } = item;
                  const domainId = id;
                  return { domainId, domain, name };
                })
              : [];
          this.domainLoading = false;
        } else {
          this.domainOptionList = [];
        }
    },
    // 确认创建分组操作
    handleConfirmCreateGroup() {
      clearTimeout(this.confirmCreateGroupDebounceTimer);
      this.confirmCreateGroupDebounceTimer = setTimeout(() => {
        this.$refs.createGroupForm.validate(async (valid) => {
          if (valid) {
            this.confirmCreateGroupLoading = true;
            const response = await this.create().catch((err) => {
              this.confirmCreateGroupLoading = false;
              throw new Error("handleConfirmCreateGroup create", err);
            });
            this.createGroupDialogVisible = false;
            this.$message.success("操作成功！");
            this.$nextTick(() => {
              this.confirmCreateGroupLoading = false;
            });
            this.remoteMethodDomain();
            const {name, domain} = this.createGroupFormData;
            console.log('id', response.data);
            this.passBackFormData.domain = {name, domain, domainId: response.data};
          } else {
            return false;
          }
        });
      }, 300);
    },
    // 确认注册操作
    handleConfirmRegister() {
      clearTimeout(this.confirmRegisterDebounceTimer);
      this.confirmRegisterDebounceTimer = setTimeout(() => {
        this.$refs.passBackForm.validate(async (valid) => {
          if (valid) {
            this.confirmRegisterLoading = true;
            const { data } = await this.saveOuterApi().catch(() => {
              this.confirmRegisterLoading = false;
              throw new Error("register saveOuterApi");
            });
            this.$emit("update:id", data);
            this.$emit("update:active", this.active + 1);
            this.confirmRegisterLoading = false;
          } else {
            return false;
          }
        });
      }, 300);
    },
  },
  created() {
    this.handleGetAppOptionList();
    this.remoteMethodDomain();
  },
};
</script>

<style lang="scss" scoped>
.basic-info {
  .basic-info__step-form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .pass-back-form {
      width: 500px;
      .content__domain {
        display: flex;
        justify-content: space-between;
      }
    }
  }
}
</style>