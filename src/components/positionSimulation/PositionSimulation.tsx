import React, { Component } from 'react'
import Taro from '@tarojs/taro'
import { View, Image, Button } from '@tarojs/components'
import { AtActionSheet, AtListItem } from 'taro-ui'
import { relaunch, transformFromWGSToGCJ, transformFromGCJToWGS, } from '../../utils/util'
import { TransTypeItem } from '../../types/DebugTypes'
import { CONVERT_LIST } from '../../utils/consants'

const app = Taro.getApp()

type Props = {}

type State = {
  currentLatitude: number
  currentLongitude: number
  showPopup: boolean
  transTypeList: Array<TransTypeItem>
}

export default class PositionSimulation extends Component<Props, State> {
  constructor(props) {
    super(props)
    this.state = {
      currentLatitude: 0,
      currentLongitude: 0,
      showPopup: false,
      transTypeList: CONVERT_LIST
    }
  }
  componentDidMount() {
    this.getMyPosition()
  }

  choosePosition = () => {
    Taro.chooseLocation({
      success: res => {
        this.setState({ 
          currentLatitude: Number(res.latitude), 
          currentLongitude: Number(res.longitude) 
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
          obj.success({
            latitude: app.globalData.initialLocation.latitude,
            longitude: app.globalData.initialLocation.longitude
          })
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

  render () {
    const { showPopup, transTypeList, } = this.state
    return (
      <View className="position-tools">
        <View className="tools-item">
          <Button className="item-title" openType="openSetting">
            快速授权
          </Button>
          <Image
            className="tools-img"
            src={'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAbCAYAAAECMz80AAAAAXNSR0IArs4c6QAAAolJREFUOBGFlDuIE1EUhjOTiWvALpguSMAuQsijU7s0CqIoCBY+sBEUFAUXBVcUH7CixbKVWCiIK4harAiLzWIjFnlUsYkSMIKQGDCFxEec+J0hZ/bO7GwcmJxz/se55947u7GY+VSr1bE9AZZitVrtlcmGcsSvY/V6/aSPi90vzEQIRwBaLhM+lkolS4pbpspbGfClCYpqFn9dQEsZwFPj8fia1rHA0hsXooe9KwreB74/KkEwNxGumrw/hYKIzpIv8H4ql8vb1wlEyMgPGfmEZVnvvLMQUB6I5xCHSB/jXjNDrEzWv+Qpwz+NRmN/GPNrbuaKX0Qktuu6N6Q9j955QOYNIgJBk8nkTC6X+20qPJdOPBwOfzWbzS2mYG0roNqJdCumbyIMrKudwHsMv00EgQ4CyMO5uAxtOY6zI9BBSNmNkJKPRqMvgQ4QcdwjIVOpVDKbzf70BQyYAPe2yPfpcFF/RegtwdY2KSmDKukJ2u32Ztm/FMYupPQep9/vD3G4tI0rGIjc5N4AECospr7I9HcEp9NCsVg8T4z+cwuZPY/80GSeJrMGv8RIx2nkHYmBr0v9YxKG67nO53NVVTRYSafTBzOZzFCxcAw0UJIzv0x+W2savbdte0+hUPiumMbIBkoy0QUmuqc1jT6w1QrX8dXHNJkWOaMz8IuYdcHP8Xi8wkQtBab5PU7MTPSWuNsQv/lvAww2xkfEo4ZxNZFI7Mvn8z82bIDBwfiEeFiNnMEL6iOcwR8f00Tj5Kt/Rn1AMYz3+cBOE13FNPoTtFqtmcFgIP+szU/3JqvNqTgqWp1OJ9ntdpcZrSICVhnznmPFxShDGHN6vd5OzLsgRnwsxzA+DYum1f8AEL05UAjJXgsAAAAASUVORK5CYII='}
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
