import gwApiRequest from "@/utils/gwApiRequest.js";

const OuterDomainService = {
  /**
   * 创建分组
   *
   * @see {@link YApi http://11.51.194.248:3000/project/5/interface/api/934}
   * @typedef {Object} Group 分组对象
   * @property {string} Group.domain - 分组英文名称
   * @property {string} Group.name - 分组中文名称
   * @property {string} Group.intr - 分组描述
   * @property {string} Group.source - 分组来源
   *
   * @param {Group[]} data - 由第一个元素是分组对象组成的数组
   * @returns {Promise} 表示内调外创建分组返回的Promise对象
   */
  create: data =>
    gwApiRequest.post("/OuterDomainService/create", JSON.stringify(data)),

  /**
   * 根据分组中英文名称关键词模糊查询分组列表
   *
   * @see {@link YApi http://11.51.194.248:3000/project/5/interface/api/938}
   * @typedef {Object} Search 查询关键词对象
   * @property {string} Search.fuzzyDomain - 中文名称或英文名称
   *
   * @typedef {Object} Response 响应参数
   * @property {Object[]} Response.data - 返回数据
   * @property {number} Response.data[].id - 分组ID
   * @property {string} Response.data[].domain - 分组英文名称
   * @property {string} Response.data[].name - 分组中文名称
   *
   * @param {Search[]} data - 由第一个元素是查询关键词对象组成的数组
   * @returns {Promise.<Response>} 表示查询分组列表返回响应参数的Promise对象
   */
  query: data =>
    gwApiRequest.post("/OuterDomainService/query", JSON.stringify(data))
};

export default OuterDomainService;
