import { Icon } from 'ant-design-vue'
import Vue from 'vue'

const TcIcon = Icon.createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_2261820_qwjzbo7wd8.js'
})

Vue.component('tc-icon', TcIcon)
export default TcIcon
