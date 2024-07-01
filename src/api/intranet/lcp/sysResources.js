import request_noMsg from "@/utils/request_noMsg.js";
import request_msg from "@/utils/request_msg.js";

const sysResources = {
  /**
   * 根据软件系统ID与资源类别查询软件系统系统资源列表数据 常错误码10029表示列表中没有根节点
   *
   * @see {@link YApi http://11.51.194.248:3000/project/5/interface/api/221}
   *
   * @typedef {Object} Response 响应参数
   * @property {Object} Response.data - 返回数据
   *
   * @param {Object} params 请求参数
   * @param {number} params.productId - 软件系统ID
   * @param {string} params.category - 资源类别 {"MENUTREE":"菜单资源"}
   *
   * @returns {Promise.<Response>} 表示根据软件系统ID与资源类别查询软件系统系统资源列表数据返回响应参数的Promise对象
   */
  queryResourcesList: params =>
    request_noMsg.get("/sysResources/queryResourcesList", { params }),

  /**
   * 根据软件系统ID与资源类别创建资源根节点
   *
   * @see {@link YApi http://11.51.194.248:3000/project/5/interface/api/215}
   *
   * @typedef {Object} Response 响应参数
   * @property {Object} Response.data - 返回数据
   *
   * @param {Object} data 请求参数
   * @param {number} data.productId - 软件系统ID
   * @param {string} data.category - 资源类别 {"MENUTREE":"菜单资源"}
   *
   * @returns {Promise.<Response>} 表示根据软件系统ID与资源类别创建资源根节点返回响应参数的Promise对象
   */
  initSysResources: data =>
    request_msg.post("/sysResources/initSysResources", data)
};

export default sysResources;
