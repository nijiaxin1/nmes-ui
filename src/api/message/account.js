import request from '@/utils/request'

// 查询渠道账号信息列表
export function listAccount(query) {
  return request({
    url: '/message/account/list',
    method: 'get',
    params: query
  })
}

// 查询渠道账号信息详细
export function getAccount(channelId) {
  return request({
    url: '/message/account/' + channelId,
    method: 'get'
  })
}

// 新增渠道账号信息
export function addAccount(data) {
  return request({
    url: '/message/account',
    method: 'post',
    data: data
  })
}

// 修改渠道账号信息
export function updateAccount(data) {
  return request({
    url: '/message/account',
    method: 'put',
    data: data
  })
}

// 删除渠道账号信息
export function delAccount(channelId) {
  return request({
    url: '/message/account/' + channelId,
    method: 'delete'
  })
}
