import {
  View,
  Image,
  CheckboxGroup,
  Checkbox,
  Text,
  Input,
  Button
} from '@tarojs/components'
import Taro, { Component, } from '@tarojs/taro'
import { ComponentClass } from 'react'
import { AtFloatLayout, } from 'taro-ui'

import { AddrInfo, StorageModifyItem, } from '../../types/DebugTypes'
import './storage.scss'

type PageStateProps = {
}

type PageDispatchProps = {
}

type PageOwnProps = {
  onShowHomeMenu: () => void
  onHideHomeMenu: () => void
}

type PageState = {
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

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface Storage {
  props: IProps;
}

class Storage extends Component {
  state = {
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
  clearStorage = (event) => {
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

  render() {
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
            <Image src={require('../../assets/img/more-icon.png')}></Image>
          </View>
          {isShowManage && (
            <View className="operate-list">
              <View className="arrow"></View>
              <View className="operate-item" onClick={this.showAddPopup}>
                <Image src={require('../../assets/img/storage-add.png')}></Image>
                新增
              </View>
              <View className="operate-item" onClick={this.openDeleteMode}>
                <Image src={require('../../assets/img/storage-delete.png')}></Image>
                删除
              </View>
              <View className="operate-item" onClick={this.clearAll}>
                <Image src={require('../../assets/img/storage-clear.png')}></Image>
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
                    <Image src={require('../../assets/img/storage-modify.png')}></Image>
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

export default Storage as ComponentClass<PageOwnProps, PageState>