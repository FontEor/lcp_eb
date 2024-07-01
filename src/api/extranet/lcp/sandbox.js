import request_msg from "@/utils/request_msg.js";

const sandbox = {
  /**
   * 沙箱联调-业务联调-运单号校验
   *
   * @see {@link YApi http://}
   *
   * @typedef {Object} Response 响应参数
   * @property {Object} Response.data - 返回数据 运单寄件信息
   * @property {string} Response.data.address - 寄件地址
   * @property {string} Response.data.sender - 寄件人
   *
   * @param {Object} params 请求参数
   * @param {string} params.waybillCode - 运单号
   * @returns {Promise.<Response>} 表示运单号校验返回的Promise对象
   */
  checkWaybillCodeExist: params =>
    request_msg.get("/sandbox/checkWaybillCodeExist", { params }),

  /**
   * 沙箱联调-业务联调-揽收
   *
   * @see {@link YApi http://}
   *
   * @typedef {Object} Response 响应参数
   * @property {Object} Response.data - 返回数据
   *
   * @param {Object} data 请求参数
   * @param {string} data.waybillCode - 运单号
   * @param {number} data.length - 包裹长
   * @param {number} data.width - 包裹宽
   * @param {number} data.height - 包裹高
   * @param {number} data.payment - 支付方式 4:寄付月结
   * @param {number} data.amount - 包裹数量
   * @param {number} data.weight - 重量
   * @param {string} data.itemType - 物品类型
   * @param {number} data.promiseTimeType - 时效类型 1:特惠送 2:特快送
   * @returns {Promise.<Response>} 表示运单号校验返回的Promise对象
   */
  orderCollection: data => request_msg.post("/sandbox/orderCollection", data),

  /**
   * 沙箱联调-业务联调-轨迹查询
   *
   * @see {@link YApi http://}
   *
   * @typedef {Object} Response 响应参数
   * @property {Object} Response.data - 返回数据
   * @property {string} Response.data.address - 收件地址
   * @property {string} Response.data.recipient - 收件人
   * @property {Object[]} Response.data.trackList - 轨迹数据列表
   * @property {number} Response.data.trackList[].operateTime - 操作时间戳
   * @property {string} Response.data.trackList[].operateMessage - 操作消息
   *
   * @param {Object} params 请求参数
   * @param {string} params.waybillCode - 运单号
   * @param {string} params.bizCode - 业务编码
   * @param {string} params.sceneName - 场景名称
   * @returns {Promise.<Response>} 表示运单号校验返回的Promise对象
   */
  trackQuery: params => request_msg.get("/sandbox/trackQuery", { params })
};

export default sandbox;
