import request from '@/utils/request'

// 查询现场管理记录列表
export function listScene(query) {
  return request({
    url: '/message/scene/list',
    method: 'get',
    params: query
  })
}

// 查询现场管理记录详细
export function getScene(id) {
  return request({
    url: '/message/scene/' + id,
    method: 'get'
  })
}

// 新增现场管理记录
export function addScene(data) {
  return request({
    url: '/message/scene',
    method: 'post',
    data: data
  })
}

// 新增报修记录
export function addSceneWithImages(data) {
  return request({
    url: '/message/scene/with/images',
    method: 'post',
    data: data
  })
}


// 修改现场管理记录
export function updateScene(data) {
  return request({
    url: '/message/scene',
    method: 'put',
    data: data
  })
}

// 删除现场管理记录
export function delScene(id) {
  return request({
    url: '/message/scene/' + id,
    method: 'delete'
  })
}
