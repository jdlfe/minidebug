import { ComponentClass } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'

import './PerformanceMonitor.scss'

const app = Taro.getApp()

type PageStateProps = {}

type PageDispatchProps = {}

type PageOwnProps = {}

type PageState = {
  entryData: Array<any> | null
}
let initEntryData = []
type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface PerformanceMonitor {
  props: IProps
}

class PerformanceMonitor extends Component {
  state = {
    entryData: null
  }
  constructor(props) {
    super(props)
    const performance = wx.getPerformance()
    const observer = performance.createObserver(entryList => {
      console.log(entryList.getEntries())
      initEntryData = entryList.getEntries()
      this.setState({
        entryData: entryList.getEntries()
      })
    })
    observer.observe({ entryTypes: ['navigation', 'render', 'script'] })
  }

  render() {
    const { entryData } = this.state
    return (
      <View className="container">
        <Text className="title">性能指标分析：</Text>
        {(entryData || initEntryData).map((item) => {
          return (
            <View className="list" key={item.name}>
              <Text className="name">{item.entryType === 'navigation' ? '小程序启动耗时' : item.entryType === 'script' ? '注入脚本耗时' : '页面首次渲染耗时'}: </Text>
              <Text className="text">{item.duration} ms</Text>
            </View>
          )
        })}
      </View>
    )
  }
}

export default PerformanceMonitor as ComponentClass<PageOwnProps, PageState>
