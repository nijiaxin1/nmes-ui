import request from '@/utils/request'

// 计划完成报表
export function listPlanFinish(query) {
  return request({
    url: '/sheet/planFinishRecords/list',
    method: 'get',
    params: query
  })
}
// 员工工作报表
export function listByOperator(query) {
  return request({
    url: '/sheet/planFinishRecords/listByOperator',
    method: 'get',
    params: query
  })
}
// 物料生产报表
export function listByItem(query) {
  return request({
    url: '/sheet/planFinishRecords/listByItem',
    method: 'get',
    params: query
  })
}
// 工序生产报表
export function listProcessProduce(query) {
  return request({
    url: '/sheet/planFinishRecords/listProcessProduce',
    method: 'get',
    params: query
  })
}

