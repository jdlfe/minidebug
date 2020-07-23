import React, { Component } from 'react'
import Taro from '@tarojs/taro'
import { AtList, AtListItem } from 'taro-ui'
import { View, Text, Image } from '@tarojs/components'
import { SystemInfoItem, } from '../../types/DebugTypes'
import { transSystemInfo, transUserInfo, transAuthInfo } from '../../utils/util'

type Props = {}

type State = {
  systemInfoList: Array<SystemInfoItem>
  accountInfoList: Array<SystemInfoItem>
  userInfoList: Array<SystemInfoItem>
  authInfoList: Array<SystemInfoItem>
}

export default class AppInformation extends Component<Props, State> {
  constructor(props) {
    super(props)
    this.state = {
      systemInfoList: [],
      accountInfoList: [],
      userInfoList: [],
      authInfoList: [],
    }
  }
  componentDidMount () {
    this.getSystemInfo()
    this.getAccountInfo()
    this.getUserInfo()
    this.getAuthInfo()
  }
  getSystemInfo = () => {
    Taro.getSystemInfo({
      success: res => {
        this.setState({
          systemInfoList: transSystemInfo(res)
        })
      }
    })
  }
  getAccountInfo = () => {
    this.setState({
      accountInfoList: [{
        name: '小程序APPID',
        value: Taro.getAccountInfoSync().miniProgram.appId
      }]
    })
  }
  getUserInfo = () => {
    Taro.getUserInfo({
      success: res => {
        this.setState({
          userInfoList: transUserInfo(res.userInfo)
        })
      }
    })
  }
  getAuthInfo = () => {
    Taro.getSetting({
      success: res => {
        this.setState({
          authInfoList: transAuthInfo(res.authSetting)
        })
      }
    })
  }

  render () {
    const { systemInfoList, accountInfoList, userInfoList, authInfoList } = this.state
    return (
      <View className="info-container">
        {systemInfoList.length > 0 && (
          <View className="info-header">系统信息</View>
        )}
        <AtList>
          {systemInfoList.map((item: SystemInfoItem) => (
            <AtListItem 
              key={item.name}
              title={item.name}
              note={item.value + ''}
            />
          ))}
        </AtList>
        {accountInfoList.length > 0 && (
          <View className="info-header">账号信息</View>
        )}
        <AtList>
          {accountInfoList.map((item: SystemInfoItem) => (
            <AtListItem 
              key={item.name}
              title={item.name}
              note={item.value + ''}
            />
          ))}
        </AtList>
        {userInfoList.length > 0 && (
          <View className="info-header">用户信息</View>
        )}
        <AtList>
          {userInfoList.map((item: SystemInfoItem, index: number) => (
            item.type === 'img' ? (
              <View className="info-item" key={`_${index}`}>
                <Text className="title">{item.name}</Text>
                <Image className="img" src={`${item.value}`}></Image>
              </View>
            ) : (
              <AtListItem 
                key={item.name}
                title={item.name}
                note={item.value + ''}
              />
            )
          ))}
        </AtList>
        {authInfoList.length > 0 && (
          <View className="info-header">授权信息</View>
        )}
        <AtList>
          {authInfoList.map((item: SystemInfoItem) => (
            <AtListItem 
              key={item.name}
              title={item.name}
              note={item.value + ''}
            />
          ))}
        </AtList>
      </View>
    )
  }
}
