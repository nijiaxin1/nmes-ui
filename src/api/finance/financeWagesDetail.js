import request from '@/utils/request'

// 查询工资详情列表
export function listFinanceWagesDetail(query) {
  return request({
    url: '/finance/financeWagesDetail/list',
    method: 'get',
    params: query
  })
}

// 查询工资详情详细
export function getFinanceWagesDetail(id) {
  return request({
    url: '/finance/financeWagesDetail/' + id,
    method: 'get'
  })
}

// 新增工资详情
export function addFinanceWagesDetail(data) {
  return request({
    url: '/finance/financeWagesDetail',
    method: 'post',
    data: data
  })
}

// 修改工资详情
export function updateFinanceWagesDetail(data) {
  return request({
    url: '/finance/financeWagesDetail',
    method: 'put',
    data: data
  })
}

// 删除工资详情
export function delFinanceWagesDetail(id) {
  return request({
    url: '/finance/financeWagesDetail/' + id,
    method: 'delete'
  })
}

// 根据月份查询根据物料合并后得工资详情列表
export function listByItem(query) {
  return request({
    url: '/finance/financeWagesDetail/listByItem',
    method: 'get',
    params: query
  })
}
// 根据月份查询根据员工合并后得工资详情列表
export function listByOperate(query) {
  return request({
    url: '/finance/financeWagesDetail/listByOperate',
    method: 'get',
    params: query
  })
}
// 待确认工资详情列表
export function unConfirmInfoListByCond(query) {
  return request({
    url: '/finance/financeWagesDetail/unConfirmInfoListByCond',
    method: 'get',
    params: query
  })
}
// 待确认工资详情列表
export function doConfirm(data) {
  return request({
    url: '/finance/financeWagesDetail/doConfirm',
    method: 'post',
    data: data
  })
}
// 扣减
export function reduceWages(data) {
  return request({
    url: '/finance/financeWagesDetail/reduceWages',
    method: 'post',
    data: data
  })
}
