import request_noMsg from "@/utils/request_noMsg.js";
import systemResource from "@/api/intranet/softwareSystem/systemResource/index.js";
import productVersion from "@/api/intranet/softwareSystem/productVersion/index.js";
import overview from "@/api/intranet/softwareSystem/overview/index.js";

// 软件系统统一注册API
const softwareSystem = {
  /**
   * 软件系统-查询字段表数据
   * @param {string} type 属性值
   * @param {string} dictName 字典数据KEY
   */
  getDicts: params => request_noMsg.get("/lcpDict/getDicts", { params }),

  /**
   * 软件系统-详情 查看详情信息
   * @param {string} id 软件系统ID
   */
  product: params => request_noMsg.get("/product", { params }),

  /**
   * 软件系统详情-开发者资源-开放扩展点-保存Maven配置
   * @param {number} productId 软件系统ID
   * @param {string} maven 关键字
   */
  maven: data => request_noMsg.post("/product/setting/maven", data),

  /**
   * 软件系统-创建软件系统 提交表单
   * @param {string} name 系统名称
   * @param {string} code 系统编码
   * @param {number} scope 发布范围 1:外网 2:内网
   * @param {string} description 系统描述
   * @param {string} uatDomainName 预发环境域名
   * @param {string} domainName 生产环境域名
   * @param {number} secondaryDevelopment 是否支持二次开发 0:不支持 1:支持
   */
  register: params => request_noMsg.post("/product/register", null, { params }),

  /**
   * 软件系统-订阅-查看版本-获得禁止开通的环境，用于置灰选项
   * @param {string} productId 软件系统ID
   * @param {string} tenementId 租户ID
   */
  activatedEnvs: params =>
    request_noMsg.get("/saas/system/tenement/version/activate/activatedEnvs", {
      params
    }),

  /**
   * 软件系统-订阅-查看版本-获取环境列表
   * @param {string} productId 软件系统ID
   * @param {string} type 类型
   */
  envGet: params => request_noMsg.get("/product/env/get", { params }),

  /**
   * 软件系统-校验是否满足发布条件
   * @param {string} id 软件系统ID
   */
  dry: params => request_noMsg.post("/product/publish/dry", null, { params }),

  /**
   * 软件系统-发布-查询扩展点操作日志
   * @param {string} productCode 软件系统编码
   */
  queryOperateLog: productCode =>
    request_noMsg.get(`/product/spi/queryOperateLog${productCode}`),

  /**
   * 软件系统-根据ID发布软件系统
   * @param {string} id 软件系统ID
   */
  publish: params => request_noMsg.post("/product/publish", null, { params }),

  overview,
  systemResource,
  productVersion
};

export default softwareSystem;
