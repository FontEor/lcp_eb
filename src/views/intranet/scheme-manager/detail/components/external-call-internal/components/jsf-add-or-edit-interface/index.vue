<template>
  <div class="jsf-add-or-edit-interface">
    <el-page-header :content="computeEditable | formatPageHeaderContentAndGoOnButtonText"
      @back="handleClickGoBackButton" />

    <Steps :active="active" :titleList="titleList" />

    <section class="jsf-add-or-edit-interface__form-title">
      <i v-if="active === titleList.length - 1" class="el-icon-success" />
      <h1 class="form-title__h1">
        {{ active | formatFormTitleH1Text(computeEditable) }}
      </h1>
      <p class="form-title__tip">
        {{ active | formatFormTitleTipText(computeEditable) }}
        <el-link v-if="active === 1" type="primary" href="https://cf.jd.com/pages/viewpage.action?pageId=106705184"
          target="_blank" style="vertical-align: baseline">数据接口等级标准</el-link>
      </p>
    </section>

    <!-- 第一步 选择接口 -->
    <el-form v-show="active === 0" class="jsf-add-or-edit-interface__api" ref="interfaceForm" label-width="160px"
      :model="interfaceFormData" :rules="interfaceFormRules">
      <el-form-item prop="interfaceName" label="API">
        <el-col :span="20">
          <el-select v-model="interfaceFormData.interfaceName" style="width: 100%" placeholder="请输入API中文或英文名称"
            :disabled="computeEditable" :filterable="true" :remote="true"
            :remote-method="remoteMethodSearchInterfaceName" @change="handleChangeInterfaceName">
            <el-option v-for="item in interfaceNameList" :key="item.qualifiedName" :label="item.qualifiedName"
              :value="item.qualifiedName" />
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-button v-if="!computeEditable" style="margin-left: 10px" type="text"
            @click="dialogQueryApiVisible = true">查询API</el-button>
        </el-col>
      </el-form-item>
      <el-form-item label="Method" prop="interfaceMethod">
        <el-col :span="20">
          <el-select v-model="interfaceFormData.interfaceMethod" style="width: 100%" placeholder="请输入Method英文名称"
            :filterable="true" :disabled="computeEditable" @change="handleChangeInterfaceMethod">
            <el-option v-for="item in interfaceMethodList" :key="item.id" :label="item.name" :value="item.name" />
          </el-select>
        </el-col>
      </el-form-item>
      <!-- 测试环境 -->
      <template v-if="baseEnv === 'test'">
        <el-form-item prop="alias">
          <span slot="label">
            测试环境JSF别名&nbsp;
            <el-tooltip content="公网开发者通过预发环境调用接口时，物流开放平台会转掉测试环境的JSF服务" placement="top">
              <i class="el-icon-help-solid" />
            </el-tooltip>
          </span>
          <el-col :span="20">
            <el-select v-model="interfaceFormData.alias" :filterable="true" placeholder="选择测试环境JSF别名"
              style="width: 100%">
              <el-option v-for="item in jsfAliasList" :key="item.alias" :label="item.alias" :value="item.alias" />
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item v-show="interfaceFormData.alias" prop="token">
          <span slot="label">
            测试环境JSF token&nbsp;
            <el-tooltip content="当前JSF服务要求传入token时，则需要配置该项，否则JSF服务无法调通，物流开放平台会将该token传入内部JSF服务" placement="top">
              <i class="el-icon-help-solid" />
            </el-tooltip>
          </span>
          <el-col :span="20">
            <el-input v-model.trim="interfaceFormData.token" placeholder="请输入服务别名相应的token"
              style="width: 100%"></el-input>
          </el-col>
        </el-form-item>
      </template>
      <!-- 预发、生产环境 -->
      <template v-else-if="baseEnv === 'uat' || baseEnv === 'prod'">
        <template v-if="hasUat === 1">
          <el-form-item prop="shadowboxAlias">
            <span slot="label">
              预发环境JSF别名&nbsp;
              <el-tooltip content="公网开发者通过预发环境调用接口时，物流开放平台会转掉预发环境的JSF服务" placement="top">
                <i class="el-icon-help-solid" />
              </el-tooltip>
            </span>
            <el-col :span="20">
              <el-select v-model="interfaceFormData.shadowboxAlias" :filterable="true" placeholder="选择预发环境JSF别名"
                style="width: 100%">
                <el-option v-for="item in jsfAliasList" :key="item.alias" :label="item.alias" :value="item.alias" />
              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item v-show="interfaceFormData.shadowboxAlias" prop="uatToken">
            <span slot="label">
              预发环境JSF token&nbsp;
              <el-tooltip content="当前JSF服务要求传入token时，则需要配置该项，否则JSF服务无法调通，物流开放平台会将该token传入内部JSF服务" placement="top">
                <i class="el-icon-help-solid" />
              </el-tooltip>
            </span>
            <el-col :span="20">
              <el-input v-model.trim="interfaceFormData.uatToken" placeholder="请输入服务别名相应的token"
                style="width: 100%"></el-input>
            </el-col>
          </el-form-item>
        </template>
        <el-form-item prop="alias">
          <span slot="label">
            生产环境JSF别名&nbsp;
            <el-tooltip content="公网开发者通过预发环境调用接口时，物流开放平台会转掉生产环境的JSF服务" placement="top">
              <i class="el-icon-help-solid" />
            </el-tooltip>
          </span>
          <el-col :span="20">
            <el-select v-model="interfaceFormData.alias" :filterable="true" placeholder="选择生产环境JSF别名"
              style="width: 100%">
              <el-option v-for="item in jsfAliasList" :key="item.alias" :label="item.alias" :value="item.alias" />
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item v-show="interfaceFormData.alias" prop="token">
          <span slot="label">
            生产环境JSF token&nbsp;
            <el-tooltip content="当前JSF服务要求传入token时，则需要配置该项，否则JSF服务无法调通，物流开放平台会将该token传入内部JSF服务" placement="top">
              <i class="el-icon-help-solid" />
            </el-tooltip>
          </span>
          <el-col :span="20">
            <el-input v-model.trim="interfaceFormData.token" placeholder="请输入服务别名相应的token"
              style="width: 100%"></el-input>
          </el-col>
        </el-form-item>
      </template>
    </el-form>
    <!-- 第二步 设置接口的数据安全级别 -->
    <el-form v-show="active === 1" class="jsf-add-or-edit-interface__form" ref="securityLevelForm" label-width="120px"
      :model="securityLevelFormData" :rules="securityLevelFormRules">
      <el-form-item label="数据级别" prop="dataLevel">
        <el-select v-model="securityLevelFormData.dataLevel" placeholder="请选择数据级别" style="width: 100%">
          <el-option v-for="item in dataLevelOptionList" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="敏感标签" prop="labelList">
        <el-cascader v-model="securityLevelFormData.labelList" ref="securityLevelFormCascader" style="width: 100%"
          :options="labelListOptionList" :props="labelListProps" :show-all-levels="false"
          :clearable="true"></el-cascader>
      </el-form-item>
    </el-form>
    <!-- 第三步 设置公网URL -->
    <el-form v-show="active === 2" class="jsf-add-or-edit-interface__form" ref="urlForm" label-width="160px"
      :model="urlFormData" :rules="urlFormRules">
      <el-form-item label="URL" prop="apiUrl">
        <el-input v-model.trim="urlFormData.apiUrl" :disabled="computeStatus" placeholder="/order/updateOrder"
          style="width: 100%"></el-input>
      </el-form-item>
      <el-form-item prop="apiResTimeout">
        <!-- <span slot="label">
          是否需要用户授权&nbsp;
          <el-tooltip
            content="开启授权后，物流商家需登录京东账号，授权应用，应用才可调用该接口，获取商家数据。"
            placement="top"
          >
            <i class="el-icon-help-solid" />
          </el-tooltip>
        </span>
        <el-switch
          v-model="urlFormData.isAuthorize"
          active-color="#26A872"
          :active-value="1"
          :inactive-value="0"
          :disabled="computeEditable"
        ></el-switch> -->

        <span slot="label">
          接口响应超时&nbsp;
          <el-tooltip content="可配置网关调用京东业务系统的读取超时时间。" placement="top">
            <i class="el-icon-help-solid" />
          </el-tooltip>
        </span>
        <el-input placeholder="请输入内容" v-model.number="urlFormData.apiResTimeout" active-color="#26A872">
          <template slot="append">毫秒</template>
        </el-input>
      </el-form-item>
    </el-form>
    <!-- 第四步 设置参数映射 -->
    <el-form v-show="active === 3" class="jsf-add-or-edit-interface__form" ref="mapForm" label-width="210px"
      :model="mapFormData" :rules="mapFormDataRules">
      <el-form-item prop="is_open" label="从平台接收京东PIN">
        <el-switch v-model="mapFormData.is_open" :active-value="1" :inactive-value="0"
          active-color="#26A872"></el-switch>
      </el-form-item>
      <el-form-item v-show="computeMapFormParamsVisible" prop="params">
        <el-cascader v-model="mapFormData.params" ref="mapFormCascader" style="width: 100%" placeholder="请选择接收账号的入参字段"
          :options="paramsOptionList"></el-cascader>
      </el-form-item>
    </el-form>
    <!-- 从平台接收appkey -->
    <el-form v-show="active === 3" class="jsf-add-or-edit-interface__form" ref="appkeyMapForm" label-width="210px"
      :model="appkeyMapFormData" :rules="appkeyMapFormDataRule">
      <el-form-item prop="is_open" label="从平台接收appkey">
        <el-switch v-model="appkeyMapFormData.is_open" :active-value="1" :inactive-value="0"
          active-color="#26A872"></el-switch>
      </el-form-item>
      <el-form-item v-show="computeAppkeyMapFormParamsVisible" prop="params">
        <el-cascader v-model="appkeyMapFormData.params" ref="appkeyMapFormCascader" style="width: 100%"
          placeholder="选择接口入参中的appkey" :options="paramsOptionList"></el-cascader>
      </el-form-item>
    </el-form>

    <div class="jsf-add-or-edit-interface__button-wrapper">
      <template v-if="active === titleList.length - 1">
        <el-button @click="handleClickGoBackButton">返回接口列表</el-button>
        <el-button type="primary" @click="handleClickGoOnButton">继续{{
          computeEditable | formatPageHeaderContentAndGoOnButtonText
        }}</el-button>
      </template>
      <template v-else>
        <el-button v-if="computePreviousStepButtonVisible" @click="active -= 1">上一步</el-button>
        <el-button type="primary" :loading="nextStepLoading" @click="handleClickNextStepButton">{{
          active | formatNextStepButtonText(titleList, computeEditable)
        }}</el-button>
      </template>
    </div>
    <!-- 查询API弹窗 -->
    <QueryApiDialog v-if="dialogQueryApiVisible" :dialogQueryApiVisible.sync="dialogQueryApiVisible"
      @updateInterfaceName="updateInterfaceName" />
  </div>
</template>

<script>
import Steps from "@/components/Steps.vue";
import lcp from "@/api/intranet/lcp/index.js";
import gateway from "@/api/intranet/gateway/index.js";
import QueryApiDialog from "./components/query-api-dialog.vue";
export default {
  name: "JsfAddOrEditInterface",
  components: { Steps, QueryApiDialog },
  props: {
    interfaceInfo: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      // 对接方案ID
      unitId: parseInt(this.$route.params.id),
      // 步骤条
      active: 0,
      titleList: [
        "选择接口",
        "设置接口安全级别",
        "设置公网URL",
        "设置参数映射",
        "完成",
      ],
      debounceTimer: null,
      nextStepLoading: false,
      // 接口表单
      interfaceFormData: {
        interfaceName: "",
        apiType: "",
        interfaceMethod: "",
        shadowboxAlias: "",
        alias: "",
        token: "",
        uatToken: "",
      },
      interfaceFormRules: {
        interfaceName: [
          {
            required: true,
            message: "请输入API中文或英文名称",
          },
        ],
        interfaceMethod: [
          {
            required: true,
            message: "请输入Method英文名称",
          },
        ],
        shadowboxAlias: [{ required: true, message: "请输入JSF别名" }],
        alias: [{ required: true, message: "请输入JSF别名" }],
      },
      interfaceNameList: [],
      interfaceMethodList: [],
      methodId: 0,
      jsfAliasList: [],
      baseEnv: window.env.baseEnv,
      hasUat: 0,
      // 安全级别表单
      securityLevelFormData: {
        dataLevel: 0,
        labelList: [],
      },
      securityLevelFormRules: {
        dataLevel: [{ required: true, message: "请选择数据级别" }],
        labelList: [
          { type: "array", required: true, message: "请选择敏感标签" },
        ],
      },
      dataLevelOptionList: [
        { value: 0, label: "公开数据（L1）" },
        { value: 1, label: "秘密数据（L2）" },
        { value: 2, label: "机密数据（L3）" },
        { value: 3, label: "绝密数据（L4）" },
      ],
      labelListProps: { multiple: true, value: "id", label: "labelName" },
      labelListOptionList: [],
      // 公网URL表单
      urlFormData: { apiUrl: "", apiResTimeout: 5000, },
      urlFormRules: {
        apiUrl: [
          { required: true, message: "url不能为空", trigger: "blur" },
          {
            min: 1,
            max: 100,
            message: "长度在 1 到 100 个字符",
          },
          {
            pattern: /^\//,
            message: "请以“/”开头",
          },
          { pattern: /^[^:：]*$/, message: "url不能包含中英文冒号" },
        ],
        apiResTimeout: [
          { required: true, message: "接口响应超时时间不能为空", trigger: "blur" },
          {
            type: 'number', message: '仅支持纯数字且数字需在1-30000范围之内', transform(value) {
              if (value !== '') {
                if (value < 1 || value > 30000) {
                  return false
                } else {
                  return value
                }
              }else{
                return null
              }
            }
          },
        ]
      },
      bizType: 2,
      // 参数映射表单
      mapFormData: {
        is_open: 0,
        params: [],
        actAccount: {},
      },
      mapFormDataRules: {
        params: {
          validator: (rule, value, callback) => {
            if (this.mapFormData.is_open) {
              if (!this.mapFormData.params.length) {
                callback(new Error('请选择接收账号的入参字段'))
              } else {
                callback()
              }
            } else {
              callback()
            }
          },
          trigger: 'change'
        }
      },
      appkeyMapFormData: {
        is_open: 0,
        params: [],
        appKeyConfig: {},
      },
      appkeyMapFormDataRule: {
        params: {
          validator: (rule, value, callback) => {
            if (this.appkeyMapFormData.is_open) {
              if (!this.appkeyMapFormData.params.length) {
                callback(new Error('选择接口入参中的appkey'))
              } else {
                callback()
              }
            } else {
              callback()
            }
          },
          trigger: "change",
        }
      },
      paramsOptionList: [],
      dialogQueryApiVisible: false,
    };
  },
  filters: {
    formatPageHeaderContentAndGoOnButtonText(computeEditable) {
      return computeEditable ? "编辑接口" : "添加接口";
    },
    formatFormTitleH1Text(active, computeEditable) {
      const hashMap = [
        "从API仓库选择接口",
        "设置接口的数据安全级别",
        "设置公网URL",
        "设置参数映射",
        computeEditable ? "编辑成功" : "添加成功",
      ];
      return hashMap[active] || "";
    },
    formatFormTitleTipText(active, computeEditable) {
      const hashMap = [
        "从API仓库中选择对接方案的相关接口，这些接口将会被开放到外网。开放其他团队的接口前，请与接口研发负责人确认是否可开放。",
        "根据安全部要求，接口需完成数据安全级别配置才可发布到外网。如何配置可参考",
        "每个接口在公网中都有唯一URL，例如api.jdwl.com/order/updateOrder，其中api.jdwl.com是所有接口的公共前缀，您无需填写。",
        "若你的业务需要pin和appkey，为防止在接口调用的过程中黑客篡改调用方传入的appkey和京东pin，可开启参数映射功能。开启后将使用平台解析后的pin或appkey进行鉴权校验，保障业务安全。",
        computeEditable ? "您可继续编辑接口" : "您可继续添加接口",
      ];
      return hashMap[active] || "";
    },
    formatNextStepButtonText(active, titleList, computeEditable) {
      return active < titleList.length - 2
        ? "下一步"
        : computeEditable
          ? "确认编辑"
          : "确认添加";
    },
  },
  computed: {
    // 计算当前是否为编辑态
    computeEditable() {
      const { id } = this.interfaceInfo;
      return Boolean(id);
    },
    // 计算接口未发布新增编辑态
    computeStatus(){
      const { status, id } = this.interfaceInfo;
      if(Boolean(id)){
        return status === 1 ? false : true;
      }else{
        return false;
      }
    },

    // 计算上一步按钮可见性
    computePreviousStepButtonVisible() {
      const { active, titleList } = this;
      return active > 0 && active < titleList.length - 1;
    },
    // 计算参数映射表单入参字段表单项可见性
    computeMapFormParamsVisible() {
      const { is_open } = this.mapFormData;
      return Boolean(is_open);
    },
    // 计算appkey参数映射表单入参字段表单项可见性
    computeAppkeyMapFormParamsVisible() {
      const { is_open } = this.appkeyMapFormData;
      return Boolean(is_open);
    },
    computeMapFormDataParams() {
      return (attrViewNameList, paramIndex, paramsOptionList) => {
        console.log('attrViewNameList', attrViewNameList, paramIndex, paramsOptionList)
        if (paramsOptionList.length <= 0 || paramsOptionList[paramIndex].value !== attrViewNameList[0]) {
          return []
        }
        const includeInChildren = (paramsOptionList[paramIndex].children || []).find(item => {
          return item.value === attrViewNameList[1]
        })
        if (!includeInChildren) {
          return []
        }
        return attrViewNameList;
      }
    }
  },
  methods: {
    // 选择API
    async updateInterfaceName(row) {
      const { apiType, interfaceName, interfaceMethod } = row;
      const apiUrl = "";
      const [shadowboxAlias, alias] = ["", ""];
      const [uatToken, token] = ["", ""];
      Object.assign(this.interfaceFormData, {
        interfaceName,
        apiType,
        interfaceMethod,
        shadowboxAlias,
        alias,
        uatToken,
        token,
      });
      this.urlFormData.url = apiUrl;
      await Promise.all([
        this.handleSearchInterfaceMethodList(),
        this.handleSearchJsfAliasList(),
        this.handleSearchMethod(row),
      ]).catch((error) => {
        throw new Error(`updateInterfaceName, ${error}`);
      });
    },
    async handleSearchMethod(row) {
      const { interfaceName, interfaceMethod } = this.interfaceFormData;
      const interfaceNamePostfix = interfaceName.split(".").slice(-1)[0];
      this.urlFormData.apiUrl =
        `/${interfaceNamePostfix}/${interfaceMethod}`.toLowerCase();
      this.methodId = row.methodId;
      this.mapFormData.params = [];
      this.appkeyMapFormData.params = [];
      await this.handleSearchMapFormParamsOptionList().catch((error) => {
        throw new Error(`handleChangeInterfaceMethod, ${error}`);
      });
    },
    // 根据对接方案ID查询对接方案类型
    async getBizUnitPreById() {
      const { unitId } = this;
      const id = unitId;
      const params = { id };
      return await lcp.bizunit.getBizUnitPreById(params);
    },
    // 根据接口URI关键词查询API仓库接口列表
    async queryBlurryApiList(searchKeyWord) {
      const data = [{ searchKeyWord }];
      return await gateway.ApiDepotService.queryBlurryApiList(data);
    },
    // 根据接口名称查询方法列表数据
    async queryApiMethodRelease() {
      const { interfaceName } = this.interfaceFormData;
      const qualifiedName = interfaceName;
      const data = [{ qualifiedName }];
      return await gateway.ApiDepotService.queryApiMethodRelease(data);
    },
    // 根据接口名称查询接口JSF别名列表数据
    async queryAliasByQualifiedName() {
      const { interfaceName } = this.interfaceFormData;
      const qualifiedName = interfaceName;
      const data = [{ qualifiedName }];
      return await gateway.ApiDepotService.queryAliasByQualifiedName(data);
    },
    // 查询敏感标签级联列表数据
    async querySensitiveLabelForest() {
      return await gateway.HttpApiService.querySensitiveLabelForest();
    },
    // 根据接口名称与方法名称查询其下设置参数映射接收账号的入参字段级联列表数据
    async findApiMtpParamsList() {
      const { interfaceName, interfaceMethod } = this.interfaceFormData;
      const qualifiedName = interfaceName;
      const methodName = interfaceMethod;
      const apiId = this.interfaceInfo.id || undefined;
      const params = { qualifiedName, methodName, apiId };
      return await lcp.api.findApiMtpParamsList(params);
    },
    // 保存添加/编辑接口信息
    async saveInterface() {
      const { unitId, interfaceInfo, methodId, computeEditable, computeStatus } = this;
      const id = interfaceInfo.id || undefined;
      const type = 1;
      const {
        interfaceName,
        apiType,
        interfaceMethod,
        shadowboxAlias,
        alias,
        token,
        uatToken,
      } = this.interfaceFormData;
      const { dataLevel } = this.securityLevelFormData;
      let { labelList } = this.securityLevelFormData;
      labelList = this.$refs.securityLevelFormCascader
        .getCheckedNodes(true)
        .map(({ path, pathLabels }) => {
          const labelPath = path.join("/");
          const labelName = pathLabels.join("/");
          return { dataLevel, labelPath, labelName };
        });
      let { apiUrl } = this.urlFormData;
      apiUrl = computeStatus ? undefined : apiUrl;
      const { apiResTimeout } = this.urlFormData;
      const { actAccount } = this.mapFormData;
      const appKeyConfig = JSON.stringify(this.appkeyMapFormData.appKeyConfig);
      const data = {
        unitId,
        id,
        type,
        methodId,
        interfaceName,
        apiType,
        interfaceMethod,
        shadowboxAlias,
        alias,
        token,
        uatToken,
        dataLevel,
        labelList,
        apiUrl,
        apiResTimeout,
        actAccount,
        appKeyConfig,
      };
      return await lcp.bizapinterface.saveInterface(data);
    },

    // 查询对接方案是否存在预发环境及对接方案类型操作，判断选择接口步骤中预发环境别名、token表单项的可见性，判断设置公网URL步骤中是否需要用户授权表单项的可见性
    async handleSearchInterfaceHasUatAndDockingSolutionType() {
      const {
        data: { hasUat, type },
      } = await this.getBizUnitPreById().catch((error) => {
        throw new Error(
          `handleSearchInterfaceHasUatAndDockingSolutionType getBizUnitPreById, ${error}`
        );
      });
      this.hasUat = hasUat || 0;
      this.bizType = type || 2;
    },
    // 获取敏感标签级联选择器列表数据
    async handleGetLabelListOptionList() {
      const { data } = await this.querySensitiveLabelForest().catch((error) => {
        throw new Error(
          `handleGetLabelList querySensitiveLabelForest, ${error}`
        );
      });
      this.labelListOptionList = data || [];
    },
    // 点击返回按钮操作
    handleClickGoBackButton() {
      this.$emit("update:activeView", "interfaceList");
    },
    // 接口表单API远程搜索
    async remoteMethodSearchInterfaceName(query) {
      if (query) {
        const { data } = await this.queryBlurryApiList(query).catch((error) => {
          throw new Error(
            `remoteMethodSearchInterfaceName queryBlurryApiList, ${error}`
          );
        });
        this.interfaceNameList = data || [];
      } else {
        this.interfaceNameList = [];
      }
    },
    // 改变接口API选择值操作，获取接口分类名称，重置接口方法名称、公网URL及各个环境JSF别名、token，查询方法列表及JSF别名列表
    async handleChangeInterfaceName() {
      const { interfaceName } = this.interfaceFormData;
      const { businessCategoryName } = this.interfaceNameList.find(
        ({ qualifiedName }) => qualifiedName === interfaceName
      );
      const apiType = businessCategoryName;
      const [interfaceMethod, apiUrl] = ["", ""];
      const [shadowboxAlias, alias] = ["", ""];
      const [uatToken, token] = ["", ""];
      Object.assign(this.interfaceFormData, {
        apiType,
        interfaceMethod,
        shadowboxAlias,
        alias,
        uatToken,
        token,
      });
      this.urlFormData.url = apiUrl;
      await Promise.all([
        this.handleSearchInterfaceMethodList(),
        this.handleSearchJsfAliasList(),
      ]).catch((error) => {
        throw new Error(`handleChangeInterfaceName, ${error}`);
      });
    },
    // 查询方法列表操作
    async handleSearchInterfaceMethodList() {
      const { data } = await this.queryApiMethodRelease().catch((error) => {
        throw new Error(
          `handleSearchInterfaceMethodList queryApiMethodRelease, ${error}`
        );
      });
      this.interfaceMethodList = data || [];
    },
    // 查询JSF别名列表操作
    async handleSearchJsfAliasList() {
      const { data } = await this.queryAliasByQualifiedName().catch((error) => {
        throw new Error(
          `handleSearchJsfAliasList queryAliasByQualifiedName, ${error}`
        );
      });
      this.jsfAliasList = data || [];
    },
    // 改变接口Method选择值操作，获取公网URL、方法ID，查询设置参数映射级联选择列表
    async handleChangeInterfaceMethod() {
      const { interfaceName, interfaceMethod } = this.interfaceFormData;
      const interfaceNamePostfix = interfaceName.split(".").slice(-1)[0];
      this.urlFormData.apiUrl =
        `/${interfaceNamePostfix}/${interfaceMethod}`.toLowerCase();
      const { id } = this.interfaceMethodList.find(
        ({ name }) => name === interfaceMethod
      );
      this.methodId = id;
      this.mapFormData.params = [];
      this.appkeyMapFormData.params = [];
      await this.handleSearchMapFormParamsOptionList().catch((error) => {
        throw new Error(`handleChangeInterfaceMethod, ${error}`);
      });
    },
    // 查询设置参数映射级联选择列表操作
    async handleSearchMapFormParamsOptionList() {
      const { data } = await this.findApiMtpParamsList().catch((error) => {
        throw new Error(
          `handleSearchMapFormParamsOptionList findApiMtpParamsList, ${error}`
        );
      });
      this.paramsOptionList = data || [];
    },
    // 点击下一步按钮操作
    handleClickNextStepButton() {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(async () => {
        const { active, titleList } = this;
        const mapDataList = []
        if (this.mapFormData.is_open) {
          mapDataList.push('mapForm')
        }
        if (this.appkeyMapFormData.is_open) {
          mapDataList.push("appkeyMapForm")
        }
        const hashMap = [
          ["interfaceForm"],
          ["securityLevelForm"],
          ["urlForm"],
          [...mapDataList],
        ];
        this.nextStepLoading = true;
        const passFromRuleList = [];
        hashMap[active].forEach(dom => {
          this.$refs[dom].validate(async (valid) => {
            passFromRuleList.push(valid);
          })
        })
        if (passFromRuleList.every(valid => valid)) {
          if (active === titleList.length - 2) {
            this.handleGetActAccount();
            this.handleGetappKeyConfig();
            await this.saveInterface().catch((error) => {
              this.nextStepLoading = false;
              throw new Error(
                `handleClickNextStepButton saveInterface, ${error}`
              );
            });
            this.$emit("updateDetailHeaderInfo");
          }
          this.active += 1;
        }
        this.nextStepLoading = false;
      }, 300);
    },
    // 获取参数映射actAccount操作
    // 注：此处的actAccount会向网关同步，务必谨慎修改
    handleGetActAccount() {
      const { is_open } = this.mapFormData;
      const checkedNodeList = this.$refs.mapFormCascader.getCheckedNodes(true);
      const actAccount =
        is_open === 0
          ? { is_open, arg_index: 0, attr_view_name: "", attr_name: "" }
          : checkedNodeList && checkedNodeList.length > 0
            ? checkedNodeList.map(
              ({ level, path, data: { value, paramIndex }, parent }) => {
                const arg_index =
                  level === 1 ? paramIndex : parent.data.paramIndex;
                const attr_view_name = path.join("/");
                const attr_name = level === 1 ? "" : value;
                return { is_open, arg_index, attr_view_name, attr_name };
              }
            )[0]
            : { is_open: 0, arg_index: 0, attr_view_name: "", attr_name: "" };
      Object.assign(this.mapFormData.actAccount, actAccount);
    },
    // 获取参数映射appKeyConfig操作
    // 注：此处的appKeyConfig会向网关同步，务必谨慎修改
    handleGetappKeyConfig() {
      const { is_open } = this.appkeyMapFormData;
      const checkedNodeList =
        this.$refs.appkeyMapFormCascader.getCheckedNodes(true);
      const appKeyConfig =
        is_open === 0
          ? { is_open, arg_index: 0, attr_view_name: "", attr_name: "" }
          : checkedNodeList && checkedNodeList.length > 0
            ? checkedNodeList.map(
              ({ level, path, data: { value, paramIndex }, parent }) => {
                const arg_index =
                  level === 1 ? paramIndex : parent.data.paramIndex;
                const attr_view_name = path.join("/");
                const attr_name = level === 1 ? "" : value;
                return { is_open, arg_index, attr_view_name, attr_name };
              }
            )[0]
            : { is_open: 0, arg_index: 0, attr_view_name: "", attr_name: "" };
      Object.assign(this.appkeyMapFormData.appKeyConfig, appKeyConfig);
    },
    // 点击继续添加接口按钮操作
    handleClickGoOnButton() {
      const { computeEditable } = this;
      if (!computeEditable) {
        const formRefList = [
          "interfaceForm",
          "securityLevelForm",
          "urlForm",
          "mapForm",
          "appkeyMapForm",
        ];
        formRefList.forEach((item) => {
          this.$refs[item].resetFields();
        });
      }
      this.active = 0;
    },
    // 获取接口详情操作
    handleGetInterfaceDetail() {
      const {
        interfaceName,
        apiType,
        interfaceMethod,
        shadowboxAlias,
        alias,
        uatToken,
        token,
        paramMappingRisk,
      } = this.interfaceInfo;
      Object.assign(this.interfaceFormData, {
        interfaceName,
        apiType,
        interfaceMethod,
        shadowboxAlias,
        alias,
        uatToken,
        token,
      });
      const { methodId } = this;
      this.methodId = methodId;
      const { dataLevel, labelList } = this.interfaceInfo;
      this.securityLevelFormData.dataLevel = dataLevel || 0;
      this.securityLevelFormData.labelList = labelList
        ? labelList.map(({ labelPath }) => labelPath.split("/"))
        : [];
      const { apiUrl, apiResTimeout } = this.interfaceInfo;
      Object.assign(this.urlFormData, { apiUrl, apiResTimeout });
      // 兼容后端传值存在空字符串情况
      let actAccount = {};
      if (this.interfaceInfo.actAccount) {
        actAccount = JSON.parse(this.interfaceInfo.actAccount) || {};
      } else {
        actAccount = {};
      }
      const { is_open, attr_view_name } = actAccount;
      this.mapFormData.is_open = is_open || 0;
      let mapFormAttrViewName = [];
      if (paramMappingRisk.indexOf('PIN') < 0) {
        mapFormAttrViewName = attr_view_name ? attr_view_name.split("/") : [];
      }
      this.mapFormData.params = mapFormAttrViewName;
      this.mapFormData.actAccount = actAccount;
      // 兼容后端传值存在空字符串情况
      let appKeyConfig = {};
      if (this.interfaceInfo.appKeyConfig) {
        appKeyConfig = JSON.parse(this.interfaceInfo.appKeyConfig) || {};
      } else {
        appKeyConfig = {};
      }
      this.appkeyMapFormData.is_open = appKeyConfig.is_open || 0;
      let appKeyAttrViewNameList = []
      if (paramMappingRisk.indexOf('APPKEY') < 0) {
        appKeyAttrViewNameList = appKeyConfig.attr_view_name
          ? appKeyConfig.attr_view_name.split("/")
          : [];
      }
      this.appkeyMapFormData.params = appKeyAttrViewNameList;
      this.appkeyMapFormData.appKeyConfig = appKeyConfig;
    },
  },
  async created() {
    await Promise.all([
      this.handleSearchInterfaceHasUatAndDockingSolutionType(),
      this.handleGetLabelListOptionList(),
    ]).catch((error) => {
      throw new Error(`created, ${error}`);
    });
    const { computeEditable } = this;
    if (computeEditable) {
      this.handleGetInterfaceDetail();
      await Promise.all([
        this.handleSearchJsfAliasList(),
        this.handleSearchMapFormParamsOptionList(),
      ]).catch((error) => {
        throw new Error(`created, ${error}`);
      });

    }
  },
};
</script>

<style lang="scss" scoped>
.jsf-add-or-edit-interface {
  .jsf-add-or-edit-interface__form-title {
    margin: 24px auto;
    width: 640px;
    text-align: center;

    .el-icon-success {
      font-size: 48px;
      color: #26a872;
    }

    .form-title__h1 {
      font-size: 18px;
      font-weight: 700;
    }
  }

  .jsf-add-or-edit-interface__api {
    margin: 0 auto;
    width: 580px;
  }

  .jsf-add-or-edit-interface__form {
    margin: 0 auto;
    width: 480px;
  }

  .jsf-add-or-edit-interface__button-wrapper {
    text-align: center;
  }
}
</style>