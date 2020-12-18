import { ComponentClass } from 'react'
import Taro, { Component, } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { AtList, AtListItem, } from 'taro-ui'

import { SystemInfoItem, } from '../../types/DebugTypes'
import { transSystemInfo, transUserInfo, transAuthInfo } from '../../utils/util'

import './appInformation.scss'

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
    Taro.setNavigationBarTitle({
      title: '应用信息'
    })
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
          {userInfoList.map((item: SystemInfoItem) => (
            item.type === 'img' ? (
              <View className="info-item">
                <Text className="title">{item.name}</Text>
                <Image className="img" src={item.value}></Image>
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

export default AppInformation as ComponentClass<PageOwnProps, PageState>
