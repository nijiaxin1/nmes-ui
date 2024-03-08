import request from '@/utils/request'

// 查询售后问题列表
export function listIssue(query) {
  return request({
    url: '/quality/issue/list',
    method: 'get',
    params: query
  })
}

// 查询售后问题详细
export function getIssue(issueId) {
  return request({
    url: '/quality/issue/' + issueId,
    method: 'get'
  })
}

// 新增售后问题
export function addIssue(data) {
  return request({
    url: '/quality/issue',
    method: 'post',
    data: data
  })
}

// 修改售后问题
export function updateIssue(data) {
  return request({
    url: '/quality/issue',
    method: 'put',
    data: data
  })
}

// 删除售后问题
export function delIssue(issueId) {
  return request({
    url: '/quality/issue/' + issueId,
    method: 'delete'
  })
}
