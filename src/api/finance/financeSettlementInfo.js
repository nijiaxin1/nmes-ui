import request from '@/utils/request'

// 查询结算明细列表
export function listFinanceSettlementInfo(query) {
  return request({
    url: '/finance/financeSettlementInfo/list',
    method: 'get',
    params: query
  })
}
// 查询结算明细列表
export function unsettledInfoListByCond(query) {
  return request({
    url: '/finance/financeSettlementInfo/listByCond',
    method: 'get',
    params: query
  })
}

// 查询结算明细详细
export function getFinanceSettlementInfo(id) {
  return request({
    url: '/finance/financeSettlementInfo/' + id,
    method: 'get'
  })
}

// 新增结算明细
export function addFinanceSettlementInfo(data) {
  return request({
    url: '/finance/financeSettlementInfo',
    method: 'post',
    data: data
  })
}

// 修改结算明细
export function updateFinanceSettlementInfo(data) {
  return request({
    url: '/finance/financeSettlementInfo',
    method: 'put',
    data: data
  })
}

// 删除结算明细
export function delFinanceSettlementInfo(id) {
  return request({
    url: '/finance/financeSettlementInfo/' + id,
    method: 'delete'
  })
}

// 删除结算明细
export function doSettle(data) {
  return request({
    url: '/finance/financeSettlementInfo/doSettle',
    method: 'post',
    data: data
  })
}
