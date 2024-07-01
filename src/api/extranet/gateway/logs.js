import gwLogRequest from "@/utils/gwLogRequest";

// 外网-应用管理-日志工具
const logs = {
  /**
   * 日志列表查询接口
   * @param {String } appKey
   * @param {String } bizUnit 对接方案
   * @param {String } url API的URL
   * @param {String } responseParameter 出参
   * @param {String } resquestParameter 入参
   * @param {String } pin 京东pin
   * @param {String } status 响应状态
   * @param {String } statusCode 状态码
   * @param {String } env 运行环境
   * @param {Number} startTime 开始时间
   * @param {Number} endTime 结束时间
   * @returns
   *
   * @param {String} appKey
   * @param {String} unitCode 对接方案编码
   * @param {String} env 运行环境
   * @param {Number} apiId api的id
   * @param {Number} pageNumb 从1开始
   * @param {Number} pageSize 分页大小
   * @param {Number} startTime
   * @param {Number} endTime
   * @param {String} statusCode 状态码
   * @param {String} status 成功和失败
   * @param {String} pin 京东pin
   * @param {String} requestParameter 入参
   * @param {String} responseParameter 出参
   * @returns
   *
   *
   *
   *
   */
  searchAppLogsList: (data) => {
    return gwLogRequest.post("/logs/searchAppLogsList", data, { headers })
},
  /**
   * 日志详情查询接口
   * @param {String} appKey
   * @returns
   */
  searchAppLogsDetails: (data, headers) =>
    gwLogRequest.post("/logs/searchApplogDetails", data, { headers })
};
export default logs;
