import request from '@/utils/request'

// 查询公司销售计划列表
export function listPlanCompanySale(query) {
  return request({
    url: '/plan/planCompanySale/list',
    method: 'get',
    params: query
  })
}

// 查询公司销售计划详细
export function getPlanCompanySale(id) {
  return request({
    url: '/plan/planCompanySale/' + id,
    method: 'get'
  })
}

// 新增公司销售计划
export function addPlanCompanySale(data) {
  return request({
    url: '/plan/planCompanySale',
    method: 'post',
    data: data
  })
}

// 修改公司销售计划
export function updatePlanCompanySale(data) {
  return request({
    url: '/plan/planCompanySale',
    method: 'put',
    data: data
  })
}

// 删除公司销售计划
export function delPlanCompanySale(id) {
  return request({
    url: '/plan/planCompanySale/' + id,
    method: 'delete'
  })
}
// 发交
export function doDelivery(data) {
  return request({
    url: '/plan/planCompanySale/doDelivery',
    method: 'post',
    data: data
  })
}
// 直送
export function saveDirectDelivery(list) {
  return request({
    url: '/plan/planCompanySale/saveDirectDelivery',
    method: 'post',
    data: list
  })
}
// 审核确认
export function goAudited(data) {
  return request({
    url: '/plan/planCompanySale/goAudited',
    method: 'post',
    data: data
  })
}
