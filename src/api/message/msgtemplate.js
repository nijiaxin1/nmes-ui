import request from "@/utils/request";

// 查询消息模板列表
export function listTemplate(query) {
  return request({
    url: "/message/template/list",
    method: "get",
    params: query,
  });
}

// 查询消息模板详细
export function getTemplate(id) {
  return request({
    url: "/message/template/" + id,
    method: "get",
  });
}

// 新增消息模板
export function addTemplate(data) {
  return request({
    url: "/message/template",
    method: "post",
    data: data,
  });
}

// 修改消息模板
export function updateTemplate(data) {
  return request({
    url: "/message/template",
    method: "put",
    data: data,
  });
}

// 删除消息模板
export function delTemplate(id) {
  return request({
    url: "/message/template/" + id,
    method: "delete",
  });
}

// 查询消息处理器
export function getMessageHandler(sendChannel) {
  return request({
    url: "/message/template/handler/" + sendChannel,
    method: "get",
  });
}
