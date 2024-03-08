import request from '@/utils/request'

// 查询备料记录列表
export function listRecordsMaterialPreparation(query) {
  return request({
    url: '/records/recordsMaterialPreparation/list',
    method: 'get',
    params: query
  })
}

// 查询备料记录详细
export function getRecordsMaterialPreparation(id) {
  return request({
    url: '/records/recordsMaterialPreparation/' + id,
    method: 'get'
  })
}

// 新增备料记录
export function addRecordsMaterialPreparation(data) {
  return request({
    url: '/records/recordsMaterialPreparation',
    method: 'post',
    data: data
  })
}

// 修改备料记录
export function updateRecordsMaterialPreparation(data) {
  return request({
    url: '/records/recordsMaterialPreparation',
    method: 'put',
    data: data
  })
}

// 删除备料记录
export function delRecordsMaterialPreparation(id) {
  return request({
    url: '/records/recordsMaterialPreparation/' + id,
    method: 'delete'
  })
}
