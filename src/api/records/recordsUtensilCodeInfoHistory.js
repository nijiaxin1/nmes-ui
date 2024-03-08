import request from '@/utils/request'

// 查询器具码历史信息列表
export function listRecordsUtensilCodeInfoHistory(query) {
  return request({
    url: '/records/recordsUtensilCodeInfoHistory/list',
    method: 'get',
    params: query
  })
}

// 查询器具码历史信息详细
export function getRecordsUtensilCodeInfoHistory(id) {
  return request({
    url: '/records/recordsUtensilCodeInfoHistory/' + id,
    method: 'get'
  })
}

// 新增器具码历史信息
export function addRecordsUtensilCodeInfoHistory(data) {
  return request({
    url: '/records/recordsUtensilCodeInfoHistory',
    method: 'post',
    data: data
  })
}

// 修改器具码历史信息
export function updateRecordsUtensilCodeInfoHistory(data) {
  return request({
    url: '/records/recordsUtensilCodeInfoHistory',
    method: 'put',
    data: data
  })
}

// 删除器具码历史信息
export function delRecordsUtensilCodeInfoHistory(id) {
  return request({
    url: '/records/recordsUtensilCodeInfoHistory/' + id,
    method: 'delete'
  })
}
