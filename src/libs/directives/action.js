import Vue from 'vue'
import store from '@/store'

/**
 * Action 权限指令
 * 指令用法：
 *  - 在需要控制 action 级别权限的组件上使用 v-action:[method] , 如下：
 *    <i-button v-action:add >新增用户</Button>
 *    <Button v-action:delete>删除用户</Button>
 *    <a v-action:edit @click="edit(record)">修改</a>
 *
 *  - 当前用户没有权限时，组件上使用了该指令则会被隐藏
 *  - 当后台权限跟 pro 提供的模式不同时，只需要针对这里的权限过滤进行修改即可
 *
 *  @see https://github.com/sendya/ivu-design-pro-vue/pull/53
 */
const action = Vue.directive('action', {
  inserted: function (el, binding, vnode) {
    const actionName = binding.arg
    // const roles = store.getters.state.user
    const elVal = vnode.context.$route.meta.authorities
    const permissionList = vnode.context.$store.getters.userInfo.authorities
    const authoritiesId = elVal instanceof String && [elVal] || elVal
    permissionList.forEach(p => {
      if (!authoritiesId.includes(p.authority)) {
        return
      }
      if (p.authority && !p.authority.includes(actionName)) {
        el.parentNode && el.parentNode.removeChild(el) || (el.style.display = 'none')
      }
    })
  }
})

export default action
