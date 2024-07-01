import sandboxApiRequest from "@/utils/sandboxRequest.js";

const headerInfo = {
  headers: {
    "LOP-DN": "test-cloud.jdl.com",
  },
};

// 沙箱工具相关api
const basicInfo = {
  /**
   * 联调场景维护页面-查询全部
   * @param {string}
   */
  findAllScene: () =>
    sandboxApiRequest.post("/sandbox/findAllScene", "", headerInfo),

  /**
   * 根据场景code获取所有流程
   * @param {string}
   */
  findBySceneCode: (data) =>
    sandboxApiRequest.post("/sandbox/findBySceneCode", data, headerInfo),

  /**
   * 商家控制台-查询对接方案下面所以内调外接口
   */
  findInnerCallOuter: (data) =>
    sandboxApiRequest.post("/sandbox/findInnerCallOuter", data, headerInfo),

  /**
   * 商家控制台-保存回调地址
   */
  saveCallBackUrl: (data) =>
    sandboxApiRequest.post("/sandbox/saveCallBackUrl", data, headerInfo),

  /**
   * 商家控制台-查看是否开启
   */
  findIsOpen: (data) =>
    sandboxApiRequest.post("/sandbox/findIsOpen", data, headerInfo),

  /**
   * 商家控制台-解绑运单号
   */
  cancelBindByWayBillCode: (data) =>
    sandboxApiRequest.post(
      "/sandbox/cancelBindByWayBillCode",
      data,
      headerInfo
    ),
  /**
   * 商家控制台-节点操作
   */
  opertorNextNode: (data) =>
    sandboxApiRequest.post("/sandbox/opertorNextNode", data, headerInfo),
};

export default basicInfo;
