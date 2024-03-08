import request from '@/utils/request'

// 查询入库单主表列表
export function listInbound(query) {
  return request({
    url: '/warehouse/inbound/list',
    method: 'get',
    params: query
  })
}

// 查询入库单主表详细
export function getInbound(id) {
  return request({
    url: '/warehouse/inbound/' + id,
    method: 'get'
  })
}

export function getInboundByRelatedNumber(relatedNumber) {
  return request({
    url: '/warehouse/inbound/related/' + relatedNumber,
    method: 'get'
  })
}


// 新增入库单主表
export function addInbound(data) {
  return request({
    url: '/warehouse/inbound',
    method: 'post',
    data: data
  })
}

// 修改入库单主表
export function updateInbound(data) {
  return request({
    url: '/warehouse/inbound',
    method: 'put',
    data: data
  })
}

// 删除入库单主表
export function delInbound(id) {
  return request({
    url: '/warehouse/inbound/' + id,
    method: 'delete'
  })
}


// 修改出库单
export function updateOrderSettle(data) {
  return request({
    url: '/warehouse/inbound/orderSettle',
    method: 'put',
    data: data
  })
}


