import request_noMsg from "@/utils/request_noMsg.js";
import gwApiRequest from "@/utils/gwApiRequest.js";

// API管理-jsf协议API详情统一注册API
const jsfDetail = {
  /**
   * API管理-选择JSF协议-点击管理进入JSF协议API详情-显示顶栏信息
   * @param {string} id JSF协议apiID
   */
  findApiBaseInfo: data =>
    gwApiRequest.post(
      "/ApiManagerService/findApiBaseInfo",
      JSON.stringify(data)
    ),

  /**
   * API管理-选择JSF协议-点击管理进入JSF协议API详情-点击发布按钮校验
   * @param {string} id JSF协议apiID
   */
  verifyApiSummaryFull: params =>
    gwApiRequest.post(
      "/ApiManagerService/verifyPublishApi",
      JSON.stringify([params])
    ),
  /**
   * 方法列表-根据方法名或方法中文名方法列表
   * @param {number} pageSize 每页数据条数
   * @param {number} page 当前页数
   *
   * @param {string} name JSF类型API方法名或方法中文名
   * @param {string} qualifiedName JSF接口名
   */
  queryMethodListByInterfaceOrCnName: data =>
    gwApiRequest.post(
      "/ApiManagerService/queryMethodListByInterfaceOrCnName",
      JSON.stringify(data)
    ),

  /**
   * 方法列表-用户填写表单添加方法
   * @param {string} apiId 接口ID
   * @param {string} qualifiedName 接口名称
   * @param {string} methodName JSF方法名
   * @param {string} cnName 方法中文名称
   * @param {string} methodRemark 方法描述
   */
  addApiMethod: data =>
    gwApiRequest.post("/ApiManagerService/addApiMethod", JSON.stringify(data)),

  /**
   * 方法列表-编辑文档-根据方法ID获取方法文档数据
   * @param {string} methodId 方法ID
   */
  findApiDoc: data =>
    gwApiRequest.post("/ApiManagerService/findApiDoc", JSON.stringify(data)),

  /**
   * 方法列表-编辑文档-快速维护-JSF拉取-根据JSF接口名获取JSF别名列表
   * @param {string} qualifiedName JSF接口名
   */
  queryAliasByInterface: data =>
    gwApiRequest.post(
      "/JsfApiMetaService/queryAliasByInterface",
      JSON.stringify(data)
    ),

  /**
   * 方法列表-编辑文档-快速维护-JSF拉取-根据JSF接口名、方法名、别名拉取元数据
   * @param {string} qualifiedName JSF接口名
   * @param {string} methodName JSF方法名
   * @param {string} alias JSF别名
   * @param {string} methodId JSF方法ID
   * @param {string} judgeType 参数类型 1:请求参数 2:响应参数
   */
  quickMaintainApiDocByJsf: data =>
    gwApiRequest.post(
      "/ApiManagerService/quickMaintainApiDocByJsf",
      JSON.stringify(data)
    ),

  /**
   * 方法列表-编辑文档-保存文档
   * @param {number} type API类型 1:JSF 2:HTTP
   * @param {number} id 接口ID
   * @param {string} qualifiedName JSF接口名
   * @param {string} name JSF方法名
   * @param {string} cnName JSF方法中文名
   * @param {string} remark 备注
   * @param {[object]]} inParamList 请求参数列表数据
   * @param {[object]]} outParamList 响应参数列表数据
   * @param {[object]]} errorCodeList 错误码列表数据
   */
  updateApiDoc: data =>
    gwApiRequest.post("/ApiManagerService/updateApiDoc", JSON.stringify(data)),

  /**
   * 方法列表-编辑文档-快速维护-XML上传
   * @param {string} jssKey jssKey
   * @param {number} type 类型 1:JSF 2:HTTP
   * @param {string} methodName JSF方法名
   * @param {number} methodId JSF方法ID
   * @param {number} judgeType 参数类型 1:请求参数 2:响应参数
   */
  quickMaintainApiDocByXml: data =>
    gwApiRequest.post(
      "/ApiManagerService/quickMaintainApiDocByXml",
      JSON.stringify(data)
    ),
  /**
   * 方法列表-编辑文档-快速维护-JSON上传
   * @param {string} jssKey jssKey
   * @param {number} type 类型 1:JSF 2:HTTP
   * @param {number} apiId
   * @param {number} judgeType 参数类型 1:请求参数 2:响应参数
   */
  quickMaintainApiDocByJson: data =>
    gwApiRequest.post(
      "/ApiManagerService/quickMaintainApiDocByJson",
      JSON.stringify(data)
    ),
  /** 查询JSF方法配置
   * @param {string} interfaceName 接口名称
   * @param {string} methodName JSF方法名
   * yapi: http://11.51.194.248:3000/project/22/interface/api/1037
   */
  findMethodConfig: data =>
    gwApiRequest.post("/JsfApiService/findMethodConfig", JSON.stringify(data)),
  /**
   * 保存JSF方法配置
   * @param {string} interfaceName 接口名称
   * @param {string} methodName JSF方法名
   * @param {string} effectRange 生效范围: 1-全部生效, 0-部分生效
   * @param {string} excpsWhites 异常白名单，多个用逗号分隔
   * @param {string} effectDomains 生效方案编码，多个用逗号分隔
   * yapi: http://11.51.194.248:3000/project/22/interface/api/1038
   */
  saveMethodConfig: data =>
    gwApiRequest.post("/JsfApiService/saveMethodConfig", JSON.stringify(data)),
  /**
   * 查询方法的一级入参类型列表
   * @param {string} interfaceName 接口名称
   * @param {string} methodName JSF方法名
   */
  queryOneLevelParamTypeForMethod: data =>
    gwApiRequest.post(
      "/JsfApiService/queryOneLevelParamTypeForMethod",
      JSON.stringify(data)
    )
};

export default jsfDetail;
