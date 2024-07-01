import gwApiRequest from "@/utils/gwApiRequest.js";

const CloudDomainService = {
  /**
   * 根据接口ID查询API分组信息
   *
   * @see {@link YApi http://}
   * @typedef {Object} Search 查询接口对象
   * @property {number} Search.id - 接口URI关键词
   *
   * @typedef {Object} Response 响应参数
   * @property {Object} Response.data - 返回数据
   * @property {string} Response.data.domainCode - 分组编码
   * @property {string} Response.data.domainName - 分组名称
   *
   * @param {Search[]} data - 由第一个元素是查询接口对象组成的数组
   * @returns {Promise.<Response>} 表示根据接口ID查询API分组信息返回响应参数的Promise对象
   */
  getApiDomain: data =>
    gwApiRequest.post("/CloudDomainService/getApiDomain", data)
};

export default CloudDomainService;
