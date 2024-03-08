import request from '@/utils/request'

// 查询合同列表
export function listFinanceContract(query) {
  return request({
    url: '/finance/financeContract/list',
    method: 'get',
    params: query
  })
}

// 查询合同详细
export function getFinanceContract(id) {
  return request({
    url: '/finance/financeContract/' + id,
    method: 'get'
  })
}

// 新增合同
export function addFinanceContract(data) {
  return request({
    url: '/finance/financeContract',
    method: 'post',
    data: data
  })
}

// 修改合同
export function updateFinanceContract(data) {
  return request({
    url: '/finance/financeContract',
    method: 'put',
    data: data
  })
}

// 删除合同
export function delFinanceContract(id) {
  return request({
    url: '/finance/financeContract/' + id,
    method: 'delete'
  })
}
// 审核合同
export function auditContract(id) {
  return request({
    url: '/finance/financeContract/auditContract/' + id,
    method: 'get'
  })
}
// 手动添加合同
export function doAddFinanceContract(data) {
  return request({
    url: '/finance/financeContract/doAddFinanceContract',
    method: 'post',
    data: data
  })
}
// 自动生成单号
export function getCodeBySystem() {
  return request({
    url: '/finance/financeContract/generateCode',
    method: 'get'
  })
}
