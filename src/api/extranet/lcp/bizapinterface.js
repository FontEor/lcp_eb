import request_msg from "@/utils/request_msg.js";

const bizapinterface = {
  callOutConfig: {
    /**
     * 定义外网-应用-对接方案-配置-回传API-配置接口
     *
     * @see {@link YApi http://11.51.194.248:3000/project/5/interface/api/1654}
     * @typedef {Object} Response 响应参数
     * @property {Object} Response.data - 返回数据
     *
     * @param {Object} params 请求参数
     * @param {number} params.subCode - queryApiList的返回列表的有subCode
     *
     * @returns {Promise.<Response>} 表示外网-应用-对接方案-配置-回传API-配置接口返回响应参数的Promise对象
     */
    select: (params) =>
      request_msg.get("/bizapinterface/callOutConfig/select", { params }),
  },
};

export default bizapinterface;
