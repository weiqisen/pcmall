import Vue from 'vue'
import Vuex from 'vuex'

import app from './modules/app'
import menu from './modules/menu'
import user from './modules/user'
// import permission from './modules/permission'
import getters from './getters'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    app,
    user,
    menu
    // permission
  },
  state: {

  },
  mutations: {

  },
  actions: {

  },
  getters
})
