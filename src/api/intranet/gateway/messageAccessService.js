import gwApiRequest from "@/utils/gwApiRequest.js";

const messageAccessService = {
  // 消息发布记录
  queryMessageUpdateLog: (data) =>
    gwApiRequest.post(
      "/MessageAccessService/queryMessageUpdateLog",
      JSON.stringify(data),
      {
        headers: {
          "LOP-DN": "LOP_MESSAGE_WEB",
        },
      }
    ),
  // 获取消息列表
  queryMessageList: (data) =>
    gwApiRequest.post(
      "/MessageAccessService/queryMessageList",
      JSON.stringify(data),
      {
        headers: {
          "LOP-DN": "LOP_MESSAGE_WEB",
        },
      }
    ),
  // 查询基础数据
  queryMessageBaseInfo: (data) =>
    gwApiRequest.post(
      "/MessageAccessService/queryMessageBaseInfo",
      JSON.stringify(data),
      {
        headers: {
          "LOP-DN": "LOP_MESSAGE_WEB",
        },
      }
    ),
  // 查询通道
  queryLsbChannel: (data) =>
    gwApiRequest.post(
      "/LsbChannelWebService/queryLsbChannel",
      JSON.stringify(data),
      {
        headers: {
          "LOP-DN": "LOP_MESSAGE_WEB",
        },
      }
    ),
  // 查询标签
  queryApiCategory: (data) =>
    gwApiRequest.post(
      "/ApiManagerService/queryApiCategory",
      JSON.stringify(data),
      {
        headers: {
          "LOP-DN": "LOP_MESSAGE_WEB",
        },
      }
    ),
  // 保存基础信息
  saveMessageBaseInfo: (data) =>
    gwApiRequest.post(
      "/MessageAccessService/saveMessageBaseInfo",
      JSON.stringify(data),
      {
        headers: {
          "LOP-DN": "LOP_MESSAGE_WEB",
        },
      }
    ),
  // 查询订阅方
  queryMessageSubscribers: (data) =>
    gwApiRequest.post(
      "/MessageAccessService/queryMessageSubscribers",
      JSON.stringify(data),
      {
        headers: {
          "LOP-DN": "LOP_MESSAGE_WEB",
        },
      }
    ),
  // 查询消息文档
  queryDoc: (data) =>
    gwApiRequest.post("/MessageAccessService/queryDoc", JSON.stringify(data), {
      headers: {
        "LOP-DN": "LOP_MESSAGE_WEB",
      },
    }),
  // 保存消息文档
  saveDoc: (data) =>
    gwApiRequest.post("/MessageAccessService/saveDoc", JSON.stringify(data), {
      headers: {
        "LOP-DN": "LOP_MESSAGE_WEB",
      },
    }),
  // 通过JSON快速维护消息文档
  quickMaintainDocByJson: (data) =>
    gwApiRequest.post(
      "/MessageAccessService/quickMaintainDocByJson",
      JSON.stringify(data),
      {
        headers: {
          "LOP-DN": "LOP_MESSAGE_WEB",
        },
      }
    ),
  // 申请发布消息
  applyPublish: (data) =>
    gwApiRequest.post(
      "/MessageAccessService/applyPublish",
      JSON.stringify(data),
      {
        headers: {
          "LOP-DN": "LOP_MESSAGE_WEB",
        },
      }
    ),
  // 注册消息
  registerMessage: (data) =>
    gwApiRequest.post(
      "/MessageAccessService/registerMessage",
      JSON.stringify(data),
      {
        headers: {
          "LOP-DN": "LOP_MESSAGE_WEB",
        },
      }
    ),
  // 发布校验
  checkMessageBeforePublish: (data) =>
    gwApiRequest.post(
      "/MessageAccessService/checkMessageBeforePublish",
      JSON.stringify(data),
      {
        headers: {
          "LOP-DN": "LOP_MESSAGE_WEB",
        },
      }
    ),
  /**
   *@see {@link YApi http://11.51.194.248:3000/project/5/interface/api/1113}
   * @typedef {Object} Search 查询消息文档的xml
   * @property {string} Search.topic
   *
   * @typedef {Object} Response
   * @property {data} Response.data xml字符串
   *
   * @param {Search[]}
   * @returns {Promise.<Response>}
   */
  queryMessageDocXml: (data) =>
    gwApiRequest.post(
      "/MessageAccessService/queryMessageDocXml",
      JSON.stringify(data)
    ),
  /**
   *@see {@link YApi http://11.51.194.248:3000/project/5/interface/api/1109}
   * @typedef {Object} Object xml方式保存消息文档
   * @property {string} Object.topic
   * @property {string} Object.jssKey
   *
   * @typedef {Object} Response
   * @property {data} Response.data
   *
   * @param {Search[]}
   * @returns {Promise.<Response>}
   */
  saveDocByXml: (data) =>
    gwApiRequest.post(
      "/MessageAccessService/saveDocByXml",
      JSON.stringify(data)
    ),
};

export default messageAccessService;
