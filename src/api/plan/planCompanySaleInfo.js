import request from '@/utils/request'

// 查询公司销售计划明细列表
export function listPlanCompanySaleInfo(query) {
  return request({
    url: '/plan/planCompanySaleInfo/list',
    method: 'get',
    params: query
  })
}

// 查询公司销售计划明细详细
export function getPlanCompanySaleInfo(id) {
  return request({
    url: '/plan/planCompanySaleInfo/' + id,
    method: 'get'
  })
}

// 新增公司销售计划明细
export function addPlanCompanySaleInfo(data) {
  return request({
    url: '/plan/planCompanySaleInfo',
    method: 'post',
    data: data
  })
}

// 修改公司销售计划明细
export function updatePlanCompanySaleInfo(data) {
  return request({
    url: '/plan/planCompanySaleInfo',
    method: 'put',
    data: data
  })
}

// 删除公司销售计划明细
export function delPlanCompanySaleInfo(id) {
  return request({
    url: '/plan/planCompanySaleInfo/' + id,
    method: 'delete'
  })
}

// 直送添加时查询明细
export function findSaleInfoForDirectDelivery(data) {
  return request({
    url: '/plan/planCompanySaleInfo/findSaleInfoForDirectDelivery',
    method: 'post',
    data: data
  })
}
// 查询明细
export function listNoAuditedPageByCode() {
  return request({
    url: '/plan/planCompanySaleInfo/listNoAuditedPageByCode',
    method: 'get'
  })
}
// 查询明细
export function listNoPageHaveInventoryByCode(query) {
  return request({
    url: '/plan/planCompanySaleInfo/listNoPageHaveInventoryByCode',
    method: 'get',
    params: query

  })
}
// 查询明细
export function listNoPageNoInventoryByCode(query) {
  return request({
    url: '/plan/planCompanySaleInfo/listNoPageNoInventoryByCode',
    method: 'get',
    params: query

  })
}
