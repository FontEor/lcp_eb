import request_msg from "@/utils/request_msg.js";

const user = {
  /**
   * 获取当前用户团队角色
   *
   * @see {@link YApi http://}
   * 
   * @typedef {Object} Response 响应参数
   * @property {number} Response.data - 返回数据 当前用户团队角色 0:普通用户 1:管理员
   *
   * @returns {Promise.<Response>} 表示获取当前用户团队角色返回响应参数的Promise对象
   */
  getUserRole: () => request_msg.get("/user/getUserRole"),


  /**
   * 内网获取团队信息
   */
  getTeamListInfo: () => request_msg.post("/user/getTeamListInfo"),
};

export default user;
