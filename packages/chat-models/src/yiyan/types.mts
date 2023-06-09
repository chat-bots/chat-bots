import type { CreateConversationRequest } from '../interfaces/index.mjs'

export interface YiYanResponse {
  code: number
  logId: string
  msg: string
}

export type YiYanResponseWithData<T = unknown> = YiYanResponse & { data: T }

export type YiYanCreateSessionResponse = {
  sessionId: string
  sessionName: string
}

export type YiYanCreateConversationRequest = Required<CreateConversationRequest>

export interface YiYanConversationResponseInner<Type extends 'user' | 'robot'> {
  id: string
  type: Type
  mode: string
  user: string
  role: string
  parent: string
  createTime: string
  message: any[]
  stop: number | null
  style: number
  isSafe: 0 | 1
  showWarning: number
  errMessage: string | null
  wordGengStatus: boolean
}

export interface YiYanCreateConversationResponse {
  chat: YiYanConversationResponseInner<'user'>
  parentChat: YiYanConversationResponseInner<'robot'>
  botChat: YiYanConversationResponseInner<'robot'>
  isBanned: boolean
  popReminder: boolean
  sessionBan: boolean
}

export interface YiYanCreateAnswerRequest {
  chatId: string
  parentChatId: string
  sentenceId: number
  sign: string
  deviceType?: string
  stop?: number
  timestamp?: number
}

// TODO 需要注意文心一言未来类型的变化
export interface YiYanCreateAnswerResponse {
  content_type: 'text' | 'audio'
  content: string
  text: string
  sent_id: number
  is_end: 0 | 1
  wordGengStatus: boolean
  stop: number
}
