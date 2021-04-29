let cml = require('chameleon-api')

const methods = [
  'scanCode',
  'getAccountInfoSync',
  'getUserInfo',
  'getSetting',
  'getLocation',
  'openLocation',
  'chooseLocation',
  'getStorageInfoSync',
  'getUpdateManager'
]

methods.forEach((method) => {
  // 暂时只扩展微信小程序
  if (typeof cml.default[method] !== 'function' && wx) {
    cml.default[method] = wx[method]
  }
})

module.exports = cml.default