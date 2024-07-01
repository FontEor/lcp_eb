import request_noMsg from "@/utils/request_noMsg.js";
import request from "@/utils/request.js"

// 软件系统-开发者资源-开放扩展点统一注册API
const openExtensionPoint = {
  /**
   * 软件系统详情-开发者资源-开放扩展点-查询扩展点列表
   * @param {string} productCode 软件系统编码
   * @param {number} productSysGroupId 软件系统分类ID
   * @param {string} keyWords 关键字
   * @param {number} pageNum 当前页码
   * @param {number} pageSize 每页数据条数
   */
  list: data => request_noMsg.post("/product/spi/list", data),

  /**
   * 软件系统详情-开发者资源-开放扩展点-上传IDEA插件生成的API描述文件 Form Data
   * @param {string} file 二进制文件
   */
  upload: data => request_noMsg.post("/product/spi/upload", data),

  /**
   * 软件系统详情-开发者资源-开放扩展点-注册扩展点
   * @param {string} productCode 软件系统编码
   * @param {string} xmlJssKey 上传XML jssKey
   * @param {string} interfaceName 接口名称
   * @param {string} methodName 方法名称
   * @param {number} productSysGroupId 软件系统分类ID
   * @param {string} cnName 方法中文名称
   * @param {string} uri URI
   * @param {string} docJssKey 触发场景描述
   */
  save: data => request_noMsg.post("/product/spi/save", data),

  /**
   * 软件系统详情-开发者资源-开放扩展点-更新触发场景描述
   *
   * @param {number} id 软件系统ID
   * @param {string} docJssKey 触发场景描述
   */
  update: data => request_noMsg.post("/product/spi/update", data),

  /**
   * 软件系统详情-开发者资源-开放扩展点-删除开放扩展点
   * @param {string} id 软件系统ID
   */
  delete: params => request_noMsg.get("/product/spi/delete", { params }),

  /**
   * 软件系统详情-开发者资源-开放接口-查看扩展点文档
   * @param {string} id 开放扩展点ID
   */
  getDoc: params => request_noMsg.get("/product/spi/getDoc", { params }),

  /**
   * 软件系统详情-开发者资源-开放扩展点-更新扩展点文档
   * @param {string} productCode 软件系统编码
   * @param {number} id 开放扩展点ID
   * @param {string} cnName 中文名称
   * @param {string} remark 描述
   * @param {object[]} inParamList 请求参数
   * @param {object[]} outParamList 响应参数
   * @param {object[]} errorCodeList 错误码
   * @param {number} productSysGroupId 分类ID 2022-01-10新增字段
   */
  editDoc: data => request_noMsg.post("/product/spi/editDoc", data),

  /**
   * 软件系统详情-开发者资源-开放扩展点-当前运行环境扩展点上下线
   * @param {number} id 开放扩展点ID
   * @param {string} spiIsOnline 是否上线 0:下线 1:上线
   */
  settingIsOnline: data =>
    request_noMsg.post("/product/spi/settingIsOnline", data),

  /**
   * 软件系统详情-开发者资源-开放扩展点-预发运行环境扩展点上下线
   * @param {number} id 开放扩展点ID
   * @param {string} spiUatIsOnline 是否上线 0:下线 1:上线
   */
  settingUatIsOnline: data =>
    request_noMsg.post("/product/spi/settingUatIsOnline", data),

  /**
   * 软件系统详情-开发者资源-开放扩展点-当前运行环境扩展点取消上下线
   * @param {number} id 开放扩展点ID
   */
  cancelOnlineState: id =>
    request_noMsg.post("/product/spi/cancelOnlineState", id, {
      headers: { "Content-Type": "application/json;charset=UTF-8" }
    }),

  /**
   * 软件系统详情-开发者资源-开放扩展点-预发运行环境扩展点取消上下线
   * @param {number} id 开放扩展点ID
   */
  cancelUatOnlineState: id =>
    request_noMsg.post("/product/spi/cancelUatOnlineState", id, {
      headers: { "Content-Type": "application/json;charset=UTF-8" }
    }),

  /**
   * 软件系统详情-开发者资源-开放扩展点-隐藏扩展点
   * @param {number} id 开放扩展点ID
   */
  hide: id =>
    request_noMsg.post("/product/spi/hide", id, {
      headers: { "Content-Type": "application/json;charset=UTF-8" }
    }),

  /**
   * 软件系统详情-开发者资源-开放扩展点-取消隐藏扩展点
   * @param {number} id 开放扩展点ID
   */
  show: id =>
    request_noMsg.post("/product/spi/show", id, {
      headers: { "Content-Type": "application/json;charset=UTF-8" }
    }),

  /**
   * 软件系统详情-开发者资源-开放扩展点文档-管理分类-删除分类
   */
  deleteSysGroup: id =>
    request.delete(`/product/sysGroup/delete/${id}`),

  /**
   * 软件系统详情-开发者资源-开放扩展点文档-管理分类-保存分类
   * @param {string} productCode 软件系统编码
   * @param {number} type 开发者资源类别类型 2:"接口", 3:"扩展点", 4:"消息"
   * @param {object } groupList  
   */
  saveSysGroup: data => request.post("/product/sysGroup/batchSave", data),
};

export default openExtensionPoint;
