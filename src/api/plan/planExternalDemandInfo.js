import request from '@/utils/request'

// 查询需求计划明细列表
export function listPlanExternalDemandInfo(query) {
  return request({
    url: '/plan/planExternalDemandInfo/list',
    method: 'get',
    params: query
  })
}

// 查询需求计划明细详细
export function getPlanExternalDemandInfo(id) {
  return request({
    url: '/plan/planExternalDemandInfo/' + id,
    method: 'get'
  })
}

// 新增需求计划明细
export function addPlanExternalDemandInfo(data) {
  return request({
    url: '/plan/planExternalDemandInfo',
    method: 'post',
    data: data
  })
}

// 修改需求计划明细
export function updatePlanExternalDemandInfo(data) {
  return request({
    url: '/plan/planExternalDemandInfo',
    method: 'put',
    data: data
  })
}

// 删除需求计划明细
export function delPlanExternalDemandInfo(id) {
  return request({
    url: '/plan/planExternalDemandInfo/' + id,
    method: 'delete'
  })
}
