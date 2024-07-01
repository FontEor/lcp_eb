import request_msg from "@/utils/request_msg.js";
import RSA from "@/utils/cipher.js";

const app = {
  /**
   * 定义根据应用ID查询外网应用管理概览数据接口
   *
   * @see {@link YApi http://11.51.194.248:3000/project/5/interface/api/1642}
   *
   * @typedef {Object} Response 响应参数
   * @property {Object} Response.data - 返回数据
   * @property {string} Response.data.name - 应用中文名称
   * @property {string} Response.data.code - 应用编码 appKey
   * @property {string} Response.data.remark - 应用描述
   * @property {number} Response.data.type - 应用类型
   * @property {Object} Response.data.appPositivePkiDto - 外调内API
   * @property {number} Response.data.appPositivePkiDto.prodPositivePkiId - 生产环境pkiId
   * @property {number} Response.data.appPositivePkiDto.uatPositivePkiId - 预发环境pkiId
   * @property {Object} Response.data.appBackPkiDto - 内调外API
   * @property {number} Response.data.appBackPkiDto.prodBackResetCount - 生产环境重置次数
   * @property {number} Response.data.appBackPkiDto.uatBackResetCount - 预发环境重置次数
   * @property {number} Response.data.appBackPkiDto.prodBackNeedEffect - 生产环境是否需要生效 0:否 1:是
   * @property {number} Response.data.appBackPkiDto.uatBackNeedEffect - 预发环境是否需要生效 0:否 1:是
   *
   * @param {Object} params 请求参数
   * @param {number} params.id - 应用ID
   *
   * @returns {Promise.<Response>} 表示根据应用ID查询外网应用管理概览数据接口返回的Promise对象
   */
  getOuterApp: (params) => request_msg.get("/app/getOuterApp", { params }),

  /**
   * 定义保存概览数据接口
   *
   * @see {@link YApi http://}
   *
   * @typedef {Object} Response 响应参数
   * @property {Object} Response.data - 返回数据
   *
   * @param {Object} params 请求参数
   * @param {number} params.id - 应用ID
   * @param {string} params.name - 应用中文名称
   * @param {string} params.remark - 应用描述
   *
   * @returns {Promise.<Response>} 表示保存概览数据接口返回的Promise对象
   */
  saveAppBaseInfo: (params) => {
    const headers = { "Content-Type": "application/x-www-form-urlencoded" };
    return request_msg.post("/app/saveAppBaseInfo", null, { params, headers });
  },

  /**
   * 定义根据AppKey查询AppSecret接口
   *
   * @see {@link YApi http://11.51.194.248:3000/project/5/interface/api/1643}
   *
   * @typedef {Object} Response 响应参数
   * @property {Object} Response.data - 返回数据
   * @property {string} Response.data.gatewaySecret - 加密的AppSecret
   *
   * @param {Object} getAppSecretParams 入参
   * @param {Object} getAppSecretParams.params 请求参数
   * @param {string} getAppSecretParams.params.appKey - AppKey code
   * @param {string} getAppSecretParams.key - key
   * @param {string} getAppSecretParams.iv - iv
   * @param {string} getAppSecretParams.ciphertext - ciphertext
   *
   * @returns {Promise.<Response>} 表示根据AppKey查询AppSecret接口返回的Promise对象
   */
  getAppSecret: (getAppSecretParams) => {
    const { params, key, iv, ciphertext } = getAppSecretParams;
    const { pkid } = window.env;
    const headers = {
      pkid,
      ciphertext,
      "LOP-DN": "cloud.proxy.jdl.com",
    };
    const baseURL = window.env.gatewayApiDecouplingOuter;

    const transformResponse = [
      (response) => {
        let decrypted = "";
        try {
          const message = response;
          decrypted = RSA.aesDecode(message, key, iv);
        } catch (error) {
          // console.warn(message);
          // console.warn(key, iv);
          console.error(error);
          decrypted = "";
        }
        try {
          return JSON.parse(decrypted);
        } catch (error) {
          console.warn(decrypted);
          console.warn(JSON.parse(decrypted));
          console.error(error);
          return {};
        }
      },
    ];
    return request_msg.get("/app/getAppSecret", {
      params,
      headers,
      baseURL,
      transformResponse,
    });
  },

  /**
   * 定义根据AppKey和pki类型查询外调内公钥接口
   *
   * @see {@link YApi http://11.51.194.248:3000/project/5/interface/api/1645}
   *
   * @typedef {Object} Response 响应参数
   * @property {string} Response.data - 返回数据
   *
   * @param {Object} data 请求参数
   * @param {string} data.code - AppKey code
   * @param {number} data.pkiType - PKI类型 1:生产环境 2:预发环境
   *
   * @returns {Promise.<Response>} 表示根据AppKey和pki类型查询外调内公钥接口返回的Promise对象
   */
  getPositivePki: (data) => request_msg.post("/app/getPositivePki", data),

  /**
   * 定义根据AppKey和pki类型查询内调外私钥接口
   *
   * @see {@link YApi http://11.51.194.248:3000/project/5/interface/api/1649}
   *
   * @typedef {Object} Response 响应参数
   * @property {string} Response.data - 返回数据
   *
   * @param {Object} getBackPkiParams 入参
   * @param {Object} getBackPkiParams.data 请求参数
   * @param {string} getBackPkiParams.data.code - AppKey code
   * @param {number} getBackPkiParams.data.pkiType - PKI类型 3:生产环境 4:预发环境
   * @param {string} getAppSecretParams.key - key
   * @param {string} getAppSecretParams.iv - iv
   * @param {string} getBackPkiParams.ciphertext - ciphertext
   *
   * @returns {Promise.<Response>} 表示根据AppKey和pki类型查询内调外私钥接口返回的Promise对象
   */
  getBackPki: (getBackPkiParams) => {
    const { data, key, iv, ciphertext } = getBackPkiParams;
    const { pkid } = window.env;
    const headers = { pkid, ciphertext, "LOP-DN": "cloud.proxy.jdl.com" };
    const baseURL = window.env.gatewayApiDecouplingOuter;

    const transformResponse = [
      (response) => {
        let decrypted = "";
        try {
          const message = response;
          decrypted = RSA.aesDecode(message, key, iv);
        } catch (error) {
          console.warn(message);
          console.error(error);
          decrypted = "";
        }
        try {
          return JSON.parse(decrypted);
        } catch (error) {
          console.warn(decrypted);
          console.warn(JSON.parse(decrypted));
          console.error(error);
          return {};
        }
      },
    ];

    return request_msg.post("/app/getBackPki", data, {
      headers,
      baseURL,
      transformResponse,
    });
  },

  /**
   * 定义根据AppKey和pki类型重置内调外私钥接口
   *
   * @see {@link YApi http://11.51.194.248:3000/project/5/interface/api/1646}
   *
   * @typedef {Object} Response 响应参数
   * @property {Object} Response.data - 返回数据
   *
   * @param {Object} data 请求参数
   * @param {string} data.code - AppKey code
   * @param {number} data.pkiType - PKI类型 3:生产环境 4:预发环境
   *
   * @returns {Promise.<Response>} 表示根据AppKey和pki类型重置内调外私钥接口返回的Promise对象
   */
  resetCallBackPKI: (data) => request_msg.post("/app/resetCallBackPKI", data),

  /**
   * 定义根据AppKey查询内调外API重置次数接口
   *
   * @see {@link YApi http://11.51.194.248:3000/project/5/interface/api/1644}
   *
   * @typedef {Object} Response 响应参数
   * @property {Object} Response.data - 返回数据
   * @property {number} Response.data.prodBackResetCount - 生产环境剩余重置次数
   * @property {number} Response.data.uatBackResetCount - 预发环境剩余重置次数
   * @property {number} Response.data.prodBackNeedEffect - 生产环境是否需要生效 0:需要 1:不需要
   * @property {number} Response.data.uatBackNeedEffect - 预发环境是否需要生效 0:需要 1:不需要
   *
   * @param {Object} params 请求参数
   * @param {string} params.appCode - AppKey code
   *
   * @returns {Promise.<Response>} 表示根据AppKey查询内调外API重置次数接口返回的Promise对象
   */
  getAppBackPkiMessage: (params) =>
    request_msg.get("/app/getAppBackPkiMessage", { params }),

  /**
   * 定义根据AppKey和pki类型生效内调外私钥接口
   *
   * @see {@link YApi http://11.51.194.248:3000/project/5/interface/api/1647}
   *
   * @typedef {Object} Response 响应参数
   * @property {Object} Response.data - 返回数据
   *
   * @param {Object} data 请求参数
   * @param {string} data.code - AppKey code
   * @param {number} data.pkiType - PKI类型 3:生产环境 4:预发环境
   *
   * @returns {Promise.<Response>} 表示根据AppKey和pki类型生效内调外私钥接口返回的Promise对象
   */
  effectCallBackPKI: (data) => request_msg.post("/app/effectCallBackPKI", data),
};

export default app;
