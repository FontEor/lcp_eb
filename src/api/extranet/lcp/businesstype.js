import request_msg from "@/utils/request_msg.js";

const businesstype = {
  /**
   * 查询对接方案分类列表
   *
   * @see {@link YApi http://}
   *
   * @returns {Promise} 表示查询对接方案分类列表返回的Promise对象
   */
  getBusinessTypes: () => request_msg.get("/businesstype/getBusinessTypes")
};

export default businesstype;
