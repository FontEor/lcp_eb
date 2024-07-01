import request from "@/utils/request.js";

const openBiz = {
  /**
   * 为对接方案设置访问控制
   * @description 创建对接方案单元后为其设置访问控制
   * @param {number} unitId - 对接方案ID
   * @param {number} appType - 访问控制应用类型 2:ISV/商家应用 4:合作伙伴应用
   * @param {object} access - 访问控制的JSON {type:"oauth2"} {type:"hmac"}
   * @param {string} createUser - 对接方案创建用户，"" JSON.stringify(JsonObject)
   */
  postCreateBizUnitAccessData: ([params]) =>
    request({
      url: "/bizaccess/insertBizAccessPre",
      method: "post",
      data: params
    }),

  /**
   * 获取对接方案的访问控制配置
   * @description 内网用户进入技术开放-对接方案，点击管理进入详情页时根据对接方案ID获取对接方案访问控制配置
   * @params number unitId - 对接方案ID
   */
  postBizUnitAccessData: ([params]) =>
    request({
      url: "/bizaccess/getBizAccessByUnitId",
      method: "get",
      params: { bizUnitId: params }
    }),

  /**
   * 调整对接方案-接口列表表格顺序
   * @description 内网用户进入技术开放-对接方案，点击管理进入详情页时接口列表中拖拽改变表格顺序
   * @param1 number apiId - apiID
   * @param1 number seq - 调整到的目标顺序 从1开始
   */
  postApiChangeSeqData: data =>
    request({
      url: "/bizapinterface/updateApiSeq",
      method: "post",
      data
    }),

  /**
   * 隐藏对接方案API
   * @description 内网用户进入技术开放-对接方案，点击管理进入详情页时接口列表中隐藏已发布对接方案API
   * @params number id - apiID
   */
  postApiHideData: ([params]) =>
    request({
      url: "/bizapinterface/hiddenApi",
      method: "get",
      params: params
    }),

  /**
   * 取消隐藏对接方案API
   * @description 内网用户进入技术开放-对接方案，点击管理进入详情页时接口列表中取消隐藏已发布对接方案API
   * @param {number} id - apiID
   */
  postApiHideCancelData: ([params]) =>
    request({
      url: "/bizapinterface/hiddenCancelApi",
      method: "get",
      params: params
    }),

  /**
   * 根据对接方案ID判断当前用户是否为该对接方案的产品负责人或研发负责人
   * @description 内网用户进入技术开放-对接方案，点击管理进入详情页时接口列表中隐藏或取消隐藏操作前检查当前用户是否为该对接方案的产品负责人或研发负责人，若当前用户不是，则返回产品负责人和研发负责人ERP
   * @param number unitId - unitId
   */
  postUnitCheckPrincipalData: ([params]) =>
    request({
      url: "/bizunit/checkPrincipal",
      method: "get",
      params: { id: params }
    }),

  /**
   * 隐藏对接方案SDK
   * @description 内网用户进入技术开放-对接方案，点击管理进入详情页时SDK信息中隐藏已发布对接方案SDK
   * @params number id - sdkID
   */
  postSdkHideData: data =>
    request({
      url: "/sdk/hide",
      method: "post",
      data,
      headers: {
        "Content-Type": "application/json"
      }
    }),

  /**
   * 取消隐藏对接方案SDK
   * @description 内网用户进入技术开放-对接方案，点击管理进入详情页时SDK信息中取消隐藏已发布对接方案SDK
   * @params number id - sdkID
   */
  postSdkHideCancelData: data =>
    request({
      url: "/sdk/hideCancel",
      method: "post",
      data,
      headers: {
        "Content-Type": "application/json"
      }
    }),

  /**
   * 隐藏对接方案消息
   * @description 内网用户进入技术开放-对接方案，点击管理进入详情页时消息列表中隐藏已发布对接方案消息
   * @params number id - messageID
   */
  postMessageHideData: params =>
    request({
      url: "/bizmsg/hide",
      method: "post",
      data: params,
      headers: {
        "Content-Type": "application/json"
      }
    }),

  /**
   * 取消隐藏对接方案消息
   * @description 内网用户进入技术开放-对接方案，点击管理进入详情页时消息列表中取消隐藏已发布对接方案消息
   * @param {number} id - messageID
   */
  postMessageHideCancelData: params =>
    request({
      url: "/bizmsg/hideCancel ",
      method: "post",
      data: params,
      headers: {
        "Content-Type": "application/json"
      }
    }),

  /**
   * 查询对接方案信息
   * @description 内网用户进入技术开放-对接方案，点击管理进入详情页时根据对接方案ID查询对接方案信息
   * @param1 {}  - 分页器 直接传空对象
   * @param2 {number} id - 对接方案ID
   */
  postBizUnitData: ([params1, params2]) =>
    request({
      url: "/bizUnits",
      method: "post",
      data: [params1, params2]
    })
};

export default openBiz;
