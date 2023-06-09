import {
  ChatModel,
  ChatModelFeature,
  type CreateAnswerRequest,
  type CreateAnswerResponse,
  type CreateConversationRequest,
  type CreateConversationResponse,
  type CreateSessionRequest,
  type CreateSessionResponse,
} from '../interfaces/index.mjs'
import { sleep } from '../shared/time.mjs'
import { Client, ClientOptions } from './base.mjs'
import type {
  YiYanCreateAnswerRequest,
  YiYanCreateAnswerResponse,
  YiYanCreateConversationResponse,
  YiYanCreateSessionResponse,
} from './types.mjs'

export type AcsTokenFunction = (prompt: string) => Promise<string>

export type GenerateSignFunction = (prompt: string) => Promise<string>

export interface YiYanApiOptions extends ClientOptions {
  getSign: GenerateSignFunction
  getAcsToken: AcsTokenFunction
}

export class YiYanApi extends Client implements ChatModel {
  name = '文言一心'

  greeting = '你好，我是文心一言 ERNIE Bot。'

  features: ChatModelFeature[] = [
    ChatModelFeature.Chat,
    ChatModelFeature.Text2Image,
    ChatModelFeature.SpeechSynthesis,
  ]

  /**
   * 获取签名
   */
  getSign: GenerateSignFunction

  /**
   * 获取 Acs Token
   */
  getAcsToken: AcsTokenFunction

  constructor(opts: YiYanApiOptions) {
    super(opts)

    this.getAcsToken = opts.getAcsToken
    this.getSign = opts.getSign
  }

  /**
   * 创建对话
   * @param request
   * @returns
   */
  async createConversation(
    request: CreateConversationRequest,
  ): Promise<CreateConversationResponse> {
    const [acsToken, context] = await Promise.all([
      this.getAcsToken(request.prompt),
      this.createSession(request),
    ])

    return this.json<YiYanCreateConversationResponse>('/eb/chat/new', {
      headers: {
        ACS_TOKEN: acsToken,
      },
      body: JSON.stringify({
        sessionId: context.sessionId,
        parentChatId: context.parentMessageId || '0',
        text: request.prompt,
        code: 0,
        msg: '',
        deviceType: 'pc',
        jt: this.getSign(request.prompt),
        sign: acsToken,
        timestamp: Date.now(),
        type: 10,
      }),
    }).then<CreateConversationResponse>(res => {
      return {
        sessionId: context.sessionId,
        msgId: res.botChat.id,
        parentMessageId: res.parentChat.id,
      }
    })
  }

  /**
   * 创建答案
   * @param request
   * @returns
   */
  async *createAnswer(
    request: CreateAnswerRequest,
  ): AsyncGenerator<CreateAnswerResponse, CreateAnswerResponse, unknown> {
    const { msgId, parentMessageId } = request

    const parameters: YiYanCreateAnswerRequest = {
      chatId: msgId,
      parentChatId: parentMessageId,
      sign: await this.getAcsToken(request.prompt),
      sentenceId: 0,
      deviceType: 'pc',
      stop: 0,
      timestamp: Date.now(),
    }

    const answer: CreateAnswerResponse = {
      sessionId: request.sessionId,
      parentMessageId: parentMessageId,
      msgId: msgId,
      type: 'loading',
      content: 'Typing...',
    }

    yield answer

    try {
      // Note: 如果 8x1.2 秒后，还是没有开始生成答案就直接退出
      let retryCount = 0

      while (retryCount < 8) {
        const resp = await this.queryAnswer(parameters)

        const sentenceId = resp.sent_id
        const content = resp.content

        if (content) {
          answer.type = resp.content_type
          answer.content += resp.content

          yield answer
        }

        if (resp.is_end === 1) break

        if (sentenceId === 0) {
          await sleep(1200)
          retryCount++
        } else {
          await sleep(600)
        }

        parameters.sentenceId = sentenceId
      }

      if (answer.type === 'loading') {
        answer.type = 'error'
        answer.content = 'AI generation response timeout.'
        return answer
      }

      return answer
    } catch (ex) {
      answer.type = 'error'
      answer.content = ex.message
      return answer
    }
  }

  /**
   * 对话上下文
   * @internal
   * @param request
   * @returns
   */
  createSession(
    request: CreateConversationRequest,
  ): Promise<CreateSessionResponse> {
    if (request.sessionId) {
      return Promise.resolve<CreateSessionResponse>({
        sessionId: request.sessionId,
        sessionName: '',
        parentMessageId: request.parentMessageId || '0',
      })
    }

    return this.getSession(request).then<CreateSessionResponse>(res => ({
      sessionId: res.sessionId,
      sessionName: res.sessionName,
      parentMessageId: request.parentMessageId || '0',
    }))
  }

  getSession(
    request: CreateSessionRequest,
  ): Promise<YiYanCreateSessionResponse> {
    return this.json<YiYanCreateSessionResponse>('/eb/session/new', {
      body: JSON.stringify({
        timestamp: Date.now(),
        deviceType: 'pc',
        sessionName: request.prompt,
      }),
    })
  }

  /**
   * 查询答案
   * @internal
   * @param request
   * @returns
   */
  queryAnswer(
    request: YiYanCreateAnswerRequest,
  ): Promise<YiYanCreateAnswerResponse> {
    return this.json<YiYanCreateAnswerResponse>('/eb/chat/query', {
      headers: { ACS_TOKEN: request.sign },
      body: JSON.stringify(request),
    })
  }
}
