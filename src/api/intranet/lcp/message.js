import request_msg from "@/utils/request_msg.js";

const message = {
  /**
   * 根据标题关键词查询消息中心列表数据
   *
   * @see {@link YApi http://}
   * @typedef {Object} Response 响应参数
   * @property {Object} Response.data - 返回数据
   * @property {Array} Response.data.list - 消息列表
   * @property {number} Response.data.list[].id - ID
   * @property {number} Response.data.list[].messageId - 消息ID
   * @property {string} Response.data.list[].title - 消息标题
   * @property {number} Response.data.list[].isRead - 消息状态 0:未读 1:已读
   * @property {string} Response.data.list[].createTime - 通知时间
   * @property {number} Response.data.total - 数据总条数
   *
   * @param {Object} params 请求参数
   * @param {string} params.title - 消息标题关键词
   * @param {number} params.isRead - 消息状态 0:未读 1:已读
   * @param {number} params.msgType - 消息类型 1:平台消息 2:API消息
   * @param {number} params.pageNumb - 当前页页码
   * @param {number} params.pageSize - 每页数据条数
   *
   * @returns {Promise.<Response>} 表示根据标题关键词查询消息中心列表数据返回响应参数的Promise对象
   */
  getMsgSignList: params =>
    request_msg.get("/message/getMsgSignList", { params }),

  /**
   * 根据ID与消息ID标题关键词查询消息中心列表数据
   *
   * @see {@link YApi http://}
   * @typedef {Object} Response 响应参数
   * @property {string} Response.data - 返回数据 消息详情Markdown字符串
   *
   * @param {Object} data 请求参数
   * @param {number} data.id - ID
   * @param {number} data.messageId - 消息ID
   *
   * @returns {Promise.<Response>} 表示根据ID与消息ID标题关键词查询消息中心列表数据返回响应参数的Promise对象
   */
  modifyMsgSignRead: data =>
    request_msg.post("/message/modifyMsgSignRead", data),

  /**
   * 查询当前用户未读消息数量
   *
   * @see {@link YApi http://}
   * @typedef {Object} Response 响应参数
   * @property {string} Response.data - 返回数据 未读消息数量
   *
   * @returns {Promise.<Response>} 表示查询当前用户未读消息数量返回响应参数的Promise对象
   */
  getMessageSignCount: () => request_msg.get("/message/getMessageSignCount"),

  /**
   * 根据ID删除消息
   *
   * @see {@link YApi http://}
   * @param {Object} params 请求参数
   * @param {number} params.id - ID
   *
   * @returns {Promise.<Response>} 表示根据ID删除消息返回响应参数的Promise对象
   */
  delMsg: params => request_msg.get("/message/delMsg", { params })
};

export default message;
