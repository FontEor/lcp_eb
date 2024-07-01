import request from "@/utils/request.js";

// 对接方案-接口列表
const interfaceList = {
    /**
     * 对接方案-接口列表查询
     * @param {string} orderBy 顺序
     * @param {number} pageNumb 页码
     * @param {number} pageSize 分页大小
     * @param {number} orderType asc
     * @param {number} queryLike 查询
     * @param {number} callDirection  1 代表外调内，2：内调外
     * 
     */
    queryInterfaceList: params => request.get("/bizapinterface/queryInterfaceList", { params }),

    /**
    * 对接方案-添加接口-模糊查询API接口
    * @param {string} url  接口URI
    * 
    */
    listFuzzyUrls: (data) => request({
        url: "/httpApi/outward/listFuzzyUrls", method: "post", data, headers: { "Content-Type": "application/json" }
    }),

    /**
    * 对接方案-添加接口-查询接口所属分组
    * @param {string} url  接口URI
    * 
    */
    listGateWayDomainsByUrl: (data) => request({
        url: "/httpApi/outward/listGateWayDomainsByUrl", method: "post", data, headers: { "Content-Type": "application/json" }
    }),

    /**
   * 对接方案-添加接口-对接方案关联回传API
   * @param {number} unitId  对接方案ID
   * @param {string} apiUrl  url
   * @param {string} domainOfGateway  code
   * @param {string} apiType  
   * @param {string} type  http类型，传2
   * 
   */
    addOutwardApi: data => request.post("/bizapinterface/lcp/unit/addOutwardApi", data),
    /**
   * 对接方案-获取内调外接口文档
   * @param {number} unitId  对接方案ID
   * @param {string} id	  当前行id
   * 
   */
    getOutwardApiPreDetails: params => request.get("/bizapinterface/lcp/unit/getOutwardApiPreDetails", { params }),
    /**
   * 对接方案-获取内调外获取最新接口文档
   * @param {number} unitId  对接方案ID
   * @param {number} id	  当前行id
   * @param {number} visible	 visible始终传1
   * 
   */
    getBizApiPreDetailsLatestVersion: params => request.get("/bizapinterface/getBizApiPreDetailsLatestVersion", { params }),
    /**
   * 对接方案-通过上传XML文件生成接口文档
   * @param {number} unitId  对接方案ID
   * @param {number} id  当前行id
   * @param {string} file  xml文件
   * 
   */
    uploadXmlAndSaveDoc: (data, params) => request.post("/bizapinterface/lcp/unit/uploadXmlAndSaveDoc", data, { params }),

    /**
     * 保存对接方案API文档
     * @param {*} params 
     */
    saveBizApiPreDetails: data => request.post("/bizapinterface/saveBizApiPreDetails", data)
};

export default interfaceList;
