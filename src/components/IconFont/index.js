import { Icon } from 'ant-design-vue'
import Vue from 'vue'

const TcIcon = Icon.createFromIconfontCN({
  // scriptUrl: "//at.alicdn.com/t/font_1943202_1bn5g9awovs.js"
  scriptUrl: '//at.alicdn.com/t/font_2005204_ywq6rhibk5b.js'
})

Vue.component('tc-icon', TcIcon)
export default TcIcon
