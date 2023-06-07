# @chat-bots/argparse

> WIP: 请勿作为生产项目使用

聊天机器人的指令解析模块。

## 使用

```ts
import { ArgumentParser } from '@chatbot/argparse'

const parser = new ArgumentParser()

parser.parse('/imagline -s --no-progress --seed=3003 --verbose cat')
//=> ['imagline', { _: 'cat', progress: false, seed: '3003', verbose: true, s: true }]

// 非斜线开头的消息不会被解析
// 以区分普通聊天消息和指令消息
parser.parse('hello')
//=> undefined
```

## TODO

- [ ] 参数名支持驼峰转换
- [ ] 参数名支持别名
- [ ] 参数值支持类型转换
- [ ] 参数值支持数组

## License

MIT
