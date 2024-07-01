import gwApiRequest from "@/utils/gwApiRequest.js";

const JsfApiService = {
  /**
   * 根据JSF接口名查询API仓库维护接口的别名列表
   *
   * @see {@link YApi http://11.51.194.248:3000/project/22/interface/api/989}
   * @typedef {Object} JSFInfo JSF信息对象
   * @property {string} JSFInfo.qualifiedName - 接口名
   *
   * @typedef {Object} Response 响应参数
   * @property {Object} Response.data - 返回数据 别名列表
   *
   * @param {JSFInfo[]} data - 由第一个元素是JSF信息对象组成的数组
   * @returns {Promise.<Response>} 表示根据JSF接口名查询API仓库维护接口的别名列表返回响应参数的Promise对象
   */
  queryAliasIfPresentInterface: data => {
    return gwApiRequest.post(
      "/JsfApiService/queryAliasIfPresentInterface",
      JSON.stringify(data)
    );
  },

  /**
   * 根据JSF接口名查询API仓库中维护的接口方法列表
   *
   * @see {@link YApi http://11.51.194.248:3000/project/22/interface/api/990}
   * @typedef {Object} JSFInfo JSF信息对象
   * @property {string} JSFInfo.qualifiedName - 接口名
   *
   * @typedef {Object} Response 响应参数
   * @property {Object} Response.data - 返回数据 方法列表
   *
   * @param {JSFInfo[]} data - 由第一个元素是JSF信息对象组成的数组
   * @returns {Promise.<Response>} 表示根据JSF接口名查询API仓库中维护的接口方法列表返回响应参数的Promise对象
   */
  queryMethodIfPresentInterface: data => {
    return gwApiRequest.post(
      "/JsfApiService/queryMethodIfPresentInterface",
      JSON.stringify(data)
    );
  }
};

export default JsfApiService;
