import request from '@/utils/request'

// 查询消息(通知)发送记录列表
export function listMessagelog(query) {
  return request({
    url: '/message/log/list',
    method: 'get',
    params: query
  })
}

// 查询消息(通知)发送记录详细
export function getMessagelog(msgId) {
  return request({
    url: '/message/log/' + msgId,
    method: 'get'
  })
}

// 新增消息(通知)发送记录
export function addMessagelog(data) {
  return request({
    url: '/message/log',
    method: 'post',
    data: data
  })
}

// 修改消息(通知)发送记录
export function updateMessagelog(data) {
  return request({
    url: '/message/log',
    method: 'put',
    data: data
  })
}

// 删除消息(通知)发送记录
export function delMessagelog(msgId) {
  return request({
    url: '/message/log/' + msgId,
    method: 'delete'
  })
}
