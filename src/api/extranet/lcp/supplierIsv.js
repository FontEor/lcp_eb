import request_msg from "@/utils/request_msg.js";

const supplierIsv = {
  /**
   * 获取账号资质认证状态
   *
   * @see {@link YApi http://}
   *
   * @typedef {Object} Response 响应参数
   * @property {Object[]} Response.data - 返回数据 资质认证数据列表
   * @property {number} Response.data[].type - 资质类型 1:"ISV", 2:"自研商家", 4:"合作伙伴"
   * @property {number} Response.data[].status - 认证状态 0:"未认证", 1:"审核中", 2:"未通过", 3:"已认证"
   *
   * @returns {Promise.<Response>} 表示获取账号资质认证状态返回的Promise对象
   */
  getQualificationStatus: () =>
    request_msg.get("/supplierIsv/getQualificationStatus")
};

export default supplierIsv;
