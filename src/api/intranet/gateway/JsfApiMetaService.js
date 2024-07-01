import gwApiRequest from "@/utils/gwApiRequest.js";

const JsfApiMetaService = {
  /**
   * 根据JSF接口名、JSF别名查询JSF接口在JSF注册中心的状态
   *
   * @see {@link YApi http://11.51.194.248:3000/project/22/interface/api/988}
   * @typedef {Object} JSFInfo JSF信息对象
   * @property {string} JSFInfo.qualifiedName - 接口名
   * @property {string} JSFInfo.jsfAlias - 别名
   * @property {string[]} JSFInfo.methodList - 方法列表
   *
   * @typedef {Object} Response 响应参数
   * @property {Object} Response.data - 返回数据
   * @property {number} Response.data.message - 校验信息
   *
   * @param {JSFInfo[]} data - 由第一个元素是JSF信息对象组成的数组
   * @returns {Promise.<Response>} 表示根据JSF接口名、JSF别名查询JSF接口在JSF注册中心的状态返回响应参数的Promise对象
   */
  findApiStatus: data => {
    return gwApiRequest.post(
      "/JsfApiMetaService/findApiStatus",
      JSON.stringify(data)
    );
  }
};

export default JsfApiMetaService;
