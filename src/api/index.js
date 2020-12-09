// baseURL = window.serverCfg['baseURL'];
// console.log(baseURL)
const apis = {
  role: {
    page: '/role/page',
    save: '/role/save',
    remove: '/role/remove',
    list: '/role/list',
    authorityMenu: '/role/authority/menu',
    grantMenu: '/role/grant/menu',
    getRoleUsers: '/admin/role/users',
    saveRoleUsers: '/admin/role/users/save'
  },
  user: {
    page: '/user/page',
    save: '/user/save',
    remove: '/user/remove',
    batchRemove: '/user/batch/remove',
    updateUserPassword: '/user/update/password',
    updatePassword: '/current/user/rest/password',
    updateCurrent: '/current/user/update',
    updateAvatar: '/current/user/avatar',
    list: '/user/list',
    saveUserRoles: '/user/roles/save',
    getUserRoles: '/user/roles',
    queryUser: '/current/query/user',
    log: '/access/log/page'
  },
  device: {
    page: '/device/page',
    save: '/device/save',
    list: '/device/list',
    info: '/device/info',
    adjustSave: '/device/adjust/save',
    progress: '/device/progress',
    remove: '/device/remove',
    interval: '/device/interval',
    upgrade: '/device/soft/to/device',
    upgradeBatch: '/device/soft/to/batch',
    monitor: '/device/info/dashboard',
    template: {
      download:'/device/template/download',
      export:'/device/template/export'
    },
    upload: function () {
      let baseURL = window.serverCfg['baseURL'];
      return baseURL+'/file/upload';

      // return `${process.env.VUE_APP_API_BASE_URL}/file/upload`
      // return `${baseURL}/file/upload`

    },
    threeUpload: function (){
      let baseURL = window.serverCfg['baseURL'];
      return baseURL+'/file/upload/three';

      // return `${process.env.VUE_APP_API_BASE_URL}/file/upload/three`
      // return `${baseURL}/file/upload/three`

    }
  },
  disk: {
    page: '/disk/file/page',
    upgradePage: '/disk/file/upgrade/page',
    remove: '/disk/file/remove'
  },
  alarm: {
    page: '/alarm/page',
    repair: '/alarm/repair/to/device'
  },
  category: {
    list: '/category/list',
    page: '/category/page',
    save: '/category/save',
    remove: '/category/remove'
  },
  distribu: {
    page: '/distribu/page',
    save: '/distribu/save',
    info: '/distribu/info',
    remove: '/distribu/remove',
    list: '/distribu/list'
  },
  log: {
    page: '/log/page',
    info: '/log/info',
    removeBatch: '/log/remove/batch',
    exports: '/oss/file/package',
    progress: '/log/progress',
    upload: '/log/upload/to/device',
    uploadBatch: '/log/upload/to/batch'
  },
  websocket:{
    link: function (){
      return `${process.env.VUE_APP_WS_BASE_URL}/websocket`
    }
  },
  login: {
    login: '/login/token',
    logout: '/logout/token',
    getUserInfo: '/current/user',
    getUserMenu: '/current/user/menu'
  }
}
export default apis
