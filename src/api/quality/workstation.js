import request from "@/utils/request";

// 查询质量报工列表
export function listWorkstation(query) {
  return request({
    url: "/quality/workstation/list",
    method: "get",
    params: query,
  });
}

// 查询质量报工详细
export function getWorkstation(reportId) {
  return request({
    url: "/quality/workstation/" + reportId,
    method: "get",
  });
}

// 新增质量报工
export function addWorkstation(data) {
  return request({
    url: "/quality/workstation",
    method: "post",
    data: data,
  });
}

// 修改质量报工
export function updateWorkstation(data) {
  return request({
    url: "/quality/workstation",
    method: "put",
    data: data,
  });
}

// 删除质量报工
export function delWorkstation(reportId) {
  return request({
    url: "/quality/workstation/" + reportId,
    method: "delete",
  });
}

// 供应商模糊查询
export function listCustomerByFuzzyName(customerName) {
  return request({
    url: "/quality/workstation/list/customer/fuzzyName/" + customerName,
    method: "get",
  });
}

// 物料模糊查询
export function listItemByFuzzyQuery(query) {
  return request({
    url: "/quality/workstation/list/item/fuzzy/" + query,
    method: "get",
  });
}