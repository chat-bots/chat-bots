import Koa from 'koa'
import { koaBody } from 'koa-body'

import { EventDispatcher, EventType, adaptKoa } from '../src/index.mjs'

const app = new Koa()

app.use(koaBody())

const eventDispatcher = new EventDispatcher({
  appId: process.env['APP_ID'],
  aesKey: process.env['AES_KEY'],
  token: process.env['TOKEN'],
})

eventDispatcher.register(EventType.ImMessage, async function (message) {
  message.reply('Hello, world!')
})

app.use(adaptKoa('/v1/webhook/event', eventDispatcher))

app.listen(1245, () => {
  console.log('Listen on http://localhost:1245')
})
