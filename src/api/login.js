import apis from './index'
import { axios } from '@/utils/request'
// import { request } from '@/utils/request'

/**
 * login func
 * parameter: {
 *     username: '',
 *     password: '',
 *     remember_me: true,
 *     captcha: '12345'
 * }
 * @param parameter
 * @returns {*}
 */
export function login (parameter) {
  return axios({
    url: apis.login.login,
    method: 'post',
    data: parameter
  })
}

export function logout (token) {
  return axios({
    url: apis.login.logout,
    data: { token: token },
    method: 'post'
  })
}

export function getSmsCaptcha (data) {
  return axios({
    url: apis.login.getSmsCaptcha,
    method: 'post',
    data: data
  })
}

/**
 * 获取用户信息
 */
export const getUserInfo = () => {
  return axios({
    url: apis.login.getUserInfo,
    method: 'get'
  })
}

/**
 * 获取登录用户菜单权限
 */
export const getUserMenu = () => {
  return axios({
    url: apis.login.getUserMenu,
    method: 'get'
  })
}

/**
 * get user 2step code open?
 * @param parameter {*}
 */
export function get2step (parameter) {
  console.log(parameter)
  return axios({
    url: apis.twoStepCode,
    method: 'post',
    data: parameter
  })
}
