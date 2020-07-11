import { ComponentClass } from 'react'
import Taro, { Component, } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { TtList, TtListItem, } from '@pandora/tarot'

import './AppInformation.scss'

import { SystemInfoItem, } from '../../types/DebugTypes'

import { transSystemInfo, transUserInfo, transAuthInfo } from '../../utils/util'

type PageStateProps = {
}

type PageDispatchProps = {
}

type PageOwnProps = {}

type PageState = {
  systemInfoList: Array<SystemInfoItem>,
  accountInfoList: Array<SystemInfoItem>,
  userInfoList: Array<SystemInfoItem>,
  authInfoList: Array<SystemInfoItem>
}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface AppInformation {
  props: IProps;
}

class AppInformation extends Component {
  state = {
    systemInfoList: [],
    accountInfoList: [],
    userInfoList: [],
    authInfoList: [],
  }

  componentDidMount() {
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
        <TtList>
          {systemInfoList.map((item: SystemInfoItem) => (
            <TtListItem 
              key={item.name}
              title={item.name}
              content={item.value + ''}
              titleWidth={400}
            />
          ))}
        </TtList>
        {accountInfoList.length > 0 && (
          <View className="info-header">账号信息</View>
        )}
        <TtList>
          {accountInfoList.map((item: SystemInfoItem) => (
            <TtListItem 
              key={item.name}
              title={item.name}
              content={item.value + ''}
            />
          ))}
        </TtList>
        {userInfoList.length > 0 && (
          <View className="info-header">用户信息</View>
        )}
        <TtList>
          {userInfoList.map((item: SystemInfoItem) => (
            item.type === 'img' ? (
              <View className="info-item">
                <Text className="title">{item.name}</Text>
                <Image className="img" src={item.value}></Image>
              </View>
            ) : (
              <TtListItem 
                key={item.name}
                title={item.name}
                content={item.value + ''}
              />
            )
          ))}
        </TtList>
        {authInfoList.length > 0 && (
          <View className="info-header">授权信息</View>
        )}
        <TtList>
          {authInfoList.map((item: SystemInfoItem) => (
            <TtListItem 
              key={item.name}
              title={item.name}
              content={item.value + ''}
              titleWidth={400}
            />
          ))}
        </TtList>
      </View>
    )
  }
}

export default AppInformation as ComponentClass<PageOwnProps, PageState>