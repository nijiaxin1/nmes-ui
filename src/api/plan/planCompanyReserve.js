import request from '@/utils/request'

// 查询公司储备计划列表
export function listPlanCompanyReserve(query) {
  return request({
    url: '/plan/planCompanyReserve/list',
    method: 'get',
    params: query
  })
}

// 查询公司储备计划详细
export function getPlanCompanyReserve(id) {
  return request({
    url: '/plan/planCompanyReserve/' + id,
    method: 'get'
  })
}

// 新增公司储备计划
export function addPlanCompanyReserve(data) {
  return request({
    url: '/plan/planCompanyReserve',
    method: 'post',
    data: data
  })
}

// 修改公司储备计划
export function updatePlanCompanyReserve(data) {
  return request({
    url: '/plan/planCompanyReserve',
    method: 'put',
    data: data
  })
}

// 删除公司储备计划
export function delPlanCompanyReserve(id) {
  return request({
    url: '/plan/planCompanyReserve/' + id,
    method: 'delete'
  })
}
