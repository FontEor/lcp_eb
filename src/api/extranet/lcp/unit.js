import request from "@/utils/request.js";

const unit = {
  /**
   * 应用管理-配置-接口列表
   * @param {string} unitCode  对接方案Code
   * @param {string} callDirection  调用方向，callDirection： 前端传值为2，内调外方向  前端传值为1，外调内方向
   * @param {string} appCode  应用编码
   *
   */
  queryApiList: data =>
    // request.post("/bizapinterface/outer/unit/queryApiList", data),
    request.post(
      "/bizapinterface/outer/unit/queryBizOrderApiList",
      data
    ),
  /** 获取列表
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
   * @returns {Promise.<Response>}
   */
  searchAppLogsList: data => {
    // gwLogRequest.post("/logs/searchAppLogsList", data, { headers })
    return request.post("/loggingTool/outerLogListQuery", data);
  }
};
export default unit;
