import request_msg from "@/utils/request_msg.js";

const asset = {
  /**
   * 根据资产维度查询待交接资产列表数据
   *
   * @see {@link YApi http://11.51.194.248:3000/project/5/interface/api/1017}
   *
   * @typedef {Object} Response 响应参数
   * @property {Object} Response.data - 返回数据
   * @property {Object[]} Response.data.list - 待交接资产列表
   * @property {number} Response.data.list[].id - 资产ID
   * @property {number} Response.data.list[].assetBizType - 资产业务 102:对接方案 103:内网应用 231:API 232:API分组
   * @property {string} Response.data.list[].assetName - 资产名称
   * @property {string} Response.data.list[].assetDesc - 资产描述
   * @property {string} Response.data.list[].owner - 资产所有者
   *
   * @param {Object} data 请求参数
   * @param {number} data.assetBelong - 所属资产维度 1-个人资产，2-团队资产
   * @param {number} data.assetBizType - 资产业务 102:对接方案 103:内网应用 231:API 232:API分组
   *
   * @returns {Promise.<Response>} 表示根据资产维度查询待交接资产列表数据返回响应参数的Promise对象
   */
  queryAssetList: data => request_msg.post("/asset/queryAssetList", data)
};

export default asset;
