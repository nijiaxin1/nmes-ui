import request from '@/utils/request'

// 查询车间生产计划列表
export function listPlanWorkshopProduce(query) {
  return request({
    url: '/plan/planWorkshopProduce/list',
    method: 'get',
    params: query
  })
}

// 查询车间生产计划详细
export function getPlanWorkshopProduce(id) {
  return request({
    url: '/plan/planWorkshopProduce/' + id,
    method: 'get'
  })
}

// 新增车间生产计划
export function addPlanWorkshopProduce(data) {
  return request({
    url: '/plan/planWorkshopProduce',
    method: 'post',
    data: data
  })
}

// 修改车间生产计划
export function updatePlanWorkshopProduce(data) {
  return request({
    url: '/plan/planWorkshopProduce',
    method: 'put',
    data: data
  })
}

// 删除车间生产计划
export function delPlanWorkshopProduce(id) {
  return request({
    url: '/plan/planWorkshopProduce/' + id,
    method: 'delete'
  })
}
// 排产
export function doProductionScheduling(data) {
  return request({
    url: '/plan/planWorkshopProduce/doProductionScheduling',
    method: 'post',
    data: data
  })
}
// 查询当天生产数据
export function findProduceInfoByDay(qps) {
  return request({
    url: '/plan/planWorkshopProduce/findProduceInfoByDay',
    method: 'get',
    params: qps
  })
}
// 获取指定班组员工排班
export function TeamMemberList(teamId) {
  return request({
    url: '/work/team/member/list/team/' + teamId,
    method: 'get'
  })
}

// 获取可用班组列表
export function getTeamList() {
  return request({
    url: '/work/team/list/enable',
    method: 'get'
  })
}

