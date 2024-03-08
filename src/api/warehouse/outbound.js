import request from '@/utils/request'

// 查询出库单列表
export function listOutbound(query) {
  return request({
    url: '/warehouse/outbound/list',
    method: 'get',
    params: query
  })
}

// 查询出库单详细
export function getOutbound(id) {
  return request({
    url: '/warehouse/outbound/' + id,
    method: 'get'
  })
}



// 查询出库单详细
export function getOutboundOrder(query) {
  return request({
    url: '/warehouse/outbound/getOutboundOrder',
    method: 'get',
    params: query
  })
}


// 新增出库单
export function addOutbound(data) {
  return request({
    url: '/warehouse/outbound',
    method: 'post',
    data: data
  })
}

// 修改出库单
export function updateOutbound(data) {
  return request({
    url: '/warehouse/outbound',
    method: 'put',
    data: data
  })
}

// 删除出库单
export function delOutbound(id) {
  return request({
    url: '/warehouse/outbound/' + id,
    method: 'delete'
  })
}
// 修改出库单
export function updateOrderSettle(data) {
  return request({
    url: '/warehouse/outbound/orderSettle',
    method: 'put',
    data: data
  })
}

export function updateOrderState(data) {
  return request({
    url: '/warehouse/outbound/orderState',
    method: 'put',
    data: data
  })
}

