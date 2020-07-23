import React, { Component } from 'react'
import Taro from '@tarojs/taro'
import { View, Image, CheckboxGroup, Checkbox, Text, Input, Button } from '@tarojs/components'
import { AtFloatLayout } from 'taro-ui'
import { AddrInfo, StorageModifyItem, } from '../../types/DebugTypes'

type Props = {
  onShowHomeMenu: () => void
  onHideHomeMenu: () => void
}

type State = {
  storage: Array<StorageModifyItem>
  limitSize: number
  currentSize: number
  isShowManage: boolean
  showPopup: boolean
  isShowMask: boolean
  isDeleteMode: boolean
  checkedStorage: Array<string>
  addInfo: AddrInfo
}

export default class Storage extends Component<Props, State> {
  constructor(props) {
    super(props)
    this.state = {
      storage: [],
      limitSize: 0,
      currentSize: 0,
      isShowManage: false,
      showPopup: false,
      isShowMask: false,
      isDeleteMode: false,
      checkedStorage: [],
      addInfo: {
        key: '',
        value: '',
        title: '新增Storage',
        disabled: false
      },
    }
  }
  componentDidMount() {
    this.handleResetData()
  }

  openDeleteMode = () => {
    this.setState({
      isDeleteMode: true
    })
    this.closeAll()
  }
  cancelDelete = () => {
    this.setState({
      isDeleteMode: false
    })
  }
  showAddPopup = () => {
    this.setState({
      isShowManage: false,
      showPopup: true,
      isShowMask: false,
      addInfo: {
        key: '',
        value: '',
        title: '新增Storage',
        disabled: false
      }
    })
    this.props.onHideHomeMenu && this.props.onHideHomeMenu()
  }
  getStorageInfo = () => {
    const storageArr: Array<any> = []
    const storageInfo = Taro.getStorageInfoSync()
    storageInfo.keys.forEach(key => {
      const result = Taro.getStorageSync(key)
      const info = {
        key,
        value: JSON.stringify(result),
        isModify: false,
        ischecked: false
      }
      storageArr.push(info)
    })
    this.setState({
      limitSize: storageInfo.limitSize,
      currentSize: storageInfo.currentSize,
      storage: storageArr
    })
  }
  closeAll = () => {
    this.setState({
      isShowManage: false,
      isShowMask: false,
      showPopup: false,
    })
    this.state.isDeleteMode && this.setState({ isDeleteMode: false })
    this.props.onShowHomeMenu && this.props.onShowHomeMenu()
  }
  openManageMenu = () => {
    this.setState({
      isShowManage: true,
      isShowMask: true
    })
    this.props.onHideHomeMenu && this.props.onHideHomeMenu()
  }
  clearStorage = () => {
    if (!this.state.checkedStorage.length) {
      return
    }
    Taro.showModal({
      title: '提示',
      content: '确定删除选中缓存？',
      success: res => {
        if (res.confirm) {
          this.state.checkedStorage.forEach(item => {
            Taro.removeStorageSync(item)
          })
          this.handleResetData()
        }
      }
    })
  }
  handleResetData = () => {
    this.setState({
      addInfo: {
        key: '',
        value: '',
        title: '新增Storage',
        disabled: false
      }
    })
    this.getStorageInfo()
  }
  clearAll = () => {
    this.setState({
      isShowManage: false
    })
    Taro.showModal({
      title: '提示',
      content: '确定要清除全部缓存吗？',
      success: res => {
        if (res.confirm) {
          Taro.clearStorageSync()
          this.handleResetData()
        }
        this.closeAll()
      }
    })
  }
  onCheckChanged = (event) => {
    this.setState({ checkedStorage: event.detail.value })
  }
  onModifyClicked = (event) => {
    this.setState({
      showPopup: true,
      addInfo: {
        key: event.currentTarget.dataset.key,
        value: event.currentTarget.dataset.value,
        title: '修改Storage',
        disabled: true
      }
    })
    this.props.onHideHomeMenu && this.props.onHideHomeMenu()
  }
  onKeyInput = (event) => {
    const addInfo = Object.assign({}, this.state.addInfo, { key: event.detail.value })
    this.setState({ addInfo })
  }
  onValueInput = (event) => {
    const addInfo = Object.assign({}, this.state.addInfo, { value: event.detail.value })
    this.setState({ addInfo })
  }
  addStorage = () => {
    if (this.state.addInfo.key && this.state.addInfo.value) {
      try {
        const parseVal = JSON.parse(this.state.addInfo.value)
        Taro.setStorageSync(this.state.addInfo.key, parseVal)
        this.handleResetData()
        this.closeAll()
      } catch(e) {
        Taro.showModal({
          title: '提示',
          content: '新增缓存失败，请检查输入内容',
          confirmText: '知道了',
          showCancel: false,
        })
      }
    }
  }

  render () {
    const {
      isShowMask,
      limitSize,
      currentSize,
      isShowManage,
      storage,
      isDeleteMode,
      showPopup,
      addInfo,
      checkedStorage
    } = this.state
    const deleteActive = checkedStorage.length > 0
    return (
      <View className="storage-container">
        {isShowMask && <View className="mask" onClick={this.closeAll}></View>}
        <View className="header">
          <View className="head-title">{`限制空间大小：${limitSize} KB`}</View>
          <View className="head-title">{`当前占用空间大小：${currentSize} KB`}</View>
          <View className="storage-manage" onClick={this.openManageMenu}>
            <Image src={'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAAH7+Yj7AAAAAXNSR0IArs4c6QAAAP1JREFUWAntVjEOwjAMdIAXVTwBxMhGZ3gYe5lgRPAE1B9BIBWqQmJVDnUDld0puV5y9tlpCoA8xmHFYmORdwSIvjxi1tdDgxFUXpSey2kibxlH7rIkLXKqND8v8gyTGCYZmdKYvxj20fddnYYt9rFhiucrcI015W8/sQDjqTJXt4xon7axuc7xZETJiwlVqyyh1FplCVXWHP/Ngfbc+YH1uU/9fVLH2N+W3smpLiqf2wH0kMxX5ZpbiLLf7VydQt4sBNz8cbdHDM+ARYahARowUSYZglMJmQ5ETelsKJbl/hd21JdqF+qihwSs3YbETHNagFMwETFTgCojz4En2+hHRf6aBAMAAAAASUVORK5CYII='}></Image>
          </View>
          {isShowManage && (
            <View className="operate-list">
              <View className="arrow"></View>
              <View className="operate-item" onClick={this.showAddPopup}>
                <Image src={'data:image/png;base64,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'}></Image>
                新增
              </View>
              <View className="operate-item" onClick={this.openDeleteMode}>
                <Image src={'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAAH7+Yj7AAAAAXNSR0IArs4c6QAAAcZJREFUWAntWL1ShDAQDswV2ltaUPgAzgD91epz+Dr29na251NA5SvYWdLYCO4iySzLkoQDzhvMNfv/5csmIZlTyvcXYWKapk0URV+oF0VxuUMFf03TXPxqSsWoQNaHdqwlDSU9QFmWUevUDpTIGSUwegPO96j3fjqh5yRGOx9iG0ReOEiEopeuUEuKs6aO3Di/5cajyNKsxZH+MNHsU0pcJLkdpzkIWZYd4HzeHTs1PFVi7ZRmSrnODcGLuM1ZOQF5gcteHHAwoGtKtGBKLq0Lur0D8u7uaqTTM3oi7OOcUdRMec6eGr1RcaJTgKXcxY+eFRBW+RVYXOkl4rb2U2kFhA/uTRzH17qA29pPpRWQJvrqAXDQqackSd6Jl9skNKJKm3UkVTwE5i1Ci3xBT/GspryCvtEOmAvgmPlJd6KAc4B78kHwB9dJOjBYYs9lW4vc9O2AX0XfL+MU1r64s+7P/X6/g4HMk4ITdMV5vmTPIlhVVQGgn3me30rgrrhUw32zCHKwNexAcG5XN9/Bb+xQXdetFLrligslfZf4IuynjFtwx6bjUaVccVutjp39Ejs7CO9m/P/reenbpHuPP+pOBflvO/ADTr+I+vy9Kb8AAAAASUVORK5CYII='}></Image>
                删除
              </View>
              <View className="operate-item" onClick={this.clearAll}>
                <Image src={'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAAH7+Yj7AAAAAXNSR0IArs4c6QAAA55JREFUWAntV89rE0EUbmKqkBD10L+gh+JJkaSmJ62K9qAiIlVERP0TBKGi/4CexLNgvSjUIiK1goKao7EN/sBzKb0qUmk8qGni98W8cXZ2Zmc3WwpCFh5v5r0333w77+3M7MCA7ymVSm1rjHKgseqKsDtC0QpLPCGD5piCc076HR0yBLxxO/qceluNFyP0lDKigX6QD50wqpe3BugIm9feYk41OTm5tVAoXBgZGfm8vLzcMv2dPoMqlcpudsrl8r7x8fFcKFAPEieDpZ1lg0ErKyu7ms3me3FQt9vteb3PaR6KAeu3zjb0F7EFNBwzYkDb/hJawIwTSYI2XYcS42LAFczn8x+QsLvOhGFwxgUgdgItLS39zOVye2q12ifmCmmoFYvFwWq12pQ40U5AE0gGiPYBS1ynOJCZNmQdEvjIVJDWYBYBfkQz/WsSSGpWrC5gAkFCX3HolRHEQpuo1+s7BZSawFDXIVchb+E/AR3/ITBE3zKsjEzEEEMzYHR09Gar1fKuJRh7sUzsfj/lCqB4bzNBPphYmUH5sIDHIIOQF8joWR+w008wiNpu0V6FqF3WOdDmwMA5iAKTGNiSg7rAegL1gemgSJY6kWjvnGcSQE0wqAOQIfajHmy6+7HZntNjAoBdsDFkcTuCLqFvv4fByW0OB+rH4eHhbTqganOTBEAgAehftIESjHbu6grA1mAQgNX5zhgT1AcWKGzeKtbW1n5nMpnK4uLiO5mUoGjf50Elrzk7O/tL/JGaoDamYH6Ddt9rBhjKTCZTPQE+ZlZAAgtoNpu9jB17mtn0gXGcE1BAG43GN9Rakf2IZx6ldjzC33f1V2DzViCyqpPS6N5QH2OcXuGPcNU9b7vqxsEP7NZxBthiSAy70Bzv4fCPcYvjTYxbIPoT3A7hn+HeYBsfZUu1gsaKfQWxw/xJMCfkAYC95SXsOyCJVrQngnGJbQTRRAR7JZaGaCyCBrE2ausOjtcr5sRJ+0bqD6Fu35gYkQQNYp0aw/m+FyD3IPzArgH0lgkap989kV8hdggv/HRhYeEUdOgKZSWIgs7gWv4E+iQArMWPr5KXksREdWIY/wyn/OmoU95KEJMfxODXkO94q6P6bQm2wBOXaFJiMomVIJ3d+8wDNM9AeibaKzFy4OMk+NedmugP4BQg3lTKfKb2EpQBcVc07YrJfKJjE5QBLqIbTUzmS0xQBhpExZxK44N8jg/yWCqQ/uD/bQX+ADuC+YmFyM4xAAAAAElFTkSuQmCC'}></Image>
                清除全部
              </View>
            </View>
          )}
        </View>
        <View className="storage-list-container">
          <View className="table-title">
            <View className="key-title">Key</View>
            <View className="value-title">Value</View>
          </View>
          <CheckboxGroup
            onChange={this.onCheckChanged}
            className="storage-list"
          >
            {storage.map((item: StorageModifyItem, index) => {
              return (
                <View 
                  className="storage-item" 
                  key={'_' + index}
                >
                  {isDeleteMode && (
                    <Checkbox
                      value={item.key}
                      checked={item.ischecked}
                    ></Checkbox>
                  )}
                  <Text
                    className={
                      'storage-key ' + (isDeleteMode ? '' : 'add-some-flex')
                    }
                  >
                    {item.key}
                  </Text>
                  <Text className="storage-value">
                    {item.value}
                  </Text>
                  <View
                    className="clear-single-btn"
                    data-key={item.key}
                    data-value={item.value}
                    onClick={this.onModifyClicked}
                  >
                    <Image src={'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAADsUlEQVRYR+2XT2gcVRzHv7+3G9OKfyo9GDKTnd1mJpUGCh7aKipWD6Ki4GEHPQhNb3pqC73oJSlUBW3trReh6kGEBhECRaFKgmJTqRZEjd2dSWZnd2f6F2ylNtjdfT+Z0AmzyezO7prgpXN97/c+3/d73/f7vSGs4+fqA9sI6XeY+BUAswCPa5Z/Ooqk9eIHcJA4CdAogY5I8HMEbAfhba3ovRdy10VAFA7BT2oF/4eKqm6UG/hjEF4N4JrlLbHXXEDTzoXYkSlUfopm2RlWnxeCvwL4M83yX19TAVG4SNH2oQvVX+OOuGSoHxD4IBO9uCRgKRDCjJssW2RJQJ7U7EtzYUwUXm9g6/CCV2zlL0tX1D7i30GYJMdQxgRwDMCmbgxJwCcZy9u7vIE7hmvUZXaLc9FNWqtsKNMM7CbXUKYIuL/BdCgpKDqes6szK+Eb6rWBh50rl5PWcXXFBCG4Ie8HAlgyH8rZ/kRS4MrxaNplre+hXKl0PWmNEM7AF5rlmT0LaDLcIt07VK0udgon8JdDlm8S0OhJQBSesbwUAbJTOICpm30PmqNzc7eX6kC3R9Ds9v5NwwsLN7qAnxKLZEaz1ZWAKLwmydDnq3ancCb++u90zRydu3qzqRd0moEmwzEez9ne2U7hAE7fxxvzm237r5UxHWWgqbyS2JkpVs51Af8W/6RMrVz+My4mUUBzVxNPZ6zKd53CCZhZJDa3Fv1rrWKSBRjKFICXGXgpa3mnOoUD9H2/rOUH5i9faRfTVkBlWNWlYIsJB7NF72gSvDwy+BozfQ7CGU6l89k/3ItBjKOru8PK2ZUHXF3JBw2DJZ7NznvT7QQ4xuBeATrBwI9pRl61vWoIF8TTrapt2wyUDeUwAwfqjf7Bdve9rCtvMuE4AefqdWlGm1Gw+54FuIbyDYB+zfKearX7sq4cYMKHAM6zSOezBdeJzv2vAm4B/JFm+fviBLgjyltgvMvALylJ+aGYwtSzgJI++CgRnQdhTCt6n4YCqo8om1nSzrqUuwTROIDfGoLzWwp+IU5kzwIcXdkvCMck0zNpQGHgMSbeBWDHMogwCdmYiL6MVoroWcDylWpecZYJZ0liNgXMhk5vezvumBDME5rtr3r0tL0FpRH1BYC3saSfb93zwJmwhSbVgzgT9iSgG1CrueER3BXwv2egZSl2RtQJwTweTBAAt/oRCc44aTy23xO9ETw+ZarxRO7CpdKqZhSYJEW8h4GxtTDdKgAwA+bJjO0fj1v/X9xrmTHmOatYAAAAAElFTkSuQmCC'}></Image>
                  </View>
                </View>
              )
            })}
          </CheckboxGroup>
        </View>
        <AtFloatLayout 
          onClose={this.closeAll} 
          title={addInfo.title}
          isOpened={showPopup}
        >
          <View className="add-input-container">
            <View className={addInfo.disabled ? 'disabled' : ''}>
              {'键名：Key' + (addInfo.disabled ? '（不可修改）' : '')}
            </View>
            <Input
              value={addInfo.key}
              onInput={this.onKeyInput}
              disabled={addInfo.disabled}
              className={'add-input ' + (addInfo.disabled ? 'disabled' : '')}
              onConfirm={this.addStorage}
            ></Input>
          </View>
          <View className="add-input-container">
            <View className="name">键值：Value</View>
            <Input
              value={addInfo.value}
              onInput={this.onValueInput}
              className="add-input"
              onConfirm={this.addStorage}
            ></Input>
          </View>
        </AtFloatLayout>
        {isDeleteMode && (
          <View className="storage-footer">
            <Button className="operate-btn" onClick={this.cancelDelete}>
              取消
            </Button>
            <Button
              className={
                'operate-btn-delete ' +
                (deleteActive ? 'delete-active' : '')
              }
              onClick={this.clearStorage}
            >
              删除
            </Button>
          </View>
        )}
      </View>
    )
  }
}
