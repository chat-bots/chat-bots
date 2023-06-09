import assert from 'node:assert'

import {
  // @ts-ignore
  DingTalkEncryptException,
  DingTalkEncryptor,
  getRandomStr,
} from 'dingtalk-encrypt'

import type { SubscriptionEvent, SubscriptionEventResponse } from '../types.mjs'

declare interface EncryptExceptionInstance {
  code: number
  message: string
}

declare interface EncryptExceptionConstructor extends Error {
  new (code: number): EncryptExceptionInstance
}

// hack 处理类型错误
export const EncryptException =
  DingTalkEncryptException as EncryptExceptionConstructor

export interface RequestEncryptInit {
  /**
   * 随机字符串
   */
  nonce: string
  /**
   * 签名
   */
  signature: string
  /**
   * 时间戳
   */
  timestamp: string
}

export type EncryptorOptions = {
  /**
   * 应用ID
   */
  appId?: string
  /**
   * AES 对称加密密钥
   */
  aesKey?: string

  /**
   * 消息验证令牌
   */
  token?: string
}

export class Encryptor {
  aesKey: string

  token: string

  aesCipher?: DingTalkEncryptor

  constructor(options: EncryptorOptions) {
    const { appId, aesKey = '', token = '' } = options

    this.aesKey = aesKey
    this.token = token

    if (appId && aesKey) {
      this.aesCipher = new DingTalkEncryptor(token, aesKey, appId)
    }
  }

  getAesCipher() {
    const { aesCipher } = this

    assert(aesCipher, 'The parameters appId, aesKey and token are required')

    return aesCipher
  }

  /**
   * 事件解析
   * @param encrypted 加密字符串
   * @param init
   */
  parse(encrypted: string, init: RequestEncryptInit): SubscriptionEvent {
    return JSON.parse(this.decrypt(encrypted, init))
  }

  encrypt(
    text: string,
    init?: Partial<RequestEncryptInit>,
  ): SubscriptionEventResponse {
    const aesCipher = this.getAesCipher()
    const { timestamp = Date.now(), nonce = getRandomStr(16) } = init || {}

    // @ts-ignore TS 类型错误
    return aesCipher.getEncryptedMap(text, timestamp.toString(), nonce)
  }

  decrypt(encrypted: string, init: RequestEncryptInit): string {
    const aesCipher = this.getAesCipher()

    return aesCipher.getDecryptMsg(
      init.signature,
      init.timestamp.toString(),
      init.nonce,
      encrypted,
    )
  }
}
