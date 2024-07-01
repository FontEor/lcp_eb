import request_msg from "@/utils/request_msg.js";

const supplier = {
  /**
   * 团队管理员根据模糊查询团队列表数据
   *
   * @see {@link YApi http://11.51.194.248:3000/project/5/interface/api/1025}
   * 
   * @typedef {Object} Response 响应参数
   * @property {Object[]} Response.data - 返回数据 团队列表
   * @property {string} Response.data[].code - 团队编码
   * @property {string} Response.data[].name - 团队名称
   *
   * @param {Object} params 请求参数
   * @param {string} params.supplierName - 团队名称关键词
   *
   * @returns {Promise.<Response>} 表示团队管理员根据模糊查询团队列表数据返回响应参数的Promise对象
   */
  queryInnerSupplier: params =>
    request_msg.get("/supplier/queryInnerSupplier", { params }),


  /**
   * 校验自定义团队编辑权限
   */
  checkCustomizeTeamEditingRights: params =>
    request_msg.get("/supplier/checkCustomizeTeamEditingRights", { params }),

  /**
   * 修改自定义团队
   */
  updateTeamName: (params) => {
    const headers = { "Content-Type": "application/x-www-form-urlencoded" };
    return request_msg.post("/supplier/updateTeamName", null, { params, headers });
  },
};

export default supplier;
