import CryptoJS from 'crypto-js'
import XEUtils from 'xe-utils'
// SHA256
const sha256 = (data) => {
  return CryptoJS.SHA256(data).toString()
}
// MD5
const md5 = (data) => {
  return CryptoJS.MD5(data).toString()
}

const getNonce = () => {
  return Math.random().toString(36).substring(2)
}

/**
 * 接口参数签名
 * @param {*} config 请求配置
 */
export const sign = (config, apiKey, secretKey, signType) => {
  // 获取到秒级的时间戳,与后端对应
  let data = {
    ApiKey: apiKey,
    Timestamp: XEUtils.toDateString(new Date(), 'yyyyMMddHHmmss'),
    SignType: signType,
    Nonce: getNonce()
  }

  const SING_KEY = 'Sign'
  const SECRET_KEY = 'SecretKey'
  let keys = []
  if (config.method === 'get') {
    // url参数签名
    data = config.params = Object.assign(config.params ? config.params : {}, data)
    keys = Object.keys(data)
  } else {
    // request body参数的内容
    data = config.data = Object.assign(config.data ? config.data : {}, data)
    keys = Object.keys(data)
  }
  // 排序
  const skeys = keys.sort()
  let str = ''
  skeys.filter(k => {
    return k !== SING_KEY && k !== SECRET_KEY
  }).filter(k => {
    return !(XEUtils.isArray(data[k]) && data[k].length === 0)
  }).filter(k => {
    return !XEUtils.isNull(data[k])
  }).map(k => {
    const v = data[k]
    if (typeof (v) === 'undefined') {
      // 参数值为空，则不参与签名
      str = str + k + '=&'
    } else {
      str = str + k + '=' + v + '&'
    }
  })
  str = str + SECRET_KEY + '=' + secretKey
  console.log(str)
  let sign = ''
  if (data.SignType === 'MD5') {
    sign = md5(str)
  }
  if (data.SignType === 'SHA256') {
    sign = sha256(str)
  }
  if (config.method === 'get') {
    config.params[SING_KEY] = sign
  } else {
    config.data[SING_KEY] = sign
  }
  return config
}
