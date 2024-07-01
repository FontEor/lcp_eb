<template>
  <div class="http-add-or-edit-interface">
    <el-page-header :content="computeEditable | formatPageHeaderContentAndGoOnButtonText"
      @back="handleClickGoBackButton" />

    <Steps :active="active" :titleList="titleList" />

    <section class="http-add-or-edit-interface__form-title">
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
    <el-form v-show="active === 0" class="http-add-or-edit-interface__form" ref="interfaceForm" label-width="120px"
      :model="interfaceFormData" :rules="interfaceFormRules">
      <el-form-item prop="url" label="接口的URI">
        <el-select v-model="interfaceFormData.url" style="width: 100%" placeholder="输入接口URI，如：/TraceQueryJsf/queryTrace"
          :disabled="computeEditable" :filterable="true" :remote="true" :remote-method="remoteMethodSearchInterfaceUrl"
          @change="handleChangeInterfaceUrl">
          <el-option v-for="(item, index) in urlList" :key="index" :label="item" :value="item" />
        </el-select>
      </el-form-item>
      <el-form-item label="接口所属分组" :prop="computeSelectInterfaceFormCodeOrCnNameProp">
        <el-select v-model="
          interfaceFormData[computeSelectInterfaceFormCodeOrCnNameProp]
        " style="width: 100%" placeholder="请选择接口所属的分组" filterable :disabled="computeEditable"
          @change="handleChangeInterfaceCode">
          <el-option v-for="item in groupList" :key="item.id" :label="item.cnName" :value="item.code" />
        </el-select>
      </el-form-item>
      <template v-if="baseEnv === 'test'">
        <el-form-item label="测试环境服务器" prop="clusterName">
          <el-input v-model="interfaceFormData.clusterName" disabled style="width: 100%" />
        </el-form-item>
      </template>
      <template v-else-if="baseEnv === 'uat' || baseEnv === 'prod'">
        <el-form-item label="预发环境服务器" prop="shadowboxClusterName">
          <el-input v-model="interfaceFormData.shadowboxClusterName" disabled style="width: 100%" />
        </el-form-item>
        <el-form-item label="生产环境服务器" prop="clusterName">
          <el-input v-model="interfaceFormData.clusterName" disabled style="width: 100%" />
        </el-form-item>
      </template>
    </el-form>
    <!-- 第二步 设置接口的数据安全级别 -->
    <el-form v-show="active === 1" class="http-add-or-edit-interface__form" ref="securityLevelForm" label-width="120px"
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
    <el-form v-show="active === 2" class="http-add-or-edit-interface__form" ref="urlForm" label-width="160px"
      :model="urlFormData" :rules="urlFormRules">
      <el-form-item label="URL" prop="apiUrl">
        <el-input v-model.trim="urlFormData.apiUrl" :disabled="true" placeholder="/order/updateOrder"
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
        </span> -->
        <!-- <el-switch
          v-model="urlFormData.isAuthorize"
          active-color="#26A872"
          :active-value="1"
          :inactive-value="0"
          :disabled="computeEditable"
        ></el-switch> -->
        <!-- <span slot="label">
          接口响应超时&nbsp;
          <el-tooltip content="可配置网关调用京东业务系统的读取超时时间。" placement="top">
            <i class="el-icon-help-solid" />
          </el-tooltip>
        </span>
        <el-input placeholder="请输入内容" v-model.number="urlFormData.apiResTimeout" active-color="#26A872">
          <template slot="append">毫秒</template>
        </el-input> -->

      </el-form-item>
    </el-form>
    <!-- 第四步 设置参数映射 -->
    <el-form v-show="active === 3" class="http-add-or-edit-interface__form" ref="mapForm" label-width="210px"
      :model="mapFormData">
      <el-form-item prop="pin" label="从平台接收京东PIN">
        <el-switch v-model="mapFormData.pin" active-color="#26A872"></el-switch>
      </el-form-item>
      <el-form-item prop="tenementCode" label="从平台接收调用方tenantCode">
        <el-switch v-model="mapFormData.tenementCode" active-color="#26A872"></el-switch>
      </el-form-item>
    </el-form>

    <div class="http-add-or-edit-interface__button-wrapper">
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
  </div>
</template>

<script>
import Steps from "@/components/Steps.vue";
import lcp from "@/api/intranet/lcp/index.js";
import gateway from "@/api/intranet/gateway/index.js";

export default {
  name: "HttpAddOrEditInterface",
  components: { Steps },
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
        url: "",
        code: "",
        cnName: "",
        shadowboxClusterId: null,
        clusterId: null,
        shadowboxClusterName: "",
        clusterName: "",
      },
      interfaceFormRules: {
        url: [
          { required: true, message: "url不能为空", trigger: "blur" },
          {
            min: 1,
            max: 100,
            message: "长度在 1 到 100 个字符",
          },
          {
            pattern: /^\//,
            message: "格式不正确,以“/”开头！",
          },
          {
            validator: function (rule, value, callback) {
              if (value.indexOf(":") > 0 || value.indexOf("：") > 0) {
                callback(new Error("url不能包含“：”"));
              } else {
                callback();
              }
            },
          },
        ],
        code: [
          {
            required: true,
            message: "请选择接口所属分组",
          },
        ],
      },
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
      urlList: [],
      groupList: [],
      baseEnv: window.env.baseEnv,
      methodId: 0,
      apiName: "",
      apiRemark: "",
      apiType: "",
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
      urlFormData: {
        apiUrl: "", apiResTimeout: 5000,
        // isAuthorize: 0
      },
      bizType: 2,
      // 参数映射表单
      mapFormData: {
        httpConfig: [],
        pin: false,
        tenementCode: false,
      },
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
        "若你的业务需要pin和tenantCode，为防止在接口调用的过程中黑客篡改调用方传入的tenantCode和京东pin，可开启参数映射功能。开启后将使用平台解析后的pin或tenantCode进行鉴权校验，保障业务安全。",
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
      return !!id;
    },
    // 计算当前是否为编辑态
    computeSelectInterfaceFormCodeOrCnNameProp() {
      const { computeEditable } = this;
      return computeEditable ? "cnName" : "code";
    },
    // 计算上一步按钮可见性
    computePreviousStepButtonVisible() {
      const { active, titleList } = this;
      return active > 0 && active < titleList.length - 1;
    },
  },
  methods: {
    // 根据对接方案ID查询对接方案类型
    async getBizUnitPreById() {
      const { unitId } = this;
      const id = unitId;
      const params = { id };
      return await lcp.bizunit.getBizUnitPreById(params);
    },
    // 根据接口URI关键词查询API仓库接口列表
    async queryFuzzyUrlRelease(keyWords) {
      const data = [{ keyWords, sceneType: 1 }];
      return await gateway.HttpApiService.queryFuzzyUrlRelease(data);
    },
    // 根据接口URI查询接口所属分组列表
    async queryReleaseDomainForUrl() {
      const { url } = this.interfaceFormData;
      const data = [{ url }];
      return await gateway.HttpApiService.queryReleaseDomainForUrl(data);
    },
    // 根据接口URI与所属分组查询接口基本信息
    async findApiByCondition() {
      const { url, code } = this.interfaceFormData;
      const domainCode = code;
      const data = [{ url, domainCode, sceneType: 1 }];
      return await gateway.HttpApiService.findApiByCondition(data);
    },
    // 查询敏感标签级联列表数据
    async querySensitiveLabelForest() {
      return await gateway.HttpApiService.querySensitiveLabelForest();
    },
    // 保存添加/编辑接口信息
    async saveInterface() {
      const { unitId, interfaceInfo, methodId } = this;
      const id = interfaceInfo.id || undefined;
      const type = 2;
      let { apiName, apiRemark, apiType } = this;
      apiName = apiName || undefined;
      apiRemark = apiRemark || undefined;
      apiType = apiType || undefined;
      const {
        url,
        code,
        shadowboxClusterId,
        clusterId,
        shadowboxClusterName,
        clusterName,
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
      const { apiUrl, apiResTimeout } = this.urlFormData;
      const { httpConfig } = this.mapFormData;
      const data = {
        unitId,
        id,
        type,
        methodId,
        apiName,
        apiRemark,
        apiType,
        url,
        code,
        shadowboxClusterId,
        clusterId,
        shadowboxClusterName,
        clusterName,
        dataLevel,
        labelList,
        apiUrl,
        apiResTimeout,
        httpConfig,
      };
      return await lcp.bizapinterface.saveInterface(data);
    },
    //根据接口ID查询API分组信息
    async getApiDomain() {
      const { methodId } = this;
      const id = methodId;
      const data = [{ id }];
      return await gateway.CloudDomainService.getApiDomain(data);
    },
    // 根据接口ID查询接口详情
    async getInterfaceDetailById() {
      const { id } = this.interfaceInfo;
      const params = { id };
      return await lcp.bizapinterface.getInterfaceDetailById(params);
    },

    // 点击返回按钮操作
    handleClickGoBackButton() {
      this.$emit("update:activeView", "interfaceList");
    },
    // 查询对接方案类型操作，判断设置公网URL步骤中是否需要用户授权表单项的可见性
    async handleSearchDockingSolutionType() {
      const {
        data: { type },
      } = await this.getBizUnitPreById().catch((error) => {
        throw new Error(
          `handleSearchDockingSolutionType getBizUnitPreById, ${error}`
        );
      });
      this.bizType = type || 2;
    },
    // 接口表单接口URI远程搜索
    async remoteMethodSearchInterfaceUrl(query) {
      if (query) {
        const { data } = await this.queryFuzzyUrlRelease(query).catch(
          (error) => {
            throw new Error(
              `remoteMethodSearchInterfaceUrl queryFuzzyUrlRelease, ${error}`
            );
          }
        );
        this.urlList = data || [];
      } else {
        this.urlList = [];
      }
    },
    // 改变接口URI选择值操作，查询URI下接口分组
    async handleChangeInterfaceUrl() {
      const { computeSelectInterfaceFormCodeOrCnNameProp } = this;
      const { data } = await this.queryReleaseDomainForUrl().catch((error) => {
        throw new Error(
          `handleChangeInterfaceUrl queryReleaseDomainForUrl, ${error}`
        );
      });
      this.groupList = data || [];
      this.interfaceFormData[computeSelectInterfaceFormCodeOrCnNameProp] = "";
      const [shadowboxClusterId, clusterId] = [0, 0];
      const [shadowboxClusterName, clusterName] = ["", ""];
      Object.assign(this.interfaceFormData, {
        shadowboxClusterId,
        clusterId,
        shadowboxClusterName,
        clusterName,
      });
    },
    // 改变接口所属分组选择值操作，查询各个环境服务器信息
    async handleChangeInterfaceCode() {
      const {
        data: {
          id,
          name,
          remark,
          categoryName,
          url,
          testClusterId,
          testClusterName = "",
          uatClusterId,
          uatClusterName = "",
          prodClusterId,
          prodClusterName = "",
        },
      } = await this.findApiByCondition().catch((error) => {
        throw new Error(
          `handleChangeInterfaceCode findApiByCondition, ${error}`
        );
      });
      this.methodId = id;
      this.apiName = name;
      this.apiRemark = remark;
      this.apiType = categoryName;
      this.urlFormData.apiUrl = url;

      let clusterId = testClusterId;
      let shadowboxClusterId = null;
      let clusterName = testClusterName;
      let shadowboxClusterName = "";

      const hashMap = {
        test: () => { },
        uat: () => {
          clusterId = prodClusterId;
          shadowboxClusterId = uatClusterId;
          clusterName = prodClusterName;
          shadowboxClusterName = uatClusterName;
        },
        prod: () => {
          clusterId = prodClusterId;
          shadowboxClusterId = uatClusterId;
          clusterName = prodClusterName;
          shadowboxClusterName = uatClusterName;
        },
      };
      hashMap[this.baseEnv]();

      Object.assign(this.interfaceFormData, {
        clusterId,
        shadowboxClusterId,
        clusterName,
        shadowboxClusterName,
      });
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
    // 点击下一步按钮操作
    handleClickNextStepButton() {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => {
        const { active, titleList } = this;
        const hashMap = [
          "interfaceForm",
          "securityLevelForm",
          "urlForm",
          "mapForm",
        ];
        this.nextStepLoading = true;
        this.$refs[hashMap[active]].validate(async (valid) => {
          if (valid) {
            if (active === titleList.length - 2) {
              this.handleGetHttpConfig();
              await this.saveInterface().catch((error) => {
                throw new Error(
                  `handleClickNextStepButton saveInterface, ${error}`
                );
              });
              this.$emit("updateDetailHeaderInfo");
            }
            this.active += 1;
          } else {
            return false;
          }
        });
        this.nextStepLoading = false;
      }, 300);
    },
    // 获取参数映射httpConfig操作
    handleGetHttpConfig() {
      const pinItem = {
        source: {
          name: "pin",
          type: 4,
        },
        target: 1,
        t_name: "pin",
        urlCoding: 0,
      };
      const tenementCodeItem = {
        source: {
          name: "tenementCode",
          type: 4,
        },
        target: 1,
        t_name: "tenementCode",
        urlCoding: 0,
      };
      this.mapFormData.httpConfig = [];
      this.mapFormData.pin && this.mapFormData.httpConfig.push(pinItem);
      this.mapFormData.tenementCode &&
        this.mapFormData.httpConfig.push(tenementCodeItem);
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
        ];
        formRefList.forEach((item) => {
          this.$refs[item].resetFields();
        });
      }
      this.active = 0;
    },
    // 获取接口详情操作
    async handleGetInterfaceDetail() {
      const { dataLevel, labelList } = this.interfaceInfo;
      this.securityLevelFormData.dataLevel = dataLevel || 0;
      this.securityLevelFormData.labelList = labelList
        ? labelList.map(({ labelPath }) => labelPath.split("/"))
        : [];
      const {
        data: {
          methodId,
          apiUrl,
          shadowboxClusterId,
          clusterId,
          shadowboxClusterName,
          clusterName,
          apiResTimeout,
          httpConfig,
        },
      } = await this.getInterfaceDetailById().catch((error) => {
        throw new Error(
          `handleGetInterfaceDetail getInterfaceDetailById, ${error}`
        );
      });
      this.methodId = methodId;
      const url = apiUrl;
      Object.assign(this.interfaceFormData, {
        url,
        shadowboxClusterId,
        clusterId,
        shadowboxClusterName,
        clusterName,
      });
      Object.assign(this.urlFormData, { apiUrl, apiResTimeout });
      this.mapFormData.httpConfig = httpConfig || [];
      this.mapFormData.pin = this.mapFormData.httpConfig
        .map(({ t_name }) => t_name)
        .includes("pin");
      this.mapFormData.tenementCode = this.mapFormData.httpConfig
        .map(({ t_name }) => t_name)
        .includes("tenementCode");
    },
    // 获取接口所属分组操作
    async handleGetInterfaceCodeAndCnName() {
      const {
        data: { domainCode, domainName },
      } = await this.getApiDomain().catch((error) => {
        throw new Error(
          `handleGetInterfaceCodeAndCnName getApiDomain, ${error}`
        );
      });
      this.interfaceFormData.code = domainCode || "";
      this.interfaceFormData.cnName = domainName || "";
    },
  },
  async created() {
    await this.handleSearchDockingSolutionType().catch((error) => {
      throw new Error(`created handleSearchDockingSolutionType, ${error}`);
    });
    const { computeEditable } = this;
    if (computeEditable) {
      await this.handleGetInterfaceDetail().catch((error) => {
        throw new Error(`created handleGetInterfaceDetail, ${error}`);
      });
      await this.handleGetInterfaceCodeAndCnName().catch((error) => {
        throw new Error(`created handleGetInterfaceCodeAndCnName, ${error}`);
      });
    }
    await this.handleGetLabelListOptionList().catch((error) => {
      throw new Error(`created handleGetLabelListOptionList, ${error}`);
    });
  },
};
</script>

<style lang="scss" scoped>
.http-add-or-edit-interface {
  .http-add-or-edit-interface__form-title {
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

  .http-add-or-edit-interface__form {
    margin: 0 auto;
    width: 480px;
  }

  .http-add-or-edit-interface__button-wrapper {
    text-align: center;
  }
}
</style>
