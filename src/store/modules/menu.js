import { defaultRouterMap, constantRouterMap, asyncRouterMap, notFoundRouter } from '@/config/router.config'
import { startWith, hasChild } from '@/utils/util'
import { BasicLayout, RouteView, BlankLayout, PageView } from '@/layouts'
import XEUtils from 'xe-utils'
import config from '@/config/defaultSettings'

// 前端路由表
const constantRouterComponents = {
  // 基础页面 layout 必须引入
  BasicLayout: BasicLayout,
  BlankLayout: BlankLayout,
  RouteView: RouteView,
  PageView: PageView
}

/**
 * 格式化路由菜单
 * @param array
 * @returns {Array}
 */
function filterAsyncRouter (array, authorities) {
  const opt = {
    key: 'menuId',
    parentKey: 'parentId',
    children: 'children'
  }
  const menus = XEUtils.toArrayTree(array, opt)
  const routers = filterRouter(menus, authorities, [])
  return routers
}

function filterRouter (array, authorities, routers) {
  const list = array.map(item => {
    const has = hasChild(item)
    if(item.level===1){
      if(has){
        item.children.map(itemchil =>{
          if(itemchil.level===2){
            const has2 = hasChild(item)
            if(has2){
              item.children.push(...itemchil.children)
              itemchil.children = []
            }
          }
        })
      }
    }
    const path = startWith(item.path, '/') ? item.path.substring(1) : item.path
    const url = item.scheme + (path || item.menuCode)
    const menuCode = item.menuCode ? item.menuCode : item.actionCode
    const router = {
      // 使用菜单id不使用menuCode防止修改后,刷新后缓存的页面无法找到
      name: menuCode,
      path: url,
      hidden: item.level===3?true:false,
      redirect: '',
      meta: {
        level: item.level,
        authorities: authorities,
        title: item.menuName,
        keepAlive: item.cache===0?false:true,
        icon: item.icon || (has ? 'folder' : '')
      }
    }
    console.log(router)
    // 非根节点
    if (item.scheme === '/') {
      // 内部组件
      router.component = (resolve) => {
        if (path) {
          require([`@/views/module/${path}.vue`], resolve)
        }else{
          require([`@/views/exception/404.vue`], resolve)
        }
      }
    } else {
      // 外部链接
      router.meta.target = item.target
    }
    console.log(router);
    if (has) {
      router.component = constantRouterComponents['RouteView']
      router.redirect = item.children[0].menuCode
      router.children = filterRouter(item.children, authorities, [])
    }
    return router
  }
  )
  routers.push(...list)
  return routers
}

const menu = {
  state: {
    routers: constantRouterMap,

    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    }
  },
  actions: {
    GenerateRoutes ({ commit }, data) {
      return new Promise((resolve, reject) => {
        let routers = filterAsyncRouter(data.menus, data.authorities)
        if (!config.production) {
          // 非生产环境,追加demo路由
          routers = routers.concat(asyncRouterMap)
        } else {
          routers = routers.concat(asyncRouterMap)
        }
        // 拆入路由
        defaultRouterMap[0].children.splice(0, 0, ...routers)
        // 最后加入404
        defaultRouterMap.push(notFoundRouter)
        console.log(defaultRouterMap)
        commit('SET_ROUTERS', defaultRouterMap)
        resolve()
      })
    }
  }
}

export default menu
