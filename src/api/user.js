import request from "@/utils/request";

export function login(data) {
  return request({
    url: "/api/admin/login",
    method: "post",
    data,
  });
}

export function whoami(token) {
  return request({
    url: "/api/admin/whoami",
    method: "post",
    data: { authorization: token },
  });
}

/**
 * 修改密码
 * @param {object} data 用户账号信息
 * {username: string; oldPassword: string; newPassword: string}
 */
export function changePassword(data) {
  return request({
    url: "/api/admin",
    method: "put",
    data,
  });
}
