import {
  ConversationType,
  MessageType,
  SubscriptionEventType,
} from './constants.mjs'
import { Message } from './im/message.mjs'

export type MaybePromise<T> = T | Promise<T>

export type ImEmptyMessage = {
  msgtype: MessageType.Empty
}

export type ImTextMessage = {
  msgtype: MessageType.Text
  text: {
    content: string
  }
}

export type ImMarkdownMessage = {
  msgtype: MessageType.Markdown
  markdown: {
    title: string
    text: string
  }
}

export type ImRichSection = {
  text: string
}

export type ImRichMessage = {
  msgtype: MessageType.RichText
  content: {
    richText: ImRichSection[]
  }
}

export type ImMessagePayload =
  | ImEmptyMessage
  | ImTextMessage
  | ImMarkdownMessage
  | ImRichMessage

export type ImReplyToUsers = {
  at?: {
    isAtAll?: boolean
    atUserIds?: string[]
  }
}

export type ImMessageRequest = ImMessagePayload & ImReplyToUsers

export type ImMessageBase = {
  conversationId: string
  chatbotCorpId: string
  chatbotUserId: string
  msgId: string
  senderNick: string
  isAdmin: boolean
  senderStaffId: string
  sessionWebhookExpiredTime: number
  createAt: number
  senderCorpId: string
  conversationType: ConversationType
  senderId: string
  sessionWebhook: string
  robotCode: string
  msgtype: MessageType
}

export interface ImIndividualMessage extends ImMessageBase {
  conversationType: ConversationType.Individual
}

export interface ImRoomMessage extends ImMessageBase {
  conversationType: ConversationType.Room
  isInAtList: boolean
  atUsers: Array<{
    dingtalkId: string
  }>
  conversationTitle: string
  originalMsgId: string
}

export type ImMessage = (ImIndividualMessage | ImRoomMessage) & ImMessagePayload

export interface SubscriptionEvent {
  CorpId: string
  UserId: string[]
  EventType: SubscriptionEventType
  [key: string]: any
}

export type SubscriptionEventResponse = {
  msg_signature: string
  encrypt: string
  timeStamp: string
  nonce: string
}

export type SubscriptionEventHandler = (
  event: SubscriptionEvent,
) => MaybePromise<SubscriptionEventResponse>

export type ImMessageHandler = (
  event: Message,
  init: Record<string, string>,
) => MaybePromise<ImMessageRequest | void | undefined>

export type EventHandler = SubscriptionEventHandler | ImMessageHandler
