import request from '@/utils/request'

// 查询设备信息列表
export function listEquipment(query) {
  return request({
    url: '/base/equipment/list',
    method: 'get',
    params: query
  })
}

export function listAllEquipment(query) {
  return request({
    url: '/base/equipment/listAll',
    method: 'get',
    params: query
  })
}

// 查询设备信息详细
export function getEquipment(id) {
  return request({
    url: '/base/equipment/' + id,
    method: 'get'
  })
}

// 新增设备信息
export function addEquipment(data) {
  return request({
    url: '/base/equipment',
    method: 'post',
    data: data
  })
}

// 修改设备信息
export function updateEquipment(data) {
  return request({
    url: '/base/equipment',
    method: 'put',
    data: data
  })
}

// 删除设备信息
export function delEquipment(id) {
  return request({
    url: '/base/equipment/' + id,
    method: 'delete'
  })
}
// 删除设备信息
export function getBarcodeBySystem(eqmType) {
  return request({
    url: '/base/equipment/randomGenerateBarcode/' + eqmType,
    method: 'get'
  })
}
