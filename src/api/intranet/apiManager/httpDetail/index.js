import request from "@/utils/request_noMsg.js";
import gwApiRequest from "@/utils/gwApiRequest.js";
import basicInfo from "@/api/intranet/apiManager/httpDetail/basicInfo.js";
import apiDoc from "@/api/intranet/apiManager/httpDetail/apiDoc.js";

// API管理-HTTP协议API详情统一注册API
const httpDetail = {
  /**
   * API管理-选择HTTP协议-点击管理进入HTTP协议API详情-API基本信息
   * @param {string} id HTTP协议apiID
   */
  getApi: params => gwApiRequest.post("/HttpApiService/findApi", params),

  /**
   * API管理-选择HTTP协议-点击管理进入HTTP协议API详情-发布前校验API基本信息
   * @param {string} id HTTP协议apiID
   */
  verifyApiSummaryFull: params =>
    gwApiRequest.post("/HttpApiService/verifyPublishApi", params),

  /**
   * API管理-选择HTTP协议-发布API
   * @param {number} id api id
   * @param {number} categoryId api分类id
   * @param {string} categoryName api分类名称
   * @param {number} tps tps
   * @param {number} dailyCall 日调用量
   * @param {string} approver 审批人
   *
   */
  postApi: data => gwApiRequest.post("/HttpApiService/publishApi", [data]),

  /**
   * 方法列表-编辑文档-保存文档
   * @param {number} type API类型 1:JSF 2:HTTP
   * @param {number} id 接口ID
   * @param {[object]]} inParamList 请求参数列表数据
   * @param {[object]]} outParamList 响应参数列表数据
   * @param {[object]]} errorCodeList 错误码列表数据
   */
  updateApiDoc: data =>
    gwApiRequest.post("/ApiManagerService/updateApiDoc", JSON.stringify(data)),

  /**
   * 方法列表-编辑文档-快速维护-XML上传
   * @param {string} jssKey jssKey
   * @param {number} type 类型 1:JSF 2:HTTP
   * @param {number} apiId apiID
   * @param {number} judgeType 参数类型 1:请求参数 2:响应参数
   */
  quickMaintainApiDocByXml: data =>
    gwApiRequest.post(
      "/ApiManagerService/quickMaintainApiDocByXml",
      JSON.stringify(data)
    ),
  /**
   * 方法列表-编辑文档-快速维护-JSON上传
   * @param {string} jssKey jssKey
   * @param {number} type 类型 1:JSF 2:HTTP
   * @param {number} apiId
   * @param {number} judgeType 参数类型 1:请求参数 2:响应参数
   */
  quickMaintainApiDocByJson: data =>
    gwApiRequest.post(
      "/ApiManagerService/quickMaintainApiDocByJson",
      JSON.stringify(data)
    ),

  basicInfo,
  apiDoc
};

export default httpDetail;
