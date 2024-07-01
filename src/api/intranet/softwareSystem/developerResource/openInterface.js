import request from "@/utils/request_noMsg.js";

// 软件系统-开发者资源-开放接口统一注册API
const openInterface = {
  /**
   * 软件系统详情-开发者资源-开放接口-查询API列表
   * @param {string} productCode 软件系统编码
   * @param {number} productSysGroupId 软件系统分类ID
   * @param {string} keyWords 关键字
   * @param {number} pageNum 当前页码
   * @param {number} pageSize 每页数据条数
   */
  list: data => request.post("/product/openapi/list", data),

  /**
   * 软件系统详情-开发者资源-开放接口-添加接口-获取API仓库接口
   * @param {string} keyWords 关键字
   */
  apiRepositories: data =>
    request.post("/product/openapi/apiRepositories", data),

  /**
   * 软件系统详情-开发者资源-开放接口-添加开放api接口
   * @param {string} productCode 软件系统编码
   * @param {string} interfaceName 接口名称
   * @param {string} methodName 方法名称
   * @param {number} productSysGroupId 软件系统分类ID
   */
  add: data => request.post("/product/openapi/add", data),

  /**
   * 软件系统详情-开发者资源-开放接口-删除开放api
   * @param {string} id 软件系统ID
   */
  delete: params => request.get("/product/openapi/delete", { params })
};

export default openInterface;
