import React, { Component } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Input, Button } from '@tarojs/components'
import { relaunch } from '../../utils/util'

const app = Taro.getApp()

type Props = {}

type State = {
  userPin: string
  inputPin: string
}

export default class ChangePin extends Component<Props, State> {
  constructor(props) {
    super(props)
    this.state = {
      userPin: app.globalData.userPin,
      inputPin: '',
    }
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
