import request from '@/utils/request';

export function login(data) {
  return request({
    // url: '/vue-element-admin/user/login',
    // baseURL: 'http://47.110.80.118:8012/jian',
    url: '/sys/user/login',
    method: 'post',
    data
  });
}

export function fetchInfo() {
  return request({
    // url: '/vue-element-admin/user/info',
    // baseURL: 'http://47.110.80.118:8012/jian',
    url: '/sys/user/info',
    method: 'get'
  });
}

// 获取
export function fetchRouter() {
  return request({
    url: '/sys/menuh/getrouters',
    method: 'get'
  });
}

// 判断是否需要开启验证码
export function captchaEnable() {
  return request({
    url: '/sys/user/captcha/enable',
    method: 'get'
  });
}

// 获取验证码
export function captchaImage() {
  return request({
    url: '/sys/user/captcha/image',
    method: 'get'
  });
}

export function logout() {
  return request({
    url: '/sys/user/logout',
    method: 'post'
  });
}

// 获取抽稀后的边界数据(缓存)
export function getSimplifyBoundary1(params) {
  return request({
    url: '/sys/area/getSimplifyBoundary1',
    method: 'get',
    params
  });
}
