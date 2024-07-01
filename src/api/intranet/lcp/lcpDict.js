import request_msg from "@/utils/request_msg.js";

const lcpDict = {
  /**
   * 根据类型与字典名查询字典表数据
   *
   * @see {@link YApi http://}
   *
   * @typedef {Object} Response 响应参数
   * @property {Object[]} Response.data - 返回数据 字典数据列表
   * @property {string} Response.data[].type - 属性值
   * @property {string} Response.data[].dictName - 字典名
   * @property {string} Response.data[].dictValue - 字典值
   * @property {string} Response.data[].remarks - 备注
   *
   * @param {Object} params 请求参数
   * @param {string} params.type - 属性值
   * @param {string} params.dictName - 字典名
   *
   * @returns {Promise.<Response>} 表示根据接口名称与方法名称查询其下设置参数映射接受账号的入参字段级联列表数据返回响应参数的Promise对象
   */
  getDicts: params => request_msg.get("/lcpDict/getDicts", { params })
};

export default lcpDict;
