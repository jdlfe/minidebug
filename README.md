
# MiniDebug

MiniDebug是一款旨在提高多端小程序开发、测试效率的工具库。主要包括环境切换、身份Mock、位置模拟、缓存管理、H5跳转等功能。

<!-- ![avatar](https://github.com/jeffreyzhang23/jeffreyzhang23.github.io/blob/master/images/debug-home.png) -->
<img style="border:1px solid #000000; width: 300px;" src="https://github.com/jeffreyzhang23/jeffreyzhang23.github.io/blob/master/images/debug-home.png" />

## 快速上手

miniDebug工具基于[Taro框架](https://taro.aotu.io/home/in.html)和[Taro UI组件库](https://taro-ui.aotu.io/#/)开发，下面详细介绍引入步骤。

### 安装npm包

如果您的taro版本为1.x、2.x，请按如下方式安装

```bash
npm install @jdwlfe/minidebug --save-dev
```

如果您的taro版本为3.x，请按如下方式安装

```bash
npm install @jdwlfe/minidebug-next --save-dev
```

### 新建空页面

推荐在空目录下创建页面，该页面用于引入miniDebug组件

![avatar](https://github.com/jeffreyzhang23/jeffreyzhang23.github.io/blob/master/images/package.png)

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
import { Debug } from '@jdwlfe/minidebug'
```
taro 3.x版本：

```javascript
import { Debug } from '@jdwlfe/minidebug-next'
```

引入组件依赖的样式文件。taro1.x、2.x版本：

```scss
@import '~@jdwlfe/minidebug/src/app.scss'
```

taro 3.x版本：

```scss
@import "~@jdwlfe/minidebug-next/dist/style/index.scss";
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
    // 根据miniDebug设置的env，更改网络请求物流网关URL
    // 你的项目可能识别的设置方式，目的是更改网络请求的base URL
    Taro.getApp().globalData.Http.config.root = ROOT_PATH[env]
  } catch (e) {}
}
```
