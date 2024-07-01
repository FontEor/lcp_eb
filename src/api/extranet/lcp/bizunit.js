import request_msg from "@/utils/request_msg.js";

const bizunit = {
  /**
   * 应用管理查询对接方案列表数据
   *
   * @see {@link YApi http://11.51.194.248:3000/project/5/interface/api/998}
   *
   * @param {Object} params 请求参数
   * @param {String} appKey
   * @returns
   */
  findRecord: params => request_msg.get("/bizunit/findRecord", { params }),

  /**
   * 应用管理对接方案上线
   *
   * @see {@link YApi http://11.51.194.248:3000/project/5/interface/api/998}
   *
   * @param {Object} params 请求参数
   * @param {number} params.bizOrderId - 对接方案列表中每条记录的ID
   * @returns {Promise} 表示应用管理对接方案上线返回的Promise对象
   */
  online: params => request_msg.get("/bizunit/online", { params }),
  /**
   * 应用管理对接方案上线提示气泡隐藏
   *
   * @see {@link YApi http://11.51.194.248:3000/project/5/interface/api/1045}
   *
   * @param {Object} params 请求参数
   * @param {number} params.bizOrderId - 对接方案列表中每条记录的ID
   */
  updateOnlineSign: params => request_msg.get("/bizunit/updateOnlineSign", { params })
};

export default bizunit;
