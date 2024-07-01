import request_msg from "@/utils/request_msg.js";

const api = {
  /**
   * 根据接口名称与方法名称查询其下设置参数映射接收账号的入参字段级联列表数据
   *
   * @see {@link YApi http://}
   * @typedef {Object} Response 响应参数
   * @property {Object[]} Response.data - 返回数据
   * @property {string} Response.data[].code - 分类编码
   * @property {string} Response.data[].name - 分类名称
   *
   * @param {Object} params 请求参数
   * @param {string} params.qualifiedName - 对接方案ID
   * @param {string} params.methodName - 对接方案ID
   *
   * @returns {Promise.<Response>} 表示根据接口名称与方法名称查询其下设置参数映射接受账号的入参字段级联列表数据返回响应参数的Promise对象
   */
  findApiMtpParamsList: params =>
    request_msg.get("/api/findApiMtpParamsList", { params })
};

export default api;
