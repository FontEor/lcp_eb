import request from "@/utils/request";
const interfaceList = {
  /**
   * 根据对接方案id查询本业务所有的分类
   * @param {Number} unitId 对接方案id
   * @returns
   */
  getApiCategory: (params) =>
    request.get("/bizapinterface/getApiCategory", { params }),

  /**
   * API分类保存【管理分类对话框保存】
   * @param {}
   */
  saveApiCategory: (data) =>
    request.post("/bizapinterface/saveApiCategory", data),

  /**
   * API分类删除【管理分类对话框删除】
   * @param {number} id
   */
  deleteApiCategoryById: (data) =>
    request.post("/bizapinterface/deleteApiCategoryById", data, {
      headers: {
        "Content-Type": "application/json",
      },
    }),
};
export default interfaceList;
