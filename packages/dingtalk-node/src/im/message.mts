import { ConversationType, MessageType } from '../constants.mjs'
import {
  ImMessage,
  ImMessageRequest,
  ImRichMessage,
  ImRichSection,
  ImTextMessage,
} from '../types.mjs'
import { MessageBuilder } from './builder.mjs'
import type { Sayable, Talker } from './interface.mjs'

export class MessageWebhookExpired extends Error {
  constructor(public target: Message) {
    super('Webhook 过期')
  }
}

export class Message extends MessageBuilder {
  /**
   * 消息类型
   */
  type: MessageType

  /**
   * 当前对话者
   */
  talker: Talker

  /**
   * 机器人信息
   */
  robot: {
    id: string
    code: string
    corpId: string
  }

  /**
   * 房间信息
   */
  room?: {
    id: string
    name: string
  }

  /**
   * 消息接收时间
   *
   * @type {Date}
   */
  receivedAt: Date

  /**
   * 消息创建时间
   *
   * @type {Date}
   */
  createdAt: Date

  /**
   * 原始消息内容
   */
  payload: ImMessage

  /**
   * 远程调用
   */
  webhook: {
    url: string
    expiredAt: number
  }

  /**
   * 消息文本
   */
  private _content?: string

  constructor(payload: ImMessage) {
    super(payload.conversationType)

    this.payload = payload
    this.type = payload.msgtype
    this.receivedAt = new Date(payload.createAt)
    this.createdAt = new Date()

    this.talker = {
      id: payload.senderId,
      corpId: payload.senderCorpId,
      staffId: payload.senderStaffId,
      name: payload.senderNick,
      isAdmin: payload.isAdmin,
    }

    if (payload.conversationType === ConversationType.Room) {
      this.room = {
        id: payload.conversationId,
        name: payload.conversationTitle,
      }
    }

    this.robot = {
      id: payload.chatbotUserId,
      code: payload.robotCode,
      corpId: payload.chatbotCorpId,
    }

    this.webhook = {
      url: payload.sessionWebhook,
      expiredAt: payload.sessionWebhookExpiredTime,
    }
  }

  /**
   * 缓存文本内容
   * @returns 文本内容
   */
  get content() {
    let content = this._content
    if (content == null) {
      content = this.text()
      return content
    }

    return content
  }

  set content(value: string) {
    this._content = value
  }

  /**
   * 文本内容
   */
  text(): string {
    if (this.type === MessageType.Text) {
      const message = this.payload as ImTextMessage
      return message.text.content.trim()
    }

    const sections = this.richText()
    const chunks: string[] = []

    for (const section of sections) {
      const text = section.text
      if (text) {
        chunks.push(text.trim())
      }
    }

    return chunks.join('\n')
  }

  /**
   * 富文本内容
   */
  richText(): ImRichSection[] {
    if (this.type === MessageType.RichText) {
      const message = this.payload as ImRichMessage
      return message.content.richText
    }

    return []
  }

  /**
   * 获取内容
   *
   * @param sayable
   */
  reply(sayable: Sayable) {
    return this.sendMessage(this.createMessage(sayable, this.talker))
  }

  /**
   * 打招呼
   *
   * @param sayable
   * @param atAll
   * @param replyToUsers
   */
  say(sayable: Sayable, atAll?: true | Talker, ...replyToUsers: Talker[]) {
    return this.sendMessage(this.createMessage(sayable, atAll, ...replyToUsers))
  }

  /**
   * 发送消息
   *
   * @param message
   */
  sendMessage(message: ImMessageRequest) {
    const { url, expiredAt } = this.webhook
    if (Date.now() > expiredAt) throw new MessageWebhookExpired(this)

    return fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    }).then(res => res.json())
  }
}
