import request_msg from "@/utils/request_msg.js";

const assetTransfer = {
  /**
   * 根据申请主题和申请状态查询资产交接申请数据
   *
   * @see {@link YApi http://11.51.194.248:3000/project/5/interface/api/1014}
   *
   * @typedef {Object} Response 响应参数
   * @property {Object} Response.data - 返回数据 资产交接申请数据
   * @property {Object[]} Response.data.list - 资产交接申请数据列表
   * @property {number} Response.data.list[].id - 申请ID
   * @property {string} Response.data.list[].transferType - 接收方类型 1:个人 2:团队
   * @property {string} Response.data.list[].targetName - 接收方
   * @property {number} Response.data.list[].status - 申请状态 1:审核中 2:通过 3:驳回
   * @property {number} Response.data.list[].createTime - 申请时间
   *
   * @param {Object} params 请求参数
   * @param {string} params.subject - 资产交接申请主题
   * @param {number} params.status - 资产交接申请状态
   * @param {number} params.pageNumb - 当前页页码
   * @param {number} params.pageSize - 每页数据条数
   *
   * @returns {Promise.<Response>} 表示根据申请主题和申请状态查询资产交接申请数据返回响应参数的Promise对象
   */
  queryAssetTransferOrderList: params =>
    request_msg.get("/assetTransfer/queryAssetTransferOrderList", { params }),

  /**
   * 提交资产交接申请
   *
   * @see {@link YApi http://11.51.194.248:3000/project/5/interface/api/1023}
   *
   * @typedef {Object} Response 响应参数
   * @property {number} Response.data - 返回数据 资产交接申请ID
   *
   * @param {Object} data 请求参数
   * @param {string} data.subject - 资产交接申请主题
   * @param {number} data.transferType - 接收方类型 1:个人 2:团队
   * @param {string} data.targetCode - 资产接收方编码 ERP或团队编码
   * @param {string} data.targetName - 资产接收方名称 姓名或团队名称
   * @param {Object[]} data.items - 资产交接列表
   * @param {number} data.items[].assetId - 资产ID
   * @param {number} data.items[].assetBizType - 资产业务 102:对接方案 103:内网应用 231:API 232:API分组
   * @param {string} data.items[].assetName - 资产名称
   * @param {string} data.items[].assetDesc - 资产描述
   *
   * @returns {Promise.<Response>} 表示根据申请主题和申请状态查询资产交接申请数据返回响应参数的Promise对象
   */
  submitOrder: data => request_msg.post("/assetTransfer/submitOrder", data),

  /**
   * 根据申请ID查询资产交接详情列表数据
   *
   * @see {@link YApi http://11.51.194.248:3000/project/5/interface/api/1016}
   *
   * @typedef {Object} Response 响应参数
   * @property {Object} Response.data - 返回数据 资产交接申请详情数据
   * @property {Object[]} Response.data.list - 资产交接申请详情数据列表
   * @property {number} Response.data.list[].transferType - 接收方类型 1:个人 2:团队
   * @property {number} Response.data.list[].assetBizType - 资产业务 102:对接方案 103:内网应用 231:API 232:API分组
   * @property {number} Response.data.list[].assetType - 资产类型
   * @property {string} Response.data.list[].target - 资产接收方编码 ERP或团队编码
   * @property {string} Response.data.list[].assetName - 资产名称
   *
   * @param {Object} params 请求参数
   * @param {string} params.orderId - 资产交接申请ID
   *
   * @returns {Promise.<Response>} 表示根据申请ID查询资产交接详情列表数据返回响应参数的Promise对象
   */
  queryAssetTransferOrderItemList: params =>
    request_msg.get("/assetTransfer/queryAssetTransferOrderItemList", {
      params
    })
};

export default assetTransfer;
