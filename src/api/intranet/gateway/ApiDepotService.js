import gwApiRequest from "@/utils/gwApiRequest.js";

const ApiDepotService = {
  /**
   * 根据接口中/英文名称关键词查询API列表数据
   *
   * @see {@link YApi http://}
   * @typedef {Object} Search 查询关键词对象
   * @property {string} Search.searchKeyWord - 接口中/英文名称关键词
   *
   * @typedef {Object} Response 响应参数
   * @property {Object[]} Response.data - 返回数据
   * @property {string} Response.data[].qualifiedName - 接口名称
   * @property {string} Response.data[].businessCategoryName - 分类名称
   *
   * @param {Search[]} data - 由第一个元素是查询关键词对象组成的数组
   * @returns {Promise.<Response>} 表示根据接口中/英文名称关键词查询API列表数据返回响应参数的Promise对象
   */
  queryBlurryApiList: data =>
    gwApiRequest.post(
      "/ApiDepotService/queryBlurryApiList",
      JSON.stringify(data)
    ),

  /**
   * 根据接口名称查询方法列表数据
   *
   * @see {@link YApi http://}
   * @typedef {Object} Search 查询接口名称对象
   * @property {string} Search.qualifiedName - 接口名称
   *
   * @typedef {Object} Response 响应参数
   * @property {Object[]} Response.data - 返回数据
   * @property {number} Response.data[].id - 方法ID
   * @property {string} Response.data[].name - 方法名称
   *
   * @param {Search[]} data - 由第一个元素是查询接口名称对象组成的数组
   * @returns {Promise.<Response>} 表示根据接口名称查询方法列表数据返回响应参数的Promise对象
   */
  queryApiMethodRelease: data =>
    gwApiRequest.post(
      "/ApiDepotService/queryApiMethodRelease",
      JSON.stringify(data)
    ),

  /**
   * 根据接口名称查询接口JSF别名列表数据
   *
   * @see {@link YApi http://}
   * @typedef {Object} Search 查询接口名称对象
   * @property {string} Search.qualifiedName - 接口名称
   *
   * @typedef {Object} Response 响应参数
   * @property {Object[]} Response.data - 返回数据
   * @property {string} Response.data[].alias - JSF别名
   *
   * @param {Search[]} data - 由第一个元素是查询接口名称对象组成的数组
   * @returns {Promise.<Response>} 表示根据接口名称查询接口JSF别名列表数据返回响应参数的Promise对象
   */
  queryAliasByQualifiedName: data =>
    gwApiRequest.post(
      "/ApiDepotService/queryAliasByQualifiedName",
      JSON.stringify(data)
    )
};

export default ApiDepotService;
