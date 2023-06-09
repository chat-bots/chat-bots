import type { YiYanResponseWithData } from './types.mjs'

export interface ClientOptions {
  basePath?: string
  cookie: string
}

const BASE_URL = 'https://yiyan.baidu.com'

function toJson<T>(response: Response): Promise<T> {
  return response.json().then<T>((resp: YiYanResponseWithData<T>) => {
    if (resp.code === 0) return resp.data
    return Promise.reject(new Error(resp.msg || 'Unknown error'))
  })
}

export class Client {
  headers: Record<string, string>

  basePath: string

  constructor(opts: ClientOptions) {
    this.basePath = opts.basePath || BASE_URL
    this.headers = {
      accept: ' */*, text/plain',
      'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8',
      'accept-encoding': 'gzip, deflate, br',
      'content-type': 'application/json',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-origin',
      'Sec-Ch-Ua-Mobile': '?0',
      'Sec-Ch-Ua-Platform': 'macOS',
      'user-agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36',
      cookie: opts.cookie || '',
    }
  }

  toURL(path: string | URL): URL {
    return new URL(path, this.basePath)
  }

  json<T>(path: string | URL, init?: RequestInit): Promise<T> {
    return this.request(path, { method: 'POST', ...init }).then<T>(toJson)
  }

  request(path: string | URL, init?: RequestInit): Promise<Response> {
    return fetch(this.toURL(path), {
      ...init,
      referrer: this.basePath,
      referrerPolicy: 'strict-origin-when-cross-origin',
      headers: {
        ...this.headers,
        ...init?.headers,
      },
    }).then(res => {
      if (res.status >= 200 && res.status < 300) return res
      return Promise.reject(new RequestError(res.status, res.statusText))
    })
  }
}

export class RequestError extends Error {
  constructor(public statusCode: number, public statusText: string) {
    super(`Fetch fail: ${statusCode} ${statusText}`)
    this.name = 'RequestError'
  }
}
