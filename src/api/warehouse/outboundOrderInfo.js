import request from '@/utils/request'

// 查询出库单明细列表
export function listOutboundOrderInfo(query) {
  return request({
    url: '/warehouse/outboundOrderInfo/list',
    method: 'get',
    params: query
  })
}

// 查询出库单明细详细
export function getOutboundOrderInfo(id) {
  return request({
    url: '/warehouse/outboundOrderInfo/' + id,
    method: 'get'
  })
}

// 新增出库单明细
export function addOutboundOrderInfo(data) {
  return request({
    url: '/warehouse/outboundOrderInfo',
    method: 'post',
    data: data
  })
}

// 修改出库单明细
export function updateOutboundOrderInfo(data) {
  return request({
    url: '/warehouse/outboundOrderInfo',
    method: 'put',
    data: data
  })
}

// 删除出库单明细
export function delOutboundOrderInfo(id) {
  return request({
    url: '/warehouse/outboundOrderInfo/' + id,
    method: 'delete'
  })
}
