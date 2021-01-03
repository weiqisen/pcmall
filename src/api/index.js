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
  action: {
    save: '/action/save',
    remove: '/action/remove',
    list: '/action/list',
    getActionsByMenu: '/menu/action',
    grantActionApi: '/action/api/grant'
  },
  dict: {
    page: '/dict/page',
    list: '/dict/list',
    save: '/dict/save'
  },
  api: {
    page: '/api/page',
    add: '/api/add',
    save: '/api/save',
    list: '/api/list',
    remove: '/api/remove',
    actionList: '/api/action/list',
    menuList: '/api/menu/list',
    clientList: '/api/client/list',
    actionGrant: '/api/action/grant',
    batchRemove: '/api/batch/remove',
    batchUpdate: '/api/batch/update',
    batchUpdateServiceList: '/api/batch/update/server/list',
    batchAddService: '/api/batch/add/server',
    batchUpdateService: '/api/batch/update/server',
    serviceList: '/api/server/list'
  },
  developer: {
    page: '/developer',
    save: '/developer/save',
    remove: '/developer/remove',
    list: '/developer/list',
    updatePassword: '/developer/update/password',
    code: {
      genertor: {
        page: '/code/genertor/page',
        save: '/code/genertor/save',
        info: '/code/genertor/info',
        remove: '/code/genertor/remove',
        tables: '/code/genertor/tables',
        excute: '/code/genertor/execute',
        download: '/code/genertors/download'
      }
    }
  },
  user: {
    test: '/fgdgfd',
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
  menu: {
    save: '/menu/save',
    remove: '/menu/remove',
    list: '/menu/list',
    getMenu: '/menu/info',
    grantMenuApi: '/menu/api/grant'
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
      download: '/device/template/download',
      export: '/device/template/export'
    },
    upload: function () {
      const baseURL = window.serverCfg['baseURL']
      return baseURL + '/file/upload'

      // return `${process.env.VUE_APP_API_BASE_URL}/file/upload`
      // return `${baseURL}/file/upload`
    },
    threeUpload: function () {
      const baseURL = window.serverCfg['baseURL']
      return baseURL + '/file/upload/three'

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
  log: {
    page: '/log/page',
    info: '/log/info',
    removeBatch: '/log/remove/batch',
    exports: '/oss/file/package',
    progress: '/log/progress',
    upload: '/log/upload/to/device',
    uploadBatch: '/log/upload/to/batch'
  },
  websocket: {
    link: function () {
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
