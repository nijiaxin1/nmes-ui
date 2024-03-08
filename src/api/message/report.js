import request from '@/utils/request'

// 查询报修记录列表
export function listReport(query) {
  return request({
    url: '/message/report/list',
    method: 'get',
    params: query
  })
}

// 查询报修记录详细
export function getReport(id) {
  return request({
    url: '/message/report/' + id,
    method: 'get'
  })
}

// 新增报修记录
export function addReport(data) {
  return request({
    url: '/message/report',
    method: 'post',
    data: data
  })
}

// 新增报修记录
export function addReportWithImages(data) {
  return request({
    url: '/message/report/with/images',
    method: 'post',
    data: data
  })
}


// 修改报修记录
export function updateReport(data) {
  return request({
    url: '/message/report',
    method: 'put',
    data: data
  })
}

// 删除报修记录
export function delReport(id) {
  return request({
    url: '/message/report/' + id,
    method: 'delete'
  })
}
