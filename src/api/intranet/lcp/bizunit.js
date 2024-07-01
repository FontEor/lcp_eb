import request_msg from "@/utils/request_msg.js";

const bizunit = {
  /**
   * 根据对接方案ID查询概览数据
   *
   * @see {@link YApi http://}
   * @typedef {Object} Response 响应参数
   * @property {Object[]} Response.data - 返回数据 对接方案概览数据
   * @property {string} Response.data[].domainType - 接口服务类型 1:JSF 2:HTTP
   *
   * @param {Object} params 请求参数
   * @param {number} params.id - 对接方案ID
   *
   * @returns {Promise.<Response>} 表示根据对接方案ID查询概览数据返回响应参数的Promise对象
   */
  getOverview: (params) => request_msg.get("/bizunit/getOverview", { params }),

  /**
   * 根据对接方案ID判断当前用户是否为该对接方案的产品负责人或研发负责人
   *
   * @see {@link YApi http://}
   * @typedef {Object} Response 响应参数
   *
   * @param {Object} params 请求参数
   * @param {number} params.id - 对接方案ID
   *
   * @returns {Promise.<Response>} 表示根据对接方案ID判断当前用户是否为该对接方案的产品负责人或研发负责人返回响应参数的Promise对象
   */
  checkPrincipal: (params) =>
    request_msg.get("/bizunit/checkPrincipal", { params }),

  /**
   * 根据对接方案ID查询对接方案类型
   *
   * @see {@link YApi http://}
   * @typedef {Object} Response 响应参数
   * @property {Object} Response.data - 返回数据
   * @property {number} Response.data.type - 对接方案类型 2:ISV 4:合作伙伴
   * @property {number} Response.data.hasUat - 是否存在预发环境 0:否 1:是
   * @property {number} Response.data.publishRange - 发布范围 1:私有 2:公开
   * @property {number} Response.data.status - 对接方案状态 4:审核通过
   *
   * @param {Object} params 请求参数
   * @param {number} params.id - 对接方案ID
   *
   * @returns {Promise.<Response>} 表示根据对接方案ID查询对接方案类型返回响应参数的Promise对象
   */
  getBizUnitPreById: (params) =>
    request_msg.get("/bizunit/getBizUnitPreById", { params }),

  /**
   * 创建对接方案单元
   *
   * @see {@link YApi http://}
   *
   * @typedef {Object} Response 响应参数
   * @property {number} Response.data - 返回数据 对接方案ID
   *
   * @param {Object} data 请求参数
   * @param {string} data.code - 对接方案编码
   * @param {string} data.name - 对接方案名称
   * @param {string} data.businessTypeCode - 所属分类
   * @param {number} data.domainType - 接口服务类型 1:"JSF" 2:"HTTP"
   * @param {string} data.solutionType - 字段表取值 "1":"行业对接方案" "2":"业务产品对接方案" "3":"场景对接方案"
   * @param {number} data.remark - 对接方案简介
   *
   * @returns {Promise.<Response>} 表示创建对接方案单元返回响应参数的Promise对象
   */
  insertBizUnitPre: (data) =>
    request_msg.post("/bizunit/insertBizUnitPre", data),

  /**
   * 根据对接方案编码校验其是否已存在
   *
   * @see {@link YApi http://}
   *
   * @typedef {Object} Response 响应参数
   * @property {boolean} Response.data - 返回数据 对接方案编码是否存在
   *
   * @param {Object} params 请求参数
   * @param {string} params.code - 对接方案编码
   *
   * @returns {Promise.<Response>} 表示根据对接方案编码校验其是否已存在返回响应参数的Promise对象
   */
  isCodeExist: (params) => request_msg.get("/bizunit/isCodeExist", { params }),

  /**
   * 创建发布对接方案任务
   *
   * @see {@link YApi http://}
   *
   * @typedef {Object} Response 响应参数
   * @property {boolean} Response.data - 返回数据 任务ID
   *
   * @param {Object} data 请求参数
   * @param {number} data.unitId - 对接方案ID
   * @param {string} data.pin - 用户ERP
   * @param {string} data.publishRecord - 发布记录
   * @param {string[]} data.environmentList - 环境列表
   *
   * @returns {Promise.<Response>} 表示创建发布对接方案任务返回响应参数的Promise对象
   */
  createTask: (data) => request_msg.post("/bizunit/createTask", data),

  /**
   * 执行对接方案发布任务
   *
   * @see {@link YApi http://}
   *
   * @typedef {Object} Response 响应参数
   * @property {Object} Response.data - 返回数据
   *
   * @param {Object} params 请求参数
   * @param {number} params.unitId - 对接方案ID
   * @param {number} params.taskId - 任务ID
   *
   * @returns {Promise.<Response>} 表示执行对接方案发布任务返回响应参数的Promise对象
   */
  runTask: (params) =>
    request_msg.get("/bizunit/runTask", { params, timeout: 3000 }),

  /**
   * 查看对接方案发布任务进度
   *
   * @see {@link YApi http://}
   *
   * @typedef {Object} Response 响应参数
   * @property {Object} Response.data - 返回数据
   * @property {number} Response.data.taskStatus - 任务状态 2:进行中 4:失败 200:成功
   * @property {number} Response.data.taskCount - 子任务数量
   * @property {number} Response.data.successCount - 子任务成功执行数量
   *
   * @param {Object} params 请求参数
   * @param {number} params.taskId - 任务ID
   *
   * @returns {Promise.<Response>} 表示执行对接方案发布任务返回响应参数的Promise对象
   */
  progressTask: (params) =>
    request_msg.get("/bizunit/progressTask", { params }),
  /**
   * 查询所有对接方案
   *
   * @see {@link YApi http://}
   *
   * @param {Object} params 请求参数
   * @param {number} params.pageSize
   * @param {number} params.pageNumb
   * @param {number} params.queryLike - 查询条件
   * @param {number} params.solutionType
   *
   */
  fuzzyQuery: (params) =>
    request_msg.get("/bizunit/pre/fuzzy-query", { params }),
  /**
   *  @param {unitId} params unitId
   *  @returns {Promise<Response>}
   */
  warnRisk: (unitId, params) =>
    request_msg.get(`/bizapinterface/warnRisk${unitId}`, { params }),


  /**
   * 判断是否已发布过对接方案
   * 
   *  @param {unitId} params unitId
   *  @returns {Promise<Response>}
   */
  isFirstPublish: (unitId, params) =>
    request_msg.get(`/bizunit/isFirstPublish${unitId}`, { params }),
  
  /**
   * 获取对接方案修改记录
   * 
   *  @param {unitId} params unitId
   *  @returns {Promise<Response>}
   */
  getModifyRecords: (unitId, params) =>
  request_msg.get(`/bizunit/getModifyRecords${unitId}`, { params }),


};

export default bizunit;
