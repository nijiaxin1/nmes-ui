import request from '@/utils/request'

// 查询入库明细列表
export function listInboundOrderInfo(query) {
  return request({
    url: '/warehouse/inboundOrderInfo/list',
    method: 'get',
    params: query
  })
}

// 查询入库明细详细
export function getInboundOrderInfo(id) {
  return request({
    url: '/warehouse/inboundOrderInfo/' + id,
    method: 'get'
  })
}

// 新增入库明细
export function addInboundOrderInfo(data) {
  return request({
    url: '/warehouse/inboundOrderInfo',
    method: 'post',
    data: data
  })
}

// 修改入库明细
export function updateInboundOrderInfo(data) {
  return request({
    url: '/warehouse/inboundOrderInfo',
    method: 'put',
    data: data
  })
}

// 删除入库明细
export function delInboundOrderInfo(id) {
  return request({
    url: '/warehouse/inboundOrderInfo/' + id,
    method: 'delete'
  })
}
