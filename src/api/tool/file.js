import request from "@/utils/request";

// 查询文件管理列表
export function listInfo(query) {
  return request({
    url: "/tool/file/info/list",
    method: "get",
    params: query,
  });
}

// 查询文件管理详细
export function getInfo(fileId) {
  return request({
    url: "/tool/file/info/" + fileId,
    method: "get",
  });
}

// 新增文件管理
export function addInfo(data) {
  return request({
    url: "/tool/file/info",
    method: "post",
    data: data,
  });
}

// 修改文件管理
export function updateInfo(data) {
  return request({
    url: "/tool/file/info",
    method: "put",
    data: data,
  });
}

// 删除文件管理
export function delInfo(fileId) {
  return request({
    url: "/tool/file/info/" + fileId,
    method: "delete",
  });
}

// 同步多媒体文件到钉钉
export function synctoDt(appKey, fileId) {
  return request({
    url: "/tool/file/info/sync/to/dt/" + appKey + "/" + fileId,
    method: "put",
  });
}
