import request from '@/utils/request'

// 查询工资配置列表
export function listFinanceWagesConfig(query) {
  return request({
    url: '/finance/financeWagesConfig/list',
    method: 'get',
    params: query
  })
}

// 查询工资配置详细
export function getFinanceWagesConfig(id) {
  return request({
    url: '/finance/financeWagesConfig/' + id,
    method: 'get'
  })
}

// 新增工资配置
export function addFinanceWagesConfig(data) {
  return request({
    url: '/finance/financeWagesConfig',
    method: 'post',
    data: data
  })
}

// 修改工资配置
export function updateFinanceWagesConfig(data) {
  return request({
    url: '/finance/financeWagesConfig',
    method: 'put',
    data: data
  })
}

// 删除工资配置
export function delFinanceWagesConfig(id) {
  return request({
    url: '/finance/financeWagesConfig/' + id,
    method: 'delete'
  })
}
