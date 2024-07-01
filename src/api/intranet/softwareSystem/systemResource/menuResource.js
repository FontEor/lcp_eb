import request from "@/utils/request_noMsg.js";

// 软件系统-系统资源-菜单资源管理统一注册API
const menuResource = {
  /**
   * 软件系统-点击管理进入详情-系统资源-菜单资源管理-查询资源列表 异常错误码10029表示列表中没有根节点
   * @param {string} category 资源类别 MENUTREE:菜单资源管理
   * @param {string} productId 软件系统ID
   */
  queryResourcesList: params =>
    request.get("/sysResources/queryResourcesList", { params }),

  /**
   * 软件系统-点击管理进入详情-系统资源-菜单资源管理-查询资源列表后创建资源根节点 若列表异常为空，则需要创建资源根节点
   * @param {string} category 资源类别 MENUTREE:菜单资源管理
   * @param {string} productId 软件系统ID
   */
  initSysResources: data =>
    request.post("/sysResources/initSysResources", data),

  /**
   * 软件系统-点击管理进入详情-系统资源-菜单资源管理-添加子资源节点
   * @param {number} parentId 父节点ID
   * @param {number} lopResourceId	资源标识ID
   * @param {string} resourceCode	资源编码
   * @param {string} resourceName	资源名称
   * @param {number} resourceType	资源类型 0:菜单 1:按钮 2:其它
   * @param {string} category	资源类别 MENUTREE:菜单资源管理
   * @param {string} resourceUrl	资源URL
   * @param {string} icon	icon图标
   * @param {string} remark	备注
   * @param {string} extendedField 扩展字段JSON串
   */
  createNode: data => request.post("/sysResources/createNode", data),

  /**
   * 软件系统-点击管理进入详情-系统资源-菜单资源管理-编辑资源节点
   * @param {number} id 资源ID
   * @param {number} lopResourceId	资源标识ID
   * @param {string} resourceName	资源名称
   * @param {string} resourceType	资源类型 0:菜单 1:按钮 2:其它
   * @param {string} category	资源类别 MENUTREE:菜单资源管理
   * @param {string} resourceUrl	资源URL
   * @param {string} icon	icon图标
   * @param {string} remark	备注
   * @param {string} extendedField 扩展字段JSON串
   */
  updateNode: data => request.post("/sysResources/updateNode", data),

  /**
   * 软件系统-点击管理进入详情-系统资源-菜单资源管理-删除资源节点
   * @param {number} id 资源ID
   * @param {number} lopResourceId	资源标识ID
   * @param {string} category 资源类别 MENUTREE:菜单资源管理
   */
  deleteNode: data => request.post("/sysResources/deleteNode", data),

  /**
   * 软件系统-点击管理进入详情-系统资源-菜单资源管理-查询系统资源扩展字段配置
   * @param {string} category 资源类别 MENUTREE:菜单资源管理
   * @param {string} productId 软件系统ID
   */
  queryConfig: params =>
    request.get("/sysResourcesExtendedField/queryConfig", { params }),

  /**
   * 软件系统-点击管理进入详情-系统资源-菜单资源管理-保存系统资源扩展字段配置
   * @param {string} category 资源类别 MENUTREE:菜单资源管理
   * @param {string} productId 软件系统ID
   * @param {object[]} configs 属性列表，可以为空
   *   @param {number} required 必填标识：0=非必填；1=必填
   *   @param {string} key 字段名称
   *   @param {string} enumValue 枚举值
   */
  saveConfig: data =>
    request.post("/sysResourcesExtendedField/saveConfig", data)
};

export default menuResource;
