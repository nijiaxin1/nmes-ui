import request from '@/utils/request'

// 查询备料计划明细列表
export function listPlanMaterialPreparationInfo(query) {
  return request({
    url: '/plan/planMaterialPreparationInfo/list',
    method: 'get',
    params: query
  })
}

// 查询备料计划明细详细
export function getPlanMaterialPreparationInfo(id) {
  return request({
    url: '/plan/planMaterialPreparationInfo/' + id,
    method: 'get'
  })
}

// 新增备料计划明细
export function addPlanMaterialPreparationInfo(data) {
  return request({
    url: '/plan/planMaterialPreparationInfo',
    method: 'post',
    data: data
  })
}

// 修改备料计划明细
export function updatePlanMaterialPreparationInfo(data) {
  return request({
    url: '/plan/planMaterialPreparationInfo',
    method: 'put',
    data: data
  })
}

// 删除备料计划明细
export function delPlanMaterialPreparationInfo(id) {
  return request({
    url: '/plan/planMaterialPreparationInfo/' + id,
    method: 'delete'
  })
}
// 出库
export function createOutOrder(id) {
  return request({
    url: '/plan/planMaterialPreparationInfo/createOutOrder',
    method: 'post',
    data: id
  })
}
