import { ComponentClass } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View, Text, Input, Button, } from '@tarojs/components'

import { relaunch } from '../../utils/util'
import './changePin.scss'

const app = Taro.getApp()

type PageStateProps = {
}

type PageDispatchProps = {
}

type PageOwnProps = {}

type PageState = {
  userPin: string
  inputPin: string
}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface ChangePin {
  props: IProps;
}

class ChangePin extends Component {
  state = {
    userPin: app.globalData.userPin,
    inputPin: ''
  }

  handleInput = (e) => {
    this.setState({
      inputPin: e.detail.value
    })
  }

  handleConfirm = () => {
    app.globalData.userPin = this.state.inputPin
    relaunch({ content: '修改成功，应用即将重启', })
  }

  render () {
    const { userPin, inputPin, } = this.state
    return (
      <View className="pin-container">
        <View className="appinfo-item">
          <Text>当前用户pin：</Text>
          <Text className='item-value'>{userPin}</Text>
        </View>
        <Input className="appinfo-input" onInput={this.handleInput} placeholder="请输入要修改的pin" value={inputPin} />
        <Button className="confirm-button" onClick={this.handleConfirm}>确认修改</Button>
      </View>
    )
  }
}

export default ChangePin as ComponentClass<PageOwnProps, PageState>
