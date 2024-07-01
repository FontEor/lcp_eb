import request from "@/utils/request.js";

// 软件系统-产品版本一注册API
const productVersion = {
  /**
   * 软件系统-查看产品版本列表
   * @param {string} category 资源类别 MENUTREE:菜单资源管理
   * @param {number} productId 软件系统ID
   * @param {number} pageNum 分页-当前页
   * @param {number} pageSize	 一页显示的条数
   */
  queryVersionList: data => request.post("/sysVersion/queryVersionList", data),

  /**
   * 软件系统-查看产品版本详情
   * @param {string} category 资源类别 MENUTREE:菜单资源管理
   * @param {string} lopResourceId  资源标识ID
   */
  queryVersionDetails: params =>
    request.get("/sysVersion/queryVersionDetails", { params }),

  /**
   * 软件系统-修改产品版本
   * @param {Array} ids 选中的ID
   * @param {number} lopResourceId	资源标识ID
   * @param {string} category	资源类别 MENUTREE:菜单资源管理
   */
  updateVersion: data => request.post("/sysVersion/updateVersion", data),

  /**
   * 软件系统-创建产品版本
   * @param {Array} ids 选中的ID
   * @param {number} productId	软件系统id
   * @param {string} versionName	版本名称
   * @param {string} category	资源类别 MENUTREE:菜单资源管理
   * @param {string} versionCode	版本编码
   * @param {string} remark	备注
   */
  createVersion: data => request.post("/sysVersion/createVersion", data),

  /**
   * 软件系统-删除产品版本
   * @param {number} id 资源ID
   * @param {number} productId 软件系统id
   * @param {string} category 资源类别 MENUTREE:菜单资源管理
   */
  deleteVersion: data => request.post("/sysVersion/deleteVersion", data),

  /**
   * 判断是否有租户订阅当前版本（包含开通中、已开通）
   * @param {number} id 版本id
   */
  checkVersionOpenStatus: params =>
    request.get("/sysVersion/checkVersionOpenStatus", { params }),

  /**
   * 同步资源
   * @param {number} activateId 版本id
   */
  syncResources: params =>
    request.get("/saas/system/tenement/version/activate/sync", { params }),

  /**
   * 查询同步资源列表
   * @param {number} productId	软件系统ID
   */
  syncResourcesList: (data, params) =>
    request.post("/saas/system/tenement/version/activate/activated", data, {
      params
    }),

   /**
    * 批量同步SaaS系统资源版本
    * @param {array} activateIds	SaaS系统租户版本开通记录-主键id
    */
  batchSync: data => request.post("/saas/system/tenement/version/activate/batchSync", data),

  /**
   * 校验版本编码
   * @param {number} productId	软件系统ID
   * @param {number} versionCode	版本编码
   */
  checkVersionCode: data => request.post("/sysVersion/checkVersionCode", data),

  /**
   * 查询系统资源扩展字段配置
   * @param {number} productId 软件系统id
   * @param {string} category 资源类别 MENUTREE:菜单资源管理
   */
  queryConfig: params =>
    request.get("/sysResourcesExtendedField/queryConfig", { params }),

  /**
  * 查询产品版本配置API列表
  * @param {number} productCode 产品版本code
  * @param {string} productSysGroupId 
  * @param {string} keyWords 
  * @param {string} pageNumb 
  * @param {string} pageNumb 
  * 
  */
  queryOpenApiList: data =>
    request.post("/product/openapi/list", data),

  /**
  * 查询产品版本配置API列表分类
  * @param {number} productCode 软件系统编码
  * @param {string} type 开发者资源类别类型（ 2=api, 3=spi, 4=msg）
  * 
  */
  queryProductSysgroupList: data =>
    request.post("/product/sysGroup/list", data),

  /**
  * 版本关联资源查询
  * @param {number} versionId 版本id
  * @param {string} sysVersionRefType 系统版本类型，字典表 关联资源类型（1=系统资源，2=api,3=spi，4=msg）
  */
  querySysVersionRef: params =>
    request.get("/sysVersion/ref/query", { params }),

  /**
  * 查询产品版本配置API列表
  * @param {number} versionId 版本id
  * @param {string} rid 关联资源id
  * @param {number} sysVersionRefType 系统版本类型
  */
  packageSysVersion: data =>
    request.post("/sysVersion/package", data),

  /**
  * 查询产品版本配置扩展点列表
  * @param {number} productCode 产品版本code
  * @param {string} productSysGroupId 
  * @param {string} keyWords 
  * @param {string} pageNumb 
  * @param {string} pageNumb 
  * 
  */
  querySpiList: data =>
    request.post("/product/spi/list", data),
};

export default productVersion;
