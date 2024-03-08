import request from '@/utils/request'

// 查询工序表列表
export function listProcess(query) {
  return request({
    url: '/base/process/list',
    method: 'get',
    params: query
  })
}

// 查询工序表详细
export function getProcess(id) {
  return request({
    url: '/base/process/' + id,
    method: 'get'
  })
}

// 新增工序表
export function addProcess(data) {
  return request({
    url: '/base/process',
    method: 'post',
    data: data
  })
}

// 修改工序表
export function updateProcess(data) {
  return request({
    url: '/base/process',
    method: 'put',
    data: data
  })
}

// 修改工序表
export function updateProcessList(data) {
  return request({
    url: '/base/process/list',
    method: 'put',
    data: data
  })
}

// 删除工序表
export function delProcess(id) {
  return request({
    url: '/base/process/' + id,
    method: 'delete'
  })
}
