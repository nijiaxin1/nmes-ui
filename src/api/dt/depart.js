import request from '@/utils/request'

// 查询部门列表树
export function listDepart(appkey) {
  return request({
    url: '/dt/depart/list/' + appkey,
    method: 'get'
  })
}

// 查询部门列表树
export function listDepartById(appkey,id,query) {
    return request({
      url: '/dt/depart/json/list/' + appkey+"/"+id,
      method: 'get',
      params: query
    })
  }
