import request from '@/utils/request'

// 查询个人工作记录列表
export function listRecordsPersonalWork(query) {
  return request({
    url: '/records/recordsPersonalWork/list',
    method: 'get',
    params: query
  })
}

// 查询个人工作记录详细
export function getRecordsPersonalWork(id) {
  return request({
    url: '/records/recordsPersonalWork/' + id,
    method: 'get'
  })
}

// 新增个人工作记录
export function addRecordsPersonalWork(data) {
  return request({
    url: '/records/recordsPersonalWork',
    method: 'post',
    data: data
  })
}

// 修改个人工作记录
export function updateRecordsPersonalWork(data) {
  return request({
    url: '/records/recordsPersonalWork',
    method: 'put',
    data: data
  })
}

// 删除个人工作记录
export function delRecordsPersonalWork(id) {
  return request({
    url: '/records/recordsPersonalWork/' + id,
    method: 'delete'
  })
}
