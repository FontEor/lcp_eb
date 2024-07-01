<template>
  <div class="basic-data">
    <!-- 非编辑态基本信息 -->
    <el-form
      v-if="!editable"
      class="basic-data__not-editable-form"
      label-width="100px"
      label-position="left"
      :model="{}"
    >
      <!-- 描述信息 -->
      <Title text="描述信息" />
      <el-row class="row--offset">
        <el-col :span="8">
          <el-form-item label="中文名称">
            <span>{{ name }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="功能描述">
            <span class="remark-content">{{ remark }}</span>
          </el-form-item>
        </el-col>
        <!-- <el-col :span="8">
          <el-form-item label="可见范围">
            <span>{{ computeVisibilityText }}</span>
          </el-form-item>
        </el-col> -->
      </el-row>
      <!-- 敏感信息 -->
      <Title text="敏感信息" />
      <el-row class="row--offset">
        <el-col :span="8">
          <el-form-item label="数据级别">
            <span>{{ computeDataLevelText }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 分组信息 -->
      <Title text="分组信息" />
      <el-row class="row--offset">
        <el-col :span="8">
          <el-form-item label="所属分组">
            <span>{{ domain.domainName }}({{ domain.domain }})</span>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 应用信息 -->
      <Title text="应用信息" />
      <el-row class="row--offset">
        <el-col :span="16">
          <el-form-item label="所属应用">
            <span>{{ lcpApp.lcpAppName }}({{ lcpApp.lcpAppKey }})</span>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 负责人信息 -->
      <Title text="负责人信息" />
      <el-row class="row--offset">
        <el-col :span="8">
          <el-form-item label="产品负责人">
            <span>{{ productPrincipal }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="研发负责人">
            <span>{{ developPrincipal }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="运营负责人">
            <span>{{ operationPrincipal }}</span>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <!-- 编辑态基本信息 -->
    <el-form
      v-show="editable"
      class="basic-data__editable-form"
      ref="basicInfoData"
      label-width="100px"
      label-position="right"
      :model="basicInfoData"
      :rules="basicInfoRules"
    >
      <!-- 描述信息 -->
      <Title text="描述信息" />
      <el-row class="row--offset">
        <el-col :span="8">
          <el-form-item label="中文名称" prop="name">
            <el-input
              v-model.trim="basicInfoData.name"
              placeholder="请输入中文名称"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="功能描述" prop="intr">
            <el-input
              v-model="basicInfoData.intr"
              placeholder="请输入功能描述"
              type="textarea"
              :rows="1"
            ></el-input>
          </el-form-item>
        </el-col>
        <!-- <el-col :span="8">
          <el-form-item label="可见范围" prop="visibility">
            <el-radio-group v-model="basicInfoData.visibility">
              <el-radio :label="0">公开</el-radio>
              <el-radio :label="1">私有</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col> -->
      </el-row>
      <!-- 敏感信息 -->
      <Title text="敏感信息" />
      <el-row class="row--offset">
        <el-col :span="8">
          <el-form-item label="数据级别" prop="dataLevel">
            <el-select
              v-model="basicInfoData.dataLevel"
              placeholder="请选择数据级别"
              style="width: 100%"
            >
              <el-option
                v-for="item in dataLevelOptionList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select> </el-form-item
        ></el-col>
        <el-col :span="8">
          <el-link type="text" @click="hrefToDocument" style="margin: 6px 8px"
            >数据级别说明</el-link
          >
        </el-col>
      </el-row>
      <!-- 分组信息 -->
      <Title text="分组信息" />
      <el-row class="row--offset">
        <el-col :span="8">
          <el-form-item label="所属分组" prop="domain" ref="domain">
            <el-select
              v-model="basicInfoData.domain"
              :disabled="!(+editBtnStatusInfo.status === 1 && +editBtnStatusInfo.isOnline === 0)"
              :loading="domainLoading"
              :filterable="true"
              :remote="true"
              :remote-method="remoteDomain"
              value-key="domainId"
              placeholder="请输入分组中文名称或分组编码"
              style="width: 100%"
              class="select--fix-height"
            >
              <el-option
                v-for="item in domainOptionsList"
                :key="item.domainId"
                :label="`${item.domainName}(${item.domain})`"
                :value="item"
              >
                <span style="float: left">{{ item.domainName }}</span>
                <span style="color: #999">{{ `(${item.domain})` }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-button
            type="text"
            @click="createGroupDialogVisible = true"
            style="margin-left: 8px"
            >+创建分组</el-button
          >
        </el-col>
      </el-row>
      <!-- 应用信息 -->
      <Title text="应用信息" />
      <el-row class="row--offset">
        <el-col :span="11">
          <el-form-item label="所属应用" prop="lcpApp">
            <el-select
              v-model="basicInfoData.lcpApp"
              :disabled="!(+editBtnStatusInfo.status === 1 && +editBtnStatusInfo.isOnline === 0)"
              :filterable="true"
              value-key="lcpAppKey"
              placeholder="请输入应用中文名称"
              style="width: 100%"
              class="select--fix-height"
            >
              <el-option
                v-for="item in lcpAppOptionList"
                :key="item.lcpAppKey"
                :label="`${item.lcpAppName}(${item.lcpAppKey})`"
                :value="item"
              >
              </el-option>
            </el-select> </el-form-item
        ></el-col>
      </el-row>
      <!-- 负责人信息 -->
      <Title text="负责人信息" />
      <el-row class="row--offset">
        <el-col :span="8">
          <el-form-item label="产品负责人" prop="productPrincipal">
            <ErpPrincipal
              :showPopover="true"
              :formDataPrincipal.sync="basicInfoData.productPrincipal"
              :disabled="!(+editBtnStatusInfo.status === 1 && +editBtnStatusInfo.isOnline === 0)"
              placeholder="请输入产品负责人的ERP账号"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="研发负责人" prop="developPrincipal">
            <ErpPrincipal
              :showPopover="true"
              :formDataPrincipal.sync="basicInfoData.developPrincipal"
              :disabled="!(+editBtnStatusInfo.status === 1 && +editBtnStatusInfo.isOnline === 0)"
              placeholder="请输入研发负责人的ERP账号"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="运营负责人" prop="operationPrincipal">
            <ErpPrincipal
              :showPopover="true"
              :formDataPrincipal.sync="basicInfoData.operationPrincipal"
              :disabled="!(+editBtnStatusInfo.status === 1 && +editBtnStatusInfo.isOnline === 0)"
              placeholder="请输入运营负责人的ERP账号"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <StickyWrapper>
      <el-button
        v-if="!editable && editBtnStatusInfo.visible"
        type="primary"
        @click="handleEdit"
        :disabled="editBtnStatusInfo.disabled"
        >编 辑</el-button
      >
      <div v-else class="button-wrapper">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button type="primary" @click="handleSave">保 存</el-button>
      </div>
    </StickyWrapper>
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
import Title from "@/components/Title.vue";
import StickyWrapper from "@/components/StickyWrapper.vue";
import ErpPrincipal from "@/views/intranet/apiManager/components/ErpPrincipal.vue";
import gateway from "@/api/intranet/gateway/index.js";
import apiManager from "@/api/intranet/apiManager/index";

export default {
  name: "BasicData",
  components: {
    Title,
    StickyWrapper,
    ErpPrincipal
  },
  props: {
    editBtnStatusInfo: {
      type: Object,
      default: () => ({ disabled: false, visible: true })
    },
    name: {
      type: String,
      required: true
    },
    remark: {
      type: String,
      default: ""
    },
    visibility: {
      type: Number,
      default: 0
    },
    dataLevel: {
      type: Number,
      default: 0
    },
    domain: {
      type: Object,
      required: true
    },
    lcpApp: {
      type: Object,
      required: true
    },
    productPrincipal: { type: String, default: "" },
    developPrincipal: { type: String, default: "" },
    operationPrincipal: { type: String, default: "" }
  },
  data() {
    return {
      editable: false,
      basicInfoData: {
        name: "",
        intr: "",
        // visibility: 0,
        dataLevel: null,
        domain: {},
        lcpApp: {},
        productPrincipal: "",
        developPrincipal: "",
        operationPrincipal: ""
      },
      basicInfoRules: {
        name: [
          { required: true, message: "请输入API中文名称" },
          { min: 2, max: 30, message: "请输入2-30个字符" },
          { pattern: /^\S*$/, message: "API中文名称要求不允许输入空格、换行" }
        ],
        intr: [
          { required: true, message: "请输入分组描述" },
          { min: 2, max: 500, message: "请输入2-500个字符" }
        ],
        // visibility: [{ required: true, message: "请选择功能描述" }],
        dataLevel: [{ required: true, message: "请选择数据级别" }],
        domain: [{ required: true, message: "请输入分组中文名称或分组编码" }],
        lcpApp: [{ required: true, message: "请输入应用中文名称" }],
        productPrincipal: [
          { required: true, message: "请输入产品负责人的ERP账号" }
        ],
        developPrincipal: [
          { required: true, message: "请输入研发负责人的ERP账号" }
        ],
        operationPrincipal: [
          { required: true, message: "请输入运营负责人的ERP账号" }
        ]
      },
      dataLevelOptionList: [
        { value: 0, label: "公开数据（L1）" },
        { value: 1, label: "秘密数据（L2）" },
        { value: 2, label: "机密数据（L3）" },
        { value: 3, label: "绝密数据（L4）" }
      ],
      domainOptionsList: [],
      domainLoading: false,
      lcpAppOptionList: [],
      createGroupDialogVisible: false,
      createGroupFormData: {},
      createGroupFormList: [
        {
          label: "分组英文名称",
          prop: "domain",
          placeholder: "输入API分组英文名称",
          maxLength: "30"
        },
        {
          label: "分组中文名称",
          prop: "name",
          placeholder: "输入API分组中文名称",
          maxLength: "30"
        },
        {
          label: "分组描述",
          prop: "intr",
          placeholder: "输API分组使用场景的描述",
          type: "textarea",
          maxLength: "100"
        }
      ],
      createGroupFormRules: {
        name: [
          { required: true, message: "分组中文名称不能为空" },
          {
            pattern: /^\S*$/,
            message: "不允许空格和换行"
          }
        ],
        domain: [
          { required: true, message: "分组英文名称不能为空" },
          {
            pattern: /^[a-zA-Z0-9_\.\{\}-]*$/,
            message: "请输入英文字母、数字、'_'、'-'、'.'"
          }
        ],
        intr: [{ required: true, message: "分组描述不能为空" }]
      },
      confirmCreateGroupLoading: false,
      confirmCreateGroupDebounceTimer: null
    };
  },
  computed: {
    // computeVisibilityText() {
    //   const hashMap = { 0: "公开", 1: "私有" };
    //   return hashMap[this.visibility];
    // },
    computeDataLevelText() {
      const hashMap = {
        0: "公开数据（L1）",
        1: "秘密数据（L2）",
        2: "机密数据（L3）",
        3: "绝密数据（L4）"
      };
      return hashMap[this.dataLevel];
    }
  },
  methods: {
    // 创建分组
    async create() {
      const { name, domain, intr } = this.createGroupFormData;
      const data = [{ name, domain, intr, source: "LCP", sceneType: 1 }];
      return await gateway.OuterDomainService.create(data);
    },
    // 查询所属分组
    async query(queryLike) {
      const data = [{ queryLike }];
      return await gateway.OuterDomainService.query(data);
    },
    // 查询应用列表
    async findAppListForSelect() {
      return await apiManager.findAppListForSelect();
    },
    // 更新API基础数据
    async updateOuterApiBaseInfo() {
      const {
        name,
        intr,
        // visibility,
        dataLevel,
        domain: { domain, domainId },
        lcpApp: { lcpAppKey, lcpAppName },
        productPrincipal,
        developPrincipal,
        operationPrincipal
      } = this.basicInfoData;
      const id = this.$route.params.id;
      const appKey = lcpAppKey;
      const appName = lcpAppName;
      const data = [
        {
          id,
          name,
          intr,
          // visibility,
          dataLevel,
          domain,
          domainId,
          appName,
          appKey,
          productPrincipal,
          developPrincipal,
          operationPrincipal
        }
      ];
      return await gateway.ApiManagerService.updateOuterApiBaseInfo(data);
    },

    // 获取所属应用列表
    async getAppOptions() {
      const response = await this.findAppListForSelect().catch(() => {
        throw new Error("getAppOptions findAppListForSelect");
      });
      const { data } = response.data;
      this.lcpAppOptionList =
        data && data.length > 0
          ? data.map(item => {
              const lcpAppId = item.value;
              const lcpAppKey = item.code;
              const lcpAppName = item.label;
              return { lcpAppId, lcpAppKey, lcpAppName };
            })
          : [];
    },
    // 所属分组模糊搜索
    async remoteDomain(query) {
      console.log("query");
      if (query !== "") {
        this.domainLoading = true;
        const response = await this.query(query).catch(() => {
          throw new Error("remoteDomainOptions query");
        });
        const { data } = response;
        this.domainOptionsList =
          data && data.length > 0
            ? data.map(item => {
                const { id, domain, name } = item;
                const domainId = id;
                const domainName = name;
                return { domainId, domain, domainName };
              })
            : [];
        this.domainLoading = false;
      } else {
        this.domainOptionsList = [];
      }
    },
    // 保存API基本信息操作
    async handleSave() {
      this.$refs.basicInfoData.validate(async valid => {
        if (valid) {
          await this.updateOuterApiBaseInfo().catch(() => {
            throw new Error("handleSave updateOuterApiBaseInfo");
          });
          this.editable = false;
          this.$emit("getApiBasicInfo");
          this.initBasicInfoData();
        }
      });
    },
    // 确认创建分组操作
    handleConfirmCreateGroup() {
      clearTimeout(this.confirmCreateGroupDebounceTimer);
      this.confirmCreateGroupDebounceTimer = setTimeout(() => {
        this.$refs.createGroupForm.validate(async valid => {
          if (valid) {
            this.confirmCreateGroupLoading = true;
            await this.create().catch(() => {
              this.confirmCreateGroupLoading = false;
              throw new Error("handleConfirmCreateGroup create");
            });
            this.createGroupDialogVisible = false;
            this.$message.success("操作成功！");
            this.$nextTick(() => {
              this.confirmCreateGroupLoading = false;
            });
          } else {
            return false;
          }
        });
      }, 300);
    },
    // 初始化基本信息表单数据
    initBasicInfoData() {
      const {
        name,
        remark,
        // visibility,
        dataLevel,
        domain,
        lcpApp,
        productPrincipal,
        developPrincipal,
        operationPrincipal
      } = this;
      this.basicInfoData = {
        name,
        intr: remark,
        // visibility,
        dataLevel,
        domain,
        lcpApp,
        productPrincipal,
        developPrincipal,
        operationPrincipal
      };
      lcpApp.lcpAppId = String(lcpApp.lcpAppId);
      this.domainOptionsList = [domain];
    },
    // 编辑API基本信息
    handleEdit() {
      this.editable = true;
      this.$nextTick(() => {
        this.initBasicInfoData();
        this.getAppOptions();
      });
    },
    // 取消编辑API基本信息
    handleCancel() {
      this.$refs["basicInfoData"].resetFields();
      this.editable = false;
    },
    // 说明文档链接
    hrefToDocument() {
      window.open(
        "//cf.jd.com/pages/viewpage.action?pageId=106705184",
        "_blank"
      );
    }
  },
  created() {
    this.getAppOptions();
  }
};
</script>

<style lang="scss" scoped>
.basic-data {
  .basic-data__not-editable-form {
    .row--offset {
      padding-left: 12px;
    }
  }
  .basic-data__editable-form {
    .row--offset {
      padding-left: 12px;
    }
  }
  .select--fix-height {
    ::v-deep.el-input__inner {
      height: 32px !important;
    }
  }
}
.remark-content {
  white-space: pre-wrap;
  word-break: break-all
}
</style>
