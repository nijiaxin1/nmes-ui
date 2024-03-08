import request from "@/utils/request";

// 查询质量报表列表
export function listDaily(query) {
  return request({
    url: "/quality/daily/list",
    method: "get",
    params: query,
  });
}

// 查询质量报表详细
export function getDaily(reportId) {
  return request({
    url: "/quality/daily/" + reportId,
    method: "get",
  });
}
// 查询质量报表
export function getReportInfo(query) {
  return request({
    url: "/quality/daily/report/info",
    method: "get",
    params: query,
  });
}
// 查询质量报表
export function getDailyOfDate(today) {
  return request({
    url: "/quality/daily/today/" + today,
    method: "get",
  });
}
// 查询工序质量报表
export function getQualityReportDailyByProcessId(today, processId) {
  return request({
    url: "/quality/daily/today/" + today + "/" + processId,
    method: "get",
  });
}

// 新增质量报表
export function addDaily(data) {
  return request({
    url: "/quality/daily",
    method: "post",
    data: data,
  });
}

// 修改质量报表
export function updateDaily(data) {
  return request({
    url: "/quality/daily",
    method: "put",
    data: data,
  });
}

// 删除质量报表
export function delDaily(reportId) {
  return request({
    url: "/quality/daily/" + reportId,
    method: "delete",
  });
}
