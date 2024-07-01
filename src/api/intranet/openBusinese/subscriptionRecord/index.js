import request from "@/utils/request.js";
import noMsgRequest from "@/utils/request_noMsg.js";

// 对接方案-订阅记录
const subscriptionRecord = {
    /**
     * 对接方案-订阅记录-查询指定AppKey订阅的消息列表
     * @param {string} appKey 应用唯一编码
     * @param {number} page 页码
     * @param {number} pageSize 分页大小
     * @param {number} unitId	 对接方案编码
     */
    findSubMsgByAppKey: data => request.post("/bizmsg/findSubMsgByAppKey", data),

    /**
     * 对接方案-订阅记录-保存业务（路由）编码（合作伙伴类型应用，支持批量）
     * 详见接口地址： http://11.51.194.248:3000/project/5/interface/api/794
     * @param {number} id 消息id
     * @param {number} unitId	 对接方案编码
     * @param {number} name	 消息编码
     * @param {string} chineseName	 消息中文名称
     * @param {string} descr	 消息描述
     * @param {number} dailyCall	 日调用量
     * @param {number} tps	 tps
     * @param {object} partnerMessageRouteConfigList	上传xml文件
     */
    savePartnerRouteConfig: data => request.post("/bizmsg/savePartnerRouteConfig", data),
    /**
    * 对接方案-订阅记录-查询已订阅回传接口列表  内调外
    * @param {number} pageNumb 页码
    * @param {number} pageSize 分页大小
    * @param {string} appCode 应用code
    * @param {number} unitCode 对接方案编码
    * @param {number} supplierCode 开发商编码
    * 
    */
    queryCallOutSubApiList: data => request.post("/bizapinterface/inner/unit/queryCallOutSubApiList", data),
    /**
     * 对接方案-订阅记录-配置业务编码
     * @param {string} subCode 接口编码
     * @param {number} customerCode 业务编码
     */
    addCustomerCode: params => noMsgRequest.get("/bizapinterface/inner/unit/addCustomerCode", { params }),

    /**
    * 对接方案-订阅记录-保存jsf接口列表 
    * @param {number} id 接口Id
    * @param {string} appKey 应用编码
    * @param {string} alias 当前环境别名
    * @param {number} unitId 开对接方案id
    * 
    */
    saveOrderedInterface: data=> request.post("/bizapinterface/saveOrderedInterface",data),
    
};

export default subscriptionRecord;
