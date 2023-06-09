import { ConversationType, MessageType } from '../constants.mjs'
import {
  ImMarkdownMessage,
  ImMessageRequest,
  ImReplyToUsers,
  ImTextMessage,
} from '../types.mjs'
import { Sayable, Talker } from './interface.mjs'

export class MessageBuilder {
  /**
   * 对话类型
   */
  conversationType: ConversationType

  constructor(conversationType?: ConversationType) {
    this.conversationType = conversationType || ConversationType.Individual
  }

  /**
   * @param sayable
   * @param atAll
   * @param replyToUsers
   */
  createMessage(
    sayable: Sayable,
    atAll?: true | Talker,
    ...replyToUsers: Talker[]
  ): ImMessageRequest {
    if (typeof sayable === 'string') {
      return this.mentionToUsers(
        this.createTextMessage(sayable),
        atAll,
        replyToUsers,
      )
    }

    // Markdown 内容
    if ('title' in sayable) {
      return this.mentionToUsers(
        this.createMarkdownMessage(sayable.title, sayable.text),
        atAll,
        replyToUsers,
      )
    }

    if (
      sayable.msgtype === MessageType.Text ||
      sayable.msgtype === MessageType.Markdown
    ) {
      return this.mentionToUsers(sayable, atAll, replyToUsers)
    }

    return sayable
  }

  /**
   * 创建空消息
   *
   * @returns {types.EmptyMessage}
   */
  createEmptyMessage() {
    return {
      msgtype: 'empty',
    }
  }

  /**
   * 创建文本消息
   * @param content
   */
  private createTextMessage(content: string): ImTextMessage {
    return { msgtype: MessageType.Text, text: { content } }
  }

  /**
   * 创建 Markdown 消息
   * @param title
   * @param content
   */
  private createMarkdownMessage(
    title: string,
    content: string,
  ): ImMarkdownMessage {
    return { msgtype: MessageType.Markdown, markdown: { title, text: content } }
  }

  /**
   * 提及用户
   *
   * @param message
   * @param atAll
   * @param replyToUsers
   * @returns
   */
  private mentionToUsers(
    message: (ImMarkdownMessage | ImTextMessage) & ImReplyToUsers,
    atAll?: true | Talker,
    replyToUsers: Talker[] = [],
  ): ImMessageRequest {
    if (atAll == null) return message

    // 个人对话不支持提及功能
    if (this.conversationType === ConversationType.Individual) return message

    const mention = message.at || {}
    const isAtAll = mention.isAtAll === true

    if (isAtAll) return message

    if (atAll === true) {
      mention.isAtAll = true
      message.at = mention
      return message
    }

    const users = replyToUsers.concat(atAll)
    const atUserIds = mention.atUserIds || []

    if (message.msgtype === 'text') {
      message.text.content += ` ${users.map(u => `@${u.staffId}`).join(' ')}`
    } else {
      message.markdown.text += ` \n\n------\n\n ###### 此消息通知对象: ${users
        .map(u => `@${u.staffId}`)
        .join(' ')}`
    }

    message.at = {
      atUserIds: atUserIds.concat(users.map(u => u.staffId)),
      isAtAll: false,
    }

    return message
  }
}
