import request from "@/utils/request_noMsg.js";
import openInterface from "@/api/intranet/softwareSystem/developerResource/openInterface.js";
import openExtensionPoint from "@/api/intranet/softwareSystem/developerResource/openExtensionPoint";

// 软件系统-开发者资源统一注册API
const developerResource = {
  /**
   * 软件系统详情-开发者资源-根据开发者资源分类查询接口分组
   * @param {string} productCode 软件系统编码
   * @param {number} type 开发者资源类别类型 2:"接口", 3:"扩展点", 4:"消息"
   */
  list: data => request.post("/product/sysGroup/list", data),

  /**
   * 软件系统详情-开发者资源-接口分类保存
   * @param {string} productCode 软件系统编码
   * @param {number} type 开发者资源类别类型 2:"接口", 3:"扩展点", 4:"消息"
   * @param {string} cnName 分类中文名称
   * @param {string} enName 分类英文名称
   */
  save: data => request.post("/product/sysGroup/save", data),

  openInterface,
  openExtensionPoint
};

export default developerResource;
