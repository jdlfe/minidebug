import { ComponentClass } from 'react'
import { View, Button, Image, } from '@tarojs/components'
import Taro, { Component, } from '@tarojs/taro'
import { AtActionSheet, AtListItem, } from 'taro-ui'
import { relaunch, transformFromWGSToGCJ, transformFromGCJToWGS, } from '../../utils/util'
import { TransTypeItem } from '../../types/DebugTypes'
import { CONVERT_LIST } from '../../utils/consants'
import './positionSimulation.scss'

const app = Taro.getApp()

type PageStateProps = {
}

type PageDispatchProps = {
}

type PageOwnProps = {}

type PageState = {
  currentLatitude: number
  currentLongitude: number
  showPopup: boolean
  transTypeList: Array<TransTypeItem>
}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface PositionSimulation {
  props: IProps;
}

class PositionSimulation extends Component {
  state = {
    currentLatitude: 0,
    currentLongitude: 0,
    showPopup: false,
    transTypeList: CONVERT_LIST
  }

  componentDidMount() {
    Taro.setNavigationBarTitle({
      title: '位置模拟'
    })
    this.getMyPosition()
  }

  choosePosition = () => {
    Taro.chooseLocation({
      success: res => {
        this.setState({
          currentLatitude: res.latitude,
          currentLongitude: res.longitude
        })
        Object.defineProperty(Taro, 'getLocation', {
          get() {
            return function(obj) {
              obj.success({ latitude: res.latitude, longitude: res.longitude })
            }
          }
        })
        console.log('chosen position...', res.latitude, res.longitude)
        relaunch({ content: '位置修改成功，即将导航到首页', })
      }
    })
  }
  getMyPosition = () => {
    Taro.getLocation({
      type: 'gcj02',
      success: res => {
        this.setState({
          currentLatitude: res.latitude,
          currentLongitude: res.longitude
        })
        console.log('current position...', res.latitude, res.longitude)
      }
    })
  }
  openMyPosition = () => {
    Taro.getLocation({
      type: 'gcj02',
      success(res) {
        Taro.openLocation({
          latitude: res.latitude,
          longitude: res.longitude,
          scale: 18
        })
      }
    })
  }
  resetPosition = () => {
    Object.defineProperty(Taro, 'getLocation', {
      get() {
        return function(obj) {
          obj.success({ latitude: app.initialLocation.latitude, longitude: app.initialLocation.longitude })
        }
      }
    })
    Taro.showToast({ title: '还原成功！', icon: 'none' })
    this.getMyPosition()
  }
  convertPosition = () => {
    this.setState({
      showPopup: true,
    })
  }
  handleItemSelected = (e) => {
    const { type } = e.currentTarget.dataset.item
    const { latitude, longitude, } = Taro.getStorageSync('location')
    let obj: any = null
    if (type === 0) {
      obj = transformFromWGSToGCJ(latitude, longitude)
    } else if (type === 1) {
      obj = transformFromGCJToWGS(latitude, longitude)
    }
    Taro.setStorageSync('location', obj)
    console.log('transform result...', obj)
    Taro.showToast({ title: '转换成功！', icon: 'none' })
    this.setState({
      showPopup: !this.state.showPopup,
    })
  }

  render() {
    const { showPopup, transTypeList, } = this.state
    return (
      <View className="position-tools">
        <View className="tools-item">
          <Button className="item-title" openType="openSetting">
            快速授权
          </Button>
          <Image
            className="tools-img"
            src={require('../../assets/img/right-arrow.png')}
          ></Image>
        </View>
        <AtListItem title="查看我的位置" arrow="right" onClick={this.openMyPosition} />
        <AtListItem title="选择我的位置" arrow="right" onClick={this.choosePosition} />
        <AtListItem title="还原" arrow="right" onClick={this.resetPosition} />
        <AtListItem title="精准地址转换" arrow="right" onClick={this.convertPosition} />
        <AtActionSheet isOpened={showPopup} cancelText='取消' title='将根据您的当前位置进行精准地址转换'>
          {transTypeList.map((item: TransTypeItem) => (
            <View className="trans-item" key={item.type} data-item={item} onClick={this.handleItemSelected}>{item.name}</View>
          ))}
        </AtActionSheet>

      </View>
    )
  }
}

export default PositionSimulation as ComponentClass<PageOwnProps, PageState>
