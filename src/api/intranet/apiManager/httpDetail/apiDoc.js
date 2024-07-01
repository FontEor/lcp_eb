import gwApiRequest from "@/utils/gwApiRequest";
import request from "@/utils/request_noMsg.js";

// API管理-HTTP协议API详情-API文档统一注册API
const apiDoc = {
  /**
   * API管理-选择HTTP协议-点击管理进入HTTP协议API详情-API文档-查询API文档
   * @param {number} id HTTP协议apiID
   * @param {string} groupCode 开发商编码
   */
  findApiDoc: params =>
    gwApiRequest.post("/HttpApiService/findApiDoc", [params]),

  /**
   * API管理-选择HTTP协议-点击管理进入HTTP协议API详情-API文档-通过api的xml文档的方式更新API文档
   * @param {number} id HTTP协议apiID
   * @param {string} groupCode 开发商编码
   * @param {string} apiXml 上传的api的xml文件内容，结果同JSF的相同，但是只能一个方法
   */
  saveOrUpdateApiDocForXml: (data, params) =>
    request.post("/httpApi/saveOrUpdateApiDocForXml", data, { params }),

  /**
   * API管理-选择HTTP协议-点击管理进入HTTP协议API详情-API文档-通过页面编辑的方式更新API文档
   * @param {number} id HTTP协议apiID
   * @param {string} groupCode 开发商编码
   * @param {array} inParamList 更新的入参列表，结构和API文档中的参数结构相同
   * @param {array} outParamList 更新的出参列表，结构和API文档中的参数结构相同
   * @param {array} errorCodeList 错误码列表，结构和API文档中的参数结构相同
   */
  updateApiDoc: data => request.post("/httpApi/updateApiDoc", data)
};

export default apiDoc;
