import Vue from 'vue'
import Router from 'vue-router'
import { constantRouterMap } from '@/config/router.config'
import store from '../store'
import { setDocumentTitle } from '@/utils/util'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import NProgress from 'nprogress'

const whiteList = ['login', 'register', 'registerResult']

Vue.use(Router)
const routerPush = Router.prototype.push
Router.prototype.push = function push (location) {
  return routerPush.call(this, location).catch(error => error)
}

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

router.beforeEach((to, from, next) => {
  NProgress.start() // start progress bar
  to.meta && (typeof to.meta.title !== 'undefined' && setDocumentTitle(`${to.meta.title}`))
  if (Vue.ls.get(ACCESS_TOKEN)) {
    /* has token */
    console.log(store.getters.addRouters)
    console.log(to)
    console.log(from)
    if (to.path === '/user/login') {
      next({ path: '/' })
      NProgress.done()
    } else {
      if (store.getters.addRouters.length === 0) {
        store.dispatch('GetInfo').then(res => {
          store.dispatch('GenerateRoutes', res).then(() => {
            // 根据roles权限生成可访问的路由表
            // 动态新增可访问路由表
            router.addRoutes(store.getters.addRouters)
            let toaccess = false
            store.getters.addRouters.forEach(item=>{
              if(item.path==='/'){
                if(item.children.length<=3){

                  toaccess = true
                }
              }
            })
            if(toaccess){
              next({ path: '/account' })
            }else{
              // 跳转到目的路由
              next({ path: to.path })
            }
            // const redirect = decodeURIComponent(from.query.redirect || to.path)
            // const redirect = decodeURIComponent(from.query.redirect || to.path)
            // if (to.path === redirect) {
            //   // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
            //   next({ ...to, replace: true })
            // } else {
            // 跳转到目的路由
            // next({ path: to.path })
            // }
          })
        }).catch((e) => {
          store.dispatch('Logout').then(() => {
            next({ path: '/user/login' })
            // next({ path: '/user/login', query: { redirect: to.fullPath } })
          })
        })
      } else {
        next()
      }
    }
  } else {
    if (whiteList.includes(to.name)) {
      // 在免登录白名单，直接进入
      next()
    } else {
      next({ path: '/user/login' })
      // next({ path: '/user/login', query: { redirect: to.fullPath } })
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})

export default router
