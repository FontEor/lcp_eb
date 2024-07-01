import request_msg from "@/utils/request_msg.js";

const bizapinterface = {
  /**
   * 根据对接方案ID查询其下所有的分类
   *
   * @see {@link YApi http://}
   * @typedef {Object} Response 响应参数
   * @property {Object[]} Response.data - 返回数据 分类列表表格数据
   * @property {string} Response.data[].code - 分类编码
   * @property {string} Response.data[].name - 分类名称
   *
   * @param {Object} params 请求参数
   * @param {number} params.unitId - 对接方案ID
   *
   * @returns {Promise.<Response>} 表示根据对接方案ID查询其下所有的分类返回响应参数的Promise对象
   */
  getApiCategory: (params) =>
    request_msg.get("/bizapinterface/getApiCategory", { params }),

  /**
   * 查询对接方案外调内接口列表表格数据
   *
   * @see {@link YApi http://}
   * @typedef {Object} Response 响应参数
   * @property {Object[]} Response.data - 返回数据
   * @property {number} Response.data[].list - 接口列表表格数据
   * @property {number} Response.data[].total - 接口列表表格数据总条数
   *
   * @param {Object} params 请求参数
   * @param {number} params.unitId - 对接方案ID
   * @param {number} params.callDirection - 调用方向 1:外调内 2:内调外
   * @param {number} params.pageNumb - 当前页码
   * @param {number} params.pageSize - 每页数据条数
   * @param {string} params.orderBy - 排序依据字段 seq
   * @param {string} params.orderType - 排序方式 asc:升序
   * @param {string} params.queryLike - 查询关键词
   *
   * @returns {Promise.<Response>} 表示查询对接方案外调内接口列表表格数据返回响应参数的Promise对象
   */
  queryInterfaceList: (params) =>
    request_msg.get("/bizapinterface/queryInterfaceList", { params }),

  /**
   * 调整对接方案接口列表表格顺序
   *
   * @see {@link YApi http://}
   * @typedef {Object} Response 响应参数
   *
   * @param {Object} data 请求参数
   * @param {number} data.apiId - 接口ID
   * @param {number} data.seq - 调整到的目标顺序 从1开始
   *
   * @returns {Promise.<Response>} 表示调整对接方案接口列表表格顺序返回响应参数的Promise对象
   */
  updateApiSeq: (data) =>
    request_msg.post("/bizapinterface/updateApiSeq", data),

  /**
   * 根据接口ID隐藏对接方案API
   *
   * @see {@link YApi http://}
   * @typedef {Object} Response 响应参数
   *
   * @param {Object} params 请求参数
   * @param {number} params.id - 接口ID
   *
   * @returns {Promise.<Response>} 表示根据接口ID隐藏对接方案API返回响应参数的Promise对象
   */
  hiddenApi: (params) =>
    request_msg.get("/bizapinterface/hiddenApi", { params }),

  /**
   * 根据接口ID取消隐藏对接方案API
   *
   * @see {@link YApi http://}
   * @typedef {Object} Response 响应参数
   *
   * @param {Object} params 请求参数
   * @param {number} params.id - 接口ID
   *
   * @returns {Promise.<Response>} 表示根据接口ID取消隐藏对接方案API返回响应参数的Promise对象
   */
  hiddenCancelApi: (params) =>
    request_msg.get("/bizapinterface/hiddenCancelApi", { params }),

  /**
   * 根据接口ID删除对接方案API
   *
   * @see {@link YApi http://}
   * @typedef {Object} Response 响应参数
   *
   * @param {Object} params 请求参数
   * @param {number} params.id - 接口ID
   *
   * @returns {Promise.<Response>} 表示根据接口ID删除对接方案API返回响应参数的Promise对象
   */
  deleteInterface: (params) =>
    request_msg.get("/bizapinterface/deleteInterface", { params }),

  /**
   * 保存添加/编辑接口信息
   *
   * @see {@link YApi http://}
   * @typedef {Object} Response 响应参数
   *
   * @param {Object} data 请求参数
   * @param {number} data.unitId - 对接方案ID
   * @param {number} data.id - 接口ID
   * @param {number} data.type - 对接方案类型 2:ISV 4:合作伙伴
   * @param {number} data.methodId - 方法ID
   * @param {string} data.apiName - 接口名称
   * @param {string} data.apiType - 分类名称
   * @param {string} data.apiRemark - 接口描述
   * @param {string} data.interfaceName - 接口名称
   * @param {string} data.interfaceMethod - 方法名称
   * @param {string} data.url - 接口URI
   * @param {string} data.code - 接口所属分组
   * @param {string} data.shadowboxAlias - 影盒环境JSF别名
   * @param {string} data.alias - 当前环境JSF别名
   * @param {string} data.uatToken - 预发环境JSF-token
   * @param {string} data.token - 生产环境JSF-token
   * @param {number} data.shadowboxClusterId - 影盒环境服务器ID
   * @param {number} data.clusterId - 当前环境服务器ID
   * @param {string} data.shadowboxClusterName - 影盒环境服务器名称
   * @param {string} data.clusterName - 当前环境服务器名称
   * @param {number} data.dataLevel - 数据级别
   * @param {Array} data.labelList - 敏感标签数组
   * @param {string} data.labelList[].labelName - 敏感标签名称
   * @param {string} data.labelList[].dataLevel - 敏感标签数据级别
   * @param {string} data.labelList[].labelPath - 敏感标签路径
   * @param {string} data.apiUrl - 公网URL
   * @param {number} data.isAuthorize - 是否需要用户授权 1:需要 2:不需要
   * @param {Object} data.actAccount - 参数映射
   * @param {Array} data.httpConfig - 参数映射 pin:从平台接收京东PIN tenementCode:从平台接收调用方tenantCode
   *
   * @returns {Promise.<Response>} 表示保存添加/编辑接口信息返回响应参数的Promise对象
   */
  saveInterface: (data) =>
    request_msg.post("/bizapinterface/saveInterface", data),

  /**
   * 根据接口ID查询接口详情
   *
   * @see {@link YApi http://}
   * @typedef {Object} Response 响应参数
   * @property {Object} Response.data - 返回数据
   * @property {number} Response.data.methodId - 方法ID
   * @property {string} Response.data.apiUrl - 接口URI、公网URL
   * @property {number} Response.data.shadowboxClusterId - 影盒环境集群ID
   * @property {number} Response.data.clusterId - 当前环境集群ID
   * @property {string} Response.data.shadowboxClusterName - 影盒环境集群名称
   * @property {string} Response.data.clusterName - 当前环境集群名称
   * @property {number} Response.data.isAuthorize - 是否需要用户授权 1:需要 2:不需要
   * @property {Object[]} Response.data.httpConfig - 参数映射 pin:从平台接收京东PIN tenementCode:从平台接收调用方tenantCode
   *
   * @param {Object} params 请求参数
   * @param {number} params.id - 接口ID
   *
   * @returns {Promise.<Response>} 表示根据接口ID查询接口详情返回响应参数的Promise对象
   */
  getInterfaceDetailById: (params) =>
    request_msg.get("/bizapinterface/getInterfaceDetailById", { params }),

  /**
   * 查询API
   *
   * @see {@link YApi http://}
   *
   * @param {Object} params 请求参数
   * @param {number} params.unitId
   * @param {number} params.pageSize
   * @param {number} params.pageNumb
   * @param {number} params.orderBy
   * @param {number} params.orderType
   * @param {number} params.queryLike
   * @param {number} params.callDirection
   *
   */
  queryInterface: (params) =>
    request_msg.get("/bizapinterface/interface/query", { params }),

  /**
   * 根据对接方案ID、接口ID和参数可见性查询接口对外文档详情
   *
   * @see {@link YApi http://11.51.194.248:3000/project/5/interface/api/197}
   * @typedef {Object} Response 响应参数
   * @property {Object} Response.data - 返回数据
   *
   * @param {Object} params 请求参数
   * @param {number} params.unitId - 对接方案ID
   * @param {number} params.id - 接口ID
   * @param {number} params.visible - 文档参数可见性 {0:"隐藏",1:"显示",2:"全部显示"}
   *
   * @returns {Promise.<Response>} 表示根据对接方案ID、接口ID和参数可见性查询接口对外文档详情返回响应参数的Promise对象
   */
  getBizApiPreDetails: (params) =>
    request_msg.get("/bizapinterface/getBizApiPreDetails", { params }),

  /**
   * 根据对接方案ID、接口ID和参数可见性查询接口对外文档变更详情
   *
   * @see {@link YApi http://11.51.194.248:3000/project/5/interface/api/1093}
   * @typedef {Object} Response 响应参数
   * @property {Object} Response.data - 返回数据
   *
   * @param {Object} params 请求参数
   * @param {number} params.unitId - 对接方案ID
   * @param {number} params.id - 接口ID
   * @param {number} params.visible - 文档参数可见性 {0:"隐藏",1:"显示",2:"全部显示"}
   *
   * @returns {Promise.<Response>} 表示根据对接方案ID、接口ID和参数可见性查询接口对外文档变更详情返回响应参数的Promise对象
   */
  getBizApiPreDetailsLatestVersion: (params) =>
    request_msg.get("/bizapinterface/getBizApiPreDetailsLatestVersion", {
      params,
    }),

  /**
   * 根据接口ID检查接口文档元数据是否存在变更
   *
   * @see {@link YApi http://11.51.194.248:3000/project/5/interface/api/1068}
   * @typedef {Object} Response 响应参数
   * @property {boolean} Response.data - 返回数据 是否存在变更
   *
   * @param {Object} params 请求参数
   * @param {number} params.id - 接口ID
   *
   * @returns {Promise.<Response>} 表示根据接口ID检查接口文档元数据是否存在变更返回响应参数的Promise对象
   */
  checkForUpdate: (params) =>
    request_msg.get("/bizapinterface/checkForUpdate", { params }),

  /**
   * 根据对接方案ID、接口ID等信息保存接口文档
   *
   * @see {@link YApi http://11.51.194.248:3000/project/5/interface/api/200}
   * @typedef {Object} Response 响应参数
   * @property {boolean} Response.data - 返回数据
   *
   * @param {Object} data 请求参数
   * @param {number} data.id - 接口ID
   * @param {number} data.updatePolicy - 更新策略 {1:"全量更新",2:"增量更新",3:"编辑保存"}
   *
   * @returns {Promise.<Response>} 表示根据对接方案ID、接口ID等信息保存接口文档返回响应参数的Promise对象
   */
  saveBizApiPreDetails: (data) =>
    request_msg.post("/bizapinterface/saveBizApiPreDetails", data),

  /**
   * 根据对接方案ID、接口ID、参数可见性和更新策略生成接口对外文档详情
   *
   * @see {@link YApi http://11.51.194.248:3000/project/5/interface/api/1096}
   * @typedef {Object} Response 响应参数
   * @property {Object} Response.data - 返回数据
   *
   * @param {Object} params 请求参数
   * @param {number} params.unitId - 对接方案ID
   * @param {number} params.id - 接口ID
   * @param {number} params.visible - 文档参数可见性 {0:"隐藏",1:"显示",2:"全部显示"}
   * @param {number} params.updatePolicy - 更新策略 {1:"全量更新",2:"增量更新",3:"编辑保存"}
   *
   * @returns {Promise.<Response>} 表示根据对接方案ID、接口ID、参数可见性和更新策略生成接口对外文档详情返回响应参数的Promise对象
   */
  generateBizApiPreDetailsPreview: (params) =>
    request_msg.get("/bizapinterface/generateBizApiPreDetailsPreview", {
      params,
    }),

  /**
   *  @param {id} params paiId
   *  @returns {Promise<Response>}
   */
  checkRisk: (id, params) =>
    request_msg.get(`/bizapinterface/checkRisk${id}`, { params }),

  /**
   * 定义保存回传API自动配置接口
   *
   * @see {@link YApi http://11.51.194.248:3000/project/5/interface/api/1629}
   * @typedef {Object} Response 响应参数
   * @property {Object} Response.data - 返回数据
   *
   * @param {Object} data 请求参数
   * @param {number} data.id - 接口ID
   * @param {number} data.autoCodeConfig - 是否开启业务编码自动配置（0：不开启，1：开启）
   * @param {string} data.codeConfigAlias - 开启业务编码后回调API的JSF别名
   *
   * @returns {Promise.<Response>} 表示保存回传API自动配置接口返回响应参数的Promise对象
   */
  saveAutoCodeConfig: (data) =>
    request_msg.post("/bizapinterface/saveAutoCodeConfig", data),

  /**
   * 定义根据别名查询此别名是否有调用API接口
   *
   * @see {@link YApi http://11.51.194.248:3000/project/5/interface/api/1630}
   * @typedef {Object} Response 响应参数
   * @property {Object} Response.data - 返回数据
   * @property {Object[]} Response.data.list - 调用列表
   * @property {string} Response.data.list[].unitName - 对接方案名称
   * @property {string} Response.data.list[].unitCode - 对接方案编码
   * @property {string} Response.data.list[].apiUrl - URI
   * @property {string} Response.data.list[].domainOfGateway - 回传API所属分组
   * @property {number} Response.data.total - 数据总条数
   *
   * @param {Object} params 请求参数
   * @param {number} params.pageNumb - 当前页码
   * @param {number} params.pageSize - 每页数据条数
   * @param {string} params.codeConfigAlias - 开启业务编码后回调API的JSF别名
   *
   * @returns {Promise.<Response>} 表示根据别名查询此别名是否有调用API接口返回响应参数的Promise对象
   */
  queryWithPage: (params) =>
    request_msg.get("/bizapinterface/queryWithPage", { params }),

  lcp: {
    unit: {
      /**
       * 根据对接方案ID、接口ID查询内调外接口对外文档详情
       *
       * @see {@link YApi http://11.51.194.248:3000/project/5/interface/api/834}
       * @typedef {Object} Response 响应参数
       * @property {Object} Response.data - 返回数据
       *
       * @param {Object} params 请求参数
       * @param {number} params.unitId - 对接方案ID
       * @param {number} params.id - 接口ID
       *
       * @returns {Promise.<Response>} 表示根据对接方案ID、接口ID查询内调外接口对外文档详情返回响应参数的Promise对象
       */
      getOutwardApiPreDetails: (params) =>
        request_msg.get("/bizapinterface/lcp/unit/getOutwardApiPreDetails", {
          params,
        }),
    },
  },

  callOutConfig: {
    /**
     * 定义根据内调外订阅接口ID查询内调外业务编码列表接口
     *
     * @see {@link YApi http://11.51.194.248:3000/project/5/interface/api/1651}
     * @typedef {Object} Response 响应参数
     * @property {Object} Response.data - 返回数据
     * @property {number} Response.data.total - 数据总数
     * @property {Object[]} Response.data.list - 列表数据
     * @property {string} Response.data.list[].callBackUrl - 回调URL
     * @property {string} Response.data.list[].shadowboxCallbackUrl - 沙箱回调URL
     * @property {string} Response.data.list[].customerCode - 业务编码
     * @property {string} Response.data.list[].updateTime - 更新时间
     * @property {string} Response.data.list[].updateUser - 更新人
     * @property {number} Response.data.list[].isDefault - 是否为默认数据，默认数据不可删除 0:非默认 1:默认
     *
     * @param {Object} params 请求参数
     * @param {number} params.pageNumb - 当前页码
     * @param {number} params.pageSize - 每页数据
     * @param {number} params.bizCalloutSubId - 接口ID
     *
     * @returns {Promise.<Response>} 表示根据内调外订阅接口ID查询内调外业务编码列表接口返回响应参数的Promise对象
     */
    queryPage: (params) =>
      request_msg.get("/bizapinterface/callOutConfig/queryPage", {
        params,
      }),

    /**
     * 定义根据内调外订阅接口业务编码ID编辑（新增）业务编码接口
     *
     * @see {@link YApi http://11.51.194.248:3000/project/5/interface/api/1653}
     * @typedef {Object} Response 响应参数
     * @property {Object} Response.data - 返回数据
     *
     * @param {Object} data 请求参数
     * @param {number|undefined} data.id - ID
     * @param {number} data.bizCalloutSubId - 接口ID
     * @param {string} data.customerCode - 业务编码
     *
     * @returns {Promise.<Response>} 表示根据内调外订阅接口业务编码ID编辑（新增）业务编码接口返回响应参数的Promise对象
     */
    edit: (data) =>
      request_msg.post("/bizapinterface/callOutConfig/edit", data),

    /**
     * 定义根据内调外订阅接口业务编码ID删除业务编码接口
     *
     * @see {@link YApi http://11.51.194.248:3000/project/5/interface/api/1652}
     * @typedef {Object} Response 响应参数
     * @property {Object} Response.data - 返回数据
     *
     * @param {Object} data 请求参数
     * @param {number} data.id - ID
     *
     * @returns {Promise.<Response>} 表示根据内调外订阅接口业务编码ID删除业务编码接口返回响应参数的Promise对象
     */
    delete: (data) =>
      request_msg.post("/bizapinterface/callOutConfig/delete", data),
  },
};

export default bizapinterface;
