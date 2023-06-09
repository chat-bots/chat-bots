import { ImMarkdownMessage, ImMessageRequest } from '../types.mjs'

export type Talker = {
  /**
   * 用户ID
   *
   * @type {string}
   */
  id: string
  /**
   * 企业ID
   */
  corpId: string
  /**
   * 员工ID
   */
  staffId: string
  /**
   * 昵称
   */
  name: string
  /**
   * 是否管理员
   */
  isAdmin: boolean
}

export type Sayable = string | ImMarkdownMessage['markdown'] | ImMessageRequest
