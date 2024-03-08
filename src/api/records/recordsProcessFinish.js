import request from '@/utils/request'

// 查询工序完成记录列表
export function listRecordsProcessFinish(query) {
  return request({
    url: '/records/recordsProcessFinish/list',
    method: 'get',
    params: query
  })
}

// 查询工序完成记录详细
export function getRecordsProcessFinish(id) {
  return request({
    url: '/records/recordsProcessFinish/' + id,
    method: 'get'
  })
}

// 新增工序完成记录
export function addRecordsProcessFinish(data) {
  return request({
    url: '/records/recordsProcessFinish',
    method: 'post',
    data: data
  })
}

// 修改工序完成记录
export function updateRecordsProcessFinish(data) {
  return request({
    url: '/records/recordsProcessFinish',
    method: 'put',
    data: data
  })
}

// 删除工序完成记录
export function delRecordsProcessFinish(id) {
  return request({
    url: '/records/recordsProcessFinish/' + id,
    method: 'delete'
  })
}
