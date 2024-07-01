import request_noMsg from "@/utils/request_noMsg.js";
import request from "@/utils/request.js";

// EDI管理统一注册API
const ediManager = {
    /**
     * 判断商家是否已经存在
     * @param {string} code 商家编码
     */
    isExistMerchant: (code) => {
        const url = `/merchant/isExistMerchant/${code}`;
        const method = "get";
        const config = { url, method, code };
        return request_noMsg(config);
    },

    /**
     * 判断业务编码是否正确
     * @param {number} businessCode 业务编码
     * @param {string} businessCodeType 业务编码类型 （1:青龙  2:事业编）
     */
    isCorrectBusinessCode: (params) => {
        const url = "/merchant/isCorrectBusinessCode";
        const method = "get";
        const config = { url, method, params };
        return request_noMsg(config);
    },

    /**
    * 创建商家
    */
    createMerchant: data =>
        request.post("/merchant/createMerchant", data),

    /**
    * 回显商家信息
    */
    echoMerchant: code =>
        request.get(`/merchant/selectMerchant/${code}`),

    /**
     * 修改商家信息
     */
    updateMerchant: data =>
        request.post("/merchant/updateMerchant", data),
};

export default ediManager;
