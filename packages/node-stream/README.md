# @chat-bots/node-stream

## 使用

### 安装依赖

```bash
$ npm i @chat-bots/node-stream -S
```

### 使用

执行本地代码

```ts
import { readResponseStream } from '@chat-bots/node-stream'

const response = await fetch('https://example.com', {
  headers: {
    Accept: 'text/event-stream',
  },
})

for await (const chunk of readResponseStream(response.body)) {
  console.log(chunk)
}
```

## License

MIT
