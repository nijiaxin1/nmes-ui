import request from '@/utils/request'

// 查询需求计划列表
export function listPlanExternalDemand(query) {
  return request({
    url: '/plan/planExternalDemand/list',
    method: 'get',
    params: query
  })
}

// 查询需求计划详细
export function getPlanExternalDemand(id) {
  return request({
    url: '/plan/planExternalDemand/' + id,
    method: 'get'
  })
}

// 新增需求计划
export function addPlanExternalDemand(data) {
  return request({
    url: '/plan/planExternalDemand',
    method: 'post',
    data: data
  })
}

// 修改需求计划
export function updatePlanExternalDemand(data) {
  return request({
    url: '/plan/planExternalDemand',
    method: 'put',
    data: data
  })
}

// 删除需求计划
export function delPlanExternalDemand(id) {
  return request({
    url: '/plan/planExternalDemand/' + id,
    method: 'delete'
  })
}

// 删除需求计划
export function distributeDemand(id) {
  return request({
    url: '/plan/planExternalDemand/distributeDemand/' + id,
    method: 'get'
  })
}
