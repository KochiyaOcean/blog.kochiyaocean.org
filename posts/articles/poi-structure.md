---
title: 简单港一下poi的结构
date: 2017-03-10 11:12:40
categories: 技术
tags: [poi, electron, react, redux, nodejs]
description: poi 的架构概述。黑历史 new generation 第一篇？
---

第一篇文章果然还是要从前代博客停止维护的直接原因（？）poi 讲起啊。

因为水平不够不确定能否讲得清楚……希望不会成为新的黑历史好了。

简单的一句话概括 poi：使用 electron 构建的跨平台舰队 collection 专用浏览器。

Github 地址在 [这里](https://github.com/poooi/poi)

### 结构概览

Electron 的进程分为两种进程：Main Process 和 Render Process。

Main Process 就是整个 Electron 的主进程，负责管理 Render Process。

Render Process 是包括各个窗口、Webview 等进程的统称。

#### Main Process

Main Process 中除了 Electron 初始化相关的各种代码，对于 poi 而言最主要的就是 Proxy 模块。Proxy 模块本身是一个 EventEmitter，其职责为截取舰娘游戏数据并发送给 Render Process。

实现大概是这样的

```js
// Emit request content
reqBody = JSON.stringify(querystring.parse(reqBody.toString()))
this.emit('network.on.request', req.method, [domain, pathname, requrl], reqBody, Date.now())
// Send request and catch response content
const [response, body] = await new Promise((promise_resolve, promise_reject) => {
  request(resolve(options), (err, res_response, res_body) => {
    if (!err) {
      promise_resolve([res_response, res_body])
    } else {
      promise_reject(err)
    }
  }).pipe(res)
})
// Parse response content
let resolvedBody = null
try {
  resolvedBody = await resolveBody(response.headers['content-encoding'], body)
} catch (e) {
  break
}
// Emit response content
if (response.statusCode == 200) {
  this.emit('network.on.response', req.method, [domain, pathname, requrl], JSON.stringify(resolvedBody), reqBody, Date.now())
} else {
  this.emit('network.error', [domain, pathname, requrl], response.statusCode)
}
```

#### Render Process

Electron 提供了 remote 模块用于简化 Render Process 和 Main Process 的通信。通过 `remote.require` 方法，可以获得和 Main Process 相同环境的模块。在 poi 的实现中，就使用此模块从 Main Process 的 Proxy 模块中获得数据。

对于数据的处理，由于使用的是 React 全家桶，故直接将其作为一个 Action dispatch 出去，由 store 变动影响渲染

```js
import { onGameRequest, onGameResponse } from 'views/redux'

// Get proxy using remote module
const proxy = remote.require('./lib/proxy')

const parseResponses = () => {
  ...
  const details = {
    method: method,
    path: path,
    body: body,
    postBody: postBody,
    time: time,
  }
  // Update redux store
  try {
    dispatch(onGameResponse(details))
  } catch (e) {
    console.error(domain, url, e.stack)
  }
  // Send a event for non-redux plugins
  const event = new CustomEvent('game.response', {
    bubbles: true,
    cancelable: true,
    detail: details,
  })
  window.dispatchEvent(event)
}

// Add eventListener to remote proxy module
const proxyListener = {
  'network.on.request': handleProxyGameOnRequest,
  'network.on.response': handleProxyGameOnResponse,
  'network.error': handleProxyNetworkError,
  'network.error.retry': handleProxyNetworkErrorRetry,
  'network.get.server': handleGetServer,
}
window.listenerStatusFlag = false
const addProxyListener = () => {
  if (!window.listenerStatusFlag) {
    window.listenerStatusFlag = true
    for (const eventName in proxyListener) {
      proxy.addListener(eventName, proxyListener[eventName])
    }
  }
}
addProxyListener()
window.addEventListener ('load', () => {
  addProxyListener()
})
window.addEventListener ('unload', () => {
  if (window.listenerStatusFlag){
    window.listenerStatusFlag = false
    for (const eventName in proxyListener) {
      proxy.removeListener(eventName, proxyListener[eventName])
    }
  }
})
```

大体上 poi 的结构是这样的

{% asset_img 1.png poi 结构图 %}

### 其他的一些东西

#### 插件系统

poi 开发组最不愿意碰的代码第一位。

插件系统受 [APM](https://github.com/atom/apm) 启发，插件的本质是一个 node module。插件分为两种：主窗口和新窗口插件，前者在 poi 主界面加载，需要 export 一个 react class 作为界面，以及可以选择 export 一个 reducer 以参与对 store 的修改。

Store 加载时预留给插件的 reducer 接口

```js
export const extendReducer = (function () {
  let _reducerExtensions = {}

  return function (key, reducer) {
    const _reducerExtensionsNew = {
      ..._reducerExtensions,
      [key]: reducer,
    }
    try {
      store.replaceReducer(reducerFactory(_reducerExtensionsNew))
      _reducerExtensions = _reducerExtensionsNew
    } catch (e) {
      console.warn(`Reducer extension ${key} is not a valid reducer`, e.stack)
    }
  }
})()
```

插件加载、卸载时处理 reducer 的相关逻辑

```js
const clearReducer = undefined
const postEnableProcess = (plugin) => {
  if (plugin.reducer) {
    try {
      // Load reducer
      extendReducer(plugin.packageName, plugin.reducer)
    } catch (e) {
      console.error(e.stack)
    }
  }
  ...
}
export function unloadPlugin(plugin) {
  ...
  // Unload reducer
  extendReducer(plugin.packageName, clearReducer)
  ...
}
```

新窗口插件的逻辑处理起来则相对简单，插件只需要提供一个 URL（可以是本地的网页） 用于加载内容即可。

对于插件的更新，poi 使用了稍微 hack 一点的方法，即通过删除 module cache 来实现 require 更新后的 module

```js
function clearPluginCache(packagePath) {
  for (const path in module._cache) {
    if (path.includes(basename(packagePath))) {
      delete module._cache[path]
    }
  }
  for (const path in module._pathCache) {
    if (path.includes(basename(packagePath))) {
      delete module._pathCache[path]
    }
  }
}
```



poi 大体上的结构就是这种情况了，希望能对开发 electron 应用的诸君有所帮助。当然如果有更好的意见也请指出。

再次碎碎念：希望这篇文章不要成为黑历史就好了……
