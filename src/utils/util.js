export function timeFix () {
  const time = new Date()
  const hour = time.getHours()
  return hour < 9 ? '早上好' : hour <= 11 ? '上午好' : hour <= 13 ? '中午好' : hour < 20 ? '下午好' : '晚上好'
}

export function welcome () {
  const arr = ['休息一会儿吧', '准备吃什么呢?', '要不要打一把 DOTA', '我猜你可能累了']
  const index = Math.floor(Math.random() * arr.length)
  return arr[index]
}

/**
 * 触发 window.resize
 */
export function triggerWindowResizeEvent () {
  const event = document.createEvent('HTMLEvents')
  event.initEvent('resize', true, true)
  event.eventType = 'message'
  window.dispatchEvent(event)
}

export function handleScrollHeader (callback) {
  let timer = 0

  let beforeScrollTop = window.pageYOffset
  callback = callback || function () {}
  window.addEventListener(
    'scroll',
    event => {
      clearTimeout(timer)
      timer = setTimeout(() => {
        let direction = 'up'
        const afterScrollTop = window.pageYOffset
        const delta = afterScrollTop - beforeScrollTop
        if (delta === 0) {
          return false
        }
        direction = delta > 0 ? 'down' : 'up'
        callback(direction)
        beforeScrollTop = afterScrollTop
      }, 50)
    },
    false
  )
}

/**
 * Remove loading animate
 * @param id parent element id or class
 * @param timeout
 */
export function removeLoadingAnimate (id = '', timeout = 1500) {
  if (id === '') {
    return
  }
  setTimeout(() => {
    document.body.removeChild(document.getElementById(id))
  }, timeout)
}

export const setDocumentTitle = function (title) {
  document.title = title
  const ua = navigator.userAgent
  // eslint-disable-next-line
  const regex = /\bMicroMessenger\/([\d\.]+)/
  if (regex.test(ua) && /ip(hone|od|ad)/i.test(ua)) {
    const i = document.createElement('iframe')
    i.src = '/favicon.ico'
    i.style.display = 'none'
    i.onload = function () {
      setTimeout(function () {
        i.remove()
      }, 9)
    }
    document.body.appendChild(i)
  }
}

export const startWith = (str, prefix) => {
  const reg = new RegExp('^' + prefix)
  return reg.test(str)
}

export const hasChild = (item) => {
  return item.children && item.children.length !== 0
}

/**
 * 判断终端以及浏览器
 * userAgent string User-Agent信息
 */
export const readUserAgent = (ua) => {
  const data = {
    terminal: '',
    browser: '',
    terminalType: {}
  }
  data.terminalType = {
    trident: ua.indexOf('Trident') > -1, // IE内核
    presto: ua.indexOf('Presto') > -1, // opera内核
    webKit: ua.indexOf('AppleWebKit') > -1, // 苹果、谷歌内核
    gecko: ua.indexOf('Gecko') > -1 && ua.indexOf('KHTML') == -1, // 火狐内核
    mobile: !!ua.match(/AppleWebKit.*Mobile.*/), // 是否为移动终端
    ios: !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), // ios终端
    android: ua.indexOf('Android') > -1 || ua.indexOf('Adr') > -1, // android终端
    iPhone: ua.indexOf('iPhone') > -1, // 是否为iPhone或者QQHD浏览器
    iPad: ua.indexOf('iPad') > -1, // 是否iPad
    webApp: ua.indexOf('Safari') == -1, // 是否web应该程序，没有头部与底部
    weixin: ua.indexOf('MicroMessenger') > -1, // 是否微信 （2015-01-22新增）
    qq: ua.match(/\sQQ/i) == ' qq' // 是否QQ
  }
  if (data.terminalType.ios || data.terminalType.iPhone || data.terminalType.iPad) {
    data.terminal = '苹果'
  } else if (data.terminalType.android) {
    data.terminal = '安卓'
  } else {
    data.terminal = 'PC'
  }
  if (/msie/i.test(ua) && !/opera/.test(ua)) {
    data.browser = 'IE'
  } else if (/firefox/i.test(ua)) {
    data.browser = 'Firefox'
  } else if (/chrome/i.test(ua) && /webkit/i.test(ua) && /mozilla/i.test(ua)) {
    data.browser = 'Chrome'
  } else if (/opera/i.test(ua)) {
    data.browser = 'Opera'
  } else if (/iPad/i.test(ua)) {
    data.browser = 'iPad'
  } else if (/webkit/i.test(ua) && !(/chrome/i.test(ua) && /webkit/i.test(ua) && /mozilla/i.test(ua))) {
    data.browser = 'Safari'
  } else {
    data.browser = '未知'
  }
  return data
}