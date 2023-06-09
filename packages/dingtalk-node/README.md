# @chat-bots/dingtalk-node

> WIP: 请勿作为生产项目使用

钉钉 NodeJS 模块。

## 安装

```bash
$ npm i @chat-bots/dingtalk-node -S
```

## 消息接收

### 与 Koa 集成

```ts
import { EventDispatcher, EventType, adaptKoa } from '@chat-bots/dingtalk-node'
// Koa 集成
import Koa from 'koa'
import { koaBody } from 'koa-body'

// 事件订阅
const eventDispatcher = new EventDispatcher({
  appId: process.env['APP_ID'],
  aesKey: process.env['AES_KEY'],
  token: process.env['TOKEN'],
})

eventDispatcher.register(EventType.ImMessage, async function (message) {
  message.reply('Hello, world!')
})

const app = new Koa()

// 前置依赖
// 用于将请求体解析为 JSON
app.use(koaBody())

app.use(adaptKoa('/v1/webhook/event', eventDispatcher))

app.listen(1245, function () {
  console.log('Listen on http://localhost:1245')
})
```

### 自定义框架集成

```ts
// 事件订阅
eventDispatcher.callEvent(
  // 请求内容
  {
    encrypt: '加密字符串',
  },
  // 请求参数
  {
    nonce: '',
    signature: '',
    timestamp: '',
  },
)

// 机器人推送的消息内容
eventDispatcher.callMessage(payload)
```

## TODO

- [ ] 支持服务 API 调用
- [ ] 支持 AccessToken 管理
- [ ] TS 类型重新设计

## 感谢

以下排名不分先后.

- [lark-node-sdk](https://github.com/larksuite/node-sdk)
- [wechaty](https://github.com/wechaty/wechaty)

## License

MIT
