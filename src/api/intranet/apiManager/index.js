import jsfDetail from "@/api/intranet/apiManager/jsfDetail/index.js";
import httpDetail from "@/api/intranet/apiManager/httpDetail/index.js";
import httpRegister from "@/api/intranet/apiManager/httpRegister/index.js";
import cloudCluster from "@/api/intranet/apiManager/cloudCluster/index.js";
import apiGroup from "@/api/intranet/apiManager/apiGroup/index.js"
import request from "@/utils/request_noMsg.js";
import gwApiRequest from "@/utils/gwApiRequest";

// API管理统一注册API
const apiManager = {
  jsfDetail,
  httpDetail,
  httpRegister,
  cloudCluster,
  apiGroup,
  /**
   * API管理-选择HTTP协议-点击管理进入HTTP协议API详情-API基本信息-查询应用列表
   */
  findAppListForSelect: () => request.get("/select/findAppListForSelect"),

  /**
   * API管理-选择HTTP协议--查询API分组列表
   * @param {string} keyWords 查询http类型API分组的关键字
   * @param {number | null} isOnline 控制台查询: 为null即可；非控制台查询:isOnline，固定传1
   * @param {number} page 页码编号
   * @param {number} pageSize 每页数据数量，如果前端不做分页 page=1,pageSize=10000（较大的值）
   */
  queryCloudDomainList: params =>
    gwApiRequest.post("/CloudDomainService/query", params),

  /**
   * API管理-选择HTTP协议-点击管理进入HTTP协议API详情-显示顶栏信息
   * @param {string} code 分组的英文名称或编码
   * @param {string} cnName 分组的中文名称
   * @param {string} intr 分组描述
   * @param {number} serviceType 发布范围
   * @param {number} type 服务类型,1: JSF服务，2：HTTP服务，3：HTTP流
   */
  saveCloudDomain: data => gwApiRequest.post("/CloudDomainService/fontSave", data),
  /**
   * API管理-创建API分组-校验分组英文名称
   * @param {String} data 分组英文名称
   */
  checkDomainIsExist: data => gwApiRequest.post("/CloudDomainService/checkDomainIsExist", data)
};

export default apiManager;
