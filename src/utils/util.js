import Taro from '@tarojs/taro'

export const handleGoPage = url => {
  Taro.navigateTo({
    url
  })
}
export const relaunch = ({ title = '提示', content, confirmText = '知道了', showCancel = false, cancelText = '', }) => {
  Taro.showModal({
    title,
    content,
    confirmText,
    showCancel,
    cancelText,
    success: res => {
      if (res.confirm) {
        Taro.reLaunch({ url: '/pages/index/index' })
      }
    }
  })
}
/**
 *  将WGS-84(国际标准)转为GCJ-02(火星坐标):
 */
export function transformFromWGSToGCJ(latitude, longitude) {
  var ee = 0.00669342162296594323;
  var a = 6378245.0;
  var pi = 3.14159265358979324;
  var adjustLat = transformLatWithXY(longitude - 105.0, latitude - 35.0);
  var adjustLon = transformLonWithXY(longitude - 105.0, latitude - 35.0);
  var radLat = latitude / 180.0 * pi;
  var magic = Math.sin(radLat);
  magic = 1 - ee * magic * magic;
  var sqrtMagic = Math.sqrt(magic);
  adjustLat = (adjustLat * 180.0) / ((a * (1 - ee)) / (magic * sqrtMagic) * pi);
  adjustLon = (adjustLon * 180.0) / (a / sqrtMagic * Math.cos(radLat) * pi);
  latitude = latitude + adjustLat;
  longitude = longitude + adjustLon;
  return { latitude: latitude, longitude: longitude };

}
/**
 *  将GCJ-02(火星坐标)转为WGS-84:
 */
export function transformFromGCJToWGS(latitude, longitude) {
  var threshold = 0.00001;

  // The boundary
  var minLat = latitude - 0.5;
  var maxLat = latitude + 0.5;
  var minLng = longitude - 0.5;
  var maxLng = longitude + 0.5;

  var delta = 1;
  var maxIteration = 30;

  while (true) {
    var leftBottom = transformFromWGSToGCJ(minLat, minLng);
    var rightBottom = transformFromWGSToGCJ(minLat, maxLng);
    var leftUp = transformFromWGSToGCJ(maxLat, minLng);
    var midPoint = transformFromWGSToGCJ((minLat + maxLat) / 2, (minLng + maxLng) / 2);
    delta = Math.abs(midPoint.latitude - latitude) + Math.abs(midPoint.longitude - longitude);

    if (maxIteration-- <= 0 || delta <= threshold) {
      return { latitude: (minLat + maxLat) / 2, longitude: (minLng + maxLng) / 2 };
    }

    if (isContains({ latitude: latitude, longitude: longitude }, leftBottom, midPoint)) {
      maxLat = (minLat + maxLat) / 2;
      maxLng = (minLng + maxLng) / 2;
    }
    else if (isContains({ latitude: latitude, longitude: longitude }, rightBottom, midPoint)) {
      maxLat = (minLat + maxLat) / 2;
      minLng = (minLng + maxLng) / 2;
    }
    else if (isContains({ latitude: latitude, longitude: longitude }, leftUp, midPoint)) {
      minLat = (minLat + maxLat) / 2;
      maxLng = (minLng + maxLng) / 2;
    }
    else {
      minLat = (minLat + maxLat) / 2;
      minLng = (minLng + maxLng) / 2;
    }
  }

}
function transformLatWithXY(x, y) {
  var pi = 3.14159265358979324;
  var lat = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x));
  lat += (20.0 * Math.sin(6.0 * x * pi) + 20.0 * Math.sin(2.0 * x * pi)) * 2.0 / 3.0;
  lat += (20.0 * Math.sin(y * pi) + 40.0 * Math.sin(y / 3.0 * pi)) * 2.0 / 3.0;
  lat += (160.0 * Math.sin(y / 12.0 * pi) + 320 * Math.sin(y * pi / 30.0)) * 2.0 / 3.0;
  return lat;
}

function transformLonWithXY(x, y) {
  var pi = 3.14159265358979324;
  var lon = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x));
  lon += (20.0 * Math.sin(6.0 * x * pi) + 20.0 * Math.sin(2.0 * x * pi)) * 2.0 / 3.0;
  lon += (20.0 * Math.sin(x * pi) + 40.0 * Math.sin(x / 3.0 * pi)) * 2.0 / 3.0;
  lon += (150.0 * Math.sin(x / 12.0 * pi) + 300.0 * Math.sin(x / 30.0 * pi)) * 2.0 / 3.0;
  return lon;
}
function isContains(point, p1, p2) {
  return (point.latitude >= Math.min(p1.latitude, p2.latitude) && point.latitude <= Math.max(p1.latitude, p2.latitude)) && (point.longitude >= Math.min(p1.longitude, p2.longitude) && point.longitude <= Math.max(p1.longitude, p2.longitude));
}
function transBool(bol) {
  return bol ? '是' : '否'
}

const getPerformance = function(lev) {
  if (lev === -2 || lev === 0) return '该设备无法运行小游戏'
  if (lev === -1) return '性能未知'
  if (lev > 1 && lev < 10) return '低'
  if (lev > 11 && lev < 25) return '中'
  if (lev > 26 && lev < 50) return '优'
}

export const transSystemInfo = function(info) {
  
  return [
    {
      name: '设备品牌',
      value: info.brand
    },
    {
      name: '设备型号',
      value: info.model
    },
    {
      name: '设备像素比',
      value: info.pixelRatio
    },
    {
      name: '屏幕宽高',
      value: info.screenWidth + '/' + info.screenHeight
    },
    {
      name: '可视区域宽高',
      value: info.windowWidth + '/' + info.windowHeight
    },
    {
      name: '微信版本号',
      value: info.version
    },
    {
      name: '操作系统及版本号',
      value: info.system
    },
    {
      name: '客户端平台',
      value: info.platform
    },
    {
      name: '设备性能值',
      value: getPerformance(info.benchmarkLevel)
    },
    {
      name: '允许微信使用摄像头的开关',
      value: transBool(info.cameraAuthorized)
    },
    {
      name: '允许微信使用定位的开关',
      value: transBool(info.locationAuthorized)
    },
    {
      name: '允许微信使用麦克风的开关',
      value: transBool(info.microphoneAuthorized)
    },
    {
      name: '允许微信通知的开关',
      value: transBool(info.notificationAuthorized)
    },
    {
      name: '地理位置的系统开关',
      value: transBool(info.locationEnabled)
    },
    {
      name: 'Wi-Fi 的系统开关',
      value: transBool(info.wifiEnabled)
    }
  ]
}
export const transUserInfo = function(info) {
  return [
    {
      name: '昵称',
      value: info.nickName
    },
    {
      name: '性别',
      value: info.gender === 1 ? '男' : '女'
    },
    {
      name: '地区',
      value: info.city + ' ' + info.province + ' ' + info.country
    },
    {
      name: '头像',
      type: 'img',
      value: info.avatarUrl
    }
  ]
}

export const transAuthInfo = function(info) {
  return [
    {
      name: '是否授权用户信息',
      value: transBool(info['scope.userInfo'])
    },
    {
      name: '是否授权地理位置',
      value: transBool(info['scope.userLocation'])
    },
    {
      name: '是否授权通讯地址',
      value: transBool(info['scope.address'])
    },
    {
      name: '是否授权发票抬头',
      value: transBool(info['scope.invoiceTitle'])
    },
    {
      name: '是否授权获取发票',
      value: transBool(info['scope.invoice'])
    },
    {
      name: '是否授权微信运动步数',
      value: transBool(info['scope.werun'])
    },
    {
      name: '是否授权录音功能',
      value: transBool(info['scope.record'])
    },
    {
      name: '是否授权保存到相册',
      value: transBool(info['scope.writePhotosAlbum'])
    },
    {
      name: '是否授权摄像头',
      value: transBool(info['scope.camera'])
    }
  ]
}
