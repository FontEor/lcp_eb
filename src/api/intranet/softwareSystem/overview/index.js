import request from "@/utils/request_noMsg.js";

// 软件系统-概览-注册API
const overview = {
  /**
   * 软件系统-配置产品介绍页-数据加载
   * @param {string} productCode 产品编码
   */
  load: params => request.get(`/product/show/load${params}`),

  /**
   * 软件系统-配置产品介绍页-图片配置查询
   * @param {string} imgUseScenes 图片场景 1:软件系统展示
   * @param {string} imgType 图片类型 1:图标 2:图片
   */
  query: params => request.get("/imgConfig/query", { params }),

  /**
   * 软件系统-配置产品介绍页-产品架构 上传图片
   * @param {FormData} imageFile 文件
   */
  imageUpload: data =>
    request.post("/api/imageUpload", data, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    }),

  /**
   * 软件系统-配置产品介绍页-保存
   * @param {string} productCode 产品编码
   * @param {Object} showList 产品编码
   *  @param {string} title 标题
   *  @param {string} describe 描述
   *  @param {string} linkAddress 详情连接URL
   *  @param {string} imgConfigCode 展示图标/图片(id)
   *  @param {string} imgUrl 图片链接
   *  @param {string} productShowType 字典表（ 1=产品能力， 2=产品架构, 3=应用场景, 4=合作案例, 5=二次开发能力）
   */
  save: data => request.post("/product/show/save", data)
};

export default overview;
