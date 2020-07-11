import { ComponentClass } from 'react'
import Taro, { Component, } from '@tarojs/taro'
import { View, CoverImage, CoverView, } from '@tarojs/components'
import { TtList, TtListItem, TtActionSheet, TtActionSheetItem, } from '@pandora/tarot'
import './Debug.scss'
import { Menu, ENV } from '../../types/DebugTypes'
import { FEATURE, HOME_OPERATION_LIST, HOME_MENU, ENV_LIST } from '../../utils/consants'

import ChangePin from '../changePin/ChangePin'
import AppInformation from '../../components/appinformation/AppInformation'
import PositionSimulation from '../../components/positionSimulation/PositionSimulation'
import H5door from '../../components/h5door/H5door'
import Storage from '../../components/storage/Storage'

const app = Taro.getApp()

type PageStateProps = {}

type PageDispatchProps = {}

type PageOwnProps = {}

type PageState = {
  menuList: Array<Menu>
  envList: Array<ENV>
  showPopup: boolean
  curEnv: string
  featureType: number
  hideHomeMenu: boolean
}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface Debug {
  props: IProps;
}

class Debug extends Component {
  state = {
    menuList: HOME_MENU,
    envList: ENV_LIST,
    showPopup: false,
    curEnv: '',
    featureType: FEATURE.DEFAULT,
    hideHomeMenu: false,
  }

  componentDidMount() {
    const envEnum = Taro.getStorageSync('env')
    const envItem = this.state.envList.find(item => item.env === envEnum)
    this.setState({
      curEnv: envItem ? envItem.name : '',
    })
    if (!app.initialLocation) {
      Taro.getLocation({
        success: res => {
          app.initialLocation = {
            latitude: res.latitude,
            longitude: res.longitude
          }
          Taro.setStorageSync('location', app.initialLocation)
          console.log('initialLocation', app.initialLocation)
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
  handleChangeEnv = (e) => {
    const { env } = e.currentTarget.dataset
    Taro.setStorage({
      key: 'env',
      data: env,
      success: res => {
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
      complete: res => {
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
      <View className="debug-container">
        {!showDebugMenu && !hideHomeMenu && (
          <CoverView className='home-container'>
            <CoverImage
              className='home-img'
              src={require('../../assets/img/home.png')}
              onClick={e => { this.setState({ featureType: -1 }) }}
            ></CoverImage>
          </CoverView>

        )}
        {showDebugMenu && (
          <TtList>
            {menuList.map(item => (
              <TtListItem
                key={item.title}
                title={item.title}
                arrow="right"
                onClick={e => {
                  e.currentTarget.dataset.item = item
                  this.handleMenuClicked(e)
                }}
                placeholder={item.title !== '环境切换' ? item.desc : (curEnv ? `当前环境：${curEnv}` : '环境切换')}
                hasBorder
              />
            ))}
          </TtList>
        )}
        <TtActionSheet isOpened={showPopup} onClose={this.closeAll} cancelText='取消' title='测试、预发、正式环境动态切换' >
          {envList.map(item => (
            <TtActionSheetItem
              key={item.env}
              onClick={e => {
                e.currentTarget.dataset.env = item.env
                this.handleChangeEnv(e)
              }}
            >
              {item.name}
            </TtActionSheetItem>
          ))}
        </TtActionSheet>

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

// #region 导出注意
//
// 经过上面的声明后需要将导出的 Taro.Component 子类修改为子类本身的 props 属性
// 这样在使用这个子类时 Ts 才不会提示缺少 JSX 类型参数错误
//
// #endregion

export default Debug as ComponentClass<PageOwnProps, PageState>
