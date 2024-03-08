import request from '@/utils/request'

// 查询客户信息列表
export function listBaseCustomerInfo(query) {
  return request({
    url: '/base/baseCustomerInfo/list',
    method: 'get',
    params: query
  })
}

// 查询客户信息列表
export function listAllBaseCustomerInfo(query) {
  return request({
    url: '/base/baseCustomerInfo/listAll',
    method: 'get',
    params: query
  })
}

// 查询客户信息详细
export function getBaseCustomerInfo(id) {
  return request({
    url: '/base/baseCustomerInfo/' + id,
    method: 'get'
  })
}

// 新增客户信息
export function addBaseCustomerInfo(data) {
  return request({
    url: '/base/baseCustomerInfo',
    method: 'post',
    data: data
  })
}

// 修改客户信息
export function updateBaseCustomerInfo(data) {
  return request({
    url: '/base/baseCustomerInfo',
    method: 'put',
    data: data
  })
}

// 删除客户信息
export function delBaseCustomerInfo(id) {
  return request({
    url: '/base/baseCustomerInfo/' + id,
    method: 'delete'
  })
}
