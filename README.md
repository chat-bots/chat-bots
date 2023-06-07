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

### 适配器

| 名称 | 描述 | 状态 |
| @chat-bots/adapter-koa | | Ideas |
| @chat-bots/adapter-wechaty | | Ideas |

### AI 模型

| 名称                       | 描述                                     | 状态  |
| -------------------------- | ---------------------------------------- | ----- |
| @chat-bots/chat-models     | openai/bing/claude/文心一言/通义千问/... | Ideas |
| @chat-bots/imagline-models | dell-e/midjourney/stable diffusion/...   | Ideas |
| @chat-bots/tts-models      | azure/...                                | Ideas |

### 基础模块

| 名称                                                 | 描述             | 状态  |
| ---------------------------------------------------- | ---------------- | ----- |
| [@chat-bots/argparse](./packages/argparse/README.md) | 聊天指令解析模块 | Alpha |
| @chat-bots/node-stream                               |                  | Ideas |
| @chat-bots/dingtalk                                  |                  | Ideas |

## License

MIT
