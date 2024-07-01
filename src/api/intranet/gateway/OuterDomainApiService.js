import gwApiRequest from "@/utils/gwApiRequest.js";

const OuterDomainApiService = {
  /**
   * 定义回传API发起审批/发布API接口
   *
   * @see {@link YApi https://joyspace.jd.com/pages/wrd3EfcaB1a83F0ONlyz}
   * @typedef {Object} ApiDepotDto
   * @property {number} ApiDepotDto.id - ID
   * @property {number} ApiDepotDto.categoryId - 分类ID
   * @property {number} ApiDepotDto.categoryName - 分类名称
   * @property {number} ApiDepotDto.dailyCall - 日调用量
   * @property {number} ApiDepotDto.tps - tps
   * @property {number} ApiDepotDto.reason - 发布原因
   *
   * @typedef {Object} Response 响应参数
   * @property {Object} Response.data - 返回数据
   *
   * @param {[ApiDepotDto]} data - 请求参数
   *
   * @returns {Promise.<Response>} 表示回传API发起审批/发布API接口返回响应参数的Promise对象
   */
  publishOuterApi: (data) =>
    gwApiRequest.post(
      "/OuterDomainApiService/publishOuterApi",
      JSON.stringify(data)
    ),

  /**
   * 定义查询回传API更新记录列表接口
   *
   * @see {@link YApi http://}
   * @typedef {Object} OuterDomainApiRecordCondition
   * @property {number} OuterDomainApiRecordCondition.apiId - API ID
   *
   * @typedef {Object} Response 响应参数
   * @property {Object} Response.data - 返回数据
   * @property {number} Response.data.total - 数据总数
   * @property {Object[]} Response.data.rows - 表格数据
   * @property {number} Response.data.rows[].id - ID
   * @property {string} Response.data.rows[].createTime - 创建时间 1686015519000
   * @property {string} Response.data.rows[].updateUser - 更新人
   * @property {string} Response.data.rows[].approveUser - 审批人
   * @property {string} Response.data.rows[].pluginConfig - 插件配置
   *
   * @param {[OuterDomainApiRecordCondition]} data - 请求参数
   *
   * @returns {Promise.<Response>} 表示查询回传API更新记录列表接口返回响应参数的Promise对象
   */
  findChangeRecordList: (data) =>
    gwApiRequest.post(
      "/OuterDomainApiService/findChangeRecordList",
      JSON.stringify(data)
    ),
};

export default OuterDomainApiService;
