import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components'

import { Debug } from '../../components/index'
import './index.scss'

type PageStateProps = {}

type PageDispatchProps = {}

type PageOwnProps = {}

type PageState = {}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface Index {
  props: IProps;
}

class Index extends Component {

    config: Config = {
      navigationBarTitleText: 'MiniDebug 工具'
    }
  render () {
    return (
      <View className='container'>
        <Debug />
      </View>
    )
  }
}

export default Index as ComponentClass<PageOwnProps, PageState>
