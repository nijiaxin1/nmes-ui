import request from '@/utils/request'

// 查询生产排班记录列表
export function listRecordsWorkSchedule(query) {
  return request({
    url: '/records/recordsWorkSchedule/list',
    method: 'get',
    params: query
  })
}

// 查询生产排班记录详细
export function getRecordsWorkSchedule(id) {
  return request({
    url: '/records/recordsWorkSchedule/' + id,
    method: 'get'
  })
}

// 新增生产排班记录
export function addRecordsWorkSchedule(data) {
  return request({
    url: '/records/recordsWorkSchedule',
    method: 'post',
    data: data
  })
}

// 修改生产排班记录
export function updateRecordsWorkSchedule(data) {
  return request({
    url: '/records/recordsWorkSchedule',
    method: 'put',
    data: data
  })
}

// 删除生产排班记录
export function delRecordsWorkSchedule(id) {
  return request({
    url: '/records/recordsWorkSchedule/' + id,
    method: 'delete'
  })
}
