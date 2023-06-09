import { assert } from 'console'
import type { DOMWindow } from 'jsdom'
import pTimeout, { TimeoutError } from 'p-timeout'

import { Sandbox, SandboxOptions } from './sandbox.mjs'

export enum RequestErrorCodes {
  LoadError = 'LOAD_ERROR',
  Timeout = 'TIMEOUT',
}

export const RequestErrorMessages = {
  [RequestErrorCodes.LoadError]: 'Script load error',
  [RequestErrorCodes.Timeout]: 'Script load timeout',
}

export class RequestError extends Error {
  constructor(
    public code: RequestErrorCodes,
    public statusCode?: number,
    public statusText?: string,
  ) {
    super(RequestErrorMessages[code])
  }
}

export interface RemoteScriptOptions extends Omit<SandboxOptions, 'code'> {
  /**
   * 请求头
   */
  headers?: HeadersInit

  /**
   * 请求超时
   *
   * @defaultValue 3000
   */
  loadingTimeout?: number

  /**
   * 刷新间隔，单位：毫秒
   *
   * 如果设置为 0 则不刷新
   */
  refreshInterval?: number

  /**
   * 设置 false 不重试
   */
  shouldRetryOnError?: boolean

  /**
   * 错误重试间隔
   *
   * @defaultValue 5000
   */
  errorRetryInterval?: number
  /**
   * 重试次数
   */
  errorRetryCount?: number
}

export class RemoteScript<
  T extends Record<string, any> = Record<string, any>,
  U extends DOMWindow = DOMWindow & T,
> extends Sandbox<U> {
  src: string

  headers?: HeadersInit

  loadingTimeout: number

  refreshInterval: number

  shouldRetryOnError: boolean

  errorRetryInterval: number

  errorRetryCount: number

  private delayedRequest?: Promise<U>
  private lastUpdateTime?: number

  constructor(src: string, opts: RemoteScriptOptions = {}) {
    super('', opts)

    this.src = src
    this.domain = opts.domain || src
    this.headers = opts.headers
    this.loadingTimeout = opts.loadingTimeout || 3000
    this.refreshInterval = opts.refreshInterval || 0
    this.shouldRetryOnError = opts.shouldRetryOnError ?? true
    this.errorRetryInterval = opts.errorRetryInterval || 5000
    this.errorRetryCount = opts.errorRetryCount || 3
  }

  load(): Promise<U> {
    if (this.delayedRequest) return this.delayedRequest

    const refreshInterval = this.refreshInterval
    const lastUpdateTime = this.lastUpdateTime || 0
    const refreshIfInterval = refreshInterval > 0 && lastUpdateTime > 0

    if (refreshIfInterval && Date.now() - lastUpdateTime < refreshInterval) {
      if (this.window) return Promise.resolve(this.window)
    }

    return this.process()
  }

  refresh(): Promise<U> {
    if (this.delayedRequest) return this.delayedRequest

    this.lastUpdateTime = 0
    return this.load()
  }

  process(): Promise<U> {
    const delayedRequest = this.getCode().then<U>(code => {
      if (code !== this.code) {
        this.compile(code)
        this.execute()
      }

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const window = this.window!

      assert(window, 'No window')

      this.lastUpdateTime = Date.now()

      return window
    })

    delayedRequest.finally(() => {
      this.delayedRequest = undefined
    })

    this.delayedRequest = delayedRequest

    return delayedRequest
  }

  getCode(): Promise<string> {
    let retryCount = 0

    const send = (): Promise<string> => {
      return pTimeout(this.request(), {
        milliseconds: this.loadingTimeout,
        fallback: () => {
          if (this.errorRetryCount === 0) throw new TimeoutError()
          if (retryCount > this.errorRetryCount) throw new TimeoutError()

          retryCount += 1

          return pTimeout(send(), {
            milliseconds: this.errorRetryInterval,
          })
        },
      })
    }

    return send()
  }

  async request(): Promise<string> {
    const response = await fetch(this.src, { headers: this.headers })

    if (response.ok) return response.text()

    throw new RequestError(
      RequestErrorCodes.LoadError,
      response.status,
      response.statusText,
    )
  }
}
