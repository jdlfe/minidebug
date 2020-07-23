import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components'

import './index.scss'
import Debug from '../../components/debug/Debug'

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
      navigationBarTitleText: '首页'
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
