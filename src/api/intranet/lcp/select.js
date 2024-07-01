import request_msg from "@/utils/request_msg.js";

const select = {
  /**
   * 查询应用列表
   *
   * @see {@link YApi http://11.51.194.248:3000/project/5/interface/api/918}
   * @typedef {Object} Response 响应参数
   * @property {Object[]} Response.data - 返回数据
   * @property {string} Response.data[].code - 平台应用编码
   * @property {string} Response.data[].label - 平台应用名称
   * @property {string} Response.data[].value - 平台应用ID
   *
   * @returns {Promise.<Response>} 表示查询应用列表返回响应参数的Promise对象
   */
  findAppListForSelect: () => request_msg.get("/select/findAppListForSelect")
};

export default select;
