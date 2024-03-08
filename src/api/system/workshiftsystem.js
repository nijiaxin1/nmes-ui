import request from '@/utils/request'

// 查询生产班制列表
export function listSystem(query) {
  return request({
    url: '/work/shift/system/list',
    method: 'get',
    params: query
  })
}

// 查询生产班制详细
export function getSystem(scheduleId) {
  return request({
    url: '/work/shift/system/' + scheduleId,
    method: 'get'
  })
}

// 新增生产班制
export function addSystem(data) {
  return request({
    url: '/work/shift/system',
    method: 'post',
    data: data
  })
}

// 修改生产班制
export function updateSystem(data) {
  return request({
    url: '/work/shift/system',
    method: 'put',
    data: data
  })
}

// 删除生产班制
export function delSystem(scheduleId) {
  return request({
    url: '/work/shift/system/' + scheduleId,
    method: 'delete'
  })
}

// 获取启用的班制
export function getOneEnabled() {
  return request({
    url: '/work/shift/system/one/enabled',
    method: 'get'
  })
}
