import request from '@/utils/request'

// 查询结算列表
export function listFinanceSettlement(query) {
  return request({
    url: '/finance/financeSettlement/list',
    method: 'get',
    params: query
  })
}

// 查询结算详细
export function getFinanceSettlement(id) {
  return request({
    url: '/finance/financeSettlement/' + id,
    method: 'get'
  })
}

// 查询结算详细
export function listEnterOrOutList(temp) {
  return request({
    url: '/finance/financeSettlement/listEnterOrOutList',
    method: 'get',
    params: temp
  })
}

// 新增结算
export function addFinanceSettlement(data) {
  return request({
    url: '/finance/financeSettlement',
    method: 'post',
    data: data
  })
}

// 修改结算
export function updateFinanceSettlement(data) {
  return request({
    url: '/finance/financeSettlement',
    method: 'put',
    data: data
  })
}

// 删除结算
export function delFinanceSettlement(id) {
  return request({
    url: '/finance/financeSettlement/' + id,
    method: 'delete'
  })
}
