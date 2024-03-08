import request from '@/utils/request'

// 查询质量巡查报告列表
export function listInspect(query) {
  return request({
    url: '/quality/inspect/list',
    method: 'get',
    params: query
  })
}

// 查询质量巡查报告详细
export function getInspect(reportId) {
  return request({
    url: '/quality/inspect/' + reportId,
    method: 'get'
  })
}

// 新增质量巡查报告
export function addInspect(data) {
  return request({
    url: '/quality/inspect',
    method: 'post',
    data: data
  })
}

// 修改质量巡查报告
export function updateInspect(data) {
  return request({
    url: '/quality/inspect',
    method: 'put',
    data: data
  })
}

// 删除质量巡查报告
export function delInspect(reportId) {
  return request({
    url: '/quality/inspect/' + reportId,
    method: 'delete'
  })
}
