import request from '@/utils/request'

/**
 * 查询API实例列表
 *
 * @param URL
 * @param param
 * @returns {AxiosPromise}
 */
export function findApiSummaryInstanceList(data) {
  return request({
    url: '/apiSummaryInstance/list',
    method: 'get',
    params: data
  })
}
