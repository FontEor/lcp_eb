import request_msg from "@/utils/request_msg.js";

const releaseRecord = {
  /**
   * 根据对接方案接口ID查询接口文档版本列表
   *
   * @see {@link YApi http://11.51.194.248:3000/project/5/interface/api/1110}
   *
   * @typedef {Object} Response 响应参数
   * @property {Object} Response.data - 返回数据
   * @property {number} Response.data.total - 数据总条数
   * @property {Object[]} Response.data.list - 版本列表
   * @property {number} Response.data.list.id - 版本ID
   * @property {string} Response.data.list.version - 历史记录版本号
   *
   * @param {number} apiId 路径参数 接口ID
   * @param {Object} params 请求参数
   * @param {number} params.pageNum - 页码
   * @param {number} params.pageSize	- 每页显示的条数，默认30条
   *
   * @returns {Promise.<Response>} 表示根据对接方案接口ID查询接口文档历史记录返回响应参数的Promise对象
   */
  api$apiId: (apiId, params) =>
    request_msg.get(`/releaseRecord/api${apiId}`, { params }),

  /**
   * 根据版本ID查询接口文档历史版本详情
   *
   * @see {@link YApi http://11.51.194.248:3000/project/5/interface/api/1111}
   *
   * @typedef {Object} Response 响应参数
   * @property {Object} Response.data - 返回数据
   *
   * @param {number} id 路径参数 接口ID
   *
   * @returns {Promise.<Response>} 表示根据版本ID查询接口文档历史版本详情返回响应参数的Promise对象
   */
  apiDetails$id: (id) => request_msg.get(`/releaseRecord/apiDetails${id}`),
};

export default releaseRecord;
