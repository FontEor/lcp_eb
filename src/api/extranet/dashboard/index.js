import request from "@/utils/request_noMsg.js";

// 监控看板
const dashboard ={
  /**
   * 监控看板-查看权限
   * @param {string} value 用户pin
   */
  perList: params => request.get("/dashboard/getPermissionList", {params}),
  /**
   * 监控看板-查询API列表
   */
  appList: () => request.get("/app/findAppInfoList"),
  /**
   * 监控看板-查询开发商名称
   */
  getSupplierId: params => request.get("/supplierIsv/findSupplierId", {params}),
  /**
   * 查看管理员
   */
  getSupplierMessage: () => request.get("/user/getSupplierUsersByUserPin")
}

export default dashboard
