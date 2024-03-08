import request from '@/utils/request'

// 查询生产班制列表
export function listSystem(query) {
  return request({
    url: '/team/system/list',
    method: 'get',
    params: query
  })
}

// 查询生产班制详细
export function getSystem(scheduleId) {
  return request({
    url: '/team/system/' + scheduleId,
    method: 'get'
  })
}

// 新增生产班制
export function addSystem(data) {
  return request({
    url: '/team/system',
    method: 'post',
    data: data
  })
}

// 修改生产班制
export function updateSystem(data) {
  return request({
    url: '/team/system',
    method: 'put',
    data: data
  })
}

// 删除生产班制
export function delSystem(scheduleId) {
  return request({
    url: '/team/system/' + scheduleId,
    method: 'delete'
  })
}
