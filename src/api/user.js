import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/api/admin/login',
    method: 'post',
    data
  })
}

export function whoami(token) {
  return request({
    url: '/api/admin/whoami',
    method: 'post',
    data: { authorization: token }
  })
}

export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}
