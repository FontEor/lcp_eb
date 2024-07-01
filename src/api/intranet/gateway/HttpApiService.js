import gwApiRequest from "@/utils/gwApiRequest.js";

const HttpApiService = {
  /**
   * 根据接口URI关键词查询API仓库接口列表
   *
   * @see {@link YApi http://}
   * @typedef {Object} Search 查询关键词对象
   * @property {string} Search.keyWords - 接口URI关键词
   *
   * @typedef {Object} Response 响应参数
   * @property {Object[]} Response.data - 返回数据 - 接口URI列表
   *
   * @param {Search[]} data - 由第一个元素是查询关键词对象组成的数组
   * @returns {Promise.<Response>} 表示根据接口URI关键词查询API仓库接口列表返回响应参数的Promise对象
   */
  queryFuzzyUrlRelease: data =>
    gwApiRequest.post("/HttpApiService/queryFuzzyUrlRelease", data),

  /**
   * 根据接口URI查询接口所属分组列表
   *
   * @see {@link YApi http://}
   * @typedef {Object} Search 查询URI对象
   * @property {string} Search.url - 接口URI
   *
   * @typedef {Object} Response 响应参数
   * @property {Object[]} Response.data - 返回数据 - 接口所属分组列表
   *
   * @param {Search[]} data - 由第一个元素是查询URI对象组成的数组
   * @returns {Promise.<Response>} 表示根据接口URI查询接口所属分组列表返回响应参数的Promise对象
   */
  queryReleaseDomainForUrl: data =>
    gwApiRequest.post("/HttpApiService/queryReleaseDomainForUrl", data),

  /**
   * 根据接口URI与所属分组查询接口基本信息
   *
   * @see {@link YApi http://}
   * @typedef {Object} Search 查询接口对象
   * @property {string} Search.url - 接口URI
   * @property {string} Search.domainCode - 接口所属分组
   *
   * @typedef {Object} Response 响应参数
   * @property {Object} Response.data - 返回数据 - 接口基本信息
   * @property {number} Response.data.id - 接口ID
   * @property {string} Response.data.name - 接口名称
   * @property {string} Response.data.remark - 接口描述
   * @property {string} Response.data.categoryName - 接口分组名称
   * @property {number} Response.data.testClusterId - 测试环境服务器ID
   * @property {string} Response.data.testClusterName - 测试环境服务器名称
   * @property {number} Response.data.uatClusterId - 预发环境服务器ID
   * @property {string} Response.data.uatClusterName - 预发环境服务器名称
   * @property {number} Response.data.prodClusterId - 生产环境服务器ID
   * @property {string} Response.data.prodClusterName - 生产环境服务器名称
   * @property {string} Response.data.url - 公网URL
   *
   * @param {Search[]} data - 由第一个元素是查询接口对象组成的数组
   * @returns {Promise.<Response>} 表示根据接口URI与所属分组查询接口基本信息返回响应参数的Promise对象
   */
  findApiByCondition: data =>
    gwApiRequest.post("/HttpApiService/findApiByCondition", data),

  /**
   * 查询敏感标签级联列表数据
   *
   * @see {@link YApi http://}
   *
   * @typedef {Object} Response 响应参数
   * @property {Array} Response.data - 返回数据
   *
   * @returns {Promise.<Response>} 表示查询敏感标签级联列表数据返回响应参数的Promise对象
   */
  querySensitiveLabelForest: data =>
    gwApiRequest.post("/HttpApiService/querySensitiveLabelForest", data),
  /**
   * 查询最近七天是否有调用量
   *
   * @see {@link YApi http://}
   *
   * @typedef {Object} Response 响应参数
   * @property {Array} Response.data - 返回数据
   *
   * @returns {Promise.<Response>}查询最近七天是否有调用量返回参数的promise对象
   */
  queryIsCloudApiHaveCallCountByBizCode: data =>
    gwApiRequest.post(
      "/HttpApiService/queryIsCloudApiHaveCallCountByBizCode",
      data
    ),
  /**
   * 申请下线
   *
   * @see {@link YApi http://}
   *
   * @typedef {Object} Response 响应参数
   * @property {Array} Response.data - 返回数据
   *
   * @returns {Promise.<Response>}申请下线返回参数的promise对象
   */
  offlineCloudApi: data =>
    gwApiRequest.post("/HttpApiService/offlineCloudApi", data),
  /**
   * jsf接口下线 判断是否已经有发布成http
   */
  checkJsfApiOfflineHaveHttp: data =>
    gwApiRequest.post("/JsfApiService/checkJsfApiOfflineHaveHttp", data),
  /**
   * 下线Jsf接口
   */
  offlineJsfApi: data =>
    gwApiRequest.post("/JsfApiService/offlineJsfApi", data),
  /**
   * jsf方法下线 判断是否已经有发布成http
   */
  checkJsfApiMethodOfflineHaveHttp: data =>
    gwApiRequest.post("/JsfApiService/checkJsfApiMethodOfflineHaveHttp", data),
  /**
   * 下线Jsf方法
   */
  offlineJsfApiMethod: data =>
    gwApiRequest.post("/JsfApiService/offlineJsfApiMethod", data)
};

export default HttpApiService;
