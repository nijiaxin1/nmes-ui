import request from '@/utils/request'

// 查询个人计划列表
export function listPlanWorkshopPersonal(query) {
  return request({
    url: '/plan/planWorkshopPersonal/list',
    method: 'get',
    params: query
  })
}
// 查询班组计划列表
export function teamList(query) {
  return request({
    url: '/plan/planWorkshopPersonal/teamList',
    method: 'get',
    params: query
  })
}
// 查询工序计划列表
export function processList(query) {
  return request({
    url: '/plan/planWorkshopPersonal/processList',
    method: 'get',
    params: query
  })
}

// 查询个人计划详细
export function getPlanWorkshopPersonal(id) {
  return request({
    url: '/plan/planWorkshopPersonal/' + id,
    method: 'get'
  })
}

// 新增个人计划
export function addPlanWorkshopPersonal(data) {
  return request({
    url: '/plan/planWorkshopPersonal',
    method: 'post',
    data: data
  })
}

// 修改个人计划
export function updatePlanWorkshopPersonal(data) {
  return request({
    url: '/plan/planWorkshopPersonal',
    method: 'put',
    data: data
  })
}

// 删除个人计划
export function delPlanWorkshopPersonal(id) {
  return request({
    url: '/plan/planWorkshopPersonal/' + id,
    method: 'delete'
  })
}
// 新增个人计划
export function saveIssuePlanPersonal(data) {
  return request({
    url: '/plan/planWorkshopPersonal/saveIssuePlanPersonal',
    method: 'post',
    data: data
  })
}
// 新增个人计划
export function searchPlanByCond(data) {
  return request({
    url: '/plan/planWorkshopPersonal/searchPlanByCond',
    method: 'get',
    params: data
  })
}
// 修改个人计划
export function doUpdatePlan(data) {
  return request({
    url: '/plan/planWorkshopPersonal/doUpdatePlan',
    method: 'post',
    data: data
  })
}
