import request_msg from "@/utils/request_msg.js";

const hrInfo = {
  /**
   * 根据ERP账号关键词查询内网账户
   *
   * @see {@link YApi http://}
   * @typedef {Object} Response 响应参数
   * @property {Object[]} Response.data - 返回数据
   *
   * @param {Object} params 请求参数
   * @param {string} params.erp - ERP账号关键词
   *
   * @returns {Promise.<Response>} 表示根据ERP账号关键词查询内网账户返回响应参数的Promise对象
   */
  findUser: (params) => request_msg.get("/hrInfo/findUser", { params }),

  /**
   * 获取用户信息
   */
  getUserInfo: () => request_msg.get("/hrInfo/getUserInfo"),
};

export default hrInfo;
