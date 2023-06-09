# ChatBots 多平台聊天机器人

> WIP: 请勿作为生产项目使用

项目初衷: 打算将我目前不熟悉，或不会的技术一股脑的都试试。

## 启动项目

你需要安装 [nodejs >= 18](https://nodejs.org) 和 [pnpm](https://pnpm.io/)。

```bash
# 安装依赖
$ pnpm install

# 进入项目
$ pnpm dev
```

## 模块设计

### 服务

| 名称                       | 描述       | 状态  |
| -------------------------- | ---------- | ----- |
| @chat-bots/api-gateway     | 对外服务   | Ideas |
| @chat-bots/apikey-service  | 密钥管理   | Ideas |
| @chat-bots/message-service | 消息处理   | Ideas |
| @chat-bots/wechaty-service | 微信机器人 | Ideas |

### AI 模型

| 名称                                                       | 描述                                     | 状态  |
| ---------------------------------------------------------- | ---------------------------------------- | ----- |
| [@chat-bots/chat-models](./packages/chat-models/README.md) | openai/bing/claude/文心一言/通义千问/... | WIP   |
| @chat-bots/imagline-models                                 | dell-e/midjourney/stable diffusion/...   | Ideas |
| @chat-bots/tts-models                                      | azure/...                                | Ideas |

### 基础模块

| 名称                                                           | 描述                                                | 状态  |
| -------------------------------------------------------------- | --------------------------------------------------- | ----- |
| [@chat-bots/argparse](./packages/argparse/README.md)           | 聊天指令解析模块                                    | Alpha |
| [@chat-bots/dingtalk-node](./packages/dingtalk-node/README.md) | 钉钉 SDK                                            | Alpha |
| [@chat-bots/node-sandbox](./packages/node-sandbox/README.md)   | 在 Node.js 中动态执行浏览器的脚本                   | Alpha |
| [@chat-bots/node-stream ](./packages/node-sandbox/README.md)   | 处理 Node.js 中 Node 标准流和 W3C 的 ReadableStream | Alpha |

## 声明

1. 本项目不提供一切破解或类似非法的手段，仅提供 API 封装
2. 对因使用本项目而导致的任何损失，本人概不负责
3. 本项目仅供学习交流使用，不得用于商业用途
4. 当你使用本项目时，即代表你同意上述条款

## License

MIT
