import request from '@/utils/request'

// 查询铸造计划明细列表
export function listPlanExternalFoundryInfo(query) {
  return request({
    url: '/plan/planExternalFoundryInfo/list',
    method: 'get',
    params: query
  })
}

// 查询铸造计划明细详细
export function getPlanExternalFoundryInfo(id) {
  return request({
    url: '/plan/planExternalFoundryInfo/' + id,
    method: 'get'
  })
}

// 新增铸造计划明细
export function addPlanExternalFoundryInfo(data) {
  return request({
    url: '/plan/planExternalFoundryInfo',
    method: 'post',
    data: data
  })
}

// 修改铸造计划明细
export function updatePlanExternalFoundryInfo(data) {
  return request({
    url: '/plan/planExternalFoundryInfo',
    method: 'put',
    data: data
  })
}

// 删除铸造计划明细
export function delPlanExternalFoundryInfo(id) {
  return request({
    url: '/plan/planExternalFoundryInfo/' + id,
    method: 'delete'
  })
}
// 查询明细
export function listNoPageByCode(code) {
  return request({
    url: '/plan/planExternalFoundryInfo/listNoPageByCode/'+ code,
    method: 'get'
  })
}
// 查询明细
export function listNoPageByDate(params) {
  return request({
    url: '/plan/planExternalFoundryInfo/listNoPageByDate',
    method: 'get',
    params: params
  })
}
