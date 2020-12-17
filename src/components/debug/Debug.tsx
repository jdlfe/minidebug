import React, { Component } from 'react'
import Taro from '@tarojs/taro'
import { View, CoverView, CoverImage } from '@tarojs/components'
import { AtList, AtListItem, AtActionSheet, AtActionSheetItem, } from 'taro-ui'
import { Menu, ENV } from '../../types/DebugTypes'
import { FEATURE, HOME_OPERATION_LIST, HOME_MENU, ENV_LIST } from '../../utils/consants'

import ChangePin from '../changePin/changePin'
import AppInformation from '../../components/appinformation/AppInformation'
import PositionSimulation from '../../components/positionSimulation/PositionSimulation'
import H5door from '../../components/h5door/H5door'
import Storage from '../../components/storage/Storage'

const app = Taro.getApp()

type Props = {}

type State = {
  menuList: Array<Menu>
  envList: Array<ENV>
  showPopup: boolean
  curEnv: string
  featureType: number
  hideHomeMenu: boolean
}

export default class Debug extends Component<Props, State> {
  constructor(props) {
    super(props)
    this.state = {
      menuList: HOME_MENU,
      envList: ENV_LIST,
      showPopup: false,
      curEnv: '',
      featureType: FEATURE.DEFAULT,
      hideHomeMenu: false,
    }
  }
  componentDidMount () {
    if (!app.globalData) {
      app.globalData = {}
    }
    const envEnum = Taro.getStorageSync('env')
    const envItem = this.state.envList.find(item => item.env === envEnum)
    this.setState({
      curEnv: envItem ? envItem.name : '',
    })
    if (!app.globalData.initialLocation) {
      Taro.getLocation({
        success: res => {
          app.globalData.initialLocation = {
            latitude: res.latitude,
            longitude: res.longitude
          }
          Taro.setStorageSync('location', app.globalData.initialLocation)
        }
      })
    }
  }
  onUpdate = () => {
    const updateManager = Taro.getUpdateManager()
    updateManager.onCheckForUpdate(function(res) {
      if (res && !res.hasUpdate) {
        // 请求完新版本信息的回调
        Taro.showModal({
          title: '更新提示',
          content: '当前已经是最新版本'
        })
      }
    })
    updateManager.onUpdateReady(function() {
      Taro.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success(res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })
    updateManager.onUpdateFailed(function() {
      // 新版本下载失败
    })
  }

  onChangeEnv = () => {
    this.showAddPopup()
  }
  onScan = () => {
    Taro.scanCode({
      success: (res) => {
        console.log('scan result...', res)
        res.path && Taro.reLaunch({ url:`/${res.path}` })
      }
    })
  }
  showAddPopup = () => {
    this.setState({
      showPopup: true,
    })
  }
  closeAll = () => {
    this.setState({
      showPopup: false,
    })
  }
  openSetting = () => {
    Taro.openSetting({
      success: function(res) {
        console.log(res)
      }
    })
  }
  handleMenuClicked = (event) => {
    const { type, } = event.currentTarget.dataset.item
    this.setState({ featureType: type })
    if (type === FEATURE.CHANGE_ENV) {
      this.onChangeEnv()
    } else if (type === FEATURE.SCAN) {
      this.onScan()
    } else if (type === FEATURE.UPDATE) {
      this.onUpdate()
    }
  }
  handleChangeEnv = (env) => {
    Taro.setStorage({
      key: 'env',
      data: env,
      success: () => {
        Taro.showModal({
          title: '提示',
          content: '环境设置成功，应用即将重启',
          confirmText: '知道了',
          showCancel: false,
          success: res => {
            if (res.confirm) {
              // reLaunch不走app.js了
              Taro.getApp().needResetHttp = true
              Taro.reLaunch({ url: '/pages/index/index' })
            }
          }
        })
      },
      complete: () => {
        this.closeAll()
      }
    })
  }

  onShowHomeMenu = () => {
    this.setState({ hideHomeMenu: false, })
  }
  onHideHomeMenu = () => {
    this.setState({ hideHomeMenu: true, })
  }

  render () {
    const { menuList, showPopup, envList, curEnv, featureType, hideHomeMenu, } = this.state
    const showDebugMenu = HOME_OPERATION_LIST.indexOf(featureType) > -1
    return (
      <View className='debug-container'>
        {!showDebugMenu && !hideHomeMenu && (
          <CoverView className='home-container'>
            <CoverImage
              className='home-img'
              src={'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAFEklEQVR4Xu1aXYgcRRCumt23E25BRMQIkaigRo1ESfAHNhAOInrX1eve+SB5iQpBJREUFUUIin9wRoKK6D2cP/HBuZvuzaEigh6IETXBgBoQQwxKOFBzKCgRWaakYU7WzfTO7PzdXG4X7uWmq776vqmu7q4ehFX+w1XOHwYCDDJglSswmAKrPAEGRTC3KUBE6xHxfma+BxGfB4DPPM87ULaMy0UAKeVmZn4TAC7tIDyvlNpy1gsgpdwakL+gm6zv+1e3Wq1vyiRCphkghBCI+BYAnBNC8ohS6toykTexZCaAEOLOgHwYR2ZmqbXWZ6UAQoidiPiKhdw/zDxRRvKZZAARPQQApsqf8UPEvwBgwvO898r25pfiSTUFiGgPADxhIfcHADSVUh+VlXyqDCCiFwDgAQu535i5qbWeLzP5xAIQ0esAcJeF3EKlUrl9ZmbmYNnJ9y1AvV6v1mq1txFxwkLuZ0RseJ731Uog35cAQoia4zj7mfkWC7njzNzQWh9ZKeRjCyClXMPM7wDAzRZy3zuO05idnf1uJZGPJQARXQ4AhvyGZSC3yMyLjuOc8n3/MCLODQ8Pz09PT/+dVSyRy6CU8mlmfjQrwAz8/AoA77bb7cm5ubkf0/qLFICIOC1ITvYLiDjped5kGv+RAggh9plzfRqQnG0/rlar213XPZkEJ44A28zcA4BKEoCCbE4zc11r/WW/eJECGIdCCCOCKYQ1C4Bi5n39gscYvxERNwKA+bssajwzX6y1PhE1rvN5LAGMARHdFKwGF4UBMPOHtVpNZFmhO3GEEGvNUsvMz/XIxpPMvF5r/XtcEWILEIhwTSDCFRaAT41WSqlTcQPod5wQYgMivgYA14fZIqL2PI/i+u1LgGA6rAOA/Yi4yRLAoUql0nBd96e4QSQZJ4TYjYh7LTE8GHd16FsAAzg6Onq+4zjmTLDVEvxR3/ebrVbraBJycW2klKbrHFZ7Ftrt9o1x9gmJBDABjoyMDA0NDZn+ny3dTiDieN4HIyJ6HwC2hYj2slLqvigxEwuw5JiI3gCA7RagX4J2WG59gWazeUm73f4hBH+xWq2ucV33dC8RUgsQFMeXAOBeC9CfiHhHnm2xHlOhoZTychcgEOFZAHjYAuYjIuV1MySEWIeIx0Kwp5RSdxciQLBCPI6IT1oAc70ZIiIjgFmh/vsh4hee520uTIBAhF2I+GIYKDNvyatPSEQm1f9XkJn5mNa683rujLAyqQHdXqWUO5h5quv/h5VS10VV5aTPiegRAHimy35RKXVuoRmwBCalnGBmc2dg9vHzzLwnr7cfZF4dET/pJquU6vmSc8mAziCEEOaUltsy2LEclysDkqZyUrtS1YCkJNLYlWYVSEMiqW1p9gFJCaS163EyLG4nmJZEUvugP/B1iH1xZ4GkwWdhR0TfAsCVIb6KOQ1mQSKpDyHEFCLuCLHPvx+QNOis7KSUB5j5tjB/iJhvRygrEkn8ENGtAPAqAFxosXeVUuNxfee+E4wbSNS4oCs8HnSFbcM/V0rdEOWr83lsAcbGxq5CxJ4Hi36AY47t614gat8fOl2iAgm+/dsFAPWoscv1PM6x1xZbZAZIKfcy8+7lIhcD9wOllO2jjUjzSAGIyFxBr430VPyAYm6HiegxAHiqeH5WxGK/DzDnefO9HyI2AeC8goVY/i9ECiZcOFxkDSg8ooIBBwIULHjp4AYZULpXUnBAgwwoWPDSwf0LvhPSUKrDqO0AAAAASUVORK5CYII='}
              onClick={() => { this.setState({ featureType: -1 }) }}
            ></CoverImage>
          </CoverView>
        )}
        {showDebugMenu && (
          <AtList>
            {menuList.map(item => (
              <AtListItem
                key={item.title}
                title={item.title}
                arrow="right"
                onClick={e => {
                  e.currentTarget.dataset.item = item
                  this.handleMenuClicked(e)
                }}
                note={item.title !== '环境切换' ? item.desc : (curEnv ? `当前环境：${curEnv}` : '环境切换')}
                hasBorder
              />
            ))}
          </AtList>
        )}
        <AtActionSheet isOpened={showPopup} onClose={this.closeAll} cancelText='取消' title='测试、预发、正式环境动态切换' >
          {envList.map(item => (
            <AtActionSheetItem
              key={item.env}
              onClick={() => {
                this.handleChangeEnv(item.env)
              }}
            >
              {item.name}
            </AtActionSheetItem>
          ))}
        </AtActionSheet>

        {featureType === FEATURE.CHANGE_PIN && (
          <ChangePin />
        )}
        {featureType === FEATURE.GET_APP_INFO && (
          <AppInformation />
        )}
        {featureType === FEATURE.MOCK_POSITION && (
          <PositionSimulation />
        )}
        {featureType === FEATURE.JUMP_H5 && (
          <H5door />
        )}
        {/* 缓存管理 */}
        {featureType === FEATURE.MANAGE_STORAGE && (
          <Storage onShowHomeMenu={this.onShowHomeMenu} onHideHomeMenu={this.onHideHomeMenu} />
        )}
      </View>
    )
  }
}
