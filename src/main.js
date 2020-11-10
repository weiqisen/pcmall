// ie polyfill
import '@babel/polyfill'

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import store from './store/'
import {VueAxios} from './utils/request'

// mock
import './mock'

import bootstrap from './core/bootstrap'
import './core/use'
import './permission' // permission control
import './utils/filter' // global filter
// 组件引用
import './libs/use'

Vue.config.productionTip = false

// mount axios Vue.$http and this.$http
Vue.use(VueAxios)

//echarts
import echarts from 'echarts'  //引入echarts
Vue.prototype.$echarts = echarts  //注册组件

//百度地图
import BaiduMap from 'vue-baidu-map'
Vue.use(BaiduMap, {
    // ak 是在百度地图开发者平台申请的密钥 详见 http://lbsyun.baidu.com/apiconsole/key */
    ak: 'yq5PvbxEt9pjDLCGXHbAQC668UQUEZzP'
})


function InitVue () {
  return new Promise ((resolve, reject) => {
    axios.get('/serverConfig.json').then((result) => {
      let config = result.data;
      window.serverCfg = {};
      for (let key in config) {
        window.serverCfg[key] = config[key];
      }
      window.vue = new Vue({
        router,
        store,
        created() {
          bootstrap()
        },
        render: h => h(App),

      }).$mount('#app')
      Vue.ls.set('baseURL',Vue.prototype.baseURL)
      resolve();
    }).catch((error) => {
      window.location
    })
  })
}

async function Run() {
  await InitVue();
}

window.onload = async function () {
  await Run();
}

