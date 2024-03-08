import request from "@/utils/request";

// 查询生产班次列表
export function listClass(query) {
  return request({
    url: "/work/schedule/class/list",
    method: "get",
    params: query,
  });
}

// 查询班制的生产班次列表
export function listByScheduleId(scheduleId) {
  return request({
    url: "/work/schedule/class/list/" + scheduleId,
    method: "get",
  });
}

// 查询生产班次详细
export function getClass(periodId) {
  return request({
    url: "/work/schedule/class/" + periodId,
    method: "get",
  });
}

// 新增生产班次
export function addClass(data) {
  return request({
    url: "/work/schedule/class",
    method: "post",
    data: data,
  });
}

// 修改生产班次
export function updateClass(data) {
  return request({
    url: "/work/schedule/class",
    method: "put",
    data: data,
  });
}

// 删除生产班次
export function delClass(periodId) {
  return request({
    url: "/work/schedule/class/" + periodId,
    method: "delete",
  });
}
