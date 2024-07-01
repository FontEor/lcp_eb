import request_msg from "@/utils/request_msg.js";

const sysResourcesExtendedField = {
  /**
   * 根据软件系统ID与资源类别查询系统资源扩展字段配置
   *
   * @see {@link YApi http://11.51.194.248:3000/project/5/interface/api/362}
   *
   * @typedef {Object} Response 响应参数
   * @property {Object} Response.data - 返回数据
   *
   * @param {Object} params 请求参数
   * @param {number} params.productId - 软件系统ID
   * @param {string} params.category - 资源类别 {"MENUTREE":"菜单资源"}
   *
   * @returns {Promise.<Response>} 表示根据软件系统ID与资源类别查询系统资源扩展字段配置返回响应参数的Promise对象
   */
  queryConfig: params =>
    request_msg.get("/sysResourcesExtendedField/queryConfig", { params })
};

export default sysResourcesExtendedField;
