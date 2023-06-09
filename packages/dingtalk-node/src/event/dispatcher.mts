import { assert } from 'console'
import debugLog from 'debug'

import { EventType, MessageType, SubscriptionEventType } from '../constants.mjs'
import { Message } from '../im/message.mjs'
import type {
  EventHandler,
  ImMessage,
  ImMessageHandler,
  ImMessageRequest,
  SubscriptionEventHandler,
  SubscriptionEventResponse,
} from '../types.mjs'
import {
  EncryptException,
  Encryptor,
  type EncryptorOptions,
  type RequestEncryptInit,
} from './encryptor.mjs'

const debug = debugLog('event-dispatcher')

export type EventInit = RequestEncryptInit

export type EventPayload = {
  encrypt: string
}

export type EventHandlers = {
  [EventType.CheckURL]: SubscriptionEventHandler
  [EventType.Listen]: SubscriptionEventHandler
  [EventType.ImMessage]: ImMessageHandler
  [key: string]: EventHandler
}

export type EventMap = Map<
  keyof EventHandlers,
  EventHandlers[keyof EventHandlers]
>

export interface EventDispatcherInit extends EncryptorOptions {
  handlers?: Array<
    readonly [keyof EventHandlers, EventHandlers[keyof EventHandlers]]
  >
}

export class EventDispatcher {
  encryptor: Encryptor

  handles: EventMap

  constructor(init: EventDispatcherInit) {
    const { handlers = [] } = init

    this.encryptor = new Encryptor(init)
    this.handles = new Map<
      keyof EventHandlers,
      EventHandlers[keyof EventHandlers]
    >(handlers)
  }

  register<K extends EventType>(name: K, handler: EventHandlers[K]): this
  register(name: string, handler: EventHandler): this {
    const handles = this.handles

    assert(handles.has(name), `already has ${name} handle`)

    handles.set(name, handler)

    return this
  }

  unregister<K extends keyof EventHandlers>(name: K): this
  unregister(name: string) {
    const handles = this.handles

    if (handles.has(name)) handles.delete(name)

    return this
  }

  get<K extends keyof EventHandlers>(name: K): EventHandlers[K] | undefined
  get(name: string): EventHandler | undefined {
    return this.handles.get(name)
  }

  async call(payload: Record<string, unknown>, init: unknown) {
    if (payload['encrypt']) {
      return this.callEvent(payload as EventPayload, init as EventInit)
    }

    return this.callMessage(
      payload as unknown as ImMessage,
      (init || {}) as Record<string, string>,
    )
  }

  async callMessage(
    payload: ImMessage,
    init: Record<string, string>,
  ): Promise<ImMessageRequest> {
    const handle = this.get(EventType.ImMessage)

    if (handle) {
      return Promise.resolve(handle(new Message(payload), init)).then(msg => {
        return msg || { msgtype: MessageType.Empty }
      })
    }

    debug(`no message handle`)
    return {
      msgtype: MessageType.Empty,
    }
  }

  async callEvent(
    payload: EventPayload,
    init: EventInit,
  ): Promise<SubscriptionEventResponse> {
    const { encryptor } = this
    const event = encryptor.parse(payload.encrypt, init)
    const eventType = event.EventType

    // Note: 如果是验证 URL，直接返回 success
    // See https://open.dingtalk.com/document/orgapp/configure-event-subcription
    if (SubscriptionEventType.CheckURL === event.EventType) {
      return this.encrypt('success')
    }

    const handle = this.handles.get(eventType) as SubscriptionEventHandler
    if (!handle) {
      debug(`no ${eventType} handle`)
      return this.encrypt(`no ${eventType} handle`)
    }

    try {
      const ret = await handle(event)

      debug(`execute ${eventType} handle`)

      return this.encrypt(JSON.stringify(ret))
    } catch (ex) {
      if (ex instanceof EncryptException) {
        return this.encrypt(ex.toString())
      }

      console.error(`execute ${eventType} handle error: ${ex.message}`)
      return this.encrypt(`execute ${eventType} handle error`)
    }
  }

  encrypt(text: string) {
    return this.encryptor.encrypt(text)
  }
}
