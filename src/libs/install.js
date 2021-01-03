import config from '../config/defaultSettings'
import { axios } from '../utils/request'
import apis from '../api'
import { rules } from '../utils/validate'
// import store from '../store'

import echarts from 'echarts'
import notification from 'ant-design-vue/es/notification' // 引入echarts
const Install = {
  vm: {},
  install (Vue, options) {
    if (this.installed) {
      return
    }
    this.installed = true

    // Vue.prototype.$auth = function (authorities) {
    //   if (!authorities) {
    //     return false
    //   }
    //   return authorities.split(',').some(item => {
    //     return store.state.user.authorities.includes('ACTION_' + item)
    //   })
    // }
    // echarts
    Vue.prototype.$echarts = echarts // 注册组件
    // api接口列表
    Vue.prototype.$apis = apis

    // 验证规则
    Vue.prototype.$rules = rules

    // 默认配置
    Vue.prototype.$config = config

    // http请求封装
    Vue.prototype.$http = {
      /**
       * get 请求
       * @param url   请求路径
       * @param params 请求数据
       * @param context 当前vue实例this
       * @returns {Promise<any>}
       */
      get: function (url, params = {}, context) {
        return new Promise((resolve, reject) => {
          axios.get(url, { params: params }).then(res => {
            resolve(res)
          }).catch(function (err) {
            reject(err)
          })
        })
      },
      /**
       * post请求
       * @param url  请求路径
       * @param data 请求数据
       * @param context 当前vue实例this
       * @returns {Promise<any>}
       */
      post: function (url, data = {}, context) {
        return new Promise((resolve, reject) => {
          let config = {}
          if (context.config) {
            config = context.config
          }
          axios.post(url, data, config).then(res => {
            resolve(res)
          }).catch(function (err) {
            reject(err)
          })
        })
      },
      getDown: function (url, params = {}, context) {
        return new Promise((resolve, reject) => {
          const param = {
            params: params
          }
          if (context) {
            param.responseType = context
          }
          axios.get(url, param).then(res => {
            resolve(res)
          }).catch(function (err) {
            reject(err)
          })
        })
      },
      /**
       * 删除
       * @param url  请求地址
       * @param data 请求数据
       * @param context 当前vue实例this
       */
      delete: function (url, data = {}, context) {
        return new Promise((resolve, reject) => {
          context.$confirm({
            title: '确认删除',
            content: '您确认要删除所选数据吗?',
            onOk: () => {
              axios.post(url, data).then(res => {
                if (res.code === 0) {
                  context.$bus.emit('ok', name)
                  context.$notification.success({
                    message: '操作',
                    description: '操作成功！'
                  })
                }
                resolve(res)
              }).catch(function (err) {
                reject(err)
              })
            }
          })
        })
      },

      deleteById: function (url, param = {}, context) {
        return new Promise((resolve, reject) => {
          context.$confirm({
            title: '确认删除',
            content: '您确认要删除所选数据吗?',
            onOk: () => {
              axios.delete(url, { data: param }).then(res => {
                if (res.code === 0) {
                  context.$bus.emit('ok', name)
                  context.$notification.success({
                    message: '操作',
                    description: '操作成功！'
                  })
                }
                resolve(res)
              }).catch(function (err) {
                reject(err)
              })
            }
          })
        })
      },
      /**
       * 带询问操作
       * @param url  请求地址
       * @param data 请求数据
       * @param options {content:'提示内容'}
       * @param context 当前vue实例this
       * @returns {Promise}
       */
      confirm (url, data = {}, options = {}, context) {
        return new Promise((resolve, reject) => {
          const content = options.content || '确定执行该操作吗?'
          context.$confirm({
            title: '确认操作',
            content: content,
            onOk: () => {
              axios.post(url, data).then(res => {
                resolve(res)
              }).catch(function (err) {
                reject(err)
              })
            }
          })
        })
      }
    }
  }
}

export default Install
