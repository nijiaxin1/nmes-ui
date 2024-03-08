import request from '@/utils/request'

// 查询车间工序计划列表
export function listPlanWorkshopProcesses(query) {
  return request({
    url: '/plan/planWorkshopProcesses/list',
    method: 'get',
    params: query
  })
}
// 查询车间工序计划列表
export function listForPersonal(query) {
  return request({
    url: '/plan/planWorkshopProcesses/listForPersonal',
    method: 'post',
    data: query
  })
}

// 查询车间工序计划详细
export function getPlanWorkshopProcesses(id) {
  return request({
    url: '/plan/planWorkshopProcesses/' + id,
    method: 'get'
  })
}

// 新增车间工序计划
export function addPlanWorkshopProcesses(data) {
  return request({
    url: '/plan/planWorkshopProcesses',
    method: 'post',
    data: data
  })
}

// 修改车间工序计划
export function updatePlanWorkshopProcesses(data) {
  return request({
    url: '/plan/planWorkshopProcesses',
    method: 'put',
    data: data
  })
}

// 删除车间工序计划
export function delPlanWorkshopProcesses(id) {
  return request({
    url: '/plan/planWorkshopProcesses/' + id,
    method: 'delete'
  })
}
