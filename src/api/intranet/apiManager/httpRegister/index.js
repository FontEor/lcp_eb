import request from "@/utils/request.js";
import gwApiRequest from "@/utils/gwApiRequest";

// API管理-保存http类型的API分组
const httpRegister = {
    /**
     * API管理-创建分组
     * @param {string} intr 分组描述
     * @param {number} type 服务类型,1: JSF服务，2：HTTP服务，3：HTTP流
     * @param {string} cnName 分组的中文名称
     * @param {string} domainCode 分组的英文名称或编码
     * @param {string} serviceType 发布范围
     */
    saveCloudDomain: data => gwApiRequest.post("/CloudDomainService/fontSave", data),
    /**
     * API管理-注册API
     * @param {string} name api中文名称
     * @param {number} type 服务类型,1: JSF服务，2：HTTP服务，3：HTTP流
     * @param {number} lcpAppId 所属应用id
     * @param {number} domainId 所属分组id
     * @param {string} lcpAppName 所属应用名称
     * @param {string} lcpAppKey 所属应用code
     * @param {string} domainCode 分组的英文名称或编码
     * @param {string} domainName 所属分组名称
     * @param {string} url URI
     */
    addHttpApi: data => gwApiRequest.post("/HttpApiService/addApi", data),
    /**
     * -获取API分组
     * @param {string} id apiID
     */
    getApiDomain: params => gwApiRequest.post("/CloudDomainService/getApiDomain",  params ),
};

export default httpRegister;
