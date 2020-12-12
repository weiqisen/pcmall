import Vue from 'vue'
// import ViewUI from 'view-design'
// import VueStorage from 'vue-ls'
// // base library
// import Viser from 'viser-vue'
// import VueCropper from 'vue-cropper'
// import TreeSelect from '@riophae/vue-treeselect'
// import VueClipboard from 'vue-clipboard2'
// import config from '../config'
import VueBus from '../utils/vue-bus'
// import { STable } from '../components'
import Install from './install'
import XEUtils from 'xe-utils'
import VXEUtils from 'vxe-utils'
import { DownloadExcel } from '../components'

// import directives
import './directives/action'
// import style
// import 'view-design/dist/styles/iview.css'
// import 'vxe-table/lib/index.css'
// import '@riophae/vue-treeselect/dist/vue-treeselect.css'
// import '../components/index.less'
import '../assets/IconFont/iconfont.css'
// import VXETable from 'vxe-table'
// 按需导入依赖函数库
Vue.use(VXEUtils, XEUtils)

// Vue.use(ViewUI)
// Vue.component('treeselect', TreeSelect)
// Vue.use(VXETable)
// Vue.use(Viser)
// Vue.use(VueStorage, config.storageOptions)
// VueClipboard.config.autoSetContainer = true
// Vue.use(VueClipboard)
// Vue.use(VueCropper)
// Vue.config.productionTip = false
// // 注册自定义组件
// Vue.use(STable)
// 事件总线
Vue.use(VueBus)
// 全局注册应用配置
Vue.use(Install)
Vue.use(DownloadExcel)
// XEUtils.setup({
//   formatDate: 'yyyy-MM-dd HH:mm:ss.SSS', // 默认的 toStringDate 参数
//   formatString: 'yyyy-MM-dd HH:mm:ss', // 默认的 toDateString 参数
//   formatStringMatchs: {
//     E: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
//     q: [null, '第一季度', '第二季度', '第三季度', '第四季度']
//   }
// })
