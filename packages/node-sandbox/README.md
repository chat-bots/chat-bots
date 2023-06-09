# @chat-bots/node-sandbox

> WIP: 请勿作为生产项目使用

在 NodeJS 中动态执行一些浏览器的脚本。

## 使用

### 安装依赖

```bash
$ npm i @chat-bots/node-sandbox -S
```

### 使用

执行本地代码

```ts
import { Sandbox } from '@chat-bots/node-sandbox'

const sandbox = new Sandbox('1 + 1')

console.log(sandbox.execute())
//=> 2
```

加载并编译远程代码

```ts
import { RemoteScript } from '@chat-bots/node-sandbox'

const script = new RemoteScript('https://example.com/script.js')

const window = await script.load()
//=> Window
```

## 感谢

以下排名不分先后.

- [jsdom](https://github.com/wechaty/wechaty)

## License

MIT
