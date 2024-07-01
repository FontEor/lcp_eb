import request_msg from "@/utils/request_msg.js";

const businesstype = {
  /**
   * 根据对接方案编码校验其是否已存在
   *
   * @see {@link YApi http://}
   *
   * @typedef {Object} Response 响应参数
   * @property {Object[]} Response.data - 返回数据 所属分类列表
   * @property {string} Response.data[].code - 所属分类编码
   * @property {string} Response.data[].name - 所属分类名称
   *
   * @param {Object} params 请求参数
   * @param {string} params.solutionType - 对接方案类型
   *
   * @returns {Promise.<Response>} 表示根据对接方案编码校验其是否已存在返回响应参数的Promise对象
   */
  findBySolutionType: params =>
    request_msg.get("/businesstype/findBySolutionType", { params })
};

export default businesstype;
