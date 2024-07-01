import request from "@/utils/request.js";

const appManager = {
  /**
   * 根据应用ID获取应用信息
   * @description 外网用户进入开发管理-应用管理，点击管理进入应用详情-对接方案，点击订阅新的对接方案时需获取应用信息
   * @param {number} id - 应用ID
   */
  getAppData: params =>
    request({
      url: "/app/getApp",
      method: "get",
      params
    }),

  /**
   * 根据应用KEY与应用类型查询应用可申请订阅的对接方案单元
   * @description 外网用户进入开发管理-应用管理，点击管理进入应用详情-对接方案，点击订阅新的对接方案时需展示可申请订阅的对接方案单元
   * @params1 string appKey - 应用Key
   * @params2 number appType - 应用类型 2:ISV/商家应用 4:合作伙伴应用
   */
  postFindBizUnitVoListData: ([params1]) =>
    request({
      url: "/bizunit/findBizUnitVoList",
      method: "get",
      params: { appKey: params1 }
    }),

  /**
  * 根据应用KEY与应用类型查询应用可申请订阅的对接方案单元，带分页
  * @description 外网用户进入开发管理-应用管理，点击管理进入应用详情-对接方案，点击订阅新的对接方案时需展示可申请订阅的对接方案单元
  * @params1 string appKey - 应用Key
  * @params3 string pageNumb - 第几页
  * @params4 string pageSize	 - 每页显示条数
  * @params5 string unitName - 解决方案名称
  */
  findBizUnitVoListByPage: (params) =>
    request({
      url: "/bizunit/findBizUnitVoListByPage",
      method: "get",
      params
    }),

  /**
   * 提交申请订阅的对接方案单元表单
   * @description 外网用户进入开发管理-应用管理，点击管理进入应用详情-对接方案，点击订阅新的对接方案第二部提交表单
   * @param {number} unitId - 对接方案ID
   * @param {string} appKey - 应用Key
   * @param {string} appName - 应用名称
   * @param {string} remark - 申请理由
   */
  postSubscribeBizData: ([params]) =>
    request({
      url: "/bizunit/submitRecord",
      method: "post",
      data: params
    }),

  /**
   * 根据客户分组名称，查询客户分组列表
   * @description 外网用户进入开发管理-应用管理，点击管理进入应用详情-客户分组时，或输入客户分组名称点击查询按钮时，查询客户分组列表
   * @param {string} appCode - 应用编码
   * @param {string} groupName - 客户分组名称
   * @param {number} pageSize - 每页显示数据的条数
   * @param {number} pageNumb - 当前页码
   */
  getCustomerGroupListData: params =>
    request({
      url: "/app/findAppGroupList",
      method: "get",
      params
    }),

  /**
   * 根据客户分组ID查询详情
   * @description 外网-开发管理-应用管理-应用详情-客户分组，在客户分组表格中点击编辑时查询客户分组详情
   * @param {number} id - 客户分组ID
   */
  getCustomerGroupDetailData: params =>
    request({
      url: "/app/getAppGroupDetail",
      method: "get",
      params
    }),

  /**
   * 创建/更新客户分组信息
   * @description 外网-开发管理-应用管理-应用详情-客户分组，创建/编辑客户分组的表单提交
   * @param {number｜null} id - 客户分组ID，不传为创建，传值为更新
   * @param {string} appCode - 应用编码
   * @param {string} groupName - 客户分组名称
   * @param {string} desc - 客户分组描述
   * @param {[string]} pinList - 分组用户列表
   */
  postCustomerGroupSaveData: data =>
    request({
      url: "/app/saveAppGroup",
      method: "post",
      data
    }),

  /**
   * 删除客户分组信息
   * @description 外网-开发管理-应用管理-应用详情-客户分组，删除客户分组
   * @param {number} id - 客户分组ID
   */
  postCustomerGroupDeleteData: params =>
    request({
      url: "/app/deleteAppGroup",
      method: "post",
      params
    }),

  /**
   * 根据客户分组名称，查询客户分组列表noPage
   * @description 外网用户进入开发管理-应用管理，点击管理进入应用详情-客户分组时，或输入客户分组名称点击查询按钮时，查询客户分组列表
   * @param {string} appCode - 应用编码
   */
  getCustomerGroupListNoPageData: params =>
    request({
      url: "/app/findAppGroupListWithNoPage",
      method: "get",
      params
    }),

  /**
   * 根据应用编码和消息名称，查询客户分组消息回调地址
   * @description 外网用户进入开发管理-应用管理，点击管理进入应用详情-消息列表时，点击编辑按钮时，查询客户分组消息回调地址列表
   * @param {string} appCode - 应用编码
   * @param {string} msgName - 消息名称
   */
  getCustomerGroupMessageCallbackInfoData: params =>
    request({
      url: "/app/getMessageCallbackInfoList",
      method: "get",
      params
    }),

  /**
   * 根据应用编码、消息名称、消息接收方式和客户分组（最好有分组id）与回调地址组成的对象，保存客户分组消息回调地址
   * @description 外网用户进入开发管理-应用管理，点击管理进入应用详情-消息列表时，点击编辑按钮时，查询客户分组消息回调地址列表
   * @param {string} appCode - 应用编码
   * @param {string} msgName - 消息名称
   * @param {string} receiveType - 消息接收方式
   * @param {object} messageCallbackInfoList - 消息回调地址列表，{"appGroupId": number, "appGroupName": string, "url": string}
   */
  postCustomerGroupMessageCallbackInfoSaveData: data =>
    request({
      url: "/app/saveMessageCallbackInfo",
      method: "post",
      data
    })
};

export default appManager;
