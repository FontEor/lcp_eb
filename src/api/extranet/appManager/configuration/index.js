import request from "@/utils/request.js";
import request_msg from "@/utils/request_msg.js";

//外网-应用管理-配置
const configuration = {
    /**
    * 应用管理-配置-接口列表
    * @param {string} unitCode  对接方案Code
    * @param {string} callDirection  调用方向，callDirection： 前端传值为2，内调外方向
    * @param {string} appCode  应用编码
    * 
    */
    queryApiList: data => request.post("/bizapinterface/outer/unit/queryApiList", data),
    /**
    * 应用管理-配置-接口列表-提交订阅API审核
    * @param {string} unitCode  对接方案Code
    * @param {string} id  API的主键id
    * @param {string} domainOfGateway  API所属的网关服务域
    * 
    */
    submitAPISubscribe: params => request.get("/bizapinterface/outer/unit/submitAPISubscribe", { params }),
    /**
     * 应用管理-配置-接口列表-取消已订阅的API
     * @param {string} subCode  审批表的Code
     * 
     */
    cancelSub: params => request.get("/bizapinterface/outer/unit/cancelSub", { params }),
    /**
     * 应用管理-配置-接口列表-已经订阅成功的配置URL
     * @param {string} subCode  审批表的Code
     * @param {string} callBackUrl  完整的回调Url
     * 
     */
    addCallBackUrl: params => request.get("/bizapinterface/outer/unit/addCallBackUrl", { params }),

    /**
     * 定义应用管理-配置-接口列表-已经订阅成功的配置URL接口
     *
     * @see {@link YApi http://11.51.194.248:3000/project/5/interface/api/1655}
     * @typedef {Object} Response 响应参数
     * @property {Object} Response.data - 返回数据
     *
     * @param {Object} data 请求参数
     * @param {string} data.subCode - 审批表的Code
     * @param {string} data.callBackUrl - 完整的回调Url
     * @param {string} data.shadowboxCallbackUrl - 沙箱完整的回调Url
     *
     * @returns {Promise.<Response>} 表示应用管理-配置-接口列表-已经订阅成功的配置URL接口返回响应参数的Promise对象
     */
    saveCallBackUrl: data => request_msg.post("/bizapinterface/outer/unit/saveCallBackUrl", data),
};

export default configuration;
