import { Menu, ENV, TransTypeItem } from "../types/DebugTypes"

export const FEATURE: any = {
  DEFAULT: -1,
  CHANGE_ENV: 1,
  CHANGE_PIN: 2,
  GET_APP_INFO: 3,
  MOCK_POSITION: 4,
  MANAGE_STORAGE: 5,
  SCAN: 6,
  JUMP_H5: 7,
  UPDATE: 8,
  PERFORMANCE: 9,
}
export const HOME_OPERATION_LIST: Array<number> = [
  FEATURE.DEFAULT,
  FEATURE.CHANGE_ENV,
  FEATURE.SCAN,
  FEATURE.UPDATE
]
export const HOME_MENU: Array<Menu> = [
  {
    title: '环境切换',
    type: FEATURE.CHANGE_ENV,
    desc: '测试、预发、正式环境切换'
  },
  {
    title: '身份Mock',
    type: FEATURE.CHANGE_PIN,
    desc: '动态修改pin，只支持测试环境',
  },
  {
    title: '应用信息获取',
    type: FEATURE.GET_APP_INFO,
    desc: '点击查看设备信息',
  },
  {
    title: '位置模拟',
    type: FEATURE.MOCK_POSITION,
    desc: '模拟位置数据',
  },
  {
    title: '缓存管理',
    type: FEATURE.MANAGE_STORAGE,
    desc: '缓存数据新增、删除、修改',
  },
  {
    title: '扫一扫',
    type: FEATURE.SCAN,
    desc: '可用于扫描微信小程序码或二维码',
  },
  {
    title: 'H5跳转',
    type: FEATURE.JUMP_H5,
    desc: '跳转指定H5链接'
  },
  {
    title: '更新版本',
    type: FEATURE.UPDATE,
    desc: '更新应用版本',
  },
  {
    title: '性能监控',
    type: FEATURE.PERFORMANCE,
    desc: '性能指标分析',
  },
]
export const ENV_LIST: Array<ENV> = [
  {
    env: 'development',
    name: '测试',
  },
  {
    env: 'prepare',
    name: '预发',
  },
  {
    env: 'production',
    name: '正式',
  },
]
export const CONVERT_LIST: Array<TransTypeItem> = [
  {
    type: 0,
    name: 'wgs84转gcj02'
  },
  {
    type: 1,
    name: 'gcj02转wgs84'
  }
]
