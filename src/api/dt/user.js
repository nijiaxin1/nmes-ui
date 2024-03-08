import request from "@/utils/request";

// 通过手机号获取钉钉用户信息
export function getDtUserByMobile(appkey, mobile) {
  return request({
    url: "/dt/user/getbymobile/" + appkey + "/" + mobile,
    method: "get",
  });
}

// 同步钉钉用户
export function syncDtUsers(data) {
  return request({
    url: "/dt/user/sync",
    method: "post",
    data: data,
  });
}

// 查询用户列表
export function listTeamUser(query) {
  return request({
    url: "/dt/system/user/list/team/member",
    method: "get",
    params: query,
  });
}

// 用户别名模糊查询
export function listUserByFuzzyNickName(nickName) {
  return request({
    url: "/dt/system/user/list/user/fuzzy/" + nickName,
    method: "get",
  });
}
