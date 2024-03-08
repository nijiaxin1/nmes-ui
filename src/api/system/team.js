import request from "@/utils/request";

// 查询班组列表
export function listTeam(query) {
  return request({
    url: "/work/team/list",
    method: "get",
    params: query,
  });
}

// 查询班组列表
export function listEnableTeam(query) {
  return request({
    url: "/work/team/list/enable",
    method: "get",
    params: query,
  });
}

// 查询班组详细
export function getTeam(teamId) {
  return request({
    url: "/work/team/" + teamId,
    method: "get",
  });
}

// 新增班组
export function addTeam(data) {
  return request({
    url: "/work/team",
    method: "post",
    data: data,
  });
}

// 修改班组
export function updateTeam(data) {
  return request({
    url: "/work/team",
    method: "put",
    data: data,
  });
}

// 删除班组
export function delTeam(teamId) {
  return request({
    url: "/work/team/" + teamId,
    method: "delete",
  });
}

// 查询班组成员
export function getTeamMembers(teamId) {
  return request({
    url: "/work/team/member/" + teamId,
    method: "get",
  });
}

// 查询班组成员
export function getTeamMemberList(teamId) {
  return request({
    url: "/work/team/member/list/" + teamId,
    method: "get",
  });
}

// 新增班组成员
export function addTeamMembers(data) {
  return request({
    url: "/work/team/member/batch/add",
    method: "post",
    data: data,
  });
}

// 删除班组成员
export function deleteTeamMembers(data) {
  return request({
    url: "/work/team/member/batch/delete",
    method: "post",
    data: data,
  });
}

// 查询班组列表
export function listTeamProcess(teamId, query) {
  return request({
    url: "/work/team/process/" + teamId,
    method: "get",
    params: query,
  });
}

// 新增班组工序
export function addTeamProcess(teamId, data) {
  return request({
    url: "/work/team/process/add/" + teamId,
    method: "post",
    data: data,
  });
}

// 获取可添加的工序
export function listCanAddProcess(teamId, query) {
  return request({
    url: "/work/team/process/can/add/" + teamId,
    method: "get",
    params: query,
  });
}

// 删除班组工序
export function delTeamProcess(data) {
  return request({
    url: "/work/team/process/delete",
    method: "delete",
    data: data,
  });
}

// 设置班组主工序
export function setMainTeamProcess(id) {
  return request({
    url: "/work/team/process/main/set/" + id,
    method: "put",
  });
}

// 取消班组主工序
export function cancelMainTeamProcess(id) {
  return request({
    url: "/work/team/process/main/cancel/" + id,
    method: "put",
  });
}

// 检查是否已经设置班组主工序
export function checkHasMainTeamProcess(teamId){
  return request({
    url: "/work/team/process/main/check/" + teamId,
    method: "get",
  });
}