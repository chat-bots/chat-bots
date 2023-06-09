/// <reference types="koa-body" />
import type { Middleware } from 'koa'

import type { EventDispatcher } from '../event/dispatcher.mjs'

export const adaptKoa = (
  path: string,
  dispatcher: EventDispatcher,
): Middleware => {
  return async (ctx, next) => {
    if (ctx.path !== path) return next()

    const payload = ctx.request.body

    // 无效调用
    if (!payload) {
      ctx.body = 'ok'
      return
    }

    ctx.body = await dispatcher.call(payload, ctx.query)
  }
}
