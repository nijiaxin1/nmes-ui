import request from '@/utils/request'

// 查询公司储备计划明细列表
export function listPlanCompanyReserveInfo(query) {
  return request({
    url: '/plan/planCompanyReserveInfo/list',
    method: 'get',
    params: query
  })
}

// 查询公司储备计划明细详细
export function getPlanCompanyReserveInfo(id) {
  return request({
    url: '/plan/planCompanyReserveInfo/' + id,
    method: 'get'
  })
}

// 新增公司储备计划明细
export function addPlanCompanyReserveInfo(data) {
  return request({
    url: '/plan/planCompanyReserveInfo',
    method: 'post',
    data: data
  })
}

// 修改公司储备计划明细
export function updatePlanCompanyReserveInfo(data) {
  return request({
    url: '/plan/planCompanyReserveInfo',
    method: 'put',
    data: data
  })
}

// 删除公司储备计划明细
export function delPlanCompanyReserveInfo(id) {
  return request({
    url: '/plan/planCompanyReserveInfo/' + id,
    method: 'delete'
  })
}
