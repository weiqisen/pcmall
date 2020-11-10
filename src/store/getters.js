const getters = {
  device: state => state.app.device,
  theme: state => state.app.theme,
  color: state => state.app.color,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  username: state => state.user.username,
  nickname: state => state.user.name,
  tenantId: state => state.user.tenantId,
  welcome: state => state.user.welcome,
  authorities: state => state.user.authorities,
  menus: state => state.user.menus,
  // roles: state => state.user.roles,
  userInfo: state => state.user.info,
  // addRouters: state => state.permission.addRouters,
  addRouters: state => state.menu.addRouters,
  multiTab: state => state.app.multiTab
}

export default getters
