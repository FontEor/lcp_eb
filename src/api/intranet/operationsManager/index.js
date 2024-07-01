import request_msg from "@/utils/request_msg.js";

const operationsManager = {
  /**
   * 对接方案和API分组模糊查询
   *
   * @see {@link YApi http://11.51.194.248:3000/project/5/interface/api/1028}
   * @typedef {Object} Response 响应参数
   * @property {Object[]} Response.data - 对接方案名称/API分组名称
   * @property {string} Response.data[].name - 对接方案编码/API分组名称
   * @property {string} Response.data[].code - 对接方案编码/API分组编码
   * @property {string} Response.data[].domainType - 服务与类型，1对接方案；2API分组
   *
   * @returns {Promise.<Response>}
   */
  getLogDomain: params => request_msg.get("/log/domain", { params }),

  /**
   * 日志查询
   *
   * @see {@link YApi http://11.51.194.248:3000/project/5/interface/api/1029}
   * @param {Object} params 请求参数
   * @param {string} params.domainCode -服务域编码（对接方案或者API分组编码）
   * @param {number} params.startTime -时间范围开始时间
   * @param {number} params.endTime	-时间范围结束时间
   * @param {string} params.env -运行环境
   * @param {string} params.apiUrl -API的URI
   * @param {string} params.status
   * @param {string} params.appKey
   * @param {string} params.pin
   * @param {string} params.reqKeyWords
   * @param {string} params.resKeyWords
   * @param {string} params.statusCode
   *
   */
  getLogExecutionLogs: data =>
    request_msg.post("/log/executionLogs", data),
  /**
   * 日志详情查询
   *
   * @see {@link YApi http://11.51.194.248:3000/project/5/interface/api/1030}
   * @param {Object} params 请求参数
   * @param {number} params.id
   * @param {string} params.appKey
   * @param {string} params.domainCode
   * @param {string} params.domainType
   * @param {string} params.env
   * @param {string} params.apiUrl
   *
   */
  getLogExecutionLogDetail: data =>
    request_msg.post("/log/executionLogDetail", data),
  /**
   * 指定对接方案或API分组的URL查询
   *
   * @see {@link YApi http://11.51.194.248:3000/project/5/interface/api/1031}
   * @param {Object} params 请求参数
   * @param {number} params.domainType -服务与类型，1对接方案；2API分组
   * @param {string} params.unitCode	-对接方案编码/API分组编码
   * @param {string} params.queryLike -apiURL模糊查询
   *
   */
  logUrlQuery: data => request_msg.post("/log/urlQuery", data)
};

export default operationsManager;
