import request from "@/utils/request";
import gwApiRequest from "@/utils/gwApiRequest.js";

/**
 * 查询分类列表
 */
export function findBusinessCategoryList(data) {
  return gwApiRequest.post(
    "/ApiManagerService/queryApiCategory",
    JSON.stringify(data)
  );
}

/**
 * 查询查询HTTP接口分页
 *
 * @param URL
 * @param param
 */
export function findHttpApiList(params) {
  return gwApiRequest.post("/HttpApiService/queryApiList", params);
}
/**
 * http接口查询最近七天是否有调用量
*/
// export function queryIsCloudApiHaveCallCountByBizCode(params) {
//   return gwApiRequest;
// }
