import request from '@/utils/request'

// 查询物料信息列表
export function listItemInfo(query) {
  return request({
    url: '/base/itemInfo/list',
    method: 'get',
    params: query
  })
}

// 查询物料信息详细
export function getItemInfo(id) {
  return request({
    url: '/base/itemInfo/' + id,
    method: 'get'
  })
}

// 新增物料信息
export function addItemInfo(data) {
  return request({
    url: '/base/itemInfo',
    method: 'post',
    data: data
  })
}

// 修改物料信息
export function updateItemInfo(data) {
  return request({
    url: '/base/itemInfo',
    method: 'put',
    data: data
  })
}

// 删除物料信息
export function delItemInfo(id) {
  return request({
    url: '/base/itemInfo/' + id,
    method: 'delete'
  })
}
