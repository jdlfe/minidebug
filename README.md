
# MiniDebug

MiniDebug是一款旨在提高多端小程序开发、测试效率的工具库。

## 特性

- 基于[Taro框架](https://taro.aotu.io/home/in.html)开发，支持多端。
- 基于[Taro UI组件库](https://taro-ui.aotu.io/#/)实现，界面美观。
- 功能丰富，满足多样化开发、调试需求。
- 本身是组件，引入简单，代码侵入性小。

## 架构图

### 1. MiniDebug架构图

miniDebug工具基于[Taro框架](https://taro.aotu.io/home/in.html)开发，可编译成多端小程序应用。利用原生能力支持，通过暴露API，以及修改全局state、storage数据实现和业务层的数据交互。      

<img src="https://m.360buyimg.com/marketingminiapp/jfs/t1/114857/22/13369/136735/5f1a3fa7Eec35395f/b41cab06d83545d9.png" />

### 2. 宿主工程引入MiniDebug架构图

宿主工程通过npm引入miniDebug工具，通过判断环境ENV，在编译阶段实现miniDebug承载页的动态注册。

<img src="https://m.360buyimg.com/marketingminiapp/jfs/t1/132507/11/5322/176233/5f1a3fb6Eb7828fc1/34c2074726c463ed.png" />

## 功能介绍

主要功能包括环境切换、身份Mock、应用信息获取、位置模拟、缓存管理、扫一扫、H5跳转、更新版本等。工具首页如图所示。

<img src="https://m.360buyimg.com/marketingminiapp/jfs/t1/132205/16/5308/23857/5f1a3fcaEb68e91a9/1d27304db2daf1e8.png" />

### 1. 环境切换

让小程序在测试、预发、正式环境中随意切换。支持热加载，无需手动重启应用。

<img src="https://m.360buyimg.com/marketingminiapp/jfs/t1/134788/18/5289/25074/5f1a3fddEeb6247d4/568a51ca6a9c85d7.png" />

### 2. 身份Mock

动态切换登录账号（仅支持测试环境，预发、正式环境不建议明文传输用户身份）。

<img src="https://m.360buyimg.com/marketingminiapp/jfs/t1/122610/16/7885/10243/5f1a3ff3E18a25657/4e4f8363d36ff772.png" />

### 3. 应用信息获取

一键查看系统、账号、用户、授权信息，快速定位测试、UAT问题。

<img src="https://m.360buyimg.com/marketingminiapp/jfs/t1/139116/34/3663/25002/5f1a4003E1027103f/eebc9936c67ac604.png" />

### 4. 位置模拟

功能包括
- 快速授权，小程序授权入口很深，该功能可一键快速进行权限授权。
- 查看位置，在地图上快速确定自己的位置。
- 选择位置，代理小程序getLocation方法，无需修改代码即可任意切换当前位置。
- 还原，一键还原用户位置。
- 地址转换，支持wgs84和gcj02坐标系互转。

<img src="https://m.360buyimg.com/marketingminiapp/jfs/t1/112723/13/13206/14070/5f1a4016E7c07d410/7a4a0866c91fee15.png" />

### 5. 缓存管理

支持storage信息的查看、新增、删除、修改。

<img src="https://m.360buyimg.com/marketingminiapp/jfs/t1/134334/39/5114/18174/5f1a4028Eb60989dd/ce97ffdeb34cdffa.png" />

### 6. 扫一扫

主要用于扫描小程序码、二维码场景。微信原生扫一扫扫码会直接跳转线上版本，该功能可以跳转至相应开发、体验版本，提高测试效率，降低上线风险。

### 7. H5跳转

主要用于在App环境打开H5场景。如测试H5在微信环境某些特殊逻辑。

<img src="https://m.360buyimg.com/marketingminiapp/jfs/t1/125372/9/7758/13332/5f1a4037E05924831/3f772377690e2c46.png" />

### 8. 更新版本

更新小程序版本。

## 快速上手

miniDebug工具基于[Taro框架](https://taro.aotu.io/home/in.html)和[Taro UI组件库](https://taro-ui.aotu.io/#/)开发，下面详细介绍引入步骤。

### 安装npm包

如果您的taro版本为1.x、2.x，请按如下方式安装

```bash
npm install @jdlfe/minidebug --save-dev
```

如果您的taro版本为3.x，请按如下方式安装

```bash
npm install @jdlfe/minidebug-next --save-dev
```

### 新建空页面

推荐在空目录下创建页面，该页面用于引入miniDebug组件

![avatar](https://m.360buyimg.com/marketingminiapp/jfs/t1/138948/20/3649/5434/5f1a3ee5E70d7fa1d/6cd409231879147c.png)

### 动态注册miniDebug承载页

taro1.x、2.x版本：
修改App下的config对象里的pages属性，利用[Taro的preval](http://taro-docs-in.jd.com/taro/docs/envs.html)。如下所示，判断process.env.NODE_ENV，在非生产环境时才将miniDebug承载页注册，保证生产环境打包不包含miniDebug内容。

```javascript
class App extends Taro.Component {
  config = {
    pages: preval`
      module.exports=(function() {
        const path = [
          'pages/module/pageA',
          'pages/module/pageB',
          'pages/module/pageC'
        ]
        if (process.env.NODE_ENV !== 'production') {
          path.push('packageD/debug/index') 
        }
        return path
      })()
    `,
```

taro3.x版本：
在app.config.ts中注册miniDebug承载页

```javascript
// 获取页面路径
const getPages = () => {
  const path = [
    'pages/module/pageA',
    'pages/module/pageB',
    'pages/module/pageC'
  ]
  // 非生产环境注册debug承载页
  if (process.env.NODE_ENV !== 'production') {
    path.push('packageD/debug/index')
  }
  return path
}
export default {
  pages: getPages(),
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  }
}
```

### 引入miniDebug组件

只需将miniDebug作为普通Taro组件引入。taro1.x、2.x版本：

```javascript
import { Debug } from '@jdlfe/minidebug'
```
taro 3.x版本：

```javascript
import { Debug } from '@jdlfe/minidebug-next'
```

引入组件依赖的样式文件。taro1.x、2.x版本：

```scss
@import '~@jdlfe/minidebug/src/app.scss'
```

taro 3.x版本：

```scss
@import "~@jdlfe/minidebug-next/dist/style/index.scss";
```

### 修改render函数

```javascript
render() {
  return (
    <View className="debug-container">
      {/* 将miniDebug当做普通组件引入 */}
      <Debug />
    </View>
  )
}
```

### 首页新增miniDebug入口

该方法需在render函数中调用

```javascript
renderDebug() {
  // 只有测试、预发环境，才会展示miniDebug入口
  if (process.env.NODE_ENV === 'production') return false
  return (
    <View className="debug" onClick={this.goMinDebug}>
      debug
    </View>
  )
}
```

### 跳转miniDebug方法

```javascript
goMiniDebug() {
  Taro.navigateTo({
    url: `/packageD/debug/index`
  })
}
```

### 切换环境功能引入

因不同项目测试、预发、正式环境变量不同，因此，通过miniDebug切换完环境后，首先会将设置的环境变量保存到storage中，然后会暴露一个全局状态，在应用首页检测到该状态值时，需要您自行实现环境变量切换的方法。

```javascript
// 此段代码通常在小程序入口文件，onLoad第一行
// Taro.getApp().needResetHttp为true，代表用户通过miniDebug修改了环境变量
if (Taro.getApp().needResetHttp) {
  // 将标识重置
  Taro.getApp().needResetHttp = false
  // resetHttp即为更改环境变量的方法，需要自行实现
  resetHttp()
}
// 参考实现
const ROOT_PATH = {
  development: 'https://test.test.com',
  prepare: 'https://uat.test.com',
  production: 'https://prod.test.com',
}
resetHttp() {
  try {
    // 先获取miniDebug中修改的env环境变量，有效取值为"development"、"prepare"、"production"
    const env = Taro.getStorageSync('env') || "production"
    // 根据miniDebug设置的env，更改网络请求URL
    // 你的项目可能识别的设置方式，目的是更改网络请求的base URL
    Taro.getApp().globalData.Http.config.root = ROOT_PATH[env]
  } catch (e) {}
}
```
