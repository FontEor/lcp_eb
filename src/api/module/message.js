import request from "@/utils/request"

const message = {
  /**
   * 根据应用KEY查询应用消息列表
   * @description 外网用户进入开发管理-应用管理-应用详情-消息列表，查看可订阅/已订阅的消息列表
   * @param1 {number} pageSize - 每页信息条数（分页大小）
   * @param1 {number} page - 页数，第几页
   * @param1 {string} sidx - 排序字段，"updateTime"
   * @param1 {string} sord - 顺序（升序、降序），"desc"
   * @param2 {string} isSub - 订阅状态. 0:未订阅 1:已订阅
   * @param2 {string} queryLike - 查询条件，对接方案名称/消息中文名称
   * @params3 string appKey - 应用KEY
   */
  postFindByAppKeyData: (data) =>
    request({
      url: "/bizmsg/findByAppKey",
      method: "post",
      data,
    }),

  /**
   * 订阅消息
   * @description 开发管理-应用管理-应用详情-消息列表中的订阅消息操作
   * @params1 string appKey - 应用KEY
   * @params2 number id - 消息ID
   */
  postSubscribeData: (data) =>
    request({
      url: "/bizmsg/subMessage",
      method: "post",
      data
    }),

  /**
   * 取消订阅消息
   * @description 开发管理-应用管理-应用详情-消息列表中的取消订阅消息操作
   * @params1 string appKey - 应用KEY
   * @params2 number id - 消息ID
   */
  postUnsubscribeData: (data) =>
    request({
      url: "/bizmsg/unsubscribe",
      method: "post",
      data
    })
};

export default message;
