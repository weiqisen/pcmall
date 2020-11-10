import Vue from 'vue'
import { login, getUserInfo,getUserMenu, logout } from '@/api/login'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { welcome } from '@/utils/util'

const user = {
  state: {
    token: '',
    name: '',
    username: '',
    tenantId: '',
    welcome: '',
    avatar: '',
    roles: [],
    info: {}
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_USERNAME: (state, username) => {
      state.username = username
    },
    SET_NAME: (state, { name, welcome }) => {
      state.name = name
      state.welcome = welcome
    },
    SET_TENANTID: (state, tenantId) => {
      state.tenantId = tenantId
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_AUTHORITIES: (state, authorities) => {
      state.authorities = authorities
    },
    // SET_ROLES: (state, roles) => {
    //   state.roles = roles
    // },
    SET_INFO: (state, info) => {
      state.info = info
    },
    SET_MENUS: (state, menus) => {
      state.menus = menus
    },
    // SET_WEBSOCKET (state, websock) {
    //   state.websock = websock
    // }
  },

  actions: {
    // 登录
    Login ({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo).then(response => {
          if(response.code===0) {
            const result = response.data;
            Vue.ls.set(ACCESS_TOKEN, result.access_token, 7 * 24 * 60 * 60 * 1000)
            commit('SET_TOKEN', result.access_token)
          }
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo ({ commit, state }) {
      return new Promise((resolve, reject) => {
        getUserInfo().then(res => {
          const result = res.data
          const access = []
          if (result.authorities) {
            result.authorities.map(item => {
              if (item.authority) {
                access.push(item.authority)
              }
            })
          }
          // commit('SET_AVATAR', result.avatar)
          commit('SET_AVATAR', result.avatar)
          commit('SET_USERNAME', result.username)
          commit('SET_NAME', { name: result.nickName, welcome: welcome() })
          commit('SET_TENANTID', result.tenantId)
          // 转换权限
          commit('SET_AUTHORITIES', access)
          commit('SET_INFO', result)
          getUserMenu().then(res => {
            const result = res.data
            commit('SET_MENUS', result)
            resolve(state)
          }).catch((e) => {
            reject(e)
          })
          // let token = Vue.ls.get(ACCESS_TOKEN)
          // const wsuri = process.env.VUE_APP_WS_BASE_URL+result.tenantId+'$'+result.userId
          // commit('SET_WEBSOCKET', new WebSocket(wsuri,[token]))
          // // 只有定义了onopen方法，才能继续实现接收消息，即在使用的地方调用onmessage方法。
          // state.websock.onopen = function () {
          //
          // }
        }).catch((e) => {
          reject(e)
        })
      })
    },

    Logout ({ commit, state }) {
      return new Promise((resolve, reject) => {
        const token = state.token
        commit('SET_TOKEN', '')
        commit('SET_AUTHORITIES', [])
        Vue.ls.remove(ACCESS_TOKEN)
        resolve()
      })
    }
  }
}

export default user
