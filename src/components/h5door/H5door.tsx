import React, { Component } from 'react'
import Taro from '@tarojs/taro'
import { View, Textarea, Image, Button, WebView } from '@tarojs/components'

type Props = {}

type State = {
  jumpUrl: string
  urlList: Array<string>
  showWebview: boolean
}

export default class H5door extends Component<Props, State> {
  constructor(props) {
    super(props)
    this.state = {
      jumpUrl: '',
      urlList: [],
      showWebview: false,
    }
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

  render () {
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
              src={'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAACeklEQVR4Xu1avW4TQRD+5iLxAhEUPss/Sc5KATyDKZFAQkKR0vEARIKeBiR6CiQqWiQkgkRJl1DkCRCNL7HPln0NVWpyHnRGliIn3J52vLIvO27P3/x8O7s7OzMEz3/kuf9QAjQCPGdAt4DnAaCHoHELDHbqXQp4D4w9Am6XjJiEgY/MdNI+HR+XxFz7N9f6jQQkUfiKgLc2TjDhQ6s3eW6DnWNc6zcSMIzCAYCWjRMM/G7Fkzs22DnGtf4yBLCtA0T8vdFLH9ric9woCt8x8NJWRjOeFProjAAGvjLxYbuXfrY1PscNOrUnG0wvGOjayHFCwJTpQZExAQWjZjzq2xj8P8zZVv1eEGCzWC8fLX53RoD0dF8mObNI2al3A1ICNAJ0CywwoGeAi2swvwX0EBTm+FW6Ba6kwhcZ3d/uj38u2wmJvGHU2AKys8syyqTixkxw8TFCwHEjnhQmQhJHJNgkCg8JeDqXUeYxZiTg8nM0AD5lxD/avfSbxFBX2EGntr8BPGOm3bLPcSMBroxdF7lKwLqsxKrs0AhYFfProlccAePdcPNPhscB8IhQ/F5fotPJlOhLdnHrZLvfP5fIFROQdGoHxPReYoQtdsr8pn2avrbF5zgxAaMoPLItV0kM/4flX804vSuRowRI2Mux3m8B7w9BaQStGi8+A1btgFS/EiBlsOp4jQDTCnpfEPG+JHZdf96rougwCq/MB2hfQBsj2hnS1pj2Bj3qDeotsJgtej8kZUqfZ9W6mzwmV4aAWcX1hgxK+j0q63pY2RRNrvUb6wGux9VNBLjWbyTAZGDVvysBVV9Bqf0aAVIGq47XCKj6Ckrt9z4C/gJewepQC8kD2gAAAABJRU5ErkJggg=='}
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
                      src={'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAAH7+Yj7AAAAAXNSR0IArs4c6QAABQBJREFUWAntmE1oXUUUx99HQhKSusii0FA/QhdmnbyVWNCllVZBQQQX1qZdFopQpSJSagtKRQx2Yz/sQpCCgrXoVkVxlWRrXEi0SSMGkoVNiCG8xN9/nDPMvW/u+2geQqEPbs7MOf/5z5k5Z86dm1Kp6Dc9Pb0j29zc3J4kBsCvztASYVRJmqAMqNAIplKpUi6X37D+zMzMHWuXdnZ2Koz4zhRla0iC/AvAXrXFMDEx8b7a4SdA6EQNGCfFHFQpp8wYT+90AovBAHKYp2797suw6vn5+f6VlZUNm6JWqwWb6bQt53luBgWN5AKTyhzY7VFPT8/jMVuq7YDb29sHUsZYZ8BvY2Wq7YDEVAngklUgwlb1/aupQVrpRVZ/F/mkALSv8pxJgv83ZUOUcOk8a3FukbuXqtXqVG9v79Lm5uZBdvETPNsv77R+7GH9DR4rJbQhEGYi3gBEoZwXlud2yu50nuzjQkDC4EkvxiYXPlP09/e/ae0O5IkYmyHc2Nj4JTY2aytnvP1QIc4vAWxUFxJocFPCzs7OvpA3N0RZAMDa7IfzYOtXKpUXifgz9I8R6WtE/JjZdi2V+Tjw9K6J7l+CZFDYl9NE+r38sgjA8vDw8KOjo6P/5G3Wz+QhJGWlgydbJJqHBgYG9qhk6lyj36uKrfNuBHmZ8VBkAgwNDT00NjZ2Nw9WX2cd4iNMcIF0eSuFcTrlnvcu43VqgEiFVUHJ291gZpRUIh9n5u08KN/Hs+ekW11d/SNvc4TM6N7XvMWu5AFFfdvTvN2WdzhvaNVX4U1hHCGzjaSMzXSq4im7I2QPp1PGZjq9ElJ2W/LbMkJsNS6Fzej8+yWjU8cREoyf1KG+3ZZs9fP3w/1sVbjC2RjzsKQah4cj5NdHZkxJpdja2trfspE+2dscukA4Pj7+JTPeQHeSNLqTWj6TTWKri0w/MJmTJl2DQmWd/flCxoLfAlv0iE6K7HiZeT83EBoJA3QfOYfXNTxRitxi8Gn67iTJO7x17eS1zog6kZ70+07GPMC23IHCIBeNJA4VgvsE9ud5JnhGCLyrLT4ZlBAzPF+RFD9bUtC/p19bDvpU/5AZVNPv5bfAwT6ls9jp4EIHlbE49jnyJSNlN5bov8POfEo7HGizxxJclZ0+Cu4s7VC96d/A0ZeRxXfpiCjpYKI4TOHUKUhbvg0j7tDEQaWFInDSlCqV7exog4MQhSsNDi0NDg5yf0hfIGyydqWK/Pr6+pztKPyNX9s5soyDvvr96DGL7NpjkDQNZY6vZdeH/neA7tMJedDeZqnB4WXijecMRAhOdNs5cYtT3DYPMswZ6UIz4yCDa2bp6+uznTRV12TMHc+ZmiDjINsf7j1bW1vh5KUG7kYXc8dzpjgzDgK4ZaB6vR5OnOm6JWNudvDrZryZQ8JqKpSYP5Huf1oMPE4Ct303bjaR2XQpon1ZfZxbptTsQxaWr8wOCqivI8YuiIDfZcqOvkUyuP9Mnf0Vh7jE6UcuaK5mzgmX2UE/0AnIwn9YHJBQUBNf6bQm+tr3GQ4eifivE5mjUb+wWeigRkCq1927yDM5hkVWfpPnG0rGb/ZRoeTnenoA/LM8+r6yWmfDr9N41TqMv0aIJ5GFr72mDhqRpL4M+ZjTwXmdyS1HY0hDm4mXUX5AKKdG/Uc1Y7XoK8jXbEAzR9t20Mi6JfOO4uQPvLme6hb/A577Zgf+BfzFgTvq0N4iAAAAAElFTkSuQmCC'}
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
