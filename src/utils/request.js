import Vue from 'vue'
import axios from 'axios'
import qs from 'qs'
import store from '@/store'
import { VueAxios } from './axios'
import notification from 'ant-design-vue/es/notification'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { sign } from '@/utils/sign'
import Config from '@/config/defaultSettings'

// 创建 axios 实例
const service = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL, // api base_url
  timeout: 6000 // 请求超时时间
})

const err = (error) => {
  if (error.response) {
    const data = error.response.data
    const token = Vue.ls.get(ACCESS_TOKEN)
    if (error.response.status === 403) {
      notification.error({
        message: 'Forbidden',
        description: data.message
      })
    }
    if (error.response.status === 401 && !(data.result && data.result.isLogin)) {
      notification.error({
        message: 'Unauthorized',
        description: 'Authorization verification failed'
      })
      if (token) {
        store.dispatch('Logout').then(() => {
          setTimeout(() => {
            window.location.reload()
          }, 1500)
        })
      }
    }
  }
  return Promise.reject(error)
}

// request interceptor
service.interceptors.request.use(config => {
  // 参数签名处理
  // config = sign(config, Config.appApiKey, Config.appSecretKey, 'SHA256')
  // console.log(config)
  if (config.method === 'get') {
    Object.assign(config.params ? config.params : {}, qs.stringify({ ...config.data }))
  } else if (config.method === 'delete') {
    // application/x-www-form-urlencoded
    config.headers.delete['Content-Type'] = 'application/x-www-form-urlencoded'
    config.data = qs.stringify({ ...config.data })
  }

  const token = Vue.ls.get(ACCESS_TOKEN)
  if (token) {
    // 让每个请求携带自定义 token 请根据实际情况自行修改
    config.headers['Authorization'] = 'Bearer ' + token
  }
  return config
}, err)

// response interceptor
service.interceptors.response.use((response) => {
  if (response.data.code === 0) {
    // 服务端定义的响应code码为0时请求成功
    // 使用Promise.resolve 正常响应
    return Promise.resolve(response.data)
    // return response.data
  } else {
    if (response.data) {
      if (response.data.code === 0) {
        return Promise.resolve(response.data)
      } else {
        notification.error({
          message: '错误',
          description: response.data.message
        })
        return Promise.reject(response.data)
      }
    }
    if (response.headers['content-type']) {
      return response
    }
    // 使用Promise.reject 响应
    notification.error({
      message: '错误',
      description: response.data.message
    })
    return Promise.reject(response.data)
  }
}, (error) => {
  if (error.response && error.response.data) {
    const result = error.response.data
    notification.error({
      message: '错误',
      description: result.message
    })
    return Promise.reject(result)
  }
  return Promise.reject(error)
}
)

const installer = {
  vm: {},
  install (Vue) {
    Vue.use(VueAxios, service)
  }
}

export {
  installer as VueAxios,
  service as axios
}
