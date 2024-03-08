import request from '@/utils/request'

// 查询渠道账号信息样例列表
export function listExample(query) {
  return request({
    url: '/message/example/list',
    method: 'get',
    params: query
  })
}

// 查询渠道账号信息样例详细
export function getExample(id) {
  return request({
    url: '/message/example/' + id,
    method: 'get'
  })
}

// 新增渠道账号信息样例
export function addExample(data) {
  return request({
    url: '/message/example',
    method: 'post',
    data: data
  })
}

// 修改渠道账号信息样例
export function updateExample(data) {
  return request({
    url: '/message/example',
    method: 'put',
    data: data
  })
}

// 删除渠道账号信息样例
export function delExample(id) {
  return request({
    url: '/message/example/' + id,
    method: 'delete'
  })
}
