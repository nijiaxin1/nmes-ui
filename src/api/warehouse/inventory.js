import request from '@/utils/request'

// 查询库存管理列表
export function listInventory(query) {
  return request({
    url: '/warehouse/inventory/list',
    method: 'get',
    params: query
  })
}

export function listAllInventory(query) {
  return request({
    url: '/warehouse/inventory/listAll',
    method: 'get',
    params: query
  })
}

// 查询库存管理详细
export function getInventory(id) {
  return request({
    url: '/warehouse/inventory/' + id,
    method: 'get'
  })
}

// 新增库存管理
export function addInventory(data) {
  return request({
    url: '/warehouse/inventory',
    method: 'post',
    data: data
  })
}

// 修改库存管理
export function updateInventory(data) {
  return request({
    url: '/warehouse/inventory',
    method: 'put',
    data: data
  })
}

// 删除库存管理
export function delInventory(id) {
  return request({
    url: '/warehouse/inventory/' + id,
    method: 'delete'
  })
}
