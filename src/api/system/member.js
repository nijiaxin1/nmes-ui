import request from '@/utils/request'

// 查询班组成员列表
export function listMember(query) {
  return request({
    url: '/system/member/list',
    method: 'get',
    params: query
  })
}

// 查询班组成员详细
export function getMember(teamId) {
  return request({
    url: '/system/member/' + teamId,
    method: 'get'
  })
}

// 新增班组成员
export function addMember(data) {
  return request({
    url: '/system/member',
    method: 'post',
    data: data
  })
}

// 修改班组成员
export function updateMember(data) {
  return request({
    url: '/system/member',
    method: 'put',
    data: data
  })
}

// 删除班组成员
export function delMember(teamId) {
  return request({
    url: '/system/member/' + teamId,
    method: 'delete'
  })
}
