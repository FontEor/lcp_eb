import request_noMsg from "@/utils/request_noMsg.js";

// 应用管理统一注册API
const appManager = {
  /**
   * 创建应用查询应用类型列表
   */
  getAuth: () => request_noMsg.get("/user/getAuth"),

  /**
   * 查询软件系统二次开发类型应用
   */
  findSecondDevProductList: () =>
    request_noMsg.get("/product/release/findSecondDevProductList"),

  /**
   * 查询软件系统版本
   * @param {string} productCode 产品编码
   */
  queryVersionListByProductCode: params =>
    request_noMsg.get(
      "/sysVersion/queryHaveSpiReleaseVersionListByProductCode",
      {
        params
      }
    ),

  /**
   * 模糊查询应用名称
   * @param {string} name 应用名称关键字
   * @param {string} code 应用编码关键字
   */
  findExistedAppList: params =>
    request_noMsg.get("/app/findExistedAppList", { params }),

  /**
   * 创建软件系统应用
   * @param {number} productId 软件系统ID
   * @param {string} productCode 软件系统编码
   * @param {number} sysVersionId 软件系统版本ID
   * @param {string} name 应用名称
   * @param {string} remark 应用描述
   * @param {string} projectName 项目名称
   */
  addProductAppInfo: data => request_noMsg.post("/app/addProductAppInfo", data),

  /**
   * 查询软件系统应用详情信息
   * @param {number} id 应用ID
   */
  getAppBaseInfo: params =>
    request_noMsg.get("/app/getAppBaseInfo", { params }),

  /**
   * 修改软件系统应用基本信息
   * @param {number} id 应用ID
   * @param {number} name 应用名称
   * @param {number} remark 备注
   */
  updateProductAppInfo: data =>
    request_noMsg.post("/app/updateProductAppInfo", data),

  /**
   * 软件系统应用管理查询扩展点列表
   * @param {number} appCode 应用code
   * @param {number} productGroupId 分类id
   * @param {number} keyWord 中文名称或URL
   * @param {number} pageSize 每页条数
   * @param {number} pageNum 页码
   */
  queryList: params => request_noMsg.get("/spiInstance/queryList", { params }),

  /**
   * 扩展点启用/停用
   * @param {number} id 扩展点id
   * @param {Boolean} spiInstanceIsEnable true=启用，false=停用
   * @param {string} envMark 是否为影盒环境 uat 其他传空
   */
  enable: data => request_noMsg.post("/spiInstance/enable", data),

  /**
   * 应用管理发布-查询扩展点操作日志
   * @param {number} appCode 应用编码
   */
  queryOperateLog: appCode =>
    request_noMsg.get(`/spiInstance/queryOperateLog${appCode}`),

  /**
   * 应用管理发布
   * @param {number} id 应用ID
   */
  publishProductApp: params =>
    request_noMsg.post("/app/publishProductApp", null, {
      params,
      timeout: 20000
    }),

  /**
   * 推送应用列表查询
   * @param {number} appCode 应用编码
   * @param {number} pageNum 当前页码
   * @param {number} pageSize 每页条目数
   */
  pushTenantList: (params, appCode) =>
    request_noMsg.get(`/spiInstance/pushTenantList${appCode}`, { params }),

  /**
   * 应用租户推送新建
   * @param {string} tenantCode 租户名称
   * @param {string} tenantName 租户编码
   * @param {string} appCode 应用编码
   * @param {string} remark 备注
   */
  pushTenant: data => request_noMsg.post("/spiInstance/pushTenant", data),

  /**
   * 推送应用列表撤销
   * @param {number} id 当前选中应用ID
   */
  pushTenantRevoke: id =>
    request_noMsg.post(`/spiInstance/pushTenantRevoke${id}`),

  /**
   * 扩展点探活
   * @param {number} appCode 当前选中应用code
   */
  survivalCheck: appCode =>
    request_noMsg.post(`/spiInstance/survivalCheck${appCode}`),

  /**
   * 日志工具-查询扩展点实现列表
   * @param {number} appCode 当前选中应用code
   */
  queryListAll: params =>
    request_noMsg.get("/spiInstance/queryListAll", { params }),

  /**
   * 日志工具-模糊查询
   * @param {string} productCode 软件系统编码
   * @param {string} env 运行环境
   * @param {string} tenementCode 租户编码
   * @param {string} spiCode 扩展点编码
   * @param {string} params 入参
   * @param {string} result 出参
   * @param {string} pin 账号
   * @param {string} startTime 开始时间
   * @param {string} endTime 结束时间
   */
  source: params => request_noMsg.get("/logSearch/spi/source", { params }),

  /**
   * 日志工具-根据traceId查询
   * @param {string} productCode 软件系统编码
   * @param {string} env 运行环境
   * @param {string} tenementCode 租户编码
   * @param {string} startTime 开始时间
   * @param {string} endTime 结束时间
   * @param {traceId} traceId traceID
   */
  traceId: params => request_noMsg.get("/logSearch/spi/traceId", { params })
};

export default appManager;
