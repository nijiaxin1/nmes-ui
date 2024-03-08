import request from '@/utils/request'

// 查询车间班组计划列表
export function listPlanWorkshopTeam(query) {
  return request({
    url: '/plan/planWorkshopTeam/list',
    method: 'get',
    params: query
  })
}

// 查询车间班组计划详细
export function getPlanWorkshopTeam(id) {
  return request({
    url: '/plan/planWorkshopTeam/' + id,
    method: 'get'
  })
}

// 新增车间班组计划
export function addPlanWorkshopTeam(data) {
  return request({
    url: '/plan/planWorkshopTeam',
    method: 'post',
    data: data
  })
}

// 修改车间班组计划
export function updatePlanWorkshopTeam(data) {
  return request({
    url: '/plan/planWorkshopTeam',
    method: 'put',
    data: data
  })
}

// 删除车间班组计划
export function delPlanWorkshopTeam(id) {
  return request({
    url: '/plan/planWorkshopTeam/' + id,
    method: 'delete'
  })
}
