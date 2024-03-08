import request from "@/utils/request";

// 查询生产排班列表
export function listSchedule(query) {
  return request({
    url: "/work/schedule/list1",
    method: "get",
    params: query,
  });
}

// 查询生产排班详细
export function getSchedule(id) {
  return request({
    url: "/work/schedule/detail/" + id,
    method: "get",
  });
}

// 新增生产排班
export function addSchedule(data) {
  return request({
    url: "/work/schedule",
    method: "post",
    data: data,
  });
}

// 修改生产排班
export function updateSchedule(data) {
  return request({
    url: "/work/schedule",
    method: "put",
    data: data,
  });
}

// 删除生产排班
export function delSchedule(id) {
  return request({
    url: "/work/schedule/" + id,
    method: "delete",
  });
}

// 查询生产排班列表
export function getTodayWorkSchedule(query) {
  return request({
    url: "/work/schedule/today",
    method: "get",
    params: query,
  });
}

// 新增生产排班
export function addWorkSchedules(data) {
  return request({
    url: "/work/schedule/add",
    method: "post",
    data: data,
  });
}

// 获取指定日期指定班组的员工排班
export function getTodayWorkSchedulesOfTeam(query) {
  return request({
    url: "/work/schedule/today/team",
    method: "get",
    params: query,
  });
}

// 比对时间
export function compareDate(date) {
  return request({
    url: "/work/schedule/compare/date/" + date,
    method: "get",
  });
}

// 复制指定日期的排班
export function copyWorkSchedule(copyDate, scheduleDate) {
  return request({
    url: "/work/schedule/copy/" + copyDate + "/" + scheduleDate,
    method: "put",
  });
}
