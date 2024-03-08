import request from '@/utils/request'

// 查询器具码信息列表
export function listRecordsUtensilCodeInfo(query) {
  return request({
    url: '/records/recordsUtensilCodeInfo/list',
    method: 'get',
    params: query
  })
}

// 查询器具码信息详细
export function getRecordsUtensilCodeInfo(id) {
  return request({
    url: '/records/recordsUtensilCodeInfo/' + id,
    method: 'get'
  })
}

// 新增器具码信息
export function addRecordsUtensilCodeInfo(data) {
  return request({
    url: '/records/recordsUtensilCodeInfo',
    method: 'post',
    data: data
  })
}

// 修改器具码信息
export function updateRecordsUtensilCodeInfo(data) {
  return request({
    url: '/records/recordsUtensilCodeInfo',
    method: 'put',
    data: data
  })
}

// 删除器具码信息
export function delRecordsUtensilCodeInfo(id) {
  return request({
    url: '/records/recordsUtensilCodeInfo/' + id,
    method: 'delete'
  })
}
