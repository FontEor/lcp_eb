import gwApiRequest from "@/utils/gwApiRequest.js";

// API管理-集群
const cloudCluster = {
    /**
     * API管理-集群列表查询(分页查询)
     * @param {string} name 集群中文名称
     * @param {string} page 分页对象
     */
    queryListPage: params => gwApiRequest.post("/ApiManagerService/queryCloudClusterListPage", params), 

    /**
     * API管理-集群详情查询
     * @param {number} id 集群ID
     */
    queryCloudClusterDetails: params => gwApiRequest.post("/ApiManagerService/findCloudClusterDetail", [params])
};

export default cloudCluster;