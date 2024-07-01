import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/vue-admin-template/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/hrInfo/getUserInfo',
    method: 'get',
    params: { token }
  })
}

export function cacheClear() {
  return request({
    url: '/cookies/erp/logout',
    method: 'post',
    params:{domain:".jdl.com"}
  })
}

export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}

//params:erp,模糊查询返回列表
export function hrFindUser(erp) {
  return request({
    url: '/hrInfo/findUser',
    method: 'get',
    params: {erp:erp}
  })
}

export function findUserExtendInfoByErp(erp) {
  return request({
    url:'/hrInfo/findUserExtendInfoByErp',
    method:'get',
    params:{erp:erp}
  })
}
