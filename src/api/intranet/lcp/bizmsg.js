import request_msg from "@/utils/request_msg.js";

const bizmsg = {
  /**
   * 根据对接方案ID与消息TOPIC或消息名称关键词查询消息列表数据
   *
   * @see {@link YApi http://11.51.194.248:3000/project/5/interface/api/1077}
   * @typedef {Object} Response 响应参数
   * @property {Object} Response.data - 返回数据
   * @property {number} Response.data.total - 数据总数
   * @property {Object[]} Response.data.list - 列表数据
   * @property {number} Response.data.list[].id - 消息ID
   * @property {string} Response.data.list[].name - TOPIC
   * @property {string} Response.data.list[].chineseName - 中文名称
   * @property {string} Response.data.list[].descr - 描述
   * @property {number} Response.data.list[].status - 状态 {1:"初始化",5:"已发布",10:"编辑中"}
   * @property {string} Response.data.list[].updateUser - 创建人
   * @property {string} Response.data.list[].updateTime - 创建时间 "2022-11-21 15:57:59"
   * @property {number} Response.data.list[].outOfDate - 文档是否过期 {0:"未过期",1:"已过期"}
   * @property {number} Response.data.list[].hide - 是否隐藏 {0:"未隐藏",1:"已隐藏"}
   *
   * @param {Object} params 请求参数
   * @param {number} params.unitId - 对接方案ID
   * @param {string} params.queryLike - 消息TOPIC或消息名称关键词
   * @param {number} params.pageNumb - 页码
   * @param {number} params.pageSize - 每页数据条数
   *
   * @returns {Promise.<Response>} 表示根据对接方案ID与消息TOPIC或消息名称关键词查询消息列表数据返回响应参数的Promise对象
   */
  findMessagePreList: params =>
    request_msg.get("/bizmsg/findMessagePreList", { params }),

  /**
   * 根据消息TOPIC关键词查询消息列表数据
   *
   * @see {@link YApi http://11.51.194.248:3000/project/5/interface/api/1080}
   * @typedef {Object} Response 响应参数
   * @property {Object[]} Response.data - 返回数据
   * @property {number} Response.data[].id - 消息ID
   * @property {string} Response.data[].name - 消息TOPIC
   * @property {string} Response.data[].chineseName - 消息中文名称
   *
   * @param {Object} params 请求参数
   * @param {string} params.msgTopic - 消息TOPIC关键词
   *
   * @returns {Promise.<Response>} 表示根据消息TOPIC关键词查询消息列表数据返回响应参数的Promise对象
   */
  findMessageByGateWay: params =>
    request_msg.get("/bizmsg/findMessageByGateWay", { params }),

  /**
   * 根据对接方案ID添加消息保存消息TOPIC与中文名称
   *
   * @see {@link YApi http://11.51.194.248:3000/project/5/interface/api/1081}
   * @typedef {Object} Response 响应参数
   * @property {Object} Response.data - 返回数据
   *
   * @param {Object} data 请求参数
   * @param {number} data.unitId - 对接方案ID
   * @param {string} data.name - 消息TOPIC
   * @param {string} data.chineseName - 消息中文名称
   *
   * @returns {Promise.<Response>} 表示根据对接方案ID添加消息保存消息TOPIC与中文名称返回响应参数的Promise对象
   */
  insertMessagePre: data => request_msg.post("/bizmsg/insertMessagePre", data),

  /**
   * 根据对接方案ID与消息ID隐藏消息
   *
   * @see {@link YApi http://11.51.194.248:3000/project/5/interface/api/1072}
   * @typedef {Object} Response 响应参数
   * @property {Object} Response.data - 返回数据
   *
   * @param {Object} data 请求参数
   * @param {number} data.unitId - 对接方案ID
   * @param {number} data.id - 消息ID
   *
   * @returns {Promise.<Response>} 表示根据对接方案ID与消息ID隐藏消息返回响应参数的Promise对象
   */
  hide: data => request_msg.post("/bizmsg/hide", data),

  /**
   * 根据对接方案ID与消息ID取消隐藏消息
   *
   * @see {@link YApi http://11.51.194.248:3000/project/5/interface/api/1074}
   * @typedef {Object} Response 响应参数
   * @property {Object} Response.data - 返回数据
   *
   * @param {Object} data 请求参数
   * @param {number} data.unitId - 对接方案ID
   * @param {number} data.id - 消息ID
   *
   * @returns {Promise.<Response>} 表示根据对接方案ID与消息ID取消隐藏消息返回响应参数的Promise对象
   */
  hideCancel: data => request_msg.post("/bizmsg/hideCancel", data),

  /**
   * 根据对接方案ID与消息ID删除消息
   *
   * @see {@link YApi http://11.51.194.248:3000/project/5/interface/api/1088}
   * @typedef {Object} Response 响应参数
   * @property {Object} Response.data - 返回数据
   *
   * @param {Object} data 请求参数
   * @param {number} data.unitId - 对接方案ID
   * @param {number} data.id - 消息ID
   *
   * @returns {Promise.<Response>} 表示根据对接方案ID与消息ID删除消息返回响应参数的Promise对象
   */
  deleteMessagePreById: data =>
    request_msg.post("/bizmsg/deleteMessagePreById", data),

  /**
   * 根据对接方案ID与消息ID查询消息文档详情
   *
   * @see {@link YApi http://11.51.194.248:3000/project/5/interface/api/1075}
   * @typedef {Object} Response 响应参数
   * @property {Object} Response.data - 返回数据
   * @property {number} Response.data.id - 消息ID
   * @property {string} Response.data.name - 消息TOPIC
   * @property {string} Response.data.chineseName - 消息中文名称
   * @property {string} Response.data.descr - 消息描述
   * @property {number} Response.data.outOfDate - 文档是否过期 {0:"未过期",1:"已过期"}
   * @property {Object[]} Response.data.messagePropList - 消息体
   * @property {number} Response.data.messagePropList[].id - 节点ID
   * @property {number} Response.data.messagePropList[].parentId - 节点父级ID
   * @property {string} Response.data.messagePropList[].name - 字段名称
   * @property {string} Response.data.messagePropList[].type - 类型
   * @property {number} Response.data.messagePropList[].required - 是否必填 {0:"非必填",1:"必填"}
   * @property {string} Response.data.messagePropList[].exampleValue - 示例值
   * @property {string} Response.data.messagePropList[].descr - 描述
   * @property {Object[]} Response.data.messagePropList[].children - 子级节点
   * @property {number} Response.data.messagePropList[].children[].id - 节点ID
   * @property {number} Response.data.messagePropList[].children[].parentId - 节点父级ID
   * @property {string} Response.data.messagePropList[].children[].name - 字段名称
   * @property {string} Response.data.messagePropList[].children[].type - 类型
   * @property {number} Response.data.messagePropList[].children[].required - 是否必填 {0:"非必填",1:"必填"}
   * @property {string} Response.data.messagePropList[].children[].exampleValue - 示例值
   * @property {string} Response.data.messagePropList[].children[].descr - 描述
   * @property {Object[]} Response.data.messagePropList[].children[].children - 子级节点
   *
   * @param {Object} data 请求参数
   * @param {number} data.unitId - 对接方案ID
   * @param {number} data.id - 消息ID
   *
   * @returns {Promise.<Response>} 表示根据对接方案ID与消息ID查询消息文档详情返回响应参数的Promise对象
   */
  getMessagePreDetail: data =>
    request_msg.post("/bizmsg/getMessagePreDetail", data),

  /**
   * 根据对接方案ID与消息ID更新消息文档详情
   *
   * @see {@link YApi http://11.51.194.248:3000/project/5/interface/api/1090}
   * @typedef {Object} Response 响应参数
   * @property {Object} Response.data - 返回数据
   *
   * @param {Object} data 请求参数
   * @param {number} data.unitId - 对接方案ID
   * @param {number} data.id - 消息ID
   * @param {string} data.name - 消息TOPIC
   * @param {string} data.chineseName - 消息中文名称
   * @param {string} data.descr - 消息描述
   * @param {boolean} data.metadataRenew - 是否更新元数据 {false:"未更新",true:"已更新"}
   * @param {Object[]} data.messagePropList - 消息体
   * @param {number} data.messagePropList[].id - 节点ID
   * @param {number} data.messagePropList[].parentId - 节点父级ID
   * @param {string} data.messagePropList[].name - 字段名称
   * @param {string} data.messagePropList[].type - 类型
   * @param {number} data.messagePropList[].required - 是否必填 {0:"非必填",1:"必填"}
   * @param {string} data.messagePropList[].exampleValue - 示例值
   * @param {string} data.messagePropList[].descr - 描述
   * @param {Object[]} data.messagePropList[].children - 子级节点
   * @param {number} data.messagePropList[].children[].id - 节点ID
   * @param {number} data.messagePropList[].children[].parentId - 节点父级ID
   * @param {string} data.messagePropList[].children[].name - 字段名称
   * @param {string} data.messagePropList[].children[].type - 类型
   * @param {number} data.messagePropList[].children[].required - 是否必填 {0:"非必填",1:"必填"}
   * @param {string} data.messagePropList[].children[].exampleValue - 示例值
   * @param {string} data.messagePropList[].children[].descr - 描述
   * @param {Object[]} Response.data.messagePropList[].children[].children - 子级节点
   *
   * @returns {Promise.<Response>} 表示根据对接方案ID与消息ID更新消息文档详情返回响应参数的Promise对象
   */
  updateMessagePre: data => request_msg.post("/bizmsg/updateMessagePre", data),

  /**
   * 根据消息ID查询消息文档元数据
   *
   * @see {@link YApi http://11.51.194.248:3000/project/5/interface/api/1082}
   * @typedef {Object} Response 响应参数
   * @property {Object} Response.data - 返回数据
   * @property {number} Response.data.id - 消息ID
   * @property {string} Response.data.name - 消息TOPIC
   * @property {string} Response.data.chineseName - 消息中文名称
   * @property {string} Response.data.descr - 消息描述
   * @property {number} Response.data.outOfDate - 文档是否过期 {0:"未过期",1:"已过期"}
   * @property {Object[]} Response.data.messagePropList - 消息体
   * @property {number} Response.data.messagePropList[].id - 节点ID
   * @property {number} Response.data.messagePropList[].parentId - 节点父级ID
   * @property {string} Response.data.messagePropList[].name - 字段名称
   * @property {string} Response.data.messagePropList[].type - 类型
   * @property {number} Response.data.messagePropList[].required - 是否必填 {0:"非必填",1:"必填"}
   * @property {string} Response.data.messagePropList[].exampleValue - 示例值
   * @property {string} Response.data.messagePropList[].descr - 描述
   * @property {Object[]} Response.data.messagePropList[].children - 子级节点
   * @property {number} Response.data.messagePropList[].children[].id - 节点ID
   * @property {number} Response.data.messagePropList[].children[].parentId - 节点父级ID
   * @property {string} Response.data.messagePropList[].children[].name - 字段名称
   * @property {string} Response.data.messagePropList[].children[].type - 类型
   * @property {number} Response.data.messagePropList[].children[].required - 是否必填 {0:"非必填",1:"必填"}
   * @property {string} Response.data.messagePropList[].children[].exampleValue - 示例值
   * @property {string} Response.data.messagePropList[].children[].descr - 描述
   * @property {Object[]} Response.data.messagePropList[].children[].children - 子级节点
   *
   * @param {Object} params 请求参数
   * @param {number} params.id - 消息ID
   *
   * @returns {Promise.<Response>} 表示根据消息ID查询消息文档元数据返回响应参数的Promise对象
   */
  getMsgPreDetailsLatestVersion: params =>
    request_msg.get("/bizmsg/getMsgPreDetailsLatestVersion", { params }),

  /**
   * 查询消息文档展示数据（部分更新和全量更新）
   * @see {@link YApi http://11.51.194.248:3000/project/5/interface/api/1118}
   * @param {object} params
   * @param {string} params.id 消息ID
   * @param {string} params.queryPolicy 查询策略，1：全量更新，前端显示数据，参数描述、示例值以API仓库为准；2：部分更新，前端显示数据，参数描述、示例值以开放平台为准

   * @typedef {Object} MessageProp
   * @property {number} MessageProp.id - 节点ID
   * @property {number} MessageProp.parentId - 节点父级ID
   * @property {string} MessageProp.name - 字段名称
   * @property {string} MessageProp.type - 类型
   * @property {number} MessageProp.required - 是否必填 {0:"非必填",1:"必填"}
   * @property {string} MessageProp.exampleValue - 示例值
   * @property {string} MessageProp.descr - 描述
   * @property {MessageProp[]} MessageProp.children - 子级节点
   *
   * @typedef {Object} ResponseData
   * @property {number} ResponseData.id - 消息ID
   * @property {string} ResponseData.name - 消息TOPIC
   * @property {string} ResponseData.unitId - 对接方案ID
   * @property {string} ResponseData.descr - 消息描述
   * @property {string} ResponseData.status - 消息状态
   * @property {string} ResponseData.createUser
   * @property {string} ResponseData.createTime
   * @property {string} ResponseData.chineseName  - 消息中文名称
   * @property {string} ResponseData.updateUser
   * @property {string} ResponseData.updateTime
   * @property {string} ResponseData.hide
   * @property {string} ResponseData.messageDemo
   * @property {string} ResponseData.receiveType
   * @property {string} ResponseData.callUrl
   * @property {string} ResponseData.shadowboxCallUrl
   * @property {string} ResponseData.routeCode
   * @property {string} ResponseData.ediDtfileName
   * @property {string} ResponseData.unitName
   * @property {string} ResponseData.outOfDate - 文档是否过期 {0:"未过期",1:"已过期"}
   * @property {string} ResponseData.isSub
   * @property {string} ResponseData.ediDtfile
   * @property {string} ResponseData.otherSubscribed
   * @property {string} ResponseData.otherUnitName
   * @property {MessageProp[]} ResponseData.messagePropList
   *
   * @return {Promise<ResponseData>}
   */
  getMsgPreDetailsPreview: params => request_msg.get("/bizmsg/getMsgPreDetailsPreview", { params }),
  
  /**
   * 根据消息ID查询消息文档元数据
   *
   * @see {@link YApi http://11.51.194.248:3000/project/5/interface/api/1082}
   * @typedef {Object} Response 响应参数
   * @property {Object} Response.data - 返回数据
   * @property {number} Response.data.id - 消息ID
   * @property {string} Response.data.name - 消息TOPIC
   * @property {string} Response.data.chineseName - 消息中文名称
   * @property {string} Response.data.descr - 消息描述
   * @property {number} Response.data.outOfDate - 文档是否过期 {0:"未过期",1:"已过期"}
   * @property {Object[]} Response.data.messagePropList - 消息体
   * @property {number} Response.data.messagePropList[].id - 节点ID
   * @property {number} Response.data.messagePropList[].parentId - 节点父级ID
   * @property {string} Response.data.messagePropList[].name - 字段名称
   * @property {string} Response.data.messagePropList[].type - 类型
   * @property {number} Response.data.messagePropList[].required - 是否必填 {0:"非必填",1:"必填"}
   * @property {string} Response.data.messagePropList[].exampleValue - 示例值
   * @property {string} Response.data.messagePropList[].descr - 描述
   * @property {Object[]} Response.data.messagePropList[].children - 子级节点
   * @property {number} Response.data.messagePropList[].children[].id - 节点ID
   * @property {number} Response.data.messagePropList[].children[].parentId - 节点父级ID
   * @property {string} Response.data.messagePropList[].children[].name - 字段名称
   * @property {string} Response.data.messagePropList[].children[].type - 类型
   * @property {number} Response.data.messagePropList[].children[].required - 是否必填 {0:"非必填",1:"必填"}
   * @property {string} Response.data.messagePropList[].children[].exampleValue - 示例值
   * @property {string} Response.data.messagePropList[].children[].descr - 描述
   * @property {Object[]} Response.data.messagePropList[].children[].children - 子级节点
   *
   * @param {Object} params 请求参数
   * @param {number} params.id - 消息ID
   *
   * @returns {Promise.<Response>} 表示根据消息ID查询消息文档元数据返回响应参数的Promise对象
   */
  getBizMsgPreDetailsLatestVersion: params =>
    request_msg.get("/bizmsg/getMsgPreDetailsLatestVersion", { params }),

  /**
   * 根据消息ID检查消息文档元数据是否存在变更
   *
   * @see {@link YApi http://11.51.194.248:3000/project/5/interface/api/1091}
   * @typedef {Object} Response 响应参数
   * @property {boolean} Response.data - 返回数据 是否存在变更
   *
   * @param {Object} params 请求参数
   * @param {number} params.id - 消息ID
   *
   * @returns {Promise.<Response>} 表示根据消息ID检查消息文档元数据是否存在变更返回响应参数的Promise对象
   */
  checkForUpdate: params =>
    request_msg.get("/bizmsg/checkForUpdate", { params }),

  /**
  * 根据ID删除消息分类接口
  *
  * @see {@link YApi http://11.51.194.248:3000/project/5/interface/api/1114}
  * @typedef {Object} Response 响应参数
  * @property {boolean} Response.data - 返回数据 是否存在变更
  *
  * @param {Object} data 请求参数
  *
  * @returns {Promise.<Response>} 表示根据消息ID检查消息文档元数据是否存在变更返回响应参数的Promise对象
  */
  deleteMessageCategoryById: data =>
    request_msg.post("/bizmsg/deleteMessageCategoryById", data),

  /**
  * 保存消息分类接口
  *
  * @see {@link YApi http://11.51.194.248:3000/project/5/interface/api/1116}
  * @typedef {Object} Response 响应参数
  * @property {boolean} Response.data - 返回数据 是否存在变更
  *
  * @param {Object} data 请求参数
  *
  * @returns {Promise.<Response>} 表示根据消息ID检查消息文档元数据是否存在变更返回响应参数的Promise对象
  */
  saveMessageCategory: data =>
    request_msg.post("/bizmsg/saveMessageCategory", data),
    
  /**
  * 根据解决方案ID获取消息分类列表
  *
  * @see {@link YApi http://11.51.194.248:3000/project/5/interface/api/1117}
  * @typedef {Object} Response 响应参数
  * @property {boolean} Response.data - 返回数据 
  *
  * @param {Object} params 请求参数
  * @param {number} params.unitId - 对接方案ID
  *
  * @returns {Promise.<Response>} 
  */
  getMessageCategoryByUnitId: params =>
    request_msg.get("/bizmsg/getMessageCategoryByUnitId", { params }),
};

export default bizmsg;
