import gwApiRequest from "@/utils/gwApiRequest.js";

const OuterDomainApiPluginPreService = {
  /**
   * 定义查询回传API安全配置列表接口
   *
   * @see {@link YApi https://joyspace.jd.com/pages/j4DIh5WkNXlpWMIhL1MC}
   * @typedef {Object} OuterDomainPluginPreCondition
   * @property {number} OuterDomainPluginPreCondition.outerDomainId - 域名ID
   * @property {number} OuterDomainPluginPreCondition.url - URL
   *
   * @typedef {Object} Response 响应参数
   * @property {Object[]} Response.data - 返回数据
   * @property {number} Response.data[].id - ID
   * @property {string} Response.data[].code - 插件编码
   * @property {boolean} Response.data[].isEnabled - 是否启用
   *
   * @param {[OuterDomainPluginPreCondition]} data - 请求参数
   *
   * @returns {Promise.<Response>} 表示查询回传API安全配置列表接口返回响应参数的Promise对象
   */
  findListByCondition: (data) =>
    gwApiRequest.post(
      "/OuterDomainApiPluginPreService/findListByCondition",
      JSON.stringify(data)
    ),

  /**
   * 定义查询回传API安全配置详情接口
   *
   * @see {@link YApi https://joyspace.jd.com/pages/j4DIh5WkNXlpWMIhL1MC}
   * @typedef {Object} OuterDomainPluginPreCondition
   * @property {number} OuterDomainPluginPreCondition.code - 插件编码
   * @property {number} OuterDomainPluginPreCondition.outerDomainId - 域名ID
   * @property {number} OuterDomainPluginPreCondition.outerApiId - 内调外APIID
   *
   * @typedef {Object} Response 响应参数
   * @property {Object} Response.data - 返回数据
   * @property {number} Response.data.id - ID
   * @property {Object} Response.data.config - 配置
   * @property {string|null} Response.data.config.pluginConfig - 插件配置
   *
   * @param {[OuterDomainPluginPreCondition]} data - 请求参数
   *
   * @returns {Promise.<Response>} 表示查询回传API安全配置列表接口返回响应参数的Promise对象
   */
  findDetailByCondition: (data) =>
    gwApiRequest.post(
      "/OuterDomainApiPluginPreService/findDetailByCondition",
      JSON.stringify(data)
    ),

  /**
   * 定义保存回传API安全配置接口
   *
   * @see {@link YApi https://joyspace.jd.com/pages/j4DIh5WkNXlpWMIhL1MC}
   * @typedef {Object} OuterDomainPluginPreCondition
   * @property {number} OuterDomainPluginPreCondition.id - 插件ID 新增不传
   * @property {number} OuterDomainPluginPreCondition.outerDomainId - 域名ID
   * @property {number} OuterDomainPluginPreCondition.outerApiId - 内调外APIID
   * @property {number} OuterDomainPluginPreCondition.code - 插件编码
   * @property {Object} OuterDomainPluginPreCondition.config - 配置
   * @property {string} OuterDomainPluginPreCondition.config.name - 插件名称
   * @property {string|null} OuterDomainPluginPreCondition.config.pluginConfig - 插件配置
   *
   * @typedef {Object} Response 响应参数
   * @property {Object[]} Response.data - 返回数据
   * @property {number} Response.data[].id - ID
   *
   * @param {[OuterDomainPluginPreCondition]} data - 请求参数
   *
   * @returns {Promise.<Response>} 表示保存回传API安全配置接口返回响应参数的Promise对象
   */
  save: (data) =>
    gwApiRequest.post(
      "/OuterDomainApiPluginPreService/save",
      JSON.stringify(data)
    ),
};

export default OuterDomainApiPluginPreService;
