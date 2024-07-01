import request_msg from "@/utils/request_msg.js";

const userSatisfaction = {
  /**
   * 提交应用对接方案上线功能评价
   *
   * @see {@link YApi http://}
   *
   * @param {Object} data 请求参数
   * @param {number} data.objId - 对接方案列表中每条记录的ID
   * @param {number} data.type - 类型 1
   * @param {Object[]} data.userSatisfactionList - 评价列表
   * @param {string} data.userSatisfactionList[].dimension - 评价维度 1:dockingExperience 2:usingPlatform 3:operationsQuality
   * @param {number} data.userSatisfactionList[].score - 评分
   * @param {string} data.userSatisfactionList[].content - 意见反馈内容
   * @returns {Promise} 表示提交应用对接方案上线功能评价返回的Promise对象
   */
  submitUserSatisfactionRecord: data =>
    request_msg.post("/userSatisfaction/submitUserSatisfactionRecord", data)
};

export default userSatisfaction;
