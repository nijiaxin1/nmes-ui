import request from '@/utils/request'

// 查询合同明细列表
export function listFinanceContractInfo(query) {
  return request({
    url: '/finance/financeContractInfo/list',
    method: 'get',
    params: query
  })
}

// 查询合同明细列表
export function listFinanceContractInfoByCond(query) {
  return request({
    url: '/finance/financeContractInfo/listByCond',
    method: 'get',
    params: query
  })
}

// 查询合同明细详细
export function getFinanceContractInfo(id) {
  return request({
    url: '/finance/financeContractInfo/' + id,
    method: 'get'
  })
}

// 新增合同明细
export function addFinanceContractInfo(data) {
  return request({
    url: '/finance/financeContractInfo',
    method: 'post',
    data: data
  })
}

// 修改合同明细
export function updateFinanceContractInfo(data) {
  return request({
    url: '/finance/financeContractInfo',
    method: 'put',
    data: data
  })
}

// 删除合同明细
export function delFinanceContractInfo(id) {
  return request({
    url: '/finance/financeContractInfo/' + id,
    method: 'delete'
  })
}
