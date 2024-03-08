import request from '@/utils/request'

// 查询库位表列表
export function listStorageSpace(query) {
  return request({
    url: '/warehouse/storageSpace/list',
    method: 'get',
    params: query
  })
}

// 查询库位表详细
export function getStorageSpace(id) {
  return request({
    url: '/warehouse/storageSpace/' + id,
    method: 'get'
  })
}

// 新增库位表
export function addStorageSpace(data) {
  return request({
    url: '/warehouse/storageSpace',
    method: 'post',
    data: data
  })
}

// 修改库位表
export function updateStorageSpace(data) {
  return request({
    url: '/warehouse/storageSpace',
    method: 'put',
    data: data
  })
}

// 删除库位表
export function delStorageSpace(id) {
  return request({
    url: '/warehouse/storageSpace/' + id,
    method: 'delete'
  })
}
