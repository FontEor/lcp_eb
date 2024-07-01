import request from "@/utils/request.js";

const supplier = {
  /**
   * @description 查询指定的用户是否在当前的开发商团队下
   * @param {string} erp - 当前登录用户所属的开发商团队id
   */
  findSupplierUserByErp: params =>
    request({
      url: "/supplier/findSupplierUserByErp",
      method: "get",
      params
    })
};

export default supplier;
