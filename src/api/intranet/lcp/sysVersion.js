import request_msg from "@/utils/request_msg.js";

const sysVersion = {
  /**
   * 根据软件系统ID与资源类别查询软件系统版本列表
   *
   * @see {@link YApi http://11.51.194.248:3000/project/5/interface/api/239}
   *
   * @typedef {Object} Response 响应参数
   * @property {Object} Response.data - 返回数据
   *
   * @param {Object} data 请求参数
   * @param {number} data.productId - 软件系统ID
   * @param {string} data.category - 资源类别 {"MENUTREE":"菜单资源"}
   * @param {number} data.pageNum - 页码
   * @param {number} data.pageSize	- 每页显示的条数
   *
   * @returns {Promise.<Response>} 表示根据软件系统ID与资源类别查询软件系统版本列表返回响应参数的Promise对象
   */
  queryVersionList: data =>
    request_msg.post("/sysVersion/queryVersionList", data),

  /**
   * 根据版本ID判断是否有租户订阅当前版本（包含开通中、已开通）
   *
   * @see {@link YApi http://11.51.194.248:3000/project/5/interface/api/254}
   *
   * @typedef {Object} Response 响应参数
   * @property {Object} Response.data - 返回数据
   *
   * @param {Object} params 请求参数
   * @param {number} params.id - 版本ID
   *
   * @returns {Promise.<Response>} 表示根据版本ID判断是否有租户订阅当前版本（包含开通中、已开通）返回响应参数的Promise对象
   */
  checkVersionOpenStatus: params =>
    request_msg.get("/sysVersion/checkVersionOpenStatus", { params }),

  /**
   * 根据版本ID与资源类别删除产品版本
   *
   * @see {@link YApi http://11.51.194.248:3000/project/5/interface/api/242}
   *
   * @typedef {Object} Response 响应参数
   * @property {Object} Response.data - 返回数据
   *
   * @param {Object} data 请求参数
   * @param {number} data.id - 版本ID
   * @param {string} data.category - 资源类别 {"MENUTREE":"菜单资源"}
   *
   * @returns {Promise.<Response>} 表示根据版本ID与资源类别删除产品版本返回响应参数的Promise对象
   */
  deleteVersion: data => request_msg.post("/sysVersion/deleteVersion", data),

  /**
   * 根据软件系统ID与版本编码校验版本编码
   *
   * @see {@link YApi http://11.51.194.248:3000/project/5/interface/api/317}
   *
   * @typedef {Object} Response 响应参数
   * @property {Object} Response.data - 返回数据
   *
   * @param {Object} data 请求参数
   * @param {number} data.productId - 软件系统ID
   * @param {string} data.versionCode - 版本编码
   *
   * @returns {Promise.<Response>} 表示根据软件系统ID与版本编码校验版本编码返回响应参数的Promise对象
   */
  checkVersionCode: data =>
    request_msg.post("/sysVersion/checkVersionCode", data),

  /**
   * 根据选中的资源ID、软件系统ID、资源类别、版本编码、版本名称与备注创建产品版本
   *
   * @see {@link YApi http://11.51.194.248:3000/project/5/interface/api/230}
   *
   * @typedef {Object} Response 响应参数
   * @property {Object} Response.data - 返回数据
   *
   * @param {Object} data 请求参数
   * @param {Array} data.ids - 选中的资源ID
   * @param {number} data.productId - 软件系统ID
   * @param {string} data.category - 资源类别 {"MENUTREE":"菜单资源"}
   * @param {string} data.versionCode	- 版本编码
   * @param {string} data.versionName	- 版本名称
   * @param {string} data.remark	- 备注
   *
   * @returns {Promise.<Response>} 表示根据选中的资源ID、软件系统ID、资源类别、版本编码、版本名称与备注创建产品版本返回响应参数的Promise对象
   */
  createVersion: data => request_msg.post("/sysVersion/createVersion", data),

  /**
   * 根据资源标识ID与资源类别查询产品版本资源详情
   *
   * @see {@link YApi http://11.51.194.248:3000/project/5/interface/api/236}
   *
   * @typedef {Object} Response 响应参数
   * @property {Object} Response.data - 返回数据
   *
   * @param {Object} params 请求参数
   * @param {number} params.lopResourceId - 资源标识ID
   * @param {string} params.category - 资源类别 {"MENUTREE":"菜单资源"}
   *
   * @returns {Promise.<Response>} 表示根据资源标识ID与资源类别查询产品版本资源详情返回响应参数的Promise对象
   */
  queryVersionDetails: params =>
    request_msg.get("/sysVersion/queryVersionDetails", { params }),

  ref: {
    /**
     * 根据版本ID、系统版本类型与产品编码查询关联资源
     *
     * @see {@link YApi http://11.51.194.248:3000/project/5/interface/api/506}
     *
     * @typedef {Object} Response 响应参数
     * @property {Object} Response.data - 返回数据
     *
     * @param {Object} params 请求参数
     * @param {number} params.versionId - 版本ID
     * @param {string} params.sysVersionRefType - 系统版本类型 {1:"系统资源",2:"api",3:"spi",4:"msg"}
     * @param {number} params.productCode - 产品编码
     *
     * @returns {Promise.<Response>} 表示根据版本ID、系统版本类型与产品编码查询关联资源返回响应参数的Promise对象
     */
    query: params => request_msg.get("/sysVersion/ref/query", { params })
  },
  /**
   * 查看版本比对详情
   *
   * @see {@link YApi http://11.51.194.248:3000/project/5/interface/api/1098}
   *
   * @typedef {Object} Response 响应参数
   * @property {Object} Response.data - 返回数据
   *
   * @param {Object} params 请求参数
   * @param {String} params.category - 资源类别 写死：MENUTREE
   * @param {Number} params.currentLopResourceId - 当前版本的LopResourceId
   * @param {Number} params.targetLopResourceId - 目标版本的LopResourceId
   *
   * @returns {Promise.<Response>}
   */
  compare: params => request_msg.get("/sysVersion/compare", { params })
};

export default sysVersion;
