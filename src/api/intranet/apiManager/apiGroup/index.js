import gwApiRequest from "@/utils/gwApiRequest";

// API管理-集群
const apiGroup = {
  /**
   * @description 查询分组的基本信息
   * @param {number} domainId 分组的id
   */
  getCloudDomainBase: params =>
    gwApiRequest.post("/CloudDomainService/info",  params )
};

export default apiGroup;
