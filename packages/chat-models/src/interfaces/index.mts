export type CreateSessionRequest = {
  prompt: string
}

export type CreateSessionResponse = {
  sessionId: string
  sessionName: string
  parentMessageId: string
}

export type CreateConversationContext = {
  sessionId: string
  parentMessageId: string
}

export interface CreateConversationRequest
  extends Partial<CreateConversationContext> {
  prompt: string
}

export interface CreateConversationResponse {
  sessionId: string
  msgId: string
  parentMessageId: string
}

export interface CreateAnswerRequest {
  sessionId: string
  msgId: string
  parentMessageId: string
  prompt: string
}

export type CreateAnswerResponse = any

export enum ChatModelFeature {
  /**
   * 聊天
   */
  Chat = 'chat',
  /**
   * 文字转图片
   */
  Text2Image = 'text2image',
  /**
   * 图片生成图片
   */
  Image2Image = 'image2image',
  /**
   * 语音合成
   */
  SpeechSynthesis = 'speechSynthesis',
}

export interface ChatModel {
  /**
   * 名称
   */
  name: string

  /**
   * 招呼语
   */
  greeting: string

  /**
   * 特性
   */
  features: ChatModelFeature[]

  /**
   * 创建对话
   * @interface
   * @param request
   * @returns
   */
  createSession(request: CreateSessionRequest): Promise<CreateSessionResponse>

  /**
   * 创建对话
   * @interface
   * @param request
   * @returns
   */
  createConversation(
    request: CreateConversationRequest,
  ): Promise<CreateConversationResponse>

  /**
   * 创建答案
   * @param request
   * @returns
   */
  createAnswer(
    request: CreateAnswerRequest,
  ): AsyncGenerator<CreateAnswerResponse, CreateAnswerResponse, unknown>
}
