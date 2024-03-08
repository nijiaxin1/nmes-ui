import request from '@/utils/request'

// 查询车间进工序记录列表
export function listRecordsIncomingProcess(query) {
  return request({
    url: '/records/recordsIncomingProcess/list',
    method: 'get',
    params: query
  })
}

// 查询车间进工序记录详细
export function getRecordsIncomingProcess(id) {
  return request({
    url: '/records/recordsIncomingProcess/' + id,
    method: 'get'
  })
}

// 新增车间进工序记录
export function addRecordsIncomingProcess(data) {
  return request({
    url: '/records/recordsIncomingProcess',
    method: 'post',
    data: data
  })
}

// 修改车间进工序记录
export function updateRecordsIncomingProcess(data) {
  return request({
    url: '/records/recordsIncomingProcess',
    method: 'put',
    data: data
  })
}

// 删除车间进工序记录
export function delRecordsIncomingProcess(id) {
  return request({
    url: '/records/recordsIncomingProcess/' + id,
    method: 'delete'
  })
}
