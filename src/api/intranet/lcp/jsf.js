import request_msg from "@/utils/request_msg.js";

const jsf = {
  /**
   * 定义根据接口名称与别名校验接口下别名是否存在接口
   *
   * @see {@link YApi http://11.51.194.248:3000/project/5/interface/api/1633}
   * @typedef {Object} Response 响应参数
   * @property {boolean} Response.data - 返回数据 是否存在
   *
   * @param {Object} params 请求参数
   * @param {string} params.qualifiedName - 接口名称
   * @param {string} params.alias - 别名
   *
   * @returns {Promise.<Response>} 表示根据接口名称与别名校验接口下别名是否存在接口返回响应参数的Promise对象
   */
  checkAliasExist: (params) =>
    request_msg.get("/jsf/checkAliasExist", { params }),
};

export default jsf;
