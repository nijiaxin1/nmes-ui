import request from '@/utils/request'

// 查询铸造计划列表
export function listPlanExternalFoundry(query) {
  return request({
    url: '/plan/planExternalFoundry/list',
    method: 'get',
    params: query
  })
}

// 查询铸造计划详细
export function getPlanExternalFoundry(id) {
  return request({
    url: '/plan/planExternalFoundry/' + id,
    method: 'get'
  })
}

// 新增铸造计划
export function addPlanExternalFoundry(data) {
  return request({
    url: '/plan/planExternalFoundry',
    method: 'post',
    data: data
  })
}

// 修改铸造计划
export function updatePlanExternalFoundry(data) {
  return request({
    url: '/plan/planExternalFoundry',
    method: 'put',
    data: data
  })
}

// 删除铸造计划
export function delPlanExternalFoundry(id) {
  return request({
    url: '/plan/planExternalFoundry/' + id,
    method: 'delete'
  })
}

// 下发计划
export function distributePlan(data) {
  return request({
    url: '/plan/planExternalFoundry/distributePlan',
    method: 'post',
    data: data
  })
}
// 下发计划
export function doDistribute(data) {
  return request({
    url: '/plan/planExternalFoundry/doDistribute',
    method: 'post',
    data: data
  })
}
