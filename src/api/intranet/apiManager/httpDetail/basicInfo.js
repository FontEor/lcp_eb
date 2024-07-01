import request_noMsg from "@/utils/request_noMsg.js";
import gwApiRequest from "@/utils/gwApiRequest.js";
import request from "@/utils/request.js"

// API管理-HTTP协议API详情-API基本信息统一注册API
const basicInfo = {
  /**
   * API管理-选择HTTP协议-点击管理进入HTTP协议API详情-API基本信息-模糊查询集群列表
   * @param {string} name 集群中文名称关键字
   */
  queryList: params => gwApiRequest.post("/ApiManagerService/queryCloudClusterList", [params]),

  /**
   * API管理-选择HTTP协议-点击管理进入HTTP协议API详情-API基本信息-新建集群
   * @param {string} name 集群中文名称
   * @param {number} useType 集群用途 1:服务路由 2:网关API路由 3:网关流路由
   * @param {number} type 集群类型 2:HTTP
   * @param {string} desc 集群描述
   * @param {object[]} cloudServerList IP信息
   * @param {number} connectTimeout 连接超时时间
   * @param {number} sendTimeout 发送超时时间
   * @param {number} readTimeout 读取超时时间
   * @param {number} reliveTimeout 自动复活时间
   */
  cloudClusterSave: data => gwApiRequest.post("/ApiManagerService/saveCloudCluster", [data]),

  /**
   * 更新集群
   * @param {number} id 集群id
   * @param {string} name 集群中文名称
   * @param {number} useType 集群用途 1:服务路由 2:网关API路由 3:网关流路由
   * @param {number} type 集群类型 2:HTTP
   * @param {string} desc 集群描述
   * @param {object[]} cloudServerList IP信息
   * @param {number} connectTimeout 连接超时时间
   * @param {number} sendTimeout 发送超时时间
   * @param {number} readTimeout 读取超时时间
   * @param {number} reliveTimeout 自动复活时间
   */
  cloudClusterUpdate: data => gwApiRequest.post("/ApiManagerService/updateCloudCluster", [data]),

  /**
   * API管理-选择HTTP协议-点击管理进入HTTP协议API详情-API基本信息-模糊查询产品、研发、运营负责人
   * @param {string} erp ERP账号关键字
   */
  findUser: params => request_noMsg.get("/hrInfo/findUser", { params }),

  /**
   * API管理-选择HTTP协议-点击管理进入HTTP协议API详情-API基本信息-查询指定的用户是否在当前的开发商团队下
   * @param {string} erp - ERP账号关键字
   */
  findSupplierUserByErp: params =>
    request_noMsg.get("/supplier/findSupplierUserByErp", { params }),

  /**
   * API管理-选择HTTP协议-点击管理进入HTTP协议API详情-API基本信息-保存API基本信息
   * @param {number} id HTTP协议apiID
   * @param {string} name 中文名称
   * @param {string} remark 功能描述
   * @param {number} visibility 可见性 0: "公开", 1: "私有"
   * @param {number} dataLevel 数据保密级别 0: "公开数据（L1）", 1: "秘密数据（L2）", 2: "机密数据（L3）", 3: "绝密数据（L4）"
   * @param {number} type 提供API方式 1: "JSF服务", 2: "HTTP服务", 5: "路由服务"
   * @param {number} testClusterId 测试环境集群ID
   * @param {string} testClusterName 测试环境集群名称
   * @param {number} uatClusterId 预发环境集群ID
   * @param {string} uatClusterName 预发环境集群名称
   * @param {number} prodClusterId 生产环境集群ID
   * @param {string} prodClusterName 生产环境集群名称
   * @param {string} testAlias 测试环境JSF别名
   * @param {string} method 方法名
   * @param {string} uatAlias 预发环境JSF别名
   * @param {string} prodAlias 生产环境JSF别名
   * @param {number} domainId 所属分组ID
   * @param {string} domainCode 所属分组编码
   * @param {string} domainName 所属分组名称
   * @param {number} lcpAppId 所属应用ID
   * @param {string} lcpAppKey 所属应用编码
   * @param {string} lcpAppName 所属应用名称
   * @param {string} productPrincipal 产品负责人ERP
   * @param {string} developPrincipal 研发负责人ERP
   * @param {string} operationPrincipal 运营负责人ERP
   */
  saveBaseInfo: data => gwApiRequest.post("/HttpApiService/saveBaseInfo", [data]),

  /**
   * 查询JSF接口名
   * @param {number} pageNumb 当前页数
   * @param {number} pageSize 每页数据条数
   * @param {string} businessCategoryId 业务分类ID
   * @param {number} searchType 搜索方法 1:API搜索 2:方法搜索
   * @param {string} searchKeyWord 搜索关键字
   */
  queryApiReleaseByCondition: data =>
    gwApiRequest.post(
      "/ApiDepotService/queryApiReleaseByCondition",
      JSON.stringify(data)
    ),

  /**
   * 根据接口名查询别名
   * @param {string} qualifiedName 接口名
   */
  queryAliasByInterface: data =>
    gwApiRequest.post(
      "/JsfApiMetaService/queryAliasByInterface",
      JSON.stringify(data)
    ),

  /**
   * 根据接口名和别名查方法
   * @param {string} qualifiedName 接口名
   * @param {string} jsfAlias 别名
   * @param {string} method 方法名
   */
  getMethodList: data =>
    gwApiRequest.post(
      "/ApiDepotService/queryApiReleaseByCondition",
      JSON.stringify(data)
    ),

  /**
   * 根据接口名查询别名
   * @param {string} qualifiedName 接口名
   */
  queryMethodByInterface: data =>
    gwApiRequest.post(
      "/JsfApiMetaService/queryMethodByInterface",
      JSON.stringify(data)
    ),
  /**
   * 查询敏感标签级联列表数据
   */
  getSensitiveLabelForest: () => gwApiRequest.post("/HttpApiService/querySensitiveLabelForest"),
};

export default basicInfo;
