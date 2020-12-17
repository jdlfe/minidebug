import { ComponentClass } from 'react'
import Taro, { Component, } from '@tarojs/taro'
import { 
  View,
  Textarea,
  Image,
  Button,
  WebView 
} from '@tarojs/components'

import './h5door.scss'

type PageStateProps = {
}

type PageDispatchProps = {
}

type PageOwnProps = {}

type PageState = {
  jumpUrl: string
  urlList: Array<string>
  showWebview: boolean
}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface H5door {
  props: IProps;
}

class H5door extends Component {
  state = {
    jumpUrl: '',
    urlList: [],
    showWebview: false,
  }
  componentDidMount() {
    this.getUrlList()
  }
  getUrlList = () => {
    let urlArr = []
    let storageUrl = Taro.getStorageSync('debug-url')
    if (storageUrl) {
      urlArr = urlArr.concat(storageUrl.split(','))
    }
    this.setState({
      urlList: urlArr
    })
  }
  setJumpUrl = (e) => {
    this.setState({
      jumpUrl: e.target.dataset.url
    })
  }
  scanCode = () => {
    Taro.scanCode({
      success: res => {
        this.setState({ 
          jumpUrl: res.result, 
        }, () => {
          this.jump()
        })
      }
    })
  }
  onUrlInputChange = (event) => {
    this.setState({
      jumpUrl: event.detail.value
    })
  }
  clearHistory = () => {
    Taro.clearStorageSync()
    this.getUrlList()
  }
  storageUrl = () => {
    const { jumpUrl, urlList, } = this.state
    if (urlList.indexOf(jumpUrl) === -1) {
      const newHistoryList = [...urlList, jumpUrl]
      this.setState({
        urlList: newHistoryList,
      })
      Taro.setStorage({
        key: 'debug-url',
        data: newHistoryList.join(',')
      })
    }
  }
  jump = () => {
    if (!this.state.jumpUrl) {
      Taro.showToast({ title: '请输入跳转链接' })
      return
    }
    this.storageUrl()
    this.setState({ showWebview: true })
  }

  render() {
    const { jumpUrl, urlList, showWebview } = this.state
    return (
      <View className="container">
        <View className="input-box">
          <Textarea
            className="url-area"
            value={jumpUrl}
            placeholder="请输入跳转链接"
            maxlength={200}
            onInput={this.onUrlInputChange}
          ></Textarea>
          <View className="scan" onClick={this.scanCode}>
            <Image
              src={require('../../assets/img/scan.png')}
            ></Image>
          </View>
        </View>
        {urlList.length > 0 && (
          <View className="history-list">
            <View className="history-content">
              {urlList.map((item) => {
                return (
                  <View
                    className="history-item"
                    data-url={item}
                    onClick={this.setJumpUrl}
                    key="key"
                  >
                    <Image
                      className="search"
                      src={require('../../assets/img/search.png')}
                    ></Image>
                    {item}
                  </View>
                )
              })}
            </View>
            <View className="clear" onClick={this.clearHistory}>
              清空搜索历史
            </View>
          </View>
        )}
        <Button
          className="jump-btn"
          onClick={this.jump}
        >
          点击跳转
        </Button>
        {showWebview && <WebView src={jumpUrl}></WebView>}
      </View>
    )
  }
}

export default H5door as ComponentClass<PageOwnProps, PageState>