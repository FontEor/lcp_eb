import request from "@/utils/request.js";
import noMsgrequest from "@/utils/request_noMsg";

// 资质管理
const applyQualification = {
    /**
     * 资质管理-获取每个资质的状态
     */
    getQualificationStatus: params =>
        request.get("supplierIsv/getQualificationStatus", { params }),
    /**
     * 资质管理-获取用户角色
     */
    getUserRole: params =>
        request.get("user/getUserRole", { params }),
    /**
     * 资质管理-有无基本信息
     */
    haveBaseInfoFlag: data =>
        request.post("supplierIsv/haveBaseInfoFlag", data),

    /**
     * 外网-资质认证-填写基本信息-获取手机验证码
     * @param {string} phone 手机号码
     */
    getAuthCode: (params) => {
        const url = "/user/getAuthCode";
        const method = "post";
        const config = { url, method, params };
        return noMsgrequest(config);
    },

    /**
     * 外网-资质认证-填写基本信息-判断统一社会信用代码是否重复
     * @param {string} companyCode 统一社会信用代码
     */
    companyCodeExistedFlag: (params) => {
        const url = "/supplierIsv/companyCodeExistedFlag";
        const method = "get";
        const config = { url, method, params };
        return noMsgrequest(config);
    },

    /**
     * 外网-资质认证-填写基本信息-新增基本信息
     * @param {string} companyName 企业名称
     * @param {string} companyCode 统一社会信用代码
     * @param {string} contactsName 联系人姓名
     * @param {string} contactsEmail 联系人邮箱
     * @param {string} contactsPhone 联系人电话
     * @param {string} verificationCode 手机验证码
     */
    addBaseInfo: (data) => {
        const url = "/supplierIsv/addBaseInfo";
        const method = "post";
        const config = { url, method, data };
        return noMsgrequest(config);
    },
};

export default applyQualification;
