import request from "@/utils/request.js";

const userManual = {
  /**
   * 查询对接方案文档列表
   * @param {number} unitId 对接方案id
   * @returns
   */
  getBusinessUnitDocByUnitId: params =>
    request.get("/doc/getBusinessUnitDocByUnitId", { params }),

  getDocById: params => request.get("/doc/getDocById", { params }),

  /**
   * 删除
   * @param {number} id
   * @returns
   */
  deleteApiCategoryById: data => request.post("/doc/deleteUnitDoc", data),
  /**
   * 编辑保存
   * @param {*} data
   * @returns
   */
  saveBusinessUnitDoc: data => request.post("/doc/saveBusinessUnitDoc", data),
  /**
   *新增保存
   * @param { number } objId 对接方案id
   * @param { string } title 文档或目录名称
   * @param { string } content 内容
   * @param { number } type 文档类型，对接方案文档，固定为3
   * @param { number } seq 排序
   * @param { integer } netType 网络类型
   * @param { integer } docType 文档类型(目录：1，文档：2)
   * @returns
   */
  createBusinessUnitDoc: data =>
    request.post("/doc/createBusinessUnitDoc", data),
  /**
   * 发布
   * @param {*} data
   * @returns
   */
  publishBusinessUnitDocById: data =>
    request.post("/doc/publishBusinessUnitDocById", data),

  /**
   * 下线
   * @param {Number} id
   * @returns
   */
  downDoc: data => request.post("/doc/downDocById", data),

  /**
   * 排序
   * @param {number} id 文档id
   * @param {number} parentId 文档或目录的父id
   * @param {number} objId 对接方案id
   * @param {integer} seq 排序
   * @returns
   */
  updateDocSeq: data => request.post("/doc/updateDocSeq", data)
};

export default userManual;
