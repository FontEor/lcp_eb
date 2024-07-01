import gwApiRequest from "@/utils/gwApiRequest.js";

const ApiManagerService = {
  /**
   * 根据API名称或URL查询内调外API列表
   *
   * @see {@link YApi http://11.51.194.248:3000/project/5/interface/api/902}
   * @typedef {Object} Pagination 分页器对象
   * @property {number} Pagination.pageSize - 当前显示数据条数
   * @property {number} Pagination.page - 当前页码
   * @typedef {Object} Search 查询关键词对象
   * @property {string} Search.searchKeyWord - API名称或URL
   *
   * @typedef {Object} Response 响应参数
   * @property {Object} Response.data - 返回数据
   * @property {number} Response.data.total - 内调外API数据总数
   * @property {Object[]} Response.data.list - 表格数据
   * @property {number} Response.data.list[].id - API的ID
   * @property {string} Response.data.list[].name - 中文名称
   * @property {string} Response.data.list[].url - URI
   * @property {string} Response.data.list[].intr - 描述
   * @property {string} Response.data.list[].updateUser - 更新人
   * @property {string} Response.data.list[].updateTime - 更新时间
   *
   * @param {(Pagination|Search)[]} data - 由第一个元素是分页器对象且第二个元素是查询关键词对象组成的数组
   * @returns {Promise.<Response>} 表示查询内调外API列表返回响应参数的Promise对象
   */
  queryOuterApiByCondition: (data) =>
    gwApiRequest.post(
      "/ApiManagerService/queryOuterApiByCondition",
      JSON.stringify(data)
    ),

  /**
   * 注册内调外API
   *
   * @see {@link YApi http://11.51.194.248:3000/project/5/interface/api/906}
   * @typedef {Object} BasicInfo 基本信息对象
   * @property {string} BasicInfo.name 中文名称
   * @property {string} BasicInfo.appKey 所属应用appKey
   * @property {string} BasicInfo.appName 所属应用名称
   * @property {number} BasicInfo.domainId 所属分组ID
   * @property {string} BasicInfo.domain 所属分组Code
   * @property {string} BasicInfo.url URI
   * @property {string} BasicInfo.source 来源 LCP
   *
   * @param {BasicInfo[]} data - 由第一个元素是基本信息对象组成的数组
   * @returns {Promise} 表示注册内调外API返回的Promise对象
   */
  saveOuterApi: (data) =>
    gwApiRequest.post("/ApiManagerService/saveOuterApi", JSON.stringify(data)),

  /**
   * 查询API基本信息
   * @param {string} id  APIID
   * @returns
   */
  queryOuterApiBaseInfo: (data) =>
    gwApiRequest.post(
      "/ApiManagerService/queryOuterApiBaseInfo",
      JSON.stringify(data)
    ),

  /**
   * 更新API基本信息
   * @param {number} id
   * @param {string} name 中文名称 没修改不用传
   * @param {string} intr 功能描述
   * @param {number} visibility 可见性：0:公有，1私有
   * @param {number} dataLevel 0 公开数据 1秘密数据 2机密数据 3绝密数据
   * @param {number} domainId 所属分组ID  没修改不用传
   * @param {string} domain 所属分组Code  没修改不用传
   * @param {number} lcpAppId 所属应用ID  没修改不用传
   * @param {string} lcpAppName 所属应用名字 没修改不用传
   * @param {string} lcpAppKey 所属应用key 没修改不用传
   * @param {string} productPrincipal
   * @param {string} developPrincipal
   * @param {string} operationPrincipal
   * @returns
   */
  updateOuterApiBaseInfo: (data) =>
    gwApiRequest.post(
      "/ApiManagerService/updateOuterApiBaseInfo",
      JSON.stringify(data)
    ),

  /**
   * 查询API文档
   * @param {*} bizId 文档id
   * @param {*} apiType 1-jsf, 2-http, 3-路由，4-外部服务域API
   * @returns
   */
  findApiDoc: (data) =>
    gwApiRequest.post("/ApiManagerService/findApiDoc", JSON.stringify(data)),

  /**
   * 更新文档 页面编辑
   * @param {number} id
   * @param {string} type  1.jsf 2.http 4.outer
   * @param {object } inParamList
   * @param {object } outParamList
   * @param {object } errorCodeList
   * @returns
   */
  updateApiDoc: (data) =>
    gwApiRequest.post("/ApiManagerService/updateApiDoc", JSON.stringify(data)),

  /**
   *
   * @param {number} id  详情ID
   * @returns
   */
  verifyOuterApi: (data) =>
    gwApiRequest.post(
      "/ApiManagerService/verifyOuterApi",
      JSON.stringify(data)
    ),
};

export default ApiManagerService;
